
const express = require('express'); 
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

const DATA_FILE = path.join(__dirname, 'feedback.json');

app.use(bodyParser.json());
app.use(express.static('public'));

if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify([]));
}

// Single object feedback
app.post('/feedback', (req, res) => {
  const { name, math, science, english } = req.body;
  if (!name || math === undefined || science === undefined || english === undefined) {
    return res.status(400).json({ message: 'Invalid feedback data.' });
  }

  const data = JSON.parse(fs.readFileSync(DATA_FILE));
  const existing = data.find(f => f.name.toLowerCase() === name.toLowerCase());
  if (existing) {
    return res.status(400).json({ message: 'You have already submitted feedback.' });
  }

  const newFeedback = {
    id: data.length + 1,
    name,
    Mathematics: parseInt(math),
    Science: parseInt(science),
    English: parseInt(english)
  };

  data.push(newFeedback);
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  res.status(200).json({ message: 'Your feedback has been collected.' });
});

// Admin login
app.post('/admin/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === 'admin123') {
    res.json({ success: true });
  } else {
    res.json({ success: false, message: 'Invalid credentials' });
  }
});

app.get('/admin/summary', (req, res) => {
  const data = JSON.parse(fs.readFileSync(DATA_FILE));
  const subjects = ['Mathematics','Science','English'];
  const summary = {};

  subjects.forEach(sub => {
    const count = data.length;
    const average = count > 0 ? data.reduce((sum,f)=>sum+f[sub],0)/count : 0;
    summary[sub] = { average: parseFloat(average.toFixed(2)), count };
  });

  res.json(summary);
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
