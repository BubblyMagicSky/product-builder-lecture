
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
                    background-color: var(--surface, #ffffff);
                    border: 1px solid var(--line, #e6d8cd);
                    border-radius: 18px;
                    overflow: hidden;
                    box-shadow: var(--card-shadow, 0 10px 25px rgba(0, 0, 0, 0.12));
                    cursor: pointer;
                    transition: transform 0.2s ease, box-shadow 0.2s ease;
                    animation: cardIn 0.6s ease both;
                }
                :host(:hover) {
                    transform: translateY(-4px);
                    box-shadow: var(--card-shadow-hover, 0 16px 30px rgba(0, 0, 0, 0.18));
                }
                img {
                    width: 100%;
                    height: 220px;
                    object-fit: cover;
                }
                h3 {
                    font-family: "Fraunces", "Times New Roman", serif;
                    padding: 0.9rem 1.1rem 0.6rem;
                    margin: 0;
                    font-size: 1.25rem;
                }
                p {
                    padding: 0 1.1rem 1.2rem;
                    margin: 0;
                    color: var(--muted-ink, #4f4b46);
                }
                @keyframes cardIn {
                    from {
                        opacity: 0;
                        transform: translateY(12px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                @media (max-width: 700px) {
                    img {
                        height: 190px;
                    }
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
        recipesToRender.forEach((recipe, index) => {
            const recipeCard = document.createElement("recipe-card");
            recipeCard.setAttribute("img", recipe.img);
            recipeCard.setAttribute("title", recipe.title);
            recipeCard.setAttribute("description", recipe.description);
            recipeCard.style.animationDelay = `${index * 70}ms`;
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
