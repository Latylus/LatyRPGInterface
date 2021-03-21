import React, { Component } from 'react'
import {Button, Card, Spinner} from 'react-bootstrap'
import api from '../api'

class CharacterCard extends Component {
    constructor(props) {
        super(props)
        this.state = {
            character_id : this.props.character_id,
            character: null,
        }
    }

    componentDidMount = async () => {
        this.setState({ isLoading: true })

        await api.getCharacterById(this.state.character_id).then(character => {
            if(character.data.data){
                this.setState({
                    character: character.data.data,
                })
            }
        })
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
            <Card>
                <Card.Header>
                    <Card.Title>{this.state.character.name}</Card.Title>
                </Card.Header>
                <Card.Body>
                    <Card.Text onClick={()=> console.log("click")} style={{cursor:'pointer'}}>{`STR :  ${this.state.character.strength}`}</Card.Text>
                </Card.Body>
                <Card.Body>
                    <div className="ui two buttons">
                        <Button variant="success">
                        Edit
                        </Button>
                        <Button variant="danger">
                        Delete
                        </Button>
                    </div>
                </Card.Body>
            </Card>
        )
    }
}

export default CharacterCard