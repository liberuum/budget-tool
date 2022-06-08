import React, { useState, useEffect } from 'react';
import { Card, Label, Badge, Textarea, Select, Button, Spinner } from "theme-ui"
import { useQuery, gql, useMutation } from "@apollo/client";
import { getCoreUnit, getBudgetSatementInfo, updateBudgetLineItems } from '../api/graphql';
import { validateMonthsInApi } from './utils/validateMonths';
import { validateLineItems } from './utils/validateLineItems'


export default function UploadToDB(props) {
    const { walletName, walletAddress, keys, selectedMonth, leveledMonthsByCategory } = props.props;
    const [itemsToOverride, setItemsToOverride] = useState([])
    const [itemsToUpload, setItemsToUpload] = useState([])
    const [uploadStatus, setUploadStatus] = useState({ updatingDb: false, noChange: false, overriding: false, uploading: false })


    const [lineItems, setLineItems] = useState([])
    const [coreUnit, setCoreUnit] = useState();
    const [apiBudgetStatements, setApiBudgetStatements] = useState();

    useEffect(async () => {
        parseDataForApi()
        fetchCoreUnit()
        handleMonthChange()

    }, [fetchCoreUnit, parseDataForApi, lineItems, selectedMonth])

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
        const rawCoreUnit = await getCoreUnit(42)
        setCoreUnit(rawCoreUnit.data.coreUnit[0])
        const rawBudgetStatements = await getBudgetSatementInfo(rawCoreUnit.data.coreUnit[0].id)
        const budgetStatements = rawBudgetStatements.data.budgetStatement;
        setApiBudgetStatements(budgetStatements)
        validateMonthsInApi(budgetStatements, getAllMonths(), rawCoreUnit.data.coreUnit[0], walletAddress, walletName, lineItems);
    }


    // if (data) console.log('data from apollo server', data)
    // if (loading) return 'Submitting data...'
    // if (error) return `Upload error! ${error.message}`



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
        lineItems.splice(0, lineItems.length)
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

    const filterFromLineItems = (selectedMonth) => {
        const months = getNextThreeMonths(selectedMonth);
        if (months !== undefined) {
            let filtered = [];
            for (let i = 0; i < months.length; i++) {
                let selectedLineItems = lineItems.filter(item => {
                    return item.month === months[i].concat('-01');
                })
                filtered.push(...selectedLineItems);
                selectedLineItems = null
            }

            console.log('filtered months to upload', filtered)
            return filtered;

        }

    }

    const handleMonthChange = async () => {

        console.log('month has changed', selectedMonth)
        setUploadStatus({ ...uploadStatus, updatingDb: false, noChange: false, overriding: false, uploading: false })

    }


    const handleUpload = async () => {
        setUploadStatus({ ...uploadStatus, updatingDb: true })

        let data = filterFromLineItems(selectedMonth)
        const { lineItemsToOverride, lineItemsToUpload } = await validateLineItems(data);
        console.log('data to override', lineItemsToOverride)
        console.log('data to upload:', lineItemsToUpload)

        if (lineItemsToOverride.length > 0) {
            console.log('updating lineItems',)
            await updateBudgetLineItems(lineItemsToOverride)
            setUploadStatus({ ...uploadStatus, updatingDb: false, overriding: true })
        }
        if (lineItemsToUpload.length > 0) {
            console.log('adding new lineItems')
            await budgetLineItemsBatchAdd({ variables: { input: lineItemsToUpload } });
            setUploadStatus({ ...uploadStatus, updatingDb: false, uploading: true })
        }
        if (lineItemsToOverride.length == 0 && lineItemsToUpload.length == 0) {
            setUploadStatus({ ...uploadStatus, updatingDb: false, noChange: true, overriding: false, uploading: false  })
        }

    }


    const roundNumber = (number) => {
        return Number(Math.round(parseFloat(number + 'e' + 2)) + 'e-' + 2)
    }

    return (
        <Card>
            <Label onChange={handleMonthChange}>Upload {selectedMonth} actuals and forecasts to ecosstem dashboard API</Label>
            {uploadStatus.updatingDb ? <Spinner variant="styles.spinner" title="loading"></Spinner> :
                <Button onClick={handleUpload} variant="smallOutline" >Upload</Button>}
            {uploadStatus.noChange ? <Badge sx={{ mx: '2' }}>Data is up to date</Badge> : ''}
            {uploadStatus.overriding ? <Badge sx={{ mx: '2', bg: 'yellow', color: 'black' }}>Updated</Badge> : ''}
            {uploadStatus.uploading ? <Badge sx={{ mx: '2', bg: 'yellow', color: 'black' }}>Uploaded</Badge> : ''}
        </Card>
    )
}