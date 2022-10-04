import React, { useState, useEffect } from 'react';
import { Alert, Close } from 'theme-ui'


export default function GreenAlertHoc(props) {

    useEffect(() => {
        return () => {
            setTimeout(() => {
                setShow(false)
            }, 10000)
        }
    })

    const [show, setShow] = useState(true);

    const handleClose = () => {
        setShow(!show)
    }

    return (
        <div style={{
            position: 'absolute',
            zIndex: 1000,
            top: '2%',
            right: '2%'
        }}>
            {show ? <Alert variant="success">
                {props.props}
                <Close style={{ cursor: 'pointer' }} onClick={handleClose} ml="auto" mr={-2} />
            </Alert> : ''}


        </div>
    )
}