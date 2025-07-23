const section_cards = document.querySelector('.section__cards');
const characters = '0123456789abcdefghijklmnopqrstuvwxyz'

async function FETCH_BY_CHARACTER(char) {
    const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/search.php?f=${char}`);
    const data = response.data.meals;
    return data;
};

async function FETCH_BY_ID(id) {
    const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
    const data = response.data.meals[0];
    return data;
}

function DISPLAY_DISH(data) {
    section_cards.insertAdjacentHTML('beforeend', `
        <div class="section__cards-meal">
            <div class="section__cards-meal--thumb">
                <img src="${data.strMealThumb}" />
            </div>
            <div class="section__cards-meal--name section__cards-meal--data">
                <p>${data.strMeal}</p>
            </div>
            <div class="section__cards-meal--classification section__cards-meal--data">
                <p>
                    <span class="section__cards-meal--category">
                        — ${data.strCategory}
                    </span>
                    <span class="section__cards-meal--type">
                        (${data.strArea}) —
                    </span>
                </p>
            </div>
            <button class="section__cards-meal--more-btn" dish-id="${data.idMeal}">+</button>
        </div>
    `);
    document.querySelectorAll('.section__cards-meal--more-btn').forEach(btn => {
        btn.addEventListener('click', DISPLAY_DISH_DETAILS);
    });
};

function DISPLAY_DISH_DETAILS(event) {
    const id = event.target.getAttribute('dish-id');
    section_cards.style.gridTemplateColumns = '1fr';
    section_cards.innerHTML = '';
    FETCH_BY_ID(id)
        .then(data => {
            section_cards.innerHTML = `
                    <p class="section__cards--title">${data.strMeal}</p>
                    <img class="section__cards--img" src="${data.strMealThumb}" />
                    <p class="section__cards--classification">#${data.strCategory.toLowerCase()} #${data.strArea.toLowerCase()}food</p>
                    <p class="section__cards--ingredients-title">Ingredients:</p>
                    <ul class="section__cards--ingredients-list"></ul>
                    <p class="section__cards--instructions-title">Instructions:</p>
                    <p class="section__cards--instructions-description">${data.strInstructions}</p>
                `;
            const section_cards_ingredients_list = document.querySelector('.section__cards--ingredients-list');
            for (let i = 0; i < 20; i++) {
                const ingredient_key = `strIngredient${i + 1}`;
                const measure_key = `strMeasure${i + 1}`;
                const regex = /^[0-9\s]*$/;
                if (data[ingredient_key] === '') {
                    break;
                };
                if (regex.test(data[measure_key].trim())) {
                    if (data[measure_key] === '1') {
                        section_cards_ingredients_list.insertAdjacentHTML('beforeend', `
                            <li>${data[ingredient_key].trim()} (${data[measure_key].trim()} unit)</li>
                        `);
                    } else {
                        section_cards_ingredients_list.insertAdjacentHTML('beforeend', `
                            <li>${data[ingredient_key].trim()} (${data[measure_key].trim()} units)</li>
                        `);
                    };
                } else {
                    section_cards_ingredients_list.insertAdjacentHTML('beforeend', `
                        <li>${data[ingredient_key].trim()} (${data[measure_key].trim()})</li>
                    `);
                };
            };
            if (data.strYoutube !== '') {
                section_cards.insertAdjacentHTML('beforeend', `
                    <iframe class="section__cards--instructions-video" width="560" height="315" src="${data.strYoutube.replace('watch?v=', 'embed/')}?si=1LkmKWMyEXQ4s5Oz" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
                `);
            };
        });
};

async function DISPLAY_ALL_DISHES() {
    for (let i = 0; i < characters.length; i++) {
        await FETCH_BY_CHARACTER(characters.charAt(i))
            .then(data => {
                if (data !== null) {
                    for (let m = 0; m < data.length; m++) {
                        DISPLAY_DISH(data[m]);
                    };
                };
            });
    };
};

DISPLAY_ALL_DISHES();