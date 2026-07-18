export interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'manager' | 'staff'
}

// Simple demo credentials
const DEMO_USERS = [
  { id: '1', email: 'admin@fleksa.com', password: 'admin123', name: 'Admin User', role: 'admin' as const },
  { id: '2', email: 'manager@fleksa.com', password: 'manager123', name: 'Manager User', role: 'manager' as const },
  { id: '3', email: 'chef@fleksa.com', password: 'chef123', name: 'Chef User', role: 'staff' as const },
  { id: '4', email: 'waiter@fleksa.com', password: 'waiter123', name: 'Waiter User', role: 'staff' as const },
]

// Simple token generator
export const generateToken = (): string => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

// Authentication function
export const authenticate = async (email: string, password: string): Promise<{ user: User; token: string }> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300))

  const user = DEMO_USERS.find(u => u.email === email && u.password === password)
  
  if (!user) {
    throw new Error('Invalid email or password')
  }

  const { password: _, ...userWithoutPassword } = user
  const token = generateToken()

  return {
    user: userWithoutPassword,
    token
  }
}

// Sign up function (simple version)
export const signup = async (email: string, password: string, name: string): Promise<{ user: User; token: string }> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300))

  // Check if user already exists
  if (DEMO_USERS.find(u => u.email === email)) {
    throw new Error('User already exists')
  }

  if (!email || !password || !name) {
    throw new Error('All fields are required')
  }

  if (password.length < 6) {
    throw new Error('Password must be at least 6 characters')
  }

  const newUser: User = {
    id: String(DEMO_USERS.length + 1),
    email,
    name,
    role: 'staff'
  }

  const token = generateToken()

  return {
    user: newUser,
    token
  }
}

export const getCurrentUser = (): User | null => {
  if (typeof window === 'undefined') return null
  
  const userData = localStorage.getItem('user')
  if (!userData) return null
  
  try {
    return JSON.parse(userData)
  } catch {
    return null
  }
}

export const setCurrentUser = (user: User) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('user', JSON.stringify(user))
  }
}

export const logout = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('user')
    localStorage.removeItem('auth_token')
  }
}

// Get mock users for staff listing
export const getMockUsers = (): User[] => {
  return DEMO_USERS.map(({ password: _, ...user }) => user)
}
