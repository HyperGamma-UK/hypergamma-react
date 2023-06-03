// @ts-ignore
import { csgo } from '@/services/ports.js'
import { handleEvent } from './events.js'

import { setState } from '../../utils/state'

export const appid = 730

const backendBaseUri = `http://127.0.0.1:${globalThis.commoners.services.csgo.port}`

export const isInstalled = async () => fetch(`${backendBaseUri}/installed`).then((res: any) => res.json(res))

// ---------------------------- Get CS:GO Events ----------------------------
var source = new EventSource(`${backendBaseUri}/events`);

let previousUpdate: any = {}

const updateUI = (id: string, latest: any, previous: any, isNew: boolean) => {

    if (previousUpdate[id] === latest) return // No update to the UI expected

    previousUpdate[id] = latest

    setState({
        [id]: {
            value: latest, 
            previous,
            isNew
        }
    })
}

function onOpen() {
    console.warn('Event source opened!')
}

// source.addEventListener('progress', handleSSEEvent, false);
source.addEventListener('message', (ev) => handleEvent(ev, updateUI));
 
source.addEventListener('error', function() {
    console.error("Failed to connect to event stream.");
}, false);

source.addEventListener("open", onOpen);
