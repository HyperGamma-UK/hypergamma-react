import {Devices, ads131m08FilterSettings, initDevice, workers, ads131m08ChartSettings} from 'device-decoder'//'../device_debugger/src/device.frontend'
import gsworker from './device.worker'
import {state} from 'graphscript'
import { BFSRoutes, csvRoutes } from 'graphscript-services.storage';

import { WGLPlotter } from './webglplot/plotter';
import plotworker from './webglplot/canvas.worker'
import { WebglLineProps } from 'webgl-plot-utils';

let csvworker = workers.addWorker({url:gsworker});

let sbutton = document.createElement('button');
let recordbutton = document.createElement('button');

let recording = false;
let created = false;

recordbutton.onclick = () => {
    recording = !recording;
    created = false;
    recordbutton.innerHTML = recording ? 'Stop Recording' : 'Record';
}

let selectedChannels = [
    6,7 //channels to report on (not all are hooked up to photodiodes)
];

let channelAssignments = { 
    6:'long', //name them whatever
    7:'short' 
};

let ledGPIO = [ 
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

let ledAssignments = {
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

let lines = {} as any;
selectedChannels.forEach((ch) => {
    let chAssignment = getChannelAssignment(ch);
    ledGPIO.forEach((io) => {
        let ledAssignment = getLEDAssignment(io);
        lines[ledAssignment+'_'+chAssignment] = { sps:20, nSec:10 };
        head.push(ledAssignment+'_'+chAssignment);
    })
}) 





let values = {
    ambient:0,
    red:0,
    infrared:0,
    heg:0
};

let target = 'ambient'; //red, infrared, heg

//toggleNRF5xSingleEnded(true);

let ambientCorrection = true;

let lastLED;
let lastAmbient = 0;

let dataTemp = {};

// for(const key in ads131m08FilterSettings) {
//     ads131m08FilterSettings[key].useScaling = false;
// }

sbutton.onclick = async () => {

    let hrworker = workers.addWorker({url:gsworker});

    let t1 = await hrworker.run('loadFromTemplate',['beat_detect','hr',{
        maxFreq:3,
        sps:100
    }]);

    let withResult = (v) => {
        if(v) {
            const hr = {
                hr: v.bpm,
                hrv: v.change,
                timestamp:v.timestamp
            };
        
            state.setValue('hr',hr);
        }
    }

    hrworker.subscribe('hr', (data) => {
        if(Array.isArray(data)) data.map(withResult);
        else withResult(data);
    });

    let brworker = workers.addWorker({url:gsworker});

    let t2 = await brworker.run('loadFromTemplate',['beat_detect','breath',{
        maxFreq:.2,
        sps:100
    }]);

    let withResult2 = (v) => {
        if(v) {
            const br = {
                breath: v.bpm,
                brv: v.change,
                timestamp:v.timestamp
            };
        
            state.setValue('breath',br);
        }
    }

    brworker.subscribe('breath', (data) => {
        if(Array.isArray(data)) data.map(withResult2);
        else withResult2(data);
    });
    
    for(const key in ads131m08FilterSettings) {
        ads131m08FilterSettings[key].useScaling = false;
    }

    initDevice(Devices.BLE.nrf5x_singleended, {
        workerUrl:gsworker,
        ondecoded:{
            '0002cafe-b0ba-8bad-f00d-deadbeef0000': (data: { //ads131m08 (main)
                [key: string]: number[]
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
                                if(lastLED === 255) {
                                    if(k === 0) nAmbCtr++;
                                    if(nAmbCtr === nAmbPulses) {
                                        result[ch].push(dataTemp[ch]);
                                        if((k+1) == selectedChannels.length) nAmbCtr = 0;
                                    }
                                } else if(ambientCorrection && lastAmbient) {
                                    result[ch].push(dataTemp[ch] - lastAmbient); //report only the peak value of a specific reading
                                } else {
                                    result[ch].push(dataTemp[ch])
                                }

                                lastResult[ch] = result[ch]; //persistent results

                                if(ledAssignments[v] === 'red') {
                                    values.red += result[ch];
                                } else if (ledAssignments[v] === 'infrared') {
                                    values.infrared += result[ch];
                                } else if (ledAssignments[v] === 'ambient') {
                                    values.ambient += result[ch];
                                }

                                if(lastLED === 255) 
                                    lastAmbient = dataTemp[ch];
                                delete dataTemp[ch];

                                LEDctr++;

                                if(LEDctr === LEDctrMax) {

                                    values.heg = values.red / values.infrared;
                                    state.setValue('heg', values);

                                    let sendToAlgo; 
                                    
                                    if(typeof target === 'number' && lastResult[target]) sendToAlgo = lastResult[target];
                                    else sendToAlgo = values[target];
                                    // send to the heart rate and breathing algorithm. Also count a trendline from a baseline Report results

                                    //set state to trigger red/infrared/ambient cumulative update
                                    let d = { raw:values[target], timestamp:Date.now() };

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

                        selectedChannels.forEach(withChannel);

                        lastLED = v;
                    }

                    data.leds.forEach(withLED);

                    plotter.__operator(result);

                    if(recording) {
                        if(!created) {
                            let title = 'data/'+new Date().toISOString()+'_FNIRS.csv'; 
                            csvworker.run('createCSV', [title, head, 5, 250 ]).then(async () => {
                                list();
                            });
                            created = true;
                        }
                        csvworker.run('appendCSV', result);
                    }

                    state.setValue('fnirs', result);
                }
            }
        },
        ondisconnect:() => {
            hrworker.terminate();
            brworker.terminate();
        },
        filterSettings:ads131m08FilterSettings
    }).catch((er) => {
        hrworker.terminate();
        brworker.terminate();
    });
}

sbutton.innerHTML = "Connect Device";

document.body.appendChild(sbutton);

let files = document.createElement('div');
document.body.appendChild(files);
list();


let chart = document.createElement('canvas');
chart.style.backgroundColor = 'black';
let overlay = document.createElement('canvas');
chart.style.width = '1200px';
chart.style.height = '800px';
chart.height = 800;
chart.width = 1200;
overlay.style.width = '1200px';
overlay.style.height = '800px';
overlay.height = 800;
overlay.width = 1200;
overlay.style.transform = 'translate(0,-800px)';

document.body.appendChild(chart);
document.body.appendChild(overlay);


let plotter = new WGLPlotter({
    canvas:chart,
    overlay:overlay,
    lines, //will render all lines unless specified
    generateNewLines:false,
    cleanGeneration:false,
    worker:plotworker
});

async function list() {
    let filelist = await BFSRoutes.listFiles('data');
    files.innerHTML = "";
    filelist.forEach((file) => {

        let download = async () => {
            csvRoutes.writeToCSVFromDB('data/'+file, 10); //download files in chunks (in MB). 10MB limit recommended, it will number each chunk for huge files
        }

        let deleteFile = () => {
            BFSRoutes.deleteFile('data/'+file).then(() => {
                list();
            });
        }

        files.insertAdjacentHTML('afterbegin',`
            <div id="${file}">
                <span>${file}
                <button id="dl">Download</button>
                <button id="del">Delete</button>
                </span>
            </div>
        `);

        let elm = document.getElementById(file);
        console.log(elm);

        (elm?.querySelector('#dl') as any).onclick = download;
        (elm?.querySelector('#del') as any).onclick = deleteFile;

    });
}
