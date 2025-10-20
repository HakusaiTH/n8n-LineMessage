import {
  IExecuteFunctions, INodeExecutionData, INodeType, INodeTypeDescription, NodeOperationError, NodeConnectionType, IHttpRequestMethods, IHttpRequestOptions,
} from 'n8n-workflow';

export class LineSendAudio implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'LINE Send Audio',
    name: 'lineSendAudio',
    icon: 'file:line.svg',
    group: ['transform'],
    version: 1,
    description: 'Send an audio message via LINE',
    defaults: { name: 'Send Audio' },
    inputs: [NodeConnectionType.Main],
    outputs: [NodeConnectionType.Main],
    credentials: [{ name: 'lineApi', required: true }],
    properties: [
      { displayName: 'User ID', name: 'userId', type: 'string', default: '', placeholder: 'e.g. Uxxxxxxxx…', description: 'LINE user ID to push the message to', required: true },
      { displayName: 'Audio URL', name: 'originalContentUrl', type: 'string', default: '', placeholder: 'e.g. https://example.com/audio.m4a', description: 'HTTPS URL of the audio file', required: true },
      { displayName: 'Duration', name: 'duration', type: 'number', default: 2000, description: 'Audio length in milliseconds', required: true },
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
        const originalContentUrl = this.getNodeParameter('originalContentUrl', i) as string;
        const duration = this.getNodeParameter('duration', i) as number;
        const simplify = this.getNodeParameter('simplify', i) as boolean;
        const { timeout = 15000 } = (this.getNodeParameter('options', i, {}) as { timeout?: number });

        const payload = { to: userId, messages: [{ type: 'audio', originalContentUrl, duration }] };

        const req: IHttpRequestOptions = { method: 'POST' as IHttpRequestMethods, url, json: true, body: payload, timeout };
        const res = await this.helpers.httpRequestWithAuthentication.call(this, 'lineApi', req);

        out.push({ json: simplify ? { pushed: true, to: userId, type: 'audio' } : { response: res, sentPayload: payload }, pairedItem: { item: i } });
      } catch (err) {
        const hint = 'Ensure audio URL is HTTPS and the duration matches the media length';
        if (this.continueOnFail()) { out.push({ json: { message: (err as any)?.message, hint }, pairedItem: { item: i } }); continue; }
        throw new NodeOperationError(this.getNode(), `${(err as any)?.message}\n${hint}`, { itemIndex: i });
      }
    }

    return [out];
  }
}
