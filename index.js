require("./setting")
const chalk = require('chalk')
const moment = require('moment-timezone')
const fs = require('fs')
const os = require('os')
const speed = require('performance-now')
const util = require('util')
const { exec, execSync } = require('child_process')
const { sizeFormatter } = require('human-readable')
const toMs = require('ms')
const axios = require('axios')
const crypto = require("crypto")
const QRCode = require("qrcode")

const { qrisDinamis } = require("./function/dinamis");
const { addResponList, delResponList, isAlreadyResponList, sendResponList, updateResponList, getDataResponList } = require('./function/respon-list');
const { addResponTesti, delResponTesti, isAlreadyResponTesti, updateResponTesti, getDataResponTesti } = require('./function/respon-testi');
const { simple } = require('./function/myfunc')

//Waktu
moment.tz.setDefault("Asia/Jakarta").locale("id");
const tanggal = moment.tz('Asia/Jakarta').format('DD MMMM YYYY')
const jamwib = moment.tz('Asia/Jakarta').format('HH:mm:ss')
const dnew = new Date(new Date() + 3600000)
const dateIslamic = Intl.DateTimeFormat('id' + '-TN-u-ca-islamic', { day: 'numeric', month: 'long', year: 'numeric' }).format(dnew)

module.exports = ronzz = async (ronzz, bot) => {
  try {
    const body = ronzz.message.text || ronzz.message.caption || ''
    const budy = (typeof ronzz.message.text == 'string' ? ronzz.message.text : '')
    const isCmd = /^[°•π÷×¶∆£¢€¥®™�✓_=|~!?#/$%^&.+-,\\\©^]/.test(body)
    const prefa = [""]
    const prefix = prefa ? /^[°•π÷×¶∆£¢€¥®=????+✓_=|/~!?@#%^&.©^]/gi.test(body) ? body.match(/^[°•π÷×¶∆£¢€¥®=????+✓_/=|~!?@#%^&.©^]/gi)[0] : "" : prefa ?? '#'
    const commands = body.replace(prefix, '').trim().split(/ +/).shift().toLowerCase()
    const command = (commands.split("@")[1] !== undefined && commands.split("@")[1].toLowerCase() == ronzz.botInfo.username.toLowerCase()) ? commands.split("@")[0] : commands
    const args = body.trim().split(/ +/).slice(1)
    const q = args.join(" ")
    const user = simple.getUserName(ronzz.message.from)
    const pushname = user.full_name;
    const user_id = ronzz.message.from.id + " "
    const username = ronzz.message.from.username ? ronzz.message.from.username : "ronzzyt";
    const isOwner = OWNER.map(v => v.replace("https://t.me/", '').toLowerCase()).includes(ronzz.update.message.from.username.toLowerCase())
    const from = ronzz.message.chat.id

    const isGroup = ronzz.chat.type.includes('group')
    const groupName = isGroup ? ronzz.chat.title : ''

    const isImage = ronzz.message.hasOwnProperty('photo')
    const isVideo = ronzz.message.hasOwnProperty('video')
    const isAudio = ronzz.message.hasOwnProperty('audio')
    const isSticker = ronzz.message.hasOwnProperty('sticker')
    const isContact = ronzz.message.hasOwnProperty('contact')
    const isLocation = ronzz.message.hasOwnProperty('location')
    const isDocument = ronzz.message.hasOwnProperty('document')
    const isAnimation = ronzz.message.hasOwnProperty('animation')
    const isMedia = isImage || isVideo || isAudio || isSticker || isContact || isLocation || isDocument || isAnimation
    const quotedMessage = ronzz.message.reply_to_message || {}
    const isQuotedImage = quotedMessage.hasOwnProperty('photo')
    const isQuotedVideo = quotedMessage.hasOwnProperty('video')
    const isQuotedAudio = quotedMessage.hasOwnProperty('audio')
    const isQuotedSticker = quotedMessage.hasOwnProperty('sticker')
    const isQuotedContact = quotedMessage.hasOwnProperty('contact')
    const isQuotedLocation = quotedMessage.hasOwnProperty('location')
    const isQuotedDocument = quotedMessage.hasOwnProperty('document')
    const isQuotedAnimation = quotedMessage.hasOwnProperty('animation')
    const isQuoted = ronzz.message.hasOwnProperty('reply_to_message')

    if (user_id.length >= 8 && !db.data.user.includes(user_id)) db.data.user.push(user_id)
    if (isGroup && !db.data.chat[from]) db.data.chat[from] = {
      welcome: false,
      goodbye: false,
      sDone: "",
      sProses: ""
    }

    const reply = async (text) => {
      for (var x of simple.range(0, text.length, 4096)) {
        return await ronzz.replyWithMarkdown(text.substr(x, 4096), {
          disable_web_page_preview: true
        })
      }
    }

    function digit() {
      const characters = '0123456789';
      const length = 2;
      let haha = '';
      for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        haha += characters[randomIndex];
      }
      return haha;
    }

    const formatp = sizeFormatter({
      std: 'JEDEC',
      decimalPlaces: 2,
      keepTrailingZeroes: false,
      render: (literal, symbol) => `${literal} ${symbol}B`,
    })

    var typeMessage = body.substr(0, 50).replace(/\n/g, '')
    if (isImage) typeMessage = 'Image'
    else if (isVideo) typeMessage = 'Video'
    else if (isAudio) typeMessage = 'Audio'
    else if (isSticker) typeMessage = 'Sticker'
    else if (isContact) typeMessage = 'Contact'
    else if (isLocation) typeMessage = 'Location'
    else if (isDocument) typeMessage = 'Document'
    else if (isAnimation) typeMessage = 'Animation'

    function toRupiah(angka) {
      var saldo = '';
      var angkarev = angka.toString().split('').reverse().join('');
      for (var i = 0; i < angkarev.length; i++)
        if (i % 3 == 0) saldo += angkarev.substr(i, 3) + '.';
      return '' + saldo.split('', saldo.length - 1).reverse().join('');
    }
    
    if (isAlreadyResponList(body.toLowerCase())) {
      let get_data_respon = getDataResponList(body.toLowerCase())
      if (get_data_respon.isImage === false) {
        reply(get_data_respon.response)
      } else {
        await ronzz.replyWithPhoto({
          url: get_data_respon.image_url
        }, {
          caption: get_data_respon.response,
          parse_mode: "MARKDOWN",
          disable_web_page_preview: true
        })
      }
    }

    if (isAlreadyResponTesti(body.toLowerCase())) {
      let get_data_respon = getDataResponTesti(body.toLowerCase())
      await ronzz.replyWithPhoto({
        url: get_data_respon.image_url
      }, {
        caption: get_data_respon.response,
        parse_mode: "MARKDOWN",
        disable_web_page_preview: true
      })
    }

    if (ronzz.message) console.log('->[\x1b[1;32mCMD\x1b[1;37m]', chalk.yellow(moment.tz('Asia/Jakarta').format('DD-MM-YYYY HH:mm:ss')), chalk.green(`${prefix + command.split("@")[1] ? command.split("@")[0] : command} [${args.length}]`), 'from', chalk.green(pushname), isGroup ? 'in ' + chalk.green(groupName) : '')

    switch (command) {
      case "tes": case 'runtime': {
        reply(`*STATUS: BOT ONLINE*\n_Runtime: ${simple.runtime(process.uptime())}_`)
      }
        break

      case 'ping': {
        let timestamp = speed()
        let latensi = speed() - timestamp
        reply(`Kecepatan respon ${latensi.toFixed(4)} 𝘚𝘦𝘤𝘰𝘯𝘥\n\n💻 *INFO SERVER*\nHostname: ${os.hostname}\nRAM: ${formatp(os.totalmem() - os.freemem())} / ${formatp(os.totalmem())}\nCPUs: ${os.cpus().length} Core`)
      }
        break

      case 'owner': {
        await ronzz.sendContact(OWNER_NUMBER, OWNER_NAME)
        reply(`My owner [${OWNER_NAME}](${OWNER[0]}) 👑`)
      }
        break

      case 'creator': {
        await ronzz.sendContact("9191919", "KibilJoe")
        reply(`My creator [KibilJoe](https://t.me/kibiljoe) 👑`)
      }
        break

      case 'sc':
      case 'script':
      case 'scrip': {
        ronzz.reply("*SCRIPT NO ENC*\nMau beli scriptnya?\n\n*Harga* 💰\nRp40.000 (60k)\nHarga terlalu mahal?\nNego tipis aja\n\n*Payment* 💳\n_Qris / Dana_\n\nSudah termasuk tutorial.\nKalau error difixs.\nPasti dapet update dari *KibilJoe.*\nSize script ringan.\nAnti ngelag/delay.\n\n*Contact Person* 📞", {
          parse_mode: "MARKDOWN",
          disable_web_page_preview: true,
          reply_markup: {
            inline_keyboard: [
              [{
                text: 'WhatsApp',
                url: "https://wa.me/91919191"
              }, {
                text: 'Telegram',
                url: "https://t.me/kibiljoe"
              }]
            ]
          }
        })
      }
        break

      case "menu": {
        let button = [[{ text: '💰 ORDER MENU', callback_data: 'ordercmd ' + user_id }, { text: 'STORE MENU 🛍️', callback_data: 'storecmd ' + user_id }], [{ text: '📒 INFO BOT', callback_data: 'infocmd ' + user_id }, { text: 'OWNER MENU 🧒🏻', callback_data: 'ownercmd ' + user_id }]]
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

      case 'stok': {
        if (Object.keys(db.data.produk).length == 0) return reply("Belum ada produk di database")

        let teks = `*╭────〔 PRODUCT LIST📦 〕─* 
*┊・* Cara membeli produk ketik perintah berikut
*┊・* /buy kodeproduk jumlah
*┊・* Contoh: /buy netflix 2
*┊・* Pastikan kode dan jumlah akun sudah benar
*┊・* Kontak Admin: [@${OWNER_NAME}](${OWNER[0]})
*╰┈┈┈┈┈┈┈┈*\n\n`

        Object.keys(db.data.produk).forEach(i => {
          teks += `*╭──〔 ${db.data.produk[i].name} 〕─*
*┊・ 🔐| Kode:* ${db.data.produk[i].id}
*┊・ 🏷️| Harga:* Rp${toRupiah(db.data.produk[i].price)}
*┊・ 📦| Stok Tersedia:* ${db.data.produk[i].stok.length}
*┊・ 🧾| Stok Terjual:* ${db.data.produk[i].terjual}
*┊・ 📝| Desk:* ${db.data.produk[i].desc}
*┊・ ✍️| Ketik:* /buy ${db.data.produk[i].id} 1
*╰┈┈┈┈┈┈┈┈*\n\n`
        })

        reply(teks)
      }
        break

      case 'addproduk': {
        if (!isOwner) return reply(mess.owner)
        let data = q.split("|")
        if (!data[5]) return reply(`Contoh:\n/${command} id|namaproduk|deskripsi|snk|harga|profit`)
        if (db.data.produk[data[0]]) return reply(`Produk dengan ID ${data[0]} sudah ada di database`)

        db.data.produk[data[0]] = {
          id: data[0],
          name: data[1],
          desc: data[2],
          snk: data[3],
          price: data[4],
          profit: data[5],
          terjual: 0,
          stok: []
        }

        reply(`Berhasil menambahkan produk *${data[1]}*`)
      }
        break

      case 'delproduk': {
        if (!isOwner) return reply(mess.owner)
        if (!q) return reply(`Contoh: /${command} idproduk`)
        if (!db.data.produk[q]) return reply(`Produk dengan ID *${q}* tidak ada di database`)

        delete db.data.produk[q]

        reply(`Berhasil delete produk *${q}*`)
      }
        break

      case 'setharga': {
        if (!isOwner) return reply(mess.owner)
        let data = q.split("|")
        if (!data[1]) return reply(`Contoh: /${command} idproduk|harga`)
        if (!db.data.produk[data[0]]) return reply(`Produk dengan ID *${data[0]}* tidak ada di database`)

        db.data.produk[data[0]].price = Number(data[1])
        reply(`Berhasil set harga produk dengan ID *${data[0]}* menjadi Rp${toRupiah(Number(data[1]))}`)
      }
        break

      case 'setjudul': {
        if (!isOwner) return reply(mess.owner)
        let data = q.split("|")
        if (!data[1]) return reply(`Contoh: /${command} idproduk|namaproduk`)
        if (!db.data.produk[data[0]]) return reply(`Produk dengan ID *${data[0]}* tidak ada di database`)

        db.data.produk[data[0]].name = data[1]
        reply(`Berhasil set judul produk dengan ID *${data[0]}* menjadi *${data[1]}*`)
      }
        break

      case 'setdesk': {
        if (!isOwner) return reply(mess.owner)
        let data = q.split("|")
        if (!data[1]) return reply(`Contoh: /${command} idproduk|deskripsi`)
        if (!db.data.produk[data[0]]) return reply(`Produk dengan ID *${data[0]}* tidak ada di database`)

        db.data.produk[data[0]].desc = data[1]
        reply(`Berhasil set deskripsi produk dengan ID *${data[0]}*`)
      }
        break

      case 'setsnk': {
        if (!isOwner) return reply(mess.owner)
        let data = q.split("|")
        if (!data[1]) return reply(`Contoh: /${command} idproduk|snk`)
        if (!db.data.produk[data[0]]) return reply(`Produk dengan ID *${data[0]}* tidak ada di database`)

        db.data.produk[data[0]].snk = data[1]
        reply(`Berhasil set SNK produk dengan ID *${data[0]}*`)
      }
        break

      case 'setprofit': {
        if (!isOwner) return reply(mess.owner)
        let data = q.split("|")
        if (!data[1]) return reply(`Contoh: /${command} idproduk|snk`)
        if (!db.data.produk[data[0]]) return reply(`Produk dengan ID *${data[0]}* tidak ada di database`)

        db.data.produk[data[0]].profit = Number(data[1])
        reply(`Berhasil set profit produk dengan ID *${data[0]}*`)
      }
        break

      case 'setkode': {
        if (!isOwner) return reply(mess.owner)
        let data = q.split("|")
        if (!data[1]) return reply(`Contoh: /${command} idlama|idbaru`)
        if (!db.data.produk[data[0]]) return reply(`Produk dengan ID *${data[0]}* tidak ada di database`)

        db.data.produk[data[0]].id = data[1]
        db.data.produk[data[1]] = db.data.produk[data[0]]
        reply(`Berhasil set kode produk dengan ID *${data[0]}* menjadi *${data[1]}*`)
        delete db.data.produk[data[0]]
      }
        break

      case 'addstok': {
        if (!isOwner) return reply(mess.owner)
        let data = q.split(",")
        if (!data[1]) return reply(`Contoh:\n/${command} idproduk,email1@gmail.com|password1|profil1|pin1|2fa1\nemail2@gmail.com|password2|profil2|pin2|2fa2\n\n*NOTE*\nJika tidak ada Profil, Pin, 2FA, kosongkan saja atau dikasih tanda strip (-)`)
        if (!db.data.produk[data[0]]) return reply(`Produk dengan ID *${data[0]}* tidak ada`)

        let dataStok = data[1].split("\n").map(i => i.trim())
        db.data.produk[data[0]].stok.push(...dataStok)

        reply(`Berhasil menambahkan stok sebanyak ${dataStok.length}`)
      }
        break

      case 'delstok': {
        if (!isOwner) return reply(mess.owner)
        if (!q) return reply(`Contoh: /${command} idproduk`)
        if (!db.data.produk[q]) return reply(`Produk dengan ID *${q}* tidak ada`)

        db.data.produk[q].stok = []

        reply(`Berhasil delete stok produk *${q}*`)
      }
        break
      
case 'buy': {
  if (db.data.order[user_id] !== undefined) {
    reply(`Kamu sedang melakukan order, harap tunggu sampai proses selesai. Atau ketik /batal untuk membatalkan pembayaran.`)
    break
  }

  let data = q.split(" ")
  if (!data[1]) {
    reply(`Contoh: /${command} idproduk jumlah`)
    break
  }

  if (!db.data.produk[data[0]]) {
    reply(`Produk dengan ID *${data[0]}* tidak ada di database`)
    break
  }

  let stok = db.data.produk[data[0]].stok
  if (stok.length <= 0) {
    reply("Stok habis, silahkan hubungi Owner untuk restok")
    break
  }

  if (stok.length < data[1]) {
    reply(`Stok tersedia ${stok.length}, jadi harap jumlah tidak melebihi stok`)
    break
  }

  let amount = Number(db.data.produk[data[0]].price) * Number(data[1])
  reply("Sedang membuat transaksi 🕐")

  try {
    let merchantOrderId = "INV-" + Date.now()
    
    // ====================================================================
    // PERBAIKAN 1: Urutan signature untuk membuat transaksi diperbaiki.
    // Urutan yang benar: merchantCode + merchantOrderId + paymentAmount + apiKey
    // ====================================================================
    let rawSignature = DUITKU_MERCHANT_CODE + merchantOrderId + amount + DUITKU_API_KEY
    let signature = crypto.createHash("md5").update(rawSignature).digest("hex")

    // === create transaction ke Duitku ===
    let trx = await axios.post("https://passport.duitku.com/webapi/api/merchant/v2/inquiry", {
      merchantCode: DUITKU_MERCHANT_CODE,
      paymentAmount: amount,
      paymentMethod: "SQ", // metode pembayaran
      merchantOrderId: merchantOrderId,
      productDetails: db.data.produk[data[0]].name,
      customerVaName: pushname,
      email: username + "@telegram.com",
      phoneNumber: "08123456789", // Sebaiknya gunakan nomor asli jika ada
      itemDetails: [
        {
          name: db.data.produk[data[0]].name,
          price: Number(db.data.produk[data[0]].price),
          quantity: Number(data[1])
        }
      ],
      // customerDetail dan shippingAddress bisa dikosongkan jika tidak wajib
      // Namun, jika diisi, pastikan datanya valid
      customerDetail: {
        firstName: pushname,
        lastName: "-",
        email: username + "@telegram.com",
        phoneNumber: "08123456789",
      },
      callbackUrl: "https://eragame.web.id/wejizy/duitku/callback",
      returnUrl: "https://eragame.web.id/wejizy/duitku/return",
      signature: signature,
      expiryPeriod: 10
    }, {
      headers: { "Content-Type": "application/json" }
    })

    let result = trx.data
    if (result.statusCode !== "00") {
      console.log("Duitku Error Response:", result); // Tambahkan log untuk debug
      reply("Gagal membuat transaksi di Duitku: " + result.statusMessage)
      break
    }

    let reference = result.reference
    let checkoutUrl = result.paymentUrl
    let qrString = result.qrString

    // === generate QR Code ===
    let qrPath = `./options/QRIS-${reference}.png`
    await QRCode.toFile(qrPath, qrString, {
      color: { dark: "#000000", light: "#ffffff" },
      width: 400,
    })

    // === kirim ke user ===
    await ronzz.sendPhoto({
      source: qrPath
    }, {
      chat_id: user_id,
      caption: `*🧾 MENUNGGU PEMBAYARAN 🧾*\n\n` +
               `*Produk:* ${db.data.produk[data[0]].name}\n` +
               `*Harga:* Rp${toRupiah(amount)}\n` +
               `*Jumlah:* ${data[1]}\n\n` +
               `📲 Scan QRIS atau tekan tombol di bawah untuk bayar`,
      parse_mode: "MARKDOWN",
      disable_web_page_preview: true,
      reply_markup: {
        inline_keyboard: [
          [
            { text: "Checkout Url", url: checkoutUrl }
          ]
        ]
      }
    })

    db.data.order[user_id] = {
      id: data[0],
      jumlah: data[1],
      chatId: from,
      ref: reference,
      merchantOrderId: merchantOrderId // Simpan merchantOrderId untuk pengecekan status
    }

    fs.unlinkSync(qrPath) 

    // === polling loop cek status ===
    let expired = Date.now() + toMs("10m")
    while (db.data.order[user_id] !== undefined) {
      await simple.sleep(15000)

      if (Date.now() >= expired) {
        reply("Pembayaran dibatalkan karena expired.")
        delete db.data.order[user_id]
        break
      }

      try {
        // ====================================================================
        // PERBAIKAN 2: Gunakan merchantOrderId (yang Anda buat) untuk signature
        // dan payload pengecekan status, BUKAN reference dari Duitku.
        // Urutan yang benar: merchantCode + merchantOrderId + apiKey
        // ====================================================================
        let sigCheck = crypto.createHash("md5")
          .update(DUITKU_MERCHANT_CODE + merchantOrderId + DUITKU_API_KEY)
          .digest("hex")

        let cek = await axios.post("https://passport.duitku.com/webapi/api/merchant/transactionStatus", {
          merchantCode: DUITKU_MERCHANT_CODE,
          merchantOrderId: merchantOrderId, // Gunakan merchantOrderId
          signature: sigCheck
        }, {
          headers: { "Content-Type": "application/json" }
        })

        let status = cek.data.statusCode
        if (status === "00") { // "00" berarti sukses
          reply("Pembayaran berhasil, data akun segera diproses...")

          // === ambil stok ===
          db.data.produk[data[0]].terjual += Number(data[1])
          let dataStok = []
          for (let i = 0; i < data[1]; i++) {
            dataStok.push(db.data.produk[data[0]].stok.shift())
          }

          let reffId = crypto.randomBytes(5).toString("hex").toUpperCase()
          let teks = `Tanggal Transaksi: ${tanggal}\n\n----- ACCOUNT DETAIL -----\n`

          dataStok.forEach(i => {
            let dataAkun = i.split("|")
            teks += `• Email: ${dataAkun[0]}\n• Password: ${dataAkun[1]}\n• Profil: ${dataAkun[2] || "-"}\n• Pin: ${dataAkun[3] || "-"}\n• 2FA: ${dataAkun[4] || "-"}\n\n`
          })

          fs.writeFileSync(`./options/TRX-${reffId}.txt`, teks, "utf8")
          await ronzz.sendDocument({
            source: `./options/TRX-${reffId}.txt`,
            filename: `TRX-${reffId}.txt`
          }, {
            chat_id: user_id,
            caption: `*───「 ACCOUNT DETAIL 」───*\nSilahkan buka file txt yang sudah diberikan`,
            parse_mode: "MARKDOWN",
            disable_web_page_preview: true
          })

          // === 🔔 Tambahkan notifikasi ke admin ===
await ronzz.sendMessage(`Hai Owner,
Ada transaksi berhasil dibayar!

*╭────「 TRANSAKSI DETAIL 」───*
*┊・ 🧾| Reff Id:* ${reffId}
*┊・ 📮| Nomor:* [@${pushname}](https://t.me/${username})
*┊・ 📦| Nama Barang:* ${db.data.produk[data[0]].name}
*┊・ 🏷️️| Harga Barang:* Rp${toRupiah(db.data.produk[data[0]].price)}
*┊・ 🛍️| Jumlah Order:* ${data[1]}
*┊・ 💰| Total Bayar:* Rp${toRupiah(amount)}
*┊・ 📅| Tanggal:* ${tanggal}
*┊・ ⏰| Jam:* ${jamwib} WIB
*╰┈┈┈┈┈┈┈┈*`, {
  chat_id: OWNER_ID,
  parse_mode: "MARKDOWN",
  disable_web_page_preview: true
})

          db.data.transaksi.push({
            id: data[0],
            name: db.data.produk[data[0]].name,
            price: db.data.produk[data[0]].price,
            date: moment.tz("Asia/Jakarta").format("YYYY-MM-DD HH:mm:ss"),
            profit: db.data.produk[data[0]].profit,
            jumlah: Number(data[1])
          })

          fs.unlinkSync(`./options/TRX-${reffId}.txt`)
          delete db.data.order[user_id]
        } else if (status === "01") {
          // Status "01" berarti pending, tidak perlu melakukan apa-apa, loop akan berlanjut.
        } else {
          // Status lainnya (misal: "02" untuk expired)
          reply(`Pembayaran gagal atau dibatalkan. Status: ${cek.data.statusMessage}`)
          delete db.data.order[user_id]
          break
        }
      } catch (err) {
        console.log("Error cek Duitku:", err.message)
      }
    }
  } catch (err) {
    console.log("Error create Duitku:", err.response ? err.response.data : err.message)
    reply("Gagal membuat transaksi di Duitku. Silakan hubungi admin.")
  }
}
break

case 'buypanel': {
    if (isGroup) return reply("Pembelian panel pterodactyl hanya bisa di private chat")
    if (db.data.order[user_id] !== undefined) {
      reply("Masih ada transaksi yang belum diselesaikan, ketik /batal untuk membatalkan transaksi sebelumnya!")
      break
    }

    if (!q) {
      reply(`Pilih RAM Server Panel yang tersedia\n\n` +
        `• Ram 5GB - Rp2.000\nKetik: /buypanel 5gb\n\n` +
        `• Ram 6GB - Rp3.000\nKetik: /buypanel 6gb\n\n` +
        `• Ram 7GB - Rp4.000\nKetik: /buypanel 7gb\n\n` +
        `• Ram 8GB - Rp5.000\nKetik: /buypanel 8gb\n\n` +
        `• Ram 9GB - Rp6.000\nKetik: /buypanel 9gb\n\n` +
        `• Ram Unlimited - Rp7.000\nKetik: /buypanel unlimited\n`)
      break
    }

    let Obj = {}
    let cmd = q.toLowerCase()
    if (cmd == "5gb") Obj = { ram: "5000", disk: "3000", cpu: "120", harga: 2000 }
    else if (cmd == "6gb") Obj = { ram: "6000", disk: "3500", cpu: "140", harga: 3000 }
    else if (cmd == "7gb") Obj = { ram: "7000", disk: "4000", cpu: "160", harga: 4000 }
    else if (cmd == "8gb") Obj = { ram: "8000", disk: "4500", cpu: "180", harga: 5000 }
    else if (cmd == "9gb") Obj = { ram: "9000", disk: "5000", cpu: "200", harga: 6000 }
    else if (cmd == "unli" || cmd == "unlimited") Obj = { ram: "0", disk: "0", cpu: "0", harga: 7000 }
    else {
      reply("Pilihan tidak ada di list!")
      break
    }

    let amount = Obj.harga
    reply("Sedang membuat transaksi 🕐")

    try {
      let merchantOrderId = "PNL-" + Date.now()
      let rawSignature = DUITKU_MERCHANT_CODE + merchantOrderId + amount + DUITKU_API_KEY
      let signature = crypto.createHash("md5").update(rawSignature).digest("hex")

      // === create transaction ke Duitku ===
      let trx = await axios.post("https://passport.duitku.com/webapi/api/merchant/v2/inquiry", {
        merchantCode: DUITKU_MERCHANT_CODE,
        paymentAmount: amount,
        paymentMethod: "SQ", // Metode pembayaran QRIS
        merchantOrderId: merchantOrderId,
        productDetails: `Panel Pterodactyl ${cmd.toUpperCase()}`,
        customerVaName: pushname,
        email: username + "@telegram.com",
        phoneNumber: "08123456789", // Nomor placeholder
        itemDetails: [{
          name: `Panel Pterodactyl ${cmd.toUpperCase()}`,
          price: amount,
          quantity: 1
        }],
        callbackUrl: "https://domainanda.com/callback", // Ganti dengan URL callback Anda
        returnUrl: "https://domainanda.com/return", // Ganti dengan URL return Anda
        signature: signature,
        expiryPeriod: 10 // Waktu expired dalam menit
      }, {
        headers: { "Content-Type": "application/json" }
      })

      let result = trx.data
      if (result.statusCode !== "00") {
        console.log("Duitku Error Response:", result);
        reply("Gagal membuat transaksi di Duitku: " + result.statusMessage)
        break
      }

      let reference = result.reference
      let checkoutUrl = result.paymentUrl
      let qrString = result.qrString

      // === generate QR Code ===
      let qrPath = `./options/QRIS-${reference}.png`
      await QRCode.toFile(qrPath, qrString, {
        color: { dark: "#000000", light: "#ffffff" },
        width: 400,
      })
      
      // === kirim ke user ===
      await ronzz.sendPhoto({
        source: qrPath
      }, {
        chat_id: user_id,
        caption: `*🧾 MENUNGGU PEMBAYARAN 🧾*\n\n` +
                 `*Produk:* Panel Pterodactyl ${cmd.toUpperCase()}\n` +
                 `*Harga:* Rp${toRupiah(amount)}\n\n` +
                 `📲 Scan QRIS atau tekan tombol di bawah untuk bayar\n`+
                 `Batas waktu pembayaran: 10 menit`,
        parse_mode: "MARKDOWN",
        disable_web_page_preview: true,
        reply_markup: {
          inline_keyboard: [
            [
              { text: "Bayar di Website", url: checkoutUrl }
            ]
          ]
        }
      })

      fs.unlinkSync(qrPath) // Hapus file QR setelah dikirim

      db.data.order[user_id] = {
        paket: cmd,
        spec: Obj,
        chatId: from,
        ref: reference,
        merchantOrderId: merchantOrderId // PENTING: simpan untuk cek status
      }

      // === polling loop cek status ===
      let expired = Date.now() + toMs("10m")
      while (db.data.order[user_id] !== undefined) {
        await simple.sleep(15000) // Cek setiap 15 detik

        if (Date.now() >= expired) {
          reply("Pembayaran dibatalkan karena expired.")
          delete db.data.order[user_id]
          break
        }

        try {
          // Signature untuk cek status: merchantCode + merchantOrderId + apiKey
          let sigCheck = crypto.createHash("md5")
            .update(DUITKU_MERCHANT_CODE + merchantOrderId + DUITKU_API_KEY)
            .digest("hex")

          let cek = await axios.post("https://passport.duitku.com/webapi/api/merchant/transactionStatus", {
            merchantCode: DUITKU_MERCHANT_CODE,
            merchantOrderId: merchantOrderId, // Gunakan merchantOrderId yang disimpan
            signature: sigCheck
          }, {
            headers: { "Content-Type": "application/json" }
          })

          let status = cek.data.statusCode
          if (status === "00") { // "00" berarti sukses
            reply("✅ Pembayaran berhasil, sedang membuat akun panel...")

            // === AUTO CREATE PANEL ===
            let uname = crypto.randomBytes(4).toString('hex')
            let email = uname + "@gmail.com"
            let name = uname + " Server"
            let pass = uname + crypto.randomBytes(2).toString('hex')

            // create user
            let ures = await fetch(domain + "/api/application/users", {
              method: "POST",
              headers: { "Accept": "application/json", "Content-Type": "application/json", "Authorization": "Bearer " + apikey },
              body: JSON.stringify({ email: email, username: uname, first_name: name, last_name: "Panel", language: "en", password: pass })
            })
            let ujson = await ures.json()
            if (ujson.errors) {
              reply("❌ Gagal membuat user: " + JSON.stringify(ujson.errors[0]))
              delete db.data.order[user_id]
              break
            }
            let userId = ujson.attributes.id

            // ambil startup egg
            let eggres = await fetch(domain + `/api/application/nests/${nestid}/eggs/${egg}`, {
              method: "GET",
              headers: { "Accept": "application/json", "Content-Type": "application/json", "Authorization": "Bearer " + apikey }
            })
            let eggjson = await eggres.json()

            // create server
            let sres = await fetch(domain + "/api/application/servers", {
              method: "POST",
              headers: { "Accept": "application/json", "Content-Type": "application/json", "Authorization": "Bearer " + apikey },
              body: JSON.stringify({
                name: name, description: "Order via Bot Telegram", user: userId, egg: parseInt(egg),
                docker_image: "ghcr.io/parkervcp/yolks:nodejs_18", startup: eggjson.attributes.startup,
                environment: { INST: "npm", USER_UPLOAD: "0", AUTO_UPDATE: "0", CMD_RUN: "npm start" },
                limits: { memory: Obj.ram, swap: 0, disk: Obj.disk, io: 500, cpu: Obj.cpu },
                feature_limits: { databases: 5, backups: 5, allocations: 5 },
                deploy: { locations: [parseInt(loc)], dedicated_ip: false, port_range: [] }
              })
            })
            let sjson = await sres.json()
            if (sjson.errors) {
              reply("❌ Gagal membuat server: " + JSON.stringify(sjson.errors[0]))
              delete db.data.order[user_id]
              break
            }
            let server = sjson.attributes

            // kirim data akun
            let panelText = `*DATA AKUN PANEL KAMU 📦*\n\n` +
              `*👤 Username:* ${uname}\n` +
              `*🔐 Password:* ${pass}\n` +
              `*📡 ID Server:* ${server.id}\n` +
              `*💾 Ram:* ${Obj.ram == "0" ? "Unlimited" : Obj.ram + "MB"}\n` +
              `*💿 Disk:* ${Obj.disk == "0" ? "Unlimited" : Obj.disk + "MB"}\n` +
              `*⚙️ CPU:* ${Obj.cpu == "0" ? "Unlimited" : Obj.cpu + "%"}\n` +
              `🌐 ${global.domain}\n\n` +
              `Expired: 1 bulan\nGaransi: 20 hari (3x replace)`

            fs.writeFileSync("./akunpanel.txt", panelText)
            await ronzz.sendDocument({
              source: "./akunpanel.txt",
              filename: "akunpanel.txt"
            }, {
              chat_id: user_id,
              caption: panelText,
              parse_mode: "MARKDOWN"
            })
            fs.unlinkSync("./akunpanel.txt")

          // ======================================================= //
            // === 🔔 BAGIAN NOTIFIKASI BARU UNTUK ADMIN/OWNER ===
            // ======================================================= //
            let reffId = "PNL-" + crypto.randomBytes(4).toString("hex").toUpperCase();
            await ronzz.sendMessage(`Hai Owner,
Ada orderan Panel Pterodactyl baru!

*╭────「 TRANSAKSI DETAIL 」───*
*┊・ 🧾| Reff Id:* ${reffId}
*┊・ 👤| Pembeli:* [@${pushname}](https://t.me/${username})
*┊・ 📦| Produk:* Panel Pterodactyl
*┊・ ⚙️| Varian:* ${cmd.toUpperCase()}
*┊・ 💰| Total Bayar:* Rp${toRupiah(amount)}
*┊・ 📅| Tanggal:* ${tanggal}
*┊・ ⏰| Jam:* ${jamwib} WIB
*╰┈┈┈┈┈┈┈┈*`, {
              chat_id: OWNER_ID, // Pastikan variabel OWNER_ID sudah didefinisikan
              parse_mode: "MARKDOWN",
              disable_web_page_preview: true
            })
            // ======================================================= //
            
            delete db.data.order[user_id]
            break; // Keluar dari loop setelah sukses
            
          } else if (status === "01") {
            // Status "01" berarti pending, tidak perlu melakukan apa-apa, loop akan berlanjut.
          } else {
            // Status lainnya (misal: "02" untuk expired/gagal)
            reply(`Pembayaran gagal atau dibatalkan. Status: ${cek.data.statusMessage}`)
            delete db.data.order[user_id]
            break
          }
        } catch (err) {
          console.log("Error saat cek status Duitku:", err.message)
        }
      }
    } catch (err) {
      console.log("Error saat membuat transaksi Duitku:", err.response ? err.response.data : err.message)
      reply("Gagal membuat transaksi di Duitku. Silakan hubungi admin.")
    }
  }
  break

      case 'batal': {
        if (db.data.order[user_id] == undefined) return

        await ronzz.deleteMessage(db.data.order[user_id].messageId)
        reply("Berhasil membatalkan pembayaran")
        delete db.data.order[user_id]
      }
        break

      case 'rekap': {
        if (!isOwner) return reply(mess.owner)
        ronzz.reply(`Hai Owner\nIngin melihat rekap transaksi? Silahkan pilih jenis rekap di bawah ini`, {
          parse_mode: "MARKDOWN",
          disable_web_page_preview: true,
          reply_markup: {
            inline_keyboard: [
              [{
                text: 'Rekap Mingguan',
                callback_data: 'rekapminggu ' + user.id.toString()
              }, {
                text: 'Rekap Bulanan',
                callback_data: 'rekapbulan ' + user.id.toString()
              }]
            ]
          }
        })
      }
        break

      case 'kalkulator': {
        if (!q.split(" ")[1]) return reply(`Contoh: /${command} 5 7`)
        if (!q.split(" ")[2]) return ronzz.reply("Silahkan pilih kalkulator dibawah", {
          reply_markup: {
            inline_keyboard: [
              [{
                text: '+',
                callback_data: 'tambah ' + user.id.toString() + ` ${q.split(" ")[0]} ${q.split(" ")[1]}`
              }, {
                text: '-',
                callback_data: 'kurang ' + user.id.toString() + ` ${q.split(" ")[0]} ${q.split(" ")[1]}`
              }], [{
                text: '÷',
                callback_data: 'bagi ' + user.id.toString() + ` ${q.split(" ")[0]} ${q.split(" ")[1]}`
              }, {
                text: '×',
                callback_data: 'kali ' + user.id.toString() + ` ${q.split(" ")[0]} ${q.split(" ")[1]}`
              }]
            ]
          }
        })
      }
        break

      case 'setdone':
        if (!isGroup) return reply(mess.group)
        if (!isOwner) return reply(mess.owner)
        if (db.data.chat[from].sDone.length !== 0) return reply(`Set done sudah ada di group ini.`)
        if (!q) return reply(`Gunakan dengan cara /${command} teks\n\nList function:\n@tag : untuk tag orang\n@tanggal\n@jam\n@status`)
        db.data.chat[from].sDone = q
        reply(`Sukses set done`)
        break

      case 'deldone':
        if (!isGroup) return reply(mess.group)
        if (!isOwner) return reply(mess.owner)
        if (db.data.chat[from].sDone.length == 0) return reply(`Belum ada set done di sini.`)
        db.data.chat[from].sDone = ""
        reply(`Sukses delete set done`)
        break

      case 'changedone':
        if (!isGroup) return reply(mess.group)
        if (!isOwner) return reply(mess.owner)
        if (!q) return reply(`Gunakan dengan cara /${command} teks\n\nList function:\n@tag : untuk tag orang\n@tanggal\n@jam\n@status`)
        db.data.chat[from].sDone = q
        reply(`Sukses mengganti teks set done`)
        break

      case 'setproses':
        if (!isGroup) return reply(mess.group)
        if (!isOwner) return reply(mess.owner)
        if (db.data.chat[from].sProses.length !== 0) return reply(`Set proses sudah ada di group ini.`)
        if (!q) return reply(`Gunakan dengan cara /${command} teks\n\nList function:\n@tag : untuk tag orang\n@tanggal\n@jam\n@status`)
        db.data.chat[from].sProses = q
        reply(`Sukses set proses`)
        break

      case 'delproses':
        if (!isGroup) return reply(mess.group)
        if (!isOwner) return reply(mess.owner)
        if (db.data.chat[from].sProses.length == 0) return reply(`Belum ada set proses di sini.`)
        db.data.chat[from].sProses = ""
        reply(`Sukses delete set proses`)
        break

      case 'changeproses':
        if (!isGroup) return reply(mess.group)
        if (!isOwner) return reply(mess.owner)
        if (!q) return reply(`Gunakan dengan cara /${command} teks\n\nList function:\n@tag : untuk tag orang\n@tanggal\n@jam\n@status`)
        db.data.chat[from].sProses = q
        reply(`Sukses ganti teks set proses`)
        break

      case 'done': {
        if (!isGroup) return reply(mess.group)
        if (!isOwner) return reply(mess.owner)
        if (isQuoted) {
          if (db.data.chat[from].sDone.length !== 0) {
            let textDone = db.data.chat[from].sDone
            reply(textDone.replace('tag', `[@${pushname}](https://t.me/${username})`).replace('@jam', jamwib).replace('@tanggal', tanggal).replace('@status', 'Berhasil'))
          } else {
            reply(`「 *TRANSAKSI BERHASIL* 」\n\n📆 TANGGAL : ${tanggal}\n⌚ JAM : ${jamwib}\n✨ STATUS: Berhasil\n\nTerimakasih [@${pushname}](https://t.me/${username}) next order yaa🙏`)
          }
        } else {
          reply('Reply orangnya')
        }
      }
        break

      case 'proses':
        if (!isGroup) return (mess.group)
        if (!isGroupAdmins && !isOwner) return (mess.admin)
        if (isQuotedMsg) {
          if (db.data.chat[from].sProses.length !== 0) {
            let textProses = db.data.chat[from].sProses
            reply(textProses.replace('tag', `[@${pushname}](https://t.me/${username})`).replace('@jam', jamwib).replace('@tanggal', tanggal).replace('@status', 'Pending'))
          } else {
            reply(`「 *TRANSAKSI PENDING* 」\n\n📆 TANGGAL : ${tanggal}\n⌚ JAM : ${jamwib}\n✨ STATUS: Pending\n\nPesanan [@${pushname}](https://t.me/${username}) sedang diproses🙏`)
          }
        } else {
          reply('Reply orangnya')
        }
        break
        
      case 'list': {
        if (db.data.list.length == 0) return reply(`Belum ada list message di database`)
        let teks = `Hai [@${pushname}](https://t.me/${username})\nBerikut list Owner saya\n\n*╭────「 LIST RESPON 」───*\n`
        for (let x of db.data.list) {
          teks += `*┊ 🛍️ ${x.key}*\n`
        }
        teks += `*╰┈┈┈┈┈┈┈┈*`
        reply(teks)
      }
        break
        
      case 'addlist': {
        if (!isOwner) return reply(mess.owner)
        if (!q.includes("@")) return reply(`Gunakan dengan cara /${command} key@response\n\n_Contoh_\n\n/${command} test@apa`)
        if (isAlreadyResponList(q.split("@")[0])) return reply(`List respon dengan key *${q.split("@")[0]}* sudah ada.`)
        if (isImage || isQuotedImage) {
          let media = await ronzz.download()
          addResponList(q.split("@")[0], q.split("@")[1], true, media)
          reply(`Berhasil menambah list respon *${q.split("@")[0]}*`)
        } else {
          addResponList(q.split("@")[0], q.split("@")[1], false, '-')
          reply(`Berhasil menambah list respon *${q.split("@")[0]}*`)
        }
      }
        break
        
      case 'dellist': {
        if (!isOwner) return reply(mess.owner)
        if (db.data.list.length == 0) return reply(`Belum ada list respon di database`)
        if (!q) return reply(`Gunakan dengan cara /${command} key\n\n_Contoh_\n\n/${command} hello`)
        if (!isAlreadyResponList(q)) return reply(`List respon dengan key *${q}* tidak ada di database!`)
        delResponList(q)
        reply(`Sukses delete list respon dengan key *${q}*`)
      }
        break
        
      case 'setlist': {
        if (!isOwner) return reply(mess.owner)
        if (!q.includes("@")) return reply(`Gunakan dengan cara /${command} key@response\n\n_Contoh_\n\n/${command} test@apa`)
        if (!isAlreadyResponList(q.split("@")[0])) return reply(`List respon dengan key *${q.split("@")[0]}* tidak ada di database.`)
        if (isImage || isQuotedImage) {
          let media = await ronzz.download()
          updateResponList(q.split("@")[0], q.split("@")[1], true, media)
          reply(`Berhasil mengganti list respon *${q.split("@")[0]}*`)
        } else {
          updateResponList(q.split("@")[0], q.split("@")[1], false, '-')
          reply(`Berhasil mengganti list respon *${q.split("@")[0]}*`)
        }
      }
        break

      case 'testi': {
        if (Object.keys(db.data.testi).length === 0) return reply(`Belum ada list testi di database`)
        let teks = `Hai [@${pushname}](https://t.me/${username})\nBerikut list testi Owner saya\n\n*╭────「 LIST TESTI 」───*\n`
        for (let x of db.data.testi) {
          teks += `*┊ 🛍️ ${x.key}*\n`
        }
        teks += `*╰┈┈┈┈┈┈┈┈*`
        reply(teks)
      }
        break

      case 'addtesti': {
        if (!isOwner) return reply(mess.owner)
        if (isImage || isQuotedImage) {
          if (!q.includes("@")) return reply(`Gunakan dengan cara /${command} key@response\n\n_Contoh_\n\n/${command} test@apa`)
          if (isAlreadyResponTesti(q.split("@")[0])) return reply(`List testi dengan key *${q.split("@")[0]}* sudah ada.`)
          let media = await ronzz.download()
          addResponTesti(q.split("@")[0], q.split("@")[1], true, media)
          reply(`Berhasil menambah list testi *${q.split("@")[0]}*`)
        } else {
          reply(`Kirim gambar dengan caption /${command} key@response atau reply gambar yang sudah ada dengan caption /${command} key@response`)
        }
      }
        break

      case 'deltesti': {
        if (!isOwner) return reply(mess.owner)
        if (db.data.testi.length === 0) return reply(`Belum ada list testi di database`)
        if (!q) return reply(`Gunakan dengan cara /${command} key\n\n_Contoh_\n\n/${command} hello`)
        if (!isAlreadyResponTesti(q)) return reply(`List testi dengan key *${q}* tidak ada di database!`)
        delResponTesti(q)
        reply(`Sukses delete list testi dengan key *${q}*`)
      }
        break

      case 'settesti': {
        if (!isOwner) return reply(mess.owner)
        if (!q.includes("@")) return reply(`Gunakan dengan cara /${command} key@response\n\n_Contoh_\n\n/${command} test@apa`)
        if (!isAlreadyResponTesti(q.split("@")[0])) return reply(`List testi dengan key *${q.split("@")[0]}* tidak ada di database.`)
        if (isImage || isQuotedImage) {
          let media = await ronzz.download()
          updateResponTesti(q.split("@")[0], q.split("@")[1], true, media)
          reply(`Berhasil mengganti list testi *${q.split("@")[0]}*`)
        } else {
          reply(`Kirim gambar dengan caption /${command} key@response atau reply gambar yang sudah ada dengan caption /${command} key@response`)
        }
      }
        break
        
      case 'welcome': {
        if (!isGroup) return reply(mess.group)
        if (!isOwner) return reply(mess.owner)
        ronzz.reply(`Hai Owner\nSilahkan pilih fitur Welcome di bawah ini.`, {
          parse_mode: "MARKDOWN",
          disable_web_page_preview: true,
          reply_markup: {
            inline_keyboard: [
              [{
                text: 'Welcome On',
                callback_data: 'welcome ' + user.id.toString() + " on " + from
              }, {
                text: 'Welcome Off',
                callback_data: 'welcome ' + user.id.toString() + " off " + from
              }]
            ]
          }
        })
      }
        break
        
      case 'goodbye': {
        if (!isGroup) return reply(mess.group)
        if (!isOwner) return reply(mess.owner)
        ronzz.reply(`Hai Owner\nSilahkan pilih fitur Good Bye di bawah ini.`, {
          parse_mode: "MARKDOWN",
          disable_web_page_preview: true,
          reply_markup: {
            inline_keyboard: [
              [{
                text: 'Good Bye On',
                callback_data: 'goodbye ' + user.id.toString() + " on " + from
              }, {
                text: 'Good Bye Off',
                callback_data: 'goodbye ' + user.id.toString() + " off " + from
              }]
            ]
          }
        })
      }
        break
        
      case 'backup': {
        if (!isOwner) return reply(mess.owner)
        await reply('Mengumpulkan semua file ke folder...')
        let ls = (await execSync("ls")).toString().split("\n").filter((pe) =>
          pe != "node_modules" &&
          pe != "session" &&
          pe != "package-lock.json" &&
          pe != "yarn.lock" &&
          pe != ".npm" &&
          pe != ".cache" &&
          pe != ""
        )
        await simple.sleep(100)
        if (isGroup) await reply('Script akan dikirim lewat PC!')
        await execSync(`zip -r SC-AUTO-ORDER.zip ${ls.join(" ")}`)
        await ronzz.sendDocument({
          source: "./SC-AUTO-ORDER.zip"
        }, {
          chat_id: OWNER_ID,
          caption: "Sukses backup Script",
          parse_mode: "MARKDOWN",
          disable_web_page_preview: true
        })
        await execSync("rm -rf SC-AUTO-ORDER.zip");
      }
        break
        
      case 'broadcast': case 'bc': {
        if (!isOwner) return reply(mess.owner)
        if (!q) return reply(`Contoh: /${command} teks broadcast`)
        if (isImage) {
          let media = await ronzz.download()
          for (let i of db.data.user) {
            ronzz.sendPhoto({
              url: media
            }, {
              caption: q,
              chat_id: i,
              parse_mode: "MARKDOWN",
              disable_web_page_preview: true
            })
          }
          reply(`Berhasil Broadcast ke ${db.data.user.length} Users`)
        } else {
          for (let i of db.data.user) {
            ronzz.sendMessage(q, {
              chat_id: i,
              parse_mode: "MARKDOWN",
              disable_web_page_preview: true
            })
            await simple.sleep(300)
          }
          reply(`Berhasil Broadcast ke ${db.data.user.length} Users`)
        }
      }
        break

      case 'id': case 'myid': {
        ronzz.reply(user_id)
      }
        break

      default:
        if (budy.startsWith('=>')) {
          if (!isOwner) return
          function Return(sul) {
            sat = JSON.stringify(sul, null, 2)
            bang = util.format(sat)
            if (sat == undefined) {
              bang = util.format(sul)
            }
            return ronzz.reply(bang)
          }
          try {
            ronzz.reply(util.format(eval(`(async () => { ${budy.slice(3)} })()`)))
          } catch (e) {
            ronzz.reply(String(e))
          }
        }
        if (budy.startsWith('>')) {
          if (!isOwner) return
          try {
            let evaled = await eval(budy.slice(2))
            if (typeof evaled !== 'string') evaled = require('util').inspect(evaled)
            await ronzz.reply(evaled)
          } catch (err) {
            ronzz.reply(String(err))
          }
        }
        if (budy.startsWith('$')) {
          if (!isOwner) return
          let qur = budy.slice(2)
          exec(qur, (err, stdout) => {
            if (err) return reply(err)
            if (stdout) {
              ronzz.reply(stdout)
            }
          })
        }
    }
  } catch (e) {
    ronzz.reply(util.format(e))
    console.log('[ ERROR ] ' + e)
  }
}

let time = moment(new Date()).format('HH:mm:ss DD/MM/YYYY')
let file = require.resolve(__filename)
fs.watchFile(file, () => {
  fs.unwatchFile(file)
  console.log(chalk.greenBright(`[ ${BOT_NAME} ]  `) + time + chalk.cyanBright(` "${file}" Telah diupdate!`))
  delete require.cache[file]
  require(file)
})