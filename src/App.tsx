import React from 'react';
import './App.css';
import WindowEventNotifier from './WindowEventNotifier';
import UnImage from "./UnImage";

interface AppState {
  zoom: number;
  imageUrl: string;
}

export default class App extends React.Component<{}, AppState> {

  constructor(props: {}) {
    super(props);
    this.state = { zoom: 1, imageUrl: window.location.hash.substring(1), };
  }

  render() {
    return (
      <div className='AppContainer'>
        <WindowEventNotifier event='hashchange' onEvent={this.handleHashChange} />
        <WindowEventNotifier event='keydown' onEvent={this.handleKeyDown} />
        <UnImage url={this.state.imageUrl} zoom={this.state.zoom} />
      </div >
    );
  }

  handleHashChange = (e: HashChangeEvent) => {
    this.setState({ imageUrl: new URL(e.newURL).hash.substring(1) });
  }

  handleKeyDown = (e: KeyboardEvent) => {
    if (e.ctrlKey || e.altKey || e.shiftKey || e.metaKey)
      return;
    if (e.key >= '1' && e.key <= '9' && e.key.length === 1)
      this.setState({ zoom: parseInt(e.key) });
  }
}
