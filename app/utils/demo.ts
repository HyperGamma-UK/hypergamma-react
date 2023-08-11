
import { parseCSVData } from 'graphscript-services.storage';
import {state} from './state';

export const recordingsList = {
    heg:'./recordings/JoshuaBrewster_PPG_2023-05-16T03_00_47.662Z.csv',
    hr:'./recordings/JoshuaBrewster_HRV_2023-05-16T03_00_47.662Z.csv',
    breath:'./recordings/JoshuaBrewster_BREATH_2023-05-16T03_00_47.662Z.csv',
    fnirs:'./recordings/JoshuaBrewster_PPG_2023-05-16T03_00_47.662Z.csv'
};

export async function readTextFile(file) { //https://stackoverflow.com/questions/39662388/javascript-filereader-onload-get-file-from-server
    const response = await fetch(file);
    
    if(response.status === 200 || response.status === 0)
        return await response.text();

    else return undefined;
}


export const demos = {} as any; //we can cancel these at any time

//roll over data from the parsed csv


export function demoFile(sensor:'fnirs'|'heg'|'breath'|'hr'|'imu', sps?, tcheck?, duration = Infinity) {
    let filename = recordingsList[sensor];

    //make some assumptions
    if(!sps) {
        if(sensor === 'fnirs') sps = 20;
        else if(sensor === 'heg') sps = 10;
        else if(sensor === 'hr') sps = 1;
        else if(sensor === 'breath') sps = 0.166667;
        else if (sensor === 'imu') tcheck = 100;
    }

    if(!tcheck) {
        if(sensor === 'fnirs') tcheck = 1000/20;
        else if(sensor === 'heg') tcheck = 1000/20;
        else if (sensor === 'imu') tcheck = 333;
        else if(sensor === 'hr') tcheck = 1000;
        else if(sensor === 'breath') tcheck = 1000/0.166667;
    }

    readTextFile(filename).then((contents) => {
        let parsed = parseCSVData(contents, filename, undefined);

        let ctrs = {};

        function genDataFromCSV(sps=250, tduration = 1000, key?:'0') {
            const maxSamples = Math.floor(sps * (tduration / 1000));
            let res = {}

            function doKey(key) {
                res[key] = [] as any; //raw
                if(!ctrs[key]) ctrs[key] = 0;
                //console.log((parsed[key]));
                new Array(maxSamples).fill(0).map((v, i) => {
                    res[key].push(
                        parseFloat(parsed[key][ctrs[key]+i])
                    );
                });
                ctrs[key] += maxSamples;
                if(ctrs[key] + maxSamples > parsed[key].length) ctrs[key] = 0; //roll over
            }

            if(key) {
                doKey(key);
                doKey('timestamp');
            } else {
                for(const key in parsed) {
                    if(key !== 'header' && key !== 'filename' && key !== 'localized') doKey(key);
                }
            }
            
            return res;
        }

        let demo = { running:true }; 

        const simuloopCSV = ( 
            sps = 250, //sample rate
            tcheck = 1000 * 9 / 250, // 250/9 checks per second
            duration = 5000
        ) => {

            let tstart = Date.now();
            let start = tstart;
            const recursiveAwait = async () => {
                if(demo.running) {
                    let output = genDataFromCSV(
                        sps,
                        tcheck,
                        //key
                    );
                    const data = output;

                    //console.log('data', data);
                    let s = sensor;
                    state.setState({ [s]:data });

                    //const result = eventDetector(data);
                    //console.log("check result:", result);
                    tstart += tcheck;
                    if (tstart <= start + duration) {
                        await new Promise(res => setTimeout(res, tcheck));
                        recursiveAwait();
                    }
                }
            };
            recursiveAwait();
        };

        simuloopCSV(sps,tcheck,duration);

        demos[sensor] = demo;

    }); 
}



export function demo(sensors = ['fnirs','heg','breath','hr']) {
         
    let detected = {} as any;
    for(const v of sensors) {
        demoFile(v as any);
        detected['detected'+v.toUpperCase()] = true;
    }

    state.setState({deviceConnected:true, demoing:true, ...detected});
        
}

export function stopdemos() {
    let detected = {} as any;
    for(const key in demos) {
        demos[key].running = false;
        detected['detected'+key.toUpperCase()] = false;
    }
    state.setState({deviceConnected:false, demoing:false, ...detected});
}



