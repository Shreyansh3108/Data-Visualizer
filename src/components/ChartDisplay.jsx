import React from 'react';
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { AlertCircle } from 'lucide-react';
import { COLORS, GRADIENT_COLORS, PIE_CHART_MAX_ITEMS } from '../utils/constants';

export const ChartDisplay = ({
  theme,
  chartType,
  filteredData,
  currentDataLength,
  showGrid,
  xAxisKey,
  selectedMetrics,
  animationEnabled,
  showLiveMode,
  fileName,
  activeDataset,
  isCustomDataset
}) => {
  const currentScore = showLiveMode && selectedMetrics.length > 0 && filteredData.length > 0
    ? filteredData[filteredData.length - 1][selectedMetrics[0]]
    : null;

  const commonProps = {
    data: filteredData,
    margin: { top: 20, right: 30, left: 20, bottom: 20 }
  };

  const renderLineChart = () => (
    <div className="space-y-4">
      {showLiveMode && (
        <div className={'p-4 rounded-lg border-2 ' + (theme === 'dark' ? 'bg-gradient-to-r from-green-900 to-blue-900 border-green-600' : 'bg-gradient-to-r from-green-50 to-blue-50 border-green-400')}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <div className="absolute inset-0 w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
              </div>
              <span className={'text-lg font-bold ' + (theme === 'dark' ? 'text-green-300' : 'text-green-700')}>
                🏏 LIVE UPDATES
              </span>
            </div>
            <div className="flex items-center space-x-4">
              {currentScore && (
                <div className={'text-3xl font-bold ' + (theme === 'dark' ? 'text-white' : 'text-gray-900')}>
                  {currentScore.toLocaleString()}
                </div>
              )}
              <div className={'text-sm ' + (theme === 'dark' ? 'text-gray-300' : 'text-gray-600')}>
                {filteredData.length} / {currentDataLength} points
              </div>
            </div>
          </div>
        </div>
      )}
      <ResponsiveContainer width="100%" height={400}>
        <LineChart {...commonProps}>
          {showGrid && <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#374151' : '#e5e7eb'} />}
          <XAxis dataKey={xAxisKey} stroke={theme === 'dark' ? '#9ca3af' : '#6b7280'} />
          <YAxis stroke={theme === 'dark' ? '#9ca3af' : '#6b7280'} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff', 
              border: '1px solid ' + (theme === 'dark' ? '#374151' : '#e5e7eb'), 
              borderRadius: '8px' 
            }} 
          />
          <Legend />
          {selectedMetrics.map((metric, index) => (
            <Line 
              key={metric}
              type="monotone" 
              dataKey={metric} 
              stroke={COLORS[index]} 
              strokeWidth={showLiveMode ? 4 : 3}
              dot={{ fill: COLORS[index], strokeWidth: 2, r: showLiveMode ? 8 : 6 }}
              activeDot={{ r: 10 }}
              animationDuration={showLiveMode ? 600 : (animationEnabled ? 1500 : 0)}
              animationEasing="ease-out"
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );

  const renderBarChart = () => (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart {...commonProps}>
        {showGrid && <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#374151' : '#e5e7eb'} />}
        <XAxis dataKey={xAxisKey} stroke={theme === 'dark' ? '#9ca3af' : '#6b7280'} />
        <YAxis stroke={theme === 'dark' ? '#9ca3af' : '#6b7280'} />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff', 
            border: '1px solid ' + (theme === 'dark' ? '#374151' : '#e5e7eb'), 
            borderRadius: '8px' 
          }} 
        />
        <Legend />
        {selectedMetrics.map((metric, index) => (
          <Bar 
            key={metric}
            dataKey={metric} 
            fill={'url(#gradient' + index + ')'}
            radius={[4, 4, 0, 0]}
            animationDuration={animationEnabled ? 1500 : 0}
          />
        ))}
        <defs>
          {selectedMetrics.map((m, index) => (
            <linearGradient key={index} id={'gradient' + index} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={GRADIENT_COLORS[index * 2]} />
              <stop offset="100%" stopColor={GRADIENT_COLORS[index * 2 + 1]} />
            </linearGradient>
          ))}
        </defs>
      </BarChart>
    </ResponsiveContainer>
  );

  const renderPieChart = () => {
    const isLargeDataset = currentDataLength > PIE_CHART_MAX_ITEMS;
    return (
      <div className="space-y-4">
        {isLargeDataset && (
          <div className={'p-3 rounded-lg border ' + (theme === 'dark' ? 'bg-blue-900 border-blue-700 text-blue-200' : 'bg-blue-50 border-blue-200 text-blue-800')}>
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">
                Showing top {PIE_CHART_MAX_ITEMS} items out of {currentDataLength} total rows
              </span>
            </div>
          </div>
        )}
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={filteredData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => {
                const displayName = name ? name.toString().substring(0, 15) : 'N/A';
                return displayName + (displayName.length === 15 ? '...' : '') + ' ' + (percent * 100).toFixed(0) + '%';
              }}
              outerRadius={Math.min(120, 400 / (filteredData.length > 10 ? 4 : 3))}
              fill="#8884d8"
              dataKey={selectedMetrics[0] || 'value'}
              animationDuration={animationEnabled ? 1500 : 0}
            >
              {filteredData.map((entry, index) => (
                <Cell key={'cell-' + index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff', 
                border: '1px solid ' + (theme === 'dark' ? '#374151' : '#e5e7eb'), 
                borderRadius: '8px' 
              }} 
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  };

  const renderAreaChart = () => (
    <ResponsiveContainer width="100%" height={400}>
      <AreaChart {...commonProps}>
        {showGrid && <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#374151' : '#e5e7eb'} />}
        <XAxis dataKey={xAxisKey} stroke={theme === 'dark' ? '#9ca3af' : '#6b7280'} />
        <YAxis stroke={theme === 'dark' ? '#9ca3af' : '#6b7280'} />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff', 
            border: '1px solid ' + (theme === 'dark' ? '#374151' : '#e5e7eb'), 
            borderRadius: '8px' 
          }} 
        />
        <Legend />
        {selectedMetrics.map((metric, index) => (
          <Area 
            key={metric}
            type="monotone" 
            dataKey={metric} 
            stackId="1"
            stroke={COLORS[index]} 
            fill={'url(#areaGradient' + index + ')'}
            animationDuration={animationEnabled ? 1500 : 0}
          />
        ))}
        <defs>
          {selectedMetrics.map((m, index) => (
            <linearGradient key={index} id={'areaGradient' + index} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={COLORS[index]} stopOpacity={0.8} />
              <stop offset="100%" stopColor={COLORS[index]} stopOpacity={0.1} />
            </linearGradient>
          ))}
        </defs>
      </AreaChart>
    </ResponsiveContainer>
  );

  const renderChart = () => {
    switch (chartType) {
      case 'line': return renderLineChart();
      case 'bar': return renderBarChart();
      case 'pie': return renderPieChart();
      case 'area': return renderAreaChart();
      default: return null;
    }
  };

  return (
    <div className={(theme === 'dark' ? 'bg-gray-800' : 'bg-white') + ' rounded-xl shadow-lg p-6 border ' + (theme === 'dark' ? 'border-gray-700' : 'border-gray-200')}>
      <div className="mb-4">
        <h2 className="text-2xl font-bold mb-2">
          {isCustomDataset ? fileName + ' Visualization' : activeDataset.charAt(0).toUpperCase() + activeDataset.slice(1) + ' Visualization'}
        </h2>
        <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
          Interactive {chartType} chart showing {selectedMetrics.join(' and ')}
        </p>
      </div>
      {renderChart()}
    </div>
  );
};