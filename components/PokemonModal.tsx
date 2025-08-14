import React, { useState, useEffect, useCallback } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import {
  Pokemon,
  PokemonDetails,
  PokemonSpecies,
  EvolutionChain,
  LocationArea,
} from '../types/pokemon';
import { pokemonApi } from '../services/pokemonApi';
import { TypePill } from './TypePill';
import {
  formatPokemonId,
  formatPokemonName,
  getTypeColor,
  capitalizeFirstLetter,
} from '../utils/pokemon';
import { POKEBALL_IMAGE } from '../constants/pokemon';

interface PokemonModalProps {
  pokemon: Pokemon | null;
  isVisible: boolean;
  onClose: () => void;
}

const { height } = Dimensions.get('window');

export const PokemonModal: React.FC<PokemonModalProps> = ({ pokemon, isVisible, onClose }) => {
  const [details, setDetails] = useState<PokemonDetails | null>(null);
  const [species, setSpecies] = useState<PokemonSpecies | null>(null);
  const [evolutionChain, setEvolutionChain] = useState<EvolutionChain | null>(null);
  const [encounters, setEncounters] = useState<LocationArea[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const fetchPokemonData = useCallback(async () => {
    if (!pokemon) return;

    setLoading(true);
    try {
      const modalData = await pokemonApi.fetchPokemonModalData(pokemon.id.toString());

      setDetails(modalData.details);
      setSpecies(modalData.species);
      setEvolutionChain(modalData.evolutionChain);
      setEncounters(modalData.encounters);
    } catch (error) {
      console.error('Error fetching pokemon data:', error);
    } finally {
      setLoading(false);
    }
  }, [pokemon]);

  useEffect(() => {
    if (pokemon && isVisible) {
      fetchPokemonData();
    }
  }, [pokemon, isVisible, fetchPokemonData]);

  const getAvailableImages = () => {
    if (!details) return [];

    const images = [];
    const sprites = details.sprites;

    if (sprites.other?.['official-artwork']?.front_default) {
      images.push({
        url: sprites.other['official-artwork'].front_default,
        label: 'Official Artwork',
      });
    }

    if (sprites.other?.home?.front_default) {
      images.push({
        url: sprites.other.home.front_default,
        label: 'Home',
      });
    }

    if (sprites.front_default) {
      images.push({
        url: sprites.front_default,
        label: 'Front Default',
      });
    }

    if (sprites.back_default) {
      images.push({
        url: sprites.back_default,
        label: 'Back Default',
      });
    }

    if (sprites.front_shiny) {
      images.push({
        url: sprites.front_shiny,
        label: 'Front Shiny',
      });
    }

    if (sprites.back_shiny) {
      images.push({
        url: sprites.back_shiny,
        label: 'Back Shiny',
      });
    }

    return images;
  };

  const getEvolutionNames = (node: any): string[] => {
    const names = [node.species.name];
    if (node.evolves_to) {
      node.evolves_to.forEach((evolution: any) => {
        names.push(...getEvolutionNames(evolution));
      });
    }
    return names;
  };

  const getFlavorText = () => {
    if (!species) return 'No description available.';

    const englishEntry = species.flavor_text_entries.find((entry) => entry.language.name === 'en');

    return englishEntry
      ? englishEntry.flavor_text.replace(/\f/g, ' ')
      : 'No description available.';
  };

  if (!pokemon) return null;

  const types = pokemon.types.map((t) => t.type.name);
  const images = getAvailableImages();

  const renderBackground = () => {
    if (types.length === 1) {
      return (
        <View className="absolute inset-0" style={{ backgroundColor: getTypeColor(types[0]) }} />
      );
    } else if (types.length === 2) {
      return (
        <LinearGradient
          colors={[getTypeColor(types[0]), getTypeColor(types[1])]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="absolute inset-0"
        />
      );
    }

    return (
      <View className="absolute inset-0" style={{ backgroundColor: getTypeColor('normal') }} />
    );
  };

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}>
      <View className="flex-1 bg-white">
        <View className="relative" style={{ height: height * 0.4 }}>
          {renderBackground()}

          <TouchableOpacity
            onPress={onClose}
            className="absolute right-4 top-12 z-10 rounded-full bg-white/20 p-2">
            <Ionicons name="close" size={24} color="white" />
          </TouchableOpacity>

          <View className="flex-1 items-center justify-center px-4">
            <Text className="mb-2 text-lg font-medium text-white">
              {formatPokemonId(pokemon.id)}
            </Text>

            <Text className="mb-4 text-3xl font-bold text-white">
              {formatPokemonName(pokemon.name)}
            </Text>

            {images.length > 0 && (
              <View className="items-center">
                <Image
                  source={{ uri: images[activeImageIndex]?.url || POKEBALL_IMAGE }}
                  style={{ width: 120, height: 120 }}
                  resizeMode="contain"
                />

                {images.length > 1 && (
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-4">
                    {images.map((image, index) => (
                      <TouchableOpacity
                        key={index}
                        onPress={() => setActiveImageIndex(index)}
                        className={`mx-1 rounded-lg p-2 ${
                          activeImageIndex === index ? 'bg-white/30' : 'bg-white/10'
                        }`}>
                        <Image
                          source={{ uri: image.url }}
                          style={{ width: 40, height: 40 }}
                          resizeMode="contain"
                        />
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                )}
              </View>
            )}

            <View className="mt-4 flex-row">
              {pokemon.types.map((type, index) => (
                <TypePill
                  key={index}
                  type={type.type.name as any}
                  isSelected={false}
                  onPress={() => {}}
                  size="medium"
                />
              ))}
            </View>
          </View>
        </View>

        <ScrollView className="flex-1 px-4 py-6">
          {loading ? (
            <View className="items-center py-8">
              <ActivityIndicator size="large" color={getTypeColor(types[0])} />
              <Text className="mt-2 text-gray-600">Loading details...</Text>
            </View>
          ) : (
            <>
              <View className="mb-6">
                <Text className="mb-2 text-xl font-bold text-gray-800">About</Text>
                <Text className="leading-6 text-gray-600">{getFlavorText()}</Text>
              </View>

              {details && (
                <View className="mb-6">
                  <Text className="mb-3 text-xl font-bold text-gray-800">Details</Text>
                  <View className="rounded-lg bg-gray-50 p-4">
                    <View className="mb-2 flex-row justify-between">
                      <Text className="text-gray-600">Height:</Text>
                      <Text className="font-medium">{details.height / 10} m</Text>
                    </View>
                    <View className="mb-2 flex-row justify-between">
                      <Text className="text-gray-600">Weight:</Text>
                      <Text className="font-medium">{details.weight / 10} kg</Text>
                    </View>
                    <View className="flex-row justify-between">
                      <Text className="text-gray-600">Abilities:</Text>
                      <Text className="flex-1 text-right font-medium">
                        {details.abilities
                          .map((a) => capitalizeFirstLetter(a.ability.name))
                          .join(', ')}
                      </Text>
                    </View>
                  </View>
                </View>
              )}

              {evolutionChain && (
                <View className="mb-6">
                  <Text className="mb-3 text-xl font-bold text-gray-800">Evolution Chain</Text>
                  <View className="rounded-lg bg-gray-50 p-4">
                    <Text className="text-gray-700">
                      {getEvolutionNames(evolutionChain.chain)
                        .map((name) => capitalizeFirstLetter(name))
                        .join(' → ')}
                    </Text>
                  </View>
                </View>
              )}

              {encounters.length > 0 && (
                <View className="mb-6">
                  <Text className="mb-3 text-xl font-bold text-gray-800">Locations</Text>
                  <View className="rounded-lg bg-gray-50 p-4">
                    {encounters.slice(0, 5).map((encounter, index) => (
                      <Text key={index} className="mb-1 text-gray-700">
                        • {capitalizeFirstLetter(encounter.location_area.name.replace('-', ' '))}
                      </Text>
                    ))}
                    {encounters.length > 5 && (
                      <Text className="mt-2 italic text-gray-500">
                        +{encounters.length - 5} more locations
                      </Text>
                    )}
                  </View>
                </View>
              )}
            </>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
};
