
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
import LiveCard, { LiveCardUpdates } from "@/app/components/live-card";


export default function HyperPlus() {

  const [installed, setInstalled] = useState({});
  const hasInstalled = Object.keys(installed).length
  if (!hasInstalled) isInstalled().then(installed => setTimeout(() => setInstalled(installed), 500))
    
  return <>
    <Nav />
    <div className="flex-col md:flex">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex-1 space-x-2">
          {'csgo' in installed ? <Link className={buttonVariants({ })} to={installed.csgo ? `steam://launch/${appid}` : `steam://install/${appid}`}>{installed.csgo ? 'Launch CS:GO' : 'Install CS:GO'}</Link> : <ButtonLoading>Fetching CS:GO Info</ButtonLoading> } 
          {'steam' in installed ?<Link className={buttonVariants({ variant: "secondary" })} to={installed.steam ? `steam://open/main` : `https://store.steampowered.com/about/`}>{installed.steam ? 'Open Steam' : 'Install Steam'}</Link> : <ButtonLoading>Fetching Steam Info</ButtonLoading> } 
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
 
          <LiveCard name="App Name" Icon={Gamepad} primaryState='provider-name' secondaryState='player-activity'></LiveCard>

          <LiveCard name="User" Icon={LucidePersonStanding} primaryState='player-name' secondaryState='provider-steamid'></LiveCard>

          <LiveCard name="Health" Icon={Heart} primaryState="player-state-health"></LiveCard>
        </div>
        {/* <Separator />
        <br/>
        <span className="font-semibold text-xl tracking-tight">Data Streams</span> */}
      </div>
    </div>
  </>
}