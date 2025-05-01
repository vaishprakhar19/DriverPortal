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

// Add a new endpoint for driver registration
app.post('/api/drivers', (req, res) => {
  const { driverId, name, vehicleModel, vehicleColor, licensePlate, serviceArea } = req.body;

  const query = `
        INSERT INTO Drivers (driver_id, driver_name, vehicleModel, vehicleColor, licensePlate, serviceArea)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

  db.query(query, [driverId, name, vehicleModel, vehicleColor, licensePlate, serviceArea], (err, result) => {
    if (err) {
      console.error('Error registering driver:', err);
      res.status(500).json({ error: 'Failed to register driver' });
    } else {
      res.status(201).json({ message: 'Driver registered successfully', driverId: result.insertId });
    }
  });
});


//USER API ENDPOINTS
// Create a new ride
app.post("/api/rides", async (req, res) => {
  const { userId, pickup, destination, price, driverId, driverName, userName, status } = req.body;

  try {
    const query = `
            INSERT INTO rides (user_id, pickup_address, destination_address, price, driver_id, status, user_name, driver_name)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
    const values = [userId, pickup, destination, price, driverId, status, userName, driverName];

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

// Fetch all rides
app.get("/api/rides", async (req, res) => {
  try {
    const query = "SELECT * FROM rides";
    db.query(query, (err, results) => {
      if (err) {
        console.error("Error fetching rides:", err);
        return res.status(500).json({ error: "Failed to fetch rides" });
      } else {
        const formattedResults = results.map(ride => ({
          ...ride,
          user_id: String(ride.user_id), // Ensure user_id is a string
        }));
        res.json(formattedResults);
      }
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    res.status(500).json({ error: "Unexpected error occurred" });
  }
});

// Accept a ride request
app.post('/api/rides/:id/accept', async (req, res) => {
  const rideId = req.params.id;

  try {
    const query = 'UPDATE rides SET status = ? WHERE id = ?';
    const values = ['in-progress', rideId];

    db.query(query, values, (err, result) => {
      if (err) {
        console.error('Error accepting ride request:', err);
        res.status(500).json({ error: 'Failed to accept ride request' });
      } else {
        res.status(200).json({ message: 'Ride request accepted successfully' });
      }
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    res.status(500).json({ error: 'Unexpected error occurred' });
  }
});

// Reject a ride request
app.post('/api/rides/:id/reject', async (req, res) => {
  const rideId = req.params.id;

  try {
    const query = 'UPDATE rides SET status = ? WHERE id = ?';
    const values = ['inactive', rideId];

    db.query(query, values, (err, result) => {
      if (err) {
        console.error('Error rejecting ride request:', err);
        res.status(500).json({ error: 'Failed to reject ride request' });
      } else {
        res.status(200).json({ message: 'Ride request rejected successfully' });
      }
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    res.status(500).json({ error: 'Unexpected error occurred' });
  }
});

// Complete a ride
app.post('/api/rides/:id/complete', async (req, res) => {
  const rideId = req.params.id;

  try {
    const query = 'UPDATE rides SET status = ? WHERE id = ?';
    const values = ['completed', rideId];

    db.query(query, values, (err, result) => {
      if (err) {
        console.error('Error completing ride:', err);
        res.status(500).json({ error: 'Failed to complete ride' });
      } else {
        res.status(200).json({ message: 'Ride completed successfully' });
      }
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    res.status(500).json({ error: 'Unexpected error occurred' });
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
