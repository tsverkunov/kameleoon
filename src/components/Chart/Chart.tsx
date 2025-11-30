import { prepareChartData } from "../../../utils/prepareChartData.ts";
import rawJson from "../../data/data.json";


export function Chart() {
  const data = prepareChartData(rawJson.data)
  console.log(JSON.stringify(data, null, 2))

  return (
    <>
      <h1>Hello</h1>
    </>
  );
}