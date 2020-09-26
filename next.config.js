const { toBoolean } = require('./server/lib/utils')

module.exports = {
  serverRuntimeConfig: {
    PROJECT_ROOT: __dirname,
  },
  target: 'serverless',
  webpack: (config, { /* buildId, dev, isServer, defaultLoaders, */ webpack }) => {
    // Note: we provide webpack above so you should not `require` it
    // Perform customizations to webpack config
    config.plugins.push(new webpack.IgnorePlugin(/\/__tests__\//))

    config.plugins.push(
      new webpack.DefinePlugin({
        WEBPACK_API_SECRET: JSON.stringify(process.env.API_SECRET || 'secret'),
        WEBPACK_SITE_URL: JSON.stringify(process.env.SITE_URL || 'http://localhost:3000'),
        WEBPACK_API_URL: JSON.stringify(process.env.API_URL || 'http://localhost:3000/api'),
        WEBPACK_MONGO_URL: JSON.stringify(
          process.env.MONGO_URL || 'mongodb://localhost:27017/sosticos'
        ),
        WEBPACK_ACCESS_TOKEN_TTL: JSON.stringify(process.env.ACCESS_TOKEN_TTL || '60d'),
        WEBPACK_SIGNIN_TOKEN_TTL: JSON.stringify(process.env.SIGNIN_TOKEN_TTL || '5min'),
        WEBPACK_FROM_EMAIL: JSON.stringify(process.env.FROM_EMAIL || 'team@sosticos.com'),
        WEBPACK_SUPERADMIN_EMAIL: JSON.stringify(
          process.env.SUPERADMIN_EMAIL || 'sosticoscr@gmail.com'
        ),
        WEBPACK_SEED: toBoolean(process.env.SEED) || true,
        WEBPACK_S3_BUCKET: JSON.stringify(process.env.S3_BUCKET || 'sosticos.com'),
      })
    )

    // Important: return the modified config
    return config
  },
}
