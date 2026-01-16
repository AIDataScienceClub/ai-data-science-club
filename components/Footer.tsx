'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Instagram, Linkedin, Github, Youtube } from 'lucide-react'

export default function Footer() {
  const footerLinks = {
    Explore: [
      { label: 'Programs', href: '/programs' },
      { label: 'Projects', href: '/projects' },
      { label: 'Events', href: '/events' },
    ],
    About: [
      { label: 'Our Team', href: '/about' },
      { label: 'Ethics & Safety', href: '/ethics' },
      { label: 'Impact', href: '/impact' },
    ],
    'Get Involved': [
      { label: 'Students', href: '/get-involved#students' },
      { label: 'Mentors', href: '/get-involved#mentors' },
      { label: 'Partners', href: '/get-involved#partners' },
    ],
  }

  const socialLinks = [
    { platform: 'Instagram', icon: Instagram, url: 'https://instagram.com/atl_ai_lab', ariaLabel: 'Follow us on Instagram' },
    { platform: 'LinkedIn', icon: Linkedin, url: 'https://linkedin.com/company/atl-ai-lab', ariaLabel: 'Connect on LinkedIn' },
    { platform: 'GitHub', icon: Github, url: 'https://github.com/atl-ai-lab', ariaLabel: 'View our code on GitHub' },
    { platform: 'YouTube', icon: Youtube, url: 'https://youtube.com/atl-ai-lab', ariaLabel: 'Watch our videos on YouTube' },
  ]

  return (
    <footer className="bg-neutral-charcoal text-neutral-off-white" role="contentinfo">
      <div className="container-custom section-py">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-1">
            <div className="flex items-center space-x-3 mb-4">
              <Image
                src="/logo1.jpg"
                alt="AI Data Science Club Logo"
                width={40}
                height={40}
                className="w-10 h-10"
              />
              <span className="font-bold text-lg">AI Data Science Club</span>
            </div>
            <p className="text-neutral-gray-400 text-sm">
              Empowering high schoolers to solve local problems with AI and data science—responsibly.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([column, links]) => (
            <div key={column}>
              <h3 className="font-semibold text-white mb-3">{column}</h3>
              <nav aria-label={`${column} links`}>
                <ul className="space-y-2">
                  {links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-neutral-gray-400 hover:text-secondary transition-colors text-sm focus-visible:outline-secondary"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          ))}
        </div>

        {/* Social links */}
        <div className="border-t border-neutral-gray-700 pt-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-4 md:mb-0">
              <p className="text-sm text-neutral-gray-400">
                © 2026 AI Data Science Club. All rights reserved.
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-neutral-gray-400 mr-2">Follow us:</span>
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <a
                    key={social.platform}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neutral-gray-400 hover:text-secondary transition-colors p-2 rounded focus-visible:outline-secondary"
                    aria-label={social.ariaLabel}
                  >
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </a>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
