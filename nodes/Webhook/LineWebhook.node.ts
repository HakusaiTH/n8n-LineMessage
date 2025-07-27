import {
  IWebhookFunctions,
  IHookFunctions,
  INodeType,
  INodeTypeDescription,
  NodeConnectionType,
} from 'n8n-workflow';

export class LineWebhook implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'LINE Webhook',
    name: 'lineWebhook',
    icon: 'file:line.svg',
    group: ['trigger'],
    version: 1,
    description: 'Receive webhook events from LINE Messaging API',
    defaults: {
      name: 'LINE Webhook',
    },
    inputs: [],
    outputs: [NodeConnectionType.Main],
    webhooks: [
      {
        name: 'default',
        httpMethod: 'POST',
        path: 'webhook',
      },
    ],
    properties: [
      // เพิ่ม properties เช่น secret validation ได้ที่นี่
    ],
  };

  webhookMethods = {
    default: {
      checkExists: async function(this: IHookFunctions): Promise<boolean> {
        // อนุญาตทุก request ให้ผ่าน
        return true;
      },
      create: async function(this: IHookFunctions): Promise<boolean> {
        return true;
      },
      delete: async function(this: IHookFunctions): Promise<boolean> {
        return true;
      },
    },
  };

  async webhook(this: IWebhookFunctions) {
    const body = this.getBodyData();
    const events = Array.isArray(body.events) ? body.events : [];

    return {
      workflowData: [this.helpers.returnJsonArray(events.length ? events : [{ message: 'no events' }])],
    };
  }
}
