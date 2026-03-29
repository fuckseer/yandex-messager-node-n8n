# n8n-nodes-yandex-messenger

This is an n8n community node for [Yandex Messenger Bot API](https://yandex.ru/dev/messenger/doc/ru/).

It allows you to send messages, files, images, and albums, delete messages,
and receive updates via webhook in Yandex Messenger.

## Operations

### Message
- **Send Text** — send a text message with optional inline keyboard, reply, threading support [1]
- **Send File** — send a file to a chat or user [2]
- **Send Image** — send an image to a chat or user [3]
- **Send Album** — send multiple images as an album
- **Delete** — delete a message from a chat

### Bot Settings
- **Set Webhook** — set or remove the webhook URL [4]

### Trigger
- **Yandex Messenger Trigger** — receive updates via webhook (new messages, button clicks, etc.) [4]

## Credentials

You need an **OAuth token** for your Yandex Messenger bot.

## Installation

### In n8n Community Nodes
1. Go to **Settings** > **Community Nodes**
2. Enter `n8n-nodes-yandex-messenger`
3. Click **Install**

### Manual
```bash
npm install n8n-nodes-yandex-messenger