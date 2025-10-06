import React from 'react';
import { AlertCircle, FileText } from 'lucide-react';
import { PIE_CHART_MAX_ITEMS } from '../utils/constants';

export const Notifications = ({ 
  error, 
  setError, 
  isCustomDataset, 
  fileName, 
  currentDataLength, 
  csvHeadersLength, 
  onReset,
  theme 
}) => {
  return (
    <>
      {error && (
        <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg flex items-center space-x-2">
          <AlertCircle className="h-5 w-5" />
          <span>{error}</span>
          <button 
            onClick={() => setError(null)}
            className="ml-auto text-red-500 hover:text-red-700 text-2xl leading-none"
          >
            ×
          </button>
        </div>
      )}

      {isCustomDataset && !error && (
        <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg flex items-center space-x-2">
          <FileText className="h-5 w-5" />
          <div className="flex-1">
            <div>Successfully loaded {fileName} with {currentDataLength} rows and {csvHeadersLength} columns</div>
            {currentDataLength > 1000 && (
              <div className="text-sm mt-1 text-green-600">
                💡 Large dataset detected. Pie charts show top {PIE_CHART_MAX_ITEMS} items for better readability.
              </div>
            )}
          </div>
          <button 
            onClick={onReset}
            className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
          >
            Reset
          </button>
        </div>
      )}
    </>
  );
};