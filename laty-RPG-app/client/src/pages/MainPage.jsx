import React, { Component } from 'react'
import Select from 'react-select'
import {Button} from 'react-bootstrap'
import api from '../api'

// import styled from 'styled-components'


class MainPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            playerLoggedIn: null,
            allCharacters : [],
            allPlayers : [],
            isLoading: false,
        }
    }

    componentDidMount = async () => {
        this.setState({ isLoading: true })

        await api.getAllPlayers().then(players => {
            if (players.data.data){
                this.setState({
                    allPlayers : players.data.data,
                    isLoading: false,
                })
            }
        })

        await api.getAllCharacters().then(characters => {
            if(characters.data.data){
                this.setState({
                    allCharacters: characters.data.data,
                })
            }
        })
    }

    render() {
        // const { characters, isLoading } = this.state
        // console.log('TCL: CharactersList -> render -> characters', characters)

        var associatedCharacters = this.state.playerLoggedIn && this.state.allCharacters.filter(char =>this.state.playerLoggedIn.associatedCharacters.some(id => id === char._id))

        return(
            <div className = "container">
                <div className = "row justify-content-md-end">
                    {this.state.playerLoggedIn && (
                        <Button 
                        variant="dark" 
                        size = "sm"
                        onClick = {() => this.setState({playerLoggedIn : null})}>Change player</Button>
                    )}
                </div>
                <div className = "row justify-content-md-center">
                    {!this.state.playerLoggedIn && (
                        <Select className = "mt-4 col-md-3"
                        options = {this.state.allPlayers.map(player => {return {value : player._id, label : player.name}})}
                        isLoading = {this.state.isLoading}
                        onChange = {(selectedOption) => {this.setState({playerLoggedIn : this.state.allPlayers.find(player => player._id === selectedOption.value)})}}
                    />
                    )}
                    {associatedCharacters && associatedCharacters.map(char => 
                        <a key={char._id}>{char.name}</a>
                    )}                
                </div>
            </div>)        
    }
}

export default MainPage