import pg from 'pg'
const pool = new pg.Pool({ connectionString: 'postgresql://program:ToBoq8OzZcYTKVLbyzCvwQ@free-tier6.gcp-asia-southeast1.cockroachlabs.cloud:26257/defaultdb?sslmode=verify-full&options=--cluster%3Dbrobrobro-2568' })
export default {
    query: (text, callback) =>
    {
        return pool.query(text, callback)
    }
}