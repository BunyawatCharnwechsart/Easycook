import { Hono } from "hono";
import { getDb } from "../db";

const savedmenu = new Hono()

// GET /savedmenu/:uid — ดึงเมนูที่ user บันทึกไว้
savedmenu.get('/:uid', async (c) => {
    try {
        const uid = Number(c.req.param('uid'))
        if (Number.isNaN(uid)) {
            return c.json({ error: 'Invalid user id' }, 400)
        }

        const db = getDb(c)

        const { results } = await db.prepare(`
            SELECT
                m.menuid,
                m.mname,
                m.cooktime,
                m.description,
                m.cover_image,
                c.categoryname,
                u.name       AS author_name,
                u.username   AS author_username,
                u.profile_image AS author_image,
                s.saved_at
            FROM saved_menu s
            JOIN menu m     ON s.menuid = m.menuid
            JOIN category c ON m.categoryid = c.categoryid
            JOIN users u    ON m.uid = u.uid
            WHERE s.uid = ?
            ORDER BY s.saved_at DESC
        `).bind(uid).all()

        return c.json(results)

    } catch (err: any) {
        return c.json({ error: err?.message || String(err) }, 500)
    }
})

// POST /savedmenu — บันทึกเมนู
savedmenu.post('/', async (c) => {
    try {
        const { uid, menuid } = await c.req.json()
        if (!uid || !menuid) {
            return c.json({ error: 'uid and menuid are required' }, 400)
        }

        const db = getDb(c)

        await db.prepare(`
            INSERT OR IGNORE INTO saved_menu (uid, menuid) VALUES (?, ?)
        `).bind(uid, menuid).run()

        return c.json({ message: 'บันทึกแล้ว' })

    } catch (err: any) {
        return c.json({ error: err?.message || String(err) }, 500)
    }
})

// DELETE /savedmenu — ยกเลิกบันทึก
savedmenu.delete('/', async (c) => {
    try {
        const { uid, menuid } = await c.req.json()
        if (!uid || !menuid) {
            return c.json({ error: 'uid and menuid are required' }, 400)
        }

        const db = getDb(c)

        await db.prepare(`
            DELETE FROM saved_menu WHERE uid = ? AND menuid = ?
        `).bind(uid, menuid).run()

        return c.json({ message: 'ยกเลิกบันทึกแล้ว' })

    } catch (err: any) {
        return c.json({ error: err?.message || String(err) }, 500)
    }
})

export default savedmenu