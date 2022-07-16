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
let { yta, ytv } = require("../lib/yToMate");

ezio.addCommand(
  { pattern: ["ytmp3", "getmusic", "ytaudio"], desc: lang.SONG_DESC },
  async (message, client) => {
    if (!message.forPattern.text)
      return await client.sendMessage(
        message.client.jid,
        {
          text: ezio.errorMessage(
            `Example : ${
              message.forPattern.prefix + message.forPattern.command
            } https://youtube.com/watch?v=PtFMh6Tccag%27 128kbps`
          ),
        },
        { quoted: message }
      );

    let quality = message.forPattern.args[1]
      ? message.forPattern.args[1]
      : "320kbps";

    let media = await yta(message.forPattern.text, quality);
    if (media.filesize >= 999999)
      return await client.sendMessage(
        message.client.jid,
        { text: "File Over Limit " + util.format(media) },
        { quoted: message }
      );

    client.sendImage(
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

    client.sendMessage(
      message.client.jid,
      {
        audio: { url: media.dl_link },
        mimetype: "audio/mpeg",
        fileName: `${media.title}.mp3`,
      },
      { quoted: message }
    );
  }
);

ezio.addCommand(
  { pattern: ["ytmp4", "getvideo", "ytvideo"], desc: lang.VIDEO_DESC },
  async (message, client) => {
    if (!message.forPattern.text)
      return await client.sendMessage(
        message.client.jid,
        {
          text: ezio.errorMessage(
            `Example : ${
              message.forPattern.prefix + message.forPattern.command
            } https://youtube.com/watch?v=PtFMh6Tccag%27 360p`
          ),
        },
        { quoted: message }
      );

    let quality = message.forPattern.args[1]
      ? message.forPattern.args[1]
      : "360p";

    let media = await ytv(message.forPattern.text, quality);
    if (media.filesize >= 999999)
      return reply("File Over Limit " + util.format(media));

    client.sendMessage(
      message.client.jid,
      {
        video: { url: media.dl_link },
        mimetype: "video/mp4",
        fileName: `${media.title}.mp4`,
        caption: `♻ Title : ${media.title}\n♻ File Size : ${
          media.filesizeF
        }\n♻ Url : ${isUrl(text)}\n♻ Ext : MP3\n♻ Resolution : ${
          message.forPattern.args[1] || "360p"
        }`,
      },
      { quoted: message }
    );
  }
);
