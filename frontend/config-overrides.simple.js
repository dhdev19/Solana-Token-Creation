// Simple webpack configuration without react-app-rewired
// Use this if react-app-rewired causes issues

const webpack = require('webpack');

module.exports = function override(config) {
  // Basic Buffer polyfill
  config.plugins.push(
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer']
    })
  );
  
  // Ignore warnings
  config.ignoreWarnings = [
    /Failed to parse source map/,
    /Module not found/,
    /Can't resolve/
  ];
  
  return config;
}; 