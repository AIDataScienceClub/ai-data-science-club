import { readFile } from 'fs/promises'
import path from 'path'

// Check if we're on Vercel
function isVercelEnvironment(): boolean {
  return process.env.VERCEL === '1' || !!process.env.BLOB_READ_WRITE_TOKEN
}

// Load data from blob storage
async function loadFromBlob<T>(filename: string): Promise<T | null> {
  try {
    const token = process.env.BLOB_READ_WRITE_TOKEN
    if (!token) return null
    
    // Import dynamically to avoid issues on local dev
    const { list } = await import('@vercel/blob')
    
    const { blobs } = await list({ 
      prefix: `data/${filename}`,
      token 
    })
    
    if (blobs.length === 0) {
      return null
    }
    
    // Get the most recent blob
    const latestBlob = blobs.sort((a, b) => 
      new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
    )[0]
    
    const response = await fetch(latestBlob.url, { cache: 'no-store' })
    if (!response.ok) {
      return null
    }
    
    return await response.json() as T
  } catch (error) {
    console.error('Error loading from blob:', error)
    return null
  }
}

// Load from local file
async function loadFromFile<T>(filename: string): Promise<T | null> {
  try {
    const dataPath = path.join(process.cwd(), 'data', filename)
    const fileContent = await readFile(dataPath, 'utf-8')
    return JSON.parse(fileContent) as T
  } catch (error) {
    console.error('Error loading from file:', error)
    return null
  }
}

// Main function to load data - tries blob first on Vercel, then falls back to file
export async function loadData<T>(filename: string): Promise<T | null> {
  if (isVercelEnvironment()) {
    // Try blob storage first
    const blobData = await loadFromBlob<T>(filename)
    if (blobData) {
      return blobData
    }
  }
  
  // Fall back to local file
  return loadFromFile<T>(filename)
}

// Type definitions
export interface PageData {
  hero?: { title?: string; subtitle?: string }
  mission?: { 
    title?: string; 
    quote?: string; 
    content?: string;
    description?: string;
    values?: Array<{ title: string; description: string }> 
  }
  team?: { officers?: Array<{ name: string; role: string; grade: string; bio: string; focus: string; image?: string }> }
  stats?: Array<{ value: string; label: string }>
  metrics?: Array<{ metric: string; value: string; change: string; description: string }>
  testimonials?: Array<{ quote: string; author: string; role: string }>
  callToAction?: {
    title?: string
    description?: string
    primaryButton?: { label?: string; href?: string }
    secondaryButton?: { label?: string; href?: string }
  }
  [key: string]: unknown
}

export interface PagesData {
  home?: PageData
  about?: PageData
  impact?: PageData
  programs?: PageData
  [key: string]: PageData | undefined
}

export interface EventItem {
  id: string
  title: string
  description: string
  date: string
  time?: string
  location?: string
  audience?: string
  image?: string | null
  gallery?: string[]
  tags?: string[]
  featured?: boolean
  aiGenerated?: boolean
  rsvpLink?: string
}

export interface EventsData {
  events: EventItem[]
  gallery: Array<{ id: string; title: string; image: string; relatedEvent?: string; aiGenerated?: boolean }>
}

export interface ProgramsData {
  hero?: { title: string; subtitle: string }
  comingSoon?: { enabled: boolean; message: string; launchDate: string }
  tracks?: Array<{ id: string; name: string; description: string; icon: string; duration: string; hoursPerWeek: string }>
  programs?: Array<{ id: string; title: string; summary: string; details: string[]; commitment: string; bestFor: string; outcomes: string; track: string; status: string; startDate?: string }>
  faqs?: Array<{ question: string; answer: string }>
  callToAction?: { title: string; description: string; buttonText: string; buttonLink: string }
}

export interface ProjectsData {
  hero?: { title: string; subtitle: string }
  comingSoon?: { enabled: boolean; message: string; launchDate: string }
  categories?: Array<{ id: string; name: string; description: string; icon: string; color: string }>
  projects?: Array<{ id: string; title: string; description: string; category: string; status: string; image?: string | null; teamSize?: number; technologies?: string[]; impact?: string; link?: string }>
  callToAction?: { title: string; description: string; buttonText: string; buttonLink: string }
}

// Specific loaders for each data type
export async function loadPagesData(): Promise<PagesData | null> {
  return loadData<PagesData>('pages.json')
}

export async function loadEventsData(): Promise<EventsData> {
  const data = await loadData<EventsData>('events.json')
  return data || { events: [], gallery: [] }
}

export async function loadProgramsData(): Promise<ProgramsData | null> {
  return loadData<ProgramsData>('programs.json')
}

export async function loadProjectsData(): Promise<ProjectsData | null> {
  return loadData<ProjectsData>('projects.json')
}
