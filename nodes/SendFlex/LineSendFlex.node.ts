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
        displayName: 'Alt Text',
        name: 'altText',
        type: 'string',
        default: 'ข้อความ Flex',
        description: 'ข้อความสำรองเมื่ออุปกรณ์ไม่รองรับ Flex',
        required: true,
      },
      {
        displayName: 'Flex JSON',
        name: 'flexJson',
        type: 'json',
        default: '',
        description: 'โครงสร้าง JSON สำหรับ Flex message ตาม LINE Messaging API',
        required: true,
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const cred = await this.getCredentials('lineApi') as { accessToken: string; userId: string };
    const altText = this.getNodeParameter('altText', 0) as string;
    const flexJson = this.getNodeParameter('flexJson', 0) as object;

    const payload = {
      to: cred.userId,
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
