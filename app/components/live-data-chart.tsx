import { CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis } from "recharts";
import setState, { getState, subscribe, unsubscribe } from "../utils/state";
import { useState } from "react";

const dummyData = [
    {
      "name": "Page A",
      "pv": 2400,
    },
    {
      "name": "Page B",
      "pv": 1398,
    },
    {
      "name": "Page C",
      "pv": 9800,
    },
    {
      "name": "Page D",
      "pv": 3908,
    },
    {
      "name": "Page E",
      "pv": 4800,
    },
    {
      "name": "Page F",
      "pv": 3800,
    },
    {
      "name": "Page G",
      "pv": 4300,
    }
  ]


  type LiveChartProps = {
    name: string,
    state: string, 
    data?: any[],
    stroke?: string,
    maxLength?: number
  }


export default function LiveDataChart({ 
    name = "Dummy Chart",
    state, 
    data = [],
    stroke = "#8884d8", // Purple
    maxLength = 200
  }: LiveChartProps) {

    const [ latestData, setData ] = useState(data);

    const id = subscribe(state, (update: any) => {
      unsubscribe(id) // Unsubscribe previous subscription

      if (Array.isArray(update.value)) update.value.forEach((v: any) => latestData.push({ timestamp: Date.now(), [state]: v }))
      else latestData.push({ timestamp: Date.now(), [state]: update.value })

      const copy = [...latestData]

      if (copy.length > maxLength) setData(copy.slice(-maxLength)) 
      else setData(copy)
    })

    return <>
    <div className="flex justify-center w-full">
      <div>
        <span className="block font-semibold text-xl w-full text-center p-2">{name}</span>
        <LineChart 
            width={730} 
            height={250} 
            data={latestData}
            // margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            {/* <XAxis dataKey="name" /> */}
            <YAxis />
            {/* <Tooltip /> */}
            {/* <Legend /> */}
            <Line 
              type="monotone" 
              dataKey={state}
              isAnimationActive={false}
              stroke={stroke}
              dot={false}
            />
        </LineChart>
        </div>
      </div>
    </>
}