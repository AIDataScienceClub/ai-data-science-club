import Link from 'next/link'

interface CTAProps {
  label: string
  href: string
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'small' | 'medium' | 'large'
  ariaLabel?: string
  icon?: React.ReactNode
  fullWidth?: boolean
}

export default function CTA({
  label,
  href,
  variant = 'primary',
  size = 'medium',
  ariaLabel,
  icon,
  fullWidth = false,
}: CTAProps) {
  const variantClass = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    ghost: 'btn-ghost',
  }[variant]

  const sizeClass = {
    small: 'btn-small',
    medium: '',
    large: 'btn-large',
  }[size]

  const widthClass = fullWidth ? 'w-full' : ''

  return (
    <Link
      href={href}
      className={`btn ${variantClass} ${sizeClass} ${widthClass}`}
      aria-label={ariaLabel || label}
    >
      {label}
      {icon && <span className="ml-2" aria-hidden="true">{icon}</span>}
    </Link>
  )
}
