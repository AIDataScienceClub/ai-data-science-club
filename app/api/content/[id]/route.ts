import { NextRequest, NextResponse } from 'next/server'
import { readFile, writeFile } from 'fs/promises'
import path from 'path'
import { isAuthenticated, unauthorizedResponse } from '@/lib/auth'
import { saveDataToBlob, loadDataFromBlob, isVercelEnvironment } from '@/lib/blob-storage'

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
    const blobData = await loadDataFromBlob<EventsData>(DATA_FILENAME)
    if (blobData) return blobData
  }
  
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
    await saveDataToBlob(DATA_FILENAME, data)
  } else {
    const dataPath = path.join(process.cwd(), 'data', 'events.json')
    await writeFile(dataPath, JSON.stringify(data, null, 2))
  }
}

// GET - fetch a single item
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await readEventsData()
    
    // Search in both events and gallery
    const item = [...data.events, ...data.gallery].find(
      (item: ContentItem) => item.id === params.id
    )
    
    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 })
    }
    
    return NextResponse.json(item)
  } catch (error) {
    console.error('GET error:', error)
    return NextResponse.json({ error: 'Failed to fetch item' }, { status: 500 })
  }
}

// PUT - update an item
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Check authentication
  if (!isAuthenticated(request)) {
    return unauthorizedResponse()
  }
  
  try {
    const updates = await request.json()
    const data = await readEventsData()
    
    // Find and update in events
    let found = false
    data.events = data.events.map((item: ContentItem) => {
      if (item.id === params.id) {
        found = true
        return { ...item, ...updates, id: item.id } // Preserve ID
      }
      return item
    })
    
    // If not found in events, check gallery
    if (!found) {
      data.gallery = data.gallery.map((item: ContentItem) => {
        if (item.id === params.id) {
          found = true
          return { ...item, ...updates, id: item.id }
        }
        return item
      })
    }
    
    if (!found) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 })
    }
    
    // Save updated data
    await writeEventsData(data)
    
    return NextResponse.json({ success: true, message: 'Item updated' })
  } catch (error) {
    console.error('Update error:', error)
    return NextResponse.json({ error: 'Failed to update item' }, { status: 500 })
  }
}

// DELETE - remove an item
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Check authentication
  if (!isAuthenticated(request)) {
    return unauthorizedResponse()
  }
  
  try {
    const data = await readEventsData()
    
    const eventsLength = data.events.length
    const galleryLength = data.gallery.length
    
    data.events = data.events.filter((item: ContentItem) => item.id !== params.id)
    data.gallery = data.gallery.filter((item: ContentItem) => item.id !== params.id)
    
    if (data.events.length === eventsLength && data.gallery.length === galleryLength) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 })
    }
    
    await writeEventsData(data)
    
    return NextResponse.json({ success: true, message: 'Item deleted' })
  } catch (error) {
    console.error('Delete error:', error)
    return NextResponse.json({ error: 'Failed to delete item' }, { status: 500 })
  }
}
