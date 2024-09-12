
---

# &Gallery

&Gallery is a simple photo gallery application built with Express.js and React.js. It allows users to upload images, tag them as private or public, and access images based on their visibility. This project is designed to be easy to understand and modify, and it does not use an external database, relying instead on file-based storage.

## Features

- **User Management**: Users are stored in a JSON file with their ID, name, email, and password.
- **Image Management**: Images are stored in a JSON file with details including ID, user_id, visibility (public/private), image URL, and creation timestamp.
- **Public and Private Images**: Users can upload images and set them as public or private.
  - **Public Images**: Accessible to everyone and can be downloaded without login.
  - **Private Images**: Only accessible by the user who uploaded them, requiring login to view.
- **Simple Storage**: The project uses JSON files for storage, making it easy to understand and modify.
- **Login System**: Allows users to log in and manage their private images.

## Project Structure

- **Backend (Express.js)**:
  - Handles API requests.
  - Manages user and image storage in JSON files.
- **Frontend (React.js)**:
  - Built with Vite.
  - Handles user authentication.
  - Provides the user interface for interacting with the gallery.
  - Allows users to upload images, view public images, and manage private images.

## Setup Instructions

### Prerequisites

- Node.js and npm installed on your machine.

### Cloning the Repository

```bash
git clone https://github.com/RuggedG/gallery
cd gallery
```

### Setting Up the Backend

1. **Navigate to the backend directory**:

   ```bash
   cd server
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```
   or
   ```bash
   pnpm install
   ```

3. **Create an `.env` file**:
   Copy the example file and adjust environment variables as needed.

   ```bash
   cp .env.example .env
   ```

4. **Start the server**:
   ```bash
   npm start:dev
   ```

### Setting Up the Frontend

1. **Navigate to the frontend directory**:

   ```bash
   cd ../client
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Start the React application**:
   ```bash
   npm run dev --port 3000
   ```

### Accessing the Application

- **Frontend**: Open your browser and navigate to `http://localhost:3000` to access the React application.
- **Backend API**: The Express server runs on `http://localhost:5000` and handles API requests.

## Usage

1. **Viewing Public Images**: No login required. Public images are accessible and can be downloaded.
2. **Viewing Private Images**: Log in to see private images and manage your gallery.

## Adapting to a Database

This project is built to be easily adaptable to a structural database if needed in the future. The current file-based storage method is designed for simplicity. Model classes are structured to be easily modified for integration with databases.

## Notes

- This is a simple project designed for ease of use and understanding.
- For production use, consider implementing a more secure storage solution and enhancing user authentication mechanisms.

## Contributing

Feel free to fork the repository and make pull requests. Contributions are welcome!

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
