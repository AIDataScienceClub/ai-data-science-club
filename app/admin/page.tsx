'use client'

import { useState, useEffect, useRef } from 'react'
import { Sparkles, Upload, RefreshCw, Trash2, Calendar, Image as ImageIcon, FolderOpen, Edit2, X, Save, Check, FileText, Users, Target, BookOpen, Home, ChevronRight, Briefcase, Plus, Clock, MapPin, LogOut, GalleryHorizontalEnd } from 'lucide-react'
import AIContentUploader from '@/components/AIContentUploader'
import AdminLogin from '@/components/AdminLogin'

interface ContentItem {
  id: string
  category: string
  title: string
  description: string
  date: string
  time?: string
  location?: string
  audience?: string
  image: string | null
  tags: string[]
  featured?: boolean
  aiGenerated?: boolean
  createdAt: string
  gallery?: string[]
}

interface ContentData {
  events: ContentItem[]
  gallery: ContentItem[]
}

type AdminSection = 'content' | 'pages'
type PageType = 'home' | 'about' | 'programs' | 'impact' | 'events' | 'projects'

interface TeamMember {
  name: string
  role?: string
  title?: string
  grade?: string
  bio?: string
  focus?: string
  credentials?: string
  specialties?: string
  image?: string
}

interface ProgramItem {
  id: string
  title: string
  summary: string
  details: string[]
  commitment: string
  bestFor: string
  outcomes: string
}

interface FAQItem {
  question: string
  answer: string
}

interface MetricItem {
  metric: string
  value: string
  change: string
  description: string
}

interface ValueItem {
  title: string
  description: string
}

interface StatItem {
  value: string
  label: string
}

// Projects types
interface ProjectItem {
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

interface ProjectCategory {
  id: string
  name: string
  description: string
  icon: string
  color: string
}

interface ProjectsPageData {
  hero: { title: string; subtitle: string }
  comingSoon: { enabled: boolean; message: string; launchDate: string }
  categories: ProjectCategory[]
  projects: ProjectItem[]
  callToAction: { title: string; description: string; buttonText: string; buttonLink: string }
}

// Programs types
interface ProgramTrack {
  id: string
  name: string
  description: string
  icon: string
  duration: string
  hoursPerWeek: string
}

interface ProgramCohort {
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

interface ProgramFAQ {
  question: string
  answer: string
}

interface ProgramsPageData {
  hero: { title: string; subtitle: string }
  comingSoon: { enabled: boolean; message: string; launchDate: string }
  tracks: ProgramTrack[]
  programs: ProgramCohort[]
  faqs: ProgramFAQ[]
  callToAction: { title: string; description: string; buttonText: string; buttonLink: string }
}

interface PageData {
  about?: {
    hero: { title: string; subtitle: string }
    mission: { title: string; quote: string; content: string; values: ValueItem[] }
    team: { officers: TeamMember[]; advisors: TeamMember[] }
  }
  impact?: {
    hero: { title: string; subtitle: string }
    metrics: MetricItem[]
  }
  home?: {
    hero: { title: string; subtitle: string }
    stats: StatItem[]
  }
}

export default function AdminPage() {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)

  const [isUploaderOpen, setIsUploaderOpen] = useState(false)
  const [content, setContent] = useState<ContentData>({ events: [], gallery: [] })
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'events' | 'gallery'>('events')
  const [editingItem, setEditingItem] = useState<ContentItem | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState<string | null>(null)
  const [isUploadingGallery, setIsUploadingGallery] = useState(false)
  const galleryInputRef = useRef<HTMLInputElement>(null)
  
  // Page editing state
  const [adminSection, setAdminSection] = useState<AdminSection>('content')
  const [selectedPage, setSelectedPage] = useState<PageType>('home')
  const [pageData, setPageData] = useState<PageData>({})
  const [isLoadingPages, setIsLoadingPages] = useState(false)
  const [pageEditData, setPageEditData] = useState<any>(null)
  const [pageSaveMessage, setPageSaveMessage] = useState<string | null>(null)
  
  // Events and Projects data for page editor
  const [eventsData, setEventsData] = useState<ContentItem[]>([])
  const [projectsPageData, setProjectsPageData] = useState<ProjectsPageData | null>(null)
  const [programsPageData, setProgramsPageData] = useState<ProgramsPageData | null>(null)

  const fetchContent = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/upload-content', { cache: 'no-store' })
      const data = await response.json()
      setContent(data)
      setEventsData(data.events || [])
    } catch (error) {
      console.error('Failed to fetch content:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchPageData = async () => {
    setIsLoadingPages(true)
    try {
      const response = await fetch('/api/pages', { cache: 'no-store' })
      const data = await response.json()
      setPageData(data)
      if (selectedPage !== 'events' && selectedPage !== 'projects' && data[selectedPage]) {
        setPageEditData(JSON.parse(JSON.stringify(data[selectedPage])))
      }
    } catch (error) {
      console.error('Failed to fetch page data:', error)
    } finally {
      setIsLoadingPages(false)
    }
  }

  const fetchProjectsData = async () => {
    try {
      const response = await fetch('/api/projects', { cache: 'no-store' })
      const data = await response.json()
      setProjectsPageData(data)
      if (selectedPage === 'projects') {
        setPageEditData(JSON.parse(JSON.stringify(data)))
      }
    } catch (error) {
      console.error('Failed to fetch projects data:', error)
    }
  }

  const fetchProgramsData = async () => {
    try {
      const response = await fetch('/api/programs', { cache: 'no-store' })
      const data = await response.json()
      setProgramsPageData(data)
      if (selectedPage === 'programs') {
        setPageEditData(JSON.parse(JSON.stringify(data)))
      }
    } catch (error) {
      console.error('Failed to fetch programs data:', error)
    }
  }

  // Check authentication on mount
  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth')
      const data = await response.json()
      setIsAuthenticated(data.authenticated)
    } catch (error) {
      setIsAuthenticated(false)
    } finally {
      setIsCheckingAuth(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth', { method: 'DELETE' })
      setIsAuthenticated(false)
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  useEffect(() => {
    checkAuth()
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      fetchContent()
      fetchPageData()
      fetchProjectsData()
      fetchProgramsData()
    }
  }, [isAuthenticated])

  useEffect(() => {
    if (selectedPage === 'events') {
      setPageEditData(eventsData)
    } else if (selectedPage === 'projects') {
      if (projectsPageData) {
        setPageEditData(JSON.parse(JSON.stringify(projectsPageData)))
      }
    } else if (selectedPage === 'programs') {
      if (programsPageData) {
        setPageEditData(JSON.parse(JSON.stringify(programsPageData)))
      }
    } else if (pageData[selectedPage]) {
      setPageEditData(JSON.parse(JSON.stringify(pageData[selectedPage])))
    }
  }, [selectedPage, pageData, eventsData, projectsPageData, programsPageData])

  const handleContentAdded = () => {
    fetchContent()
  }

  const handleEdit = (item: ContentItem) => {
    setEditingItem({ ...item })
    setSaveMessage(null)
  }

  const handleSave = async () => {
    if (!editingItem) return
    
    setIsSaving(true)
    setSaveMessage(null)
    
    try {
      const response = await fetch(`/api/content/${editingItem.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(editingItem)
      })
      
      if (response.ok) {
        setSaveMessage('Saved successfully!')
        fetchContent()
        setTimeout(() => {
          setEditingItem(null)
          setSaveMessage(null)
        }, 1000)
      } else {
        setSaveMessage('Failed to save')
      }
    } catch (error) {
      setSaveMessage('Error saving changes')
    } finally {
      setIsSaving(false)
    }
  }

  const handlePageSave = async () => {
    setIsSaving(true)
    setPageSaveMessage(null)
    
    try {
      // Use different API for projects
      if (selectedPage === 'projects') {
        const response = await fetch('/api/projects', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(pageEditData)
        })
        
        if (response.ok) {
          setPageSaveMessage('Projects page saved successfully!')
          fetchProjectsData()
          setTimeout(() => setPageSaveMessage(null), 3000)
        } else {
          setPageSaveMessage('Failed to save projects page')
        }
      } else if (selectedPage === 'programs') {
        // Use different API for programs
        const response = await fetch('/api/programs', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(pageEditData)
        })
        
        if (response.ok) {
          setPageSaveMessage('Programs page saved successfully!')
          fetchProgramsData()
          setTimeout(() => setPageSaveMessage(null), 3000)
        } else {
          setPageSaveMessage('Failed to save programs page')
        }
      } else {
        const response = await fetch('/api/pages', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            page: selectedPage,
            data: pageEditData
          })
        })
        
        if (response.ok) {
          setPageSaveMessage('Page saved successfully!')
          fetchPageData()
          setTimeout(() => setPageSaveMessage(null), 3000)
        } else {
          setPageSaveMessage('Failed to save page')
        }
      }
    } catch (error) {
      setPageSaveMessage('Error saving page')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return
    
    try {
      const response = await fetch(`/api/content/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      })
      
      if (response.ok) {
        fetchContent()
        // Also refresh page data if we're editing events/projects
        if (selectedPage === 'events' || selectedPage === 'projects') {
          fetchPageData()
        }
      }
    } catch (error) {
      console.error('Delete error:', error)
    }
  }

