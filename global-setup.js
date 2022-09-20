// Set timezone for consistency in time sensitive tests
module.exports = async () => {
  process.env.TZ = 'UTC';
};
