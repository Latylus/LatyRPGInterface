import React, { Component } from 'react'
import {Button, Card, Spinner, Row, Form, Col, ButtonGroup, ToggleButton, OverlayTrigger, Tooltip, InputGroup} from 'react-bootstrap'
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

const baseStats = [
    {
        determination : {
            translation : 'Determination',
            tooltip : 'Determination',
        },
        perception : {
            translation : 'Perception',
            tooltip : 'Perception',
        },
    },
    {
        nobility :{
            translation : 'Noblesse',
            tooltip : 'Noblesse',
        },
        ingenuity : {
            translation : 'Ingéniosité',
            tooltip : 'Ingéniosité',
        },
        spirituality : {
            translation : 'Sipiritualité',
            tooltip : 'Sipiritualité',
        },
    },
    {
        bonusValor : {
            translation : 'Valeur',
            tooltip : 'Valeur',
            dependency : ['determination', 'nobility'],
        },
        bonusScheming : {
            translation : 'Manigance',
            tooltip : 'Manigance',
            dependency : ['determination', 'ingenuity'],
        },
        bonusEloquence :{
            translation : 'Eloquence',
            tooltip : 'Eloquence',
            dependency : ['determination', 'spirituality'],
        },
        bonusDiplomacy : {
            translation : 'Diplomacie',
            tooltip : 'Diplomacie',
            dependency : ['perception', 'nobility'],
        },
        bonusManipulation :{
            translation : 'Manipulation',
            tooltip : 'Manipulation',
            dependency : ['perception', 'ingenuity'],
        },
        bonusTheology :{
            translation : 'Théologie',
            tooltip : 'Théologie',
            dependency : ['perception', 'spirituality'],
        },
    },
]

const phaseNames = [
    "Enfance",
    "Adolescence",
    "Age Adulte"
]

const magicStats = [
    {},
    {
        magic : {
            translation : 'Magie',
            tooltip : 'Magie',
        },
    },
    {
        bonusArcana :{
            translation : 'Arcanes',
            tooltip : 'Arcanes',
            dependency : ['determination', 'magic'],
        },
        bonusSorcery : {
            translation : 'Sorcellerie',
            tooltip : 'Sorcellerie',
            dependency : ['perception', 'magic'],
        },
    }
]


class CharacterCard extends Component {
    constructor(props) {
        super(props)
        this.state = {
            character: this.props.character,
            discordSendFunction : this.props.discordSendFunction,
            player : this.props.player,
            players : [],
            editMode : false,
            authToken : this.props.authToken,
        }
    }

    componentDidMount = async () => {
        if(this.state.character){
            await api.getCharacterById(this.state.character._id).then(character => {
                // console.log('requested API')
                if(character.data.data){
                    this.setState({
                        character: character.data.data,
                    })
                }
            })
        }

        
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
        await this.state.discordSendFunction(discordMessage)
    }

    handleAbilityClick = async (statName, statTranslation, dependencyArray) => {
        var rollValue = Math.floor(Math.random()*20+1)
        const message = {
            // "content": body.message,
            embeds: [{
                title: `A ${statTranslation} roll was requested by ${this.state.player.name} for ${this.state.character.name}`,
                description:  dependencyArray? 
                `Result : ${ +rollValue + +this.state.character[statName] + this.getDependencySumValue(dependencyArray)} = ${rollValue} (1d20) + ${this.state.character[statName]} (${statTranslation}) + ${this.getDependencySumValue(dependencyArray)} (${this.getDependencyTooltipDescription(dependencyArray)})`
                :`Result : ${ +rollValue + +this.state.character[statName]} = ${rollValue} (1d20) + ${this.state.character[statName]} (${statTranslation})`
            }]
        }        

        await this.sendDiscordMessage(message)
    }

    handleUpdateCharacter = async () => {
        console.log("updating character")
        if(this.state.player.isGameMaster){
            await api.updateCharacterByIdForGM(this.state.character._id, this.state.character, this.state.authToken).then(res => {
                this.state.character = res.data.value
                // window.alert(`Character updated successfully`)
            })
        }
        else{
            await api.updateCharacterByIdForPlayer(this.state.character._id, this.state.character).then(res => {
                this.state.character = res.data.value
                // window.alert(`Character updated successfully`)
            })
        }        
    }    
    
    handleDeleteCharacter = async () => {
        if (
            window.confirm(
                `Do tou want to delete the character ${this.state.character.name} permanently?`,
            )
        ) {
            this.setState({character : null}) // prevents any call to apis while component is being deleted
            await api.deleteCharacterById(this.state.character._id, this.state.authToken).then(() => {
                this.props.refreshCharacters()
                // this.componentWillUnmount()
            })
        }
    }

