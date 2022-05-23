import React from 'react';
import { Card, Label, Container, Textarea, Select, Button, Spinner, Text } from "theme-ui"
import { useQuery, gql, useMutation } from "@apollo/client";
import { GET_CORE_UNIT } from '../api/graphql';


export default function CuInfo() {

    // const GET_CORE_UNIT = gql`
    // query getCoreUnit($filter: CoreUnitFilter) {
    //  coreUnit(filter: $filter) {
    //     id
    //     code
    //     name
    // }
    // }
    // `;

    const filter = {
        filter: {
            id: 1
        }
    }

    const { data, loading, error } = useQuery(GET_CORE_UNIT, {
        variables: filter
    });

    if (loading) return <Spinner size={1} />
    if (error) return <Card sx={{ my: 2, textAlign: 'center',  maxWidth: "100%" }}><Text>{error.message + " CU Info"}</Text></Card>

    return (
        <Card sx={{ my: 2, textAlign: 'center',  maxWidth: "100%" }}>
            <Text sx={{ fontWeight: "bold", }}>{data.coreUnit[0].name} Core Unit</Text>
        </Card>
    )
}