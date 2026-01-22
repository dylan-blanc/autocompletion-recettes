/**
 * Composant de chargement réutilisable avec spinner Bootstrap
 */
function LoadingSpinner({ message = "Chargement..." }) {
    return (
        <div className="container mt-5 text-center">
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">{message}</span>
            </div>
            <p className="mt-3">{message}</p>
        </div>
    );
}

export default LoadingSpinner;
