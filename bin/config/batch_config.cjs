batchConfig = {
  name: 'topin-batch-v1',
  script: './bin/batch_app.js',
  instances: 1,
  watch: false,
  env: {
    DB_HOST: '127.0.0.1',
    DB_PORT: '3306',
    DB_USER: 'root',
    DB_PASSWORD: 'Root123!!',
    DB_DATABASE: 'topin',
    RDS_HOST: '127.0.0.1',
    RDS_PORT: '6379',
  },
  env_staging: {
    DB_HOST: '127.0.0.1',
    DB_PORT: '3306',
    DB_USER: 'root',
    DB_PASSWORD: '0000',
    DB_DATABASE: 'topin',
    RDS_HOST: '127.0.0.1',
    RDS_PORT: '6379',
  },
  env_production: {
    DB_HOST: '127.0.0.1',
    DB_PORT: '3306',
    DB_USER: 'root',
    DB_PASSWORD: 'Root123!!',
    DB_DATABASE: 'topin',
    RDS_HOST: '127.0.0.1',
    RDS_PORT: '6379',
  },
}

module.exports = batchConfig
