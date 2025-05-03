# Expo Arrow Animation

A beautiful React Native animation demo using Expo, React Native Reanimated, and Gesture Handler. This project demonstrates a grid of arrows that respond to pan gestures with smooth animations.

## Features

- Interactive grid of animated arrows
- Smooth spring animations using Reanimated
- Gesture-based interaction
- Responsive layout
- TypeScript support

## Tech Stack

- Expo
- React Native
- React Native Reanimated
- React Native Gesture Handler
- TypeScript

## Getting Started

1. Install dependencies

   ```bash
   npm install
   # or
   yarn install
   ```

2. Start the development server

   ```bash
   npm start
   # or
   yarn start
   ```

3. Run on your preferred platform

   ```bash
   # iOS
   npm run ios
   # or
   yarn ios

   # Android
   npm run android
   # or
   yarn android
   ```

## Project Structure

```
app/
  ├── index.tsx        # Main component with animation logic
  └── ...
```

## How It Works

The app creates a grid of arrows that respond to pan gestures. Each arrow:

- Rotates to point towards the touch position
- Scales based on distance from the touch
- Translates slightly for a 3D effect
- Uses spring animations for smooth transitions

## Contributing

Feel free to submit issues and enhancement requests.

## License

This project is open source and available under the MIT License.
