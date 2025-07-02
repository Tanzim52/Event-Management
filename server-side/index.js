const express = require("express");
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;
const client = new MongoClient(process.env.MONGO_URI);

// Collections
let usersCollection;
let eventsCollection;

// Middleware
app.use(cors({
    origin: `${process.env.FRONTEND_URL}` || 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());

// DB Connect
async function connectDB() {
    await client.connect();
    const db = client.db("eventmanager");
    usersCollection = db.collection("users");
    eventsCollection = db.collection("events");
    console.log("✅ MongoDB Connected");
}

// Auth middleware
const authenticate = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    // console.log('Received token:', token);
    
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // console.log('Decoded token:', decoded);
        
        const user = await usersCollection.findOne({ _id: new ObjectId(decoded.id) });
        if (!user) return res.status(401).json({ message: "User not found" });
        
        req.user = user;
        next();
    } catch (err) {
        console.error('Token verification error:', err); 
        res.status(401).json({ message: "Invalid token" });
    }
};

// Register route
app.post("/api/auth/register",
    [
        body('name').trim().notEmpty().escape(),
        body('email').isEmail().normalizeEmail(),
        body('password').isLength({ min: 6 }),
        body('photoURL').isURL()
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, email, password, photoURL } = req.body;

        try {
            const exists = await usersCollection.findOne({ email });
            if (exists) {
                return res.status(400).json({ message: "Email already registered." });
            }

            const hashed = await bcrypt.hash(password, 10);
            const user = {
                name,
                email,
                password: hashed,
                photoURL,
                createdAt: new Date(),
                updatedAt: new Date(),
                joinedEvents: []
            };

            const result = await usersCollection.insertOne(user);
            const newUser = await usersCollection.findOne({ _id: result.insertedId });

            const token = jwt.sign({ id: result.insertedId }, process.env.JWT_SECRET, { expiresIn: "2h" });

            res.status(201).json({
                message: "Registered successfully",
                token,
                user: {
                    name: newUser.name,
                    email: newUser.email,
                    photoURL: newUser.photoURL
                }
            });
        } catch (err) {
            res.status(500).json({ message: "Registration failed", error: err.message });
        }
    }
);

// Login route (unchanged)
app.post("/api/auth/login", 
  [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
    //   console.log('Validation errors:', errors.array()); 
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    // console.log('Login attempt for:', email); 

    try {
      const user = await usersCollection.findOne({ email });
      if (!user || !(await bcrypt.compare(password, user.password))) {
        // console.log('Invalid credentials for:', email);
        return res.status(400).json({ message: "Invalid credentials." });
      }

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "2h" });

    //   console.log('Login successful for:', email); 
      res.json({
        message: "Login successful",
        token,
        user: {
          name: user.name,
          email: user.email,
          photoURL: user.photoURL,
          joinedEvents: user.joinedEvents || []
        }
      });
    } catch (err) {
      console.error('Login error:', err); 
      res.status(500).json({ message: "Login error", error: err.message });
    }
  }
);

// Add this endpoint to your backend
app.get("/api/auth/verify", authenticate, async (req, res) => {
  try {
    res.json({
      user: {
        name: req.user.name,
        email: req.user.email,
        photoURL: req.user.photoURL,
        joinedEvents: req.user.joinedEvents || []
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to verify token", error: err.message });
  }
});

// Refresh token route (unchanged)
app.post("/api/auth/refresh", authenticate, async (req, res) => {
    try {
        const newToken = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '2h' });
        res.json({ token: newToken });
    } catch (err) {
        res.status(500).json({ message: "Token refresh failed" });
    }
});

// Get current user (unchanged)
app.get("/api/auth/me", authenticate, async (req, res) => {
    try {
        res.json({
            user: {
                name: req.user.name,
                email: req.user.email,
                photoURL: req.user.photoURL,
                joinedEvents: req.user.joinedEvents || []
            }
        });
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch user" });
    }
});
// Add Event endpoint
app.post("/api/events", authenticate,
    [
        body('title').trim().notEmpty().escape(),
        body('name').trim().notEmpty().escape(),
        body('date').isISO8601(),
        body('location').trim().notEmpty().escape(),
        body('description').trim().notEmpty().escape(),
        body('attendeeCount').isInt({ min: 0 }),
        body('imageURL').isURL().optional()
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const event = {
                title: req.body.title,
                name: req.body.name,
                date: new Date(req.body.date),
                location: req.body.location,
                description: req.body.description,
                attendeeCount: req.body.attendeeCount || 0,
                imageURL: req.body.imageURL || null,
                createdBy: req.user._id,
                createdAt: new Date(),
                updatedAt: new Date()
            };

            const result = await eventsCollection.insertOne(event);
            const newEvent = await eventsCollection.findOne({ _id: result.insertedId });

            res.status(201).json({
                message: "Event created successfully",
                event: newEvent
            });
        } catch (err) {
            res.status(500).json({ message: "Failed to create event", error: err.message });
        }
    }
);

