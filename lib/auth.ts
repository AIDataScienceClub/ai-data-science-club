import { cookies } from 'next/headers'

const SESSION_NAME = 'admin_session'
const SESSION_VALUE = 'authenticated'

export async function isAuthenticated(): Promise<boolean> {
  try {
    const cookieStore = await cookies()
    const session = cookieStore.get(SESSION_NAME)
    return session?.value === SESSION_VALUE
  } catch {
    return false
  }
}

export function unauthorizedResponse() {
  return new Response(
    JSON.stringify({ error: 'Unauthorized - Please log in to admin' }),
    { status: 401, headers: { 'Content-Type': 'application/json' } }
  )
}
