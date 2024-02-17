export function getPhotosByRequest(userRequest) {
  const API_KEY = '42307458-71f98d2a331f0bd294b8fc1ec';

  const BASE_URL = 'https://pixabay.com';
  const END_POINTS = '/api/';
  const PARAMS = `?key=${API_KEY}&q=${userRequest}&image_type=photo&orientation=horizontal&safesearch=true`;

  const url = BASE_URL + END_POINTS + PARAMS;

  return fetch(url).then(res => res.json());
}
