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

const got = require("got");
const ezio = require("../events");
const conf = require("../lib/config");
const lang = ezio.getString("webss");

ezio.addCommand(
  {
    pattern: ["ss"],
    desc: lang.SS_DESC,
    sucReact: "🌍",
    category: ["all", "create"],
  },
  async (message, client) => {
    if (!message.forPattern.args[0]) {
      global.catchError = true;
      return await client.sendMessage(
        message.client.jid,
        { text: ezio.errorMessage(lang.LINK) },
        { quoted: message }
      );
    }
    try {
      const torken = process.env.SS;
      const uri = encodeURI(args[0]);
      const url = `https://shot.screenshotapi.net/screenshot?token=${torken}&url=${uri}&file_type=jpeg&full_page=true`;

      const response = await got(url);
      const json = JSON.parse(response.body);
      await client.sendMessage(
        message.client.jid,
        { image: { url: json.screenshot }, caption: conf.cap },
        { quoted: message }
      );
    } catch (error) {
      global.catchError = true;
      return await client.sendErrorMessage(
        message.client.jid,
        error,
        message.key,
        message
      );
    }
    global.catchError = false;
  }
);

// {
//     "screenshot": "https://screenshotapi-dot-net.storage.googleapis.com/apple_com_cdba63c85024.jpeg",
//     "url": "https://apple.com",
//     "created_at": "2022-07-19T06:16:16.602Z",
//     "is_fresh": true,
//     "token": "",
//     "file_type": "jpeg",
//     "full_page": "true",
//     "ttl": "2022-08-18T06:16:10.806Z"
// }