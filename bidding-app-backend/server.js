require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const pool = require('./database/db');
const path = require('path');
const authenticateToken = require('./middleware/authenticatejwt')
const app = express();
const {delete_img,upload} = require('./misc/support');
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET;

app.use(express.json());
// app.use(cors())
app.use(cors({
    origin: 'http://localhost:3000', // Replace with the domain you want to allow
    methods: '*', // Allowed methods
    allowedHeaders: '*', // Allowed headers
  }));

app.get('/', (req, res) => {
  res.status(200).send('<!DOCTYPE html><html><head><title>Backend</title></head><body><h1>I say please don\'t ping me</h1></body></html>');
});

// Route to handle user signup 
app.post('/api/signup', async (req, res) => {
  const { email, password, name } = req.body;

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (result.rows.length > 0) {
      return res.status(400).json({ success: false, message: "User already exists!" });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    await pool.query('INSERT INTO users (email, password, name) VALUES ($1, $2, $3)', [email, hashedPassword, name]);

    res.status(201).json({ success: true, message: "User created successfully!" });
  } catch (error) {
    console.error('Error querying database:', error);
    res.status(500).json({ success: false, message: "An error occurred. Please try again." });
  }
});

// Route to handle user login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (result.rows.length > 0) {
      const user = result.rows[0];
      const match = await bcrypt.compare(password, user.password);

      if (match) {
        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

        res.json({
          success: true,
          message: "Login successful!",
          token: token,
          user: {
            name: user.name,
            email: user.email,
          },
        });
      } else {
        res.status(401).json({ success: false, message: "Invalid credentials!" });
      }
    } else {
      res.status(401).json({ success: false, message: "Invalid credentials!" });
    }
  } catch (error) {
    console.error('Error querying database:', error);
    res.status(500).json({ success: false, message: "An error occurred. Please try again." });
  }
});


// Route to handle user profile
app.get('/api/profile', authenticateToken, async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
    if (result.rows.length > 0) {
      const user = result.rows[0];
      res.json({
        success: true,
        user: {
          name: user.name,
          email: user.email,
        },
      });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    console.error('Error querying database:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});




app.get('/api/items', authenticateToken, async (req, res) => {
    const userId = req.user.id; // Get user ID from JWT
  
    try {
      // Query to select only items listed by the authenticated user
      const result = await pool.query('SELECT * FROM items WHERE user_id = $1', [userId]);
      res.json({ items: result.rows });
    } catch (error) {
      console.error('Error fetching items:', error);
      res.status(500).json({ message: 'Error fetching items' });
    }
  });
  

// Route to add new items with images
app.post('/api/items', upload.single('image'), authenticateToken, async (req, res) => {
  const { name, description, starting_bid, end_date } = req.body;
  const user_id = req.user.id;
  const image = req.file ? req.file.filename : null;

  try {
    // Insert the new item and return the inserted row
    const result = await pool.query(
      'INSERT INTO items (user_id, name, description, starting_bid, end_date, image) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [user_id, name, description, starting_bid, end_date, image]
    );

    const newItem = result.rows[0];

    res.json({ message: 'Item added successfully', item: newItem });
  } catch (error) {
    console.error('Error adding item:', error);
    res.status(500).json({ message: 'Error adding item' });
  }
});


// Serve static files for image uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Update an existing item

app.put('/api/items/:id', authenticateToken, upload.single('image'), async (req, res) => {
  const { id } = req.params;
  const { name, description, starting_bid, end_date } = req.body;
  const user_id = req.user.id; // Get user ID from JWT
  const image = req.file ? req.file.filename : null;

  try {
    // Check if the item belongs to the user
    const itemResult = await pool.query('SELECT * FROM items WHERE id = $1 AND user_id = $2', [id, user_id]);

    if (itemResult.rows.length === 0) {
      return res.status(404).json({ message: 'Item not found or you do not have permission to edit this item' });
    }
    
    const oldImage = itemResult.rows[0].image;

    // Update item details
    const updatedItemResult = await pool.query(
      'UPDATE items SET name = $1, description = $2, starting_bid = $3, end_date = $4, image = $5, updated_at = CURRENT_TIMESTAMP WHERE id = $6 RETURNING *',
      [name, description, starting_bid, end_date, image, id]
    );

    // If a new image is provided and there's an old image, delete the old image
    if (oldImage) {
      delete_img(oldImage);
    }

    res.json({
      message: 'Item updated successfully',
      item: updatedItemResult.rows[0]
    });
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).json({ message: 'Error updating item' });
  }
});


  // Route to delete an item
app.delete('/api/items/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const user_id = req.user.id; // Get user ID from JWT

  try {
    // Check if the item belongs to the user
    const itemResult = await pool.query('SELECT * FROM items WHERE id = $1 AND user_id = $2', [id, user_id]);

    if (itemResult.rows.length === 0) {
      return res.status(404).json({ message: 'Item not found or you do not have permission to delete this item' });
    }

    // Get the image filename to delete from the server
    const image = itemResult.rows[0].image;

    // Delete the item from the database
    await pool.query('DELETE FROM items WHERE id = $1 AND user_id = $2', [id, user_id]);

    // Delete the image from the server if it exists
    if (image) {
        delete_img(image);
    }

    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ message: 'Error deleting item' });
  }
});


  app.get('/api/items-in-bidding', async (req, res) => {
    try {
      // Query to get items where the current date is before the end_date
      const result = await pool.query(`
        SELECT * 
        FROM items
        WHERE end_date > NOW()
      `);
      
      res.json({ items: result.rows });
    } catch (error) {
      console.error('Error fetching items in bidding:', error);
      res.status(500).json({ message: 'Error fetching items in bidding' });
    }
  });
  
  

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
