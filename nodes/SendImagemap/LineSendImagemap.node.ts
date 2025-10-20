import {
  IExecuteFunctions, INodeExecutionData, INodeType, INodeTypeDescription, NodeOperationError, NodeConnectionType, IHttpRequestMethods, IHttpRequestOptions,
} from 'n8n-workflow';

export class LineSendImagemap implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'LINE Send Imagemap',
    name: 'lineSendImagemap',
    icon: 'file:line.svg',
    group: ['transform'],
    version: 1,
    description: 'Send an imagemap message via LINE',
    defaults: { name: 'Send Imagemap' },
    inputs: [NodeConnectionType.Main],
    outputs: [NodeConnectionType.Main],
    credentials: [{ name: 'lineApi', required: true }],
    properties: [
      { displayName: 'User ID', name: 'userId', type: 'string', default: '', placeholder: 'e.g. Uxxxxxxxx…', description: 'LINE user ID to push the message to', required: true },
      { displayName: 'Base URL', name: 'baseUrl', type: 'string', default: '', placeholder: 'e.g. https://example.com/image', description: 'Base URL of the imagemap image without the file extension', required: true },
      { displayName: 'Alt Text', name: 'altText', type: 'string', default: 'This is an imagemap', description: 'Alternate text for the imagemap', required: true },
      { displayName: 'Width', name: 'width', type: 'number', default: 1040, required: true },
      { displayName: 'Height', name: 'height', type: 'number', default: 1040, required: true },
      { displayName: 'Link URI', name: 'linkUri', type: 'string', default: 'https://example.com', description: 'URI to open when the imagemap is tapped', required: true },
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
        const baseUrl = this.getNodeParameter('baseUrl', i) as string;
        const altText = this.getNodeParameter('altText', i) as string;
        const width = this.getNodeParameter('width', i) as number;
        const height = this.getNodeParameter('height', i) as number;
        const linkUri = this.getNodeParameter('linkUri', i) as string;
        const simplify = this.getNodeParameter('simplify', i) as boolean;
        const { timeout = 15000 } = (this.getNodeParameter('options', i, {}) as { timeout?: number });

        const payload = {
          to: userId,
          messages: [{
            type: 'imagemap',
            baseUrl,
            altText,
            baseSize: { width, height },
            actions: [{ type: 'uri', linkUri, area: { x: 0, y: 0, width, height } }],
          }],
        };

        const req: IHttpRequestOptions = { method: 'POST' as IHttpRequestMethods, url, json: true, body: payload, timeout };
        const res = await this.helpers.httpRequestWithAuthentication.call(this, 'lineApi', req);

        out.push({ json: simplify ? { pushed: true, to: userId, type: 'imagemap' } : { response: res, sentPayload: payload }, pairedItem: { item: i } });
      } catch (err) {
        const hint = 'Base URL must be without file extension and public over HTTPS';
        if (this.continueOnFail()) { out.push({ json: { message: (err as any)?.message, hint }, pairedItem: { item: i } }); continue; }
        throw new NodeOperationError(this.getNode(), `${(err as any)?.message}\n${hint}`, { itemIndex: i });
      }
    }

    return [out];
  }
}
