import {
  Connection,
  ConnectionOptions,
  createConnection,
  getConnectionManager,
} from 'typeorm'
import { SnakeNamingStrategy } from 'typeorm-snake-naming-strategy'
import { UserModel } from 'infra/models/user-model'
import 'dotenv/config'
import { PostModel } from './models/post-model'
import { VoteModel } from './models/vote-model'
import { PostImageModel } from './models/post-image-model'

const connectionManager = getConnectionManager()

let connection: Connection | undefined

/**
 * connection 객체 조회, 없으면 생성
 */
export const getConnection = async () => {
  const CONNECTION_NAME = 'default'

  if (connectionManager.has(CONNECTION_NAME)) {
    connection = connectionManager.get(CONNECTION_NAME)

    if (!connection.isConnected) {
      connection = await connection.connect()
    }
  } else {
    const connectionOptions: ConnectionOptions = {
      name: CONNECTION_NAME,
      type: 'mysql',
      port: parseInt(process.env.DB_PORT as string),
      logger: 'advanced-console',
      logging: ['error'],
      host: process.env.DB_HOST,
      username: process.env.DB_USER,
      database: process.env.DB_NAME,
      password: process.env.DB_PASS,
      bigNumberStrings: false,
      namingStrategy: new SnakeNamingStrategy(),
      charset: 'utf8mb4_unicode_ci',
      entities: [UserModel, PostModel, PostImageModel, VoteModel],
      synchronize: true,
    }

    connection = await createConnection(connectionOptions)
    if (!connection.isConnected) {
      console.log('Database connecttion failed. retry')
      connection = await connection.connect()
    } else {
      console.log('Database connected')
    }
  }
  return connection
}
