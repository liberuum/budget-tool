import React, { useState, useEffect } from 'react';
import { Card, Label, Container, Textarea, Select, Button } from "theme-ui"
import { useQuery, gql, useMutation } from "@apollo/client";
import { getCoreUnit, getBudgetSatementInfo } from '../api/graphql';
import { validateMonthsInApi } from './utils/validateMonths';


export default function UploadToDB(props) {
    const { walletName, walletAddress, keys, selectedMonth, leveledMonthsByCategory } = props.props;


    const [lineItems, setLineItems] = useState([])
    const [coreUnit, setCoreUnit] = useState();
    const [apiBudgetStatements, setApiBudgetStatements] = useState();

    useEffect(() => {
        parseDataForApi()
        fetchCoreUnit()

    }, [parseDataForApi, lineItems])

    const ADD_BUDGET_LINE_ITEMS = gql`
        mutation budgetLineItemsBatchAdd($input: [LineItemsBatchAddInput]) {
            budgetLineItemsBatchAdd(input: $input) {
                    id                    
                }
            }
            `
        ;

    const [budgetLineItemsBatchAdd, { data, loading, error }] = useMutation(ADD_BUDGET_LINE_ITEMS, {
        fetchPolicy: 'no-cache'
    });

    const fetchCoreUnit = async () => {
        const rawCoreUnit = await getCoreUnit(39)
        setCoreUnit(rawCoreUnit.data.coreUnit[0])
        const rawBudgetStatements = await getBudgetSatementInfo(rawCoreUnit.data.coreUnit[0].id)
        const budgetStatements = rawBudgetStatements.data.budgetStatement;
        setApiBudgetStatements(budgetStatements)
        validateMonthsInApi(budgetStatements, getAllMonths(), rawCoreUnit.data.coreUnit[0], walletAddress, walletName, lineItems);
    }


    if (data) console.log('data from apollo server', data)
    if (loading) return 'Submitting data...'
    if (error) return `Upload error! ${error.message}`



    // console.log('walletName', walletName)

    function getAllMonths() {
        if (leveledMonthsByCategory !== undefined) {
            let months = [];
            for (let month in Object.entries(leveledMonthsByCategory)[0][1]) {
                months.push(month)
            }
            return months;
        }
    }

    const parseDataForApi = () => {
        const months = getAllMonths();
        if (months !== undefined) {
            for (let category in leveledMonthsByCategory) {
                for (let month of months) {
                    const rowObject = {
                        budgetStatementWalletId: null,
                        month: "",
                        position: 0,
                        group: '',
                        budgetCategory: '',
                        forecast: 0,
                        actual: 0,
                        comments: ''
                    };
                    rowObject.month = month;
                    rowObject.position = 0;
                    rowObject.group = '';
                    rowObject.budgetCategory = category;
                    rowObject.forecast = roundNumber(leveledMonthsByCategory[category][month].forecast);
                    rowObject.actual = roundNumber(leveledMonthsByCategory[category][month].actual);
                    rowObject.comments = '';
                    lineItems.push(rowObject)
                }
            }
        }
    }


    const getNextThreeMonths = (selectedMonth) => {
        if (selectedMonth !== undefined) {
            const date = selectedMonth;
            let monthsToUpload = [];
            monthsToUpload.push(date);

            const toNumber = date.split('-');
            let year = Number(toNumber[0])
            let month = Number(toNumber[1])
            let yearString = String(year);

            for (let i = 1; i <= 3; i++) {
                let newMonth = month + i;
                let leading0 = newMonth < 10 ? '0' : '';
                let monthString = leading0 + String(newMonth)

                if (newMonth > 12) {
                    yearString = String(year + 1)
                }
                if (newMonth === 13) {
                    monthString = '01'
                }
                if (newMonth === 14) {
                    monthString = '02'
                }
                if (newMonth === 15) {
                    monthString = '03'
                }
                let result = yearString.concat('-').concat(monthString)
                monthsToUpload.push(result)
            }
            return monthsToUpload;
        }
    }

    const filterFromLineTitems = () => {
        const months = getNextThreeMonths(selectedMonth);
        if (months !== undefined) {
            let filtered = [];
            for (let i = 0; i < months.length; i++) {
                let selectedLineItems = lineItems.filter(item => {
                    return item.month == months[i].concat('-01');
                })
                filtered.push(...selectedLineItems);
                selectedLineItems = null
            }

            console.log('filtered months to upload', filtered)
            return filtered;

        }

    }


    const handleUpload = () => {

        let data = filterFromLineTitems()
        budgetLineItemsBatchAdd({ variables: { input: data } });
    }


    const roundNumber = (number) => {
        return Number(Math.round(parseFloat(number + 'e' + 2)) + 'e-' + 2)
    }

    return (
        <Container >
            <Card>
                <Label>Upload {selectedMonth} actuals and forecasts to ecosstem dashboard API</Label>
                <Button onClick={handleUpload} variant="smallOutline" >Upload</Button>
            </Card>
        </Container>
    )
}