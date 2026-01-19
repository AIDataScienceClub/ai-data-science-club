import Hero from '@/components/Hero'
import SectionHeader from '@/components/SectionHeader'
import Card from '@/components/Card'
import Testimonial from '@/components/Testimonial'
import CTA from '@/components/CTA'
import { Calendar, Clock, MapPin, Rocket } from 'lucide-react'
import Link from 'next/link'
import { loadPagesData, loadEventsData, loadProgramsData, loadProjectsData, EventItem, ProgramsData, ProjectsData } from '@/lib/data-loader'

interface ImpactMetric {
  metric: string
  value: string
  change: string
  description: string
}

export const revalidate = 0

export default async function Home() {
  const pagesData = await loadPagesData()
  const pageData = pagesData?.home
  const impactData = pagesData?.impact
  const eventsDataRaw = await loadEventsData()
  const eventsData = eventsDataRaw?.events || []
  const programsData = await loadProgramsData()
  const projectsData = await loadProjectsData()
  
  // Get stats from Impact page if available, otherwise use home stats
  const impactMetrics = impactData?.metrics || []
  const studentsMetric = impactMetrics.find((m: ImpactMetric) => m.metric?.toLowerCase().includes('student'))
  const projectsMetric = impactMetrics.find((m: ImpactMetric) => m.metric?.toLowerCase().includes('project'))
  const partnersMetric = impactMetrics.find((m: ImpactMetric) => m.metric?.toLowerCase().includes('partner') || m.metric?.toLowerCase().includes('community'))
  const confidenceMetric = impactMetrics.find((m: ImpactMetric) => m.metric?.toLowerCase().includes('stem') || m.metric?.toLowerCase().includes('confidence'))
  
  const stats = [
    { label: 'students trained this year', value: studentsMetric?.value || pageData?.stats?.[0]?.value || '147' },
    { label: 'projects deployed', value: projectsMetric?.value || pageData?.stats?.[1]?.value || '21' },
    { label: 'partner organizations', value: partnersMetric?.value || pageData?.stats?.[2]?.value || '8' },
    { label: confidenceMetric?.description || 'report increased confidence', value: confidenceMetric?.value || '95%' },
  ]
  
  // Get upcoming events (first 3)
  const upcomingEvents = eventsData.slice(0, 3)

  // Check if programs/projects are coming soon
  const programsComingSoon = programsData?.comingSoon?.enabled && (!programsData?.programs || programsData.programs.length === 0)
  const projectsComingSoon = projectsData?.comingSoon?.enabled && (!projectsData?.projects || projectsData.projects.length === 0)
  
  // Get program tracks for display
  const programTracks = programsData?.tracks || []
  
  // Get project categories for display  
  const projectCategories = projectsData?.categories || []

  return (
    <>
      <Hero
        title={pageData?.hero?.title || "Learn AI. Build Solutions. Change Atlanta."}
        subtitle={pageData?.hero?.subtitle || "We're a student-led club helping high schoolers learn and apply AI and data science to solve real problems in our community—responsibly."}
        primaryCTA={{ label: 'Join Our Team', href: '/get-involved#students', ariaLabel: 'Apply to join as a student member' }}
        secondaryCTA={{ label: 'Explore Projects', href: '/projects', ariaLabel: 'View our project library' }}
      />

      {/* Mission Statement */}
      <section className="section-py bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-neutral-charcoal">
              "{pageData?.mission?.quote || "We help high schoolers learn and apply AI and data science to solve local problems—responsibly."}"
            </h2>
            <p className="text-lg text-neutral-gray-700">
              {pageData?.mission?.description || "At AI Data Science Club, we believe every student deserves access to cutting-edge technology education—not just lectures, but hands-on projects that make a difference. From mapping food deserts to building accessibility tools, our members turn curiosity into community impact."}
            </p>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="section-py bg-neutral-gray-100">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-neutral-gray-700 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="section-py bg-white">
        <div className="container-custom">
          <SectionHeader
            title="Upcoming Events"
            description="Join us for workshops, project sprints, and community showcases."
            align="center"
          />

          {upcomingEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {upcomingEvents.map((event: EventItem, index: number) => (
                <div key={event.id || index} className="bg-neutral-gray-100 rounded-lg p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-lg bg-primary/10 text-primary flex flex-col items-center justify-center flex-shrink-0">
                      <span className="text-xs font-medium">{event.date?.split(' ')[0]}</span>
                      <span className="text-lg font-bold">{event.date?.split(' ')[1]}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-neutral-charcoal mb-1">
                        {event.title}
                      </h3>
                      <p className="text-neutral-gray-600 text-sm mb-2">
                        {event.description}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-neutral-gray-500">
                        {event.time && <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {event.time}</span>}
                        {event.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {event.location}</span>}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-neutral-gray-100 rounded-xl max-w-2xl mx-auto">
              <Calendar className="w-12 h-12 mx-auto text-primary/40 mb-4" />
              <p className="text-neutral-gray-600">No upcoming events scheduled yet. Check back soon!</p>
            </div>
          )}

          <div className="text-center mt-8">
            <CTA label="View Full Calendar" href="/events" variant="primary" />
          </div>
        </div>
      </section>

      {/* Programs Preview */}
      <section className="section-py bg-neutral-gray-100">
        <div className="container-custom">
          <SectionHeader
            title={programsComingSoon ? "Programs Coming Soon" : "Our Programs"}
            description={programsComingSoon 
              ? `Three learning pathways launching ${programsData?.comingSoon?.launchDate || 'soon'}!`
              : "Three pathways designed for beginners, builders, and future AI leaders."
            }
            align="center"
          />

          {programTracks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {programTracks.map((track: any, index: number) => (
                <div key={index} className="bg-white rounded-xl p-6 text-center hover:shadow-lg transition-shadow">
                  <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4 text-3xl">
                    {track.icon === 'book' ? '📚' : track.icon === 'wrench' ? '🔧' : '📊'}
                  </div>
                  <h3 className="font-bold text-xl text-neutral-charcoal mb-2">{track.name}</h3>
                  <p className="text-neutral-gray-600 mb-4 text-sm">{track.description}</p>
                  <div className="text-xs text-neutral-gray-500">
                    {track.duration} • {track.hoursPerWeek}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Rocket className="w-12 h-12 mx-auto text-primary/40 mb-4" />
              <p className="text-neutral-gray-600">Program details coming soon!</p>
            </div>
          )}

          <div className="text-center mt-12">
            <CTA label={programsComingSoon ? "Get Notified" : "View All Programs"} href="/programs" variant="primary" />
          </div>
        </div>
      </section>

      {/* Projects Preview */}
      <section className="section-py bg-white">
        <div className="container-custom">
          <SectionHeader
            title={projectsComingSoon ? "Projects Coming Soon" : "Featured Projects"}
            description={projectsComingSoon 
              ? `Student-led projects launching ${projectsData?.comingSoon?.launchDate || 'soon'}!`
              : "Real problems. Real data. Real impact. See what our students have built."
            }
            align="center"
          />

          {projectCategories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {projectCategories.map((category: any, index: number) => (
                <div key={index} className="bg-white rounded-xl p-6 text-center hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4 text-2xl">
                    {category.icon === 'users' ? '👥' : category.icon === 'book' ? '📖' : category.icon === 'leaf' ? '🌱' : '❤️'}
                  </div>
                  <h3 className="font-bold text-neutral-charcoal mb-2">{category.name}</h3>
                  <p className="text-neutral-gray-600 text-sm">{category.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Rocket className="w-12 h-12 mx-auto text-primary/40 mb-4" />
              <p className="text-neutral-gray-600">Project details coming soon!</p>
            </div>
          )}

          <div className="text-center mt-12">
            <CTA label={projectsComingSoon ? "Learn More" : "View All Projects"} href="/projects" variant="ghost" />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-py bg-white">
        <div className="container-custom">
          <SectionHeader
            title="What People Say"
            description="Hear from our students, parents, and partners."
            align="center"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {(pageData?.testimonials && pageData.testimonials.length > 0) ? (
              pageData.testimonials.map((t: { quote: string; author: string; role: string }, i: number) => (
                <Testimonial key={i} quote={t.quote} author={t.author} role={t.role} />
              ))
            ) : (
              <>
                <Testimonial
                  quote="I never thought I could build an app that helps real people. This club changed how I see my future."
                  author="Maya S."
                  role="10th Grade, Applied AI Track"
                />
                <Testimonial
                  quote="As a parent, I was nervous about AI. But seeing the ethics training and mentorship structure gave me confidence."
                  author="Patricia L."
                  role="Parent of Member"
                />
              </>
            )}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="section-py bg-primary text-white">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {pageData?.callToAction?.title || "Ready to Make an Impact?"}
            </h2>
            <p className="text-lg mb-8 text-white/90">
              {pageData?.callToAction?.description || "Whether you're curious about AI or ready to lead a project, there's a place for you here."}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <CTA
                label={pageData?.callToAction?.primaryButton?.label || "Students: Apply Now"}
                href={pageData?.callToAction?.primaryButton?.href || "/get-involved#students"}
                variant="secondary"
                size="large"
              />
              <CTA
                label={pageData?.callToAction?.secondaryButton?.label || "Mentors: Share Your Expertise"}
                href={pageData?.callToAction?.secondaryButton?.href || "/get-involved#mentors"}
                variant="ghost"
                size="large"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
