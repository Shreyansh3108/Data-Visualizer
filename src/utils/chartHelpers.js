export const getXAxisKey = (isCustomDataset, csvHeaders, currentData, activeDataset) => {
  if (isCustomDataset && csvHeaders.length > 0) {
    const labelColumn = csvHeaders.find(header => {
      const sampleValues = currentData.slice(0, 5).map(row => row[header]);
      return sampleValues.some(value => typeof value === 'string' && isNaN(parseFloat(value)));
    });
    return labelColumn || csvHeaders[0];
  }
  return activeDataset === 'sales' ? 'month' : 
         activeDataset === 'performance' ? 'category' : 'name';
};

export const getAvailableMetrics = (isCustomDataset, csvHeaders, currentData, activeDataset) => {
  if (isCustomDataset && csvHeaders.length > 0) {
    return csvHeaders.filter(header => {
      const sampleValues = currentData.slice(0, 5).map(row => row[header]);
      return sampleValues.some(value => !isNaN(parseFloat(value)) && isFinite(value));
    });
  }
  if (activeDataset === 'sales') return ['revenue', 'profit', 'customers'];
  if (activeDataset === 'performance') return ['score', 'benchmark'];
  return ['value', 'count'];
};

export const exportToJSON = (data, filename) => {
  const dataStr = JSON.stringify(data, null, 2);
  const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
  
  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', filename);
  linkElement.click();
};