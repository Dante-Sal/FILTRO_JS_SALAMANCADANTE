document.addEventListener('DOMContentLoaded', () => {
    const nav_form = document.querySelector('.nav__form');
    const nav_form_search_bar = document.querySelector('.nav__form--search-bar');
    const nav_form_category_filter = document.querySelector('.nav__form--category-filter');
    const nav_form_type_filter = document.querySelector('.nav__form--type-filter');
    const section_cards = document.querySelector('.section__cards');

    async function FETCH_BY_NAME(form_data) {
        const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/search.php?s=${form_data.name.toLowerCase()}`);
        const data = response.data.meals;
        return data;
    };

    async function FETCH_BY_CATEGORY(form_data) {
        const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${form_data.category.toLowerCase()}`);
        const data = response.data.meals;
        return data;
    };

    async function FETCH_BY_TYPE(form_data) {
        const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${form_data.type.toLowerCase()}`);
        const data = response.data.meals;
        return data;
    };

    async function FETCH_DISH_DETAILS(id) {
        const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
        const data = response.data.meals[0];
        return data;
    };

    function DISPLAY_SEARCH(data) {
        section_cards.style.gridTemplateColumns = 'repeat(5, 1fr)';
        section_cards.innerHTML = '';
        for (let i = 0; i < data.length; i++) {
            FETCH_DISH_DETAILS(data[i].idMeal)
                .then(details => {
                    section_cards.insertAdjacentHTML('beforeend', `
                        <div class="section__cards-meal">
                            <div class="section__cards-meal--thumb">
                                <img src="${details.strMealThumb}" />
                            </div>
                            <div class="section__cards-meal--name section__cards-meal--data">
                                <p>${details.strMeal}</p>
                            </div>
                            <div class="section__cards-meal--classification section__cards-meal--data">
                                <p>
                                    <span class="section__cards-meal--category">
                                     — ${details.strCategory}
                                    </span>
                                    <span class="section__cards-meal--type">
                                        (${details.strArea}) —
                                    </span>
                                </p>
                            </div>
                            <button class="section__cards-meal--more-btn" dish-id="${details.idMeal}">+</button>
                        </div>
                    `);
                    document.querySelectorAll('.section__cards-meal--more-btn').forEach(btn => {
                        btn.addEventListener('click', DISPLAY_DISH_DETAILS);
                    });
                });
        };
    };

    function DISPLAY_DISH_DETAILS(event) {
        const id = event.target.getAttribute('dish-id');
        section_cards.style.gridTemplateColumns = '1fr';
        section_cards.innerHTML = '';
        FETCH_DISH_DETAILS(id)
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

    nav_form_search_bar.addEventListener('input', () => {
        if (nav_form_search_bar.value.trim() !== '') {
            nav_form_category_filter.setAttribute('disabled', true);
            nav_form_type_filter.setAttribute('disabled', true);
        } else {
            nav_form_category_filter.removeAttribute('disabled');
            nav_form_type_filter.removeAttribute('disabled');
        };
    });

    nav_form_category_filter.addEventListener('input', () => {
        if (nav_form_category_filter.value !== '') {
            nav_form_search_bar.setAttribute('disabled', true);
            nav_form_type_filter.setAttribute('disabled', true);
        } else {
            nav_form_search_bar.removeAttribute('disabled');
            nav_form_type_filter.removeAttribute('disabled');
        };
    });

    nav_form_type_filter.addEventListener('input', () => {
        if (nav_form_type_filter.value !== '') {
            nav_form_category_filter.setAttribute('disabled', true);
            nav_form_search_bar.setAttribute('disabled', true);
        } else {
            nav_form_category_filter.removeAttribute('disabled');
            nav_form_search_bar.removeAttribute('disabled');
        };
    });

    nav_form.addEventListener('submit', e => {
        e.preventDefault();
        const form_data = Object.fromEntries(
            new FormData(e.target)
        );
        if (form_data.name !== undefined && form_data.name !== '') {
            FETCH_BY_NAME(form_data)
                .then(data => {
                    DISPLAY_SEARCH(data);
                });
        } else if (form_data.category !== undefined && form_data.category !== '') {
            FETCH_BY_CATEGORY(form_data)
                .then(data => {
                    DISPLAY_SEARCH(data);
                });
        } else if (form_data.type !== undefined && form_data.type !== '') {
            FETCH_BY_TYPE(form_data)
                .then(data => {
                    DISPLAY_SEARCH(data);
                });
        };
    });
});