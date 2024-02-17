'use strict';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import 'simplelightbox/dist/simple-lightbox.min.css';

import { getPhotosByRequest } from './js/pixabay-api';
import { renderPhotos } from './js/render-function';
import { refs } from './js/render-function';

import imgIcon from './img/icon.png';

class FormHandler {
  constructor() {
    this.userInput = '';
    this.page = 1;
    this.maxPage = undefined;
  }

  async onFormSubmit(e) {
    e.preventDefault();
    this.clearGallery();
    this.page = 1;
    this.userInput = refs.input.value.trim();

    if (this.userInput === '') {
      iziToast.error({
        message: 'Please enter a search query.',
        position: 'topRight',
        transitionIn: 'fadeInLeft',
      });
      return;
    }

    refs.gallery.innerHTML = '';
    this.showLoader();
    this.hideLoadBtn();
    try {
      const data = await getPhotosByRequest(this.userInput, this.page);
      this.maxPage = Math.ceil(data.totalHits / 15);
      if (data.hits.length === 0) {
        this.hideLoader();
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
    this.hideLoader();
    this.checkBtnVisibleStatus();
    e.target.reset();
  }

  async onLoadMoreClick() {
    this.page += 1;
    this.showLoader();
    try {
      const data = await getPhotosByRequest(this.userInput, this.page);
      this.hideLoader();
      if (data.hits.length > 0) {
        renderPhotos(data.hits);
        const firstPhotoElement = refs.gallery.firstElementChild;
        if (firstPhotoElement) {
          const height = firstPhotoElement.getBoundingClientRect().height;
          scrollBy({
            behavior: 'smooth',
            top: height * 2,
          });
        }
      } else {
        iziToast.show({
          message: `We're sorry, but you've reached the end of search results.`,
          position: 'topRight',
          color: 'blue',
          iconUrl: imgIcon,
          transitionIn: 'fadeInLeft',
        });
      }
    } catch (err) {
      iziToast.error({
        message: err.message || 'An error occurred. Please try again later.',
        position: 'topRight',
        transitionIn: 'fadeInLeft',
      });
    }
    this.checkBtnVisibleStatus();
  }

  showLoadBtn() {
    refs.buttonLoader.classList.remove('hidden');
  }

  hideLoadBtn() {
    refs.buttonLoader.classList.add('hidden');
  }

  showLoader() {
    refs.loader.style.display = 'block';
  }

  hideLoader() {
    refs.loader.style.display = 'none';
  }

  clearGallery() {
    refs.gallery.innerHTML = '';
  }

  checkBtnVisibleStatus() {
    if (this.page >= this.maxPage) {
      this.hideLoadBtn();
      this.hideLoader();
      iziToast.show({
        message: `We're sorry, but you've reached the end of search results.`,
        position: 'topRight',
        color: 'blue',
        iconUrl: imgIcon,
        transitionIn: 'fadeInLeft',
      });
    } else {
      this.showLoadBtn();
    }
  }
}

const formHandler = new FormHandler();
refs.form.addEventListener('submit', e => formHandler.onFormSubmit(e));
refs.buttonLoader.addEventListener('click', () =>
  formHandler.onLoadMoreClick()
);
