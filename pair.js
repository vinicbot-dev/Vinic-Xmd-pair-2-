router.get('/', async (req, res) => {
    const id = makeid();
    let num = req.query.number;

    async function CYBERIA_PAIR_CODE() {
        const { state, saveCreds } = await useMultiFileAuthState('./temp/' + id);

        try {
            // 👾 Cyberia Browser Identity
            const agents = ["Ubuntu", "Microsoft"];
            const randomAgent = agents[Math.floor(Math.random() * agents.length)];

            let sock = makeWASocket({
                auth: {
                    creds: state.creds,
                    keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" }).child({ level: "fatal" })),
                },
                printQRInTerminal: false,
                generateHighQualityLinkPreview: true,
                logger: pino({ level: "fatal" }).child({ level: "fatal" }),
                syncFullHistory: false,
                browser: Browsers.macOS(randomAgent)
            });

            // 🧩 If not registered, generate a Cyberia pairing code
            if (!sock.authState.creds.registered) {
                await delay(1500);
                num = num.replace(/[^0-9]/g, '');
                const code = await sock.requestPairingCode(num);
                if (!res.headersSent) {
                    await res.send({ code });
                }
            }

            sock.ev.on('creds.update', saveCreds);

            sock.ev.on("connection.update", async (s) => {
                const { connection, lastDisconnect } = s;

                if (connection == "open") {
                    await delay(5000);
                    let rf = __dirname + `/temp/${id}/creds.json`;
                    let data = fs.readFileSync(rf);

                    // 🧬 Generate futuristic Cyberia session key
                    function generateCyberKey() {
                        const prefix = "CYB";
                        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
                        let key = prefix;
                        for (let i = prefix.length; i < 22; i++) {
                            key += chars.charAt(Math.floor(Math.random() * chars.length));
                        }
                        return key;
                    }

                    const sessionKey = generateCyberKey();

                    try {
                        const { upload } = require('./mega');
                        const mega_url = await upload(fs.createReadStream(rf), `${sock.user.id}.json`);
                        const string_session = mega_url.replace('https://mega.nz/file/', '');
                        let md = "Vinic-Xmd~" + string_session;

                        let code = await sock.sendMessage(sock.user.id, { text: md });

                        // 💬 Cyberia MD Welcome Message
                        let desc = `⚡ *Welcome to Vinic-Xmd, Operator!* ⚡

🧠 *Neural Session Linked:* ${sock.user.id}
🗝️ *Access Key:* Sent above  
🔐 *Keep it encrypted. Keep it yours.*

─────────────
💾 *System Channel:*
https://whatsapp.com/channel/0029Vb7VdNbIXnlhBiFjrt1B

🧬 *Source Framework:*
https://github.com/Kevintech-hub/Vinic-Xmd-

─────────────
> *"Reality is code, and we are the glitch."*
Welcome to the grid, Operator. 💠`;

                        await sock.sendMessage(
                            sock.user.id,
                            {
                                text: desc,
                                contextInfo: {
                                    externalAdReply: {
                                        title: "Vinic-Xmd",
                                        thumbnailUrl: "https://files.catbox.moe/uw1n4n.jpg",
                                        sourceUrl: "wa.me/channel/0029Vb6eR1r05MUgYul6Pc2W",
                                        mediaType: 1,
                                        renderLargerThumbnail: true
                                    }
                                }
                            },
                            { quoted: code }
                        );
                    } catch (e) {
                        // 🔧 Fallback system message if upload fails
                        let ddd = sock.sendMessage(sock.user.id, { text: e.toString() });
                        let desc = `💠 *Vinic-Xmd Link Established*

🗝️ *Session ID:* Sent above  
📛 *Confidential. Do not share.*

─────────────
💾 *Command Hub:*
wa.me/channel/0029Vb6eR1r05MUgYul6Pc2W

🧬 *Source Code:*
https://github.com/Kevintech-hub/Vinic-Xmd-

─────────────
> *"Signal detected in the void... Welcome, Operator."* 🌌`;

                        await sock.sendMessage(
                            sock.user.id,
                            {
                                text: desc,
                                contextInfo: {
                                    externalAdReply: {
                                        title: "Vinic-Xmd",
                                        thumbnailUrl: "https://files.catbox.moe/uw1n4n.jpg",
                                        sourceUrl: "wa.me/channel/0029Vb6eR1r05MUgYul6Pc2W",
                                        mediaType: 2,
                                        renderLargerThumbnail: true,
                                        showAdAttribution: true
                                    }
                                }
                            },
                            { quoted: ddd }
                        );
                    }

                    await delay(10);
                    await sock.ws.close();
                    await removeFile('./temp/' + id);
                    console.log(`💠 ${sock.user.id} has entered Vinic-Xmd...`);
                    await delay(10);
                    process.exit();
                } 
                else if (connection === "close" && lastDisconnect && lastDisconnect.error && lastDisconnect.error.output.statusCode != 401) {
                    await delay(10);
                    CYBERIA_PAIR_CODE();
                }
            });
        } catch (err) {
            console.log("⚠️ CYBERIA protocol crashed. Reinitializing...");
            await removeFile('./temp/' + id);
            if (!res.headersSent) {
                await res.send({ code: "❗ CyberNet Offline" });
            }
        }
    }

    return await CYBERIA_PAIR_CODE();
});
