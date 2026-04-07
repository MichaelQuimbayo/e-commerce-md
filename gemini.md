# Project Architecture Overview

This document provides an overview of the project's architecture to guide new developers and ensure consistency.

## Core Technologies

*   **Framework:** [Next.js](https://nextjs.org/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **Language:** JavaScript (React)

## Architectural Pattern: Clean Architecture

The project is structured following the principles of **Clean Architecture**. This approach promotes a separation of concerns, making the codebase more modular, scalable, testable, and maintainable.

The core idea is to organize the code into feature-based modules, with each module containing distinct layers:

*   `src/features/{feature-name}/`
    *   **`domain`**: Contains the core business logic, entities, and rules. This layer is the most independent.
    *   **`application`**: Implements the application-specific use cases, orchestrating the flow of data between the domain and the presentation layers.
    *   **`infrastructure`**: Handles external concerns like data fetching (API calls, local storage), external libraries, and other services.
    *   **`presentation`**: Contains the UI components (React components), hooks, and presentation logic specific to the feature.

## Project Structure

Here is a breakdown of the main directories:

*   `pages/`: Contains the top-level pages and routing for the Next.js application. These files connect the URL routes to the presentation components from the `features` directory.
*   `public/`: For static assets like images, fonts, and icons.
*   `src/`: The main application source code.
    *   `features/`: Contains the different features of the application (e.g., `products`, `testimonials`), each following the Clean Architecture pattern described above.
    *   `shared/`: Contains code that is shared across multiple features.
        *   `components/`: Reusable UI components (e.g., Buttons, Modals).
        *   `context/`: React Context providers for global state management.
        *   `lib/`: Shared utility functions and libraries.
    *   `assets/`: Project-specific assets that are imported into components.
