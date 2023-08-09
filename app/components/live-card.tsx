import { Card, CardContent, CardHeader, CardTitle } from "components/ui/card";
import  { getState, subscribe, unsubscribe } from "app/utils/state";
import { useState } from "react";
import { CreditCard } from "lucide-react";

export default function LiveCard({
    name = 'Card',
    Icon = CreditCard,
    primaryState = '',
    secondaryState = '',
    onPrimaryUpdate = (value: any) => value,
    onSecondaryUpdate = (value: any) => value,
}){
    return (<Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {name}
          </CardTitle>
          <Icon className= "h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <LiveCardUpdates primaryState={primaryState} secondaryState={secondaryState} onPrimaryUpdate={onPrimaryUpdate} onSecondaryUpdate={onSecondaryUpdate}/>
      </Card>)
}

export function LiveCardUpdates({
    primaryState = '',
    secondaryState = '',
    onPrimaryUpdate = (value: any) => value,
    onSecondaryUpdate = (value: any) => value
  }) {
    
    const [ primaryUpdate, setPrimaryUpdate ] = useState(primaryState ? getState(primaryState) : {});
  
    if (primaryState) {
      const id = subscribe(primaryState, (update: any) => {
        unsubscribe(id) // Unsubscribe previous subscription
        setPrimaryUpdate(update)
      })
    }
  
    const [ secondaryUpdate, setSecondaryUpdate ] = useState(secondaryState ? getState(secondaryState) : {});
  
    if (secondaryState) {
      const id = subscribe(secondaryState, (update: any) => {
        unsubscribe(id) // Unsubscribe previous subscription
        setSecondaryUpdate(update)
      })
    }
  
    return <CardContent>
      <div className="text-2xl font-bold">{primaryUpdate.value ? onPrimaryUpdate(primaryUpdate.value) : 'N/A'}</div>
      {secondaryState ? <p className="text-xs text-muted-foreground">{secondaryUpdate.value ? onSecondaryUpdate(secondaryUpdate.value) : 'No additional information'}</p> : ``}
    </CardContent>
  }