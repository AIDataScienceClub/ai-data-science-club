import { NextResponse } from 'next/server'
import { readFile, writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { isAuthenticated, unauthorizedResponse } from '@/lib/auth'
import { saveDataToBlob, loadDataFromBlob, isVercelEnvironment } from '@/lib/blob-storage'

const DATA_FILENAME = 'programs.json'
const DATA_PATH = path.join(process.cwd(), 'data', 'programs.json')

interface Track {
  id: string
  name: string
  description: string
  icon: string
  duration: string
  hoursPerWeek: string
}

interface Program {
  id: string
  title: string
  summary: string
  details: string[]
  commitment: string
  bestFor: string
  outcomes: string
  track: string
  status: 'upcoming' | 'enrolling' | 'in-progress' | 'completed'
  startDate?: string
}

interface FAQ {
  question: string
  answer: string
}

interface ProgramsData {
  hero: { title: string; subtitle: string }
  comingSoon: { enabled: boolean; message: string; launchDate: string }
  tracks: Track[]
  programs: Program[]
  faqs: FAQ[]
  callToAction: { title: string; description: string; buttonText: string; buttonLink: string }
}

const defaultData: ProgramsData = {
  hero: {
    title: 'Programs That Meet You Where You Are',
    subtitle: 'Three pathways designed for beginners, builders, and future AI leaders.'
  },
  comingSoon: {
    enabled: true,
    message: 'Our programs are being designed with care—launching soon!',
    launchDate: 'Spring 2026'
  },
  tracks: [],
  programs: [],
  faqs: [],
  callToAction: {
    title: 'Interested in Our Programs?',
    description: 'Sign up to be notified when applications open.',
    buttonText: 'Get Notified',
    buttonLink: '/get-involved'
  }
}

async function getProgramsData(): Promise<ProgramsData> {
  if (isVercelEnvironment()) {
    const blobData = await loadDataFromBlob<ProgramsData>(DATA_FILENAME)
    if (blobData) return blobData
  }
  
  try {
    const fileContent = await readFile(DATA_PATH, 'utf-8')
    return JSON.parse(fileContent)
  } catch {
    return defaultData
  }
}

async function saveProgramsData(data: ProgramsData): Promise<void> {
  if (isVercelEnvironment()) {
    await saveDataToBlob(DATA_FILENAME, data)
  } else {
    const dir = path.dirname(DATA_PATH)
    await mkdir(dir, { recursive: true })
    await writeFile(DATA_PATH, JSON.stringify(data, null, 2))
  }
}

// GET: Retrieve all programs data
export async function GET() {
  try {
    const data = await getProgramsData()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error reading programs data:', error)
    return NextResponse.json({ error: 'Failed to load programs data' }, { status: 500 })
  }
}

// PUT: Update entire programs data
export async function PUT(request: Request) {
  if (!await isAuthenticated()) {
    return unauthorizedResponse()
  }

  try {
    const updates = await request.json()
    const currentData = await getProgramsData()
    
    const newData = {
      ...currentData,
      ...updates,
    }
    
    await saveProgramsData(newData)
    return NextResponse.json(newData)
  } catch (error) {
    console.error('Error updating programs data:', error)
    return NextResponse.json({ error: 'Failed to update programs data' }, { status: 500 })
  }
}

// POST: Add a new program
export async function POST(request: Request) {
  if (!await isAuthenticated()) {
    return unauthorizedResponse()
  }

  try {
    const newProgram: Omit<Program, 'id'> = await request.json()
    const data = await getProgramsData()
    
    const program: Program = {
      ...newProgram,
      id: `program-${Date.now()}`,
    }
    
    data.programs.push(program)
    await saveProgramsData(data)
    
    return NextResponse.json(program, { status: 201 })
  } catch (error) {
    console.error('Error adding program:', error)
    return NextResponse.json({ error: 'Failed to add program' }, { status: 500 })
  }
}

// DELETE: Remove a program
export async function DELETE(request: Request) {
  if (!await isAuthenticated()) {
    return unauthorizedResponse()
  }

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: 'Program ID required' }, { status: 400 })
    }
    
    const data = await getProgramsData()
    data.programs = data.programs.filter(p => p.id !== id)
    await saveProgramsData(data)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting program:', error)
    return NextResponse.json({ error: 'Failed to delete program' }, { status: 500 })
  }
}
