import {
  IExecuteFunctions, INodeExecutionData, INodeType, INodeTypeDescription, NodeOperationError, NodeConnectionType, IHttpRequestMethods, IHttpRequestOptions,
} from 'n8n-workflow';

export class LineSendVideo implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'LINE Send Video',
    name: 'lineSendVideo',
    icon: 'file:line.svg',
    group: ['transform'],
    version: 1,
    description: 'Send a video message via LINE',
    defaults: { name: 'Send Video' },
    inputs: [NodeConnectionType.Main],
    outputs: [NodeConnectionType.Main],
    credentials: [{ name: 'lineApi', required: true }],
    properties: [
      { displayName: 'User ID', name: 'userId', type: 'string', default: '', placeholder: 'e.g. Uxxxxxxxx…', description: 'LINE user ID to push the message to', required: true },
      { displayName: 'Video URL', name: 'originalContentUrl', type: 'string', default: '', placeholder: 'e.g. https://example.com/video.mp4', description: 'HTTPS URL of the video file', required: true },
      { displayName: 'Preview Image URL', name: 'previewImageUrl', type: 'string', default: '', placeholder: 'e.g. https://example.com/preview.jpg', description: 'HTTPS URL of the preview image', required: true },
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
        const previewImageUrl = this.getNodeParameter('previewImageUrl', i) as string;
        const simplify = this.getNodeParameter('simplify', i) as boolean;
        const { timeout = 15000 } = (this.getNodeParameter('options', i, {}) as { timeout?: number });

        const payload = { to: userId, messages: [{ type: 'video', originalContentUrl, previewImageUrl }] };

        const req: IHttpRequestOptions = { method: 'POST' as IHttpRequestMethods, url, json: true, body: payload, timeout };
        const res = await this.helpers.httpRequestWithAuthentication.call(this, 'lineApi', req);

        out.push({ json: simplify ? { pushed: true, to: userId, type: 'video' } : { response: res, sentPayload: payload }, pairedItem: { item: i } });
      } catch (err) {
        const hint = 'Ensure both video and preview URLs are HTTPS and accessible';
        if (this.continueOnFail()) { out.push({ json: { message: (err as any)?.message, hint }, pairedItem: { item: i } }); continue; }
        throw new NodeOperationError(this.getNode(), `${(err as any)?.message}\n${hint}`, { itemIndex: i });
      }
    }

    return [out];
  }
}
