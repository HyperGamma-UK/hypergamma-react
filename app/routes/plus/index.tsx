
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Select, SelectLabel, SelectTrigger, SelectContent, SelectItem, SelectValue, SelectGroup } from "@/components/ui/select"

import { Activity, Battery, Gamepad, Heart, LucidePersonStanding } from "lucide-react"

import { Button } from "@/components/ui/button";
import Nav from "@/app/components/nav";


export default function HyperPlus() {
  
  return <>
    <Nav />
    <div className="hidden flex-col md:flex">
      <div className="flex-1 space-y-4 p-8 pt-6">

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
 
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                App Name
              </CardTitle>
              <Gamepad className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">CS:GO</div>
              <p className="text-xs text-muted-foreground">
                Idle
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Username
              </CardTitle>
              <LucidePersonStanding className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">brainsatplay</div>
              <p className="text-xs text-muted-foreground">
                Steam account linked
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Health
              </CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">100%</div>
              <p className="text-xs text-muted-foreground">
                Last Update: 100s
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