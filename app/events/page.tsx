import type { Metadata } from 'next'
import Hero from '@/components/Hero'
import SectionHeader from '@/components/SectionHeader'
import { Calendar, Sparkles } from 'lucide-react'
import { readFile } from 'fs/promises'
import path from 'path'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Events | Atlanta AI & Data Lab',
  description: 'Join us for workshops, sprints, showcases—spaces to learn, build, and celebrate.',
}

interface EventItem {
  id: string
  date: string
  time?: string
  title: string
  location?: string
  audience?: string
  description: string
  image?: string | null
  gallery?: string[]
  tags?: string[]
  featured?: boolean
  aiGenerated?: boolean
  rsvpLink?: string
}

interface GalleryItem {
  id: string
  title: string
  image: string
  relatedEvent?: string
  aiGenerated?: boolean
}

async function getEvents(): Promise<{ events: EventItem[], gallery: GalleryItem[] }> {
  try {
    const dataPath = path.join(process.cwd(), 'data', 'events.json')
    const fileContent = await readFile(dataPath, 'utf-8')
    const data = JSON.parse(fileContent)
    return { events: data.events || [], gallery: data.gallery || [] }
  } catch (error) {
    console.error('Failed to load events:', error)
    return { events: [], gallery: [] }
  }
}

export const revalidate = 0 // Always fetch fresh data

