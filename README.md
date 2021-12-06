# FCC API Project: Exercise Tracker

## About
This is my project of the [Exercise Tracker challenge](https://www.freecodecamp.org/learn/apis-and-microservices/apis-and-microservices-projects/exercise-tracker) for the freeCodeCamp Back End Development and APIs certification. It was built based on the boilerplate available [here](https://github.com/freeCodeCamp/boilerplate-project-exercisetracker/).

## Technologies
- **Node.js** and **Express** to create the server and handle routes, requests and responses.
- **Mongoose** to persist all the data.

## Endpoints:

Endpoints | Description | Params
----------|-------------|-------------
POST `/api/users` | Create a new user | username* (via body)
GET `/api/users` | Return all registered users | n/a
POST `/api/:_id/exercises` | Add an exercise for a specific user | userId*, description*, duration*, date (via body)
GET `/api/:_id/logs` | Return the log of a user's exercises | userId*, from, to, limit (via query)

#### Example output:
* `{"username":"userTest","_id":"dolQVVaZT"}`
* `{"username":"userTest","count":1,"_id":"dolQVVaZT","log":[{"description":"exerciseTest","duration":20,"date":"Mon May 13 2002"}]}`

## How to use:
```
setup Mongodb server
create .env file
npm install
npm start
```
