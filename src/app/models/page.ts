export interface Page<T> {
    content: T[];          // Liste d'éléments (produits dans ce cas)
    totalElements: number; // Nombre total d'éléments dans la base de données
    totalPages: number;    // Nombre total de pages
    size: number;          // Taille de la page
    number: number;        // Numéro de la page actuelle (0-indexé)
}
