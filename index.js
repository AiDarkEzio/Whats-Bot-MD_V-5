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
} = require("@adiwajshing/baileys");
const { serialize, WAConnection } = require("./lib/simple");
const event = require('./events')
const messageHandler = require("./module");
const { prefa } = require("./global");

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
  fs.readdirSync("./" + name).forEach((plugin) => {
    if (path.extname(plugin).toLowerCase() == ".js") {
      require("./" + name + "/" + plugin);
    }
  });
}


// start a connection
const Whats_Bot_MD = async () => {
  readPlugins("plugins");
  const { state, saveCreds } = await useMultiFileAuthState(
    "./session/baileys_auth_info"
  );
  const { version, isLatest } = await fetchLatestBaileysVersion();
  console.log(`using WA v${version.join(".")}, isLatest: ${isLatest}`);
  let connOptions = {
    version,
    logger: P({ level: "silent" }),
    printQRInTerminal: true,
    auth: state,
  };
  const conn = new WAConnection(makeWASocket(connOptions));

  store.bind(conn.ev);

  conn.ev.on("chats.set", () => {
    console.log("got chats", store.chats.all());
  });

  conn.ev.on("contacts.set", () => {
    console.log("got contacts", Object.values(store.contacts));
  });

  conn.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === "close") {
      let reason = new Boom(lastDisconnect?.error)?.output.statusCode;
      if (reason === DisconnectReason.badSession) {
        console.log(`Bad Session File, Please Delete Session and Scan Again`);
        conn.logout();
      } else if (reason === DisconnectReason.connectionClosed) {
        console.log("Connection closed, reconnecting....");
        Whats_Bot_MD();
      } else if (reason === DisconnectReason.connectionLost) {
        console.log("Connection Lost from Server, reconnecting...");
        Whats_Bot_MD();
      } else if (reason === DisconnectReason.connectionReplaced) {
        console.log("Connection Replaced, Another New Session Opened, Please Close Current Session First");
        conn.logout();
      } else if (reason === DisconnectReason.loggedOut) {
        console.log(`Device Logged Out, Please Scan Again And Run.`);
        process.exit();
      } else if (reason === DisconnectReason.restartRequired) {
        console.log("Restart Required, Restarting...");
        Whats_Bot_MD();
      } else if (reason === DisconnectReason.timedOut) {
        console.log("Connection TimedOut, Reconnecting...");
        Whats_Bot_MD();
      } else {
        console.log("Connection closed. You are logged out.");
        process.exit();
      }
    } else if (connection === "open") {
      console.log(`\n 👩‍🦰 Login successful!▶\n`);
    }
    console.log("Connected...: " + connection);
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
      const buttons = [
        { buttonId: "", buttonText: { displayText: "Closed" }, type: 1 },
      ];
      const caption = `「 Group Settings Changed 」\n\nThe Group Has Been Closed By Admin, Now Only Admin Can Send Messages !`;
      const buttonMessage = { image, caption, footer, buttons, headerType: 4 };
      await conn.sendMessage(metadata[0].id, buttonMessage);
    } else if (metadata[0].announce == false) {
      const buttons = [
        { buttonId: "", buttonText: { displayText: "Opend" }, type: 1 },
      ];
      const caption = `「 Group Settings Changed 」\n\nThe Group Has Been Opened By Admin, Now Participants Can Send Messages !`;
      const buttonMessage = { image, caption, footer, buttons, headerType: 4 };
      await conn.sendMessage(metadata[0].id, buttonMessage);
    } else if (metadata[0].restrict == true) {
      const buttons = [
        { buttonId: "", buttonText: { displayText: "Closed" }, type: 1 },
      ];
      const caption = `「 Group Settings Changed 」\n\nGroup Info Has Been Restricted, Now Only Admin Can Edit Group Info !`;
      const buttonMessage = { image, caption, footer, buttons, headerType: 4 };
      await conn.sendMessage(metadata[0].id, buttonMessage);
    } else if (metadata[0].restrict == false) {
      const buttons = [
        { buttonId: "", buttonText: { displayText: "Opend" }, type: 1 },
      ];
      const caption = `「 Group Settings Changed 」\n\nGroup Info Has Been Opened, Now Participants Can Edit Group Info !`;
      const buttonMessage = { image, caption, footer, buttons, headerType: 4 };
      await conn.sendMessage(metadata[0].id, buttonMessage);
    } else {
      const buttons = [
        { buttonId: "", buttonText: { displayText: "Edited" }, type: 1 },
      ];
      const caption = `「 Group Settings Changed 」\n\nGroup Subject Has Been Changed To *${metadata[0].subject}*`;
      const buttonMessage = { image, caption, footer, buttons, headerType: 4 };
      await conn.sendMessage(metadata[0].id, buttonMessage);
    }
  });

  conn.ev.on("messages.upsert", async (chatUpdate) => {
    const msg = serialize(conn, chatUpdate.messages[0]);
    if (!msg.message) return;
    if (msg.key && msg.key.remoteJid == "status@broadcast") return;
    if (config.options.autoRead) {
      await conn.sendReadReceipt(msg.key.remoteJid, msg.key.participant, [msg.key.id]);
    }

    require('./lib/main')(msg)
    
    event.commands.map(async (command) => {
      for (let i in command.pattern) {
        if (command.pattern[i] == msg.forPattern.command) {
          await command.function(msg, conn);
        };
      };
    });

    // messageHandler(conn, msg);
  });

  if (conn.user && conn.user?.id)
    conn.user.jid = jidNormalizedUser(conn.user?.id);

  return conn;
};

Whats_Bot_MD();
