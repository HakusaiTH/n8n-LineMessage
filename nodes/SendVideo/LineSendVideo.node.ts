import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeOperationError,
  NodeConnectionType,
} from 'n8n-workflow';

export class LineSendVideo implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'LINE Send Video',
    name: 'lineSendVideo',
    icon: 'file:line.svg',
    group: ['transform'],
    version: 1,
    description: 'Send video message via LINE',
    defaults: { name: 'Send Video' },
    inputs: [NodeConnectionType.Main],
    outputs: [NodeConnectionType.Main],
    credentials: [{ name: 'lineApi', required: true }],
    properties: [
      {
        displayName: 'Video URL',
        name: 'originalContentUrl',
        type: 'string',
        default: '',
        description: 'URL of the video file (must be HTTPS)',
        required: true,
      },
      {
        displayName: 'Preview Image URL',
        name: 'previewImageUrl',
        type: 'string',
        default: '',
        description: 'URL of the preview image (must be HTTPS)',
        required: true,
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const cred = await this.getCredentials('lineApi') as { accessToken: string; userId: string };
    const originalContentUrl = this.getNodeParameter('originalContentUrl', 0) as string;
    const previewImageUrl = this.getNodeParameter('previewImageUrl', 0) as string;

    const payload = {
      to: cred.userId,
      messages: [
        {
          type: 'video',
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
