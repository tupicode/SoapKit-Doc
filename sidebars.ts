import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docsSidebar: [
    // Start Here
    'overview',
    'getting-started',
    
    // Foundation Knowledge
    {
      type: 'category',
      label: '🎯 Core Concepts',
      items: [
        'core-systems/events',
        'core-systems/variables',
        'core-systems/quick-guide',
      ],
    },
    
    // Power User Tools
    {
      type: 'category',
      label: '🔧 Editor Tools',
      items: [
        'editor-tools/debug-window',
        'editor-tools/asset-creator',
        'editor-tools/dependency-visualizer',
        'editor-tools/performance-analyzer',
        'editor-tools/binding-system',
        'editor-tools/asset-cleaner',
        'editor-tools/quick-actions',
        'editor-tools/settings-window',
      ],
    },
    
    // Mastery Level
    {
      type: 'category',
      label: '🚀 Advanced Topics',
      items: [
        'advanced/custom-events',
        'advanced/custom-variables',
        'advanced/patterns',
        'advanced/performance',
        'advanced/best-practices',
      ],
    },
    
    // Hands-On Learning
    {
      type: 'category',
      label: '🛠️ Building Systems',
      items: [
        'examples/health-system',
        'examples/inventory-system',
        'examples/ui-integration',
        'examples/state-management',
      ],
    },
    
    // Reference
    {
      type: 'category',
      label: '📚 Reference',
      items: [
        'api/overview',
        'api/variables',
        'api/events',
        'api/editor-tools',
        'migration',
      ],
    },
  ],
};

export default sidebars;
