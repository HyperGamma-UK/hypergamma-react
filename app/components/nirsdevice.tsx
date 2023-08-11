import React, {Component} from 'react'
import { sComponent } from './state/state.component'
import { lines, nirsInit } from '../utils/nirsdevice/nirsdevice';
import { BLEDeviceStream } from 'device-decoder';
import { BFSRoutes, csvRoutes } from 'graphscript-services.storage';

import plotworker from '../utils/webglplot/canvas.worker'
import { WGLPlotter } from '../utils/webglplot/plotter';
import { StreamText } from './state/StreamText';
import { state } from '../utils/state';

export class NIRSDevice extends sComponent {

    state = { //this shares with teh global state on an sComponent
        deviceConnected:false,
        deviceRecording:false,
        device:undefined as BLEDeviceStream,
        filelist:[] as any
    }

    canvas=document.createElement('canvas');
    overlay=document.createElement('canvas');
    canvas2=document.createElement('canvas');
    overlay2=document.createElement('canvas');
    sub?:number;
    plotter1:WGLPlotter;

    sub2?:number;
    plotter2:WGLPlotter;


    componentDidMount(): void {
        
        this.canvas.width = 800;
        this.canvas.height = 600;
        this.canvas.style.width = "100%";
        this.canvas.style.height = "500px";

        this.overlay.width = 800;
        this.overlay.height = 600;
        this.overlay.style.width = "100%";
        this.overlay.style.height = "500px";
        this.overlay.style.position = "absolute"; 
        this.overlay.style.zIndex = "2";

        this.overlay.style.transform = "translateY(-100%)";

        this.canvas2.width = 800;
        this.canvas2.height = 300;
        this.canvas2.style.width = "100%";
        this.canvas2.style.height = "150px";

        this.overlay2.width = 800;
        this.overlay2.height = 300;
        this.overlay2.style.width = "100%";
        this.overlay2.style.height = "150px";
        this.overlay2.style.position = "absolute"; 
        this.overlay2.style.zIndex = "2";

        this.overlay2.style.transform = "translateY(-100%)";

                
        this.plotter1 = new WGLPlotter({
            canvas:this.canvas,
            overlay:this.overlay,
            lines, //will render all lines unless specified
            generateNewLines:false,
            cleanGeneration:false,
            worker:plotworker
        });

        this.sub = state.subscribeEvent('fnirs', (data) => {
            this.plotter1.__operator(data);
        });

             
        this.plotter2 = new WGLPlotter({
            canvas:this.canvas2,
            overlay:this.overlay2,
            lines:{ 
                heg:{ sps:20, nSec:10 }
            }, //will render all lines unless specified
            generateNewLines:false,
            cleanGeneration:false,
            worker:plotworker
        });

        this.sub2 = state.subscribeEvent('heg', (data) => {
            this.plotter2.__operator(data);
        });
    }

    componentWillUnmount(): void {
        state.unsubscribeEvent('fnirs',this.sub);
        state.unsubscribeEvent('heg',this.sub2);
    }

    async list() {
        let filelist = await BFSRoutes.listFiles('data');
        let files = [] as any;
        filelist.forEach((file) => {
    
            let download = async () => {
                csvRoutes.writeToCSVFromDB('data/'+file, 10); //download files in chunks (in MB). 10MB limit recommended, it will number each chunk for huge files
            }
    
            let deleteFile = () => {
                BFSRoutes.deleteFile('data/'+file).then(() => {
                    this.list();
                });
            }
    
            files.push(
                <div id={file}>
                    <span>{file}
                    <button onClick={download} id="dl">Download</button>
                    <button onClick={deleteFile} id="del">Delete</button>
                    </span>
                </div>
            );
    
        });

        this.setState({filelist})
    }

    render() { //do whatever with this just keep the functions somewhere on the same page

        return (
            <>

            { /** Connect */}
            { this.state.deviceConnected ? 
                <button onClick={()=>{
                    this.state.device?.disconnect();
                }}>Disconnect</button> : 
                <button onClick={()=>{
                    nirsInit();
                }}>Connect</button>
            }

            { /** Record */}
            { this.state.deviceRecording ? 
                <button onClick={()=>{
                    this.setState({deviceRecording:false, csvs:{}});
                    this.list();
                }}>Stop Recording</button> : 
                <button onClick={()=>{
                    this.setState({deviceRecording:true});
                    this.list();
                }}>Record</button>
            }

            { /** Heart rate, HRV, breathing. Todo, add animated icons (see SVG folder) */ }
            <div>
                <span>HEG: <StreamText stateKey="heg" objectKey="heg" toFixed={2} movingAverage={10}/></span><br/>
                <span>HR: <StreamText stateKey="hr" objectKey="hr"  toFixed={2} movingAverage={5}/>/ min</span><br/>
                <span>HRV: <StreamText stateKey="hr" objectKey="hrv"  toFixed={2} movingAverage={5}/>/ min</span><br/>
                <span>Breath: <StreamText stateKey="breath" objectKey="breath"  toFixed={2}/>/ min</span>
            </div>

            { /** Charts */ }
            <hr/>
            <div ref={(ref)=> {
                ref?.appendChild(this.canvas2);
                ref?.appendChild(this.overlay2);
            }}/>
            <hr/>
            <br/>
            <hr/>
            <div ref={(ref)=> {
                ref?.appendChild(this.canvas);
                ref?.appendChild(this.overlay);
            }}/>
            <hr/>
            
            
            <div>
                Recordings<br/>
                { /** Recordings */ }
                { ...this.state.filelist }
            </div>
            </>
        ) 
    }


}