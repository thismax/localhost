import React, { Component } from 'react';
import ConversationStubs from './ConversationStubs';
import { NavLink, withRouter} from 'react-router-dom';

class Splash extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
      history: this.props.history,
    }
    this.handleChange = this.handleChange.bind(this);
  }
  
  handleChange(e) {
    this.setState({ text: e.target.value })
  }

  render() {
    return (
      <div>
        <input
          onChange={this.handleChange}
          onKeyPress={this.props.handleKeyPress.bind(null, this.state)}
          type="text"/>
        <ConversationStubs />
      </div>
    )
  }
}

export default withRouter(Splash);