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

const {
  extensionForMediaMessage,
  extractMessageContent,
  jidNormalizedUser,
  getContentType,
  normalizeMessageContent,
  proto,
  delay,
  downloadContentFromMessage,
  getBinaryNodeChild,
} = require("@adiwajshing/baileys");
const fs = require("fs");
const FileType = require("file-type");
const path = require("path");
const { getRandom, fetchBuffer, getBuffer } = require("./function");
const ezio = require('../events')
const prefa = ["", "!", ".", "🐦", "🐤", "🗿"];

class WAConnection {
  constructor(conn) {
    for (let v in conn) {
      this[v] = conn[v];
    }
  }

  async serializeM(m) {
    return exports.serialize(this, m);
  }

  parseMention(text) {
    return [...text.matchAll(/@([0-9]{5,16}|0)/g)].map(
      (v) => v[1] + "@s.whatsapp.net"
    );
  }

  async sendText(id, text, quoted = {}, options = {}) {
    this.sendMessage(id, { text, ...options }, { quoted, ...options });
  }

  async downloadMediaMessage(message, fileName) {
    message = message?.msg ? message?.msg : message;
    let mimetype = (message.msg || message).mimetype || "";
    let mtype = message.type
      ? message.type.replace(/Message/gi, "")
      : mimetype.split("/")[0];
    const stream = await downloadContentFromMessage(message, mtype);
    let buffer = Buffer.from([]);
    for await (const chunk of stream) {
      buffer = Buffer.concat([buffer, chunk]);
    }

    if (fileName) {
      let ftype = await FileType.fromBuffer(buffer);
      let trueFileName = fileName
        ? "./temp/" + fileName + "." + ftype.ext || mimetype.split("/")[1]
        : getRandom(ftype.ext || mimetype.split("/")[1]);
      return fs.writeFileSync(trueFileName, buffer);
    } else {
      return buffer;
    }
  }

  async downloadAndSaveMediaMessage(message, filename, attachExtension = true) {
    let quoted = message.msg ? message.msg : message;
    let mime = (message.msg || message).mimetype || "";
    let messageType = message.mtype
      ? message.mtype.replace(/Message/gi, "")
      : mime.split("/")[0];
    const stream = await downloadContentFromMessage(quoted, messageType);
    let buffer = Buffer.from([]);
    for await (const chunk of stream) {
      buffer = Buffer.concat([buffer, chunk]);
    }
    let type = await FileType.fromBuffer(buffer);
    let trueFileName = attachExtension
      ? "./temp/" + filename + "." + type.ext
      : filename;
    // save to file
    await fs.writeFileSync(trueFileName, buffer);
    return trueFileName;
  }

  async getFile(PATH, save) {
    let filename;
    let data = Buffer.isBuffer(PATH)
      ? PATH
      : /^data:.*?\/.*?;base64,/i.test(PATH)
      ? Buffer.from(PATH.split`,`[1], "base64")
      : /^https?:\/\//.test(PATH)
      ? await fetchBuffer(PATH)
      : fs.existsSync(PATH)
      ? ((filename = PATH), fs.readFileSync(PATH))
      : typeof PATH === "string"
      ? PATH
      : Buffer.alloc(0);
    let type = (await FileType.fromBuffer(data)) || {
      mime: "application/octet-stream",
      ext: ".bin",
    };
    filename = path.join(
      __dirname,
      "../temp/" + new Date() * 1 + "." + type.ext
    );
    if (data && save) fs.promises.writeFile(filename, data);
    return {
      filename,
      size: await Buffer.byteLength(data),
      ...type,
      data,
    };
  }

  async sendReact(jid, imog, key) {
    return await this.sendMessage(jid, {
      react: { text: imog, key: key },
    });
  }

  async sendErrorMessage(jid, error, key, quoted) {
    const imog = await ezio.reactArry('ERROR');
    await this.sendMessage(jid, {
      react: { text: imog, key: key },
    });
    await this.sendMessage(
      jid,
      {
        text: ezio.errorMessage(error),
      },
      { quoted: quoted }
    );
  }

