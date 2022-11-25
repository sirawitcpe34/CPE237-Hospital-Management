import db from '../../db'

export default async (req, res) =>
{
    if (req.method === 'GET')
    {
        let totalimportC = await db.query(`
        SELECT SUM("amount") OVER () AS "Sumamount" FROM "public"."OrderDetail"
        LEFT JOIN "public"."Order" ON "Order"."orderID" = "OrderDetail"."orderID"
        WHERE CAST("dateInStock" AS DATE) >= CAST(NOW() AS DATE) - 30
        `)

        let totalimportL = await db.query(`
        SELECT SUM("amount") OVER () AS "Sumamount" FROM "public"."OrderDetail"
        LEFT JOIN "public"."Order" ON "Order"."orderID" = "OrderDetail"."orderID"
        WHERE CAST("dateInStock" AS DATE) >= CAST(NOW() AS DATE) - 60
        `)
        
        let totalexportMC = await db.query(`
        SELECT SUM("MedicineWithdraw"."withdrawAmount") OVER () AS "MedSumamount"
		FROM "public"."Appointment"
        INNER JOIN "public"."MedicineWithdraw" ON "MedicineWithdraw"."appointmentID" = "Appointment"."appointmentID" 
        WHERE CAST("end_time" AS DATE) >= CAST(NOW() AS DATE) - 30
        `)

        let totalexportDC = await db.query(`
        SELECT SUM("DeviceWithdraw"."withdrawAmount") OVER () AS "DeSumamount"
		FROM "public"."Appointment"
        INNER JOIN "public"."DeviceWithdraw" ON "DeviceWithdraw"."appointmentID" = "Appointment"."appointmentID" 
        WHERE CAST("end_time" AS DATE) >= CAST(NOW() AS DATE) - 30
        `)

        let totalexportML = await db.query(`
        SELECT SUM("MedicineWithdraw"."withdrawAmount") OVER () AS "MedSumamount"
		FROM "public"."Appointment"
        INNER JOIN "public"."MedicineWithdraw" ON "MedicineWithdraw"."appointmentID" = "Appointment"."appointmentID" 
        WHERE CAST("end_time" AS DATE) >= CAST(NOW() AS DATE) - 60
        `)

        let totalexportDL = await db.query(`
        SELECT SUM("DeviceWithdraw"."withdrawAmount") OVER () AS "DeSumamount"
		FROM "public"."Appointment"
        INNER JOIN "public"."DeviceWithdraw" ON "DeviceWithdraw"."appointmentID" = "Appointment"."appointmentID" 
        WHERE CAST("end_time" AS DATE) >= CAST(NOW() AS DATE) - 60
        `)

        let toporgan = await db.query(`
        SELECT "organization_name", COUNT("Order"."organizationID") AS "TopOrgan" 
            FROM "public"."Order"
            INNER JOIN "public"."Organization" ON "Organization"."organizationID" = "Order"."organizationID" 
            WHERE CAST("dateInStock" AS DATE) >= CAST(NOW() AS DATE) - 30 
            GROUP BY "organization_name"
            HAVING COUNT("Order"."organizationID") = (
                SELECT MAX("CNTOrgan")
                FROM (SELECT "organization_name", COUNT("Order"."organizationID") AS "CNTOrgan" 
                FROM "public"."Order"
                INNER JOIN "public"."Organization" ON "Organization"."organizationID" = "Order"."organizationID" 
                WHERE CAST("dateInStock" AS DATE) >= CAST(NOW() AS DATE) - 30 
                GROUP BY "organization_name"))
        `)
        
        let topmedicine = await db.query(`
        SELECT "medicine_name", SUM("MedicineWithdraw"."withdrawAmount") AS "TopMed"
        FROM "public"."MedicineWithdraw"
        INNER JOIN "public"."Medicine" ON "Medicine"."medicineID" = "MedicineWithdraw"."medicineID" 
        INNER JOIN "public"."Appointment" ON "Appointment"."appointmentID" = "MedicineWithdraw"."appointmentID"
        WHERE CAST("end_time" AS DATE) >= CAST(NOW() AS DATE) - 30 
        GROUP BY "medicine_name"
        HAVING SUM("MedicineWithdraw"."withdrawAmount") = (
        SELECT MAX("SUMMed")
            FROM (SELECT "medicine_name", SUM("MedicineWithdraw"."withdrawAmount") AS "SUMMed"
            FROM "public"."MedicineWithdraw"
            INNER JOIN "public"."Medicine" ON "Medicine"."medicineID" = "MedicineWithdraw"."medicineID" 
            INNER JOIN "public"."Appointment" ON "Appointment"."appointmentID" = "MedicineWithdraw"."appointmentID"
            WHERE CAST("end_time" AS DATE) >= CAST(NOW() AS DATE) - 30 
            GROUP BY "medicine_name")) 
        `)
        
        res.json({
            totalimportC: totalimportC.rows[0].Sumamount,
            totalimportL: totalimportL.rows[0].Sumamount,
            totalexportMC: totalexportMC.rows[0].MedSumamount,
            totalexportDC: totalexportDC.rows[0].DeSumamount,
            totalexportML: totalexportML.rows[0].MedSumamount,
            totalexportDL: totalexportDL.rows[0].DeSumamount,
            toporgan:  toporgan.rows[0].TopOrgan,
            toporganName:  toporgan.rows[0].organization_name,
            topmedicine: topmedicine.rows[0].TopMed,
            topmedicineName: topmedicine.rows[0].medicine_name
        })
    }
}