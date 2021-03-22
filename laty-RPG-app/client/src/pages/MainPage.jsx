import React, { Component } from 'react'
import Select from 'react-select'
import {Button, CardDeck, Row, Modal, Form} from 'react-bootstrap'
import api from '../api'
import CharacterCard from './CharacterCard'

class MainPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            playerLoggedIn: null,
            allCharacters : [],
            allPlayers : [],
            isLoading: false,
            creatingPlayer : false,
            editingPlayer : false,
            newPlayerName : "",
            newPlayerDiscordWebhook : "",
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

    handleCreateDefaultCharacter = async () => {
        const payload = {
            name: "name",
            strength: 0,
        }

        await api.insertCharacter(payload).then(res => {
            console.log('sent create char')
            this.componentDidMount()
        })
    }

    handleEditPlayer = async () => {
        const payload = this.state.playerLoggedIn
        const id = this.state.playerLoggedIn._id
        await api.updatePlayerById(id,payload).then(async res => {
            this.setState({editingPlayer : false})
            Object.entries(this.childRefs).map(([k,v]) => v).forEach(ref => {
                ref.current.state.player = this.state.playerLoggedIn 
                ref.current.state.discordWebhook = this.state.playerLoggedIn.discordWebhook
            } )
            await this.componentDidMount()
        })
    }

    handleCreateNewPlayer = async () => {
        const payload = {
            name: this.state.newPlayerName,
            isGameMaster: false,
            discordWebhook : this.state.newPlayerDiscordWebhook,
        }

        await api.createPlayer(payload).then(async res => {
            console.log(`created new player ${payload.name}`)
            console.log(res)
            await this.componentDidMount().then(() => 
                this.setState({creatingPlayer : false, playerLoggedIn : this.state.allPlayers.find(player => player._id = res.data.id) })
            )
        })
    }

    renderPlayerCreationModal = () => {
        return (
            <Modal show={this.state.creatingPlayer} onHide={() => {this.setState({creatingPlayer : false})}} centered >
                    <Modal.Header closeButton>
                    <Modal.Title>Enter your player information</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group controlId="newPlayerName">
                                <Form.Label>Player Name</Form.Label>
                                <Form.Control type = "string" onChange = {(event) => {this.setState({newPlayerName : event.target.value})}}/>
                            </Form.Group>
                            <Form.Group controlId="newPlayerDiscordWebhook">
                                <Form.Label>Discord Channel Webhook</Form.Label>
                                <Form.Control type = "string" onChange = {(event) => {this.setState({newPlayerDiscordWebhook : event.target.value})}}/>
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                    <Button variant="secondary" onClick={() => this.setState({creatingPlayer : false})}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={this.handleCreateNewPlayer}>
                        Create Player
                    </Button>
                    </Modal.Footer>
                </Modal>
        )
    }

    renderPlayerEditingModal = () => {
        return (
            <Modal show={this.state.editingPlayer} onHide={() => {this.setState({editingPlayer : false})}} centered >
                    <Modal.Header closeButton>
                    <Modal.Title>Edit your player information</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group controlId="editPlayerName">
                                <Form.Label>Player Name</Form.Label>
                                <Form.Control type = "string" value = {this.state.playerLoggedIn.name} onChange = {(event) => {this.setState(state => ((state.playerLoggedIn.name = event.target.value, state)))}}/>
                            </Form.Group>
                            <Form.Group controlId="editPlayerDiscordWebhook">
                                <Form.Label>Discord Channel Webhook</Form.Label>
                                <Form.Control type = "string"  value = {this.state.playerLoggedIn.discordWebhook} onChange = {(event) => {this.setState(state => ((state.playerLoggedIn.discordWebhook = event.target.value, state)))}}/>
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                    <Button variant="secondary" onClick={() => this.setState({editingPlayer : false})}>
                        Cancel
                    </Button>
                    <Button variant="success" onClick={this.handleEditPlayer}>
                        Save
                    </Button>
                    </Modal.Footer>
                </Modal>
        )
    }

    render() {
        
        var associatedCharacters = this.state.playerLoggedIn && (this.state.playerLoggedIn.isGameMaster? 
            this.state.allCharacters : 
            this.state.allCharacters.filter(char => char.associatedPlayer === this.state.playerLoggedIn._id))
         // const { characters, isLoading } = this.state
        this.childRefs = associatedCharacters && Object.fromEntries(associatedCharacters.map(char => [char._id, React.createRef()]));
        // console.log('TCL: CharactersList -> render -> characters', characters)


        return(
            <div className = "container" style = {{height:"100vh"}}>
                {!this.state.playerLoggedIn && this.renderPlayerCreationModal()}
                {this.state.playerLoggedIn && this.renderPlayerEditingModal()}
                <Row className = "justify-content-md-end">
                    {this.state.playerLoggedIn && (
                        <Button className = "mt-4"
                        variant="primary" 
                        size = "sm"
                        onClick = {() => {this.componentDidMount(); Object.entries(this.childRefs).map(([k,v]) => v).forEach(ref => {
                            ref.current.componentDidMount()
                        });}}>Refresh</Button>
                    )}                    
                    {this.state.playerLoggedIn && (
                        <Button className = "mt-4"
                        variant="secondary" 
                        size = "sm"
                        onClick = {() => this.setState({editingPlayer : true})}>Edit Player Info</Button>
                    )}
                    {this.state.playerLoggedIn && (
                        <Button className = "mt-4"
                        variant="dark" 
                        size = "sm"
                        onClick = {() => this.setState({playerLoggedIn : null})}>Log Out</Button>
                    )}
                </Row>
                <Row className = "align-items-center justify-content-md-center " style = {{height:"80vh"}} >
                    {!this.state.playerLoggedIn && (
                        <Select className = "mt-4 col-md-3"
                        options = {this.state.allPlayers.map(player => {return {value : player._id, label : player.name}})}
                        isLoading = {this.state.isLoading}
                        onChange = {(selectedOption) => {this.componentDidMount()
                            this.setState({playerLoggedIn : this.state.allPlayers.find(player => player._id === selectedOption.value)})}}
                    />
                    )}
                    {!this.state.playerLoggedIn && (
                        <Button className = "mt-4 col-md-3"
                        variant = "secondary"
                        onClick = {(event) => this.setState({creatingPlayer : true})}>Create New Player</Button>
                    )}
                    <CardDeck className = "d-flex flex-nowrap">
                        
                    {associatedCharacters && associatedCharacters.map(char =>
                        <CharacterCard ref={this.childRefs[char._id]}
                        key={char._id} 
                        character = {char}
                        discordWebhook = {this.state.playerLoggedIn.discordWebhook}
                        player = {this.state.playerLoggedIn}
                        refreshCharacters = {this.componentDidMount}/>)
                    }
                    </CardDeck>                
                </Row>
                <Row className = "justify-content-md-end">
                    {this.state.playerLoggedIn && this.state.playerLoggedIn.isGameMaster &&(
                        <Button className = "mt-4"
                        variant="primary" 
                        onClick = {this.handleCreateDefaultCharacter} >Create New Character</Button>
                    )}
                </Row>
            </div>)        
    }
}

export default MainPage