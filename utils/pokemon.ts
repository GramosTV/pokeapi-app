import { TYPE_COLORS } from '../constants/pokemon';
import { PokemonTypeName } from '../types/pokemon';

export const getTypeColor = (typeName: string): string => {
  return TYPE_COLORS[typeName as PokemonTypeName] || TYPE_COLORS.normal;
};

export const getCardBackgroundStyle = (types: string[]) => {
  if (types.length === 1) {
    return {
      backgroundColor: getTypeColor(types[0]),
    };
  } else if (types.length === 2) {
    const color1 = getTypeColor(types[0]);
    const color2 = getTypeColor(types[1]);

    return {
      background: `linear-gradient(135deg, ${color1} 0%, ${color2} 100%)`,
    };
  }

  return {
    backgroundColor: TYPE_COLORS.normal,
  };
};

export const formatPokemonId = (id: number): string => {
  return `#${id.toString().padStart(3, '0')}`;
};

export const capitalizeFirstLetter = (text: string): string => {
  return text.charAt(0).toUpperCase() + text.slice(1);
};

export const formatPokemonName = (name: string): string => {
  return capitalizeFirstLetter(name.replace('-', ' '));
};

export const extractIdFromUrl = (url: string): number => {
  const matches = url.match(/\/(\d+)\/$/);
  return matches ? parseInt(matches[1], 10) : 0;
};

export const getPokemonImageUrl = (id: number): string => {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
};

export const filterPokemonByTypes = (pokemon: any[], selectedTypes: string[]) => {
  if (selectedTypes.length === 0) {
    return pokemon;
  }

  return pokemon.filter((p) => {
    const pokemonTypes = p.types.map((t: any) => t.type.name);
    return selectedTypes.some((selectedType) => pokemonTypes.includes(selectedType));
  });
};
