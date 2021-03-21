import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import { NavBar } from '../components'
import { CharactersList, CharactersInsert, CharactersUpdate, MainPage } from '../pages'

import 'bootstrap/dist/css/bootstrap.min.css'

function App() {
    return (
        <Router>
            {/* <NavBar /> */}
            <Switch>
                
                <Route path="/characters/list" exact component={CharactersList} />
                <Route path="/characters/create" exact component={CharactersInsert} />
                <Route 
                    path="/character/update/:id"
                    exact
                    component={CharactersUpdate}
                />
                <Route path='' exact component= {MainPage} />
            </Switch>
        </Router>
    )
}

export default App