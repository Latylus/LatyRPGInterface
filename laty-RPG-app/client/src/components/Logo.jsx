import React, { Component } from 'react'
import styled from 'styled-components'

import logo from '../logo.svg'

const Wrapper = styled.a.attrs({
    className: 'navbar-brand',
})``

class Logo extends Component {
    render() {
        return (
            <Wrapper href="https://www.youtube.com/watch?v=dQw4w9WgXcQ">
                <img src={logo} width="50" height="50" alt="https://www.youtube.com/watch?v=dQw4w9WgXcQ" />
            </Wrapper>
        )
    }
}

export default Logo