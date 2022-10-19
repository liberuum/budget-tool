import React from 'react';
import { Card, Label, Container, Textarea, Select, Button, Spinner, Text } from "theme-ui"
import { useQuery, gql, useMutation } from "@apollo/client";
import { GET_CORE_UNIT } from '../api/graphql';
import { useSelector } from 'react-redux';
import AlertHoC from './utils/alertHoC';



export default function CuInfo() {

    const userFromStore = useSelector(store => store.user)

    const filter = {
        filter: {
            id: parseFloat(userFromStore.cuId)
        }
    }

    const { data, loading, error } = useQuery(GET_CORE_UNIT, {
        variables: filter
    });

    if (loading) return <Spinner size={1} />
    if (error) return <AlertHoC props={error.message} />
    if (data.coreUnit.length < 1) {
        return <AlertHoC props={'No CU is found'} />
    } else {
        return (
            <Card sx={{ my: 2, textAlign: 'center', maxWidth: "100%" }}>
                <Text sx={{ fontWeight: "bold", }}>{data.coreUnit[0].name} Core Unit</Text>
            </Card>
        )
    }
}