import type { Metadata } from 'next'
import Hero from '@/components/Hero'
import SectionHeader from '@/components/SectionHeader'
import { BookOpen, Wrench, BarChart, Rocket, Clock, Users, GraduationCap, Lightbulb } from 'lucide-react'
import Link from 'next/link'
import { loadProgramsData } from '@/lib/data-loader'

export const metadata: Metadata = {
  title: 'Programs | Atlanta AI & Data Lab',
  description: 'Three pathways designed for beginners, builders, and future AI leaders. No prior experience required.',
}

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

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  book: BookOpen,
  wrench: Wrench,
  chart: BarChart,
}

export const revalidate = 0

export default async function Programs() {
  const data = await loadProgramsData() as ProgramsData | null
  
  const hero = data?.hero || { title: 'Programs That Meet You Where You Are', subtitle: 'Three pathways for beginners, builders, and future AI leaders.' }
  const comingSoon = data?.comingSoon || { enabled: true, message: 'Programs coming soon!', launchDate: 'Spring 2026' }
  const tracks = data?.tracks || []
  const programs = data?.programs || []
  const faqs = data?.faqs || []
  const cta = data?.callToAction || { title: 'Interested?', description: 'Sign up to be notified.', buttonText: 'Get Notified', buttonLink: '/get-involved' }

  const activePrograms = programs.filter(p => p.status === 'enrolling' || p.status === 'in-progress')

  return (
    <>
      <Hero
        title={hero.title}
        subtitle={hero.subtitle}
        primaryCTA={{ label: 'Get Notified', href: '/get-involved#students' }}
      />

      {/* Coming Soon Banner (if enabled and no active programs) */}
      {comingSoon.enabled && activePrograms.length === 0 && (
        <section className="py-12 bg-gradient-to-r from-primary to-primary-dark text-white">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full mb-6">
                <Rocket className="w-5 h-5" />
                <span className="font-medium">Launching {comingSoon.launchDate}</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                {comingSoon.message}
              </h2>
              <p className="text-white/80">
                We're finalizing our curriculum and partnerships. Sign up to be the first to know when enrollment opens!
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Program Tracks */}
      <section className="section-py bg-white">
        <div className="container-custom">
          <SectionHeader
            title="Three Learning Pathways"
            description="Each track is designed for different experience levels and interests. All lead to real skills and portfolio pieces."
            align="center"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            {tracks.map((track) => {
              const Icon = iconMap[track.icon] || BookOpen
              return (
                <div 
                  key={track.id} 
                  className="bg-neutral-gray-100 rounded-xl p-6 text-center hover:shadow-lg transition-shadow"
                >
                  <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-bold text-xl text-neutral-charcoal mb-2">{track.name}</h3>
                  <p className="text-neutral-gray-600 mb-4">{track.description}</p>
                  <div className="flex justify-center gap-4 text-sm text-neutral-gray-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {track.duration}
                    </span>
                    <span>{track.hoursPerWeek}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Active Programs (if any) */}
      {activePrograms.length > 0 && (
        <section className="section-py bg-neutral-gray-100">
          <div className="container-custom">
            <SectionHeader
              title="Current Programs"
              description="Enroll now or view ongoing cohorts"
              align="left"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
              {activePrograms.map((program) => (
                <div key={program.id} className="bg-white rounded-xl p-6 shadow-card">
                  <div className="flex items-start justify-between mb-4">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                      program.status === 'enrolling' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {program.status === 'enrolling' ? 'Now Enrolling' : 'In Progress'}
                    </span>
                    {program.startDate && (
                      <span className="text-sm text-neutral-gray-500">Starts {program.startDate}</span>
                    )}
                  </div>
                  <h3 className="font-bold text-lg text-neutral-charcoal mb-2">{program.title}</h3>
                  <p className="text-neutral-gray-600 mb-4">{program.summary}</p>
                  <div className="text-sm text-neutral-gray-500 mb-4">
                    <strong>Commitment:</strong> {program.commitment}
                  </div>
                  {program.status === 'enrolling' && (
                    <Link href="/get-involved#students" className="btn btn-primary w-full">
                      Apply Now
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* What to Expect (when no programs yet) */}
      {programs.length === 0 && (
        <section className="section-py bg-neutral-gray-100">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto">
              <SectionHeader
                title="What to Expect"
                description="Here's what our programs will offer"
                align="center"
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="bg-white rounded-xl p-6 text-center">
                  <div className="w-12 h-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-bold text-neutral-charcoal mb-2">Small Cohorts</h3>
                  <p className="text-sm text-neutral-gray-600">12-15 students per cohort for personalized attention and collaboration</p>
                </div>
                <div className="bg-white rounded-xl p-6 text-center">
                  <div className="w-12 h-12 mx-auto rounded-full bg-secondary/10 flex items-center justify-center mb-4">
                    <Lightbulb className="w-6 h-6 text-secondary" />
                  </div>
                  <h3 className="font-bold text-neutral-charcoal mb-2">Hands-On Learning</h3>
                  <p className="text-sm text-neutral-gray-600">Real projects, real data, real impact—not just lectures</p>
                </div>
                <div className="bg-white rounded-xl p-6 text-center">
                  <div className="w-12 h-12 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-4">
                    <GraduationCap className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="font-bold text-neutral-charcoal mb-2">Portfolio Outcomes</h3>
                  <p className="text-sm text-neutral-gray-600">Every student leaves with work to show colleges and employers</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      {faqs.length > 0 && (
        <section className="section-py bg-white">
          <div className="container-custom">
            <SectionHeader
              title="Frequently Asked Questions"
              description="Have questions? We've got answers."
              align="center"
            />

            <div className="max-w-3xl mx-auto space-y-6 mt-8">
              {faqs.map((faq: FAQ, index: number) => (
                <div key={index} className="bg-neutral-gray-100 rounded-lg p-6">
                  <h3 className="font-bold text-lg mb-3 text-neutral-charcoal">
                    {faq.question}
                  </h3>
                  <p className="text-neutral-gray-700">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Call to Action */}
      <section className="section-py bg-primary text-white">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">{cta.title}</h2>
            <p className="text-lg mb-8 text-white/90">
              {cta.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/get-involved#students" className="btn btn-secondary btn-large">
                Sign Up for Updates
              </Link>
              <Link href={cta.buttonLink} className="btn bg-white/20 hover:bg-white/30 text-white btn-large">
                {cta.buttonText}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
