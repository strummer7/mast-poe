# Chef Christoffel Menu App

This is a React Native application designed for Chef Christoffel to manage and update his menu. The app allows clients to access the latest menus and provides a culinary experience by enabling the chef to enter dish names, descriptions, select courses, and set prices.

## Features

- **Dish Management**: Chef Christoffel can add, update, and manage dishes through a user-friendly interface.
- **Menu Display**: Clients can view the latest menu items, including dish names, descriptions, courses (starters, mains, desserts), and prices.
- **Total Count**: The app displays the total number of menu items available for selection.

## Project Structure

```
chef-christoffel-menu
├── src
│   ├── App.tsx
│   ├── components
│   │   ├── DishForm.tsx
│   │   ├── DishItem.tsx
│   │   └── DishList.tsx
│   ├── screens
│   │   ├── HomeScreen.tsx
│   │   └── ChefScreen.tsx
│   ├── navigation
│   │   └── index.tsx
│   ├── hooks
│   │   └── useMenu.ts
│   └── types
│       └── index.ts
├── package.json
├── tsconfig.json
├── app.json
├── babel.config.js
├── .gitignore
└── README.md
```

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd chef-christoffel-menu
   ```
3. Install dependencies:
   ```
   npm install
   ```

## Usage

To start the application, run:
```
npm start
```

This will launch the Expo development server, and you can view the app on your device or emulator.

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue for any enhancements or bug fixes.

## License

This project is licensed under the MIT License.