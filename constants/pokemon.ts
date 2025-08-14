import { PokemonTypeName } from '../types/pokemon';

export const TYPE_COLORS: Record<PokemonTypeName, string> = {
  normal: '#A8A77A',
  fire: '#EE8130',
  water: '#6390F0',
  electric: '#F7D02C',
  grass: '#7AC74C',
  ice: '#96D9D6',
  fighting: '#C22E28',
  poison: '#A33EA1',
  ground: '#E2BF65',
  flying: '#A98FF3',
  psychic: '#F95587',
  bug: '#A6B91A',
  rock: '#B6A136',
  ghost: '#735797',
  dragon: '#6F35FC',
  dark: '#705746',
  steel: '#B7B7CE',
  fairy: '#D685AD',
};

export const POKEMON_TYPES: PokemonTypeName[] = [
  'normal',
  'fire',
  'water',
  'electric',
  'grass',
  'ice',
  'fighting',
  'poison',
  'ground',
  'flying',
  'psychic',
  'bug',
  'rock',
  'ghost',
  'dragon',
  'dark',
  'steel',
  'fairy',
];

export const API_ENDPOINTS = {
  POKEMON_LIST: 'https://pokeapi.co/api/v2/pokemon?limit=1000',
  POKEMON_DETAIL: (id: string | number) => `https://pokeapi.co/api/v2/pokemon/${id}`,
  POKEMON_SPECIES: (id: string | number) => `https://pokeapi.co/api/v2/pokemon-species/${id}`,
  EVOLUTION_CHAIN: (id: string | number) => `https://pokeapi.co/api/v2/evolution-chain/${id}`,
  POKEMON_ENCOUNTERS: (id: string | number) => `https://pokeapi.co/api/v2/pokemon/${id}/encounters`,
  TYPE_DETAIL: (type: string) => `https://pokeapi.co/api/v2/type/${type}`,
};

export const POKEBALL_IMAGE =
  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png';
