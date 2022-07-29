import React, { useState, useEffect } from 'react';
import { Card, Button, Label, Input, Text, Grid, Box, Container, Badge, Link } from "theme-ui"
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { storeAuthObject } from '../actions/googleAuth';
import { storeLinkData, removeLinkData } from '../actions/tableData';
import processData from '../processor/index';
import CuInfo from './cuInfo';


export default function Table() {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const tableData = useSelector((tableData) => tableData.tableData.links);

    console.log('tableData:', tableData)

    useEffect(async () => {
        const { state, authClient } = await electron.checkToken();
        dispatch(storeAuthObject(authClient));

    }, [electron.checkToken])


    const [inputSheetValue, setInputSheetValue] = useState('');
    const [validatedInput, setValidatedInput] = useState({ variant: null, valid: false, duplicate: false, linkError: false, walletFields: false });
    const [inputWalletAddress, setInputWalletAddress] = useState('');
    const [inputWalletName, setInputWalletName] = useState('');
    const [shortenedAddress, setShortenedAddress] = useState('');

    const handleWalletNameInput = (value) => {
        setInputWalletName(value);
    }
    const handleWalletAddressInput = (value) => {
        setInputWalletAddress(value);
        checkWalletInput(value);
    }


    const checkWalletInput = (value) => {
        let regex = new RegExp(/^0x[a-fA-F0-9]{40}$/);
        let result = regex.test(value);
        if (result) {
            setValidatedInput({ ...validatedInput, walletFields: true, variant: null })
        } else {
            setValidatedInput({ ...validatedInput, walletFields: false })
        }
    }

    const handleOpenWalletLink = (address) => {
        electron.openWalletLink(address)
    }


    const handleLinkInput = (value) => {
        const pattern = /\/spreadsheets\/d\/([^\/]+)\/edit[^#]*(?:#gid=([0-9]+))?/gm
        let result = pattern.exec(value);
        if (result == null) {
            setValidatedInput({ ...validatedInput, variant: 'inputError', valid: false })
        } else {
            if (result[0] !== undefined && result[1] !== undefined && result[2] !== undefined) {
                setValidatedInput({ ...validatedInput, variant: null, valid: true, duplicate: isDuplicateLink(result[1]) })
            } else {
                setValidatedInput({ ...validatedInput, variant: 'inputError', valid: false })
            }
        }
        setInputSheetValue(value)
    }


    const handleAddSheet = async (event) => {
        event.preventDefault()
        const walletAddress = inputWalletAddress.toLowerCase();
        const walletName = inputWalletName;
        addrShortener(inputWalletAddress)
        const { error, rawData, spreadSheetTitle, sheetName, spreadsheetId } = await electron.getSheetInfo(inputSheetValue);
        if (error) {
            setValidatedInput({ linkError: true })
        } else {
            const { actualsByMonth, leveledMonthsByCategory, mdTextByMonth, sfSummary } = await processData(rawData);
            dispatch(storeLinkData({ spreadSheetTitle, sheetName, spreadsheetId, actualsByMonth, leveledMonthsByCategory, mdTextByMonth, sfSummary, walletName, walletAddress }))
        }
        setValidatedInput({ variant: null, })
        setInputWalletName('')
        setInputWalletAddress('')
        setInputSheetValue('')
    }

    const handleTableRowDelete = (e) => {
        dispatch(removeLinkData(e.target.getAttribute('name')))
    }

    const isDuplicateLink = (sheetId) => {
        let response = tableData.filter(row => {
            return row.spreadsheetId === sheetId
        })
        if (response.length == 0) {
            return false
        } else {
            return true
        }
    }

    const addrShortener = (address) => {
        let cutAddress = ''
        let preffix = address.substring(4, address.lenght - 4);
        let suffix = address.substring(address.length - 4);
        cutAddress = `${preffix}...${suffix}`
        setShortenedAddress(cutAddress);
    }

    return (
        <Container>
            <CuInfo />
            <Card sx={{ my: 2, mx: [1, "auto"], p: 0, pb: 3, maxWidth: "100%", }}>
                <Grid
                    columns={4}
                    sx={{
                        borderBottom: "1px solid",
                        borderColor: "muted",
                        px: 1,
                        py: 1
                    }}
                >
                    {["Title", "Sheet", "Wallet", "Actions"].map((h, key) => (
                        <Text sx={{ fontWeight: "bold" }} key={key}>
                            {h}
                        </Text>
                    ))}
                </Grid>
                <Box
                    sx={{
                        maxHeight: "auto",
                        borderColor: "muted",
                        px: 1,
                        py: 1,
                        fontSize: "14px"

                    }}
                >
                    {tableData.map((row, key) => {
                        return (
                            <Grid
                                columns={4}
                                key={key}
                                sx={{
                                    borderBottom: "1px solid",
                                    borderColor: "muted",
                                    my: "2",
                                    py: "1"
                                }}
                            >
                                <Text >{row.spreadSheetTitle}</Text>
                                <Text >{row.sheetName}</Text>
                                <Text><Link sx={{ cursor: 'pointer' }} onClick={() => handleOpenWalletLink(row.walletAddress)}>{shortenedAddress}</Link></Text>
                                <Text sx={{ fontSize: "9px" }}>
                                    <Button variant="smallOutline" onClick={() => navigate(`/md/${row.spreadsheetId}`)}>To MD </Button>
                                    <Button variant="smallOutline" onClick={() => navigate(`/json/${row.spreadsheetId}`)}>To JSON </Button>
                                    <Button variant="smallOutline" onClick={() => navigate(`/api/${row.spreadsheetId}`)} >To Api</Button>
                                    <Button bg='red' variant='small' name={row.sheetName} onClick={handleTableRowDelete}>Delete</Button>
                                </Text>
                            </Grid>
                        )
                    })}
                </Box>
            </Card>
            <Card sx={{ my: 4, p: 2, pb: 3, maxWidth: "100%" }}>
                <Box>
                    <Grid
                        columns={2}
                        sx={{
                            py: 1,
                            fontSize: "14px"
                        }}
                    >
                        <div>
                            <Label>Enter Wallet Name</Label>
                            <Input
                                sx={{ "::placeholder": { color: '#D3D3D3' } }}
                                // variant={validatedInput.variant}
                                placeholder='permanent team'
                                name='walletName'
                                type='text'
                                value={inputWalletName}
                                onChange={e => handleWalletNameInput(e.target.value)}
                            ></Input>
                        </div>
                        <div>
                            <Label>Enter Wallet Address</Label>
                            <Input
                                sx={{ "::placeholder": { color: '#D3D3D3' } }}
                                // variant={validatedInput.variant}
                                disabled={inputWalletName === ''}
                                placeholder='0xBE8E3e3618f7474F8cB1d074A26afFef007E98FB'
                                name='walletName'
                                type='text'
                                value={inputWalletAddress}
                                onChange={e => handleWalletAddressInput(e.target.value)}
                            ></Input>
                            {
                                !validatedInput.walletFields && inputWalletAddress !== '' ? (<Text sx={{ m: 0 }} variant="smallError">
                                    Paste the correct format - only wallet address
                                </Text>) : ''
                            }
                        </div>
                    </Grid>
                </Box>
                <Box>
                    <Label>Enter Google SpreadSheet Link</Label>
                    <Input
                        sx={{ "::placeholder": { color: '#D3D3D3' } }}
                        variant={validatedInput.variant}
                        disabled={!validatedInput.walletFields}
                        placeholder='https://docs.google.com/spreadsheets/d/1N4kcF0TiMmDlKE4K5TLT7jw48h1-nEgDelSIexT93EA/edit#gid=1845449681'
                        name='spreadsheetLink'
                        type='text'
                        value={inputSheetValue}
                        onChange={e => handleLinkInput(e.target.value)}
                    ></Input>
                    {
                        !validatedInput.valid && inputSheetValue ? (<Text sx={{ m: 0 }} variant="smallError">
                            Link is not valid, make sure to copy full link
                        </Text>) : ''
                    }
                    {
                        validatedInput.linkError ? (<Text sx={{ m: 0 }} variant="smallError">
                            Can't access link, make sure you have access to your spreadsheet
                        </Text>) : ''
                    }

                </Box>
                <Box>
                    <Button
                        sx={{
                            mt: '10px'
                        }}
                        disabled={validatedInput.valid && !validatedInput.duplicate && validatedInput.walletFields ? false : true}
                        onClick={handleAddSheet}
                    >Add Sheet</Button>
                    {validatedInput.valid ?
                        (
                            validatedInput.duplicate ?
                                <Badge sx={{ mx: '2', bg: 'orange', color: 'black' }}>Duplicate Link</Badge>
                                :
                                <Badge sx={{ mx: '2' }}>Valid Link</Badge>
                        )
                        : ''}
                </Box>
            </Card>
        </Container>

    )
}