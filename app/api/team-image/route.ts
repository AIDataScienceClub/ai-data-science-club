import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { existsSync } from 'fs'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const imageFile = formData.get('image') as File | null
    const memberType = formData.get('memberType') as string // 'officers' or 'advisors'
    const memberIndex = formData.get('memberIndex') as string

    if (!imageFile) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 })
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'team')
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true })
    }

    // Save image
    const timestamp = Date.now()
    const safeName = imageFile.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const filename = `${memberType}-${memberIndex}-${timestamp}-${safeName}`
    const filepath = path.join(uploadsDir, filename)

    const bytes = await imageFile.arrayBuffer()
    await writeFile(filepath, Buffer.from(bytes))

    const imagePath = `/uploads/team/${filename}`

    return NextResponse.json({
      success: true,
      imagePath
    })
  } catch (error) {
    console.error('Error uploading team image:', error)
    return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 })
  }
}
