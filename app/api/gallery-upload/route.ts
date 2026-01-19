import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { existsSync } from 'fs'
import { isAuthenticated, unauthorizedResponse } from '@/lib/auth'
import { uploadImageToBlob, isVercelEnvironment } from '@/lib/blob-storage'

export async function POST(request: NextRequest) {
  // Check authentication
  if (!await isAuthenticated()) {
    return unauthorizedResponse()
  }

  try {
    const formData = await request.formData()
    const imageFile = formData.get('image') as File | null
    const category = formData.get('category') as string || 'events'
    
    if (!imageFile) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 })
    }

    let imagePath: string

    if (isVercelEnvironment()) {
      // Upload to Vercel Blob
      imagePath = await uploadImageToBlob(imageFile, category)
    } else {
      // Save locally
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads', category)
      if (!existsSync(uploadsDir)) {
        await mkdir(uploadsDir, { recursive: true })
      }

      const timestamp = Date.now()
      const safeName = imageFile.name.replace(/[^a-zA-Z0-9.-]/g, '_')
      const filename = `${timestamp}-${safeName}`
      const filepath = path.join(uploadsDir, filename)
      
      const bytes = await imageFile.arrayBuffer()
      await writeFile(filepath, Buffer.from(bytes))
      
      imagePath = `/uploads/${category}/${filename}`
    }

    return NextResponse.json({
      success: true,
      imagePath,
      filename: imagePath.split('/').pop()
    })

  } catch (error) {
    console.error('Gallery upload error:', error)
    return NextResponse.json({ 
      error: 'Failed to upload image',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
