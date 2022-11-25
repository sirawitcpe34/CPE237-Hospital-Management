import db from '../../../db/index'
import {decode} from 'js-base64'

export default async (req, res) =>
{
    let page = req.headers.page
    let search = decode(req.headers.search||'').toLowerCase()
    if (req.method === 'GET')
    {
        if (page == 0)
        {
            let result = await db.query(`SELECT * FROM "public"."Medicine" `)
            res.json(result.rows)
        }
        else
        {
            let result = await db.query(`SELECT "Medicine".*,CEILING(COUNT(*) OVER()/10) as page_amount FROM "public"."Medicine"
            WHERE (LOWER(CONCAT("medicine_name")) LIKE '%${search}%')
            ORDER BY "medicineID" ASC LIMIT 10 OFFSET $1 `, [(page - 1) * 10])
            res.json(result.rows)
        }
    }
}