import React from 'react';
import './App.css';
import {EditNote} from './pages/EditNote';

function App() {
  return (
    <EditNote intialValue="WebNotes is currently using localstorage to save and load notes. Enter text..."/>
  );
}

export default App;
