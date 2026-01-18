const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin('./i18n.ts');

module.exports = withNextIntl({
  reactStrictMode: true,
  output: 'standalone',
  experimental: {
    serverComponentsExternalPackages: ['pdfkit', 'fontkit', 'restructure', 'iconv-lite']
  }
});
