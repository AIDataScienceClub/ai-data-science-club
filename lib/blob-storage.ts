import { put, del, list } from '@vercel/blob'

const DATA_PREFIX = 'data/'
const IMAGES_PREFIX = 'images/'

// Helper to check if we're on Vercel (production)
export function isVercelEnvironment() {
  return process.env.VERCEL === '1' || process.env.BLOB_READ_WRITE_TOKEN
}

// Upload image to Vercel Blob
export async function uploadImageToBlob(
  file: File,
  category: string
): Promise<string> {
  const timestamp = Date.now()
  const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
  const pathname = `${IMAGES_PREFIX}${category}/${timestamp}-${safeName}`
  
  const blob = await put(pathname, file, {
    access: 'public',
  })
  
  return blob.url
}

// Delete image from Vercel Blob
export async function deleteImageFromBlob(url: string): Promise<void> {
  try {
    await del(url)
  } catch (error) {
    console.error('Error deleting blob:', error)
  }
}

// Save JSON data to Vercel Blob
export async function saveDataToBlob(
  filename: string,
  data: unknown
): Promise<string> {
  const pathname = `${DATA_PREFIX}${filename}`
  const jsonString = JSON.stringify(data, null, 2)
  
  const blob = await put(pathname, jsonString, {
    access: 'public',
    contentType: 'application/json',
    addRandomSuffix: false,
  })
  
  return blob.url
}

// Load JSON data from Vercel Blob
export async function loadDataFromBlob<T>(filename: string): Promise<T | null> {
  try {
    const { blobs } = await list({ prefix: `${DATA_PREFIX}${filename}` })
    
    if (blobs.length === 0) {
      return null
    }
    
    // Get the most recent blob
    const latestBlob = blobs.sort((a, b) => 
      new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
    )[0]
    
    const response = await fetch(latestBlob.url)
    if (!response.ok) {
      return null
    }
    
    return await response.json() as T
  } catch (error) {
    console.error('Error loading from blob:', error)
    return null
  }
}

// List all blobs with a prefix
export async function listBlobs(prefix: string) {
  const { blobs } = await list({ prefix })
  return blobs
}
