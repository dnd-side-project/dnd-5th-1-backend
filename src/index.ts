import 'dotenv/config'
import Server from './server'

console.log(process.env.JWT_SECRET)
const server = new Server()
server.start()
