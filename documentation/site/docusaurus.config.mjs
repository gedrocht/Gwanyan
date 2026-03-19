const repositoryName = process.env.GITHUB_REPOSITORY?.split('/')[1] ?? 'Gwanyan';
const pagesBaseUrl =
  process.env.DOCUSAURUS_BASE_URL ?? (process.env.CI ? `/${repositoryName}/` : '/');

/** @type {import('@docusaurus/types').Config} */
const configuration = {
  title: 'Gwanyan Interactive Grassland',
  tagline: 'A beginner-friendly deep dive into WebGPU-ready grass physics and rendering.',
  favicon: 'img/favicon.svg',
  url: process.env.DOCUSAURUS_SITE_URL ?? 'https://example.com',
  baseUrl: pagesBaseUrl,
  organizationName: process.env.GITHUB_REPOSITORY_OWNER ?? 'replace-me',
  projectName: repositoryName,
  onBrokenLinks: 'warn',
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },
  presets: [
    [
      'classic',
      {
        docs: {
          routeBasePath: 'docs',
          sidebarPath: './sidebars.mjs',
          editUrl: undefined,
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      },
    ],
  ],
  themeConfig: {
    navbar: {
      title: 'Gwanyan',
      items: [
        {
          to: '/docs/intro',
          label: 'Handbook',
          position: 'left',
        },
        {
          href: `${pagesBaseUrl}api/index.html`,
          label: 'API',
          position: 'left',
        },
        {
          to: '/docs/reference/external-libraries',
          label: 'Libraries',
          position: 'left',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Documentation',
          items: [
            {
              label: 'Beginner Handbook',
              to: '/docs/intro',
            },
            {
              label: 'API Reference',
              href: `${pagesBaseUrl}api/index.html`,
            },
          ],
        },
        {
          title: 'Operations',
          items: [
            {
              label: 'GitHub Setup',
              to: '/docs/governance/github-setup',
            },
            {
              label: 'Logging and Observability',
              to: '/docs/operations/logging-and-observability',
            },
          ],
        },
      ],
      copyright: `Copyright ${new Date().getFullYear()} Gwanyan.`,
    },
  },
};

export default configuration;
