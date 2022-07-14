require("./global")
const { delay } = require("@adiwajshing/baileys")
const axios = require('axios').default
const BodyForm = require('form-data')
const { exec, spawn } = require("child_process")
const ffmpeg = require('fluent-ffmpeg')
const fs = require('fs')
const moment = require('moment-timezone')
const toMs = require('ms')
const ms = require('parse-ms')
const speed = require('performance-now')
const request = require('request')
const { color, fetchUrl, isUrl, getRandom, sleep, clockString } = require("./lib/function")
const zenz = require('./lib/message')

module.exports = async (sock, m) => {
    try {
        const { type, isGroup, sender, from } = m
        const body = (type == "buttonsResponseMessage") ? m.message[type].selectedButtonId : (type == "listResponseMessage") ? m.message[type].singleSelectReply.selectedRowId : (type == "templateButtonReplyMessage") ? m.message[type].selectedId : m.text 
        const senderName = m.pushName
        const senderNumber = sender.split('@')[0]
        const groupMetadata = isGroup ? await sock.groupMetadata(from) : null
        const groupName = groupMetadata?.subject || ''
        const groupMembers = groupMetadata?.participants || []
        const groupAdmins = groupMembers.filter((v) => v.admin).map((v) => v.id)
        const isGroupAdmins = groupAdmins.includes(sender)
        const isBotGroupAdmins = groupAdmins.includes(sock.user?.jid)
        const isOwner = [sock.user?.jid, ...config.owner].map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(sender)

        const isPremium = premium.checkPremiumUser(m.sender, isOwner, _premium)
        const isAfkOn = afk.checkAfkUser(m.sender, _afk) 
        const isLevelingOn = group.cekLeveling(m.from, _group)
        const isAntidelete = group.cekAntidelete(m.from, _group)
        const isOffline = group.cekOffline(m.from, _group)
        const isAntilink = group.cekAntilink(m.from, _group)
        const isNsfw = group.cekNsfw(m.from, _group)

        const isCmd = /^[°•π÷×¶∆£¢€¥®™✓_=|~!?#$%^&.+-,\\\©^]/.test(body) && sock.sendPresenceUpdate('composing', from)
        const prefix = isCmd ? body[0] : ''
        const command = isCmd ? body.slice(1).trim().split(' ').shift().toLowerCase() : ''
        const quoted = m.quoted ? m.quoted : m
        const budy = (typeof m.text == "string" ? m.text : "")
        const args = body.trim().split(' ').slice(1)
        const fargs = body.replace(command, '').slice(1).trim()
        const ar = args.map((v) => v.toLowerCase())
        const text = q = args.join(" ")    
        const time = moment().tz(config.timezone).format('HH:mm:ss')

        if (isCmd && isOffline && !isGroupAdmins && !isOwner) {
            return m.reply('Bot is disabled for this group')
        }

        if (!isGroup && !isCmd) console.log(color(`[ ${time} ]`, 'white'), color('[ PRIVATE ]', 'yellow'), color(body.slice(0, 50), 'white'), 'from', color(senderNumber, 'yellow'))
        if (isGroup && !isCmd) console.log(color(`[ ${time} ]`, 'white'), color('[  GROUP  ]', 'yellow'), color(body.slice(0, 50), 'white'), 'from', color(senderNumber, 'yellow'), 'in', color(groupName, 'yellow'))
        if (!isGroup && isCmd) console.log(color(`[ ${time} ]`, 'white'), color('[ COMMAND ]', 'yellow'), color(body, 'white'), 'from', color(senderNumber, 'yellow'))
        if (isGroup && isCmd) console.log(color(`[ ${time} ]`, 'white'), color('[ COMMAND ]', 'yellow'), color(body, 'white'), 'from', color(senderNumber, 'yellow'), 'in', color(groupName, 'yellow'))

        const mentionByTag = m.type == "extendedTextMessage" && m.message.extendedTextMessage.contextInfo != null ? m.message.extendedTextMessage.contextInfo.mentionedJid : []
        const mentionByreply = m.type == "extendedTextMessage" && m.message.extendedTextMessage.contextInfo != null ? m.message.extendedTextMessage.contextInfo.participant || "" : ""       
        const mention = typeof(mentionByTag) == 'string' ? [mentionByTag] : mentionByTag
        mention != undefined ? mention.push(mentionByreply) : []
        const mentionUser = mention != undefined ? mention.filter(n => n) : [] 

        if (asahotak.hasOwnProperty(m.sender.split('@')[0]) && !isCmd) {
            jawaban = asahotak[m.sender.split('@')[0]]
            if (budy.toLowerCase() == jawaban) {
                await sock.sendMessage(m.from, { text:`Selamat Jawaban ${budy} Benar 🎉\n\nIngin bermain lagi? Tekan Tombol Lanjut dibawah\n`, footer:'Entertainment\nPowered By https://zenzapis.xyz', buttons:[{ buttonId: '.asahotak', buttonText:{ displayText:'Lanjut'}, type:1 }], headerType:4 }, { quoted: m })
                delete asahotak[m.sender.split('@')[0]]
            } else m.reply('*Jawaban Salah!*')
        }
        if (caklontong.hasOwnProperty(m.sender.split('@')[0]) && !isCmd) {
            jawaban = caklontong[m.sender.split('@')[0]]
            if (budy.toLowerCase() == jawaban) {
                await sock.sendMessage(m.from, { text:`Selamat Jawaban ${budy} Benar 🎉\n\nIngin bermain lagi? Tekan Tombol Lanjut dibawah\n`, footer:'Entertainment\nPowered By https://zenzapis.xyz', buttons:[{ buttonId: '.caklontong', buttonText:{ displayText:'Lanjut'}, type:1 }], headerType:4 }, { quoted: m })
                delete caklontong[m.sender.split('@')[0]]
            } else m.reply('*Jawaban Salah!*')
        }
        if (family100.hasOwnProperty(m.sender.split('@')[0]) && !isCmd) {
            jawaban = family100[m.sender.split('@')[0]]
            result = Array.from(jawaban).find((v) => v === budy)
            if (budy.toLowerCase() == result) {
                await sock.sendMessage(m.from, { text:`Benar Salah Satu Jawabanya Adalah ${budy} Selamat 🎉\n\nIngin bermain lagi? Tekan Tombol Lanjut dibawah\n`, footer:'Entertainment\nPowered By https://zenzapis.xyz', buttons:[{ buttonId: '.family100', buttonText:{ displayText:'Lanjut'}, type:1 }], headerType:4 }, { quoted: m })
                delete family100[m.sender.split('@')[0]]
            } else m.reply('*Jawaban Salah!*')
        }
        if (siapakah.hasOwnProperty(m.sender.split('@')[0]) && !isCmd) {
            jawaban = siapakah[m.sender.split('@')[0]]
            if (budy.toLowerCase() == jawaban) {
                await sock.sendMessage(m.from, { text:`Selamat Jawaban ${budy} Benar 🎉\n\nIngin bermain lagi? Tekan Tombol Lanjut dibawah\n`, footer:'Entertainment\nPowered By https://zenzapis.xyz', buttons:[{ buttonId: '.siapakah', buttonText:{ displayText:'Lanjut'}, type:1 }], headerType:4 }, { quoted: m })
                delete siapakah[m.sender.split('@')[0]]
            } else m.reply('*Jawaban Salah!*')
        }
        if (susunkata.hasOwnProperty(m.sender.split('@')[0]) && !isCmd) {
            jawaban = susunkata[m.sender.split('@')[0]]
            if (budy.toLowerCase() == jawaban) {
                await sock.sendMessage(m.from, { text:`Selamat Jawaban ${budy} Benar 🎉\n\nIngin bermain lagi? Tekan Tombol Lanjut dibawah\n`, footer:'Entertainment\nPowered By https://zenzapis.xyz', buttons:[{ buttonId: '.susunkata', buttonText:{ displayText:'Lanjut'}, type:1 }], headerType:4 }, { quoted: m })
                delete susunkata[m.sender.split('@')[0]]
            } else m.reply('*Jawaban Salah!*')
        }
        if (tebakbendera.hasOwnProperty(m.sender.split('@')[0]) && !isCmd) {
            jawaban = tebakbendera[m.sender.split('@')[0]]
            if (budy.toLowerCase() == jawaban) {
                await sock.sendMessage(m.from, { text:`Selamat Jawaban ${budy} Benar 🎉\n\nIngin bermain lagi? Tekan Tombol Lanjut dibawah\n`, footer:'Entertainment\nPowered By https://zenzapis.xyz', buttons:[{ buttonId: '.tebakbendera', buttonText:{ displayText:'Lanjut'}, type:1 }], headerType:4 }, { quoted: m })
                delete tebakbendera[m.sender.split('@')[0]]
            } else m.reply('*Jawaban Salah!*')
        }
        if (tebakgambar.hasOwnProperty(m.sender.split('@')[0]) && !isCmd) {
            jawaban = tebakgambar[m.sender.split('@')[0]]
            if (budy.toLowerCase() == jawaban) {
                await sock.sendMessage(m.from, { text:`Selamat Jawaban ${budy} Benar 🎉\n\nIngin bermain lagi? Tekan Tombol Lanjut dibawah\n`, footer:'Entertainment\nPowered By https://zenzapis.xyz', buttons:[{ buttonId: '.tebakgambar', buttonText:{ displayText:'Lanjut'}, type:1 }], headerType:4 }, { quoted: m })
                delete tebakgambar[m.sender.split('@')[0]]
            } else m.reply('*Jawaban Salah!*')
        }
        if (tebakkabupaten.hasOwnProperty(m.sender.split('@')[0]) && !isCmd) {
            jawaban = tebakkabupaten[m.sender.split('@')[0]]
            if (budy.toLowerCase() == jawaban) {
                await sock.sendMessage(m.from, { text:`Selamat Jawaban ${budy} Benar 🎉\n\nIngin bermain lagi? Tekan Tombol Lanjut dibawah\n`, footer:'Entertainment\nPowered By https://zenzapis.xyz', buttons:[{ buttonId: '.tebakkabupaten', buttonText:{ displayText:'Lanjut'}, type:1 }], headerType:4 }, { quoted: m })
                delete tebakkabupaten[m.sender.split('@')[0]]
            } else m.reply('*Jawaban Salah!*')
        }
        if (tebakkalimat.hasOwnProperty(m.sender.split('@')[0]) && !isCmd) {
            jawaban = tebakkalimat[m.sender.split('@')[0]]
            if (budy.toLowerCase() == jawaban) {
                await sock.sendMessage(m.from, { text:`Selamat Jawaban ${budy} Benar 🎉\n\nIngin bermain lagi? Tekan Tombol Lanjut dibawah\n`, footer:'Entertainment\nPowered By https://zenzapis.xyz', buttons:[{ buttonId: '.tebakkalimat', buttonText:{ displayText:'Lanjut'}, type:1 }], headerType:4 }, { quoted: m })
                delete tebakkalimat[m.sender.split('@')[0]]
            } else m.reply('*Jawaban Salah!*')
        }
        if (tebakkata.hasOwnProperty(m.sender.split('@')[0]) && !isCmd) {
            jawaban = tebakkata[m.sender.split('@')[0]]
            if (budy.toLowerCase() == jawaban) {
                await sock.sendMessage(m.from, { text:`Selamat Jawaban ${budy} Benar 🎉\n\nIngin bermain lagi? Tekan Tombol Lanjut dibawah\n`, footer:'Entertainment\nPowered By https://zenzapis.xyz', buttons:[{ buttonId: '.tebakkata', buttonText:{ displayText:'Lanjut'}, type:1 }], headerType:4 }, { quoted: m })
                delete tebakkata[m.sender.split('@')[0]]
            } else m.reply('*Jawaban Salah!*')
        }
        if (tebaklagu.hasOwnProperty(m.sender.split('@')[0]) && !isCmd) {
            jawaban = tebaklagu[m.sender.split('@')[0]]
            if (budy.toLowerCase() == jawaban) {
                await sock.sendMessage(m.from, { text:`Selamat Jawaban ${budy} Benar 🎉\n\nIngin bermain lagi? Tekan Tombol Lanjut dibawah\n`, footer:'Entertainment\nPowered By https://zenzapis.xyz', buttons:[{ buttonId: '.tebaklagu', buttonText:{ displayText:'Lanjut'}, type:1 }], headerType:4 }, { quoted: m })
                delete tebaklagu[m.sender.split('@')[0]]
            } else m.reply('*Jawaban Salah!*')
        }
        if (tekateki.hasOwnProperty(m.sender.split('@')[0]) && !isCmd) {
            jawaban = tekateki[m.sender.split('@')[0]]
            if (budy.toLowerCase() == jawaban) {
                await sock.sendMessage(m.from, { text:`Selamat Jawaban ${budy} Benar 🎉\n\nIngin bermain lagi? Tekan Tombol Lanjut dibawah\n`, footer:'Entertainment\nPowered By https://zenzapis.xyz', buttons:[{ buttonId: '.tekateki', buttonText:{ displayText:'Lanjut'}, type:1 }], headerType:4 }, { quoted: m })
                delete tekateki[m.sender.split('@')[0]]
            } else m.reply('*Jawaban Salah!*')
        }
        if (tebaklirik.hasOwnProperty(m.sender.split('@')[0]) && !isCmd) {
            jawaban = tebaklirik[m.sender.split('@')[0]]
            if (budy.toLowerCase() == jawaban) {
                await sock.sendMessage(m.from, { text:`Selamat Jawaban ${budy} Benar 🎉\n\nIngin bermain lagi? Tekan Tombol Lanjut dibawah\n`, footer:'Entertainment\nPowered By https://zenzapis.xyz', buttons:[{ buttonId: '.tebaklirik', buttonText:{ displayText:'Lanjut'}, type:1 }], headerType:4 }, { quoted: m })
                delete tebaklirik[m.sender.split('@')[0]]
            } else m.reply('*Jawaban Salah!*')
        }
        if (tebaktebakan.hasOwnProperty(m.sender.split('@')[0]) && !isCmd) {
            jawaban = tebaktebakan[m.sender.split('@')[0]]
            if (budy.toLowerCase() == jawaban) {
                await sock.sendMessage(m.from, { text:`Selamat Jawaban ${budy} Benar 🎉\n\nIngin bermain lagi? Tekan Tombol Lanjut dibawah\n`, footer:'Entertainment\nPowered By https://zenzapis.xyz', buttons:[{ buttonId: '.tebaktebakan', buttonText:{ displayText:'Lanjut'}, type:1 }], headerType:4 }, { quoted: m })
                delete tebaktebakan[m.sender.split('@')[0]]
            } else m.reply('*Jawaban Salah!*')
        } 

        premium.expiredCheck(sock, m, _premium)
        if (isGroup) group.addGroup(m.from)

        if (isCmd && !m.key.fromMe) {

            rpg.addRpg(m.sender, _rpg)
            user.addUser(m.sender, m.pushName, _user)

            const levelRole = level.getLevelingLevel(m.sender, _user)
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

        if (isGroup && !level.isGained(m.sender) && isLevelingOn && isCmd && !m.key.fromMe) {
            try {
                level.addCooldown(m.sender)
                const currentLevel = level.getLevelingLevel(sender, _user)
                const amountXp = Math.floor(Math.random() * 5) + 5
                const requiredXp = 20 * Math.pow(currentLevel, 2) + 50 * currentLevel + 100
                level.addLevelingXp(sender, amountXp, _user)
                if (requiredXp <= level.getLevelingXp(sender, _user)) {
                    level.addLevelingLevel(sender, 1, _user)
                    const userLevel = level.getLevelingLevel(sender, _user)
                    const fetchXp = 20 * Math.pow(userLevel, 2) + 50 * userLevel + 100
                    m.reply(`*LEVELUP*\n\n*XP :* ${level.getLevelingXp(sender, _user)} / ${fetchXp}\n*Level:* ${currentLevel} -> ${level.getLevelingLevel(sender, _user)}`)
                }
            } catch (err) {
                console.error(err)
            }
        }

        if (isGroup && isLevelingOn && isCmd && !m.key.fromMe) {
            try {
                level.addCooldown(m.sender)
                const uangsaku = Math.floor(Math.random() * 5) + 5
                user.addBalance(m.sender, uangsaku, _user)
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
                    if (m.key.fromMe) { return }
                    const afkMentioned = `*Notice, Sedang AFK*\n\nDengan Alasan : ${getReason}\nTelah AFK Sejak : ${getSejak}`
                    m.reply(afkMentioned)
                }
            }
            if (afk.checkAfkUser(m.sender, _afk)) {
                const afkDone = `*${m.pushName}*\nTelah kembali dari AFK!\n\nSelama ${clockString(new Date - afk.getAfkTime(m.sender, _afk))}\nSejak : ${afk.getAfkSejak(m.sender, _afk)}`
                _afk.splice(afk.getAfkPosition(m.sender, _afk), 1)
                fs.writeFileSync('./database/afk.json', JSON.stringify(_afk))
                m.reply(afkDone)
            }
        }
        
        if (config.options.self && !isOwner && !m.fromMe) return
        // if (command && !isGroup) return global.mess("group", m)

        switch (command) {

            // ANIMEWEB COMMNAND
            case 'animeplanet': {
                if (command && !isGroup) return global.mess("group", m)
                if (!text) return m.reply(`Example: ${prefix + command} query`)
                if (user.isLimit(m.sender, isPremium, isOwner, config.options.limitCount, _user) && !m.fromMe) return global.mess("isLimit", m)
                let fetch = await fetchUrl(global.api("zenz", "/animeweb/animeplanet", { query: q }, "apikey"))
                let caption = `Animeplanet Search :\n\n`
                for (let i of fetch.result) {
                    caption += `⭔ Title : ${i.manga_name}\n`
                    caption += `⭔ Link : ${i.manga_url}\n\n`
                }
                sock.sendText(m.from, caption, m)
                user.limitAdd(m.sender, isPremium, isOwner, _user)
            }
            break
            case 'anoboy': {
                if (command && !isGroup) return global.mess("group", m)
                if (!text) return m.reply(`Example: ${prefix + command} query`)
                if (user.isLimit(m.sender, isPremium, isOwner, config.options.limitCount, _user) && !m.fromMe) return global.mess("isLimit", m)
                let fetch = await fetchUrl(global.api("zenz", "/animeweb/anoboy/search", { query: text }, "apikey"))
                let caption = `Anoboy Search :\n\n`
                for (let i of fetch.result) {
                    caption += `⭔ Title : ${i.judul}\n`
                    caption += `⭔ Link : ${i.link}\n\n`
                }
                sock.sendFile(m.from, fetch.result[0].thumb, "", m, { caption })
                user.limitAdd(m.sender, isPremium, isOwner, _user)
            }
            break
            case 'doujindesu': {
                if (command && !isGroup) return global.mess("group", m)
                if (!isNsfw) return global.mess("isNsfw", m)
                if (user.isLimit(m.sender, isPremium, isOwner, config.options.limitCount, _user) && !m.fromMe) return global.mess("isLimit", m)
                if (isUrl(text)) {
                    let fetch = await fetchUrl(`https://zenzapis.herokuapp.com/doujin?url=${isUrl(text)[0]}&key=andaracantik`)
                    let caption = `Doujindesu Search :\n\n`
                    let i = fetch.result
                    caption += `⭔ Title : ${i.title}\n`
                    caption += `⭔ Date : ${i.date}\n`
                    caption += `⭔ Url : ${i.url}\n`
                    caption += `⭔ Image Length : ${i.image.length}\n`
                    let buttons = [
                        { buttonId: `${prefix}doujindesupdf ${text}`, buttonText: { displayText: 'Download PDF'}, type: 1 },
                    ]
                    let buttonMessage = {
                        image: { url: i.image[1] },
                        caption: caption,
                        footer: config.footer,
                        buttons: buttons,
                        headerType: 4
                    }
                    sock.sendMessage(m.from, buttonMessage, { quoted: m })
                    user.limitAdd(m.sender, isPremium, isOwner, _user)
                } else if (text) {
                    let fetch = await fetchUrl(global.api("zenz", "/animeweb/doujindesu/search", { query: text }, "apikey"))
                    let caption = `Doujindesu Search :\n\n`
                    for (let i of fetch.result) {
                        caption += `⭔ Title : ${i.title}\n`
                        caption += `⭔ Score : ${i.score}\n`
                        caption += `⭔ Status : ${i.status}\n`
                        caption += `⭔ Link : ${i.link}\n\n`
                    }
                    sock.sendText(m.from, caption, m)
                    user.limitAdd(m.sender, isPremium, isOwner, _user)
                } else {
                    let fetch = await fetchUrl(global.api("zenz", "/animeweb/doujindesu/latest", {}, "apikey"))
                    let caption = `Doujindesu Latest :\n\n`
                    for (let i of fetch.result) {
                        caption += `⭔ Title : ${i.title}\n`
                        caption += `⭔ Score : ${i.score}\n`
                        caption += `⭔ Status : ${i.status}\n`
                        caption += `⭔ Link : ${i.link}\n`
                        caption += `⭔ Last Episode : ${i.last_episode}\n\n`
                    }
                    sock.sendText(m.from, caption, m)
                    user.limitAdd(m.sender, isPremium, isOwner, _user)
                }
            }
            break
            case 'kiryuu': {
                if (command && !isGroup) return global.mess("group", m)
                if (!text) return m.reply(`Example: ${prefix + command} query`)
                if (user.isLimit(m.sender, isPremium, isOwner, config.options.limitCount, _user) && !m.fromMe) return global.mess("isLimit", m)
                let fetch = await fetchUrl(global.api("zenz", "/animeweb/kiryuu", { query: text }, "apikey"))
                let caption = `Kiryuu Search :\n\n`
                for (let i of fetch.result) {
                    caption += `⭔ Title : ${i.manga_name}\n`
                    caption += `⭔ Episode : ${i.manga_eps}\n`
                    caption += `⭔ Rate : ${i.manga_rating}\n`
                    caption += `⭔ Link : ${i.manga_url}\n\n`
                }
                sock.sendFile(m.from, fetch.result[0].manga_thumb, "", m, { caption })
                user.limitAdd(m.sender, isPremium, isOwner, _user)
            }
            break
            case 'kissmanga': {
                if (command && !isGroup) return global.mess("group", m)
                if (!text) return m.reply(`Example: ${prefix + command} query`)
                if (user.isLimit(m.sender, isPremium, isOwner, config.options.limitCount, _user) && !m.fromMe) return global.mess("isLimit", m)
                let fetch = await fetchUrl(global.api("zenz", "/animeweb/kissmanga", { query: text }, "apikey"))
                let caption = `Kissmanga Search :\n\n`
                for (let i of fetch.result) {
                    caption += `⭔ Title : ${i.manga_name}\n`
                    caption += `⭔ Link : ${i.manga_url}\n\n`
                }
                sock.sendText(m.from, caption, m)
                user.limitAdd(m.sender, isPremium, isOwner, _user)
            }
            break
            case 'klikmanga': {
                if (command && !isGroup) return global.mess("group", m)
                if (!text) return m.reply(`Example: ${prefix + command} query`)
                if (user.isLimit(m.sender, isPremium, isOwner, config.options.limitCount, _user) && !m.fromMe) return global.mess("isLimit", m)
                let fetch = await fetchUrl(global.api("zenz", "/animeweb/klikmanga", { query: text }, "apikey"))
                let caption = `Klikmanga Search :\n\n`
                for (let i of fetch.result) {
                    caption += `⭔ Title : ${i.manga_name}\n`
                    caption += `⭔ Episode : ${i.manga_eps}\n`
                    caption += `⭔ Author : ${i.manga_author}\n`
                    caption += `⭔ Genre : ${i.manga_genre}\n`
                    caption += `⭔ Status : ${i.manga_status}\n`
                    caption += `⭔ Release : ${i.manga_release}\n`
                    caption += `⭔ Desc : ${i.manga_desc}\n`
                    caption += `⭔ Link : ${i.manga_url}\n\n`
                }
                sock.sendFile(m.from, fetch.result[0].manga_thumb, "", m, { caption })
                user.limitAdd(m.sender, isPremium, isOwner, _user)
            }
            break
            case 'komikstation': {
                if (command && !isGroup) return global.mess("group", m)
                if (!text) return m.reply(`Example: ${prefix + command} query`)
                if (user.isLimit(m.sender, isPremium, isOwner, config.options.limitCount, _user) && !m.fromMe) return global.mess("isLimit", m)
                let fetch = await fetchUrl(global.api("zenz", "/animeweb/komikstation", { query: text }, "apikey"))
                let caption = `Komikstation Search :\n\n`
                for (let i of fetch.result) {
                    caption += `⭔ Title : ${i.manga_name}\n`
                    caption += `⭔ Episode : ${i.manga_eps}\n`
                    caption += `⭔ Link : ${i.manga_url}\n\n`
                }
                sock.sendFile(m.from, fetch.result[0].manga_thumb, "", m, { caption })
                user.limitAdd(m.sender, isPremium, isOwner, _user)
            }
            break
            case 'mangatoon': {
                if (command && !isGroup) return global.mess("group", m)
                if (!text) return m.reply(`Example: ${prefix + command} query`)
                if (user.isLimit(m.sender, isPremium, isOwner, config.options.limitCount, _user) && !m.fromMe) return global.mess("isLimit", m)
                let fetch = await fetchUrl(global.api("zenz", "/animeweb/mangatoon", { query: text }, "apikey"))
                let caption = `Mangatoon Search :\n\n`
                let i = fetch.result
                caption += `⭔ Judul : ${i.judul}\n`
                caption += `⭔ Genre : ${i.genre}\n`
                caption += `⭔ Author : ${i.Author}\n`
                caption += `⭔ Link : ${i.Link}\n`
                sock.sendFile(m.from, i.thumb, "", m, { caption })
                user.limitAdd(m.sender, isPremium, isOwner, _user)
            }
            break
            case 'mynime': case 'mynimeku': {
                if (command && !isGroup) return global.mess("group", m)
                if (!text) return m.reply(`Example: ${prefix + command} query`)
                if (user.isLimit(m.sender, isPremium, isOwner, config.options.limitCount, _user) && !m.fromMe) return global.mess("isLimit", m)
                if (isUrl(text)) {
                    let fetch = await fetchUrl(global.api("zenz", "/animeweb/mynime/detail", { url: isUrl(text)[0] }, "apikey"))
                    let caption = `Mynimeku Detail :\n\n`
                    let res = fetch.result
                    caption += `⭔ Title : ${res.title}\n`
                    caption += `⭔ Japanese Title : ${res.title_japanese}\n`
                    caption += `⭔ Rating : ${res.rating}\n`
                    caption += `⭔ Musim : ${res.musim}\n`
                    caption += `⭔ Studio : ${res.studio}\n`
                    caption += `⭔ Episode : ${res.episode}\n`
                    caption += `⭔ Aired : ${res.aired}\n`
                    caption += `⭔ Genre : ${res.genre}\n`
                    caption += `⭔ Synopsis : ${res.synopsis}\n\n`
                    caption += `⭔ Episode List :\n\n`
                    for (let i of fetch.result.episode_list) {
                        caption += `⭔ Title : ${i.title}\n`
                        caption += `⭔ link : ${i.link}\n\n`
                    }
                    sock.sendFile(m.from, res.thumb, "", m, { caption })
                    user.limitAdd(m.sender, isPremium, isOwner, _user)
                } else if (text) {
                    let fetch = await fetchUrl(global.api("zenz", "/animeweb/mynime/search", { query: text }, "apikey"))
                    let caption = `Mynimeku Search :\n\n`
                    for (let i of fetch.result) {
                        caption += `⭔ Title : ${i.title}\n`
                        caption += `⭔ Link : ${i.url}\n\n`
                    }
                    sock.sendFile(m.from, fetch.result[0].thumb, "", m, { caption })
                    user.limitAdd(m.sender, isPremium, isOwner, _user)
                }
            }
            break
            case 'nekopoi': {
                if (command && !isGroup) return global.mess("group", m)
                if (!isNsfw) return global.mess("isNsfw", m)
                if (user.isLimit(m.sender, isPremium, isOwner, config.options.limitCount, _user) && !m.fromMe) return global.mess("isLimit", m)
                if (text.toLowerCase() === "random") {
                    let fetch = await fetchUrl(global.api("zenz", "/animeweb/nekopoi/random", {}, "apikey"))
                    let caption = `Nekopoi Random :\n\n`
                    let i = fetch.result
                    caption += `⭔ Title : ${i.title}\n`
                    caption += `⭔ Synopsis : ${i.synopsis}\n`
                    caption += `⭔ Views : ${i.views}\n`
                    caption += `⭔ Japanese : ${i.japanese}\n`
                    caption += `⭔ Category : ${i.category}\n`
                    caption += `⭔ Episode : ${i.episode}\n`
                    caption += `⭔ Status : ${i.status}\n`
                    caption += `⭔ Aired : ${i.aired}\n`
                    caption += `⭔ Producers : ${i.producers}\n`
                    caption += `⭔ Genre : ${i.genre}\n`
                    caption += `⭔ Duration : ${i.duration}\n`
                    caption += `⭔ Score : ${i.score}\n`
                    //sock.sendFile(m.from, fetch.result.img, "", m, { caption }) yg gambarnya kena internet positif
                    sock.sendText(m.from, caption, m)
                    user.limitAdd(m.sender, isPremium, isOwner, _user)
                } else if (text) {
                    let fetch = await fetchUrl(global.api("zenz", "/animeweb/nekopoi/search", { query: text }, "apikey"))
                    let caption = `Nekopoi Search :\n\n`
                    for (let i of fetch.result) {
                        caption += `⭔ Title : ${i.title}\n`
                        caption += `⭔ Link : ${i.link}\n\n`
                    }
                    //sock.sendFile(m.from, fetch.result[0].img, "", m, { caption }) yg gambarnya kena internet positif
                    sock.sendText(m.from, caption, m)
                    user.limitAdd(m.sender, isPremium, isOwner, _user)
                } else {
                    let fetch = await fetchUrl(global.api("zenz", "/animeweb/nekopoi/latest", {}, "apikey"))
                    let caption = `Nekopoi Latest :\n\n`
                    for (let i of fetch.result) {
                        caption += `⭔ Title : ${i.title}\n`
                        caption += `⭔ Link : ${i.link}\n\n`
                    }
                    //sock.sendFile(m.from, fetch.result[0].img, "", m, { caption }) yg gambarnya kena internet positif
                    sock.sendText(m.from, caption, m)
                    user.limitAdd(m.sender, isPremium, isOwner, _user)
                }
            }
            break
            case 'nhentai': {
                if (command && !isGroup) return global.mess("group", m)
                if (!isNsfw) return global.mess("isNsfw", m)
                if (!text) return m.reply(`Example: ${prefix + command} query`)
                if (user.isLimit(m.sender, isPremium, isOwner, config.options.limitCount, _user) && !m.fromMe) return global.mess("isLimit", m)
                let fetch = await fetchUrl(global.api("zenz", "/animeweb/nhentai", { query: text }, "apikey"))
                let caption = `Nhentai Search :\n\n`
                let i = fetch.result
                caption += `⭔ ID : ${i.id}\n`
                caption += `⭔ English Title : ${i.title.english ?? ""}\n`
                caption += `⭔ Japanese Title : ${i.title.japanese ?? ""}\n`
                caption += `⭔ Pretty Title : ${i.title.pretty ?? ""}\n`
                caption += `⭔ Image Length : ${i.image.length}\n`
                let buttons = [
                    { buttonId: `${prefix}nhpdf ${text}`, buttonText: { displayText: 'Download PDF'}, type: 1 },
                ]
                let buttonMessage = {
                    image: { url: i.image[0] },
                    caption: caption,
                    footer: config.footer,
                    buttons: buttons,
                    headerType: 4
                }
                sock.sendMessage(m.from, buttonMessage, { quoted: m })
                user.limitAdd(m.sender, isPremium, isOwner, _user)
            }
            break
            case 'otakudesu': {
                if (command && !isGroup) return global.mess("group", m)
                if (!text) return m.reply(`Example: ${prefix + command} url | query`)
                if (user.isLimit(m.sender, isPremium, isOwner, config.options.limitCount, _user) && !m.fromMe) return global.mess("isLimit", m)
                if (isUrl(text)) {
                    let fetch = await fetchUrl(global.api("zenz", "/animeweb/otakudesu/info", { url: isUrl(text)[0] }, "apikey"))
                    let caption = `Otakudesu Detail :\n\n`
                    let res = fetch.result
                    caption += `⭔ Title : ${res.title}\n`
                    caption += `⭔ Japanese Title : ${res.title_japanese}\n`
                    caption += `⭔ Rating : ${res.score}\n`
                    caption += `⭔ Studio : ${res.producer}\n`
                    caption += `⭔ Type : ${res.type}\n`
                    caption += `⭔ Status : ${res.status}\n`
                    caption += `⭔ Totaleps : ${res.total_eps}\n`
                    caption += `⭔ Duration : ${res.duration}\n`
                    caption += `⭔ Release Date : ${res.release_date}\n`
                    caption += `⭔ Studio : ${res.studio}\n`
                    caption += `⭔ Genre : ${res.genre}\n`
                    caption += `⭔ Sinopsis : ${res.sinopsis}\n\n`
                    caption += `⭔ Episode List :\n\n`
                    for (let i of fetch.result.episode) {
                        caption += `⭔ Title : ${i._title}\n`
                        caption += `⭔ link : ${i._eps}\n\n`
                    }
                    sock.sendFile(m.from, res.thumb, "", m, { caption })
                    user.limitAdd(m.sender, isPremium, isOwner, _user)
                } else if (text) {
                    let fetch = await fetchUrl(global.api("zenz", "/animeweb/otakudesu/search", { query: text }, "apikey"))
                    let caption = `Otakudesu Search :\n\n`
                    for (let i of fetch.result) {
                        caption += `⭔ Title : ${i.title}\n`
                        caption += `⭔ Link : ${i.link}\n\n`
                    }
                    sock.sendFile(m.from, fetch.result[0].thumb, "", m, { caption })
                    user.limitAdd(m.sender, isPremium, isOwner, _user)
                }
            }
            break
            case 'sauce': {
                if (command && !isGroup) return global.mess("group", m)
                if (user.isLimit(m.sender, isPremium, isOwner, config.options.limitCount, _user) && !m.fromMe) return global.mess("isLimit", m)
                const mime = (quoted.msg || m.msg).mimetype
                if (/image|video|sticker/.test(mime)) {
                    let download = await sock.downloadMediaMessage(quoted)
                    const form = new BodyForm()
                    form.append('sampleFile', download, { filename: getRandom('jpeg') })
                    axios.post(global.api("zenz", "/animeweb/sauce", {}, "apikey"), form.getBuffer(), { headers: { "content-type": `multipart/form-data; boundary=${form._boundary}`}
                    }).then(({ data }) => {
                        let caption = `Anime Source :\n\n`
                        for (let i of data.result) {
                            caption += `Url: ${i.url}\n`
                            caption += `Site: ${i.site}\n`
                            caption += `Similarity: ${i.similarity}\n`
                            caption += `Author Name: ${i.authorName}\n`
                            caption += `Author Url: ${i.authorUrl}\n`
                            caption += `Title: ${i.raw.data.title}\n`
                            caption += `Creator: ${i.raw.data.creator}\n`
                            caption += `Material: ${i.raw.data.material}\n`
                            caption += `Characters: ${i.raw.data.characters}\n`
                            caption += `Source: ${i.raw.data.source}\n\n`
                        }
                        sock.sendFile(m.from, data.result[0].thumbnail, "", m, { caption })
                    })
                } else if (isUrl(text)) {
                    let fetch = await fetchUrl(global.api("zenz", "/animeweb/sauce", { url: isUrl(text)[0] }, "apikey"))
                    let caption = `Anime Source :\n\n`
                    for (let i of fetch.result) {
                        caption += `Url: ${i.url}\n`
                        caption += `Site: ${i.site}\n`
                        caption += `Similarity: ${i.similarity}\n`
                        caption += `Author Name: ${i.authorName}\n`
                        caption += `Author Url: ${i.authorUrl}\n`
                        caption += `Title: ${i.raw.data.title}\n`
                        caption += `Creator: ${i.raw.data.creator}\n`
                        caption += `Material: ${i.raw.data.material}\n`
                        caption += `Characters: ${i.raw.data.characters}\n`
                        caption += `Source: ${i.raw.data.source}\n\n`
                    }
                    sock.sendFile(m.from, data.result[0].thumbnail, "", m, { caption })
                } else {
                    return m.reply(`Reply to Supported media With Caption ${prefix + command}`, m.from, { quoted: m })
                }
                user.limitAdd(m.sender, isPremium, isOwner, _user)
            }
            break
            case 'mal': case 'myanime': {
                if (command && !isGroup) return global.mess("group", m)
                if (!text) return m.reply(`Example: ${prefix + command} query`)
                if (user.isLimit(m.sender, isPremium, isOwner, config.options.limitCount, _user) && !m.fromMe) return global.mess("isLimit", m)
                let fetch = await fetchUrl(global.api("zenz", "/animeweb/animesearch", { query: text }, "apikey"))
                m.reply(JSON.stringify(fetch.result, null, 2))
                user.limitAdd(m.sender, isPremium, isOwner, _user)
            }
            break

            // CONVERT COMMNAND
            case 'emoji': {
                if (command && !isGroup) return global.mess("group", m)
                if (!text) return m.reply(`List Type :\n\n${emoji_type().sort((a, b) => a - b).join("\n")}\n\nEmoji : ${prefix + command} 🤔\nEmoji 2 : ${prefix + command} 🤔 <type>`)
                if (user.isLimit(m.sender, isPremium, isOwner, config.options.limitCount, _user) && !m.fromMe) return global.mess("isLimit", m)
                user.limitAdd(m.sender, isPremium, isOwner, _user)
                let [a, b] = args
                let fetch = await fetchUrl(global.api("zenz", "/creator/emoji", { query: a }, "apikey"))
                if (b) {
                    switch(b.toLowerCase()) {
                        case "apple": 
                            sock.sendFile(m.from, fetch.result.apple, "", m, { asSticker: true, author: config.exif.author, packname: config.exif.packname, categories: ['😄','😊'] })
                        break
                        case "google":
                            sock.sendFile(m.from, fetch.result.google, "", m, { asSticker: true, author: config.exif.author, packname: config.exif.packname, categories: ['😄','😊'] })
                        break
                        case "samsung":
                            sock.sendFile(m.from, fetch.result.samsung, "", m, { asSticker: true, author: config.exif.author, packname: config.exif.packname, categories: ['😄','😊'] })
                        break
                        case "microsoft":
                            sock.sendFile(m.from, fetch.result.microsoft, "", m, { asSticker: true, author: config.exif.author, packname: config.exif.packname, categories: ['😄','😊'] })
                        break
                        case "whatsapp":
                            sock.sendFile(m.from, fetch.result.whatsapp, "", m, { asSticker: true, author: config.exif.author, packname: config.exif.packname, categories: ['😄','😊'] })
                        break
                        case "twitter":
                            sock.sendFile(m.from, fetch.result.twitter, "", m, { asSticker: true, author: config.exif.author, packname: config.exif.packname, categories: ['😄','😊'] })
                        break
                        case "facebook":
                            sock.sendFile(m.from, fetch.result.facebook, "", m, { asSticker: true, author: config.exif.author, packname: config.exif.packname, categories: ['😄','😊'] })
                        break
                        case "skype":
                            sock.sendFile(m.from, fetch.result.skype, "", m, { asSticker: true, author: config.exif.author, packname: config.exif.packname, categories: ['😄','😊'] })
                        break
                        case "joypixels":
                            sock.sendFile(m.from, fetch.result.joypixels, "", m, { asSticker: true, author: config.exif.author, packname: config.exif.packname, categories: ['😄','😊'] })
                        break
                        case "openmoji":
                            sock.sendFile(m.from, fetch.result.openmoji, "", m, { asSticker: true, author: config.exif.author, packname: config.exif.packname, categories: ['😄','😊'] })
                        break
                        case "emojidex":
                            sock.sendFile(m.from, fetch.result.emojidex, "", m, { asSticker: true, author: config.exif.author, packname: config.exif.packname, categories: ['😄','😊'] })
                        break
                        case "notoemoji":
                            sock.sendFile(m.from, fetch.result.noto_emoji, "", m, { asSticker: true, author: config.exif.author, packname: config.exif.packname, categories: ['😄','😊'] })
                        break
                        case "messenger":
                            sock.sendFile(m.from, fetch.result.messenger, "", m, { asSticker: true, author: config.exif.author, packname: config.exif.packname, categories: ['😄','😊'] })
                        break
                        case "lg":
                            sock.sendFile(m.from, fetch.result.LG, "", m, { asSticker: true, author: config.exif.author, packname: config.exif.packname, categories: ['😄','😊'] })
                        break
                        case "htc":
                            sock.sendFile(m.from, fetch.result.HTC, "", m, { asSticker: true, author: config.exif.author, packname: config.exif.packname, categories: ['😄','😊'] })
                        break
                        case "mozilla":
                            sock.sendFile(m.from, fetch.result.mozilla, "", m, { asSticker: true, author: config.exif.author, packname: config.exif.packname, categories: ['😄','😊'] })
                        break
                        case "softbank":
                            sock.sendFile(m.from, fetch.result.softbank, "", m, { asSticker: true, author: config.exif.author, packname: config.exif.packname, categories: ['😄','😊'] })
                        break
                        case "docomo":
                            sock.sendFile(m.from, fetch.result.docomo, "", m, { asSticker: true, author: config.exif.author, packname: config.exif.packname, categories: ['😄','😊'] })
                        break
                        case "kddi":
                            sock.sendFile(m.from, fetch.result.au_by_kddi, "", m, { asSticker: true, author: config.exif.author, packname: config.exif.packname, categories: ['😄','😊'] })
                        break
                    }
                } else {
                    sock.sendFile(m.from, fetch.result.google, "", m, { asSticker: true, author: config.exif.author, packname: config.exif.packname, categories: ['😄','😊'] })
                }
                function emoji_type() {
                    return ["apple", "google","samsung", "microsoft", "whatsapp", "twitter", "facebook", "skype", "joypixels", "openmoji", "emojidex", "noto_emoji", "messanger", "lg", "htc", "mozilla", "softbank", "docomo", "kddi"]
                }
            }
            break
            case 'emojimix': {
                if (command && !isGroup) return global.mess("group", m)
                if (!text) return m.reply(`Example: \nEmojimix : ${prefix + command} 🤔\nEmojimix 2 : ${prefix + command} 😅🤔`)
                if (user.isLimit(m.sender, isPremium, isOwner, config.options.limitCount, _user) && !m.fromMe) return global.mess("isLimit", m)
                user.limitAdd(m.sender, isPremium, isOwner, _user)
                let [a, b] = args.join("")
                if (b) {
                    sock.sendFile(m.from, global.api("zenz", `/creator/emojimix`, {text: a, text2: b}, "apikey"), "", m, { asSticker: true, author: config.exif.author, packname: config.exif.packname, categories: ['😄','😊'] })
                } else {
                    sock.sendFile(m.from, global.api("zenz", `/creator/emojimix2`, {text: a}, "apikey"), "", m, { asSticker: true, author: config.exif.author, packname: config.exif.packname, categories: ['😄','😊'] })
                }
            }
            break
            case 'shorturl': {
                if (command && !isGroup) return global.mess("group", m)
                if (!text) return m.reply(`Example: ${prefix + command} query`)
                if (user.isLimit(m.sender, isPremium, isOwner, config.options.limitCount, _user) && !m.fromMe) return global.mess("isLimit", m)
                let fetch = await fetchUrl(global.api("zenz", "/convert/shorturl", { url: isUrl(text)[0] }, "apikey"))
                sock.sendText(m.from, fetch.result, m)
                user.limitAdd(m.sender, isPremium, isOwner, _user)
            }
            break
            case 'stickerc': case 'scircle': {
                if (command && !isGroup) return global.mess("group", m)
                if (!quoted) return  m.reply(`Reply to Supported media With Caption ${prefix + command} or url`)
                if (user.isLimit(m.sender, isPremium, isOwner, config.options.limitCount, _user) && !m.fromMe) return global.mess("isLimit", m)
                user.limitAdd(m.sender, isPremium, isOwner, _user)
                const mime = (quoted.msg || m.msg).mimetype
                if (/image/.test(mime)) {
                    let download = await sock.downloadAndSaveMediaMessage(quoted)
                    file_name = getRandom('jpg')
                    request({
                        url: global.api("zenz", "/photoeditor/circle", {}, "apikey"),
                        method: 'POST',
                        formData: {
                            "sampleFile": fs.createReadStream(download)
                        },
                        encoding: "binary"
                    }, async function(error, response, body) {
                        fs.unlinkSync(download)
                        fs.writeFileSync(file_name, body, "binary")
                        ini_buff = fs.readFileSync(file_name)
                        await sock.sendFile(m.from, ini_buff, "", m, { asSticker: true, author: config.exif.author, packname: config.exif.packname, categories: ['😄','😊'] }).then(() => {
                            fs.unlinkSync(file_name)
                        })
                    })
                } else if (isUrl(text)) {
                    sock.sendFile(m.from, global.api("zenz", "/photoeditor/circle", { url: isUrl(text)[0] }, "apikey"), "", m, { asSticker: true, author: config.exif.author, packname: config.exif.packname, categories: ['😄','😊'] })
                }   else {
                    return m.reply(`Reply to Supported media With Caption ${prefix + command} or url`, m.from, { quoted: m })
                }
            }
            break
            case 'sticker': case 'stiker': case 's': {
                if (command && !isGroup) return global.mess("group", m)
                if (!quoted) return  m.reply(`Reply to Supported media With Caption ${prefix + command} or url`)
                if (user.isLimit(m.sender, isPremium, isOwner, config.options.limitCount, _user) && !m.fromMe) return global.mess("isLimit", m)
                user.limitAdd(m.sender, isPremium, isOwner, _user)
                const mime = (quoted.msg || m.msg).mimetype
                if (/image|video|sticker/.test(mime)) {
                    let download = await quoted.download()
                    sock.sendFile(m.from, download, "", m, { asSticker: true, author: config.exif.author, packname: config.exif.packname, categories: ['😄','😊'] })
                } else if (quoted.mentions[0]) {
                    let url = await sock.profilePictureUrl(quoted.mentions[0], "image")
                    sock.sendFile(m.from, url, "", m, { asSticker: true, author: config.exif.author, packname: config.exif.packname, categories: ['😄','😊'] })
                } else if (isUrl(text)) {
                    if (isUrl(text)) sock.sendFile(m.from, isUrl(text)[0], "", m, { asSticker: true, author: config.exif.author, packname: config.exif.packname, categories: ['😄','😊'] })
                    else m.reply('No Url Match')
                } else {
                    return m.reply(`Reply to Supported media With Caption ${prefix + command} or url or @tag`, m.from, { quoted: m })
                }
            }
            break
            case 'stickernobg': case 'stickerbg': {
                if (command && !isGroup) return global.mess("group", m)
                if (!isPremium) return global.mess("premium", m)
                if (!quoted) return  m.reply(`Reply to Supported media With Caption ${prefix + command} or url`)
                const mime = (quoted.msg || m.msg).mimetype
                if (/image/.test(mime)) {
                    let download = await sock.downloadAndSaveMediaMessage(quoted)
                    file_name = getRandom('jpg')
                    request({
                        url: global.api("zenz", "/convert/sticker-nobg", {}, "apikey"),
                        method: 'POST',
                        formData: {
                            "sampleFile": fs.createReadStream(download)
                        },
                        encoding: "binary"
                    }, async function(error, response, body) {
                        fs.unlinkSync(download)
                        fs.writeFileSync(file_name, body, "binary")
                        ini_buff = fs.readFileSync(file_name)
                        await sock.sendFile(m.from, ini_buff, "", m, { asSticker: true, author: config.exif.author, packname: config.exif.packname, categories: ['😄','😊'] }).then(() => {
                            fs.unlinkSync(file_name)
                        })
                    })
                } else if (isUrl(text)) {
                    sock.sendFile(m.from, global.api("zenz", "/convert/sticker-nobg", { url: isUrl(text)[0] }, "apikey"), "", m, { asSticker: true, author: config.exif.author, packname: config.exif.packname, categories: ['😄','😊'] })
                }   else {
                    return m.reply(`Reply to Supported media With Caption ${prefix + command} or url`, m.from, { quoted: m })
                }
            }
            break
            case 'stickerp': case 'stikerp': case 'stickernocrop': {
                if (command && !isGroup) return global.mess("group", m)
                if (!quoted) return  m.reply(`Reply to Supported media With Caption ${prefix + command} or url`)
                if (user.isLimit(m.sender, isPremium, isOwner, config.options.limitCount, _user) && !m.fromMe) return global.mess("isLimit", m)
                user.limitAdd(m.sender, isPremium, isOwner, _user)
                const mime = (quoted.msg || m.msg).mimetype
                if (/image|video|sticker/.test(mime)) {
                    let download = await sock.downloadAndSaveMediaMessage(quoted)
                    file_name = getRandom('webp')
                    ffmpeg(`./${download}`).input(download).on('end', function () {
                        sock.sendFile(m.from, fs.readFileSync(file_name), "", m, { asSticker: true, author: config.exif.author, packname: config.exif.packname, categories: ['😄','😊'] }).then(() => {
                            fs.unlinkSync(download)
                            fs.unlinkSync(file_name)
                        })
                    })
                    .addOutputOptions([`-vcodec`,`libwebp`,`-vf`,`scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`]).toFormat('webp').save(file_name)
                } else {
                    return m.reply(`Reply to Supported media With Caption ${prefix + command}`, m.from, { quoted: m })
                }
            }
            break
            case 'takesticker': case 'take': case 'colong': {
                if (command && !isGroup) return global.mess("group", m)
                if (!isPremium) return global.mess("premium", m)
                if (!quoted) return  m.reply(`Reply to Supported media With Caption ${prefix + command} or url`)
                const mime = (quoted.msg || m.msg).mimetype
                if (/image|video|sticker/.test(mime)) {
                    anu = args.join(" ").split('|')
                    const packname = anu[0] !== '' ? anu[0] : config.exif.packname
                    const author = anu[1] !== '' ? anu[1] : config.exif.author
                    let download = await quoted.download()
                    sock.sendFile(m.from, download, "", m, { asSticker: true, author: author, packname: packname, categories: ['😄','😊'] })
                } else {
                    return m.reply(`Reply to Supported media With Caption ${prefix + command}`, m.from, { quoted: m })
                }
            }
            break
            case 'toimg': case 'toimage': {
                if (command && !isGroup) return global.mess("group", m)
                if (!quoted) return  m.reply(`Reply to Supported media With Caption ${prefix + command}`)
                if (user.isLimit(m.sender, isPremium, isOwner, config.options.limitCount, _user) && !m.fromMe) return global.mess("isLimit", m)
                user.limitAdd(m.sender, isPremium, isOwner, _user)
                const mime = (quoted.msg || m.msg).mimetype
                if (/image|video|sticker/.test(mime)) {
                    let download = await sock.downloadAndSaveMediaMessage(quoted)
                    let ran = getRandom('png')
                    exec(`ffmpeg -i ${download} ${ran}`, (err) => {
                        fs.unlinkSync(download)
                        if (err) return m.reply('Error')
                        buffer = fs.readFileSync(ran)
                        sock.sendFile(m.from, buffer, "", m)
                        fs.unlinkSync(ran)
                    })
                } else {
                    return m.reply(`Reply to Supported media With Caption ${prefix + command}`, m.from, { quoted: m })
                }
            }
            break
            case 'tourl': case 'uploader': {
                if (command && !isGroup) return global.mess("group", m)
                if (!quoted) return  m.reply(`Reply to Supported media With Caption ${prefix + command}`)
                if (user.isLimit(m.sender, isPremium, isOwner, config.options.limitCount, _user) && !m.fromMe) return global.mess("isLimit", m)
                const mime = (quoted.msg || m.msg).mimetype
                if (/image|video|sticker/.test(mime)) {
                    let download = await sock.downloadMediaMessage(quoted)
                    const form = new BodyForm()
                    form.append('sampleFile', download, { filename: 'fromBot-' + getRandom('jpg') })
                    if (text) {
                        form.append('comment', text)
                    } else {
                        form.append('comment', "sock BOT")
                    }
                    axios.post(global.api("zenz", "/uploader", {}, "apikey"), form.getBuffer(), { headers: { "content-type": `multipart/form-data; boundary=${form._boundary}`}
                    }).then(({ data }) => {
                        let caption = `Convert Image To Url :\n\n`
                        caption += `⭔ Title : ${data.result.originalname}\n`
                        caption += `⭔ Size : ${data.result.size}\n`
                        caption += `⭔ MimeType : ${data.result.mimetype}\n`
                        caption += `⭔ Comment : ${data.result.comment}\n`
                        caption += `⭔ CreatedOn : ${data.result.createdOn}\n`
                        caption += `⭔ Url : https://zenzapis.xyz/uploader/${data.result.originalname}\n`
                        sock.sendFile(m.from, data.result.url, "", m, { caption })
                        user.limitAdd(m.sender, isPremium, isOwner, _user)
                    })
                } else {
                    return m.reply(`Reply to Supported media With Caption ${prefix + command}`, m.from, { quoted: m })
                }
            }
            break
            case 'tovideo': case 'tomedia': case 'tomp4': {
                if (command && !isGroup) return global.mess("group", m)
                if (!isPremium) return global.mess("premium", m)
                if (!quoted) return  m.reply(`Reply to Supported media With Caption ${prefix + command}`)
                const mime = (quoted.msg || m.msg).mimetype
                if (/image|video|sticker/.test(mime)) {
                    let download = await sock.downloadMediaMessage(quoted)
                    const form = new BodyForm()
                    form.append('sampleFile', download, { filename: getRandom('webp') })
                    axios.post(global.api("zenz", "/convert/webp-to-mp4", {}, "apikey"), form.getBuffer(), { headers: { "content-type": `multipart/form-data; boundary=${form._boundary}`}
                    }).then(({ data }) => {
                        sock.sendFile(m.from, data.result, "", m, { caption: 'Convert Sticker Gif To Video' })
                    })
                } else if (isUrl(text)) {
                    let fetch = await fetchUrl(global.api("zenz", "/convert/webp-to-mp4", { url: isUrl(text)[0] }, "apikey"))
                    sock.sendFile(m.from, fetch.result, "", m, { caption: 'Convert Sticker Gif To Video' })
                }   else {
                    return m.reply(`Reply to Supported media With Caption ${prefix + command}`, m.from, { quoted: m })
                }
            }
            break
            case 'whatmusic': case 'findmusic': {
                if (command && !isGroup) return global.mess("group", m)
                if (!isPremium) return global.mess("premium", m)
                if (!quoted) return  m.reply(`Reply to Supported media With Caption ${prefix + command} or url`)
                const mime = (quoted.msg || m.msg).mimetype
                if (/audio/.test(mime)) {
                    let download = await sock.downloadMediaMessage(quoted)
                    const form = new BodyForm()
                    form.append('sampleFile', download, { filename: getRandom('mp3') })
                    axios.post(global.api("zenz", "/convert/whatmusic", {}, "apikey"), form.getBuffer(), { headers: { "content-type": `multipart/form-data; boundary=${form._boundary}`}
                    }).then(({ data }) => {
                        let caption = `What Music :\n\n`
                        caption += `⭔ Title : ${data.result.title}\n`
                        caption += `⭔ Artist : ${data.result.artist}\n`
                        caption += `⭔ Album : ${data.result.album}\n`
                        caption += `⭔ Genres : ${data.result.genres}\n`
                        caption += `⭔ Release : ${data.result.crereleaseatedOn}\n`
                        sock.sendText(m.from, caption, m)
                    })
                } else if (isUrl(text)) {
                    let fetch = await fetchUrl(global.api("zenz", "/convert/whatmusic", { url: isUrl(text)[0] }, "apikey"))
                    let caption = `What Music :\n\n`
                    let i = fetch.result
                    caption += `⭔ Title : ${i.title}\n`
                    caption += `⭔ Artist : ${i.artist}\n`
                    caption += `⭔ Album : ${i.album}\n`
                    caption += `⭔ Genres : ${i.genres}\n`
                    caption += `⭔ Release : ${i.crereleaseatedOn}\n`
                    sock.sendText(m.from, caption, m)
                } else {
                    return m.reply(`Reply to Supported media With Caption ${prefix + command} or url`, m.from, { quoted: m })
                }
            }
            break
            
            // CREATOR COMMNAND
            case 'attp': case 'botcomment': case 'changemymind': case 'hartatahta': case 'kannagen': case 'nuliskanan': case 'nuliskiri': case 'trump': case 'ttp': {
                if (command && !isGroup) return global.mess("group", m)
                if (!text) return m.reply(`Example: ${prefix + command} query`)
                if (user.isLimit(m.sender, isPremium, isOwner, config.options.limitCount, _user) && !m.fromMe) return global.mess("isLimit", m)
                sock.sendFile(m.from, global.api("zenz", "/creator/" + command, { 
                    text: text 
                }, "apikey"), "", m)
                user.limitAdd(m.sender, isPremium, isOwner, _user)
            }
            break
            case 'tahtacustom': {
                if (command && !isGroup) return global.mess("group", m)
                if (!text.includes('|')) return m.reply(`Example : ${prefix + command} atas|tengah|bawah`)
                if (user.isLimit(m.sender, isPremium, isOwner, config.options.limitCount, _user) && !m.fromMe) return global.mess("isLimit", m)
                let [a, b, c] = text.split`|`
                sock.sendFile(m.from, global.api("zenz", "/creator/tahtacustom", { 
                    text: a,
                    text2: b,
                    text3: c
                }, "apikey"), "", m)
                user.limitAdd(m.sender, isPremium, isOwner, _user)
            }
            break
            case 'ttpcustom': {
                if (command && !isGroup) return global.mess("group", m)
                if (!text.includes('|')) return m.reply(`Example : ${prefix + command} text|gold|black`)
                if (user.isLimit(m.sender, isPremium, isOwner, config.options.limitCount, _user) && !m.fromMe) return global.mess("isLimit", m)
                let [a, b, c] = text.split`|`
                sock.sendFile(m.from, global.api("zenz", "/creator/ttp", { 
                    text: a,
                    colour: b,
                    bgcolour: c
                }, "apikey"), "", m)
                user.limitAdd(m.sender, isPremium, isOwner, _user)
            }
            break
            case 'smeme': case 'stickermeme': {
                if (command && !isGroup) return global.mess("group", m)
                if (!quoted) return  m.reply(`Reply to Supported media With Caption ${prefix + command} or url`)
                if (user.isLimit(m.sender, isPremium, isOwner, config.options.limitCount, _user) && !m.fromMe) return global.mess("isLimit", m)
                user.limitAdd(m.sender, isPremium, isOwner, _user)
                if (!text.includes('|')) return m.reply(`Example : ${prefix + command} Top|Bottom`)
                const mime = (quoted.msg || m.msg).mimetype
                if (/image/.test(mime)) {
                    let [a, b] = text.split`|`
                    let download = await sock.downloadAndSaveMediaMessage(quoted)
                    file_name = getRandom('jpg')
                    request({
                        url: global.api("zenz", "/creator/smeme", {text: a, text2: b}, "apikey"),
                        method: 'POST',
                        formData: {
                            "sampleFile": fs.createReadStream(download)
                        },
                        encoding: "binary"
                    }, async function(error, response, body) {
                        fs.unlinkSync(download)
                        fs.writeFileSync(file_name, body, "binary")
                        ini_buff = fs.readFileSync(file_name)
                        await sock.sendFile(m.from, ini_buff, "", m).then(() => {
                            fs.unlinkSync(file_name)
                        })
                    })
                } else if (isUrl(text)) {
                    let [a, b, c] = text.split`|`
                    sock.sendFile(m.from, global.api("zenz", "/creator/smeme", {
                        text: a, 
                        text2: b,
                        url: c
                    }, "apikey"), "", m)
                } else {
                    return m.reply(`Reply to Supported media With Caption ${prefix + command} or url`, m.from, { quoted: m })
                }
            }
            break
            case 'ytcomment': case 'phcomment': case 'maketweet':case 'captcha': {
                if (command && !isGroup) return global.mess("group", m)
                if (!text) return m.reply(`Example: ${prefix + command} query`)
                if (user.isLimit(m.sender, isPremium, isOwner, config.options.limitCount, _user) && !m.fromMe) return global.mess("isLimit", m)
                sock.sendFile(m.from, global.api("zenz", "/creator/" + command, {
                    url: "https://tse2.mm.bing.net/th?id=OIP.n1C1oxOvYLLyDIavrBFoNQHaHa&pid=Api&P=0&w=153&h=153",
                    text: text, 
                    text2: m.pushName
                }, "apikey"), "", m)
                user.limitAdd(m.sender, isPremium, isOwner, _user)
            }
            break
            case 'waifu2x': {
                if (command && !isGroup) return global.mess("group", m)
                if (!quoted) return  m.reply(`Reply to Supported media With Caption ${prefix + command} or url`)
                if (user.isLimit(m.sender, isPremium, isOwner, config.options.limitCount, _user) && !m.fromMe) return global.mess("isLimit", m)
                user.limitAdd(m.sender, isPremium, isOwner, _user)
                const mime = (quoted.msg || m.msg).mimetype
                if (/image/.test(mime)) {
                    let download = await sock.downloadAndSaveMediaMessage(quoted)
                    file_name = getRandom('jpg')
                    request({
                        url: global.api("zenz", "/creator/waifu2x", {}, "apikey"),
                        method: 'POST',
                        formData: {
                            "sampleFile": fs.createReadStream(download)
                        },
                        encoding: "binary"
                    }, async function(error, response, body) {
                        fs.unlinkSync(download)
                        fs.writeFileSync(file_name, body, "binary")
                        ini_buff = fs.readFileSync(file_name)
                        await sock.sendFile(m.from, ini_buff, "", m).then(() => {
                            fs.unlinkSync(file_name)
                        })
                    })
                } else if (isUrl(text)) {
                    sock.sendFile(m.from, global.api("zenz", "/creator/waifu2x", { url: isUrl(text)[0] }, "apikey"), "", m)
                }   else {
                    return m.reply(`Reply to Supported media With Caption ${prefix + command} or url`, m.from, { quoted: m })
                }
            }
            break

            // DOWNLOADER COMMNAND
            case 'cocofun': {
                if (command && !isGroup) return global.mess("group", m)
                if (!isPremium) return global.mess("premium", m)
                if (!isUrl(text)) return m.reply(`Example: ${prefix + command} url`)
                let fetch = await fetchUrl(global.api("zenz", "/downloader/cocofun", { url: isUrl(text)[0] }, "apikey"))
                let teks = `⭔ Title : ${fetch.result.title}\n⭔ Desc : ${fetch.result.desc}\n⭔ Like : ${fetch.result.like}\n⭔ Count : ${fetch.result.play_count}\n⭔ Shared : ${fetch.result.shared}\n⭔ Resolution : ${fetch.result.resolution}\n⭔ Duration : ${fetch.result.duration}\n\n`
                sock.sendFile(m.from, fetch.result.url, "", m, { caption: teks })
            }
            break
            case 'dl_': {
                if (command && !isGroup) return global.mess("group", m)
                if (!isUrl(text)) return m.reply(`Example: ${prefix + command} url`)
                let [a, b] = args
                if (a.toLowerCase() === "audio") {
                    const zen = getRandom('mp3')
                    ffmpeg(b)
                    .audioBitrate(128)
                    .save('./temp/' + zen)
                    .on('end', () => {
                        sock.sendFile(m.from, fs.readFileSync('./temp/' + zen), "", m).then(data => {
                            fs.unlinkSync('./temp/' + zen);
                        })
                    })
                } else {
                    sock.sendFile(m.from, isUrl(a)[0], "", m)
                }
            }
            break
            case 'facebook': case 'fbdl': {
                if (command && !isGroup) return global.mess("group", m)
                if (!isPremium) return global.mess("premium", m)
                if (!isUrl(text)) return m.reply(`Example: ${prefix + command} url`)
                let fetch = await fetchUrl(global.api("zenz", "/downloader/facebook", { url: isUrl(text)[0] }, "apikey"))
                let caption = `*Facebook Downloader*\n\n`
                let i = fetch.result
                caption += `⭔ Title : ${i.title}\n`
                caption += `⭔ Source Url : ${i.url}\n`
                caption += `⭔ Duration : ${i.duration}\n`
                caption += `⭔ Source : ${i.source}\n`
                let buttons = [
                    { buttonId: `${prefix}dl_ ${i.medias[0].url}`, buttonText: { displayText: 'Video SD'}, type: 1 },
                    { buttonId: `${prefix}dl_ ${i.medias[1].url}`, buttonText: { displayText: 'Video HD'}, type: 1 }
                ]
                let buttonMessage = {
                    image: { url: i.thumbnail },
                    caption: caption,
                    footer: config.footer,
                    buttons: buttons,
                    headerType: 4
                }
                sock.sendMessage(m.from, buttonMessage, { quoted: m })
            }
            break
            case 'gore': case 'gorevideo': {
                if (command && !isGroup) return global.mess("group", m)
                if (!isNsfw) return global.mess("isNsfw", m)
                if (!isPremium) return global.mess("premium", m)
                let fetch = await fetchUrl(global.api("zenz", "/downloader/gore", {}, "apikey"))
                let teks = `⭔ Title : ${fetch.result.title}\n⭔ Tag : ${fetch.result.tag}\n⭔ Upload : ${fetch.result.upload}\n⭔ Author : ${fetch.result.author}`
                sock.sendFile(m.from, fetch.result.video1, "", m, { caption: teks })
            }
            break
            case 'hentaivideo': case 'hentaivid': {
                if (command && !isGroup) return global.mess("group", m)
                if (!isNsfw) return global.mess("isNsfw", m)
                if (!isPremium) return global.mess("premium", m)
                if (text.toLowerCase() === "longer") {
                    let fetch = await fetchUrl(global.api("zenz", "/downloader/hentaivid/longer", {}, "apikey"))
                    let teks = `⭔ Title : ${fetch.result.title}\n⭔ Category : ${fetch.result.category}\n⭔ Share : ${fetch.result.share_count}\n⭔ Views : ${fetch.result.views_count}`
                    sock.sendFile(m.from, fetch.result.video_1, "", m, { caption: teks })
                } else {
                    let fetch = await fetchUrl(global.api("zenz", "/downloader/hentaivid", {}, "apikey"))
                    let teks = `⭔ Title : ${fetch.result.title}\n⭔ Category : ${fetch.result.category}\n⭔ Share : ${fetch.result.share_count}\n⭔ Views : ${fetch.result.views_count}`
                    sock.sendFile(m.from, fetch.result.video_1, "", m, { caption: teks })
                }
            }
            break
            case 'instagram': case 'ig': case 'igdl': case 'igtv': case 'igreel': {
                if (command && !isGroup) return global.mess("group", m)
                if (!isPremium) return global.mess("premium", m)
                if (!isUrl(text)) return m.reply(`Example: ${prefix + command} url`)
                let fetch = await fetchUrl(global.api("zenz", "/downloader/instagram", { url:isUrl(text)[0] }, "apikey"))
                for (let i of fetch.result) sock.sendFile(m.from, i.url, "", m, { caption: `Download Media From : ${isUrl(text)[0]}` })
            }
            break
            case 'instastory': case 'igstory': {
                if (command && !isGroup) return global.mess("group", m)
                if (!isPremium) return global.mess("premium", m)
                if (!text) return m.reply(`Example: ${prefix + command} url or username`)
                if (isUrl(text)) {
                    let fetch = await fetchUrl(global.api("zenz", "/downloader/instastory", { url:isUrl(text)[0] }, "apikey"))
                    sock.sendFile(m.from, fetch.result.media[0].url, "", m, { caption: `Download Story From : ${isUrl(text)[0]}\n\nType: ${fetch.result.type}` })
                } else {
                    let fetch = await fetchUrl(global.api("zenz", "/downloader/igstory", { username: text }, "apikey"))
                    for (let i of fetch.result) sock.sendFile(m.from, i.url, "", m, { caption: `Download Story From : ${text}\n\nType: ${i.type}` })
                }
            }
            break
            case 'joox': {
                if (command && !isGroup) return global.mess("group", m)
                if (!isPremium) return global.mess("premium", m)
                if (!text) return m.reply(`Example: ${prefix + command} query`)
                let fetch = await fetchUrl(global.api("zenz", "/downloader/joox", { query: text }, "apikey"))
                let teks = `⭔ Title : ${fetch.result.lagu}\n⭔ Album : ${fetch.result.album}\n⭔ Penyanyi : ${fetch.result.penyanyi}\n⭔ Publish : ${fetch.result.publish}`
                let buttons = [
                    { buttonId: `${prefix}dl_ audio ${fetch.result.mp3Link}`, buttonText: { displayText: 'Audio MP3'}, type: 1 },
                    { buttonId: `${prefix}dl_ audio ${fetch.result.mp4aLink}`, buttonText: { displayText: 'Audio MP4A'}, type: 1 }
                ]
                let buttonMessage = {
                    image: { url: fetch.result.img },
                    caption: teks,
                    footer: config.footer,
                    buttons: buttons,
                    headerType: 1
                }
                sock.sendMessage(m.from, buttonMessage, { quoted: m })
            }
            break
            case 'mediafire': {
                if (command && !isGroup) return global.mess("group", m)
                if (!isPremium) return global.mess("premium", m)
                if (!isUrl(text)) return m.reply(`Example: ${prefix + command} url`)
                let fetch = await fetchUrl(global.api("zenz", "/downloader/mediafire", { url: isUrl(text)[0] }, "apikey"))
                sock.sendFile(m.from, fetch.result, "", m)
            }
            break
            case 'pinterest': case 'pinvideo': {
                if (command && !isGroup) return global.mess("group", m)
                if (!isPremium) return global.mess("premium", m)
                if (!isUrl(text)) return m.reply(`Example: ${prefix + command} url`)
                let fetch = await fetchUrl(global.api("zenz", "/downloader/pinterestdl", { url: isUrl(text)[0] }, "apikey"))
                const zen = getRandom('mp4')
                    ffmpeg(fetch.result)
                    .save('./temp/' + zen)
                    .on('end', () => {
                        sock.sendFile(m.from, fs.readFileSync('./temp/' + zen), "", m).then(data => {
                            fs.unlinkSync('./temp/' + zen);
                        })
                    })
            }
            break
            case 'soundcloud': case 'scdl': {
                if (command && !isGroup) return global.mess("group", m)
                if (!isPremium) return global.mess("premium", m)
                if (!isUrl(text)) return m.reply(`Example: ${prefix + command} url`)
                let fetch = await fetchUrl(global.api("zenz", "/downloader/soundcloud", { url: isUrl(text)[0] }, "apikey"))
                sock.sendFile(m.from, fetch.result.url, "", m)
            }
            break
            case 'tiktok': {
                if (command && !isGroup) return global.mess("group", m)
                if (!text) return m.reply(`Example: ${prefix + command} username or url`)
                if (!isPremium) return global.mess("premium", m)
                if (isUrl(text)) {
                    let fetch = await fetchUrl(global.api("zenz", "/downloader/musically", { url: isUrl(text)[0] }, "apikey"))
                    let buttons = [
                        { buttonId: `${prefix}tiktokwm ${text}`, buttonText: {displayText: '► With Watermark'}, type: 1},
                        { buttonId: `${prefix}tiktokmp3 ${text}`, buttonText: {displayText: '♫ Audio'}, type: 1}
                    ]
                    let buttonMessage = {
                        video: { url: fetch.result.nowm },
                        caption: `Download Tiktok From : ${isUrl(text)[0]}`,
                        footer: config.footer,
                        buttons: buttons,
                        headerType: 5
                    }
                    sock.sendMessage(m.from, buttonMessage, { quoted: m })
                } else {
                    let fetch = await fetchUrl(global.api("zenz", "/downloader/asupantiktok", { query: text }, "apikey"))
                    let caption = `Random Asupan Tiktok ${text}\n\n`
                    let i = fetch.result
                    caption += `⭔ Username : ${i.username}\n`
                    caption += `⭔ Followers : ${i.followers}\n`
                    caption += `⭔ Caption : ${i.media.caption}\n`
        
                    let buttons = [
                        {buttonId: `tiktok ${text}`, buttonText: {displayText: '► NEXT'}, type: 1},
                    ]
                    let buttonMessage = {
                        video: { url: i.media.videourl },
                        caption: caption,
                        footer: config.footer,
                        buttons: buttons,
                        headerType: 5
                    }
                    sock.sendMessage(m.from, buttonMessage, { quoted: m })
                }
            }
            break
            case 'tiktokporn': {
                if (command && !isGroup) return global.mess("group", m)
                if (!isNsfw) return global.mess("isNsfw", m)
                if (!isPremium) return global.mess("premium", m)
                let fetch = await fetchUrl(global.api("zenz", "/downloader/tikporn", {}, "apikey"))
                let teks = `⭔ Title : ${fetch.result.title}\n⭔ Desc : ${fetch.result.desc}\n⭔ Upload : ${fetch.result.upload}\n⭔ Like : ${fetch.result.like}\n⭔ Dislike : ${fetch.result.dislike}\n⭔ Views : ${fetch.result.views}`
                sock.sendFile(m.from, fetch.result.video, "", m, { caption: teks })
            }
            break
            case 'tiktokmp3': {
                if (command && !isGroup) return global.mess("group", m)
                if (!isPremium) return global.mess("premium", m)
                if (!isUrl(text)) return m.reply(`Example: ${prefix + command} url`)
                let fetch = await fetchUrl(global.api("zenz", "/downloader/musically", { url: isUrl(text)[0] }, "apikey"))
                let buttons = [
                    { buttonId: `${prefix}tiktokwm ${text}`, buttonText: {displayText: '► With Watermark'}, type: 1},
                    { buttonId: `${prefix}tiktoknowm ${text}`, buttonText: {displayText: '► Without Watermark'}, type: 1}
                ]
                let buttonMessage = {
                    video: { url: fetch.result.prefiew },
                    caption: `Download Tiktok From : ${isUrl(text)[0]}`,
                    footer: config.footer,
                    buttons: buttons,
                    headerType: 5
                }
                sock.sendMessage(m.from, buttonMessage, { quoted: m })
                sock.sendFile(m.from, fetch.result.audio, "", m)
            }
            break
            case 'tiktokwm': {
                if (command && !isGroup) return global.mess("group", m)
                if (!isPremium) return global.mess("premium", m)
                if (!isUrl(text)) return m.reply(`Example: ${prefix + command} url`)
                let fetch = await fetchUrl(global.api("zenz", "/downloader/tiktok", { url: isUrl(text)[0] }, "apikey"))
                let buttons = [
                    { buttonId: `${prefix}tiktoknowm ${text}`, buttonText: {displayText: '► With Watermark'}, type: 1},
                    { buttonId: `${prefix}tiktokmp3 ${text}`, buttonText: {displayText: '♫ Audio'}, type: 1}
                ]
                let buttonMessage = {
                    video: { url: fetch.result.watermark },
                    caption: `Download Tiktok From : ${isUrl(text)[0]}`,
                    footer: config.footer,
                    buttons: buttons,
                    headerType: 5
                }
                sock.sendMessage(m.from, buttonMessage, { quoted: m })
            }
            break
            case 'twitter': {
                if (command && !isGroup) return global.mess("group", m)
                if (!isPremium) return global.mess("premium", m)
                if (!isUrl(text)) return m.reply(`Example: ${prefix + command} url`)
                let fetch = await fetchUrl(global.api("zenz", "/downloader/twitter", { url: isUrl(text)[0] }, "apikey"))
                let caption = `*Twitter Downloader*\n\n`
                let i = fetch.result
                caption += `⭔ Desc : ${i.desc}\n`
                let buttons = [
                    { buttonId: `${prefix}dl_ ${i.sd}`, buttonText: { displayText: 'Video SD'}, type: 1 },
                    { buttonId: `${prefix}dl_ ${i.hd}`, buttonText: { displayText: 'Video HD'}, type: 1 },
                    { buttonId: `${prefix}dl_ audio ${i.audio}`, buttonText: { displayText: 'Audio'}, type: 1 }
                ]
                let buttonMessage = {
                    image: { url: i.thumb },
                    caption: caption,
                    footer: config.footer,
                    buttons: buttons,
                    headerType: 4
                }
                sock.sendMessage(m.from, buttonMessage, { quoted: m })
            }
            break
            case 'twittermp3': {
                if (command && !isGroup) return global.mess("group", m)
                if (!isPremium) return global.mess("premium", m)
                if (!isUrl(text)) return m.reply(`Example: ${prefix + command} url`)
                let fetch = await fetchUrl(global.api("zenz", "/downloader/twitter", { url: isUrl(text)[0] }, "apikey"))
                let buttons = [
                    { buttonId: `${prefix}twitter ${text}`, buttonText: {displayText: '► Video'}, type: 1}
                ]
                let buttonMessage = {
                    video: { url: fetch.result.thumb },
                    caption: `⭔ Desc : ${fetch.result.desc}\n⭔ Source Url : ${isUrl(text)[0]}`,
                    footer: config.footer,
                    buttons: buttons,
                    headerType: 4
                }
                sock.sendMessage(m.from, buttonMessage, { quoted: m })
                sock.sendFile(m.from, fetch.result.audio, "", m)
            }
            break
            case 'xnxx': case 'xvideos': {
                if (command && !isGroup) return global.mess("group", m)
                if (!isNsfw) return global.mess("isNsfw", m)
                if (!isPremium) return global.mess("premium", m)
                if (!isUrl(text)) return m.reply(`Example: ${prefix + command} url`)
                let fetch = await fetchUrl(global.api("zenz", "/downloader/" + command, { url: isUrl(text)[0] }, "apikey"))
                let teks = `⭔ Title : ${fetch.result.title}\n⭔ Duration : ${fetch.result.duration}s`
                sock.sendFile(m.from, fetch.result.files.low, "", m, { caption: teks })
            }
            break
            case 'youtube': case 'ytdl': case 'ytshorts': {
                if (command && !isGroup) return global.mess("group", m)
                if (!isPremium) return global.mess("premium", m)
                if (!isUrl(text)) return m.reply(`Example: ${prefix + command} url`)
                let fetch = await fetchUrl(global.api("zenz", "/downloader/youtube", { url: isUrl(text)[0] }, "apikey"))
                let caption = `*Youtube Downloader*\n\n`
                let i = fetch.result
                caption += `⭔ Title : ${i.title}\n`
                caption += `⭔ Audio Size : ${i.sizeAudio}\n`
                caption += `⭔ Video Size : ${i.sizeVideo}\n`
                caption += `⭔ Views : ${i.views}\n`
                caption += `⭔ Likes : ${i.likes}\n`
                caption += `⭔ Dislike : ${i.dislike}\n`
                caption += `⭔ Channel : ${i.channel}\n`
                caption += `⭔ UploadDate : ${i.uploadDate}\n\n`
                caption += `⭔ Desc : ${i.desc}\n`
                let buttons = [
                    { buttonId: `${prefix}dl_ audio ${i.getAudio}`, buttonText: { displayText: 'Get Audio'}, type: 1 },
                    { buttonId: `${prefix}dl_ ${i.getVideo}`, buttonText: { displayText: 'Get Video'}, type: 1 }
                ]
                let buttonMessage = {
                    image: { url: i.thumb },
                    caption: caption,
                    footer: config.footer,
                    buttons: buttons,
                    headerType: 4
                }
                sock.sendMessage(m.from, buttonMessage, { quoted: m })
            }
            break
            case 'ytplay': case 'play': {
                if (command && !isGroup) return global.mess("group", m)
                if (!isPremium) return global.mess("premium", m)
                if (!text) return m.reply(`Example: ${prefix + command} query`)
                let fetch = await fetchUrl(global.api("zenz", "/downloader/ytplay", { query: text }, "apikey"))
                let caption = `*Youtube Play*\n\n`
                let i = fetch.result
                caption += `⭔ Title : ${i.title}\n`
                caption += `⭔ Audio Size : ${i.sizeAudio}\n`
                caption += `⭔ Video Size : ${i.sizeVideo}\n`
                caption += `⭔ Views : ${i.views}\n`
                caption += `⭔ Likes : ${i.likes}\n`
                caption += `⭔ Dislike : ${i.dislike}\n`
                caption += `⭔ Channel : ${i.channel}\n`
                caption += `⭔ UploadDate : ${i.uploadDate}\n\n`
                caption += `⭔ Desc : ${i.desc}\n`
                let buttons = [
                    { buttonId: `${prefix}dl_ audio ${i.getAudio}`, buttonText: { displayText: 'Get Audio'}, type: 1 },
                    { buttonId: `${prefix}dl_ ${i.getVideo}`, buttonText: { displayText: 'Get Video'}, type: 1 }
                ]
                let buttonMessage = {
                    image: { url: i.thumb },
                    caption: caption,
                    footer: config.footer,
                    buttons: buttons,
                    headerType: 4
                }
                sock.sendMessage(m.from, buttonMessage, { quoted: m })
            }
            break
            case 'zippyshare': {
                if (command && !isGroup) return global.mess("group", m)
                if (!isPremium) return global.mess("premium", m)
                if (!isUrl(text)) return m.reply(`Example: ${prefix + command} url`)
                let fetch = await fetchUrl(global.api("zenz", "/downloader/zippyshare", { url: isUrl(text)[0] }, "apikey"))
                sock.sendFile(m.from, fetch.result.link, "", m)
            }
            break

            // ENTERTAINMENT COMMNAND
            case 'asahotak': {
                if (command && !isGroup) return global.mess("group", m)
                if (asahotak.hasOwnProperty(m.sender.split('@')[0])) return m.reply("Masih Ada Sesi Yang Belum Diselesaikan!")
                if (user.isLimitGame(m.sender, config.options.limitgameCount, _user) && !m.fromMe) return global.mess("isLimitGame", m)
                user.limitGameAdd(m.sender, _user)
                let fetch = await fetchUrl(global.api("zenz", "/entertainment/asahotak", {}, "apikey"))
                let result = await fetch.result
                sock.sendText(m.from, `Silahkan Jawab Pertanyaan Berikut\n\n${result.soal}\n\nWaktu : 30s`, m).then(() => {
                    asahotak[m.sender.split('@')[0]] = result.jawaban.toLowerCase()
                    console.log("Jawaban: " + result.jawaban)
                })
                await sleep(30000)
                if (asahotak.hasOwnProperty(m.sender.split('@')[0])) {
                    sock.sendText(m.from, `Waktu Habis\n\nJawaban:  ${asahotak[m.sender.split('@')[0]]}`, m)
                    delete asahotak[m.sender.split('@')[0]]
                }
            }
            break
            case 'caklontong': {
                if (command && !isGroup) return global.mess("group", m)
                if (caklontong.hasOwnProperty(m.sender.split('@')[0])) return m.reply("Masih Ada Sesi Yang Belum Diselesaikan!")
                if (user.isLimitGame(m.sender, config.options.limitgameCount, _user) && !m.fromMe) return global.mess("isLimitGame", m)
                user.limitGameAdd(m.sender, _user)
                let fetch = await fetchUrl(global.api("zenz", "/entertainment/caklontong", {}, "apikey"))
                let result = await fetch.result
                sock.sendText(m.from, `Silahkan Jawab Pertanyaan Berikut\n\n${result.soal}\n\nWaktu : 30s`, m).then(() => {
                    caklontong[m.sender.split('@')[0]] = result.jawaban.toLowerCase()
                    console.log("Jawaban: " + result.jawaban)
                })
                await sleep(30000)
                if (caklontong.hasOwnProperty(m.sender.split('@')[0])) {
                    sock.sendText(m.from, `Waktu Habis\n\nJawaban:  ${caklontong[m.sender.split('@')[0]]}\nKeterangan: ${result.deskripsi}`, m)
                    delete caklontong[m.sender.split('@')[0]]
                }
            }
            break
            case 'family100': {
                if (command && !isGroup) return global.mess("group", m)
                if (family100.hasOwnProperty(m.sender.split('@')[0])) return m.reply("Masih Ada Sesi Yang Belum Diselesaikan!")
                if (user.isLimitGame(m.sender, config.options.limitgameCount, _user) && !m.fromMe) return global.mess("isLimitGame", m)
                user.limitGameAdd(m.sender, _user)
                let fetch = await fetchUrl(global.api("zenz", "/entertainment/family100", {}, "apikey"))
                let result = await fetch.result
                sock.sendText(m.from, `Silahkan Jawab Pertanyaan Berikut\n\n${result.soal} ?\nPilih Salah Satu Dari ${result.jawaban.length} Jawaban\n\nWaktu : 30s\n`, m).then(() => {
                    family100[m.sender.split('@')[0]] = result.jawaban
                    console.log("Jawaban: " + result.jawaban)
                })
                await sleep(30000)
                if (family100.hasOwnProperty(m.sender.split('@')[0])) {
                    sock.sendText(m.from, `Waktu Habis\n\nJawaban:  ${family100[m.sender.split('@')[0]]}`, m)
                    delete family100[m.sender.split('@')[0]]
                }
            }
            break
            case 'jagokata': {
                if (command && !isGroup) return global.mess("group", m)
                if (!text) return m.reply(`Example: ${prefix + command} query`)
                if (user.isLimit(m.sender, isPremium, isOwner, config.options.limitCount, _user) && !m.fromMe) return global.mess("isLimit", m)
                let fetch = await fetchUrl(global.api("zenz", "/entertainment/jagokata", { query: text }, "apikey"))
                let caption = `Jago Kata Query : ${text}\n\n`
                let i = fetch.result
                caption += `⭔ Message : ${i.message}\n\n`
                caption += `⭔ By : ${i.by}\n`
                sock.sendText(m.from, caption, m)
                user.limitAdd(m.sender, isPremium, isOwner, _user)
            }
            break
            case 'siapakah': {
                if (command && !isGroup) return global.mess("group", m)
                if (siapakah.hasOwnProperty(m.sender.split('@')[0])) return m.reply("Masih Ada Sesi Yang Belum Diselesaikan!")
                if (user.isLimitGame(m.sender, config.options.limitgameCount, _user) && !m.fromMe) return global.mess("isLimitGame", m)
                user.limitGameAdd(m.sender, _user)
                let fetch = await fetchUrl(global.api("zenz", "/entertainment/siapakah", {}, "apikey"))
                let result = await fetch.result
                sock.sendText(m.from, `Silahkan Jawab Pertanyaan Berikut\n\n${result.soal}\n\nWaktu : 30s`, m).then(() => {
                    siapakah[m.sender.split('@')[0]] = result.jawaban.toLowerCase()
                    console.log("Jawaban: " + result.jawaban)
                })
                await sleep(30000)
                if (siapakah.hasOwnProperty(m.sender.split('@')[0])) {
                    sock.sendText(m.from, `Waktu Habis\n\nJawaban:  ${siapakah[m.sender.split('@')[0]]}`, m)
                    delete siapakah[m.sender.split('@')[0]]
                }
            }
            break
            case 'simi': {
                if (command && !isGroup) return global.mess("group", m)
                if (!text) return m.reply('Mau Nanya Apa ?')
                if (user.isLimit(m.sender, isPremium, isOwner, config.options.limitCount, _user) && !m.fromMe) return global.mess("isLimit", m)
                try {
                    let fetch = await fetchUrl(global.api("zenz", "/entertainment/simisimi", { text: encodeURIComponent(text) }, "apikey"))
                    result = fetch.result.message
                    sock.sendText(m.from, result, m)
                    user.limitAdd(m.sender, isPremium, isOwner, _user)
                } catch {
                    m.reply("Error Coba Ulangi")
                }
            }
            break
            case 'susunkata': {
                if (command && !isGroup) return global.mess("group", m)
                if (susunkata.hasOwnProperty(m.sender.split('@')[0])) return m.reply("Masih Ada Sesi Yang Belum Diselesaikan!")
                if (user.isLimitGame(m.sender, config.options.limitgameCount, _user) && !m.fromMe) return global.mess("isLimitGame", m)
                user.limitGameAdd(m.sender, _user)
                let fetch = await fetchUrl(global.api("zenz", "/entertainment/susunkata", {}, "apikey"))
                let result = await fetch.result
                sock.sendText(m.from, `Silahkan Jawab Pertanyaan Berikut\n\n${result.soal}\nTipe: ${result.tipe}\n\nWaktu : 30s`, m).then(() => {
                    susunkata[m.sender.split('@')[0]] = result.jawaban.toLowerCase()
                    console.log("Jawaban: " + result.jawaban)
                })
                await sleep(30000)
                if (susunkata.hasOwnProperty(m.sender.split('@')[0])) {
                    sock.sendText(m.from, `Waktu Habis\n\nJawaban:  ${susunkata[m.sender.split('@')[0]]}`, m)
                    delete susunkata[m.sender.split('@')[0]]
                }
            }
            break
            case 'tebakbendera': {
                if (command && !isGroup) return global.mess("group", m)
                if (tebakbendera.hasOwnProperty(m.sender.split('@')[0])) return m.reply("Masih Ada Sesi Yang Belum Diselesaikan!")
                if (user.isLimitGame(m.sender, config.options.limitgameCount, _user) && !m.fromMe) return global.mess("isLimitGame", m)
                user.limitGameAdd(m.sender, _user)
                let fetch = await fetchUrl(global.api("zenz", "/entertainment/tebakbendera", {}, "apikey"))
                let result = await fetch.result
                sock.sendFile(m.from, result.img, "", m, { caption: `Silahkan Jawab Pertanyaan Berikut\n\nDeskripsi: ${result.flag}\nWaktu : 30s`}).then(() => {
                    tebakbendera[m.sender.split('@')[0]] = result.name.toLowerCase()
                    console.log("Jawaban: " + result.name)
                })
                await sleep(30000)
                if (tebakbendera.hasOwnProperty(m.sender.split('@')[0])) {
                    sock.sendText(m.from, `Waktu Habis\n\nJawaban:  ${tebakbendera[m.sender.split('@')[0]]}`, m)
                    delete tebakbendera[m.sender.split('@')[0]]
                }   
            }
            break
            case 'tebakgambar': {
                if (command && !isGroup) return global.mess("group", m)
                if (tebakgambar.hasOwnProperty(m.sender.split('@')[0])) return m.reply("Masih Ada Sesi Yang Belum Diselesaikan!")
                if (user.isLimitGame(m.sender, config.options.limitgameCount, _user) && !m.fromMe) return global.mess("isLimitGame", m)
                user.limitGameAdd(m.sender, _user)
                let fetch = await fetchUrl(global.api("zenz", "/entertainment/tebakgambar", {}, "apikey"))
                let result = await fetch.result
                sock.sendFile(m.from, result.img, "", m, { caption: `Silahkan Jawab Pertanyaan Berikut\n\nDeskripsi: ${result.deskripsi}\n\nWaktu : 30s`}).then(() => {
                    tebakgambar[m.sender.split('@')[0]] = result.jawaban.toLowerCase()
                    console.log("Jawaban: " + result.jawaban)
                })
                await sleep(30000)
                if (tebakgambar.hasOwnProperty(m.sender.split('@')[0])) {
                    sock.sendText(m.from, `Waktu Habis\n\nJawaban:  ${tebakgambar[m.sender.split('@')[0]]}`, m)
                    delete tebakgambar[m.sender.split('@')[0]]
                }
            }
            break
            case 'tebakkabupaten': {
                if (command && !isGroup) return global.mess("group", m)
                if (tebakkabupaten.hasOwnProperty(m.sender.split('@')[0])) return m.reply("Masih Ada Sesi Yang Belum Diselesaikan!")
                if (user.isLimitGame(m.sender, config.options.limitgameCount, _user) && !m.fromMe) return global.mess("isLimitGame", m)
                user.limitGameAdd(m.sender, _user)
                let fetch = await fetchUrl(global.api("zenz", "/entertainment/tebakkabupaten", {}, "apikey"))
                let result = await fetch.result
                sock.sendFile(m.from, result.url, "", m, { caption: `Silahkan Jawab Pertanyaan Berikut\nWaktu : 30s`}).then(() => {
                    tebakkabupaten[m.sender.split('@')[0]] = result.title.toLowerCase()
                    console.log("Jawaban: " + result.title)
                })
                await sleep(30000)
                if (tebakkabupaten.hasOwnProperty(m.sender.split('@')[0])) {
                    sock.sendText(m.from, `Waktu Habis\n\nJawaban:  ${tebakkabupaten[m.sender.split('@')[0]]}`, m)
                    delete tebakkabupaten[m.sender.split('@')[0]]
                }
                
            }
            break
            case 'tebakkalimat': {
                if (command && !isGroup) return global.mess("group", m)
                if (tebakkalimat.hasOwnProperty(m.sender.split('@')[0])) return m.reply("Masih Ada Sesi Yang Belum Diselesaikan!")
                if (user.isLimitGame(m.sender, config.options.limitgameCount, _user) && !m.fromMe) return global.mess("isLimitGame", m)
                user.limitGameAdd(m.sender, _user)
                let fetch = await fetchUrl(global.api("zenz", "/entertainment/tebakkalimat", {}, "apikey"))
                let result = await fetch.result
                sock.sendText(m.from, `Silahkan Jawab Pertanyaan Berikut\n\n${result.soal}\n\nWaktu : 30s`, m).then(() => {
                    tebakkalimat[m.sender.split('@')[0]] = result.jawaban.toLowerCase()
                    console.log("Jawaban: " + result.jawaban)
                })
                await sleep(30000)
                if (tebakkalimat.hasOwnProperty(m.sender.split('@')[0])) {
                    sock.sendText(m.from, `Waktu Habis\n\nJawaban:  ${tebakkalimat[m.sender.split('@')[0]]}`, m)
                    delete tebakkalimat[m.sender.split('@')[0]]
                }
            }
            break
            case 'tebakkata': {
                if (command && !isGroup) return global.mess("group", m)
                if (tebakkata.hasOwnProperty(m.sender.split('@')[0])) return m.reply("Masih Ada Sesi Yang Belum Diselesaikan!")
                if (user.isLimitGame(m.sender, config.options.limitgameCount, _user) && !m.fromMe) return global.mess("isLimitGame", m)
                user.limitGameAdd(m.sender, _user)
                let fetch = await fetchUrl(global.api("zenz", "/entertainment/tebakkata", {}, "apikey"))
                let result = await fetch.result
                sock.sendText(m.from, `Silahkan Jawab Pertanyaan Berikut\n\n${result.soal}\n\nWaktu : 30s`, m).then(() => {
                    tebakkata[m.sender.split('@')[0]] = result.jawaban.toLowerCase()
                    console.log("Jawaban: " + result.jawaban)
                })
                await sleep(30000)
                if (tebakkata.hasOwnProperty(m.sender.split('@')[0])) {
                    sock.sendText(m.from, `Waktu Habis\n\nJawaban:  ${tebakkata[m.sender.split('@')[0]]}`, m)
                    delete tebakkata[m.sender.split('@')[0]]
                }
            }
            break
            case 'tebaklagu': {
                if (command && !isGroup) return global.mess("group", m)
                if (tebaklagu.hasOwnProperty(m.sender.split('@')[0])) return m.reply("Masih Ada Sesi Yang Belum Diselesaikan!")
                if (user.isLimitGame(m.sender, config.options.limitgameCount, _user) && !m.fromMe) return global.mess("isLimitGame", m)
                user.limitGameAdd(m.sender, _user)
                let fetch = await fetchUrl("https://hisoka-morou.netlify.app/assets/database/tebaklagu.json")
                let result = await fetch[Math.floor(Math.random() * fetch.length)]
                sock.sendMessage(m.from, { audio: { url: result.link_song }, mimetype: "audio/mpeg", fileName: "???" }, { quoted: m }).then(() => {
                    tebaklagu[m.sender.split('@')[0]] = result.jawaban.toLowerCase()
                    console.log("Jawaban: " + result.jawaban)
                })
                await sleep(30000)
                if (tebaklagu.hasOwnProperty(m.sender.split('@')[0])) {
                    sock.sendText(m.from, `Waktu Habis\n\nJawaban:  ${tebaklagu[m.sender.split('@')[0]]}`, m)
                    delete tebaklagu[m.sender.split('@')[0]]
                }
            }
            break
            case 'tebaklagu2': {
                if (command && !isGroup) return global.mess("group", m)
                if (tebaklagu.hasOwnProperty(m.sender.split('@')[0])) return m.reply("Masih Ada Sesi Yang Belum Diselesaikan!")
                if (user.isLimitGame(m.sender, config.options.limitgameCount, _user) && !m.fromMe) return global.mess("isLimitGame", m)
                user.limitGameAdd(m.sender, _user)
                let result = await fetchUrl(global.api("zenz", "/entertainment/tebaklagu2", {}, "apikey"))
                sock.sendMessage(m.from, { audio: { url: result.link_song }, mimetype: "audio/mpeg", fileName: "???" }, { quoted: m }).then(() => {
                    tebaklagu[m.sender.split('@')[0]] = result.jawaban.toLowerCase()
                    console.log("Jawaban: " + result.jawaban)
                })
                await sleep(30000)
                if (tebaklagu.hasOwnProperty(m.sender.split('@')[0])) {
                    sock.sendText(m.from, `Waktu Habis\n\nJawaban:  ${tebaklagu[m.sender.split('@')[0]]}`, m)
                    delete tebaklagu[m.sender.split('@')[0]]
                }
            }
            break
            case 'tebaklirik': {
                if (command && !isGroup) return global.mess("group", m)
                if (tebaklirik.hasOwnProperty(m.sender.split('@')[0])) return m.reply("Masih Ada Sesi Yang Belum Diselesaikan!")
                if (user.isLimitGame(m.sender, config.options.limitgameCount, _user) && !m.fromMe) return global.mess("isLimitGame", m)
                user.limitGameAdd(m.sender, _user)
                let fetch = await fetchUrl(global.api("zenz", "/entertainment/tebaklirik", {}, "apikey"))
                let result = await fetch.result
                sock.sendText(m.from, `Silahkan Jawab Pertanyaan Berikut\n\n${result.soal}\n\nWaktu : 30s`, m).then(() => {
                    tebaklirik[m.sender.split('@')[0]] = result.jawaban.toLowerCase()
                    console.log("Jawaban: " + result.jawaban)
                })
                await sleep(30000)
                if (tebaklirik.hasOwnProperty(m.sender.split('@')[0])) {
                    sock.sendText(m.from, `Waktu Habis\n\nJawaban:  ${tebaklirik[m.sender.split('@')[0]]}`, m)
                    delete tebaklirik[m.sender.split('@')[0]]
                }
            }
            break
            case 'tebaktebakan': {
                if (command && !isGroup) return global.mess("group", m)
                if (tebaktebakan.hasOwnProperty(m.sender.split('@')[0])) return m.reply("Masih Ada Sesi Yang Belum Diselesaikan!")
                if (user.isLimitGame(m.sender, config.options.limitgameCount, _user) && !m.fromMe) return global.mess("isLimitGame", m)
                user.limitGameAdd(m.sender, _user)
                let fetch = await fetchUrl(global.api("zenz", "/entertainment/tebaktebakan", {}, "apikey"))
                let result = await fetch.result
                sock.sendText(m.from, `Silahkan Jawab Pertanyaan Berikut\n\n${result.soal}\n\nWaktu : 30s`, m).then(() => {
                    tebaktebakan[m.sender.split('@')[0]] = result.jawaban.toLowerCase()
                    console.log("Jawaban: " + result.jawaban)
                })
                await sleep(30000)
                if (tebaktebakan.hasOwnProperty(m.sender.split('@')[0])) {
                    sock.sendText(m.from, `Waktu Habis\n\nJawaban:  ${tebaktebakan[m.sender.split('@')[0]]}`, m)
                    delete tebaktebakan[m.sender.split('@')[0]]
                }
                
            }
            break
            case 'tekateki': {
                if (command && !isGroup) return global.mess("group", m)
                if (tekateki.hasOwnProperty(m.sender.split('@')[0])) return m.reply("Masih Ada Sesi Yang Belum Diselesaikan!")
                if (user.isLimitGame(m.sender, config.options.limitgameCount, _user) && !m.fromMe) return global.mess("isLimitGame", m)
                user.limitGameAdd(m.sender, _user)
                let fetch = await fetchUrl(global.api("zenz", "/entertainment/tekateki", {}, "apikey"))
                let result = await fetch.result
                sock.sendText(m.from, `Silahkan Jawab Pertanyaan Berikut\n\n${result.soal}\n\nWaktu : 30s`, m).then(() => {
                    tekateki[m.sender.split('@')[0]] = result.jawaban.toLowerCase()
                    console.log("Jawaban: " + result.jawaban)
                })
                await sleep(30000)
                if (tekateki.hasOwnProperty(m.sender.split('@')[0])) {
                    sock.sendText(m.from, `Waktu Habis\n\nJawaban:  ${tekateki[m.sender.split('@')[0]]}`, m)
                    delete tekateki[m.sender.split('@')[0]]
                }   
            }
            break
            case 'dare': case 'truth': {
                if (command && !isGroup) return global.mess("group", m)
                if (user.isLimit(m.sender, isPremium, isOwner, config.options.limitCount, _user) && !m.fromMe) return global.mess("isLimit", m)
                let fetch = await fetchUrl(global.api("zenz", "/entertainment/" + command, {}, "apikey"))
                sock.sendText(m.from, fetch.result, m)
                user.limitAdd(m.sender, isPremium, isOwner, _user)
            }
            break

            // GROUP COMMNAND
            case 'leveling': {
                if (command && !isGroup) return global.mess("group", m)
                if (!isGroupAdmins) return global.mess("admin", m)
                if (text === 'enable') {
                    if (isLevelingOn === true) return m.reply('Leveling already active')
                    group.addLeveling(m.from, _group)
                    m.reply(`Success activated Leveling`)
                } else if (text === 'disable') {
                    if (isLevelingOn === false) return m.reply('Leveling already deactive')
                    group.delLeveling(m.from, _group)
                    m.reply(`Success deactivated Leveling`)
                } else {
                    let buttons = [
                        { buttonId: `${prefix}leveling enable`, buttonText: { displayText: 'ENABLE'}, type: 1 },
                        { buttonId: `${prefix}leveling disable`, buttonText: { displayText: 'DISABLE'}, type: 1 }
                    ]
                    let buttonMessage = {
                        text: `*⭔ Leveling Status:* ${group.cekLeveling(m.from, _group) ? 'Activated' : 'Deactivated'}\n\n_Pilih enable atau disable!_`,
                        footer: config.footer,
                        buttons: buttons,
                        headerType: 4
                    }
                    sock.sendMessage(m.from, buttonMessage, { quoted: m })
                }
            }
            break
            case 'nsfw': {
                if (command && !isGroup) return global.mess("group", m)
                if (!isGroupAdmins) return global.mess("admin", m)
                if (text === 'enable') {
                    if (isNsfw === true) return m.reply('Nsfw already active')
                    group.addNsfw(m.from, _group)
                    m.reply(`Success activated Nsfw`)
                } else if (text === 'disable') {
                    if (isLevelingOn === false) return m.reply('Nsfw already deactive')
                    group.delNsfw(m.from, _group)
                    m.reply(`Success deactivated Nsfw`)
                } else {
                    let buttons = [
                        { buttonId: `${prefix}nsfw enable`, buttonText: { displayText: 'ENABLE'}, type: 1 },
                        { buttonId: `${prefix}nsfw disable`, buttonText: { displayText: 'DISABLE'}, type: 1 }
                    ]
                    let buttonMessage = {
                        text: `*⭔ Nsfw Status:* ${group.cekLeveling(m.from, _group) ? 'Activated' : 'Deactivated'}\n\n_Pilih enable atau disable!_`,
                        footer: config.footer,
                        buttons: buttons,
                        headerType: 4
                    }
                    sock.sendMessage(m.from, buttonMessage, { quoted: m })
                }
            }
            break
            case 'offline': {
                if (command && !isGroup) return global.mess("group", m)
                if (!isGroupAdmins) return global.mess("admin", m)
                if (text === 'enable') {
                    if (isOffline === true) return m.reply('BOT Offline already active')
                    group.addOffline(m.from, _group)
                    m.reply(`Success Offline`)
                } else if (text === 'disable') {
                    if (isOffline === false) return m.reply('BOT Offline already deactive')
                    group.delOffline(m.from, _group)
                    m.reply(`Success deactivated Offline`)
                } else {
                    let buttons = [
                        { buttonId: `${prefix}offline enable`, buttonText: { displayText: 'ENABLE'}, type: 1 },
                        { buttonId: `${prefix}offline disable`, buttonText: { displayText: 'DISABLE'}, type: 1 }
                    ]
                    let buttonMessage = {
                        text: `*⭔ BOT Offline Status:* ${group.cekLeveling(m.from, _group) ? 'Activated' : 'Deactivated'}\n\n_Pilih enable atau disable!_`,
                        footer: config.footer,
                        buttons: buttons,
                        headerType: 4
                    }
                    sock.sendMessage(m.from, buttonMessage, { quoted: m })
                }
            }
            break

            // INFORMATION COMMNAND
            case 'blogger': case 'blogspot': {
                if (command && !isGroup) return global.mess("group", m)
                if (!text) return m.reply(`Example: ${prefix + command} query`)
                if (user.isLimit(m.sender, isPremium, isOwner, config.options.limitCount, _user) && !m.fromMe) return global.mess("isLimit", m)
                let fetch = await fetchUrl(global.api("zenz", "/information/blogger", { query: text }, "apikey"))
                sock.sendText(m.from, fetch.result, m)
                user.limitAdd(m.sender, isPremium, isOwner, _user)
            }
            break
            case 'covid': {
                if (command && !isGroup) return global.mess("group", m)
                if (user.isLimit(m.sender, isPremium, isOwner, config.options.limitCount, _user) && !m.fromMe) return global.mess("isLimit", m)
                let fetch = await fetchUrl(global.api("zenz", "/information/covidworld", {}, "apikey"))
                let caption = `Covid-19 Information :\n\n`
                let i = fetch.result
                caption += `⭔ TotalCases : ${i.totalCases}\n`
                caption += `⭔ Recovered : ${i.recovered}\n`
                caption += `⭔ Deaths : ${i.deaths}\n`
                caption += `⭔ ActiveCases : ${i.activeCases}\n`
                caption += `⭔ ClosedCases : ${i.closedCases}\n`
                caption += `⭔ LastUpdate : ${i.lastUpdate}\n`
                sock.sendText(m.from, caption, m)
                user.limitAdd(m.sender, isPremium, isOwner, _user)
            }
            break
            case 'gempa': {
                if (command && !isGroup) return global.mess("group", m)
                if (user.isLimit(m.sender, isPremium, isOwner, config.options.limitCount, _user) && !m.fromMe) return global.mess("isLimit", m)
                let fetch = await fetchUrl(global.api("zenz", "/information/bmkg/gempa", {}, "apikey"))
                let caption = `Gempa Information :\n\n`
                let i = fetch.result
                caption += `⭔ Tanggal : ${i.tanggal}\n`
                caption += `⭔ Jam : ${i.jam}\n`
                caption += `⭔ Datetime : ${i.datetime}\n`
                caption += `⭔ Coordinates : ${i.coordinates}\n`
                caption += `⭔ Lintang : ${i.lintang}\n`
                caption += `⭔ Bujur : ${i.bujur}\n`
                caption += `⭔ Magnitude : ${i.magnitude}\n`
                caption += `⭔ Kedalaman : ${i.kedalaman}\n`
                caption += `⭔ Wilayah : ${i.wilayah}\n`
                caption += `⭔ Potensi : ${i.potensi}\n`
                caption += `⭔ Dirasakan : ${i.dirasakan}\n`
                caption += `⭔ Shakemap : ${i.shakemap}\n`
                sock.sendFile(m.from, i.shakemap, "", m, { caption })
                user.limitAdd(m.sender, isPremium, isOwner, _user)
            }
            break
            case 'iplookup': {
                if (command && !isGroup) return global.mess("group", m)
                if (!text) return m.reply(`Example: ${prefix + command} query`)
                if (user.isLimit(m.sender, isPremium, isOwner, config.options.limitCount, _user) && !m.fromMe) return global.mess("isLimit", m)
                let fetch = await fetchUrl(global.api("zenz", "/information/iplookup", { query: text }, "apikey"))
                let caption = `IP Information :\n\n`
                let i = fetch.result
                caption += `⭔ Country : ${i.country}\n`
                caption += `⭔ Region : ${i.region}\n`
                caption += `⭔ City : ${i.city}\n`
                caption += `⭔ Zip : ${i.zip}\n`
                caption += `⭔ Latitude : ${i.latitude}\n`
                caption += `⭔ Longtitude : ${i.longtitude}\n`
                caption += `⭔ Isp : ${i.isp}\n`
                caption += `⭔ Domain : ${i.domain}\n`
                caption += `⭔ Usagetype : ${i.usage_type}\n`
                caption += `⭔ Time_zone : ${i.time_zone}\n`
                caption += `⭔ Local_time : ${i.local_time}\n`
                caption += `⭔ Addres_type : ${i.addres_type}\n`
                caption += `⭔ Category : ${i.category}\n`
                caption += `⭔ Proxy : ${i.proxy}\n`
                caption += `⭔ Provider : ${i.provider}\n`
                caption += `⭔ Weather : ${i.weather}\n`
                sock.sendText(m.from, caption, m)
                user.limitAdd(m.sender, isPremium, isOwner, _user)
            }
            break
            case 'kbbi': {
                if (command && !isGroup) return global.mess("group", m)
                if (!text) return m.reply(`Example: ${prefix + command} query`)
                if (user.isLimit(m.sender, isPremium, isOwner, config.options.limitCount, _user) && !m.fromMe) return global.mess("isLimit", m)
                let fetch = await fetchUrl(global.api("zenz", "/information/kbbi", { query: text }, "apikey"))
                let caption = `Arti Kbbi Dari ${text} :\n\n`
                let i = fetch.result
                caption += `${i.arti}`
                sock.sendText(m.from, caption, m)
                user.limitAdd(m.sender, isPremium, isOwner, _user)
            }
            break
            case 'mpl': {
                if (command && !isGroup) return global.mess("group", m)
                if (user.isLimit(m.sender, isPremium, isOwner, config.options.limitCount, _user) && !m.fromMe) return global.mess("isLimit", m)
                let fetch = await fetchUrl(global.api("zenz", "/information/mpl", {}, "apikey"))
                let caption = `MPL Information :\n\n`
                for (let i of fetch.result) {
                    caption += `⭔ Tanggal : ${i.tanggal}\n`
                    caption += `⭔ Week : ${i.week}\n`
                    caption += `⭔ Jam : ${i.jam}\n`
                    caption += `⭔ Match : ${i.match}\n`
                    caption += `⭔ Score : ${i.score}\n`
                    caption += `⭔ Replay : ${i.replay}\n`
                }
                sock.sendText(m.from, caption, m)
                user.limitAdd(m.sender, isPremium, isOwner, _user)
            }
            break
            case 'translate': case 'tr': {
                if (command && !isGroup) return global.mess("group", m)
                if (!text.includes('|')) return m.reply(`Example : ${prefix + command} en|query`)
                if (user.isLimit(m.sender, isPremium, isOwner, config.options.limitCount, _user) && !m.fromMe) return global.mess("isLimit", m)
                let [a, b] = text.split`|`
                let fetch = await fetchUrl(global.api("zenz", "/information/translate/" + a, { query: b }, "apikey"))
                let caption = `Text Translator :\n\n`
                let i = fetch.result
                caption += `⭔ To ${a} : ${i}\n`
                sock.sendText(m.from, caption, m)
                user.limitAdd(m.sender, isPremium, isOwner, _user)
            }
            break
            case 'wikia': case 'wikien': {
                if (command && !isGroup) return global.mess("group", m)
                if (!text) return m.reply(`Example: ${prefix + command} query`)
                if (user.isLimit(m.sender, isPremium, isOwner, config.options.limitCount, _user) && !m.fromMe) return global.mess("isLimit", m)
                let fetch = await fetchUrl(global.api("zenz", "/information/wikia", { query: text }, "apikey"))
                sock.sendText(m.from, fetch.result, m)
                user.limitAdd(m.sender, isPremium, isOwner, _user)
            }
            break
            case 'wikipedia': {
                if (command && !isGroup) return global.mess("group", m)
                if (!text) return m.reply(`Example: ${prefix + command} query`)
                if (user.isLimit(m.sender, isPremium, isOwner, config.options.limitCount, _user) && !m.fromMe) return global.mess("isLimit", m)
                let fetch = await fetchUrl(global.api("zenz", "/information/wikipedia", { query: text }, "apikey"))
                let caption = `Wikipedia Dari ${text} :\n\n`
                let i = fetch.result
                caption += `${i.isi}\n`
                sock.sendText(m.from, caption, m)
                user.limitAdd(m.sender, isPremium, isOwner, _user)
            }
            break
            
            // ISLAMI COMMNAND
            case 'audioayat': {
                if (command && !isGroup) return global.mess("group", m)
                if (!text.includes('|')) return m.reply(`Example : ${prefix + command} 1|1`)
                if (user.isLimit(m.sender, isPremium, isOwner, config.options.limitCount, _user) && !m.fromMe) return global.mess("isLimit", m)
                let [a, b] = text.split`|`
                sock.sendFile(m.from, global.api("zenz", `/islami/quran/audio/${a}/${b}`, {}, "apikey"), "", m)
                user.limitAdd(m.sender, isPremium, isOwner, _user)
            }
            break
            case 'audiosurah': {
                if (command && !isGroup) return global.mess("group", m)
                if (user.isLimit(m.sender, isPremium, isOwner, config.options.limitCount, _user) && !m.fromMe) return global.mess("isLimit", m)
                sock.sendFile(m.from, global.api("zenz", `/islami/quran/audio/${text}`, {}, "apikey"), "", m)
                user.limitAdd(m.sender, isPremium, isOwner, _user)
            }
            break
            case 'jadwalsholat': {
                if (command && !isGroup) return global.mess("group", m)
                if (user.isLimit(m.sender, isPremium, isOwner, config.options.limitCount, _user) && !m.fromMe) return global.mess("isLimit", m)
                let fetch = await fetchUrl(global.api("zenz", "/islami/jadwalshalat", { kota: text }, "apikey"))
                let i = fetch.result
                let teks = `Jadwal Sholat Kota : ${text}\n\n`
                teks += `⭔ Tanggal : ${i.tanggal}\n`
                teks += `⭔ Subuh : ${i.shubuh}\n`
                teks += `⭔ Duha : ${i.duha}\n`
                teks += `⭔ Dzuhur : ${i.dzuhur}\n`
                teks += `⭔ Ashar : ${i.ashar}\n`
                teks += `⭔ Maghrib : ${i.maghrib}\n`
                teks += `⭔ Isya : ${i.isya}`
                sock.sendText(m.from, teks, m)
                user.limitAdd(m.sender, isPremium, isOwner, _user)
            }
            break
            case 'kisahmuslim': {
                if (command && !isGroup) return global.mess("group", m)
                if (user.isLimit(m.sender, isPremium, isOwner, config.options.limitCount, _user) && !m.fromMe) return global.mess("isLimit", m)
                let fetch = await fetchUrl(global.api("zenz", "/islami/kisahmuslim", {}, "apikey"))
                let teks = `⭔ Judul : ${fetch.result.Judul}\n⭔ Kisah :\n${fetch.result.Cerita}`
                sock.sendFile(m.from, fetch.result.Thumb, "", m, { caption: teks })
                user.limitAdd(m.sender, isPremium, isOwner, _user)
            }
            break
            case 'kisahnabi': {
                if (command && !isGroup) return global.mess("group", m)
                if (user.isLimit(m.sender, isPremium, isOwner, config.options.limitCount, _user) && !m.fromMe) return global.mess("isLimit", m)
                if (text) {
                    title = text.toLowerCase()
                    let fetch = await fetchUrl(global.api("zenz", `/islami/kisahnabi/${title}`, {}, "apikey"))
                    let teks = `⭔ Nama : ${fetch.result.name}\n⭔ Lahir : ${fetch.result.lahir}\n⭔ Umur : ${fetch.result.age}\n⭔ Lokasi : ${fetch.result.place}\n⭔ Kisah :\n${fetch.result.story}`
                    sock.sendFile(m.from, "https://i.pinimg.com/originals/a6/81/c5/a681c55ca1bee611c39d3b4a58712dc3.jpg", "", m, { caption: teks })
                } else if (!text) {
                    const sections = [{
                        title: "Kisah Nabi",
                        rows: [
                            {title: "Kisah Nabi Adam", rowId: ".kisahnabi adam"},
                            {title: "Kisah Nabi Idris", rowId: ".kisahnabi idris"},
                            {title: "Kisah Nabi Nuh", rowId: ".kisahnabi nuh"},
                            {title: "Kisah Nabi Hud", rowId: ".kisahnabi hud"},
                            {title: "Kisah Nabi Sholeh", rowId: ".kisahnabi sholeh"},
                            {title: "Kisah Nabi Ibrahim", rowId: ".kisahnabi ibrahim"},
                            {title: "Kisah Nabi Luth", rowId: ".kisahnabi luth"},
                            {title: "Kisah Nabi Ismail", rowId: ".kisahnabi ismail"},
                            {title: "Kisah Nabi Ishaq", rowId: ".kisahnabi ishaq"},
                            {title: "Kisah Nabi Yaqub", rowId: ".kisahnabi yaqub"},
                            {title: "Kisah Nabi Yusuf", rowId: ".kisahnabi yusuf"},
                            {title: "Kisah Nabi Ayyub", rowId: ".kisahnabi ayyub"},
                            {title: "Kisah Nabi Syuaib", rowId: ".kisahnabi syuaib"},
                            {title: "Kisah Nabi Musa", rowId: ".kisahnabi musa"},
                            {title: "Kisah Nabi Harun", rowId: ".kisahnabi harun"},
                            {title: "Kisah Nabi Dzulkifli", rowId: ".kisahnabi dzulkifli"},
                            {title: "Kisah Nabi Daud", rowId: ".kisahnabi daud"},
                            {title: "Kisah Nabi Sulaiman", rowId: ".kisahnabi sulaiman"},
                            {title: "Kisah Nabi Ilyas", rowId: ".kisahnabi ilyas"},
                            {title: "Kisah Nabi Ilyasa", rowId: ".kisahnabi ilyasa"},
                            {title: "Kisah Nabi Yunus", rowId: ".kisahnabi yunus"},
                            {title: "Kisah Nabi Zakariya", rowId: ".kisahnabi zakariya"},
                            {title: "Kisah Nabi Yahya", rowId: ".kisahnabi yahya"},
                            {title: "Kisah Nabi Isa", rowId: ".kisahnabi isa"},
                            {title: "Kisah Nabi Muhammad", rowId: ".kisahnabi muhammad"}
                        ]
                    }]
                    const listMessage = {
                        text: "List 25 Nabi",
                        footer: config.footer,
                        buttonText: "OPEN LIST",
                        sections
                    }
                    const sendMsg = await sock.sendMessage(m.from, listMessage, { quoted: m })
                }
                user.limitAdd(m.sender, isPremium, isOwner, _user)
            }
            break
            case 'listkota': {
                if (command && !isGroup) return global.mess("group", m)
                if (user.isLimit(m.sender, isPremium, isOwner, config.options.limitCount, _user) && !m.fromMe) return global.mess("isLimit", m)
                let fetch = await fetchUrl(global.api("zenz", "/islami/listkota", {}, "apikey"))
                let teks = `List Kota Di seluruh Indonesia\n\n`
                for (let i of fetch.result) {
                    teks += `⭔ Provinsi : ${i.provinsi}\n`
                    teks += `⭔ Kota : \n${i.kota.join("\n")}\n`
                    teks += `\n`
                }
                sock.sendText(m.from, teks, m)
                user.limitAdd(m.sender, isPremium, isOwner, _user)
            }
            break
            case 'listsurah': {
                if (command && !isGroup) return global.mess("group", m)
                if (user.isLimit(m.sender, isPremium, isOwner, config.options.limitCount, _user) && !m.fromMe) return global.mess("isLimit", m)
                let fetch = await fetchUrl(global.api("zenz", "/islami/listsurah", {}, "apikey"))
                let teks = `List Surah Al-quran\n\n`
                for (var x in fetch.result) {
                    teks += `${x}. ${fetch.result[x]}\n`
                }
                sock.sendText(m.from, teks, m)
                user.limitAdd(m.sender, isPremium, isOwner, _user)
            }
            break
            
            // MAIN COMMAND
            case 'help': case 'menu': {
                const limitt = isPremium || isOwner ? 'Unlimited' : user.getLimit(m.sender, _user)
                const limitg = user.getLimit(m.sender, _user)
                let templateButtons = [
                    { urlButton: { displayText: "Source Code", url: "https://github.com/zhwzein/weabot" } },
                    { urlButton: { displayText: "Main APIs", url: "http://zenzapis.xyz" } },
                    { quickReplyButton: { displayText: "Owner", id: ".owner" } }
                ]
                let templateMessage = {
                    image: { url: 'https://camo.githubusercontent.com/23f3195d91e7095ae37ef6a22475b9f1206f8334bc3e5ca61637f7d7e8cf962a/68747470733a2f2f692e70696e696d672e636f6d2f373336782f66662f38372f62372f66663837623730653963396465613464396361333263393533386138316333622e6a7067' },
                    caption: zenz.menu(senderName, limitt, limitg, role),
                    footer: config.footer,
                    templateButtons: templateButtons
                }
                sock.sendMessage(m.from, templateMessage, { quoted: m })
            }
            break
            case 'ping': case 'p': {
                const timestamp = speed();
                const latensi = speed() - timestamp
                exec(`neofetch --stdout`, (error, stdout, stderr) => {
                    const pingnya = `*_Speed: ${latensi.toFixed(4)}s_*`
                    m.reply(pingnya)
                })
            }
            break
            
            case 'premlist': case 'premiumlist': {
                if (command && !isGroup) return global.mess("group", m)
                let data = _premium
                let caption = `List Prem\nAmount : ${data.length}\n\n`
                for (let i of data) {
                    let checkExp = require("parse-ms")(i.expired - Date.now());
                    caption += `*ID :* wa.me/${i.id.split("@")[0]}\n*Expired :* ${checkExp.days} day ${checkExp.hours} hour ${ checkExp.minutes } minute ${checkExp.seconds} second\n\n`;
                }
                sock.sendText(m.from, caption, m)
            }
            break

            // MORENSFW COMMNAND
            case 'mnsfwimage': {
                if (command && !isGroup) return global.mess("group", m)
                if (!isNsfw) return global.mess("isNsfw", m)
                if (!text) return m.reply(`List Type :\n\n${mnsfw_type().sort((a, b) => a - b).join("\n")}\n\nExample : ${prefix + command} <type>`)
                if (user.isLimit(m.sender, isPremium, isOwner, config.options.limitCount, _user) && !m.fromMe) return global.mess("isLimit", m)
                let fetch = await global.api("zenz", "/api/morensfw/" + text, {}, "apikey")
                let buttons = [
                    { buttonId: `${prefix}mnsfwimage ${text}`, buttonText: { displayText: 'NEXT'}, type: 1 }
                ]
                let buttonMessage = {
                    image: { url: fetch },
                    caption: `Random NSFW Image ${text}`,
                    footer: config.footer,
                    buttons: buttons,
                    headerType: 4
                }
                sock.sendMessage(m.from, buttonMessage, { quoted: m })
                user.limitAdd(m.sender, isPremium, isOwner, _user)
                function mnsfw_type() {
                    return ["ahegao","ass","bdsm","blowjob","cuckold","cum","ero","femdom","foot","gangbang","glasses","hentai","hentaigif","jahy","maid",
                    "manga","masturbation","mobilewall","netorare","nsfwneko","sfwneko","orgy","panties","pussy","tentacles","thighs","yuri","zettairyouiki"]
                }
            }
            break
            case 'mnsfwmenu': {
                if (command && !isGroup) return global.mess("group", m)
                const sections = [{
                    title: "Morensfw",
                    rows: [
                        {title: "Random Ahegao", rowId: ".mnsfwimage ahegao"},
                        {title: "Random Ass", rowId: ".mnsfwimage ass"},
                        {title: "Random BDSM", rowId: ".mnsfwimage bdsm"},
                        {title: "Random Blowjob", rowId: ".mnsfwimage blowjob"},
                        {title: "Random Cuckold", rowId: ".mnsfwimage cuckold"},
                        {title: "Random Cum", rowId: ".mnsfwimage cum"},
                        {title: "Random Ero", rowId: ".mnsfwimage ero"},
                        {title: "Random Femdom", rowId: ".mnsfwimage femdom"},
                        {title: "Random Foot", rowId: ".mnsfwimage foot"},
                        {title: "Random Gangbang", rowId: ".mnsfwimage gangbang"},
                        {title: "Random Glasses", rowId: ".mnsfwimage glasses"},
                        {title: "Random Hentai", rowId: ".mnsfwimage hentai"},
                        {title: "Random Hentaigif", rowId: ".mnsfwimage hentaigif"},
                        {title: "Random Jahy", rowId: ".mnsfwimage jahy"},
                        {title: "Random Maid", rowId: ".mnsfwimage maid"},
                        {title: "Random Manga", rowId: ".mnsfwimage manga"},
                        {title: "Random Masturbation", rowId: ".mnsfwimage masturbation"},
                        {title: "Random Mobilewall", rowId: ".mnsfwimage mobilewall"},
                        {title: "Random Netorare", rowId: ".mnsfwimage netorare"},
                        {title: "Random Nsfwneko", rowId: ".mnsfwimage nsfwneko"},
                        {title: "Random Sfwneko", rowId: ".mnsfwimage sfwneko"},
                        {title: "Random Orgy", rowId: ".mnsfwimage orgy"},
                        {title: "Random Panties", rowId: ".mnsfwimage panties"},
                        {title: "Random Pussy", rowId: ".mnsfwimage pussy"},
                        {title: "Random Tentacles", rowId: ".mnsfwimage tentacles"},
                        {title: "Random Thighs", rowId: ".mnsfwimage thighs"},
                        {title: "Random Yuri", rowId: ".mnsfwimage yuri"},
                        {title: "Random Zettairyouiki", rowId: ".mnsfwimage zettairyouiki"},
                    ]
                }]
                const listMessage = {
                    text: "More NSFW",
                    footer: config.footer,
                    buttonText: "OPEN LIST",
                    sections
                }
                const sendMsg = await sock.sendMessage(m.from, listMessage, { quoted: m })
            }
            break

            // NEKOSLIFE COMMNAND
            case 'sfwgif': {
                if (command && !isGroup) return global.mess("group", m)
                if (!text) return m.reply(`List Type :\n\n${sfwgif_type().sort((a, b) => a - b).join("\n")}\n\nExample : ${prefix + command} <type>`)
                if (user.isLimit(m.sender, isPremium, isOwner, config.options.limitCount, _user) && !m.fromMe) return global.mess("isLimit", m)
                let fetch = await global.api("zenz", "/api/anime/sfw/" + text, {}, "apikey")
                sock.sendFile(m.from, fetch, "", m, { asSticker: true, author: config.exif.author, packname: config.exif.packname, categories: ['😄','😊'] })
                user.limitAdd(m.sender, isPremium, isOwner, _user)
                function sfwgif_type() {
                    return ["cuddle","slap","baka","tickle","pat","kiss","hug","feed","smug","poke"]
                }
            }
            break
            case 'sfwimage': {
                if (command && !isGroup) return global.mess("group", m)
                if (!text) return m.reply(`List Type :\n\n${sfwimage_type().sort((a, b) => a - b).join("\n")}\n\nExample : ${prefix + command} <type>`)
                if (user.isLimit(m.sender, isPremium, isOwner, config.options.limitCount, _user) && !m.fromMe) return global.mess("isLimit", m)
                let fetch = await global.api("zenz", "/api/anime/sfw/" + text, {}, "apikey")
                let buttons = [
                    { buttonId: `${prefix}sfwimage ${text}`, buttonText: { displayText: 'NEXT'}, type: 1 }
                ]
                let buttonMessage = {
                    image: { url: fetch },
                    caption: `Random SFW Image ${text}`,
                    footer: config.footer,
                    buttons: buttons,
                    headerType: 4
                }
                sock.sendMessage(m.from, buttonMessage, { quoted: m })
                user.limitAdd(m.sender, isPremium, isOwner, _user)
                function sfwimage_type() {
                    return ["waifu","gecg","avatar","kemonomimi","holo","meow","neko","fox_girl","wallpaper"]
                }
            }
            break
            case 'sfwmenu': {
                if (command && !isGroup) return global.mess("group", m)
                const sections = [{
                    title: "Sfw",
                    rows: [
                        {title: "Random Waifu", rowId: ".sfwimage waifu"},
                        {title: "Random Gecg", rowId: ".sfwimage gecg"},
                        {title: "Random Avatar", rowId: ".sfwimage avatar"},
                        {title: "Random Kemonomimi", rowId: ".sfwimage kemonomimi"},
                        {title: "Random Holo", rowId: ".sfwimage holo"},
                        {title: "Random Meow", rowId: ".sfwimage meow"},
                        {title: "Random Neko", rowId: ".sfwimage neko"},
                        {title: "Random FoxGirl", rowId: ".sfwimage fox_girl"},
                        {title: "Random Wallpaper", rowId: ".sfwimage wallpaper"},
                    ]
                },
                {
                    title: "Sfw 2",
                    rows: [
                        {title: "Cuddle [GIF]", rowId: ".sfwgif cuddle"},
                        {title: "Slap [GIF]", rowId: ".sfwgif slap"},
                        {title: "Baka [GIF]", rowId: ".sfwgif baka"},
                        {title: "Tickle [GIF]", rowId: ".sfwgif tickle"},
                        {title: "Pat [GIF]", rowId: ".sfwgif pat"},
                        {title: "Kiss [GIF]", rowId: ".sfwgif kiss"},
                        {title: "Hug [GIF]", rowId: ".sfwgif hug"},
                        {title: "Feed [GIF]", rowId: ".sfwgif feed"},
                        {title: "Smug [GIF]", rowId: ".sfwgif smug"},
                        {title: "Poke [GIF]", rowId: ".sfwgif poke"}
                    ]
                }]
                const listMessage = {
                    text: "NekosLife [SFW]",
                    footer: config.footer,
                    buttonText: "OPEN LIST",
                    sections
                }
                const sendMsg = await sock.sendMessage(m.from, listMessage, { quoted: m })
            }
            break
            // NEWS COMMNAND
            case 'antaranews': {
                if (command && !isGroup) return global.mess("group", m)
                if (user.isLimit(m.sender, isPremium, isOwner, config.options.limitCount, _user) && !m.fromMe) return global.mess("isLimit", m)
                let fetch = await fetchUrl(global.api("zenz", "/news/antaranews", {}, "apikey"))
                let caption = `Latest News From Antaranews\n\n`
                for (let i of fetch.result) {
                    caption += `⭔ Judul Berita : ${i.berita}\n`
                    caption += `⭔ Di Upload : ${i.berita_diupload}\n`
                    caption += `⭔ Jenis : ${i.berita_jenis}\n`
                    caption += `⭔ Url : ${i.berita_url}\n\n`
                }
                sock.sendFile(m.from, fetch.result[0].berita_thumb, "", m, { caption })
                user.limitAdd(m.sender, isPremium, isOwner, _user)
            }
            break
            case 'bbcnews': {
                if (command && !isGroup) return global.mess("group", m)
                if (user.isLimit(m.sender, isPremium, isOwner, config.options.limitCount, _user) && !m.fromMe) return global.mess("isLimit", m)
                let fetch = await fetchUrl(global.api("zenz", "/news/bbc", {}, "apikey"))
                let caption = `Latest News From BBC\n\n`
                for (let i of fetch.result) {
                    caption += `⭔ Judul Berita : ${i.berita}\n`
                    caption += `⭔ Di Upload : ${i.berita_diupload}\n`
                    caption += `⭔ Url : ${i.berita_url}\n\n`
                }
                sock.sendText(m.from, caption, m)
                user.limitAdd(m.sender, isPremium, isOwner, _user)
            }
            break
            case 'cnbcnews': {
                if (command && !isGroup) return global.mess("group", m)
                if (user.isLimit(m.sender, isPremium, isOwner, config.options.limitCount, _user) && !m.fromMe) return global.mess("isLimit", m)
                let fetch = await fetchUrl(global.api("zenz", "/news/cnbc", {}, "apikey"))
                let caption = `Latest News From CNBC\n\n`
                for (let i of fetch.result) {
                    caption += `⭔ Judul Berita : ${i.berita}\n`
                    caption += `⭔ Di Upload : ${i.berita_diupload}\n`
                    caption += `⭔ Url : ${i.berita_url}\n\n`
                }
                sock.sendFile(m.from, fetch.result[0].berita_thumb, "", m, { caption })
                user.limitAdd(m.sender, isPremium, isOwner, _user)
            }
            break
            case 'dailynews': {
                if (command && !isGroup) return global.mess("group", m)
                if (user.isLimit(m.sender, isPremium, isOwner, config.options.limitCount, _user) && !m.fromMe) return global.mess("isLimit", m)
                let fetch = await fetchUrl(global.api("zenz", "/news/dailynews", {}, "apikey"))
                let caption = `Latest News From Dailynews\n\n`
                for (let i of fetch.result) {
                    caption += `⭔ Judul Berita : ${i.berita}\n`
                    caption += `⭔ Url : ${i.berita_url}\n\n`
                }
                sock.sendFile(m.from, fetch.result[0].berita_thumb, "", m, { caption })
                user.limitAdd(m.sender, isPremium, isOwner, _user)
            }
            break
            case 'detiknews': {
                if (command && !isGroup) return global.mess("group", m)
                if (user.isLimit(m.sender, isPremium, isOwner, config.options.limitCount, _user) && !m.fromMe) return global.mess("isLimit", m)
                let fetch = await fetchUrl(global.api("zenz", "/news/detiknews", {}, "apikey"))
                let caption = `Latest News From Detiknews\n\n`
                for (let i of fetch.result) {
                    caption += `⭔ Judul Berita : ${i.berita}\n`
                    caption += `⭔ Di Upload : ${i.berita_diupload}\n`
                    caption += `⭔ Url : ${i.berita_url}\n\n`
                }
                sock.sendFile(m.from, fetch.result[0].berita_thumb, "", m, { caption })
                user.limitAdd(m.sender, isPremium, isOwner, _user)
            }
            break
            case 'inews': {
                if (command && !isGroup) return global.mess("group", m)
                if (user.isLimit(m.sender, isPremium, isOwner, config.options.limitCount, _user) && !m.fromMe) return global.mess("isLimit", m)
                let fetch = await fetchUrl(global.api("zenz", "/news/inews", {}, "apikey"))
                let caption = `Latest News From inews\n\n`
                for (let i of fetch.result) {
                    caption += `⭔ Judul Berita : ${i.berita}\n`
                    caption += `⭔ Di Upload : ${i.berita_diupload}\n`
                    caption += `⭔ Jenis Berita : ${i.berita_jenis}\n`
                    caption += `⭔ Url : ${i.berita_url}\n\n`
                }
                sock.sendText(m.from, caption, m)
                user.limitAdd(m.sender, isPremium, isOwner, _user)
            }
            break
            case 'kompasnews': {
                if (command && !isGroup) return global.mess("group", m)
                if (user.isLimit(m.sender, isPremium, isOwner, config.options.limitCount, _user) && !m.fromMe) return global.mess("isLimit", m)
                let fetch = await fetchUrl(global.api("zenz", "/news/kompas", {}, "apikey"))
                let caption = `Latest News From Kompasnews\n\n`
                for (let i of fetch.result) {
                    caption += `⭔ Judul Berita : ${i.berita}\n`
                    caption += `⭔ Di Upload : ${i.berita_diupload}\n`
                    caption += `⭔ Jenis : ${i.berita_jenis}\n`
                    caption += `⭔ Url : ${i.berita_url}\n\n`
                }
                sock.sendFile(m.from, fetch.result[0].berita_thumb, "", m, { caption })
                user.limitAdd(m.sender, isPremium, isOwner, _user)
            }
            break
            case 'kontanews': {
                if (command && !isGroup) return global.mess("group", m)
                if (user.isLimit(m.sender, isPremium, isOwner, config.options.limitCount, _user) && !m.fromMe) return global.mess("isLimit", m)
                let fetch = await fetchUrl(global.api("zenz", "/news/kontanews", {}, "apikey"))
                let caption = `Latest News From Kontanews\n\n`
                for (let i of fetch.result) {
                    caption += `⭔ Judul Berita : ${i.berita}\n`
                    caption += `⭔ Di Upload : ${i.berita_diupload}\n`
                    caption += `⭔ Jenis : ${i.berita_jenis}\n`
                    caption += `⭔ Url : ${i.berita_url}\n\n`
                }
                sock.sendFile(m.from, fetch.result[0].berita_thumb, "", m, { caption })
                user.limitAdd(m.sender, isPremium, isOwner, _user)
            }
            break
            case 'koransindo': {
                if (command && !isGroup) return global.mess("group", m)
                if (user.isLimit(m.sender, isPremium, isOwner, config.options.limitCount, _user) && !m.fromMe) return global.mess("isLimit", m)
                let fetch = await fetchUrl(global.api("zenz", "/news/koransindo", {}, "apikey"))
                let caption = `Latest News From Koransindo\n\n`
                for (let i of fetch.result) {
                    caption += `⭔ Judul Berita : ${i.berita}\n`
                    caption += `⭔ Jenis Berita : ${i.berita_jenis}\n`
                    caption += `⭔ Url : ${i.berita_url}\n\n`
                }
                sock.sendText(m.from, caption, m)
                user.limitAdd(m.sender, isPremium, isOwner, _user)
            }
            break
            case 'okezone': {
                if (command && !isGroup) return global.mess("group", m)
                if (user.isLimit(m.sender, isPremium, isOwner, config.options.limitCount, _user) && !m.fromMe) return global.mess("isLimit", m)
                let fetch = await fetchUrl(global.api("zenz", "/news/okezone", {}, "apikey"))
                let caption = `Latest News From Okezone\n\n`
                for (let i of fetch.result) {
                    caption += `⭔ Judul Berita : ${i.berita}\n`
                    caption += `⭔ Di Upload : ${i.berita_diupload}\n`
                    caption += `⭔ Url : ${i.berita_url}\n\n`
                }
                sock.sendFile(m.from, fetch.result[0].berita_thumb, "", m, { caption })
                user.limitAdd(m.sender, isPremium, isOwner, _user)
            }
            break
            case 'temponews': {
                if (command && !isGroup) return global.mess("group", m)
                if (user.isLimit(m.sender, isPremium, isOwner, config.options.limitCount, _user) && !m.fromMe) return global.mess("isLimit", m)
                let fetch = await fetchUrl(global.api("zenz", "/news/temponews", {}, "apikey"))
                let caption = `Latest News From Temponews\n\n`
                for (let i of fetch.result) {
                    caption += `⭔ Judul Berita : ${i.berita}\n`
                    caption += `⭔ Di Upload : ${i.berita_diupload}\n`
                    caption += `⭔ Url : ${i.berita_url}\n\n`
                }
                sock.sendFile(m.from, fetch.result[0].berita_thumb, "", m, { caption })
                user.limitAdd(m.sender, isPremium, isOwner, _user)
            }
            break
            case 'tribunews': {
                if (command && !isGroup) return global.mess("group", m)
                if (user.isLimit(m.sender, isPremium, isOwner, config.options.limitCount, _user) && !m.fromMe) return global.mess("isLimit", m)
                let fetch = await fetchUrl(global.api("zenz", "/news/tribunews", {}, "apikey"))
                let caption = `Latest News From Tribunews\n\n`
                for (let i of fetch.result) {
                    caption += `⭔ Judul Berita : ${i.title}\n`
                    caption += `⭔ Di Upload : ${i.title}\n`
                    caption += `⭔ Desc : ${i.desc}\n`
                    caption += `⭔ Url : ${i.url}\n\n`
                }
                sock.sendText(m.from, caption, m)
                user.limitAdd(m.sender, isPremium, isOwner, _user)
            }
            break

            // OWNER COMMNAND
            case 'ownerbot': case 'owner': {
                const vcard = 'BEGIN:VCARD\n'
                + 'VERSION:3.0\n' 
                + 'FN:zahwazein\n'
                + 'ORG:zenzapis.xyz\n'
                + `TEL;type=CELL;type=VOICE;waid=${config.owner[0]}:${config.owner[0]}\n`
                + 'END:VCARD'
                sock.sendMessage(m.from, {
                    contacts: { 
                        displayName: 'Jeff', 
                        contacts: [{ vcard }] 
                    }
                })
            }
            break
            case 'join': {
                if (!isOwner) return global.mess("owner", m)
                if (!text) return m.reply(`Example: ${prefix + command} url`)
                if (!isUrl(args[0]) && !args[0].includes('whatsapp.com')) return m.reply("Invalid Link")
                let result = args[0].split('https://chat.whatsapp.com/')[1]
                await sock.groupAcceptInvite(result).then((res) => m.reply("Done")).catch((err) => m.reply("Error"))
            }
            break
            case 'autoread': {
                if (!isOwner) return global.mess("owner", m)
                if (text === 'enable') {
                    if (config.options.autoRead == true) return m.reply('AutoRead already active')
                    config.options.autoRead = true
                    fs.writeFileSync('./config.json', JSON.stringify(config, null, 2))
                    m.reply(`AutoRead Success activated`)
                } else if (text === 'disable') {
                    if (config.options.autoRead === false) return m.reply('AutoRead already deactive')
                    config.options.autoRead = false
                    fs.writeFileSync('./config.json', JSON.stringify(config, null, 2))
                    m.reply(`AutoRead Success deactivated`)
                } else {
                    m.reply(`*⭔ AutoRead Status:* ${config.options.autoRead ? 'Activated' : 'Deactivated'}\n\n_Pilih enable atau disable!_`)
                }
            }
            break
            case 'prem': {
                if (!isOwner) return global.mess("owner", m)
                    if (ar[0] === 'add') {
                        premium.addPremiumUser(args[1] + "@s.whatsapp.net", args[2], _premium)
                        m.reply(`*「 PREMIUM ADDED 」*\n\n*ID :* ${args[1]}\n*Expired :* ${ms(toMs(args[2])).days} day(s) ${ms(toMs(args[2])).hours} hour(s) ${ms(toMs(args[2])).minutes} minute(s)`)
                } else if (ar[0] === 'del') {
                    _premium.splice(premium.getPremiumPosition(args[1] + '@s.whatsapp.net', _premium), 1)
                    fs.writeFileSync('./database/premium.json', JSON.stringify(_premium))
                    m.reply(msg.doneOwner())
                } else {
                    m.reply('Pilih add / del')
                }
            }
            break
            case 'getcase': {
                if (command && !isGroup) return global.mess("group", m)
                if (!isOwner) return global.mess("owner", m)
                if (!text) return m.reply(`Example: ${prefix + command} query`)
                try {
                    m.reply("case" + text + fs.readFileSync('./sock.js').toString().split('case \''+ text +'\'')[1].split("break")[0] + "break")
                } catch {
                    m.reply("Case tidak ditemukan")
                }
            }
            break
            case 'self': {
                if (!isOwner) return global.mess("owner", m)
                if (text === 'enable') {
                    if (config.options.self == true) return m.reply('Self already active')
                    config.options.self = true
                    fs.writeFileSync('./config.json', JSON.stringify(config, null, 2))
                    m.reply(`BOT Now In Self Mode`)
                } else if (text === 'disable') {
                    if (config.options.self === false) return m.reply('Self already deactive')
                    config.options.self = false
                    fs.writeFileSync('./config.json', JSON.stringify(config, null, 2))
                    m.reply(`BOT Now In Public Mode`)
                } else {
                    m.reply(`*⭔ Self Mode Status:* ${config.options.self ? 'Activated' : 'Deactivated'}\n\n_Pilih enable atau disable!_`)
                }
            }
            break
            case 'setexif': case 'exif': {
                if (!isOwner) return global.mess("owner", m)
                if (!text) return m.reply(`Example : ${prefix + command} packname|author`)
                config.exif.packname = text.split("|")[0]
                config.exif.author = text.split("|")[1]
                m.reply(`Exif berhasil diubah menjadi\n\n⭔ Packname : ${config.exif.packname}\n⭔ Author : ${config.exif.author}`)
            }
            break
            case 'hidetag': {
                if (command && !isGroup) return global.mess("group", m)
                if (!isOwner && !isGroup) return m.reply('?')
                if (m.quoted) {
                    sock.sendMessage(m.from, { forward: m.quoted.fakeObj, mentions: groupMembers.map(a => a.id) })
                } else {
                    sock.sendMessage(m.from, { text : q ? q : '' , mentions: groupMembers.map(a => a.id)}, { quoted: m })
                }
            }
            break

            // PHOTOEDITOR COMMNAND
            case 'blur': case 'brighten': case 'circle': case 'comrade': case 'contrast': case 'gay': case 'glass': case 'greyscale': case 'horny':
            case 'invert': case 'jail': case 'passed': case 'pixelate': case '2x': case 'triggered': case 'sepia': case 'upscale': case 'wasted': {
                if (command && !isGroup) return global.mess("group", m)
                if (!quoted) return  m.reply(`Reply to Supported media With Caption ${prefix + command}`)
                if (user.isLimit(m.sender, isPremium, isOwner, config.options.limitCount, _user) && !m.fromMe) return global.mess("isLimit", m)
                const mime = (quoted.msg || m.msg).mimetype
                if (/image/.test(mime)) {
                    let download = await sock.downloadAndSaveMediaMessage(quoted)
                    file_name = getRandom('jpeg')
                    request({
                        url: global.api("zenz", "/photoeditor/" + command, {}, "apikey"),
                        method: 'POST',
                        formData: {
                            "sampleFile": fs.createReadStream(download)
                        },
                        encoding: "binary"
                    }, async function(error, response, body) {
                        fs.unlinkSync(download)
                        fs.writeFileSync(file_name, body, "binary")
                        ini_buff = fs.readFileSync(file_name)
                        await sock.sendFile(m.from, ini_buff, "", m).then(() => {
                            user.limitAdd(m.sender, isPremium, isOwner, _user)
                            fs.unlinkSync(file_name)
                        })
                    })
                } else {
                    return m.reply(`Reply to Supported media With Caption ${prefix + command}`, m.from, { quoted: m })
                }
            }
            break
            
            // PRIMBON COMMNAND
            case 'artimimpi': {
                if (command && !isGroup) return global.mess("group", m)
                if (!text) return m.reply(`Example: ${prefix + command} query`)
                if (user.isLimit(m.sender, isPremium, isOwner, config.options.limitCount, _user) && !m.fromMe) return global.mess("isLimit", m)
                let fetch = await fetchUrl(global.api("zenz", "/primbon/" + command, { query: text }, "apikey"))
                let caption = `Primbon ${command} :\n\n`
                let i = fetch.result
                caption += `⭔ Mimpi : ${i.mimpi}\n`
                caption += `⭔ Arti : ${i.arti}\n`
                sock.sendText(m.from, caption, m)
                user.limitAdd(m.sender, isPremium, isOwner, _user)
            }
            break
            case 'artinama': {
                if (command && !isGroup) return global.mess("group", m)
                if (!text) return m.reply(`Example: ${prefix + command} query`)
                if (user.isLimit(m.sender, isPremium, isOwner, config.options.limitCount, _user) && !m.fromMe) return global.mess("isLimit", m)
                let fetch = await fetchUrl(global.api("zenz", "/primbon/" + command, { text: text }, "apikey"))
                let caption = `Primbon ${command} :\n\n`
                let i = fetch.result
                caption += `⭔ Nama : ${i.nama}\n`
                caption += `⭔ Arti : ${i.arti}\n`
                sock.sendText(m.from, caption, m)
                user.limitAdd(m.sender, isPremium, isOwner, _user)
            }
            break
            case 'shio': case 'cekshio': {
                if (command && !isGroup) return global.mess("group", m)
                if (!text) return m.reply(`List Type :\n\n${shio_type().sort((a, b) => a - b).join("\n")}\n\nExample : ${prefix + command} <type>`)
                if (user.isLimit(m.sender, isPremium, isOwner, config.options.limitCount, _user) && !m.fromMe) return global.mess("isLimit", m)
                let fetch = await fetchUrl(global.api("zenz", "/primbon/shio", { query: text }, "apikey"))
                let caption = `Primbon Arti Shio :\n\n`
                let i = fetch.result
                caption += `⭔ Catatan : ${i.result}\n`
                sock.sendText(m.from, caption, m)
                user.limitAdd(m.sender, isPremium, isOwner, _user)
                function shio_type() {
                    return [ "Tikus", "Kerbau", "Macan", "Kelinci", "Naga", "Ular", "Kuda", "Kambing", "Monyet", "Ayam", "Anjing", "Babi" ]
                }
            }
            break
            case 'zodiak': case 'cekzodiak': {
                if (command && !isGroup) return global.mess("group", m)
                if (!text) return m.reply(`List Type :\n\n${zodiak_type().sort((a, b) => a - b).join("\n")}\n\nExample : ${prefix + command} <type>`)
                if (user.isLimit(m.sender, isPremium, isOwner, config.options.limitCount, _user) && !m.fromMe) return global.mess("isLimit", m)
                let fetch = await fetchUrl(global.api("zenz", "/primbon/zodiak", { query: text }, "apikey"))
                let caption = `Primbon Arti Zodiak :\n\n`
                let i = fetch.result.result
                caption += `⭔ Nama zodiak : ${i.zodiak}\n`
                caption += `⭔ Nomor keberuntungan : ${i.nomor_keberuntungan}\n`
                caption += `⭔ Aroma keberuntungan : ${i.aroma_keberuntungan}\n`
                caption += `⭔ Planet yang mengitari : ${i.planet_yang_mengitari}\n`
                caption += `⭔ Bunga keberuntungan : ${i.bunga_keberuntungan}\n`
                caption += `⭔ Warna keberuntungan : ${i.warna_keberuntungan}\n`
                caption += `⭔ Batu keberuntungan : ${i.batu_keberuntungan}\n`
                caption += `⭔ Elemen keberuntungan : ${i.elemen_keberuntungan}\n`
                caption += `⭔ Pasangan zodiak : ${i.pasangan_zodiak}\n\n`
                caption += `⭔ Catatan : ${i.catatan}\n`
                sock.sendText(m.from, caption, m)
                user.limitAdd(m.sender, isPremium, isOwner, _user)
                function zodiak_type() {
                    return [
                        "CAPRICORN (22 Desember - 20 Januari)",
                        "AQUARIUS (21 Januari - 19 Februari)",
                        "PISCES (20 Februari - 20 Maret)",
                        "ARIES (21 Maret – 19 April)",
                        "TAURUS (21 April - Mei 20)",
                        "GEMINI (21 Mei - Juni 21)",
                        "CANCER (22 Juni - Juli 22)",
                        "LEO (23 Juli - 23 Agustus)",
                        "VIRGO (24 Agustus - 22 September)",
                        "LIBRA (23 September - 23 Oktober)",
                        "SCORPIO (24 Oktober - 22 November)",
                        "SAGITARIUS (23 November - 21 Desember)"
                    ]
                }
            }
            break
            case 'haribaik': case 'harilarangan': case 'jadian': case 'rejekiweton': {
                if (command && !isGroup) return global.mess("group", m)
                let [a, b, c] = args
                if (!a, !b, !c) return m.reply(`Example : ${prefix + command} 11 06 2007`)
                if (user.isLimit(m.sender, isPremium, isOwner, config.options.limitCount, _user) && !m.fromMe) return global.mess("isLimit", m)
                let fetch = await fetchUrl(global.api("zenz", `/primbon/${command}/${a}/${b}/${c}`, {}, "apikey"))
                let caption = `Primbon${command} :\n\n`
                let i = fetch.result
                caption += `⭔ Catatan : ${i.message}\n`
                sock.sendText(m.from, caption, m)
                user.limitAdd(m.sender, isPremium, isOwner, _user)
            }
            break
            case 'nomerhoki': {
                if (command && !isGroup) return global.mess("group", m)
                if (!text) return m.reply(`Example: ${prefix + command} query`)
                if (user.isLimit(m.sender, isPremium, isOwner, config.options.limitCount, _user) && !m.fromMe) return global.mess("isLimit", m)
                let fetch = await fetchUrl(global.api("zenz", "/primbon/nomerhoki", { query: text }, "apikey"))
                let caption = `Primbon Nomer Hoki :\n\n`
                let i = fetch.result
                caption += `⭔ Nomer HP : ${i.nomer_hp}\n`
                caption += `⭔ Angka Shuzi : ${i.angka_shuzi}\n`
                caption += `⭔ Energi Positif : \n`
                caption += `   - Kekayaan : ${i.energi_positif.kekayaan}\n`
                caption += `   - Kesehatan : ${i.energi_positif.kesehatan}\n`
                caption += `   - Cinta : ${i.energi_positif.cinta}\n`
                caption += `   - Kestabilan : ${i.energi_positif.kestabilan}\n`
                caption += `   - Persentase : ${i.energi_positif.persentase}\n\n`
                caption += `⭔ Energi Negatif : \n`
                caption += `   - Perselisihan : ${i.energi_negatif.perselisihan}\n`
                caption += `   - Kehilangan : ${i.energi_negatif.kehilangan}\n`
                caption += `   - Malapetaka : ${i.energi_negatif.malapetaka}\n`
                caption += `   - Kehancuran : ${i.energi_negatif.kehancuran}\n`
                caption += `   - Persentase : ${i.energi_negatif.persentase}\n\n`
                caption += `⭔ Catatan : ${i.catatan}\n`
                sock.sendText(m.from, caption, m)
                user.limitAdd(m.sender, isPremium, isOwner, _user)
            }
            break

            // RANDOMANIME COMMNAND
            case 'animecouple': {
                if (command && !isGroup) return global.mess("group", m)
                if (user.isLimit(m.sender, isPremium, isOwner, config.options.limitCount, _user) && !m.fromMe) return global.mess("isLimit", m)
                let fetch = await fetchUrl(global.api("zenz", "/randomanime/couples", {}, "apikey"))
                sock.sendFile(m.from, fetch.result.male, "", m, { caption: "Random Anime Couples Male" })
                sock.sendFile(m.from, fetch.result.female, "", m, { caption: "Random Anime Couples Female" })
                user.limitAdd(m.sender, isPremium, isOwner, _user)
            }
            break
            case 'animeme': case 'animememe': {
                if (command && !isGroup) return global.mess("group", m)
                if (user.isLimit(m.sender, isPremium, isOwner, config.options.limitCount, _user) && !m.fromMe) return global.mess("isLimit", m)
                let fetch = await fetchUrl(global.api("zenz", "/randomanime/animeme", {}, "apikey"))
                let buttons = [
                    {buttonId: `${prefix}animeme`, buttonText: { displayText: 'NEXT'}, type: 1 }
                ]
                let buttonMessage = {
                    image: { url: fetch.result.image },
                    caption: fetch.result.caption,
                    footer: config.footer,
                    buttons: buttons,
                    headerType: 4
                }
                sock.sendMessage(m.from, buttonMessage, { quoted: m })
                user.limitAdd(m.sender, isPremium, isOwner, _user)
            }
            break
            case 'hololive': {
                if (command && !isGroup) return global.mess("group", m)
                if (user.isLimit(m.sender, isPremium, isOwner, config.options.limitCount, _user) && !m.fromMe) return global.mess("isLimit", m)
                let fetch = await fetchUrl(global.api("zenz", "/randomanime/hololive", {}, "apikey"))
                let buttons = [
                    {buttonId: `${prefix}hololive`, buttonText: { displayText: 'NEXT'}, type: 1 }
                ]
                let buttonMessage = {
                    image: { url: fetch.result.image },
                    caption: fetch.result.caption,
                    footer: config.footer,
                    buttons: buttons,
                    headerType: 4
                }
                sock.sendMessage(m.from, buttonMessage, { quoted: m })
                user.limitAdd(m.sender, isPremium, isOwner, _user)
            }
            break
            case 'animemenu': {
                if (command && !isGroup) return global.mess("group", m)
                const sections = [{
                    title: "Random Image",
                    rows: [
                        {title: "Random Anime Couple", rowId: ".animecouple"},
                        {title: "Random Holo Live", rowId: "hololive"},
                        {title: "Random Anime", rowId: ".randomanime anime"},
                        {title: "Random Waifu", rowId: ".randomanime waifu"},
                        {title: "Random Husbu", rowId: ".randomanime husbu"},
                        {title: "Random Neko", rowId: ".randomanime neko"},
                        {title: "Random Shinobu", rowId: ".randomanime shinobu"},
                        {title: "Random Megumin", rowId: ".randomanime megumin"},
                        {title: "Random Uniform", rowId: ".randomanime uniform"},
                        {title: "Random Maid", rowId: ".randomanime maid"},
                        {title: "Random MarinKitagawa", rowId: ".randomanime marin-kitagawa"},
                        {title: "Random MoriCalliope", rowId: ".randomanime mori-calliope"},
                        {title: "Random RaidenShogun", rowId: ".randomanime raiden-shogun"},
                        {title: "Random Oppai", rowId: ".randomanime oppai"},
                        {title: "Random Selfies", rowId: ".randomanime selfies"},
                    ]
                },
                {
                    title: "Random Image 2",
                    rows: [
                        {title: "Random Waifu [NSFW]", rowId: ".randomanime waifus"},
                        {title: "Random Neko [NSFW]", rowId: ".randomanime nekos"},
                        {title: "Random Trap [NSFW]", rowId: ".randomanime trap"},
                        {title: "Random Blowjob [NSFW]", rowId: ".randomanime blowjob"},
                        {title: "Random Ass [NSFW]", rowId: ".randomanime ass"},
                        {title: "Random Hentai [NSFW]", rowId: ".randomanime hentai"},
                        {title: "Random Milf [NSFW]", rowId: ".randomanime milf"},
                        {title: "Random Oral [NSFW]", rowId: ".randomanime oral"},
                        {title: "Random Paizuri [NSFW]", rowId: ".randomanime paizuri"},
                        {title: "Random Ecchi [NSFW]", rowId: ".randomanime ecchi"},
                        {title: "Random Ero [NSFW]", rowId: ".randomanime ero"},
                    ]
                }]
                const listMessage = {
                    text: "Random Image",
                    footer: config.footer,
                    buttonText: "OPEN LIST",
                    sections
                }
                const sendMsg = await sock.sendMessage(m.from, listMessage, { quoted: m })
            }
            break
            case 'randomanime': {
                if (command && !isGroup) return global.mess("group", m)
                if (!text) return m.reply(`List Type :\n\n${randomanime_type().sort((a, b) => a - b).join("\n")}\n\nExample : ${prefix + command} <type>`)
                if (user.isLimit(m.sender, isPremium, isOwner, config.options.limitCount, _user) && !m.fromMe) return global.mess("isLimit", m)
                let fetch = await global.api("zenz", "/randomanime/" + text, {}, "apikey")
                let buttons = [
                    { buttonId: `${prefix}randomanime ${text}`, buttonText: { displayText: 'NEXT'}, type: 1 }
                ]
                let buttonMessage = {
                    image: { url: fetch },
                    caption: `Random Anime ${text}`,
                    footer: config.footer,
                    buttons: buttons,
                    headerType: 4
                }
                sock.sendMessage(m.from, buttonMessage, { quoted: m })
                user.limitAdd(m.sender, isPremium, isOwner, _user)
                function randomanime_type() {
                    return ["anime","waifu","husbu","neko","shinobu","megumin","uniform","maid","marin-kitagawa","mori-calliope","raiden-shogun","oppai","selfies","waifus","nekos","trap","blowjob","hentai","milf","oral","paizuri","ecchi","ero"]
                }
            }
            break

            // RANDOMASUPAN COMMNAND
            case 'asupan': case 'aeunicetjoaa': case 'natajadeh': case 'asupantiktok': {
                if (command && !isGroup) return global.mess("group", m)
                if (user.isLimit(m.sender, isPremium, isOwner, config.options.limitCount, _user) && !m.fromMe) return global.mess("isLimit", m)
                let fetch = await global.api("zenz", "/randomasupan/" + command, {}, "apikey")
                sock.sendFile(m.from, fetch, "", m, { caption: "Random TikTok Asupan" })
                user.limitAdd(m.sender, isPremium, isOwner, _user)
            }
            break
            case 'randomasupan': {
                if (command && !isGroup) return global.mess("group", m)
                if (!text) return m.reply(`List Type :\n\n${randomasupan_type().sort((a, b) => a - b).join("\n")}\n\nExample : ${prefix + command} <type>`)
                if (user.isLimit(m.sender, isPremium, isOwner, config.options.limitCount, _user) && !m.fromMe) return global.mess("isLimit", m)
                let fetch = await global.api("zenz", "/randomasupan/" + text, {}, "apikey")
                let buttons = [
                    { buttonId: `${prefix}randomasupan ${text}`, buttonText: { displayText: 'NEXT'}, type: 1 }
                ]
                let buttonMessage = {
                    image: { url: fetch },
                    caption: `Random Asupan ${text}`,
                    footer: config.footer,
                    buttons: buttons,
                    headerType: 4
                }
                sock.sendMessage(m.from, buttonMessage, { quoted: m })
                user.limitAdd(m.sender, isPremium, isOwner, _user)
                function randomasupan_type() {
                    return ["cecan","china","thailand","vietnam","kayes","notnot","ryujin","justina","rose","kpop"]
                }
            }
            break
            case 'asupanmenu': {
                if (command && !isGroup) return global.mess("group", m)
                const sections = [{
                    title: "Random Asupan MP4",
                    rows: [
                        {title: "Random Asupan MP4", rowId: ".asupan"},
                        {title: "Random Asupan TikTok MP4", rowId: ".asupantiktok"},
                        {title: "Random Asupan Nata", rowId: ".natajadeh"},
                        {title: "Random Asupan Aeuni", rowId: ".aeunicetjoaa"},
                    ]
                },
                {
                    title: "Random Asupan Gambar",
                    rows: [
                        {title: "Random Cecan", rowId: ".randomasupan cecan"},
                        {title: "Random China", rowId: ".randomasupan china"},
                        {title: "Random Thailand", rowId: ".randomasupan thailand"},
                        {title: "Random Vietnam", rowId: ".randomasupan vietnam"},
                        {title: "Random Kayes", rowId: ".randomasupan kayes"},
                        {title: "Random NotNot", rowId: ".randomasupan notnot"},
                        {title: "Random Ryujin", rowId: ".randomasupan ryujin"},
                        {title: "Random Justina", rowId: ".randomasupan justina"},
                        {title: "Random Rose", rowId: ".randomasupan rose"},
                        {title: "Random Kpop", rowId: ".randomasupan kpop"},
                    ]
                }]
                const listMessage = {
                    text: "Random Asupan",
                    footer: config.footer,
                    buttonText: "OPEN LIST",
                    sections
                }
                const sendMsg = await sock.sendMessage(m.from, listMessage, { quoted: m })
            }
            break

            // RANDOMIMAGE COMMNAND
            case 'minecraft': {
                if (command && !isGroup) return global.mess("group", m)
                if (user.isLimit(m.sender, isPremium, isOwner, config.options.limitCount, _user) && !m.fromMe) return global.mess("isLimit", m)
                let fetch = await fetchUrl(global.api("zenz", "/randomimage/minecraft", {}, "apikey"))
                let buttons = [
                    {buttonId: `${prefix}minecraft`, buttonText: { displayText: 'NEXT'}, type: 1 }
                ]
                let buttonMessage = {
                    image: { url: fetch.result.image },
                    caption: fetch.result.caption,
                    footer: config.footer,
                    buttons: buttons,
                    headerType: 4
                }
                sock.sendMessage(m.from, buttonMessage, { quoted: m })
                user.limitAdd(m.sender, isPremium, isOwner, _user)
            }
            break
            case 'imagemenu': {
                if (command && !isGroup) return global.mess("group", m)
                const sections = [{
                    title: "Random Image",
                    rows: [
                        {title: "Random Cosplayer", rowId: ".randomimage cosplay"},
                        {title: "Random darkjoke", rowId: ".randomimage darkjoke"},
                        {title: "Random Meme", rowId: ".randomimage meme"},
                        {title: "Random MemeIndo", rowId: ".randomimage memeindo"},
                        {title: "Random 1Cak", rowId: ".randomimage onecak"},
                        {title: "Random Minecraft", rowId: "minecraft"},
                        {title: "Random Patrick", rowId: ".randomimage patrick"},
                        {title: "Random Aesthetic", rowId: ".randomimage aesthetic"},
                        {title: "Random Anjing", rowId: ".randomimage anjing"},
                        {title: "Random Blackpink", rowId: ".randomimage blackpink"},
                        {title: "Random Boneka", rowId: ".randomimage boneka"},
                        {title: "Random Cecan", rowId: ".randomimage cecan"},
                        {title: "Random Cogan", rowId: ".randomimage cogan"},
                        {title: "Random Hacker", rowId: ".randomimage hacker"},
                        {title: "Random Kucing", rowId: ".randomimage kucing"},
                        {title: "Random Mobil", rowId: ".randomimage mobil"},
                        {title: "Random Motor", rowId: ".randomimage motor"},
                        {title: "Random Photo Profile", rowId: ".randomimage profil"},
                        {title: "Random Pubg", rowId: ".randomimage pubg"},
                        {title: "Random WallHp", rowId: ".randomimage wallHp"},
                    ]
                }]
                const listMessage = {
                    text: "Random Image",
                    footer: config.footer,
                    buttonText: "OPEN LIST",
                    sections
                }
                const sendMsg = await sock.sendMessage(m.from, listMessage, { quoted: m })
            }
            break
            case 'randomimage': {
                if (command && !isGroup) return global.mess("group", m)
                if (!text) return m.reply(`List Type :\n\n${randomimage_type().sort((a, b) => a - b).join("\n")}\n\nExample : ${prefix + command} <type>`)
                if (user.isLimit(m.sender, isPremium, isOwner, config.options.limitCount, _user) && !m.fromMe) return global.mess("isLimit", m)
                let fetch = await global.api("zenz", "/randomimage/" + text, {}, "apikey")
                let buttons = [
                    { buttonId: `${prefix}randomimage ${text}`, buttonText: { displayText: 'NEXT'}, type: 1 }
                ]
                let buttonMessage = {
                    image: { url: fetch },
                    caption: `Random Image ${text}`,
                    footer: config.footer,
                    buttons: buttons,
                    headerType: 4
                }
                sock.sendMessage(m.from, buttonMessage, { quoted: m })
                user.limitAdd(m.sender, isPremium, isOwner, _user)
                function randomimage_type() {
                    return [
                        "cosplay",
                        "darkjoke",
                        "meme",
                        "memeindo",
                        "onecak",
                        "minecraft",
                        "patrick",
                        "aesthetic",
                        "anjing",
                        "blackpink",
                        "boneka",
                        "cecan",
                        "cogan",
                        "hacker",
                        "kucing",
                        "mobil",
                        "motor",
                        "profil",
                        "pubg",
                        "wallHp"
                    ]
                }
            }
            break
            
            // RANDOMTEXT COMMNAND
            case 'animequote': {
                if (command && !isGroup) return global.mess("group", m)
                if (user.isLimit(m.sender, isPremium, isOwner, config.options.limitCount, _user) && !m.fromMe) return global.mess("isLimit", m)
                let fetch = await fetchUrl(global.api("zenz", "/randomtext/animequotes2", {}, "apikey"))
                let caption = `Generate Random Anime Quotes :\n\n`
                caption += `⭔ Character : ${fetch.result.character}\n`
                caption += `⭔ Anime : ${fetch.result.anime}\n`
                caption += `⭔ Episode : ${fetch.result.episode}\n\n`
                caption += `⭔ Quotes : ${fetch.result.quotes}\n`
                sock.sendFile(m.from, fetch.result.thumb, "", m, { caption })        
                user.limitAdd(m.sender, isPremium, isOwner, _user)
            }
            break
            case 'cerpen': {
                if (command && !isGroup) return global.mess("group", m)
                if (user.isLimit(m.sender, isPremium, isOwner, config.options.limitCount, _user) && !m.fromMe) return global.mess("isLimit", m)
                let fetch = await fetchUrl(global.api("zenz", "/randomtext/cerpen", {}, "apikey"))
                let caption = `Generate Random Cerpen :\n\n`
                caption += `⭔ Judul : ${fetch.result.Judul}\n`
                caption += `⭔ Penulis : ${fetch.result.Penulis}\n\n`
                caption += `⭔ Cerita : ${fetch.result.cerita}\n\n`
                caption += `⭔ Sumber : ${fetch.result.sumber}\n`
                sock.sendText(m.from, caption, m)
                user.limitAdd(m.sender, isPremium, isOwner, _user)
            }
            break
            case 'cersex': {
                if (command && !isGroup) return global.mess("group", m)
                if (!isNsfw) return global.mess("isNsfw", m)
                if (user.isLimit(m.sender, isPremium, isOwner, config.options.limitCount, _user) && !m.fromMe) return global.mess("isLimit", m)
                let fetch = await fetchUrl(global.api("zenz", "/randomtext/cersex2", {}, "apikey"))
                let caption = `Generate Random Cersex :\n\n`
                caption += `⭔ Judul : ${fetch.result.Judul}\n`
                caption += `⭔ Cerita : ${fetch.result.Cerita}\n\n`
                //sock.sendFile(m.from,fetch.result.Thumb, "", m, { caption }) yg gambarnya kena internet positif
                sock.sendText(m.from, caption, m)
                user.limitAdd(m.sender, isPremium, isOwner, _user)
            }
            break
            case 'randomtext': {
                if (command && !isGroup) return global.mess("group", m)
                if (!text) return m.reply(`List Type :\n\n${randomtext_type().sort((a, b) => a - b).join("\n")}\n\nExample : ${prefix + command} <type>`)
                if (user.isLimit(m.sender, isPremium, isOwner, config.options.limitCount, _user) && !m.fromMe) return global.mess("isLimit", m)
                let fetch = await fetchUrl(global.api("zenz", "/randomtext/" + text, {}, "apikey"))
                let buttons = [
                    { buttonId: `${prefix}randomtext ${text}`, buttonText: { displayText: 'NEXT'}, type: 1 }
                ]
                let buttonMessage = {
                    text: `Random ${text}\n\n` + fetch.result.message,
                    footer: config.footer,
                    buttons: buttons,
                    headerType: 4
                }
                sock.sendMessage(m.from, buttonMessage, { quoted: m })
                user.limitAdd(m.sender, isPremium, isOwner, _user)
                function randomtext_type() {
                    return ["motivasi","dilanquote","bucinquote","katasenja","randomquote", "muslimquote", "galauquote", "kanyequote", "trumpquote", "trumpthink", "creepyfact","faktaunik", "puisi", "pantun"]
                }
            }
            break
            case 'textmenu': {
                if (command && !isGroup) return global.mess("group", m)
                const sections = [{
                    title: "Random Text",
                    rows: [
                        {title: "Quotes Dilan ", rowId: ".randomtext dilanquote"},
                        {title: "Quotes Bucin", rowId: ".randomtext bucinquote"},
                        {title: "Quotes Muslim", rowId: ".randomtext muslimquote"},
                        {title: "Quotes Random", rowId: ".randomtext randomquote"},
                        {title: "Quotes Kanye", rowId: ".randomtext kanyequote"},
                        {title: "Quotes Galau", rowId: ".randomtext galauquote"},
                        {title: "Quotes Trump", rowId: ".randomtext trumpquote"},
                        {title: "Random Trump Think", rowId: ".randomtext trumpthink"},
                        {title: "Random Motivasi", rowId: ".randomtext motivasi"},
                        {title: "Random Katasenja", rowId: ".randomtext katasenja"},
                        {title: "Random Creepyfact", rowId: ".randomtext creepyfact"},
                        {title: "Random Faktaunik", rowId: ".randomtext faktaunik"},
                        {title: "Random Pantun", rowId: ".randomtext pantun"},
                        {title: "Random Puisi", rowId: ".randomtext puisi"},
                    ]
                },
                {
                    title: "Random Text 2",
                    rows: [
                        {title: "Random Anime Quotes", rowId: ".animequote"},
                        {title: "Random Cerpen", rowId: ".cerpen"},
                        {title: "Random Cersex", rowId: ".cersex"}
                    ]
                }]
                const listMessage = {
                    text: "Random Text",
                    footer: config.footer,
                    buttonText: "OPEN LIST",
                    sections
                }
                const sendMsg = await sock.sendMessage(m.from, listMessage, { quoted: m })
            }
            break

            // SEARCH COMMNAND
            case 'animequotes': {
                if (command && !isGroup) return global.mess("group", m)
                if (!text) return m.reply(`Example: ${prefix + command} query`)
                if (user.isLimit(m.sender, isPremium, isOwner, config.options.limitCount, _user) && !m.fromMe) return global.mess("isLimit", m)
                let fetch = await fetchUrl(global.api("zenz", "/searching/animequotes", { query: text }, "apikey"))
                let caption = `Anime Quotes Query : ${text}\n\n`
                let i = fetch.result
                caption += `⭔ Quotes : ${i.quotes}\n\n`
                caption += `⭔ Character : ${i.character}\n`
                caption += `⭔ Anime : ${i.anime}\n`
                caption += `⭔ Episode : ${i.episode}\n\n`
                sock.sendFile(m.from, i.thumb, "", m, { caption })
                user.limitAdd(m.sender, isPremium, isOwner, _user)
            }
            break
            case 'bacaresep': case 'resep': {
                if (command && !isGroup) return global.mess("group", m)
                if (!text) return m.reply(`Example: ${prefix + command} query`)
                if (user.isLimit(m.sender, isPremium, isOwner, config.options.limitCount, _user) && !m.fromMe) return global.mess("isLimit", m)
                let fetch = await fetchUrl(global.api("zenz", "/searching/bacaresep", { query: text }, "apikey"))
                let caption = `Resep : ${text}\n\n`
                let i = fetch.result
                caption += `⭔ Judul : ${i.judul}\n`
                caption += `⭔ Waktu Masak : ${i.waktu_masak}\n`
                caption += `⭔ Hasil : ${i.hasil}\n`
                caption += `⭔ Tingkat Kesulitan : ${i.tingkat_kesulitan}\n`
                caption += `⭔ Bahan : ${i.waktu_masak}\n`
                sock.sendFile(m.from, i.thumb, "", m, { caption })
                user.limitAdd(m.sender, isPremium, isOwner, _user)
            }
            break
            case 'chordlagu': case 'chord': {
                if (command && !isGroup) return global.mess("group", m)
                if (!text) return m.reply(`Example: ${prefix + command} query`)
                if (user.isLimit(m.sender, isPremium, isOwner, config.options.limitCount, _user) && !m.fromMe) return global.mess("isLimit", m)
                let fetch = await fetchUrl(global.api("zenz", "/searching/chordlagu", { query: text }, "apikey"))
                let caption = `Chord Lagu Search Query : ${text}\n\n`
                let i = fetch.result
                caption += `⭔ Result : ${i.result}\n`
                sock.sendText(m.from, caption, m)
                user.limitAdd(m.sender, isPremium, isOwner, _user)
            }
            break
            case 'dafont': case 'dafontsearch': {
                if (command && !isGroup) return global.mess("group", m)
                if (!text) return m.reply(`Example: ${prefix + command} query`)
                if (user.isLimit(m.sender, isPremium, isOwner, config.options.limitCount, _user) && !m.fromMe) return global.mess("isLimit", m)
                let fetch = await fetchUrl(global.api("zenz", "/searching/dafontsearch", { query: text }, "apikey"))
                for (let i = 0; i < (fetch.result.length < 6 ? fetch.result.length : 6); i++) {
                    let download = await fetchUrl(global.api("zenz", "/downloader/dafont", { url: fetch.result[i].link }, "apikey"))
                    sock.sendFile(m.from, download.result.url, download.judul, m)
                }
                user.limitAdd(m.sender, isPremium, isOwner, _user)
            }
            break
            case 'gimage': case 'gis': {
                if (command && !isGroup) return global.mess("group", m)
                if (!text) return m.reply(`Example: ${prefix + command} query`)
                if (user.isLimit(m.sender, isPremium, isOwner, config.options.limitCount, _user) && !m.fromMe) return global.mess("isLimit", m)
                let fetch = await fetchUrl(global.api("zenz", "/searching/gimage", { query: text }, "apikey"))
                let random = fetch.result[Math.floor(Math.random() * fetch.result.length)]
                let buttons = [
                    { buttonId: `${prefix}gimage ${text}`, buttonText: { displayText: 'Next Image'}, type: 1 }
                ]
                let buttonMessage = {
                    image: { url: random },
                    caption: `Search Google Image Query : ${text}`,
                    footer: config.footer,
                    buttons: buttons,
                    headerType: 4
                }
                sock.sendMessage(m.from, buttonMessage, { quoted: m })
                user.limitAdd(m.sender, isPremium, isOwner, _user)
            }
            break
            case 'jadwaltv': {
                if (command && !isGroup) return global.mess("group", m)
                if (!text) return m.reply(`List Type :\n\n${jadwaltv_type().sort((a, b) => a - b).join("\n")}\n\nExample : ${prefix + command} <type>`)
                if (user.isLimit(m.sender, isPremium, isOwner, config.options.limitCount, _user) && !m.fromMe) return global.mess("isLimit", m)
                let fetch = await fetchUrl(global.api("zenz", "/searching/jadwaltv", { query: text }, "apikey"))
                let caption = `Jadwal TV Search Query : ${text}\n\n`
                for (let i of fetch.result.jadwal) {
                    caption += `⭔ Acara : ${i.acara}\n`
                    caption += `⭔ Time : ${i.time}\n\n`
                }
                sock.sendText(m.from, caption, m)
                user.limitAdd(m.sender, isPremium, isOwner, _user)
                function jadwaltv_type() {
                    return ["rcti","nettv","antv","gtv","indosiar", "inewstv", "kompastv", "metrotv", "mnctv", "rtv", "sctv","trans7", "transtv", "tvone", "tvri"]
                }
            }
            break
            case 'liriklagu': {
                if (command && !isGroup) return global.mess("group", m)
                if (!text) return m.reply(`Example: ${prefix + command} query`)
                if (user.isLimit(m.sender, isPremium, isOwner, config.options.limitCount, _user) && !m.fromMe) return global.mess("isLimit", m)
                let fetch = await fetchUrl(global.api("zenz", "/searching/liriklagu", { query: text }, "apikey"))
                let caption = `Lyric Search Query : ${text}\n\n`
                let i = fetch.result
                caption += `⭔ Title : ${i.judul}\n`
                caption += `⭔ Singer : ${i.penyanyi}\n\n`
                caption += `⭔ Lyrics : ${i.lirik}\n`
                sock.sendFile(m.from, fetch.result.thumb, "", m, { caption })
                user.limitAdd(m.sender, isPremium, isOwner, _user)
            }
            break
            case 'pin': {
                if (command && !isGroup) return global.mess("group", m)
                if (!text) return m.reply(`Example: ${prefix + command} query`)
                if (user.isLimit(m.sender, isPremium, isOwner, config.options.limitCount, _user) && !m.fromMe) return global.mess("isLimit", m)
                let fetch = await fetchUrl(global.api("zenz", "/searching/pinterest", { query: text }, "apikey"))
                let random = fetch.result[Math.floor(Math.random() * fetch.result.length)]
                let buttons = [
                    { buttonId: `${prefix}pin ${text}`, buttonText: { displayText: 'Next Image'}, type: 1 }
                ]  
                let buttonMessage = {
                    image: { url: random },
                    caption: `Search Pinterest Query : ${text}`,
                    footer: config.footer,
                    buttons: buttons,
                    headerType: 4
                }
                sock.sendMessage(m.from, buttonMessage, { quoted: m })
                user.limitAdd(m.sender, isPremium, isOwner, _user)
            }
            break
            case 'pixiv': {
                if (command && !isGroup) return global.mess("group", m)
                if (!isNsfw) return global.mess("isNsfw", m)
                if (!text) return m.reply(`Example: ${prefix + command} query`)
                if (user.isLimit(m.sender, isPremium, isOwner, config.options.limitCount, _user) && !m.fromMe) return global.mess("isLimit", m)
                if (text) {
                    let fetch = await fetchUrl(global.api("zenz", "/searching/pixiv", { query: text }, "apikey"))
                    let random = fetch.result[0]
                    let buttons = [
                        { buttonId: `${prefix}pixiv ${text}`, buttonText: { displayText: 'Next Image'}, type: 1 }
                    ]
                    let buttonMessage = {
                        image: { url: "https://external-content.duckduckgo.com/iu/?u=" + random.urls.regular },
                        caption: `Search Pixiv Image Query : ${text}`,
                        footer: config.footer,
                        buttons: buttons,
                        headerType: 4
                    }
                    sock.sendMessage(m.from, buttonMessage, { quoted: m })
                    user.limitAdd(m.sender, isPremium, isOwner, _user)
                } else {
                    let fetch = await fetchUrl(global.api("zenz", "/searching/pixiv/random", {}, "apikey"))
                    let random = fetch.result[0]
                    let buttons = [
                        {buttonId: `pixiv`, buttonText: { displayText: 'Next Image'}, type: 1 }
                    ]
                    let buttonMessage = {
                        image: { url: "https://external-content.duckduckgo.com/iu/?u=" + random.urls.regular },
                        caption: `Search Pixiv Image Random`,
                        footer: config.footer,
                        buttons: buttons,
                        headerType: 4
                    }
                    sock.sendMessage(m.from, buttonMessage, { quoted: m })
                    user.limitAdd(m.sender, isPremium, isOwner, _user)
                }
            }
            break
            case 'sfilesearch': {
                if (command && !isGroup) return global.mess("group", m)
                if (!text) return m.reply(`Example: ${prefix + command} query`)
                if (user.isLimit(m.sender, isPremium, isOwner, config.options.limitCount, _user) && !m.fromMe) return global.mess("isLimit", m)
                let fetch = await fetchUrl(global.api("zenz", "/searching/sfilesearch", { query: text }, "apikey"))
                let caption = `sfile Search Query : ${text}\n\n`
                for (let i of fetch.result) {
                    caption += `⭔ Title : ${i.name}\n`
                    caption += `⭔ Url : ${i.link}\n\n`
                }
                sock.sendText(m.from, caption, m)
                user.limitAdd(m.sender, isPremium, isOwner, _user)
            }
            break
            case 'ssearch': case 'stickersearch': case 'stikersearch': {
                if (command && !isGroup) return global.mess("group", m)
                if (!text) return m.reply(`Example: ${prefix + command} query`)
                if (user.isLimit(m.sender, isPremium, isOwner, config.options.limitCount, _user) && !m.fromMe) return global.mess("isLimit", m)
                let fetch = await fetchUrl(global.api("zenz", "/searching/stickersearch", { query: text }, "apikey"))
                for (let i of fetch.result) {
                    await delay(1000)
                    sock.sendFile(m.from, i.url, "", m, { asSticker: true })
                }
                user.limitAdd(m.sender, isPremium, isOwner, _user)
            }
            break
            case 'styletext': case 'fancytext': {
                if (command && !isGroup) return global.mess("group", m)
                if (!text) return m.reply(`Example: ${prefix + command} query`)
                if (user.isLimit(m.sender, isPremium, isOwner, config.options.limitCount, _user) && !m.fromMe) return global.mess("isLimit", m)
                let fetch = await fetchUrl(global.api("zenz", "/searching/styletext", { query: text }, "apikey"))
                let caption = `Text Style Query : ${text}\n\n`
                for (let i of fetch.result) {
                    caption += `⭔ Name : ${i.name}\n`
                    caption += `⭔ Result : ${i.result}\n\n`
                }
                sock.sendText(m.from, caption, m)
                user.limitAdd(m.sender, isPremium, isOwner, _user)
            }
            break
            case 'trending': {
                if (command && !isGroup) return global.mess("group", m)
                if (user.isLimit(m.sender, isPremium, isOwner, config.options.limitCount, _user) && !m.fromMe) return global.mess("isLimit", m)
                if (text) {
                    let fetch = await fetchUrl(global.api("zenz", "/searching/trendtwit", { query: text }, "apikey"))
                    let caption = `Twitter Trend Country : ${text}\n\n`
                    for (let i of fetch.result.result) {
                        caption += `⭔ rank : ${i.rank}\n`
                        caption += `⭔ hastag : ${i.hastag}\n`
                        caption += `⭔ Tweet : ${i.tweet}\n\n`
                    }
                    sock.sendText(m.from, caption, m)
                    user.limitAdd(m.sender, isPremium, isOwner, _user)
                } else {
                    let fetch = await fetchUrl(global.api("zenz", "/searching/trendtwit", { query: "indonesia" }, "apikey"))
                    let caption = `Twitter Trend Country : Indonesia\n\n`
                    for (let i of fetch.result.result) {
                        caption += `⭔ rank : ${i.rank}\n`
                        caption += `⭔ hastag : ${i.hastag}\n`
                        caption += `⭔ Tweet : ${i.tweet}\n\n`
                    }
                    sock.sendText(m.from, caption, m)
                    user.limitAdd(m.sender, isPremium, isOwner, _user)
                }
            }
            break
            case 'wagroup': {
                if (command && !isGroup) return global.mess("group", m)
                if (!text) return m.reply(`Example: ${prefix + command} query`)
                if (user.isLimit(m.sender, isPremium, isOwner, config.options.limitCount, _user) && !m.fromMe) return global.mess("isLimit", m)
                let fetch = await fetchUrl(global.api("zenz", "/searching/wagroup", { query: text }, "apikey"))
                let caption = `WA Group Search Query : ${text}\n\n`
                for (let i of fetch.result) {
                    caption += `⭔ Name : ${i.nama}\n`
                    caption += `⭔ Link : ${i.link}\n\n`
                }
                sock.sendText(m.from, caption, m)
                user.limitAdd(m.sender, isPremium, isOwner, _user)
            }
            break
            case 'wamod': case 'wamods': {
                if (command && !isGroup) return global.mess("group", m)
                if (!text) return m.reply(`Example: ${prefix + command} query`)
                if (user.isLimit(m.sender, isPremium, isOwner, config.options.limitCount, _user) && !m.fromMe) return global.mess("isLimit", m)
                let fetch = await fetchUrl(global.api("zenz", "/searching/wamods", { query: text }, "apikey"))
                let caption = `Wamods Search Query : ${text}\n\n`
                for (let i of fetch.result) {
                    caption += `⭔ Apk Name : ${i.apk_name}\n`
                    caption += `⭔ Apk Url : ${i.apk_url}\n`
                    caption += `⭔ Apk Desc : ${i.apk_desc}\n\n`
                }
                sock.sendFile(m.from, fetch.result[0].apk_image, "", m, { caption })
                user.limitAdd(m.sender, isPremium, isOwner, _user)
            }
            break
            case 'xnxxsearch': {
                if (command && !isGroup) return global.mess("group", m)
                if (!isNsfw) return global.mess("isNsfw", m)
                if (!text) return m.reply(`Example: ${prefix + command} query`)
                if (user.isLimit(m.sender, isPremium, isOwner, config.options.limitCount, _user) && !m.fromMe) return global.mess("isLimit", m)
                let fetch = await fetchUrl(global.api("zenz", "/searching/xnxx", { query: text }, "apikey"))
                let caption = `Xnxx Search Query : ${text}\n\n`
                for (let i of fetch.result) {
                    caption += `⭔ Title : ${i.title}\n`
                    caption += `⭔ Thumb : ${i.thumb}\n`
                    caption += `⭔ Url : ${i.url}\n\n`
                }
                sock.sendFile(m.from, fetch.result[0].thumb, "", m, { caption })
                user.limitAdd(m.sender, isPremium, isOwner, _user)
            }
            break
            case 'xvideosearch': {
                if (command && !isGroup) return global.mess("group", m)
                if (!isNsfw) return global.mess("isNsfw", m)
                if (!text) return m.reply(`Example: ${prefix + command} query`)
                if (user.isLimit(m.sender, isPremium, isOwner, config.options.limitCount, _user) && !m.fromMe) return global.mess("isLimit", m)
                let fetch = await fetchUrl(global.api("zenz", "/searching/xvideos", { query: text }, "apikey"))
                let caption = `Xvideos Search Query : ${text}\n\n`
                for (let i of fetch.result) {
                    caption += `⭔ Title : ${i.title}\n`
                    caption += `⭔ Duration : ${i.duration}\n`
                    caption += `⭔ Thumb : ${i.thumb}\n`
                    caption += `⭔ Url : ${i.url}\n\n`
                }
                sock.sendText(m.from, caption, m)
                user.limitAdd(m.sender, isPremium, isOwner, _user)
            }
            break
            case 'ytsearch': {
                if (command && !isGroup) return global.mess("group", m)
                if (!text) return m.reply(`Example: ${prefix + command} query`)
                if (user.isLimit(m.sender, isPremium, isOwner, config.options.limitCount, _user) && !m.fromMe) return global.mess("isLimit", m)
                let fetch = await fetchUrl(global.api("zenz", "/searching/ytsearch", { query: text }, "apikey"))
                let caption = `YouTube Search Query : ${text}\n\n`
                let result = fetch.result.filter(v => v.type == "video").map(v => v)
                for (let i of result) {
                    caption += `⭔ Title : ${i.title}\n`
                    caption += `⭔ Desc : ${i.description}\n`
                    caption += `⭔ Type : ${i.type}\n`
                    caption += `⭔ ID : ${i.videoId}\n`
                    caption += `⭔ Url : ${i.url}\n`
                    caption += `⭔ Duration : ${i.timestamp}\n`
                    caption += `⭔ Upload At : ${i.ago}\n`
                    caption += `⭔ Views : ${i.views}\n`
                    caption += `⭔ Author : ${i.author.name}\n`
                    caption += `\n─────────────────\n\n`
                }
                sock.sendFile(m.from, result[0].thumbnail, "", m, { caption })
                user.limitAdd(m.sender, isPremium, isOwner, _user)
            }
            break
            case 'zerochan': case 'zchan': {
                if (command && !isGroup) return global.mess("group", m)
                if (!text) return m.reply(`Example: ${prefix + command} query`)
                if (user.isLimit(m.sender, isPremium, isOwner, config.options.limitCount, _user) && !m.fromMe) return global.mess("isLimit", m)
                let fetch = await fetchUrl(global.api("zenz", "/searching/zerochan", { query: text }, "apikey"))
                let random = fetch.result[Math.floor(Math.random() * fetch.result.length)]
                let buttons = [
                    {buttonId: `${prefix}zerochan ${text}`, buttonText: { displayText: 'Next Image'}, type: 1 }
                ]
                let buttonMessage = {
                    image: { url: "https://external-content.duckduckgo.com/iu/?u=" + random },
                    caption: `Search Zerochan Image Query : ${text}`,
                    footer: config.footer,
                    buttons: buttons,
                    headerType: 4
                }
                sock.sendMessage(m.from, buttonMessage, { quoted: m })
                user.limitAdd(m.sender, isPremium, isOwner, _user)
            }
            break

            // STALKER COMMNAND
            case 'cekapi': case 'cekapikey': {
                if (command && !isGroup) return global.mess("group", m)
                if (!text) return m.reply(`Example: ${prefix + command} query`)
                try {
                    let fetch = await fetchUrl(global.api("zenz", "/user/cekapi", {apikey: text}))
                    let caption = `Apikey Checker :\n\n`
                    let i = fetch.message
                    caption += `⭔ Id : ${i.id}\n`
                    caption += `⭔ Created : ${i.created}\n`
                    caption += `⭔ Updated : ${i.updated}\n`
                    caption += `⭔ First Name : ${i.firstname}\n`
                    caption += `⭔ Last Name : ${i.lastname}\n`
                    caption += `⭔ Email : ${i.email}\n`
                    caption += `⭔ Username : ${i.username}\n`
                    caption += `⭔ ApiKey : ${i.apiKey}\n`
                    caption += `⭔ Todayhit : ${i.today_hit}\n`
                    caption += `⭔ Totalhit : ${i.total_hit}\n`
                    caption += `⭔ Status : ${i.status}\n`
                    caption += `⭔ Premium : ${i.premium}\n`
                    caption += `⭔ Expired : ${i.premium_expired}\n`
                    caption += `⭔ Active : ${i.active}\n`
                    caption += `⭔ Location : ${i.location}\n`
                    caption += `⭔ Biodata : ${i.biodata}\n`
                    sock.sendFile(m.from, i.profile_image, "", m, { caption })
                } catch (e) {
                    m.reply('Error / Apikey Not Valid')
                }
            }
            break
            case 'stalkig': case 'igstalk': {
                if (command && !isGroup) return global.mess("group", m)
                if (!text) return m.reply(`Example: ${prefix + command} username`)
                if (user.isLimit(m.sender, isPremium, isOwner, config.options.limitCount, _user) && !m.fromMe) return global.mess("isLimit", m)
                let fetch = await fetchUrl(global.api("zenz", "/stalker/ig", { username: text }, "apikey"))
                let caption = `Instagram Profile Stalker :\n\n`
                let i = fetch.result.caption
                caption += `⭔ Fullname : ${i.full_name}\n`
                caption += `⭔ Username : ${i.user_name}\n`
                caption += `⭔ Userid : ${i.user_id}\n`
                caption += `⭔ Followers : ${i.followers}\n`
                caption += `⭔ Following : ${i.following}\n`
                caption += `⭔ Bussines : ${i.bussines}\n`
                caption += `⭔ Profesional : ${i.profesional}\n`
                caption += `⭔ Verified : ${i.verified}\n`
                caption += `⭔ Private : ${i.private}\n`
                caption += `⭔ Biography : ${i.biography}\n`
                caption += `⭔ Url : ${i.bio_url}\n\n`
                sock.sendFile(m.from, i.profile_hd, "", m, { caption })
                user.limitAdd(m.sender, isPremium, isOwner, _user)
            }
            break
            case 'nickaov': case 'nickautochess': case 'nickbigolive': case 'nickcocofun': case 'nickcod': case 'nickdomino': case 'nickdragonraja': case 'nicksdriver': case 'nickff': case 'nickhago': case 'nicklokapala':
            case 'nicknimotv': case 'nickpb': case 'nickpubg': case 'nicksausage': case 'nickzepeto': {
                if (command && !isGroup) return global.mess("group", m)
                if (!text) return m.reply(`Example: ${prefix + command} ID`)
                if (user.isLimit(m.sender, isPremium, isOwner, config.options.limitCount, _user) && !m.fromMe) return global.mess("isLimit", m)
                let fetch = await fetchUrl(global.api("zenz", "/stalker/" + command, { query: text }, "apikey"))
                let caption = `${command} Stalker :\n\n`
                let i = fetch.result
                caption += `⭔ GameId : ${i.gameId}\n`
                caption += `⭔ UserName : ${i.userName}\n`
                sock.sendText(m.from, caption, m)
                user.limitAdd(m.sender, isPremium, isOwner, _user)
            }
            break
            case 'nickml': case 'nickkmladventure': {
                if (command && !isGroup) return global.mess("group", m)
                if (!text.includes('|')) return m.reply(`Example : ${prefix + command} ID|SERVER`)
                if (user.isLimit(m.sender, isPremium, isOwner, config.options.limitCount, _user) && !m.fromMe) return global.mess("isLimit", m)
                let text1 = text.split("|")[0]
                let text2 = text.split("|")[1]
                let fetch = await fetchUrl(global.api("zenz", "/stalker/" + command, { query: text1, query2: text2 }, "apikey"))
                let caption = `Mobile Legends Stalker :\n\n`
                let i = fetch.result
                caption += `⭔ GameId : ${i.gameId}\n`
                caption += `⭔ ZoneId : ${i.zoneId}\n`
                caption += `⭔ UserName : ${i.userName}\n`
                sock.sendText(m.from, caption, m)
                user.limitAdd(m.sender, isPremium, isOwner, _user)
            }
            break

            // TEXTMAKER COMMNAND
            // USERS COMMNAND
            case 'inv': case 'tas': case 'inventory': {
                if (command && !isGroup) return global.mess("group", m)
                const balance = user.getBalance(m.sender, _user)
                const fish = rpg.getIkan(m.sender, _rpg)
                const batu = rpg.getBatu(m.sender, _rpg)
                const permata = rpg.getPermata(m.sender, _rpg)
                const emas = rpg.getEmas(m.sender, _rpg)
                m.reply(zenz.inventory(senderName, balance, fish, batu, permata, emas))
            }
			break
            case 'afk': {
			if (!isGroup) return global.mess("group", m)
            if (user.isLimit(m.sender, isPremium, isOwner, config.options.limitCount, _user) && !m.fromMe) return global.mess("isLimit", m)
                if (isAfkOn) return reply("AFK telah aktifkan sebelumnya")
                const reason = q ? q : 'Nothing.'
                const date = + new Date
                afk.addAfkUser(m.sender, date, reason, time, _afk)
                m.reply(`*AFK berhasil diaktifkan!*\n\nNama: ${m.pushName}\nAlasan: ${reason}`)
                user.limitAdd(m.sender, isPremium, isOwner, _user)
            }
            break
            case 'limit': case 'ceklimit': {
			    if (isPremium || isOwner) return m.reply(`Limit: Unlimited\nLimit Game: ${user.getLimitGame(m.sender, _user)} / ${config.options.limitgameCount} Max\n\nBalance : ${user.getBalance(m.sender, _user)}`)
			    m.reply(`Limit left: ${user.getLimit(m.sender, _user)} / ${config.options.limitCount} Max\nLimit Game: ${user.getLimitGame(m.sender, _user)} / ${config.options.limitgameCount} Max\nBalance : ${user.getBalance(m.sender, _user)}\n\n_Limit direset tiap pukul 00:00_`)
            }
			break
            case 'cekpremium': case 'cekprem': {
                if (command && !isGroup) return global.mess("group", m)
                if (!isPremium) return global.mess("premium", m)
                let cekprem = require("parse-ms")((await premium.getPremiumExpired(m.sender, _premium)) - Date.now())
                let caption = `*Expired :* ${cekprem.days} day ${cekprem.hours} hour ${cekprem.minutes} minute ${cekprem.seconds} Second`
                sock.sendText(m.from, caption, m)
            }
            break
            case 'profile': case 'me': {
                if (command && !isGroup) return global.mess("group", m)
                let statuses
                try {
                    statuses = await sock.fetchStatus(m.sender);
                } catch {
                    statuses = "Nothing.."
                }
                let cekprem = require("parse-ms")((await premium.getPremiumExpired(m.sender, _premium)) - Date.now())
                const premi = isPremium ? `-${cekprem.days} Days` : 'No'
                const levelMe = level.getLevelingLevel(m.sender, _user)
                const xpMe = level.getLevelingXp(sender, _user)
                const req = 20 * Math.pow(levelMe, 2) + 50 * levelMe + 100
                const limitnya = isPremium || isOwner ? 'Unlimited' : user.getLimit(m.sender, _user)
                const balance = user.getBalance(m.sender, _user)
                try {
                    var pp = await sock.profilePictureUrl(m.sender, "image");
                } catch {
                    var pp = "https://i.ibb.co/Tq7d7TZ/age-hananta-495-photo.png";
                }
                let caption = `\n┌──⭓ *About Me*\n`
                caption += `│\n`
                caption += `│⭔ Username : ${m.pushName}\n`
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
                sock.sendFile(m.from, pp, "", m, { caption })
            }
            break
            case 'hapus': case 'delete': case 'del': case 'd': {
                if (command && !isGroup) return global.mess("group", m)
                if (!m.quoted) return m.reply('Reply pesanya!')
                sock.sendMessage(from, { delete: { remoteJid: from, fromMe: true, id: m.quoted.id, participant: m.quoted.sender } })
            }
            break
            case 'leaderboard': case 'leaderboards': {
                if (command && !isGroup) return global.mess("group", m)
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
                    m.reply(leaderboard)
                } catch (err) {
                    m.reply('Minimal 10')
                }
            }
            break

            // WEBZONE COMMNAND
            case 'amino': {
                if (command && !isGroup) return global.mess("group", m)
                if (!text) return m.reply(`Example: ${prefix + command} query`)
                if (user.isLimit(m.sender, isPremium, isOwner, config.options.limitCount, _user) && !m.fromMe) return global.mess("isLimit", m)
                let fetch = await fetchUrl(global.api("zenz", "/webzone/amino", { query: text }, "apikey"))
                let caption = `Amino Search Query : ${text}\n\n`
                for (let i of fetch.result) {
                    caption += `⭔ Community Name : ${i.community}\n`
                    caption += `⭔ Community Desc : ${i.community_desc}\n`
                    caption += `⭔ Community Link : ${i.community_link}\n`
                    caption += `⭔ Community Thumb : ${i.community_thumb}\n\n`
                }
                sock.sendText(m.from, caption, m)
                user.limitAdd(m.sender, isPremium, isOwner, _user)
            }
            break
            case 'drakor': {
                if (command && !isGroup) return global.mess("group", m)
                if (!text) return m.reply(`Example: ${prefix + command} query`)
                if (user.isLimit(m.sender, isPremium, isOwner, config.options.limitCount, _user) && !m.fromMe) return global.mess("isLimit", m)
                let fetch = await fetchUrl(global.api("zenz", "/webzone/drakor", { query: text }, "apikey"))
                let caption = `Drakor Search Query : ${text}\n\n`
                for (let i of fetch.result) {
                    caption += `⭔ Judul : ${i.judul}\n`
                    caption += `⭔ Years : ${i.years}\n`
                    caption += `⭔ Genre : ${i.genre}\n`
                    caption += `⭔ Thumbnail : ${i.thumbnail}\n`
                    caption += `⭔ Url : ${i.url}\n\n`
                }
                sock.sendFile(m.from, fetch.result[0].thumbnail, "", m, { caption })
                user.limitAdd(m.sender, isPremium, isOwner, _user)
            }
            break
            case 'gsmarena': {
                if (command && !isGroup) return global.mess("group", m)
                if (!text) return m.reply(`Example: ${prefix + command} query`)
                if (user.isLimit(m.sender, isPremium, isOwner, config.options.limitCount, _user) && !m.fromMe) return global.mess("isLimit", m)
                let fetch = await fetchUrl(global.api("zenz", "/webzone/gsmarena", { query: text }, "apikey"))
                let caption = `Gsmarena Search Query : ${text}\n\n`
                caption += `⭔ Judul : ${fetch.result.judul}\n`
                caption += `⭔ Release : ${fetch.result.rilis}\n`
                caption += `⭔ Ukuran : ${fetch.result.ukuran}\n`
                caption += `⭔ Type : ${fetch.result.type}\n`
                caption += `⭔ Storage : ${fetch.result.storage}\n`
                caption += `⭔ Display : ${fetch.result.display}\n`
                caption += `⭔ Inchi : ${fetch.result.inchi}\n`
                caption += `⭔ Pixel : ${fetch.result.pixel}\n`
                caption += `⭔ Video Pixel : ${fetch.result.videoPixel}\n`
                caption += `⭔ RAM : ${fetch.result.ram}\n`
                caption += `⭔ Chipset : ${fetch.result.chipset}\n`
                caption += `⭔ Battery : ${fetch.result.batrai}\n`
                caption += `⭔ Merek Battery : ${fetch.result.merek_batre}\n\n`
                caption += `⭔ Detail : ${fetch.result.detail}\n`
                sock.sendFile(m.from, fetch.result.thumb, "", m, { caption })
                user.limitAdd(m.sender, isPremium, isOwner, _user)
            }
            break
            case 'jadwalbioskop': {
                if (command && !isGroup) return global.mess("group", m)
                if (!text) return m.reply(`Example: ${prefix + command} query`)
                if (user.isLimit(m.sender, isPremium, isOwner, config.options.limitCount, _user) && !m.fromMe) return global.mess("isLimit", m)
                let fetch = await fetchUrl(global.api("zenz", "/webzone/jadwalbioskop", { kota: text }, "apikey"))
                let caption = `Jadwal Bioskop Kota : ${text}\n\n`
                for (let i of fetch.result) {
                    caption += `⭔ Location : ${i.title}\n`
                    caption += `⭔ Thumb : ${i.thumb}\n`
                    caption += `⭔ Url : ${i.url}\n\n`
                }
                sock.sendFile(m.from, fetch.result[0].thumb, "", m, { caption })
                user.limitAdd(m.sender, isPremium, isOwner, _user)
            }
            break
            case 'nowplaying': {
                if (command && !isGroup) return global.mess("group", m)
                if (user.isLimit(m.sender, isPremium, isOwner, config.options.limitCount, _user) && !m.fromMe) return global.mess("isLimit", m)
                let fetch = await fetchUrl(global.api("zenz", "/webzone/nowplayingbioskop", {}, "apikey"))
                let caption = `Now Bioskop Playing :\n\n`
                for (let i of fetch.result) {
                    caption += `⭔ Title : ${i.title}\n`
                    caption += `⭔ Thumb : ${i.img}\n`
                    caption += `⭔ Url : ${i.url}\n\n`
                }
                sock.sendFile(m.from, fetch.result[0].img, "", m, { caption })
                user.limitAdd(m.sender, isPremium, isOwner, _user)
            }
            break
            case 'playstore': {
                if (command && !isGroup) return global.mess("group", m)
                if (!text) return m.reply(`Example: ${prefix + command} query`)
                if (user.isLimit(m.sender, isPremium, isOwner, config.options.limitCount, _user) && !m.fromMe) return global.mess("isLimit", m)
                let fetch = await fetchUrl(global.api("zenz", "/webzone/playstore", { query: text }, "apikey"))
                let caption = `PlayStore Search Query : ${text}\n\n`
                for (let i of fetch.result) {
                    caption += `⭔ Name : ${i.name}\n`
                    caption += `⭔ Url App : ${i.link}\n`
                    caption += `⭔ Developer : ${i.developer}\n`
                    caption += `⭔ Detail Dev : ${i.link_dev}\n`
                    caption += `\n─────────────────\n\n`
                }
                sock.sendText(m.from, caption, m)
                user.limitAdd(m.sender, isPremium, isOwner, _user)
            }
            break
            case 'wattpad': {
                if (command && !isGroup) return global.mess("group", m)
                if (!text) return m.reply(`Example: ${prefix + command} query`)
                if (user.isLimit(m.sender, isPremium, isOwner, config.options.limitCount, _user) && !m.fromMe) return global.mess("isLimit", m)
                let fetch = await fetchUrl(global.api("zenz", "/webzone/wattpad", { query: text }, "apikey"))
                let caption = `Wattpad Search Query : ${text}\n\n`
                for (let i of fetch.result) {
                    caption += `⭔ Judul : ${i.judul}\n`
                    caption += `⭔ Dibaca : ${i.dibaca}\n`
                    caption += `⭔ Divote : ${i.divote}\n`
                    caption += `⭔ Bab : ${i.bab}\n`
                    caption += `⭔ Waktu : ${i.waktu}\n`
                    caption += `⭔ Url : ${i.url}\n`
                    caption += `⭔ Thumb : ${i.thumb}\n`
                    caption += `⭔ Description : ${i.description}\n\n`
                }
                sock.sendFile(m.from, fetch.result[0].thumb, "", m, { caption })
                user.limitAdd(m.sender, isPremium, isOwner, _user)
            }
            break
            case 'webtoons': {
                if (command && !isGroup) return global.mess("group", m)
                if (!text) return m.reply(`Example: ${prefix + command} query`)
                if (user.isLimit(m.sender, isPremium, isOwner, config.options.limitCount, _user) && !m.fromMe) return global.mess("isLimit", m)
                let fetch = await fetchUrl(global.api("zenz", "/webzone/webtoons", { query: text }, "apikey"))
                let caption = `Webtoons Search Query : ${text}\n\n`
                for (let i of fetch.result) {
                    caption += `⭔ Judul : ${i.judul}\n`
                    caption += `⭔ Like : ${i.like}\n`
                    caption += `⭔ Creator : ${i.creator}\n`
                    caption += `⭔ Genre : ${i.genre}\n`
                    caption += `⭔ Thumbnail : ${i.thumbnail}\n`
                    caption += `⭔ Url : ${i.url}\n\n`
                }
                //sock.sendFile(m.from, fetch.result[0].img, "", m, { caption }) yg gambarnya kena internet positif
                sock.sendText(m.from, caption, m)
                user.limitAdd(m.sender, isPremium, isOwner, _user)
            }
            break

            // BOT FEATURE
            case 'mancing': {
                if (command && !isGroup) return global.mess("group", m)
                if (!isGroup) return global.mess("group", m)
                if (mancing.hasOwnProperty(m.sender.split('@')[0])) return m.reply("Masih Ada Pancingan Yang Belum Diselesaikan!")
                if (user.isLimitGame(m.sender, config.options.limitgameCount, _user) && !m.fromMe) return global.mess("isLimitGame", m)
                user.limitGameAdd(m.sender, _user)
                m.reply('Sedang Memancing, silahkan tunggu..')

                mancing[sender.split('@')[0]] = + new Date
                await sleep(Math.floor(10000 + Math.random() * 50000))

                if (mancing.hasOwnProperty(m.sender.split('@')[0])) {
                    const bahan = ['🐟','🐠','🐡'] 
                    const bahan_ = bahan[Math.floor(Math.random() * bahan.length)]
                    const ditangkap = Math.ceil(Math.random() * 10)

                    const result = ["BAHAN","ZONK"]
                    const hasil = result[Math.floor(Math.random() * result.length)]
                    if (hasil == "BAHAN" ) {
                        rpg.addIkan(sender, ditangkap, _rpg)
                        m.reply(`Hasil Tangkapan Ikan ${bahan_}\nJumlah Tangkapan : ${ditangkap}\nSelama ${clockString(new Date - mancing[m.sender.split('@')[0]])}`)
                    } else if(hasil == "ZONK") {
                        m.reply('Anda Tewas Dimakan Hiu Dan Tidak Mendapatkan Ikan')
                    } else {
                        m.reply("404")
                    }
                    delete mancing[sender.split('@')[0]]
                }
            }
            break
            case 'nambang': {
                if (command && !isGroup) return global.mess("group", m)
                if (!isGroup) return global.mess("group", m)
                if (nambang.hasOwnProperty(m.sender.split('@')[0])) return m.reply("Masih Ada Tambangan Yang Belum Diselesaikan!")
                if (user.isLimitGame(m.sender, config.options.limitgameCount, _user) && !m.fromMe) return global.mess("isLimitGame", m)
                user.limitGameAdd(m.sender, _user)
                m.reply('Sedang Menambang, silahkan tunggu..')

                nambang[sender.split('@')[0]] = + new Date
                await sleep(Math.floor(10000 + Math.random() * 50000))

                if (nambang.hasOwnProperty(m.sender.split('@')[0])) {
                    const result =["🗿","💎","🪙","ZONK"]
                    const hasil = result[Math.floor(Math.random() * result.length)]
                    if (hasil == "🗿" ) {
                        const ditangkap = Math.ceil(Math.random() * 10)
                        rpg.addBatu(sender, ditangkap, _rpg)
                        m.reply(`Hasil Tangkapan : Batu ${hasil}\nJumlah Tangkapan : ${ditangkap}\nSelama ${clockString(new Date - nambang[m.sender.split('@')[0]])}`)
                    } else if(hasil == "💎") {
                        const ditangkap = Math.ceil(Math.random() * 2)
                        rpg.addPermata(sender, ditangkap, _rpg)
                        m.reply(`Hasil Tangkapan : Permata ${hasil}\nJumlah Tangkapan : ${ditangkap}\nSelama ${clockString(new Date - nambang[m.sender.split('@')[0]])}`)
                    } else if(hasil == "🪙") {
                        const ditangkap = Math.ceil(Math.random() * 5)
                        rpg.addEmas(sender, ditangkap, _rpg)
                        m.reply(`Hasil Tangkapan : Emas ${hasil}\nJumlah Tangkapan : ${ditangkap}\nSelama ${clockString(new Date - nambang[m.sender.split('@')[0]])}`)
                    } else if(hasil == "ZONK") {
                        m.reply('Anda Tewas Tertimpa Beton Dan Tidak Mendapatkan Tambangan')
                    } else {
                        m.reply("404")
                    }
                    delete nambang[sender.split('@')[0]]
                }
            }
            break
            case 'jual': case 'sell': {
                if (command && !isGroup) return global.mess("group", m)
                if (ar[0] === 'ikan') {
                    if (!args[1]) return m.reply(`Harga 1 Ikan 50 Balance\nExample: ${prefix + command + " " + ar[0]} 10`)
                    if (args[1].includes('-')) return m.reply(`Example ${prefix + command} ikan 1`)
                    if (args[1].includes('.')) return m.reply(`Example ${prefix + command} ikan 1`)
                    const result = args[1] * 50
                    if ( rpg.getIkan(m.sender, _rpg) <= args[1] ) return m.reply(`Maaf ${senderName} Kamu Tidak Punya ${ar[1]} Ikan`)
                    if ( rpg.getIkan(m.sender, _rpg) >= args[1] ) {
                        rpg.jualIkan(m.sender, args[1], _rpg)
                        user.addBalance(m.sender, result, _user)
                        m.reply(`*PENJUALAN BERHASIL*\n\n*Jumlah Ikan Dijual:* ${args[1]}\n*Uang didapat:* ${result}\n\n*Sisa Ikan:* ${rpg.getIkan(m.sender, _rpg)}\n*Sisa Uang:* ${user.getBalance(m.sender, _user)}`)
                    }
                } else if (ar[0] === 'batu') {
                    if (!args[1]) return m.reply(`Harga 1 Batu 10 Balance\nExample: ${prefix + command + " " + ar[0]} 10`)
                    if (args[1].includes('-')) return m.reply(`Example ${prefix + command} batu 1`)
                    if (args[1].includes('.')) return m.reply(`Example ${prefix + command} batu 1`)
                    const result = args[1] * 10
                    if ( rpg.getBatu(m.sender, _rpg) <= args[1] ) return m.reply(`Maaf ${senderName} Kamu Tidak Punya ${ar[1]} Batu`)
                    if ( rpg.getBatu(m.sender, _rpg) >= args[1] ) {
                        rpg.jualBatu(m.sender, args[1], _rpg)
                        user.addBalance(m.sender, result, _user)
                        m.reply(`*PENJUALAN BERHASIL*\n\n*Jumlah Batu Dijual:* ${args[1]}\n*Uang didapat:* ${result}\n\n*Sisa Batu:* ${rpg.getBatu(m.sender, _rpg)}\n*Sisa Uang:* ${user.getBalance(m.sender, _user)}`)
                    }
                } else if (ar[0] === 'emas') {
                    if (!args[1]) return m.reply(`Harga 1 Emas 100 Balance\nExample: ${prefix + command + " " + ar[0]} 10`)
                    if (args[1].includes('-')) return m.reply(`Example ${prefix + command} emas 1`)
                    if (args[1].includes('.')) return m.reply(`Example ${prefix + command} emas 1`)
                    const result = args[1] * 100
                    if ( rpg.getEmas(m.sender, _rpg) <= args[1] ) return m.reply(`Maaf ${senderName} Kamu Tidak Punya ${ar[1]} Emas`)
                    if ( rpg.getEmas(m.sender, _rpg) >= args[1] ) {
                        rpg.jualEmas(m.sender, args[1], _rpg)
                        user.addBalance(m.sender, result, _user)
                        m.reply(`*PENJUALAN BERHASIL*\n\n*Jumlah Emas Dijual:* ${args[1]}\n*Uang didapat:* ${result}\n\n*Sisa Emas:* ${rpg.getEmas(m.sender, _rpg)}\n*Sisa Uang:* ${user.getBalance(m.sender, _user)}`)
                    }
                } else if (ar[0] === 'permata') {
                    if (!args[1]) return m.reply(`Harga 1 Permata 200 Balance\nExample: ${prefix + command + " " + ar[0]} 10`)
                    if (args[1].includes('-')) return m.reply(`Example ${prefix + command} permata 1`)
                    if (args[1].includes('.')) return m.reply(`Example ${prefix + command} permata 1`)
                    const result = args[1] * 200
                    if ( rpg.getPermata(m.sender, _rpg) <= args[1] ) return m.reply(`Maaf ${senderName} Kamu Tidak Punya ${ar[1]} Permata`)
                    if ( rpg.getPermata(m.sender, _rpg) >= args[1] ) {
                        rpg.jualPermata(m.sender, args[1], _rpg)
                        user.addBalance(m.sender, result, _user)
                        m.reply(`*PENJUALAN BERHASIL*\n\n*Jumlah Permata Dijual:* ${args[1]}\n*Uang didapat:* ${result}\n\n*Sisa Permata:* ${rpg.getPermata(m.sender, _rpg)}\n*Sisa Uang:* ${user.getBalance(m.sender, _user)}`)
                    }
                } else {
                    m.reply(`Mau Jual Apaan ?\n- ikan\n- batu\n- emas\n- permata\n\nExample: ${prefix + command} ikan 10`)
                }
            }
            break
            case 'beli': case 'buy': {
                if (command && !isGroup) return global.mess("group", m)
                if (ar[0] === 'limit') {
                    if (!args[1]) return m.reply(`Harga 1 Limit 500 Balance\nExample: ${prefix + command + " " + ar[0]} 10`)
                    if (args[1].includes('-')) return m.reply(`Example ${prefix + command} limit 10`)
                    if (args[1].includes('.')) return m.reply(`Example ${prefix + command} limit 10`)
                    const result = args[1] * 500
                    if ( user.getBalance(m.sender, _user) <= result ) return m.reply(`Maaf ${senderName} Kamu Tidak Punya ${result} Balance`)
                    if ( user.getBalance(m.sender, _user) >= result ) {
                        user.jualBalance(m.sender, result, _user)
                        user.jualLimit(m.sender, args[1], _user)
                        m.reply(`*PENJUALAN BERHASIL*\n\n*Jumlah Limit Dibeli:* ${args[1]}\n\n*Sisa Limit:* ${user.getLimit(m.sender, _user)}\n*Sisa Uang:* ${user.getBalance(m.sender, _user)}`)
                    }
                } else if (ar[0] === 'limitgame') {
                    if (!args[1]) return m.reply(`Harga 1 Limitgame 250 Balance\nExample: ${prefix + command + " " + ar[0]} 10`)
                    if (args[1].includes('-')) return m.reply(`Example ${prefix + command} limitgame 10`)
                    if (args[1].includes('.')) return m.reply(`Example ${prefix + command} limitgame 10`)
                    const result = args[1] * 250
                    if ( user.getBalance(m.sender, _user) <= result ) return m.reply(`Maaf ${senderName} Kamu Tidak Punya ${result} Balance`)
                    if ( user.getBalance(m.sender, _user) >= result ) {
                        user.jualBalance(m.sender, result, _user)
                        user.jualLimitGame(m.sender, args[1], _user)
                        m.reply(`*PENJUALAN BERHASIL*\n\n*Jumlah Limitgame Dibeli:* ${args[1]}\n\n*Sisa Limitgame:* ${user.getLimitGame(m.sender, _user)}\n*Sisa Uang:* ${user.getBalance(m.sender, _user)}`)
                    }
                } else {
                    m.reply(`Mau Beli Apaan ?\n- limit\n- limitgame\n\nExample: ${prefix + command} limit 10`)
                }
            }
            break
            case 'more': {
                if (command && !isGroup) return global.mess("group", m)
                if (!q.includes('|')) return m.reply(`Example: ${prefix + command} hello|there`)
                if (user.isLimit(m.sender, isPremium, isOwner, config.options.limitCount, _user) && !m.fromMe) return global.mess("isLimit", m)
                let kata = String.fromCharCode(8206)
                m.reply(arg.split('|')[0] + kata.repeat(4001) + arg.split('|')[1])
                user.limitAdd(m.sender, isPremium, isOwner, _user)
            }
            break
            case 'bisakah': {
                if (command && !isGroup) return global.mess("group", m)
                if (!text) return m.reply(`Example: ${prefix + command} kamu memasak ?`)
                if (user.isLimit(m.sender, isPremium, isOwner, config.options.limitCount, _user) && !m.fromMe) return global.mess("isLimit", m)
                const tanya = ['Bisa','Tidak Bisa','Coba Ulangi','Ngimpi kah?','yakin bisa?']
                const jawab = tanya[Math.floor(Math.random() * tanya.length)]
                m.reply(`Pertanyaan : ${text}\n\nJawaban : ${jawab}`)
                user.limitAdd(m.sender, isPremium, isOwner, _user)
            }
            break
            case 'kapankah': {
                if (command && !isGroup) return global.mess("group", m)
                if (!text) return m.reply(`Example: ${prefix + command} kamu memasak ?`)
                if (user.isLimit(m.sender, isPremium, isOwner, config.options.limitCount, _user) && !m.fromMe) return global.mess("isLimit", m)
                const tanya = ['Besok','Lusa','Tadi','4 Hari Lagi','5 Hari Lagi','6 Hari Lagi','1 Minggu Lagi','2 Minggu Lagi','3 Minggu Lagi','1 Bulan Lagi','2 Bulan Lagi','3 Bulan Lagi','4 Bulan Lagi','5 Bulan Lagi','6 Bulan Lagi','1 Tahun Lagi','2 Tahun Lagi','3 Tahun Lagi','4 Tahun Lagi','5 Tahun Lagi','6 Tahun Lagi','1 Abad lagi','3 Hari Lagi','Tidak Akan Pernah']
                const jawab = tanya[Math.floor(Math.random() * tanya.length)]
                m.reply(`Pertanyaan : ${text}\n\nJawaban : ${jawab}`)
                user.limitAdd(m.sender, isPremium, isOwner, _user)
            }
            break
            case 'apakah': {
                if (command && !isGroup) return global.mess("group", m)
                if (!text) return m.reply(`Example: ${prefix + command} kamu memasak ?`)
                if (user.isLimit(m.sender, isPremium, isOwner, config.options.limitCount, _user) && !m.fromMe) return global.mess("isLimit", m)
                const tanya = ['Iya','Tidak','Bisa Jadi','Coba Ulangi','Tanyakan Ayam']
                const jawab = tanya[Math.floor(Math.random() * tanya.length)]
                m.reply(`Pertanyaan : ${text}\n\nJawaban : ${jawab}`)
                user.limitAdd(m.sender, isPremium, isOwner, _user)
            }
            break
            case 'watak': {
                if (command && !isGroup) return global.mess("group", m)
                if (!text) return m.reply(`Example: ${prefix + command} ${senderName}`)
                if (user.isLimit(m.sender, isPremium, isOwner, config.options.limitCount, _user) && !m.fromMe) return global.mess("isLimit", m)
                const tanya = ["penyayang","pemurah","Pemarah","Pemaaf","Penurut","Baik","baperan","Baik Hati","penyabar","Uwu","top deh, pokoknya","Suka Membantu"]
                const jawab = tanya[Math.floor(Math.random() * tanya.length)]
                m.reply(`Pertanyaan : ${text}\n\nJawaban : ${jawab}`)
                user.limitAdd(m.sender, isPremium, isOwner, _user)
            }
            break
            case 'gantengcek': {
                if (command && !isGroup) return global.mess("group", m)
                if (!text) return m.reply(`Example: ${prefix + command} ${senderName}`)
                if (user.isLimit(m.sender, isPremium, isOwner, config.options.limitCount, _user) && !m.fromMe) return global.mess("isLimit", m)
                if (q.match(/zein|Zein|ZEIN/)) {
                    const tanya = ['70%','74%','83%','97%','100%','94%','75%','82%']
                    const jawab = tanya[Math.floor(Math.random() * tanya.length)]
                    return m.reply(`Pertanyaan : Cek Ganteng Bang ${text}\n\nJawaban : ${jawab}`)
                }
                const tanya = ['10%','30%','20%','40%','50%','60%','70%','62%','74%','83%','97%','100%','29%','94%','75%','82%','41%','39%']
                const jawab = tanya[Math.floor(Math.random() * tanya.length)]
                m.reply(`Pertanyaan : Cek Ganteng Bang ${text}\n\nJawaban : ${jawab}`)
                user.limitAdd(m.sender, isPremium, isOwner, _user)
            }
            break
            case 'cantikcek': {
                if (command && !isGroup) return global.mess("group", m)
                if (!text) return m.reply(`Example: ${prefix + command} ${senderName}`)
                if (user.isLimit(m.sender, isPremium, isOwner, config.options.limitCount, _user) && !m.fromMe) return global.mess("isLimit", m)
                const tanya = ['10% banyak" perawatan ya kak:v\nCanda Perawatan:v','30% Semangat Kaka Merawat Dirinya><','20% Semangat Ya Kaka👍','40% Wahh Kaka><','50% kaka cantik deh><','60% Hai Cantik🐊','70% Hai Ukhty🐊','62% Kakak Cantik><','74% Kakak ni cantik deh><','83% Love You Kakak><','97% Assalamualaikum Ukhty🐊','100% Kakak Pake Susuk ya??:v','29% Semangat Kakak:)','94% Hai Cantik><','75% Hai Kakak Cantik','82% wihh Kakak Pasti Sering Perawatan kan??','41% Semangat:)','39% Lebih Semangat🐊']
                const jawab = tanya[Math.floor(Math.random() * tanya.length)]
                m.reply(`Pertanyaan : Cantik Cek Neng ${text}\n\nJawaban : ${jawab}`)
                user.limitAdd(m.sender, isPremium, isOwner, _user)
            }
            break
            case 'judi': case 'casino': {
                if (command && !isGroup) return global.mess("group", m)
                if (!text) return m.reply('Mau Taruhan Berapa ?')
                if (user.isLimitGame(m.sender, config.options.limitgameCount, _user) && !m.fromMe) return global.mess("isLimitGame", m)
                user.limitGameAdd(m.sender, _user)

                if (user.getBalance(m.sender, _user) <= text ) return m.reply(`Maaf ${senderName} Balance Anda Tidak Mencukupi`)
                if (text <= 999 ) return m.reply('Miskin Amat.. Minimal 1000')
                m.reply('Taruhan Sedang Berlangsung, Silahkan Tunggu')
                const result = ["MENANG","KALAH","LOSE"]

                setTimeout( () => {
                    const bayar = text * 2 - 100
                    const hasil = result[Math.floor(Math.random() * result.length)]

                    if (hasil == "MENANG") {
                        user.addBalance(m.sender, bayar, _user)
                        m.reply(`Selamat Kamu memenangkan ${command} sebesar ${bayar}`)
                    } else if(hasil == "KALAH") {
                        user.jualBalance(m.sender, bayar, _user)
                        m.reply(`Maaf Kamu Kalah Dan Kehilangan sebesar ${bayar}`)
                    } else if(hasil == "LOSE") {
                        user.jualBalance(m.sender, bayar, _user)
                        m.reply(`Maaf Kamu Kalah Dan Kehilangan sebesar ${bayar}`)
                    } else {
                        m.reply(" X error X ")
                    }
                }, 10000)
            }
            break

            default:
                if (isCmd) {
                    m.reply('Command Not Found!')
                }
            break
        }
    } catch (e) {
        m.reply(String(e))
        console.log(color('|ERR|', 'red'), color(String(e), 'cyan'))
    }
}