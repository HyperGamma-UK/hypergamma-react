import { state } from "graphscript";


export {state}

//todo: no need for these redundancies
export let subscribe = state.subscribeEvent;
export let unsubscribe = state.unsubscribeEvent;
export let setState = state.setState;
export let getState = (key) => { return state.data[key]; };

export default setState;

// let subscriptions = {}

// let allSubscriptions = {}

// export const states: {[x:string]: any} = {}

// const infoSubscribeSymbol = Symbol('infoSubscribeSymbol')

// export const subscribe = (target, callback) => {
//     const randomId = Math.random().toString(36).substring(2, 15) //just use a counter
//     if (typeof target === 'function') {
//         callback = target
//         target = [infoSubscribeSymbol]
//     }

//     else target = [target]

//     let subTarget = subscriptions

//     target.forEach((key) => {
//         if (!subTarget[key]) subTarget[key] = {}
//         subTarget = subTarget[key]
//     })

//     subTarget[randomId] = callback
//     allSubscriptions[randomId] = {
//         target,
//         callback
//     }

//     return randomId
// }

// export const unsubscribe = (id) => {
//     const { target } = allSubscriptions[id]

//     let subTarget = subscriptions
//     target.forEach((key) => {
//         if (!subTarget[key]) subTarget[key] = {}
//         subTarget = subTarget[key]
//     })
    
//     delete subTarget[id]
//     delete allSubscriptions[id]

//     let secondSubTarget = subscriptions
//     target.forEach((key) => {
//         if (Object.keys(secondSubTarget[key]).length === 0) delete secondSubTarget[key]
//     })
// }

// const maxDepth = 5

// let runOnPrimitiveValues = (obj, path = []) => {
//     if (path.length > maxDepth) return
//     for (let key in obj) {
//         const fullKey = [...path, key].join('.')
//         const update = obj[key]
//         if (update && typeof update === 'object') runOnPrimitiveValues(update, [...path, key])
//         if (subscriptions[fullKey]) {
//             Object.values(subscriptions[fullKey]).forEach((callback) => {
//                 if (update && typeof update === 'object' && 'value' in update) callback(update)
//                 else callback({value: update})
//             })
//         }
//     }
// }


// export const setState = (info) => {
//     if (!info) return

//     Object.assign(states, info)


//     // Run all internal subscriptions
//     runOnPrimitiveValues(info)

//     // Run object subscriptions
//     if (subscriptions[infoSubscribeSymbol]) Object.values(subscriptions[infoSubscribeSymbol]).forEach((callback) => callback({ value: info }))
// }

// export const getState = (state='') => {
//     const path = state.split('.')
//     let target = states
//     path.forEach(prop => target = target?.[prop])
//     return { value: target }
// }

// export default setState