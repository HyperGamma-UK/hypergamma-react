// import { Button } from "app/components/ui/button"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "app/components/ui/card"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "app/components/ui/tabs"
// import { CalendarDateRangePicker } from "../components/date-range-picker"
import { Overview } from "../../components/overview"
import { RecentSessions } from "../../components/recent-sessions"
// import { Search } from "../../components/search"
// import TeamSwitcher from "../components/team-switcher"
import Analytics from "./analytics"
import Nav from "app/components/nav"


const getDateFromToday = (offset = 0) => {
  const date = new Date()
  date.setDate(date.getDate() + offset)
  return date.toDateString()
}

const getStat = () => (2*Math.random() - 1) * 0.7 // Ensure random number is no greater than Math.abs(0.7)
const data = Array.from({ length: 12 }, (_, i) => {return { name: getDateFromToday(-(i + 1)), total: getStat() }})

export default function Dashboard() {
  return (
    <>
      <Nav />
      <div className="flex-col md:flex">
        <div className="flex-1 space-y-4 p-8 pt-6">
          {/* <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Welcome to Hypergamma.</h2>
            <div className="flex items-center space-x-2">
              <CalendarDateRangePicker />
              <Button size="sm">
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            </div>
          </div> */}
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="analytics">
                Analytics
              </TabsTrigger>
              <TabsTrigger value="reports" disabled>
                Reports
              </TabsTrigger>
              <TabsTrigger value="experiments" disabled>
                Experiments
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                  <CardHeader>
                    <CardTitle>Overview</CardTitle>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <Overview toPlot={data.slice().reverse()}/>
                  </CardContent>
                </Card>
                <Card className="col-span-3">
                  <CardHeader>
                    <CardTitle>Recent Sessions</CardTitle>
                    <CardDescription>
                      You had 20 sessions in the last 30 days.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <RecentSessions data={data}/>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4">
              <Analytics />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  )
}
