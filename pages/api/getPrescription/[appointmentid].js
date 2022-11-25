import db from '../../../db/index'
import { decode } from 'js-base64'

export default async (req, res) =>
{
    let appointmentid = req.query.appointmentid

    if (req.method === 'GET')
    {
        const medicine = await db.query(`
        SELECT "MedicineWithdraw".*  FROM "public"."MedicineWithdraw" LEFT JOIN
        "public"."Appointment" ON "Appointment"."appointmentID" = "MedicineWithdraw"."appointmentID"
        WHERE "MedicineWithdraw"."appointmentID" = $1`, [appointmentid])

        const prescription = await db.query(`
        SELECT "DeviceWithdraw".*  FROM "public"."DeviceWithdraw" LEFT JOIN
        "public"."Appointment" ON "Appointment"."appointmentID" = "DeviceWithdraw"."appointmentID"
        WHERE "DeviceWithdraw"."appointmentID" = $1`, [appointmentid])

        res.json({
            medicine: medicine.rows, prescription: prescription.rows
        })
    }
}