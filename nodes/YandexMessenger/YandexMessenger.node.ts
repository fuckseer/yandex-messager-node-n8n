import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeOperationError,
  IDataObject,
} from 'n8n-workflow';

export class YandexMessenger implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Yandex Messenger',
    name: 'yandexMessenger',
    icon: 'file:yandex-messenger.png',
    group: ['output'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Send messages, files and images via Yandex Messenger Bot API',
    defaults: {
      name: 'Yandex Messenger',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'yandexMessengerApi',
        required: true,
      },
    ],
    properties: [
      // =====================
      // RESOURCE
      // =====================
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'Message',
            value: 'message',
          },
          {
            name: 'Bot Settings',
            value: 'botSettings',
          },
        ],
        default: 'message',
      },

      // =====================
      // OPERATIONS: Message
      // =====================
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
          show: {
            resource: ['message'],
          },
        },
        options: [
          {
            name: 'Send Text',
            value: 'sendText',
            description: 'Send a text message to a chat or user',
            action: 'Send a text message',
          },
          {
            name: 'Send File',
            value: 'sendFile',
            description: 'Send a file to a chat or user',
            action: 'Send a file',
          },
          {
            name: 'Send Image',
            value: 'sendImage',
            description: 'Send an image to a chat or user',
            action: 'Send an image',
          },
          {
            name: 'Send Album',
            value: 'sendAlbum',
            description: 'Send an album of images to a chat or user',
            action: 'Send an album',
          },
          {
            name: 'Delete',
            value: 'deleteMessage',
            description: 'Delete a message from a chat',
            action: 'Delete a message',
          },
        ],
        default: 'sendText',
      },

      // =====================
      // OPERATIONS: Bot Settings
      // =====================
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
          show: {
            resource: ['botSettings'],
          },
        },
        options: [
          {
            name: 'Set Webhook',
            value: 'setWebhook',
            description: 'Set or remove the webhook URL for the bot',
            action: 'Set webhook URL',
          },
        ],
        default: 'setWebhook',
      },

      // =====================
      // RECIPIENT TYPE (for message operations)
      // =====================
      {
        displayName: 'Send To',
        name: 'recipientType',
        type: 'options',
        displayOptions: {
          show: {
            resource: ['message'],
          },
        },
        options: [
          {
            name: 'Group Chat (Chat ID)',
            value: 'chatId',
          },
          {
            name: 'User (Login)',
            value: 'login',
          },
        ],
        default: 'chatId',
        description: 'Whether to send to a group chat by ID or to a user by login',
      },
      {
        displayName: 'Chat ID',
        name: 'chatId',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: {
            resource: ['message'],
            recipientType: ['chatId'],
          },
        },
        description: 'ID of the group chat. The bot must be a member of the chat.',
      },
      {
        displayName: 'User Login',
        name: 'login',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: {
            resource: ['message'],
            recipientType: ['login'],
          },
        },
        description: 'Login of the user to send a private message to',
      },

      // =====================
      // SEND TEXT fields
      // =====================
      {
        displayName: 'Text',
        name: 'text',
        type: 'string',
        typeOptions: {
          rows: 4,
        },
        default: '',
        required: true,
        displayOptions: {
          show: {
            resource: ['message'],
            operation: ['sendText'],
          },
        },
        description: 'Text of the message to send. Max 6000 characters.',
      },
      {
        displayName: 'Additional Fields',
        name: 'additionalFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: {
          show: {
            resource: ['message'],
            operation: ['sendText'],
          },
        },
        options: [
          {
            displayName: 'Payload ID',
            name: 'payload_id',
            type: 'string',
            default: '',
            description:
              'Unique request ID. Requests with the same ID are treated as duplicates.',
          },
          {
            displayName: 'Reply to Message ID',
            name: 'reply_message_id',
            type: 'number',
            default: 0,
            description: 'ID of the message to reply to. Must be from the same chat.',
          },
          {
            displayName: 'Disable Notification',
            name: 'disable_notification',
            type: 'boolean',
            default: false,
            description: 'Whether to disable notification for this message',
          },
          {
            displayName: 'Important',
            name: 'important',
            type: 'boolean',
            default: false,
            description: 'Whether the message is marked as important',
          },
          {
            displayName: 'Disable Web Page Preview',
            name: 'disable_web_page_preview',
            type: 'boolean',
            default: false,
            description: 'Whether to disable link preview in the message',
          },
          {
            displayName: 'Thread ID',
            name: 'thread_id',
            type: 'number',
            default: 0,
            description:
              'ID of the message under which a thread will be opened',
          },
          {
            displayName: 'Inline Keyboard (JSON)',
            name: 'inline_keyboard',
            type: 'json',
            default: '[]',
            description:
              'JSON array of inline buttons. Max 100 buttons. Refer to Yandex Messenger API docs.',
          },
        ],
      },

      // =====================
      // SEND FILE fields
      // =====================
      {
        displayName: 'Binary Property',
        name: 'binaryPropertyName',
        type: 'string',
        default: 'data',
        required: true,
        displayOptions: {
          show: {
            resource: ['message'],
            operation: ['sendFile'],
          },
        },
        description:
          'Name of the binary property containing the file data to upload',
      },
      {
        displayName: 'Additional Fields',
        name: 'additionalFieldsFile',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: {
          show: {
            resource: ['message'],
            operation: ['sendFile'],
          },
        },
        options: [
          {
            displayName: 'Thread ID',
            name: 'thread_id',
            type: 'number',
            default: 0,
            description: 'Thread message timestamp ID',
          },
        ],
      },

      // =====================
      // SEND IMAGE fields
      // =====================
      {
        displayName: 'Binary Property',
        name: 'binaryPropertyName',
        type: 'string',
        default: 'data',
        required: true,
        displayOptions: {
          show: {
            resource: ['message'],
            operation: ['sendImage'],
          },
        },
        description:
          'Name of the binary property containing the image data to upload',
      },
      {
        displayName: 'Additional Fields',
        name: 'additionalFieldsImage',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: {
          show: {
            resource: ['message'],
            operation: ['sendImage'],
          },
        },
        options: [
          {
            displayName: 'Thread ID',
            name: 'thread_id',
            type: 'number',
            default: 0,
            description: 'Thread message timestamp ID',
          },
        ],
      },

      // =====================
      // SEND ALBUM fields
      // =====================
      {
        displayName: 'Binary Properties',
        name: 'binaryPropertyNames',
        type: 'string',
        default: 'data0,data1',
        required: true,
        displayOptions: {
          show: {
            resource: ['message'],
            operation: ['sendAlbum'],
          },
        },
        description:
          'Comma-separated names of binary properties containing images to send as an album',
      },

      // =====================
      // DELETE MESSAGE fields
      // =====================
      {
        displayName: 'Message ID',
        name: 'messageId',
        type: 'number',
        default: 0,
        required: true,
        displayOptions: {
          show: {
            resource: ['message'],
            operation: ['deleteMessage'],
          },
        },
        description: 'ID of the message to delete',
      },

      // =====================
      // SET WEBHOOK fields
      // =====================
      {
        displayName: 'Webhook URL',
        name: 'webhookUrl',
        type: 'string',
        default: '',
        displayOptions: {
          show: {
            resource: ['botSettings'],
            operation: ['setWebhook'],
          },
        },
        description:
          'URL to receive updates via webhook. Leave empty to remove the webhook.',
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];
    const resource = this.getNodeParameter('resource', 0) as string;
    const operation = this.getNodeParameter('operation', 0) as string;

    const BASE_URL = 'https://botapi.messenger.yandex.net/bot/v1';

    for (let i = 0; i < items.length; i++) {
      try {
        // ---------------------------
        // message: sendText
        // ---------------------------
        if (resource === 'message' && operation === 'sendText') {
          const body: IDataObject = {};

          // Recipient
          const recipientType = this.getNodeParameter('recipientType', i) as string;
          if (recipientType === 'chatId') {
            body.chat_id = this.getNodeParameter('chatId', i) as string;
          } else {
            body.login = this.getNodeParameter('login', i) as string;
          }

          body.text = this.getNodeParameter('text', i) as string;

          // Additional fields
          const additionalFields = this.getNodeParameter(
            'additionalFields',
            i,
          ) as IDataObject;

          if (additionalFields.payload_id) {
            body.payload_id = additionalFields.payload_id;
          }
          if (additionalFields.reply_message_id) {
            body.reply_message_id = additionalFields.reply_message_id;
          }
          if (additionalFields.disable_notification !== undefined) {
            body.disable_notification = additionalFields.disable_notification;
          }
          if (additionalFields.important !== undefined) {
            body.important = additionalFields.important;
          }
          if (additionalFields.disable_web_page_preview !== undefined) {
            body.disable_web_page_preview =
              additionalFields.disable_web_page_preview;
          }
          if (additionalFields.thread_id) {
            body.thread_id = additionalFields.thread_id;
          }
          if (additionalFields.inline_keyboard) {
            body.inline_keyboard =
              typeof additionalFields.inline_keyboard === 'string'
                ? JSON.parse(additionalFields.inline_keyboard)
                : additionalFields.inline_keyboard;
          }

          const response = await this.helpers.httpRequestWithAuthentication.call(
            this,
            'yandexMessengerApi',
            {
              method: 'POST',
              url: `${BASE_URL}/messages/sendText/`,
              headers: {
                'Content-Type': 'application/json',
              },
              body,
              json: true,
            },
          );

          returnData.push({ json: response as IDataObject });
        }

        // ---------------------------
        // message: sendFile
        // ---------------------------
        if (resource === 'message' && operation === 'sendFile') {
        const binaryPropertyName = this.getNodeParameter(
            'binaryPropertyName',
            i,
        ) as string;

        const binaryData = this.helpers.assertBinaryData(i, binaryPropertyName);
        const buffer = await this.helpers.getBinaryDataBuffer(i, binaryPropertyName);

        const credentials = await this.getCredentials('yandexMessengerApi');

        const formData: Record<string, any> = {};

        const recipientType = this.getNodeParameter('recipientType', i) as string;
        if (recipientType === 'chatId') {
            formData.chat_id = this.getNodeParameter('chatId', i) as string;
        } else {
            formData.login = this.getNodeParameter('login', i) as string;
        }

        const additionalFields = this.getNodeParameter(
            'additionalFieldsFile',
            i,
        ) as IDataObject;
        if (additionalFields.thread_id) {
            formData.thread_id = String(additionalFields.thread_id);
        }

        formData.document = {
            value: buffer,
            options: {
            filename: binaryData.fileName || 'file',
            contentType: binaryData.mimeType,
            },
        };

        const response = await this.helpers.request({
            method: 'POST',
            uri: `${BASE_URL}/messages/sendFile/`,
            headers: {
            Authorization: `OAuth ${credentials.botToken}`,
            },
            formData,
            json: true,
        });

        returnData.push({ json: response as IDataObject });
}

        // ---------------------------
        // message: sendImage
        // ---------------------------
        if (resource === 'message' && operation === 'sendImage') {
        const binaryPropertyName = this.getNodeParameter(
            'binaryPropertyName',
            i,
        ) as string;

        const binaryData = this.helpers.assertBinaryData(i, binaryPropertyName);
        const buffer = await this.helpers.getBinaryDataBuffer(i, binaryPropertyName);

        const credentials = await this.getCredentials('yandexMessengerApi');

        const formData: Record<string, any> = {};

        const recipientType = this.getNodeParameter('recipientType', i) as string;
        if (recipientType === 'chatId') {
            formData.chat_id = this.getNodeParameter('chatId', i) as string;
        } else {
            formData.login = this.getNodeParameter('login', i) as string;
        }

        const additionalFields = this.getNodeParameter(
            'additionalFieldsImage',
            i,
        ) as IDataObject;
        if (additionalFields.thread_id) {
            formData.thread_id = String(additionalFields.thread_id);
        }

        formData.image = {
            value: buffer,
            options: {
            filename: binaryData.fileName || 'image.jpg',
            contentType: binaryData.mimeType,
            },
        };

        const response = await this.helpers.request({
            method: 'POST',
            uri: `${BASE_URL}/messages/sendImage/`,
            headers: {
            Authorization: `OAuth ${credentials.botToken}`,
            },
            formData,
            json: true,
        });

        returnData.push({ json: response as IDataObject });
        }

        // ---------------------------
        // message: sendAlbum
        // ---------------------------
        if (resource === 'message' && operation === 'sendAlbum') {
        const binaryPropertyNames = (
            this.getNodeParameter('binaryPropertyNames', i) as string
        )
            .split(',')
            .map((name) => name.trim());

        const credentials = await this.getCredentials('yandexMessengerApi');

        const formData: Record<string, any> = {};

        const recipientType = this.getNodeParameter('recipientType', i) as string;
        if (recipientType === 'chatId') {
            formData.chat_id = this.getNodeParameter('chatId', i) as string;
        } else {
            formData.login = this.getNodeParameter('login', i) as string;
        }

        for (let idx = 0; idx < binaryPropertyNames.length; idx++) {
            const propName = binaryPropertyNames[idx];
            const binaryData = this.helpers.assertBinaryData(i, propName);
            const buffer = await this.helpers.getBinaryDataBuffer(i, propName);
            formData[`image_${idx}`] = {
            value: buffer,
            options: {
                filename: binaryData.fileName || `image_${idx}.jpg`,
                contentType: binaryData.mimeType,
            },
            };
        }

        const response = await this.helpers.request({
            method: 'POST',
            uri: `${BASE_URL}/messages/sendAlbum/`,
            headers: {
            Authorization: `OAuth ${credentials.botToken}`,
            },
            formData,
            json: true,
        });

        returnData.push({ json: response as IDataObject });
        }

        // ---------------------------
        // message: deleteMessage
        // ---------------------------
        if (resource === 'message' && operation === 'deleteMessage') {
          const body: IDataObject = {};

          const recipientType = this.getNodeParameter('recipientType', i) as string;
          if (recipientType === 'chatId') {
            body.chat_id = this.getNodeParameter('chatId', i) as string;
          } else {
            body.login = this.getNodeParameter('login', i) as string;
          }

          body.message_id = this.getNodeParameter('messageId', i) as number;

          const response = await this.helpers.httpRequestWithAuthentication.call(
            this,
            'yandexMessengerApi',
            {
              method: 'POST',
              url: `${BASE_URL}/messages/delete/`,
              headers: {
                'Content-Type': 'application/json',
              },
              body,
              json: true,
            },
          );

          returnData.push({ json: response as IDataObject });
        }

        // ---------------------------
        // botSettings: setWebhook
        // ---------------------------
        if (resource === 'botSettings' && operation === 'setWebhook') {
          const webhookUrl = this.getNodeParameter('webhookUrl', i) as string;

          const body: IDataObject = {
            webhook_url: webhookUrl || null,
          };

          const response = await this.helpers.httpRequestWithAuthentication.call(
            this,
            'yandexMessengerApi',
            {
              method: 'POST',
              url: `${BASE_URL}/self/update/`,
              headers: {
                'Content-Type': 'application/json',
              },
              body,
              json: true,
            },
          );

          returnData.push({ json: response as IDataObject });
        }
      } catch (error) {
        if (this.continueOnFail()) {
          returnData.push({
            json: { error: (error as Error).message },
          });
          continue;
        }
        throw new NodeOperationError(this.getNode(), error as Error, {
          itemIndex: i,
        });
      }
    }

    return [returnData];
  }
}