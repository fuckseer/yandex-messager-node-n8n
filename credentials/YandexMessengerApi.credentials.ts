import {
  IAuthenticateGeneric,
  ICredentialType,
  INodeProperties,
} from 'n8n-workflow';

export class YandexMessengerApi implements ICredentialType {
  name = 'yandexMessengerApi';
  displayName = 'Yandex Messenger Bot API';
  documentationUrl = 'https://yandex.ru/dev/messenger/doc/ru/';

  properties: INodeProperties[] = [
    {
      displayName: 'Bot OAuth Token',
      name: 'botToken',
      type: 'string',
      typeOptions: {
        password: true,
      },
      default: '',
      required: true,
      description: 'OAuth token for the Yandex Messenger bot',
    },
  ];

  authenticate: IAuthenticateGeneric = {
    type: 'generic',
    properties: {
      headers: {
        Authorization: '=OAuth {{$credentials.botToken}}',
      },
    },
  };
}