<p align="center">
  <a href="https://trytohunt.me">
    <img src="images/logo.png" alt="Logo" width="450">
  </a>

  <h2 align="center">HeadHunter 😈</h2>

  <p align="center">
    Server and bot code for annual HeadHunter event 🎃
    <br />
    <br />
    <a href="https://t.me/nu_headhunter_bot">Try the bot</a>
    ·
    <a href="https://trytohunt.me/">Visit the website</a>
  </p>
</p>

## Installation

```sh
git clone https://github.com/ironsoul0/headhunter.git
cd headhunter
npm install
npm start
```

## Usage

Before you start:

1. Create .env file with all needed environmental variables:
    - `BOT_TOKEN` - Your Telegram bot token
    - `SMTP_LOGIN` - SMTP Login
    - `SMTP_PASSWORD` - SMTP Password
    - `SMTP_NAME` - Display name for your emails
    - `DB_CONNECT` - Mongo connection link

2. Create `students.json` with all allowed students in form of:
    ```json
    {
        "id" : {
            "name": "FirstName LastName",
            "school": 0
        }
    }
    ```

## Contributors

* [uenify](https://uenify.com)
* [ironsoul](https://ironsoul.me)
