import type { Metadata } from 'next'
import Hero from '@/components/Hero'
import SectionHeader from '@/components/SectionHeader'

export const metadata: Metadata = {
  title: 'Ethics & Safety | Atlanta AI & Data Lab',
  description: 'We are committed to responsible AI - from how we collect data to how we deploy our work.',
}

export default function Ethics() {
  const principles = [
    {
      title: 'Student Safety',
      description: 'All members complete safety training. We have clear policies on online conduct, data handling, and reporting concerns.',
    },
    {
      title: 'Consent & Privacy',
      description: 'We never collect personal data without explicit permission. Parents/guardians consent for members under 18. All projects follow privacy-by-design.',
    },
    {
      title: 'Fairness & Bias',
      description: 'We actively check for algorithmic bias. Every project includes a bias audit before deployment.',
    },
    {
      title: 'Transparency',
      description: 'Our code is open-source (when possible). We cite data sources. We admit mistakes and fix them publicly.',
    },
    {
      title: 'Accountability',
      description: 'Every project has a faculty advisor and community partner. We measure impact—and own outcomes.',
    },
  ]

  const checklist = [
    {
      category: 'Data',
      items: [
        'Do we have permission to use this data?',
        'Is personally identifiable information (PII) removed or anonymized?',
        'Did we document data sources and collection methods?',
      ],
    },
    {
      category: 'Bias & Fairness',
      items: [
        'Did we check for representation gaps (age, race, geography, ability)?',
        'Could this tool harm or exclude any group?',
        'Did we test with diverse users?',
      ],
    },
    {
      category: 'Transparency',
      items: [
        'Can users understand how the tool works (no "black box")?',
        'Did we disclose limitations and error rates?',
        'Is our code/documentation public (or explained why not)?',
      ],
    },
    {
      category: 'Consent',
      items: [
        'Did stakeholders consent to this project?',
        'Are users informed about data use?',
        'Can users opt out or request deletion?',
      ],
    },
    {
      category: 'Accountability',
      items: [
        'Who owns this project long-term?',
        'How will we monitor for unintended consequences?',
        'Is there a feedback mechanism for users?',
      ],
    },
    {
      category: 'Safety',
      items: [
        'Could this tool be misused? Did we add safeguards?',
        'Did an advisor review for risks?',
      ],
    },
  ]

  return (
    <>
      <Hero
        title="Ethics & Safety First"
        subtitle="We're committed to responsible AI—from how we collect data to how we deploy our work. Here's our promise to students, families, and partners."
        primaryCTA={{ label: 'Download Consent Form', href: '/files/consent-form.pdf' }}
      />

      {/* Principles */}
      <section className="section-py bg-white">
        <div className="container-custom">
          <SectionHeader
            title="Our Principles"
            description="Five commitments that guide every project we build."
            align="center"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {principles.map((principle, index) => (
              <div key={index} className="bg-neutral-gray-100 rounded-lg p-6">
                <h3 className="font-bold text-xl mb-3 text-primary">
                  {principle.title}
                </h3>
                <p className="text-neutral-gray-700">
                  {principle.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ethics Checklist */}
      <section className="section-py bg-neutral-gray-100">
        <div className="container-custom">
          <SectionHeader
            title="AI Ethics Checklist"
            description="Before deploying, teams must answer YES to all questions. No exceptions."
            align="center"
          />

          <div className="max-w-4xl mx-auto space-y-8">
            {checklist.map((section, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-card">
                <h3 className="font-bold text-xl mb-4 text-primary">
                  {section.category}
                </h3>
                <ul className="space-y-3">
                  {section.items.map((item, i) => (
                    <li key={i} className="flex items-start">
                      <input
                        type="checkbox"
                        className="mt-1 mr-3 w-5 h-5 text-primary"
                        aria-label={item}
                      />
                      <span className="text-neutral-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="max-w-4xl mx-auto mt-8 bg-secondary/20 border-l-4 border-secondary rounded-lg p-6">
            <p className="text-neutral-charcoal font-medium">
              <strong>Projects that don't pass the checklist go back for iteration. No exceptions.</strong>
            </p>
          </div>
        </div>
      </section>

      {/* Privacy Policy */}
      <section className="section-py bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-neutral-charcoal">
              Privacy Policy
            </h2>

            <div className="prose prose-lg max-w-none text-neutral-gray-700">
              <h3 className="text-xl font-bold mb-3 text-neutral-charcoal">
                For Students Under 18
              </h3>
              <p className="mb-6">
                Parent/guardian consent required before joining. Consent form covers participation in projects and events, use of student work in showcases (with anonymization options), photography/video at events (opt-out available), and communication via email/text for logistics.
              </p>

              <h3 className="text-xl font-bold mb-3 text-neutral-charcoal">
                Data We Collect
              </h3>
              <ul className="mb-6 space-y-2">
                <li>Name, email, grade, school (for membership records)</li>
                <li>Project contributions (code, reports, presentations)</li>
                <li>Anonymous usage analytics (page views, event RSVPs)</li>
              </ul>

              <h3 className="text-xl font-bold mb-3 text-neutral-charcoal">
                Data We Don't Sell or Share
              </h3>
              <p className="mb-6">
                We never sell student data. We share anonymized impact metrics with funders and partners—no personal identifiers.
              </p>

              <h3 className="text-xl font-bold mb-3 text-neutral-charcoal">
                Your Rights
              </h3>
              <ul className="mb-6 space-y-2">
                <li>Request your data (email: privacy@atl-ai-lab.org)</li>
                <li>Update or delete your information</li>
                <li>Opt out of photos/videos at any time</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Reporting */}
      <section className="section-py bg-primary text-white">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Report a Concern</h2>
            <p className="text-lg mb-8 text-white/90">
              See something that doesn't feel right? We respond within 48 hours. Your safety matters more than any project deadline.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="mailto:safety@atl-ai-lab.org" className="btn btn-secondary btn-large">
                Email: safety@atl-ai-lab.org
              </a>
              <a href="tel:4045550199" className="btn btn-ghost btn-large text-white border-white hover:bg-white hover:text-primary">
                Text: (404) 555-0199
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
