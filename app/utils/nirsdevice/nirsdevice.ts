import {Devices, ads131m08FilterSettings, initDevice, workers, ads131m08ChartSettings} from 'device-decoder'//'../device_debugger/src/device.frontend'
import gsworker from './device.worker'
import {state} from 'graphscript'
import {Math2} from 'brainsatplay-math'
// import { BFSRoutes, csvRoutes } from 'graphscript-services.storage';

// import { WGLPlotter } from '../webglplot/plotter';
// import plotworker from '../webglplot/canvas.worker'
//import { WebglLineProps } from 'webgl-plot-utils';

let csvworkers = {
    heg:workers.addWorker({url:gsworker}),
    fnirs:workers.addWorker({url:gsworker}),
    hr:workers.addWorker({url:gsworker}),
    breath:workers.addWorker({url:gsworker})
};

// let sbutton = document.createElement('button');
// let recordbutton = document.createElement('button');

// let recording = false;
// let created = false;

// recordbutton.onclick = () => {
//     recording = !recording;
//     created = false;
//     recordbutton.innerHTML = recording ? 'Stop Recording' : 'Record';
// }

export let selectedChannels = [
    6,7 //channels to report on (not all are hooked up to photodiodes)
];

export let channelAssignments = { 
    6:'long', //name them whatever
    7:'short' 
};

export let ledGPIO = [ 
    //37, 38, 255

    255, 9, 30 //ambient
    //10, 30, 9 //12, 13, 11 //2 channel hookup

    //16 channel hookup
    // 10, 109,
    //14, 107,
    // 114, 17,
    // 100,  6,
    // 115, 21,
    //16,  24,
    //5,   31,
    // 8,    7,
    // 111, 104
] //255 is ambient

export let ledAssignments = {
    255:'ambient',
    30:'red',
    9:'infrared'
};

const nAmbPulses = ledGPIO.filter((v) => {return v !== 255}).length;
let nAmbCtr = 0;

let nLEDs = ledGPIO.length;
let LEDctr = 0;
let LEDctrMax = selectedChannels.length * nLEDs;

let lastResult = {} as any;

let getLEDAssignment = (ch:number) => {
    return ledAssignments[ch];
}

let getChannelAssignment = (ch:number) => {
    return channelAssignments[ch];
}

let head = ['timestamp'] as any[];

export let lines = {} as any;

selectedChannels.forEach((ch) => {
    let chAssignment = getChannelAssignment(ch);
    ledGPIO.forEach((io) => {
        let ledAssignment = getLEDAssignment(io);
        lines[ledAssignment+'_'+chAssignment] = { sps:20, nSec:10 };
        head.push(ledAssignment+'_'+chAssignment);
    })
}) 


//set scaling (temp)
for(const key in ads131m08FilterSettings) {
    ads131m08FilterSettings[key].useScaling = false;
}



let values = {
    ambient:0,
    red:0,
    infrared:0,
    heg:0,
    timestamp:0
};

//toggleNRF5xSingleEnded(true);

let ambientCorrection = true;

let lastLED;
let lastAmbient = 0;

let dataTemp = {} as any;

state.data.csvs = {} as any;


let smabuffer = [] as any[];
let smaMax = 40 //~4 second SMA

// for(const key in ads131m08FilterSettings) {
//     ads131m08FilterSettings[key].useScaling = false;
// }

