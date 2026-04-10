export const cache = () => {
  return (req, res, next) => {
    next(); // just pass through
  };
};