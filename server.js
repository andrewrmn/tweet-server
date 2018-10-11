var sg = require('sendgrid')(process.env.SENDGRID_API_KEY);
var request = sg.emptyRequest({
  method: 'POST',
  path: '/v3/mail/send',
  body: {
    personalizations: [
      {
        to: [
          {
            email: 'andrewross.mn@gmail.com',
          },
        ],
        subject: 'Hello World from the SendGrid Node.js Library!',
      },
    ],
    from: {
      email: 'andrewross.mn@gmail.com',
    },
    content: [
      {
        type: 'text/plain',
        value: 'Hello, Email!',
      },
    ],
  },
});
