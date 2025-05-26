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
        section_cards.innerHTML = '';
        for (let i = 0; i < data.length; i++) {
            FETCH_DISH_DETAILS(data[i].idMeal)
                .then(details => {
                    section_cards.insertAdjacentHTML('beforeend', `
                        <div class="section__cards-meal">
                            <div class="section__cards-meal--thumb">
                                <img src="${data[i].strMealThumb}" />
                            </div>
                            <div class="section__cards-meal--name section__cards-meal--data">
                                <p>${data[i].strMeal}</p>
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
                            <button class="section__cards-meal--more-btn">+</button>
                        </div>
                    `);
                });
        };
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
        if (form_data.name !== undefined) {
            FETCH_BY_NAME(form_data)
                .then(data => {
                    DISPLAY_SEARCH(data);
                });
        } else if (form_data.category !== undefined) {
            FETCH_BY_CATEGORY(form_data)
                .then(data => {
                    DISPLAY_SEARCH(data);
                });
        } else if (form_data.type !== undefined) {
            FETCH_BY_TYPE(form_data)
                .then(data => {
                    DISPLAY_SEARCH(data);
                });
        };
    });
});