// Get upcoming events (events happening in the future)
app.get("/api/events/upcoming", async (req, res) => {
  try {
    const now = new Date();
    // console.log("Current time:", now.toISOString());
    
    // More flexible query that also logs what's being queried
    const events = await eventsCollection.aggregate([
      {
        $match: {
          date: { $gt: now }
        }
      },
      {
        $addFields: {
          dateType: { $type: "$date" } // This will help debug date type issues
        }
      },
      {
        $sort: { date: 1 }
      },
      {
        $limit: 6
      }
    ]).toArray();

    // console.log("Found events:", JSON.stringify(events, null, 2));
    res.json(events);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ message: "Failed to fetch events", error: err.message });
  }
});

// Get events created by the user
app.get('/api/events/my-events', authenticate, async (req, res) => {
    try {
        const events = await eventsCollection.find({
            createdBy: req.user._id
        }).sort({ date: -1 }).toArray(); // Newest first

        res.json(events);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch your events", error: err.message });
    }
});

// Get all events
app.get("/api/events", async (req, res) => {
  try {
    const events = await eventsCollection.find().sort({ date: -1 }).toArray();
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch events", error: err.message });
  }
});

// Join an event
// Join an event
// Join an event
app.post("/api/events/:id/join", authenticate, async (req, res) => {
    try {
        const eventId = req.params.id;
        const event = await eventsCollection.findOne({ 
            _id: new ObjectId(eventId) 
        });
        
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        // Convert user._id to string for comparison
        const userIdString = req.user._id.toString();
        
        // Check if user already joined
        if (event.attendees?.includes(userIdString)) {
            return res.status(400).json({ message: "Already joined this event" });
        }

        // Update event
        const eventUpdate = await eventsCollection.updateOne(
            { _id: new ObjectId(eventId) },
            { 
                $inc: { attendeeCount: 1 },
                $push: { attendees: userIdString }
            }
        );

        if (eventUpdate.modifiedCount === 0) {
            return res.status(400).json({ message: "Failed to join event" });
        }

        // Update user's joinedEvents
        await usersCollection.updateOne(
            { _id: new ObjectId(userIdString) },
            { $addToSet: { joinedEvents: eventId } }
        );

        const updatedEvent = await eventsCollection.findOne({ 
            _id: new ObjectId(eventId) 
        });
        
        res.json(updatedEvent);
    } catch (err) {
        console.error("Join error:", err);
        res.status(500).json({ 
            message: "Failed to join event", 
            error: err.message 
        });
    }
});
//  Get single event endpoint
app.get("/api/events/:id", authenticate, async (req, res) => {
    try {
        const event = await eventsCollection.findOne({
            _id: new ObjectId(req.params.id)
        });

        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        res.json(event);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch event", error: err.message });
    }
});

// Update event endpoint
app.put("/api/events/:id", authenticate,
    [
        body('title').trim().notEmpty().escape(),
        body('name').trim().notEmpty().escape(),
        body('date').isISO8601(),
        body('location').trim().notEmpty().escape(),
        body('description').trim().notEmpty().escape(),
        body('attendeeCount').isInt({ min: 0 }),
        body('imageURL').isURL().optional()
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            // Verify the event belongs to the user
            const event = await eventsCollection.findOne({
                _id: new ObjectId(req.params.id)
            });

            if (!event) return res.status(404).json({ message: "Event not found" });
            if (event.createdBy.toString() !== req.user._id.toString()) {
                return res.status(403).json({ message: "Not authorized to update this event" });
            }

            const updatedEvent = {
                title: req.body.title,
                name: req.body.name,
                date: new Date(req.body.date),
                location: req.body.location,
                description: req.body.description,
                attendeeCount: req.body.attendeeCount || 0,
                imageURL: req.body.imageURL || null,
                updatedAt: new Date()
            };

            await eventsCollection.updateOne(
                { _id: new ObjectId(req.params.id) },
                { $set: updatedEvent }
            );

            const result = await eventsCollection.findOne({ _id: new ObjectId(req.params.id) });
            
            res.json({
                message: "Event updated successfully",
                event: result
            });
        } catch (err) {
            res.status(500).json({ message: "Failed to update event", error: err.message });
        }
    }
);

// Delete event endpoint
app.delete('/api/events/:id', authenticate, async (req, res) => {
    try {
        // Verify the event belongs to the user
        const event = await eventsCollection.findOne({
            _id: new ObjectId(req.params.id)
        });

        if (!event) return res.status(404).json({ message: "Event not found" });
        if (event.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized to delete this event" });
        }

        await eventsCollection.deleteOne({ _id: new ObjectId(req.params.id) });
        res.json({ message: "Event deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Failed to delete event", error: err.message });
    }
});

// Error handling
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err);
    process.exit(1);
});

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    process.exit(1);
});

// Root
app.get("/", (req, res) => res.send("✅ Auth API running"));

// Start server
app.listen(PORT, async () => {
    await connectDB();
    console.log(`🚀 Server on http://localhost:${PORT}`);
});