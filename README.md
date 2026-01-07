# K-EXAONE Chat Interface

A modern, responsive chat interface for the K-EXAONE AI model, built with Next.js 15, Tailwind CSS, and Framer Motion. This project features a polished UI with dark mode support, mobile responsiveness, and a seamless user experience.

![K-EXAONE Chat Interface](/K-EXAONE_Symbol_3d.png)

## Features

-   **Modern Chat UI**: A clean, intuitive interface inspired by top-tier AI assistants.
-   **Responsive Design**: Fully optimized for both desktop and mobile devices.
    -   **Mobile Sidebar**: Drawer-style sidebar with backdrop and auto-close on interaction.
    -   **Desktop Layout**: Spacious chat area with a collapsible sidebar.
-   **Theme Support**: Built-in Light and Dark modes with persistent preference.
-   **Animations**: Smooth transitions and interactions powered by Framer Motion.
-   **Conversation Management**: Create, view, and delete chat sessions.
-   **Markdown Support**: Renders code blocks, tables, and formatted text in messages.

## Tech Stack

-   **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **Animations**: [Motion](https://motion.dev/) (Framer Motion)
-   **Icons**: [Lucide React](https://lucide.dev/)
-   **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
-   **Testing**: [Playwright](https://playwright.dev/) (E2E) & [Jest](https://jestjs.io/) (Unit)

## Getting Started

### Prerequisites

-   Node.js 18+
-   npm, yarn, pnpm, or bun

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/yourusername/k-exaone-chat-v2.git
    cd k-exaone-chat-v2
    ```

2.  Install dependencies:
    ```bash
    npm install
    # or
    yarn install
    ```

3.  Run the development server:
    ```bash
    npm run dev
    ```

4.  Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/              # Next.js App Router pages and layouts
├── components/       # Reusable UI components
│   ├── chat/         # Chat-specific components (Input, MessageList, etc.)
│   ├── sidebar/      # Sidebar and navigation components
│   └── ui/           # Generic UI elements (Buttons, etc.)
├── hooks/            # Custom React hooks
├── lib/              # Utility functions
├── stores/           # Global state management (Zustand)
└── types/            # TypeScript definitions
```

## Recent Updates

-   **Mobile Experience**: Enhanced sidebar behavior on mobile with overlay and backdrop support.
-   **Desktop Layout**: Widened chat interface for better readability on large screens.
-   **Dark Mode**: Improved contrast and visibility for UI elements in dark mode.

## License

This project is licensed under the MIT License.
