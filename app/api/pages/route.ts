import { NextRequest, NextResponse } from 'next/server'
import { readFile, writeFile } from 'fs/promises'
import path from 'path'
import { isAuthenticated, unauthorizedResponse } from '@/lib/auth'
import { saveDataToBlob, loadDataFromBlob, isVercelEnvironment } from '@/lib/blob-storage'

const DATA_FILENAME = 'pages.json'

// Default page data structure
const DEFAULT_PAGE_DATA: Record<string, unknown> = {
  home: {
    hero: { title: "High schoolers learning AI—building for good.", subtitle: "We teach data science and responsible AI through hands-on projects that solve real community problems." },
    mission: {
      quote: "We help high schoolers learn and apply AI and data science to solve local problems—responsibly.",
      description: "At AI Data Science Club, we believe every student deserves access to cutting-edge technology education—not just lectures, but hands-on projects that make a difference."
    },
    stats: [
      { value: "147", label: "Students Trained" },
      { value: "21", label: "Projects Shipped" },
      { value: "12", label: "Community Partners" }
    ],
    testimonials: [
      { quote: "I never thought I could build an app that helps real people. This club changed how I see my future.", author: "Maya S.", role: "10th Grade, Applied AI Track" },
      { quote: "As a parent, I was nervous about AI. But seeing the ethics training and mentorship structure gave me confidence.", author: "Patricia L.", role: "Parent of Member" }
    ],
    callToAction: {
      title: "Ready to Make an Impact?",
      description: "Whether you're curious about AI or ready to lead a project, there's a place for you here.",
      primaryButton: { label: "Students: Apply Now", href: "/get-involved#students" },
      secondaryButton: { label: "Mentors: Share Your Expertise", href: "/get-involved#mentors" }
    }
  },
  about: {
    hero: { title: "Who We Are", subtitle: "A student-led movement to make AI education accessible, impactful, and responsible." },
    mission: {
      title: "Our Mission",
      quote: "We help high schoolers learn and apply AI and data science to solve local problems—responsibly.",
      content: "Atlanta AI & Data Lab was founded in 2023 by three high school juniors frustrated by the lack of hands-on tech opportunities in their schools.",
      values: [
        { title: "Accessible", description: "No barriers—free programs, loaned equipment, beginner-friendly." },
        { title: "Applied", description: "Learning by doing; projects with purpose." },
        { title: "Accountable", description: "Ethics aren't an afterthought—they're embedded in every project." }
      ]
    },
    team: { officers: [], advisors: [] }
  },
  impact: {
    hero: { title: "Measuring What Matters", subtitle: "We hold ourselves accountable." },
    metrics: []
  },
  programs: {
    hero: { title: "Programs That Meet You Where You Are", subtitle: "Three pathways designed for beginners, builders, and future AI leaders." },
    programs: [],
    faqs: []
  }
}

// Helper to read pages data
async function readPagesData(): Promise<Record<string, unknown>> {
  if (isVercelEnvironment()) {
    const blobData = await loadDataFromBlob<Record<string, unknown>>(DATA_FILENAME)
    if (blobData && Object.keys(blobData).length > 0) return blobData
  }
  
  try {
    const dataPath = path.join(process.cwd(), 'data', 'pages.json')
    const fileContent = await readFile(dataPath, 'utf-8')
    return JSON.parse(fileContent)
  } catch {
    // Return default data if file doesn't exist
    return { ...DEFAULT_PAGE_DATA }
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
    
    // Initialize page with defaults if it doesn't exist
    if (!allData[page]) {
      allData[page] = DEFAULT_PAGE_DATA[page] || {}
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
