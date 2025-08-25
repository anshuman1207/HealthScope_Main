import jwt from 'jsonwebtoken'
import { NextRequest } from 'next/server'

// Interface to define the structure of the JWT payload
interface DecodedToken {
  userId: string
  // You can add other properties here if needed, like 'role' or 'email'
  [key: string]: any
}

const JWT_SECRET = process.env.JWT_SECRET

if (!JWT_SECRET) {
  // In a production environment, this should be a robust error handling strategy.
  // We throw an error here to prevent the server from starting if the secret is missing.
  console.error('JWT_SECRET is not defined in environment variables.')
  throw new Error('JWT_SECRET is not defined.')
}

/**
 * Creates a new JWT token for a given user.
 * @param payload The data to be encoded into the token.
 * @returns A signed JWT token string.
 */
export const createToken = (payload: object): string => {
  // The token will expire in 1 day for security. You can adjust this.
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' })
}

/**
 * Verifies a JWT token from a request header and decodes its payload.
 * @param token The JWT token string.
 * @returns The decoded payload if the token is valid.
 * @throws An error if the token is missing, invalid, or expired.
 */
export const verifyToken = (token: string): DecodedToken => {
  try {
    return jwt.verify(token, JWT_SECRET) as DecodedToken
  } catch (error) {
    console.error('Token verification failed:', error)
    throw new Error('Invalid or expired token.')
  }
}