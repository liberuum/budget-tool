import React, { useEffect, useState } from 'react';
import Modal from './modal';

export default function AppVersionAlert() {
    const [openModal, setOpenModal] = useState(false);
    const [appVersion, setAppVersion] = useState('')
    const latestVersion = '1.2.0';

    useEffect(async () => {
        const version = await electron.getAppVersion();
        setAppVersion(version)
        needingUpdate()
        const interval = setInterval(() => {
            needingUpdate()
        }, 120000)
        return () => clearInterval(interval);
    }, []);


    const needingUpdate = () => {
        if (isSameVersion(appVersion, latestVersion)) {
            setOpenModal(true)
        }
    }

    const isSameVersion = (appVersion, latestVersion) => {
        const result = appVersion.localeCompare(latestVersion, undefined, { numeric: true, sensitivity: 'base' })
        if (result === -1) return true;
        return false;
    }

    const handleCloseModal = (event) => {
        event.preventDefault();
        setOpenModal()
    }

    return (
        <>
            {openModal && <Modal closeModal={handleCloseModal} currentVersion={appVersion} newVersion={latestVersion} />}
        </>
    )
}