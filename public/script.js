// 1. Le joueur commence avec 150 points.
let points = 150;

// 2. On recupere les trois ecrans.
const connexion = document.getElementById("connexion");
const inscription = document.getElementById("inscription");
const boutique = document.getElementById("boutique");

// 3. On recupere le compte enregistre dans le navigateur.
let compte = localStorage.getItem("compteBoutique");

if (compte !== null) {
    compte = JSON.parse(compte);
} else {
    compte = null;
}

// Au depart, la connexion est visible.
connexion.hidden = false;
inscription.hidden = true;
boutique.hidden = true;

// 4. Le bouton "Creer un compte" ouvre l'inscription.
document.getElementById("bouton-creer-compte").addEventListener("click", function() {
    connexion.hidden = true;
    inscription.hidden = false;
    document.getElementById("message-inscription").textContent = "";
});

// 5. Le bouton "Retour" revient a la connexion.
document.getElementById("bouton-retour").addEventListener("click", function() {
    inscription.hidden = true;
    connexion.hidden = false;
});

// 6. Quand le formulaire d'inscription est envoye.
document.getElementById("formulaire-inscription").addEventListener("submit", function(event) {
    event.preventDefault();

    const identifiant = document.getElementById("nouvel-identifiant").value.trim();
    const motDePasse = document.getElementById("nouveau-mot-de-passe").value;
    const confirmation = document.getElementById("confirmation-mot-de-passe").value;

    // On verifie que les deux mots de passe sont identiques.
    if (motDePasse !== confirmation) {
        document.getElementById("message-inscription").textContent = "Les mots de passe ne sont pas identiques.";
        return;
    }

    // On enregistre le nouveau compte.
    compte = {
        identifiant: identifiant,
        motDePasse: motDePasse
    };

    localStorage.setItem("compteBoutique", JSON.stringify(compte));

    // Apres l'inscription, on revient a la connexion.
    document.getElementById("formulaire-inscription").reset();
    inscription.hidden = true;
    connexion.hidden = false;
    document.getElementById("message-connexion").textContent = "Compte créé ! Connecte-toi maintenant.";
});

// 7. Quand le formulaire de connexion est envoye.
document.getElementById("formulaire-connexion").addEventListener("submit", function(event) {
    event.preventDefault();

    const identifiant = document.getElementById("identifiant").value.trim();
    const motDePasse = document.getElementById("mot-de-passe").value;

    // On verifie qu'un compte existe et que les informations sont correctes.
    if (compte !== null && identifiant === compte.identifiant && motDePasse === compte.motDePasse) {
        document.getElementById("nom-joueur").textContent = identifiant;

        connexion.hidden = true;
        boutique.hidden = false;

        document.getElementById("message-connexion").textContent = "";
        document.getElementById("formulaire-connexion").reset();
    } else {
        document.getElementById("message-connexion").textContent = "Identifiant ou mot de passe incorrect. Crée un compte si tu n'en as pas.";
    }
});

// 8. Cette fonction permet d'acheter une carte.
function acheterCarte(prix, nom, bouton) {
    if (points >= prix) {
        points = points - prix;

        document.getElementById("points").textContent = points;
        document.getElementById("message-achat").textContent = "Tu as acheté : " + nom;

        bouton.textContent = "Déjà achetée";
        bouton.disabled = true;
    } else {
        document.getElementById("message-achat").textContent = "Tu n'as pas assez de points.";
    }
}

// 9. Le bouton permet de revenir a l'ecran de connexion.
document.getElementById("bouton-deconnexion").addEventListener("click", function() {
    boutique.hidden = true;
    connexion.hidden = false;
});


/* =====================================
   SYSTEME DE PANIER
   Stockage localStorage
===================================== */

const CLE_PANIER = "boutique_panier";

// Charger le panier sauvegardé
function chargerPanier() {
    try {
        const donnees = localStorage.getItem(CLE_PANIER);
        const panierCharge = donnees ? JSON.parse(donnees) : [];

        return Array.isArray(panierCharge) ? panierCharge : [];
    } catch (erreur) {
        console.error("Erreur de chargement du panier :", erreur);
        return [];
    }
}

let panier = chargerPanier();

// Sauvegarder le panier
function sauvegarderPanier() {
    localStorage.setItem(CLE_PANIER, JSON.stringify(panier));
}

// Afficher un message
function afficherMessagePanier(message) {
    const messageAchat = document.getElementById("message-achat");

    if (messageAchat) {
        messageAchat.textContent = message;
    }
}

