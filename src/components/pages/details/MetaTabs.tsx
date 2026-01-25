import React from "react";

const MetaTabs: React.FC = () => {
  const tabs = ["Episodes", "Top Cast", "User Review"];
  return (
    <div className="px-6 py-4 flex flex-wrap gap-4 items-center bg-transparent">
      {tabs.map((label) => (
        <span
          key={label}
          className="text-sm font-semibold text-gray-300 px-3 py-1 rounded-md bg-gray-800/70 border border-gray-700 hover:bg-gray-700/50 hover:text-green-400 hover:cursor-pointer transition-colors duration-200"
        >
          {label}
        </span>
      ))}
    </div>
  );
};

export default MetaTabs;
