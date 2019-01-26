import React, { Component } from 'react';
// import logo from './logo.svg';
// import { TextEditor } from './components/TextEditor';
// import { TextEditorPluginTest } from './components'
// import { TextEditorPlugin } from './components'
import TextEditor  from './components/TextEditor';

import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <TextEditor />
        {/* <TextEditorPluginTest /> */}
        {/* < TextEditorPlugin /> */}
        
      </div>
    );
  }
}

export default App;
