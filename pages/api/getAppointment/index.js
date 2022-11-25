import db from '../../../db/index'
import { decode } from 'js-base64'
import { position } from '@chakra-ui/react'


export default async (req, res) =>
{
    // ยังไม่ได้เช็ค อย่าพึ่งใช้นะจ๊ะ
    let page = req.headers.page
    let search = decode(req.headers.search||'').toLowerCase()
    let positionID = req.headers.positionid

    if (req.method === 'GET')
    {
        if(positionID==3)
        {
            let result = await db.query(`
                        SELECT "Appointment".*,"Patient"."firstname" AS patient_firstname,"Patient"."lastname" AS patient_lastname,
                        "Patient"."profile_img" AS patient_profile_img,"Room"."roomName", "Staff".firstname AS staff_firstname, 
                        "Staff".lastname AS staff_lastname, "Staff"."profile_img" AS staff_profile_img,
                        CEILING(COUNT(*) OVER()/10) as page_amount FROM "Appointment"
                        LEFT JOIN "Patient" ON "Patient"."patientID" = "Appointment"."patientID"
                        LEFT JOIN "Staff" ON "Staff"."staffID" = "Appointment"."staffID"
                        LEFT JOIN "public"."RoomUse" ON "RoomUse"."appointmentID" = "Appointment"."appointmentID"
                        LEFT JOIN "public"."Room" ON "Room"."roomID" = "RoomUse"."roomID"
                        WHERE "Appointment"."summary" IS NULL AND (LOWER(CONCAT("Patient".firstname,' ',"Patient".lastname)) LIKE '%${search}%') AND
                        start_time > now() 
                        ORDER BY "start_time" ASC LIMIT 10 OFFSET $1 `, [(page - 1) * 10])
            res.json(result.rows)
        }
        if(positionID==1)
        {
            let result = await db.query(`
                        SELECT "Appointment".*,"Patient"."firstname" AS patient_firstname,"Patient"."lastname" AS patient_lastname,
                        "Patient"."profile_img" AS patient_profile_img,"Room"."roomName", "Staff".firstname AS staff_firstname, 
                        "Staff".lastname AS staff_lastname, "Staff"."profile_img" AS staff_profile_img,
                        CEILING(COUNT(*) OVER()/10) as page_amount FROM "Appointment"
                        LEFT JOIN "Patient" ON "Patient"."patientID" = "Appointment"."patientID"
                        LEFT JOIN "Staff" ON "Staff"."staffID" = "Appointment"."staffID"
                        LEFT JOIN "public"."RoomUse" ON "RoomUse"."appointmentID" = "Appointment"."appointmentID"
                        LEFT JOIN "public"."Room" ON "Room"."roomID" = "RoomUse"."roomID"
                        WHERE "Appointment"."summary" IS NULL AND (LOWER(CONCAT("Patient".firstname,' ',"Patient".lastname)) LIKE '%${search}%') AND
                        start_time BETWEEN now() - INTERVAL '3 hour' AND now() + INTERVAL '2 day' 
                        ORDER BY "start_time" ASC LIMIT 10 OFFSET $1 `, [(page - 1) * 10])
            res.json(result.rows)
        }
    }
}

// SELECT "Appointment".*,"Patient"."firstname" AS patient_firstname,"Patient"."lastname" AS patient_lastname
//                 ,"Patient"."profile_img" AS patient_profile_img,"Room"."roomName" FROM "public"."Appointment" 
//                 LEFT JOIN "public"."Patient" ON "Patient"."patientID" = "Appointment"."patientID"
//                 LEFT JOIN "public"."RoomUse" ON "RoomUse"."appointmentID" = "Appointment"."appointmentID"
//                 LEFT JOIN "public"."Room" ON "Room"."roomID" = "RoomUse"."roomID"
//                 WHERE "Appointment"."appointmentID" = $1