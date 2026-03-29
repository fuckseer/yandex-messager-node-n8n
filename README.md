<div align="center">

# n8n-nodes-yandex-messenger

[![npm version](https://img.shields.io/npm/v/n8n-nodes-yandex-messenger.svg)](https://www.npmjs.com/package/n8n-nodes-yandex-messenger)
[![npm downloads](https://img.shields.io/npm/dm/n8n-nodes-yandex-messenger.svg)](https://www.npmjs.com/package/n8n-nodes-yandex-messenger)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![n8n community](https://img.shields.io/badge/n8n-community%20node-ff6d5a)](https://docs.n8n.io/integrations/community-nodes/)

**Community node for [n8n](https://n8n.io/) to interact with [Yandex Messenger Bot API](https://yandex.ru/dev/messenger/doc/ru/)**

[English](#english) • [Русский](#русский)

</div>

---

## English

### 📖 About

This n8n community node lets you automate work in **Yandex Messenger** (part of Yandex 360 for Business) and integrate it with 400+ other services available in n8n. Built by the community, inspired by the architecture of the [Telegram node](https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.telegram/) [5].

### 🚀 Installation

#### Via n8n UI (recommended)

1. Open **Settings** → **Community Nodes**
2. Enter `n8n-nodes-yandex-messenger`
3. Click **Install**

#### Manual

```bash
cd ~/.n8n/nodes
npm install n8n-nodes-yandex-messenger
# Restart n8n after installation
```

### 🔑 Credentials

You need an **OAuth token** for your Yandex Messenger bot.

| Field | Description |
|---|---|
| **Bot OAuth Token** | OAuth token issued for your bot in Yandex 360 admin panel |

### ⚡ Operations

#### Yandex Messenger Node

##### Message

| Operation | Description |
|---|---|
| **Send Text** | Send a text message with optional inline keyboard, reply, and threading support. Max 6000 characters [1] |
| **Send File** | Send a file to a chat or user via `multipart/form-data` [2] |
| **Send Image** | Send an image to a chat or user [3] |
| **Send Album** | Send multiple images as an album |
| **Delete** | Delete a message from a chat |

##### Bot Settings

| Operation | Description |
|---|---|
| **Set Webhook** | Set or remove the webhook URL for receiving updates [4] |

#### Yandex Messenger Trigger Node

Starts the workflow when a Yandex Messenger event occurs:

| Event | Description |
|---|---|
| **All Updates** | Receive all types of updates |
| **New Message** | Triggered when a new message is sent to the bot |
| **Message Updated** | Triggered when an existing message is edited |
| **Callback Button Pressed** | Triggered when a user presses an inline button |

### 📬 Recipient Types

Each message operation supports two recipient types:

| Type | Parameter | Description |
|---|---|---|
| **Group Chat** | `chat_id` | Send to a group chat where the bot is a member [1] |
| **User** | `login` | Send a private message to a user by login [1] |

> **Note:** At least one of `chat_id` or `login` must be provided. The bot can only send messages to chats where it is a member or admin [1].

### 🛠 Send Text — Additional Fields

| Field | Type | Description |
|---|---|---|
| `reply_message_id` | integer | Reply to a specific message [1] |
| `inline_keyboard` | JSON | Array of inline buttons (max 100) [1] |
| `disable_notification` | boolean | Disable notification for this message [1] |
| `important` | boolean | Mark the message as important [1] |
| `disable_web_page_preview` | boolean | Disable link previews [1] |
| `thread_id` | integer | Open a thread under a specific message [1] |
| `payload_id` | string | Unique request ID for deduplication [1] |

### 📝 Example: Send a Text Message

```json
{
  "resource": "message",
  "operation": "sendText",
  "recipientType": "login",
  "login": "john.doe",
  "text": "Hello from n8n! 🚀"
}
```

**Successful response:**
```json
{
  "ok": true,
  "message_id": 1647523230504005
}
```

### ⚠️ Limitations

- Bot can only message chats where it's a **member or admin** [1]
- Bot cannot send private messages to users who have **disabled it in privacy settings** [1]
- Bot cannot message users **outside its organization** [1]
- Text messages are limited to **6000 characters** [1]
- Webhook delivery is **"at least once"** — duplicates are possible [4]
- Webhook timeouts: connection = 100ms, read = 1s [4]
- Undelivered webhook messages are **deleted after 24 hours** [4]

### 🔗 API Reference

| Endpoint | Documentation |
|---|---|
| Send Text | [API Docs](https://yandex.ru/dev/messenger/doc/ru/api-requests/message-send-text) [1] |
| Send File | [API Docs](https://yandex.ru/dev/messenger/doc/ru/api-requests/message-send-file) [2] |
| Send Image | [API Docs](https://yandex.ru/dev/messenger/doc/ru/api-requests/message-send-image) [3] |
| Webhook | [API Docs](https://yandex.ru/dev/messenger/doc/ru/api-requests/update-webhook) [4] |

### 🤝 Compatibility

| Requirement | Version |
|---|---|
| n8n | 1.0+ |
| Node.js | 18 or 20 LTS |

### 📄 License

[MIT](LICENSE)

---

## Русский

### 📖 О проекте

Эта community-нода для n8n позволяет автоматизировать работу с **Яндекс Мессенджером** (часть Яндекс 360 для бизнеса) и интегрировать его с более чем 400 сервисами, доступными в n8n. Создана сообществом, архитектура вдохновлена [Telegram-нодой](https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.telegram/) [5].

### 🚀 Установка

#### Через интерфейс n8n (рекомендуется)

1. Откройте **Settings** → **Community Nodes**
2. Введите `n8n-nodes-yandex-messenger`
3. Нажмите **Install**

#### Вручную

```bash
cd ~/.n8n/nodes
npm install n8n-nodes-yandex-messenger
# Перезапустите n8n после установки
```

### 🔑 Авторизация

Для работы необходим **OAuth-токен** бота Яндекс Мессенджера.

| Поле | Описание |
|---|---|
| **Bot OAuth Token** | OAuth-токен, выданный боту в панели администратора Яндекс 360 |

### ⚡ Операции

#### Нода Yandex Messenger

##### Сообщения

| Операция | Описание |
|---|---|
| **Send Text** | Отправка текстового сообщения с поддержкой инлайн-кнопок, ответов и тредов. Максимум 6000 символов [1] |
| **Send File** | Отправка файла в чат или пользователю через `multipart/form-data` [2] |
| **Send Image** | Отправка изображения в чат или пользователю [3] |
| **Send Album** | Отправка нескольких изображений в виде альбома |
| **Delete** | Удаление сообщения из чата |

##### Настройки бота

| Операция | Описание |
|---|---|
| **Set Webhook** | Установка или удаление URL вебхука для получения обновлений [4] |

#### Нода-триггер Yandex Messenger Trigger

Запускает workflow при наступлении события в Яндекс Мессенджере:

| Событие | Описание |
|---|---|
| **All Updates** | Получение всех типов обновлений |
| **New Message** | Срабатывает при получении нового сообщения |
| **Message Updated** | Срабатывает при редактировании сообщения |
| **Callback Button Pressed** | Срабатывает при нажатии инлайн-кнопки |

### 📬 Типы получателей

Каждая операция с сообщениями поддерживает два типа получателей:

| Тип | Параметр | Описание |
|---|---|---|
| **Групповой чат** | `chat_id` | Отправка в групповой чат, где бот является участником [1] |
| **Пользователь** | `login` | Отправка личного сообщения пользователю по логину [1] |

> **Важно:** Необходимо указать хотя бы один из параметров: `chat_id` или `login`. Бот может отправлять сообщения только в чаты, где он является участником или администратором [1].

### 🛠 Send Text — дополнительные поля

| Поле | Тип | Описание |
|---|---|---|
| `reply_message_id` | integer | Ответ на конкретное сообщение [1] |
| `inline_keyboard` | JSON | Массив инлайн-кнопок (макс. 100) [1] |
| `disable_notification` | boolean | Отключить уведомление [1] |
| `important` | boolean | Пометить сообщение как важное [1] |
| `disable_web_page_preview` | boolean | Отключить раскрытие ссылок [1] |
| `thread_id` | integer | Открыть тред под указанным сообщением [1] |
| `payload_id` | string | Уникальный ID запроса для дедупликации [1] |

### 📝 Пример: отправка текстового сообщения

```json
{
  "resource": "message",
  "operation": "sendText",
  "recipientType": "login",
  "login": "ivan.petrov",
  "text": "Привет из n8n! 🚀"
}
```

**Успешный ответ:**
```json
{
  "ok": true,
  "message_id": 1647523230504005
}
```

### ⚠️ Ограничения

- Бот может отправлять сообщения только в чаты, где он является **участником или администратором** [1]
- Бот не может отправлять личные сообщения пользователям, **запретившим это в настройках приватности** [1]
- Бот не может отправлять сообщения пользователям **вне своей организации** [1]
- Текстовые сообщения ограничены **6000 символами** [1]
- Доставка через вебхук работает по принципу **«at least once»** — возможны дубликаты [4]
- Таймауты вебхука: connection = 100мс, read = 1с [4]
- Недоставленные сообщения **удаляются через 24 часа** [4]

### 🔗 Справочник API

| Эндпоинт | Документация |
|---|---|
| Отправка текста | [Документация](https://yandex.ru/dev/messenger/doc/ru/api-requests/message-send-text) [1] |
| Отправка файла | [Документация](https://yandex.ru/dev/messenger/doc/ru/api-requests/message-send-file) [2] |
| Отправка изображения | [Документация](https://yandex.ru/dev/messenger/doc/ru/api-requests/message-send-image) [3] |
| Webhook | [Документация](https://yandex.ru/dev/messenger/doc/ru/api-requests/update-webhook) [4] |

### 🤝 Совместимость

| Требование | Версия |
|---|---|
| n8n | 1.0+ |
| Node.js | 18 или 20 LTS |

### 📄 Лицензия

[MIT](LICENSE)

---

<div align="center">

**Made with ❤️ for the n8n community**

[Report Bug](https://github.com/fuckseer/n8n-nodes-yandex-messenger/issues) · [Request Feature](https://github.com/fuckseer/n8n-nodes-yandex-messenger/issues)

</div>
```

---

## Какие техники использованы

| Техника | Зачем |
|---|---|
| **Бейджи** (npm version, downloads, license) | Мгновенно показывают статус проекта |
| **Центрированный заголовок** | Профессиональный вид |
| **Навигация EN/RU** | Удобное переключение между языками |
| **Эмодзи в заголовках** | Визуальная навигация по разделам |
| **Таблицы операций** | Структурированное описание функционала |
| **Примеры JSON** | Наглядное понимание как использовать |
| **Блок ограничений** | Предупреждение о подводных камнях |
| **Ссылки на API** | Быстрый доступ к официальной документации |
| **Двуязычность** | Доступность для русскоязычной и международной аудитории |
| **Call to action** (Report Bug / Request Feature) | Вовлечение сообщества |