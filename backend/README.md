# Backend

This implementation is for NodeJS based on [Express](https://expressjs.com/) and [MongoDB](https://www.mongodb.com/) and uses [mongoose](https://mongoosejs.com/) as the ODM. 


## Requirements

This project uses NodeJS, VUEJS and MongoDB. This is a summary of the project description. 

Project Goal: The project aims to expand an existing web application by adding new features and improving documentation. ​ The application follows a MEVN stack architecture (MongoDB, Express, VueJS, Node) and is a prototype implementation. ​

Background: The application is a basic data platform developed for a non-profit organization in the Houston area. ​It is used by Community Health Workers (CHWs) to help clients with basic needs. ​ The application allows CHWs to enter client information, create events, and sign up clients for events. ​ The data for all organizations is stored in a single database, with each organization having its own instance of the application. ​

Requirements:
- Update the code from Options API to Composition API. ​
- Add user login capabilities with different roles (viewers and editors). ​
- Implement CRUD functionality for services at the data layer. ​
- Extend the dashboard page with a pie or doughnut chart showing clients by zip code. 

Sprints:
- Sprint 3: Expand the backend API, document the API, and create a presentation 
- Sprint 4: Peer evaluation of classmates' projects 


## Postman Documentation

More details about the API endpoints can be be found at <https://documenter.getpostman.com/view/23619637/2sA3JGdiAt>


## Project setup

Install all dependencies.

    npm install

### Before startup
You need to setup a MongoDB database (can be local or remote).

Make sure you have a collection named 'org' in your database that contains at least one organization with the orgid listed in your environment variable (see below).

An example document inside the org collection in the DB could look like:
```
{
    "_id" : ObjectId("64e0380b3cc28d087655693b"),
    "name" : "Community Center"
}
```

The database also needs to contain users with hashed passwords and their role. We provide a sample script to create hashed passwords. Please read more about hased password with bcrypt https://heynode.com/blog/2020-04/salt-and-hash-passwords-bcrypt/. There should be at least one user with the viewer role and one with the editor role.

An example document inside the 'users' collection in the DB could look like:
```
{
    "_id" : ObjectId("64e03e5e3cc28d0886756963"),
    "username" : "marry",
    "role" : "editor",
    "password" : "$2b$10$Vt4jS2ORVImiuyhvAbS1DO8tnEUB0buUUadpFVoho6TfJXzKbRi8a",
    "org" : ObjectId("64e0380b3cc28d087655693b")
}
```

Setup a .env file with the following variables: MONGO_URL, PORT, ORG_ID and JWT_SECRET

    MONGO_URL= that is the Mongo URL connection string
    PORT= e.g.3000
    ORG_ID = that is the orgid
    JWT_SECRET=this can be a randomly generated string. It is used to verify JWT tokens

### Compiles and hot-reloads for development

To start up the backend for devlopment run:

    npm start

# References
1. Claude Ai
- https://claude.ai/

2. Chat Gpt
- https://chat.openai.com/