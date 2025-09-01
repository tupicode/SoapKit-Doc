import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docsSidebar: [
    'overview',
    'why-soapkit',
    'getting-started',
    {
      type: 'category',
      label: 'Core Systems',
      items: [
        'core-systems/events',
        'core-systems/variables',
        'core-systems/quick-guide',
      ],
    },
    {
      type: 'category',
      label: 'Editor Tools',
      items: [
        'editor-tools/debug-window',
        'editor-tools/settings-window',
        'editor-tools/asset-creator',
        'editor-tools/asset-cleaner',
        'editor-tools/quick-actions',
        'editor-tools/binding-system',
        'editor-tools/dependency-visualizer',
        'editor-tools/performance-analyzer',
      ],
    },
    {
      type: 'category',
      label: 'Advanced Guides',
      items: [
        'advanced/custom-events',
        'advanced/custom-variables',
        'advanced/patterns',
        'advanced/performance',
        'advanced/best-practices',
      ],
    },
    {
      type: 'category',
      label: 'Examples',
      items: [
        'examples/health-system',
        'examples/inventory-system',
        'examples/ui-integration',
        'examples/state-management',
      ],
    },
    {
      type: 'category',
      label: 'API Reference',
      items: [
        'api/overview',
        'api/variables',
        'api/events',
        'api/editor-tools',
      ],
    },
    'migration'
  ],
};

export default sidebars;
