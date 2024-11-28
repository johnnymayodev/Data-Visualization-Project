import React, { useState } from "react";
import FileUpload from "./components/FileUpload";
import ScatterPlot from "./components/ScatterPlot";
import PieChart from "./components/PieChart";
import "./App.css";

function App() {
  const [data, setData] = useState([]);

  return (
    <div className="App">
      <FileUpload set_data={setData} />
      {data.length > 0 && (
        <>
          <ScatterPlot data={data} />
          <PieChart data={data} />
        </>
      )}
    </div>
  );
}

export default App;