  // Add project handlers
  const handleAddProject = () => {
    if (!pageEditData) return
    const newProject: ProjectItem = {
      id: `project-${Date.now()}`,
      title: 'New Project',
      description: '',
      category: pageEditData.categories?.[0]?.name || 'Community Impact',
      status: 'planning'
    }
    setPageEditData({
      ...pageEditData,
      projects: [...(pageEditData.projects || []), newProject]
    })
  }

  const handleRemoveProject = (projectId: string) => {
    if (!pageEditData) return
    if (!confirm('Are you sure you want to remove this project?')) return
    setPageEditData({
      ...pageEditData,
      projects: pageEditData.projects.filter((p: ProjectItem) => p.id !== projectId)
    })
  }

  const handleUpdateProject = (projectId: string, field: keyof ProjectItem, value: any) => {
    if (!pageEditData) return
    setPageEditData({
      ...pageEditData,
      projects: pageEditData.projects.map((p: ProjectItem) =>
        p.id === projectId ? { ...p, [field]: value } : p
      )
    })
  }

  // Add category handlers
  const handleAddCategory = () => {
    if (!pageEditData) return
    const newCategory: ProjectCategory = {
      id: `cat-${Date.now()}`,
      name: 'New Category',
      description: '',
      icon: 'lightbulb',
      color: 'primary'
    }
    setPageEditData({
      ...pageEditData,
      categories: [...(pageEditData.categories || []), newCategory]
    })
  }

  const handleRemoveCategory = (categoryId: string) => {
    if (!pageEditData) return
    if (!confirm('Are you sure you want to remove this category?')) return
    setPageEditData({
      ...pageEditData,
      categories: pageEditData.categories.filter((c: ProjectCategory) => c.id !== categoryId)
    })
  }

  const handleUpdateCategory = (categoryId: string, field: keyof ProjectCategory, value: any) => {
    if (!pageEditData) return
    setPageEditData({
      ...pageEditData,
      categories: pageEditData.categories.map((c: ProjectCategory) =>
        c.id === categoryId ? { ...c, [field]: value } : c
      )
    })
  }

  // Program track handlers
  const handleAddTrack = () => {
    if (!pageEditData) return
    const newTrack: ProgramTrack = {
      id: `track-${Date.now()}`,
      name: 'New Track',
      description: '',
      icon: 'book',
      duration: '6 weeks',
      hoursPerWeek: '2-4 hours/week'
    }
    setPageEditData({
      ...pageEditData,
      tracks: [...(pageEditData.tracks || []), newTrack]
    })
  }

  const handleRemoveTrack = (trackId: string) => {
    if (!pageEditData) return
    if (!confirm('Are you sure you want to remove this track?')) return
    setPageEditData({
      ...pageEditData,
      tracks: pageEditData.tracks.filter((t: ProgramTrack) => t.id !== trackId)
    })
  }

  const handleUpdateTrack = (trackId: string, field: keyof ProgramTrack, value: any) => {
    if (!pageEditData) return
    setPageEditData({
      ...pageEditData,
      tracks: pageEditData.tracks.map((t: ProgramTrack) =>
        t.id === trackId ? { ...t, [field]: value } : t
      )
    })
  }

  // Program FAQ handlers
  const handleAddProgramFAQ = () => {
    if (!pageEditData) return
    const newFAQ: ProgramFAQ = {
      question: 'New Question?',
      answer: ''
    }
    setPageEditData({
      ...pageEditData,
      faqs: [...(pageEditData.faqs || []), newFAQ]
    })
  }

  const handleRemoveProgramFAQ = (index: number) => {
    if (!pageEditData) return
    if (!confirm('Are you sure you want to remove this FAQ?')) return
    setPageEditData({
      ...pageEditData,
      faqs: pageEditData.faqs.filter((_: ProgramFAQ, i: number) => i !== index)
    })
  }

  const handleUpdateProgramFAQ = (index: number, field: keyof ProgramFAQ, value: string) => {
    if (!pageEditData) return
    setPageEditData({
      ...pageEditData,
      faqs: pageEditData.faqs.map((faq: ProgramFAQ, i: number) =>
        i === index ? { ...faq, [field]: value } : faq
      )
    })
  }

  const updateEditingItem = (field: keyof ContentItem, value: any) => {
    if (!editingItem) return
    setEditingItem({ ...editingItem, [field]: value })
  }

