require('dotenv').config({path: '.env'});
// require('dotenv/config') 

module.exports = {

  development: {
    client: 'mysql2',
    connection: {
      host:     process.env.node_db_host,
      database: process.env.node_db_database,
      user:     process.env.node_db_user,
      password: process.env.node_db_password,
      port:     process.env.node_db_port
    },
    pool: {
      min: 1,
      max: 20
    },
    migrations: {
      directory: __dirname + '/knex/migrations',
    },
    seeds: {
      directory: __dirname + '/knex/seeds'
    },
    useNullAsDefault: true
  },

  staging: {
    client: 'mysql2',
    connection: {
      host:     process.env.node_db_host,
      database: process.env.node_db_database,
      user:     process.env.node_db_user,
      password: process.env.node_db_password,
      port:     process.env.node_db_port
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      directory: __dirname + '/knex/migrations',
    },
    seeds: {
      directory: __dirname + '/knex/seeds'
    },
    useNullAsDefault: true
  },

  production: {
    client: 'mysql2',
    connection: {
      host:     process.env.node_db_host,
      database: process.env.node_db_database,
      user:     process.env.node_db_user,
      password: process.env.node_db_password,
      port:     process.env.node_db_port
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      directory: __dirname + '/knex/migrations',
    },
    seeds: {
      directory: __dirname + '/knex/seeds'
    },
    useNullAsDefault: true
  }

};
