import React, { useEffect, useState } from 'react';
import { Button, Card, Grid, Text, Box, Input } from 'theme-ui'
import { getBudgetLineItems } from '../../api/graphql';

export default function CommentTable() {

    const [lineItems, setLineItems] = useState([])
    const [itemComment, setItemComment] = useState('')

    useEffect(async () => {
        const items = await getBudgetLineItems('643', '2022-05-01');
        setLineItems(items.data.budgetStatementLineItem)
    }, [])

    const updateLineItem = (id) => {
        const updatedLineItems = lineItems.map(lineItem => {
            if (lineItem.id === id) {
                return { ...lineItem, comments: itemComment }
            }
            return { ...lineItem }
        })

        setLineItems(updatedLineItems)
        console.log(lineItems)

        
    }
    return (
        <>

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
                        <Button variant='smallOutline'>Update All</Button>
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
                        const comment = lineItem.comments
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
                                        // value={comment}
                                        defaultValue={comment}
                                        onChange={(event) => setItemComment(event.target.value)}
                                    />
                                </Text>
                                <Box sx={{ textAlign: 'center' }}>
                                    <Button variant='smallOutline' onClick={() => updateLineItem(lineItem.id,)}>Update</Button>
                                </Box>
                            </Grid>
                        )
                    })}
                </Box>
            </Card>

        </>
    )
}

