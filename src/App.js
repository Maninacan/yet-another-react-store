import React from 'react';

import './App.css';

import Header from './components/Header';
import MainContent from './components/MainContent';
import SecondaryContent from './components/SecondaryContent';

class App extends React.PureComponent {
  render() {
    return (
      <div className='App'>
        <Header/>
        <MainContent/>
        <SecondaryContent/>
      </div>
    );
  }
}

export default App;
