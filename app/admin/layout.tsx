import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin | AI Data Science Club',
  description: 'Content management for AI Data Science Club',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
