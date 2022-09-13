import React from 'react';
import './modal.css'
import { Button } from 'theme-ui'

export default function Modal({ closeModal }) {

    return (
        <div className='modalBackground'>
            <div className='modalContainer'>
                <div className='titleCloseBtn'>
                    <button onClick={() => closeModal(false)}>x</button>
                </div>
                <div className='title'>
                    <h3>Budget Tool Update</h3>
                </div>
                <div className='body'>
                    <p>There's a new version, download and update.</p>
                </div>
                <div className='footer'>
                    <Button bg='red' onClick={() => closeModal(false)}>cancel</Button>
                    <Button >download</Button>
                </div>
            </div>
        </div>
    )
}