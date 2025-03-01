# Citizen Complaint System

A web-based complaint tracking and reporting system where citizens can file complaints and track their resolution status. Admins (concerned authorities) can manage and update complaint statuses. The system is built using modern web technologies and is hosted on Netlify.

## Features

### User (Citizen)
- **Register/Login** using email or phone number.
- **Submit complaints** with type, location, description, and media uploads (images/videos).
- **Track complaint status** in real-time.
- **View complaint history** and past submissions.
- **Filter and search complaints** based on status, type, and date.

### Admin (Authority)
- **View all complaints** submitted by users.
- **Update complaint statuses** (Pending → In Progress → Resolved).
- **Filter, search, and sort complaints** for better management.
- **Download complaint data** as a CSV file.

### UI & UX Enhancements
- **Dark-themed modern UI** with Tailwind CSS.
- **Minimalistic and user-friendly interface.**
- **Real-time validation** to prevent incorrect or incomplete submissions.
- **Fully responsive design** for mobile, tablet, and desktop users.

## Tech Stack

### Frontend:
- **React** (JS library for UI development)
- **TypeScript** (Strongly typed JavaScript)
- **Tailwind CSS** (Utility-first CSS framework)

### Build Tools:
- **Vite** (Fast development and bundling tool)

### Deployment:
- **Netlify** (Static site hosting and deployment)

### Other Tools:
- **ESLint** (Code linting)
- **PostCSS** (CSS processing)

## Installation & Setup

1. Clone the repository:
   ```sh
   git clone https://github.com/GSKPROCODER/citizencomplaintsystem.git
   cd citizencomplaintsystem
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Run the development server:
   ```sh
   npm run dev
   ```

4. Open the app in your browser at `http://localhost:3000`.

## Contributing

Feel free to submit pull requests to improve the project. Before contributing:
- Follow the existing code structure.
- Run ESLint to check for linting issues:
  ```sh
  npm run lint
  ```
- Test all features before submitting changes.

## License

This project is licensed under the MIT License. Feel free to use and modify it as needed.
