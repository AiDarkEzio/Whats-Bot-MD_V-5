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

const yts = require("yt-search");
const ezio = require("../events");
const lang = ezio.getString("scrapers");

ezio.addCommand(
  {
    pattern: ["play", "song", "ytplay"],
    desc: lang.SONG_DESC,
    sucReact: "🔎",
    category: ["search", "all"],
  },
  async (message, client) => {
    if (!message.forPattern.text) {
      global.catchError = true;
      return await client.sendErrorMessage(
        message.client.jid,
        lang.NEED_TEXT_SONG,
        message.key,
        message
      );
    }

    const results = await yts(message.forPattern.text);

    let randm =
      results.videos[Math.floor(Math.random() * results.videos.length)];
    let result = results.videos[0];

    let buttons = [
      {
        buttonId: `.ytmp3 ${result.url}`,
        buttonText: { displayText: "🎼 Audio 🎵" },
        type: 1,
      },
      {
        buttonId: `.ytmp4 ${result.url}`,
        buttonText: { displayText: "🎞 Video 📽️" },
        type: 1,
      },
      {
        buttonId: `.rytplay ${message.forPattern.text}`,
        buttonText: { displayText: "🔎 Random Search 🔍" },
        type: 1,
      },
    ];

    let buttonMessage = {
      image: { url: result.thumbnail },
      caption: `
—————————————————————————
♻ Title : ${result.title}
♻ Ext : Search [first result]
♻ ID : ${result.videoId}
♻ Duration : ${result.timestamp}
♻ Viewes : ${result.views}
♻ Uploaded On : ${result.ago}
♻ Author : ${result.author.name}
♻ Channel : ${result.author.url}
♻ Description : ${result.description}
♻ Url : ${result.url}
—————————————————————————`,
      footer: ezio.jsonConfig.footer,
      buttons: buttons,
      headerType: 4,
    };

    await client.sendMessage(message.client.jid, buttonMessage, {
      quoted: message,
    });
  }
);

ezio.addCommand(
  {
    pattern: ["rplay", "rsong", "rytplay"],
    desc: lang.SONG_DESC,
    sucReact: "🔎",
    category: ["search", "all"],
  },
  async (message, client) => {
    if (!message.forPattern.text){
      global.catchError = true;
      return await client.sendErrorMessage(
        message.client.jid,
        lang.NEED_TEXT_SONG,
        message.key,
        message
      );
    }

    const results = await yts(message.forPattern.text);

    let result =
      results.videos[Math.floor(Math.random() * results.videos.length)];
    let result1 = results.videos[0];

    let buttons = [
      {
        buttonId: `.ytmp3 ${result.url}`,
        buttonText: { displayText: "🎼 Audio 🎵" },
        type: 1,
      },
      {
        buttonId: `.ytmp4 ${result.url}`,
        buttonText: { displayText: "🎞 Video 📽️" },
        type: 1,
      },
      {
        buttonId: `.rytplay ${message.forPattern.text}`,
        buttonText: { displayText: "🔎 Random Search 🔍" },
        type: 1,
      },
    ];

    let buttonMessage = {
      image: { url: result.thumbnail },
      caption: `
—————————————————————————
♻ Title : ${result.title}
♻ Ext : Search [Random result]
♻ ID : ${result.videoId}
♻ Duration : ${result.timestamp}
♻ Viewes : ${result.views}
♻ Uploaded On : ${result.ago}
♻ Author : ${result.author.name}
♻ Channel : ${result.author.url}
♻ Description : ${result.description}
♻ Url : ${result.url}
—————————————————————————`,
      footer: ezio.jsonConfig.footer,
      buttons: buttons,
      headerType: 4,
    };

    await client.sendMessage(message.client.jid, buttonMessage, {
      quoted: message,
    });
    global.catchError = false;
  }
);
