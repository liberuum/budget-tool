import React, { useState } from 'react';
import { Card, Button, Label, Input, Text, Grid, Box, Container } from "theme-ui"
import { useSelector } from 'react-redux';


export default function Table() {

    const authClient = useSelector(state => state.googleAuth.auth);
    console.log('AuthClient in Tables', authClient)

    const [sheetId, setSheetId] = useState('');
    const [range, setRange] = useState('');
    const [sheets, setSheets] = useState([])

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
                    <Label>Google SpreadSheet ID</Label>
                    <Input
                        // variant="inputError"
                        defaultValue={'2W5kcF0TiMmDlKE4K5TLT7jw48h1-nEgDelSIexT34EA'}
                    ></Input>
                    {/* <Text sx={{ m: 0 }} variant="smallError">
                            Error message goes here
                        </Text> */}
                    <Label>Sheet Name + Range </Label>
                    <Input
                        defaultValue={'Sheet Name!A11:X38'}
                    ></Input>
                </Box>
                <Box>
                    <Button
                        sx={{
                            mt: '40px'
                        }}
                    >Add Sheet</Button>
                </Box>
                {/* </Grid> */}
            </Card>
        </Container>

    )
}