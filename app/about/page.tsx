import type { Metadata } from 'next'
import Hero from '@/components/Hero'
import SectionHeader from '@/components/SectionHeader'
import Image from 'next/image'
import { User } from 'lucide-react'
import { loadPagesData, PageData } from '@/lib/data-loader'

export const metadata: Metadata = {
  title: 'About | Atlanta AI & Data Lab',
  description: 'A student-led movement to make AI education accessible, impactful, and responsible.',
}

interface Officer {
  name: string
  role: string
  grade: string
  bio: string
  focus: string
  image?: string
}

export const revalidate = 0

export default async function About() {
  const pagesData = await loadPagesData()
  const pageData: PageData | undefined = pagesData?.about
  
  const studentOfficers = (pageData?.team?.officers as Officer[]) || [
    {
      name: 'Maya S.',
      role: 'Co-President',
      grade: '11th Grade',
      bio: '"I joined because I wanted to see if I could actually code. Turns out, I can - and I love teaching others how."',
      focus: 'Applied AI Track Lead | Built Community Food Access Map',
    },
    {
      name: 'Jordan T.',
      role: 'Co-President',
      grade: '12th Grade',
      bio: '"Good design means everyone can use it. I\'m here to make sure we build for real people, not just tech bros."',
      focus: 'UX & Accessibility Lead | Designed School Attendance Dashboard',
    },
    {
      name: 'Alex P.',
      role: 'Data Science Director',
      grade: '11th Grade',
      bio: '"Numbers tell stories. I want to make sure we\'re telling the right ones - and listening to who\'s left out."',
      focus: 'Civic Data Track Lead | Led Youth Employment Survey Analysis',
    },
    {
      name: 'Priya N.',
      role: 'Ethics & Safety Officer',
      grade: '10th Grade',
      bio: '"If we\'re not asking \'who could this harm?\' we\'re not doing our jobs."',
      focus: 'AI Literacy Facilitator | Leads bias audits for all projects',
    },
  ]
  
  const missionContent = pageData?.mission?.content || "Atlanta AI & Data Lab was founded in 2023 by three high school juniors frustrated by the lack of hands-on tech opportunities in their schools. They wanted more than lectures—they wanted to build things that mattered.\n\nToday, we're a nonprofit serving 147+ students across metro Atlanta, partnering with community organizations to turn classroom learning into real-world impact."
  
  const values = pageData?.mission?.values || [
    { title: 'Accessible', description: 'No barriers—free programs, loaned equipment, beginner-friendly.' },
    { title: 'Applied', description: 'Learning by doing; projects with purpose.' },
    { title: 'Accountable', description: "Ethics aren't an afterthought—they're embedded in every project." }
  ]

  return (
    <>
      <Hero
        title={pageData?.hero?.title || "Who We Are"}
        subtitle={pageData?.hero?.subtitle || "A student-led movement to make AI education accessible, impactful, and responsible."}
        primaryCTA={{ label: 'Contact Us', href: '#contact' }}
      />

      {/* Mission */}
      <section className="section-py bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-neutral-charcoal text-center">
              Our Mission
            </h2>
            <p className="text-xl text-neutral-gray-700 mb-8 text-center">
              &quot;{pageData?.mission?.quote || "We help high schoolers learn and apply AI and data science to solve local problems—responsibly."}&quot;
            </p>

            <div className="prose prose-lg max-w-none text-neutral-gray-700">
              {missionContent.split('\n\n').map((paragraph: string, index: number) => (
                <p key={index} className="mb-4">{paragraph}</p>
              ))}

              <p className="mb-4">We believe technology education should be:</p>

              <ul className="space-y-2 mb-6">
                {values.map((value: { title: string; description: string }, index: number) => (
                  <li key={index}><strong>{value.title}:</strong> {value.description}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Student Officers */}
      <section className="section-py bg-neutral-gray-100">
        <div className="container-custom">
          <SectionHeader
            title="Student Leadership Team"
            description="Meet the students leading Atlanta AI & Data Lab this year."
            align="center"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {studentOfficers.map((officer: Officer, index: number) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-card">
                <div className="flex gap-4 mb-4">
                  {/* Profile Image */}
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 rounded-full overflow-hidden bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                      {officer.image ? (
                        <img 
                          src={officer.image} 
                          alt={officer.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-10 h-10 text-primary/50" />
                      )}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-neutral-charcoal mb-1">
                      {officer.name}
                    </h3>
                    <p className="text-primary font-medium mb-1">
                      {officer.role} | {officer.grade}
                    </p>
                    <p className="text-sm text-neutral-gray-600">
                      {officer.focus}
                    </p>
                  </div>
                </div>
                <p className="text-neutral-gray-700 italic border-l-4 border-primary/30 pl-4">
                  &quot;{officer.bio}&quot;
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="section-py bg-white">
        <div className="container-custom">
          <SectionHeader
            title="Get in Touch"
            description="Questions? Ideas? We'd love to hear from you."
            align="center"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white rounded-lg p-6 shadow-card">
              <h3 className="font-bold text-lg mb-4 text-neutral-charcoal">Email Us</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <strong>General:</strong>{' '}
                  <a href="mailto:hello@atl-ai-lab.org" className="text-primary hover:underline">
                    hello@atl-ai-lab.org
                  </a>
                </li>
                <li>
                  <strong>Students:</strong>{' '}
                  <a href="mailto:students@atl-ai-lab.org" className="text-primary hover:underline">
                    students@atl-ai-lab.org
                  </a>
                </li>
                <li>
                  <strong>Partnerships:</strong>{' '}
                  <a href="mailto:partners@atl-ai-lab.org" className="text-primary hover:underline">
                    partners@atl-ai-lab.org
                  </a>
                </li>
                <li>
                  <strong>Press:</strong>{' '}
                  <a href="mailto:press@atl-ai-lab.org" className="text-primary hover:underline">
                    press@atl-ai-lab.org
                  </a>
                </li>
                <li>
                  <strong>Safety:</strong>{' '}
                  <a href="mailto:safety@atl-ai-lab.org" className="text-primary hover:underline">
                    safety@atl-ai-lab.org
                  </a>{' '}
                  | <a href="tel:4045550199" className="text-primary hover:underline">(404) 555-0199</a>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-card">
              <h3 className="font-bold text-lg mb-4 text-neutral-charcoal">Visit Us</h3>
              <p className="text-sm text-neutral-gray-700 mb-4">
                <strong>Mail:</strong><br />
                Atlanta AI & Data Lab<br />
                c/o Atlanta Education Fund<br />
                100 Peachtree St NW, Suite 500<br />
                Atlanta, GA 30303
              </p>
              <p className="text-sm text-neutral-gray-700">
                <strong>Office Hours:</strong><br />
                Tuesdays & Thursdays, 4–6 PM<br />
                <em>(Location provided upon RSVP for safety)</em>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-py bg-primary text-white">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Join Our Community</h2>
            <p className="text-lg mb-8 text-white/90">
              Whether you're a student, parent, mentor, or partner—there's a place for you here.
            </p>
            <a href="/get-involved" className="btn btn-secondary btn-large">
              Get Involved
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
