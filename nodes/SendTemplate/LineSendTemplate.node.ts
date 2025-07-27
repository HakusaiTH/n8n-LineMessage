import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeOperationError,
  NodeConnectionType,
} from 'n8n-workflow';

export class LineSendTemplate implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'LINE Send Template',
    name: 'lineSendTemplate',
    icon: 'file:line.svg',
    group: ['transform'],
    version: 1,
    description: 'Send template message via LINE',
    defaults: { name: 'Send Template' },
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
        description: 'LINE user ID to send the template message to',
      },
      {
        displayName: 'Title',
        name: 'title',
        type: 'string',
        default: 'เมนูหลัก',
        required: true,
      },
      {
        displayName: 'Text',
        name: 'text',
        type: 'string',
        default: 'เลือกหนึ่งตัวเลือกด้านล่าง:',
        required: true,
      },
      {
        displayName: 'Thumbnail Image URL',
        name: 'thumbnailImageUrl',
        type: 'string',
        default: '',
        required: true,
      },
      {
        displayName: 'Actions',
        name: 'actions',
        type: 'fixedCollection',
        typeOptions: {
          multipleValues: true,
        },
        default: [],
        options: [
          {
            name: 'action',
            displayName: 'Action',
            values: [
              {
                displayName: 'Type',
                name: 'type',
                type: 'options',
                options: [
                  { name: 'Message', value: 'message' },
                  { name: 'Postback', value: 'postback' },
                  { name: 'URI', value: 'uri' },
                ],
                default: 'message',
              },
              {
                displayName: 'Label',
                name: 'label',
                type: 'string',
                default: '',
              },
              {
                displayName: 'Text / Data / URI',
                name: 'value',
                type: 'string',
                default: '',
              },
            ],
          },
        ],
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const cred = await this.getCredentials('lineApi') as { accessToken: string };

    const userId = this.getNodeParameter('userId', 0) as string;
    const title = this.getNodeParameter('title', 0) as string;
    const text = this.getNodeParameter('text', 0) as string;
    const thumbnailImageUrl = this.getNodeParameter('thumbnailImageUrl', 0) as string;
    const actionsInput = this.getNodeParameter('actions', 0) as {
      action: Array<{ type: string; label: string; value: string }>;
    };

    const actions = actionsInput.action.map((a) => {
      if (a.type === 'message') {
        return { type: 'message', label: a.label, text: a.value };
      } else if (a.type === 'postback') {
        return { type: 'postback', label: a.label, data: a.value };
      } else if (a.type === 'uri') {
        return { type: 'uri', label: a.label, uri: a.value };
      } else {
        return { type: a.type, label: a.label, value: a.value };
      }
    });

    const payload = {
      to: userId,
      messages: [
        {
          type: 'template',
          altText: title,
          template: {
            type: 'buttons',
            thumbnailImageUrl,
            title,
            text,
            actions,
          },
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
