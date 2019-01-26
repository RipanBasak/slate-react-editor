import React from 'react'
import styled from '@emotion/styled'


export default Icon = styled(({ className, ...rest }) => {
    return <span className={`material-icons ${className}`} {...rest} />
  })`
    font-size: 18px;
    vertical-align: text-bottom;
  `
  