  // Gallery image upload handler
  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0 || !editingItem) return

    setIsUploadingGallery(true)
    const newGalleryImages: string[] = [...(editingItem.gallery || [])]

    for (const file of Array.from(files)) {
      const formData = new FormData()
      formData.append('image', file)
      formData.append('category', 'events')

      try {
        const response = await fetch('/api/gallery-upload', {
          method: 'POST',
          credentials: 'include',
          body: formData
        })

        if (response.ok) {
          const result = await response.json()
          if (result.imagePath) {
            newGalleryImages.push(result.imagePath)
          }
        }
      } catch (error) {
        console.error('Failed to upload gallery image:', error)
      }
    }

    setEditingItem({ ...editingItem, gallery: newGalleryImages })
    setIsUploadingGallery(false)
    
    // Reset input
    if (galleryInputRef.current) {
      galleryInputRef.current.value = ''
    }
  }

  // Remove gallery image
  const removeGalleryImage = (indexToRemove: number) => {
    if (!editingItem) return
    const newGallery = (editingItem.gallery || []).filter((_, i) => i !== indexToRemove)
    setEditingItem({ ...editingItem, gallery: newGallery })
  }

  const updatePageField = (path: string[], value: any) => {
    setPageEditData((prev: any) => {
      const newData = JSON.parse(JSON.stringify(prev))
      let current = newData
      for (let i = 0; i < path.length - 1; i++) {
        current = current[path[i]]
      }
      current[path[path.length - 1]] = value
      return newData
    })
  }

  const allContent = activeTab === 'events' ? content.events : content.gallery

  const pageIcons: Record<PageType, any> = {
    home: Home,
    about: Users,
    programs: BookOpen,
    impact: Target,
    events: Calendar,
    projects: Briefcase
  }

  const pageLabels: Record<PageType, string> = {
    home: 'Home',
    about: 'About',
    programs: 'Programs',
    impact: 'Impact',
    events: 'Events',
    projects: 'Projects'
  }

  // Show loading while checking auth
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-neutral-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-gray-600">Checking authentication...</p>
        </div>
      </div>
    )
  }

  // Show login if not authenticated
  if (!isAuthenticated) {
    return <AdminLogin onLogin={() => setIsAuthenticated(true)} />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container-custom py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Content Manager</h1>
              <p className="text-gray-600 mt-1">Manage website content and pages</p>
            </div>
            <div className="flex items-center gap-3">
              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-neutral-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors flex items-center gap-2"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
              {/* Section Toggle */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setAdminSection('content')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    adminSection === 'content'
                      ? 'bg-white text-primary shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Events & Media
                </button>
                <button
                  onClick={() => setAdminSection('pages')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    adminSection === 'pages'
                      ? 'bg-white text-primary shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <FileText className="w-4 h-4 inline mr-2" />
                  Edit Pages
                </button>
              </div>
              {adminSection === 'content' && (
                <button
                  onClick={() => setIsUploaderOpen(true)}
                  className="btn btn-primary"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  AI Upload
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {adminSection === 'content' ? (
        <>
          {/* Stats */}
          <div className="container-custom py-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl p-6 shadow-sm border">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Calendar className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{content.events.length}</p>
                    <p className="text-sm text-gray-600">Events</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm border">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <ImageIcon className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{content.gallery.length}</p>
                    <p className="text-sm text-gray-600">Gallery Items</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm border">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <Sparkles className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {[...content.events, ...content.gallery].filter(i => i.aiGenerated).length}
                    </p>
                    <p className="text-sm text-gray-600">AI Generated</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm border">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-orange-100 rounded-lg">
                    <FolderOpen className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {[...content.events, ...content.gallery].filter(i => i.image).length}
                    </p>
                    <p className="text-sm text-gray-600">With Images</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content List */}
          <div className="container-custom pb-12">
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
              {/* Tabs */}
              <div className="flex items-center justify-between border-b px-6 py-4">
                <div className="flex gap-4">
                  <button
                    onClick={() => setActiveTab('events')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      activeTab === 'events'
                        ? 'bg-primary text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    Events ({content.events.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('gallery')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      activeTab === 'gallery'
                        ? 'bg-primary text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    Gallery ({content.gallery.length})
                  </button>
                </div>
                <button
                  onClick={fetchContent}
                  className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Refresh"
                >
                  <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
                </button>
              </div>

              {/* Content Grid */}
              {isLoading ? (
                <div className="p-12 text-center">
                  <RefreshCw className="w-8 h-8 mx-auto text-gray-400 animate-spin" />
                  <p className="mt-4 text-gray-500">Loading content...</p>
                </div>
              ) : allContent.length === 0 ? (
                <div className="p-12 text-center">
                  <Upload className="w-12 h-12 mx-auto text-gray-300" />
                  <h3 className="mt-4 text-lg font-medium text-gray-900">No content yet</h3>
                  <p className="mt-2 text-gray-500">
                    Click &quot;AI Upload&quot; to add your first content
                  </p>
                  <button
                    onClick={() => setIsUploaderOpen(true)}
                    className="mt-4 btn btn-primary"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Upload Content
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                  {allContent.map((item) => (
                    <div key={item.id} className="border rounded-xl overflow-hidden hover:shadow-lg transition-shadow group">
                      {item.image ? (
                        <div className="relative h-48 bg-gray-100">
                          <img 
                            src={item.image} 
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                          {item.aiGenerated && (
                            <span className="absolute top-2 right-2 px-2 py-1 bg-primary text-white text-xs rounded-full flex items-center gap-1">
                              <Sparkles className="w-3 h-3" />
                              AI
                            </span>
                          )}
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleEdit(item)}
                              className="p-2 bg-white rounded-lg hover:bg-gray-100 transition-colors"
                              title="Edit"
                            >
                              <Edit2 className="w-5 h-5 text-gray-700" />
                            </button>
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="p-2 bg-white rounded-lg hover:bg-red-50 transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-5 h-5 text-red-500" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="relative h-48 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                          <Calendar className="w-12 h-12 text-primary/40" />
                          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleEdit(item)}
                              className="p-2 bg-white rounded-lg hover:bg-gray-100 transition-colors"
                              title="Edit"
                            >
                              <Edit2 className="w-5 h-5 text-gray-700" />
                            </button>
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="p-2 bg-white rounded-lg hover:bg-red-50 transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-5 h-5 text-red-500" />
                            </button>
                          </div>
                        </div>
                      )}
                      <div className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                            {item.category}
                          </span>
                          <span className="text-xs text-gray-400">{item.date}</span>
                          {item.featured && (
                            <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded">
                              Featured
                            </span>
                          )}
                        </div>
                        <h3 className="font-semibold text-gray-900 line-clamp-1">{item.title}</h3>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{item.description}</p>
                        {item.tags && item.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-3">
                            {item.tags.slice(0, 3).map((tag, i) => (
                              <span key={i} className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                        <button
                          onClick={() => handleEdit(item)}
                          className="mt-3 w-full py-2 text-sm text-primary hover:bg-primary/5 rounded-lg transition-colors flex items-center justify-center gap-1"
                        >
                          <Edit2 className="w-4 h-4" />
                          Edit
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        /* Page Editor Section */
        <div className="container-custom py-6">
          <div className="flex gap-6">
            {/* Page Sidebar */}
            <div className="w-64 flex-shrink-0">
              <div className="bg-white rounded-xl shadow-sm border p-4">
                <h3 className="font-semibold text-gray-900 mb-4">Select Page</h3>
                <div className="space-y-2">
                  {(['home', 'events', 'about', 'programs', 'projects', 'impact'] as PageType[]).map((page) => {
                    const Icon = pageIcons[page]
                    return (
                      <button
                        key={page}
                        onClick={() => setSelectedPage(page)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                          selectedPage === page
                            ? 'bg-primary text-white'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{pageLabels[page]}</span>
                        <ChevronRight className={`w-4 h-4 ml-auto ${selectedPage === page ? 'opacity-100' : 'opacity-0'}`} />
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Page Editor */}
            <div className="flex-1">
              <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                {/* Page Header */}
                <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-primary/5 to-transparent">
                  <div className="flex items-center gap-3">
                    {(() => {
                      const Icon = pageIcons[selectedPage]
                      return <Icon className="w-6 h-6 text-primary" />
                    })()}
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">Edit {pageLabels[selectedPage]} Page</h2>
                      <p className="text-sm text-gray-600">Update content displayed on the {pageLabels[selectedPage].toLowerCase()} page</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {pageSaveMessage && (
                      <span className={`text-sm flex items-center gap-1 ${pageSaveMessage.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
                        {pageSaveMessage.includes('success') && <Check className="w-4 h-4" />}
                        {pageSaveMessage}
                      </span>
                    )}
                    <button
                      onClick={handlePageSave}
                      disabled={isSaving}
                      className="btn btn-primary"
                    >
                      {isSaving ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Save Page
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Page Content Editor */}
                {isLoadingPages ? (
                  <div className="p-12 text-center">
                    <RefreshCw className="w-8 h-8 mx-auto text-gray-400 animate-spin" />
                    <p className="mt-4 text-gray-500">Loading page content...</p>
                  </div>
                ) : pageEditData ? (
                  <div className="p-6 space-y-8">
                    {/* Hero Section */}
                    {pageEditData.hero && (
                      <div className="space-y-4">
                        <h3 className="font-semibold text-lg text-gray-900 flex items-center gap-2">
                          <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">1</span>
                          Hero Section
                        </h3>
                        <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                            <input
                              type="text"
                              value={pageEditData.hero.title}
                              onChange={(e) => updatePageField(['hero', 'title'], e.target.value)}
                              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                            <textarea
                              value={pageEditData.hero.subtitle}
                              onChange={(e) => updatePageField(['hero', 'subtitle'], e.target.value)}
                              rows={2}
                              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary resize-none"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Home Page Stats */}
                    {selectedPage === 'home' && pageEditData.stats && (
                      <div className="space-y-4">
                        <h3 className="font-semibold text-lg text-gray-900 flex items-center gap-2">
                          <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">2</span>
                          Stats
                        </h3>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="grid grid-cols-3 gap-4">
                            {pageEditData.stats.map((stat: StatItem, index: number) => (
                              <div key={index} className="space-y-2">
                                <input
                                  type="text"
                                  value={stat.value}
                                  onChange={(e) => {
                                    const newStats = [...pageEditData.stats]
                                    newStats[index] = { ...stat, value: e.target.value }
                                    updatePageField(['stats'], newStats)
                                  }}
                                  className="w-full px-3 py-2 border rounded-lg text-2xl font-bold text-center focus:ring-2 focus:ring-primary"
                                  placeholder="Value"
                                />
                                <input
                                  type="text"
                                  value={stat.label}
                                  onChange={(e) => {
                                    const newStats = [...pageEditData.stats]
                                    newStats[index] = { ...stat, label: e.target.value }
                                    updatePageField(['stats'], newStats)
                                  }}
                                  className="w-full px-3 py-2 border rounded-lg text-sm text-center focus:ring-2 focus:ring-primary"
                                  placeholder="Label"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* About Page Mission */}
                    {selectedPage === 'about' && pageEditData.mission && (
                      <div className="space-y-4">
                        <h3 className="font-semibold text-lg text-gray-900 flex items-center gap-2">
                          <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">2</span>
                          Mission Section
                        </h3>
                        <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Mission Quote</label>
                            <input
                              type="text"
                              value={pageEditData.mission.quote}
                              onChange={(e) => updatePageField(['mission', 'quote'], e.target.value)}
                              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                            <textarea
                              value={pageEditData.mission.content}
                              onChange={(e) => updatePageField(['mission', 'content'], e.target.value)}
                              rows={4}
                              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary resize-none"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Values</label>
                            <div className="space-y-3">
                              {pageEditData.mission.values.map((value: ValueItem, index: number) => (
                                <div key={index} className="flex gap-2">
                                  <input
                                    type="text"
                                    value={value.title}
                                    onChange={(e) => {
                                      const newValues = [...pageEditData.mission.values]
                                      newValues[index] = { ...value, title: e.target.value }
                                      updatePageField(['mission', 'values'], newValues)
                                    }}
                                    className="w-32 px-3 py-2 border rounded-lg font-semibold focus:ring-2 focus:ring-primary"
                                    placeholder="Title"
                                  />
                                  <input
                                    type="text"
                                    value={value.description}
                                    onChange={(e) => {
                                      const newValues = [...pageEditData.mission.values]
                                      newValues[index] = { ...value, description: e.target.value }
                                      updatePageField(['mission', 'values'], newValues)
                                    }}
                                    className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                                    placeholder="Description"
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* About Page Team */}
                    {selectedPage === 'about' && pageEditData.team && (
                      <div className="space-y-4">
                        <h3 className="font-semibold text-lg text-gray-900 flex items-center gap-2">
                          <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">3</span>
                          Team Members
                        </h3>
                        
                        {/* Officers */}
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-medium text-gray-700">Student Leaders</h4>
                            <button
                              onClick={() => {
                                const newOfficer = {
                                  name: '',
                                  role: '',
                                  grade: '',
                                  bio: '',
                                  focus: '',
                                  image: null
                                }
                                const newOfficers = [...pageEditData.team.officers, newOfficer]
                                updatePageField(['team', 'officers'], newOfficers)
                              }}
                              className="flex items-center gap-1 px-3 py-1.5 bg-primary text-white rounded-lg text-sm hover:bg-primary-dark transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                              Add Student
                            </button>
                          </div>
                          <div className="space-y-4">
                            {pageEditData.team.officers.map((officer: TeamMember, index: number) => (
                              <div key={index} className="bg-white rounded-lg p-4 border space-y-3 relative">
                                {/* Remove Button */}
                                <button
                                  onClick={() => {
                                    const newOfficers = pageEditData.team.officers.filter((_: TeamMember, i: number) => i !== index)
                                    updatePageField(['team', 'officers'], newOfficers)
                                  }}
                                  className="absolute top-2 right-2 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                  title="Remove student"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                                <div className="flex gap-4 pr-8">
                                  {/* Photo Upload */}
                                  <div className="flex-shrink-0">
                                    <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-gray-100 border-2 border-dashed border-gray-300">
                                      {officer.image ? (
                                        <img src={officer.image} alt={officer.name} className="w-full h-full object-cover" />
                                      ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                                          <Users className="w-8 h-8 mb-1" />
                                          <span className="text-xs">No photo</span>
                                        </div>
                                      )}
                                      <label className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                                        <Upload className="w-6 h-6 text-white" />
                                        <input
                                          type="file"
                                          accept="image/*"
                                          className="hidden"
                                          onChange={async (e) => {
                                            const file = e.target.files?.[0]
                                            if (!file) return
                                            const formData = new FormData()
                                            formData.append('image', file)
                                            formData.append('memberType', 'officers')
                                            formData.append('memberIndex', index.toString())
                                            try {
                                              const res = await fetch('/api/team-image', { method: 'POST', credentials: 'include', body: formData })
                                              const data = await res.json()
                                              if (data.imagePath) {
                                                const newOfficers = [...pageEditData.team.officers]
                                                newOfficers[index] = { ...officer, image: data.imagePath }
                                                updatePageField(['team', 'officers'], newOfficers)
                                              }
                                            } catch (err) { console.error('Upload failed:', err) }
                                          }}
                                        />
                                      </label>
                                    </div>
                                  </div>
                                  {/* Info Fields */}
                                  <div className="flex-1 space-y-2">
                                    <div className="grid grid-cols-3 gap-2">
                                      <input
                                        type="text"
                                        value={officer.name}
                                        onChange={(e) => {
                                          const newOfficers = [...pageEditData.team.officers]
                                          newOfficers[index] = { ...officer, name: e.target.value }
                                          updatePageField(['team', 'officers'], newOfficers)
                                        }}
                                        className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary text-sm"
                                        placeholder="Name"
                                      />
                                      <input
                                        type="text"
                                        value={officer.role || ''}
                                        onChange={(e) => {
                                          const newOfficers = [...pageEditData.team.officers]
                                          newOfficers[index] = { ...officer, role: e.target.value }
                                          updatePageField(['team', 'officers'], newOfficers)
                                        }}
                                        className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary text-sm"
                                        placeholder="Role"
                                      />
                                      <input
                                        type="text"
                                        value={officer.grade || ''}
                                        onChange={(e) => {
                                          const newOfficers = [...pageEditData.team.officers]
                                          newOfficers[index] = { ...officer, grade: e.target.value }
                                          updatePageField(['team', 'officers'], newOfficers)
                                        }}
                                        className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary text-sm"
                                        placeholder="Grade"
                                      />
                                    </div>
                                    <input
                                      type="text"
                                      value={officer.focus || ''}
                                      onChange={(e) => {
                                        const newOfficers = [...pageEditData.team.officers]
                                        newOfficers[index] = { ...officer, focus: e.target.value }
                                        updatePageField(['team', 'officers'], newOfficers)
                                      }}
                                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary text-sm"
                                      placeholder="Focus area"
                                    />
                                  </div>
                                </div>
                                <input
                                  type="text"
                                  value={officer.bio || ''}
                                  onChange={(e) => {
                                    const newOfficers = [...pageEditData.team.officers]
                                    newOfficers[index] = { ...officer, bio: e.target.value }
                                    updatePageField(['team', 'officers'], newOfficers)
                                  }}
                                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary text-sm"
                                  placeholder="Bio quote"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Impact Page Metrics */}
                    {selectedPage === 'impact' && pageEditData.metrics && (
                      <div className="space-y-4">
                        <h3 className="font-semibold text-lg text-gray-900 flex items-center gap-2">
                          <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">2</span>
                          Impact Metrics
                        </h3>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="grid grid-cols-2 gap-4">
                            {pageEditData.metrics.map((metric: MetricItem, index: number) => (
                              <div key={index} className="bg-white rounded-lg p-4 border space-y-2">
                                <div className="grid grid-cols-2 gap-2">
                                  <input
                                    type="text"
                                    value={metric.metric}
                                    onChange={(e) => {
                                      const newMetrics = [...pageEditData.metrics]
                                      newMetrics[index] = { ...metric, metric: e.target.value }
                                      updatePageField(['metrics'], newMetrics)
                                    }}
                                    className="px-3 py-2 border rounded-lg font-medium focus:ring-2 focus:ring-primary"
                                    placeholder="Metric name"
                                  />
                                  <input
                                    type="text"
                                    value={metric.value}
                                    onChange={(e) => {
                                      const newMetrics = [...pageEditData.metrics]
                                      newMetrics[index] = { ...metric, value: e.target.value }
                                      updatePageField(['metrics'], newMetrics)
                                    }}
                                    className="px-3 py-2 border rounded-lg text-xl font-bold focus:ring-2 focus:ring-primary"
                                    placeholder="Value"
                                  />
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                  <input
                                    type="text"
                                    value={metric.change}
                                    onChange={(e) => {
                                      const newMetrics = [...pageEditData.metrics]
                                      newMetrics[index] = { ...metric, change: e.target.value }
                                      updatePageField(['metrics'], newMetrics)
                                    }}
                                    className="px-3 py-2 border rounded-lg text-green-600 focus:ring-2 focus:ring-primary"
                                    placeholder="Change %"
                                  />
                                  <input
                                    type="text"
                                    value={metric.description}
                                    onChange={(e) => {
                                      const newMetrics = [...pageEditData.metrics]
                                      newMetrics[index] = { ...metric, description: e.target.value }
                                      updatePageField(['metrics'], newMetrics)
                                    }}
                                    className="px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary"
                                    placeholder="Description"
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Programs Page - Coming Soon Style */}
                    {selectedPage === 'programs' && pageEditData && (
                      <div className="space-y-8">
                        {/* Coming Soon Toggle */}
                        <div>
                          <h3 className="font-semibold text-lg text-gray-900 flex items-center gap-2 mb-4">
                            <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">2</span>
                            Coming Soon Banner
                          </h3>
                          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                            <label className="flex items-center gap-3 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={pageEditData.comingSoon?.enabled ?? true}
                                onChange={(e) => setPageEditData({
                                  ...pageEditData,
                                  comingSoon: { ...pageEditData.comingSoon, enabled: e.target.checked }
                                })}
                                className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                              />
                              <span className="font-medium">Show "Coming Soon" banner</span>
                            </label>
                            {pageEditData.comingSoon?.enabled && (
                              <div className="grid grid-cols-2 gap-3 mt-3">
                                <input
                                  type="text"
                                  value={pageEditData.comingSoon?.message || ''}
                                  onChange={(e) => setPageEditData({
                                    ...pageEditData,
                                    comingSoon: { ...pageEditData.comingSoon, message: e.target.value }
                                  })}
                                  className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                                  placeholder="Coming soon message"
                                />
                                <input
                                  type="text"
                                  value={pageEditData.comingSoon?.launchDate || ''}
                                  onChange={(e) => setPageEditData({
                                    ...pageEditData,
                                    comingSoon: { ...pageEditData.comingSoon, launchDate: e.target.value }
                                  })}
                                  className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                                  placeholder="Launch date (e.g., Spring 2026)"
                                />
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Program Tracks */}
                        <div>
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-lg text-gray-900 flex items-center gap-2">
                              <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">3</span>
                              Program Tracks ({pageEditData.tracks?.length || 0})
                            </h3>
                            <button
                              onClick={handleAddTrack}
                              className="btn btn-outline text-sm px-3 py-2"
                            >
                              <Plus className="w-4 h-4 mr-1" />
                              Add Track
                            </button>
                          </div>
                          
                          {(!pageEditData.tracks || pageEditData.tracks.length === 0) ? (
                            <div className="bg-gray-50 rounded-lg p-8 text-center">
                              <BookOpen className="w-12 h-12 mx-auto text-gray-300" />
                              <p className="mt-3 text-gray-500">No tracks yet. Add your first program track.</p>
                            </div>
                          ) : (
                            <div className="space-y-4">
                              {pageEditData.tracks.map((track: ProgramTrack) => (
                                <div key={track.id} className="bg-gray-50 rounded-lg p-4 space-y-3">
                                  <div className="flex items-start justify-between">
                                    <input
                                      type="text"
                                      value={track.name}
                                      onChange={(e) => handleUpdateTrack(track.id, 'name', e.target.value)}
                                      className="flex-1 px-3 py-2 border rounded-lg font-bold text-lg focus:ring-2 focus:ring-primary"
                                      placeholder="Track name"
                                    />
                                    <button
                                      onClick={() => handleRemoveTrack(track.id)}
                                      className="ml-2 p-2 text-red-500 hover:bg-red-50 rounded-lg"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                  <textarea
                                    value={track.description}
                                    onChange={(e) => handleUpdateTrack(track.id, 'description', e.target.value)}
                                    rows={2}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary resize-none"
                                    placeholder="Track description"
                                  />
                                  <div className="grid grid-cols-3 gap-3">
                                    <select
                                      value={track.icon}
                                      onChange={(e) => handleUpdateTrack(track.id, 'icon', e.target.value)}
                                      className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary text-sm"
                                    >
                                      <option value="book">📚 Book (AI Literacy)</option>
                                      <option value="wrench">🔧 Wrench (Applied AI)</option>
                                      <option value="chart">📊 Chart (Data Science)</option>
                                    </select>
                                    <input
                                      type="text"
                                      value={track.duration}
                                      onChange={(e) => handleUpdateTrack(track.id, 'duration', e.target.value)}
                                      className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary text-sm"
                                      placeholder="Duration (e.g., 6 weeks)"
                                    />
                                    <input
                                      type="text"
                                      value={track.hoursPerWeek}
                                      onChange={(e) => handleUpdateTrack(track.id, 'hoursPerWeek', e.target.value)}
                                      className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary text-sm"
                                      placeholder="Hours/week"
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* FAQs */}
                        <div>
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-lg text-gray-900 flex items-center gap-2">
                              <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">4</span>
                              FAQs ({pageEditData.faqs?.length || 0})
                            </h3>
                            <button
                              onClick={handleAddProgramFAQ}
                              className="btn btn-outline text-sm px-3 py-2"
                            >
                              <Plus className="w-4 h-4 mr-1" />
                              Add FAQ
                            </button>
                          </div>
                          
                          {(!pageEditData.faqs || pageEditData.faqs.length === 0) ? (
                            <div className="bg-gray-50 rounded-lg p-8 text-center">
                              <FileText className="w-12 h-12 mx-auto text-gray-300" />
                              <p className="mt-3 text-gray-500">No FAQs yet. Add frequently asked questions.</p>
                            </div>
                          ) : (
                            <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                              {pageEditData.faqs.map((faq: ProgramFAQ, index: number) => (
                                <div key={index} className="bg-white rounded-lg p-4 border space-y-2">
                                  <div className="flex items-start justify-between">
                                    <input
                                      type="text"
                                      value={faq.question}
                                      onChange={(e) => handleUpdateProgramFAQ(index, 'question', e.target.value)}
                                      className="flex-1 px-3 py-2 border rounded-lg font-medium focus:ring-2 focus:ring-primary"
                                      placeholder="Question"
                                    />
                                    <button
                                      onClick={() => handleRemoveProgramFAQ(index)}
                                      className="ml-2 p-2 text-red-500 hover:bg-red-50 rounded-lg"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                  <textarea
                                    value={faq.answer}
                                    onChange={(e) => handleUpdateProgramFAQ(index, 'answer', e.target.value)}
                                    rows={2}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary resize-none"
                                    placeholder="Answer"
                                  />
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Call to Action */}
                        <div>
                          <h3 className="font-semibold text-lg text-gray-900 flex items-center gap-2 mb-4">
                            <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">5</span>
                            Call to Action
                          </h3>
                          <div className="space-y-3 bg-gray-50 rounded-lg p-4">
                            <input
                              type="text"
                              value={pageEditData.callToAction?.title || ''}
                              onChange={(e) => setPageEditData({ 
                                ...pageEditData, 
                                callToAction: { ...pageEditData.callToAction, title: e.target.value } 
                              })}
                              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary font-medium"
                              placeholder="CTA Title"
                            />
                            <textarea
                              value={pageEditData.callToAction?.description || ''}
                              onChange={(e) => setPageEditData({ 
                                ...pageEditData, 
                                callToAction: { ...pageEditData.callToAction, description: e.target.value } 
                              })}
                              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary resize-none"
                              rows={2}
                              placeholder="CTA Description"
                            />
                            <div className="grid grid-cols-2 gap-3">
                              <input
                                type="text"
                                value={pageEditData.callToAction?.buttonText || ''}
                                onChange={(e) => setPageEditData({ 
                                  ...pageEditData, 
                                  callToAction: { ...pageEditData.callToAction, buttonText: e.target.value } 
                                })}
                                className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                                placeholder="Button Text"
                              />
                              <input
                                type="text"
                                value={pageEditData.callToAction?.buttonLink || ''}
                                onChange={(e) => setPageEditData({ 
                                  ...pageEditData, 
                                  callToAction: { ...pageEditData.callToAction, buttonLink: e.target.value } 
                                })}
                                className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                                placeholder="Button Link"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Events Page Editor */}
                    {selectedPage === 'events' && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-lg text-gray-900 flex items-center gap-2">
                            <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">1</span>
                            Events ({eventsData.length})
                          </h3>
                        </div>
                        
                        {eventsData.length === 0 ? (
                          <div className="bg-gray-50 rounded-lg p-8 text-center">
                            <Calendar className="w-12 h-12 mx-auto text-gray-300" />
                            <p className="mt-3 text-gray-500">No events yet. Upload event schedules using the AI Upload feature.</p>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {eventsData.map((event) => (
                              <div key={event.id} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                                <div className="flex items-start gap-4">
                                  <div className="w-16 h-16 rounded-lg bg-primary/10 text-primary flex flex-col items-center justify-center flex-shrink-0">
                                    <span className="text-xs font-medium">{event.date.split(' ')[0]}</span>
                                    <span className="text-lg font-bold">{event.date.split(' ')[1]}</span>
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold text-gray-900">{event.title}</h4>
                                    <p className="text-sm text-gray-600 line-clamp-2">{event.description}</p>
                                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                                      {event.time && <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {event.time}</span>}
                                      {event.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {event.location}</span>}
                                    </div>
                                  </div>
                                  <button
                                    onClick={() => setEditingItem({ ...event })}
                                    className="btn btn-outline text-sm px-3 py-2"
                                  >
                                    <Edit2 className="w-4 h-4 mr-1" />
                                    Edit
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Projects Page Editor */}
                    {selectedPage === 'projects' && pageEditData && (
                      <div className="space-y-8">
                        {/* Hero Section */}
                        <div>
                          <h3 className="font-semibold text-lg text-gray-900 flex items-center gap-2 mb-4">
                            <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">1</span>
                            Hero Section
                          </h3>
                          <div className="space-y-4">
                            <input
                              type="text"
                              value={pageEditData.hero?.title || ''}
                              onChange={(e) => setPageEditData({ ...pageEditData, hero: { ...pageEditData.hero, title: e.target.value } })}
                              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary text-lg font-semibold"
                              placeholder="Hero Title"
                            />
                            <textarea
                              value={pageEditData.hero?.subtitle || ''}
                              onChange={(e) => setPageEditData({ ...pageEditData, hero: { ...pageEditData.hero, subtitle: e.target.value } })}
                              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary resize-none"
                              rows={2}
                              placeholder="Hero Subtitle"
                            />
                          </div>
                        </div>

                        {/* Coming Soon Toggle */}
                        <div>
                          <h3 className="font-semibold text-lg text-gray-900 flex items-center gap-2 mb-4">
                            <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">2</span>
                            Coming Soon Banner
                          </h3>
                          <div className="space-y-4 bg-gray-50 rounded-lg p-4">
                            <label className="flex items-center gap-3 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={pageEditData.comingSoon?.enabled || false}
                                onChange={(e) => setPageEditData({ 
                                  ...pageEditData, 
                                  comingSoon: { ...pageEditData.comingSoon, enabled: e.target.checked } 
                                })}
                                className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                              />
                              <span className="font-medium">Show "Coming Soon" banner</span>
                            </label>
                            {pageEditData.comingSoon?.enabled && (
                              <div className="space-y-3 pl-8">
                                <input
                                  type="text"
                                  value={pageEditData.comingSoon?.message || ''}
                                  onChange={(e) => setPageEditData({ 
                                    ...pageEditData, 
                                    comingSoon: { ...pageEditData.comingSoon, message: e.target.value } 
                                  })}
                                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                                  placeholder="Coming soon message"
                                />
                                <input
                                  type="text"
                                  value={pageEditData.comingSoon?.launchDate || ''}
                                  onChange={(e) => setPageEditData({ 
                                    ...pageEditData, 
                                    comingSoon: { ...pageEditData.comingSoon, launchDate: e.target.value } 
                                  })}
                                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                                  placeholder="Launch date (e.g., Spring 2026)"
                                />
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Categories */}
                        <div>
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-lg text-gray-900 flex items-center gap-2">
                              <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">3</span>
                              Project Categories ({pageEditData.categories?.length || 0})
                            </h3>
                            <button
                              onClick={handleAddCategory}
                              className="btn btn-primary text-sm px-3 py-2"
                            >
                              <Plus className="w-4 h-4 mr-1" /> Add Category
                            </button>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            {(pageEditData.categories || []).map((cat: ProjectCategory) => (
                              <div key={cat.id} className="bg-gray-50 rounded-lg p-4">
                                <div className="flex items-start justify-between gap-2 mb-3">
                                  <input
                                    type="text"
                                    value={cat.name}
                                    onChange={(e) => handleUpdateCategory(cat.id, 'name', e.target.value)}
                                    className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary font-medium"
                                    placeholder="Category name"
                                  />
                                  <button
                                    onClick={() => handleRemoveCategory(cat.id)}
                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                                <textarea
                                  value={cat.description}
                                  onChange={(e) => handleUpdateCategory(cat.id, 'description', e.target.value)}
                                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary resize-none text-sm"
                                  rows={2}
                                  placeholder="Category description"
                                />
                                <div className="flex gap-2 mt-2">
                                  <select
                                    value={cat.icon}
                                    onChange={(e) => handleUpdateCategory(cat.id, 'icon', e.target.value)}
                                    className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary text-sm"
                                  >
                                    <option value="users">Users</option>
                                    <option value="book">Book</option>
                                    <option value="leaf">Leaf</option>
                                    <option value="heart">Heart</option>
                                  </select>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Projects List */}
                        <div>
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-lg text-gray-900 flex items-center gap-2">
                              <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">4</span>
                              Projects ({pageEditData.projects?.length || 0})
                            </h3>
                            <button
                              onClick={handleAddProject}
                              className="btn btn-primary text-sm px-3 py-2"
                            >
                              <Plus className="w-4 h-4 mr-1" /> Add Project
                            </button>
                          </div>
                          
                          {(pageEditData.projects?.length || 0) === 0 ? (
                            <div className="bg-gray-50 rounded-lg p-8 text-center">
                              <Briefcase className="w-12 h-12 mx-auto text-gray-300" />
                              <p className="mt-3 text-gray-500">No projects yet. Click "Add Project" to create one.</p>
                            </div>
                          ) : (
                            <div className="space-y-4">
                              {(pageEditData.projects || []).map((project: ProjectItem) => (
                                <div key={project.id} className="bg-gray-50 rounded-lg p-4">
                                  <div className="flex items-start justify-between gap-3 mb-3">
                                    <input
                                      type="text"
                                      value={project.title}
                                      onChange={(e) => handleUpdateProject(project.id, 'title', e.target.value)}
                                      className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary font-semibold"
                                      placeholder="Project title"
                                    />
                                    <button
                                      onClick={() => handleRemoveProject(project.id)}
                                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                  <textarea
                                    value={project.description}
                                    onChange={(e) => handleUpdateProject(project.id, 'description', e.target.value)}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary resize-none mb-3"
                                    rows={2}
                                    placeholder="Project description"
                                  />
                                  <div className="grid grid-cols-3 gap-3">
                                    <select
                                      value={project.category}
                                      onChange={(e) => handleUpdateProject(project.id, 'category', e.target.value)}
                                      className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary text-sm"
                                    >
                                      {(pageEditData.categories || []).map((cat: ProjectCategory) => (
                                        <option key={cat.id} value={cat.name}>{cat.name}</option>
                                      ))}
                                    </select>
                                    <select
                                      value={project.status}
                                      onChange={(e) => handleUpdateProject(project.id, 'status', e.target.value)}
                                      className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary text-sm"
                                    >
                                      <option value="planning">Planning</option>
                                      <option value="in-progress">In Progress</option>
                                      <option value="completed">Completed</option>
                                    </select>
                                    <input
                                      type="text"
                                      value={project.technologies?.join(', ') || ''}
                                      onChange={(e) => handleUpdateProject(project.id, 'technologies', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                                      className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary text-sm"
                                      placeholder="Tech (comma-separated)"
                                    />
                                  </div>
                                  {project.status === 'completed' && (
                                    <div className="grid grid-cols-2 gap-3 mt-3">
                                      <input
                                        type="text"
                                        value={project.impact || ''}
                                        onChange={(e) => handleUpdateProject(project.id, 'impact', e.target.value)}
                                        className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary text-sm"
                                        placeholder="Impact statement"
                                      />
                                      <input
                                        type="text"
                                        value={project.link || ''}
                                        onChange={(e) => handleUpdateProject(project.id, 'link', e.target.value)}
                                        className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary text-sm"
                                        placeholder="Project link"
                                      />
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Call to Action */}
                        <div>
                          <h3 className="font-semibold text-lg text-gray-900 flex items-center gap-2 mb-4">
                            <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">5</span>
                            Call to Action
                          </h3>
                          <div className="space-y-3 bg-gray-50 rounded-lg p-4">
                            <input
                              type="text"
                              value={pageEditData.callToAction?.title || ''}
                              onChange={(e) => setPageEditData({ 
                                ...pageEditData, 
                                callToAction: { ...pageEditData.callToAction, title: e.target.value } 
                              })}
                              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary font-medium"
                              placeholder="CTA Title"
                            />
                            <textarea
                              value={pageEditData.callToAction?.description || ''}
                              onChange={(e) => setPageEditData({ 
                                ...pageEditData, 
                                callToAction: { ...pageEditData.callToAction, description: e.target.value } 
                              })}
                              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary resize-none"
                              rows={2}
                              placeholder="CTA Description"
                            />
                            <div className="grid grid-cols-2 gap-3">
                              <input
                                type="text"
                                value={pageEditData.callToAction?.buttonText || ''}
                                onChange={(e) => setPageEditData({ 
                                  ...pageEditData, 
                                  callToAction: { ...pageEditData.callToAction, buttonText: e.target.value } 
                                })}
                                className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                                placeholder="Button Text"
                              />
                              <input
                                type="text"
                                value={pageEditData.callToAction?.buttonLink || ''}
                                onChange={(e) => setPageEditData({ 
                                  ...pageEditData, 
                                  callToAction: { ...pageEditData.callToAction, buttonLink: e.target.value } 
                                })}
                                className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                                placeholder="Button Link"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : selectedPage === 'events' ? (
                  <div className="p-6 space-y-8">
                    {/* Events Page Editor (fallback when pageEditData is null) */}
                    {selectedPage === 'events' && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-lg text-gray-900 flex items-center gap-2">
                            <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">1</span>
                            Events ({eventsData.length})
                          </h3>
                        </div>
                        
                        {eventsData.length === 0 ? (
                          <div className="bg-gray-50 rounded-lg p-8 text-center">
                            <Calendar className="w-12 h-12 mx-auto text-gray-300" />
                            <p className="mt-3 text-gray-500">No events yet. Upload event schedules using the AI Upload feature.</p>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {eventsData.map((event) => (
                              <div key={event.id} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                                <div className="flex items-start gap-4">
                                  <div className="w-16 h-16 rounded-lg bg-primary/10 text-primary flex flex-col items-center justify-center flex-shrink-0">
                                    <span className="text-xs font-medium">{event.date.split(' ')[0]}</span>
                                    <span className="text-lg font-bold">{event.date.split(' ')[1]}</span>
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold text-gray-900">{event.title}</h4>
                                    <p className="text-sm text-gray-600 line-clamp-2">{event.description}</p>
                                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                                      {event.time && <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {event.time}</span>}
                                      {event.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {event.location}</span>}
                                    </div>
                                  </div>
                                  <button
                                    onClick={() => setEditingItem({ ...event })}
                                    className="btn btn-outline text-sm px-3 py-2"
                                  >
                                    <Edit2 className="w-4 h-4 mr-1" />
                                    Edit
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-12 text-center">
                    <FileText className="w-12 h-12 mx-auto text-gray-300" />
                    <h3 className="mt-4 text-lg font-medium text-gray-900">No page data found</h3>
                    <p className="mt-2 text-gray-500">The page content file may be missing</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Uploader Modal */}
      <AIContentUploader
        isOpen={isUploaderOpen}
        onClose={() => setIsUploaderOpen(false)}
        onContentAdded={handleContentAdded}
      />

      {/* Edit Modal */}
      {editingItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-primary to-primary-dark text-white">
              <div className="flex items-center gap-3">
                <Edit2 className="w-6 h-6" />
                <div>
                  <h2 className="text-xl font-bold">Edit Content</h2>
                  <p className="text-sm text-white/80">Update event or gallery item details</p>
                </div>
              </div>
              <button 
                onClick={() => setEditingItem(null)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
                {editingItem.image && (
                  <div className="relative h-48 w-full rounded-lg overflow-hidden bg-gray-100">
                    <img 
                      src={editingItem.image} 
                      alt={editingItem.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    value={editingItem.title}
                    onChange={(e) => updateEditingItem('title', e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={editingItem.description}
                    onChange={(e) => updateEditingItem('description', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                      value={editingItem.category}
                      onChange={(e) => updateEditingItem('category', e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    >
                      <option value="events">Events</option>
                      <option value="projects">Projects</option>
                      <option value="about">About</option>
                      <option value="impact">Impact</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input
                      type="text"
                      value={editingItem.date}
                      onChange={(e) => updateEditingItem('date', e.target.value)}
                      placeholder="January 19, 2026"
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                    <input
                      type="text"
                      value={editingItem.time || ''}
                      onChange={(e) => updateEditingItem('time', e.target.value)}
                      placeholder="10:00 AM – 12:00 PM"
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <input
                      type="text"
                      value={editingItem.location || ''}
                      onChange={(e) => updateEditingItem('location', e.target.value)}
                      placeholder="Atlanta Central Library"
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Audience</label>
                  <input
                    type="text"
                    value={editingItem.audience || ''}
                    onChange={(e) => updateEditingItem('audience', e.target.value)}
                    placeholder="Students, educators, parents"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma-separated)</label>
                  <input
                    type="text"
                    value={editingItem.tags?.join(', ') || ''}
                    onChange={(e) => updateEditingItem('tags', e.target.value.split(',').map(t => t.trim()).filter(Boolean))}
                    placeholder="workshop, AI, beginner-friendly"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={editingItem.featured || false}
                    onChange={(e) => updateEditingItem('featured', e.target.checked)}
                    className="w-5 h-5 text-primary rounded focus:ring-primary"
                  />
                  <label htmlFor="featured" className="text-sm font-medium text-gray-700">
                    Mark as Featured (highlighted on the page)
                  </label>
                </div>

                {/* Gallery Section */}
                {editingItem.category === 'events' && (
                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between mb-3">
                      <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                        <GalleryHorizontalEnd className="w-4 h-4" />
                        Event Gallery
                      </label>
                      <button
                        type="button"
                        onClick={() => galleryInputRef.current?.click()}
                        disabled={isUploadingGallery}
                        className="px-3 py-1.5 text-sm bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors flex items-center gap-1 disabled:opacity-50"
                      >
                        {isUploadingGallery ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Plus className="w-4 h-4" />
                            Add Images
                          </>
                        )}
                      </button>
                      <input
                        ref={galleryInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleGalleryUpload}
                        className="hidden"
                      />
                    </div>
                    
                    {editingItem.gallery && editingItem.gallery.length > 0 ? (
                      <div className="grid grid-cols-3 gap-3">
                        {editingItem.gallery.map((img, index) => (
                          <div key={index} className="relative group aspect-square rounded-lg overflow-hidden bg-gray-100">
                            <img
                              src={img}
                              alt={`Gallery image ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <button
                                type="button"
                                onClick={() => removeGalleryImage(index)}
                                className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                                title="Remove image"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center">
                        <GalleryHorizontalEnd className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">No gallery images yet</p>
                        <p className="text-xs text-gray-400 mt-1">Click "Add Images" to upload photos from this event</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 border-t bg-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {saveMessage && (
                  <span className={`text-sm flex items-center gap-1 ${saveMessage.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
                    {saveMessage.includes('success') && <Check className="w-4 h-4" />}
                    {saveMessage}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleDelete(editingItem.id)}
                  className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
                <button
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {isSaving ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
