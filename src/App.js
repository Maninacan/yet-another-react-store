import React from 'react';

import './App.css';
import Header from './components/Header';
import MainContent from './components/MainContent';

class App extends React.PureComponent {
  render() {
    return (
      <div className='App'>
        <Header/>
        <MainContent/>
      </div>
    );
  }
}

export default App;