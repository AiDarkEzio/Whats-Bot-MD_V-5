/* ═══════════════════════════════════════════════════════ //
=> If you want to recode, reupload,
=> or copy the codes/script,
=> pls give credit,
=> no credit? i will take action immediately.
==> Copyright (C) 2022 Dark_Ezio.
==> Licensed under the  MIT License;
===> you may not use this file except in compliance with the License.
=> Thank you to Lord Buddha, Family and Myself.
=> Whats Bot - Dark_Ezio.
// ════════════════════════════ */

const ezio = require("../events");
const lang = ezio.getString("whats_bot");
const fs = require('fs')
const path = require('path')
const got = require('got')
const axios = require('axios')

var webimage = await axios.get(
  `https://raw.githubusercontent.com/AiDarkEzio/Whats-Bot/master/GojoMedia/D_E-DPC.jpg`,
  { responseType: "arraybuffer" }
);

ezio.addCommand(
  {
    pattern: ['for-my-test'],
    desc: "",
    sucReact: "💖",
    category: ["all"],
  },
  async (message, client) => {
    await client.sendMessage(
      message.client.jid,
      {
        text: "oh hello there",
        contextInfo: {
          externalAdReply: {
            title: ` Whats_Bot-MD`,
            body: ` Ai_Dark_Ezio`,
            previewType: "PHOTO",
            thumbnailUrl: `https://raw.githubusercontent.com/AiDarkEzio/Whats-Bot/master/GojoMedia/D_E-DPC.jpg`,
            thumbnail: fs.readFileSync(
              path.join(__dirname, "..", "Media", "D_E-DPC.jpg")
            ),
            sourceUrl: "https://aidarkezio.github.io",
          },
        },
      },
      { quoted: message }
    );

    await client.sendMessage(
      message.client.jid,
      {
        text: "oh hello there",
        contextInfo: {
          externalAdReply: {
            title: ` Whats_Bot-MD`,
            body: ` Ai_Dark_Ezio`,
            mediaType: 2,
            thumbnail:
              "https://raw.githubusercontent.com/AiDarkEzio/Whats-Bot/master/GojoMedia/D_E-DPC.jpg",
            sourceUrl: `https://aidarkezio.github.io`,
            mediaUrl: `https://www.youtube.com/watch?v=zZfCIFbZ_rc`,
          },
        },
      },
      { quoted: message }
    );

    await client.sendMessage(
      message.client.jid,
      {
        text: "oh hello there",
        contextInfo: {
          externalAdReply: {
            title: ` Whats_Bot-MD`,
            body: ` Ai_Dark_Ezio`,
            mediaType: 2,
            thumbnail:
              "https://raw.githubusercontent.com/AiDarkEzio/Whats-Bot/master/GojoMedia/D_E-DPC.jpg",
            sourceUrl: `https://aidarkezio.github.io`,
            mediaUrl: `https://www.youtube.com/watch?v=zZfCIFbZ_rc`,
          },
        },
      },
      {
        quoted: {
          key: message.key,
          message: {
            forwardingScore: 999, 
            isForwarded: true,
            orderMessage: {
              itemCount: 100,
              status: 200,
              thumbnail: "https://raw.githubusercontent.com/AiDarkEzio/Whats-Bot/master/GojoMedia/D_E-DPC.jpg",
              surface: 200,
              message: `Dark Ezio`,
              orderTitle: "xeon",
              sellerJid: "0@s.whatsapp.net",
            },
          },
          sendEphemeral: true,
        },
      }
    );

    const templateButtons = [
        {index: 1, urlButton: {displayText: '⭐ Star Baileys on GitHub!', url: 'https://github.com/adiwajshing/Baileys'}},
        {index: 2, callButton: {displayText: 'Call me!', phoneNumber: '+1 (234) 5678-901'}},
        {index: 3, quickReplyButton: {displayText: 'This is a reply, just like normal buttons!', id: 'id-like-buttons-message'}},
    ]

    const templateMessage = {
      text: "Hi it's a template message",
      footer: "Hello World",
      templateButtons: templateButtons,
      headerType: 4,
      image: Buffer(webimage.data),
    };
    
    await client.sendMessage(message.client.jid, templateMessage , {
        quoted: message, 
        message: {
            imageMessage: {
            url: "https://mmg.whatsapp.net/d/f/At0x7ZdIvuicfjlf9oWS6A3AR9XPh0P-hZIVPLsI70nM.enc",
            mimetype: "image/jpeg",
            caption: "⦁⦁ Amazone: Processing... ⦁⦁",
            fileSha256: "+Ia+Dwib70Y1CWRMAP9QLJKjIJt54fKycOfB2OEZbTU=",
            fileLength: "28777",
            height: 1080,
            width: 1079,
            mediaKey: "vXmRR7ZUeDWjXy5iQk17TrowBzuwRya0errAFnXxbGc=",
            fileEncSha256: "sR9D2RS5JSifw49HeBADguI23fWDz1aZu4faWG/CyRY=",
            directPath:
                "/v/t62.7118-24/21427642_840952686474581_572788076332761430_n.enc?oh=3f57c1ba2fcab95f2c0bb475d72720ba&oe=602F3D69",
            mediaKeyTimestamp: "1610993486",
            jpegThumbnail: fs.readFileSync(path.join(__dirname, "..", "Media", "D_E-DPC.jpg")),
            },
        },
    });

  }
);

      