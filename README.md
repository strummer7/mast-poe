Changelog
- Moved filter UI out of App.tsx into a dedicated FilterScreen.tsx file.
- Added average-price breakdown by course on the Home screen (calculation + display).
- Implemented a reusable CartBar component (components/CartBar.tsx) with a modal detail view.
- Added add/remove/clear cart functionality and "Add" buttons on consumer-facing Dish cards.
- Persisted menu items to AsyncStorage so dishes survive app restarts.
- CartBar is visible on Home and Filter screens only; explicitly excluded from the Chef (manager) screen.
- Relocated the "Manage" (Chef) navigation button to the header top-right to avoid overlap with the cart.
- Preserved Chef management features (add/remove dishes, modal form) but separated them from consumer UI.
- Simplified and refactored code into three files (App.tsx, FilterScreen.tsx, components/CartBar.tsx) for clarity.
- Standardised styling tokens and layout (consistent colors, compact cards, modals) to improve readability and maintainability.

- refrences
- W3Schools. (2025) [Online] Available at: https://www.w3schools.com/html/
- chatgpt. (2025) available at https://www.chatgpt.com
- blackbox ai (2025) available at https://www.blackboxai.com
