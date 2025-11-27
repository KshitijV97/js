import React from "react";
import type { FolderStructure } from "../folder-structure/folder-data";

export type FolderProps = {
  folder: FolderStructure;
};

export type ShowInput = {
  visible: boolean;
  isFolder: boolean | null;
};

export const Folder = ({ folder }: FolderProps) => {
  const [expand, setExpand] = React.useState<boolean>(false);

  const onFolderClick = () => setExpand((val) => !val);

  if (folder.isFolder) {
    return (
      <div
        style={{ marginTop: "0.3rem", cursor: "pointer", marginLeft: "1rem" }}
      >
        <div className="folder" onClick={onFolderClick}>
          <span>📁 {folder.name}</span>

          <div style={{ display: "flex" }}>
            <button>Folder + </button>
            <button>File + </button>
          </div>
        </div>
        <div style={{ display: expand ? "block" : "none" }}>
          {folder.items.map((item) => (
            <Folder folder={item} />
          ))}
        </div>
      </div>
    );
  }
  return (
    <div className="file" style={{ marginLeft: "1rem" }}>
      📄 {folder.name}
    </div>
  );
};
