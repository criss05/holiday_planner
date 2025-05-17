import dotenv from "dotenv";
import pkg from 'pg';
dotenv.config();

const { Pool } = pkg;

const pool = new Pool({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
});

const SUSPICIOUS_THRESHOLD = 100;

export async function monitorUserActivity() {
    try {
        const result = await pool.query(`
            SELECT user_id, COUNT(*) as action_count
            FROM user_activity_log
            WHERE timestamp > NOW() - INTERVAL '1 day'
            GROUP BY user_id
            HAVING COUNT(*) > $1
            `, [SUSPICIOUS_THRESHOLD]
        );

        const suspiciousUsers = result.rows.map(row => row.user_id);

        await pool.query(`TRUNCATE monitored_users RESTART IDENTITY`);
        for (const userId of suspiciousUsers) {
            await pool.query(`INSERT INTO monitored_users (user_id) VALUES ($1)`, [userId]);
        }

        console.log('Monitored users updated');
    } catch (err) {
        console.error('Error in monitorUserActivity:', err);
    }
}