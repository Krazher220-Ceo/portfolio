// pm2: Next.js слушает только localhost, наружу его отдаёт Caddy.
module.exports = {
  apps: [
    {
      name: "portfolio",
      cwd: "/var/www/portfolio/current",
      script: "node_modules/next/dist/bin/next",
      args: "start -H 127.0.0.1 -p 3000",
      env: { NODE_ENV: "production" },
      instances: 1,
      exec_mode: "fork",
      max_memory_restart: "600M",
      kill_timeout: 5000,
    },
  ],
};
