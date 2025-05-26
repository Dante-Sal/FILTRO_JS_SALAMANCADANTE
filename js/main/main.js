const section_cards = document.querySelector('.section__cards');

async function FETCH_RANDOM() {
    const response = await axios.get('https://www.themealdb.com/api/json/v1/1/random.php');
    const data = response.data.meals[0];
    return data;
};

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
            <button class="section__cards-meal--more-btn">+</button>
        </div>
    `);
};

for (let i = 0; i < 30; i++) {
    FETCH_RANDOM()
        .then(data => {
            DISPLAY_DISH(data);
        });
};