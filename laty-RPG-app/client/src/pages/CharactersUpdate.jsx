import React, { Component } from 'react'
import api from '../api'

import styled from 'styled-components'

const Title = styled.h1.attrs({
    className: 'h1',
})``

const Wrapper = styled.div.attrs({
    className: 'form-group',
})`
    margin: 0 30px;
`

const Label = styled.label`
    margin: 5px;
`

const InputText = styled.input.attrs({
    className: 'form-control',
})`
    margin: 5px;
`

const Button = styled.button.attrs({
    className: `btn btn-primary`,
})`
    margin: 15px 15px 15px 5px;
`

const CancelButton = styled.a.attrs({
    className: `btn btn-danger`,
})`
    margin: 15px 15px 15px 5px;
`

class CharactersUpdate extends Component {
    constructor(props) {
        super(props)

        this.state = {
            id: this.props.match.params.id,
            name: '',
            strength: '',
            time: '',
        }
    }

    handleChangeInputName = async event => {
        const name = event.target.value
        this.setState({ name })
    }

    handleChangeInputRating = async event => {
        const strength = event.target.validity.valid
            ? event.target.value
            : this.state.strength

        this.setState({ strength })
    }

    handleChangeInputTime = async event => {
        const time = event.target.value
        this.setState({ time })
    }

    handleUpdateCharacter = async () => {
        const { id, name, strength, time } = this.state
        const arrayTime = time.split('/')
        const payload = { name, strength, time: arrayTime }

        await api.updateCharacterById(id, payload).then(res => {
            window.alert(`Character updated successfully`)
            this.setState({
                name: '',
                strength: '',
                time: '',
            })
        })
    }

    componentDidMount = async () => {
        const { id } = this.state
        const character = await api.getCharacterById(id)

        this.setState({
            name: character.data.data.name,
            strength: character.data.data.strength,
            time: character.data.data.time.join('/'),
        })
    }

    render() {
        const { name, strength, time } = this.state
        return (
            <Wrapper>
                <Title>Update Character</Title>

                <Label>Name: </Label>
                <InputText
                    type="text"
                    value={name}
                    onChange={this.handleChangeInputName}
                />

                <Label>Rating: </Label>
                <InputText
                    type="number"
                    step="1"
                    lang="en-US"
                    min="0"
                    max="40"
                    pattern="[0-9]+([,\.][0-9]+)?"
                    value={strength}
                    onChange={this.handleChangeInputRating}
                />

                <Label>Time: </Label>
                <InputText
                    type="text"
                    value={time}
                    onChange={this.handleChangeInputTime}
                />

                <Button onClick={this.handleUpdateCharacter}>Update Character</Button>
                <CancelButton href={'/characters/list'}>Cancel</CancelButton>
            </Wrapper>
        )
    }
}

export default CharactersUpdate