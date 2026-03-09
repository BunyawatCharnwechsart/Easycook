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



export default category