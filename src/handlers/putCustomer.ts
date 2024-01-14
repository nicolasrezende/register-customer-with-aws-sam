import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDBClient, PutItemCommand, ReturnConsumedCapacity } from '@aws-sdk/client-dynamodb';
import { v4 as uuidv4} from 'uuid';
import { Customer } from '../model/Customer';

const dynamodbClient = new DynamoDBClient();
const tableName = process.env.CUSTOMER_TABLE!;

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  let response: APIGatewayProxyResult;

  try {

    const customer = JSON.parse(event.body!) as Customer;

    const id = customer.id ?? uuidv4();
    
    const input = {
      "Item": {
        "id": {
          "S": id
        },
        "name": {
          "S": customer.name
        },
        "phone": {
          "S": customer.phone
        },
        "address": {
          "S": customer.address
        },
      },
      "ReturnConsumedCapacity": ReturnConsumedCapacity.TOTAL,
      "TableName": tableName
    };

    const command = new PutItemCommand(input);
    const responseCommand = await dynamodbClient.send(command);
    console.log(responseCommand);

    response = {
      statusCode: 200,
      body: JSON.stringify({
        id,
        message: 'Customer successfully registered or updated.'
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
