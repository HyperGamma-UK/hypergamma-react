
import LiveDataChart from "@/app/components/live-data-chart"
import LiveCard from "@/app/components/live-card"

import { Dumbbell, Focus, GlassWater } from "lucide-react"
import { Separator } from "@/components/ui/separator"

export default function Analytics() {
    return <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <LiveCard 
          name='Focus'
          Icon={Focus}
          primaryState="focus"
          // secondaryState="decoded.heg"
          onPrimaryUpdate={(state) => `${state}%`}
      />

      <LiveCard 
          name='Cognitive Load'
          Icon={Dumbbell}
          primaryState="cognitiveload"
          onPrimaryUpdate={(state) => `${state}%`}
          // secondaryState="decoded.heg"
      />

      <LiveCard 
          name='Mental Fatigue'
          Icon={GlassWater}
          primaryState="mentalfatigue"
          onPrimaryUpdate={(state) => `${state}%`}
          // secondaryState="decoded.heg"
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

    <br/>

    {/* <LiveDataChart name="Focus" state="focus"/>
    <LiveDataChart name="Cognitive Load" state="cognitiveload"/>
    <LiveDataChart name="Mental Fatigue" state="mentalfatigue"/> */}

    </>
}