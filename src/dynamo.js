// src/dynamo.js

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  ScanCommand,
  PutCommand,
  UpdateCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";

// ✅ 1. Set up AWS DynamoDB client
const client = new DynamoDBClient({
  region: process.env.REACT_APP_AWS_REGION,
  credentials: {
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
  },
});

const docClient = DynamoDBDocumentClient.from(client);

// ✅ 2. Scan (fetch) all todos
export async function scanTodos() {
  const { Items } = await docClient.send(
    new ScanCommand({ TableName: "Todo" })
  );
  return Items || [];
}

// ✅ 3. Create a new todo
export async function createTodo(item) {
  console.log("Debug: item sent to DynamoDB:", item);
  await docClient.send(
    new PutCommand({ TableName: "Todo", Item: item })
  );
}

// ✅ 4. Update a todo
export async function updateTodo(id, updates) {
  const updateExpressions = [];
  const ExpressionAttributeNames = {};
  const ExpressionAttributeValues = {};

  for (const key in updates) {
    updateExpressions.push(`#${key} = :${key}`);
    ExpressionAttributeNames[`#${key}`] = key;
    ExpressionAttributeValues[`:${key}`] = updates[key];
  }

  const params = {
    TableName: "Todo",
    Key: { id },
    UpdateExpression: `SET ${updateExpressions.join(", ")}`,
    ExpressionAttributeNames,
    ExpressionAttributeValues,
  };

  await docClient.send(new UpdateCommand(params));
}

// ✅ 5. Delete a todo
export async function deleteTodo(id) {
  await docClient.send(
    new DeleteCommand({
      TableName: "Todo",
      Key: { id },
    })
  );
}
