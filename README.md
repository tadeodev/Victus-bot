# Telegram Bot with Weather and Anime Scraping Capabilities

This repository contains a Telegram bot that provides weather updates and anime information. The bot is built using the `node-telegram-bot-api` library and integrates with several APIs for its functionalities.

## Features

- Responds to various commands to provide anime information.
- Fetches weather updates.
- Customizable command handling.
- Periodic alerts and scraping functions.

## Setup

### Prerequisites

- Node.js installed on your machine.
- A Telegram bot token from BotFather.
- API key for a weather service.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/your-repo-name.git
   cd your-repo-name

2.	Install the necessary dependencies:
   npm install

3.	Create a .env file in the root directory and add your API keys:
   BOT_API_KEY=your-telegram-bot-token
   WEATHER_API_KEY=your-weather-api-key

### Commands

	•	/start - Initialize the bot and add a user.
	•	/siguiendo - List the animes the user is following.
	•	/seguir <anime> - Follow a new anime.
	•	/quitar <anime> - Unfollow an anime.
	•	/info <anime> - Get information about an anime.

### File Structure

	•	index.js - Main file to configure and run the bot.
	•	commands/ - Directory containing the command handling modules:
	•	following.js
	•	scraper.js
	•	user.js
	•	weather.js

This README provides a clear overview of the project, setup instructions, commands, and code structure, making it easy for others to understand and contribute.
