"use client";

import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const PerformanceChart: React.FC = () => {
  // Simulated data for intervals
  const dataIntervals = {
    "1H": [
      { time: "00:00", value: 1.80 },
      { time: "00:15", value: 1.82 },
      { time: "00:30", value: 1.78 },
      { time: "00:45", value: 1.76 },
    ],
    "1D": [
      { time: "00:00", value: 1.85 },
      { time: "06:00", value: 1.88 },
      { time: "12:00", value: 1.81 },
      { time: "18:00", value: 1.76 },
    ],
    "1W": [
      { time: "Mon", value: 1.95 },
      { time: "Tue", value: 1.90 },
      { time: "Wed", value: 1.80 },
      { time: "Thu", value: 1.76 },
      { time: "Fri", value: 1.78 },
      { time: "Sat", value: 1.80 },
      { time: "Sun", value: 1.84 },
    ],
    "1M": [
      { time: "Week 1", value: 1.95 },
      { time: "Week 2", value: 1.85 },
      { time: "Week 3", value: 1.80 },
      { time: "Week 4", value: 1.76 },
    ],
    "1Y": [
      { time: "Jan", value: 2.00 },
      { time: "Mar", value: 1.95 },
      { time: "Jun", value: 1.90 },
      { time: "Sep", value: 1.85 },
      { time: "Dec", value: 1.76 },
    ],
    Max: [
      { time: "2020", value: 2.50 },
      { time: "2021", value: 2.30 },
      { time: "2022", value: 2.00 },
      { time: "2023", value: 1.76 },
    ],
  };

  const [activeInterval, setActiveInterval] = useState<keyof typeof dataIntervals>("1D");
  const [data, setData] = useState(dataIntervals[activeInterval]);

  const calculateROI = (data: { time: string; value: number }[]) => {
    if (data.length < 2) return { roi: 0, min: 0, max: 0 };
    const startPrice = data[0].value;
    const endPrice = data[data.length - 1].value;
    const roi = ((endPrice - startPrice) / startPrice) * 100;
    const min = Math.min(...data.map((d) => d.value));
    const max = Math.max(...data.map((d) => d.value));
    return { roi, min, max };
  };

  const { roi, min, max } = calculateROI(data);

  const handleIntervalChange = (interval: keyof typeof dataIntervals) => {
    setActiveInterval(interval);
    setData(dataIntervals[interval]);
  };

  return (
    <div className="bg-gray-900 p-6 rounded-lg shadow-md mt-6">
      <h3 className="text-lg font-semibold mb-2 text-white">Performance</h3>
      <div className="text-3xl font-bold text-white">${data[data.length - 1]?.value.toFixed(2)}</div>
      <div
        className={`text-lg ${
          roi >= 0 ? "text-green-500" : "text-red-500"
        }`}
      >
        {roi.toFixed(1)}% (${(data[data.length - 1]?.value - data[0]?.value).toFixed(2)})
      </div>
      <div className="flex justify-between text-gray-400 mt-2">
        <span>Min: ${min.toFixed(2)}</span>
        <span>Max: ${max.toFixed(2)}</span>
      </div>
      <div className="flex space-x-4 mt-4">
        {Object.keys(dataIntervals).map((interval) => (
          <button
            key={interval}
            onClick={() => handleIntervalChange(interval as keyof typeof dataIntervals)}
            className={`px-4 py-1 rounded-lg text-sm ${
              activeInterval === interval
                ? "bg-red-600 text-white"
                : "bg-gray-700 text-gray-300"
            }`}
          >
            {interval}
          </button>
        ))}
      </div>
      <ResponsiveContainer width="100%" height={300} className="mt-4">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="time" stroke="#9CA3AF" />
          <YAxis stroke="#9CA3AF" />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1F2937",
              borderColor: "#374151",
              color: "#D1D5DB",
            }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke={roi >= 0 ? "#10B981" : "#EF4444"}
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PerformanceChart;
