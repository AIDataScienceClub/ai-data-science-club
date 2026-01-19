import { NextRequest, NextResponse } from 'next/server'
import { DefaultAzureCredential } from '@azure/identity'
import { readFile, writeFile } from 'fs/promises'
import path from 'path'

// Azure OpenAI configuration from environment
const AZURE_ENDPOINT = process.env.AZURE_EXISTING_AIPROJECT_ENDPOINT || process.env.AZURE_OPENAI_ENDPOINT
const AZURE_DEPLOYMENT = process.env.AZURE_OPENAI_DEPLOYMENT || 'gpt-4o'
const AZURE_API_VERSION = process.env.AZURE_OPENAI_API_VERSION || '2025-01-01-preview'

// Get Azure AD token for authentication
async function getAzureToken(): Promise<string> {
  const credential = new DefaultAzureCredential()
  const tokenResponse = await credential.getToken('https://cognitiveservices.azure.com/.default')
  return tokenResponse.token
}

interface ClassInfo {
  classNumber: number
  title: string
  date: string
  time?: string
  description: string
  topics: string[]
}

interface ScheduleAnalysis {
  isSchedule: true
  courseName: string
  classes: ClassInfo[]
  location?: string
  instructor?: string
}

interface SingleEventAnalysis {
  isSchedule: false
  category: 'events' | 'projects' | 'about' | 'impact'
  title: string
  description: string
  suggestedDate: string | null
  tags: string[]
  audience: string
  confidence: number
  relatedTo?: string // e.g., "Class 1: What is Data Science"
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('image') as File
    
    if (!file) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 })
    }

    // Convert image to base64
    const bytes = await file.arrayBuffer()
    const base64Image = Buffer.from(bytes).toString('base64')
    const mimeType = file.type || 'image/jpeg'

    // Get Azure AD token
    const accessToken = await getAzureToken()

    // Call Azure OpenAI with vision capabilities using Bearer token
    const endpoint = AZURE_ENDPOINT?.replace(/\/$/, '')
    const response = await fetch(`${endpoint}/openai/deployments/${AZURE_DEPLOYMENT}/chat/completions?api-version=${AZURE_API_VERSION}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'system',
            content: `You are a content manager for Atlanta AI & Data Lab, a student-led AI club.

Analyze images and determine:
1. If it's a SCHEDULE/CURRICULUM with multiple classes/sessions, extract ALL classes as separate events
2. If it's a PHOTO from an event, categorize it appropriately

For SCHEDULE images (text with class listings), return:
{
  "isSchedule": true,
  "courseName": "Name of the course/program",
  "instructor": "Instructor name if visible",
  "location": "Zoom/Location if mentioned",
  "classes": [
    {
      "classNumber": 1,
      "title": "Class title",
      "date": "Date in Month Day, Year format",
      "time": "Time if shown",
      "description": "Brief description of what will be covered",
      "topics": ["topic1", "topic2"]
    }
  ]
}

For PHOTO images, return:
{
  "isSchedule": false,
  "category": "events|projects|about|impact",
  "title": "Short descriptive title",
  "description": "2-3 sentence description",
  "suggestedDate": "Month Day, Year or null",
  "tags": ["tag1", "tag2"],
  "audience": "Who would be interested",
  "confidence": 0.0-1.0,
  "relatedTo": "If this appears to be from a specific class, mention it e.g. 'Class 1: What is Data Science'"
}

Return ONLY valid JSON with no markdown.`
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Analyze this image. If it contains a schedule or curriculum with multiple classes, extract each class as a separate item. If it\'s a photo, categorize it.'
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:${mimeType};base64,${base64Image}`
                }
              }
            ]
          }
        ],
        max_tokens: 2000,
        temperature: 0.3
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Azure OpenAI Error:', errorText)
      return NextResponse.json({ 
        error: 'AI analysis failed', 
        details: errorText 
      }, { status: 500 })
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content

    if (!content) {
      return NextResponse.json({ error: 'No analysis returned' }, { status: 500 })
    }

    // Parse the JSON response
    let analysis: ScheduleAnalysis | SingleEventAnalysis
    try {
      const cleanedContent = content.replace(/```json\n?|\n?```/g, '').trim()
      analysis = JSON.parse(cleanedContent)
    } catch (parseError) {
      console.error('Failed to parse AI response:', content)
      return NextResponse.json({ 
        error: 'Failed to parse AI response',
        rawResponse: content 
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      analysis,
      filename: file.name,
      size: file.size,
      type: file.type
    })

  } catch (error) {
    console.error('Analysis error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
