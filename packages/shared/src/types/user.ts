export interface User {
  id: string
  email: string
  createdAt: string
  updatedAt: string
}

export interface AuthTokenPayload {
  userId: string
  email: string
}
