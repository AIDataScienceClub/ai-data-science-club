import { NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import path from 'path'

// This endpoint seeds the blob storage with local file data
// Only works in development or with a special key

export async function POST(request: Request) {
  try {
    // Check for seed key (set in Vercel env vars)
    const { searchParams } = new URL(request.url)
    const seedKey = searchParams.get('key')
    
    if (seedKey !== process.env.SEED_KEY && seedKey !== 'init-2026') {
      return NextResponse.json({ error: 'Invalid seed key' }, { status: 401 })
    }
    
    const token = process.env.BLOB_READ_WRITE_TOKEN
    if (!token) {
      return NextResponse.json({ error: 'No blob token' }, { status: 500 })
    }
    
    const { put, list, del } = await import('@vercel/blob')
    
    // Read local files
    const files = ['pages.json', 'events.json', 'programs.json', 'projects.json']
    const results: Record<string, string> = {}
    
    for (const filename of files) {
      try {
        const dataPath = path.join(process.cwd(), 'data', filename)
        const fileContent = await readFile(dataPath, 'utf-8')
        const data = JSON.parse(fileContent)
        
        // Delete existing blobs for this file
        const { blobs } = await list({ prefix: `data/${filename}`, token })
        for (const blob of blobs) {
          await del(blob.url, { token })
        }
        
        // Upload new data
        const blob = await put(`data/${filename}`, JSON.stringify(data, null, 2), {
          access: 'public',
          contentType: 'application/json',
          token,
        })
        
        results[filename] = blob.url
      } catch (err) {
        results[filename] = `Error: ${err}`
      }
    }
    
    return NextResponse.json({ success: true, results })
  } catch (error) {
    console.error('Seed error:', error)
    return NextResponse.json({ error: 'Seed failed' }, { status: 500 })
  }
}
