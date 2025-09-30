require("./setting")
const { Telegraf } = require("telegraf")
const fs = require("fs")
const chalk = require('chalk')
const moment = require("moment-timezone")
const yargs = require('yargs/yargs')
const figlet = require("figlet")

const { simple } = require("./function/myfunc")

//Waktu
moment.tz.setDefault("Asia/Jakarta").locale("id");
const d = new Date
const tanggal = d.toLocaleDateString('id', {
  day: 'numeric',
  month: 'long',
  year: 'numeric'
})
const jamwib = moment.tz('Asia/Jakarta').format('HH:mm:ss')
const dnew = new Date(new Date + 3600000)
const dateIslamic = Intl.DateTimeFormat('id' + '-TN-u-ca-islamic', { day: 'numeric', month: 'long', year: 'numeric' }).format(dnew)

if (BOT_TOKEN == "YOUR_TELEGRAM_BOT_TOKEN") {
  return console.log("Bot token tidak boleh kosong, silahkan buat bot melalui https://t.me/BotFather")
}

//DATABASE
global.opts = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse())
global.db = new (require('./function/database'))(`${opts._[0] ? opts._[0] + '_' : ''}options/database.json`, null, 2)

if (!db.data.order) db.data.order = {}
if (!db.data.list) db.data.list = []
if (!db.data.testi) db.data.testi = []
if (!db.data.chat) db.data.chat = {}
if (!db.data.user) db.data.user = []
if (!db.data.sewa) db.data.sewa = {}
if (!db.data.produk) db.data.produk = {}
if (!db.data.transaksi) db.data.transaksi = []

let lastJSON = JSON.stringify(db.data)
if (!opts['test']) setInterval(async () => {
  if (JSON.stringify(db.data) == lastJSON) return
  await db.save()
  lastJSON = JSON.stringify(db.data)
}, 30 * 1000)

const bot = new Telegraf(BOT_TOKEN)

