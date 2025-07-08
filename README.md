# Features Overview

- Day 2: Basic Create and Read
- Connect to AWS DynamoDB
- scanTodos() on mount to fetch items
- createTodo() to add new items
- Renders todos in list from DynamoDB

## Day 3: Refactor and Modularization

- Moved all AWS logic to dynamo.js
- App.js handles UI only
- Clean helper function separation
- Verified:
- .env loads AWS keys
- Todos fetch and write to DynamoDB
- Screenshot of successful table data:
- docs/demo.png

### Day 4: Update and Delete Support

- updateTodo(id, updates) → Toggles completed field
- deleteTodo(id) → Removes todo from table
- UI includes:
- Checkbox for status
- Delete button (×)
- DynamoDB table is updated live with user actions