// Mettre à jour l'affichage du panier
function afficherPanier() {
    const liste = document.getElementById("liste-panier");
    const compteur = document.getElementById("compteur-panier");
    const totalElement = document.getElementById("total-panier");
    const messageVide = document.getElementById("panier-vide");

    if (!liste || !compteur || !totalElement || !messageVide) {
        return;
    }

    liste.replaceChildren();

    let total = 0;

    panier.forEach((carte) => {
        total += carte.prix;

        const ligne = document.createElement("div");
        ligne.className = "element-panier";

        ligne.style.display = "flex";
        ligne.style.alignItems = "center";
        ligne.style.gap = "15px";
        ligne.style.padding = "12px";
        ligne.style.borderBottom = "1px solid #444456";

        if (carte.image) {
            const image = document.createElement("img");
            image.src = carte.image;
            image.alt = carte.nom;
            image.style.width = "65px";
            image.style.height = "85px";
            image.style.objectFit = "cover";

            ligne.appendChild(image);
        }

        const informations = document.createElement("div");
        informations.style.flex = "1";

        const nom = document.createElement("h3");
        nom.textContent = carte.nom;

        const prix = document.createElement("p");
        prix.textContent = carte.prix + " points";

        informations.append(nom, prix);

        const boutonSupprimer = document.createElement("button");
        boutonSupprimer.type = "button";
        boutonSupprimer.textContent = "Retirer";

        boutonSupprimer.addEventListener("click", () => {
            supprimerCarte(carte.nom);
        });

        ligne.append(informations, boutonSupprimer);
        liste.appendChild(ligne);
    });

    compteur.textContent = panier.length;
    totalElement.textContent = total;

    messageVide.hidden = panier.length > 0;
}

// Ajouter une carte au panier
// Cette fonction remplace l'ancien achat direct.
window.acheterCarte = function(prix, nom, bouton) {

    const prixCarte = Number(prix);

    if (!nom || !Number.isFinite(prixCarte) || prixCarte <= 0) {
        afficherMessagePanier("Informations de carte invalides.");
        return;
    }

    const existeDeja = panier.some(
        carte => carte.nom.toLowerCase() === nom.trim().toLowerCase()
    );

    if (existeDeja) {
        afficherMessagePanier("Cette carte est déjà dans ton panier !");
        return;
    }

    const blocCarte = bouton?.closest(".carte");
    const imageCarte = blocCarte?.querySelector("img");

    const nouvelleCarte = {
        nom: nom.trim(),
        prix: prixCarte,
        image: imageCarte?.getAttribute("src") || ""
    };

    panier.push(nouvelleCarte);

    sauvegarderPanier();
    afficherPanier();

    afficherMessagePanier(nom + " a été ajouté au panier !");

};

// Supprimer une carte
function supprimerCarte(nom) {

    panier = panier.filter(
        carte => carte.nom !== nom
    );

    sauvegarderPanier();
    afficherPanier();

    afficherMessagePanier(nom + " a été retiré du panier.");
}

// Vider complètement le panier
document.getElementById("bouton-vider-panier")
    ?.addEventListener("click", () => {

        panier = [];

        sauvegarderPanier();
        afficherPanier();

        afficherMessagePanier("Ton panier a été vidé.");
    });

// Ouvrir le panier
document.getElementById("bouton-ouvrir-panier")
    ?.addEventListener("click", () => {

        const section = document.getElementById("section-panier");

        section.hidden = false;

        afficherPanier();

        section.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    });

// Fermer le panier
document.getElementById("bouton-fermer-panier")
    ?.addEventListener("click", () => {

        document.getElementById("section-panier").hidden = true;
    });

// Modifier le texte des anciens boutons
document.querySelectorAll(
    '.carte button[onclick*="acheterCarte"]'
).forEach(bouton => {
    bouton.textContent = "Ajouter au panier";
});

// Affichage initial
afficherPanier();
// Validation simulée du panier
document.getElementById("bouton-valider-panier")
    ?.addEventListener("click", () => {

        if (panier.length === 0) {
            afficherMessagePanier("Ton panier est vide !");
            return;
        }

        const total = panier.reduce(
            (somme, carte) => somme + carte.prix, 0
        );

        const confirmation = confirm(
            "Confirmer ton achat de " + total + " points ?"
        );

        if (!confirmation) return;

        panier = [];

        sauvegarderPanier();
        afficherPanier();

        afficherMessagePanier(
            "Commande simulée avec succès !"
        );
    });