export const nirsInit = async () => {
    let hrworker = workers.addWorker({url:gsworker});

    let t1 = await hrworker.run('loadFromTemplate',['beat_detect','hr',{
        maxFreq:3,
        sps:20.833
    }]);

    let withResult = (v) => {
        //console.log(v);
        if(v) {
            const hr = {
                hr: v.bpm,
                hrv: v.change,
                height0:v.height0,
                height1:v.height1,
                timestamp:v.timestamp
            };
        
            state.setValue('hr',hr);

            if(state.data.deviceRecording) {
                if(!state.data.csvs['hr']) {
                    state.data.csvs['hr'] = 'data/HRV_'+new Date().toISOString()+'.csv'; 
                    csvworkers['hr'].run('createCSV', [
                        state.data.csvs['hr'], 
                        ['timestamp','hr','hrv','height0','height1'], 
                        5, //toFixed
                        0 //bufferSize
                    ]);
                }
                csvworkers['hr'].run('appendCSV', hr, state.data.csvs['hr']);
            }
        }
    }

    hrworker.subscribe('hr', (data) => {
        if(Array.isArray(data)) data.map(withResult);
        else withResult(data);
    });

    let brworker = workers.addWorker({url:gsworker});

    let t2 = await brworker.run('loadFromTemplate',['beat_detect','breath',{
        maxFreq:0.2,
        sps:20.833
    }]);

    let withResult2 = (v) => {
        if(v) {
            const br = {
                breath: v.bpm,
                brv: v.change,
                timestamp:v.timestamp
            };
        
            state.setValue('breath',br);

            if(state.data.deviceRecording) {
                if(!state.data.csvs['breath']) { //spaghetti
                    state.data.csvs['breath'] = 'data/BREATH_'+new Date().toISOString()+'.csv'; 
                    csvworkers['breath'].run('createCSV', [
                        state.data.csvs['breath'], 
                        ['timestamp','breath','brv'], 
                        3, //toFixed
                        0 //bufferSize
                    ]);
                }
                csvworkers['breath'].run('appendCSV', br, state.data.csvs['breath']);
            }
        }
    }

    brworker.subscribe('breath', (data) => {
        if(Array.isArray(data)) data.map(withResult2);
        else withResult2(data);
    });

    const BluetoothNameSearchPrefix = "B";

    (Devices['BLE']['nrf5x'] as any).namePrefix = BluetoothNameSearchPrefix;
    (Devices['BLE']['nrf5x_singleended'] as any).namePrefix = BluetoothNameSearchPrefix;
    
    //todo: single ended scaling is weird
    return initDevice(Devices.BLE.nrf5x_singleended, {
        workerUrl:gsworker,
        ondecoded:{
            '0002cafe-b0ba-8bad-f00d-deadbeef0000': (data: { //ads131m08 (main)
                [key: string]: any
            }) => {
                //console.log(data);
                if(data.leds) {
                    let result = {timestamp:data.timestamp};
                    let withLED = (v,j) => { //device reports an array of led GPIO e.g. [255,255,255,30,30,30,9,9,9] at the end of the adc sample array to tell us which LEDs are active for each of the 9 readings
                        let withChannel = (w,k) => {
                            //for(let i = 0; i < 8; i++) {
                            //if(useSingleChannel && i !== selectedChannel) continue;

                            let chAssignment = getChannelAssignment(w);
                            let chTemp = getLEDAssignment(v) + '_' + chAssignment;
                            let ch = getLEDAssignment(lastLED) + '_' + chAssignment;
                            
                            if(!dataTemp[chTemp] || 
                                (
                                    (v === 255 && dataTemp[chTemp] > data[w][j]) || 
                                    dataTemp[chTemp] < data[w][j]
                                )
                            ) 
                                dataTemp[chTemp] = data[w][j]; //choosing peaks, should average instead? This is a temp fix for the LED drivers being imprecise 
                            
                            if(lastLED && dataTemp[ch] && lastLED !== v) { //each time the led goes to the next one
                                if(!result[ch]) 
                                    result[ch] = [] as any[];

                                let val;
                                if(lastLED === 255) {
                                    if(k === 0) nAmbCtr++;
                                    if(nAmbCtr === nAmbPulses) {
                                        val = dataTemp[ch];
                                        result[ch].push(val);
                                        if((k+1) == selectedChannels.length) nAmbCtr = 0;
                                    }
                                } else {
                                    val = (ambientCorrection && lastAmbient) ? dataTemp[ch] - lastAmbient : dataTemp[ch];
                                    result[ch].push(val)
                                }

                                lastResult[ch] = result[ch]; //persistent results

                                if(typeof val === 'number') {
                                    if(ledAssignments[lastLED] === 'red') {
                                        values.red += val;
                                    } else if (ledAssignments[lastLED] === 'infrared') {
                                        values.infrared += val;
                                    } else if (ledAssignments[lastLED] === 'ambient') {
                                        values.ambient += val;
                                    }
    
                                    if(lastLED === 255) 
                                        lastAmbient = dataTemp[ch];
                                    delete dataTemp[ch];
    
                                    LEDctr++;
    
                                    if(LEDctr === LEDctrMax) {
                                        if(values.infrared) {
                                            smabuffer.push(values.red / values.infrared);
                                            if(smabuffer.length > smaMax) smabuffer.shift();

                                            values.heg = Math2.mean(smabuffer);// values.red / values.infrared;
                                            
                                            state.setValue('heg', values);
                                        }
                                        values.timestamp = data.timestamp[0];
                          
                                        if(state.data.deviceRecording) {
                                            if(!state.data.csvs['heg']) {
                                                state.data.csvs['heg'] = 'data/HEG_'+new Date().toISOString()+'.csv'; 
                                                csvworkers['heg'].run('createCSV', [
                                                    state.data.csvs['heg'], 
                                                    ['timestamp','heg','red','infrared'], 
                                                    3, //toFixed
                                                    50 //bufferSize
                                                ]);
                                            }
                                            csvworkers['heg'].run('appendCSV', values, state.data.csvs['heg']);
                                        }
                                        // send to the heart rate and breathing algorithm. Also count a trendline from a baseline Report results
    
                                        //set state to trigger red/infrared/ambient cumulative update
                                        let d = { 
                                            raw:values.heg, 
                                            timestamp:values.timestamp
                                        };
    
                                        //now we have heart rate and breathing
                                        hrworker.post('hr', d);
                                        brworker.post('breath', d);
    
                                        LEDctr = 0;
                                        
                                        values.red = 0;
                                        values.infrared = 0;
                                        values.ambient = 0;
                                    }
                                }
                                
                            }
                        }

                        selectedChannels.forEach(withChannel);

                        lastLED = v;
                    }

                    data.leds.forEach(withLED);

                    //plotter.__operator(result);

                    if(state.data.deviceRecording) {
                        if(!state.data.csvs['fnirs']) {
                            state.data.csvs['fnirs'] = 'data/FNIRS_'+new Date().toISOString()+'.csv'; 
                            csvworkers['fnirs'].run('createCSV', [
                                state.data.csvs['fnirs'], 
                                head, 
                                5, //toFixed
                                21 //bufferSize
                            ]);
                        }
                        csvworkers['fnirs'].run('appendCSV', result, state.data.csvs['fnirs']);
                    }

                    state.setValue('fnirs', result);
                }
            },
            // '0004cafe-b0ba-8bad-f00d-deadbeef0000':(data: { //mpu6050
            //     ax: number[],
            //     ay: number[],
            //     az: number[],
            //     gx: number[],
            //     gy: number[],
            //     gz: number[],
            //     mpu_dietemp: number,
            //     timestamp: number
            // }) => {
            //     //if(!state.data.detectedIMU) state.setState({detectedIMU:true});
            //     //data.timestamp = genTimestamps((data.ax as number[]).length, sps.imu, data.timestamp - 1000*((data.ax as number[]).length)/sps.imu) as any;
            //     //state.setValue('imu', data);
            // }
        },
        ondisconnect:() => {
            hrworker.terminate();
            brworker.terminate();
            state.setState({deviceConnected:false, device: undefined});
        },
        onconnect:() => {
            state.setState({deviceConnected:true});
        },
        filterSettings:ads131m08FilterSettings
    }).then((device) => {
        state.setState({device});
    }).catch((er) => {
        hrworker.terminate();
        brworker.terminate();
        state.setState({deviceConnected:false});
    });
}

