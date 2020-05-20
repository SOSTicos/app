const { toBoolean } = require('./lib/utils')

module.exports = {
  secret: process.env.API_SECRET || 'secret',
  site: process.env.SITE_URL || 'http://localhost:3000',
  host: process.env.API_URL || 'http://localhost:3000/api',
  mongo: process.env.MONGO_URL || 'mongodb://localhost:27017/sosticos-dev',
  accessTokenTTL: process.env.ACCESS_TOKEN_TTL || '60d',
  signInTokenTTL: process.env.SIGNIN_TOKEN_TTL || '5min',
  from: process.env.FROM_EMAIL || 'team@spry.cr',
  superadmin: process.env.SUPERADMIN_EMAIL || 'sosticoscr@gmail.com',
  seed: toBoolean(process.env.SEED) || true,
  aws: {
    accessKey: process.env.AWS_ACCESS_TOKEN,
    secretKey: process.env.AWS_SECRET_TOKEN,
    region: process.env.REGION || 'us-east-1',
  },
}
