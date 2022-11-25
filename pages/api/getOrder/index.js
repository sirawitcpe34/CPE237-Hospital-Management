import db from '../../../db/index'
import {decode} from 'js-base64'

export default async (req, res) =>
{
    let page = req.headers.page
    let search = decode(req.headers.search||'').toLowerCase()
    if (req.method === 'GET')
    {
        let result = await db.query(`SELECT "Order".*,"Organization".*,CEILING(COUNT(*) OVER()/10) 
                    as page_amount FROM "public"."Order" INNER JOIN "public"."Organization" 
                    ON "Organization"."organizationID" = "Order"."organizationID"
                    WHERE (LOWER("Organization"."organization_name") LIKE '%${search}%')
                    ORDER BY "orderID" DESC LIMIT 10 OFFSET $1 `, [(page - 1) * 10])
         res.json(result.rows)
    }
}