import React, { Component } from 'react'
import {Button, Card, Spinner, Row} from 'react-bootstrap'
import Select from 'react-select'
import api from '../api'

import styled from 'styled-components'

const InputText = styled.input.attrs({
    className: 'form-control',
})`
    margin: 5px;
    width : 40%;
    float : center;
`

const Label = styled.label`
    margin: 5px;
    float: left;
`

class CharacterCard extends Component {
    constructor(props) {
        super(props)
        this.state = {
            character: this.props.character,
            discordWebhook : this.props.discordWebhook,
            player : this.props.player,
            players : [],
            editMode : false,
        }
    }

    componentDidMount = async () => {
        this.setState({ isLoading: true })

        await api.getCharacterById(this.state.character._id).then(character => {
            // console.log('requested API')
            if(character.data.data){
                this.setState({
                    character: character.data.data,
                })
            }
        })

        
        await api.getAllPlayers().then(players => {
            // console.log('requested API')
            if(players.data.data){
                this.setState({
                    players: players.data.data,
                    isLoading : false,
                })
            }
        })
    }

    sendDiscordMessage = async (discordMessage) =>{
        const payload = { 
            webhook : this.state.discordWebhook,
            message : discordMessage
        }
        if(this.state.discordWebhook){
            await api.sendDiscordMessage(payload).then(res => {})
        }
        else{
            window.alert(`You haven't setup your discord webhook correctly`)
        }
    }

    handleStrengthClick = async () => {
        var rollValue = Math.floor(Math.random()*20+1)
        const message = {
            // "content": body.message,
            embeds: [{
                title: `A strength roll was requested by ${this.state.player.name}`,
                description: `Result : ${ +rollValue + +this.state.character.strength} = ${rollValue} (1d20) + ${this.state.character.strength} (STR)`
            }]
        }        

        await this.sendDiscordMessage(message)
    }

    handleUpdateCharacter = async () => {
        // console.log(this.state.character)
        await api.updateCharacterById(this.state.character._id, this.state.character).then(res => {
            // window.alert(`Character updated successfully`)
        })
    }    
    
    handleDeleteCharacter = async () => {
        if (
            window.confirm(
                `Do tou want to delete the character ${this.state.character.name} permanently?`,
            )
        ) {
            await api.deleteCharacterById(this.state.character._id).then(() => {
                this.props.refreshCharacters()
                // this.componentWillUnmount()
            })
        }
    }

    editCharacterFieldInput = (field, label) => {
        const value = this.state.character[field]
        return(
            <div>
                <Label>{label}</Label>
                <InputText
                    type="number"
                    step="1"
                    lang="en-US"
                    min="0"
                    max="30"
                    pattern="[0-9]+([,\.][0-9]+)?"
                    value={value}
                    onChange={(event) => {this.setState(state => ((state.character[field] = event.target.value, state)))}}
                />
            </div>
        )
    }

    render() {
        // const { characters, isLoading } = this.state
        // console.log('TCL: CharactersList -> render -> characters', characters)

        if(!this.state.character){
            return(<Card>
                <Card.Header>
                    <Spinner animation = "border"/>
                </Card.Header>
            </Card>)
        }

        return(           
            <Card border = {this.state.editMode? "primary" : "dark"} style= {{"minWidth" : '40rem'}}>
                <Card.Header>
                    <Card.Title>
                        {!this.state.editMode && this.state.character.name}
                        {this.state.editMode && (<InputText type = 'string' value= {this.state.character.name} onChange={(event) => {this.setState(state => ((state.character.name = event.target.value, state)))}}/>)}
                    </Card.Title>
                </Card.Header>
                {!this.state.editMode && (
                    <Card.Body>
                        <Card.Text onClick={()=> this.handleStrengthClick()} style={{cursor:'pointer', margin : '12px'}}>{`STR :  ${this.state.character.strength}`}</Card.Text>
                    </Card.Body>)
                }
                {this.state.editMode && (                    
                    <Card.Body>
                        {this.editCharacterFieldInput('strength', 'STR : ')}
                        {this.state.player.isGameMaster && (
                            <Row className = "mt-4">
                                <Label>Player</Label>
                                <Select className = "col-md-4"
                                options = {[{value : undefined, label : ''}].concat(this.state.players.filter(player=> !player.isGameMaster).map(player => {return {value : player._id, label : player.name}}))}
                                value = {{value : this.state.character.associatedPlayer, label : this.state.players.find(pl => pl._id === this.state.character.associatedPlayer)?.name}}
                                isLoading = {this.state.isLoading}
                                onChange = {(selectedOption) =>  {this.setState(state => ((state.character.associatedPlayer = selectedOption.value, state)))}}/>
                            </Row>
                        )}
                    </Card.Body>
                )}
                <Card.Footer>
                    {this.state.editMode && (
                        <div className="ui two buttons">
                        <Button variant="success" onClick={() => {
                            this.handleUpdateCharacter()
                            this.setState({editMode: false})                            
                            }}>
                        Save
                        </Button>
                        <Button variant="secondary" onClick={() => {
                            this.componentDidMount()
                            this.setState({editMode: false})
                            }}>
                        Cancel
                        </Button>
                        {this.state.player.isGameMaster && (
                            <Button variant="danger" onClick={() => {
                                this.handleDeleteCharacter()
                                this.setState({editMode: false})
                                }}>
                                    Delete
                            </Button>
                        )}
                    </div>
                    )}
                    {!this.state.editMode && (
                        <div className="ui two buttons">
                        <Button variant="secondary" onClick={() => this.setState({editMode: true})}>
                        Edit
                        </Button>
                    </div>
                    )}                    
                </Card.Footer>
            </Card>
        )
    }
}

export default CharacterCard