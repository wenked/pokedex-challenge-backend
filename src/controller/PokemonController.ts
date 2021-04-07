import { Request, Response } from 'express';
import { Pokemon } from '../entity/Pokemon';
import axios from 'axios';
import {
	pokeListApiResponse,
	pokeList,
	pokeApiResponse,
} from '../types/pokeTypes';

export const getPokemons = async (req: Request, res: Response) => {
	const { limit, offset } = req.query;

	try {
		const ApiRes = await axios.get(
			`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`
		);
		console.log(res);
		const pokemonApi = ApiRes.data as pokeListApiResponse;

		const savedPokemons = await Promise.all(
			pokemonApi.results.map(async (poke: pokeList) => {
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
		return res.status(200).json({
			count: pokemonApi.count,
			previous: pokemonApi.previous,
			next: pokemonApi.next,
			pokemons: savedPokemons,
		});
	} catch (err) {
		console.log(err);
		return res.status(400).json({ error: 'Something went wrong' });
	}
};
