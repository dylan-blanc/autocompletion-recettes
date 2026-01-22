/**
 * Composant CountryFlag - Affiche le drapeau d'un pays basé sur strArea de TheMealDB
 * Utilise l'API flagcdn.com pour les images de drapeaux
 * https://flagcdn.com/en/codes.json
 * https://flagpedia.net/
 */

// Mapping entre les zones TheMealDB et les codes pays flagcdn
const AREA_TO_FLAG_CODE = {
    "American": "us",
    "British": "gb",
    "Canadian": "ca",
    "Chinese": "cn",
    "Croatian": "hr",
    "Dutch": "nl",
    "Egyptian": "eg",
    "Filipino": "ph",
    "French": "fr",
    "Greek": "gr",
    "Indian": "in",
    "Irish": "ie",
    "Italian": "it",
    "Jamaican": "jm",
    "Japanese": "jp",
    "Kenyan": "ke",
    "Malaysian": "my",
    "Mexican": "mx",
    "Moroccan": "ma",
    "Polish": "pl",
    "Portuguese": "pt",
    "Russian": "ru",
    "Spanish": "es",
    "Thai": "th",
    "Tunisian": "tn",
    "Turkish": "tr",
    "Ukrainian": "ua",
    "Vietnamese": "vn",
    "Norwegian": "no",
    "Algerian": "dz",
    "Saudi Arabian": "sa",
    "Slovakian": "sk",
    "Uruguayan": "uy",
    "Venezulan": "ve",
    "Vietnamese": "vn",
    "Syrian": "sy",
    "Australian": "au",
    "Argentinian": "ar"
};

/**
 * Récupère le code pays pour une zone donnée
 * @param {string} area - Zone/pays de TheMealDB (ex: "American", "French")
 * @returns {string|null} Code pays ISO ou null si non trouvé
 */
export const getCountryCode = (area) => {
    return AREA_TO_FLAG_CODE[area] || null;
};

/**
 * Génère l'URL du drapeau pour un code pays
 * Format flagcdn: {width}x{height} où le ratio est environ 4:3
 * @param {string} code - Code pays ISO (ex: "us", "fr")
 * @param {number} width - Largeur du drapeau en pixels (défaut: 48)
 * @returns {string} URL de l'image du drapeau
 */
export const getFlagUrl = (code, width = 48) => {
    // Flagcdn utilise un ratio de 4:3 pour les dimensions
    const height = Math.round(width * 0.75);
    return `https://flagcdn.com/${width}x${height}/${code}.png`;
};

/**
 * Composant affichant le drapeau d'un pays
 * @param {string} area - Zone/pays de TheMealDB
 * @param {number} size - Taille du drapeau en pixels (défaut: 48)
 * @param {string} className - Classes CSS additionnelles
 */
function CountryFlag({ area, size = 48, className = '' }) {
    const countryCode = getCountryCode(area);

    if (!countryCode) {
        // Fallback vers l'emoji globe si le pays n'est pas reconnu
        return <span style={{ fontSize: `${size * 0.75}px` }}>🌍</span>;
    }

    return (
        <img
            src={getFlagUrl(countryCode, size)}
            alt={`Drapeau ${area}`}
            className={className}
            style={{
                width: `${size}px`,
                height: 'auto',
                borderRadius: '4px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
        />
    );
}

export default CountryFlag;
