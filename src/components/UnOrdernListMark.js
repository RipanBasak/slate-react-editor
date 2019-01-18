import React  from 'react';

const UnOrdernListMark = (props)=>{
    return (
        <ul {...props.attributes}>
            <li>{props.children}</li>
        </ul>
    );
   
}
export default UnOrdernListMark;
