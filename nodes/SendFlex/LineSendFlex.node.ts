import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeOperationError,
  NodeConnectionType,
} from 'n8n-workflow';

export class LineSendFlex implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'LINE Send Flex',
    name: 'lineSendFlex',
    icon: 'file:line.svg',
    group: ['transform'],
    version: 1,
    description: 'Send Flex message via LINE',
    defaults: { name: 'Send Flex' },
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
        displayName: 'Alt Text',
        name: 'altText',
        type: 'string',
				default: 'Flex message',
				description: 'Alternate message when device does not support Flex',
        required: true,
      },
      {
        displayName: 'Flex JSON',
        name: 'flexJson',
        type: 'json',
        default: '',
				description: 'JSON structure for Flex message based on LINE Messaging API',
        required: true,
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const cred = await this.getCredentials('lineApi') as { accessToken: string };
    const accessToken = cred.accessToken;

    const userId = this.getNodeParameter('userId', 0) as string;
    const altText = this.getNodeParameter('altText', 0) as string;
    const flexJsonStr = this.getNodeParameter('flexJson', 0) as string;
    let flexJson: Record<string, any>;

    try {
      flexJson = typeof flexJsonStr === 'string' ? JSON.parse(flexJsonStr) : flexJsonStr;
    } catch (error) {
      throw new NodeOperationError(this.getNode(), 'Invalid JSON in Flex JSON parameter');
    }

    const payload = {
      to: userId,
      messages: [
        {
          type: 'flex',
          altText,
          contents: flexJson,
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

      return this.prepareOutputData([
        {
          json: {
            success: true,
            response,
            sentPayload: payload,
          },
        },
      ]);

    } catch (error) {
      throw new NodeOperationError(this.getNode(), {
        message: 'LINE API Error',
        description: (error as any)?.message || 'Unknown error',
        payloadSent: payload,
        rawError: error,
      });
    }
  }
}
