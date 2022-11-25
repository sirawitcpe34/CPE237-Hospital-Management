import db from '../../db/index'

export default async (req, res) =>
{
    if (req.method === 'GET')
    {

        let result = await db.query(`SELECT * FROM "public"."Disease" `)
        res.json(result.rows)
    
    }
}