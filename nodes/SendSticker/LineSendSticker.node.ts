import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeOperationError,
  NodeConnectionType,
} from 'n8n-workflow';

export class LineSendSticker implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'LINE Send Sticker',
    name: 'lineSendSticker',
    icon: 'file:line.svg',
    group: ['transform'],
    version: 1,
    description: 'Send sticker message via LINE',
    defaults: { name: 'Send Sticker' },
    inputs: [NodeConnectionType.Main],
    outputs: [NodeConnectionType.Main],
    credentials: [{ name: 'lineApi', required: true }],
    properties: [
      {
        displayName: 'Package ID',
        name: 'packageId',
        type: 'string',
        default: '446',
        description: 'LINE sticker package ID (e.g., 446)',
        required: true,
      },
      {
        displayName: 'Sticker ID',
        name: 'stickerId',
        type: 'string',
        default: '1988',
        description: 'LINE sticker ID (e.g., 1988)',
        required: true,
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const cred = await this.getCredentials('lineApi') as { accessToken: string; userId: string };
    const packageId = this.getNodeParameter('packageId', 0) as string;
    const stickerId = this.getNodeParameter('stickerId', 0) as string;

    const payload = {
      to: cred.userId,
      messages: [
        {
          type: 'sticker',
          packageId,
          stickerId,
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
