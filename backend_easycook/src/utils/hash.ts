export async function hashPassword(password: string): Promise<string> {
    const salt = crypto.getRandomValues(new Uint8Array(16))
    const encoder = new TextEncoder()
    const keyMaterial = await crypto.subtle.importKey(
        "raw", encoder.encode(password), "PBKDF2", false, ["deriveBits"]
    )
    const hash = await crypto.subtle.deriveBits(
        { name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" },
        keyMaterial, 256
    )
    const toHex = (buf: Uint8Array) =>
        Array.from(buf).map(b => b.toString(16).padStart(2, "0")).join("")
    return `${toHex(salt)}:${toHex(new Uint8Array(hash))}`
}

export async function comparePassword(password: string, stored: string): Promise<boolean> {
    const [saltHex, hashHex] = stored.split(":")
    const salt = new Uint8Array(saltHex.match(/.{2}/g)!.map(b => parseInt(b, 16)))
    const encoder = new TextEncoder()
    const keyMaterial = await crypto.subtle.importKey(
        "raw", encoder.encode(password), "PBKDF2", false, ["deriveBits"]
    )
    const hash = await crypto.subtle.deriveBits(
        { name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" },
        keyMaterial, 256
    )
    const newHashHex = Array.from(new Uint8Array(hash))
        .map(b => b.toString(16).padStart(2, "0")).join("")
    return newHashHex === hashHex
}