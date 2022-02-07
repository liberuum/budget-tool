import React, { useState, useEffect } from 'react';
import { Card, Button, Label, Input, Text, Grid, Box, Container, Badge } from "theme-ui"
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { storeAuthObject } from '../actions/googleAuth';
import { storeLinkData, removeLinkData } from '../actions/tableData';
import processData from '../processor/index';


export default function Table() {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const tableData = useSelector((tableData) => tableData.tableData.links);

    useEffect(async () => {
        const { state, authClient } = await electron.checkToken();
        dispatch(storeAuthObject(authClient));

    }, [electron.checkToken])


    const [inputSheetValue, setInputSheetValue] = useState('');
    const [validatedInput, setValidatedInput] = useState({ variant: null, valid: false });

    const handleInput = (value) => {
        const pattern = /\/spreadsheets\/d\/([^\/]+)\/edit[^#]*(?:#gid=([0-9]+))?/gm
        let result = pattern.exec(value);
        if (result == null) {
            setValidatedInput({ variant: 'inputError', })
        } else {
            if (result[0] !== undefined && result[1] !== undefined && result[2] !== undefined) {
                setValidatedInput({ variant: null, valid: true })
            } else {
                setValidatedInput({ variant: 'inputError', })
            }
        }
        setInputSheetValue(value)
    }

    const handleAddSheet = async (event) => {
        event.preventDefault()
        setInputSheetValue('')
        setValidatedInput({ variant: null, })
        const { rawData, spreadSheetTitle, sheetName, spreadsheetId } = await electron.getSheetInfo(inputSheetValue);
        const { actuals, mdText } = await processData(rawData);
        dispatch(storeLinkData({ spreadSheetTitle, sheetName, spreadsheetId, actuals, mdText }))
    }

    const handleTableRowDelete = (e) => {
        dispatch(removeLinkData(e.target.getAttribute('name')))
    }

    return (
        <Container>
            <Card sx={{ my: 2, mx: [2, "auto"], p: 0, pb: 3, maxWidth: "100%" }}>
                <Grid
                    columns={3}
                    sx={{
                        borderBottom: "1px solid",
                        borderColor: "muted",
                        px: 1,
                        py: 1
                    }}
                >
                    {["Title", "Sheet", "Actions"].map((h, key) => (
                        <Text sx={{ fontWeight: "bold" }} key={key}>
                            {h}
                        </Text>
                    ))}
                </Grid>
                <Box
                    sx={{
                        maxHeight: "auto",
                        borderColor: "muted",
                        px: 2,
                        py: 2,

                    }}
                >
                    {tableData.map((row, key) => {
                        return (
                            <Grid
                                columns={3}
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
                                <Text >
                                    <Button variant="smallOutline" onClick={() => navigate(`/md/${row.spreadsheetId}`)}>ExportMD </Button>
                                    <Button variant="smallOutline" onClick={() => navigate(`/json/${row.spreadsheetId}`)}>Export JSON </Button>
                                    <Button bg='red' variant='small' name={row.sheetName} onClick={handleTableRowDelete}>Delete</Button>
                                </Text>
                            </Grid>
                        )
                    })}
                </Box>
            </Card>
            <Card sx={{ my: 4, p: 2, pb: 3, maxWidth: "100%" }}>
                <Box
                >
                    <Label>Enter Google SpreadSheet Link</Label>
                    <Input
                        sx={{ "::placeholder": { color: '#D3D3D3' } }}
                        variant={validatedInput.variant}
                        placeholder='https://docs.google.com/spreadsheets/d/1N4kcF0TiMmDlKE4K5TLT7jw48h1-nEgDelSIexT93EA/edit#gid=1845449681'
                        name='spreadsheetLink'
                        type='text'
                        value={inputSheetValue}
                        onChange={e => handleInput(e.target.value)}
                    ></Input>
                    {
                        !validatedInput.valid && inputSheetValue ?  (<Text sx={{ m: 0 }} variant="smallError">
                        Link is not valid, make sure to copy full link
                    </Text>) : ''
                    }
                    
                </Box>
                <Box>
                    <Button
                        sx={{
                            mt: '10px'
                        }}
                        disabled={!validatedInput.valid ? true : false}
                        onClick={handleAddSheet}
                    >Add Sheet</Button>
                    {validatedInput.valid ? (<Badge sx={{mx: '2'}}>Link is valid</Badge>) : ''}
                </Box>
            </Card>
        </Container>

    )
}