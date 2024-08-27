import { CapacitorCookies } from '@capacitor/core';

const getCookies = () => {
	return document.cookie;
};

const getOneCookie = (key: string) => {
	const cookies = getCookies();
	const cookie = cookies.split(';').find((cookie) => {
		return cookie.includes(key);
	});

	return cookie?.split('=')[1];
};

const setCookie = (key: string, value: string) => {
	document.cookie = key + '=' + value;
};

const setCapacitorCookie = async (key: string, value: string) => {
	await CapacitorCookies.setCookie({
		url: 'https://api.which-one-battle.julienpoirier-webdev.com',
		key,
		value,
	});
};

const deleteCookie = async (key: string) => {
	await CapacitorCookies.deleteCookie({
		url: 'https://api.which-one-battle.julienpoirier-webdev.com',
		key,
	});
};

const clearAllCookies = async () => {
	await CapacitorCookies.clearAllCookies();
};

export {
	getCookies,
	getOneCookie,
	setCapacitorCookie,
	deleteCookie,
	clearAllCookies,
	setCookie,
};
