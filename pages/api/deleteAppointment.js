import db from '../../db/index'

export default async (req,res)=>{

    if(req.method==='DELETE')
    {
        let appointmentID = req.headers.appointmentid
        await db.query(`
            DELETE FROM "public"."RoomUse" WHERE "appointmentID" = $1
        `,[appointmentID])
        
        let result = await db.query(`
            DELETE FROM "public"."Appointment" WHERE "appointmentID" = $1
        `,[appointmentID])
        res.json(result.rows)
    }
}