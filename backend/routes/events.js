// This file contains API endpoints for interacting with the "events" collection in the MongoDB database

const express = require("express");
const router = express.Router();

const org = process.env.ORG_ID;

// Middleware for authorization. For API calls that require authorization, this middleware checks if the header of API calls have a valid security token. If no security token or invalid security token, then the API call is not made.
const authMiddleWare = require("../auth/authMiddleWare");

// importing data model schemas
const { events, clients } = require("../models/models");

// API endpoint to get all events for org
router.get("/", authMiddleWare, async (req, res, next) => {
  try {
    const eventData = await events.find({ org: org }).sort({ date: -1 }).exec();
    res.json(eventData);
  } catch (error) {
    next(error);
  }
});

// API endpoint to GET single event by ID
// Node.js Express route to get an event by ID
router.get("/id/:id", authMiddleWare, async (req, res) => {
  try {
    const event = await events.findOne({ _id: req.params.id, org: org });
    if (!event) {
      res.status(404).send("Event not found");
    } else {
      res.json(event);
    }
  } catch (error) {
    console.error('Error fetching event by ID:', error);
    res.status(500).send("Internal server error");
  }
});

// API endpoint to GET events based on search query
router.get("/search/", authMiddleWare, (req, res, next) => {
  const dbQuery = { org: org };
  switch (req.query.searchBy) {
    case "name":
      dbQuery.name = { $regex: `${req.query.name}`, $options: "i" };
      break;
    case "date":
      dbQuery.date = req.query.eventDate;
      break;
    default:
      res.status(400).send("invalid searchBy");
      return; // Prevent further execution
  }
  events.find(dbQuery)
    .then(data => res.json(data))
    .catch(error => {
      console.error('Error searching events:', error);
      next(error);
    });
});

// API endpoint to GET events for which a client is signed up
router.get("/client/:id", authMiddleWare, (req, res, next) => {
  events.find({ attendees: req.params.id, org: org })
    .then(data => res.json(data))
    .catch(error => {
      console.error('Error fetching client events:', error);
      next(error);
    });
});

// API endpoint to GET events for which a client is not signed up
router.get("/client/:id/not-registered", authMiddleWare, async (req, res, next) => {
  try {
    const eventsNotRegistered = await events.find({
      attendees: { $nin: [req.params.id] },
      org: org,
    });
    res.json(eventsNotRegistered);
  } catch (error) {
    next(error);
  }
});

// API endpoint to GET attendee details for an event
router.get("/attendees/:id", authMiddleWare, (req, res, next) => {
  events.findById(req.params.id)
    .then(event => {
      if (!event) {
        res.status(400).send("Event not found");
      } else {
        const attendeeIds = event.attendees.map(attendee => attendee.toString());
        clients.find({ _id: { $in: attendeeIds } })
          .then(clients => res.json(clients))
          .catch(error => {
            console.error('Error fetching attendees:', error);
            next(error);
          });
      }
    })
    .catch(error => {
      console.error('Error finding event:', error);
      next(error);
    });
});

// API endpoint to GET all events for a given service
router.get("/service/:id", authMiddleWare, async (req, res, next) => {
  try {
    const eventsWithService = await events
      .find({ services: { $in: [req.params.id] }, org: org })
      .select({ _id: 1, name: 1, date: 1, address: { line1: 1 } })
      .lean();
    res.json(eventsWithService);
  } catch (error) {
    next(error);
  }
});

// API endpoint to POST new event
router.post("/", authMiddleWare, (req, res, next) => {
  const newEvent = req.body;
  newEvent.org = org;
  events.create(newEvent)
    .then(data => res.status(200).send("New event created successfully"))
    .catch(error => {
      console.error('Error creating new event:', error);
      next(error);
    });
});

// API endpoint to PUT -> update event
router.put("/update/:id", authMiddleWare, (req, res, next) => {
  events.findOneAndUpdate({ _id: req.params.id, org: org }, req.body)
    .then(data => res.status(200).send("Event updated successfully"))
    .catch(error => {
      console.error('Error updating event:', error);
      next(error);
    });
});

// API endpoint to PUT -> add attendee to event
router.put("/register", authMiddleWare, (req, res, next) => {
  events.find({ _id: req.query.event, attendees: req.query.client, org: org })
    .then(data => {
      if (!data.length) {
        events.findByIdAndUpdate(req.query.event, { $push: { attendees: req.query.client } })
          .then(data => res.status(200).send("Client added to event"))
          .catch(error => {
            console.error('Error adding attendee:', error);
            next(error);
          });
      } else {
        res.status(400).send("Client already added to event");
      }
    })
    .catch(error => {
      console.error('Error checking event registration:', error);
      next(error);
    });
});

// API endpoint to PUT -> remove attendee from event
router.put("/deregister", authMiddleWare, (req, res, next) => {
  events.findByIdAndUpdate(req.query.event, { $pull: { attendees: req.query.client } })
    .then(data => {
      clients.findByIdAndUpdate(req.query.client, { $pull: { events: req.query.event } })
        .then(data => res.send("Client deregistered with event"))
        .catch(error => {
          console.error('Error deregistering client from event:', error);
          next(error);
        });
    })
    .catch(error => {
      console.error('Error removing attendee:', error);
      next(error);
    });
});

// API endpoint to hard DELETE event by ID
router.delete("/:id", authMiddleWare, (req, res, next) => {
  events.findOne({ _id: req.params.id, org: org })
    .then(data => {
      if (!data) {
        res.status(400).send("Event not found");
      } else if (data.attendees.length === 0) {
        events.findOneAndDelete({ _id: req.params.id, org: org })
          .then(data => {
            if (!data) {
              res.status(400).send("Event not found");
            } else {
              res.status(200).send("Event deleted successfully");
            }
          })
          .catch(error => {
            console.error('Error deleting event:', error);
            next(error);
          });
      } else {
        res.status(400).send("Event has attendees and can't be deleted.");
      }
    })
    .catch(error => {
      console.error('Error finding event to delete:', error);
      next(error);
    });
});

// GET event attendance for the past two months for dashboard
router.get("/attendance", (req, res, next) => {
  const twoMonthsAgo = new Date();
  twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);

  events.find({ org: org, date: { $gte: twoMonthsAgo } })
    .sort({ date: 1 })  // Sorting by date in ascending order
    .then(data => {
      res.json(data);
    })
    .catch(error => {
      console.error('Error fetching attendance data:', error);
      next(error);
    });
});

module.exports = router;