// sbutton.onclick = async () => {
//     nirsInit();
// }

// sbutton.innerHTML = "Connect Device";

// document.body.appendChild(sbutton);

// let files = document.createElement('div');
// document.body.appendChild(files);
// list();


// let chart = document.createElement('canvas');
// chart.style.backgroundColor = 'black';
// let overlay = document.createElement('canvas');
// chart.style.width = '1200px';
// chart.style.height = '800px';
// chart.height = 800;
// chart.width = 1200;
// overlay.style.width = '1200px';
// overlay.style.height = '800px';
// overlay.height = 800;
// overlay.width = 1200;
// overlay.style.transform = 'translate(0,-800px)';

// document.body.appendChild(chart);
// document.body.appendChild(overlay);


// let plotter = new WGLPlotter({
//     canvas:chart,
//     overlay:overlay,
//     lines, //will render all lines unless specified
//     generateNewLines:false,
//     cleanGeneration:false,
//     worker:plotworker
// });

// async function list() {
//     let filelist = await BFSRoutes.listFiles('data');
//     files.innerHTML = "";
//     filelist.forEach((file) => {

//         let download = async () => {
//             csvRoutes.writeToCSVFromDB('data/'+file, 10); //download files in chunks (in MB). 10MB limit recommended, it will number each chunk for huge files
//         }

//         let deleteFile = () => {
//             BFSRoutes.deleteFile('data/'+file).then(() => {
//                 list();
//             });
//         }

//         files.insertAdjacentHTML('afterbegin',`
//             <div id="${file}">
//                 <span>${file}
//                 <button id="dl">Download</button>
//                 <button id="del">Delete</button>
//                 </span>
//             </div>
//         `);

//         let elm = document.getElementById(file);
//         console.log(elm);

//         (elm?.querySelector('#dl') as any).onclick = download;
//         (elm?.querySelector('#del') as any).onclick = deleteFile;

//     });
// }
