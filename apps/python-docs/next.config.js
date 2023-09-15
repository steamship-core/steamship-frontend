const withNextra = require('nextra')({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.tsx'
});

module.exports = withNextra({
  transpilePackages: ['@steamship/react'],
  experimental: {
    appDir: true
  }
});
