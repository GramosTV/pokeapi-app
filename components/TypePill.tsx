import React, { memo, useCallback } from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { getTypeColor, capitalizeFirstLetter } from '../utils/pokemon';
import { PokemonTypeName } from '../types/pokemon';

interface TypePillProps {
  type: PokemonTypeName;
  isSelected: boolean;
  onPress: (type: PokemonTypeName) => void;
  size?: 'small' | 'medium';
}

const TypePillComponent: React.FC<TypePillProps> = ({
  type,
  isSelected,
  onPress,
  size = 'medium',
}) => {
  const backgroundColor = getTypeColor(type);
  const sizeClasses = size === 'small' ? 'px-2 py-1' : 'px-4 py-2';
  const textClasses = size === 'small' ? 'text-xs' : 'text-sm';

  const handlePress = useCallback(() => {
    onPress(type);
  }, [onPress, type]);

  return (
    <TouchableOpacity
      onPress={handlePress}
      className={`
        ${sizeClasses} mb-2 mr-2 rounded-full
        ${isSelected ? 'border-2 border-black' : 'border border-gray-300'}
      `}
      style={{ backgroundColor }}>
      <Text className={`${textClasses} text-center font-medium text-white`}>
        {capitalizeFirstLetter(type)}
      </Text>
    </TouchableOpacity>
  );
};

export const TypePill = memo(TypePillComponent, (prevProps, nextProps) => {
  return (
    prevProps.type === nextProps.type &&
    prevProps.isSelected === nextProps.isSelected &&
    prevProps.size === nextProps.size &&
    prevProps.onPress === nextProps.onPress
  );
});
