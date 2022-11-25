import db from '../../db'
import addLog from '../../functions/addLog'

export default async (req,res)=>{

    let body = {
        "device_name": "กัญชา",
        "description": "อร่อยจัง",
        "d_priceperunit": "20",
        "isPermenant": true
    }

    if(req.method==='POST')
    {
        let device_name = req.body.device_name
        let description = req.body.description
        let d_priceperunit = req.body.d_priceperunit
        let isPermenant = req.body.isPermenant

        let result = await db.query(`
        INSERT INTO "public"."Device" ("device_name","description","d_priceperunit","isPermanent") 
        VALUES ($1,$2,$3,$4) RETURNING *`, [device_name, description, d_priceperunit,isPermenant])

        let log = await addLog(req.headers.staffid,`Add new device name: ${device_name} description: ${description} price: ${d_priceperunit} permanent: ${isPermenant} to database`,new Date())

        res.json(result.rows[0])
    }
}