module.exports = {
  apps: [
    {
      name: 'varman-constructions',
      script: 'server.js',
      // cwd: './', // Using relative path or removing this line lets PM2 use the current directory
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '800M',
      env: {
        NODE_ENV: 'development',
        PORT: 3001
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3001
      },
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_file: './logs/combined.log',
      time: true,
      // Restart on failure
      exp_backoff_restart_delay: 100,
      // Graceful shutdown
      kill_timeout: 5000,
      listen_timeout: 10000
    }
  ]
};
