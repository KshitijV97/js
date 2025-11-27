import React from "react";
import "./App.css";
import {
  explorer,
  type FolderStructure,
} from "./components/folder-structure/folder-data";
import { Folder } from "./components/folder/folder";

function App() {
  const [explorerData] = React.useState<FolderStructure>(explorer);
  return (
    <>
      <Folder folder={explorerData} />
    </>
  );
}

export default App;
