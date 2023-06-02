import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import  { subscribe, unsubscribe } from "@/app/utils/state";
import { useState } from "react";
import { CreditCard } from "lucide-react";

export default function LiveCard({
    name = 'Card',
    Icon = CreditCard,
    primaryState = '',
    secondaryState = ''
}){
    return (<Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {name}
          </CardTitle>
          <Icon className= "h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <LiveCardUpdates primaryState={primaryState} secondaryState={secondaryState}/>
      </Card>)
}

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
        {secondaryState ? secondaryUpdate.value ?? 'No additional information' : `Previous Value: ${primaryUpdate.previous ?? 'N/A'}`}
      </p>
    </CardContent>
  }