import { API_BASE_URL } from "../constants";

const CARS_ENDPOINT = `${API_BASE_URL}/api/cars`;
const CARS_FILTER_ENDPOINT = `${API_BASE_URL}/api/cars/filter`;
const CARS_META_ENDPOINT = `${API_BASE_URL}/api/cars/meta`;
const CARS_BODY_STYLE_ENDPOINT = `${API_BASE_URL}/api/cars/body-style`;
const CARS_MAKE_ENDPOINT = `${API_BASE_URL}/api/cars/make`;
const MESSAGES_ENDPOINT = `${API_BASE_URL}/api/messages`;
const TEAM_MEMBERS_ENDPOINT = `${API_BASE_URL}/api/team-members`;
const REGISTER_ENDPOINT = `${API_BASE_URL}/api/register`;
const LOGIN_ENDPOINT = `${API_BASE_URL}/api/login`;
const ORDERS_ENDPOINT = `${API_BASE_URL}/api/orders`;
const NEWSLETTER_SUBSCRIBE_ENDPOINT = `${API_BASE_URL}/api/newsletter/subscribe`;
const FAVORITES_ENDPOINT = `${API_BASE_URL}/api/favorites`;
const MAKES_ENDPOINT = `${API_BASE_URL}/api/makes`;
const BODY_STYLES_ENDPOINT = `${API_BASE_URL}/api/body-styles`;

export async function fetchJson(url, init) {
  const res = await fetch(url, init);
  if (!res.ok) {
    let message = `Request failed: ${res.status} ${res.statusText}`;
    try {
      const errData = await res.json();
      if (errData.message) {
        message = errData.message;
      }
    } catch {
      // ignore JSON parse error
    }
    throw new Error(message);
  }
  return await res.json();
}

