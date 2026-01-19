import { NextRequest, NextResponse } from 'next/server'
import { readFile, writeFile } from 'fs/promises'
import path from 'path'
import { isAuthenticated, unauthorizedResponse } from '@/lib/auth'

const dataPath = path.join(process.cwd(), 'data', 'pages.json')

// GET - Fetch all page content or specific page
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = searchParams.get('page')
    
    const fileContent = await readFile(dataPath, 'utf-8')
    const data = JSON.parse(fileContent)
    
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
  // Check authentication
  if (!await isAuthenticated()) {
    return unauthorizedResponse()
  }

  try {
    const updates = await request.json()
    const { page, section, data: newData } = updates
    
    const fileContent = await readFile(dataPath, 'utf-8')
    const allData = JSON.parse(fileContent)
    
    if (!allData[page]) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 })
    }
    
    if (section) {
      // Update specific section
      allData[page][section] = newData
    } else {
      // Update entire page
      allData[page] = newData
    }
    
    await writeFile(dataPath, JSON.stringify(allData, null, 2))
    
    return NextResponse.json({ success: true, data: allData[page] })
  } catch (error) {
    console.error('Error updating page content:', error)
    return NextResponse.json({ error: 'Failed to update page content' }, { status: 500 })
  }
}
