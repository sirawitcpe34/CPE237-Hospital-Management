import db from '../db'

export default async (staffID,description,date,note) =>{
    console.log('staffid','staffid')
    let result = await db.query(`
        INSERT INTO "public"."Log" ("staffID","description","date","note") 
        VALUES ($1,$2,$3,$4) RETURNING *`, [staffID, description, date, note])
    return result.rows[0]
}