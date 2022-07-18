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

const os = require('os');

const ezio = require('../events');
const { runtime } = require('../lib/function');
const lang = ezio.getString("system_stats");
// const fs = require('fs');
// const path = require('path');

var ov_time = new Date().toLocaleString('ID', { timeZone: 'Asia/Colombo' })// .split(' ')[1]

ezio.addCommand(
  {
    pattern: ["alive", "bot", "system_status"],
    desc: lang.ALIVE_DESC,
    sucReact: "🥰",
    category: ["system", "all"],
  },
  async (message, client) => {
    const text = `
┌─❖
│「 Hi 👋 」
└┬❖ 「 ${message.client.name} 」
┌┤✑  I'm alive Now🎉
││✑  🐦🖐️!!
│└───────────────┈ ⳹
│ 「 BOT INFO 」
│✙ 𝗥𝘂𝗻𝘁𝗶𝗺𝗲 : ${runtime(process.uptime())}
│✙ 𝗕𝗼𝘁 𝗡𝗮𝗺𝗲 : Whats_Bot_MD
│✙ 𝗢𝘄𝗻𝗲𝗿 𝗡𝗮𝗺𝗲 : Dark_Ezio
│✙ 𝗢𝘄𝗻𝗲𝗿 𝗡𝘂𝗺𝗯𝗲𝗿 : ${ezio.jsonConfig.owner[1]}
│✙ 𝗛𝗼𝘀𝘁 𝗡𝗮𝗺𝗲 : ${os.hostname()}
│✙ 𝗣𝗹𝗮𝘁𝗳𝗼𝗿𝗺 : ${os.platform()}
│✙ 𝗧𝗼𝘁𝗮𝗹 𝗨𝘀𝗲𝗿 : ${undefined}
└┬──────────────┈ ⳹
 │✑  Time ${ov_time}
 │✑  Please Select The Button Below.
 └───────────────┈ ⳹`;

    const templateButtons = [
      {
        urlButton: {
          displayText: "📰 Subscrib On YouTube 📍",
          url: "https://www.youtube.com/channel/UCeDeaDD8dpdMT2gO3VHY1JQ",
        },
      },
      {
        urlButton: {
          displayText: "📟 My Blogs",
          url: "https://aidarkezio.github.io/",
        },
      },
      { quickReplyButton: { displayText: "🔖 All Menu 🔖", id: ".allmenu" } },
    ];

    const buttonMessage = {
      image: {
        url: "https://camo.githubusercontent.com/23f3195d91e7095ae37ef6a22475b9f1206f8334bc3e5ca61637f7d7e8cf962a/68747470733a2f2f692e70696e696d672e636f6d2f373336782f66662f38372f62372f66663837623730653963396465613464396361333263393533386138316333622e6a7067",
      },
      text,
      footer: ezio.jsonConfig.footer,
      templateButtons,
    };

    await client.sendMessage(message.client.jid, buttonMessage, {
      quoted: message,
    });
    global.catchError = false;
  }
);

