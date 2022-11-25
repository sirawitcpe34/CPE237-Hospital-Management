import db from '../../db'

export default async (req, res) =>
{
    const { patientID, firstname, lastname, dob, gender, address, phone, citizenID,
        EC_name, EC_relationship, EC_phone, allergy, blood, med_history, insurance, profile_img } = req.body
    console.log(req.body)
    if (req.method == "POST")
    {
        if (patientID && firstname && lastname && dob && gender && address && phone && citizenID &&
            EC_name && EC_relationship && EC_phone && blood)
        {
            let result = await db.query(`
                UPDATE "public"."Patient" SET "firstname"=$1, "lastname"=$2, "birthDate"=$3,
                "gender"=$4,"address"=$5,"phone_number"=$6,"citizenID"=$7,"EC_name"=$8,
                "EC_Relationship"=$9,"EC_phone"=$10,"allergy"=$11,"bloodGroup"=$12,
                "med_history"=$13,"insurance"=$14,"profile_img" = $15 WHERE "patientID" = $16 
            `,
                [firstname, lastname, dob, gender, address, phone, citizenID,
                    EC_name, EC_relationship, EC_phone, allergy, blood, med_history, insurance
                    , profile_img, patientID])

            res.json(result.rows[0])
        }
        else
            res.send('Update failed')
    }
}