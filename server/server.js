
const path = require('path');

// Charger les variables d'environnement
require('dotenv').config({
    path: path.join(__dirname, '..', '.env')
});

// Importer les modules
const express = require('express');
const { pool, testerConnexion } = require('./db');

// Initialiser Express
const app = express();

// Définir le port
const PORT = process.env.PORT || 3000;

// Lire les requêtes JSON
app.use(express.json());

// Afficher les fichiers du dossier public
app.use(express.static(path.join(__dirname, '..', 'public')));

// ROUTE 1 : Vérifier le serveur
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'Le serveur fonctionne correctement !'
    });
});

// ROUTE 2 : Tester la connexion MySQL
app.get('/api/db-test', async (req, res) => {
    try {
        await pool.query('SELECT 1');

        res.json({
            success: true,
            message: 'Connexion à MySQL réussie !'
        });

    } catch (error) {
        console.error('Erreur MySQL :', error.message);

        res.status(503).json({
            success: false,
            message: 'Impossible de communiquer avec la base de données.'
        });
    }
});

// Démarrer le serveur
async function demarrerServeur() {
    try {
        await testerConnexion();

        await pool.query('SELECT 1');

        app.listen(PORT, () => {
            console.log(`Serveur démarré sur http://localhost:${PORT}`);
            console.log('MySQL est connecté !');
        });

    } catch (error) {
        console.error('Impossible de démarrer le serveur :', error.message);
        await pool.end();
        process.exit(1);
    }
}

demarrerServeur();

// Rédiger ia 