import React from 'react';
import { COLORS } from '../utils/constants';

export const StatsCards = ({ theme, selectedMetrics, filteredData }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
      {selectedMetrics.slice(0, 3).map((metric, index) => {
        const values = filteredData
          .map(item => item[metric])
          .filter(v => v != null && !isNaN(parseFloat(v)));
        
        if (values.length === 0) return null;
        
        const numericValues = values.map(val => parseFloat(val));
        const total = numericValues.reduce((sum, val) => sum + val, 0);
        const average = total / numericValues.length;
        const max = Math.max(...numericValues);
        
        return (
          <div 
            key={metric} 
            className={(theme === 'dark' ? 'bg-gray-800' : 'bg-white') + ' rounded-xl shadow-lg p-6 border ' + (theme === 'dark' ? 'border-gray-700' : 'border-gray-200')}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={'text-sm font-medium ' + (theme === 'dark' ? 'text-gray-400' : 'text-gray-600')}>
                  {metric.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </p>
                <p className="text-2xl font-bold mt-1">
                  {average.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </p>
                <p className={'text-sm mt-1 ' + (theme === 'dark' ? 'text-gray-400' : 'text-gray-600')}>
                  Average • Max: {max.toLocaleString()}
                </p>
              </div>
              <div 
                className="h-12 w-12 rounded-lg flex items-center justify-center" 
                style={{ backgroundColor: COLORS[index] + '20' }}
              >
                <div 
                  className="h-6 w-6 rounded" 
                  style={{ backgroundColor: COLORS[index] }}
                ></div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};