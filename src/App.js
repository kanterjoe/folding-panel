import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import FoldingPanel from './components/FoldingPanel/';

class App extends Component {
  render() {
    return (
      <div className="App">

          <FoldingPanel>
            <section>
                <h1>This is inside the hidden part</h1>
                <img src={`https://zdnet1.cbsistatic.com/hub/i/2015/09/01/cb834e24-18e7-4f0a-a9bf-4c2917187d3f/83bb139aac01023dbf3e55a3d1789ad8/google-new-logo.png`}/>
            </section>
              <main >
                  <h1>This is in the main part</h1>
              </main>
          </FoldingPanel>
      </div>
    );
  }
}

export default App;
