import { SignJWT, jwtVerify, JWTPayload } from "jose"

export interface TokenPayload extends JWTPayload {
    id: number
    name?: string
    email?: string
}

export async function generateToken(payload: TokenPayload, secret: string): Promise<string> {
    if (!secret) throw new Error("JWT secret is not defined")
    const key = new TextEncoder().encode(secret)
    return new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime("1d")
        .sign(key)
}

export async function verifyToken(token: string, secret: string): Promise<TokenPayload> {
    if (!secret) throw new Error("JWT secret is not defined")
    const key = new TextEncoder().encode(secret)
    const { payload } = await jwtVerify(token, key)
    return payload as TokenPayload
}