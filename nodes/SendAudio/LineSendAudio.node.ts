import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeOperationError,
  NodeConnectionType,
} from 'n8n-workflow';

export class LineSendAudio implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'LINE Send Audio',
    name: 'lineSendAudio',
    icon: 'file:line.svg',
    group: ['transform'],
    version: 1,
    description: 'Send audio message via LINE',
    defaults: { name: 'Send Audio' },
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
        displayName: 'Audio URL',
        name: 'originalContentUrl',
        type: 'string',
        default: '',
        description: 'URL of the audio file (must be HTTPS)',
        required: true,
      },
      {
        displayName: 'Duration (MS)',
        name: 'duration',
        type: 'number',
        default: 2000,
        description: 'Length of audio in milliseconds (e.g. 2000 = 2 seconds)',
        required: true,
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const credentials = await this.getCredentials('lineApi') as { accessToken: string };
    const accessToken = credentials.accessToken;

    const userId = this.getNodeParameter('userId', 0) as string;
    const originalContentUrl = this.getNodeParameter('originalContentUrl', 0) as string;
    const duration = this.getNodeParameter('duration', 0) as number;

    const payload = {
      to: userId,
      messages: [
        {
          type: 'audio',
          originalContentUrl,
          duration,
        },
      ],
    };

    try {
      const response = await this.helpers.httpRequest({
        method: 'POST',
        url: 'https://api.line.me/v2/bot/message/push',
        headers: {
          Authorization: `Bearer ${accessToken}`,
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
