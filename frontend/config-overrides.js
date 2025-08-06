const webpack = require('webpack');
const path = require('path');

module.exports = function override(config) {
  // Safely add fallbacks
  const fallback = config.resolve.fallback || {};
  
  // Only add fallbacks if the modules are available
  try {
    Object.assign(fallback, {
      "crypto": require.resolve("crypto-browserify"),
      "stream": require.resolve("stream-browserify"),
      "buffer": require.resolve("buffer/"),
      "process": require.resolve("process/browser")
    });
  } catch (error) {
    console.warn('Some polyfill modules not found, using fallbacks:', error.message);
    // Add basic fallbacks
    Object.assign(fallback, {
      "crypto": false,
      "stream": false,
      "buffer": false,
      "process": false
    });
  }
  
  config.resolve.fallback = fallback;
  
  // Add aliases for module resolution
  config.resolve.alias = {
    ...config.resolve.alias,
    '@solana/spl-token-group': path.resolve(__dirname, 'src/utils/emptyModule.js'),
    'process/browser': require.resolve('process/browser'),
    'process': require.resolve('process/browser')
  };
  
  // Safely add plugins
  const plugins = config.plugins || [];
  
  try {
    plugins.push(
      new webpack.ProvidePlugin({
        process: 'process/browser',
        Buffer: ['buffer', 'Buffer']
      })
    );
  } catch (error) {
    console.warn('Could not add ProvidePlugin:', error.message);
  }
  
  try {
    plugins.push(
      new webpack.DefinePlugin({
        'global.Buffer': 'Buffer',
        'process.env': JSON.stringify(process.env)
      })
    );
  } catch (error) {
    console.warn('Could not add DefinePlugin:', error.message);
  }
  
  config.plugins = plugins;
  
  // Ignore warnings
  config.ignoreWarnings = [
    /Failed to parse source map/,
    /Module not found/,
    /Can't resolve/,
    /BREAKING CHANGE/
  ];
  
  return config;
};