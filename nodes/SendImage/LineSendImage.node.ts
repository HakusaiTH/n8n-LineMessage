import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeOperationError,
  NodeConnectionType,
} from 'n8n-workflow';

export class LineSendImage implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'LINE Send Image',
    name: 'lineSendImage',
    icon: 'file:line.svg',
    group: ['transform'],
    version: 1,
    description: 'Send image message via LINE',
    defaults: { name: 'Send Image' },
    inputs: [NodeConnectionType.Main],
    outputs: [NodeConnectionType.Main],
    credentials: [{ name: 'lineApi', required: true }],
    properties: [
      {
        displayName: 'User ID',
        name: 'userId',
        type: 'string',
        default: '',
        description: 'Target User ID for push messages',
        required: true,
      },
      {
        displayName: 'Original Image URL',
        name: 'originalContentUrl',
        type: 'string',
        default: '',
        description: 'URL of the original image (must be HTTPS)',
        required: true,
      },
      {
        displayName: 'Preview Image URL',
        name: 'previewImageUrl',
        type: 'string',
        default: '',
        description: 'URL of the preview image (can be same as original)',
        required: true,
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const cred = await this.getCredentials('lineApi') as { accessToken: string };
    const userId = this.getNodeParameter('userId', 0) as string;
    const originalContentUrl = this.getNodeParameter('originalContentUrl', 0) as string;
    const previewImageUrl = this.getNodeParameter('previewImageUrl', 0) as string;

    const payload = {
      to: userId,
      messages: [
        {
          type: 'image',
          originalContentUrl,
          previewImageUrl,
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
