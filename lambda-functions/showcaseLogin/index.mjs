import AWS from 'aws-sdk';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = 'Users';
const JWT_SECRET = 'your_jwt_secret'; // Use environment variables for secrets

export const handler = async (event) => {
  const { username, password } = JSON.parse(event.body); // Use 'username' instead of 'email'

  // Fetch user from DynamoDB
  const params = {
    TableName: TABLE_NAME,
    Key: { username }, // Match the primary key in the table
  };

  try {
    const result = await dynamoDB.get(params).promise();
    const user = result.Item;

    if (!user) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'User not found' }),
      };
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: 'Invalid credentials' }),
      };
    }

    // Generate JWT
    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });
    return {
      statusCode: 200,
      body: JSON.stringify({ token }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error logging in' }),
    };
  }
};