name: Question
description: Ask a question about using date-wiz
labels: ['question']
body:

- type: markdown
  attributes:
  value: |
  Have a question? We're here to help!

      **Note:** For general questions, consider [opening a Discussion](https://github.com/GourangaDasSamrat/date-wiz/discussions) first.

- type: input
  id: version
  attributes:
  label: date-wiz version
  placeholder: '1.0.0'
  validations:
  required: true

- type: textarea
  id: question
  attributes:
  label: Your question
  description: 'What would you like to know?'
  placeholder: 'How do I... ? What is the best way to...?'
  validations:
  required: true

- type: textarea
  id: code_example
  attributes:
  label: Code example (if applicable)
  description: 'Show what you've tried'
  render: typescript
  placeholder: |
  import { wiz } from 'date-wiz';

      const date = wiz(new Date());
      // What I've tried...

- type: textarea
  id: context
  attributes:
  label: Additional context
  description: 'Anything else that might help us answer your question?'

- type: checkboxes
  id: checklist
  attributes:
  label: Verification
  options: - label: I have checked the [documentation](https://GourangaDasSamrat.github.io/date-wiz-docs)
  required: true - label: I have searched existing issues and discussions
  required: true
