/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  //env
  env: {
    CONNECTION_STRING: process.env.CONNECTION_STRING,
    SECRET_KEY: process.env.SECRET_KEY,
  }
}

module.exports = nextConfig
