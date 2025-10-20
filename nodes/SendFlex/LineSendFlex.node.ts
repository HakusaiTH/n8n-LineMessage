import {
  IExecuteFunctions, INodeExecutionData, INodeType, INodeTypeDescription, NodeOperationError, NodeConnectionType, IHttpRequestMethods, IHttpRequestOptions,
} from 'n8n-workflow';

export class LineSendFlex implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'LINE Send Flex',
    name: 'lineSendFlex',
    icon: 'file:line.svg',
    group: ['transform'],
    version: 1,
    description: 'Send a Flex message via LINE',
    defaults: { name: 'Send Flex' },
    inputs: [NodeConnectionType.Main],
    outputs: [NodeConnectionType.Main],
    credentials: [{ name: 'lineApi', required: true }],
    properties: [
      { displayName: 'User ID', name: 'userId', type: 'string', default: '', placeholder: 'e.g. Uxxxxxxxx…', description: 'LINE user ID to push the message to', required: true },
      { displayName: 'Alt Text', name: 'altText', type: 'string', default: 'Flex message', description: 'Alternate text shown on devices that do not support Flex messages', required: true },
      { displayName: 'Flex JSON', name: 'flexJson', type: 'json', default: '', description: 'JSON structure for the Flex message as defined by LINE Messaging API', required: true },
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
        const altText = this.getNodeParameter('altText', i) as string;
        const flexJsonRaw = this.getNodeParameter('flexJson', i) as any;
        const simplify = this.getNodeParameter('simplify', i) as boolean;
        const { timeout = 15000 } = (this.getNodeParameter('options', i, {}) as { timeout?: number });

        let contents: Record<string, any>;
        try {
          contents = typeof flexJsonRaw === 'string' ? JSON.parse(flexJsonRaw) : flexJsonRaw;
        } catch {
          throw new NodeOperationError(this.getNode(), 'Invalid JSON in Flex JSON parameter', { itemIndex: i });
        }

        const payload = { to: userId, messages: [{ type: 'flex', altText, contents }] };

        const req: IHttpRequestOptions = { method: 'POST' as IHttpRequestMethods, url, json: true, body: payload, timeout };
        const res = await this.helpers.httpRequestWithAuthentication.call(this, 'lineApi', req);

        out.push({ json: simplify ? { pushed: true, to: userId, type: 'flex' } : { response: res, sentPayload: payload }, pairedItem: { item: i } });
      } catch (err) {
        const hint = 'Validate the Flex JSON structure against LINE docs';
        if (this.continueOnFail()) { out.push({ json: { message: (err as any)?.message, hint }, pairedItem: { item: i } }); continue; }
        throw new NodeOperationError(this.getNode(), `${(err as any)?.message}\n${hint}`, { itemIndex: i });
      }
    }

    return [out];
  }
}
