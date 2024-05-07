// This file contains API endpoints for interacting with "org" collection in MongoDB database
const express = require('express');
const router = express.Router();
const { orgs } = require('../models/models');

router.get('/', async (req, res, next) => {
  try {
    // Retrieve organization based on ORG_ID from environment variable
    const org = await orgs.findOne({ _id: process.env.ORG_ID });
    
    if (!org) {
      // If organization not found, return a 404 error
      return res.status(404).send('Organization not found');
    }
    
    // If organization found, send the entire organization object as the response
    res.json(org);
  } catch (error) {
    // If an error occurs, pass it to the error handling middleware
    next(error);
  }
});

module.exports = router;
