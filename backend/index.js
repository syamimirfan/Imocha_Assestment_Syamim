const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const crypto = require('crypto');
const db = require('./database');  // Import the database connection

app.use(express.json()); 

app.use(cors({
    origin: "*",
}))
// State name to state_id mapping
const stateMap = {
  "Johor": 1,
  "Kedah": 2,
  "Kelantan": 3,
  "Melaka": 4,
  "Negeri Sembilan": 5,
  "Pahang": 6,
  "Perak": 7,
  "Perlis": 8,
  "Pulau Pinang": 9,
  "Sabah": 10,
  "Sarawak": 11,
  "Selangor": 12,
  "Terengganu": 13,
  "Kuala Lumpur": 14,
  "Labuan": 15,
  "Putrajaya": 16,
};

// Generate a random SHA256-based ID
function generateRandomId() {
  return crypto.createHash('sha256').update(crypto.randomBytes(16)).digest('hex');
}
// Postcode to state mapping (simplified example with a few postcodes)
const postcodeToState = {
    "35000": "Perak",
    "50000": "Kuala Lumpur",
    "80000": "Johor",
};

// Get state based on postcode
app.get('/api/get/state/:postcode', (req, res) => {
    const postcode = req.params.postcode;

    // Look up the state for the provided postcode
    const state = postcodeToState[postcode];

    if (state) {
        res.status(200).json({ state });
    } else {
        res.status(404).json({ message: "State not found for the provided postcode." });
    }
});


// Create customer function to insert customer data into the database
async function createCustomer(customer) {
  const query = `
    INSERT INTO customer (id, name, dob, address, postcode, state_id)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  const values = [
    customer.id,
    customer.name,
    customer.dob,
    customer.address,
    customer.postcode,
    customer.state_id,
  ];

  return new Promise((resolve, reject) => {
    db.query(query, values, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
}

// POST endpoint to create a customer
app.post('/api/customers', async (req, res) => {
  const customer = req.body;

  // Validate request payload
  if (!customer.name || !customer.dob || !customer.address || !customer.postcode || !customer.state_name) {
    return res.status(400).json({ message: 'All fields are required except id.' });
  }

  // Map state_name to state_id
  const stateId = stateMap[customer.state_name];
  if (!stateId) {
    return res.status(400).json({ message: `Invalid state name: ${customer.state_name}` });
  }

  // Generate a random ID
  const randomId = generateRandomId();

  // Prepare the customer object with state_id and generated id
  const customerWithIdAndStateId = {
    id: randomId,
    ...customer,
    state_id: stateId,
  };

  try {
    // Call createCustomer to insert the data into the database
    const result = await createCustomer(customerWithIdAndStateId);
    res.status(201).json({ message: 'Customer created successfully.', result });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Error creating customer.', error: error.message });
  }
});

// GET endpoint to retrieve customer details along with state name
app.get('/api/get/customers', async (req, res) => {
  const query = `
    SELECT 
      c.name,
      DATE_FORMAT(c.dob, '%Y-%m-%d') AS dob,  -- Format the dob to YYYY-MM-DD
      c.address,
      c.postcode,
      s.name AS state_name
    FROM customer c
    JOIN state s ON c.state_id = s.id
  `;

  db.query(query, (err, result) => {
    if (err) {
      console.error('Error retrieving customers:', err);
      return res.status(500).json({ message: 'Error retrieving customers.', error: err.message });
    }

    res.status(200).json(result);
  });
});



app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(8000, () => {
    console.log("Server is running at localhost:8000");
})


