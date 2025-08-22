import React, { useState } from "react";

interface OverviewProps {
  vod_content?: string;
  overviewLabels: { overview: string; expand: string; collapse: string };
}

const Overview: React.FC<OverviewProps> = ({ vod_content, overviewLabels }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="mt-6 mb-10">
      <h3 className="text-md mb-3 font-semibold">{overviewLabels.overview}</h3>
      {!vod_content && <p>No data</p>}
      {vod_content && (
        <div className="relative">
          <p
            className={`text-sm leading-relaxed text-gray-300 transition-all ${
              expanded ? "" : "line-clamp-3"
            }`}
          >
            {vod_content}
          </p>

          <button
            onClick={() => setExpanded(!expanded)}
            className="absolute left-0 mt-2 text-sm font-medium text-gray-300"
          >
            {expanded ? overviewLabels.collapse : overviewLabels.expand}
          </button>
        </div>
      )}
    </div>
  );
};

export default Overview;
