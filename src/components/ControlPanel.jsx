import React from 'react';
import { Database, Eye, Filter, Settings, Activity, BarChart3, Target, TrendingUp } from 'lucide-react';

export const ControlPanel = ({
  theme,
  activeDataset,
  setActiveDataset,
  isCustomDataset,
  chartType,
  setChartType,
  availableMetrics,
  selectedMetrics,
  handleMetricToggle,
  showGrid,
  setShowGrid,
  animationEnabled,
  setAnimationEnabled,
  showLiveMode,
  toggleLiveMode,
  resetLiveMode
}) => {
  return (
    <div className={(theme === 'dark' ? 'bg-gray-800' : 'bg-white') + ' rounded-xl shadow-lg p-6 mb-8 border ' + (theme === 'dark' ? 'border-gray-700' : 'border-gray-200')}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div>
          <label className={'block text-sm font-medium mb-2 ' + (theme === 'dark' ? 'text-gray-300' : 'text-gray-700')}>
            <Database className="inline h-4 w-4 mr-1" />
            Dataset
          </label>
          <select
            value={activeDataset}
            onChange={(e) => setActiveDataset(e.target.value)}
            className={'w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ' + (theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900')}
            disabled={isCustomDataset}
          >
            {isCustomDataset && <option value="custom">Custom CSV Data</option>}
            <option value="sales">Sales Data</option>
            <option value="performance">Performance Metrics</option>
            <option value="demographics">Demographics</option>
          </select>
        </div>

        <div>
          <label className={'block text-sm font-medium mb-2 ' + (theme === 'dark' ? 'text-gray-300' : 'text-gray-700')}>
            <Eye className="inline h-4 w-4 mr-1" />
            Chart Type
          </label>
          <div className="flex space-x-2">
            {[
              { type: 'line', icon: Activity },
              { type: 'bar', icon: BarChart3 },
              { type: 'pie', icon: Target },
              { type: 'area', icon: TrendingUp }
            ].map(({ type, icon: Icon }) => (
              <button
                key={type}
                onClick={() => setChartType(type)}
                className={'p-2 rounded-lg transition-colors ' + (chartType === type ? 'bg-blue-600 text-white' : theme === 'dark' ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300')}
                title={type.charAt(0).toUpperCase() + type.slice(1)}
              >
                <Icon className="h-4 w-4" />
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className={'block text-sm font-medium mb-2 ' + (theme === 'dark' ? 'text-gray-300' : 'text-gray-700')}>
            <Filter className="inline h-4 w-4 mr-1" />
            Metrics
          </label>
          <div className="space-y-1 max-h-20 overflow-y-auto">
            {availableMetrics.slice(0, 4).map((metric) => (
              <label key={metric} className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedMetrics.includes(metric)}
                  onChange={() => handleMetricToggle(metric)}
                  className="mr-2"
                />
                <span className={'text-sm capitalize ' + (theme === 'dark' ? 'text-gray-300' : 'text-gray-700')}>
                  {metric.replace(/_/g, ' ')}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className={'block text-sm font-medium mb-2 ' + (theme === 'dark' ? 'text-gray-300' : 'text-gray-700')}>
            <Settings className="inline h-4 w-4 mr-1" />
            Settings
          </label>
          <div className="space-y-1">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={showGrid}
                onChange={(e) => setShowGrid(e.target.checked)}
                className="mr-2"
              />
              <span className={'text-sm ' + (theme === 'dark' ? 'text-gray-300' : 'text-gray-700')}>
                Show Grid
              </span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={animationEnabled}
                onChange={(e) => setAnimationEnabled(e.target.checked)}
                className="mr-2"
              />
              <span className={'text-sm ' + (theme === 'dark' ? 'text-gray-300' : 'text-gray-700')}>
                Animations
              </span>
            </label>
            {chartType === 'line' && (
              <button
                onClick={toggleLiveMode}
                className={'w-full mt-2 px-3 py-1 rounded text-sm font-medium transition-colors ' + (showLiveMode ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-green-600 hover:bg-green-700 text-white')}
              >
                {showLiveMode ? '⏸ Stop Live' : '▶ Live Mode'}
              </button>
            )}
            {showLiveMode && chartType === 'line' && (
              <button
                onClick={resetLiveMode}
                className={'w-full px-3 py-1 rounded text-sm font-medium transition-colors ' + (theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-300 hover:bg-gray-400 text-gray-800')}
              >
                🔄 Replay
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};