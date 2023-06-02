
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Gamepad, Heart, LucidePersonStanding } from "lucide-react"

import { buttonVariants } from "@/components/ui/button";
import Nav from "@/app/components/nav";

import { isInstalled, appid } from '../../services/csgo/index'
import { useState } from "react";
import { Link } from "react-router-dom";
import { ButtonLoading } from "@/app/components/button-loading";
import  { subscribe, unsubscribe } from "@/app/utils/state";

export function LiveCardUpdates({
  primaryState = '',
  secondaryState = ''
}) {


  const [ primaryUpdate, setPrimaryUpdate ] = useState({});

  if (primaryState) {
    const id = subscribe(primaryState, (update: any) => {
      unsubscribe(id) // Unsubscribe previous subscription
      setPrimaryUpdate(update)
    })
  }

  const [ secondaryUpdate, setSecondaryUpdate ] = useState({});

  if (secondaryState) {
    const id = subscribe(secondaryState, (update: any) => {
      unsubscribe(id) // Unsubscribe previous subscription
      setSecondaryUpdate(update)
    })
  }

  return <CardContent>
    <div className="text-2xl font-bold">{primaryUpdate.value  ?? 'N/A'}</div>
    <p className="text-xs text-muted-foreground">
      {secondaryState ? secondaryUpdate.value : `Previous Value: ${primaryState.previous ?? 'N/A'}`}
    </p>
  </CardContent>
}


export default function HyperPlus() {

  const [installed, setInstalled] = useState({});
  const hasInstalled = Object.keys(installed).length
  if (!hasInstalled) isInstalled().then(installed => setTimeout(() => setInstalled(installed), 500))
    
  return <>
    <Nav />
    <div className="hidden flex-col md:flex">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex-1 space-x-2">
          {'csgo' in installed ? <Link className={buttonVariants({ })} to={installed.csgo ? `steam://launch/${appid}` : `steam://install/${appid}`}>{installed.csgo ? 'Launch CS:GO' : 'Install CS:GO'}</Link> : <ButtonLoading>Fetching CS:GO Info</ButtonLoading> } 
          {'steam' in installed ?<Link className={buttonVariants({ variant: "secondary" })} to={installed.steam ? `steam://open/main` : `https://store.steampowered.com/about/`}>{installed.steam ? 'Open Steam' : 'Install Steam'}</Link> : <ButtonLoading>Fetching Steam Info</ButtonLoading> } 
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
 
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                App Name
              </CardTitle>
              <Gamepad className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <LiveCardUpdates primaryState='provider-name' secondaryState='player-activity'/>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                User
              </CardTitle>
              <LucidePersonStanding className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <LiveCardUpdates primaryState='player-name' secondaryState='provider-steamid'/>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Health
              </CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <LiveCardUpdates primaryState='health'/>
          </Card>
        </div>
        {/* <Separator />
        <br/>
        <span className="font-semibold text-xl tracking-tight">Data Streams</span> */}
      </div>
    </div>
  </>
}