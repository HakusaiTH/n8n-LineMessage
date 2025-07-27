import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeOperationError,
  NodeConnectionType,
} from 'n8n-workflow';

export class LineSendImagemap implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'LINE Send Imagemap',
    name: 'lineSendImagemap',
    icon: 'file:line.svg',
    group: ['transform'],
    version: 1,
    description: 'Send imagemap message via LINE',
    defaults: { name: 'Send Imagemap' },
    inputs: [NodeConnectionType.Main],
    outputs: [NodeConnectionType.Main],
    credentials: [{ name: 'lineApi', required: true }],
    properties: [
      {
        displayName: 'User ID',
        name: 'userId',
        type: 'string',
        default: '',
        required: true,
        description: 'Target User ID for push message',
      },
      {
        displayName: 'Base URL',
        name: 'baseUrl',
        type: 'string',
        default: '',
        required: true,
        description: 'Base URL of the imagemap image (without extension)',
      },
      {
        displayName: 'Alt Text',
        name: 'altText',
        type: 'string',
        default: 'This is an imagemap',
        required: true,
      },
      {
        displayName: 'Width',
        name: 'width',
        type: 'number',
        default: 1040,
        required: true,
      },
      {
        displayName: 'Height',
        name: 'height',
        type: 'number',
        default: 1040,
        required: true,
      },
      {
        displayName: 'Link URI',
        name: 'linkUri',
        type: 'string',
        default: 'https://example.com',
        required: true,
        description: 'The URI that users will be redirected to when they tap the imagemap',
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const cred = await this.getCredentials('lineApi') as { accessToken: string };

    const userId = this.getNodeParameter('userId', 0) as string;
    const baseUrl = this.getNodeParameter('baseUrl', 0) as string;
    const altText = this.getNodeParameter('altText', 0) as string;
    const width = this.getNodeParameter('width', 0) as number;
    const height = this.getNodeParameter('height', 0) as number;
    const linkUri = this.getNodeParameter('linkUri', 0) as string;

    const payload = {
      to: userId,
      messages: [
        {
          type: 'imagemap',
          baseUrl,
          altText,
          baseSize: {
            width,
            height,
          },
          actions: [
            {
              type: 'uri',
              linkUri,
              area: {
                x: 0,
                y: 0,
                width,
                height,
              },
            },
          ],
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
