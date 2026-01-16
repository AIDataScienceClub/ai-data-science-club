import Hero from '@/components/Hero'
import SectionHeader from '@/components/SectionHeader'
import Card from '@/components/Card'
import Testimonial from '@/components/Testimonial'
import CTA from '@/components/CTA'
import { Calendar } from 'lucide-react'

export default function Home() {
  const stats = [
    { label: 'students trained this year', value: '147' },
    { label: 'projects deployed', value: '21' },
    { label: 'partner organizations', value: '8' },
    { label: 'report increased confidence', value: '95%' },
  ]

  const featuredProjects = [
    {
      title: 'Community Food Access Map',
      summary: 'Interactive tool showing SNAP-accepting stores and food pantries across Atlanta\'s food deserts. Built in partnership with Atlanta Community Food Bank.',
      tag: 'Community',
      image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&h=600&fit=crop',
      href: '/projects/community-food-access-map',
    },
    {
      title: 'School Attendance Insights Dashboard',
      summary: 'Data visualization helping counselors identify at-risk students earlier. Pilot program at 2 local high schools.',
      tag: 'School Operations',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
      href: '/projects/attendance-dashboard',
    },
    {
      title: 'Air Quality Monitor Network',
      summary: 'Low-cost sensors deployed in 5 neighborhoods; real-time data shared with residents and city planners.',
      tag: 'Environment',
      image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop',
      href: '/projects/air-quality-monitors',
    },
  ]

  const upcomingEvents = [
    { date: 'Jan 18', title: 'AI Ethics Workshop', description: 'Learn to spot bias in algorithms' },
    { date: 'Feb 1', title: 'Spring Sprint Kickoff', description: 'Join a 10-week project team' },
    { date: 'Mar 15', title: 'Community Showcase', description: 'See our projects in action' },
  ]

  return (
    <>
      <Hero
        title="Learn AI. Build Solutions. Change Atlanta."
        subtitle="We're a student-led nonprofit helping high schoolers learn and apply AI and data science to solve real problems in our community—responsibly."
        primaryCTA={{ label: 'Join Our Team', href: '/get-involved#students', ariaLabel: 'Apply to join as a student member' }}
        secondaryCTA={{ label: 'Explore Projects', href: '/projects', ariaLabel: 'View our project library' }}
      />

      {/* Mission Statement */}
      <section className="section-py bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-neutral-charcoal">
              "We help high schoolers learn and apply AI and data science to solve local problems—responsibly."
            </h2>
            <p className="text-lg text-neutral-gray-700">
              At AI Data Science Club, we believe every student deserves access to cutting-edge technology education—not just lectures, but hands-on projects that make a difference. From mapping food deserts to building accessibility tools, our members turn curiosity into community impact.
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

      {/* Featured Projects */}
      <section className="section-py bg-white">
        <div className="container-custom">
          <SectionHeader
            title="Featured Projects"
            description="Real problems. Real data. Real impact. See what our students have built."
            align="center"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProjects.map((project, index) => (
              <Card
                key={index}
                image={project.image}
                title={project.title}
                summary={project.summary}
                tag={project.tag}
                href={project.href}
              />
            ))}
          </div>

          <div className="text-center mt-12">
            <CTA label="View All Projects" href="/projects" variant="primary" />
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="section-py bg-neutral-gray-100">
        <div className="container-custom">
          <SectionHeader
            title="Upcoming Events"
            description="Join us for workshops, project sprints, and community showcases."
            align="center"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {upcomingEvents.map((event, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-card">
                <div className="flex items-start mb-3">
                  <Calendar className="w-5 h-5 text-primary mr-3 flex-shrink-0 mt-1" aria-hidden="true" />
                  <div>
                    <div className="font-bold text-primary mb-1">{event.date}</div>
                    <h3 className="font-bold text-lg text-neutral-charcoal mb-2">
                      {event.title}
                    </h3>
                    <p className="text-neutral-gray-700 text-sm">
                      {event.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <CTA label="View Full Calendar" href="/events" variant="ghost" />
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
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="section-py bg-primary text-white">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Make an Impact?
            </h2>
            <p className="text-lg mb-8 text-white/90">
              Whether you're curious about AI or ready to lead a project, there's a place for you here.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <CTA
                label="Students: Apply Now"
                href="/get-involved#students"
                variant="secondary"
                size="large"
              />
              <CTA
                label="Mentors: Share Your Expertise"
                href="/get-involved#mentors"
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
