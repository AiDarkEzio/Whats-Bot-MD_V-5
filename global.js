const fs = require("fs")

global.afk = require("./data/afk")
global._afk = JSON.parse(fs.readFileSync('./database/afk.json'))
global.premium = require("./data/premium")
global._premium = JSON.parse(fs.readFileSync("./database/premium.json"))
global.level = require("./data/level")
global.user = require("./data/user")
global._user = JSON.parse(fs.readFileSync("./database/user.json"))
global.group = require("./data/group")
global._group = JSON.parse(fs.readFileSync("./database/group.json"))
global.rpg = require("./data/rpg")
global._rpg = JSON.parse(fs.readFileSync("./database/rpg.json"))

global.config = JSON.parse(fs.readFileSync('./config.json'))
global.siapakah = {}
global.caklontong = {}
global.family100 = {}
global.tebakkalimat = {}
global.tebakkata = {}
global.asahotak = {}
global.susunkata = {}
global.tebakbendera = {}
global.tebakgambar = {}
global.tebakkabupaten = {}
global.tebaklagu = {}
global.tekateki = {}
global.tebaklirik = {}
global.tebaktebakan = {}
global.mancing = {}
global.nambang = {}

global.mess = (type, m) => {
    let msg = {
        wait: 'Wait, in progress',
        owner: 'Perintah ini hanya dapat digunakan oleh Owner!',
        premium: 'Perintah ini hanya dapat digunakan oleh Premium!',
        group: 'Perintah ini hanya dapat digunakan di group!',
        private: 'Perintah ini hanya dapat digunakan di private chat!',
        admin: 'Perintah ini hanya dapat digunakan oleh admin group!',
        botAdmin: 'Bot bukan admin, tidak dapat mengakses fitur tersebut',
        bot: 'Fitur ini hanya dapat diakses oleh Bot',
        dead: 'Fitur ini sedang dimatikan!',
        media: 'Reply media',
        error: "No Results Found",
        isLimit: "Your limit has run out",
        isLimitGame: "Your limit Game has run out",
        isNsfw: "NSFW belum diaktifkan untuk group ini!",
    }[type]
    if (msg) return m.reply(msg, m.from, { quoted: m })
}

global.mydb = {};
global.mydb.users = new Array;
global.mydb.hits = new Number;

const prefa = ["", "!", ".", "🐦", "🐤", "🗿"];

module.exports = {prefa}