async function startronzz() {
  bot.on('callback_query', async (ronzz) => {
    action = ronzz.callbackQuery.data.split(" ")
    args = action
    user_id = Number(action[1])
    const user = simple.getUserName(ronzz.callbackQuery.from)
    const isOwner = [ronzz.botInfo.username, ...global.OWNER].map(v => v.replace("https://t.me/", '')).includes(user.username ? user.username : "-")
    
    if (ronzz.callbackQuery.from.id != user_id && !isOwner) return ronzz.answerCbQuery('Uppss... button ini bukan untukmu!', { show_alert: true })
    
    const pushname = user.full_name.replace("@", "")
    const username = user.username ? user.username : "-";
    const userId = user.id.toString()
    
    if (!userId.length <= 8 && !db.data.user.includes(userId + " ")) db.data.user.push(userId + " ")

    const reply = async (text) => {
      for (var x of simple.range(0, text.length, 4096)) {
        return await ronzz.replyWithMarkdown(text.substr(x, 4096), { disable_web_page_preview: true })
      }
    }

    function toRupiah(angka) {
      var saldo = '';
      var angkarev = angka.toString().split('').reverse().join('');
      for (var i = 0; i < angkarev.length; i++)
        if (i % 3 == 0) saldo += angkarev.substr(i, 3) + '.';
      return '' + saldo.split('', saldo.length - 1).reverse().join('');
    }

    try {
      switch (action[0]) {
        case "menucmd": {
          let button = [[{ text: '💰 ORDER MENU', callback_data: 'ordercmd ' + userId }, { text: 'STORE MENU 🛍️', callback_data: 'storecmd ' + userId }], [{ text: '📒 INFO BOT', callback_data: 'infocmd ' + userId }, { text: 'OWNER MENU 🧒🏻', callback_data: 'ownercmd ' + userId }]]
          let teks = `*🤖 BOT INFO 🤖*
• Bot Name: ${BOT_NAME}
• Runtime: ${simple.runtime(process.uptime())}
• User: ${db.data.user.length} Users
• Owner: [@${OWNER_NAME}](${OWNER[0]})

*👤 USER INFO 👤*
• Tag: [@${pushname}](https://t.me/${username})
• Username: ${username}
• Name: ${pushname}

*📆 DATE INFO 📆*
• Masehi: ${moment.tz("Asia/Jakarta").format("DD MMMM YYYY")}
• Hijriah: ${dateIslamic}

*⏰ TIME INFO ⏰*
• WIB: ${moment.tz('Asia/Jakarta').format('HH:mm:ss')}
• WITA: ${moment.tz('Asia/Makassar').format('HH:mm:ss')}
• WIT: ${moment.tz('Asia/Jayapura').format('HH:mm:ss')}

_Silahkan pilih menu di bawah ini._`
          try {
            await ronzz.editMessageMedia({
              type: "photo",
              media: {
                source: thumbnail
              },
              caption: teks,
              parse_mode: "MARKDOWN",
              disable_web_page_preview: true
            }, {
              reply_markup: {
                inline_keyboard: button
              }
            })
          } catch {
            await ronzz.replyWithPhoto({
              source: thumbnail
            }, {
              caption: teks,
              parse_mode: "MARKDOWN",
              disable_web_page_preview: true,
              reply_markup: {
                inline_keyboard: button
              }
            })
          }
        }
          break

        case "ordercmd": {
          let button = [[{ text: '📖 MENU', callback_data: 'menucmd ' + userId }, { text: 'STORE MENU 🛍️', callback_data: 'storecmd ' + userId }], [{ text: '📒 INFO BOT', callback_data: 'infocmd ' + userId }, { text: 'OWNER MENU 🧒🏻', callback_data: 'ownercmd ' + userId }]]
          let teks = `*🤖 BOT INFO 🤖*
• Bot Name: ${BOT_NAME}
• Runtime: ${simple.runtime(process.uptime())}
• User: ${db.data.user.length} Users
• Owner: [@${OWNER_NAME}](${OWNER[0]})
  
*👤 USER INFO 👤*
• Tag: [@${pushname}](https://t.me/${username})
• Username: ${username}
• Name: ${pushname}
  
*📆 DATE INFO 📆*
• Masehi: ${moment.tz("Asia/Jakarta").format("DD MMMM YYYY")}
• Hijriah: ${dateIslamic}
  
*⏰ TIME INFO ⏰*
• WIB: ${moment.tz('Asia/Jakarta').format('HH:mm:ss')}
• WITA: ${moment.tz('Asia/Makassar').format('HH:mm:ss')}
• WIT: ${moment.tz('Asia/Jayapura').format('HH:mm:ss')}
  
╭─────╼「 *ORDER MENU* 」
│☛ /stok
│☛ /buy
│☛ /buypanel
╰─────╼`
          try {
            await ronzz.editMessageMedia({
              type: "photo",
              media: {
                source: thumbnail
              },
              caption: teks,
              parse_mode: "MARKDOWN",
              disable_web_page_preview: true
            }, {
              reply_markup: {
                inline_keyboard: button
              }
            })
          } catch {
            await ronzz.replyWithPhoto({
              source: thumbnail
            }, {
              caption: teks,
              parse_mode: "MARKDOWN",
              disable_web_page_preview: true,
              reply_markup: {
                inline_keyboard: button
              }
            })
          }
        }
          break

        case "storecmd": {
          let button = [[{ text: '📖 MENU', callback_data: 'menucmd ' + userId }, { text: 'ORDER MENU 💰', callback_data: 'ordercmd ' + userId }], [{ text: '📒 INFO BOT', callback_data: 'infocmd ' + userId }, { text: 'OWNER MENU 🧒🏻', callback_data: 'ownercmd ' + userId }]]
          let teks = `*🤖 BOT INFO 🤖*
• Bot Name: ${BOT_NAME}
• Runtime: ${simple.runtime(process.uptime())}
• User: ${db.data.user.length} Users
• Owner: [@${OWNER_NAME}](${OWNER[0]})
    
*👤 USER INFO 👤*
• Tag: [@${pushname}](https://t.me/${username})
• Username: ${username}
• Name: ${pushname}
    
*📆 DATE INFO 📆*
• Masehi: ${moment.tz("Asia/Jakarta").format("DD MMMM YYYY")}
• Hijriah: ${dateIslamic}
    
*⏰ TIME INFO ⏰*
• WIB: ${moment.tz('Asia/Jakarta').format('HH:mm:ss')}
• WITA: ${moment.tz('Asia/Makassar').format('HH:mm:ss')}
• WIT: ${moment.tz('Asia/Jayapura').format('HH:mm:ss')}
    
╭─────╼「 *STORE MENU* 」
│☛ /list
│☛ /testi
│☛ /addlist
│☛ /dellist
│☛ /setlist
│☛ /addtesti
│☛ /deltesti
│☛ /settesti
│☛ /kalkulator
│☛ /done
│☛ /setdone
│☛ /deldone
│☛ /changedone
│☛ /proses
│☛ /setproses
│☛ /delproses
│☛ /changeproses
╰─────╼`
          try {
            await ronzz.editMessageMedia({
              type: "photo",
              media: {
                source: thumbnail
              },
              caption: teks,
              parse_mode: "MARKDOWN",
              disable_web_page_preview: true
            }, {
              reply_markup: {
                inline_keyboard: button
              }
            })
          } catch {
            await ronzz.replyWithPhoto({
              source: thumbnail
            }, {
              caption: teks,
              parse_mode: "MARKDOWN",
              disable_web_page_preview: true,
              reply_markup: {
                inline_keyboard: button
              }
            })
          }
        }
          break

        case "infocmd": {
          let button = [[{ text: '📖 MENU', callback_data: 'menucmd ' + userId }, { text: 'ORDER MENU 💰', callback_data: 'ordercmd ' + userId }], [{ text: '🛍️ STORE MENU', callback_data: 'storecmd ' + userId }, { text: 'OWNER MENU 🧒🏻', callback_data: 'ownercmd ' + userId }]]
          let teks = `*🤖 BOT INFO 🤖*
• Bot Name: ${BOT_NAME}
• Runtime: ${simple.runtime(process.uptime())}
• User: ${db.data.user.length} Users
• Owner: [@${OWNER_NAME}](${OWNER[0]})
      
*👤 USER INFO 👤*
• Tag: [@${pushname}](https://t.me/${username})
• Username: ${username}
• Name: ${pushname}
      
*📆 DATE INFO 📆*
• Masehi: ${moment.tz("Asia/Jakarta").format("DD MMMM YYYY")}
• Hijriah: ${dateIslamic}
      
*⏰ TIME INFO ⏰*
• WIB: ${moment.tz('Asia/Jakarta').format('HH:mm:ss')}
• WITA: ${moment.tz('Asia/Makassar').format('HH:mm:ss')}
• WIT: ${moment.tz('Asia/Jayapura').format('HH:mm:ss')}
      
╭─────╼「 *INFO BOT* 」
│☛ /creator
│☛ /owner
│☛ /ping
│☛ /runtime
│☛ /script
╰─────╼`
          try {
            await ronzz.editMessageMedia({
              type: "photo",
              media: {
                source: thumbnail
              },
              caption: teks,
              parse_mode: "MARKDOWN",
              disable_web_page_preview: true
            }, {
              reply_markup: {
                inline_keyboard: button
              }
            })
          } catch {
            await ronzz.replyWithPhoto({
              source: thumbnail
            }, {
              caption: teks,
              parse_mode: "MARKDOWN",
              disable_web_page_preview: true,
              reply_markup: {
                inline_keyboard: button
              }
            })
          }
        }
          break

        case "ownercmd": {
          let button = [[{ text: '📖 MENU', callback_data: 'menucmd ' + userId }, { text: 'ORDER MENU 💰', callback_data: 'ordercmd ' + userId }], [{ text: '🛍️ STORE MENU', callback_data: 'storecmd ' + userId }, { text: 'INFO BOT 📒', callback_data: 'infocmd ' + userId }]]
          let teks = `*🤖 BOT INFO 🤖*
• Bot Name: ${BOT_NAME}
• Runtime: ${simple.runtime(process.uptime())}
• User: ${db.data.user.length} Users
• Owner: [@${OWNER_NAME}](${OWNER[0]})
    
*👤 USER INFO 👤*
• Tag: [@${pushname}](https://t.me/${username})
• Username: ${username}
• Name: ${pushname}
    
*📆 DATE INFO 📆*
• Masehi: ${moment.tz("Asia/Jakarta").format("DD MMMM YYYY")}
• Hijriah: ${dateIslamic}
    
*⏰ TIME INFO ⏰*
• WIB: ${moment.tz('Asia/Jakarta').format('HH:mm:ss')}
• WITA: ${moment.tz('Asia/Makassar').format('HH:mm:ss')}
• WIT: ${moment.tz('Asia/Jayapura').format('HH:mm:ss')}
    
╭─────╼「 *OWNER MENU* 」
│☛ /addproduk
│☛ /delproduk
│☛ /setkode
│☛ /setjudul
│☛ /setdesk
│☛ /setsnk
│☛ /setharga
│☛ /setprofit
│☛ /addstok
│☛ /delstok
│☛ /rekap
│☛ /backup
│☛ /broadcast
│☛ /welcome
│☛ /goodbye
╰─────╼`
          try {
            await ronzz.editMessageMedia({
              type: "photo",
              media: {
                source: thumbnail
              },
              caption: teks,
              parse_mode: "MARKDOWN",
              disable_web_page_preview: true
            }, {
              reply_markup: {
                inline_keyboard: button
              }
            })
          } catch {
            await ronzz.replyWithPhoto({
              source: thumbnail
            }, {
              caption: teks,
              parse_mode: "MARKDOWN",
              disable_web_page_preview: true,
              reply_markup: {
                inline_keyboard: button
              }
            })
          }
        }
          break

        case 'rekapminggu': {
          function kelompokkanTransaksi(transaksi) {
            let today = new Date(moment.tz("Asia/Jakarta").format("YYYY-MM-DD"));
            let startOfWeek = new Date(today);
            startOfWeek.setDate(today.getDate() - today.getDay());

            let endOfWeek = new Date(today);
            endOfWeek.setDate(startOfWeek.getDate() + 6);
            endOfWeek.setHours(23);
            endOfWeek.setMinutes(59);

            let transaksiMingguIni = transaksi.filter(data => {
              let transaksiDate = new Date(data.date);
              transaksiDate.setDate(transaksiDate.getDate());
              return transaksiDate >= startOfWeek && transaksiDate <= endOfWeek;
            });

            let transaksiMingguan = {};
            transaksiMingguIni.forEach(data => {
              let tanggall = new Date(data.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
              if (!transaksiMingguan[tanggall]) {
                transaksiMingguan[tanggall] = [];
              }
              transaksiMingguan[tanggall].push(data);
            });

            let sortedTransaksiMingguan = {};
            Object.keys(transaksiMingguan).sort((a, b) => {
              let days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
              return days.indexOf(a.split(',')[0]) - days.indexOf(b.split(',')[0]);
            }).forEach(key => {
              sortedTransaksiMingguan[key] = transaksiMingguan[key];
            });

            return sortedTransaksiMingguan;
          }

          function rekapMingguan(transaksiHarian) {
            let totalStokTerjual = 0;
            let totalPendapatanKotor = 0;
            let totalPendapatanBersih = 0;
            let rekap = "*Rekap Mingguan:*\n\n";

            let sortedDates = Object.keys(transaksiHarian).sort((a, b) => {
              let dateA = new Date(a.split(',')[1]);
              let dateB = new Date(b.split(',')[1]);
              return dateA - dateB;
            });

            sortedDates.forEach((tanggall, index) => {
              let dataTransaksi = transaksiHarian[tanggall];
              let stokTerjualHarian = 0;
              let pendapatanKotorHarian = 0;
              let pendapatanBersihHarian = 0;

              dataTransaksi.forEach(data => {
                stokTerjualHarian += parseInt(data.jumlah);
                pendapatanKotorHarian += parseInt(data.price) * parseInt(data.jumlah);
                pendapatanBersihHarian += parseInt(data.profit) * parseInt(data.jumlah);
              });

              totalStokTerjual += stokTerjualHarian;
              totalPendapatanKotor += pendapatanKotorHarian;
              totalPendapatanBersih += pendapatanBersihHarian;

              rekap += `${index + 1}. *${new Date(tanggall.split(',')[1] + tanggall.split(',')[2]).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}*\n`;
              rekap += `- *Stok Terjual:* ${stokTerjualHarian}\n`;
              rekap += `- *Pendapatan Kotor:* Rp${toRupiah(pendapatanKotorHarian)}\n`;
              rekap += `- *Pendapatan Bersih:* Rp${toRupiah(pendapatanBersihHarian)}\n\n`;
            });
            rekap += `- *Total Stok Terjual:* ${totalStokTerjual}\n`;
            rekap += `- *Total Pendapatan Kotor:* Rp${toRupiah(totalPendapatanKotor)}\n`;
            rekap += `- *Total Pendapatan Bersih:* Rp${toRupiah(totalPendapatanBersih)}\n\n`;

            return rekap;
          }

          let mingguan = kelompokkanTransaksi(db.data.transaksi);

          try {
            ronzz.editMessageText(rekapMingguan(mingguan), {
              parse_mode: "MARKDOWN",
              disable_web_page_preview: true
            })
          } catch {
            reply(rekapMingguan(mingguan))
          }
        }
          break

        case 'rekapbulan': {
          function bulankelompok(transaksi) {
            let transaksiHarian = {};

            transaksi.forEach(data => {
              let tanggall = new Date(data.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
              if (!transaksiHarian[tanggall]) {
                transaksiHarian[tanggall] = [];
              }
              transaksiHarian[tanggall].push(data);
            });

            return transaksiHarian;
          }

          function rekapBulanan(transaksiHarian) {
            let totalStokTerjual = 0;
            let totalPendapatanKotor = 0;
            let totalPendapatanBersih = 0;
            let rekap = "*Rekap Bulanan:*\n\n";

            const bulanan = {};

            Object.entries(transaksiHarian).forEach(([tanggall, dataTransaksi]) => {
              let bulan = new Date(tanggall).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });

              if (!bulanan[bulan]) {
                bulanan[bulan] = {
                  stokTerjual: 0,
                  pendapatanKotor: 0,
                  pendapatanBersih: 0,
                  transaksiPerHari: {}
                };
              }

              dataTransaksi.forEach(data => {
                let hari = new Date(data.date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

                if (!bulanan[bulan].transaksiPerHari[hari]) {
                  bulanan[bulan].transaksiPerHari[hari] = [];
                }

                bulanan[bulan].transaksiPerHari[hari].push(data);
              });

              dataTransaksi.forEach(data => {
                bulanan[bulan].stokTerjual += parseInt(data.jumlah);
                bulanan[bulan].pendapatanKotor += parseInt(data.price) * parseInt(data.jumlah);
                bulanan[bulan].pendapatanBersih += parseInt(data.profit) * parseInt(data.jumlah);
              });
            });

            Object.entries(bulanan).forEach(([bulan, dataBulan]) => {
              rekap += `\`${bulan}:\`\n`;

              Object.entries(dataBulan.transaksiPerHari).forEach(([hari, transaksiHari]) => {
                let stokTerjualHari = 0;
                let pendapatanKotorHari = 0;
                let pendapatanBersihHari = 0;
                transaksiHari.forEach(transaksi => {
                  stokTerjualHari += parseInt(transaksi.jumlah);
                  pendapatanKotorHari += parseInt(transaksi.price) * parseInt(transaksi.jumlah);
                  pendapatanBersihHari += parseInt(transaksi.profit) * parseInt(transaksi.jumlah);
                });
                rekap += `- *${hari}:*\n`;
                rekap += `  - *Stok Terjual:* ${stokTerjualHari}\n`;
                rekap += `  - *Pendapatan Kotor:* Rp${toRupiah(parseInt(pendapatanKotorHari))}\n`;
                rekap += `  - *Pendapatan Bersih:* Rp${toRupiah(parseInt(pendapatanBersihHari))}\n\n`;
              });

              rekap += `- *Total Stok Terjual:* ${dataBulan.stokTerjual}\n`;
              rekap += `- *Total Pendapatan Kotor:* Rp${toRupiah(dataBulan.pendapatanKotor)}\n`;
              rekap += `- *Total Pendapatan Bersih:* Rp${toRupiah(dataBulan.pendapatanBersih)}\n\n`;

              totalStokTerjual += dataBulan.stokTerjual;
              totalPendapatanKotor += dataBulan.pendapatanKotor;
              totalPendapatanBersih += dataBulan.pendapatanBersih;
            });

            return rekap;
          }

          let bulanan = bulankelompok(db.data.transaksi);

          try {
            ronzz.editMessageText(rekapBulanan(bulanan), {
              parse_mode: "MARKDOWN",
              disable_web_page_preview: true
            })
          } catch {
            reply(rekapBulanan(bulanan))
          }
        }
          break
          
        case 'welcome': {
          if (action[2] == "on") {
            db.data.chat[action[3]].welcome = true
            
            try {
              ronzz.editMessageText("Welcome berhasil diaktifkan di Group ini.", {
                parse_mode: "MARKDOWN",
                disable_web_page_preview: true
              })
            } catch {
              reply("Welcome berhasil diaktifkan di Group ini.")
            }
          } else if (action[2] == "off") {
            db.data.chat[action[3]].welcome = false
            
            try {
              ronzz.editMessageText("Welcome berhasil dinonaktifkan di Group ini.", {
                parse_mode: "MARKDOWN",
                disable_web_page_preview: true
              })
            } catch {
              reply("Welcome berhasil dinonaktifkan di Group ini.")
            }
          }
        }
          break
          
        case 'goodbye': {
          if (action[2] == "on") {
            db.data.chat[action[3]].goodbye = true
            
            try {
              ronzz.editMessageText("Good Bye berhasil diaktifkan di Group ini.", {
                parse_mode: "MARKDOWN",
                disable_web_page_preview: true
              })
            } catch {
              reply("Good Bye berhasil diaktifkan di Group ini.")
            }
          } else if (action[2] == "off") {
            db.data.chat[action[3]].goodbye = false
            
            try {
              ronzz.editMessageText("Good Bye berhasil dinonaktifkan di Group ini.", {
                parse_mode: "MARKDOWN",
                disable_web_page_preview: true
              })
            } catch {
              reply("Good Bye berhasil dinonaktifkan di Group ini.")
            }
          }
        }
          break

        case 'tambah': {
          try {
            ronzz.editMessageText(`${Number(action[2]) + Number(action[3])}`)
          } catch {
            ronzz.reply(`${Number(action[2]) + Number(action[3])}`)
          }
        }
          break

        case 'kurang': {
          try {
            ronzz.editMessageText(`${Number(action[2]) - Number(action[3])}`)
          } catch {
            ronzz.reply(`${Number(action[2]) - Number(action[3])}`)
          }
        }
          break

        case 'bagi': {
          try {
            ronzz.editMessageText(`${Number(action[2]) / Number(action[3])}`)
          } catch {
            ronzz.reply(`${Number(action[2]) / Number(action[3])}`)
          }
        }
          break

        case 'kali': {
          try {
            ronzz.editMessageText(`${Number(action[2]) * Number(action[3])}`)
          } catch {
            ronzz.reply(`${Number(action[2]) * Number(action[3])}`)
          }
        }
          break
      }
    } catch (e) {
      console.log(e)
    }
  })

  bot.command('start', async (ronzz) => {
    let user = simple.getUserName(ronzz.message.from)
    await ronzz.reply(`Halo ${user.full_name}! Nama saya ${BOT_NAME} - Saya adalah Bot Telegram Auto Order! Klik /menu untuk mengetahui lebih lanjut tentang cara menggunakan bot ini.\n\nBergabunglah dengan [Channel Saya](${CHANNEL}) untuk mendapatkan informasi tentang semua pembaruan terbaru.`, {
      parse_mode: "MARKDOWN",
      disable_web_page_preview: true,
      reply_markup: {
        inline_keyboard: [
          [{
            text: '📒 MENU 📒',
            callback_data: 'menucmd ' + user.id.toString()
          }],
          [{
            text: 'SCRIPT',
            url: "https://t.me/ronzzyt"
          }, {
            text: 'OWNER',
            url: OWNER[0]
          }]
        ]
      }
    })
  })

  bot.on('message', async (ronzz) => {
    if (ronzz.message.new_chat_member && ronzz.message.new_chat_member.id !== ronzz.botInfo.id && db.data.chat[ronzz.message.chat.id].welcome) {
      let message = ronzz.message
      let groupname = message.chat.title
      let groupmembers = await bot.telegram.getChatMembersCount(message.chat.id)
      let pp_user = await simple.getPhotoProfile(message.new_chat_member.id)
      let full_name = simple.getUserName(message.new_chat_member).full_name
      let teks = `*Welcome To ${groupname}*
      
📛 : [@${full_name}](https://t.me/${message.from.username})
🪪 : ${message.from.id}
🌐 : ${message.from.language_code !== undefined ? message.from.language_code : "id"}
🏅 : ${groupmembers} Members
📆 : ${moment.tz('Asia/Jakarta').format('dddd')}, ${tanggal}
⏰ : ${jamwib} *WIB*`

      await ronzz.replyWithPhoto({
        url: pp_user
      }, {
        caption: teks,
        parse_mode: "Markdown",
        disable_web_page_preview: true
      })
    }
    if (ronzz.message.left_chat_member && ronzz.message.left_chat_member.id !== ronzz.botInfo.id && db.data.chat[ronzz.message.chat.id].goodbye) {
      let message = ronzz.message
      let groupname = message.chat.title
      let groupmembers = await bot.telegram.getChatMembersCount(message.chat.id)
      let pp_user = await simple.getPhotoProfile(message.left_chat_member.id)
      let full_name = simple.getUserName(message.left_chat_member).full_name
      let teks = `*Leave From Group ${groupname}*
      
📛 : [@${full_name}](https://t.me/${message.from.username})
🪪 : ${message.from.id}
🌐 : ${message.from.language_code !== undefined ? message.from.language_code : "id"}
🏅 : ${groupmembers} Members
📆 : ${moment.tz('Asia/Jakarta').format('dddd')}, ${tanggal}
⏰ : ${jamwib} *WIB*

*┗━━ ❑ Good Bye👋*`

      await ronzz.replyWithPhoto({
        url: pp_user
      }, {
        caption: teks,
        parse_mode: "Markdown",
        disable_web_page_preview: true
      })
    }
    ronzz.download = async (save = false, path = '') => {
      const id = await simple.getFileId(ronzz);
      const { href } = await bot.telegram.getFileLink(id);
      if (save) {
        let res = await simple.fetchBuffer(href)
        fs.writeFileSync(path, res?.data)
        return path
      } else if (!save) {
        return href;
      }
    }
    require("./index")(ronzz, bot)
  })

  bot.launch({
    dropPendingUpdates: true
  })

  bot.telegram.getMe().then(async (getme) => {
    console.log(chalk.bold.green(figlet.textSync('Velzzy', {
      font: 'Standard',
      horizontalLayout: 'default',
      vertivalLayout: 'default',
      whitespaceBreak: false
    })))
    await simple.sleep(100)
    console.log(`\n${chalk.yellow("[ BOT INFO ]")}\n${chalk.green("Bot Name:")} ${chalk.white(getme.first_name + (getme.last_name !== undefined ? ` ${getme.last_name}` : ""))}\n${chalk.green("Username:")} ${chalk.white("@" + getme.username)}\n${chalk.green("Id:")} ${chalk.white(getme.id)}\n${chalk.green("Link:")} ${chalk.white("https://t.me/" + getme.username)}\n \n `)
    await simple.sleep(100)
    console.log(chalk.yellow(`${chalk.red('[ CREATOR RONZZ YT ]')}\n\n${chalk.italic.magenta(`SV Ronzz YT\nNomor: 08817861263\nSebut nama👆,`)}\n\n${chalk.red(`ADMIN MENYEDIAKAN`)}\n${chalk.white(`- SC BOT TOPUP\n- SC BOT CPANEL\n- SC BOT AUTO ORDER\n- SC BOT PUSH KONTAK\n- ADD FITUR JADIBOT\n- UBAH SC LAMA KE PAIRING CODE\n- FIXS FITUR/SC ERROR\n`)}`))
  })
}

startronzz()

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))