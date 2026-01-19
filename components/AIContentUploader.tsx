'use client'

import { useState, useCallback } from 'react'
import { Upload, X, Sparkles, Check, Edit2, Loader2, Image as ImageIcon, AlertCircle } from 'lucide-react'

interface AnalysisResult {
  category: 'events' | 'projects' | 'about' | 'impact'
  title: string
  description: string
  suggestedDate: string | null
  tags: string[]
  audience: string
  confidence: number
}

interface UploadItem {
  id: string
  file: File
  preview: string
  status: 'pending' | 'analyzing' | 'analyzed' | 'uploading' | 'complete' | 'error'
  analysis?: AnalysisResult
  editedAnalysis?: AnalysisResult
  error?: string
}

interface AIContentUploaderProps {
  isOpen: boolean
  onClose: () => void
  onContentAdded?: () => void
}

export default function AIContentUploader({ isOpen, onClose, onContentAdded }: AIContentUploaderProps) {
  const [uploads, setUploads] = useState<UploadItem[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'))
    addFiles(files)
  }, [])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    addFiles(files)
    e.target.value = '' // Reset input
  }, [])

  const addFiles = (files: File[]) => {
    const newUploads: UploadItem[] = files.map(file => ({
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      file,
      preview: URL.createObjectURL(file),
      status: 'pending'
    }))
    setUploads(prev => [...prev, ...newUploads])
    
    // Auto-analyze each new file
    newUploads.forEach(upload => analyzeImage(upload.id, upload.file))
  }

  const analyzeImage = async (id: string, file: File) => {
    setUploads(prev => prev.map(u => 
      u.id === id ? { ...u, status: 'analyzing' } : u
    ))

    try {
      const formData = new FormData()
      formData.append('image', file)

      const response = await fetch('/api/analyze-image', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (data.success) {
        setUploads(prev => prev.map(u => 
          u.id === id ? { 
            ...u, 
            status: 'analyzed', 
            analysis: data.analysis,
            editedAnalysis: { ...data.analysis }
          } : u
        ))
      } else {
        throw new Error(data.error || 'Analysis failed')
      }
    } catch (error) {
      setUploads(prev => prev.map(u => 
        u.id === id ? { 
          ...u, 
          status: 'error', 
          error: error instanceof Error ? error.message : 'Unknown error'
        } : u
      ))
    }
  }

  const updateEditedAnalysis = (id: string, field: keyof AnalysisResult, value: any) => {
    setUploads(prev => prev.map(u => 
      u.id === id && u.editedAnalysis ? {
        ...u,
        editedAnalysis: { ...u.editedAnalysis, [field]: value }
      } : u
    ))
  }

  const removeUpload = (id: string) => {
    setUploads(prev => {
      const upload = prev.find(u => u.id === id)
      if (upload) URL.revokeObjectURL(upload.preview)
      return prev.filter(u => u.id !== id)
    })
  }

  const publishItem = async (id: string) => {
    const upload = uploads.find(u => u.id === id)
    if (!upload || !upload.editedAnalysis) return

    setUploads(prev => prev.map(u => 
      u.id === id ? { ...u, status: 'uploading' } : u
    ))

    try {
      const formData = new FormData()
      formData.append('image', upload.file)
      formData.append('contentData', JSON.stringify({
        ...upload.editedAnalysis,
        date: upload.editedAnalysis.suggestedDate || new Date().toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric', 
          year: 'numeric'
        })
      }))

      const response = await fetch('/api/upload-content', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (data.success) {
        setUploads(prev => prev.map(u => 
          u.id === id ? { ...u, status: 'complete' } : u
        ))
        onContentAdded?.()
      } else {
        throw new Error(data.error || 'Upload failed')
      }
    } catch (error) {
      setUploads(prev => prev.map(u => 
        u.id === id ? { 
          ...u, 
          status: 'error',
          error: error instanceof Error ? error.message : 'Upload failed'
        } : u
      ))
    }
  }

  const publishAllApproved = async () => {
    const analyzedUploads = uploads.filter(u => u.status === 'analyzed')
    for (const upload of analyzedUploads) {
      await publishItem(upload.id)
    }
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      events: 'bg-blue-100 text-blue-800',
      projects: 'bg-purple-100 text-purple-800',
      about: 'bg-green-100 text-green-800',
      impact: 'bg-orange-100 text-orange-800'
    }
    return colors[category] || 'bg-gray-100 text-gray-800'
  }

  const getCategoryIcon = (category: string) => {
    return category.charAt(0).toUpperCase() + category.slice(1)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-primary to-primary-dark text-white">
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6" />
            <div>
              <h2 className="text-xl font-bold">AI Content Uploader</h2>
              <p className="text-sm text-white/80">Drop images and let AI categorize them</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Drop Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`
              border-2 border-dashed rounded-xl p-8 text-center transition-all
              ${isDragging 
                ? 'border-primary bg-primary/5 scale-[1.02]' 
                : 'border-gray-300 hover:border-primary/50 hover:bg-gray-50'
              }
            `}
          >
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <Upload className={`w-12 h-12 mx-auto mb-4 ${isDragging ? 'text-primary' : 'text-gray-400'}`} />
              <p className="text-lg font-medium text-gray-700">
                {isDragging ? 'Drop images here' : 'Drag & drop images or click to browse'}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Supports JPG, PNG, GIF, WebP
              </p>
            </label>
          </div>

          {/* Upload Items */}
          {uploads.length > 0 && (
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-700">
                  {uploads.length} image{uploads.length !== 1 ? 's' : ''} queued
                </h3>
                {uploads.some(u => u.status === 'analyzed') && (
                  <button
                    onClick={publishAllApproved}
                    className="btn btn-primary btn-small"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Publish All Approved
                  </button>
                )}
              </div>

              {uploads.map(upload => (
                <div 
                  key={upload.id}
                  className={`
                    border rounded-xl p-4 transition-all
                    ${upload.status === 'complete' ? 'bg-green-50 border-green-200' : ''}
                    ${upload.status === 'error' ? 'bg-red-50 border-red-200' : ''}
                  `}
                >
                  <div className="flex gap-4">
                    {/* Image Preview */}
                    <div className="relative w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                      <img 
                        src={upload.preview} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                      />
                      {upload.status === 'analyzing' && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <Loader2 className="w-8 h-8 text-white animate-spin" />
                        </div>
                      )}
                      {upload.status === 'complete' && (
                        <div className="absolute inset-0 bg-green-500/50 flex items-center justify-center">
                          <Check className="w-8 h-8 text-white" />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      {upload.status === 'pending' && (
                        <div className="flex items-center gap-2 text-gray-500">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Waiting to analyze...</span>
                        </div>
                      )}

                      {upload.status === 'analyzing' && (
                        <div className="flex items-center gap-2 text-primary">
                          <Sparkles className="w-4 h-4 animate-pulse" />
                          <span>AI is analyzing your image...</span>
                        </div>
                      )}

                      {upload.status === 'error' && (
                        <div className="flex items-center gap-2 text-red-600">
                          <AlertCircle className="w-4 h-4" />
                          <span>{upload.error}</span>
                          <button 
                            onClick={() => analyzeImage(upload.id, upload.file)}
                            className="text-sm underline hover:no-underline ml-2"
                          >
                            Retry
                          </button>
                        </div>
                      )}

                      {upload.status === 'uploading' && (
                        <div className="flex items-center gap-2 text-primary">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Publishing content...</span>
                        </div>
                      )}

                      {upload.status === 'complete' && (
                        <div className="flex items-center gap-2 text-green-600">
                          <Check className="w-4 h-4" />
                          <span>Published to {upload.editedAnalysis?.category}!</span>
                        </div>
                      )}

                      {(upload.status === 'analyzed' && upload.editedAnalysis) && (
                        <div className="space-y-3">
                          {/* Category Badge */}
                          <div className="flex items-center gap-2">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(upload.editedAnalysis.category)}`}>
                              📂 {getCategoryIcon(upload.editedAnalysis.category)}
                            </span>
                            <span className="text-sm text-gray-500">
                              {Math.round((upload.editedAnalysis.confidence || 0) * 100)}% confidence
                            </span>
                          </div>

                          {/* Editable Fields */}
                          {editingId === upload.id ? (
                            <div className="space-y-2">
                              <input
                                type="text"
                                value={upload.editedAnalysis.title}
                                onChange={(e) => updateEditedAnalysis(upload.id, 'title', e.target.value)}
                                className="w-full px-3 py-2 border rounded-lg text-sm font-medium"
                                placeholder="Title"
                              />
                              <textarea
                                value={upload.editedAnalysis.description}
                                onChange={(e) => updateEditedAnalysis(upload.id, 'description', e.target.value)}
                                className="w-full px-3 py-2 border rounded-lg text-sm resize-none"
                                rows={2}
                                placeholder="Description"
                              />
                              <select
                                value={upload.editedAnalysis.category}
                                onChange={(e) => updateEditedAnalysis(upload.id, 'category', e.target.value)}
                                className="px-3 py-2 border rounded-lg text-sm"
                              >
                                <option value="events">Events</option>
                                <option value="projects">Projects</option>
                                <option value="about">About</option>
                                <option value="impact">Impact</option>
                              </select>
                              <button
                                onClick={() => setEditingId(null)}
                                className="text-sm text-primary hover:underline"
                              >
                                Done editing
                              </button>
                            </div>
                          ) : (
                            <>
                              <h4 className="font-semibold text-gray-900">{upload.editedAnalysis.title}</h4>
                              <p className="text-sm text-gray-600 line-clamp-2">{upload.editedAnalysis.description}</p>
                              {upload.editedAnalysis.tags && (
                                <div className="flex flex-wrap gap-1">
                                  {upload.editedAnalysis.tags.map((tag, i) => (
                                    <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </>
                          )}

                          {/* Actions */}
                          <div className="flex items-center gap-2 pt-2">
                            <button
                              onClick={() => setEditingId(editingId === upload.id ? null : upload.id)}
                              className="flex items-center gap-1 px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-50"
                            >
                              <Edit2 className="w-3 h-3" />
                              Edit
                            </button>
                            <button
                              onClick={() => publishItem(upload.id)}
                              className="flex items-center gap-1 px-3 py-1.5 text-sm bg-primary text-white rounded-lg hover:bg-primary-dark"
                            >
                              <Check className="w-3 h-3" />
                              Approve & Publish
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Remove Button */}
                    {upload.status !== 'complete' && upload.status !== 'uploading' && (
                      <button
                        onClick={() => removeUpload(upload.id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors self-start"
                        aria-label="Remove"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {uploads.length === 0 && (
            <div className="mt-8 text-center text-gray-500">
              <ImageIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p>No images uploaded yet</p>
              <p className="text-sm mt-1">Upload images to let AI categorize and describe them</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50 flex items-center justify-between text-sm text-gray-500">
          <span>
            AI will automatically detect content type and generate descriptions
          </span>
          <button onClick={onClose} className="btn btn-ghost btn-small">
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
