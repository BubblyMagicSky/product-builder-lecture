
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

    const recipes = [
        {
            img: "https://via.placeholder.com/300x200.png?text=Kimchi+Jjigae",
            title: "Kimchi Jjigae",
            description: "A classic Korean stew made with kimchi, tofu, and pork.",
        },
        {
            img: "https://via.placeholder.com/300x200.png?text=Bibimbap",
            title: "Bibimbap",
            description: "A mixed rice dish with assorted vegetables, beef, and a fried egg.",
        },
        {
            img: "https://via.placeholder.com/300x200.png?text=Bulgogi",
            title: "Bulgogi",
            description: "Thinly sliced marinated beef, grilled to perfection.",
        },
    ];

    recipes.forEach(recipe => {
        const recipeCard = document.createElement("recipe-card");
        recipeCard.setAttribute("img", recipe.img);
        recipeCard.setAttribute("title", recipe.title);
        recipeCard.setAttribute("description", recipe.description);
        recipeContainer.appendChild(recipeCard);
    });
});
