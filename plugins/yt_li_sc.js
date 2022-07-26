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
    pattern: ["play-list", "song-list", "ytplay-list"],
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

    try {
      // const results = await yts(message.client.text)
      // let result = results.videos;
      // let items = []
      const sections = [
        {
          title: "Section 1",
          rows: [
            { title: "Option 1", rowId: "option1" },
            {
              title: "Option 2",
              rowId: "option2",
              description: "This is a description",
            },
          ],
        },
        {
          title: "Section 2",
          rows: [
            { title: "Option 3", rowId: "option3" },
            {
              title: "Option 4",
              rowId: "option4",
              description: "This is a description V2",
            },
          ],
        },
      ];

      const listMessage = {
        text: "This is a list" + message.client.text,
        footer: "nice footer, link: https://google.com",
        title: "Amazing boldfaced list title",
        buttonText: "Required, text on the button to view the list",
        sections,
      };

      await client.sendMessage(message.client.jid, listMessage);
      global.catchError = true;
    } catch (error) {
      global.catchError = true;
      return await client.sendErrorMessage(
        message.client.jid,
        error,
        message.key,
        message
      );
    }
  }
);
