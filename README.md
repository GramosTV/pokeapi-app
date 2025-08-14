# Pokemon Explorer App

A React Native app built with Expo to browse and explore Pokemon using the PokeAPI.

## Features

- Browse 1000 Pokemon with card layouts
- Filter by type
- Dynamic card colors based on type
- Responsive design
- Detailed Pokemon modal (evolution, locations, etc.)
- Lazy loading and image caching
- Smooth animations

## Tech Stack

- React Native + Expo
- Expo Router
- TypeScript
- NativeWind (Tailwind CSS)
- Expo Linear Gradient

## API Endpoints

- `https://pokeapi.co/api/v2/pokemon?limit=1000`
- `https://pokeapi.co/api/v2/pokemon/{id}`
- `https://pokeapi.co/api/v2/pokemon-species/{id}`
- `https://pokeapi.co/api/v2/evolution-chain/{id}`
- `https://pokeapi.co/api/v2/pokemon/{id}/encounters`

## Project Structure

```
app/           # Screens (Expo Router)
components/    # UI components
constants/     # App constants
hooks/         # Custom hooks
services/      # API logic
types/         # TypeScript types
utils/         # Helpers
```

## Getting Started

1. **Clone and install**
   ```bash
   git clone https://github.com/GramosTV/pokeapi-app
   cd pokeapi-app
   npm install
   ```
2. **Start the app**
   ```bash
   npx expo start
   ```
3. **Run on device**
   - Scan QR with Expo Go or use a simulator

## Build

```bash
npx eas build --platform ios|android|all
```

## Contributing

- Fork, branch, commit, and open a pull request

## License

MIT

## Credits

- [PokeAPI](https://pokeapi.co/)
- [Expo](https://expo.dev/)
- [Pokemon Company](https://www.pokemon.com/)
