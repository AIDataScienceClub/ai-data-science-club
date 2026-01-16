'use client'

import { useState } from 'react'
import type { Metadata } from 'next'
import Hero from '@/components/Hero'
import SectionHeader from '@/components/SectionHeader'

const tabs = ['students', 'parents', 'mentors', 'partners', 'donate'] as const
type Tab = typeof tabs[number]

export default function GetInvolved() {
  const [activeTab, setActiveTab] = useState<Tab>('students')

  return (
    <>
      <Hero
        title="Find Your Role"
        subtitle="Students, parents, mentors, partners, donors—everyone has a way to contribute. Choose yours."
      />

      {/* Tabs */}
      <section className="section-py bg-white">
        <div className="container-custom">
          <div className="flex flex-wrap justify-center gap-2 mb-12" role="tablist" aria-label="Get involved options">
            {tabs.map((tab) => (
              <button
                key={tab}
                role="tab"
                aria-selected={activeTab === tab}
                aria-controls={`${tab}-panel`}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  activeTab === tab
                    ? 'bg-primary text-white'
                    : 'bg-neutral-gray-200 text-neutral-gray-700 hover:bg-neutral-gray-300'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Students Tab */}
          {activeTab === 'students' && (
            <div id="students-panel" role="tabpanel" className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-6 text-neutral-charcoal">For Students</h2>
              
              <div className="prose prose-lg max-w-none text-neutral-gray-700 mb-8">
                <p className="text-xl mb-6">
                  High school students (grades 9–12) in metro Atlanta curious about AI, data science, or community impact. No prior experience required.
                </p>

                <h3 className="text-2xl font-bold mb-4 text-neutral-charcoal">What You'll Gain</h3>
                <ul className="space-y-2 mb-6">
                  <li>Hands-on technical skills (Python, data viz, web dev, AI tools)</li>
                  <li>Portfolio projects for college apps and internships</li>
                  <li>Mentorship from industry professionals</li>
                  <li>Leadership experience (team lead, workshop facilitator roles)</li>
                  <li>College recommendation letters</li>
                  <li>A community that gets you</li>
                </ul>

                <h3 className="text-2xl font-bold mb-4 text-neutral-charcoal">Roles You Can Play</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-neutral-gray-100 rounded-lg p-4">
                    <h4 className="font-bold mb-2">Member</h4>
                    <p className="text-sm">Join a program track; contribute to projects; attend workshops.</p>
                  </div>
                  <div className="bg-neutral-gray-100 rounded-lg p-4">
                    <h4 className="font-bold mb-2">Project Lead</h4>
                    <p className="text-sm">Pitch an idea; recruit a team; manage timeline and partner relationships.</p>
                  </div>
                  <div className="bg-neutral-gray-100 rounded-lg p-4">
                    <h4 className="font-bold mb-2">Peer Educator</h4>
                    <p className="text-sm">Teach workshops; create tutorials; mentor newer members.</p>
                  </div>
                  <div className="bg-neutral-gray-100 rounded-lg p-4">
                    <h4 className="font-bold mb-2">Ambassador</h4>
                    <p className="text-sm">Represent the club at your school; recruit new members.</p>
                  </div>
                </div>

                <h3 className="text-2xl font-bold mb-4 text-neutral-charcoal">Requirements</h3>
                <ul className="space-y-2 mb-6">
                  <li>Attend 80% of scheduled sessions</li>
                  <li>Complete ethics training (2 hours, online or in-person)</li>
                  <li>Parent/guardian consent if under 18</li>
                  <li>Commitment to respectful collaboration</li>
                </ul>
              </div>

              <div className="bg-primary text-white rounded-lg p-8 text-center">
                <h3 className="text-2xl font-bold mb-4">Ready to Join?</h3>
                <p className="mb-6">Applications reviewed on a rolling basis. Next orientation: February 1, 2026.</p>
                <a href="/apply" className="btn btn-secondary btn-large">
                  Apply Now
                </a>
              </div>
            </div>
          )}

          {/* Parents Tab */}
          {activeTab === 'parents' && (
            <div id="parents-panel" role="tabpanel" className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-6 text-neutral-charcoal">For Parents</h2>
              
              <div className="prose prose-lg max-w-none text-neutral-gray-700 mb-8">
                <h3 className="text-2xl font-bold mb-4 text-neutral-charcoal">How You Can Support</h3>
                
                <div className="space-y-6">
                  <div className="bg-neutral-gray-100 rounded-lg p-6">
                    <h4 className="font-bold text-lg mb-2">1. Encourage Your Student</h4>
                    <p>Help them carve out time for club activities. Celebrate their projects. Attend showcases.</p>
                  </div>

                  <div className="bg-neutral-gray-100 rounded-lg p-6">
                    <h4 className="font-bold text-lg mb-2">2. Share Your Network</h4>
                    <p>Know someone in tech, nonprofits, city government, or education? Introduce us—partnerships start with conversations.</p>
                  </div>

                  <div className="bg-neutral-gray-100 rounded-lg p-6">
                    <h4 className="font-bold text-lg mb-2">3. Volunteer Logistics</h4>
                    <p>We occasionally need: event setup/cleanup help, snack donations for workshops, transportation coordination, photography at showcases.</p>
                  </div>

                  <div className="bg-neutral-gray-100 rounded-lg p-6">
                    <h4 className="font-bold text-lg mb-2">4. Join the Parent Council</h4>
                    <p>Meet quarterly to give feedback on programming, safety policies, and student needs.</p>
                  </div>
                </div>

                <h3 className="text-2xl font-bold mb-4 mt-8 text-neutral-charcoal">FAQ for Parents</h3>
                <div className="space-y-4">
                  <div>
                    <p className="font-bold">Q: Is there a cost?</p>
                    <p>A: No. All programs are free. We provide laptops if students don't have access.</p>
                  </div>
                  <div>
                    <p className="font-bold">Q: How do you keep students safe online?</p>
                    <p>A: All members sign a code of conduct. Advisors monitor project channels. We never share personal data. See our full <a href="/ethics#privacy" className="text-primary hover:underline">Privacy Policy</a>.</p>
                  </div>
                  <div>
                    <p className="font-bold">Q: What if my student has no tech experience?</p>
                    <p>A: Perfect! Most join with zero coding background. We meet them where they are.</p>
                  </div>
                </div>
              </div>

              <div className="bg-secondary text-neutral-charcoal rounded-lg p-8 text-center">
                <h3 className="text-2xl font-bold mb-4">Stay Connected</h3>
                <p className="mb-6">Sign up for our parent newsletter (monthly updates, event reminders).</p>
                <a href="/subscribe" className="btn btn-primary btn-large">
                  Sign Up for Parent Updates
                </a>
              </div>
            </div>
          )}

          {/* Mentors Tab */}
          {activeTab === 'mentors' && (
            <div id="mentors-panel" role="tabpanel" className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-6 text-neutral-charcoal">For Mentors</h2>
              
              <div className="prose prose-lg max-w-none text-neutral-gray-700 mb-8">
                <p className="text-xl mb-6">
                  Professionals in tech, data science, AI, design, policy, education, or community advocacy willing to guide student projects.
                </p>

                <h3 className="text-2xl font-bold mb-4 text-neutral-charcoal">What Mentorship Looks Like</h3>
                <div className="space-y-4 mb-6">
                  <div className="bg-neutral-gray-100 rounded-lg p-6">
                    <h4 className="font-bold text-lg mb-2">Project Advisor (5–10 weeks)</h4>
                    <p>Meet with a student team weekly (1 hour); review progress, troubleshoot, give feedback. Virtual or in-person.</p>
                  </div>

                  <div className="bg-neutral-gray-100 rounded-lg p-6">
                    <h4 className="font-bold text-lg mb-2">Workshop Facilitator (1-time or recurring)</h4>
                    <p>Teach a skill (e.g., "Intro to APIs," "Designing for Accessibility"). We provide curriculum templates.</p>
                  </div>

                  <div className="bg-neutral-gray-100 rounded-lg p-6">
                    <h4 className="font-bold text-lg mb-2">Career Guide</h4>
                    <p>Host office hours; review resumes; do mock interviews; share your path into tech.</p>
                  </div>

                  <div className="bg-neutral-gray-100 rounded-lg p-6">
                    <h4 className="font-bold text-lg mb-2">Ethics Reviewer</h4>
                    <p>Audit projects for bias/privacy issues before deployment.</p>
                  </div>
                </div>

                <h3 className="text-2xl font-bold mb-4 text-neutral-charcoal">Time Commitment</h3>
                <p className="mb-6">As little as 2 hours total (guest speaker) or up to 1 hour/week for a full sprint cycle.</p>

                <h3 className="text-2xl font-bold mb-4 text-neutral-charcoal">Requirements</h3>
                <ul className="space-y-2 mb-6">
                  <li>Background check (we cover the cost)</li>
                  <li>Complete mentor onboarding (1 hour, covers youth engagement best practices)</li>
                  <li>Commit to your stated availability (students rely on consistency)</li>
                </ul>
              </div>

              <div className="bg-primary text-white rounded-lg p-8 text-center">
                <h3 className="text-2xl font-bold mb-4">Share Your Expertise</h3>
                <p className="mb-6">We'll schedule a quick intro call to match you with a project or workshop slot.</p>
                <a href="/mentor-apply" className="btn btn-secondary btn-large">
                  Apply to Mentor
                </a>
              </div>
            </div>
          )}

          {/* Partners Tab */}
          {activeTab === 'partners' && (
            <div id="partners-panel" role="tabpanel" className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-6 text-neutral-charcoal">For Partners</h2>
              
              <div className="prose prose-lg max-w-none text-neutral-gray-700 mb-8">
                <p className="text-xl mb-6">
                  Nonprofits, schools, city agencies, community organizations with a problem that data or technology might help solve.
                </p>

                <h3 className="text-2xl font-bold mb-4 text-neutral-charcoal">What Partnership Looks Like</h3>
                <ol className="space-y-3 mb-6">
                  <li><strong>Discovery Call:</strong> You share a challenge; we assess fit (Is it student-appropriate? Achievable in 8–10 weeks? Ethical?).</li>
                  <li><strong>Project Scoping:</strong> Together we define success metrics, data access, timeline.</li>
                  <li><strong>Student Team Assigned:</strong> 4–6 students + mentor + faculty advisor work on your project.</li>
                  <li><strong>Weekly Check-Ins:</strong> You meet with the team (30–60 min/week); provide feedback, answer questions.</li>
                  <li><strong>Deployment & Handoff:</strong> Students demo the tool; we train your staff; provide documentation.</li>
                  <li><strong>Evaluation:</strong> Post-project survey; measure impact; decide on iteration or maintenance plan.</li>
                </ol>

                <h3 className="text-2xl font-bold mb-4 text-neutral-charcoal">What We Provide</h3>
                <ul className="space-y-2 mb-6">
                  <li>Free technical talent (students eager to learn by doing)</li>
                  <li>Faculty oversight (projects are reviewed for quality and ethics)</li>
                  <li>Public credit (we showcase partnerships on our site and at events)</li>
                  <li>Access to emerging tech trends through a youth lens</li>
                </ul>

                <h3 className="text-2xl font-bold mb-4 text-neutral-charcoal">What We Need From You</h3>
                <ul className="space-y-2 mb-6">
                  <li>A real problem (not hypothetical or marketing-focused)</li>
                  <li>Access to relevant data (anonymized/aggregated when needed)</li>
                  <li>Committed staff contact (responsive to student questions)</li>
                  <li>Consent to showcase the project (with your approval of materials)</li>
                  <li>Feedback to help students grow</li>
                </ul>
              </div>

              <div className="bg-secondary text-neutral-charcoal rounded-lg p-8 text-center">
                <h3 className="text-2xl font-bold mb-4">Start a Conversation</h3>
                <p className="mb-6">We review inquiries monthly and respond within 2 weeks.</p>
                <a href="/partner-inquiry" className="btn btn-primary btn-large">
                  Submit Partnership Inquiry
                </a>
              </div>
            </div>
          )}

          {/* Donate Tab */}
          {activeTab === 'donate' && (
            <div id="donate-panel" role="tabpanel" className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-6 text-neutral-charcoal">Donate</h2>
              
              <div className="prose prose-lg max-w-none text-neutral-gray-700 mb-8">
                <p className="text-xl mb-6">
                  We keep programs free for students. That means we rely on donations to cover laptops, software licenses, workshop supplies, and more.
                </p>

                <h3 className="text-2xl font-bold mb-4 text-neutral-charcoal">Where Your Money Goes</h3>
                <div className="bg-neutral-gray-100 rounded-lg p-6 mb-6">
                  <ul className="space-y-2">
                    <li><strong>75%</strong> directly to student programming</li>
                    <li><strong>15%</strong> to advisor stipends (teachers and mentors)</li>
                    <li><strong>10%</strong> to operations (insurance, website, marketing)</li>
                  </ul>
                </div>

                <h3 className="text-2xl font-bold mb-4 text-neutral-charcoal">Ways to Give</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-white border-2 border-primary rounded-lg p-6">
                    <h4 className="font-bold text-lg mb-4">One-Time Donation</h4>
                    <div className="space-y-2 mb-4">
                      <button className="w-full btn btn-primary">$25</button>
                      <button className="w-full btn btn-primary">$50</button>
                      <button className="w-full btn btn-primary">$100</button>
                      <button className="w-full btn btn-primary">Custom Amount</button>
                    </div>
                  </div>

                  <div className="bg-white border-2 border-secondary rounded-lg p-6">
                    <h4 className="font-bold text-lg mb-4">Monthly Sustainer</h4>
                    <ul className="text-sm space-y-2 mb-4">
                      <li>$10/month = supplies for 1 workshop</li>
                      <li>$25/month = software for 1 student/year</li>
                      <li>$50/month = background checks for 5 mentors</li>
                    </ul>
                    <button className="w-full btn btn-secondary">Become a Monthly Donor</button>
                  </div>
                </div>

                <h3 className="text-2xl font-bold mb-4 text-neutral-charcoal">Other Ways to Support</h3>
                <ul className="space-y-2">
                  <li><strong>Employer Matching:</strong> Many companies match employee donations—it doubles your impact!</li>
                  <li><strong>In-Kind Donations:</strong> Gently used laptops, software licenses, event space, snacks (email donate@atl-ai-lab.org)</li>
                  <li><strong>Corporate Sponsorship:</strong> Sponsor a program track, event, or scholarship cohort (<a href="/files/sponsorship.pdf" className="text-primary hover:underline">Download Prospectus</a>)</li>
                </ul>
              </div>

              <div className="bg-primary text-white rounded-lg p-8 text-center">
                <h3 className="text-2xl font-bold mb-4">Every Dollar Helps a Student</h3>
                <p className="mb-6">Tax-deductible (501(c)(3) pending—fiscal sponsor: Atlanta Education Fund).</p>
                <a href="/donate" className="btn btn-secondary btn-large">
                  Donate Now
                </a>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
