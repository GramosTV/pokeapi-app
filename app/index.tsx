import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, FlatList, ScrollView, SafeAreaView, StatusBar } from 'react-native';
import { usePokemon } from '~/hooks/usePokemon';
import { PokemonCard } from '~/components/PokemonCard';
import { TypePill } from '~/components/TypePill';
import { Loader } from '~/components/Loader';
import { PokemonModal } from '~/components/PokemonModal';
import { POKEMON_TYPES } from '~/constants/pokemon';
import { filterPokemonByTypes } from '~/utils/pokemon';
import { Pokemon, PokemonTypeName } from '~/types/pokemon';

export default function Home() {
  const { pokemon, loading, error } = usePokemon();
  const [selectedTypes, setSelectedTypes] = useState<PokemonTypeName[]>([]);
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const filteredPokemon = useMemo(() => {
    return filterPokemonByTypes(pokemon, selectedTypes);
  }, [pokemon, selectedTypes]);

  const handleTypePress = useCallback((type: PokemonTypeName) => {
    setSelectedTypes((prev) => {
      if (prev.includes(type)) {
        return prev.filter((t) => t !== type);
      } else {
        return [...prev, type];
      }
    });
  }, []);

  const handlePokemonPress = useCallback((pokemon: Pokemon) => {
    setSelectedPokemon(pokemon);
    setIsModalVisible(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalVisible(false);
    setSelectedPokemon(null);
  }, []);

  const renderHeader = useCallback(
    () => (
      <View className="pb-2 pt-4">
        <View className="px-4">
          <Text className="mb-4 text-center text-2xl font-bold text-gray-800">
            Welcome to the PokeAPI App!
          </Text>
        </View>

        <View className="mb-4">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16 }}
            style={{ flexGrow: 0 }}>
            {POKEMON_TYPES.map((type) => (
              <TypePill
                key={type}
                type={type}
                isSelected={selectedTypes.includes(type)}
                onPress={handleTypePress}
                size="medium"
              />
            ))}
          </ScrollView>
        </View>

        <View className="px-4">
          <Text className="mb-2 text-center text-gray-600">
            {selectedTypes.length > 0
              ? `Showing ${filteredPokemon.length} Pokémon with ${selectedTypes.join(', ')} type${selectedTypes.length > 1 ? 's' : ''}`
              : `${filteredPokemon.length} Pokémon available`}
          </Text>
        </View>
      </View>
    ),
    [selectedTypes, filteredPokemon.length, handleTypePress]
  );

  const renderPokemonCard = useCallback(
    ({ item }: { item: Pokemon }) => <PokemonCard pokemon={item} onPress={handlePokemonPress} />,
    [handlePokemonPress]
  );

  const keyExtractor = useCallback((item: Pokemon) => item.id.toString(), []);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <Loader message="Catching Pokémon..." />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 items-center justify-center p-8">
          <Text className="mb-4 text-center text-lg text-red-500">Error loading Pokémon</Text>
          <Text className="text-center text-gray-600">{error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="white" />

      <FlatList
        data={filteredPokemon}
        renderItem={renderPokemonCard}
        keyExtractor={keyExtractor}
        numColumns={2}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={{ paddingBottom: 20 }}
        columnWrapperStyle={{ paddingHorizontal: 16, justifyContent: 'space-between' }}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        updateCellsBatchingPeriod={50}
        initialNumToRender={10}
        windowSize={10}
        getItemLayout={undefined}
      />

      <PokemonModal
        pokemon={selectedPokemon}
        isVisible={isModalVisible}
        onClose={handleCloseModal}
      />
    </SafeAreaView>
  );
}
