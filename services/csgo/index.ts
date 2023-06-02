import { csgo } from '../ports'
import createEventServer from './csgo-event-server/src'

const server = createEventServer({
  port: csgo
})