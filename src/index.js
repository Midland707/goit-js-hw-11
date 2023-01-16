// Завдання - пошук зображень
// Створи фронтенд частину застосунку пошуку і перегляду зображень за ключовим словом.
// Додай оформлення елементів інтерфейсу.Подивись демо - відео роботи застосунку.

// HTTP-запити
// Для бекенду використовуй публічний API сервісу Pixabay. Зареєструйся, отримай свій унікальний ключ доступу і ознайомся з документацією.

// Список параметрів рядка запиту, які тобі обов'язково необхідно вказати:

// key - твій унікальний ключ доступу до API.
// q - термін для пошуку. Те, що буде вводити користувач.
// image_type - тип зображення. На потрібні тільки фотографії, тому постав значення photo.
// orientation - орієнтація фотографії. Постав значення horizontal.
// safesearch - фільтр за віком. Постав значення true.
// У відповіді буде масив зображень, що задовольнили критерії параметрів запиту.Кожне зображення описується об'єктом,
// з якого тобі цікаві тільки наступні властивості:

// webformatURL - посилання на маленьке зображення для списку карток.
// largeImageURL - посилання на велике зображення.
// tags - рядок з описом зображення. Підійде для атрибуту alt.
// likes - кількість лайків.
// views - кількість переглядів.
// comments - кількість коментарів.
// downloads - кількість завантажень.
// Якщо бекенд повертає порожній масив, значить нічого підходящого не було знайдено.
// У такому разі показуй повідомлення з текстом "Sorry, there are no images matching your search query. Please try again.".
// Для повідомлень використовуй бібліотеку notiflix.

// Галерея і картка зображення
// Елемент div.gallery спочатку міститься в HTML документі, і в нього необхідно рендерити розмітку карток зображень.
// Під час пошуку за новим ключовим словом необхідно повністю очищати вміст галереї, щоб не змішувати результати.

// <div class="gallery">
//   <!-- Картки зображень -->
// </div>

// Шаблон розмітки картки одного зображення для галереї.

// <div class="photo-card">
//   <img src="" alt="" loading="lazy" />
//   <div class="info">
//     <p class="info-item">
//       <b>Likes</b>
//     </p>
//     <p class="info-item">
//       <b>Views</b>
//     </p>
//     <p class="info-item">
//       <b>Comments</b>
//     </p>
//     <p class="info-item">
//       <b>Downloads</b>
//     </p>
//   </div>
// </div>

// Пагінація
// Pixabay API підтримує пагінацію і надає параметри page і per_page. Зроби так, щоб в кожній відповіді приходило 40 об'єктів (за замовчуванням 20).

// Початкове значення параметра page повинно бути 1.
// З кожним наступним запитом, його необхідно збільшити на 1.
// У разі пошуку за новим ключовим словом, значення page потрібно повернути до початкового, оскільки буде пагінація по новій колекції зображень.
// HTML документ вже містить розмітку кнопки, по кліку на яку, необхідно виконувати запит за наступною групою зображень
// і додавати розмітку до вже існуючих елементів галереї.

// <button type="button" class="load-more">Load more</button>

// В початковому стані кнопка повинна бути прихована.
// Після першого запиту кнопка з'являється в інтерфейсі під галереєю.
// При повторному сабміті форми кнопка спочатку ховається, а після запиту знову відображається.
// У відповіді бекенд повертає властивість totalHits - загальна кількість зображень,
//     які відповідають критерію пошуку(для безкоштовного акаунту).Якщо користувач дійшов до кінця колекції,
//         ховай кнопку і виводь повідомлення з текстом "We're sorry, but you've reached the end of search results.".

// Повідомлення
// Після першого запиту з кожним новим пошуком отримувати повідомлення, в якому буде написано,
//     скільки всього знайшли зображень(властивість totalHits).Текст повідомлення - "Hooray! We found totalHits images."

// Прокручування сторінки
// Зробити плавне прокручування сторінки після запиту і відтворення кожної наступної групи зображень.
// Ось тобі код - підказка, але розберися у ньому самостійно.
// const { height: cardHeight } = document
//   .querySelector('.gallery')
//   .firstElementChild.getBoundingClientRect();

// window.scrollBy({
//   top: cardHeight * 2,
//   behavior: 'smooth',
// });

// Нескінченний скрол
// Замість кнопки «Load more», можна зробити нескінченне завантаження зображень під час прокручування сторінки.
// Ми надаємо тобі повну свободу дій в реалізації, можеш використовувати будь - які бібліотеки.

// all modules
import Notiflix from 'notiflix';

import axios from 'axios';
//const axios = require('axios'); // legacy way

// Описаний в документації
import SimpleLightbox from 'simplelightbox';
// Додатковий імпорт стилів
import 'simplelightbox/dist/simple-lightbox.min.css';

const searchInput = document.querySelector('.search-form input');
const searchButton = document.querySelector('.search-form');
const galleryList = document.querySelector('.gallery');

let search = '';

searchInput.addEventListener('input', onInput);
function onInput() {
  search = searchInput.value;
}

const BASE_URL = 'https://pixabay.com/api/';
const key = '32874218-f955783fbc8df841e2f172dbc';
const imgOnPage = 40;
let pageNumber = 1;
// https://pixabay.com/api/?key=32874218-f955783fbc8df841e2f172dbc&q=SEARCH&image_type=photo&orientation=horizontal&safesearch=true
searchButton.addEventListener('submit', createGallery);
async function createGallery(event) {
  try {
    event.preventDefault();
   document.querySelectorAll('.gallery__item').forEach(e => e.remove());
    const response = await axios.get(
      `${BASE_URL}?key=${key}&q=${search}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${imgOnPage}&page=${pageNumber}`
    );
    if (response.data.totalHits === 0 || search === '')
      return Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    Notiflix.Notify.success(
      `Hooray! We found ${response.data.totalHits} images.`
    );

    const items = response.data.hits.reduce(
  (acc, { largeImageURL, webformatURL, tags, likes, views, comments, downloads}) =>
    acc +
    `<a class="gallery__item" href="${largeImageURL}">
    <div class="photo-card">
      <img class="gallery__image" src="${webformatURL}" alt="${tags}" loading="lazy" />
      <div class="info">
      <p class="info-item">
        <b>Likes</b>
        ${likes}
      </p>
      <p class="info-item">
        <b>Views</b>
      ${views}
    </p>
    <p class="info-item">
      <b>Comments</b>
      ${comments}
    </p>
    <p class="info-item">
      <b>Downloads</b>
      ${downloads}
    </p>
  </div>
</div>
</a>
`,
  ''
      );
 galleryList.insertAdjacentHTML('beforeend', items);
new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});
  } catch (error) {
    console.error(error);
  }
}
