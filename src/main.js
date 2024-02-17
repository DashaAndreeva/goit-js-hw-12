'use strict';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import 'simplelightbox/dist/simple-lightbox.min.css';

import { getPhotosByRequest } from './js/pixabay-api';
import { renderPhotos } from './js/render-function';
import { refs } from './js/render-function';

import imgIcon from './img/icon.png';

let userInput;
let page;
let maxPage;

hideLoader();

refs.form.addEventListener('submit', onFormSubmit);
refs.buttonLoader.addEventListener('click', onLoadMoreClick);

async function onFormSubmit(e) {
  clearGallery();

  e.preventDefault();

  userInput = refs.input.value.trim();

  if (userInput === '') {
    iziToast.error({
      message: 'Please enter a search query.',
      position: 'topRight',
      transitionIn: 'fadeInLeft',
    });
    return;
  }
  refs.gallery.innerHTML = '';
  showLoader();
  hideLoadBtn();
  const userRequest = e.target.elements.search.value.trim();
  try {
    const data = await getPhotosByRequest(userRequest, page);
    maxPage = Math.ceil(data.totalHits / 15);
    page = 1;
    if (data.hits.length === 0) {
      hideLoader();
      iziToast.error({
        message:
          'Sorry, there are no images matching your search query. Please try again!',
        position: 'topRight',
        transitionIn: 'fadeInLeft',
      });
    } else {
      renderPhotos(data.hits);
    }
  } catch (err) {
    iziToast.error({
      message: err.message || 'An error occurred. Please try again later.',
      position: 'topRight',
      transitionIn: 'fadeInLeft',
    });
  }
  hideLoader();

  checkBtnVisibleStatus();

  e.target.reset();
}

async function onLoadMoreClick() {
  page += 1;
  showLoader();
  const data = await getPhotosByRequest(userInput, page);
  hideLoader();
  renderPhotos(data.hits);
  checkBtnVisibleStatus();

  const height = refs.gallery.firstElementChild.getBoundingClientRect().height;

  scrollBy({
    behavior: 'smooth',
    top: height * 2,
  });
}

function showLoadBtn() {
  refs.buttonLoader.classList.remove('hidden');
}
function hideLoadBtn() {
  refs.buttonLoader.classList.add('hidden');
}

function showLoader() {
  refs.loader.style.display = 'block';
}
function hideLoader() {
  refs.loader.style.display = 'none';
}

function clearGallery() {
  refs.gallery.innerHTML = '';
}

function checkBtnVisibleStatus() {
  if (page >= maxPage) {
    hideLoadBtn();
    hideLoader();
    iziToast.show({
      message: `We're sorry, but you've reached the end of search results.`,
      position: 'topRight',
      color: 'blue',
      iconUrl: imgIcon,
      transitionIn: 'fadeInLeft',
    });
  } else {
    showLoadBtn();
  }
}
