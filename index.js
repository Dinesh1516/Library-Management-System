import express from 'express';
import dotenv from 'dotenv';
import pool from './db.js';

dotenv.config();

const app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', async (req, res) => {
  const result = await pool.query('SELECT * FROM books');
  res.render('index', { books: result.rows });
});

app.get('/add', (req, res) => {
  res.render('add-book');
});

app.post('/add', async (req, res) => {
  const { title, author, genre } = req.body;
  await pool.query('INSERT INTO books (title, author, genre) VALUES ($1, $2, $3)', [title, author, genre]);
  res.redirect('/');
});

app.get('/edit/:id', async (req, res) => {
  const result = await pool.query('SELECT * FROM books WHERE id = $1', [req.params.id]);
  res.render('edit-book', { book: result.rows[0] });
});

app.post('/edit/:id', async (req, res) => {
  const { title, author, genre } = req.body;
  await pool.query('UPDATE books SET title = $1, author = $2, genre = $3 WHERE id = $4', [title, author, genre, req.params.id]);
  res.redirect('/');
});

app.post('/delete/:id', async (req, res) => {
  await pool.query('DELETE FROM books WHERE id = $1', [req.params.id]);
  res.redirect('/');
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
