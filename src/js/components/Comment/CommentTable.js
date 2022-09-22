import React, { useEffect, useState } from 'react';
import { Button, Card, Grid, Text, Box, Input } from 'theme-ui'
import { getBudgetLineItems } from '../../api/graphql';
import { useSelector } from 'react-redux';
import { updateBudgetLineItem } from '../../api/graphql';
import GreenAlertHoc from '../utils/greenAlertHoc';
import AlertHoC from '../utils/alertHoC';

export default function CommentTable() {
    const userFromStore = useSelector(store => store.user)

    const [lineItems, setLineItems] = useState([]);
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(async () => {
        const items = await getBudgetLineItems('643', '2022-05-01');
        setLineItems(items.data.budgetStatementLineItem)
    }, [successMsg])

    const updateLineItem = async (id) => {
        const lineItem = lineItems.find(item => item.id == id)
        delete lineItem.__typename
        const itemToUpdate = {
            id: lineItem.id,
            comments: lineItem.comments
        }
        try {
            const result = await updateBudgetLineItem(itemToUpdate, userFromStore.authToken);
            console.log('result from updating', result.data.budgetLineItemUpdate[0]);
            setSuccessMsg(`Updated ${result.data.budgetLineItemUpdate[0].budgetCategory}`)
        } catch (error) {
            setErrorMsg('Could not update to API')
        }
    }

    const updateAll = (id, comment) => {
        let newItems = lineItems.map(item => {
            if (item.id == id) {
                return {
                    ...item,
                    comments: comment
                }
            } return { ...item }
        });
        setLineItems(newItems)
    }
    return (
        <>
            {successMsg ? <GreenAlertHoc props={successMsg} /> : ''}
            {errorMsg ? <AlertHoC props={errorMsg} /> : ''}
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
                                        // onChange={(event) => setItemComment(event.target.value)}
                                        onChange={(e) => updateAll(lineItem.id, e.target.value)}
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

