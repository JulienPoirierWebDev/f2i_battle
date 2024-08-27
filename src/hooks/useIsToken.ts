import { useIonRouter, useIonViewWillEnter } from '@ionic/react';
import { getCookies } from '../utils/capacitor-plugins/cookies';

type UseIsToken = () => {
	checkIfTokenCookieExistsAndRedirectIfNot: () => void;
	checkIfTokenCookieExistsAndRedirectIf: () => void;
};

const useIsToken: UseIsToken = () => {
	const router = useIonRouter();

	const checkIfTokenCookieExistsAndRedirectIfNot = () => {
		useIonViewWillEnter(() => {
			try {
				const allCookies = getCookies().split(';');
				const cookiesObject = allCookies.map((cookie) => {
					const cookieArr = cookie.split('=');
					return {
						key: cookieArr[0].trim(),
						value: cookieArr[1].trim(),
					};
				});

				const tokenCookie = cookiesObject[1];

				if (tokenCookie.key === 'token') {
					console.log('Token cookie found');
				} else {
					throw new Error('Token cookie not found');
				}
			} catch (error) {
				router.push('/');
			}
		});
	};

	const checkIfTokenCookieExistsAndRedirectIf = () => {
		useIonViewWillEnter(() => {
			try {
				const allCookies = getCookies().split(';');
				const cookiesObject = allCookies.map((cookie) => {
					const cookieArr = cookie.split('=');
					return {
						key: cookieArr[0].trim(),
						value: cookieArr[1].trim(),
					};
				});

				const isToken = cookiesObject.find(
					(cookie) => cookie.key === 'token'
				);

				console.log(isToken);

				if (isToken) {
					router.push('/battles');
				} else {
					throw new Error('Token cookie not found');
				}
			} catch (error) {}
		});
	};

	return {
		checkIfTokenCookieExistsAndRedirectIfNot,
		checkIfTokenCookieExistsAndRedirectIf,
	};
};

export default useIsToken;
