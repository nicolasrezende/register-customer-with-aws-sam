import { APIGatewayProxyResult } from 'aws-lambda';
import { expect, describe, it } from '@jest/globals';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { handler } from '../../handlers/getAllCustomer';
import { Customer } from '../../model/Customer';
import { spyOn } from 'jest-mock';
import event from '../../../events/event.json';

describe('Unit test for getAllCustomer handler', function () {

  it('should get all customers from the table', async () => {

    const items: Customer[] = [{
      id: '1234',
      name: 'Teste',
      address: 'Rua X',
      phone: '12345678'
    },
    {
      id: '12345',
      name: 'Teste 1',
      address: 'Rua Y',
      phone: '123456789'
    }];

    const scanSpy = spyOn(DynamoDBClient.prototype, "send");

    scanSpy.mockResolvedValueOnce({ Count: 2, Items: items } as never);

    const result: APIGatewayProxyResult = await handler(event);

    expect(result.statusCode).toEqual(200);
    expect(result.body).toEqual(
      JSON.stringify({
        count: 2,
        items
      }),
    );
  });
});
