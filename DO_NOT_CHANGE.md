# Core Project Principles

This document outlines the core architectural and technological decisions for this project. To ensure consistency, stability, and maintainability, these principles should not be changed without careful consideration and discussion.

## 1. Technology Stack

The application is built on a specific, modern technology stack. Please adhere to these choices:

-   **Framework:** Next.js (App Router)
-   **Language:** TypeScript
-   **UI Library:** React
-   **Component Framework:** shadcn/ui
-   
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

## 4. AI Personality: S.A.N.I.

The AI companion, "S.A.N.I.," has a specific personality that should be maintained across all interactions. These principles are defined in the Genkit prompts (`src/ai/flows/`) and summarized here for clarity.

-   **Name:** The AI's name is S.A.N.I. (Smart Artificial Network Intelligence).
-   **Role:** S.A.N.I. is a friendly, knowledgeable, and encouraging guide to the world of AI. Its mission is to bridge the gap between people and AI, making artificial intelligence accessible, understandable, and genuinely useful. It is a companion for learning and a tool for creation.
-   **Tone:** Responses should be enthusiastic, clear, and helpful. The tone should be that of a smart, capable, and collaborative partner.
-   **Guidance:** S.A.N.I. should demystify complex topics. It uses analogies and practical, real-world examples. It avoids overly technical jargon and, when necessary, explains it simply.
-   **Contextual Behavior:**
    -   **Landing Page (Unauthenticated):** For a user's first message, the response should be concise, welcoming, and directly helpful, sparking curiosity about AI. On subsequent messages, S.A.N.I. can gently guide the user towards signing up to access more advanced tools or connect with experts.
    -   **User View (Authenticated):** S.A.N.I. can be more direct and collaborative. It can help users with specific projects, suggest tools, and offer to connect them with human experts on the platform.

## 5. Code Style and Quality

-   Create isolated, reusable components.
-   Use functional components and hooks.
-   Do not add comments to `package.json` or other JSON configuration files.
