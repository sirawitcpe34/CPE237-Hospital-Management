import db from '../../db'
import addLog from '../../functions/addLog'

export default async (req,res)=>{

    let body = {
        "device_name": "กัญชา",
        "description": "อร่อยจัง",
        "m_priceperunit": "20",
    }

    if(req.method==='POST')
    {
        let medicine_name = req.body.medicine_name
        let description = req.body.description
        let m_priceperunit = req.body.m_priceperunit

        let result = await db.query(`
        INSERT INTO "public"."Medicine" ("medicine_name","description","m_priceperunit") 
        VALUES ($1,$2,$3) RETURNING *`,[medicine_name,description,m_priceperunit])

        let log = await addLog(req.headers.staffid, `Add new medicine name: ${medicine_name} description: ${description} price: ${m_priceperunit} to database`, new Date())


        res.json(result.rows[0])
    }
}