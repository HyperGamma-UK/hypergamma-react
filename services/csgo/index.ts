import { csgo } from '../ports'
import createEventServer from './csgo-event-server/src'


const port = process.argv[2] ?? csgo
const server = createEventServer({ port })