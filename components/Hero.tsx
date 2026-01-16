import Link from 'next/link'
import { ReactNode } from 'react'

interface HeroProps {
  title: string
  subtitle: string
  primaryCTA?: { label: string; href: string; ariaLabel?: string }
  secondaryCTA?: { label: string; href: string; ariaLabel?: string }
  backgroundImage?: string
  overlay?: boolean
}

export default function Hero({
  title,
  subtitle,
  primaryCTA,
  secondaryCTA,
  backgroundImage,
  overlay = false,
}: HeroProps) {
  return (
    <section
      className="relative bg-primary text-white section-py"
      style={
        backgroundImage
          ? {
              backgroundImage: `url(${backgroundImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }
          : undefined
      }
    >
      {overlay && backgroundImage && (
        <div className="absolute inset-0 bg-neutral-charcoal opacity-60" aria-hidden="true" />
      )}

      <div className="container-custom relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            {title}
          </h1>
          <p className="text-lg md:text-xl mb-8 text-white/90">
            {subtitle}
          </p>

          {(primaryCTA || secondaryCTA) && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {primaryCTA && (
                <Link
                  href={primaryCTA.href}
                  className="btn btn-secondary btn-large"
                  aria-label={primaryCTA.ariaLabel || primaryCTA.label}
                >
                  {primaryCTA.label}
                </Link>
              )}
              {secondaryCTA && (
                <Link
                  href={secondaryCTA.href}
                  className="btn btn-ghost btn-large text-white border-white hover:bg-white hover:text-primary"
                  aria-label={secondaryCTA.ariaLabel || secondaryCTA.label}
                >
                  {secondaryCTA.label}
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
