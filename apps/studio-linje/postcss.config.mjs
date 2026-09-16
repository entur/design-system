// Stops Vite walking up to the root config, whose plugins are not installed by
// the studio-only CI install. Studio styles need no PostCSS of their own.
export default { plugins: [] };
