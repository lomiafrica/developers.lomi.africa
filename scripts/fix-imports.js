import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const configContent = `import nextra from 'nextra';

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
`;

writeFileSync(join(__dirname, '..', 'next.config.mjs'), configContent); 