const { useBabelRc, override } = require('customize-cra')

const useFallback = () => (config) => {
  config.resolve.fallback = config.resolve.fallback ?? {}
  Object.assign(config.resolve.fallback, {
    stream: require.resolve('stream-browserify'),
    crypto: require.resolve('crypto-browserify'),
  })

  return config
}

// eslint-disable-next-line react-hooks/rules-of-hooks
module.exports = override(useBabelRc(), useFallback())
