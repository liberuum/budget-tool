import React, { useState, useEffect } from 'react';
import { Card, Button, Label, Input, Text, Grid, Box, Container, Form } from "theme-ui"
import { useSelector, useDispatch } from 'react-redux';
import { storeAuthObject } from '../actions/googleAuth';
import processData from '../processor/index';


export default function Table() {

    const dispatch = useDispatch();

    useEffect(async () => {
        const { state, authClient } = await electron.checkToken();
        dispatch(storeAuthObject(authClient));

    }, [electron.checkToken])


    const [inputSheetValue, setInputSheetValue] = useState('');
    const [sheets, setSheets] = useState('')



    const handleAddSheet = async (event) => {
        event.preventDefault()
        setSheets(inputSheetValue);
        setInputSheetValue('')
        const { rawData } = await electron.getSheetInfo(inputSheetValue);
        processData(rawData);
    }

    return (
        <Container>
            <Card sx={{ my: 2, mx: [2, "auto"], p: 0, pb: 3, maxWidth: "100%" }}>
                <Grid
                    columns={3}
                    sx={{
                        borderBottom: "1px solid",
                        borderColor: "muted",
                        px: 2,
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
                    {[
                        ["SES Budget Sheet", "Permanent Team", "Export MD Export JSON Delete"],
                        ["SES Budget Sheet", "Incubation Program", "Export MD Export JSON Delete"],
                        ["SES Budget Sheet", "Grants Program", "Export MD Export JSON Delete"],
                    ].map((row, key) => (
                        <Grid
                            columns={3}
                            key={key}
                            sx={{
                                borderBottom: "1px solid",
                                borderColor: "muted",
                                my: "2",
                                py: "2"
                            }}
                        >
                            {row.map((cell, key) => (
                                <Text key={key}>{cell}</Text>
                            ))}
                        </Grid>
                    ))}
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
                {sheets}
            </Card>
        </Container>

    )
}