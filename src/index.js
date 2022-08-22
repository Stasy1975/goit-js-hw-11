import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from 'notiflix';
import axios from 'axios';
const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '24763200-978795bf266706bc8b4393fbd';
const PARAMETRS = 'image_type=photo&orientation=horizontal&safesearch=true';

const formEl = document.querySelector('#search-form');
const refs = {
  inputEl: formEl.querySelector('input'),
  btnSearchEl: formEl.querySelector('button'),
  galleryEl: document.querySelector('.gallery'),
  btnMoreEl: document.querySelector('.load-more'),
  noMoreEl: document.querySelector('.no-more'),
};
const offLoadMore = () => refs.btnMoreEl.classList.add('invisible');
const onLoadMore = () => refs.btnMoreEl.classList.remove('invisible');

const offNoMore = () => refs.noMoreEl.classList.add('invisible');
const onNoMore = () => refs.noMoreEl.classList.remove('invisible');

const getUrl = () => {
  url = `${BASE_URL}?key=${API_KEY}&q=${nameImg}&${PARAMETRS}&page=${page}&per_page=${per_page}`;
};
let nameImg = '';
const per_page = 40;
let page = 1;
let url = '';
let lightbox = null;

getUrl();
offLoadMore();
offNoMore();

const renderGallery = ({ galleryArr, totalHits }) => {
  if (page === 1) {
    Notify.success(`Hoooray! We found ${totalHits} images!`);
  }
  const markupGallery = galleryArr
    .map(img => {
      return `
  <div class="card">
       <a href="${img.largeImageURL}">
        <img class="card__image" src="${img.webformatURL}" alt="${img.tags}" loading="lazy" />
        </a>
      <div class="card__info">
            <p class="card__info__item">
                <b>Сподобалось:${img.likes}</b>
            </p>
            <p class="card__info__item">
            <b>Переглянуто:${img.views}</b>
            </p>
            <p class="card__info__item">
            <b>Коментарі:${img.comments}</b>
            </p>
            <p class="card__info__item">
            <b>Завантажено:${img.downloads}</b>
            </p>
      </div>
  </div>
      `;
    })
    .join('');

  const isLastList = totalHits - page * per_page < totalHits % per_page;

  page += 1;

  return { isLastList, markupGallery };
};

const addGallery = ({ isLastList, markupGallery }) => {
  refs.galleryEl.insertAdjacentHTML('beforeend', markupGallery);
  if (!isLastList) {
    onLoadMore();
  } else {
    onNoMore();
  }

  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 11,
    behavior: 'smooth',
  });
};

const createLightBox = () => {
  lightbox = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionPosition: 'bottom',
    captionDelay: 250,
  });
};

const showGaleryPage = ({ galleryArr, totalHits }) => {
  const { isLastList, markupGallery } = renderGallery({
    galleryArr,
    totalHits,
  });
  addGallery({ isLastList, markupGallery });
};

const getPics = async url => {
  const response = await axios.get(url);
  const hitsArr = await response.data.hits;

  if (hitsArr.length === 0) {
    return Promise.reject(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  } else {
    return {
      galleryArr: hitsArr,
      totalHits: response.data.totalHits,
    };
  }
};
const showErrors = error => Notify.failure(error);

const startSearch = async event => {
  event.preventDefault();
  page = 1;
  offLoadMore();
  offNoMore();

  refs.galleryEl.innerHTML = '';
  nameImg = refs.inputEl.value;
  refs.inputEl.value = '';
  getUrl();

  await getPics(url).then(showGaleryPage).catch(showErrors);

  createLightBox();
  lightbox.on('');
};

const loadMore = async () => {
  offLoadMore();
  getUrl();

  await getPics(url).then(showGaleryPage).catch(showErrors);

  lightbox.refresh();
};

refs.btnSearchEl.addEventListener('click', startSearch);
refs.btnMoreEl.addEventListener('click', loadMore);
