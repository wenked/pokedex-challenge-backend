import { Router, Response, Request } from 'express';
import { getPokemons } from './controller/PokemonController';

const routes = Router();

routes.get('/pokemons', getPokemons);

export default routes;
