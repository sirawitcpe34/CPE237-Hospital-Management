import db from '../../../db'

export default async (req,res)=>{
    let patientID = req.query.patientID
    if(req.method === 'GET')
    {
        let patientData = await db.query(`
        SELECT * FROM "public"."Patient" WHERE "patientID" = $1`
        ,[patientID])
        res.json(patientData.rows[0])
    }
}

