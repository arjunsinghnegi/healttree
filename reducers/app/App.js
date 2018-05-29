import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Router } from 'react-router'
import { Provider } from 'react-redux'
import 'font-awesome/css/font-awesome.min.css'
import injectTapEventPlugin from 'react-tap-event-plugin';

injectTapEventPlugin();


class App extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    routes: PropTypes.object.isRequired,
    routerKey: PropTypes.number,
    store: PropTypes.object.isRequired
  }

  render() {
    const { history, routes, routerKey, store } = this.props

    return (
      <Provider store={store}>
        <div style={{ height: '100%' }}>
          <Router history={history} children={routes} key={routerKey} />
        </div>
      </Provider>
    )
  }
}

export default App