  // async sendInfoMessage(jid, Info, key, quoted) {
  //   const imog = "";
  //   await this.sendMessage(jid, {
  //     react: { text: imog, key: key },
  //   });
  //   await this.sendMessage(
  //     jid,
  //     {
  //       text: ezio.infoMessage(Info),
  //     },
  //     { quoted: quoted }
  //   );
  // }

  // async sendSuccessMessage(jid, text, key, quoted) {
  //   const imog = "💖";
  //   await this.sendMessage(jid, {
  //     react: { text: imog, key: key },
  //   });
  //   await this.sendMessage(
  //     jid,
  //     {
  //       text: ezio.successfullMessage(text),
  //     },
  //     { quoted: quoted }
  //   );
  // }

  async sendImage(jid, path, caption = "", quoted = "", options) {
    let buffer = Buffer.isBuffer(path)
      ? path
      : /^data:.*?\/.*?;base64,/i.test(path)
      ? Buffer.from(path.split`,`[1], "base64")
      : /^https?:\/\//.test(path)
      ? await getBuffer(path)
      : fs.existsSync(path)
      ? fs.readFileSync(path)
      : Buffer.alloc(0);

    return await this.sendMessage(
      jid,
      { image: buffer, caption: caption, ...options },
      { quoted }
    );
  }

  async sendFile(jid, PATH, fileName, quoted = {}, options = {}) {
    let types = await this.getFile(PATH, true);
    let { filename, size, ext, mime, data } = types;
    let type = "",
      mimetype = mime,
      pathFile = filename;
    if (options.asDocument) type = "document";
    if (options.asSticker || /webp/.test(mime)) {
      let { writeExif } = require("./sticker");
      let media = { mimetype: mime, data };
      pathFile = await writeExif(media, {
        packname: options.packname ? options.packname : config.exif.packname,
        author: options.author ? options.author : config.exif.author,
        categories: options.categories ? options.categories : [],
      });
      await fs.promises.unlink(filename);
      type = "sticker";
      mimetype = "image/webp";
    } else if (/image/.test(mime)) type = "image";
    else if (/video/.test(mime)) type = "video";
    else if (/audio/.test(mime)) type = "audio";
    else type = "document";
    await this.sendMessage(
      jid,
      { [type]: { url: pathFile }, mimetype, fileName, ...options },
      { quoted, ...options }
    );
    return fs.promises.unlink(pathFile);
  }

  async groupQueryInvite(code) {
    let result = await this.query({
      tag: "iq",
      attrs: {
        type: "get",
        xmlns: "w:g2",
        to: "@g.us",
      },
      content: [{ tag: "invite", attrs: { code } }],
    });
    let group = getBinaryNodeChild(result, "group");
    let descRes = getBinaryNodeChild(group, "description");
    let desc, descId, descOwner, descTime;
    if (descRes) {
      (desc = getBinaryNodeChild(descRes, "body")?.content?.toString()),
        (descId = descRes?.attrs?.id),
        (descOwner = descRes?.attrs?.participant),
        (descTime = descRes?.attrs?.t);
    }
    const hasil = {
      id: group?.attrs?.id.includes("@")
        ? group?.attrs?.id
        : group?.attrs?.id + "@g.us",
      owner: group?.attrs?.creator,
      subject: group?.attrs?.subject,
      subjectOwner: group?.attrs?.s_o,
      subjectTime: group?.attrs?.s_t,
      size: group?.attrs?.size,
      creation: group?.attrs?.creation,
      participants: group?.content
        ?.filter((v) => v.tag == "participant")
        .map((v) => v.attrs),
      desc,
      descId,
      descOwner,
      descTime,
    };

    return hasil;
  }
}
exports.WAConnection = WAConnection;

