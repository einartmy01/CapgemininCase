const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());
app.use(express.json()); // For å parse JSON bodies
app.listen(4000, () => console.log('Server kjører på port 4000'));


const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/mydb')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error(err));


const componentSchema = new mongoose.Schema({
    name: { type: String, required: true , unique: true},
    status: { type: String, enum: ['aktiv', 'inaktiv', 'vedlikehold'], default: 'aktiv' },
    type: { type: String,/* enum: ['måler', 'batteri', 'ladestasjon', 'transformator'],*/ required: true, default: 'udefinert' },
    lastUpdated: { type: Date, default: Date.now }
});
const Component = mongoose.model('Component', componentSchema);

//200 Forespørsel vellykket
//201 Ny instans opprettet
//404 Ikke funnet
//500 Intern serverfeil

/* Cache-Control middleware
app.use((req, res, next) => {
  if (req.method === 'GET') {
    res.set('Cache-Control', 'public, max-age=60');
  }
  next();
});
*/
app.get('/api/components', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; 
        const limit = parseInt(req.query.limit) || 10;
        const components = await Component.find().skip((page - 1) * limit).limit(limit);
        res.status(200).json(components);
    } catch (error) {
        res.status(500).send('Intern serverfeil');
    }
});

// Hent en komponent basert på generisk ID
app.get('/api/components/:id', async (req, res) => {
    try {
        const component = await Component.findById(req.params.id);
        if (!component) {
            return res.status(404).send('Element ikke funnet');
        }
        res.status(200).json(component);
    } catch (error) {
        res.status(500).send('Intern serverfeil');
    }
});

// Hent en komponent basert på name
app.get('/api/components/name/:name', async (req, res) => {
    try {
        const component = await Component.findOne({ name: req.params.name });
        if (!component) {
            return res.status(404).send('Element ikke funnet');
        }
        res.status(200).json(component);
    } catch (error) {
        res.status(500).send('Intern serverfeil');
    }
});

app.post('/api/components', async (req, res) => {
    try {
        const newComponent = new Component(req.body);
        await newComponent.save();
        res.status(201).json(newComponent);
    } catch (error) {
        res.status(500).send('Intern serverfeil');
    }
});

// Oppdatering av komponent basert på generisk ID
app.put('/api/components/:id', async (req, res) => {
    try {
        const updatedData = { ...req.body, lastUpdated: Date.now() };
        const updatedComponent = await Component.findByIdAndUpdate(req.params.id, updatedData, { new: true });
        if (!updatedComponent) {
            return res.status(404).send('Element ikke funnet');
        }
        res.status(200).json(updatedComponent);
    } catch (error) {
        res.status(500).send('Intern serverfeil');
    }
}); 
// Oppdatering av komponent basert på name
app.put('/api/components/name/:name', async (req, res) => {
    try {
        const updatedData = { ...req.body, lastUpdated: Date.now() };
        const updatedComponent = await Component.findOneAndUpdate({ cunamestomId: req.params.name }, updatedData, { new: true });
        if (!updatedComponent) {
            return res.status(404).send('Element ikke funnet');
        }
        res.status(200).json(updatedComponent);
    } catch (error) {
        res.status(500).send('Intern serverfeil');
    }
});

app.delete('/api/components/:id', async (req, res) => {
    try {
        const deletedComponent = await Component.findByIdAndDelete(req.params.id); 
        if (!deletedComponent) {
            return res.status(404).send('Element ikke funnet');
        }
        res.status(200).send(`${deletedComponent.name} slettet`);
    } catch (error) {
        res.status(500).send('Intern serverfeil');
    }   
});

app.delete('/api/components/name/:name', async (req, res) => {
    try {
        const deletedComponent = await Component.findOneAndDelete({ name: req.params.name });
        if (!deletedComponent) {
            return res.status(404).send('Element ikke funnet');
        }
        res.status(200).send(`Element med navn ${req.params.name} slettet`);
    } catch (error) {
        res.status(500).send('Intern serverfeil');
    }
});