import React from 'react';

const FormatToolbar = (props)=>{
    // console.log(props);

    return(
        <div className="FormatToolbar">
            {props.children}
        </div>
    );
   
}

export default FormatToolbar;