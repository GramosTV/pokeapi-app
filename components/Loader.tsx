import React from 'react';
import { View, ActivityIndicator, Text, Image } from 'react-native';
import { POKEBALL_IMAGE } from '../constants/pokemon';

interface LoaderProps {
  message?: string;
  showPokeball?: boolean;
}

export const Loader: React.FC<LoaderProps> = ({ message = 'Loading...', showPokeball = true }) => {
  return (
    <View className="flex-1 items-center justify-center p-8">
      {showPokeball && (
        <Image
          source={{ uri: POKEBALL_IMAGE }}
          className="mb-4 h-16 w-16 opacity-50"
          resizeMode="contain"
        />
      )}

      <ActivityIndicator size="large" color="#EE8130" className="mb-4" />

      <Text className="text-center text-base text-gray-600">{message}</Text>
    </View>
  );
};
