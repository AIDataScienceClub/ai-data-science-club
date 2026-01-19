import { NextRequest, NextResponse } from 'next/server'
import { writeFile, readFile, mkdir } from 'fs/promises'
import path from 'path'
import { existsSync } from 'fs'
import { isAuthenticated, unauthorizedResponse } from '@/lib/auth'
import { uploadImageToBlob, saveDataToBlob, loadDataFromBlob, isVercelEnvironment } from '@/lib/blob-storage'

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

const DATA_FILENAME = 'events.json'

// Helper to read events data
async function readEventsData(): Promise<EventsData> {
  const defaultData: EventsData = { events: [], gallery: [] }
  
  if (isVercelEnvironment()) {
    // Try to load from blob first
    const blobData = await loadDataFromBlob<EventsData>(DATA_FILENAME)
    if (blobData) return blobData
  }
  
  // Fall back to local file
  try {
    const dataPath = path.join(process.cwd(), 'data', 'events.json')
    const fileContent = await readFile(dataPath, 'utf-8')
    return JSON.parse(fileContent)
  } catch {
    return defaultData
  }
}

// Helper to write events data
async function writeEventsData(data: EventsData): Promise<void> {
  if (isVercelEnvironment()) {
    // Save to blob storage
    await saveDataToBlob(DATA_FILENAME, data)
  } else {
    // Save to local file
    const dataPath = path.join(process.cwd(), 'data', 'events.json')
    await writeFile(dataPath, JSON.stringify(data, null, 2))
  }
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
    
    // Save image
    let imagePath: string | null = null
    if (imageFile) {
      if (isVercelEnvironment()) {
        // Upload to Vercel Blob
        imagePath = await uploadImageToBlob(imageFile, contentData.category)
      } else {
        // Save locally
        const uploadsDir = path.join(process.cwd(), 'public', 'uploads', contentData.category)
        if (!existsSync(uploadsDir)) {
          await mkdir(uploadsDir, { recursive: true })
        }
        
        const timestamp = Date.now()
        const safeName = imageFile.name.replace(/[^a-zA-Z0-9.-]/g, '_')
        const filename = `${timestamp}-${safeName}`
        const filepath = path.join(uploadsDir, filename)
        
        const bytes = await imageFile.arrayBuffer()
        await writeFile(filepath, Buffer.from(bytes))
        
        imagePath = `/uploads/${contentData.category}/${filename}`
      }
    }

    // Read existing data
    const existingData = await readEventsData()

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
    await writeEventsData(existingData)

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
    const data = await readEventsData()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ events: [], gallery: [] })
  }
}

// DELETE endpoint to remove content
export async function DELETE(request: NextRequest) {
  if (!await isAuthenticated()) {
    return unauthorizedResponse()
  }

  try {
    const { id, category } = await request.json()
    
    const existingData = await readEventsData()
    
    if (category === 'events') {
      existingData.events = existingData.events.filter(item => item.id !== id)
    } else {
      existingData.gallery = existingData.gallery.filter(item => item.id !== id)
    }
    
    await writeEventsData(existingData)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 })
  }
}

// PUT endpoint to update content
export async function PUT(request: NextRequest) {
  if (!await isAuthenticated()) {
    return unauthorizedResponse()
  }

  try {
    const formData = await request.formData()
    const contentDataStr = formData.get('contentData') as string
    const imageFile = formData.get('image') as File | null
    
    if (!contentDataStr) {
      return NextResponse.json({ error: 'No content data provided' }, { status: 400 })
    }

    const contentData = JSON.parse(contentDataStr)
    const existingData = await readEventsData()
    
    // Handle image upload if new image provided
    let imagePath = contentData.image
    if (imageFile) {
      if (isVercelEnvironment()) {
        imagePath = await uploadImageToBlob(imageFile, contentData.category)
      } else {
        const uploadsDir = path.join(process.cwd(), 'public', 'uploads', contentData.category)
        if (!existsSync(uploadsDir)) {
          await mkdir(uploadsDir, { recursive: true })
        }
        
        const timestamp = Date.now()
        const safeName = imageFile.name.replace(/[^a-zA-Z0-9.-]/g, '_')
        const filename = `${timestamp}-${safeName}`
        const filepath = path.join(uploadsDir, filename)
        
        const bytes = await imageFile.arrayBuffer()
        await writeFile(filepath, Buffer.from(bytes))
        
        imagePath = `/uploads/${contentData.category}/${filename}`
      }
    }
    
    // Update the item
    const updateItem = (items: ContentItem[]) => {
      const index = items.findIndex(item => item.id === contentData.id)
      if (index !== -1) {
        items[index] = { ...items[index], ...contentData, image: imagePath }
      }
      return items
    }
    
    if (contentData.category === 'events') {
      existingData.events = updateItem(existingData.events)
    } else {
      existingData.gallery = updateItem(existingData.gallery)
    }
    
    await writeEventsData(existingData)
    
    return NextResponse.json({ success: true, image: imagePath })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
  }
}
