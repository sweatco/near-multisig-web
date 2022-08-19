module.exports = function override(config, env) {
  config.resolve.fallback = config.resolve.fallback ?? {}
  Object.assign(config.resolve.fallback, {
    stream: require.resolve('stream-browserify'),
    crypto: require.resolve('crypto-browserify'),
  })

  return config
}
