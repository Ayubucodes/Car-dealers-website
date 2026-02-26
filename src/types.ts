export interface ApiMake {
  id: number;
  name: string;
}

export interface ApiModel {
  id: number;
  make_id: number;
  name: string;
}

export interface ApiCar {
  id: number;
  car_name: string;
  make_id: number;
  model_id: number;
  year: number;
  condition: string;
  mileage: number;
  transmission: string;
  current_price: number;
  old_price?: number;
  status?: string;
  body_style?: string;
  fuel_economy?: string;
  fuel_type?: string;
  image_1?: string | null;
  image_2?: string | null;
  image_3?: string | null;
  image_4?: string | null;
  image_5?: string | null;
  created_at?: string;
  updated_at?: string;
  make?: ApiMake;
  model?: ApiModel;
}

export interface ApiCarsResponse {
  data: ApiCar[];
}

// Shape expected by CarCard component
export interface UiCar {
  id: number;
  name: string;
  year: number;
  price: number;
  mileage: string;
  fuelType: string;
  transmission: string;
  bodyType: string;
  condition: string;
  image: string;
}

export interface ApiMessagePayload {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export interface ApiMessage {
  id: number;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  created_at?: string;
  updated_at?: string;
}

export interface ApiSendMessageResponse {
  message: string;
  data: ApiMessage;
}

export interface ApiTeamMember {
  id: number;
  name: string;
  role: string;
  image?: string | null;
  image_url?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface ApiTeamMembersResponse {
  data: ApiTeamMember[];
  meta?: unknown;
  links?: unknown;
}

// Auth
export interface ApiUser {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  role: string;
  email_verified_at?: string | null;
  two_factor_confirmed_at?: string | null;
  current_team_id?: string | null;
  profile_photo_path?: string | null;
  created_at: string;
  updated_at: string;
  profile_photo_url?: string;
}

export interface ApiAuthResponse {
  message: string;
  user: ApiUser;
  token: string;
}

export interface ApiRegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface ApiLoginPayload {
  email: string;
  password: string;
}

export interface ApiCreateOrderPayload {
  car_id: string | number;
  user_phone: string;
  user_address: string;
  state: string;
  zip: string;
}

export interface ApiOrder {
  id: number;
  user_id: number;
  car_id: number;
  customer_name: string;
  user_email: string;
  user_phone: string;
  user_address: string;
  state: string;
  zip: string;
  car_name: string;
  car_price: number;
  order_status: string;
  created_at: string;
  updated_at: string;
}

export interface ApiCreateOrderResponse {
  message: string;
  order: ApiOrder;
}

export interface ApiNewsletterSubscribePayload {
  email: string;
}

export interface ApiNewsletterSubscriber {
  id: number;
  email: string;
  name?: string | null;
  created_at: string;
  updated_at: string;
}

export interface ApiNewsletterSubscribeResponse {
  message: string;
  data: ApiNewsletterSubscriber;
}

export interface ApiFavorite {
  id: number;
  user_id: number;
  car_id: number;
  created_at?: string;
  updated_at?: string;
  car?: unknown;
}

export interface ApiFavoritesResponse {
  data: ApiFavorite[];
  meta?: unknown;
  links?: unknown;
}

