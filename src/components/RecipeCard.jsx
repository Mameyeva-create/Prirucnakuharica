function RecipeCard({ recept, onView }) {
    return (
        <div className="card h-100 shadow-sm">
            <img src={recept.slika}
                className="card-img-top"
                alt={recept.naziv}
            />
            <div className="card-body">
                <h5 className="card-title">
                    {recept.naziv}
                </h5>
                <p className="card-text">Kategorija: {recept.kategorija}</p>

                <p className="card-text">⏱  {recept.vrijeme} min</p>

                <button className="btn btn-success" onClick={onView}>
                    Vidi recept
                </button>
            </div>
        </div>
    )
}
export default RecipeCard