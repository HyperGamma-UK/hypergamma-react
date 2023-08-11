import { Avatar, AvatarFallback, AvatarImage } from "app/components/ui/avatar"

const getDateFromToday = (offset = 0) => {
  const date = new Date()
  date.setDate(date.getDate() + offset)
  return date.toDateString()
}

const generateEntry = ({ name, total }) => {

  const stat = total.toFixed(2)
  const statString = stat === 0 ? stat : (Math.sign(stat) === 1 ? `+${stat}` : stat)

  return <div className="flex items-center">
  <Avatar className="h-9 w-9">
    <AvatarImage src="/app/assets/csgo.png" alt="CSGO Logo" />
    <AvatarFallback>GO</AvatarFallback>
  </Avatar>
  <div className="ml-4 space-y-1">
    <p className="text-sm font-medium leading-none">CS:GO</p>
    <p className="text-sm text-muted-foreground">
      {name}
    </p>
  </div>
  <div className="ml-auto font-medium">{statString}</div>
</div>
}

export function RecentSessions({ data = [] }) {

  return (
    <div className="space-y-8">
      {data.slice(0,5).map(info => generateEntry(info))}
    </div>
  )
}
