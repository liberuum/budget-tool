import React, { useState, useEffect } from 'react';
import { Card, Label, Container, Textarea, Select, Button } from "theme-ui"
import { getCoreUnits } from '../api/graphql.js'

export default function UploadToDB(props) {

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
                    position: "",
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