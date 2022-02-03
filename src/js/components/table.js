import React, { useState, useEffect } from 'react';
import { Card, Button, Label, Input, Text, Grid, Box, Container, Link } from "theme-ui"
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { storeAuthObject } from '../actions/googleAuth';
import { storeLinkData, removeLinkData } from '../actions/tableData';
import processData from '../processor/index';


export default function Table() {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const tableData = useSelector((tableData) => tableData.tableData.links);
    console.log('tableData', tableData)

    useEffect(async () => {
        const { state, authClient } = await electron.checkToken();
        dispatch(storeAuthObject(authClient));

    }, [electron.checkToken])


    const [inputSheetValue, setInputSheetValue] = useState('');

    const handleAddSheet = async (event) => {
        event.preventDefault()
        setInputSheetValue('')
        const { rawData, spreadSheetTitle, sheetName, spreadSheetId } = await electron.getSheetInfo(inputSheetValue);
        const { actuals, mdText } = await processData(rawData);
        dispatch(storeLinkData({ spreadSheetTitle, sheetName, spreadSheetId, actuals, mdText }))
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
                {/* <Grid columns={[2, "4fr 0.5fr"]}> */}
                <Box
                >
                    <Label>Google SpreadSheet Link</Label>
                    <Input
                        // variant="inputError"
                        placeholder='spreadsheet link'
                        name='spreadsheetLink'
                        type='text'
                        value={inputSheetValue}
                        onChange={e => setInputSheetValue(e.target.value)}
                    ></Input>
                    {/* <Text sx={{ m: 0 }} variant="smallError">
                            Error message goes here
                        </Text> */}
                </Box>
                <Box>
                    <Button
                        sx={{
                            mt: '10px'
                        }}
                        disabled={!inputSheetValue ? true : false}
                        onClick={handleAddSheet}
                    >Add Sheet</Button>
                </Box>
            </Card>
        </Container>

    )
}