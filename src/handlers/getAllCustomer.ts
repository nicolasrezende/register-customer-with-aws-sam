import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDBClient, ScanCommand } from '@aws-sdk/client-dynamodb';

const dynamodbClient = new DynamoDBClient();
const tableName = process.env.CUSTOMER_TABLE!;

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  let response: APIGatewayProxyResult;
  try {

    const input = {
      "TableName": tableName
    };

    const command = new ScanCommand(input);
    const responseCommand = await dynamodbClient.send(command);

    console.log(responseCommand.ConsumedCapacity);

    response = {
      statusCode: 200,
      body: JSON.stringify({
        count: responseCommand.Count ?? 0,
        items: responseCommand.Items ?? []
      }),
    };
  } catch (err: unknown) {
    console.error(err);
    response = {
      statusCode: 500,
      body: JSON.stringify({
        message: err instanceof Error ? err.message : 'some error happened',
      }),
    };
  }

  return response;
};
