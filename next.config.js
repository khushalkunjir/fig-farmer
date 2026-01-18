const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin('./i18n.ts');

module.exports = withNextIntl({
  reactStrictMode: true,
  output: 'standalone',
  serverExternalPackages: ['pdfkit', 'fontkit', 'restructure', 'iconv-lite']
});
