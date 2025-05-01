const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();
const port = 5000;

// Middleware
app.use(express.json())
app.use(cors())

// SQL Database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Replace with your database username
    password: '', // Replace with your database password
    database: 'driverportal' // Replace with your database name
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
    } else {
        console.log('Connected to the SQL database.');
    }
});

// Fetch all drivers
app.get('/api/drivers', (req, res) => {
    const sql = 'SELECT * FROM Drivers'; // Simple select all from Drivers table
    db.query(sql, (err, results) => {
      if (err) {
        console.error('Error fetching drivers:', err);
        res.status(500).json({ error: 'Failed to fetch drivers' });
        return;
      }
      res.json(results);
    });
  });
  

  app.post('/api/find-drivers', (req, res) => {
    const { pickup, destination } = req.body;
    const sql = 'SELECT * FROM Drivers WHERE serviceArea LIKE ? OR serviceArea LIKE ?';
    const pickupLike = `%${pickup}%`;
    const destinationLike = `%${destination}%`;
  
    db.query(sql, [pickupLike, destinationLike], (err, results) => {
      if (err) {
        console.error('Error fetching drivers:', err);
        res.status(500).json({ error: 'Failed to fetch drivers' });
        return;
      }
      res.json(results);
    });
  });

// Create a new booking
// app.post('/api/bookings', (req, res) => {
//     const { pickup, destination, driverId } = req.body;
//     const query = 'INSERT INTO bookings (pickup, destination, driverId) VALUES (?, ?, ?)';
//     db.query(query, [pickup, destination, driverId], (err) => {
//         if (err) {
//             console.error('Error creating booking:', err);
//             res.status(500).send('Error creating booking');
//         } else {
//             res.send('Booking created successfully');
//         }
//     });
// });

// // Fetch all bookings
// app.get('/api/bookings', (req, res) => {
//     const query = 'SELECT * FROM bookings';
//     db.query(query, (err, results) => {
//         if (err) {
//             console.error('Error fetching bookings:', err);
//             res.status(500).send('Error fetching bookings');
//         } else {
//             res.json(results);
//         }
//     });
// });







//USER API ENDPOINTS
// Create a new ride
app.post("/api/rides", async (req, res) => {
    const { userId, pickup, destination, price, driverId } = req.body;

    try {
        const query = `
            INSERT INTO rides (user_id, pickup_address, destination_address, price, driver_id, status)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        const values = [userId, pickup, destination, price, driverId, "pending"]; // Status set to 'pending'

        db.query(query, values, (err, result) => {
            if (err) {
                console.error("Error creating ride:", err);
                res.status(500).json({ error: "Failed to create ride" });
            } else {
                res.status(201).json({ message: "Ride created successfully", rideId: result.insertId });
            }
        });
    } catch (error) {
        console.error("Unexpected error:", error);
        res.status(500).json({ error: "Unexpected error occurred" });
    }
});
  
  // Route to find available drivers
  app.post("/api/rides/available-drivers", async (req, res) => {
    const { pickup, destination } = req.body;
    // In a real application, you would use more sophisticated logic
    // involving location services and driver availability.
    // This is a simplified example.
    try {
      const availableDrivers = await db.query("SELECT id, name, vehicle_type FROM users WHERE is_driver = TRUE");
      res.json(availableDrivers.rows);
    } catch (error) {
      console.error("Error fetching available drivers:", error);
      res.status(500).json({ error: "Failed to find available drivers" });
    }
  });


//DRIVER API ENDPOINTS

// Get all ride requests
app.get('/api/requests', async (req, res) => {
    try {
        const requests = await query('SELECT id, user, pickup, destination, price FROM ride_requests');
        res.json(requests);
    } catch (error) {
        console.error('Error fetching requests:', error);
        res.status(500).json({ error: 'Failed to fetch ride requests' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