exports.serialize = (conn, m, options = {}) => {
  if (!m) return m;
  let M = proto.WebMessageInfo;
  m = M.fromObject(m);
  if (m.key) {
    m.from = jidNormalizedUser(m.key.remoteJid || m.key.participant);
    m.fromMe = m.key.fromMe;
    m.id = m.key.id;
    m.isBot = m.id.startsWith("BAE5") && m.id.length == 16;
    m.isGroup = m.from.endsWith("@g.us");
    m.sender = jidNormalizedUser(
      (m.fromMe && conn.user?.id) || m.key.participant || m.from || ""
    );
  }
  if (m.message) {
    m.type = getContentType(m.message);
    m.message = extractMessageContent(m.message);
    m.msg = m.message[m.type];
    m.mentions = m.msg?.contextInfo ? m.msg?.contextInfo.mentionedJid : [];
    m.quoted = m.msg?.contextInfo ? m.msg?.contextInfo.quotedMessage : null;
    if (m.quoted) {
      m.quoted.type = getContentType(m.quoted);
      m.quoted.msg = m.quoted[m.quoted.type];
      m.quoted.mentions = m.msg.contextInfo.mentionedJid;
      m.quoted.id = m.msg.contextInfo.stanzaId;
      m.quoted.sender = jidNormalizedUser(
        m.msg.contextInfo.participant || m.sender
      );
      m.quoted.from = m.from;
      m.quoted.isGroup = m.quoted.from.endsWith("@g.us");
      m.quoted.isBot = m.quoted.id.startsWith("BAE5") && m.quoted.id == 16;
      m.quoted.fromMe =
        m.quoted.sender == jidNormalizedUser(conn.user && conn.user?.id);
      m.quoted.text =
        m.quoted.msg?.text ||
        m.quoted.msg?.caption ||
        m.quoted.msg?.conversation ||
        m.quoted.msg?.contentText ||
        m.quoted.msg?.selectedDisplayText ||
        m.quoted.msg?.title ||
        "";
      let vM = (m.quoted.fakeObj = M.fromObject({
        key: {
          remoteJid: m.quoted.from,
          fromMe: m.quoted.fromMe,
          id: m.quoted.id,
        },
        message: m.quoted,
        ...(m.quoted.isGroup ? { participant: m.quoted.sender } : {}),
      }));
      m.quoted.delete = () =>
        conn.sendMessage(m.quoted.from, { delete: vM.key });
      m.quoted.download = (pathFile) =>
        conn.downloadMediaMessage(m.quoted.msg, pathFile);
    }
  }
  m.download = (pathFile) => conn.downloadMediaMessage(m.msg, pathFile);
  m.body = m.text =
    m.message?.conversation ||
    m.message?.[m.type]?.text ||
    m.message?.[m.type]?.caption ||
    m.message?.[m.type]?.contentText ||
    m.message?.[m.type]?.selectedDisplayText ||
    m.message?.[m.type]?.title ||
    "";
  m.reply = (text, chatId = m.from, options = {}) => {
    Buffer.isBuffer(text)
      ? conn.sendFile(chatId, text, "file", "", m, { ...options })
      : conn.sendText(chatId, text, m, { ...options });
  };

  m.client = {
    jid: m.from,
    id: m.key.id,
    isMe: m.fromMe,
    name: m.fromMe ? conn.user.name : m.pushName,
  };

  m.forPattern = {};

  m.forPattern.body =
    m.type == "buttonsResponseMessage"
      ? m.message[m.type].selectedButtonId
      : m.type == "listResponseMessage"
      ? m.message[m.type].singleSelectReply.selectedRowId
      : m.type == "templateButtonReplyMessage"
      ? m.message[m.type].selectedId
      : m.text;

  m.forPattern.prefix = prefa
    ? /^[°•π÷×¶∆£¢€¥®™+✓_=|~!?@#$%^&.©^]/gi.test(m.forPattern.body)
      ? m.forPattern.body.match(/^[°•π÷×¶∆£¢€¥®™+✓_=|~!?@#$%^&.©^]/gi)[0]
      : ""
    : prefa ?? global.prefix;

  m.forPattern.command = m.forPattern.body
    .replace(m.forPattern.prefix, "")
    .trim()
    .split(/ +/)
    .shift()
    .toLowerCase();

  m.forPattern.args = m.forPattern.body.trim().split(/ +/).slice(1);

  m.forPattern.text = m.forPattern.args.join(" ");

  return m;
};
