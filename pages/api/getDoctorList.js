import db from '../../db'

export default async (req,res)=>{
    if(req.method === 'GET'){
        let result = await db.query(`SELECT * FROM "public"."Staff" WHERE "Staff"."positionID" = 1`)
        res.json(result.rows)
    }
}