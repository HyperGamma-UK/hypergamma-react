
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Select, SelectLabel, SelectTrigger, SelectContent, SelectItem, SelectValue, SelectGroup } from "@/components/ui/select"

import { Activity, Battery } from "lucide-react"

import * as devices from '../../utils/devices';
import { Button } from "@/components/ui/button";
import Nav from "@/app/components/nav";


export default function Devices() {

  let latestValue: string | null = null

  return <>
    <Nav />
    <div className="hidden flex-col md:flex">
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
 
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Device Status
              </CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Disconnected</div>
              <p className="text-xs text-muted-foreground">
                Last connected yesterday
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Battery Life
              </CardTitle>
              <Battery className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">N/A</div>
              <p className="text-xs text-muted-foreground">
                No device connected
              </p>
            </CardContent>
          </Card>
        </div>
        {/* <Separator />
        <br/>
        <span className="font-semibold text-xl tracking-tight">Data Streams</span> */}
      </div>
    </div>
  </>
}