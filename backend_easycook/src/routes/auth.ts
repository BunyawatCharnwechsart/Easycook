import { Hono } from "hono"
import { hashPassword, comparePassword } from "../utils/hash"
import { generateToken } from "../utils/jwt"
import { getDb } from "../db"
import { Bindings } from "../types/bindings"

export const auth = new Hono<{ Bindings: Bindings }>()

auth.post("/register", async (c) => {
    const { name, username, email, password } = await c.req.json()

    if (!name || !username || !email || !password) {
        return c.json({ message: "Missing fields" }, 400)
    }

    if (username.length < 3 || username.length > 30) {
        return c.json({ message: "Username must be 3-30 characters" }, 400)
    }

    if (password.length < 6) {
        return c.json({ message: "Password must be at least 6 characters" }, 400)
    }

    const db = getDb(c)

    const existing = await db
        .prepare("SELECT uid FROM users WHERE email = ? OR username = ?")
        .bind(email, username)
        .first()

    if (existing) {
        return c.json({ message: "Email or username already exists" }, 409)
    }

    const hashed = await hashPassword(password)

    await db
        .prepare("INSERT INTO users (name, username, email, password) VALUES (?, ?, ?, ?)")
        .bind(name, username, email, hashed)
        .run()

    return c.json({ message: "Registered successfully" }, 201)
})

auth.post("/login", async (c) => {
    const { identifier, password } = await c.req.json()

    if (!identifier || !password) {
        return c.json({ message: "Missing fields" }, 400)
    }

    const db = getDb(c)

    const user = await db
        .prepare(
            "SELECT * FROM users WHERE LOWER(email) = LOWER(?) OR LOWER(username) = LOWER(?)"
        )
        .bind(identifier, identifier)
        .first()

    if (!user) {
        return c.json({ message: "Invalid credentials" }, 401)
    }

    const isValid = await comparePassword(password, user.password as string)

    if (!isValid) {
        return c.json({ message: "Invalid credentials" }, 401)
    }

    const token = await generateToken(
        {
            id: user.uid as number,
            name: user.name as string,
            email: user.email as string,
        },
        c.env.JWT_SECRET
    )

    return c.json({
        token,
        user: {
            id: user.uid,
            name: user.name,
            username: user.username,
            email: user.email,
        },
    })
})