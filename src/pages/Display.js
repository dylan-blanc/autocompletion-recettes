import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCategories, getAreas } from '../utils/APIMealDB';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import CountryFlag from '../components/CountryFlag';
import './Home.css';

function Display() {
    const [categories, setCategories] = useState([]);
    const [areas, setAreas] = useState([]);
    const [activeTab, setActiveTab] = useState('categories');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [categoriesData, areasData] = await Promise.all([
                    getCategories(),
                    getAreas()
                ]);
                setCategories(categoriesData);
                setAreas(areasData);
            } catch (err) {
                setError('Erreur lors du chargement des données');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <LoadingSpinner message="Chargement des données..." />;
    if (error) return <ErrorMessage message={error} />;

    return (
        <div className="container mt-4">
            <h1 className="mb-4">Découvrir les recettes</h1>

            {/* Onglets de navigation */}
            <ul className="nav nav-tabs mb-4">
                <li className="nav-item">
                    <button
                        className={`nav-link ${activeTab === 'categories' ? 'active' : ''}`}
                        onClick={() => setActiveTab('categories')}
                    >
                        🍽️ Par Catégorie
                    </button>
                </li>
                <li className="nav-item">
                    <button
                        className={`nav-link ${activeTab === 'areas' ? 'active' : ''}`}
                        onClick={() => setActiveTab('areas')}
                    >
                        🌍 Par Pays
                    </button>
                </li>
            </ul>

            {/* Affichage des catégories */}
            {activeTab === 'categories' && (
                <>
                    <p className="text-muted mb-4">{categories.length} catégorie(s) disponible(s)</p>
                    <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                        {categories.map((category) => (
                            <div className="col" key={category.idCategory}>
                                <div className="card h-100 shadow-sm">
                                    <img
                                        src={category.strCategoryThumb}
                                        alt={category.strCategory}
                                        className="card-img-top"
                                        style={{ height: '200px', objectFit: 'cover' }}
                                    />
                                    <div className="card-body">
                                        <h5 className="card-title">{category.strCategory}</h5>
                                        <p className="card-text text-muted" style={{
                                            maxHeight: '80px',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis'
                                        }}>
                                            {category.strCategoryDescription?.substring(0, 100)}...
                                        </p>
                                    </div>
                                    <div className="card-footer bg-transparent">
                                        <Link
                                            to={`/search-results?category=${category.strCategory}`}
                                            className="btn btn-primary w-100"
                                        >
                                            Voir les recettes
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {/* Affichage des pays */}
            {activeTab === 'areas' && (
                <>
                    <p className="text-muted mb-4">{areas.length} pays disponible(s)</p>
                    <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
                        {areas.map((area, index) => (
                            <div className="col" key={index}>
                                <div className="card h-100 shadow-sm text-center">
                                    <div className="card-body d-flex flex-column justify-content-center" style={{ minHeight: '150px' }}>
                                        <h5 className="card-title mb-3">
                                            <CountryFlag area={area.strArea} size={48} />
                                        </h5>
                                        <h5 className="card-title">{area.strArea}</h5>
                                    </div>
                                    <div className="card-footer bg-transparent">
                                        <Link
                                            to={`/search-results?area=${area.strArea}`}
                                            className="btn btn-outline-primary w-100"
                                        >
                                            Voir les recettes
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

export default Display;
