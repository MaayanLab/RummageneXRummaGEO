const nextConfig = {
  experimental: {
    serverActions: true,
  },
  async rewrites() {
    return [
      {
        source: '/graphql',
        destination: '/api/graphql',
      },
      {
        source: '/graphiql',
        destination: '/api/graphiql',
      },
    ]
  },
}

module.exports = nextConfig