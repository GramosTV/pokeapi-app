import React, { useState, memo, useCallback } from 'react';
import { View, Text, TouchableOpacity, Image, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Pokemon } from '../types/pokemon';
import { TypePill } from './TypePill';
import {
  formatPokemonId,
  formatPokemonName,
  getTypeColor,
  getPokemonImageUrl,
} from '../utils/pokemon';
import { POKEBALL_IMAGE } from '../constants/pokemon';

interface PokemonCardProps {
  pokemon: Pokemon;
  onPress?: (pokemon: Pokemon) => void;
}

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2;

const PokemonCardComponent: React.FC<PokemonCardProps> = ({ pokemon, onPress }) => {
  const [imageError, setImageError] = useState(false);

  const types = pokemon.types.map((t) => t.type.name);
  const imageUrl =
    pokemon.sprites?.other?.['official-artwork']?.front_default ||
    pokemon.sprites?.front_default ||
    getPokemonImageUrl(pokemon.id);

  const handlePress = useCallback(() => {
    onPress?.(pokemon);
  }, [onPress, pokemon]);

  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  const renderBackground = useCallback(() => {
    if (types.length === 1) {
      return (
        <View
          className="absolute inset-0 rounded-xl"
          style={{ backgroundColor: getTypeColor(types[0]) }}
        />
      );
    } else if (types.length === 2) {
      return (
        <LinearGradient
          colors={[getTypeColor(types[0]), getTypeColor(types[1])]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="absolute inset-0 rounded-xl"
        />
      );
    }

    return (
      <View
        className="absolute inset-0 rounded-xl"
        style={{ backgroundColor: getTypeColor('normal') }}
      />
    );
  }, [types]);

  return (
    <TouchableOpacity onPress={handlePress} className="mb-4" style={{ width: cardWidth }}>
      <View className="relative overflow-hidden rounded-xl" style={{ height: cardWidth * 1.2 }}>
        {renderBackground()}

        <View className="flex-1 items-center justify-center pt-4">
          <Image
            source={{
              uri: imageError ? POKEBALL_IMAGE : imageUrl,
            }}
            className="mb-2 h-20 w-20"
            resizeMode="contain"
            onError={handleImageError}
            fadeDuration={200}
            loadingIndicatorSource={{ uri: POKEBALL_IMAGE }}
          />
        </View>

        <View className="rounded-b-xl bg-white/90 p-3">
          <Text className="mb-1 text-xs font-medium text-gray-600">
            {formatPokemonId(pokemon.id)}
          </Text>

          <Text className="mb-2 text-sm font-bold text-gray-800" numberOfLines={1}>
            {formatPokemonName(pokemon.name)}
          </Text>

          <View className="flex-row flex-wrap">
            {pokemon.types.map((type, index) => (
              <TypePill
                key={index}
                type={type.type.name as any}
                isSelected={false}
                onPress={() => {}}
                size="small"
              />
            ))}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export const PokemonCard = memo(PokemonCardComponent, (prevProps, nextProps) => {
  return prevProps.pokemon.id === nextProps.pokemon.id && prevProps.onPress === nextProps.onPress;
});
