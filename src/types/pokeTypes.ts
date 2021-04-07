export interface pokeListApiResponse {
	count: number;
	next: string;
	previous: string | null;
	results: [
		{
			name: string;
			url: string;
		}
	];
}

export interface pokeList {
	name: string;
	url: string;
}

export interface pokeApiResponse {
	base_experience: number;
	height: number;
	id: number;
	name: string;
	weight: number;
	sprites: {
		front_default: string;
	};
	abilities: [
		{
			ability: {
				name: string;
				url: string;
			};
		}
	];
	stats: [
		{
			base_stat: 48;
			stat: {
				name: string;
			};
		}
	];
	types: [
		{
			slot: number;
			type: {
				name: string;
				url: string;
			};
		}
	];
}
