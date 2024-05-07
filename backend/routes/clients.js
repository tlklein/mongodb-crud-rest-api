// This file stores all the API endpoints for making calls to the "clients" collection in the MongoDB database

// Import functionalities
const express = require('express');
const router = express.Router();

// Middleware for authorization. For API calls that require authorization, this middleware checks if the header of API calls have a valid security token. If no security token or invalid security token, then the API call is not made.
const authMiddleWare = require('../auth/authMiddleWare');

// importing data model schemas
const { clients, events } = require('../models/models');
const { ObjectId } = require('mongodb');

// reading the org id from the environment variable
const org = process.env.ORG_ID;

// API Endpoint to Get all clients
router.get('/', authMiddleWare, async (req, res) => {
  try {
    const cli = await clients.find({});
    res.json(cli);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// API endpoint to GET single client by ID
router.get('/id/:id', authMiddleWare, async (req, res) => {
  try {
    const data = await clients.findOne({ _id: req.params.id, orgs: org });
    if (!data) {
      res.status(400).send('Client not found');
    } else {
      res.json(data);
    }
  } catch (error) {
    console.error('Error fetching client:', error);
    res.status(500).send(error.message);
  }
});

// API endpoint to GET entries based on search query
// Ex: '...?firstName=Bob&lastName=&searchBy=name'
router.get('/search', authMiddleWare, async (req, res) => {
  const dbQuery = { orgs: org };
  let queryArray = [];
  let regexOptions = 'i';

  switch (req.query.searchBy) {
    case "name":
      if (req.query.firstName) {
        const firstNameRegex = new RegExp(
          `.*${req.query.firstName}.*`,
          regexOptions
        );
        queryArray.push({ firstName: { $regex: firstNameRegex } });
      }
      if (req.query.lastName) {
        const lastNameRegex = new RegExp(
          `.*${req.query.lastName}.*`,
          regexOptions
        );
        queryArray.push({ lastName: { $regex: lastNameRegex } });
      }
      break;
    case "number":
      if (req.query.phoneNumber) {
        const phoneNumberRegex = new RegExp(
          `.*${req.query.phoneNumber}.*`,
          regexOptions
        );
        queryArray.push({
          "phoneNumber.primary": { $regex: phoneNumberRegex },
        });
      }
      break;
    default:
      res.status(400).send("Invalid searchBy");
      return;
  }

  if (queryArray.length > 0) dbQuery["$and"] = queryArray;

  try {
    const data = await clients.find(dbQuery);
    res.json(data);
  } catch (error) {
    console.error('Search query error:', error);
    res.status(500).send(error.message);
  }
});

router.post('/', authMiddleWare, async (req, res) => {
  try {
    const newClient = {
      ...req.body,
      orgs: [org]  // Use the org from environment variables
    };
    const client = await clients.create(newClient);
    res.status(201).send("New client created successfully");
  } catch (error) {
    console.error('Error creating new client:', error);
    res.status(500).send(error.message);
  }
});

// API endpoint to PUT update client
router.put("/update/:id", authMiddleWare, async (req, res) => {
  try {
    const data = await clients.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!data) {
      res.status(400).send("Client not found.");
    } else {
      res.status(201).send("Client updated successfully");
    }
  } catch (error) {
    console.error('Error updating client:', error);
    res.status(500).send(error.message);
  }
});

// API endpoint to hard delete client by ID, can be only be done if client is not signed up for events
router.delete("/:id", authMiddleWare, async (req, res) => {
  try {
    const client = await clients.findOne({ _id: req.params.id, orgs: org });
    if (!client) {
      res.status(400).send("Client not found");
      return;
    }

    const eventEntries = await events.find({ attendees: req.params.id, org: org });
    if (eventEntries.length > 0) {
      res.status(406).send("Client is signed up for events and can't be deleted.");
      return;
    }

    const deleted = await clients.findByIdAndDelete(req.params.id);
    if (!deleted) {
      res.status(400).send('Client not found');
    } else {
      res.status(200).send("Client deleted successfully");
    }
  } catch (error) {
    console.error('Error deleting client:', error);
    res.status(500).send(error.message);
  }
});

// GET clients by zip code for dashboard
router.get('/byzip', async (req, res) => {
  try {
    const data = await clients.aggregate([
      {
        $match: {
          "address.zip": { $exists: true, $ne: "" }
        }
      },
      {
        $group: {
          _id: "$address.zip",
          count: { $sum: 1 }
        }
      }
    ]);
    res.json(data);
  } catch (error) {
    console.error('Aggregation error:', error);
    res.status(500).send(error.message);
  }
});

module.exports = router;
