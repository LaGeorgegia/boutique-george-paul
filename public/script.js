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
