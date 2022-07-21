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

require("link-preview-js");
require("./global");
const P = require("pino");
const fs = require("fs");
const path = require("path");
const { Boom } = require("@hapi/boom");
const {
  default: makeWASocket,
  delay,
  DisconnectReason,
  fetchLatestBaileysVersion,
  makeInMemoryStore,
  useMultiFileAuthState,
  useSingleFileAuthState,
  jidNormalizedUser,
  Browsers,
} = require("@adiwajshing/baileys");
const { serialize, WAConnection } = require("./lib/simple");
const event = require("./events");
const messageHandler = require("./module");

const store = makeInMemoryStore({
  logger: P().child({ level: "silent", stream: "store" }),
});
store.readFromFile("./session/baileys_store_multi.json");
setInterval(() => {
  store.writeToFile("./session/baileys_store_multi.json");
}, 10000);

global.api = (name, path = "/", query = {}, apikeyqueryname) =>
  (name in config.APIs ? config.APIs[name] : name) +
  path +
  (query || apikeyqueryname
    ? "?" +
      new URLSearchParams(
        Object.entries({
          ...query,
          ...(apikeyqueryname ? { [apikeyqueryname]: config.APIs.apikey } : {}),
        })
      )
    : "");

const readPlugins = (name) => {
  console.log("🤖Installing plugins...");
  fs.readdirSync("./" + name).forEach((plugin) => {
    if (path.extname(plugin).toLowerCase() == ".js") {
      require("./" + name + "/" + plugin);
    }
  });
};

