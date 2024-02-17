'use strict';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import 'simplelightbox/dist/simple-lightbox.min.css';

import { getPhotosByRequest } from './js/pixabay-api';
import { renderPhotos } from './js/render-function';
import { refs } from './js/render-function';

refs.loader.style.display = 'none';

refs.form.addEventListener('submit', onFormSubmit);

function onFormSubmit(e) {
  clearGallery();

  e.preventDefault();
  const userInput = refs.input.value.trim();
  if (userInput === '') {
    iziToast.error({
      message: 'Please enter a search query.',
      position: 'topRight',
      transitionIn: 'fadeInLeft',
    });
    return;
  }
  refs.gallery.innerHTML = '';
  refs.loader.style.display = 'block';

  const userRequest = e.target.elements.search.value;
  getPhotosByRequest(userRequest)
    .then(data => {
      if (data.hits.length === 0) {
        refs.loader.style.display = 'none';
        iziToast.error({
          message:
            'Sorry, there are no images matching your search query. Please try again!',
          position: 'topRight',
          transitionIn: 'fadeInLeft',
        });
      } else {
        renderPhotos(data.hits);
      }
    })
    .catch(err => {
      iziToast.error({
        message: err.message || 'An error occurred. Please try again later.',
        position: 'topRight',
        transitionIn: 'fadeInLeft',
      });
    })
    .finally(() => {
      refs.loader.style.display = 'none';
    });

  e.target.reset();
}

function clearGallery() {
  refs.gallery.innerHTML = '';
}
