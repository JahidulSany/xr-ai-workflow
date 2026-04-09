# XR AI Workflow

XR AI Workflow is a modern Project Management Tool built with **React** for the frontend and a **Sequelize/Node/MySQL** backend. 

The application uses AI to analyze user project input and generate an enhanced XR project brief containing a summary, workflow recommendations, suggested tools, and next steps, which is then exported as a PDF and stored on the user’s profile page.


## Features

- **React-powered frontend** for a dynamic user experience
- **Sequelize ORM** for seamless database interactions
- **MySQL backend** for efficient data storage
- **Node.js server** for handling API requests
- **Full-stack integration** with streamlined development workflow

## Installation

Follow these steps to install and set up XR AI Workflow locally:

### 1. Clone the Repository

```sh
git clone https://github.com/JahidulSany/xr-ai-workflow.git
cd xr-ai-workflow
```

### 2. Create the Database

Open a terminal and enter MySQL:

```sh
mysql -u root -p
```

Enter your MySQL password when prompted, then create the database by running:

```sh
source db/schema.sql;
quit;
```

### 3. Install Dependencies

Run the following command in the root directory to install dependencies for both server and client:

```sh
npm install
```

### 4. Set up Environment Variables

copy .env.example files in the client and server folders, to cerate .env files. In the server folder, change your MySQL password

### 5. Seed the Database (Optional)

If you want to populate the database with sample data, run:

```sh
npm run seed
```

### 6. Start the Application

Run the following command to start the development server:

```sh
npm run dev
```

The application should now be running locally.

## Usage

- Open your browser and navigate to `http://localhost:5173` to access the xr-ai-workflow application.
- Explore features such as project wizard, profile page, PDF generator, etc.
- The Sequelize/NodeJS backend can be accessed via `http://localhost:3001`

## Contributing

Feel free to submit issues and pull requests to improve XR AI Workflow. Contributions are welcome!

## Mobile App (Capacitor)

This project uses [Capacitor](https://capacitorjs.com) to wrap the React app as a native iOS and Android app.

The `client/ios/` and `client/android/` folders are excluded from git (see `.gitignore`) as they are generated locally. To set them up after cloning:

### Prerequisites

- **Android:** Install [Android Studio](https://developer.android.com/studio)
- **iOS (Mac only):** Install Xcode from the App Store, then install CocoaPods:

```sh
brew install ruby
echo 'export PATH="/opt/homebrew/opt/ruby/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
sudo gem install cocoapods
echo 'export PATH="/opt/homebrew/lib/ruby/gems/4.0.0/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

### Add the native platforms

```sh
cd client
npx cap add ios
npx cap add android
```

### Build and sync

After making changes to the React app, build and sync to the native projects:

```sh
npm run build
npx cap sync
```

### Open in native IDE

```sh
npx cap open ios      # opens Xcode
npx cap open android  # opens Android Studio
```

## License

This project is licensed under the **MIT License**.

---

⭐ If you like this project, consider giving it a star on GitHub!
