const reportFID = (callback) => (entry) => {
  let status = 'POOR';
  if (entry.value <= 300) status = 'NEEDS IMPROVEMENT';
  if (entry.value <= 100) status = 'GOOD!!';
  return callback({ ...entry, status });
};

const reportLCP = (callback) => (entry) => {
  let status = 'POOR';
  if (entry.value <= 4000) status = 'NEEDS IMPROVEMENT';
  if (entry.value <= 2500) status = 'GOOD!!';
  return callback({ ...entry, status });
};

const reportCLS = (callback) => (entry) => {
  let status = 'POOR';
  if (entry.value <= 0.25) status = 'NEEDS IMPROVEMENT';
  if (entry.value <= 0.1) status = 'GOOD!!';
  return callback({ ...entry, status });
};

const reportWebVitals = (onPerfEntry) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({
      getCLS, getFID, getFCP, getLCP, getTTFB,
    }) => {
      getCLS(reportCLS(onPerfEntry));
      getFID(reportFID(onPerfEntry));
      getFCP(onPerfEntry);
      getLCP(reportLCP(onPerfEntry));
      getTTFB(onPerfEntry);
    });
  }
};

export default reportWebVitals;
