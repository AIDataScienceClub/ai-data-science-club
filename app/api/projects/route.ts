import { NextResponse } from 'next/server'
import { readFile, writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { isAuthenticated, unauthorizedResponse } from '@/lib/auth'
import { saveDataToBlob, loadDataFromBlob, isVercelEnvironment } from '@/lib/blob-storage'

const DATA_FILENAME = 'projects.json'
const DATA_PATH = path.join(process.cwd(), 'data', 'projects.json')

interface Project {
  id: string
  title: string
  description: string
  category: string
  status: 'planning' | 'in-progress' | 'completed'
  image?: string | null
  teamSize?: number
  technologies?: string[]
  impact?: string
  link?: string
}

interface Category {
  id: string
  name: string
  description: string
  icon: string
  color: string
}

interface ProjectsData {
  hero: { title: string; subtitle: string }
  comingSoon: { enabled: boolean; message: string; launchDate: string }
  categories: Category[]
  projects: Project[]
  callToAction: { title: string; description: string; buttonText: string; buttonLink: string }
}

const defaultData: ProjectsData = {
  hero: {
    title: 'Projects That Matter',
    subtitle: 'Real problems. Real data. Real impact.'
  },
  comingSoon: {
    enabled: true,
    message: 'Our first projects are in development!',
    launchDate: 'Spring 2026'
  },
  categories: [],
  projects: [],
  callToAction: {
    title: 'Have a Project Idea?',
    description: 'We welcome project suggestions from students and community members.',
    buttonText: 'Submit an Idea',
    buttonLink: '/get-involved'
  }
}

async function getProjectsData(): Promise<ProjectsData> {
  if (isVercelEnvironment()) {
    const blobData = await loadDataFromBlob<ProjectsData>(DATA_FILENAME)
    if (blobData) return blobData
  }
  
  try {
    const fileContent = await readFile(DATA_PATH, 'utf-8')
    return JSON.parse(fileContent)
  } catch {
    return defaultData
  }
}

async function saveProjectsData(data: ProjectsData): Promise<void> {
  if (isVercelEnvironment()) {
    await saveDataToBlob(DATA_FILENAME, data)
  } else {
    const dir = path.dirname(DATA_PATH)
    await mkdir(dir, { recursive: true })
    await writeFile(DATA_PATH, JSON.stringify(data, null, 2))
  }
}

// GET: Retrieve all projects data
export async function GET() {
  try {
    const data = await getProjectsData()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error reading projects data:', error)
    return NextResponse.json({ error: 'Failed to load projects data' }, { status: 500 })
  }
}

// PUT: Update entire projects data (hero, comingSoon, categories, callToAction)
export async function PUT(request: Request) {
  if (!await isAuthenticated()) {
    return unauthorizedResponse()
  }

  try {
    const updates = await request.json()
    const currentData = await getProjectsData()
    
    const newData = {
      ...currentData,
      ...updates,
    }
    
    await saveProjectsData(newData)
    return NextResponse.json(newData)
  } catch (error) {
    console.error('Error updating projects data:', error)
    return NextResponse.json({ error: 'Failed to update projects data' }, { status: 500 })
  }
}

// POST: Add a new project
export async function POST(request: Request) {
  if (!await isAuthenticated()) {
    return unauthorizedResponse()
  }

  try {
    const newProject: Omit<Project, 'id'> = await request.json()
    const data = await getProjectsData()
    
    const project: Project = {
      ...newProject,
      id: `project-${Date.now()}`,
    }
    
    data.projects.push(project)
    await saveProjectsData(data)
    
    return NextResponse.json(project, { status: 201 })
  } catch (error) {
    console.error('Error adding project:', error)
    return NextResponse.json({ error: 'Failed to add project' }, { status: 500 })
  }
}

// PATCH: Update a specific project
export async function PATCH(request: Request) {
  if (!await isAuthenticated()) {
    return unauthorizedResponse()
  }

  try {
    const { id, ...updates } = await request.json()
    const data = await getProjectsData()
    
    const projectIndex = data.projects.findIndex(p => p.id === id)
    if (projectIndex === -1) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }
    
    data.projects[projectIndex] = { ...data.projects[projectIndex], ...updates }
    await saveProjectsData(data)
    
    return NextResponse.json(data.projects[projectIndex])
  } catch (error) {
    console.error('Error updating project:', error)
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 })
  }
}

// DELETE: Remove a project
export async function DELETE(request: Request) {
  if (!await isAuthenticated()) {
    return unauthorizedResponse()
  }

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: 'Project ID required' }, { status: 400 })
    }
    
    const data = await getProjectsData()
    data.projects = data.projects.filter(p => p.id !== id)
    await saveProjectsData(data)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting project:', error)
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 })
  }
}
