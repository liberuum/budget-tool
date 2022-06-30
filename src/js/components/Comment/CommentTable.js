import React from 'react';
import { Container, Card, Grid, Text, Box, Input } from 'theme-ui'

export default function CommentTable() {


    return (
        <>
            <Container>
                <Card >
                    <Grid
                        gap={1}
                        columns={[5, '1fr 0.5fr 0.5fr 2.5fr 0.5fr']}
                        sx={{
                            borderBottom: "1px solid",
                            borderColor: "muted",
                            px: 1,
                            py: 1
                        }}
                    >
                        <Box sx={{ fontWeight: "bold" }}>
                            Category
                        </Box>
                        <Box sx={{ fontWeight: "bold" }}>
                            Actuals
                        </Box>
                        <Box sx={{ fontWeight: "bold" }}>
                            Forecast
                        </Box>
                        <Box sx={{ fontWeight: "bold", textAlign: 'center' }}>
                            Comments
                        </Box>
                        <Box sx={{ fontWeight: "bold", textAlign: 'center' }}>
                            Update
                        </Box>
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
                        {lineItems.map((lineItem) => {
                            return (
                                <Grid
                                    gap={1}
                                    columns={[5, '1fr 0.5fr 0.5fr 2.5fr 0.5fr']}
                                    key={lineItem.id}
                                    sx={{
                                        borderBottom: "1px solid",
                                        borderColor: "muted",
                                        my: "2",
                                        py: "1"
                                    }}
                                >
                                    <Text >{lineItem.budgetCategory}</Text>
                                    <Text
                                     
                                    >{lineItem.actual}</Text>
                                    <Text
                                        
                                    >{lineItem.forecast}</Text>
                                    <Text>
                                        <Input
                                            value={lineItems.comments}
                                        />
                                    </Text>
                                    <Box sx={{ textAlign: 'center' }}>
                                        Update
                                    </Box>
                                </Grid>
                            )
                        })}
                    </Box>
                </Card>
            </Container>
        </>
    )
}

const lineItems = [
    {
        "id": "759",
        "budgetStatementWalletId": "192",
        "month": "2022-11-01",
        "position": 0,
        "group": "",
        "budgetCategory": "Gas Expense",
        "forecast": 0,
        "actual": 0,
        "comments": "",
        "canonicalBudgetCategory": null,
        "headcountExpense": null,
        "budgetCap": null
    },
    {
        "id": "761",
        "budgetStatementWalletId": "192",
        "month": "2022-11-01",
        "position": 0,
        "group": "",
        "budgetCategory": "Travel & Entertainment",
        "forecast": 116146.52,
        "actual": 89724.16,
        "comments": "empty values",
        "canonicalBudgetCategory": null,
        "headcountExpense": null,
        "budgetCap": null
    },
]