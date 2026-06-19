export const USERS = [
  {
    id: 1,
    email: 'nishan@gmail.com',
    password: 'nishan123',
    name: 'Nishan Shrestha',
  },
  {
    id: 2,
    email: 'shrestha@gmail.com',
    password: 'shrestha123',
    name: 'Ram Thapa',
  },
];

export const INITIAL_TASKS = [
  {
    id: 1,
    title: 'Design new landing page',
    description:
      'Create wireframes and high-fidelity mockups for the marketing site redesign.',
    status: 'in-progress',
    priority: 'high',
    dueDate: '2026-07-10',
    assignee: 'Nishan Shrestha',
    tags: ['design', 'marketing'],
    createdAt: '2026-06-01',
  },
  {
    id: 2,
    title: 'Fix auth token refresh bug',
    description:
      'Users are being logged out unexpectedly. Investigate token refresh logic.',
    status: 'todo',
    priority: 'high',
    dueDate: '2026-06-25',
    assignee: 'Ram Thapa',
    tags: ['bug', 'auth'],
    createdAt: '2026-06-05',
  },
  {
    id: 3,
    title: 'Write API documentation',
    description:
      'Document all REST endpoints with examples using OpenAPI spec.',
    status: 'todo',
    priority: 'medium',
    dueDate: '2026-07-15',
    assignee: 'Nishan Shrestha',
    tags: ['docs'],
    createdAt: '2026-06-08',
  },
  {
    id: 4,
    title: 'Set up CI/CD pipeline',
    description:
      'Configure GitHub Actions for automated testing and deployment to staging.',
    status: 'done',
    priority: 'medium',
    dueDate: '2026-06-20',
    assignee: 'Ram Thapa',
    tags: ['devops'],
    createdAt: '2026-06-02',
  },
  {
    id: 5,
    title: 'User onboarding flow',
    description:
      'Implement step-by-step onboarding for new users after signup.',
    status: 'in-progress',
    priority: 'low',
    dueDate: '2026-07-20',
    assignee: 'Nishan Shrestha',
    tags: ['ux', 'feature'],
    createdAt: '2026-06-10',
  },
  {
    id: 6,
    title: 'Performance audit',
    description:
      'Run Lighthouse audits and optimize bundle size, image loading, and TTI.',
    status: 'todo',
    priority: 'low',
    dueDate: '2026-07-30',
    assignee: 'Ram Thapa',
    tags: ['performance'],
    createdAt: '2026-06-12',
  },
];
