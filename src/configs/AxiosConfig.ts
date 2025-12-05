// axios
import { getAccessToken } from '@/utils/cookies/cookieStorage';
import axios, { AxiosInstance } from 'axios';
import { isEmpty } from 'lodash';

const publicRequest: AxiosInstance = axios.create({
	baseURL: 'https://ecommerce-api-1-jkdw.onrender.com',
	timeout: 10000,
	headers: {
		Accept: 'application/json',
		'Content-Type': 'application/json',
	},
});

// Change request data/error here
publicRequest.interceptors.request.use(
	(config) => {
		if (typeof window === undefined) {
			return config;
		}
		const token = getAccessToken();
		config.headers.Authorization = !isEmpty(token) ? `Bearer ${token}` : '';
		return config;
	},
	(error) => {
		return Promise.reject(error);
	},
);

publicRequest.interceptors.response.use(
	(response) => response?.data || response?.data?.data || response,
	(error) => {
		// Handle errors globally (e.g., show a notification, redirect, etc.)
		console.error('Axios request failed:', error);
		return Promise.reject(error);
	},
);

export { publicRequest };
