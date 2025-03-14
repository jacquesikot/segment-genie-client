import React from 'react';
import { Bar } from 'react-chartjs-2';

interface SwotItem {
  point: string;
  impact: string;
  evidence: string;
}

interface SwotAnalysisProps {
  swotAnalysis: {
    strengths: SwotItem[];
    weaknesses: SwotItem[];
    opportunities: SwotItem[];
    threats: SwotItem[];
  };
}

const SwotAnalysis: React.FC<SwotAnalysisProps> = ({ swotAnalysis }) => {
  return (
    <div className="bg-gray-50 dark:bg-gray-900/50 p-3 sm:p-4 rounded-lg">
      <h4 className="font-semibold mb-2 sm:mb-3 text-base sm:text-lg flex items-center gap-2">
        <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
        SWOT Analysis
      </h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 mb-3 sm:mb-4">
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800/30 p-2 sm:p-3 rounded-lg">
          <h5 className="font-medium text-green-800 dark:text-green-300 flex items-center gap-2 mb-1 sm:mb-2 text-xs sm:text-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            Strengths ({swotAnalysis.strengths.length})
          </h5>
          <div className="max-h-32 sm:max-h-40 overflow-y-auto pr-2 custom-scrollbar">
            <ul className="list-disc pl-4 text-xs space-y-1">
              {swotAnalysis.strengths.map((item: SwotItem, i: number) => (
                <li key={i} className="text-green-700 dark:text-green-400">
                  <span className="font-medium">{item.point}</span>
                  <div className="text-[10px] sm:text-xs text-green-600/80 dark:text-green-400/80 mt-0.5">
                    {item.impact} <span className="italic">({item.evidence})</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/30 p-2 sm:p-3 rounded-lg">
          <h5 className="font-medium text-red-800 dark:text-red-300 flex items-center gap-2 mb-1 sm:mb-2 text-xs sm:text-sm">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            Weaknesses ({swotAnalysis.weaknesses.length})
          </h5>
          <div className="max-h-32 sm:max-h-40 overflow-y-auto pr-2 custom-scrollbar">
            <ul className="list-disc pl-4 text-xs space-y-1">
              {swotAnalysis.weaknesses.map((item: SwotItem, i: number) => (
                <li key={i} className="text-red-700 dark:text-red-400">
                  <span className="font-medium">{item.point}</span>
                  <div className="text-[10px] sm:text-xs text-red-600/80 dark:text-red-400/80 mt-0.5">
                    {item.impact} <span className="italic">({item.evidence})</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30 p-2 sm:p-3 rounded-lg">
          <h5 className="font-medium text-blue-800 dark:text-blue-300 flex items-center gap-2 mb-1 sm:mb-2 text-xs sm:text-sm">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            Opportunities ({swotAnalysis.opportunities.length})
          </h5>
          <div className="max-h-32 sm:max-h-40 overflow-y-auto pr-2 custom-scrollbar">
            <ul className="list-disc pl-4 text-xs space-y-1">
              {swotAnalysis.opportunities.map((item: SwotItem, i: number) => (
                <li key={i} className="text-blue-700 dark:text-blue-400">
                  <span className="font-medium">{item.point}</span>
                  <div className="text-[10px] sm:text-xs text-blue-600/80 dark:text-blue-400/80 mt-0.5">
                    {item.impact} <span className="italic">({item.evidence})</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/30 p-2 sm:p-3 rounded-lg">
          <h5 className="font-medium text-amber-800 dark:text-amber-300 flex items-center gap-2 mb-1 sm:mb-2 text-xs sm:text-sm">
            <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
            Threats ({swotAnalysis.threats.length})
          </h5>
          <div className="max-h-32 sm:max-h-40 overflow-y-auto pr-2 custom-scrollbar">
            <ul className="list-disc pl-4 text-xs space-y-1">
              {swotAnalysis.threats.map((item: SwotItem, i: number) => (
                <li key={i} className="text-amber-700 dark:text-amber-400">
                  <span className="font-medium">{item.point}</span>
                  <div className="text-[10px] sm:text-xs text-amber-600/80 dark:text-amber-400/80 mt-0.5">
                    {item.impact} <span className="italic">({item.evidence})</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="mt-3 sm:mt-4 p-2 sm:p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <h5 className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">SWOT Distribution</h5>
        <div className="h-[100px] sm:h-[120px]">
          <Bar
            data={{
              labels: ['Strengths', 'Weaknesses', 'Opportunities', 'Threats'],
              datasets: [
                {
                  label: 'Count',
                  data: [
                    swotAnalysis.strengths.length,
                    swotAnalysis.weaknesses.length,
                    swotAnalysis.opportunities.length,
                    swotAnalysis.threats.length,
                  ],
                  backgroundColor: ['#34D399', '#F87171', '#818CF8', '#FBBF24'],
                  borderRadius: 4,
                },
              ],
            }}
            options={{
              scales: {
                y: { beginAtZero: true, grid: { display: false }, ticks: { font: { size: 8 } } },
                x: { grid: { display: false }, ticks: { font: { size: 8 } } },
              },
              plugins: {
                legend: { display: false },
                tooltip: {
                  callbacks: {
                    label: function (context) {
                      return `Count: ${context.raw}`;
                    },
                  },
                },
              },
              maintainAspectRatio: false,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default SwotAnalysis;