    // editCharacterFieldInput = (field, label) => {
    //     const value = this.state.character[field]
    //     return(
    //         <div>
    //             <Label>{label}</Label>
    //             <InputText
    //                 type="number"
    //                 step="1"
    //                 lang="en-US"
    //                 min="0"
    //                 max="30"
    //                 pattern="[0-9]+([,\.][0-9]+)?"
    //                 value={value}
    //                 onChange={(event) => {this.setState(state => ((state.character[field] = event.target.value, state)))}}
    //             />
    //         </div>
    //     )
    // }

    getDependencySumValue = (dependencyArray)=>{
        return dependencyArray !== undefined? dependencyArray.map(val => this.state.character[val]).reduce((a,b) => +a + +b, 0) :0
    }


    
    findStatTranslation = (stat) =>{
        var basePhaseStat = baseStats.find(phaseStats => Object.keys(phaseStats).find(key => key === stat))
        if(basePhaseStat){
            return basePhaseStat[stat].translation
        }
        else{
            return magicStats.find(phaseStats => Object.keys(phaseStats).find(key => key === stat))[stat].translation
        }
    }

    getDependencyTooltipDescription = (dependencyArray) =>{
        return dependencyArray.map(stat => this.findStatTranslation(stat)).join('+')
    }

    getLabelForStat = (statTranslation, dependencyArray) =>{
        if(dependencyArray){
            return `${statTranslation} ${this.getDependencySumValue(dependencyArray)} +`
        }
        else{
            return statTranslation
        }
    }

    renderOneStatBlock = (statName, statPhase, statTranslation, tooltip, dependency) => {
                return  (
                    <Form.Group key= {this.state.character._id+statName} controlId = {this.state.character._id+statName} className = "col-4">
                        {/* <OverlayTrigger
                        key = {`${statName}overlay`}
                        placement = 'top'
                        overlay = {
                            <Tooltip >{tooltip}</Tooltip >
                        }> */}

                        <Form.Label  onClick={()=> this.handleAbilityClick(statName, statTranslation, dependency)} style={{cursor:'pointer', margin : '2px'}} >
                            {statTranslation}
                        </Form.Label>
                        {/* </OverlayTrigger> */}
                        <Col xs= {5}  >
                        <InputGroup inline='true' style={{width : '115px', 'paddingTop' : '5px', 'paddingBottom' : '5px'}}>
                            {dependency && (
                                <OverlayTrigger
                                key = {`${statName}overlay`}
                                placement = 'top'
                                overlay = {
                                    <Tooltip >{this.getDependencyTooltipDescription(dependency)}</Tooltip >
                                }>
                                    <InputGroup.Prepend >
                                        <InputGroup.Text>{`${this.getDependencySumValue(dependency)}+`}</InputGroup.Text>
                                    </InputGroup.Prepend>
                                </OverlayTrigger>
                            )}
                            <Form.Control type = 'number' step = '1' min = '0' max = '30' 
                            disabled = {!this.state.player.isGameMaster && statPhase !== this.state.character.phase}
                            value = {this.state.character[statName]}
                            onBlur= {() => this.handleUpdateCharacter()}
                            onChange = {(event) => {this.setState(state => ((state.character[statName] = event.target.value, state)))}}/>
                        </InputGroup>
                        </Col>
                    </Form.Group>
                )
    }

