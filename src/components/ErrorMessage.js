/**
 * Composant d'affichage d'erreur réutilisable
 */
function ErrorMessage({ message = "Une erreur est survenue", variant = "danger" }) {
    return (
        <div className="container mt-5">
            <div className={`alert alert-${variant}`} role="alert">
                {message}
            </div>
        </div>
    );
}

export default ErrorMessage;