export default async function Events() {
  const { events, gallery } = await getEvents()
  
  // Sort by date, featured first
  const sortedEvents = events.sort((a, b) => {
    if (a.featured && !b.featured) return -1
    if (!a.featured && b.featured) return 1
    return new Date(a.date).getTime() - new Date(b.date).getTime()
  })
  
  // Helper to get gallery images for an event (combines both inline gallery and related gallery items)
  const getEventGallery = (event: EventItem) => {
    // Get gallery items from the separate gallery array
    const relatedGallery = gallery.filter(g => g.relatedEvent === event.id)
    
    // Get inline gallery paths from the event itself
    const inlineGallery = (event.gallery || []).map((path, index) => ({
      id: `${event.id}-gallery-${index}`,
      title: `${event.title} Photo ${index + 1}`,
      image: path,
      aiGenerated: event.aiGenerated
    }))
    
    return [...inlineGallery, ...relatedGallery]
  }

  return (
    <>
      <Hero
        title="Join Us IRL"
        subtitle="Workshops, sprints, showcases—spaces to learn, build, and celebrate. Everyone's welcome."
        primaryCTA={{ label: 'Subscribe to Events', href: '/subscribe' }}
      />

      {/* Upcoming Events */}
      <section className="section-py bg-white">
        <div className="container-custom">
          <SectionHeader
            title="Upcoming Events"
            description="Mark your calendar for the next 3 months."
            align="center"
          />

          <div className="max-w-4xl mx-auto space-y-6">
            {sortedEvents.length === 0 ? (
              <div className="text-center py-12 text-neutral-gray-600">
                <p>No events scheduled yet. Check back soon!</p>
              </div>
            ) : (
              sortedEvents.map((event) => (
                <div
                  key={event.id}
                  className={`rounded-lg overflow-hidden shadow-card ${
                    event.featured ? 'bg-primary text-white' : 'bg-white'
                  }`}
                >
                  {/* Event Image */}
                  {event.image && (
                    <div className="relative h-48 w-full">
                      <Image
                        src={event.image}
                        alt={event.title}
                        fill
                        className="object-cover"
                      />
                      {event.aiGenerated && (
                        <span className="absolute top-3 right-3 px-2 py-1 bg-primary text-white text-xs rounded-full flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          AI Added
                        </span>
                      )}
                    </div>
                  )}
                  
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center mb-2 flex-wrap gap-2">
                          <div className="flex items-center">
                            <Calendar className="w-5 h-5 mr-2" aria-hidden="true" />
                            <span className="font-bold">
                              {event.date}{event.time ? ` | ${event.time}` : ''}
                            </span>
                          </div>
                          {event.aiGenerated && !event.image && (
                            <span className="px-2 py-0.5 bg-primary/20 text-primary text-xs rounded-full flex items-center gap-1">
                              <Sparkles className="w-3 h-3" />
                              AI Added
                            </span>
                          )}
                        </div>
                        <h3 className="text-2xl font-bold mb-2">{event.title}</h3>
                        {event.location && (
                          <p className={`text-sm mb-3 ${event.featured ? 'text-white/80' : 'text-neutral-gray-600'}`}>
                            <strong>Location:</strong> {event.location}
                          </p>
                        )}
                        {event.audience && (
                          <p className={`text-sm mb-3 ${event.featured ? 'text-white/80' : 'text-neutral-gray-600'}`}>
                            <strong>Who Should Attend:</strong> {event.audience}
                          </p>
                        )}
                        <p className={event.featured ? 'text-white/90' : 'text-neutral-gray-700'}>
                          {event.description}
                        </p>
                        
                        {/* Tags */}
                        {event.tags && event.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-4">
                            {event.tags.map((tag, i) => (
                              <span 
                                key={i} 
                                className={`px-2 py-1 text-xs rounded-full ${
                                  event.featured 
                                    ? 'bg-white/20 text-white' 
                                    : 'bg-primary/10 text-primary'
                                }`}
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                        
                        {/* Event Gallery */}
                        {(() => {
                          const eventGallery = getEventGallery(event);
                          if (eventGallery.length === 0) return null;
                          return (
                            <div className="mt-6 pt-4 border-t border-neutral-gray-200">
                              <h4 className={`text-sm font-semibold mb-3 ${event.featured ? 'text-white' : 'text-neutral-charcoal'}`}>
                                📸 Event Photos ({eventGallery.length})
                              </h4>
                              <div className="grid grid-cols-3 gap-2">
                                {eventGallery.map((photo) => (
                                  <div key={photo.id} className="relative aspect-square rounded-lg overflow-hidden group">
                                    <Image
                                      src={photo.image}
                                      alt={photo.title}
                                      fill
                                      className="object-cover transition-transform group-hover:scale-105"
                                    />
                                    {photo.aiGenerated && (
                                      <span className="absolute top-1 right-1 p-1 bg-primary text-white rounded-full">
                                        <Sparkles className="w-2 h-2" />
                                      </span>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                    <a
                      href={event.rsvpLink || '/get-involved'}
                      className={`btn ${
                        event.featured
                          ? 'btn-secondary'
                          : 'btn-primary'
                      }`}
                    >
                      RSVP (Free)
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Accessibility Info */}
      <section className="section-py bg-neutral-gray-100">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-neutral-charcoal">
              Event Accessibility
            </h2>

            <div className="bg-white rounded-lg p-6 shadow-card mb-6">
              <h3 className="font-bold text-lg mb-3 text-primary">
                All In-Person Events Include:
              </h3>
              <ul className="space-y-2 text-neutral-gray-700">
                <li>• Wheelchair accessible venues</li>
                <li>• ASL interpretation available (request 1 week in advance)</li>
                <li>• Closed captions for presentations</li>
                <li>• Quiet room for sensory breaks</li>
                <li>• Snacks accommodate common dietary restrictions (labeled)</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-card">
              <h3 className="font-bold text-lg mb-3 text-primary">
                Virtual Events Include:
              </h3>
              <ul className="space-y-2 text-neutral-gray-700">
                <li>• Closed captions enabled</li>
                <li>• Recordings posted within 48 hours</li>
                <li>• Chat moderation for safe Q&A</li>
              </ul>
            </div>

            <p className="mt-6 text-neutral-gray-700">
              <strong>Need accommodations?</strong> Email{' '}
              <a href="mailto:events@atl-ai-lab.org" className="text-primary hover:underline">
                events@atl-ai-lab.org
              </a>{' '}
              at least 1 week before the event.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-py bg-primary text-white">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Don't Miss Out</h2>
            <p className="text-lg mb-8 text-white/90">
              Add us to your calendar and get notified about new events.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/subscribe" className="btn btn-secondary btn-large">
                Subscribe to Event Updates
              </a>
              <a href="https://calendar.google.com/example" target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-large text-white border-white hover:bg-white hover:text-primary">
                View Full Calendar
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
