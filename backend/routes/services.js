// This file contains API endpoints for interacting with the "services" collection of the MongoDB database

const express = require('express');
const router = express.Router();

// Import services and events schema
const { services, events } = require('../models/models');

// Middleware for authorization
const authMiddleWare = require('../auth/authMiddleWare');

// Organization ID from environment
const org = process.env.ORG_ID;

// API endpoint to get all services for org
router.get('/', authMiddleWare, async (req, res, next) => {
  try {
    const data = await services.find({ org: org }).sort({ updatedAt: -1 });
    res.json(data);
  } catch (error) {
    next(error);
  }
});

// API endpoint to GET a single service by ID
router.get('/id/:id', authMiddleWare, async (req, res, next) => {
  try {
    const data = await services.findOne({ _id: req.params.id, org: org });
    if (!data) {
      res.status(400).send('Service not found');
    } else {
      res.json(data);
    }
  } catch (error) {
    next(error);
  }
});

// API endpoint to GET entries based on search query
router.get('/search', authMiddleWare, async (req, res, next) => {
  const dbQuery = { org: org };
  try {
    switch (req.query.searchBy) {
      case 'name':
        dbQuery.name = { $regex: `${req.query.name}`, $options: 'i' };
        break;
      case 'description':
        dbQuery.description = {
          $regex: `${req.query.description}`,
          $options: 'i',
        };
        break;
      default:
        return res.status(400).send('Invalid searchBy');
    }
    const data = await services.find(dbQuery);
    res.json(data);
  } catch (error) {
    next(error);
  }
});

// API endpoint to POST new service
router.post('/', authMiddleWare, async (req, res, next) => {
  try {
    const newService = { ...req.body, org: [org] };
    await services.create(newService);
    return res.status(200).send('New service created successfully');
  } catch (error) {
    next(error);
  }
});

// API endpoint to PUT -> update service
router.put('/update/:id', authMiddleWare, async (req, res, next) => {
  try {
    const data = await services.findByIdAndUpdate(req.params.id, req.body);
    if (!data) {
      res.status(400).send('Service not found');
    } else {
      res.status(201).send('Service updated successfully');
    }
  } catch (error) {
    next(error);
  }
});

// API endpoint to hard DELETE event by ID
router.delete('/:id', authMiddleWare, async (req, res, next) => {
  try {
    const serviceEvents = await events.find({
      services: req.params.id,
      org: org,
    });
    if (serviceEvents.length !== 0) {
      return res
        .status(400)
        .send('Service can not be deleted since it is being used by events.');
    }
    const data = await services.findOneAndDelete({
      _id: req.params.id,
      org: org,
    });
    if (!data) {
      res.status(400).send('Service not found');
    } else {
      res.status(200).send('Service deleted successfully');
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
