import db from '../../db'

export default async (req, res) =>
{
    if (req.method === 'GET')
    {
        let result = await db.query(`SELECT "medicineID", "medicine_name" FROM "public"."Medicine"`)
        res.json(result.rows)
    }
}