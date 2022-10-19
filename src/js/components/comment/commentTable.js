import React, { useEffect, useState } from 'react';
import { Label, Button, Card, Grid, Text, Box, Input } from 'theme-ui'
import { getBudgetLineItems } from '../../api/graphql';
import { useSelector } from 'react-redux';
import { updateBudgetLineItem, updateBudgetLineItems } from '../../api/graphql';
import GreenAlertHoc from '../utils/greenAlertHoc';
import AlertHoC from '../utils/alertHoC';

export default function CommentTable({ walletId, month }) {
    const userFromStore = useSelector(store => store.user)

    const [lineItems, setLineItems] = useState([]);
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(async () => {
        getItems()

    }, [walletId, month])

    const getItems = async () => {
        let items = await getBudgetLineItems(walletId, month);
        if (items === undefined) {
            items = await getBudgetLineItems(walletId, month);
        }
        if (items !== undefined) {
            setLineItems(items.data.budgetStatementLineItem);
        }
    }

    const updateLineItem = async (id) => {
        setSuccessMsg('')
        setErrorMsg('')
        const lineItem = lineItems.find(item => item.id == id)
        delete lineItem.__typename
        const itemToUpdate = {
            id: lineItem.id,
            comments: lineItem.comments,
            budgetStatementWalletId: lineItem.budgetStatementWalletId
        }
        try {
            const result = await updateBudgetLineItem(itemToUpdate, userFromStore.authToken);
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

    const updateAllToApi = async () => {
        const itemsToUpdate = lineItems.map(item => {
            delete item.__typename;
            return { ...item }
        })
        try {
            const result = await updateBudgetLineItems(itemsToUpdate, userFromStore.authToken);
            setSuccessMsg(`Updated ${result.data.budgetLineItemsBatchUpdate.length} expenses`)
        } catch (error) {
            console.log(error);
            setErrorMsg('Could not update to API')
        }
    }

    return (
        <>
            {successMsg ? <GreenAlertHoc props={successMsg} /> : ''}
            {errorMsg ? <AlertHoC props={errorMsg} /> : ''}
            <Card sx={{ mt: '10px' }}>
                <Box sx={{ textAlign: 'center', fontWeight: "bold" }}>
                    Reported data for {month}
                    <br/>
                    <Button onClick={getItems} variant='smallOutline'>Refresh</Button>
                </Box>
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
                        Budget Category
                    </Box>
                    <Box sx={{ fontWeight: "bold" }}>
                        Forecast
                    </Box>
                    <Box sx={{ fontWeight: "bold" }}>
                        Actuals
                    </Box>
                    <Box sx={{ fontWeight: "bold", textAlign: 'center' }}>
                        Comments
                    </Box>
                    <Box sx={{ fontWeight: "bold", textAlign: 'center' }}>
                        <Button onClick={updateAllToApi} variant='smallOutline'>Update All</Button>
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
                                <Text>{lineItem.forecast.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
                                <Text>{lineItem.actual.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
                                <Text>
                                    <Input
                                        // value={comment}
                                        defaultValue={comment}
                                        // onChange={(event) => setItemComment(event.target.value)}
                                        onChange={(e) => updateAll(lineItem.id, e.target.value)}
                                    />
                                </Text>
                                {/* <Box sx={{ textAlign: 'center' }}>
                                    <Button variant='smallOutline' onClick={() => updateLineItem(lineItem.id,)}>Update</Button>
                                </Box> */}
                            </Grid>
                        )
                    })}
                </Box>
            </Card>
        </>
    )
}

