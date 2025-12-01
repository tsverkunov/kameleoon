import './App.css'
import LineChart from "./components/Chart/LineChart.tsx";

import rawJson from "./data/data.json";
import { prepareChartData } from "../utils/prepareChartData.ts";

function App() {

  const data = prepareChartData(rawJson.data);

  const variations = rawJson.variations
    .map(v => ({ id: v.id !== undefined ? String(v.id) : "0", name: v.name }));

  return (
    <>
      <LineChart
        data={data}
        variations={variations}
      />
    </>
  )
}

export default App
