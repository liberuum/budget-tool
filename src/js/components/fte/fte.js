import React, { useState, useEffect } from 'react';
import { Card, Label, Input, Grid, Text, Button, Spinner } from "theme-ui";
import { gql, useMutation } from "@apollo/client";
import { useSelector } from 'react-redux';
import { getFte } from '../../api/graphql';

export default function FTE({ month, budgetStatementId }) {
    const userFromStore = useSelector(store => store.user)
    const [fte, setFte] = useState('')
    const [apiFte, setApiFte] = useState(null)
    const [readToUpload, setReadyToUpload] = useState(false);

    useEffect(async () => {
        const result = await getFte(parseFloat(budgetStatementId))
        if (result.data.budgetStatementFTE.length > 0) {
            setFte(`${result.data.budgetStatementFTE[0].ftes}`)
            setApiFte(result.data.budgetStatementFTE[0])
        } else {
            setApiFte(null)
            setFte('')
        }
    }, [budgetStatementId, month])
  
    const handleChange = (value) => {
        setFte(value)
        if (parseFloat(value) > 1000 || parseFloat(value) < 0 || value == '') {
            setReadyToUpload(false)
        } else {
            setReadyToUpload(true)
        }
    }


    const uploadFte = async () => {
        if (apiFte !== null) {
            await updateFte()
        } else {
            await addFte()
        }
    }

    const ADD_FTE = gql`
        mutation addFte($input: BudgetStatementFTEInput) {
            budgetStatementFTEAdd(input: $input) {
                id
                budgetStatementId
                month
                ftes
            }
        }
    `

    const UPDATE_FTE = gql`
        mutation updateFte($input: BudgetStatementFTEUpdateInput) {
            budgetStatementFTEUpdate(input: $input) {
                id
                budgetStatementId
                month
                ftes
            }
        }
    `

    const [addFte, { data, loading, error }] = useMutation(ADD_FTE, {
        variables: {
            input: {
                budgetStatementId,
                month,
                ftes: parseFloat(fte)
            }
        },
        fetchPolicy: 'no-cache',
        context: {
            headers: {
                authorization: `Bearer ${userFromStore.authToken}`
            }
        }
    });

    const [updateFte, { dataUpdate, loadingUpdate, errorUpdate }] = useMutation(UPDATE_FTE, {
        variables: {
            input: {
                id: apiFte?.id,
                budgetStatementId,
                month,
                ftes: parseFloat(fte)
            }
        },
        fetchPolicy: 'no-cache',
        context: {
            headers: {
                authorization: `Bearer ${userFromStore.authToken}`
            }
        }
    })


    return (
        <>
            <Card>
                <Label>Set FTE for {month.substring(0, month.length - 3)}</Label>
                <Grid
                    columns={2}
                >
                    <Input
                        value={fte}
                        onChange={(e) => handleChange(e.target.value)}
                        type={'number'}
                    />
                    {loading || loadingUpdate ?
                        <Spinner variant="styles.spinner" title="loading"></Spinner>
                        :
                        <Button
                            sx={{ width: '30%' }}
                            variant="smallOutline"
                            onClick={uploadFte}
                            disabled={!readToUpload}
                        >SET</Button>
                    }
                </Grid>
                {parseFloat(fte) > 1000 || parseFloat(fte) < 0 ? <Text variant='smallError'>Set number between 0 and 1000</Text> : ''}

            </Card>
        </>
    )
}