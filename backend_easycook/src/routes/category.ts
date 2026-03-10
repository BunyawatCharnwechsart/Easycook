import { Hono } from "hono";
import { getDb } from "../db";

const category = new Hono()

category.get('/', async (c) =>{
        try {
            const db = getDb(c)
            const r = await db.prepare('SELECT * FROM category').all()
            return c.json(r.results || [])
        }catch(err:any){
            return c.json({ err:err?.message || String(err) },500)
        }
    } 
)

category.get('/:categoryid/menu', async (c) => {
    try {
        const categoryid = Number(c.req.param('categoryid'))
        if (Number.isNaN(categoryid)) {
            return c.json({ error: 'Invalid category id' }, 400)
        }

        const db = getDb(c)
        const r = await db.prepare(`
            SELECT 
                m.*,
                c.categoryname,
                u.name          AS author_name,
                u.username      AS author_username,
                u.profile_image AS author_image
            FROM menu m
            JOIN category c ON m.categoryid = c.categoryid
            JOIN users u    ON m.uid = u.uid
            WHERE m.categoryid = ? AND m.status = 'published'
            ORDER BY m.created_at DESC
        `).bind(categoryid).all()

        return c.json(r.results ?? [])

    } catch (err: any) {
        return c.json({ error: err?.message || String(err) }, 500)
    }
})


export default category