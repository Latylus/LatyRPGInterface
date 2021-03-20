import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import { NavBar } from '../components'
import { CharactersList, CharactersInsert, CharactersUpdate } from '../pages'

import 'bootstrap/dist/css/bootstrap.min.css'

function App() {
    return (
        <Router>
            <NavBar />
            <Switch>
                <Route path="/characters/list" exact component={CharactersList} />
                <Route path="/characters/create" exact component={CharactersInsert} />
                <Route 
                    path="/character/update/:id"
                    exact
                    component={CharactersUpdate}
                />
            </Switch>
        </Router>
    )
}

export default App