    renderStatBlock = ()=> {
        return (
                baseStats.map((phaseStats, phase) =>{
                    return (
                        (this.state.character.phase >= phase || this.state.player.isGameMaster) && (
                            <div key = {phase}>
                            <Card.Subtitle className ="row justify-content-center">{phaseNames[phase]}</Card.Subtitle>
                            <hr style={{width:'50%', height :'0px', border : 0}}/>
                            <Form inline className = "row justify-content-center" >
                                {Object.keys(phaseStats).map( stat => this.renderOneStatBlock(stat, phase, baseStats[phase][stat].translation, baseStats[phase][stat].tooltip,  baseStats[phase][stat].dependency ))}
                                {this.state.character.isMage && 
                                    Object.keys(magicStats[phase]).map(stat => this.renderOneStatBlock(stat, phase, magicStats[phase][stat].translation, magicStats[phase][stat].tooltip,  magicStats[phase][stat].dependency))
                                }
                            </Form>
                            <hr style={{'backgroundImage':`url(./logo192.png)`}}/>
                            </div>
                        )
                    )
                })
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
            <Card border = {this.state.editMode? "primary" : "dark"} style= {{"minWidth" : '45rem', "maxWidth" :'45rem'}}>
                <Card.Header>
                    {!this.state.editMode && (
                        <Card.Title>
                            {this.state.character.name}
                        </Card.Title>
                    )}
                    {this.state.editMode && (<InputText type = 'string' value= {this.state.character.name} onChange={(event) => {this.setState(state => ((state.character.name = event.target.value, state)))}}/>)}
                    
                </Card.Header>
                {/* {!this.state.editMode && (
                    <Card.Body>
                        <Card.Text onClick={()=> this.handleStrengthClick()} style={{cursor:'pointer', margin : '12px'}}>{`STR :  ${this.state.character.strength}`}</Card.Text>
                    </Card.Body>)
                } */}
                {/* {this.editCharacterFieldInput('strength', 'STR : ')} */}

                <Card.Body>
                    {this.renderStatBlock()}
                    
                    <Form inline className = "row justify-content-center" >
                        <Form.Group  controlId = {`${this.state.character._id}willpower`} className = "col-4">
                            <Form.Label>Volonté</Form.Label>
                            <Col xs= {3}>

                            <Form.Control type = 'number' step = '5' min = '-10' max = '30' style={{width : '80px'}}
                            value = {this.state.character.willpower}
                            onBlur= {() => this.handleUpdateCharacter()}
                            onChange = {(event) => {this.setState(state => ((state.character.willpower = event.target.value, state)))}}/>
                            </Col>
                        </Form.Group>
                        {!this.state.player.isGameMaster &&(
                        <Row>
                            <Label>Morts {this.state.character.deaths}/4</Label>
                            {/* <Badge pill variant = "dark"> </Badge>{' '}
                            <Badge pill variant = "secondary"> </Badge>{' '}
                            <Badge pill variant = "dark"> </Badge>{' '} */}
                        </Row>
                        )}
                        {this.state.player.isGameMaster &&(
                            <Form.Group  controlId = {`${this.state.character._id}deaths`} className = "col-4">
                                <Form.Label>Morts</Form.Label>
                                <Col xs= {3}>

                                <Form.Control type = 'number' step = '1' min = '0' max = '4' style={{width : '60px'}}
                                value = {this.state.character.deaths}
                                onBlur= {() => this.handleUpdateCharacter()}
                                onChange = {(event) => {this.setState(state => ((state.character.deaths = +event.target.value, state)))}}/>
                            </Col>
                            </Form.Group>
                        )
                            
                        }
                    </Form>
                                           
                    {this.state.editMode && this.state.player.isGameMaster && (
                        <Row className = "justify-content-center align-items-center">
                            <ButtonGroup toggle>
                                <ToggleButton
                                    key={1}
                                    type="checkbox"
                                    variant="primary"
                                    name="radio"
                                    checked={this.state.character.isMage}
                                    onChange={(e) => {this.setState(state => ((state.character.isMage = !state.character.isMage)))}}
                                >
                                    Mage
                                </ToggleButton>
                            </ButtonGroup>
                            
                            <Label>Phase</Label>
                            <Select className = "col-md-4"
                            options = {phaseNames.map((label, value)=> {return {label: label, value : value}})}
                            value = {{value : this.state.character.phase, label : phaseNames[this.state.character.phase]}}
                            isLoading = {this.state.isLoading}
                            onChange = {(selectedOption) =>  {this.setState(state => ((state.character.phase = selectedOption.value, state)))}}/>
                        
                            <Label>Player</Label>
                            <Select className = "col-md-4"
                            options = {[{value : undefined, label : ''}].concat(this.state.players.filter(player=> !player.isGameMaster).map(player => {return {value : player._id, label : player.name}}))}
                            value = {{value : this.state.character.associatedPlayer, label : this.state.players.find(pl => pl._id === this.state.character.associatedPlayer)?.name}}
                            isLoading = {this.state.isLoading}
                            onChange = {(selectedOption) =>  {this.setState(state => ((state.character.associatedPlayer = selectedOption.value, state)))}}/>
                        </Row>
                    )}
                    {!this.state.editMode && this.state.player.isGameMaster && (
                        <Row className = "row justify-content-center">
                            {this.state.character.isMage && (
                                <Label className="text-primary">Mage</Label>
                            )}
                            <Label>Phase : {phaseNames[this.state.character.phase]}</Label>
                            <Label>Player : {this.state.players.find(pl => pl._id === this.state.character.associatedPlayer)?.name}</Label>

                        </Row>
                    )}

                    
                </Card.Body>
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