import { NextRequest, NextResponse } from 'next/server'
import { readFile, writeFile } from 'fs/promises'
import path from 'path'

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

// GET - fetch a single item
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const dataPath = path.join(process.cwd(), 'data', 'events.json')
    const fileContent = await readFile(dataPath, 'utf-8')
    const data = JSON.parse(fileContent)
    
    // Search in both events and gallery
    const item = [...data.events, ...data.gallery].find(
      (item: ContentItem) => item.id === params.id
    )
    
    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 })
    }
    
    return NextResponse.json(item)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch item' }, { status: 500 })
  }
}

// PUT - update an item
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const updates = await request.json()
    const dataPath = path.join(process.cwd(), 'data', 'events.json')
    const fileContent = await readFile(dataPath, 'utf-8')
    const data = JSON.parse(fileContent)
    
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
    await writeFile(dataPath, JSON.stringify(data, null, 2))
    
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
  try {
    const dataPath = path.join(process.cwd(), 'data', 'events.json')
    const fileContent = await readFile(dataPath, 'utf-8')
    const data = JSON.parse(fileContent)
    
    const eventsLength = data.events.length
    const galleryLength = data.gallery.length
    
    data.events = data.events.filter((item: ContentItem) => item.id !== params.id)
    data.gallery = data.gallery.filter((item: ContentItem) => item.id !== params.id)
    
    if (data.events.length === eventsLength && data.gallery.length === galleryLength) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 })
    }
    
    await writeFile(dataPath, JSON.stringify(data, null, 2))
    
    return NextResponse.json({ success: true, message: 'Item deleted' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete item' }, { status: 500 })
  }
}
