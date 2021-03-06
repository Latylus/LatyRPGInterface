import React, { Component } from 'react'
import Select from 'react-select'
import {Button, Row, Modal, Form, ButtonGroup, ToggleButton, Container, Col} from 'react-bootstrap'
import api from '../api'
import CharacterDeck from './CharacterDeck'

class MainPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            playerLoggedIn: null,
            allPlayers : [],
            isLoading: false,
            creatingPlayer : false,
            editingPlayer : false,
            requestedGMLogin : null,
            newPlayerName : "",
            newPlayerDiscordWebhook : "",
            usePublicDiscordChannel : false,
            authToken : "",
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
    }

    handleCreateDefaultCharacter = async () => {
        const payload = {
            name: "Name",
            
            deaths: 0,
            willpower : 0,

            phase : 0,
            isMage : false,

            determination : 0,
            perception :0 ,
            nobility : 0,
            ingenuity : 0,
            spirituality : 0,
            bonusValor : 0,
            bonusScheming : 0,
            bonusEloquence : 0,
            bonusDiplomacy : 0,
            bonusManipulation : 0,
            bonusTheology : 0,
        }

        await api.insertCharacter(payload, this.state.authToken).then(res => {
            console.log('sent create char')
            this.childRef.current.handleRefresh()
            this.componentDidMount()
        }, res => {
            console.log("failed character creation")
        })
    }

    handleEditPlayer = async () => {
        const payload = this.state.playerLoggedIn
        const id = this.state.playerLoggedIn._id
        await api.updatePlayerById(id,payload).then(async res => {
            this.setState({editingPlayer : false})
            this.childRef.current.handlePlayerEdit(this.state.playerLoggedIn)
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

    handlePlayerSelection = (selectedOption) => {
        this.componentDidMount()
        var selectedPlayer = this.state.allPlayers.find(player => player._id === selectedOption.value)
        if(!selectedPlayer.isGameMaster){
            this.setState({playerLoggedIn : selectedPlayer })
        }
        else{
            this.setState({requestedGMLogin : selectedPlayer})
        }
    }

    handleDiscordMessaging = async (discordMessage) => {
        const payload = { 
            webhook : this.state.usePublicDiscordChannel ? undefined : this.state.playerLoggedIn.discordWebhook,
            message : discordMessage
        }
        await api.sendDiscordMessage(payload).then(res => {})
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

    checkIfPasswordCorrect = async () => {

        await api.gmLogin({password : this.state.passwordEntered, playerId : this.state.requestedGMLogin._id}).then(res => {
            if (res.data.success){
                this.setState({playerLoggedIn : this.state.requestedGMLogin , requestedGMLogin : null, authToken : res.data.token})
                this.componentDidMount()
            }
        }).catch(error => {
            if(error.response.status === 403){
                window.alert(`Wrong password`)
            }
            else{
                console.log(error.response.status)
                throw error
            }
        })
    }

    renderGMPasswordModal = () => {
        return (
            <Modal show={this.state.requestedGMLogin != null} onHide={() => {this.setState({requestedGMLogin : null})}} centered >
                    <Modal.Header closeButton>
                    <Modal.Title>Enter GM password</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group controlId="gmPasswordInput">
                                {/* <Form.Label>Player Name</Form.Label> */}
                                <Form.Control type = "password" onChange = {(event) => {this.setState({passwordEntered : event.target.value})}} />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                    <Button variant="secondary" onClick={() => this.setState({requestedGMLogin : null})}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={this.checkIfPasswordCorrect}>
                        Enter
                    </Button>
                    </Modal.Footer>
                </Modal>
        )
    }

    render() {
        
         // const { characters, isLoading } = this.state
        // console.log('TCL: CharactersList -> render -> characters', characters)
        this.childRef = React.createRef()

        return(
            <Container fluid className = "justify-content-md-center" style = {{height:"100vh", width:"95vw"}}>
                {this.state.requestedGMLogin && this.renderGMPasswordModal()}
                {!this.state.playerLoggedIn && this.renderPlayerCreationModal()}
                {this.state.playerLoggedIn && this.renderPlayerEditingModal()}
                <Row className = "justify-content-md-end">
                    {this.state.playerLoggedIn && (
                        <Button className = "mt-4 mr-2"
                        variant="primary" 
                        size = "sm"
                        onClick = {() => {this.componentDidMount(); this.childRef.current.handleRefresh();}}>Refresh</Button>
                    )}                    
                    {this.state.playerLoggedIn && (
                        <Button className = "mt-4 mr-2"
                        variant="secondary" 
                        size = "sm"
                        onClick = {() => this.setState({editingPlayer : true})}>Edit Player Info</Button>
                    )}
                    {this.state.playerLoggedIn && (
                        <Button className = "mt-4"
                        variant="dark" 
                        size = "sm"
                        onClick = {() => this.setState({playerLoggedIn : null, charactersToDisplay : [], authToken : "", passwordEntered : "", usePublicDiscordChannel : false})}>Log Out</Button>
                    )}
                </Row>
                    {!this.state.playerLoggedIn && (
                        <Row className = "align-items-center justify-content-md-center " style = {{height:"80vh"}} >
                            <Col className = "justify-content-center " style = {{maxHeight:"20vh", maxWidth:"20vw", minWidth:"190px"}}>
                            <Select className = "mt-4"
                            options = { [{label : "Players", options : this.state.allPlayers.filter(player => !player.isGameMaster).map(player => {return {value : player._id, label : player.name}})}, 
                            {label : "Gamemasters", options :this.state.allPlayers.filter(player => player.isGameMaster).map(player => {return {value : player._id, label : player.name}}) }]}
                            isLoading = {this.state.isLoading}
                            placeholder = "Select a player"
                            onChange = {this.handlePlayerSelection}/>
                            <div className="w-100"></div>
                            
                            <Button className = "mt-4 mx-auto" block
                            variant = "secondary"
                            onClick = {() => this.setState({creatingPlayer : true})}>Create New Player</Button>
                            </Col>
                        </Row>
                        

                    )}
                <Row className = "align-items-center justify-content-md-center " style = {{height:"80vh"}} >
                    {this.state.playerLoggedIn && (<CharacterDeck ref={this.childRef}
                        discordSendFunction = {this.handleDiscordMessaging}
                        player = {this.state.playerLoggedIn}
                        authToken = {this.state.authToken}/>)}
                </Row>
                <Row>
                    <div className = "col-auto mr-auto">
                        {this.state.playerLoggedIn && (
                            <ButtonGroup toggle className = "mt-4">
                                <ToggleButton
                                    key={1}
                                    type="radio"
                                    variant="secondary"
                                    name="radio"
                                    // value={radio.value}
                                    checked={!this.state.usePublicDiscordChannel}
                                    onChange={(e) => this.setState({usePublicDiscordChannel : false})}
                                >
                                    Private Rolls
                                </ToggleButton>
                                <ToggleButton
                                    key={2}
                                    type="radio"
                                    variant="secondary"
                                    name="radio"
                                    // value={radio.value}
                                    checked={this.state.usePublicDiscordChannel}
                                    onChange={(e) => this.setState({usePublicDiscordChannel : true})}
                                >
                                    Public Rolls
                                </ToggleButton>
                            </ButtonGroup>
                        )}
                    </div>
                    <div className = "col-auto">
                        {this.state.playerLoggedIn && this.state.playerLoggedIn.isGameMaster &&(
                            <Button className = "mt-4"
                            variant="primary" 
                            onClick = {this.handleCreateDefaultCharacter} >Create New Character</Button>
                        )}
                    </div>
                </Row>
            </Container>)        
    }
}

export default MainPage