import db from '../../../db/index'
import { decode } from 'js-base64'


export default async (req, res) =>
{

    if (req.method === 'GET')
    {
        let result = await db.query(`SELECT "Order"."orderID" FROM "Order"`)
        res.json(result.rows)
    }
}