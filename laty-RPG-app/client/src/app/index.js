import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import {MainPage } from '../pages'

import 'bootstrap/dist/css/bootstrap.min.css'

function App() {
    return (
        <Router>
            {/* <NavBar /> */}
            <Route path='' exact component= {MainPage} />
        </Router>
    )
}

export default App