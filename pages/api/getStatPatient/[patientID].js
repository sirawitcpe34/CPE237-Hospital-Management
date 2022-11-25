import db from '../../../db'

export default async (req, res) =>
{
    if (req.method === 'GET')
    {
        let patientID  = req.query.patientID
        let totalappC = await db.query(`
        SELECT COUNT("appointmentID") OVER () AS "CNTAppoint" FROM "public"."Appointment"
        INNER JOIN "public"."Patient" ON "Patient"."patientID" = "Appointment"."patientID"
        WHERE CAST("end_time" AS DATE) >= CAST(NOW() AS DATE) - 365 AND "Appointment"."patientID" = $1
        `,[patientID])

        let totalappL = await db.query(`
        SELECT COUNT("appointmentID") OVER () AS "CNTAppoint" FROM "public"."Appointment"
        INNER JOIN "public"."Patient" ON "Patient"."patientID" = "Appointment"."patientID"
        WHERE CAST("end_time" AS DATE) >= CAST(NOW() AS DATE) - 730 AND "Appointment"."patientID" = $1
        `,[patientID])
        
        let totalmedicineC = await db.query(`
        SELECT SUM("withdrawAmount") OVER () AS "CNTMed" FROM "public"."Appointment"
        INNER JOIN "public"."Patient" ON "Patient"."patientID" = "Appointment"."patientID"
        INNER JOIN "public"."MedicineWithdraw" ON "MedicineWithdraw"."appointmentID" = "Appointment"."appointmentID"
        WHERE CAST("Appointment"."end_time" AS DATE) >= CAST(NOW() AS DATE) - 365 AND "Appointment"."patientID" = $1
        `,[patientID])

        let totalmedicineL = await db.query(`
        SELECT SUM("withdrawAmount") OVER () AS "CNTMed" FROM "public"."Appointment"
        INNER JOIN "public"."Patient" ON "Patient"."patientID" = "Appointment"."patientID"
        INNER JOIN "public"."MedicineWithdraw" ON "MedicineWithdraw"."appointmentID" = "Appointment"."appointmentID"
        WHERE CAST("Appointment"."end_time" AS DATE) >= CAST(NOW() AS DATE) - 730 AND "Appointment"."patientID" = $1
        `,[patientID])

        let totaldeviceC = await db.query(`
        SELECT SUM("withdrawAmount") OVER () AS "CNTDe" FROM "public"."Appointment"
        INNER JOIN "public"."Patient" ON "Patient"."patientID" = "Appointment"."patientID"
        INNER JOIN "public"."DeviceWithdraw" ON "DeviceWithdraw"."appointmentID" = "Appointment"."appointmentID"
        WHERE CAST("Appointment"."end_time" AS DATE) >= CAST(NOW() AS DATE) - 365 AND "Appointment"."patientID" = $1
        `,[patientID])

        let totaldeviceL = await db.query(`
        SELECT SUM("withdrawAmount") OVER () AS "CNTDe" FROM "public"."Appointment"
        INNER JOIN "public"."Patient" ON "Patient"."patientID" = "Appointment"."patientID"
        INNER JOIN "public"."DeviceWithdraw" ON "DeviceWithdraw"."appointmentID" = "Appointment"."appointmentID"
        WHERE CAST("Appointment"."end_time" AS DATE) >= CAST(NOW() AS DATE) - 730 AND "Appointment"."patientID" = $1
        `,[patientID])
        
        res.json({
            totalappC: (totalappC.rows[0] != null) ? 
            totalappC.rows[0].CNTAppoint : 0,
            totalappL: (totalappL.rows[0] != null) ? 
            totalappL.rows[0].CNTAppoint : 0,
            totalmedicineC: (totalmedicineC.rows[0] != null) ? 
            totalmedicineC.rows[0].CNTMed : 0,
            totalmedicineL: (totalmedicineL.rows[0] != null) ? 
            totalmedicineL.rows[0].CNTMed : 0,
            totaldeviceC: (totaldeviceC.rows[0] != null) ? 
            totaldeviceC.rows[0].CNTDe : 0,
            totaldeviceL: (totaldeviceL.rows[0] != null) ? 
            totaldeviceL.rows[0].CNTDe : 0
        })
    }
}