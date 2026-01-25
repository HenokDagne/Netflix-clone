import React from "react";

const ChipBar: React.FC = () => {
  const chips = ["film", "ilk", "Netflix", "Plex"];
  return (
    <div className="px-6 py-4 flex flex-wrap gap-2">
      {chips.map((chip) => (
        <span
          key={chip}
          className="text-xs px-3 py-1 rounded-full bg-gray-800 text-gray-200 border border-gray-700"
        >
          {chip}
        </span>
      ))}
    </div>
  );
};

export default ChipBar;
