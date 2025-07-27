import {
  IExecuteFunctions, INodeType, INodeTypeDescription, INodeExecutionData, NodeOperationError, NodeConnectionType,
} from 'n8n-workflow';

export class LineSendText implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'LINE Send Text',
    name: 'lineSendText',
    icon: 'file:line.svg',
    group: ['transform'],
    version: 1,
    description: 'Send text message via LINE',
    defaults: { name: 'Send Text' },
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
        displayName: 'Text',
        name: 'text',
        type: 'string',
        default: '',
        description: 'ข้อความที่ต้องการส่ง',
        required: true,
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const credentials = await this.getCredentials('lineApi') as { accessToken: string };
    const accessToken = credentials.accessToken;
    const text = this.getNodeParameter('text', 0) as string;
    const userId = this.getNodeParameter('userId', 0) as string;

    const payload = {
      to: userId,
      messages: [{ type: 'text', text }],
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
