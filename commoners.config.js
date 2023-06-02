export default {
    services: [
        './services/csgo/index.ts'
    ],

    plugins: {
        bluetooth: true
    },

    electron: {
        window: {
            width: 1200
        }
    }
}