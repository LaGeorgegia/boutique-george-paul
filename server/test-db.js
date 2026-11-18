
const { testerConnexion, pool } = require('./db');

async function main() {
    await testerConnexion();
    await pool.end();
}

main();

// fichier crée pour verifie le fonctionnement de la connexion du serveur Node  à ma base sql