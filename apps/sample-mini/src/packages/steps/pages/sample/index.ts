Page({
  data: {
    checkoutSteps: [
      { title: 'Address', description: 'Fill shipping info' },
      { title: 'Payment', description: 'Confirm card details' },
      { title: 'Done', description: 'Order created' },
    ],
    issueSteps: [
      { title: 'Create ticket', description: 'Submit detail', status: 'finish' },
      { title: 'Assign owner', description: 'Waiting owner', status: 'error' },
      { title: 'Fix & verify', description: 'Pending' },
    ],
  },
});
