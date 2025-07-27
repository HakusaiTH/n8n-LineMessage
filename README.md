![](https://github-production-user-asset-6210df.s3.amazonaws.com/104154862/471190350-0e947020-9e8d-4638-943c-d3f2f6d535cb.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAVCODYLSA53PQK4ZA%2F20250727%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250727T092849Z&X-Amz-Expires=300&X-Amz-Signature=6b94671957aab2f80beae2b8802eed24668179e7ae782038826aa0666ac25710&X-Amz-SignedHeaders=host)


# 💬 n8n-nodes-line-messaging

ปลั๊กอินสำหรับเชื่อมต่อ [LINE Messaging API](https://developers.line.biz/en/docs/messaging-api/) กับ [n8n](https://n8n.io/) เพื่อส่งข้อความแบบต่าง ๆ เช่น ข้อความ, สติกเกอร์, วิดีโอ, และเทมเพลตผ่าน LINE ได้อย่างง่ายดาย

---

## 📦 Features

![](https://github-production-user-asset-6210df.s3.amazonaws.com/104154862/471191445-92f072e7-0534-42d0-b0bc-82f0fcfb8ed4.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAVCODYLSA53PQK4ZA%2F20250727%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250727T093546Z&X-Amz-Expires=300&X-Amz-Signature=2d14587beb49abce07ebb37a59fcd65e312c340c925d6f952bf2fca3038ae2a6&X-Amz-SignedHeaders=host)

ปลั๊กอินนี้รองรับการส่งข้อความประเภทต่าง ๆ ผ่าน LINE Messaging API ได้อย่างครบถ้วน:

* ✅ **Text Message** — ส่งข้อความตัวอักษรธรรมดา
* ✅ **Sticker Message** — ส่งสติกเกอร์จาก LINE (ต้องระบุ `packageId` และ `stickerId`)
* ✅ **Image Message** — ส่งรูปภาพจาก URL (`originalContentUrl` และ `previewImageUrl`)
* ✅ **Video Message** — ส่งวิดีโอจาก URL พร้อมภาพพรีวิว
* ✅ **Audio Message** — ส่งไฟล์เสียงจาก URL
* ✅ **Location Message** — แชร์ตำแหน่ง (ชื่อสถานที่, ที่อยู่, ละติจูด, ลองจิจูด)
* ✅ **Imagemap Message** — ส่งภาพแบบอินเตอร์แอคทีฟที่สามารถคลิกโต้ตอบได้
* ✅ **Template Message** — ข้อความที่มีปุ่มโต้ตอบ เช่น Confirm หรือ Buttons
* ✅ **Flex Message** — ออกแบบข้อความได้อย่างยืดหยุ่นด้วย Flex Layout (คล้าย HTML + JSON)
* ✅ ใช้ Expression จาก Node อื่นใน Workflow ได้


> ℹ️ ดูรายละเอียดเพิ่มเติมได้ที่ [LINE Message Types Documentation](https://developers.line.biz/en/reference/messaging-api/#message-objects)

---

ได้เลย! ด้านล่างนี้คือ README ที่มีการเสริมเนื้อหาส่วน **"การสร้าง และตั้งค่า LINE Official Account"** และ **"การหา ID ของห้องแชท"** เข้าไปอย่างกลมกลืน พร้อมจัดรูปแบบให้อ่านง่าย:

---

## 🛠️ การสร้าง และตั้งค่า LINE Official Account

เพื่อใช้งาน LINE Messaging API คุณต้องสร้าง LINE Official Account และตั้งค่าต่าง ๆ ดังนี้:

### 1. สร้าง LINE Official Account

1. เข้าไปที่ [https://account.line.biz/](https://account.line.biz/) และเข้าสู่ระบบด้วยบัญชี LINE
2. คลิกปุ่ม **สร้างใหม่**
3. กรอกข้อมูลให้ครบถ้วน แล้วกด **ตกลง**
4. เมื่อระบบแจ้งว่าเสร็จสิ้น ให้กด **ไป LINE Official Account Manager**

### 2. ตั้งค่าโปรไฟล์เบื้องต้น

1. กดยอมรับ **ข้อกำหนดการใช้งาน**
2. ปิดกล่อง “ยินดีต้อนรับ” โดยกด `X` มุมขวาบน
3. เปลี่ยนรูปประจำตัวโดยกด **แก้ไข** > เลือกรูป > **บันทึก**
4. เมื่อมีหน้าต่างแจ้งเตือน ให้กด **บันทึก**

### 3. เปิดใช้งานการเข้าร่วมกลุ่ม

1. เลื่อนมาที่หัวข้อ **การใช้ฟีเจอร์**
2. กด **อนุญาตให้เข้าร่วมกลุ่ม** > ยืนยันด้วยการกด **ตกลง**

### 4. เปิดใช้งาน Messaging API

1. ที่เมนูด้านขวา กด **Messaging API**
2. กดปุ่ม **ใช้ Messaging API**
3. สร้างผู้ดูแลบัญชี (Provider) โดยตั้งชื่อ และกด **ยอมรับ**
4. กด **ตกลง** เพื่อยืนยัน
5. หน้าต่างสรุปข้อมูลจะปรากฏ กด **ตกลง**

---

## ⚙️ ตั้งค่าใน LINE Developers Console

### 1. เข้าสู่ LINE Developers Console

1. ไปที่ [https://developers.line.biz/](https://developers.line.biz/)
2. คลิกปุ่ม **Console**
3. เลือกชื่อ Provider ที่สร้างไว้
4. คลิกที่ชื่อ Channel ที่คุณสร้างไว้

### 2. ออก Channel Access Token

1. เข้าสู่เมนู **Messaging API**
2. เลื่อนลงมาหาหัวข้อ **Channel access token**
3. กดปุ่ม **Issue**
4. คัดลอก Token ที่ได้และเก็บไว้ (ใช้ใน Credential ของ n8n)

---

## 🆔 การหา User ID / Group ID สำหรับส่งข้อความ

### วิธีดู User ID ด้วย Webhook

1. เข้าไปที่ [https://typedwebhook.tools/](https://typedwebhook.tools/) และคัดลอกลิงก์ Webhook

2. วางลิงก์ลงในช่อง **Webhook URL** ของ LINE Developers Console > แล้วกด **บันทึก**

3. ส่งข้อความใด ๆ ไปยังแชทของ LINE OA ที่สร้างไว้

4. กลับมาที่ typedwebhook.tools:

   * กดดูข้อมูลที่ขึ้นมา
   * เลือกดูในแท็บ **JSON**
   * หาค่า `source.userId` เพื่อใช้เป็น **UID** ในการส่งข้อความส่วนตัว

### วิธีดู Group ID สำหรับส่งเข้ากลุ่ม

1. เชิญบัญชี LINE OA เข้าร่วมกลุ่ม LINE ที่ต้องการ
2. ส่งข้อความใด ๆ ในกลุ่ม
3. กลับมาที่ typedwebhook.tools:

   * จะเห็นรายการใหม่ (#2)
   * กดดูใน **JSON**
   * หาค่า `source.groupId` เพื่อใช้ในการส่งข้อความเข้า **กลุ่ม**

---

## 📌 Prerequisites

### 1. ติดตั้ง Node.js และ n8n
```bash
npm install -g n8n
````

### 2. สร้าง LINE Channel

* ไปที่ [LINE Developers Console](https://developers.line.biz/console/)
* สร้าง **Messaging API Channel**
* เปิดใช้งาน **Bot**
* เก็บค่า **Channel Access Token** และ **User ID (UID)**

---

## 🚀 Installation

### ✅ ติดตั้งผ่าน npm (แนะนำ)

```bash
mkdir -p ~/.n8n/custom
cd ~/.n8n/custom
npm init -y
npm install @phoovadet.noobdev/n8n-LineMessage
```

### 🛠️ ติดตั้งแบบ local

```bash
git clone https://github.com/HakusaiTH/n8n-LineMessage.git
cd n8n-nodes-line-messaging
npm install
npm run build
npm link

# เชื่อมเข้ากับ custom folder ของ n8n
mkdir -p ~/.n8n/custom
cd ~/.n8n/custom
npm init -y
npm link n8n-LineMessage
```

จากนั้นรัน:

```bash
n8n start
```

---

## 🔐 LINE API Credentials Setup

1. ไปที่เมนู **Credentials** บน n8n
2. สร้าง Credential ใหม่:

   * `accessToken` = Channel Access Token

---

## 🧾 วิธีใช้งาน Node ต่าง ๆ

### 🔸 `LineSendText`

![](https://github-production-user-asset-6210df.s3.amazonaws.com/104154862/471192692-3731813b-9977-4369-92ee-a9dda57b0fd2.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAVCODYLSA53PQK4ZA%2F20250727%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250727T095653Z&X-Amz-Expires=300&X-Amz-Signature=41884bb2c04ca13992b49fe8f07b9a9066d01969829c4fdd4d9105b88607b3d6&X-Amz-SignedHeaders=host)

* **หน้าที่:** ส่งข้อความตัวอักษรธรรมดา (Text Message) ผ่าน LINE Messaging API
* **การใช้งาน:**

  * กรอกข้อความที่ต้องการส่ง
  * สามารถใช้ Expression เช่น `{{ $json.message }}` เพื่อดึงข้อความจาก Node ก่อนหน้า

---

### 🔸 `LineSendSticker`

![](https://github-production-user-asset-6210df.s3.amazonaws.com/104154862/471193085-c36aaa28-86dd-419b-89ce-150ba5ed6ecc.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAVCODYLSA53PQK4ZA%2F20250727%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250727T100317Z&X-Amz-Expires=300&X-Amz-Signature=8dfb5446746ebcab8ac6b32f3f76b29dd54dda820f2133085d3c59ebce6c718b&X-Amz-SignedHeaders=host)

* **หน้าที่:** ส่งสติกเกอร์ (Sticker Message) ผ่าน LINE Messaging API
* **การใช้งาน:**

  * กำหนด `packageId` และ `stickerId` ของสติกเกอร์ที่ต้องการส่ง
  * ตัวอย่าง: `packageId = 446` และ `stickerId = 1988`

![](https://github-production-user-asset-6210df.s3.amazonaws.com/104154862/471191987-05934d32-0abf-4d6b-bc69-34f6cbedcedc.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAVCODYLSA53PQK4ZA%2F20250727%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250727T094604Z&X-Amz-Expires=300&X-Amz-Signature=d179d4d507619415abef40fa63a042c6fcdfc28858545fd421dcdc67bcd6a803&X-Amz-SignedHeaders=host)

> ℹ️ ดูรายละเอียดเพิ่มเติมได้ที่ [Stickers](https://developers.line.biz/en/docs/messaging-api/sticker-list/)

---

### 🔸 `LineSendImage`

![](https://github-production-user-asset-6210df.s3.amazonaws.com/104154862/471192957-9a4e9fd8-b92f-4b12-9443-bf769c785778.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAVCODYLSA53PQK4ZA%2F20250727%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250727T100110Z&X-Amz-Expires=300&X-Amz-Signature=919be8d53b16be3b76a085f288a5b0dfcaa92ef2d96513ac450c82207bb232dc&X-Amz-SignedHeaders=host)

* **หน้าที่:** ส่งภาพ (Image Message) ผ่าน LINE Messaging API
* **การใช้งาน:**

  * กรอก URL ของภาพที่ต้องการส่งในช่อง `originalContentUrl`
  * กรอก URL ของภาพตัวอย่างในช่อง `previewImageUrl` (แสดงในแชทก่อนกดดูภาพเต็ม)
* **หมายเหตุ:** URL ต้องเป็น HTTPS เท่านั้น
* **เหมาะกับ:** ส่งภาพประกอบข่าวสาร, โปรโมชั่น, หรือรูปภาพทั่วไป

---

### 🔸 `LineSendVideo`

![](https://github-production-user-asset-6210df.s3.amazonaws.com/104154862/471193217-d5ab83e2-5ba6-4ef0-8e53-1b141a8655c6.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAVCODYLSA53PQK4ZA%2F20250727%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250727T100509Z&X-Amz-Expires=300&X-Amz-Signature=022288006d39a63049636dd4e206c5f8d0a47a569ad752bfa0b8c944d6816c71&X-Amz-SignedHeaders=host)

* **หน้าที่:** ส่งวิดีโอ (Video Message) ผ่าน LINE Messaging API
* **การใช้งาน:**

  * กรอก URL ของวิดีโอในช่อง `originalContentUrl`
  * กรอก URL ของภาพพรีวิวในช่อง `previewImageUrl`
* **หมายเหตุ:** URL ต้องเป็น HTTPS เท่านั้น

---

### 🔸 `LineSendAudio`

![](https://github-production-user-asset-6210df.s3.amazonaws.com/104154862/471193362-0a738cd5-5cb9-42ea-9379-b6964c1cffc0.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAVCODYLSA53PQK4ZA%2F20250727%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250727T100710Z&X-Amz-Expires=300&X-Amz-Signature=569e2e0337dcfd1aa2d6097b166b17555b930fc90cfb77c4b8f5cbb7fcc8d8e8&X-Amz-SignedHeaders=host)

* **หน้าที่:** ส่งไฟล์เสียง (Audio Message) ผ่าน LINE Messaging API
* **การใช้งาน:**

  * กรอก URL ของไฟล์เสียง (MP3 หรือรูปแบบที่รองรับ)
  * กำหนดความยาวไฟล์เสียง (duration) เป็นหน่วยมิลลิวินาที

---

### 🔸 `LineSendLocation`

![](https://github-production-user-asset-6210df.s3.amazonaws.com/104154862/471193429-b73c5827-d1f1-41fe-ab20-784fa28b135d.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAVCODYLSA53PQK4ZA%2F20250727%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250727T100805Z&X-Amz-Expires=300&X-Amz-Signature=f7634d4659560b3970e9c4536de71766d59ed649f81d254084596d0ac8c1cfe8&X-Amz-SignedHeaders=host)

* **หน้าที่:** ส่งตำแหน่ง (Location Message) ผ่าน LINE Messaging API
* **การใช้งาน:**

  * กรอกชื่อสถานที่ (title)
  * ที่อยู่ (address)
  * ละติจูด (latitude)
  * ลองจิจูด (longitude)

---

### 🔸 `LineSendImagemap`

* **หน้าที่:** ส่งภาพแบบอินเตอร์แอคทีฟ (Imagemap Message) ผ่าน LINE Messaging API
* **การใช้งาน:**

  * กรอก URL ของภาพ (imagemap)
  * กำหนดขนาดของภาพและโซนที่ให้ผู้ใช้คลิกได้ (action areas)
  * กำหนดว่าปุ่มแต่ละโซนจะส่งข้อความอะไร หรือเปิด URL อะไร

---

### 🔸 `LineSendTemplate`

* **หน้าที่:** ส่งข้อความเทมเพลต (Template Message) ผ่าน LINE Messaging API
* **การใช้งาน:**

  * ตั้งค่า `title`, `text`, และ `thumbnailImageUrl`
  * เพิ่มปุ่ม Action หลายปุ่ม เช่น

    * Message (ส่งข้อความกลับ)
    * Postback (ส่งข้อมูลแบบซ่อน)
    * URI (เปิดเว็บเพจ)

---

### 🔸 `LineSendFlex`

* **หน้าที่:** ส่งข้อความแบบ Flex Message ซึ่งเป็นข้อความที่ออกแบบได้อิสระ (คล้ายกับ HTML + JSON layout)
* **การใช้งาน:**

  * ส่ง JSON structure ของ Flex Message ที่กำหนดเอง
  * สามารถออกแบบรูปแบบข้อความได้ซับซ้อน เช่น บล็อกข้อความ รูปภาพ ปุ่ม กรอบ และอื่น ๆ

---

### 🔸 `LineWebhook`

* **หน้าที่:** รับข้อความหรือ event ต่าง ๆ ที่เกิดขึ้นจาก LINE Platform ผ่าน Webhook
* **การใช้งาน:**

  * ใช้ Node นี้เพื่อตั้งค่า webhook endpoint ใน n8n
  * รอรับข้อความ, การกดปุ่ม, การติดตาม หรือเหตุการณ์ต่าง ๆ ที่เกิดขึ้นใน LINE
---

ถ้าต้องการตัวอย่างโค้ด หรือวิธีตั้งค่ารายละเอียดในแต่ละ Node เพิ่มเติม แจ้งได้ครับ!


---

## 📸 ตัวอย่าง Workflow

ส่งข้อความและสติกเกอร์ให้ผู้ใช้งานผ่าน LINE Bot อย่างง่ายดาย:

![](https://github-production-user-asset-6210df.s3.amazonaws.com/104154862/471190349-958116d4-88de-4f6a-9983-9aa9fcccd844.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAVCODYLSA53PQK4ZA%2F20250727%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250727T092942Z&X-Amz-Expires=300&X-Amz-Signature=034510b058e9ffe89a179bdd38e9b0175dff9399b56a2c6c23ed87f2ece10498&X-Amz-SignedHeaders=host)

---

## 📚 อ้างอิง

* [LINE Messaging API Docs](https://developers.line.biz/en/docs/messaging-api/)
* [n8n Custom Nodes](https://docs.n8n.io/integrations/creating-nodes/)
* [LINE Sticker ID List](https://developers.line.biz/en/docs/messaging-api/sticker-list/)

---

## 📝 License

MIT License © 2025
