import { Hono } from "hono";
import { getDb } from "../db";

const menu = new Hono()

// All menu
menu.get('/', async (c) => {
    try {
        const db = getDb(c)

        const menuList = await db.prepare(`
            SELECT 
                m.*,
                c.categoryname,
                u.name          AS author_name,
                u.username      AS author_username,
                u.profile_image AS author_image
            FROM menu m
            JOIN category c ON m.categoryid = c.categoryid
            JOIN users u    ON m.uid = u.uid
            WHERE m.status = 'published'
            ORDER BY m.created_at DESC
        `)
        .all()

        if (!menuList.results || menuList.results.length === 0) {
            return c.json([])
        }

        // ดึง ingredients และ steps ของทุกเมนูพร้อมกัน
        const menuIds = menuList.results.map((m: any) => m.menuid)
        const placeholders = menuIds.map(() => '?').join(', ')

        const [ingredients, steps] = await Promise.all([
            db.prepare(`
                SELECT * FROM ingredient
                WHERE menuid IN (${placeholders})
                ORDER BY menuid, ingredient_order
            `)
            .bind(...menuIds)
            .all(),

            db.prepare(`
                SELECT * FROM makestep
                WHERE menuid IN (${placeholders})
                ORDER BY menuid, step_order
            `)
            .bind(...menuIds)
            .all(),
        ])

        // Group ingredients และ steps ตาม menuid
        const ingredientMap: Record<number, any[]> = {}
        const stepMap: Record<number, any[]> = {}

        for (const ing of ingredients.results) {
            const id = (ing as any).menuid
            if (!ingredientMap[id]) ingredientMap[id] = []
            ingredientMap[id].push(ing)
        }

        for (const step of steps.results) {
            const id = (step as any).menuid
            if (!stepMap[id]) stepMap[id] = []
            stepMap[id].push(step)
        }

        const result = menuList.results.map((m: any) => ({
            ...m,
            ingredients: ingredientMap[m.menuid] || [],
            steps:       stepMap[m.menuid]       || [],
        }))

        return c.json(result)

    } catch (err: any) {
        return c.json({ error: err?.message || String(err) }, 500)
    }
})

//menu+วัตถุดิบ,ขั้นตอน by ID
menu.get('/:menuid', async (c) => {
    try {
        const menuid = Number(c.req.param('menuid'))
        if (Number.isNaN(menuid)) {
            return c.json({ error: 'Invalid menu id' }, 400)
        }

        const db = getDb(c)

        // ดึงข้อมูลเมนู + ชื่อ category + ชื่อ user พร้อมกัน
        const [menuRow, ingredients, steps] = await Promise.all([
            db.prepare(`
                SELECT 
                    m.*,
                    c.categoryname,
                    u.name     AS author_name,
                    u.username AS author_username,
                    u.profile_image AS author_image
                FROM menu m
                JOIN category c ON m.categoryid = c.categoryid
                JOIN users u    ON m.uid = u.uid
                WHERE m.menuid = ?
            `).bind(menuid).first(),

            db.prepare(`
                SELECT ingredient_order, ingredient_name
                FROM ingredient
                WHERE menuid = ?
                ORDER BY ingredient_order
            `).bind(menuid).all(),

            db.prepare(`
                SELECT step_order, step, step_image
                FROM makestep
                WHERE menuid = ?
                ORDER BY step_order
            `).bind(menuid).all(),
        ])

        if (!menuRow) {
            return c.json({ error: 'Not found' }, 404)
        }

        return c.json({
            ...menuRow,
            ingredients: ingredients.results,
            steps: steps.results,
        })

    } catch (err: any) {
        return c.json({ error: err?.message || String(err) }, 500)
    }
})

// ============================================================
//  DELETE /:menuid  — ลบเมนู (ingredient + step ลบตาม CASCADE)
// ============================================================
menu.delete('/:menuid', async (c) => {
    try {
        const menuid = Number(c.req.param('menuid'))
        if (Number.isNaN(menuid)) {
            return c.json({ error: 'Invalid menu id' }, 400)
        }

        const db = getDb(c)

        // เช็คก่อนว่ามีเมนูนี้อยู่ไหม
        const existing = await db.prepare(
            'SELECT menuid FROM menu WHERE menuid = ?'
        ).bind(menuid).first()

        if (!existing) {
            return c.json({ error: 'Not found' }, 404)
        }

        // ลบ menu — ingredient + makestep จะลบตาม ON DELETE CASCADE อัตโนมัติ
        await db.prepare(
            'DELETE FROM menu WHERE menuid = ?'
        ).bind(menuid).run()

        return c.json({ message: 'Deleted', menuid })

    } catch (err: any) {
        return c.json({ error: err?.message || String(err) }, 500)
    }
})

export default menu