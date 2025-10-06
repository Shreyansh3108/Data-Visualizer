import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { Notifications } from './components/Notifications';
import { ControlPanel } from './components/ControlPanel';
import { ChartDisplay } from './components/ChartDisplay';
import { StatsCards } from './components/StatsCards';
import { useCSVUpload } from './hooks/useCSVUpload';
import { useLiveMode } from './hooks/useLiveMode';
import { sampleDatasets } from './data/sampleData';
import { getAvailableMetrics, getXAxisKey, exportToJSON } from './utils/chartHelpers';
import { PIE_CHART_MAX_ITEMS } from './utils/constants';

function App() {
  const [activeDataset, setActiveDataset] = useState('sales');
  const [chartType, setChartType] = useState('line');
  const [selectedMetrics, setSelectedMetrics] = useState(['revenue', 'profit']);
  const [theme, setTheme] = useState('light');
  const [showGrid, setShowGrid] = useState(true);
  const [animationEnabled, setAnimationEnabled] = useState(true);
  const [customData, setCustomData] = useState(null);
  const [csvHeaders, setCsvHeaders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fileName, setFileName] = useState('');

  const currentData = customData || sampleDatasets[activeDataset];
  const isCustomDataset = !!customData;

  const { showLiveMode, liveDataIndex, toggleLiveMode, resetLiveMode, resetOnDatasetChange } = useLiveMode(currentData.length);

  const handleFileUpload = useCSVUpload(
    setCustomData, 
    setCsvHeaders, 
    setFileName, 
    setError, 
    setIsLoading, 
    setActiveDataset, 
    setSelectedMetrics
  );

  const availableMetrics = useMemo(() => 
    getAvailableMetrics(isCustomDataset, csvHeaders, currentData, activeDataset),
    [isCustomDataset, csvHeaders, currentData, activeDataset]
  );

  const filteredData = useMemo(() => {
    const dataToUse = showLiveMode ? currentData.slice(0, liveDataIndex + 1) : currentData;
    
    if (chartType === 'pie' && dataToUse.length > PIE_CHART_MAX_ITEMS) {
      const sortedData = [...dataToUse]
        .sort((a, b) => (b[selectedMetrics[0]] || 0) - (a[selectedMetrics[0]] || 0))
        .slice(0, PIE_CHART_MAX_ITEMS);
      return sortedData;
    }
    return dataToUse;
  }, [currentData, chartType, selectedMetrics, showLiveMode, liveDataIndex]);

  const xAxisKey = useMemo(() => 
    getXAxisKey(isCustomDataset, csvHeaders, currentData, activeDataset),
    [isCustomDataset, csvHeaders, currentData, activeDataset]
  );

  const handleMetricToggle = useCallback((metric) => {
    setSelectedMetrics(prev => 
      prev.includes(metric) 
        ? prev.filter(m => m !== metric)
        : [...prev, metric]
    );
  }, []);

  const handleExport = useCallback(() => {
    const exportFileName = isCustomDataset 
      ? fileName.replace('.csv', '') + '-processed.json'
      : activeDataset + '-data.json';
    exportToJSON(filteredData, exportFileName);
  }, [filteredData, activeDataset, isCustomDataset, fileName]);

  const handleReset = useCallback(() => {
    setCustomData(null);
    setCsvHeaders([]);
    setFileName('');
    setActiveDataset('sales');
    setSelectedMetrics(['revenue', 'profit']);
  }, []);

  useEffect(() => {
    resetOnDatasetChange();
  }, [activeDataset, customData, resetOnDatasetChange]);

  return (
    <div className={'min-h-screen transition-all duration-300 ' + (theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900')}>
      <Header 
        theme={theme}
        setTheme={setTheme}
        isLoading={isLoading}
        handleFileUpload={handleFileUpload}
        exportData={handleExport}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Notifications 
          error={error}
          setError={setError}
          isCustomDataset={isCustomDataset}
          fileName={fileName}
          currentDataLength={currentData.length}
          csvHeadersLength={csvHeaders.length}
          onReset={handleReset}
          theme={theme}
        />

        <ControlPanel 
          theme={theme}
          activeDataset={activeDataset}
          setActiveDataset={setActiveDataset}
          isCustomDataset={isCustomDataset}
          chartType={chartType}
          setChartType={setChartType}
          availableMetrics={availableMetrics}
          selectedMetrics={selectedMetrics}
          handleMetricToggle={handleMetricToggle}
          showGrid={showGrid}
          setShowGrid={setShowGrid}
          animationEnabled={animationEnabled}
          setAnimationEnabled={setAnimationEnabled}
          showLiveMode={showLiveMode}
          toggleLiveMode={toggleLiveMode}
          resetLiveMode={resetLiveMode}
        />

        <ChartDisplay 
          theme={theme}
          chartType={chartType}
          filteredData={filteredData}
          currentDataLength={currentData.length}
          showGrid={showGrid}
          xAxisKey={xAxisKey}
          selectedMetrics={selectedMetrics}
          animationEnabled={animationEnabled}
          showLiveMode={showLiveMode}
          fileName={fileName}
          activeDataset={activeDataset}
          isCustomDataset={isCustomDataset}
        />

        <StatsCards 
          theme={theme}
          selectedMetrics={selectedMetrics}
          filteredData={filteredData}
        />
      </div>
    </div>
  );
}

export default App;