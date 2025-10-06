import { useCallback } from 'react';
import Papa from 'papaparse';
import { MAX_DATASET_SIZE } from '../utils/constants';

export const useCSVUpload = (setCustomData, setCsvHeaders, setFileName, setError, setIsLoading, setActiveDataset, setSelectedMetrics) => {
  const handleFileUpload = useCallback((event) => {
    const file = event.target.files[0];
    if (file && file.type === 'text/csv') {
      setIsLoading(true);
      setError(null);
      setFileName(file.name);
      
      Papa.parse(file, {
        complete: (result) => {
          try {
            if (result.errors.length > 0) {
              setError('CSV parsing errors occurred');
              setIsLoading(false);
              return;
            }

            const data = result.data;
            if (data.length === 0) {
              setError('CSV file is empty');
              setIsLoading(false);
              return;
            }

            if (data.length > MAX_DATASET_SIZE + 1) {
              setError(`Dataset too large. Maximum ${MAX_DATASET_SIZE.toLocaleString()} rows allowed.`);
              setIsLoading(false);
              return;
            }

            const headers = data[0].map(header => 
              header.toString().trim().replace(/[^a-zA-Z0-9_]/g, '_')
            );
            
            const parsedData = data.slice(1)
              .filter(row => row.some(cell => cell && cell.toString().trim() !== ''))
              .map(row => {
                const rowObj = {};
                headers.forEach((header, index) => {
                  const value = row[index];
                  const numValue = parseFloat(value);
                  rowObj[header] = !isNaN(numValue) && isFinite(numValue) ? numValue : value;
                });
                return rowObj;
              });

            if (parsedData.length === 0) {
              setError('No valid data rows found in CSV');
              setIsLoading(false);
              return;
            }

            setCsvHeaders(headers);
            setCustomData(parsedData);
            
            const numericHeaders = headers.filter(header => {
              const sampleValues = parsedData.slice(0, 5).map(row => row[header]);
              return sampleValues.some(value => typeof value === 'number');
            });
            
            setSelectedMetrics(numericHeaders.slice(0, 2));
            setActiveDataset('custom');
            setIsLoading(false);
            
          } catch (err) {
            setError('Error processing CSV file');
            setIsLoading(false);
          }
        },
        header: false,
        skipEmptyLines: true
      });
    } else {
      setError('Please select a valid CSV file');
    }
    
    event.target.value = '';
  }, [setCustomData, setCsvHeaders, setFileName, setError, setIsLoading, setActiveDataset, setSelectedMetrics]);

  return handleFileUpload;
};