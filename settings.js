const fs = require('fs'); 
const path = require('path');
const chalk = require('chalk'); // Corrección aquí
const { en, es, ar, id, pt, rs } = require('./libs/idiomas/total-idiomas.js'); 

global.owner = [
    ["51997384622", "*CEO*", true],
    ["51994698733", "Owner"], 
    ["56920071198", "Owner"],
    ["584124128141", "Owner"], 
    ["5493777599874", "Staff"], 
    ["573006199506", "Staff"],
    [""], 
    [""], 
    [""]
];

global.mods = [];
global.premium = [];  
global.blockList = [];  

global.botname = "";
global.vs = '1.0.0';

// Función beta: escribe el número que quiere que sea bot para que mande el Código de 8 dígitos
global.botNumberCode = ""; // Ejemplo: +59309090909
global.phoneNumber = "";

// ---------[ FECHA/IDIOMAS ]---------
global.place = 'America/Bogota'; // Aquí puedes encontrar tu ubicación https://momentjs.com/timezone/
global.lenguaje = es; // Predeterminado en idioma Español 
global.prefix = [`*`];

// ---------[ APIS GLOBAL ]---------
global.keysZens = ['LuOlangNgentot', 'c2459db922', '37CC845916', '6fb0eff124', 'hdiiofficial', 'fiktod', 'BF39D349845E', '675e34de8a', '0b917b905e6f']; 
global.keysxxx = keysZens[Math.floor(keysZens.length * Math.random())]; 
global.keysxteammm = ['29d4b59a4aa687ca', '5LTV57azwaid7dXfz5fzJu', 'cb15ed422c71a2fb', '5bd33b276d41d6b4', 'HIRO', 'kurrxd09', 'ebb6251cc00f9c63']; 
global.keysxteam = keysxteammm[Math.floor(keysxteammm.length * Math.random())]; 
global.keysneoxrrr = ['5VC9rvNx', 'cfALv5']; 
global.keysneoxr = keysneoxrrr[Math.floor(keysneoxrrr.length * Math.random())]; 
global.lolkeysapi = ['GataDios']; // ['BrunoSobrino_2'] 
global.itsrose = ['4b146102c4d500809da9d1ff'];

global.API = (name, path = '/', query = {}, apikeyqueryname) => (name in global.APIs ? global.APIs[name] : name) + path + (query || apikeyqueryname ? '?' + new URLSearchParams(Object.entries({...query, ...(apikeyqueryname ? {[apikeyqueryname]: global.APIKeys[name in global.APIs ? global.APIs[name] : name]} : {})})) : '');

global.APIs = {
    //ApiEmpire: 'https://',
    CFROSAPI: 'https://api.cafirexos.com',
    nrtm: 'https://fg-nrtm.ddns.net',
    fgmods: 'https://api.fgmods.xyz', 
    xteam: 'https://api.xteam.xyz',
    dzx: 'https://api.dhamzxploit.my.id',
    lol: 'https://api.lolhuman.xyz',
    neoxr: 'https://api.neoxr.my.id',
    zenzapis: 'https://api.zahwazein.xyz',
    akuari: 'https://api.akuari.my.id',
    akuari2: 'https://apimu.my.id',
    botcahx: 'https://api.botcahx.biz.id',
    ibeng: 'https://api.ibeng.tech/docs',
    rose: 'https://api.itsrose.site',
    popcat: 'https://api.popcat.xyz',
    xcoders: 'https://api-xcoders.site',
    vihangayt: 'https://vihangayt.me',
    erdwpe: 'https://api.erdwpe.com',
    xyroinee: 'https://api.xyroinee.xyz',
    nekobot: 'https://nekobot.xyz'
};

global.APIKeys = {
    'https://api.xteam.xyz': `${keysxteam}`,
    'https://api.lolhuman.xyz': 'GataDios',
    'https://api.neoxr.my.id': `${keysneoxr}`,
    'https://api.zahwazein.xyz': `${keysxxx}`,
    'https://api.fgmods.xyz': 'DRLg5kY7', 
    'https://api-fgmods.ddns.net': 'fg-dylux',
    'https://api.botcahx.biz.id': 'Admin',
    'https://api.ibeng.tech/docs': 'tamvan',
    'https://api.itsrose.site': 'Rs-Zeltoria',
    'https://api-xcoders.site': 'Frieren',
    'https://api.xyroinee.xyz': 'uwgflzFEh6'
};

// ---------[ STICKERS ]---------
global.packname = "ShopBot-MD";
global.author = `${vs}`;

// Almacéna imagen url o el carpeta:
// global.imagen1 = fs.readFileSync('./[Direcion donde se encuentra la imagen]')
global.imagen1 = 'https://qu.ax/TPhh.jpg';

// Enlace | cuentas oficiales
global.md = 'https://github.com/Edwardofc/ShopBot-MD';
global.yt = 'https://www.youtube.com/@EdwardOfc';
global.fb = 'https://www.facebook.com/AtroOficia';
global.faceb = '';
global.paypal = 'https://paypal.me/'; 
global.panel = '';
global.dash = '';

global.host = 'https://chat.whatsapp.com/JbQKdleiAVW3F7V7ZkdbHl'; // Grupo ofc
global.nna = '';
global.nn = '';


// ---------[ INFO ]--------- 
global.info = { 
  wait:  '█▒▒▒▒▒▒▒▒▒10%', 
  waitt:  '████▒▒▒▒▒▒30%', 
  waittt:  '█████▒▒▒▒▒50%', 
  waitttt:  '████████▒▒80%', 
  waittttt:  '██████████100%', 
  result: `${lenguaje['exito']()}`,  
  admin: `${lenguaje['admin']()}`, 
  botAdmin: `${lenguaje['botAdmin']()}`, 
  owner: `${lenguaje['propietario']()}`, 
  group: `${lenguaje['group']()}`, 
  private: `${lenguaje['private']()}`, 
  bot: `${lenguaje['bot']()}`, 
  error: `${lenguaje['error']()}`, 
  registra: `${lenguaje['registra']()}`, 
  limit: `${lenguaje['limit']()}`, 
  endLimit: `${lenguaje['endLimit']()}`
};

let file = require.resolve(__filename); // Obtener la ruta completa del archivo 

fs.watchFile(file, () => { // Observar cambios en el archivo
    fs.unwatchFile(file);
    const fileName = path.basename(file); // Nombre del archivo 
    console.log(chalk.greenBright.bold(`Archivo '${fileName}' actualizado.`)); // Imprimir mensaje en consola
    delete require.cache[file]; // Eliminar la caché para permitir la actualización de cambios
    require(file); // Volvemos a cargar el archivo con los nuevos cambios
});