/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  tutorialSidebar: [
    'intro',
    {
      type: 'category',
      label: 'Start Here',
      items: ['tutorials/getting-started', 'tutorials/how-mouse-wind-becomes-physics'],
    },
    {
      type: 'category',
      label: 'Architecture',
      items: ['architecture/rendering-pipeline'],
    },
    {
      type: 'category',
      label: 'Operations',
      items: ['operations/logging-and-observability'],
    },
    {
      type: 'category',
      label: 'Reference',
      items: ['reference/external-libraries'],
    },
    {
      type: 'category',
      label: 'Governance',
      items: ['governance/github-setup'],
    },
  ],
};

export default sidebars;
