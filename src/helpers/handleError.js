/** @flow */
export const handleError = (err: Object) => {
  console.error('Error status', err.statusCode);
  console.error('Error data', err.data);
};
