import * as bluetoothPlugin from '@commoners/bluetooth'
import * as serialPlugin from '@commoners/serial'

export default {

    services: {
        csgo: './services/csgo/index.ts'
    },

    plugins: [
        bluetoothPlugin,
        serialPlugin
    ],

    electron: {
        window: {
            width: 1200
        }
    }
}