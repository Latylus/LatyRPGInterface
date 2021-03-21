import React, { Component } from 'react'
import {Button, Card, Spinner} from 'react-bootstrap'
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
            character_id : this.props.character_id,
            character: null,
            discordWebhook : this.props.discordWebhook,
            playerName : this.props.playerName,
            editMode : false
        }
    }

    componentDidMount = async () => {
        this.setState({ isLoading: true })

        await api.getCharacterById(this.state.character_id).then(character => {
            // console.log('requested API')
            if(character.data.data){
                this.setState({
                    character: character.data.data,
                })
            }
        })
    }

    sendDiscordMessage = async (discordMessage) =>{
        const payload = { 
            webhook : this.state.discordWebhook,
            message : discordMessage
        }

        await api.sendDiscordMessage(payload).then(res => {})
    }

    handleStrengthClick = async () => {
        var rollValue = Math.floor(Math.random()*20+1)
        const message = {
            // "content": body.message,
            embeds: [{
                title: `A strength roll was requested by ${this.state.playerName}`,
                description: `Result : ${ rollValue + this.state.character.strength} = ${rollValue} (1d20) + ${this.state.character.strength} (STR)`
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
            <Card border = {this.state.editMode? "primary" : "dark"} style= {{"min-width" : '40rem'}}>
                <Card.Header>
                    <Card.Title>{this.state.character.name}</Card.Title>
                </Card.Header>
                {!this.state.editMode && (
                    <Card.Body>
                        <Card.Text onClick={()=> this.handleStrengthClick()} style={{cursor:'pointer', margin : '12px'}}>{`STR :  ${this.state.character.strength}`}</Card.Text>
                    </Card.Body>)
                }
                {this.state.editMode && (                    
                    <Card.Body>
                        {this.editCharacterFieldInput('strength', 'STR : ')}
                    </Card.Body>
                )}
                <Card.Body>
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
                    </div>
                    )}
                    {!this.state.editMode && (
                        <div className="ui two buttons">
                        <Button variant="secondary" onClick={() => this.setState({editMode: true})}>
                        Edit
                        </Button>
                    </div>
                    )}                    
                </Card.Body>
            </Card>
        )
    }
}

export default CharacterCard