import { Link } from 'react-router-dom';

/**
 * Composant de carte de repas réutilisable
 * @param {Object} meal - Objet repas avec idMeal, strMeal, strMealThumb
 * @param {string} meal.strCategory - Catégorie optionnelle
 * @param {string} meal.strArea - Zone/pays optionnel
 * @param {string} linkTo - URL de destination (par défaut: recipe-details)
 * @param {string} buttonText - Texte du bouton
 */
function MealCard({ meal, linkTo, buttonText = "Voir la recette" }) {
    const defaultLink = `/recipe-details/${meal.idMeal}`;

    return (
        <div className="col">
            <div className="card h-100 shadow-sm">
                <img
                    src={meal.strMealThumb}
                    alt={meal.strMeal}
                    className="card-img-top"
                    style={{ height: '200px', objectFit: 'cover' }}
                />
                <div className="card-body">
                    <h5 className="card-title">{meal.strMeal}</h5>
                    {(meal.strCategory || meal.strArea) && (
                        <p className="card-text text-muted">
                            {meal.strCategory && meal.strCategory}
                            {meal.strCategory && meal.strArea && ' - '}
                            {meal.strArea && meal.strArea}
                        </p>
                    )}
                </div>
                <div className="card-footer bg-transparent">
                    <Link
                        to={linkTo || defaultLink}
                        className="btn btn-primary w-100"
                    >
                        {buttonText}
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default MealCard;
