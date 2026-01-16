import type { Metadata } from 'next'
import Hero from '@/components/Hero'
import SectionHeader from '@/components/SectionHeader'
import Card from '@/components/Card'
import { BookOpen, Wrench, BarChart } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Programs | Atlanta AI & Data Lab',
  description: 'Three pathways designed for beginners, builders, and future AI leaders. No prior experience required.',
}

export default function Programs() {
  const programs = [
    {
      icon: <BookOpen className="w-12 h-12" aria-hidden="true" />,
      title: 'AI Literacy',
      summary: 'Short, interactive activities that demystify AI. Learn how algorithms make decisions, practice spotting bias, and discuss real-world implications.',
      details: [
        'Hands-on exercises with visual AI tools (no coding required to start)',
        'Ethics discussions: privacy, consent, fairness',
        'Critical thinking workshops',
        'Guest speakers from tech, policy, and advocacy',
      ],
      commitment: '2 hours/week for 6 weeks',
      bestFor: 'Students new to AI; curious about tech\'s role in society',
      outcomes: 'Earn a digital badge; present one ethics case study',
    },
    {
      icon: <Wrench className="w-12 h-12" aria-hidden="true" />,
      title: 'Applied AI for Community',
      summary: 'Hands-on project teams tackling real needs identified by local partners. Learn Python, data analysis, and deployment—while building something that matters.',
      details: [
        'Join a 10-week sprint team (4-6 students)',
        'Partner with nonprofits, schools, or city departments',
        'Build prototypes: maps, dashboards, recommendation tools',
        'Public demo at Community Showcase',
      ],
      commitment: '5-7 hours/week for 10 weeks',
      bestFor: 'Students ready to code (or eager to learn fast)',
      outcomes: 'Portfolio project; technical mentorship; college/internship references',
    },
    {
      icon: <BarChart className="w-12 h-12" aria-hidden="true" />,
      title: 'Data Science for Civic Impact',
      summary: 'Turn messy data into clear insights that drive community decisions. Learn surveys, data cleaning, visualization, and storytelling.',
      details: [
        'Design surveys and collect data (with proper consent)',
        'Clean and analyze datasets (Excel, Google Sheets, Python)',
        'Build interactive dashboards (Tableau, Datawrapper)',
        'Write policy briefs and present to partners',
      ],
      commitment: '4-6 hours/week for 8 weeks',
      bestFor: 'Students interested in research, journalism, policy, or public health',
      outcomes: 'Published report; presentation to community board; data portfolio',
    },
  ]

  const faqs = [
    {
      question: 'Do I need coding experience?',
      answer: 'No! AI Literacy requires zero coding. Applied AI and Data Science assume you\'re willing to learn - we provide resources and pair you with mentors.',
    },
    {
      question: 'Can I do more than one program?',
      answer: 'Absolutely. Many students start with AI Literacy, then move to a project track. You can also repeat programs with new projects.',
    },
    {
      question: 'How do you pick project topics?',
      answer: 'We partner with local nonprofits and city agencies to identify real needs. Students vote on which projects to tackle each cycle.',
    },
    {
      question: 'What if I miss sessions?',
      answer: 'Life happens. Let your team lead know. We record workshops and provide async resources. Consistent communication is key.',
    },
  ]

  return (
    <>
      <Hero
        title="Programs That Meet You Where You Are"
        subtitle="Three pathways designed for beginners, builders, and future AI leaders. No prior experience required."
        primaryCTA={{ label: 'Apply Now', href: '/get-involved#students' }}
      />

      {/* Programs */}
      <section className="section-py bg-white">
        <div className="container-custom">
          <div className="space-y-16">
            {programs.map((program, index) => (
              <div key={index} className="max-w-4xl mx-auto">
                <div className="flex items-start mb-6">
                  <div className="text-primary mr-4 flex-shrink-0">
                    {program.icon}
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold mb-4 text-neutral-charcoal">
                      {program.title}
                    </h2>
                    <p className="text-lg text-neutral-gray-700 mb-6">
                      {program.summary}
                    </p>
                  </div>
                </div>

                <div className="bg-neutral-gray-100 rounded-lg p-6 mb-6">
                  <h3 className="font-bold text-lg mb-3 text-neutral-charcoal">What You'll Do:</h3>
                  <ul className="space-y-2">
                    {program.details.map((detail, i) => (
                      <li key={i} className="flex items-start">
                        <span className="text-primary mr-2 flex-shrink-0">•</span>
                        <span className="text-neutral-gray-700">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white border-2 border-neutral-gray-200 rounded-lg p-4">
                    <div className="font-bold text-sm text-primary mb-1">Time Commitment</div>
                    <div className="text-neutral-gray-700">{program.commitment}</div>
                  </div>
                  <div className="bg-white border-2 border-neutral-gray-200 rounded-lg p-4">
                    <div className="font-bold text-sm text-primary mb-1">Best For</div>
                    <div className="text-neutral-gray-700">{program.bestFor}</div>
                  </div>
                  <div className="bg-white border-2 border-neutral-gray-200 rounded-lg p-4">
                    <div className="font-bold text-sm text-primary mb-1">Outcomes</div>
                    <div className="text-neutral-gray-700">{program.outcomes}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-py bg-neutral-gray-100">
        <div className="container-custom">
          <SectionHeader
            title="Frequently Asked Questions"
            description="Have questions? We've got answers."
            align="center"
          />

          <div className="max-w-3xl mx-auto space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-card">
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

      {/* CTA */}
      <section className="section-py bg-primary text-white">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Dive In?</h2>
            <p className="text-lg mb-8 text-white/90">
              Apply as a student or reach out with questions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/get-involved#students" className="btn btn-secondary btn-large">
                Apply as a Student
              </a>
              <a href="/about#contact" className="btn btn-ghost btn-large text-white border-white hover:bg-white hover:text-primary">
                Questions? Contact Us
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
