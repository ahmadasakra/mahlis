/** @type {import('next').NextConfig} */
const nextConfig = {
  // Erlaube alle Hosts für Heroku (wichtig für Custom Domains)
  // Heroku setzt den Host-Header automatisch basierend auf der Domain
  async headers() {
    return [
      {
        // CORS Headers für alle API Routes
        source: '/api/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*', // In Production sollte das spezifischer sein
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization, Cookie',
          },
          {
            key: 'Access-Control-Allow-Credentials',
            value: 'true',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;



