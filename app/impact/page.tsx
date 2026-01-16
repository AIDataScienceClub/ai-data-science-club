import type { Metadata } from 'next'
import Hero from '@/components/Hero'
import SectionHeader from '@/components/SectionHeader'
import Testimonial from '@/components/Testimonial'

export const metadata: Metadata = {
  title: 'Impact | Atlanta AI & Data Lab',
  description: 'Measuring what matters: access, learning, and long-term pathways for our students.',
}

export default function Impact() {
  const metrics2026 = [
    { metric: 'Students Served', value: '147', change: '+32%', description: 'Active members this year' },
    { metric: 'Title I Schools', value: '68%', change: '+12%', description: 'Students from underserved schools' },
    { metric: 'Projects Completed', value: '21', change: '+40%', description: 'Community-facing projects' },
    { metric: 'Community Users Reached', value: '3,200+', change: '+85%', description: 'People impacted by our tools' },
    { metric: 'Pursuing STEM Majors', value: '78%', change: '+15%', description: 'Of graduating seniors' },
    { metric: 'Scholarships Earned', value: '$340K', change: '+25%', description: 'Total awarded to members' },
  ]

  return (
    <>
      <Hero
        title="Measuring What Matters"
        subtitle="We hold ourselves accountable. Here's how we track access, learning, and long-term pathways—and what we've achieved so far."
        primaryCTA={{ label: 'View Annual Report', href: '/files/annual-report-2026.pdf' }}
      />

      {/* Impact Framework */}
      <section className="section-py bg-white">
        <div className="container-custom">
          <SectionHeader
            title="Our Impact Framework"
            description="We measure success across three dimensions."
            align="center"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-neutral-gray-100 rounded-lg p-6">
              <h3 className="font-bold text-xl mb-3 text-primary">
                1. Access & Engagement
              </h3>
              <p className="text-neutral-gray-700 mb-4 font-medium">
                Are we reaching students who need us most?
              </p>
              <ul className="text-sm text-neutral-gray-600 space-y-1">
                <li>• # of students served annually</li>
                <li>• % from Title I schools</li>
                <li>• % first-generation college-bound</li>
                <li>• % underrepresented in STEM</li>
                <li>• Geographic reach</li>
              </ul>
            </div>

            <div className="bg-neutral-gray-100 rounded-lg p-6">
              <h3 className="font-bold text-xl mb-3 text-primary">
                2. Learning & Output
              </h3>
              <p className="text-neutral-gray-700 mb-4 font-medium">
                Are students gaining real skills and creating real value?
              </p>
              <ul className="text-sm text-neutral-gray-600 space-y-1">
                <li>• Projects completed per year</li>
                <li>• Student-led workshops delivered</li>
                <li>• Skills assessments (pre/post)</li>
                <li>• Partner satisfaction scores</li>
                <li>• Community users reached</li>
              </ul>
            </div>

            <div className="bg-neutral-gray-100 rounded-lg p-6">
              <h3 className="font-bold text-xl mb-3 text-primary">
                3. Pathways & Persistence
              </h3>
              <p className="text-neutral-gray-700 mb-4 font-medium">
                Does participation open doors?
              </p>
              <ul className="text-sm text-neutral-gray-600 space-y-1">
                <li>• % pursuing STEM majors</li>
                <li>• Internships/jobs secured</li>
                <li>• Scholarships awarded</li>
                <li>• Alumni mentoring</li>
                <li>• Continued engagement</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Scorecard */}
      <section className="section-py bg-neutral-gray-100">
        <div className="container-custom">
          <SectionHeader
            title="2025–2026 Scorecard"
            description="Our impact this year, measured."
            align="center"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {metrics2026.map((metric, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-card">
                <div className="text-4xl font-bold text-primary mb-2">
                  {metric.value}
                </div>
                <div className="text-lg font-semibold text-neutral-charcoal mb-2">
                  {metric.metric}
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-secondary font-medium">{metric.change}</span>
                  <span className="text-neutral-gray-600">{metric.description}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Yearly Recap */}
      <section className="section-py bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-neutral-charcoal text-center">
              A Year of Building and Belonging
            </h2>

            <div className="prose prose-lg max-w-none text-neutral-gray-700">
              <p className="mb-4">
                This year, Atlanta AI & Data Lab didn't just grow—we deepened our impact. We welcomed 147 students from 12 neighborhoods, two-thirds from schools that rarely see advanced tech programs. Together, we completed 21 projects that reached over 3,200 Atlanta residents: from a food access map used by the city's Office of Resilience, to an air quality sensor network in West End and Vine City, to an accessibility app tested by the Center for the Visually Impaired.
              </p>

              <p className="mb-4">
                But the numbers only tell part of the story. We watched freshmen who'd never written a line of code lead workshops for their peers. We saw a parent, initially skeptical of AI, become our loudest advocate after attending an ethics discussion. We celebrated when Maya S. got early admission to Georgia Tech's computer science program—and when she came back to mentor the next cohort.
              </p>

              <p className="mb-4">
                Our alumni are interning at Delta, CNN, and local startups. Twelve earned scholarships totaling $340,000. Fifteen returned to speak, mentor, or judge showcase presentations. The ripple effect is real.
              </p>

              <p>
                This work matters because it proves what we've always known: every student deserves a shot at shaping the future—not just using technology, but building it responsibly. And when given that chance, they don't just succeed. They lead.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-py bg-neutral-gray-100">
        <div className="container-custom">
          <SectionHeader
            title="Impact Stories"
            description="Hear from the people we serve."
            align="center"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <Testimonial
              quote="Hiring our first cohort of interns from the Lab was a no-brainer. They showed up with real portfolios and a mature understanding of ethics. That's rare."
              author="Marcus J."
              role="Engineering Manager, Local Tech Firm"
            />
            <Testimonial
              quote="The attendance dashboard they built helped us identify at-risk students two months earlier than our old system. That's intervention time we didn't have before."
              author="Dr. Linda Okoye"
              role="School Counselor"
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-py bg-primary text-white">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Want to Be Part of Next Year's Impact?</h2>
            <p className="text-lg mb-8 text-white/90">
              Join as a student, partner with us, or support our work.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/get-involved#students" className="btn btn-secondary btn-large">
                Join as a Student
              </a>
              <a href="/get-involved#partners" className="btn btn-ghost btn-large text-white border-white hover:bg-white hover:text-primary">
                Partner With Us
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
