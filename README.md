TP Noté 2023

Node & Vue JS 

Sujet : Création d’un comparateur de produit
<h3>
Contexte : 
</h3>
<span style="color:white;font-weight : 400;font-size : 12 px">
L’idée est de construire un comparateur de produits, pour cela, il faudra : 
Un espace authentifié dans lequel l’administrateur peut ajouter des produits avec des caractéristiques (ce qu’il vous plait : jeux vidéos, joueurs NBA, …)
Un espace non authentifié dans lequel on retrouve : 
une liste de produits, avec de la pagination 
choisir deux produits et d’avoir une vue spécifique qui permet de faire la comparaison
<h3>
Pour la partie backend : 
</h3>

<div>

- [ ] Une route POST pour l’inscription

- [ ] Une route POST pour la connection

- [x] Une route GET pour la récupération d’un élément

- [x] Une route GET pour le listing des produits

- [x] Une même route POST pour l’ajout ET la modification d’un élément

- [x] Une route DELETE pour la suppression d’un élément
</div>
<h3>
Spécifications
</h3>
<span style="color:grey;font-weight : 500;font-size : 10 px">

- [ ] Les routes de l’administration (donc celles pour ajouter/modifier et supprimer unx élément) doivent être seulement accessibles en étant connecté.

Le backend sera fait avec un express, une authentification passport JWT et la communication entre le front et backend se fera avec du JSON.
Les données seront stockées dans un DB via l’outil https://restdb.io/ avec l’utilisation d’async/await ET axios.


Le frontend utilisera les différentes routes mise en place par le backend pour proposer un affichage de comparaison de produit. Chaque valeur du produit sera listée et accompagnée de valeur calculée ou d’un pourcentage pour aider à la comparaison entre les deux produits.
</span>

<span style="color:white;font-weight : 350;font-size : 12 px">
<h3>
Pour la partie frontend :
</h3>

- [ ] Une route proposant un formulaire d’inscription

- [ ] Une route permettant de se connecter

- [ ] Une route pour le listing des produits (permettant également de sélectionner deux produits ou d’en éditer un si la personne est connectée)

- [ ] Une route pour accéder à la comparaison des deux produits

- [ ] Une route “connectée” proposant un formulaire d’ajout ou de modification.

<span style="color:grey;font-weight : 300;font-size : 10 px">
La note sur 20 sera divisée en 2, 10 points pour le node et 10 points pour le vue.
