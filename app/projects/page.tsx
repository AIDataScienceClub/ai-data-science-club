import type { Metadata } from 'next'
import Hero from '@/components/Hero'
import SectionHeader from '@/components/SectionHeader'
import { Sparkles, Users, BookOpen, Leaf, Heart, Lightbulb, Rocket, Clock, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { loadProjectsData } from '@/lib/data-loader'

export const metadata: Metadata = {
  title: 'Projects | Atlanta AI & Data Lab',
  description: 'Real problems. Real data. Real impact. Explore what our students have built.',
}

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

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  users: Users,
  book: BookOpen,
  leaf: Leaf,
  heart: Heart,
}

export const revalidate = 0

export default async function Projects() {
  const data = await loadProjectsData() as ProjectsData | null
  
  const hero = data?.hero || { title: 'Projects That Matter', subtitle: 'Real problems. Real data. Real impact.' }
  const comingSoon = data?.comingSoon || { enabled: true, message: 'Projects coming soon!', launchDate: 'Spring 2026' }
  const categories = data?.categories || []
  const projects = data?.projects || []
  const cta = data?.callToAction || { title: 'Have an Idea?', description: 'Share it with us!', buttonText: 'Submit', buttonLink: '/get-involved' }

  const completedProjects = projects.filter(p => p.status === 'completed')
  const activeProjects = projects.filter(p => p.status === 'in-progress')

  return (
    <>
      <Hero
        title={hero.title}
        subtitle={hero.subtitle}
        primaryCTA={{ label: 'Join a Project Team', href: '/get-involved#students' }}
      />

      {/* Coming Soon Banner (if enabled and no completed projects) */}
      {comingSoon.enabled && completedProjects.length === 0 && (
        <section className="py-12 bg-gradient-to-r from-primary to-primary-dark text-white">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full mb-6">
                <Rocket className="w-5 h-5" />
                <span className="font-medium">Coming {comingSoon.launchDate}</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                {comingSoon.message}
              </h2>
              <p className="text-white/80">
                Our student teams are hard at work on exciting projects. Sign up to be notified when we launch!
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Project Categories */}
      <section className="section-py bg-white">
        <div className="container-custom">
          <SectionHeader
            title="What We Build"
            description="Our projects span multiple domains, all focused on creating positive impact in our community."
            align="center"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
            {categories.map((category) => {
              const Icon = iconMap[category.icon] || Lightbulb
              return (
                <div 
                  key={category.id} 
                  className="bg-neutral-gray-100 rounded-xl p-6 text-center hover:shadow-lg transition-shadow"
                >
                  <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-bold text-lg text-neutral-charcoal mb-2">{category.name}</h3>
                  <p className="text-sm text-neutral-gray-600">{category.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Active Projects (if any) */}
      {activeProjects.length > 0 && (
        <section className="section-py bg-neutral-gray-100">
          <div className="container-custom">
            <SectionHeader
              title="Currently In Progress"
              description="Projects our student teams are actively working on"
              align="left"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
              {activeProjects.map((project) => (
                <div key={project.id} className="bg-white rounded-xl overflow-hidden shadow-card">
                  {project.image ? (
                    <div className="relative h-48">
                      <Image src={project.image} alt={project.title} fill className="object-cover" />
                      <div className="absolute top-3 right-3 px-3 py-1 bg-yellow-500 text-white text-xs font-medium rounded-full flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        In Progress
                      </div>
                    </div>
                  ) : (
                    <div className="h-48 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                      <Lightbulb className="w-16 h-16 text-primary/40" />
                    </div>
                  )}
                  <div className="p-6">
                    <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full mb-3">
                      {project.category}
                    </span>
                    <h3 className="font-bold text-lg text-neutral-charcoal mb-2">{project.title}</h3>
                    <p className="text-sm text-neutral-gray-600 mb-4">{project.description}</p>
                    {project.technologies && project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {project.technologies.map((tech, i) => (
                          <span key={i} className="px-2 py-0.5 bg-neutral-gray-100 text-neutral-gray-600 text-xs rounded">
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Completed Projects (if any) */}
      {completedProjects.length > 0 && (
        <section className="section-py bg-white">
          <div className="container-custom">
            <SectionHeader
              title="Completed Projects"
              description="See the impact our students have made"
              align="left"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
              {completedProjects.map((project) => (
                <div key={project.id} className="bg-neutral-gray-100 rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                  {project.image ? (
                    <div className="relative h-48">
                      <Image src={project.image} alt={project.title} fill className="object-cover" />
                      <div className="absolute top-3 right-3 px-3 py-1 bg-green-500 text-white text-xs font-medium rounded-full">
                        Completed
                      </div>
                    </div>
                  ) : (
                    <div className="h-48 bg-gradient-to-br from-green-100 to-primary/10 flex items-center justify-center">
                      <Sparkles className="w-16 h-16 text-green-500/40" />
                    </div>
                  )}
                  <div className="p-6">
                    <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full mb-3">
                      {project.category}
                    </span>
                    <h3 className="font-bold text-lg text-neutral-charcoal mb-2">{project.title}</h3>
                    <p className="text-sm text-neutral-gray-600 mb-4">{project.description}</p>
                    {project.impact && (
                      <p className="text-sm text-green-600 font-medium mb-4">
                        📊 {project.impact}
                      </p>
                    )}
                    {project.link && (
                      <Link href={project.link} className="inline-flex items-center gap-1 text-primary hover:underline text-sm font-medium">
                        View Project <ArrowRight className="w-4 h-4" />
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Empty State / Coming Soon Details */}
      {projects.length === 0 && (
        <section className="section-py bg-neutral-gray-100">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto">
              <SectionHeader
                title="What to Expect"
                description="Here's what our student-led projects will look like"
                align="center"
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="bg-white rounded-xl p-6 text-center">
                  <div className="w-12 h-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-bold text-neutral-charcoal mb-2">Team-Based</h3>
                  <p className="text-sm text-neutral-gray-600">4-6 students collaborate on each project with mentor guidance</p>
                </div>
                <div className="bg-white rounded-xl p-6 text-center">
                  <div className="w-12 h-12 mx-auto rounded-full bg-secondary/10 flex items-center justify-center mb-4">
                    <Lightbulb className="w-6 h-6 text-secondary" />
                  </div>
                  <h3 className="font-bold text-neutral-charcoal mb-2">Real Impact</h3>
                  <p className="text-sm text-neutral-gray-600">Projects address actual community needs identified by local partners</p>
                </div>
                <div className="bg-white rounded-xl p-6 text-center">
                  <div className="w-12 h-12 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-4">
                    <Rocket className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="font-bold text-neutral-charcoal mb-2">10-Week Sprints</h3>
                  <p className="text-sm text-neutral-gray-600">Intensive development cycles culminating in public demos</p>
                </div>
              </div>
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
                Join a Project Team
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
