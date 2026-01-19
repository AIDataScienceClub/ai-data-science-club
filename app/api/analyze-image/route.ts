import { NextRequest, NextResponse } from 'next/server'
import { DefaultAzureCredential } from '@azure/identity'

// Azure OpenAI configuration from environment
const AZURE_ENDPOINT = process.env.AZURE_EXISTING_AIPROJECT_ENDPOINT || process.env.AZURE_OPENAI_ENDPOINT
const AZURE_DEPLOYMENT = process.env.AZURE_OPENAI_DEPLOYMENT || 'gpt-4o'
const AZURE_API_VERSION = process.env.AZURE_OPENAI_API_VERSION || '2025-01-01-preview'
const AZURE_API_KEY = process.env.AZURE_OPENAI_API_KEY // Optional: for Vercel deployment

interface AnalysisResult {
  category: 'events' | 'projects' | 'about' | 'impact'
  title: string
  description: string
  suggestedDate: string | null
  tags: string[]
  audience: string
  confidence: number
}

// Get authentication header - uses API key if available, otherwise Azure AD token
async function getAuthHeaders(): Promise<Record<string, string>> {
  // If API key is provided (e.g., on Vercel), use it
  if (AZURE_API_KEY) {
    return {
      'Content-Type': 'application/json',
      'api-key': AZURE_API_KEY,
    }
  }
  
  // Otherwise, use Azure AD authentication (local development)
  const credential = new DefaultAzureCredential()
  const tokenResponse = await credential.getToken('https://cognitiveservices.azure.com/.default')
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${tokenResponse.token}`,
  }
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

    // Get authentication headers (API key or Azure AD token)
    const authHeaders = await getAuthHeaders()

    // Call Azure OpenAI with vision capabilities
    const endpoint = AZURE_ENDPOINT?.replace(/\/$/, '') // Remove trailing slash if present
    const response = await fetch(`${endpoint}/openai/deployments/${AZURE_DEPLOYMENT}/chat/completions?api-version=${AZURE_API_VERSION}`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        messages: [
          {
            role: 'system',
            content: `You are a content manager for Atlanta AI & Data Lab, a student-led AI club for high schoolers.
            
Analyze images and determine where they belong on the website. Return ONLY valid JSON with no markdown.

Categories:
- "events": Workshop photos, meetups, presentations, group activities
- "projects": Project demos, coding sessions, technical work, hackathons
- "about": Team photos, headshots, office/space photos
- "impact": Before/after comparisons, community engagement, success stories

Always respond with this exact JSON structure:
{
  "category": "events|projects|about|impact",
  "title": "Short descriptive title (5-8 words)",
  "description": "2-3 sentences describing what's shown, suitable for a website caption",
  "suggestedDate": "Month Day, Year format if visible/inferable, otherwise null",
  "tags": ["tag1", "tag2", "tag3"],
  "audience": "Who would be interested in this content",
  "confidence": 0.0-1.0
}`
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Analyze this image for the Atlanta AI & Data Lab website. Determine the best category and generate appropriate metadata.'
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
        max_tokens: 500,
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
    let analysis: AnalysisResult
    try {
      // Remove potential markdown code blocks
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
