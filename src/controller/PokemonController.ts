import { Request, Response } from 'express';
import { Pokemon } from '../entity/Pokemon';
import axios from 'axios';

interface pokeListApiResponse {
	count: number;
	next: string;
	previous: string | null;
	results: {
		name: string;
		url: string;
	};
}

interface pokeList {
	name: string;
	url: string;
}

interface pokeApiResponse {
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

export const getPokemons = async (req: Request, res: Response) => {
	const { limit, offset } = req.query;

	try {
		const pokemonApiResponse = await axios.get(
			`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`
		);

		console.log(pokemonApiResponse);
		const savedPokemons = await Promise.all(
			pokemonApiResponse.data.results.map(async (poke: pokeList) => {
				const pokeFromDb = await Pokemon.findOne({
					where: { name: poke.name },
				});

				if (pokeFromDb) {
					return pokeFromDb;
				}

				const res = await axios.get(poke.url);

				const apiPokemon = res.data as pokeApiResponse;

				const stats = apiPokemon.stats.reduce((obj, item) => {
					return {
						...obj,
						[item.stat.name]: item.base_stat,
					};
				}, {});

				const formatedPokemonDB = await Pokemon.create({
					pokeId: apiPokemon.id,
					name: apiPokemon.name,
					img_url: apiPokemon.sprites.front_default,
					weight: apiPokemon.weight,
					height: apiPokemon.height,
					abilities: apiPokemon.abilities.map(
						(ability) => ability.ability.name
					),
					stats,
					types: apiPokemon.types.map((type) => type.type.name),
				}).save();

				return formatedPokemonDB;
			})
		);
		console.log(savedPokemons);
		return res.status(200).json({ pokemons: savedPokemons });
	} catch (err) {
		console.log(err);
		return res.status(400).json({ error: 'Something went wrong' });
	}
};
