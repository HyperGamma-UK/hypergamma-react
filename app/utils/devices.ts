
import { initDevice, Devices } from 'device-decoder'
import setState, { subscribe } from './state'

export let active = null

export const selectable = {
    BLE:{
        hegduino:'HEGduino',
        hegduinoV1:'HEGduino V1',
        statechanger: "Statechanger",
        blueberry2:'Blueberry',
        blueberry:'Blueberry V1',
        nrf5x: "NRF5x",
    },
    USB:{
        hegduino: 'HEGduino',
        hegduinoV1: 'HEGduino V1',
        peanut:'Biocomp Peanut',
        statechanger: "Statechanger",
        nrf5x: "NRF5x",
    }
  }

export const connect = async (mode, key) => {
    if (active) throw new Error('Already connected to a device')
    const device = await initDevice(Devices[mode][key], {
        ondecoded: (info) => {
         setState({decoded: info})
        },
        ondisconnect: () => {
            active = null
            setState({status: 'disconnected'})
        },
         onconnect: (device) => {
           active = device
           setState({status: 'connected'})
         }
      })
      
      setState({ device })

      return device
}

const toZero = 1000 * 60 * 60 // 1hr
let tStart

subscribe('decoded.heg', ({ value }) => {
    if (!tStart) tStart = Date.now()
        
    const tDiff = Date.now() - tStart
    const progress = (toZero - tDiff) / toZero
    
    setState({
        focus: (100*value).toFixed(2),
        mentalfatigue: (100*(1 - progress)).toFixed(1),
        cognitiveload: (100*(1 / value) / 5).toFixed(2)
    })
})









export const disconnect = async () => {
    if (!active) throw new Error('No device to disconnect from')
    return await active.disconnect()
}