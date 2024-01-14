import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDBClient, GetItemCommand, ReturnConsumedCapacity } from '@aws-sdk/client-dynamodb';

const dynamodbClient = new DynamoDBClient();
const tableName = process.env.CUSTOMER_TABLE!;

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  let response: APIGatewayProxyResult;
  try {

    const id = event.pathParameters?.id;

    if (!id) {
      throw new Error('Id must be informed.');
    }

    const input = {
      "Key": {
        "id": {
          "S": id
        }
      },
      "ReturnConsumedCapacity": ReturnConsumedCapacity.TOTAL,
      "TableName": tableName
    };

    const command = new GetItemCommand(input);
    const responseCommand = await dynamodbClient.send(command);
    
    console.log(responseCommand.ConsumedCapacity);

    response = {
      statusCode: 200,
      body: JSON.stringify(responseCommand.Item),
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
