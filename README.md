# PIXELDAT

## HEALTH TRACKER METRIC

The application, named 'HealthTracker', will serve as a mobile platform for users to track daily health metrics such as steps taken, water intake, and calorie consumption.

##INTRODUCTION

This README contains basic cloning and running instructions for you to be able to get the API with all the necessary
dependencies up and running locally. This file, though, does not contain exact details, and rules, that are to be
followed throughtout the development of the API.

## STEPS IN SETTING UP THE APP LOCALLY

### Setting Up The Server

**NOTE:** Make sure you have Node installed on your system and the node package manager (npm) as well as yarn

After extracting the zip folder To set up the server.

- open the extracted zip folder using a code Editor preferrably Vs code.

- navigate into the server folder using the command on your vs code terminal

```bash
cd server
```

- inside the server directory run the command below to install all the dependencies for this application

```bash
yarn
```

- create an environment variable file since u might have lost the file on extraction of the folder. you can create the file manually inside your server directory by clicking on create new file and naming it .env OR you can use the command below on your terminal if you are on mac or if you have bash installed on your window

```bash
touch .env
```

- After creating the environment variable, i have attached an example file named .env.example where you can see the sample of the environment variables. copy all the enviroment variable from here or from the .env.example file to setup the environment veriables.
- for the development of this project i have used 2 database (Mysql and sqlite) with different set up for Production, Development and testing. below is the env i have used

```bash
# server config
NODE_ENV=testing # development, testing,  production
PORT=5000
JWT_SECRETE=hbjhhhvhg



# cors config
ALLOWED_ORIGINS=*

# rabbitmq conf

# database config for production
DB_USERNAME=myusername
DB_PASSWORD=mypassword
DB_HOST=myhostname
DB_PORT=5432
DB_NAME=mydb
DB_INTERNAL_URL=internalurl
DB_URI = dburl


# url config

BACKEND_URL=http://localhost:5000


```

- I have use sqlite for testing of the app which is a lighter version of mysql and would also recommend using sqlite for the testing since you wont be needing any configuration like password or username to get the application running. sqlite is automaticall create with the app and will allow for easy testing and to run this application using sqlite you must set the NODE_ENV=testing in your .env file

- also if you want to switch to any of the database say my mysql in the development environment, you will have to provide the necessary credential of your sql local db. and make the changes on the `src/db/index.ts`
  by setting the dbname,username,password and host

- Also for the port it must be set to 5000 since the mobile app communicate using 5000 except this will be change in the app.

- After setting up the environment variables you can now start up the server by running the command

```bash
yarn dev
```

### Setting Up The Flutter App

**NOTE:** Make sure you have Flutterr installed on your system and other dependencies like your emulators.

- navigate into the client folder using the command on your vs code terminal

```bash
cd client
```

- inside the client directory run the command below to install all the dependencies for this application

```bash
flutter pub get
```

- incase of error to upgrade the dependencies run

```bash
flutteer pub upgrade
```

- after installing the dependencies on your vscode click on run and and select run without debugging

## Folder structure for Server

```
StanleyOmeje_FullStacKDevTest
│
├── client
│   └── Lib
└── server
    └── src
    │   ├── app.ts
    │   ├── controller
    │   │   ├── metric
    │   │   ├     └── metricController.ts
    │   │   └── index.ts
    │   │   └── user
    │   │        └── userController.ts
    │   ├── db
    │   │   ├── models
    │   │   │       └──userModel.ts
    │   │   ├       └── metricModal.ts
    │   │   └── index.ts
    │   │
    │   ├── middleware
    │   │           └── auth.ts
    │   │           └── system.middlewares.ts
    │   ├── routes
    │   │   ├
    │   │   ├
    │   │   ├── index.route.ts
    │   │   ├── metricRoute.ts
    │   │   └── userRoute.ts
    │   │
    │   └── utils
    │    │     └── utils.ts
    │    │
    │    ├── .env
    │    ├── .gitignore
    │    ├── tsconfig.json
    │    ├── package.json
    │    ├── Readme
    │    └── yarn.lock
    README.md
```

## Routes

1. Users

```
create user : POST localhost:5000/user/reggister
login a user: POST localhost:5000/user/login
```

2. metrics

```
create metric : POST localhost:5000/api/create
get all metric : GET localhost:5000/api
delete metric : DELETE localhost:5000/api/delete/:id
```

## API Examples

- Register a User

  - Method and Headers

  ```
  POST /user/register
  Host: localhost:5000
  Content-Type: application/json
  ```

  - Request Body

  ```json
  {
    "name": "stanley Omeje",
    "email": "stanzealot@gmail.com",
    "password": "12345678"
  }
  ```

  - Response Body: 200

  ```json
  "record": {
        "isVerified": false,
        "id": "a883fba2-77c1-4072-a7c2-10061bdf34f6",
        "name": "stanley Omeje",
        "email": "stanzealot@gmail.com",
        "password": "$2a$08$z.VRjsgBANhMFxjY49vxL.iNykP3mERI9.PSBKvWNlXaVXaWsJEAe",
        "updatedAt": "2024-04-18T12:08:22.041Z",
        "createdAt": "2024-04-18T12:08:22.041Z"
    }
  ```

- Login User

  - Method and Headers

  ```
  POST /user/login
  Host: localhost:5000
  Content-Type: application/json
  ```

  - Request Body

  ```json
  {
    "email": "stanzealot@gmail.com",
    "password": "12345678"
  }
  ```

  - Response Body: 200

  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjI5YTY1OGE0LTJlN2MtNGIxYi1hM2EwLWYzMjEwOTE3MGNhMCIsImlhdCI6MTcxMzQyNjUwOCwiZXhwIjoxNzE0MDMxMzA4fQ.w2QfH0_9DQAzDzDKnQig1Xny6Qjc9gvqlGpXoEpJyUg",
    "id": "29a658a4-2e7c-4b1b-a3a0-f32109170ca0",
    "name": "stanzealot",
    "password": "$2a$08$aQ/sL91Oedam8RqiieOA2OIkM/dNfGvfeY/qzSrFxkMANvwdjh9/m",
    "email": "stanzealot@gmail.com"
  }
  ```

- Creat metric

  - Method and Headers

  `  POST /api/create
 Host: localhost:5000
 Content-Type: application/json`
  x-auth-token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjI5YTY1OGE0LTJlN2MtNGIxYi1hM2EwLWYzMjEwOTE3MGNhMCIsImlhdCI6MTcxMzQyNjUwOCwiZXhwIjoxNzE0MDMxMzA4fQ.w2QfH0_9DQAzDzDKnQig1Xny6Qjc9gvqlGpXoEpJyUg",
  \_ Request Body
  `json
 {
     "quantity": "6",
    "date":"2024-04-15 00:00:00.000",
    "category":"waterintake"
 }
 ` \* Respond Body : 201
  `json
 {
    "id": "460bf150-6578-4d29-b59c-d797c61c2c72",
    "quantity": "5",
    "date": "2024-04-17T00:00:00.000Z",
    "category": "steps"
}
 `
