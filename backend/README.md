# Backend
This implementation is for NodeJS based on [Express](https://expressjs.com/) and [MongoDB](https://www.mongodb.com/) and uses [mongoose](https://mongoosejs.com/) as the ODM. 

## Postman Documentation
More details about the API endpoints can be found at <https://documenter.getpostman.com/view/23619637/2sA3JGdiAt>

## Project setup

Install all dependencies.

    npm install

### Before startup
You need to set up a MongoDB database (can be local or remote).

Make sure you have a collection named 'org' in your database that contains at least one organization with the orgid listed in your environment variable (see below).

An example document inside the org collection in the DB could look like:
```
{
    "_id" : ObjectId("64e0380b3cc28d087655693b"),
    "name" : "Community Center"
}
```

The database also needs to contain users with hashed passwords and their roles. We provide a sample script to create hashed passwords. Please read more about hashed passwords with bcrypt https://heynode.com/blog/2020-04/salt-and-hash-passwords-bcrypt/. There should be at least one user with the viewer role and one with the editor role.

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
To start up the backend for development run:

    npm start
    
