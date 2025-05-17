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

const logUserAction = async (user_id, action) => {
    await pool.query(
        "INSERT INTO user_activity_log (user_id, action) VALUES ($1, $2)",
        [user_id, action]
    );
};

export default logUserAction;