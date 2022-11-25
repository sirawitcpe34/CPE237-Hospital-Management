import db from '../../db'

export default async (req, res) =>
{

    let headers = {
        "start_date": "2022-05-14T09:23:11.087Z", //isostring
        "end_date": "2022-05-14T09:23:11.087Z", //isostring
    }
    if (req.method === 'GET')
    {
        let date1 = new Date(req.headers.start_date)
        let date2 = new Date(req.headers.end_date)

        console.log('date1', date1)
        console.log('date2', date2)

        const availableDoctor = await db.query(`
        SELECT "Room".*
        FROM "public"."Room"  GROUP BY "Room"."roomID"
        HAVING (SELECT COUNT(*) FROM "public"."RoomUse" LEFT JOIN
        "public"."Appointment" ON "RoomUse"."appointmentID" = "Appointment"."appointmentID"
        WHERE "RoomUse"."roomID" = "Room"."roomID" 
        AND (("Appointment"."start_time" BETWEEN $1 AND $2) OR ("Appointment"."end_time" BETWEEN $1 AND $2))) = 0
    `, [date1, date2])

        res.json(availableDoctor.rows)
    }
}