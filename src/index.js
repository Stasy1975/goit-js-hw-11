import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from 'notiflix';
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
  <div class="photo-card">
       <a href="${img.largeImageURL}">
        <img class="gallery__image" src="${img.webformatURL}" alt="${img.tags}" loading="lazy" />
        </a>
      <div class="info">
            <p class="info-item">
                <b>Likes<br>${img.likes}</b>
            </p>
            <p class="info-item">
            <b>Views<br>${img.views}</b>
            </p>
            <p class="info-item">
            <b>Comments<br>${img.comments}</b>
            </p>
            <p class="info-item">
            <b>Downloads<br>${img.downloads}</b>
            </p>
      </div>
  </div>
      `;
    })
    .join('');

  const isLastRender =
    totalHits - currentPage * per_page < totalHits % per_page;

  currentPage += 1;

  return { isLastRender, markupGallery };
};
