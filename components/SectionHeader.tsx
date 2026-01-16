interface SectionHeaderProps {
  title: string
  description: string
  align?: 'left' | 'center'
}

export default function SectionHeader({
  title,
  description,
  align = 'left',
}: SectionHeaderProps) {
  const alignClass = align === 'center' ? 'text-center mx-auto' : 'text-left'

  return (
    <div className={`max-w-3xl mb-12 ${alignClass}`}>
      <h2 className="text-3xl md:text-4xl font-bold mb-4 text-neutral-charcoal">
        {title}
      </h2>
      <p className="text-lg text-neutral-gray-700">
        {description}
      </p>
    </div>
  )
}
