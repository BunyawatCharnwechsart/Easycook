import { Hono } from "hono"
import { getDb } from "../db"
import { Bindings } from "../types/bindings"

const usermenu = new Hono<{ Bindings: Bindings }>()

// GET /usermenu/:uid — ดึงข้อมูล user + menu ทั้งหมด
usermenu.get("/:uid", async (c) => {
    const uid = Number(c.req.param("uid"))

    if (isNaN(uid)) {
        return c.json({ message: "Invalid uid" }, 400)
    }

    const db = getDb(c)

    // ดึงข้อมูล user ยกเว้น password และ profile_image
    const user = await db
        .prepare(`
            SELECT uid, name, username, email, created_at
            FROM users
            WHERE uid = ?
        `)
        .bind(uid)
        .first()

    if (!user) {
        return c.json({ message: "ไม่พบผู้ใช้งาน" }, 404)
    }

    // ดึง menu ทั้งหมดของ user
    const menus = await db
        .prepare(`
            SELECT 
                m.menuid,
                m.mname,
                m.cooktime,
                m.cover_image,
                m.description,
                m.status,
                m.created_at,
                c.categoryname
            FROM menu m
            JOIN category c ON m.categoryid = c.categoryid
            WHERE m.uid = ? AND m.status = 'published'
            ORDER BY m.created_at DESC
        `)
        .bind(uid)
        .all()

    return c.json({
        user,
        menus: menus.results,
        total: menus.results.length,
    })
})

export default usermenu