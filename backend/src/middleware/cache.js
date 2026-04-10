export const cache = (req, res, next) => {
  next(); // disable caching for now
};