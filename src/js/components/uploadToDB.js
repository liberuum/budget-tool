import React, { useState, useEffect } from 'react';
import { Card, Label, Container, Textarea, Select, Button } from "theme-ui"
import { useQuery, gql, useMutation } from "@apollo/client";


export default function UploadToDB(props) {

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
    const monthsArr = props.props.monthsArr;

    const getForecastAndActual = () => {
        const forecastAndActual = {}
        for (let month of keys) {
            forecastAndActual[month] = {}
            for (let category of monthsArr.actualsByMonth[month]) {
                if (category.type === 'forecast') {
                    forecastAndActual[month]['forecast'] = category

                }
                if (category.type === 'actual') {
                    forecastAndActual[month]['actual'] = category

                }
            }
        }
        return forecastAndActual;

    }

    const handleUpload = () => {
        const data = [];

        const forecastAndActual = getForecastAndActual();

        for (let month of keys) {

            const forecasts = forecastAndActual[month]['forecast']
            const actuals = forecastAndActual[month]['actual']
            const categories = getCategories(Object.keys(forecastAndActual[month]['forecast']))
            categories.forEach(category => {
                const rowObject = {
                    month: "",
                    position: 0,
                    group: "",
                    budgetCategory: "",
                    forecast: "",
                    actual: "",
                    comments: ""
                };
                rowObject.month = month;
                rowObject.budgetCategory = category;
                rowObject.forecast = roundNumber(forecasts[category]);
                rowObject.actual = roundNumber(actuals[category])
                data.push(rowObject)
            });
        }
        console.log('ecosystem dashboard data', data)
        budgetStatementsBatchAdd({ variables: { input: data } });

    }

    const getCategories = (mmonthlies) => {
        let budgetCategories = mmonthlies.filter(category => {
            if (category !== "type" && category !== 'total' && category !== 'payment topup') {
                return category
            }
        })
        return budgetCategories;
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