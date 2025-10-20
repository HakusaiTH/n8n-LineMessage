import {
  ICredentialType,
  ICredentialTestRequest,
  INodeProperties,
  IAuthenticateGeneric,
} from 'n8n-workflow';

export class LineApi implements ICredentialType {
  name = 'lineApi';
  displayName = 'LINE API';
  documentationUrl = 'https://developers.line.biz/en/reference/messaging-api/';

  properties: INodeProperties[] = [
    {
      displayName: 'Channel Access Token',
      name: 'accessToken',
      type: 'string',
      default: '',
      typeOptions: { password: true },
      description: 'LINE Messaging API channel access token',
      required: true,
    },
  ];

  // ใช้ expression ต่อสตริง เพื่อกันกรณีผู้ใช้เผลอวาง "Bearer ..."
  authenticate: IAuthenticateGeneric = {
    type: 'generic',
    properties: {
      headers: {
        Authorization: '={{ $credentials.accessToken.startsWith("Bearer ") ? $credentials.accessToken : "Bearer " + $credentials.accessToken }}',
        'Content-Type': 'application/json',
      },
    },
  };

  test: ICredentialTestRequest = {
    request: {
      method: 'GET',
      url: 'https://api.line.me/v2/bot/info',
      headers: {
        Authorization: '={{ $credentials.accessToken.startsWith("Bearer ") ? $credentials.accessToken : "Bearer " + $credentials.accessToken }}',
      },
    },
  };
}