// start a connection
const Whats_Bot_MD = async () => {
  const { state, saveCreds } = await useMultiFileAuthState("./session/baileys_auth_info");
  const { version, isLatest } = await fetchLatestBaileysVersion();
  console.log(`using WA v${version.join(".")}, isLatest: ${isLatest}`);
  let connOptions = {
    browser: Browsers.baileys("Dark Ezio"),
    version,
    logger: P({ level: "silent" }),
    printQRInTerminal: true,
    auth: state,
  };
  const conn = new WAConnection(makeWASocket(connOptions));

  readPlugins("plugins");

  store.bind(conn.ev);

  conn.ev.on("chats.set", () => console.log("Got chats: ", store.chats.all()));

  conn.ev.on("contacts.set", () =>
    console.log("Got contacts: ", Object.values(store.contacts))
  );

  conn.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect, } = update;
    if (connection === "close") {
      let reason = new Boom(lastDisconnect?.error)?.output.statusCode;
      if (reason === DisconnectReason.badSession) {
        console.log(
          `\n 👩‍🦰 Bad Session File, Please Delete Session and Scan Again`
        );
        conn.logout();
      } else if (reason === DisconnectReason.connectionClosed) {
        console.log("\n 👩‍🦰 Connection closed, reconnecting....");
        Whats_Bot_MD();
      } else if (reason === DisconnectReason.connectionLost) {
        console.log("\n 👩‍🦰 Connection Lost from Server, reconnecting...");
        Whats_Bot_MD();
      } else if (reason === DisconnectReason.connectionReplaced) {
        console.log(
          "\n 👩‍🦰 Connection Replaced, Another New Session Opened, Please Close Current Session First"
        );
        conn.logout();
      } else if (reason === DisconnectReason.loggedOut) {
        console.log(`\n 👩‍🦰 Device Logged Out, Please Scan Again And Run.`);
        process.exit();
      } else if (reason === DisconnectReason.restartRequired) {
        console.log("\n 👩‍🦰 Restart Required, Restarting...");
        Whats_Bot_MD();
      } else if (reason === DisconnectReason.timedOut) {
        console.log("\n 👩‍🦰 Connection TimedOut, Reconnecting...");
        Whats_Bot_MD();
      } else {
        console.log("\n 👩‍🦰 Connection closed. You are logged out.");
        process.exit();
      }
    } else if (connection === "connecting") {
      console.log(`\n 👩‍🦰 Connecting to WhatsApp...▶`);
    } else if (connection === "open") {
      console.log(`\n 👩‍🦰 Login successful!▶`);
    } else console.log("Connection : " + connection);
  });

  conn.ev.on("creds.update", saveCreds); // listen for when the auth credentials is updated

  conn.ev.on("groups.update", async (metadata) => {
    try {
      dpGroup = await conn.profilePictureUrl(metadata[0].id, "image");
    } catch {
      dpGroup =
        "https://st4.depositphotos.com/5934840/31195/v/450/depositphotos_311951620-stock-illustration-group-of-business-people-avatar.jpg";
    }
    let image = { url: dpGroup };
    let footer = `Group Settings Change Message`;
    if (metadata[0].announce == true) {
      const caption = `「 Group Settings Changed 」\n\nThe Group Has Been Closed By Admin, Now Only Admin Can Send Messages !`;
      const buttonMessage = {
        image,
        caption,
        footer,
        buttons: [],
        headerType: 4,
      };
      await conn.sendMessage(metadata[0].id, buttonMessage);
    } else if (metadata[0].announce == false) {
      const caption = `「 Group Settings Changed 」\n\nThe Group Has Been Opened By Admin, Now Participants Can Send Messages !`;
      const buttonMessage = {
        image,
        caption,
        footer,
        buttons: [],
        headerType: 4,
      };
      await conn.sendMessage(metadata[0].id, buttonMessage);
    } else if (metadata[0].restrict == true) {
      const caption = `「 Group Settings Changed 」\n\nGroup Info Has Been Restricted, Now Only Admin Can Edit Group Info !`;
      const buttonMessage = {
        image,
        caption,
        footer,
        buttons: [],
        headerType: 4,
      };
      await conn.sendMessage(metadata[0].id, buttonMessage);
    } else if (metadata[0].restrict == false) {
      const caption = `「 Group Settings Changed 」\n\nGroup Info Has Been Opened, Now Participants Can Edit Group Info !`;
      const buttonMessage = {
        image,
        caption,
        footer,
        buttons: [],
        headerType: 4,
      };
      await conn.sendMessage(metadata[0].id, buttonMessage);
    } else {
      const caption = `「 Group Settings Changed 」\n\nGroup Subject Has Been Changed To *${metadata[0].subject}*`;
      const buttonMessage = {
        image,
        caption,
        footer,
        buttons: [],
        headerType: 4,
      };
      await conn.sendMessage(metadata[0].id, buttonMessage);
    }
  });

  conn.ev.on("group-participants.update", async (anu) => {
    try {
      let metadata = await conn.groupMetadata(anu.id);
      let participants = anu.participants;
      for (let num of participants) {
        try {
          ppuser = await conn.profilePictureUrl(num, "image");
          ppgroup = await conn.profilePictureUrl(anu.id, "image");
        } catch {
          ppuser =
            "https://i0.wp.com/www.gambarunik.id/wp-content/uploads/2019/06/Top-Gambar-Foto-Profil-Kosong-Lucu-Tergokil-.jpg";
          ppgroup =
            "https://i0.wp.com/www.gambarunik.id/wp-content/uploads/2019/06/Top-Gambar-Foto-Profil-Kosong-Lucu-Tergokil-.jpg";
        }
        let nama = await conn.getName(num);
        memb = metadata.participants.length;

        Kon = await getBuffer(
          `https://hardianto.xyz/api/welcome3?profile=${encodeURIComponent(
            ppuser
          )}&name=${encodeURIComponent(
            nama
          )}&bg=https://telegra.ph/file/8bbe8a7de5c351dfcb077.jpg&namegb=${encodeURIComponent(
            metadata.subject
          )}&member=${encodeURIComponent(memb)}`
        );
        Tol = await getBuffer(
          `https://hardianto.xyz/api/goodbye3?profile=${encodeURIComponent(
            ppuser
          )}&name=${encodeURIComponent(
            nama
          )}&bg=https://telegra.ph/file/8bbe8a7de5c351dfcb077.jpg&namegb=${encodeURIComponent(
            metadata.subject
          )}&member=${encodeURIComponent(memb)}`
        );
        if (anu.action == "add") {
          conn.sendMessage(anu.id, {
            image: Kon,
            contextInfo: { mentionedJid: [num] },
            caption: `
⭐✑ Hi👋 @${num.split("@")[0]},
⭐✑ Welcome To ${metadata.subject}
⭐✑ Description: ${metadata.desc}
⭐✑ Welcome To Our Comfortable Happy😋, Sometimes Loud😜, Usually Messy🤥, Full Of Love🥰, HOME😌!!`,
          });
        } else if (anu.action == "remove") {
          conn.sendMessage(anu.id, {
            image: Tol,
            contextInfo: { mentionedJid: [num] },
            caption: `⭐✑ @${num.split("@")[0]} Left ${metadata.subject}
⭐✑ I'm Not Sure If It Was A Goodbye Charm, But It Was Fun While It Lasted 😌✨`,
          });
        } else if (anu.action == "promote") {
          conn.sendMessage(anu.id, {
            text: `⭐✑ @${
              num.split("@")[0]
            }\n⭐✑ Hi: ${nama}\n⭐✑ Message: You Are New Group Admin`,
            mentions: [num],
          });
        } else if (anu.action == "demote") {
          conn.sendMessage(anu.id, {
            text: `⭐✑ @${
              num.split("@")[0]
            }\n⭐✑ Hi: ${nama}\n⭐✑ Message: You Are not group Group Admin`,
            mentions: [num],
          });
        }
      }
    } catch (err) {
      console.log(err);
    }
  });

  setInterval(async () => {
    const get_localized_date = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    var utch = new Date().toLocaleDateString("EN", get_localized_date);
    var ov_time = new Date()
      .toLocaleString("LK", { timeZone: "Asia/Colombo" })
      .split(" ")[1];
    const biography =
      "📅 " +
      utch +
      "\n⌚ " +
      ov_time +
      "\n\n⏱ Auto Bio By... 🚀 powered By Whats Bot\n\n👨🏼‍💻 Created by Dark_Ezio";
    await conn.updateProfileStatus(biography);
  }, 1000 * 10);

  conn.ev.on("messages.upsert", async (chatUpdate) => {
    const msg = serialize(conn, chatUpdate.messages[0]);
    if (!msg.message) return;
    if (msg.key && msg.key.remoteJid == "status@broadcast") return;
    if (config.options.autoRead) {
      await conn.sendReadReceipt(msg.key.remoteJid, msg.key.participant, [
        msg.key.id,
      ]);
    }
    if (global.mydb.users.indexOf(msg.sender) == -1)
      global.mydb.users.push(msg.sender);

    require("./lib/main")(msg);

    try {
      event.commands.map(async (command) => {
        for (let i in command.pattern) {
          if (
            command.pattern[i] == msg.forPattern.command ||
            command.on == "text"
          ) {
            global.mydb.hits += 1;
            await conn.sendPresenceUpdate("composing", msg.client.jid);
            await conn.sendReact(
              msg.client.jid,
              await event.reactArry("INFO"),
              msg.key
            );
            await command.function(msg, conn);
            global.catchError
              ? ""
              : await conn.sendReact(msg.client.jid, command.sucReact, msg.key);
            await conn.sendPresenceUpdate("available", msg.client.jid);
          }
        }
      });
    } catch (error) {
      return await conn.sendErrorMessage(msg.client.jid, error, msg.key, msg);
    }
  });

  if (conn.user && conn.user?.id)
    conn.user.jid = jidNormalizedUser(conn.user?.id);

  return conn;
};

Whats_Bot_MD();
