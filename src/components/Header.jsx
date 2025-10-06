import React from 'react';
import { Upload, Download, BarChart3 } from 'lucide-react';

export const Header = ({ theme, setTheme, isLoading, handleFileUpload, exportData }) => {
  return (
    <div className={(theme === 'dark' ? 'bg-gray-800' : 'bg-white') + ' shadow-lg border-b ' + (theme === 'dark' ? 'border-gray-700' : 'border-gray-200')}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg">
              <BarChart3 className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                DataViz Pro
              </h1>
              <p className={'text-sm ' + (theme === 'dark' ? 'text-gray-400' : 'text-gray-600')}>
                Interactive Data Visualization Platform
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className={'p-2 rounded-lg transition-colors ' + (theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300')}
            >
              {theme === 'dark' ? '🌞' : '🌙'}
            </button>
            
            <label className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg cursor-pointer transition-colors relative">
              <Upload className="h-4 w-4" />
              <span>{isLoading ? 'Processing...' : 'Import CSV'}</span>
              {isLoading && (
                <div className="absolute inset-0 bg-blue-700 rounded-lg flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
                disabled={isLoading}
              />
            </label>
            
            <button
              onClick={exportData}
              className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Download className="h-4 w-4" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};