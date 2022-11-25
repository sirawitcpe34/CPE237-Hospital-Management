import db from '../../../db'

export default async (req,res)=>{
    
    let orderID = req.query.orderID

    if(req.method === 'GET')
    {
        // let data = await db.query(`
        // SELECT * FROM "public"."OrderDetail"
        // LEFT JOIN "public"."Order" ON "Order"."orderID" = "OrderDetail"."orderID"
        // LEFT JOIN "public"."Organization" ON "Organization"."organizationID" = "Order"."organizationID"
        // LEFT JOIN "public"."Medicine" ON "Medicine"."medicineID" = "OrderDetail"."medicineID"
        // LEFT JOIN "public"."Device" ON "Device"."deviceID" = "OrderDetail"."deviceID" 
        // WHERE "orderID" = $1`
        // ,[orderID])
        // res.json(data.rows[0])

        let orderDetail = await db.query(`
            SELECT "Order".*,"Organization"."organization_name" FROM "public"."Order"  
            LEFT JOIN "public"."Organization" ON "Organization"."organizationID" = "Order"."organizationID"
            WHERE "orderID" = $1
        `,[orderID])

        let medicine = await db.query(`
            SELECT "OrderDetail"."medicineID", "OrderDetail"."amount"
            ,"OrderDetail"."o_priceperunit","Medicine"."medicine_name" FROM "public"."OrderDetail"
            LEFT JOIN "public"."Medicine" ON "Medicine"."medicineID" = "OrderDetail"."medicineID"
            LEFT JOIN "public"."Order" ON "Order"."orderID" = "OrderDetail"."orderID"
            WHERE "OrderDetail"."orderID" = $1 AND "OrderDetail"."medicineID" IS NOT NULL`
            , [orderID])
       
        let device = await db.query(`
            SELECT "OrderDetail"."deviceID", "OrderDetail"."amount"
            ,"OrderDetail"."o_priceperunit","Device"."device_name" FROM "public"."OrderDetail"
            LEFT JOIN "public"."Device" ON "Device"."deviceID" = "OrderDetail"."deviceID"
            LEFT JOIN "public"."Order" ON "Order"."orderID" = "OrderDetail"."orderID"
            WHERE "OrderDetail"."orderID" = $1 AND "OrderDetail"."deviceID" IS NOT NULL`
            , [orderID])

        res.json({...orderDetail.rows[0],medicine: medicine.rows, device: device.rows})

    }
}