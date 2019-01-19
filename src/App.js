import React, { Component } from 'react';
// import logo from './logo.svg';
// import { TextEditor } from './components';
import { TextEditorPluginTest } from './components'
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        {/* <TextEditor /> */}
        <TextEditorPluginTest />
        
      </div>
    );
  }
}

export default App;
