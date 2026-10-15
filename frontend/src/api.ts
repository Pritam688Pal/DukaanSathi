import axios from 'axios';
export const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api', withCredentials: true });
api.interceptors.response.use(r=>r, e=>Promise.reject(new Error(e.response?.data?.error || 'Could not connect. Please try again.')));
export const money=(paise:number)=>new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:2}).format((paise||0)/100);
