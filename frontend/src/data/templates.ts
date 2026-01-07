export const surveyTemplates = [
  {
    id: 'customer-satisfaction',
    name: 'Customer Satisfaction',
    description: 'Measure customer satisfaction with your products or services',
    icon: '😊',
    questions: [
      {
        text: 'How satisfied are you with our service?',
        type: 'multiple-choice',
        options: ['Very Satisfied', 'Satisfied', 'Neutral', 'Dissatisfied', 'Very Dissatisfied'],
        required: true
      },
      {
        text: 'How likely are you to recommend us to others?',
        type: 'multiple-choice',
        options: ['Very Likely', 'Likely', 'Neutral', 'Unlikely', 'Very Unlikely'],
        required: true
      },
      {
        text: 'What can we improve?',
        type: 'short-answer',
        required: false
      }
    ]
  },
  {
    id: 'employee-feedback',
    name: 'Employee Feedback',
    description: 'Gather feedback from your team members',
    icon: '👥',
    questions: [
      {
        text: 'How would you rate your work-life balance?',
        type: 'multiple-choice',
        options: ['Excellent', 'Good', 'Fair', 'Poor'],
        required: true
      },
      {
        text: 'Do you feel valued at work?',
        type: 'multiple-choice',
        options: ['Always', 'Often', 'Sometimes', 'Rarely', 'Never'],
        required: true
      },
      {
        text: 'Any suggestions for improvement?',
        type: 'short-answer',
        required: false
      }
    ]
  },
  {
    id: 'event-evaluation',
    name: 'Event Evaluation',
    description: 'Collect feedback about your events',
    icon: '🎉',
    questions: [
      {
        text: 'How would you rate the overall event?',
        type: 'multiple-choice',
        options: ['Excellent', 'Very Good', 'Good', 'Fair', 'Poor'],
        required: true
      },
      {
        text: 'Which session did you find most valuable?',
        type: 'short-answer',
        required: false
      },
      {
        text: 'Would you attend future events?',
        type: 'multiple-choice',
        options: ['Definitely', 'Probably', 'Maybe', 'Probably Not', 'Definitely Not'],
        required: true
      }
    ]
  }
];