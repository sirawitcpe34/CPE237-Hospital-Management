import db from '../../db'

export default async (req, res) =>
{
    if (req.method === 'GET')
    {
        let page = req.headers.page
        if (page == 0)
        {
            let result = await db.query(`
            SELECT "Log".*,"Staff"."firstname" AS staff_firstname,"Staff"."lastname" AS staff_lastname
            FROM "public"."Log" LEFT JOIN "public"."Staff" ON "Staff"."staffID" = "Log"."staffID"
            `)
            res.json(result.rows)
        }
        else
        {
            let result = await db.query(`
            SELECT "Log".*,"Staff"."firstname" AS staff_firstname,"Staff"."lastname" AS staff_lastname,COUNT(*) OVER() as page_amount
            FROM "public"."Log" LEFT JOIN "public"."Staff" ON "Staff"."staffID" = "Log"."staffID"
            ORDER BY "date" DESC LIMIT 10 OFFSET $1
            `,[(page - 1) * 10])
            res.json(result.rows)
        }
    }
}