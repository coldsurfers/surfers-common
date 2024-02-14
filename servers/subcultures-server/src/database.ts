import { createConnection, Connection } from 'typeorm'
import dotenv from 'dotenv'
import entities from './entity'

dotenv.config()

const {
  DB_TYPE: type,
  DB_HOST: host,
  DB_PORT: port,
  DB_USERNAME: username,
  DB_PASSWORD: password,
  DB_DATABASE: database,
  DB_SYNCHRONIZE: synchronize,
} = process.env

class Database {
  connection: Connection | null = null

  async connect() {
    if (
      !type ||
      !host ||
      !port ||
      !username ||
      !password ||
      !database ||
      !synchronize
    ) {
      return
    }
    try {
      const connection = await createConnection({
        type: type as 'mysql',
        host,
        port: +port,
        username,
        password,
        database,
        synchronize: synchronize === 'true',
        charset: 'utf8mb4_unicode_ci',
        entities,
        // logging: true
      })
      if (connection.isConnected) {
        if (!this.connection) {
          this.connection = connection
        }
        console.log('database is connected')
      }
    } catch (e) {
      console.error(e)
    }
  }

  async getConnection(): Promise<Connection | null> {
    try {
      if (this.connection) {
        return this.connection
      }
      await this.connect()
      return this.connection
    } catch (e) {
      console.error(e)
      return null
    }
  }
}

export default Database
