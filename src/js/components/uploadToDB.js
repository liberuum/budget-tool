import React, { useState, useEffect } from 'react';
import { Card, Label, Container, Textarea, Select, Button } from "theme-ui"
import { useQuery, gql, useMutation } from "@apollo/client";


export default function UploadToDB(props) {

    const [lineItems, setLineItems] = useState([])

    // graphql client call
    const GET_CORE_UNITS = gql`
    query getCoreUnits {
     coreUnits {
        code
        name
      }
    }
    `;

    // const { loading, error, data } = useQuery(GET_CORE_UNITS)
    // console.log('useQuery result', data)

    const ADD_BUDGET_LINE_ITEMS = gql`
        mutation BudgetStatementsBatchAdd($input: [BudgetStatementBatchAddInput]) {
            budgetStatementsBatchAdd(input: $input) {
                    errors {
                    message
                    }
                    budgetStatementLineItem {
                    id
                    }
                }
            }
    `;

    const [budgetStatementsBatchAdd, { data, loading, error }] = useMutation(ADD_BUDGET_LINE_ITEMS)

    if (loading) return 'Submitting data...'
    if (error) return `Upload error! ${error.message}`

    const keys = props.props.keys;
    const selectedMonth = props.props.selectedMonth;
    const leveledMonthsByCategory = props.props.leveledMonthsByCategory;

    function getAllMonths() {
        let months = [];
        for (let month in Object.entries(leveledMonthsByCategory)[0][1]) {
            months.push(month)
        }
        return months;
    }

    const parseDataForApi = () => {
        const months = getAllMonths();
        for (let category in leveledMonthsByCategory) {
            for (let month of months) {
                const rowObject = {
                    month: "",
                    position: 0,
                    group: 0,
                    budgetCategory: '',
                    forecast: 0,
                    actual: 0,
                    comments: ''
                };
                rowObject.month = month;
                rowObject.position = 0;
                rowObject.group = 0;
                rowObject.budgetCategory = category;
                rowObject.forecast = roundNumber(leveledMonthsByCategory[category][month].forecast);
                rowObject.actual = roundNumber(leveledMonthsByCategory[category][month].actual);
                rowObject.comments = '';

                lineItems.push(rowObject)
            }
        }
        console.log('lineItems', lineItems)
    }


    const handleUpload = () => {

        parseDataForApi()



        // budgetStatementsBatchAdd({ variables: { input: data } });
    }


    const roundNumber = (number) => {
        return Number(Math.round(parseFloat(number + 'e' + 2)) + 'e-' + 2)
    }

    return (
        <Container >
            <Card>
                <Label>Upload budget forecast and actuals to ecosystem dashboard</Label>
                <Button onClick={handleUpload} variant="smallOutline" >Upload</Button>
            </Card>
        </Container>
    )
}