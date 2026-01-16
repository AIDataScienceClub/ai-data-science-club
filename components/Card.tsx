import Link from 'next/link'
import Image from 'next/image'

interface CardProps {
  image?: string
  icon?: React.ReactNode
  title: string
  summary: string
  tag?: string
  href?: string
  cta?: { label: string; href: string }
}

export default function Card({
  image,
  icon,
  title,
  summary,
  tag,
  href,
  cta,
}: CardProps) {
  const cardContent = (
    <>
      {image && (
        <div className="relative h-48 w-full">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover"
          />
        </div>
      )}

      {icon && !image && (
        <div className="flex items-center justify-center h-24 bg-primary/10">
          <div className="text-primary">
            {icon}
          </div>
        </div>
      )}

      <div className="p-6">
        {tag && (
          <span className="inline-block px-3 py-1 bg-secondary/20 text-secondary-dark text-sm font-medium rounded-full mb-3">
            {tag}
          </span>
        )}

        <h3 className="text-xl font-bold mb-2 text-neutral-charcoal">
          {title}
        </h3>

        <p className="text-neutral-gray-700 mb-4">
          {summary}
        </p>

        {cta && !href && (
          <Link
            href={cta.href}
            className="inline-flex items-center text-primary hover:text-primary-dark font-medium transition-colors"
          >
            {cta.label}
            <svg
              className="ml-2 w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        )}
      </div>
    </>
  )

  if (href) {
    return (
      <Link href={href} className="card block group">
        {cardContent}
      </Link>
    )
  }

  return <div className="card">{cardContent}</div>
}
