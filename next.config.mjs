/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [{
      source: "/api/:path*",
      // destination: "https://blooapp-nakavwocwa-et.a.run.app/api/:path*",
      destination: "http://localhost:8080/api/:path*",
    }, ];
  },
};

export default nextConfig;