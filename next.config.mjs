import nextra from 'nextra';

const withNextra = nextra({
  theme: 'nextra-theme-docs',
  themeConfig: './src/theme.config.tsx',
  defaultShowCopyCode: true
});

const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: [
      `default-src 'self'`,
      // Allow scripts from self, Vercel domains (for analytics/preview), and inline/eval scripts (Next.js requirement)
      `script-src 'self' 'unsafe-eval' 'unsafe-inline' https://vercel.live https://*.vercel.com https://va.vercel-scripts.com`,
      // Allow styles from self and inline styles
      `style-src 'self' 'unsafe-inline'`,
      // Allow images from self, data URIs, and any HTTPS source
      `img-src 'self' data: https://*`,
      // Allow fonts from self
      `font-src 'self'`,
      `object-src 'none'`,
      `base-uri 'self'`,
      `form-action 'self'`,
      `frame-ancestors 'none'`,
      `upgrade-insecure-requests`,
    ].join('; '),
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload', // max-age = 2 years
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()', // Adjust based on required features
  },
];

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  async headers() {
    return [
      {
        // Apply these headers to all routes in the app.
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};

export default withNextra(nextConfig);
