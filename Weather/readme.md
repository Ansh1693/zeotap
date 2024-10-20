# Weather Application

## Project Structure

The project is divided into two main parts: the client and the server.

```sh
    Weather/
    ├── client/
    │ ├── components/
    │ │ ├── ui/
    │ │ │ ├── button.tsx
    │ │ │ ├── input.tsx
    │ │ │ ├── textarea.tsx
    │ │ │ └── dialog.tsx
    │ │ ├── WeatherCard.tsx
    │ │ ├── WeatherDetails.tsx
    │ ├── pages/
    │ │ ├── index.tsx
    │ │ └── \_app.tsx
    │ ├── styles/
    │ │ └── globals.css
    │ ├── hooks/
    │ │ └── use-weather.ts
    │ ├── utils/
    │ │ └── api.ts
    │ ├── tsconfig.json
    │ ├── package.json
    │ └── Dockerfile
    ├── server/
    │ ├── src/
    │ │ ├── routes/
    │ │ │ └── weather.ts
    │ │ ├── controllers/
    │ │ │ └── weatherController.ts
    │ │ ├── models/
    │ │ │ └── weatherData.ts
    │ │ ├── utils/
    │ │ │ └── initialisers/
    │ │ │ └── prisma.ts
    │ │ ├── tests/
    │ │ │ └── weatherTest.ts
    │ │ ├── app.ts
    │ │ ├── tsconfig.json
    │ │ ├── package.json
    │ │ └── Dockerfile
    ├── docker-compose.yml
    ├── .env
```

## Schema

```sh
    Weather Data
    model WeatherData {
        id          String  Primary Key
        city        String
        temperature Float
        feelsLike   Float
        condition   String
        pressure    Float
        humidity    Float
        visibility  Float
        timestamp   DateTime
    }

    Daily Summary

    model DailySummary {
        id                String
        date              DateTime
        city              String
        avgTemp           Float
        maxTemp           Float
        minTemp           Float
        avgPressure       Float
        avgHumidity       Float
        avgVisibility     Float
        dominantCondition String

        city + date is my composite key here
    }

    Alerts

    model Alert {
        id        String   PRimary Key
        city      String
        condition String
        times     Int
        email     String
        resolved  Boolean  default(false)
        timestamp DateTime

    }

```

## Technologies Used

- **Frontend**: Next.js, React, Tailwind CSS, ShadCN, Typescript(Strongly typed language)
- **Backend**: Express, Node.js, PostgresSQL, Prisma(ORM), Typescript
- **Build Tools**: Docker, Docker Compose
- **Linting**: ESLint, Prettier

## Idea

- I am fetching weather data based on cities at consistent interval here it is 10 minutes and saving to a persistent storage here it is postgres db and updating daily summary based on data fetched
- After fetching , I am checking alerts if one has triggered. For checking , I am getting all unresolved alerts and fetching required data and resolving on that basis

## Bonus

- Incorporated additional features like pressures, visibility
- Incorporated forecasts

## API Endpoints

```sh
GET /api/weather?city="" : Gets weather data for cities and its daily summaries
GET /api/weeather/forecast?city=""&times="" : Gets forecast data

```

```sh
POST /api/alerts: Creates a new alert.

```

```sh
DELETE /api/alerts/:id : Delete alert by ID.
```

```sh
GET /api/alerts: Retrieves all alerts.

```

```sh
GET /api/alerts/resolved: Retrieves all resolved alerts.

```

## Why SQL?

Given the structured nature of the data, SQL databases are a better fit for this application.

## Test Cases

**Test Case 1: System Setup**: Verifies that the server starts successfully.
**Test Case 2: OpenWeather API**: Checks connection to OpenWeatherMap API with a valid API key.
**Test Case 3: API Call at intervals**: Ensures API calls are made at configured intervals using cron jobs.
**Test Case 4: Retrieve and Parse Weather Data**: Verifies that weather data is retrieved and parsed correctly.
**Test Case 5: Define and Configure User Thresholds**: Checks that user thresholds are defined and configured correctly.

### Running the Project

1. **Clone the repository**:

   ```sh
   git clone https://github.com/Ansh1693/Zeotap.git
   cd weather
   ```

2. **Run using Docker**:

```sh
    docker-compose up --build
```

3. **Access the client**:

   ```sh
   http://localhost:3000/

   ```

4. **Access the server**:
   ```sh
   http://localhost:5000/
   ```

If docker-compose method doesn't work

## client

1. ** Clone the repo**

```sh
    git clone https://github.com/Ansh1693/Zeotap.git
    cd weather/client
```

2. **Install Dependencies**

```sh
    npm install
```

```sh
    yarn
```

3. **Copy .env**

```sh
    Copy from .env.example to .env.local

```

4. **Run**

```sh
    npm run dev
```

```sh
    yarn dev
```

5. **Access the client**:

   ```sh
   http://localhost:3000/

   ```

## Server

1. **CLone Repo**

```sh
    git clone https://github.com/Ansh1693/Zeotap.git
    cd weather/server
```

2. **Install Dependencies**

```sh
    npm install
```

```sh
    yarn
```

3. ** Start Postgres Server Locally or using Docker**

```sh
    docker run -d --name postgres -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=12345678 -e POSTGRES_DB=weather -p 5432:5432 postgres
```

4. **Copy .env**

```sh
    Copy from .env.example to .env

```

5. **Run**

```sh
    npm run start
```

```sh
    yarn start
```

6. **Access the server**:
   ```sh
   http://localhost:5000/
   ```
