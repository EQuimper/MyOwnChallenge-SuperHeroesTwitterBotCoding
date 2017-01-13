export const handleError = err => {
  console.error('Error status', err.statusCode);
  console.error('Error data', err.data);
};
