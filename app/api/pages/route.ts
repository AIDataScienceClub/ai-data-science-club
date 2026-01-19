import { NextRequest, NextResponse } from 'next/server'
import { readFile, writeFile } from 'fs/promises'
import path from 'path'
import { isAuthenticated, unauthorizedResponse } from '@/lib/auth'
import { saveDataToBlob, loadDataFromBlob, isVercelEnvironment } from '@/lib/blob-storage'

const DATA_FILENAME = 'pages.json'

// Helper to read pages data
async function readPagesData(): Promise<Record<string, unknown>> {
  if (isVercelEnvironment()) {
    const blobData = await loadDataFromBlob<Record<string, unknown>>(DATA_FILENAME)
    if (blobData) return blobData
  }
  
  try {
    const dataPath = path.join(process.cwd(), 'data', 'pages.json')
    const fileContent = await readFile(dataPath, 'utf-8')
    return JSON.parse(fileContent)
  } catch {
    return {}
  }
}

// Helper to write pages data
async function writePagesData(data: Record<string, unknown>): Promise<void> {
  if (isVercelEnvironment()) {
    await saveDataToBlob(DATA_FILENAME, data)
  } else {
    const dataPath = path.join(process.cwd(), 'data', 'pages.json')
    await writeFile(dataPath, JSON.stringify(data, null, 2))
  }
}

// GET - Fetch all page content or specific page
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = searchParams.get('page')
    
    const data = await readPagesData()
    
    if (page && data[page]) {
      return NextResponse.json({ [page]: data[page] })
    }
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error reading pages data:', error)
    return NextResponse.json({ error: 'Failed to load page content' }, { status: 500 })
  }
}

// PUT - Update page content
export async function PUT(request: NextRequest) {
  if (!await isAuthenticated()) {
    return unauthorizedResponse()
  }

  try {
    const updates = await request.json()
    const { page, section, data: newData } = updates
    
    const allData = await readPagesData()
    
    if (!allData[page]) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 })
    }
    
    if (section) {
      // Update specific section
      (allData[page] as Record<string, unknown>)[section] = newData
    } else {
      // Update entire page
      allData[page] = newData
    }
    
    await writePagesData(allData)
    
    return NextResponse.json({ success: true, data: allData[page] })
  } catch (error) {
    console.error('Error updating page content:', error)
    return NextResponse.json({ error: 'Failed to update page content' }, { status: 500 })
  }
}
