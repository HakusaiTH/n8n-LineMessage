import { ICredentialType, ICredentialTestRequest, INodeProperties } from 'n8n-workflow';

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
      description: 'LINE Messaging API Channel Access Token',
    },
    {
      displayName: 'User ID',
      name: 'userId',
      type: 'string',
      default: '',
      description: 'Target User ID for push messages',
    },
  ];
  test: ICredentialTestRequest = {
    request: {
      method: 'GET',
      url: 'https://api.line.me/v2/bot/profile/{{$credentials.userId}}',
      headers: { Authorization: 'Bearer {{$credentials.accessToken}}' },
    },
  };
}
