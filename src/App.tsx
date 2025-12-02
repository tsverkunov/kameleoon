import './App.css'
import Chart from "./components/Chart/Chart.tsx";

import rawJson from "./data/data.json";
import { prepareChartData } from "../utils/prepareChartData.ts";

function App() {

  const data = prepareChartData(rawJson.data);

  const variations = rawJson.variations
    .map(v => ({ id: v.id !== undefined ? String(v.id) : "0", name: v.name }));

  return (
    <>
      <Chart
        data={data}
        variations={variations}
      />
    </>
  )
}

export default App
