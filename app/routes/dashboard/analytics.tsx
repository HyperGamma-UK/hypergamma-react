
import LiveCard from "@/app/components/live-card"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import { Clock, Dumbbell, Focus, GlassWater } from "lucide-react"

export default function Analytics() {
    return <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
    <LiveCard 
        name='Focus'
        Icon={Focus}
        primaryState="focus"
        secondaryState="decoded.heg"
    />

    <LiveCard 
        name='Cognitive Load'
        Icon={Dumbbell}
        primaryState="cognitiveload"
        secondaryState="decoded.heg"
    />

    <LiveCard 
        name='Mental Fatigue'
        Icon={GlassWater}
        primaryState="mentalfatigue"
        secondaryState="decoded.heg"
    />

    {/* <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Average Session Duration</CardTitle>
        <Clock className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">20min</div>
        <p className="text-xs text-muted-foreground">
        +20% last session
        </p>
      </CardContent>
    </Card> */}
  </div>
}