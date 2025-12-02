import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'ScriptableObject Kit',
  tagline: 'Professional ScriptableObject Architecture Pattern for Unity',
  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://github.com',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/SoapKit-Doc',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'tupicode', // Usually your GitHub org/user name.
  projectName: 'SoapKit-Doc', // Usually your repo name.

  onBrokenLinks: 'ignore',
  onBrokenMarkdownLinks: 'ignore',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: '/', // Serve docs at site's root
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        blog: false, // Disable blog
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    navbar: {
      title: 'SoapKit',
      logo: {
        alt: 'SoapKit Logo',
        src: 'img/soap.png',
      },
      items: [
        {
          href: 'https://github.com/farmgrowth/soapkit',
          label: 'GitHub',
          position: 'right',
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
              label: 'Getting Started',
              to: '/getting-started',
            },
            {
              label: 'Why SoapKit?',
              to: '/why-soapkit',
            },
            {
              label: 'Examples',
              to: '/examples/health-system',
            },
          ],
        },
        {
          title: 'Unity Resources',
          items: [
            {
              label: 'Unity Asset Store',
              href: 'https://assetstore.unity.com',
            },
            {
              label: 'Unity Documentation',
              href: 'https://docs.unity3d.com',
            },
            {
              label: 'ScriptableObjects Guide',
              href: 'https://docs.unity3d.com/Manual/class-ScriptableObject.html',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/farmgrowth/soapkit',
            },
            {
              label: 'Unity Package Manager',
              href: 'https://docs.unity3d.com/Manual/upm-ui.html',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Farm Growth Toolkit. Built with Docusaurus.`,
    },
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: false,
      respectPrefersColorScheme: true,
      
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['csharp']
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
