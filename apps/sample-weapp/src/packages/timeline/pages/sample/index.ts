import { attachSampleTone, detachSampleTone } from '../../../../shared/sample-theme-page';
import type { SampleTone } from '../../../../shared/sample-theme';

Page({
  data: {
    tone: 'default' as SampleTone,
    productTimeline: [
      {
        title: 'Kickoff',
        time: '09:00',
        description: 'Align scope with product and design',
        icon: 'icon-[mingcute--check-line]',
        color: 'success',
      },
      {
        title: 'Implementation',
        time: '10:20',
        description: 'Build core components',
        icon: 'icon-[mingcute--settings-3-line]',
        color: 'primary',
      },
      {
        title: 'Release',
        time: 'Pending',
        description: 'Waiting QA sign-off',
        icon: 'icon-[mingcute--more-1-line]',
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
        icon: 'icon-[mingcute--dot-line]',
      },
      {
        title: 'Primary Icon',
        time: '09:30',
        description: 'Custom icon on primary node',
        icon: 'icon-[mingcute--information-line]',
        color: 'primary',
      },
      {
        title: 'Warning Icon',
        time: '10:00',
        description: 'Custom icon on warning node',
        icon: 'icon-[mingcute--warning-line]',
        color: 'warning',
      },
      {
        title: 'Danger Icon',
        time: '10:30',
        description: 'Custom icon on danger node',
        icon: 'icon-[mingcute--close-line]',
        color: 'danger',
      },
    ],
  },

  _unsubscribeTone: null as null | (() => void),

  applyTone(tone: SampleTone) {
    this.setData({ tone });
  },

  onLoad() {
    attachSampleTone(this);
  },

  onUnload() {
    detachSampleTone(this);
  },
});
