import {
	IonButton,
	IonButtons,
	IonCard,
	IonCardContent,
	IonCardHeader,
	IonContent,
	IonFab,
	IonFabButton,
	IonHeader,
	IonIcon,
	IonItem,
	IonLabel,
	IonPage,
	IonTitle,
	IonToolbar,
	useIonRouter,
	useIonViewDidEnter,
	useIonViewWillEnter,
} from '@ionic/react';
import React from 'react';
import useIsToken from '../hooks/useIsToken';
import { deleteCookie, getOneCookie } from '../utils/capacitor-plugins/cookies';
import { logOutOutline } from 'ionicons/icons';

export type Battle = {
	_id: string;
	category: string;
	created_at: string;
	propositions: {
		_id: string;
		value: number;
		name: string;
	}[];
	question: string;
	texte: string;
	userVote?: {
		_id: string;
		name: string;
		user_id: string;
		battle_id: string;
	};
};

const Battles: React.FC = () => {
	const { checkIfTokenCookieExistsAndRedirectIfNot } = useIsToken();

	/*
    _id: "66c88c81a453e23b48444d49"
​​
category: "Sport"
​​
created_at: "2024-08-23T13:20:01.710Z"
​​
propositions: Array [ {…}, {…} ]
​​
question: "Ski ou Snowboard ?"
​​
texte: "Pour la glisse, vous êtes plutôt ..."
    */

	const [battles, setBattles] = React.useState<Battle[]>([]);

	const router = useIonRouter();

	checkIfTokenCookieExistsAndRedirectIfNot();

	const handleSignOut = () => {
		deleteCookie('token');
		deleteCookie('user');
		router.push('/home', 'back');
	};

	const handleVote = async (elementToVote: string, battleId: string) => {
		console.log(elementToVote);
		const request = await fetch(
			`https://api.which-one-battle.julienpoirier-webdev.com/api/battles/${battleId}/vote`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${getOneCookie('token')}`,
				},
				body: JSON.stringify({ name: elementToVote }),
			}
		);

		const response = await request.json();

		console.log(response);
	};

	useIonViewDidEnter(() => {
		const getData = async () => {
			const response = await fetch(
				'https://api.which-one-battle.julienpoirier-webdev.com/api/battles/',
				{
					headers: {
						Authorization: `Bearer ${getOneCookie('token')}`,
					},
				}
			);
			const dataOfResponse = await response.json();

			setBattles(dataOfResponse);
		};

		getData();
	}, []);

	return (
		<IonPage>
			<IonHeader>
				<IonToolbar color='primary'>
					<IonTitle>Battles</IonTitle>
				</IonToolbar>
			</IonHeader>
			<IonContent className='ion-padding'>
				<IonFab slot='fixed' vertical='bottom' horizontal='end'>
					<IonFabButton onClick={handleSignOut}>
						<IonIcon icon={logOutOutline} />
					</IonFabButton>
				</IonFab>
				{battles
					//.filter((battle) => {
					//	return battle.category === 'Sport';
					//})
					.map((battle) => {
						return (
							<IonCard key={battle._id}>
								<IonCardHeader>
									<IonTitle>{battle.question}</IonTitle>
								</IonCardHeader>
								<IonCardContent>
									<IonItem>
										<IonTitle>{battle.texte}</IonTitle>
										<IonLabel>
											{battle.propositions[0].name} :
											{battle.propositions[0].value}
										</IonLabel>
										<IonLabel>
											{battle.propositions[1].name} :
											{battle.propositions[1].value}
										</IonLabel>
										{!battle.userVote && (
											<IonButtons>
												<IonButton
													onClick={(e) =>
														handleVote(
															battle
																.propositions[0]
																.name,
															battle._id
														)
													}
												>
													{
														battle.propositions[0]
															.name
													}
												</IonButton>
												<IonButton
													onClick={(e) =>
														handleVote(
															battle
																.propositions[1]
																.name,
															battle._id
														)
													}
												>
													{
														battle.propositions[1]
															.name
													}
												</IonButton>
											</IonButtons>
										)}
									</IonItem>
								</IonCardContent>
							</IonCard>
						);
					})}

				{/*
					[99,100,25,12,45,12]
					99 -> index 0
					100 -> index 1
					25 -> index 2

					[12,12,25,45,99,100]
					12 -> index 0
					25 -> index 1
					45 -> index 2

					Si vous utilisez index comme key, 
					React ne sait plus où il en est dans le tableau.

					Il faut utiliser une clé unique pour chaque élément.

					[{
					key: 1,
					value :99}
					{
					key: 2,
					value :100}
					{
					key: 3,
					value :25}
					{
					key: 4,
					value :12}
					{
					key: 5,
					value :45}
					{
					key: 6,
					value :12}
					]

					[{
					key: 4,
					value :12}
					{
					key: 6,
					value :12}
					{
					key: 3,
					value :25}
					{
					key: 5,
					value :45}
					{
					key: 1,
					value :99}
					{
					key: 2,
					value :100}
					]
				
				*/}
			</IonContent>
		</IonPage>
	);
};

export default Battles;
