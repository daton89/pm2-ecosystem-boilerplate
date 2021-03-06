module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps: [

    // First application
    {
      name: 'ecosystem-boilerplate',
      script: 'server/index.js',
      env: {
        COMMON_VARIABLE: 'true'
      },
      env_production: {
        NODE_ENV: 'production'
      },
      append_env_to_name: true
    }
  ],

  /**
   * Deployment section
   * http://pm2.keymetrics.io/docs/usage/deployment/
   */
  deploy: {
    production: {
      user: 'root',
      host: '10.1.10.15',
      ref: 'origin/master',
      repo: 'https://github.com/daton89/pm2-ecosystem-boilerplate.git',
      path: '/root/production/pm2-ecosystem',
      'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env production'
    },
    test: {
      user: 'root',
      host: '10.1.10.15',
      ref: 'origin/master',
      repo: 'https://github.com/daton89/pm2-ecosystem-boilerplate.git',
      path: '/root/test/pm2-ecosystem',
      "pre-setup": "apt-get install git",
      "post-setup": "ls -la",
      'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env test',
      "pre-deploy-local": "echo 'This is a local executed command'",
      env: {
        NODE_ENV: 'test'
      }
    }
  }
};
