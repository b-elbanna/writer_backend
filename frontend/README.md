# Writer Project - Frontend

## Overview

This project is a frontend application built with TypeScript and React, designed to provide a comprehensive writing environment. It includes features for chat, question-answering, resource management, and drawing tools.

## Key Features

- **Chat Functionality:** Real-time chat capabilities using WebSockets.
- **Question-Answering (QA) System:** Allows users to ask questions and receive answers, with the option to upload resources.
- **Resource Management:** Users can toggle the activation of resources for the QA system.
- **Paper Search:** Integrated paper search functionality.
- **Drawing Tool:** Excalidraw integration for drawing and diagramming.
- **Writing Tools:** A toolbar for various writing-related actions.

## Project Structure

The project is organized into several key directories and components:

### `src/components`

This directory contains the core UI components of the application.

- **`chat/`**
  - `ChatBody.tsx`: Displays the chat messages.
  - `ChatInput.tsx`: Provides the input field for sending chat messages.
  - `MessagesProvider.tsx`: Manages the context for chat messages.
- **`functionBar/`**
  - `activeResourcesTogglerButton.tsx`: A button to toggle the activation of resources for the QA system.
  - `fuctionBar.tsx`: The main component that houses the chat, QA, and drawing tools.
  - `lasyExcalidraw.tsx`: Integrates the Excalidraw drawing tool.
  - `writtingToolsBar/`: Contains the writing tools bar.
    - `writtingToolsBar.tsx`: The main component for the writing tools bar.
- **`paperSearch/`**
  - `paperSearchBody.tsx`: Displays the results of paper searches.
- **`qabox/`**
  - `qaboxResult.tsx`: Displays the results of QA queries.
  - `qaboxUploadResource.tsx`: Allows users to upload resources for the QA system.
- **`simpleTooltip.tsx`**: A reusable tooltip component.
- **`mainTogglerButton.tsx`**: A reusable toggler button component.

### `src/rtk`

This directory likely contains the Redux Toolkit (RTK) setup for state management.

- `store.ts`: The main Redux store configuration.
- `slices/`: Contains Redux slices for managing specific parts of the application state.
  - `isActiveResources.ts`: Manages the state of whether resources are active or not.

### `src/baseApis`

This directory contains the base API configurations.

- `axiosBase.ts`: Configures the base Axios client for API requests.
- `base.ts`: Contains base URLs and other base configurations.

### `src/endpointActions`

This directory contains functions for interacting with the backend API.

- `postCreateAnswerBoxAction.ts`: Handles actions related to creating answer boxes.
- `postSaveDrawAction.ts`: Handles actions related to saving drawings.

### `src/app`

- `loading.tsx`: A loading component.

## Technologies Used

- **TypeScript:** For type safety and improved code maintainability.
- **React:** For building the user interface.
- **Redux Toolkit:** For state management.
- **Axios:** For making HTTP requests.
- **WebSockets:** For real-time communication.
- **Excalidraw:** For the drawing tool.
- **lucide-react:** For icons.
- **next.js**: For server side rendering.
- **react-use-websocket**: For websocket connection.

## Setup and Installation

1.  **Clone the repository:**

    ```bash
    git clone <repository-url>
    ```

2.  **Navigate to the project directory:**

    ```bash
    cd writer_project/frontend
    ```

3.  **Install dependencies:**

    ```bash
    npm install
    ```

4.  **Start the development server:**

    ```bash
    npm run dev
    ```

## Running the Application

After starting the development server, the application will be accessible at `http://localhost:3000` (or a similar address, depending on your configuration).

## Contributing

Contributions to the project are welcome! Please follow these steps:

1.  Fork the repository.
2.  Create a new branch for your feature or bug fix.
3.  Make your changes and commit them.
4.  Push your changes to your fork.
5.  Submit a pull request.

## License

[Specify the license here, e.g., MIT]
