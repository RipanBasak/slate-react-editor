import React from 'react'
import styled from '@emotion/styled'



export default Menu = styled('div')`
& > * {
  display: inline-block;
}

& > * + * {
  margin-left: 15px;
}
`