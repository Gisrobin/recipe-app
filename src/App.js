import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [search, setSearch] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('Beef');

  // Fetch recipes by category
  const fetchRecipesByCategory = async (category) => {
    try {
      const res = await axios.get(
        `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`
      );

      const meals = res.data.meals || [];

      // Fetch full details for each meal
      const detailedMeals = await Promise.all(
        meals.slice(0, 6).map(async (meal) => {
          const detailRes = await axios.get(
            `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`
          );
          return detailRes.data.meals[0];
        })
      );

      setRecipes(detailedMeals);
    } catch (error) {
      console.error('Error loading recipes:', error);
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const res = await axios.get(
        'https://www.themealdb.com/api/json/v1/1/list.php?c=list'
      );
      setCategories(res.data.meals.map((cat) => cat.strCategory));
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchRecipesByCategory(selectedCategory);
  }, [selectedCategory]);

  const handleSearch = async (e) => {
    const value = e.target.value;
    setSearch(value);

    if (value.trim() === '') {
      fetchRecipesByCategory(selectedCategory);
      return;
    }

    try {
      const res = await axios.get(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${value}`
      );
      setRecipes(res.data.meals || []);
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🍽️ Robin's Kitchen & Dishes</h1>

        <div className="controls">
          <input
            type="text"
            placeholder="Search for recipes..."
            value={search}
            onChange={handleSearch}
            className="search-bar"
          />

          <select
            className="category-dropdown"
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setSearch('');
            }}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </header>

      <main className="App-content">
        {recipes.length > 0 ? (
          recipes.map((recipe) => (
            <div key={recipe.idMeal} className="recipe-card">
              <img
                src={recipe.strMealThumb}
                alt={recipe.strMeal}
                className="recipe-image"
              />
              <h2>{recipe.strMeal}</h2>
              <h3>Category: {recipe.strCategory}</h3>
              <h4>Origin: {recipe.strArea}</h4>
              <p>{recipe.strInstructions.substring(0, 120)}...</p>
              {recipe.strSource && (
                <a
                  href={recipe.strSource}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Full Recipe
                </a>
              )}
            </div>
          ))
        ) : (
          <p>No recipes found.</p>
        )}
      </main>
    </div>
  );
}

export default App;