import db from '../../db/index'
import addLog from '../../functions/addLog'
export default async (req, res) =>
{

    let data = {
        "start_date": "2022-05-14T09:23:11.087Z", //isostring
        "end_date": "2022-05-14T09:23:11.087Z", //isostring
        "patientID": "1",
        "staffID": "2",
        "roomID": "1",
        "symptoms": "ปวดหัว",
        "note": "กินข้าวน้อยเกินไป",
        "unit": 2,
        "price": 100,
    }

    if (req.method === 'POST')
    {
        let start_date = new Date(req.body.start_date)
        let end_date = new Date(req.body.end_date)
        let patientID = req.body.patientID
        let staffID = req.body.staffID
        let roomID = req.body.roomID
        let symptoms = req.body.symptoms
        let note = req.body.note
        let unit = req.body.unit
        let price = req.body.price

        let patient = await db.query(`
        SELECT "firstname","lastname" FROM "public"."Patient" WHERE "patientID"= $1`
            , [patientID])

        let staff = await db.query(`
            SELECT "firstname","lastname" FROM "public"."Staff" WHERE "staffID"=$1`
            , [staffID])

        let room = await db.query(`
            SELECT "roomName" FROM "public"."Room" WHERE "roomID"=$1`
            , [roomID])


        let appointment = await db.query(`
            INSERT INTO "public"."Appointment" ("start_time","end_time","patientID","staffID","symptoms","note") 
            VALUES ($1,$2,$3,$4,$5,$6) RETURNING *
        `, [start_date, end_date, patientID, staffID, symptoms, note])

        let roomUse = await db.query(`
            INSERT INTO "public"."RoomUse" ("roomID","appointmentID","unit","price") VALUES ($1,$2,$3,$4)
        `, [req.body.roomID, appointment.rows[0].appointmentID, unit, price])

        let log = await addLog(req.headers.staffid, `Schedule an appointment ${appointment.rows[0].appointmentID} for Patient ${patient.rows[0].firstname} ${patient.rows[0].lastname} to meet with Dr.${staff.rows[0].firstname} ${staff.rows[0].lastname} from ${start_date.toLocaleTimeString('en-GB', { timeZone: 'Asia/Bangkok', hour12: false, hour: "numeric", minute: "numeric" })} to ${end_date.toLocaleTimeString('en-GB', { timeZone: 'Asia/Bangkok', hour12: false, hour: "numeric", minute: "numeric" })} ${start_date.toLocaleDateString('en-GB', { timeZone: 'Asia/Bangkok' })} at ${room.rows[0].roomName}`, new Date(), note)

        res.json(appointment.rows[0])

    }
}