const body = document.querySelector('body');
const loader_container = document.querySelector('.loader__container');

function SHOW_LOADER() {
    body.style.overflow = 'hidden';
    loader_container.style.opacity = '100%';
    loader_container.style.top = '0';
};

function HIDE_LOADER() {
    body.style.overflow = 'auto';
    loader_container.style.opacity = '0';
    loader_container.style.top = '-1000vw';
};

window.addEventListener('DOMContentLoaded', () => {
    SHOW_LOADER();
});

window.addEventListener('load', () => {
    setTimeout(HIDE_LOADER, 10000);
});