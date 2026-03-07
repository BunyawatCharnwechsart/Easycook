import { Hono } from "hono";
import { getDb } from "../db";

const menu = new Hono()

menu.post('/', async (c) =>{
    try {
        const body = await c.req.parseBody()
        // parse fields จาก FormData
        const uid          = Number(body['uid'])
        const mname        = body['mname'] as string
        const cooktime     = Number(body['cooktime'])
        const description  = body['description'] as string | undefined
        const categoryname = body['categoryname'] as string
        const ingredients  = JSON.parse((body['ingredients'] as string) || '[]') as string[]
        const steps        = JSON.parse((body['steps'] as string) || '[]') as { step: string; step_image?: string }[]

         // validate
        if (!uid || !mname || !cooktime || !categoryname) {
            return c.json({ error: 'กรุณากรอกข้อมูลให้ครบ' }, 400)
        }

        // อัปโหลดรูปถ้ามี
        let coverImageUrl: string | null = null
        const file = body['cover_image'] as File

        if (file instanceof File && file.size > 0) {
            const allowed = ['image/jpeg', 'image/png', 'image/webp']
            if (!allowed.includes(file.type)) {
                return c.json({ error: 'รองรับเฉพาะ jpg, png, webp' }, 400)
            }
            if (file.size > 5 * 1024 * 1024) {
                return c.json({ error: 'ไฟล์ใหญ่เกิน 5MB' }, 400)
            }

            const r2 = (c.env as any).easycookimage
            const ext = file.name.split('.').pop()
            const key = `menu/${Date.now()}-${crypto.randomUUID()}.${ext}`

            await r2.put(key, file.stream(), {
                httpMetadata: { contentType: file.type },
            })

            coverImageUrl = `https://pub-ce33e4744cab47488a6d6c1d27d3883f.r2.dev/${key}` // เปลี่ยนเป็น public domain จริง
        }

        const db = getDb(c)

        // หา categoryid
        const category = await db.prepare(
            'SELECT categoryid FROM category WHERE categoryname = ?'
        ).bind(categoryname).first()

        if (!category) {
            return c.json({ error: 'ไม่พบหมวดหมู่ที่ระบุ' }, 400)
        }

        // insert menu
        const menuResult = await db.prepare(`
            INSERT INTO menu (uid, categoryid, mname, cooktime, description, cover_image, status)
            VALUES (?, ?, ?, ?, ?, ?, 'published')
        `).bind(uid, (category as any).categoryid, mname, cooktime, description ?? null, coverImageUrl).run()

        const menuid = menuResult.meta.last_row_id

        // insert ingredients
        if (ingredients.length > 0) {
            await db.batch(
                ingredients.map((name: string, index: number) =>
                    db.prepare(`
                        INSERT INTO ingredient (menuid, ingredient_order, ingredient_name)
                        VALUES (?, ?, ?)
                    `).bind(menuid, index + 1, name)
                )
            )
        }

        // insert steps
        if (steps.length > 0) {
            await db.batch(
                steps.map((s: { step: string; step_image?: string }, index: number) =>
                    db.prepare(`
                        INSERT INTO makestep (menuid, step_order, step, step_image)
                        VALUES (?, ?, ?, ?)
                    `).bind(menuid, index + 1, s.step, s.step_image ?? null)
                )
            )
        }

        return c.json({ message: 'Created', menuid }, 201)
    } catch(err:any){
        return c.json({ error: err?.message || String(err) }, 500)
    }
})

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