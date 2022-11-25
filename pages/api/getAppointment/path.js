import db from '../../../db/index'
import { decode } from 'js-base64'


export default async (req, res) =>
{

    if (req.method === 'GET')
    {
        let result = await db.query(`SELECT "Appointment"."appointmentID" FROM "Appointment"`)
        res.json(result.rows)
    }
}