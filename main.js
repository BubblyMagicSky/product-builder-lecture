
class RecipeCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    connectedCallback() {
        const template = document.createElement("template");
        template.innerHTML = `
            <style>
                :host {
                    display: block;
                    background-color: white;
                    border: 1px solid #ddd;
                    border-radius: 5px;
                    overflow: hidden;
                    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                    cursor: pointer;
                }
                img {
                    width: 100%;
                    height: 200px;
                    object-fit: cover;
                }
                h3 {
                    padding: 0.5rem 1rem;
                    margin: 0;
                    background-color: #eee;
                }
                p {
                    padding: 1rem;
                    margin: 0;
                }
            </style>
            <img src="${this.getAttribute("img")}" alt="${this.getAttribute("title")}">
            <h3>${this.getAttribute("title")}</h3>
            <p>${this.getAttribute("description")}</p>
        `;
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }
}

customElements.define("recipe-card", RecipeCard);

document.addEventListener("DOMContentLoaded", () => {
    const recipeContainer = document.getElementById("recipe-container");
    const searchBar = document.getElementById("search-bar");
    const modal = document.getElementById("recipe-modal");
    const closeButton = document.querySelector(".close-button");
    let recipes = [];

    fetch("recipes.json")
        .then(response => response.json())
        .then(data => {
            recipes = data;
            renderRecipes(recipes);
        });

    function renderRecipes(recipesToRender) {
        recipeContainer.innerHTML = "";
        recipesToRender.forEach(recipe => {
            const recipeCard = document.createElement("recipe-card");
            recipeCard.setAttribute("img", recipe.img);
            recipeCard.setAttribute("title", recipe.title);
            recipeCard.setAttribute("description", recipe.description);
            recipeCard.addEventListener("click", () => openModal(recipe));
            recipeContainer.appendChild(recipeCard);
        });
    }

    searchBar.addEventListener("input", e => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredRecipes = recipes.filter(recipe =>
            recipe.title.toLowerCase().includes(searchTerm) ||
            recipe.description.toLowerCase().includes(searchTerm)
        );
        renderRecipes(filteredRecipes);
    });

    function openModal(recipe) {
        document.getElementById("modal-title").textContent = recipe.title;
        document.getElementById("modal-img").src = recipe.img;
        document.getElementById("modal-prep-time").textContent = recipe.prepTime;
        document.getElementById("modal-cook-time").textContent = recipe.cookTime;

        const ingredientsList = document.getElementById("modal-ingredients");
        ingredientsList.innerHTML = "";
        recipe.ingredients.forEach(ingredient => {
            const li = document.createElement("li");
            li.textContent = ingredient;
            ingredientsList.appendChild(li);
        });

        const instructionsList = document.getElementById("modal-instructions");
        instructionsList.innerHTML = "";
        recipe.instructions.forEach(instruction => {
            const li = document.createElement("li");
            li.textContent = instruction;
            instructionsList.appendChild(li);
        });

        modal.style.display = "block";
    }

    closeButton.addEventListener("click", () => {
        modal.style.display = "none";
    });

    window.addEventListener("click", e => {
        if (e.target === modal) {
            modal.style.display = "none";
        }
    });
});
