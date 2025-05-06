# Hokie Nest

## Prerequisites

*   Node.js (LTS version recommended)
*   npm (usually comes with Node.js)
*   Supabase CLI: `npm install supabase --save-dev` (or install globally)

## Setup Instructions

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd hokie-nest
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    *   Create a new `.env` file in the project root:
        ```bash
        cp .env.example .env 
        ```
        *If `.env.example` doesn't exist, create `.env` manually.*
    *   Fill in the necessary environment variables in the `.env` file. You'll need your Supabase project URL and anon key:
        ```plaintext
        VITE_SUPABASE_URL=YOUR_SUPABASE_URL
        VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
        ```

4.  **Set up Supabase:**
    *   Log in to the Supabase CLI (if you haven't already):
        ```bash
        npx supabase login
        ```
    *   Link your local project to your Supabase project (replace `<project-ref>` with your actual Supabase project reference ID):
        ```bash
        npx supabase link --project-ref <project-ref>
        ```
        *(You might be prompted for your database password).*
    *   Apply database migrations:
        ```bash
        npx supabase db push
        ```
        *(This command might vary if you have a specific migration script in `package.json`)*

## Running the Project

To start the development server:

```bash
npm run dev
```

This will usually open the application in your default browser at `http://localhost:5173` (or another port specified by Vite).

## Running Tests

To run the test suite (using Vitest):

```bash
npm run test
```

This will execute the tests defined in your project and report the results. 