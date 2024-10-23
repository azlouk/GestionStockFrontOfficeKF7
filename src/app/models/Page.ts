export interface Page<T> {
    content: T[];        // Les données actuelles de la page (la liste d'éléments paginés)
    totalPages: number;   // Nombre total de pages
    totalElements: number; // Nombre total d'éléments dans toutes les pages
    size: number;         // Nombre d'éléments par page
    number: number;       // Numéro de la page actuelle (commence à 0)
}
