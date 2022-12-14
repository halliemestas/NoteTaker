const express = require('express');
const path = require('path');
const fs = require('fs');
const util = require('util');
let notesDB = require('./db/db.json');
const { uid } = require('uid');

const PORT = process.env.PORT || 3001;

const app = express();

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

// GET Route for homepage
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

// GET Route for notes page
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

// GET Route for rendering current notes
app.get('/api/notes', (req,res) => {
    res.json(notesDB);
})

// POST Route to add a new note
app.post('/api/notes', (req, res) => {
    // Log that a POST request was received
    console.info(`${req.method} request received to add a note`);
  
    // Destructuring assignment for the items in req.body
    const { title, text } = req.body;
  
    // If all the required properties are present
    if (title && text) {
        // Variable for the object we will save
        const newNote = {
        title,
        text, 
        id: uid()
        };

        notesDB.push(newNote);

        fs.writeFileSync("./db/db.json", JSON.stringify(notesDB));
        res.json(notesDB);
    } 
    else {
      res.status(500).json('Error in making new note!');
    }
  });

// Deletion of note based on ID
app.delete('/api/notes/:id', (req, res) => {
    notesDB = notesDB.filter(note => note.id !== req.params.id)
    res.json(notesDB);
});

// Local hosting for testing
app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
