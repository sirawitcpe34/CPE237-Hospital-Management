import db from '../../../db'

export default async (req, res) => {
    
        let appointmentID = req.query.appointmentID
        if (req.method === 'GET') {
            let data = await db.query(`
                SELECT "Appointment".*,"Patient"."firstname" AS patient_firstname,"Patient"."lastname" AS patient_lastname
                ,"Patient"."profile_img" AS patient_profile_img,"Room"."roomName" FROM "public"."Appointment" 
                LEFT JOIN "public"."Patient" ON "Patient"."patientID" = "Appointment"."patientID"
                LEFT JOIN "public"."RoomUse" ON "RoomUse"."appointmentID" = "Appointment"."appointmentID"
                LEFT JOIN "public"."Room" ON "Room"."roomID" = "RoomUse"."roomID"
                WHERE "Appointment"."appointmentID" = $1
            `, [appointmentID])
            res.json(data.rows)
        }
}