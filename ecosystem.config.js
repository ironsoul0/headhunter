module.exports = {
  apps: [
    {
      name: "hh",
      script: "./src/index.js",
      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
      },
    },
  ],
};
