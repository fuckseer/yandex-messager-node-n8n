import {
  IWebhookFunctions,
  IWebhookResponseData,
  INodeType,
  INodeTypeDescription,
  IHookFunctions,
  IDataObject, 
} from 'n8n-workflow';

export class YandexMessengerTrigger implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Yandex Messenger Trigger',
    name: 'yandexMessengerTrigger',
    icon: 'file:yandex-messenger.png',
    group: ['trigger'],
    version: 1,
    subtitle: 'Listens for Yandex Messenger updates via webhook',
    description:
      'Starts the workflow when a Yandex Messenger event occurs (new message, etc.)',
    defaults: {
      name: 'Yandex Messenger Trigger',
    },
    inputs: [],
    outputs: ['main'],
    credentials: [
      {
        name: 'yandexMessengerApi',
        required: true,
      },
    ],
    webhooks: [
      {
        name: 'default',
        httpMethod: 'POST',
        responseMode: 'onReceived',
        path: 'webhook',
      },
    ],
    properties: [
      {
        displayName: 'Events',
        name: 'events',
        type: 'multiOptions',
        options: [
          {
            name: 'All Updates',
            value: 'all',
          },
          {
            name: 'New Message',
            value: 'new_message',
          },
          {
            name: 'Message Updated',
            value: 'message_updated',
          },
          {
            name: 'Callback Button Pressed',
            value: 'callback_button',
          },
        ],
        default: ['all'],
        description: 'Which events to listen for',
      },
    ],
  };

  webhookMethods = {
    default: {
      async checkExists(this: IHookFunctions): Promise<boolean> {
        const webhookUrl = this.getNodeWebhookUrl('default');
        const BASE_URL = 'https://botapi.messenger.yandex.net/bot/v1';

        try {
          const response = await this.helpers.httpRequestWithAuthentication.call(
            this,
            'yandexMessengerApi',
            {
              method: 'GET' as const,
              url: `${BASE_URL}/self/`,
            },
          );

          if (response?.webhook_url === webhookUrl) {
            return true;
          }
        } catch {
          // Webhook not set
        }

        return false;
      },

      async create(this: IHookFunctions): Promise<boolean> {
        const webhookUrl = this.getNodeWebhookUrl('default');
        const BASE_URL = 'https://botapi.messenger.yandex.net/bot/v1';

        await this.helpers.httpRequestWithAuthentication.call(
          this,
          'yandexMessengerApi',
          {
            method: 'POST' as const,
            url: `${BASE_URL}/self/update/`,
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              webhook_url: webhookUrl,
            }),
          },
        );

        return true;
      },

      async delete(this: IHookFunctions): Promise<boolean> {
        const BASE_URL = 'https://botapi.messenger.yandex.net/bot/v1';

        try {
          await this.helpers.httpRequestWithAuthentication.call(
            this,
            'yandexMessengerApi',
            {
              method: 'POST' as const,
              url: `${BASE_URL}/self/update/`,
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                webhook_url: null,
              }),
            },
          );
        } catch {
          return false;
        }

        return true;
      },
    },
  };
  async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
    const body = this.getBodyData() as IDataObject;
    const events = this.getNodeParameter('events', []) as string[];

    // If "all" is selected, pass everything through
    if (!events.includes('all')) {
      // Filter by event type if the API provides it
      const eventType =
        body && typeof body === 'object' && 'type' in body
          ? (body as { type: string }).type
          : undefined;

      if (eventType && !events.includes(eventType)) {
        return {
          workflowData: [[]],
        };
      }
    }

    return {
      workflowData: [this.helpers.returnJsonArray(body as IDataObject)],
    };
  }
}