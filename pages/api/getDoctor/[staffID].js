import db from '../../../db'

export default async (req,res)=>{
    
    let staffID = req.query.staffID

    if(req.method === 'GET')
    {
        let data = await db.query(`
        SELECT * FROM "public"."Staff"  LEFT JOIN "public"."Department" 
        ON "Department"."departmentID" = "Staff"."departmentID" LEFT JOIN "public"."Position" ON
        "Position"."positionID" = "Staff"."positionID" WHERE "staffID" = $1`
        ,[staffID])
        res.json(data.rows[0])
    }
}