const event = require("../events");
const { MessageType } = require("@adiwajshing/baileys");
const GM = "it sends good morning message";


event.addCommand(
  { pattern: "gm", fromMe: true, deleteCommand: true, desc: GM },
  async (message, match) => {
    var r_text = new Array();

    r_text[1] = "❀🍃Good❀ ❀morning❀🥰❀";
    r_text[2] = "☘️𝐺𝑜𝑜𝑑 🌅𝑚𝑜𝑟𝑛𝑖𝑛𝑔 💐";
    r_text[3] = "🍃𝙶𝚘𝚘𝚍 🌻𝚖𝚘𝚛𝚗𝚒𝚗𝚐 🥰";
    r_text[4] = "🍀𝗚𝗼𝗼𝗱 😘𝗺𝗼𝗿𝗻𝗶𝗻𝗴 🌸";
    r_text[5] = "🌻𝓖𝓸𝓸𝓭 𝓶𝓸𝓻𝓷𝓲𝓷𝓰 💞";
    r_text[6] = "🌼🅖🅞🅞🅓 🅜🅞🅡🅝🅘🅝🅖 🐶";
    r_text[7] = "🍃Ⓖⓞⓞⓓ 🌈ⓜⓞⓡⓝⓘⓝⓖ 🥰";

    var i = Math.floor(8 * Math.random());

    await message.client.msReply(r_text[i]);
  }
);
