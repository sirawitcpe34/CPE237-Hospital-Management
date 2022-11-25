import db from '../../db'
export default async function handler (req, res)
{
   if(req.method=="POST")
   {
       let result = await db.query('SELECT * FROM "public"."Device"')
       res.json(result.rows)
   }
}
