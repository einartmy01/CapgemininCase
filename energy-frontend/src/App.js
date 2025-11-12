import logo from './logo.svg';
import './App.css';
import React from 'react';
import { set } from 'mongoose';


function App() {
const [components, setComponents] = React.useState([]);
const [loading, setLoading] = React.useState(false);
const [error, setError] = React.useState(null);
const [newComponent, setNewComponent] = React.useState({
  name: '',
  type: '',
  status: ''
});

const fetchComponents = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:4000/api/components');
      if (!response.ok) {
        throw new Error('Nettverksrespons var ikke ok');
      }
      const data = await response.json();
      setComponents(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }
const deletedComponent = async (id) => {
    try {
      const response = await fetch(`http://localhost:4000/api/components/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Nettverksrespons var ikke ok');
      } else {
        setComponents(components.filter(component => component._id !== id));
      }
    } catch (err) {
      setError(err.message);
    }
  }

 
const addComponent = async () => {
  if (!newComponent.name || !newComponent.type || !newComponent.status) {
    setError('Vennligst fyll ut alle feltene for den nye komponenten.');
    return;
  }

  try {
    const response = await fetch('http://localhost:4000/api/components', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({...newComponent, lastUpdated: new Date()}),
    });
    if (!response.ok) {
      throw new Error('Nettverksrespons var ikke ok');
    }

    setNewComponent({ name: '', type: '', status: '' });

    const data = await response.json();
    setComponents([...components, data]);
    } catch (err) {
    setError(err.message);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold text-blue-600 mb-4">
        Energi Komponenter ⚡
      </h1>
      <div className="flex max-w-6xl gap-6 mb-6">
        <div className="w-80 bg-white shadow p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Legg til ny komponent</h2>
          <input
            type="text"
            placeholder="Navn"
            value={newComponent.name}
            onChange={(e) => setNewComponent({ ...newComponent, name: e.target.value })}
            className="border border-gray-300 rounded p-2 w-full mb-2"
          />
          <input
            type="text"
            placeholder="Status"
            value={newComponent.status}
            onChange={(e) => setNewComponent({ ...newComponent, status: e.target.value })}
            className="border border-gray-300 rounded p-2 w-full mb-2"
          />
          <input
            type="text"
            placeholder="Type"
            value={newComponent.type}
            onChange={(e) => setNewComponent({ ...newComponent, type: e.target.value })}
            className="border border-gray-300 rounded p-2 w-full mb-2"
          />
          <button
            onClick={addComponent}
            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded shadow"
          >
            Legg til komponent
          </button>
        </div>
      </div>
        <button onClick={fetchComponents} className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg">
          Hent komponenter
        </button>
        {loading && <p className="mt-4 text-gray-600">Laster...</p>}
        {error && <p className="mt-4 text-red-600">Feil: {error}</p>}
        <ul className="mt-6 space-y-4 w-full max-w-md">
          {components.map((component) => (
            <li key={component._id} className="flex justify-between items-center bg-white shadow p-4 rounded-lg">
              <div classname= "flex flex-col w-4/5">
              <h2 className="text-xl font-semibold text-gray-800">{component.name}</h2>
              <p className="text-gray-600">Type: {component.type}</p>
              <p className="text-gray-600">Status: {component.status}</p>
              <p className="text-gray-600">Sist oppdatert: {new Date(component.lastUpdated).toLocaleString()}</p>
              </div>
              <div className="flex justify-end w-1/5">
              <button onClick={() => deletedComponent(component._id)} className="mt-2 px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg">
                Slett
              </button>
              </div>
            </li>
          ))}
        </ul>
    </div>
  );
}

export default App;
