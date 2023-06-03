
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Select, SelectLabel, SelectTrigger, SelectContent, SelectItem, SelectValue, SelectGroup } from "@/components/ui/select"

import { Activity, Battery, PowerIcon } from "lucide-react"

import * as devices from '../../utils/devices';
import { Button } from "@/components/ui/button";
import Nav from "@/app/components/nav";
import LiveCard from "@/app/components/live-card";
import LiveDataChart from "@/app/components/live-data-chart";


export default function Devices() {

  let latestValue: string | null = null

  return <>
    <Nav />
    <div className="flex-col md:flex">
      <div className="flex-1 space-y-4 p-8 pt-6">

      <div className="flex space-x-2">
          <Select 
            onValueChange={(v) => latestValue = v} 
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a device" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(devices.selectable).map((key) => {
                return <>
                  <SelectGroup>
                    <SelectLabel>{key}</SelectLabel>
                    {Object.keys(devices.selectable[key]).map((key2) => <SelectItem value={`${key}_${key2}`}>{devices.selectable[key][key2]} - {key}</SelectItem>)}
                  </SelectGroup>
                  </>
                })}
            </SelectContent>
          </Select>
          <Button onClick={function() {
            if (latestValue) {
              const [ mode, key ] = latestValue.split('_')
              devices.connect(mode, key)
            }
          }}>Connect</Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          
          <LiveCard 
              name="Device Status"
              Icon={PowerIcon}
              primaryState="status"
              onPrimaryUpdate={(status) => status[0].toUpperCase() + status.slice(1)}
          />

          <LiveCard 
              name="Battery Life"
              Icon={Battery}
              primaryState="battery"
          />

          <LiveCard 
              name="HEG Ratio"
              Icon={Activity}
              primaryState="decoded.heg"
          />
        </div>
        {/* <Separator />
        <br/>
        <span className="font-semibold text-xl tracking-tight">Data Streams</span> */}
        <LiveDataChart name="Live Data Stream" state="decoded.heg"/>

      </div>
    </div>
  </>
}