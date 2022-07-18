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
let { isUrl } = require("../lib/myfunc");
let { yta, ytv } = require("../lib/yToMate");

ezio.addCommand(
  {
    pattern: ["ytmp3", "getmusic", "ytaudio"],
    desc: lang.SONG_DESC,
    sucReact: "📥",
    category: ["downloade", "all"],
  },
  async (message, client) => {

    if (!message.forPattern.text) {
      global.catchError = true;
      return await client.sendErrorMessage(
        message.client.jid,
        `Example : ${
          message.forPattern.prefix + message.forPattern.command
        } https://youtube.com/watch?v=PtFMh6Tccag%27 128kbps`,
        message.key,
        message
      );
    }

    let quality = message.forPattern.args[1]
      ? message.forPattern.args[1]
      : "320kbps";

    let media = await yta(message.forPattern.text, quality);
    if (media.filesize >= 999999) { 
      global.catchError = true;
      return await client.sendErrorMessage(
        message.client.jid,
        "File Over Limit " + util.format(media),
        message.key,
        message
      );
    }

    await client.sendImage(
      message.client.jid,
      media.thumb,
      `♻ Title : ${media.title}\n♻ File Size : ${
        media.filesizeF
      }\n♻ Url : ${isUrl(
        message.forPattern.text
      )}\n♻ Ext : MP3\n♻ Resolution : ${
        message.forPattern.args[1] || "320kbps"
      }`,
      message
    );

    const audio = await client.sendMessage(
      message.client.jid,
      {
        audio: { url: media.dl_link },
        mimetype: "audio/mpeg",
        fileName: `${media.title}.mp3`,
      },
      { quoted: message }
    );
    await client.sendReact(message.client.jid, "🎧", audio.key);
    global.catchError = false;
  }
  
);

ezio.addCommand(
  {
    pattern: ["ytmp4", "getvideo", "ytvideo"],
    desc: lang.VIDEO_DESC,
    sucReact: "📥",
    category: ["downloade", "all"],
  },
  async (message, client) => {
    if (!message.forPattern.text) {
      global.catchError = true;
      return await client.sendErrorMessage(
        message.client.jid,
        `Example : ${
          message.forPattern.prefix + message.forPattern.command
        } https://youtube.com/watch?v=PtFMh6Tccag%27 360p`,
        message.key,
        message
      );
    }

    let quality = message.forPattern.args[1]
      ? message.forPattern.args[1]
      : "360p";

    let media = await ytv(message.forPattern.text, quality);
    if (media.filesize >= 999999) {
      global.catchError = true;
      return await client.sendErrorMessage(
        message.client.jid,
        "File Over Limit " + util.format(media),
        message.key,
        message
      );
    }

    const video = await client.sendMessage(
      message.client.jid,
      {
        video: { url: media.dl_link },
        mimetype: "video/mp4",
        fileName: `${media.title}.mp4`,
        caption: `♻ Title : ${media.title}\n♻ File Size : ${
          media.filesizeF
        }\n♻ Url : ${isUrl(text)}\n♻ Ext : MP4\n♻ Resolution : ${
          message.forPattern.args[1] || "360p"
        }`,
      },
      { quoted: message }
    );
    await client.sendReact(message.client.jid, '🎞', video.key);
    global.catchError = false;
  }
);
