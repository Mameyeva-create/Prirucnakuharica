
export default function RecipeCard({ recept, nazivKategorije, onView }) {
    return (
        <div className="card h-100 shadow-sm">
            <img
                src={recept.slika || recept.slikaPutanja}
                className="card-img-top"
                alt={recept.naziv}
                style={{ height: '180px', objectFit: 'cover' }}
            />
            <div className="card-body d-flex flex-column">
                <h5 className="card-title">{recept.naziv}</h5>
                <p className="card-text mb-1">
                    Kategorija: {nazivKategorije}
                </p>
                <p className="card-text">⏱ {recept.vrijeme} min</p>

                <button className="btn btn-success mt-auto" onClick={onView}>
                    Vidi recept
                </button>
            </div>
        </div>
    )
}
