const mysql = require('mysql2');
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = 5000;

// Create a MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'pb_contacts'
});

// Connect to the MySQL server
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL database: ' + err.stack);
    return;
  }
  console.log('Connected to MySQL database as ID: ' + connection.threadId);
});

// Define a route to fetch data from the MySQL database
app.get('/users', (req, res) => {
  connection.query('SELECT * FROM users', (err, results) => {
    if (err) {
      console.error('Error executing MySQL query: ' + err.stack);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});



app.post('/users' , (req, res) => {
  try {
    const { name, email, mobile } = req.body;

    

    connection.query(
      'INSERT INTO users (name, email , mobile  ) VALUES (? , ? , ?)',
      [name, email, mobile],
      (error, results) => {
        if (error) {
          console.error('Error saving menu to database:', error);
          return res.status(500).send('Internal Server Error');
        }
        return res.status(200).send('Added');
      }
    );
  } catch (error) {
    console.error('Error processing form submission:', error);
    return res.status(500).send('Internal Server Error');
  }
});


app.delete('/users/:id', (req, res) => {
  const userId = req.params.id;

  connection.query('DELETE FROM users WHERE id = ?', [userId], (err, results) => {
    if (err) {
      console.error('Error executing MySQL query: ' + err.stack);
      return res.status(500).json({ error: 'Database error' });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  });
});

app.put('/users/:id', (req, res) => {
  const userId = req.params.id;
  const { name, email, mobile } = req.body;

  connection.query(
    'UPDATE users SET name = ?, email = ?, mobile = ? WHERE id = ?',
    [name, email, mobile, userId],
    (error, results) => {
      if (error) {
        console.error('Error updating user:', error);
        return res.status(500).send('Internal Server Error');
      }
      return res.status(200).send('User updated successfully');
    }
  );
});










// Start the server
app.listen(port, () => {
  console.log('Server is running on port ' + port);
});