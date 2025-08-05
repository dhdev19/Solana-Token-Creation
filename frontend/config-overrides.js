const webpack = require('webpack');
const path = require('path');

module.exports = function override(config) {
  const fallback = config.resolve.fallback || {};
  Object.assign(fallback, {
    "crypto": require.resolve("crypto-browserify"),
    "stream": require.resolve("stream-browserify"),
    "buffer": require.resolve("buffer/"),
    "process": require.resolve("process/browser")
  });
  config.resolve.fallback = fallback;
  
  // Add aliases for module resolution
  config.resolve.alias = {
    ...config.resolve.alias,
    '@solana/spl-token-group': path.resolve(__dirname, 'src/utils/emptyModule.js'),
    'process/browser': require.resolve('process/browser')
  };
  
  config.plugins = (config.plugins || []).concat([
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer']
    }),
    new webpack.DefinePlugin({
      'global.Buffer': 'Buffer'
    })
  ]);
  
  config.ignoreWarnings = [/Failed to parse source map/];
  return config;
};