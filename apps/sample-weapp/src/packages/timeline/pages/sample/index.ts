Page({
  data: {
    productTimeline: [
      {
        title: 'Kickoff',
        time: '09:00',
        description: 'Align scope with product and design',
        icon: '✓',
        color: 'success',
      },
      {
        title: 'Implementation',
        time: '10:20',
        description: 'Build core components',
        icon: '⚙',
        color: 'primary',
      },
      {
        title: 'Release',
        time: 'Pending',
        description: 'Waiting QA sign-off',
        icon: '…',
        isPending: true,
      },
    ],
    dashedTimeline: [
      {
        title: 'Draft',
        time: '08:00',
        description: 'Write initial brief',
      },
      {
        title: 'Review',
        time: '09:30',
        description: 'Collect feedback',
        color: 'warning',
      },
      {
        title: 'Publish',
        time: '10:40',
        description: 'Ship docs',
        color: 'danger',
      },
    ],
    customIconTimeline: [
      {
        title: 'Default Icon',
        time: '09:00',
        description: 'Custom icon on default node',
        icon: '•',
      },
      {
        title: 'Primary Icon',
        time: '09:30',
        description: 'Custom icon on primary node',
        icon: 'i',
        color: 'primary',
      },
      {
        title: 'Warning Icon',
        time: '10:00',
        description: 'Custom icon on warning node',
        icon: '!',
        color: 'warning',
      },
      {
        title: 'Danger Icon',
        time: '10:30',
        description: 'Custom icon on danger node',
        icon: '×',
        color: 'danger',
      },
    ],
  },
});
