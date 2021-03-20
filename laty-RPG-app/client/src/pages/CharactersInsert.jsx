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

class CharactersInsert extends Component {
    constructor(props) {
        super(props)

        this.state = {
            name: '',
            strength: '',
            time: '',
        }
    }

    handleChangeInputName = async event => {
        const name = event.target.value
        this.setState({ name })
    }

    handleChangeInputStrength = async event => {
        const strength = event.target.validity.valid
            ? event.target.value
            : this.state.strength

        this.setState({ strength })
    }

    handleChangeInputTime = async event => {
        const time = event.target.value
        this.setState({ time })
    }

    handleIncludeCharacter = async () => {
        const { name, strength, time } = this.state
        const arrayTime = time.split('/')
        const payload = { name, strength, time: arrayTime }

        await api.insertCharacter(payload).then(res => {
            window.alert(`Character inserted successfully`)
            this.setState({
                name: '',
                strength: '',
                time: '',
            })
        })
    }

    render() {
        const { name, strength, time } = this.state
        return (
            <Wrapper>
                <Title>Create Character</Title>

                <Label>Name: </Label>
                <InputText
                    type="text"
                    value={name}
                    onChange={this.handleChangeInputName}
                />

                <Label>Strength: </Label>
                <InputText
                    type="number"
                    step="1"
                    lang="en-US"
                    min="0"
                    max="40"
                    pattern="[0-9]+([,\.][0-9]+)?"
                    value={strength}
                    onChange={this.handleChangeInputStrength}
                />

                <Label>Time: </Label>
                <InputText
                    type="text"
                    value={time}
                    onChange={this.handleChangeInputTime}
                />

                <Button onClick={this.handleIncludeCharacter}>Add Character</Button>
                <CancelButton href={'/characters/list'}>Cancel</CancelButton>
            </Wrapper>
        )
    }
}

export default CharactersInsert