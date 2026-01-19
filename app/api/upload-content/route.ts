import { NextRequest, NextResponse } from 'next/server'
import { writeFile, readFile, mkdir } from 'fs/promises'
import path from 'path'
import { existsSync } from 'fs'
import { isAuthenticated, unauthorizedResponse } from '@/lib/auth'

interface ContentItem {
  id: string
  category: string
  title: string
  description: string
  date: string
  time?: string
  location?: string
  audience?: string
  tags: string[]
  image: string | null
  featured: boolean
  createdAt: string
  aiGenerated: boolean
}

interface EventsData {
  events: ContentItem[]
  gallery: ContentItem[]
}

export async function POST(request: NextRequest) {
  // Check authentication
  if (!await isAuthenticated()) {
    return unauthorizedResponse()
  }

  try {
    const formData = await request.formData()
    
    // Get the content data
    const contentDataStr = formData.get('contentData') as string
    const imageFile = formData.get('image') as File | null
    
    if (!contentDataStr) {
      return NextResponse.json({ error: 'No content data provided' }, { status: 400 })
    }

    const contentData = JSON.parse(contentDataStr)
    
    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', contentData.category)
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true })
    }

    // Save image if provided
    let imagePath: string | null = null
    if (imageFile) {
      const timestamp = Date.now()
      const safeName = imageFile.name.replace(/[^a-zA-Z0-9.-]/g, '_')
      const filename = `${timestamp}-${safeName}`
      const filepath = path.join(uploadsDir, filename)
      
      const bytes = await imageFile.arrayBuffer()
      await writeFile(filepath, Buffer.from(bytes))
      
      imagePath = `/uploads/${contentData.category}/${filename}`
    }

    // Read existing data
    const dataPath = path.join(process.cwd(), 'data', 'events.json')
    let existingData: EventsData = { events: [], gallery: [] }
    
    try {
      const fileContent = await readFile(dataPath, 'utf-8')
      existingData = JSON.parse(fileContent)
    } catch {
      // File doesn't exist, use default
    }

    // Create new content item
    const newItem: ContentItem = {
      id: `${Date.now()}`,
      category: contentData.category,
      title: contentData.title,
      description: contentData.description,
      date: contentData.date || new Date().toLocaleDateString('en-US', { 
        month: 'long', 
        day: 'numeric', 
        year: 'numeric' 
      }),
      time: contentData.time || '',
      location: contentData.location || 'TBD',
      audience: contentData.audience || 'All members',
      tags: contentData.tags || [],
      image: imagePath,
      featured: contentData.featured || false,
      createdAt: new Date().toISOString(),
      aiGenerated: true
    }

    // Add to appropriate array based on category
    if (contentData.category === 'events') {
      existingData.events.push(newItem)
    } else {
      existingData.gallery.push(newItem)
    }

    // Save updated data
    await writeFile(dataPath, JSON.stringify(existingData, null, 2))

    return NextResponse.json({
      success: true,
      item: newItem,
      message: `Content added to ${contentData.category}`
    })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ 
      error: 'Failed to save content',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// GET endpoint to fetch all content
export async function GET() {
  try {
    const dataPath = path.join(process.cwd(), 'data', 'events.json')
    const fileContent = await readFile(dataPath, 'utf-8')
    const data = JSON.parse(fileContent)
    
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ events: [], gallery: [] })
  }
}
