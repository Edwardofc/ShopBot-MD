(async () => {
    await import("./settings.js"); // Cambiar a importación ES
    
    const { default: makeWASocket, CONNECTING, PHONENUMBER_MCC, makeInMemoryStore, useMultiFileAuthState, fetchLatestBaileysVersion } = await import("@whiskeysockets/baileys");
    const { state, saveCreds } = await useMultiFileAuthState('./sessions');
    
    const chalk = await import('chalk'); // Cambiar a importación ES
    const moment = await import('moment'); // Cambiar a importación ES
    const fs = await import('fs'); // Cambiar a importación ES
    const yargs = (await import('yargs/yargs')).default; // Cambiar a importación ES
    const { smsg, sleep, getBuffer } = await import('./libs/fuctions.js'); // Cambiar a importación ES
    const _ = await import('lodash'); // Cambiar a importación ES
    const NodeCache = await import('node-cache'); // Cambiar a importación ES
    const readline = await import("readline"); // Cambiar a importación ES
    
    // Función para dar color a los textos
    const color = (text, color) => {
        return !color ? chalk.green(text) : color.startsWith('#') ? chalk.hex(color)(text) : chalk.keyword(color)(text);
    };

    // Base de datos
    let low;
    try {
        low = await import('lowdb'); // Cambiar a importación ES
    } catch (e) {
        low = await import('./libs/database/lowbd.js'); // Cambiar a importación ES
    }

    const { Low, JSONFile } = low;
    
    global.opts = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse());
    
    global.db = new Low(
        /https?:\/\//.test(opts['db'] || '') ?
        new cloudDBAdapter(opts['db']) : /mongodb/.test(opts['db']) ?
        new mongoDB(opts['db']) :
        new JSONFile(`./database.json`)
    );

    global.DATABASE = global.db; // Compatibilidad hacia atrás

    global.loadDatabase = async function loadDatabase() {
        if (global.db.READ) return new Promise((resolve) => setInterval(function () { 
            (!global.db.READ ? (clearInterval(this), resolve(global.db.data == null ? global.loadDatabase() : global.db.data)) : null);
        }, 1 * 1000));
        
        if (global.db.data !== null) return;

        global.db.READ = true;
        await global.db.read();
        global.db.READ = false;
        
        global.db.data = {
            users: {},
            chats: {},
            game: {},
            database: {},
            settings: {},
            setting: {},
            others: {},
            sticker: {},
            ...(global.db.data || {})
        };
        
        global.db.chain = _.chain(global.db.data);
    };

    loadDatabase(); //@aidenlogin

    if (global.db) setInterval(async () => {
        if (global.db.data) await global.db.write();
    }, 30 * 1000);

    // Configuración
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    
    const question = (text) => new Promise((resolve) => rl.question(text, resolve));
    
    let { version } = await fetchLatestBaileysVersion();
    
    let opcion;
    
    if (!fs.existsSync(`./sessions/creds.json`)) {
        do {
            opcion = await question(`Seleccione una opción:\n1. Escanear QR\n2. Ingresar número\n---> `);
            if (!/^[1-2]$/.test(opcion)) {
                console.log(chalk.bold.redBright("Opción no válida. Inténtalo de nuevo."));
            }
        } while (opcion !== '1' && opcion !== '2');
    }

    // Función principal del bot
    async function startBot() {
        console.info = () => {};
        
        const store = makeInMemoryStore({ logger: pino().child({ level: "silent", stream: "store" }) });
        
        const socketSettings = {
            printQRInTerminal: opcion == '1',
            logger: pino({ level: 'silent' }),
            auth: { creds: state.creds },
            mobile: process.argv.includes("--mobile"),
            browser: ['ShopBot-MD', 'Safari', '1.0.0'],
            msgRetryCounterCache: new NodeCache(),
            version,
            syncFullHistory: true,
            getMessage: async (key) => {
                if (store) { 
                    return store.loadMessage(key.remoteJid, key.id);
                }
                return proto.Message.fromObject({});
            }
        };

        const sock = makeWASocket(socketSettings);

        if (!fs.existsSync(`./sessions/creds.json`)) {
            if (opcion === '2') {
                let addNumber;
                while (true) {
                    addNumber = await question("Ingrese su número de teléfono:\n");
                    addNumber = addNumber.replace(/[^0-9]/g, '');
                    if (addNumber.match(/^\d+$/) && Object.keys(PHONENUMBER_MCC).some(v => addNumber.startsWith(v))) {
                        break;
                    } else {
                        console.log(chalk.bold.redBright("Número no válido. Inténtalo de nuevo."));
                    }
                }
                rl.close();

                setTimeout(async () => {
                    let codeBot = await sock.requestPairingCode(addNumber);
                    codeBot = codeBot?.match(/.{1,4}/g)?.join("-") || codeBot;
                    console.log(chalk.bold.white(`Código de emparejamiento: ${codeBot}`));
                }, 2000);
            }
        }

        // Manejo de eventos
        sock.ev.on('connection.update', async (update) => {
            const { connection, lastDisconnect } = update;

            if (connection === "close" && lastDisconnect && lastDisconnect.error && lastDisconnect.error.output.statusCode != 401) {
                console.log(color('[SYS]', '#009FFF'), color(moment().format('DD/MM/YY HH:mm:ss'), '#A1FFCE'), color("Conexión cerrada.", '#f64f59'));
                startBot();
            } else if (connection === "open") {
                console.log(color(`Conectado como ${sock.user.id}`, 'yellow'));
            }
        });

        sock.public = true;
        store.bind(sock.ev);
        
        sock.ev.on('creds.update', saveCreds);
        
        process.on('uncaughtException', console.log);
        process.on('unhandledRejection', console.log);
        process.on('ReferenceError', console.log);
    }

   startBot();
})();