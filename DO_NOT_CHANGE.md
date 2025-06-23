# Core Project Principles

This document outlines the core architectural and technological decisions for this project. To ensure consistency, stability, and maintainability, these principles should not be changed without careful consideration and discussion.

## 1. Technology Stack

The application is built on a specific, modern technology stack. Please adhere to these choices:

-   **Framework:** Next.js (App Router)
-   **Language:** TypeScript
-   **UI Library:** React
-   **Component Framework:** shadcn/ui
-   **Styling:** Tailwind CSS
-   **Generative AI:** Genkit

Requests to change this core stack (e.g., to Angular, Vue, or other CSS frameworks) should be avoided.

## 2. Generative AI Implementation

All Generative AI functionality must be implemented using **Genkit**.

-   **Flows:** AI logic should be encapsulated in Genkit Flows, typically located in `src/ai/flows/`.
-   **Global `ai` Object:** Always use the pre-configured global `ai` object from `src/ai/genkit.ts` for defining flows, prompts, and tools. Do not re-initialize Genkit in other files.
-   **Tools/Function Calling:** Use Genkit Tools for any function-calling or agentic behavior.

## 3. Data Handling

The application uses a service layer pattern for data fetching.

-   **Data Service:** All database interactions should be abstracted in `src/lib/data.ts`.
-   **Firebase Initialization:** The Firebase app is initialized once in `src/lib/firebase.ts`. Do not duplicate this initialization.
-   **Server/Client Boundary:** Be mindful of passing data from Server Components to Client Components. Only pass plain, serializable objects. Do not pass complex objects like class instances or component functions.

## 4. Code Style and Quality

-   Create isolated, reusable components.
-   Use functional components and hooks.
-   Do not add comments to `package.json` or other JSON configuration files.
