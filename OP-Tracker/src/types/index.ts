// src/types/index.ts

// Représente une carte telle qu'elle vient de l'API TCGPlayer / Master DB
export interface Card {
  id: string;          // ID TCGPlayer
  name: string;
  cleanName: string;   // Pour la recherche (ex: "monkey d luffy")
  imageUrl: string;
  setCode: string;     // Le Graal pour le scanner (ex: "OP05-060")
  rarity: string;
  marketPrice?: number; // Peut être undefined si pas de prix dispo
  setDetails: {
    name: string;
    code: string;      // ex: "OP05"
  };
}

// Représente une carte dans la collection de l'utilisateur
export interface UserCollectionItem {
  cardId: string;      // Référence à la Master DB
  addedAt: Date;
  quantity: number;
  condition: 'NM' | 'LP' | 'MP' | 'HP'; // Near Mint, Lightly Played...
  language: 'FR' | 'EN' | 'JP';
  // On garde un "cache" pour l'affichage rapide sans refaire de requête
  _cache: {
    name: string;
    setCode: string;
    imageUrl: string;
  };
}

// Type pour le résultat du Scanner
export interface ScannedResult {
  text: string;
  cornerPoints?: any[]; // Coordonnées du texte sur l'écran
}