import db from '../../db'

export default async (req, res) => {

    let headers = {
        "start_date":"2022-05-14T09:23:11.087Z", //isostring
        "end_date":"2022-05-14T09:23:11.087Z", //isostring
        "departmentid":"1",
    }

    let departmentID = req.headers.departmentid
    let date1 = new Date(req.headers.start_date)
    let date2 = new Date(req.headers.end_date)

    const availableDoctor = await db.query(`
        SELECT "Staff"."staffID", "Staff"."firstname", "Staff"."lastname", "Staff"."profile_img"
        FROM "Staff"  WHERE "Staff"."departmentID" = $1 GROUP BY "Staff"."staffID"
        HAVING (SELECT COUNT(*) FROM "Appointment" WHERE "Appointment"."staffID" = "Staff"."staffID" 
        AND (("start_time" BETWEEN $2 AND $3) OR ("end_time" BETWEEN $2 AND $3))) = 0
    `,[departmentID,date1,date2])

    res.json(availableDoctor.rows)

}