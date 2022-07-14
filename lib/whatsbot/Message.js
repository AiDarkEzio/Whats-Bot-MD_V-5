const fs = require('fs');
const path = require('path');

const Message = (conn, msg) => {
    // this.id = data.key.id === undefined ? undefined : data.key.id;
    const { type, isGroup, sender, from } = msg;
    this.client = conn;
    this.msg = msg;
    this.jid = msg.chat;

    this.msgReply = async (text) => {
        client.sendMessage(
            jid,
            {
                text,
                contextInfo: {
                    externalAdReply: {
                        title: ` Whats_Bot_MD`,
                        body: ` Ai_Dark_Ezio`,
                        previewType: "PHOTO",
                        thumbnailUrl: "https://raw.githubusercontent.com/AiDarkEzio/Whats-Bot/master/GojoMedia/D_E-TMB.jpg",
                        thumbnail: fs.readFileSync(path.join(__dirname, "..", "..", "Media", "D_E-DPC.jpg")),
                        sourceUrl: "https://raw.githubusercontent.com/AiDarkEzio/Whats-Bot/master/GojoMedia/D_E-DPC.jpg",
                    },
                },
            },
            { quoted: msg }
        );
    };

    // this.sendMessage = () => {
    //     GojoMdNx.sendText = (jid, text, quoted = "", options) =>
    //       GojoMdNx.sendMessage(jid, { text: text, ...options }, { quoted });
    // }
};

module.exports = Message;
