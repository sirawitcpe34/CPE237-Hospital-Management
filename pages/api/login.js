import { responseSymbol } from 'next/dist/server/web/spec-compliant/fetch-event'
import db from '../../db'
import jwt from 'jsonwebtoken'
export default async function handler(req, res)
{
    const mySecretKeyBro = 'secretOrPrivateKey is a string, buffer, or object containing either the secret for HMAC algorithms or the PEM encoded private key for RSA and ECDSA. In case of a private key with passphrase an object { key, passphrase } can be used (based on crypto documentation), in this case be sure you pass the algorithm option.'
    if (req.method == "POST")
    {
        let result = await db.query('SELECT * FROM "public"."Staff" WHERE username = $1'
            , [req.body.username])
        if (result.rows.length != 1)
        {
            res.send("Username not found")
        }
        else
        {
            if (result.rows[0].password == req.body.password)
            {
                let token = jwt.sign({
                    username: result.rows[0].username,
                    staffID: result.rows[0].staffID,
                    positionID: result.rows[0].positionID
                }, mySecretKeyBro, {
                    expiresIn: '6h'
                })
                result.rows[0].token = token
                res.json(result.rows[0])
            }
            else
            {
                res.send("Wrong Password")
            }
        }
    }
}