export async function sendMessage(payload) {
  return await fetchJson(MESSAGES_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
}

export async function fetchTeamMembers({ page, per_page } = {}) {
  const params = new URLSearchParams();
  if (page != null && String(page).trim() !== '') params.set('page', String(page));
  if (per_page != null && String(per_page).trim() !== '') params.set('per_page', String(per_page));

  const url = params.toString() ? `${TEAM_MEMBERS_ENDPOINT}?${params.toString()}` : TEAM_MEMBERS_ENDPOINT;
  return await fetchJson(url);
}

export function resolveCarImageUrl(imagePath) {
  if (!imagePath) return "";
  if (/^https?:\/\//i.test(imagePath)) return imagePath;
  return `${API_BASE_URL}/storage/${imagePath}`;
}

export function mapApiCarToUiCar(car) {
  return {
    id: car.id,
    uuid: car.uuid,
    name: car.car_name,
    year: car.year,
    price: car.current_price,
    mileage: car.mileage ? `${Number(car.mileage).toLocaleString()} km` : "",
    fuelType: car.fuel_type || "",
    transmission: car.transmission,
    bodyType: car.body_style ?? "",
    condition: car.condition,
    image: resolveCarImageUrl(car.image_1),
    created_at: car.created_at,
  };
}

export function mapApiCarImages(car) {
  const paths = [car?.image_1, car?.image_2, car?.image_3, car?.image_4, car?.image_5];
  return paths.map(resolveCarImageUrl).filter(Boolean);
}

export async function fetchCars() {
  const res = await fetchJson(CARS_ENDPOINT);
  return Array.isArray(res?.data) ? res.data : [];
}

export async function fetchCarsPage({
  q,
  min_price,
  max_price,
  condition,
  sort,
  page,
  per_page,
  make_id,
  model_id,
  year,
  body_style,
  mileage_range,
} = {}) {
  const params = new URLSearchParams();

  if (q) params.set('q', q);
  if (min_price != null && String(min_price).trim() !== '') params.set('min_price', String(min_price));
  if (max_price != null && String(max_price).trim() !== '') params.set('max_price', String(max_price));
  if (condition) params.set('condition', condition);
  if (sort) params.set('sort', sort);
  if (page != null && String(page).trim() !== '') params.set('page', String(page));
  if (per_page != null && String(per_page).trim() !== '') params.set('per_page', String(per_page));
  if (make_id != null && String(make_id).trim() !== '') params.set('make_id', String(make_id));
  if (model_id != null && String(model_id).trim() !== '') params.set('model_id', String(model_id));
  if (year != null && String(year).trim() !== '') params.set('year', String(year));
  if (body_style) params.set('body_style', body_style);
  if (mileage_range) params.set('mileage_range', mileage_range);

  const url = params.toString() ? `${CARS_FILTER_ENDPOINT}?${params.toString()}` : CARS_FILTER_ENDPOINT;
  const res = await fetchJson(url);
  return {
    data: Array.isArray(res?.data) ? res.data : [],
    meta: res?.meta || null,
    links: res?.links || null,
  };
}

export async function fetchCarsUiPage(filters = {}) {
  const res = await fetchCarsPage(filters);
  return {
    ...res,
    data: res.data.map(mapApiCarToUiCar),
  };
}

export async function fetchCarsByBodyStyle(bodyStyle, { page, per_page } = {}) {
  const params = new URLSearchParams();
  if (page != null && String(page).trim() !== '') params.set('page', String(page));
  if (per_page != null && String(per_page).trim() !== '') params.set('per_page', String(per_page));

  const qs = params.toString();
  const url = `${CARS_BODY_STYLE_ENDPOINT}/${encodeURIComponent(bodyStyle)}${qs ? `?${qs}` : ''}`;
  const res = await fetchJson(url);
  return {
    data: Array.isArray(res?.data) ? res.data : [],
    meta: res?.meta || null,
    links: res?.links || null,
  };
}

export async function fetchCarsUiByBodyStyle(bodyStyle, pagination = {}) {
  const res = await fetchCarsByBodyStyle(bodyStyle, pagination);
  return {
    ...res,
    data: res.data.map(mapApiCarToUiCar),
  };
}

export async function fetchCarsByMake(makeId, { page, per_page } = {}) {
  const params = new URLSearchParams();
  if (page != null && String(page).trim() !== '') params.set('page', String(page));
  if (per_page != null && String(per_page).trim() !== '') params.set('per_page', String(per_page));

  const qs = params.toString();
  const url = `${CARS_MAKE_ENDPOINT}/${encodeURIComponent(makeId)}${qs ? `?${qs}` : ''}`;
  const res = await fetchJson(url);
  return {
    data: Array.isArray(res?.data) ? res.data : [],
    meta: res?.meta || null,
    links: res?.links || null,
  };
}

export async function fetchCarsUiByMake(makeId, pagination = {}) {
  const res = await fetchCarsByMake(makeId, pagination);
  return {
    ...res,
    data: res.data.map(mapApiCarToUiCar),
  };
}

export async function fetchCarsMeta({ make_id, model_id } = {}) {
  const params = new URLSearchParams();
  if (make_id != null && String(make_id).trim() !== '') params.set('make_id', String(make_id));
  if (model_id != null && String(model_id).trim() !== '') params.set('model_id', String(model_id));

  const url = params.toString() ? `${CARS_META_ENDPOINT}?${params.toString()}` : CARS_META_ENDPOINT;
  const res = await fetchJson(url);
  return res?.data || { makes: [], models: [], years: [], mileage_ranges: [] };
}

export async function fetchMakeCount(makeId) {
  const res = await fetchJson(`${MAKES_ENDPOINT}/${encodeURIComponent(String(makeId))}/count`);
  return {
    count: Number(res?.count) || 0,
  };
}

export async function fetchBodyStyles() {
  const res = await fetchJson(BODY_STYLES_ENDPOINT);
  if (Array.isArray(res?.data)) return res.data;
  if (Array.isArray(res)) return res;
  return [];
}

export async function fetchBodyStyleCount(bodyStyleName) {
  const res = await fetchJson(`${BODY_STYLES_ENDPOINT}/${encodeURIComponent(String(bodyStyleName))}/count`);
  return {
    count: Number(res?.count) || 0,
  };
}

export async function fetchCarsUi() {
  const list = await fetchCars();
  return list.map(mapApiCarToUiCar);
}

export async function fetchCarByUuid(uuid) {
  let page = 1;
  const per_page = 100;
  while (true) {
    const res = await fetchCarsPage({ page, per_page });
    const found = res.data.find((c) => c?.uuid === uuid);
    if (found) return found;
    if (page >= res.meta.last_page) break;
    page++;
  }
  return null;
}

// Auth helpers
export async function register(payload) {
  return await fetchJson(REGISTER_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
}

export async function login(payload) {
  return await fetchJson(LOGIN_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
}

export async function createOrder(payload) {
  const token = localStorage.getItem('auth_token');

  return await fetchJson(ORDERS_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });
}

export async function subscribeNewsletter(payload) {
  return await fetchJson(NEWSLETTER_SUBSCRIBE_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
}

export async function fetchLikeStatus(carId) {
  const token = localStorage.getItem('auth_token');

  const res = await fetchJson(`${CARS_ENDPOINT}/${encodeURIComponent(String(carId))}/like`, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  return {
    liked: Boolean(res?.liked),
  };
}

export async function likeCar(carId) {
  const token = localStorage.getItem('auth_token');
  if (!token) throw new Error('Please login first to like a car');

  return await fetchJson(`${CARS_ENDPOINT}/${encodeURIComponent(String(carId))}/like`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function unlikeCar(carId) {
  const token = localStorage.getItem('auth_token');
  if (!token) throw new Error('Please login first to unlike a car');

  return await fetchJson(`${CARS_ENDPOINT}/${encodeURIComponent(String(carId))}/like`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function fetchFavorites({ page, per_page } = {}) {
  const token = localStorage.getItem('auth_token');
  if (!token) throw new Error('Please login first to view favorites');

  const params = new URLSearchParams();
  if (page != null && String(page).trim() !== '') params.set('page', String(page));
  if (per_page != null && String(per_page).trim() !== '') params.set('per_page', String(per_page));

  const url = params.toString() ? `${FAVORITES_ENDPOINT}?${params.toString()}` : FAVORITES_ENDPOINT;
  const res = await fetchJson(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return {
    data: Array.isArray(res?.data) ? res.data : [],
    meta: res?.meta || null,
    links: res?.links || null,
  };
}

export async function fetchFeaturedCarsPage(page = 1, per_page = 10) {
  const params = new URLSearchParams({ page: String(page), per_page: String(per_page) });
  const url = `${CARS_ENDPOINT}/featured?${params}`;
  return await fetchJson(url);
}

export async function fetchAllFeaturedCars() {
  const allData = [];
  let page = 1;
  while (true) {
    const res = await fetchFeaturedCarsPage(page);
    allData.push(...res.data);
    if (page >= res.meta.last_page) break;
    page++;
  }
  return allData;
}

export async function fetchRelatedCars(makeId, excludeId) {
  const params = new URLSearchParams();
  if (excludeId != null) params.set('exclude_id', String(excludeId));
  const query = params.toString();
  const url = query ? `${CARS_ENDPOINT}/related/${encodeURIComponent(makeId)}?${query}` : `${CARS_ENDPOINT}/related/${encodeURIComponent(makeId)}`;
  const res = await fetchJson(url);
  return res.data ? res.data.map(mapApiCarToUiCar) : [];
}
