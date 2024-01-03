/* eslint-disable react/prop-types */
const Folder = ({ explorer }) => {
  return (
    <div style={{ marginTop: "5px" }}>
      <div>
        <span>📁 {explorer.name}</span>
      </div>
      <div>
        {explorer.items.map((exp) => {
          return <span key={exp.name}>{exp.name}</span>;
        })}
      </div>
    </div>
  );
};

export default Folder;
