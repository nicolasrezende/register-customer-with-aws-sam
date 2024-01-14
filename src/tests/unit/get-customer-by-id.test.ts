import { APIGatewayProxyResult } from 'aws-lambda';
import { expect, describe, it } from '@jest/globals';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { handler } from '../../handlers/getCustomerById';
import { Customer } from '../../model/Customer';
import { spyOn } from 'jest-mock';
import event from '../../../events/event.json';

describe('Unit test for getCustomerById handler', function () {

  it('should get customer by id from the table', async () => {

    const item: Customer = {
      id: '1234',
      name: 'Teste',
      address: 'Rua X',
      phone: '12345678'
    };

    event.pathParameters['id'] = '1234'

    const scanSpy = spyOn(DynamoDBClient.prototype, "send");

    scanSpy.mockResolvedValueOnce({ Item: item } as never);

    const result: APIGatewayProxyResult = await handler(event);

    expect(result.statusCode).toEqual(200);
    expect(result.body).toEqual(
      JSON.stringify(item),
    );
  });
});
