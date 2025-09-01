
# R22EF207: URL Shortener

This is a full-stack URL shortening service that converts long URLs into concise, shareable links and provides analytics to track their usage.

-----

## 🌟 Features

  * **URL Shortening**: Users can convert any long URL into a compact, 6-character shortcode.
  * **Custom Shortcodes**: The application supports creating custom, memorable shortcodes.
  * **Temporary Links**: Shortened URLs automatically expire after 30 minutes.
  * **Statistics Page**: A dedicated page displays analytics for each shortened URL, including:
      * Total number of clicks.
      * Creation and expiration timestamps.
      * Detailed click data, including the timestamp, source, and coarse-grained geographical location.
  * **Client-side Persistence**: URL data is stored locally in the browser's `localStorage` to ensure data persists across sessions.
  * **Logging Middleware**: A custom, type-safe logging package is integrated to send application events to a test server for monitoring and debugging.

-----

## 🚀 Getting Started

### Prerequisites

  * Node.js (v18 or higher)
  * npm (or yarn/pnpm)

### Installation

1.  Clone the repository:

    ```bash
    git clone https://github.com/your-username/R22EF207.git
    cd R22EF207/url-shortner/client
    ```

2.  Install dependencies:

    ```bash
    npm install
    ```

### Running the Project

To run the application in development mode:

```bash
npm run dev
```

The application will be accessible at `http://localhost:3000`.

-----

## 📦 Project Structure

The project follows a standard Next.js App Router structure. Key directories and files include:

```
R22EF207/
├── client/
│   ├── app/                 # Next.js App Router root directory
│   ├── components/          # Reusable React components
│   │   ├── UrlShortnerCard.tsx # The main URL shortening interface
│   │   ├── StatsPage.tsx       # The statistics display page
│   │   └── ui/                 # Custom UI components (Card, Button, Input)
│   ├── logging-middleware/  # Custom logging logic
│   │   └── logger.ts           # The type-safe logging function
│   └── ...
└── README.md
```

-----

## 🛠️ Technical Details

  * **Frontend**: Built with **React** and **Next.js**, using **Material-UI** for component styling.
  * **State Management**: `useState` and `useEffect` hooks manage the application state. Data persistence is handled via `localStorage`.
  * **Type Safety**: The entire project uses **TypeScript** to ensure type consistency and prevent common errors.
  * **Logging**: A custom `Log` function in `logger.ts` sends data to a backend endpoint via the `fetch` API. It uses a custom type to validate the log structure, including fields like `stack`, `level`, `sourcePackage`, and `message`.
