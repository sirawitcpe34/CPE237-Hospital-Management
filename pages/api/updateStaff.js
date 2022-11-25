import db from '../../db'

export default async (req, res) =>
{
    const {staffID, firstname, lastname, dob, citizenID, license_number, phone_number,
        salary, username, password, email, profile_img, positionID, departmentID } = req.body

    if (req.method == "POST")
    {
        if (firstname && lastname && dob && citizenID && license_number && phone_number && salary &&
            username && password && email && profile_img && positionID && departmentID)
        {
            let result = await db.query(`
                UPDATE "public"."Staff" SET "firstname"=$1, "lastname"=$2, "citizenID"=$3,
                "birthDate"=$4,"licensed_number"=$5,"phone_number"=$6,"salary"=$7,"username"=$8,
                "password"=$9,"email"=$10,"profile_img"=$11,"positionID"=$12,"departmentID"=$13
                WHERE "staffID"=$14 RETURNING *
            `,[firstname, lastname, citizenID, dob, license_number, phone_number, salary,
                username, password, email, profile_img, positionID, departmentID, staffID])
            res.json(result.rows[0])        
        }
        else
            res.send('Register failed')
    }
}