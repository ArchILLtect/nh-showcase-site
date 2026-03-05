import AWS from "aws-sdk";
import bcrypt from "bcryptjs";

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = "Users";

export const handler = async (event) => {
  const { username, password, email } = JSON.parse(event.body);

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Save the user to DynamoDB
  const putParams = {
    TableName: TABLE_NAME,
    Item: {
      username,
      password: hashedPassword,
      email,
      createdAt: new Date().toISOString(),
    },
  };

  try {
    await dynamoDB.put(putParams).promise();
    return {
      statusCode: 201,
      body: JSON.stringify({ message: "User registered successfully" }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error registering user" }),
    };
  }
};