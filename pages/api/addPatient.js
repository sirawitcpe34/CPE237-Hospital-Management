import db from '../../db'
import addLog from '../../functions/addLog'
export default async (req, res)=>
{
    const { firstname, lastname, dob, gender, address, phone, citizenID,
            EC_name, EC_relationship, EC_phone, allergy, blood, med_history, insurance,profile_img } = req.body

    if(req.method=="POST")
    {
        if(firstname && lastname && dob && gender && address && phone && citizenID &&
            EC_name && EC_relationship && EC_phone && blood)
        {
            let result = await db.query(`INSERT INTO "public"."Patient" ("firstname", "lastname", "birthDate", 
                            "gender", "address", "phone_number", "citizenID", "EC_name", 
                            "EC_Relationship", "EC_phone", "allergy", "bloodGroup", "med_history", "insurance","profile_img") 
                            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14,$15) RETURNING *`,
                    [firstname, lastname, dob, gender, address, phone, citizenID,
                    EC_name, EC_relationship, EC_phone, allergy, blood, med_history, insurance,profile_img])
            
            addLog(req.headers.staffid,`Add new patient ${firstname} ${lastname}`,new Date(),'')
            
            res.json(result.rows[0])
        }
        else
            res.send('Register failed')
    }
}