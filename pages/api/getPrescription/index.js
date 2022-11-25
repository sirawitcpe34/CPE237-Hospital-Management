import db from '../../../db/index'
import { decode } from 'js-base64'

export default async (req, res) =>
{
    if (req.method === 'GET')
    {
        let page = req.headers.page
        let search = decode(req.headers.search || '').toLowerCase()

        let result = await db.query(`
            SELECT "Appointment".*,"Patient"."firstname" AS patient_firstname,"Patient"."lastname" AS patient_lastname,
                    "Patient"."profile_img" AS patient_profile_img,"Room"."roomName", "Staff".firstname AS staff_firstname,
                    "Staff".lastname AS staff_lastname, "Staff"."profile_img" AS staff_profile_img,
                    CEILING(COUNT(*) OVER()/10) as page_amount FROM "Appointment"
                    LEFT JOIN "Patient" ON "Patient"."patientID" = "Appointment"."patientID"
                    LEFT JOIN "Staff" ON "Staff"."staffID" = "Appointment"."staffID"
                    LEFT JOIN "public"."RoomUse" ON "RoomUse"."appointmentID" = "Appointment"."appointmentID"
                    LEFT JOIN "public"."Room" ON "Room"."roomID" = "RoomUse"."roomID"
                    WHERE "Appointment"."summary" IS NOT NULL AND "Appointment"."isCompleted" = false AND
                    (LOWER(CONCAT("Patient".firstname,' ',"Patient".lastname)) LIKE '%${search}%')
                    ORDER BY "appointmentID" ASC LIMIT 10 OFFSET $1
        `, [(page - 1) * 10])
        res.json(result.rows)
    }
}