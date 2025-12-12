import mysql from 'mysql2/promise'
import { config } from '../config.js'
import { logger } from '../utils/logger.js'

const pool = mysql.createPool({
  host: config.tidb.host,
  port: config.tidb.port,
  user: config.tidb.user,
  password: config.tidb.password,
  database: config.tidb.database,
  connectionLimit: 5,
  acquireTimeout: 5000,
})

export async function explainJson(sql: string): Promise<any> {
  const [rows] = await pool.query<mysql.RowDataPacket[]>(
    'EXPLAIN FORMAT=JSON ?',
    [sql]
  )
  const json = (rows[0] as any)['EXPLAIN']
  return JSON.parse(json)
}

export async function getTableDdl(table: string): Promise<string> {
  const [rows] = await pool.query<mysql.RowDataPacket[]>(
    'SHOW CREATE TABLE ??',
    [table]
  )
  return (rows[0] as any)['Create Table']
}

export async function getStats(table: string): Promise<any> {
  const [rows] = await pool.query<mysql.RowDataPacket[]>(
    'SELECT * FROM mysql.stats_histograms WHERE table_name = ?',
    [table]
  )
  return rows
}

export async function ping(): Promise<boolean> {
  try {
    await pool.query('SELECT 1')
    return true
  } catch (e) {
    logger.error(e)
    return false
  }
}