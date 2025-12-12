import { config as dotenv } from 'dotenv'
dotenv()

export const config = {
  port: Number(process.env.PORT ?? 3000),
  tidb: {
    host: process.env.TIDB_HOST!,
    port: Number(process.env.TIDB_PORT ?? 4000),
    user: process.env.TIDB_USER!,
    password: process.env.TIDB_PASSWORD!,
    database: process.env.TIDB_DATABASE!,
  },
}