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
        color: 'primary',
      },
      {
        title: 'Release',
        time: 'Pending',
        description: 'Waiting QA sign-off',
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
  },
});
