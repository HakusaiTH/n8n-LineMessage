![](https://github.com/user-attachments/assets/0e947020-9e8d-4638-943c-d3f2f6d535cb)


# 💬 n8n-nodes-line-messaging

Plug-in to connect [LINE Messaging API](https://developers.line.biz/en/docs/messaging-api/) to [n8n](https://n8n.io/) to easily send various types of messages such as text, stickers, videos, and templates via LINE.

---

## 📦 Features

![](https://github.com/user-attachments/assets/92f072e7-0534-42d0-b0bc-82f0fcfb8ed4)

This plug-in fully supports sending various types of messages via LINE Messaging API:

* ✅ **Text Message** — Send plain text messages
* ✅ **Sticker Message** — Send stickers from LINE (must specify `packageId` and `stickerId`)
* ✅ **Image Message** — Send images from URL (`originalContentUrl` and `previewImageUrl`)
* ✅ **Video Message** — Send videos from URL With preview images
* ✅ **Audio Message** — Send audio files from a URL
* ✅ **Location Message** — Share location (location name, address, latitude, longitude)
* ✅ **Imagemap Message** — Send interactive images that can be clicked
* ✅ **Template Message** — Messages with interactive buttons, such as Confirm or Buttons
* ✅ **Flex Message** — Design messages flexibly with Flex Layout (similar to HTML + JSON)
* ✅ Use expressions from other nodes in the workflow

> ℹ️ For more details, see [LINE Message Types Documentation](https://developers.line.biz/en/reference/messaging-api/#message-objects)

---

Here you go! The following is a README that seamlessly integrates the **"Creating and Setting Up a LINE Official Account"** and **"Finding a Chat Room ID"** sections. Formatted for easy reading:

---

## 🛠️ Creating and setting up LINE Official Account

To use the LINE Messaging API, you need to create a LINE Official Account and set the following settings:

### 1. Create a LINE Official Account

1. Go to [https://account.line.biz/](https://account.line.biz/) and log in with your LINE account.
2. Click the **Create New** button.
3. Fill in all the information and press **OK**.
4. When the system notifies you that you are done, press **Go to LINE Official Account Manager**.

### 2. Set up your basic profile.

1. Press to accept the **Terms of Use**.
2. Close the “Welcome” box by pressing the `X` in the upper right corner.
3. Change your profile picture by pressing **Edit** > Select a picture > **Save**.
4. When the notification window appears, press **Save**.

### 3. Enable group participation.

1. Scroll to the topic **Using the feature**
2. Click **Allow to join the group** > Confirm by clicking **OK**

### 4. Enable Messaging API

1. On the right menu, click **Messaging API**
2. Click **Use Messaging API**
3. Create an account administrator (Provider) by naming it and clicking **Accept**
4. Click **OK** to confirm
5. A summary window will appear, click **OK**

---

## ⚙️ Setting in LINE Developers Console

### 1. Access the LINE Developers Console

1. Go to [https://developers.line.biz/](https://developers.line.biz/)
2. Click the **Console** button
3. Select the Provider name you created
4. Click the Channel name you created

### 2. Exit Channel Access Token

1. Access the **Messaging API** menu
2. Scroll down to find the **Channel access token** topic
3. Click the button **Issue**
4. Copy the obtained Token and save it (use in n8n Credential)

---

## 🆔 Find User ID / Group ID for sending messages

### How to view User ID with Webhook

1. Go to [https://typedwebhook.tools/](https://typedwebhook.tools/) and copy the Webhook link

2. Paste the link into the **Webhook URL** field of LINE Developers Console > then press **Save**

3. Send any message to the created LINE OA chat

4. Return to typedwebhook.tools:

* Press to view the data that appears
* Select to view in the **JSON** tab
* Find the `source.userId` value to use as **UID** for sending private messages

### How to view the Group ID for sending to groups

1. Invite LINE OA accounts to join the desired LINE group
2. Send any message in the group
3. Return to typedwebhook.tools:

* You will see a new entry (#2)
* Click to look in **JSON**
* Find the `source.groupId` value to use to send messages to **groups**

---

## 📌 Prerequisites

### 1. Install Node.js and n8n
```bash
npm install -g n8n
````

### 2. Create a LINE Channel

* Go to [LINE Developers Console](https://developers.line.biz/console/)
* Create **Messaging API Channel**
* Enable **Bot**
* Collect **Channel Access Token** and **User ID (UID)**

---

## 🚀 Installation

### ✅ Install via npm (recommended)

```bash
mkdir -p ~/.n8n/custom
cd ~/.n8n/custom
npm init -y
npm install n8n-LineMessage
```

### 🛠️ Local installation

```bash
git clone https://github.com/HakusaiTH/n8n-LineMessage.git
cd n8n-LineMessage
npm install
npm run build
npm link

# Connect to n8n's custom folder
mkdir -p ~/.n8n/custom
cd ~/.n8n/custom
npm init -y
npm link n8n-LineMessage
```

Then run:

```bash
n8n start
```

---

## 🔐 LINE API Credentials Setup

1. Go to the **Credentials** menu on n8n
2. Create a new Credential:

* `accessToken` = Channel Access Token

---

## 🧾 How to use Node Various

### 🔸 `LineSendText`

* **Function:** Send plain text messages (Text Message) via LINE Messaging API
* **Usage:**

* Enter the message you want to send
* You can use Expressions such as `{{ $json.message }}` to retrieve messages from the previous Node

---

### 🔸 `LineSendSticker`

* **Function:** Send stickers (Sticker Message) via LINE Messaging API
* **Usage:**

* Set the `packageId` and `stickerId` of the stickers you want to send
* Example: `packageId = 446` and `stickerId = 1988`

![](https://github-production-user-asset-6210df.s3.amazonaws.com/104154862/471191987-05934d32-0abf-4d6b-bc69-34f6cbedcedc.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAVCODYLSA53PQK4 ZA%2F20250727%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250727T101819Z&X-Amz-Expires=300&X-Amz-Signature=c650b060c3c854ee227bd90dfc14fe53e07796e1d8c802fe1a12feb3cef4f724&X-Amz-SignedHeaders=host)

> ℹ️ For more details, please visit [Stickers](https://developers.line.biz/en/docs/messaging-api/sticker-list/)

---

### 🔸 `LineSendImage`

* **Function:** Send images (Image Message) via LINE Messaging API
* **Usage:**

* Enter the URL of the image you want to send in the `originalContentUrl` field
* Enter the URL of the preview image in the `previewImageUrl` field (shown in the chat before clicking to view the full image)
* **Note:** The URL must be HTTPS only
* **Suitable for:** Sending news illustrations, promotions, or general images

---

### 🔸 `LineSendVideo`

* **Function:** Send videos (Video Message) via LINE Messaging API
* **Usage:**

* Enter the video URL in the `originalContentUrl` field
* Enter the preview image URL in the `previewImageUrl`
* **Note:** URL must be HTTPS only

---

### 🔸 `LineSendAudio`

* **Function:** Send audio files (Audio Message) via LINE Messaging API
* **Usage:**

* Enter the URL of the audio file (MP3 or supported format)
* Set the duration of the audio file (duration) in milliseconds

---

### 🔸 `LineSendLocation`

* **Function:** Send location (Location Message) via LINE Messaging API
* **Usage:**

* Enter the location name (title)
* Address (address)
* Latitude (latitude)
* Longitude (longitude)

---

### 🔸 `LineSendImagemap`

* **Function:** Send interactive images (Imagemap Message) via LINE Messaging API
* **Usage:**

* Enter the URL Image (imagemap)
* Set the size of the image and the user-clickable zones (action areas)
* Set which message each button zone will send or which URL will open

---

### 🔸 `LineSendTemplate`

* **Function:** Send a template message (Template Message) via LINE Messaging API
* **Usage:**

* Set `title`, `text`, and `thumbnailImageUrl`

* Add multiple Action buttons, such as

* Message (send a message back)
* Postback (send hidden data)
* URI (open a webpage)

---

### 🔸 `LineSendFlex`

* **Function:** Send a Flex Message, which is a freely designed message (similar to HTML + JSON layout)
* **Usage:**

* Send a customized JSON structure of Flex Message
* You can design a complex message format, such as text blocks, images, buttons, frames, and more

---

### 🔸 `LineWebhook`

* **Function:** Receive messages or events generated by the LINE Platform via Webhook
* **Usage:**

* Use this Node to set up a webhook endpoint in n8n
* Wait for messages, button presses, tracking, or events that occur in LINE
---

If you need a sample code or more details on how to set up each Node, please let me know!

---

## 📸 Workflow example

Easily send messages and stickers to users via LINE Bot:

![](https://github.com/user-attachments/assets/958116d4-88de-4f6a-9983-9aa9fcccd844)

---

## 📚 References

* [LINE Messaging API Docs](https://developers.line.biz/en/docs/messaging-api/)
* [n8n Custom Nodes](https://docs.n8n.io/integrations/creating-nodes/)
* [LINE Sticker ID List](https://developers.line.biz/en/docs/messaging-api/sticker-list/)

---

## 📝 License

MIT License © 2025
