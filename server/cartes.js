// fait pour tester la recup de carte de mysql (rediger ia)


const express = require('express');
const router = express.Router();

const { pool } = require('./db');

// GET /api/cartes
router.get('/', async (req, res) => {
    try {
        const [cartes] = await pool.query(`
            SELECT
                id,
                nom,
                description,
                pv,
                attaque,
                rarete,
                prix_points,
                image
            FROM cartes
            ORDER BY id ASC
        `);

        res.json({
            success: true,
            nombre: cartes.length,
            cartes: cartes
        });

    } catch (error) {
        console.error('Erreur récupération cartes :', error.message);

        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des cartes.'
        });
    }
});

module.exports = router;
