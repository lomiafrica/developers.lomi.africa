import nextra from 'nextra';

const withNextra = nextra({
  theme: 'nextra-theme-docs',
  themeConfig: './src/theme.config.tsx',
  defaultShowCopyCode: true
});

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true
};

export default withNextra(nextConfig);
