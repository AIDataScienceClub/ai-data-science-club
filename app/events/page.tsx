import type { Metadata } from 'next'
import Hero from '@/components/Hero'
import SectionHeader from '@/components/SectionHeader'
import { Calendar } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Events | Atlanta AI & Data Lab',
  description: 'Join us for workshops, sprints, showcases—spaces to learn, build, and celebrate.',
}

export default function Events() {
  const upcomingEvents = [
    {
      date: 'January 18, 2026',
      time: '10:00 AM – 12:00 PM',
      title: 'AI Ethics Workshop: Spotting Bias in Algorithms',
      location: 'Atlanta Central Library, Meeting Room 3A',
      audience: 'Students (all levels), parents, educators',
      description: 'Hands-on exercises with real datasets; group discussions on fairness and accountability.',
      rsvpLink: '/rsvp/ethics-jan',
    },
    {
      date: 'February 1, 2026',
      time: '1:00 PM – 4:00 PM',
      title: 'Spring Sprint Kickoff',
      location: 'Georgia Tech, Klaus Advanced Computing Building',
      audience: 'Returning members + new applicants (must apply by Jan 25)',
      description: 'Meet your project team, hear from community partners, set 10-week goals.',
      rsvpLink: '/get-involved#students',
    },
    {
      date: 'February 22, 2026',
      time: '11:00 AM – 1:00 PM',
      title: 'Data Visualization Workshop (Beginners Welcome)',
      location: 'Virtual (Zoom link sent upon RSVP)',
      audience: 'Students curious about dashboards, charts, storytelling with data',
      description: 'Learn Tableau basics; build your first interactive chart; portfolio tips.',
      rsvpLink: '/rsvp/dataviz-feb',
    },
    {
      date: 'March 8, 2026',
      time: '2:00 PM – 4:00 PM',
      title: 'Parent & Educator Open House',
      location: 'Atlanta AI & Data Lab HQ (address in confirmation email)',
      audience: 'Parents, teachers, guidance counselors',
      description: 'Tour our space, meet advisors, see projects in progress, ask anything.',
      rsvpLink: '/rsvp/openhouse-mar',
    },
    {
      date: 'March 15, 2026',
      time: '4:00 PM – 7:00 PM',
      title: 'Community Showcase: Spring Demo Day',
      location: 'Ponce City Market, Central Food Hall (public event)',
      audience: 'Everyone—students, families, partners, neighbors, press',
      description: 'Live demos of all spring projects; Q&A with teams; snacks; awards ceremony.',
      rsvpLink: '/rsvp/showcase-mar',
      featured: true,
    },
  ]

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
            {upcomingEvents.map((event, index) => (
              <div
                key={index}
                className={`rounded-lg p-6 shadow-card ${
                  event.featured ? 'bg-primary text-white' : 'bg-white'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center mb-2">
                      <Calendar className="w-5 h-5 mr-2" aria-hidden="true" />
                      <span className="font-bold">
                        {event.date} | {event.time}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold mb-2">{event.title}</h3>
                    <p className={`text-sm mb-3 ${event.featured ? 'text-white/80' : 'text-neutral-gray-600'}`}>
                      <strong>Location:</strong> {event.location}
                    </p>
                    <p className={`text-sm mb-3 ${event.featured ? 'text-white/80' : 'text-neutral-gray-600'}`}>
                      <strong>Who Should Attend:</strong> {event.audience}
                    </p>
                    <p className={event.featured ? 'text-white/90' : 'text-neutral-gray-700'}>
                      {event.description}
                    </p>
                  </div>
                </div>
                <a
                  href={event.rsvpLink}
                  className={`btn ${
                    event.featured
                      ? 'btn-secondary'
                      : 'btn-primary'
                  }`}
                >
                  RSVP (Free)
                </a>
              </div>
            ))}
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
