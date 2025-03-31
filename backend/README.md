# AI_WRiteR: Your AI-Powered Writing and Chat Assistant

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python](https://img.shields.io/badge/Python-3.9+-blue.svg)](https://www.python.org/downloads/)
[![Django](https://img.shields.io/badge/Django-5.1-green.svg)](https://www.djangoproject.com/)

## Overview

AI_WRiteR is a sophisticated web application designed to enhance your writing process and provide an interactive AI chat experience. Built with Django, Django REST Framework, and Channels, it leverages the power of AI to offer a suite of writing tools and a dynamic chat interface.

## Key Features

- **AI-Powered Chat:** Engage in real-time conversations with an AI assistant capable of understanding and responding to your queries.
  - **Real-time Interaction:** Utilizes WebSockets for instant communication.
  - **Chat History:** Stores chat history for later review.
  - **User-Specific Chats:** Each user has their own chat history.
- **Advanced Writing Tools:** Access a variety of AI-driven tools to improve your writing, including:
  - **Content Generation:** Generate new text based on prompts or keywords.
  - **Grammar and Style Checking:** Improve the quality of your writing with AI-powered suggestions.
  - **Paraphrasing and Summarization:** Rephrase existing text or condense it into shorter summaries.
  - **Customizable Prompts:** Tailor the AI's output with specific instructions.
- **User Authentication:** Secure user accounts with email verification and social login options (Google).
  - **Custom User Model:** Extends Django's default user model with additional fields.
  - **Email Verification:** Ensures the validity of user email addresses.
  - **Social Login:** Allows users to sign up and log in with their Google accounts.
- **RESTful API:** A well-documented API for interacting with the application's features.
- **Real-time Communication:** Utilizes WebSockets for a seamless and responsive chat experience.
- **Admin Panel:** A Django admin interface for managing users, content, and application settings.
- **QA Box:** A dedicated section for asking questions and receiving AI-generated answers.
  - **Question Submission:** Users can submit questions through a user-friendly interface.
  - **AI-Powered Answers:** The AI generates relevant answers to user questions.
  - **Question History:** Users can view their question history.

## Technologies Used

- **Backend:**
  - [Python](https://www.python.org/) (3.9+)
  - [Django](https://www.djangoproject.com/) (5.1)
  - [Django REST Framework](https://www.django-rest-framework.org/)
  - [Channels](https://channels.readthedocs.io/en/stable/)
  - [Daphne](https://github.com/django/daphne)
  - [dj-rest-auth](https://dj-rest-auth.readthedocs.io/en/latest/)
  - [django-allauth](https://django-allauth.readthedocs.io/en/latest/)
  - [PyJWT](https://pyjwt.readthedocs.io/en/stable/)
  - [CORS Headers](https://pypi.org/project/django-cors-headers/)
  - [Environs](https://pypi.org/project/environs/)
  - **Custom Apps:**
    - **`accounts`:** Manages user accounts, including the custom user model, registration, login, email verification, and social login integration.
    - **`ai_chat`:** Handles the real-time chat functionality, including WebSocket connections, message handling, and chat history.
    - **`ai_writing_tools`:** Provides the AI-powered writing tools, such as content generation, grammar checking, paraphrasing, and summarization. It interacts with the OpenAI API.
    - **`QA_box`:** Implements the question-and-answer feature, allowing users to submit questions and receive AI-generated answers.
- **Frontend:** (Not detailed in provided files, but you can add details here if you have a frontend)
  - React, Vue, or other frontend framework
  - JavaScript
  - HTML/CSS
- **Database:**
  - SQLite (default for development)
  - PostgreSQL (recommended for production)
- **Other:**
  - OpenAI API (for AI features)
  - Springer API (if applicable)

## Installation and Setup

1.  **Clone the Repository:**

    ```bash
    git clone <repository-url>
    cd writer_project/backend
    ```

2.  **Create a Virtual Environment:**

    ```bash
    python3 -m venv venv
    source venv/bin/activate  # On Linux/macOS
    venv\Scripts\activate  # On Windows
    ```

3.  **Install Dependencies:**

    ```bash
    pip install -r requirements.txt
    ```

4.  **Environment Variables:**

    - Create a `.env` file in the `backend` directory.
    - Add the following variables (replace with your actual keys):

    ```
    SECRET_KEY=<your-django-secret-key>
    OPENAI_KEY=<your-openai-api-key>
    SPRINGER_KEY=<your-springer-api-key>
    DB_PASSWORD=<your-database-password>
    GOOGLE_CLIENT_ID=<your-google-client-id>
    GOOGLE_SECRET_KEY=<your-google-secret-key>
    DEBUG=True # Set to False for production
    ```

5.  **Database Migrations:**

    ```bash
    python manage.py makemigrations
    python manage.py migrate
    ```

6.  **Run the Development Server:**

    ```bash
    python manage.py runserver
    ```

7.  **Run the Daphne Server:**

    ```bash
    daphne core.asgi:application
    ```

8.  **Access the Application:**

    - Open your web browser and go to `http://localhost:8000`.
    - Access the admin panel at `http://localhost:8000/admin`.

## API Endpoints

The application exposes a RESTful API. You can view all available endpoints by visiting `http://localhost:8000/api/v1` (or your deployed URL).

- `/api/v1/auth/`: User authentication endpoints (login, registration, etc.).
- `/api/v1/chat/`: Chat-related endpoints.
- `/api/v1/writing/`: Endpoints for AI writing tools.
- `/api/v1/qa/`: Endpoints for the QA Box feature.

## WebSocket Endpoints

- `ws/chat/<chat_id>`: Real-time chat communication.

## Contributing

Contributions are welcome! If you'd like to contribute to AI_WRiteR, please follow these steps:

1.  Fork the repository.
2.  Create a new branch for your feature or bug fix.
3.  Make your changes and commit them.
4.  Push your branch to your fork.
5.  Submit a pull request.

## License

This project is licensed under the MIT License.

## Contact

If you have any questions or suggestions, feel free to contact us at \[Your Email Address].
