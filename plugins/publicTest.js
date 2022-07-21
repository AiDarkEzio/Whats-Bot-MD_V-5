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
const axios = require("axios");
const conf = require("../lib/config");
const lang = ezio.getString("wallpaper");

ezio.addCommand(
  {
    pattern: ["pub-test"],
    desc: lang.WP,
    sucReact: "💖",
    category: ["all", "downloade"],
  },
  async (message, client) => {
        try {
          var resImage = await axios.get(
            "https://raw.githubusercontent.com/AiDarkEzio/Whats-Bot/master/GojoMedia/D_E-TMB.jpg",
            { responseType: "arraybuffer" }
          );
          const urlPrintVw = {
            "canonical-url": "https://AiDarkEzio.github.io",
            "matched-text": "Subadra Bro",
            title: "Ai_Dark_Ezio",
            description: "Whats Bot MD",
            jpegThumbnail: Buffer.from(resImage.data),
          };
          await client.sendMessage(message.client.jid, {
            text: "oh hello there",
            linkPreview: urlPrintVw,
          });
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
