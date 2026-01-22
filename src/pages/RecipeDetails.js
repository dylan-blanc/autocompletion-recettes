import './RecipeDetails.css';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

function RecipeDetails() {
    const { id } = useParams();
    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
                const data = await response.json();
                setRecipe(data.meals[0]);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };
        fetchRecipe();
    }, [id]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;
    if (!recipe) return <div>Recipe not found</div>;

    return (
        <div className="recipe-details container text-center">
            <h1 className="mb-4">Détails de la recette</h1>
            <p>Nom de la recette : <strong>{recipe.strMeal}</strong></p>
            <p>Categorie : <strong>{recipe.strCategory}</strong></p>
            <p>Pays : <strong>{recipe.strArea}</strong></p>

            <img src={recipe.strMealThumb} alt={recipe.strMeal} className="img-fluid rounded my-3" style={{ maxWidth: '300px' }} />

            <p>Instructions : <br /> <strong>{recipe.strInstructions}</strong></p>
            {recipe.strYoutube && (
                <div className="youtube-embed my-4">
                    <h2>Vidéo</h2>
                    <iframe
                        width="560"
                        height="315"
                        src={recipe.strYoutube.replace('watch?v=', 'embed/')}
                        title={recipe.strMeal}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                </div>
            )}
            <h2 className="mt-4 mb-3">Ingrédients</h2>
            <table className="table table-striped table-bordered w-auto mx-auto">
                <thead className="table-dark">
                    <tr>
                        <th>Ingrédients</th>
                        <th>Quantité</th>
                    </tr>
                </thead>
                <tbody>
                    {[...Array(20)].map((_, i) => {
                        const ingredient = recipe[`strIngredient${i + 1}`];
                        const measure = recipe[`strMeasure${i + 1}`];
                        if (ingredient && ingredient.trim() !== '') {
                            return (
                                <tr key={i}>
                                    <td>{ingredient}</td>
                                    <td>{measure}</td>
                                </tr>
                            );
                        }
                        return null;
                    })}
                </tbody>
            </table>
        </div>
    );
}

export default RecipeDetails;
