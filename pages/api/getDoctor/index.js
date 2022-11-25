import db from '../../../db/index'
import {decode} from 'js-base64'
export default async (req, res) =>
{
    let page = req.headers.page
    //if req.headers.department is null set it to false
    let department = req.headers.department === 'null' ? false : req.headers.department
    let search = decode(req.headers.search||'').toLowerCase()
    if (req.method === 'GET')
    {
        if(department){
            let result = await db.query(`SELECT "Staff".*,"Department"."department_name","Position"."position_name",CEILING(COUNT(*) OVER()/8) 
            as page_amount FROM "public"."Staff" LEFT JOIN "public"."Department" 
                ON "Department"."departmentID" = "Staff"."departmentID" LEFT JOIN "public"."Position" ON 
                "Position"."positionID" = "Staff"."positionID"
                WHERE (LOWER("firstname") LIKE '%${search}%' OR LOWER("lastname") LIKE '%${search}%' OR LOWER(CONCAT("firstname",' ',"lastname")) LIKE '%${search}%')
                AND "Department"."department_name" = $1 ORDER BY "Staff"."staffID" LIMIT 8 OFFSET $2`
             , [department,(page - 1) *8])
            res.json(result.rows)
        }
        else{
            let result = await db.query(`SELECT "Staff".*,"Department"."department_name","Position"."position_name",CEILING(COUNT(*) OVER()/8) 
            as page_amount FROM "public"."Staff" LEFT JOIN "public"."Department" 
                ON "Department"."departmentID" = "Staff"."departmentID" LEFT JOIN "public"."Position" ON 
                "Position"."positionID" = "Staff"."positionID" WHERE (LOWER("firstname") LIKE '%${search}%' OR LOWER("lastname") LIKE '%${search}%' 
                OR LOWER(CONCAT("firstname",' ',"lastname")) LIKE '%${search}%')
                ORDER BY "staffID" LIMIT 8 OFFSET $1`, [(page - 1) * 8])
            res.json(result.rows)
        }
    }
}