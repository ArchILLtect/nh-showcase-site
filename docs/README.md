

TTD:
   // TODO: Make a DB for projects
   // TODO: Implement and admin role
   // TODO: Implement functionality for adding/editing blogs.
   // TODO: Implement functionality for adding/editing projects.
   // TODO: Update 




Project File Structure:
my-showcase-site/
├── backend/                       # Backend-related files
│   ├── node_modules/              # Backend dependencies
│   ├── server.js                  # Express server entry point
│   ├── package.json               # Backend package manifest
│   ├── .env                       # Environment variables (e.g., database credentials)
│   └── config/                    # Configuration files (e.g., database setup)
│       └── db.js
├── src/                           # Frontend React app
│   ├── components/                # Reusable React components
│   │   └── ExampleComponent.jsx
│   ├── pages/                     # React pages (e.g., Home, About)
│   │   └── Home.jsx
│   ├── styles/                    # CSS or SCSS files
│   │   └── index.scss             # Global styles (if using SCSS)
│   ├── App.jsx                    # Main React component
│   ├── index.js                   # React entry point
│   └── api/                       # API interaction (e.g., Axios calls)
│       └── apiClient.js
├── public/                        # Static assets
│   ├── index.html                 # HTML template
│   └── favicon.ico
├── node_modules/                  # Frontend dependencies
├── .gitignore                     # Files and folders to ignore in Git
├── package.json                   # Frontend package manifest
├── tailwind.config.js             # Tailwind CSS configuration
├── postcss.config.js              # PostCSS configuration
├── README.md                      # Project documentation
└── .env                           # Frontend environment variables
