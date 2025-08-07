// Simple process polyfill for browser environment
if (typeof window !== 'undefined' && !window.process) {
  window.process = {
    env: {
      NODE_ENV: process.env.NODE_ENV || 'development'
    },
    browser: true,
    version: '',
    versions: {},
    platform: 'browser'
  };
}

export default window.process || process;
