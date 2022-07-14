require("./global")
const { delay } = require("@adiwajshing/baileys")
const axios = require('axios').default
const BodyForm = require('form-data')
const { exec, spawn } = require("child_process")
const Message = require("./lib/whatsbot/Message")
const event = require('./events')
const ffmpeg = require('fluent-ffmpeg')
const fs = require('fs')
const path = require('path')
const moment = require('moment-timezone')
const toMs = require('ms')
const ms = require('parse-ms')
const speed = require('performance-now')
const request = require('request')
const { color, fetchUrl, isUrl, getRandom, sleep, clockString } = require("./lib/function")
const zenz = require('./lib/message')
const prefa = ["", "!", ".", "🐦", "🐤", "🗿"];

fs.readdirSync("./plugins").forEach((plugin) => {
    if (path.extname(plugin).toLowerCase() == ".js") {
    require("./plugins/" + plugin);
    }
});

module.exports = async (conn, msg) => {
    try {
        const { type, isGroup, sender, from } = msg
        const body = (type == "buttonsResponseMessage") ? msg.message[type].selectedButtonId : (type == "listResponseMessage") ? msg.message[type].singleSelectReply.selectedRowId : (type == "templateButtonReplyMessage") ? msg.message[type].selectedId : msg.text 
        const senderName = msg.pushName
        const senderNumber = sender.split('@')[0]
        const groupMetadata = isGroup ? await conn.groupMetadata(from) : null
        const groupName = groupMetadata?.subject || ''
        const groupMembers = groupMetadata?.participants || []
        const groupAdmins = groupMembers.filter((v) => v.admin).map((v) => v.id)
        const isGroupAdmins = groupAdmins.includes(sender)
        const isBotGroupAdmins = groupAdmins.includes(conn.user?.jid)
        const isOwner = [conn.user?.jid, ...config.owner].map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(sender)

        const isPremium = premium.checkPremiumUser(msg.sender, isOwner, _premium)
        const isAfkOn = afk.checkAfkUser(msg.sender, _afk) 
        const isLevelingOn = group.cekLeveling(msg.from, _group)
        const isAntidelete = group.cekAntidelete(msg.from, _group)
        const isOffline = group.cekOffline(msg.from, _group)
        const isAntilink = group.cekAntilink(msg.from, _group)
        const isNsfw = group.cekNsfw(msg.from, _group)

        var prefix = prefa ? /^[°•π÷×¶∆£¢€¥®™+✓_=|~!?@#$%^&.©^]/gi.test(body) ? body.match(/^[°•π÷×¶∆£¢€¥®™+✓_=|~!?@#$%^&.©^]/gi)[0] : "" : prefa ?? '.'
        const isCmd = body.startsWith(prefix);
        const _isCmd = /^[°•π÷×¶∆£¢€¥®™✓_=|~!?#$%^&.+-,\\\©^]/.test(body) && conn.sendPresenceUpdate('composing', from)
        const _prefix = _isCmd ? body[0] : ''
        const command = isCmd ? body.slice(1).trim().split(' ').shift().toLowerCase() : ''
        const quoted = msg.quoted ? msg.quoted : msg
        const budy = (typeof msg.text == "string" ? msg.text : "")
        const args = body.trim().split(' ').slice(1)
        const fargs = body.replace(command, '').slice(1).trim()
        const ar = args.map((v) => v.toLowerCase())
        const text = q = args.join(" ")    
        const time = moment().tz(config.timezone).format('HH:mm:ss')

        if (isCmd && isOffline && !isGroupAdmins && !isOwner) {
            return msg.reply('Bot is disabled for this group')
        }

        if (!isGroup && !isCmd) console.log(color(`[ ${time} ]`, 'white'), color('[ PRIVATE ]', 'yellow'), color(body.slice(0, 50), 'white'), 'from', color(senderNumber, 'yellow'))
        if (isGroup && !isCmd) console.log(color(`[ ${time} ]`, 'white'), color('[  GROUP  ]', 'yellow'), color(body.slice(0, 50), 'white'), 'from', color(senderNumber, 'yellow'), 'in', color(groupName, 'yellow'))
        if (!isGroup && isCmd) console.log(color(`[ ${time} ]`, 'white'), color('[ COMMAND ]', 'yellow'), color(body, 'white'), 'from', color(senderNumber, 'yellow'))
        if (isGroup && isCmd) console.log(color(`[ ${time} ]`, 'white'), color('[ COMMAND ]', 'yellow'), color(body, 'white'), 'from', color(senderNumber, 'yellow'), 'in', color(groupName, 'yellow'))

        const mentionByTag = msg.type == "extendedTextMessage" && msg.message.extendedTextMessage.contextInfo != null ? msg.message.extendedTextMessage.contextInfo.mentionedJid : []
        const mentionByreply = msg.type == "extendedTextMessage" && msg.message.extendedTextMessage.contextInfo != null ? msg.message.extendedTextMessage.contextInfo.participant || "" : ""       
        const mention = typeof(mentionByTag) == 'string' ? [mentionByTag] : mentionByTag
        mention != undefined ? mention.push(mentionByreply) : []
        const mentionUser = mention != undefined ? mention.filter(n => n) : [] 
 
        premium.expiredCheck(conn, msg, _premium)
        if (isGroup) group.addGroup(msg.from)

        if (isCmd && !msg.key.fromMe) {

            rpg.addRpg(msg.sender, _rpg)
            user.addUser(msg.sender, msg.pushName, _user)

            const levelRole = level.getLevelingLevel(msg.sender, _user)
            var role = 'Warrior'
            if (levelRole <= 10) {
                role = 'Warrior'
            } else if (levelRole <= 20) {
                role = 'Elite'
            } else if (levelRole <= 30) {
                role = 'Master'
            } else if (levelRole <= 40) {
                role = 'Grand Master'
            } else if (levelRole <= 50) {
                role = 'Epic'
            } else if (levelRole <= 60) {
                role = 'Epical Abadi'
            } else if (levelRole <= 70) {
                role = 'Epical Glory'
            } else if (levelRole <= 80) {
                role = 'Legends'
            } else if (levelRole <= 90) {
                role = 'Mythic'
            } else if (levelRole >= 100) {
                role = `Mythical Glory`
            }
        }

        if (isGroup && !level.isGained(msg.sender) && isLevelingOn && isCmd && !msg.key.fromMe) {
            try {
                level.addCooldown(msg.sender)
                const currentLevel = level.getLevelingLevel(sender, _user)
                const amountXp = Math.floor(Math.random() * 5) + 5
                const requiredXp = 20 * Math.pow(currentLevel, 2) + 50 * currentLevel + 100
                level.addLevelingXp(sender, amountXp, _user)
                if (requiredXp <= level.getLevelingXp(sender, _user)) {
                    level.addLevelingLevel(sender, 1, _user)
                    const userLevel = level.getLevelingLevel(sender, _user)
                    const fetchXp = 20 * Math.pow(userLevel, 2) + 50 * userLevel + 100
                    msg.reply(`*LEVELUP*\n\n*XP :* ${level.getLevelingXp(sender, _user)} / ${fetchXp}\n*Level:* ${currentLevel} -> ${level.getLevelingLevel(sender, _user)}`)
                }
            } catch (err) {
                console.error(err)
            }
        }

        if (isGroup && isLevelingOn && isCmd && !msg.key.fromMe) {
            try {
                level.addCooldown(msg.sender)
                const uangsaku = Math.floor(Math.random() * 5) + 5
                user.addBalance(msg.sender, uangsaku, _user)
            } catch (err) {
                console.error(err)
            }
        }

        if (isGroup) {
            for (let x of mentionUser) {
                if (afk.checkAfkUser(x, _afk)) {
                    const getId = afk.getAfkId(x, _afk)
                    const getReason = afk.getAfkReason(getId, _afk)
                    const getSejak = afk.getAfkSejak(getId, _afk) 
                    if (msg.key.fromMe) { return }
                    const afkMentioned = `*Notice, Sedang AFK*\n\nDengan Alasan : ${getReason}\nTelah AFK Sejak : ${getSejak}`
                    msg.reply(afkMentioned)
                }
            }
            if (afk.checkAfkUser(msg.sender, _afk)) {
                const afkDone = `*${msg.pushName}*\nTelah kembali dari AFK!\n\nSelama ${clockString(new Date - afk.getAfkTime(msg.sender, _afk))}\nSejak : ${afk.getAfkSejak(msg.sender, _afk)}`
                _afk.splice(afk.getAfkPosition(msg.sender, _afk), 1)
                fs.writeFileSync('./database/afk.json', JSON.stringify(_afk))
                msg.reply(afkDone)
            }
        }
        
        if (config.options.self && !isOwner && !msg.fromMe) return
        // if (command && !isGroup) return global.mess("group", m)

        try {
            const whats = Message(conn, msg);
            event.commands.map(async (cmd) => {
                if ((cmd.pattern = command)) {
                  await cmd.function(whats, msg);
                };
            });           
        } catch (err) {
            console.log(err);
        }

        switch (command) {
            // USERS COMMNAND
            case 'inv': case 'tas': case 'inventory': {
                if (command && !isGroup) return global.mess("group", msg)
                const balance = user.getBalance(msg.sender, _user)
                const fish = rpg.getIkan(msg.sender, _rpg)
                const batu = rpg.getBatu(msg.sender, _rpg)
                const permata = rpg.getPermata(msg.sender, _rpg)
                const emas = rpg.getEmas(msg.sender, _rpg)
                msg.reply(zenz.inventory(senderName, balance, fish, batu, permata, emas))
            }
			break
            case 'afk': {
			if (!isGroup) return global.mess("group", msg)
            if (user.isLimit(msg.sender, isPremium, isOwner, config.options.limitCount, _user) && !msg.fromMe) return global.mess("isLimit", msg)
                if (isAfkOn) return reply("AFK telah aktifkan sebelumnya")
                const reason = q ? q : 'Nothing.'
                const date = + new Date
                afk.addAfkUser(msg.sender, date, reason, time, _afk)
                msg.reply(`*AFK berhasil diaktifkan!*\n\nNama: ${msg.pushName}\nAlasan: ${reason}`)
                user.limitAdd(msg.sender, isPremium, isOwner, _user)
            }
            break
            case 'limit': case 'ceklimit': {
			    if (isPremium || isOwner) return msg.reply(`Limit: Unlimited\nLimit Game: ${user.getLimitGame(msg.sender, _user)} / ${config.options.limitgameCount} Max\n\nBalance : ${user.getBalance(msg.sender, _user)}`)
			    msg.reply(`Limit left: ${user.getLimit(msg.sender, _user)} / ${config.options.limitCount} Max\nLimit Game: ${user.getLimitGame(msg.sender, _user)} / ${config.options.limitgameCount} Max\nBalance : ${user.getBalance(msg.sender, _user)}\n\n_Limit direset tiap pukul 00:00_`)
            }
			break
            case 'cekpremium': case 'cekprem': {
                if (command && !isGroup) return global.mess("group", msg)
                if (!isPremium) return global.mess("premium", msg)
                let cekprem = require("parse-ms")((await premium.getPremiumExpired(msg.sender, _premium)) - Date.now())
                let caption = `*Expired :* ${cekprem.days} day ${cekprem.hours} hour ${cekprem.minutes} minute ${cekprem.seconds} Second`
                conn.sendText(msg.from, caption, msg)
            }
            break
            case 'profile': case 'me': {
                if (command && !isGroup) return global.mess("group", msg)
                let statuses
                try {
                    statuses = await conn.fetchStatus(msg.sender);
                } catch {
                    statuses = "Nothing.."
                }
                let cekprem = require("parse-ms")((await premium.getPremiumExpired(msg.sender, _premium)) - Date.now())
                const premi = isPremium ? `-${cekprem.days} Days` : 'No'
                const levelMe = level.getLevelingLevel(msg.sender, _user)
                const xpMe = level.getLevelingXp(sender, _user)
                const req = 20 * Math.pow(levelMe, 2) + 50 * levelMe + 100
                const limitnya = isPremium || isOwner ? 'Unlimited' : user.getLimit(msg.sender, _user)
                const balance = user.getBalance(msg.sender, _user)
                try {
                    var pp = await conn.profilePictureUrl(msg.sender, "image");
                } catch {
                    var pp = "https://i.ibb.co/Tq7d7TZ/age-hananta-495-photo.png";
                }
                let caption = `\n┌──⭓ *About Me*\n`
                caption += `│\n`
                caption += `│⭔ Username : ${msg.pushName}\n`
                caption += `│⭔ About : ${statuses.status || statuses}\n`;
                caption += `│⭔ Role : Warrior\n`
                caption += `│⭔ Premium : ${premi}\n`
                caption += `│\n`
                caption += `│⭔ Level : ${levelMe}\n`
                caption += `│⭔ Xp : ${xpMe} / ${req}\n`
                caption += `│⭔ Limit : ${limitnya}\n`
                caption += `│⭔ Balance : ${balance}\n`
                caption += `│\n`
                caption += `└───────⭓\n`
                conn.sendFile(msg.from, pp, "", msg, { caption })
            }
            break
            case 'hapus': case 'delete': case 'del': case 'd': {
                if (command && !isGroup) return global.mess("group", msg)
                if (!msg.quoted) return msg.reply('Reply pesanya!')
                conn.sendMessage(from, { delete: { remoteJid: from, fromMe: true, id: msg.quoted.id, participant: msg.quoted.sender } })
            }
            break
            case 'leaderboard': case 'leaderboards': {
                if (command && !isGroup) return global.mess("group", msg)
                const resp = _user
                _user.sort((a, b) => (a.xp < b.xp) ? 1 : -1)
                let leaderboard = '*TOP 10 LEADERBOARD*\n\n'
                try {
                    for (let i = 0; i < 10; i++) {
                        var roles = 'Warrior'
                        if (resp[i].level <= 10) {
                            roles = 'Warrior'
                        } else if (resp[i].level <= 20) {
                            roles = 'Elite'
                        } else if (resp[i].level <= 30) {
                            roles = 'Master'
                        } else if (resp[i].level <= 40) {
                            roles = 'Grand Master'
                        } else if (resp[i].level <= 50) {
                            roles = 'Epic'
                        } else if (resp[i].level <= 60) {
                            roles = 'Epical Abadi'
                        } else if (resp[i].level <= 70) {
                            roles = 'Epic Glory'
                        } else if (resp[i].level <= 80) {
                            roles = 'Legends'
                        } else if (resp[i].level <= 90) {
                            roles = 'Mythic'
                        } else if (resp[i].level >= 100) {
                            roles = `Mythical Glory *${_user[i].level}`
                        }
                        leaderboard += `${i + 1}. wa.me/${_user[i].id.replace('@s.whatsapp.net', '')}\n\n*Role :* ${roles}\n*Level :* ${_user[i].level}\n*XP :* ${_user[i].xp}\n━━━━━━━━━━━━━━━━━━\n`
                    }
                    msg.reply(leaderboard)
                } catch (err) {
                    msg.reply('Minimal 10')
                }
            }
            break

            // BOT FEATURE
            case 'mancing': {
                if (command && !isGroup) return global.mess("group", msg)
                if (!isGroup) return global.mess("group", msg)
                if (mancing.hasOwnProperty(msg.sender.split('@')[0])) return msg.reply("Masih Ada Pancingan Yang Belum Diselesaikan!")
                if (user.isLimitGame(msg.sender, config.options.limitgameCount, _user) && !msg.fromMe) return global.mess("isLimitGame", msg)
                user.limitGameAdd(msg.sender, _user)
                msg.reply('Sedang Memancing, silahkan tunggu..')

                mancing[sender.split('@')[0]] = + new Date
                await sleep(Math.floor(10000 + Math.random() * 50000))

                if (mancing.hasOwnProperty(msg.sender.split('@')[0])) {
                    const bahan = ['🐟','🐠','🐡'] 
                    const bahan_ = bahan[Math.floor(Math.random() * bahan.length)]
                    const ditangkap = Math.ceil(Math.random() * 10)

                    const result = ["BAHAN","ZONK"]
                    const hasil = result[Math.floor(Math.random() * result.length)]
                    if (hasil == "BAHAN" ) {
                        rpg.addIkan(sender, ditangkap, _rpg)
                        msg.reply(`Hasil Tangkapan Ikan ${bahan_}\nJumlah Tangkapan : ${ditangkap}\nSelama ${clockString(new Date - mancing[msg.sender.split('@')[0]])}`)
                    } else if(hasil == "ZONK") {
                        msg.reply('Anda Tewas Dimakan Hiu Dan Tidak Mendapatkan Ikan')
                    } else {
                        msg.reply("404")
                    }
                    delete mancing[sender.split('@')[0]]
                }
            }
            break
            case 'nambang': {
                if (command && !isGroup) return global.mess("group", msg)
                if (!isGroup) return global.mess("group", msg)
                if (nambang.hasOwnProperty(msg.sender.split('@')[0])) return msg.reply("Masih Ada Tambangan Yang Belum Diselesaikan!")
                if (user.isLimitGame(msg.sender, config.options.limitgameCount, _user) && !msg.fromMe) return global.mess("isLimitGame", msg)
                user.limitGameAdd(msg.sender, _user)
                msg.reply('Sedang Menambang, silahkan tunggu..')

                nambang[sender.split('@')[0]] = + new Date
                await sleep(Math.floor(10000 + Math.random() * 50000))

                if (nambang.hasOwnProperty(msg.sender.split('@')[0])) {
                    const result =["🗿","💎","🪙","ZONK"]
                    const hasil = result[Math.floor(Math.random() * result.length)]
                    if (hasil == "🗿" ) {
                        const ditangkap = Math.ceil(Math.random() * 10)
                        rpg.addBatu(sender, ditangkap, _rpg)
                        msg.reply(`Hasil Tangkapan : Batu ${hasil}\nJumlah Tangkapan : ${ditangkap}\nSelama ${clockString(new Date - nambang[msg.sender.split('@')[0]])}`)
                    } else if(hasil == "💎") {
                        const ditangkap = Math.ceil(Math.random() * 2)
                        rpg.addPermata(sender, ditangkap, _rpg)
                        msg.reply(`Hasil Tangkapan : Permata ${hasil}\nJumlah Tangkapan : ${ditangkap}\nSelama ${clockString(new Date - nambang[msg.sender.split('@')[0]])}`)
                    } else if(hasil == "🪙") {
                        const ditangkap = Math.ceil(Math.random() * 5)
                        rpg.addEmas(sender, ditangkap, _rpg)
                        msg.reply(`Hasil Tangkapan : Emas ${hasil}\nJumlah Tangkapan : ${ditangkap}\nSelama ${clockString(new Date - nambang[msg.sender.split('@')[0]])}`)
                    } else if(hasil == "ZONK") {
                        msg.reply('Anda Tewas Tertimpa Beton Dan Tidak Mendapatkan Tambangan')
                    } else {
                        msg.reply("404")
                    }
                    delete nambang[sender.split('@')[0]]
                }
            }
            break
            case 'jual': case 'sell': {
                if (command && !isGroup) return global.mess("group", msg)
                if (ar[0] === 'ikan') {
                    if (!args[1]) return msg.reply(`Harga 1 Ikan 50 Balance\nExample: ${prefix + command + " " + ar[0]} 10`)
                    if (args[1].includes('-')) return msg.reply(`Example ${prefix + command} ikan 1`)
                    if (args[1].includes('.')) return msg.reply(`Example ${prefix + command} ikan 1`)
                    const result = args[1] * 50
                    if ( rpg.getIkan(msg.sender, _rpg) <= args[1] ) return msg.reply(`Maaf ${senderName} Kamu Tidak Punya ${ar[1]} Ikan`)
                    if ( rpg.getIkan(msg.sender, _rpg) >= args[1] ) {
                        rpg.jualIkan(msg.sender, args[1], _rpg)
                        user.addBalance(msg.sender, result, _user)
                        msg.reply(`*PENJUALAN BERHASIL*\n\n*Jumlah Ikan Dijual:* ${args[1]}\n*Uang didapat:* ${result}\n\n*Sisa Ikan:* ${rpg.getIkan(msg.sender, _rpg)}\n*Sisa Uang:* ${user.getBalance(msg.sender, _user)}`)
                    }
                } else if (ar[0] === 'batu') {
                    if (!args[1]) return msg.reply(`Harga 1 Batu 10 Balance\nExample: ${prefix + command + " " + ar[0]} 10`)
                    if (args[1].includes('-')) return msg.reply(`Example ${prefix + command} batu 1`)
                    if (args[1].includes('.')) return msg.reply(`Example ${prefix + command} batu 1`)
                    const result = args[1] * 10
                    if ( rpg.getBatu(msg.sender, _rpg) <= args[1] ) return msg.reply(`Maaf ${senderName} Kamu Tidak Punya ${ar[1]} Batu`)
                    if ( rpg.getBatu(msg.sender, _rpg) >= args[1] ) {
                        rpg.jualBatu(msg.sender, args[1], _rpg)
                        user.addBalance(msg.sender, result, _user)
                        msg.reply(`*PENJUALAN BERHASIL*\n\n*Jumlah Batu Dijual:* ${args[1]}\n*Uang didapat:* ${result}\n\n*Sisa Batu:* ${rpg.getBatu(msg.sender, _rpg)}\n*Sisa Uang:* ${user.getBalance(msg.sender, _user)}`)
                    }
                } else if (ar[0] === 'emas') {
                    if (!args[1]) return msg.reply(`Harga 1 Emas 100 Balance\nExample: ${prefix + command + " " + ar[0]} 10`)
                    if (args[1].includes('-')) return msg.reply(`Example ${prefix + command} emas 1`)
                    if (args[1].includes('.')) return msg.reply(`Example ${prefix + command} emas 1`)
                    const result = args[1] * 100
                    if ( rpg.getEmas(msg.sender, _rpg) <= args[1] ) return msg.reply(`Maaf ${senderName} Kamu Tidak Punya ${ar[1]} Emas`)
                    if ( rpg.getEmas(msg.sender, _rpg) >= args[1] ) {
                        rpg.jualEmas(msg.sender, args[1], _rpg)
                        user.addBalance(msg.sender, result, _user)
                        msg.reply(`*PENJUALAN BERHASIL*\n\n*Jumlah Emas Dijual:* ${args[1]}\n*Uang didapat:* ${result}\n\n*Sisa Emas:* ${rpg.getEmas(msg.sender, _rpg)}\n*Sisa Uang:* ${user.getBalance(msg.sender, _user)}`)
                    }
                } else if (ar[0] === 'permata') {
                    if (!args[1]) return msg.reply(`Harga 1 Permata 200 Balance\nExample: ${prefix + command + " " + ar[0]} 10`)
                    if (args[1].includes('-')) return msg.reply(`Example ${prefix + command} permata 1`)
                    if (args[1].includes('.')) return msg.reply(`Example ${prefix + command} permata 1`)
                    const result = args[1] * 200
                    if ( rpg.getPermata(msg.sender, _rpg) <= args[1] ) return msg.reply(`Maaf ${senderName} Kamu Tidak Punya ${ar[1]} Permata`)
                    if ( rpg.getPermata(msg.sender, _rpg) >= args[1] ) {
                        rpg.jualPermata(msg.sender, args[1], _rpg)
                        user.addBalance(msg.sender, result, _user)
                        msg.reply(`*PENJUALAN BERHASIL*\n\n*Jumlah Permata Dijual:* ${args[1]}\n*Uang didapat:* ${result}\n\n*Sisa Permata:* ${rpg.getPermata(msg.sender, _rpg)}\n*Sisa Uang:* ${user.getBalance(msg.sender, _user)}`)
                    }
                } else {
                    msg.reply(`Mau Jual Apaan ?\n- ikan\n- batu\n- emas\n- permata\n\nExample: ${prefix + command} ikan 10`)
                }
            }
            break
            case 'beli': case 'buy': {
                if (command && !isGroup) return global.mess("group", msg)
                if (ar[0] === 'limit') {
                    if (!args[1]) return msg.reply(`Harga 1 Limit 500 Balance\nExample: ${prefix + command + " " + ar[0]} 10`)
                    if (args[1].includes('-')) return msg.reply(`Example ${prefix + command} limit 10`)
                    if (args[1].includes('.')) return msg.reply(`Example ${prefix + command} limit 10`)
                    const result = args[1] * 500
                    if ( user.getBalance(msg.sender, _user) <= result ) return msg.reply(`Maaf ${senderName} Kamu Tidak Punya ${result} Balance`)
                    if ( user.getBalance(msg.sender, _user) >= result ) {
                        user.jualBalance(msg.sender, result, _user)
                        user.jualLimit(msg.sender, args[1], _user)
                        msg.reply(`*PENJUALAN BERHASIL*\n\n*Jumlah Limit Dibeli:* ${args[1]}\n\n*Sisa Limit:* ${user.getLimit(msg.sender, _user)}\n*Sisa Uang:* ${user.getBalance(msg.sender, _user)}`)
                    }
                } else if (ar[0] === 'limitgame') {
                    if (!args[1]) return msg.reply(`Harga 1 Limitgame 250 Balance\nExample: ${prefix + command + " " + ar[0]} 10`)
                    if (args[1].includes('-')) return msg.reply(`Example ${prefix + command} limitgame 10`)
                    if (args[1].includes('.')) return msg.reply(`Example ${prefix + command} limitgame 10`)
                    const result = args[1] * 250
                    if ( user.getBalance(msg.sender, _user) <= result ) return msg.reply(`Maaf ${senderName} Kamu Tidak Punya ${result} Balance`)
                    if ( user.getBalance(msg.sender, _user) >= result ) {
                        user.jualBalance(msg.sender, result, _user)
                        user.jualLimitGame(msg.sender, args[1], _user)
                        msg.reply(`*PENJUALAN BERHASIL*\n\n*Jumlah Limitgame Dibeli:* ${args[1]}\n\n*Sisa Limitgame:* ${user.getLimitGame(msg.sender, _user)}\n*Sisa Uang:* ${user.getBalance(msg.sender, _user)}`)
                    }
                } else {
                    msg.reply(`Mau Beli Apaan ?\n- limit\n- limitgame\n\nExample: ${prefix + command} limit 10`)
                }
            }
            break
            case 'more': {
                if (command && !isGroup) return global.mess("group", msg)
                if (!q.includes('|')) return msg.reply(`Example: ${prefix + command} hello|there`)
                if (user.isLimit(msg.sender, isPremium, isOwner, config.options.limitCount, _user) && !msg.fromMe) return global.mess("isLimit", msg)
                let kata = String.fromCharCode(8206)
                msg.reply(arg.split('|')[0] + kata.repeat(4001) + arg.split('|')[1])
                user.limitAdd(msg.sender, isPremium, isOwner, _user)
            }
            break
            case 'bisakah': {
                if (command && !isGroup) return global.mess("group", msg)
                if (!text) return msg.reply(`Example: ${prefix + command} kamu memasak ?`)
                if (user.isLimit(msg.sender, isPremium, isOwner, config.options.limitCount, _user) && !msg.fromMe) return global.mess("isLimit", msg)
                const tanya = ['Bisa','Tidak Bisa','Coba Ulangi','Ngimpi kah?','yakin bisa?']
                const jawab = tanya[Math.floor(Math.random() * tanya.length)]
                msg.reply(`Pertanyaan : ${text}\n\nJawaban : ${jawab}`)
                user.limitAdd(msg.sender, isPremium, isOwner, _user)
            }
            break
            case 'kapankah': {
                if (command && !isGroup) return global.mess("group", msg)
                if (!text) return msg.reply(`Example: ${prefix + command} kamu memasak ?`)
                if (user.isLimit(msg.sender, isPremium, isOwner, config.options.limitCount, _user) && !msg.fromMe) return global.mess("isLimit", msg)
                const tanya = ['Besok','Lusa','Tadi','4 Hari Lagi','5 Hari Lagi','6 Hari Lagi','1 Minggu Lagi','2 Minggu Lagi','3 Minggu Lagi','1 Bulan Lagi','2 Bulan Lagi','3 Bulan Lagi','4 Bulan Lagi','5 Bulan Lagi','6 Bulan Lagi','1 Tahun Lagi','2 Tahun Lagi','3 Tahun Lagi','4 Tahun Lagi','5 Tahun Lagi','6 Tahun Lagi','1 Abad lagi','3 Hari Lagi','Tidak Akan Pernah']
                const jawab = tanya[Math.floor(Math.random() * tanya.length)]
                msg.reply(`Pertanyaan : ${text}\n\nJawaban : ${jawab}`)
                user.limitAdd(msg.sender, isPremium, isOwner, _user)
            }
            break
            case 'apakah': {
                if (command && !isGroup) return global.mess("group", msg)
                if (!text) return msg.reply(`Example: ${prefix + command} kamu memasak ?`)
                if (user.isLimit(msg.sender, isPremium, isOwner, config.options.limitCount, _user) && !msg.fromMe) return global.mess("isLimit", msg)
                const tanya = ['Iya','Tidak','Bisa Jadi','Coba Ulangi','Tanyakan Ayam']
                const jawab = tanya[Math.floor(Math.random() * tanya.length)]
                msg.reply(`Pertanyaan : ${text}\n\nJawaban : ${jawab}`)
                user.limitAdd(msg.sender, isPremium, isOwner, _user)
            }
            break
            case 'watak': {
                if (command && !isGroup) return global.mess("group", msg)
                if (!text) return msg.reply(`Example: ${prefix + command} ${senderName}`)
                if (user.isLimit(msg.sender, isPremium, isOwner, config.options.limitCount, _user) && !msg.fromMe) return global.mess("isLimit", msg)
                const tanya = ["penyayang","pemurah","Pemarah","Pemaaf","Penurut","Baik","baperan","Baik Hati","penyabar","Uwu","top deh, pokoknya","Suka Membantu"]
                const jawab = tanya[Math.floor(Math.random() * tanya.length)]
                msg.reply(`Pertanyaan : ${text}\n\nJawaban : ${jawab}`)
                user.limitAdd(msg.sender, isPremium, isOwner, _user)
            }
            break
            case 'gantengcek': {
                if (command && !isGroup) return global.mess("group", msg)
                if (!text) return msg.reply(`Example: ${prefix + command} ${senderName}`)
                if (user.isLimit(msg.sender, isPremium, isOwner, config.options.limitCount, _user) && !msg.fromMe) return global.mess("isLimit", msg)
                if (q.match(/zein|Zein|ZEIN/)) {
                    const tanya = ['70%','74%','83%','97%','100%','94%','75%','82%']
                    const jawab = tanya[Math.floor(Math.random() * tanya.length)]
                    return msg.reply(`Pertanyaan : Cek Ganteng Bang ${text}\n\nJawaban : ${jawab}`)
                }
                const tanya = ['10%','30%','20%','40%','50%','60%','70%','62%','74%','83%','97%','100%','29%','94%','75%','82%','41%','39%']
                const jawab = tanya[Math.floor(Math.random() * tanya.length)]
                msg.reply(`Pertanyaan : Cek Ganteng Bang ${text}\n\nJawaban : ${jawab}`)
                user.limitAdd(msg.sender, isPremium, isOwner, _user)
            }
            break
            case 'cantikcek': {
                if (command && !isGroup) return global.mess("group", msg)
                if (!text) return msg.reply(`Example: ${prefix + command} ${senderName}`)
                if (user.isLimit(msg.sender, isPremium, isOwner, config.options.limitCount, _user) && !msg.fromMe) return global.mess("isLimit", msg)
                const tanya = ['10% banyak" perawatan ya kak:v\nCanda Perawatan:v','30% Semangat Kaka Merawat Dirinya><','20% Semangat Ya Kaka👍','40% Wahh Kaka><','50% kaka cantik deh><','60% Hai Cantik🐊','70% Hai Ukhty🐊','62% Kakak Cantik><','74% Kakak ni cantik deh><','83% Love You Kakak><','97% Assalamualaikum Ukhty🐊','100% Kakak Pake Susuk ya??:v','29% Semangat Kakak:)','94% Hai Cantik><','75% Hai Kakak Cantik','82% wihh Kakak Pasti Sering Perawatan kan??','41% Semangat:)','39% Lebih Semangat🐊']
                const jawab = tanya[Math.floor(Math.random() * tanya.length)]
                msg.reply(`Pertanyaan : Cantik Cek Neng ${text}\n\nJawaban : ${jawab}`)
                user.limitAdd(msg.sender, isPremium, isOwner, _user)
            }
            break
            case 'judi': case 'casino': {
                if (command && !isGroup) return global.mess("group", msg)
                if (!text) return msg.reply('Mau Taruhan Berapa ?')
                if (user.isLimitGame(msg.sender, config.options.limitgameCount, _user) && !msg.fromMe) return global.mess("isLimitGame", msg)
                user.limitGameAdd(msg.sender, _user)

                if (user.getBalance(msg.sender, _user) <= text ) return msg.reply(`Maaf ${senderName} Balance Anda Tidak Mencukupi`)
                if (text <= 999 ) return msg.reply('Miskin Amat.. Minimal 1000')
                msg.reply('Taruhan Sedang Berlangsung, Silahkan Tunggu')
                const result = ["MENANG","KALAH","LOSE"]

                setTimeout( () => {
                    const bayar = text * 2 - 100
                    const hasil = result[Math.floor(Math.random() * result.length)]

                    if (hasil == "MENANG") {
                        user.addBalance(msg.sender, bayar, _user)
                        msg.reply(`Selamat Kamu memenangkan ${command} sebesar ${bayar}`)
                    } else if(hasil == "KALAH") {
                        user.jualBalance(msg.sender, bayar, _user)
                        msg.reply(`Maaf Kamu Kalah Dan Kehilangan sebesar ${bayar}`)
                    } else if(hasil == "LOSE") {
                        user.jualBalance(msg.sender, bayar, _user)
                        msg.reply(`Maaf Kamu Kalah Dan Kehilangan sebesar ${bayar}`)
                    } else {
                        msg.reply(" X error X ")
                    }
                }, 10000)
            }
            break

            default:
                if (_isCmd) {
                    msg.reply('Command Not Found!')
                }
            break
        }
    } catch (e) {
        msg.reply(String(e))
        console.log(color('|ERR|', 'red'), color(String(e), 'cyan'))
    }
}