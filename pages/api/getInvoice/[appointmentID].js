import db from '../../../db'

export default async (req, res) =>
{
    if (req.method === 'GET')
    {
        let appointmentID  = req.query.appointmentID
        let patientdata = await db.query(`
        SELECT "appointmentID", "firstname", "lastname", "gender", "citizenID", "insurance", "end_time" FROM "public"."Appointment"
        INNER JOIN "public"."Patient" ON "Patient"."patientID" = "Appointment"."patientID"
        WHERE "Appointment"."appointmentID" = $1
        `,[appointmentID])

        let totalroom = await db.query(`
        SELECT "roomName","RoomUse"."price","unit","unit" * "RoomUse"."price" AS "R_Total" FROM "public"."Appointment"
        INNER JOIN "public"."RoomUse" ON "RoomUse"."appointmentID" = "Appointment"."appointmentID"
        INNER JOIN "public"."Patient" ON "Patient"."patientID" = "Appointment"."patientID"
        INNER JOIN "public"."Room" ON "Room"."roomID" = "RoomUse"."roomID"
        WHERE "RoomUse"."price" != 0 AND "Appointment"."appointmentID" = $1
        `,[appointmentID])
        
        let totaldevice = await db.query(`
        SELECT "device_name","DeviceWithdraw"."price_per_unit","withdrawAmount","withdrawAmount" * "DeviceWithdraw"."price_per_unit" AS "Total" FROM "public"."Appointment"
        INNER JOIN "public"."DeviceWithdraw" ON "DeviceWithdraw"."appointmentID" = "Appointment"."appointmentID"
        INNER JOIN "public"."Patient" ON "Patient"."patientID" = "Appointment"."patientID"
        INNER JOIN "public"."Device" ON "Device"."deviceID" = "DeviceWithdraw"."deviceID"
        WHERE "DeviceWithdraw"."price_per_unit" != 0 AND "Appointment"."appointmentID" = $1
        `,[appointmentID])

        let totalmedicine = await db.query(`
        SELECT "medicine_name","MedicineWithdraw"."price_per_unit","withdrawAmount","withdrawAmount" * "MedicineWithdraw"."price_per_unit" AS "Total" FROM "public"."Appointment"
        INNER JOIN "public"."MedicineWithdraw" ON "MedicineWithdraw"."appointmentID" = "Appointment"."appointmentID"
        INNER JOIN "public"."Patient" ON "Patient"."patientID" = "Appointment"."patientID"
        INNER JOIN "public"."Medicine" ON "Medicine"."medicineID" = "MedicineWithdraw"."medicineID"
        WHERE "MedicineWithdraw"."price_per_unit" != 0 AND "Appointment"."appointmentID" = $1
        `,[appointmentID])
        
        res.json({
            patientdata: patientdata.rows,
            totalroom: totalroom.rows,
            totaldevice: totaldevice.rows,
            totalmedicine: totalmedicine.rows
        })
    }
}