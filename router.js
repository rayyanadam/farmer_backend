const baseUrl = "/api/v1";
const express = require("express");
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();

// handle database
const db = new sqlite3.Database('database/farmers', (err) => {
  if (err) {
    console.error('Error connecting to the database:', err.message);
  } else {
    console.log('Connected to the database');
  }
});

router.get("/rayyan", (req, res) => {
  res.send("Hello World");
});
//--------------START CROPS--------------------
// Create a new crop
router.post(baseUrl + '/crops', (req, res) => {
  const { name, quantity, price, description } = req.body;

  const query = `INSERT INTO crops(name, quantity, price, description) VALUES (?, ?, ?, ?)`;
  const values = [name, quantity, price, description];

  db.run(query, values, function (error) {
    if (error) {
      console.error('Error inserting crop data:', error);
      res.status(500).json({ error: 'An error occurred while inserting crop data' });
    } else {
      const cropId = this.lastID;
      const cropData = { id: cropId, name, quantity, price, description };
      const response = { message: 'Crop data inserted successfully', crop: cropData };
      res.status(200).json(response);
    }
  });
});

// Get all crops
router.get(baseUrl + '/crops', (req, res) => {
  const query = 'SELECT * FROM crops';

  db.all(query, (error, crops) => {
    if (error) {
      console.error('Error retrieving crop data:', error);
      res.status(500).json({ error: 'An error occurred while retrieving crop data' });
    } else {
      const response = { message: 'Crop data retrieved successfully', crops };
      res.status(200).json(response);
    }
  });
});

// Get a specific crop by ID
router.get(baseUrl + '/crops/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM crops WHERE id = ?';
  const values = [id];

  db.get(query, values, (error, crop) => {
    if (error) {
      console.error('Error retrieving crop data:', error);
      res.status(500).json({ error: 'An error occurred while retrieving crop data' });
    } else if (!crop) {
      res.status(404).json({ error: 'Crop not found' });
    } else {
      const response = { message: 'Crop data retrieved successfully', crop };
      res.status(200).json(response);
    }
  });
});

// Update a crop by ID
router.put(baseUrl + '/crops/:id', (req, res) => {
  const { id } = req.params;
  const { name, quantity, price, description } = req.body;
  const query = 'UPDATE crops SET name = ?, quantity = ?, price = ?, description = ? WHERE id = ?';
  const values = [name, quantity, price, description, id];

  db.run(query, values, function (error) {
    if (error) {
      console.error('Error updating crop data:', error);
      res.status(500).json({ error: 'An error occurred while updating crop data' });
    } else if (this.changes === 0) {
      res.status(404).json({ error: 'Crop not found' });
    } else {
      const response = { message: 'Crop data updated successfully', cropId: id };
      res.status(200).json(response);
    }
  });
});

// Delete a crop by ID
router.delete(baseUrl + '/crops/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM crops WHERE id = ?';
  const values = [id];

  db.run(query, values, function (error) {
    if (error) {
      console.error('Error deleting crop data:', error);
      res.status(500).json({ error: 'An error occurred while deleting crop data' });
    } else if (this.changes === 0) {
      res.status(404).json({ error: 'Crop not found' });
    } else {
      const response = { message: 'Crop data deleted successfully', cropId: id };
      res.status(200).json(response);
    }
  });
});
//---------------------END CROPS----------------------


//---------------------START ORDER--------------------

// Get all orders
router.get(baseUrl + '/order', (req, res) => {
  const query = 'SELECT * FROM orders';

  db.all(query, (error, orders) => {
    if (error) {
      console.error('Error retrieving crop data:', error);
      res.status(500).json({ error: 'An error occurred while retrieving crop data' });
    } else {
      const response = { message: 'Crop data retrieved successfully', orders };
      res.status(200).json(response);
    }
  });
});

//------------------------END ORDER------------------------

// ----------------------START PROFILE---------------------

//Create profile
router.post(baseUrl + '/users', (req, res) => {
  const { fname, lname, phone_number, email, address, password} = req.body;

  const query = `INSERT INTO users(fname, lname, phone_number, email, address, password) VALUES (?, ?, ?, ?, ?, ?)`;
  const values = [fname, lname, phone_number, email, address, password];

  db.run(query, values, function (error) {
    if (error) {
      console.error('Error inserting user data:', error);
      res.status(500).json({ error: 'An error occurred while inserting user data' });
    } else {
      const userId = this.lastID;
      const userData = { id: userId, fname, lname, phone_number, email, address, password};
      const response = { message: 'User data inserted successfully', user: userData };
      res.status(200).json(response);
    }
  });
});

// Get profile
router.get(baseUrl + '/users', (req, res) => {
  const query = 'SELECT * FROM users';

  db.all(query, (error, users) => {
    if (error) {
      console.error('Error retrieving crop data:', error);
      res.status(500).json({ error: 'An error occurred while retrieving crop data' });
    } else {
      const response = { message: 'Crop data retrieved successfully', users };
      res.status(200).json(response);
    }
  });
});

// Update a Profile by ID
router.put(baseUrl + '/users/:id', (req, res) => {
  const { id } = req.params;
  const { fname, lname, phone_number, email, address } = req.body;
  const query = 'UPDATE users SET fname = ?, lname = ?, phone_number = ?, email = ?, address = ? WHERE id = ?';
  const values = [lname, fname, phone_number, email, address, id];

  db.run(query, values, function (error) {
    if (error) {
      console.error('Error updating profile data:', error);
      res.status(500).json({ error: 'An error occurred while updating profile data' });
    } else if (this.changes === 0) {
      res.status(404).json({ error: 'Profile not found' });
    } else {
      const response = { message: 'Profile data updated successfully', profileId: id };
      res.status(200).json(response);
    }
  });
});

// ----------------------END PROFILE-------------------------------

//-------------------------LOGIN--------------------
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');

function getUserByEmailAndPassword(email, password) {
  const query = 'SELECT * FROM users WHERE email = ? AND password = ?';
  const values = [email, password];

  return new Promise((resolve, reject) => {
    db.get(query, values, (error, user) => {
      if (error) {
        reject(error);
      } else {
        resolve(user);
      }
    });
  });
}

router.post(baseUrl + '/login', (req, res) => {
  const { email, password } = req.body;

  getUserByEmailAndPassword(email, password)
    .then((user) => {
      if (user) {
        res.status(200).json({ message: 'Authentication successful', user });
      } else {
        res.status(401).json({ error: 'Invalid email or password' });
      }
    })
    .catch((error) => {
      console.error('Error retrieving user:', error);
      res.status(500).json({ error: 'An error occurred while retrieving user' });
    });
});

module.exports = router;

