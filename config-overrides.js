const { useBabelRc, override } = require('customize-cra')
const webpack = require('webpack')

const useFallback = () => (config) => {
  config.resolve.fallback = config.resolve.fallback ?? {}
  Object.assign(config.resolve.fallback, {
    stream: require.resolve('stream-browserify'),
    crypto: require.resolve('crypto-browserify'),
    buffer: require.resolve('buffer'),
    process: require.resolve('process/browser'),
    util: require.resolve('util'),
    url: require.resolve('url'),
    assert: require.resolve('assert'),
    path: require.resolve('path-browserify'),
    fs: false,
    net: false,
    tls: false,
  })

  // Add global variables that might be needed
  config.plugins = config.plugins || []
  config.plugins.push(
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
      process: 'process/browser',
    })
  )

  return config
}

// eslint-disable-next-line react-hooks/rules-of-hooks
module.exports = override(useBabelRc(), useFallback())
