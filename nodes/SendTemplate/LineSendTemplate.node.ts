import {
  IExecuteFunctions, INodeExecutionData, INodeType, INodeTypeDescription, NodeOperationError, NodeConnectionType, IHttpRequestMethods, IHttpRequestOptions,
} from 'n8n-workflow';

type ActionInput = { type: 'message' | 'postback' | 'uri'; label: string; value: string };

export class LineSendTemplate implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'LINE Send Template',
    name: 'lineSendTemplate',
    icon: 'file:line.svg',
    group: ['transform'],
    version: 1,
    description: 'Send a template message via LINE',
    defaults: { name: 'Send Template' },
    inputs: [NodeConnectionType.Main],
    outputs: [NodeConnectionType.Main],
    credentials: [{ name: 'lineApi', required: true }],
    properties: [
      { displayName: 'User ID', name: 'userId', type: 'string', default: '', placeholder: 'e.g. Uxxxxxxxx…', description: 'LINE user ID to push the message to', required: true },
      { displayName: 'Title', name: 'title', type: 'string', default: 'Main menu', description: 'Template title', required: true },
      { displayName: 'Text', name: 'text', type: 'string', default: 'Select one option below', description: 'Template text', required: true },
      { displayName: 'Thumbnail Image URL', name: 'thumbnailImageUrl', type: 'string', default: '', placeholder: 'e.g. https://example.com/thumbnail.jpg', description: 'HTTPS URL of the template thumbnail image', required: true },
      {
        displayName: 'Actions',
        name: 'actions',
        type: 'fixedCollection',
        typeOptions: { multipleValues: true },
        default: [],
        options: [{
          name: 'action',
          displayName: 'Action',
          values: [
            { displayName: 'Type', name: 'type', type: 'options', options: [
              { name: 'Message', value: 'message' },
              { name: 'Postback', value: 'postback' },
              { name: 'URI', value: 'uri' },
            ], default: 'message' },
            { displayName: 'Label', name: 'label', type: 'string', default: '' },
            { displayName: 'Text / Data / URI', name: 'value', type: 'string', default: '' },
          ],
        }],
        description: 'Actions for the template',
      },
      { displayName: 'Simplify', name: 'simplify', type: 'boolean', default: true, description: 'Whether to return a simplified version of the response instead of the raw data' },
      { displayName: 'Options', name: 'options', type: 'collection', default: {}, placeholder: 'Add option', options: [{ displayName: 'Timeout', name: 'timeout', type: 'number', default: 15000, description: 'Request timeout in milliseconds' }] },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const out: INodeExecutionData[] = [];
    const url = 'https://api.line.me/v2/bot/message/push';

    for (let i = 0; i < items.length; i++) {
      try {
        const userId = this.getNodeParameter('userId', i) as string;
        const title = this.getNodeParameter('title', i) as string;
        const text = this.getNodeParameter('text', i) as string;
        const thumbnailImageUrl = this.getNodeParameter('thumbnailImageUrl', i) as string;
        const actionsInput = this.getNodeParameter('actions', i) as { action: ActionInput[] };
        const simplify = this.getNodeParameter('simplify', i) as boolean;
        const { timeout = 15000 } = (this.getNodeParameter('options', i, {}) as { timeout?: number });

        const actions = (actionsInput?.action ?? []).map((a) => {
          if (a.type === 'message') return { type: 'message', label: a.label, text: a.value };
          if (a.type === 'postback') return { type: 'postback', label: a.label, data: a.value };
          if (a.type === 'uri') return { type: 'uri', label: a.label, uri: a.value };
          return { type: a.type, label: a.label, value: a.value };
        });

        const payload = {
          to: userId,
          messages: [{ type: 'template', altText: title, template: { type: 'buttons', thumbnailImageUrl, title, text, actions } }],
        };

        const req: IHttpRequestOptions = { method: 'POST' as IHttpRequestMethods, url, json: true, body: payload, timeout };
        const res = await this.helpers.httpRequestWithAuthentication.call(this, 'lineApi', req);

        out.push({ json: simplify ? { pushed: true, to: userId, type: 'template' } : { response: res, sentPayload: payload }, pairedItem: { item: i } });
      } catch (err) {
        const hint = 'Make sure all button actions are valid and URLs are HTTPS when using URI';
        if (this.continueOnFail()) { out.push({ json: { message: (err as any)?.message, hint }, pairedItem: { item: i } }); continue; }
        throw new NodeOperationError(this.getNode(), `${(err as any)?.message}\n${hint}`, { itemIndex: i });
      }
    }

    return [out];
  }
}
