import React from "react";
import "./App.css";
import explorer from "./data/folderData";
import Folder from "./components/Folder/Folder";

function App() {
  const [explorerData, setExplorerData] = React.useState(explorer);
  return (
    <>
      <Folder explorer={explorerData} />
    </>
  );
}

export default App;
x;
