import db from '../../db'

export default async (req, res) =>
{
    if (req.method === 'GET')
    {
        let result = await db.query(`SELECT "deviceID", "device_name" FROM "public"."Device"`)
        res.json(result.rows)
    }
}