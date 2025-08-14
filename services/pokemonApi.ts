import { API_ENDPOINTS } from '../constants/pokemon';
import {
  Pokemon,
  PokemonDetails,
  PokemonListResponse,
  PokemonSpecies,
  EvolutionChain,
  LocationArea,
} from '../types/pokemon';

class PokemonApiService {
  private cache = new Map<string, any>();

  async fetchPokemonList(): Promise<Pokemon[]> {
    const cacheKey = 'pokemon-list';

    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      const response = await fetch(API_ENDPOINTS.POKEMON_LIST);
      const data: PokemonListResponse = await response.json();

      const pokemonList: Pokemon[] = data.results.map((pokemon, index) => {
        const id = index + 1;

        return {
          id,
          name: pokemon.name,
          url: pokemon.url,
          types: [],
          species: {
            name: pokemon.name,
            url: `https://pokeapi.co/api/v2/pokemon-species/${id}/`,
          },
          sprites: {
            front_default: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
            other: {
              'official-artwork': {
                front_default: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
              },
            },
          },
        };
      });

      await this.fetchTypesForPokemonList(pokemonList);

      this.cache.set(cacheKey, pokemonList);
      return pokemonList;
    } catch (error) {
      console.error('Error fetching Pokemon list:', error);
      throw error;
    }
  }

  private async fetchTypesForPokemonList(pokemonList: Pokemon[]): Promise<void> {
    const batchSize = 50;

    for (let i = 0; i < pokemonList.length; i += batchSize) {
      const batch = pokemonList.slice(i, i + batchSize);

      const typePromises = batch.map(async (pokemon) => {
        try {
          const response = await fetch(API_ENDPOINTS.POKEMON_DETAIL(pokemon.id));
          const details = await response.json();
          pokemon.types = details.types;
        } catch (error) {
          console.error(`Error fetching types for ${pokemon.name}:`, error);
          pokemon.types = [
            { slot: 1, type: { name: 'normal', url: 'https://pokeapi.co/api/v2/type/1/' } },
          ];
        }
      });

      await Promise.all(typePromises);
    }
  }

  async fetchPokemonDetails(id: string): Promise<PokemonDetails> {
    const cacheKey = `pokemon-details-${id}`;

    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      const response = await fetch(API_ENDPOINTS.POKEMON_DETAIL(id));
      const data: PokemonDetails = await response.json();

      this.cache.set(cacheKey, data);
      return data;
    } catch (error) {
      console.error(`Error fetching Pokemon details for ${id}:`, error);
      throw error;
    }
  }

  async fetchPokemonSpecies(id: string): Promise<PokemonSpecies> {
    const cacheKey = `pokemon-species-${id}`;

    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      const response = await fetch(API_ENDPOINTS.POKEMON_SPECIES(id));
      const data: PokemonSpecies = await response.json();

      this.cache.set(cacheKey, data);
      return data;
    } catch (error) {
      console.error(`Error fetching Pokemon species for ${id}:`, error);
      throw error;
    }
  }

  async fetchEvolutionChain(id: string): Promise<EvolutionChain> {
    const cacheKey = `evolution-chain-${id}`;

    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      const response = await fetch(API_ENDPOINTS.EVOLUTION_CHAIN(id));
      const data: EvolutionChain = await response.json();

      this.cache.set(cacheKey, data);
      return data;
    } catch (error) {
      console.error(`Error fetching evolution chain for ${id}:`, error);
      throw error;
    }
  }

  async fetchPokemonEncounters(id: string): Promise<LocationArea[]> {
    const cacheKey = `pokemon-encounters-${id}`;

    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      const response = await fetch(API_ENDPOINTS.POKEMON_ENCOUNTERS(id));
      const data: LocationArea[] = await response.json();

      this.cache.set(cacheKey, data);
      return data;
    } catch (error) {
      console.error(`Error fetching Pokemon encounters for ${id}:`, error);
      throw error;
    }
  }

  extractEvolutionChainId(evolutionChainUrl: string): string {
    const matches = evolutionChainUrl.match(/\/evolution-chain\/(\d+)\//);
    return matches ? matches[1] : '1';
  }

  async fetchPokemonModalData(id: string): Promise<{
    details: PokemonDetails;
    species: PokemonSpecies;
    evolutionChain: EvolutionChain;
    encounters: LocationArea[];
  }> {
    try {
      const [details, species] = await Promise.all([
        this.fetchPokemonDetails(id),
        this.fetchPokemonSpecies(id),
      ]);

      const evolutionId = this.extractEvolutionChainId(species.evolution_chain.url);

      const [evolutionChain, encounters] = await Promise.all([
        this.fetchEvolutionChain(evolutionId),
        this.fetchPokemonEncounters(id),
      ]);

      return {
        details,
        species,
        evolutionChain,
        encounters,
      };
    } catch (error) {
      console.error(`Error fetching modal data for Pokemon ${id}:`, error);
      throw error;
    }
  }

  extractPokemonId(url: string): string {
    const matches = url.match(/\/pokemon\/(\d+)\//);
    return matches ? matches[1] : '1';
  }
}

export const pokemonApi = new PokemonApiService();
