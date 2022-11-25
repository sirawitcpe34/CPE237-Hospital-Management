import db from '../../db'
import addLog from '../../functions/addLog'

export default async (req,res)=>{
    let appointmentID = req.body.appointmentid
    if(req.method === 'POST'){
        let result = await db.query(`
        UPDATE "public"."Appointment" SET "isCompleted" = true WHERE "appointmentID" = $1
        `,[appointmentID])
        res.json(result.rows)
    }

    addLog(req.headers.staffid,`Appointment ${appointmentID} is completed`,new Date(),'')
}