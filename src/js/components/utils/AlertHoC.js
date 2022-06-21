import React, { useState } from 'react';
import { Alert, Close } from 'theme-ui'


export default function AlertHoC(props) {

    const [show, setShow] = useState(true);
    
    const handleClose = () => {
        setShow(!show)
    }

    setTimeout( () => {
        setShow(false)
    },10000)

    return (
        <div style={{
            position: 'absolute',
            zIndex: 1000,
            top: '2%',
            right: '2%'
        }}>
            {show ? <Alert variant="warning">
                {props.props}
                <Close style={{cursor: 'pointer'}} onClick={handleClose} ml="auto" mr={-2} />
            </Alert> : ''}


        </div>
    )
}