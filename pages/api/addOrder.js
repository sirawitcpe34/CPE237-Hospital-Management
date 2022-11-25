import db from '../../db/index'
import addLog from '../../functions/addLog'

export default async (req, res) =>
{
    if (req.method === 'POST')
    {
        let dateOrder = req.body.dateOrder
        let dateInStock = req.body.dateInStock
        let organizationID = req.body.organizationID
        let organizationName = req.body.organizationName

        console.log(req.body)
        if (organizationID == '0')
        {
            let organization = await db.query(`
                INSERT INTO "public"."Organization" ("organization_name") VALUES ($1)
                RETURNING *
            `, [organizationName])

            let addOrder = await db.query(`
                INSERT INTO "public"."Order" ("dateOrder","organizationID","dateInStock") VALUES ($1,$2,$3) RETURNING *
            `, [dateOrder, organization.rows[0].organizationID, dateInStock])

            const promise = req.body.medicine.map(async (m) =>
            {
                await db.query(`
                    INSERT INTO "public"."OrderDetail" ("medicineID","amount","o_priceperunit","orderID") VALUES ($1,$2,$3,$4)
                `, [m.medicineID, m.amount, m.price, addOrder.rows[0].orderID])

                await db.query(`
                    UPDATE "public"."Medicine" SET "m_amount" = "m_amount"+ $1 WHERE "medicineID" = $2 RETURNING *
                `,[m.amount, m.medicineID])
            })
            await Promise.all(promise)

            const promise2 = req.body.device.map(async (d) =>
            {
                await db.query(`
                    INSERT INTO "public"."OrderDetail" ("deviceID","amount","o_priceperunit","orderID") VALUES ($1,$2,$3,$4)
                `, [d.deviceID, d.amount, d.price, addOrder.rows[0].orderID])

                await db.query(`
                    UPDATE "public"."Device" SET "d_amount" = "d_amount"+ $1 WHERE "deviceID" = $2
                `,[d.amount, d.deviceID])
            })
            await Promise.all(promise2)

            addLog(req.headers.staffid, `Add stock order From ${organizationName}`,new Date(),'')
            res.json({ "status": "ok" })
        }
        else
        {
            let addOrder = await db.query(`
                INSERT INTO "public"."Order" ("dateOrder","organizationID","dateInStock") VALUES ($1,$2,$3) RETURNING *
            `, [dateOrder, organizationID, dateInStock])

            const promise = req.body.medicine.map(async (m) =>
            {
                await db.query(`
                    INSERT INTO "public"."OrderDetail" ("medicineID","amount","o_priceperunit","orderID") VALUES ($1,$2,$3,$4)
                `, [m.medicineID, m.amount, m.price, addOrder.rows[0].orderID])
           
                await db.query(`
                    UPDATE "public"."Medicine" SET "m_amount" = "m_amount"+ $1 WHERE "medicineID" = $2 RETURNING *
                `, [m.amount, m.medicineID])
                
            })
            await Promise.all(promise)

            const promise2 = req.body.device.map(async (d) =>
            {
                await db.query(`
                    INSERT INTO "public"."OrderDetail" ("deviceID","amount","o_priceperunit","orderID") VALUES ($1,$2,$3,$4)
                `, [d.deviceID, d.amount, d.price, addOrder.rows[0].orderID])
            
                await db.query(`
                    UPDATE "public"."Device" SET "d_amount" = "d_amount"+ $1 WHERE "deviceID" = $2
                `, [d.amount, d.deviceID])
            })
            await Promise.all(promise2)

            
            addLog(req.headers.staffid, `Add stock order From ${organizationName}`, new Date(), '')
            res.json({ "status": "ok" })
        }
    }
}