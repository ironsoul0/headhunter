# Headhunter

Server for annual headhunter event

## Instalation

```sh
git clone https://github.com/ironsoul0/headhunter.git
cd headhunter
npm install
```

## Usage

Before you start:

1. Create .env file with all needed enviromental variables:
    - `BOT_TOKEN` - your telegram bot token
    - `SMTP_LOGIN` - SMTP login
    - `SMTP_PASSWORD` - SMTP password
    - `SMTP_NAME` - Display name for your emails
    - `DB_CONNECT` - mongo connection link
2. Get `students.json` with all allowed students in form of:
    ```json
    {
        "id" : {
            "name": "FirstName LastName",
            "school": 0
        }
    }
    ```