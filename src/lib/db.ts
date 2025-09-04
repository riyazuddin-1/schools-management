import mysql, { Connection } from "mysql2/promise";

export async function getConnection(): Promise<Connection> {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST as string,
    user: process.env.DB_USER as string,
    password: process.env.DB_PASS as string,
    database: process.env.DB_NAME as string,
  });
  return connection;
}
