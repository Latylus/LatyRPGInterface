import React, { Component } from 'react'
import CharacterCard from './CharacterCard'
import {CardDeck} from 'react-bootstrap'
import api from '../api'

class CharacterDeck extends Component {
    constructor(props) {
        super(props)
        this.state = {
            charactersToDisplay : [],
            player: this.props.player,
            authToken : this.props.authToken,
            discordSendFunction : this.props.discordSendFunction
        }
    }

    componentDidMount = async () => {
        if(this.state.player){
            if(this.state.player.isGameMaster){
                await api.getAllCharacters(this.state.authToken).then(characters => {
                    if(characters.data.data){
                        this.setState({
                            charactersToDisplay: characters.data.data,
                        })
                    }
                })
            }
            else{
                await api.getAllPlayerCharacters(this.state.player._id).then(characters => {
                    if(characters.data.data){
                        this.setState({
                            charactersToDisplay : characters.data.data
                        })
                    }
                })
            }
        }
    }

    handlePlayerEdit = (modifiedPlayer) =>{
        this.setState({player : modifiedPlayer})
        Object.entries(this.childRefs).map(([k,v]) => v).forEach(ref => {
            ref.current.state.player = modifiedPlayer
        } )
    }

    handleRefresh = async () => {
        await this.componentDidMount()
        Object.entries(this.childRefs).map(([k,v]) => v).forEach(ref => {
            ref.current.componentDidMount()
        })
    }
    
    render(){

        this.childRefs = this.state.charactersToDisplay && Object.fromEntries(this.state.charactersToDisplay.map(char => [char._id, React.createRef()]));


        return(
            <CardDeck className = "d-flex flex-row flex-nowrap overflow-auto">                        
                {this.state.charactersToDisplay && this.state.charactersToDisplay.map(char =>
                    <CharacterCard ref={this.childRefs[char._id]}
                    key={char._id} 
                    character = {char}
                    discordSendFunction = {this.state.discordSendFunction}
                    player = {this.state.player}
                    refreshCharacters = {this.handleRefresh}
                    authToken = {this.state.authToken}/>)
                }
            </CardDeck>     
        )
    }
}

export default CharacterDeck