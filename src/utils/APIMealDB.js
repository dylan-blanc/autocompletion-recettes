/**
 * Utilitaire centralisé pour les appels API TheMealDB
 * https://www.themealdb.com/api.php
 */

const BASE_URL = 'https://www.themealdb.com/api/json/v1/1';

// Liste des pays/zones disponibles dans l'API TheMealDB
export const AVAILABLE_AREAS = [
    "American", "British", "Canadian", "Chinese", "Croatian", "Dutch",
    "Egyptian", "Filipino", "French", "Greek", "Indian", "Irish",
    "Italian", "Jamaican", "Japanese", "Kenyan", "Malaysian", "Mexican",
    "Moroccan", "Polish", "Portuguese", "Russian", "Spanish", "Thai",
    "Tunisian", "Turkish", "Ukrainian", "Vietnamese"
];

/**
 * Recherche de repas par nom
 * @param {string} name - Nom ou partie du nom à rechercher
 * @returns {Promise<Array>} Liste des repas trouvés
 */
export const searchMealsByName = async (name) => {
    try {
        const response = await fetch(`${BASE_URL}/search.php?s=${encodeURIComponent(name)}`);
        const data = await response.json();
        return data.meals || [];
    } catch (error) {
        console.error('Erreur lors de la recherche par nom:', error);
        throw error;
    }
};

/**
 * Recherche d'un repas par son ID
 * @param {string} id - ID du repas
 * @returns {Promise<Object|null>} Détails du repas ou null
 */
export const getMealById = async (id) => {
    try {
        const response = await fetch(`${BASE_URL}/lookup.php?i=${id}`);
        const data = await response.json();
        return data.meals ? data.meals[0] : null;
    } catch (error) {
        console.error('Erreur lors de la récupération du repas:', error);
        throw error;
    }
};

/**
 * Récupère toutes les catégories
 * @returns {Promise<Array>} Liste des catégories
 */
export const getCategories = async () => {
    try {
        const response = await fetch(`${BASE_URL}/categories.php`);
        const data = await response.json();
        return data.categories || [];
    } catch (error) {
        console.error('Erreur lors de la récupération des catégories:', error);
        throw error;
    }
};

/**
 * Récupère la liste des pays/zones
 * @returns {Promise<Array>} Liste des pays/zones
 */
export const getAreas = async () => {
    try {
        const response = await fetch(`${BASE_URL}/list.php?a=list`);
        const data = await response.json();
        return data.meals || [];
    } catch (error) {
        console.error('Erreur lors de la récupération des pays:', error);
        throw error;
    }
};

/**
 * Filtre les repas par catégorie
 * @param {string} category - Nom de la catégorie
 * @returns {Promise<Array>} Liste des repas de cette catégorie
 */
export const getMealsByCategory = async (category) => {
    try {
        const response = await fetch(`${BASE_URL}/filter.php?c=${encodeURIComponent(category)}`);
        const data = await response.json();
        return data.meals || [];
    } catch (error) {
        console.error('Erreur lors de la récupération par catégorie:', error);
        throw error;
    }
};

/**
 * Filtre les repas par pays/zone
 * @param {string} area - Nom du pays/zone
 * @returns {Promise<Array>} Liste des repas de ce pays
 */
export const getMealsByArea = async (area) => {
    try {
        const response = await fetch(`${BASE_URL}/filter.php?a=${encodeURIComponent(area)}`);
        const data = await response.json();
        return data.meals || [];
    } catch (error) {
        console.error('Erreur lors de la récupération par pays:', error);
        throw error;
    }
};

/**
 * Vérifie si un terme correspond à un pays disponible
 * @param {string} term - Terme à vérifier
 * @returns {string|undefined} Le pays correspondant ou undefined
 */
export const findMatchingArea = (term) => {
    const lowerTerm = term.toLowerCase();
    return AVAILABLE_AREAS.find(area => area.toLowerCase() === lowerTerm);
};

/**
 * Extrait les ingrédients d'un objet repas
 * @param {Object} meal - Objet repas de l'API
 * @returns {Array<{ingredient: string, measure: string}>} Liste des ingrédients avec mesures
 */
export const getIngredients = (meal) => {
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];
        if (ingredient && ingredient.trim()) {
            ingredients.push({ ingredient, measure: measure || '' });
        }
    }
    return ingredients;
};

/**
 * Filtre et catégorise les suggestions par "commence par" et "contient"
 * @param {Array} meals - Liste des repas
 * @param {string} query - Terme de recherche
 * @returns {{startsWith: Array, contains: Array}} Suggestions catégorisées
 */
export const filterSuggestions = (meals, query) => {
    const lowerQuery = query.toLowerCase();
    const startsWith = meals
        .filter(meal => meal.strMeal.toLowerCase().startsWith(lowerQuery))
        .slice(0, 5);
    const contains = meals
        .filter(meal => {
            const name = meal.strMeal.toLowerCase();
            return name.includes(lowerQuery) && !name.startsWith(lowerQuery);
        })
        .slice(0, 5);

    return { startsWith, contains };
};
