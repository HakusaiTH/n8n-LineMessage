import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeOperationError,
  NodeConnectionType,
} from 'n8n-workflow';

export class LineSendLocation implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'LINE Send Location',
    name: 'lineSendLocation',
    icon: 'file:line.svg',
    group: ['transform'],
    version: 1,
    description: 'Send location message via LINE',
    defaults: { name: 'Send Location' },
    inputs: [NodeConnectionType.Main],
    outputs: [NodeConnectionType.Main],
    credentials: [{ name: 'lineApi', required: true }],
    properties: [
      {
        displayName: 'Title',
        name: 'title',
        type: 'string',
        default: '',
        required: true,
        description: 'Title for the location (e.g., "Office")',
      },
      {
        displayName: 'Address',
        name: 'address',
        type: 'string',
        default: '',
        required: true,
        description: 'Address to show (e.g., "Bangkok, Thailand")',
      },
      {
        displayName: 'Latitude',
        name: 'latitude',
        type: 'number',
        default: 13.7563,
        required: true,
      },
      {
        displayName: 'Longitude',
        name: 'longitude',
        type: 'number',
        default: 100.5018,
        required: true,
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const cred = await this.getCredentials('lineApi') as { accessToken: string; userId: string };

    const title = this.getNodeParameter('title', 0) as string;
    const address = this.getNodeParameter('address', 0) as string;
    const latitude = this.getNodeParameter('latitude', 0) as number;
    const longitude = this.getNodeParameter('longitude', 0) as number;

    const payload = {
      to: cred.userId,
      messages: [
        {
          type: 'location',
          title,
          address,
          latitude,
          longitude,
        },
      ],
    };

    try {
      const response = await this.helpers.httpRequest({
        method: 'POST',
        url: 'https://api.line.me/v2/bot/message/push',
        headers: {
          Authorization: `Bearer ${cred.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: payload,
        json: true,
      });

      return this.prepareOutputData([{ json: { response } }]);
    } catch (error) {
      throw new NodeOperationError(this.getNode(), error);
    }
  }
}
