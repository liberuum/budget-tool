import React, { useState, useEffect } from 'react';
import { Card, Label, Badge, Textarea, Select, Button, Spinner } from "theme-ui"
import { useQuery, gql, useMutation } from "@apollo/client";
import { getCoreUnit, getBudgetSatementInfo, deleteBudgetLineItems } from '../api/graphql';
import { validateMonthsInApi } from './utils/validateMonths';
import { validateLineItems, getCanonicalCategory } from './utils/validateLineItems'
import { useSelector } from 'react-redux';
import AlertHoC from './utils/AlertHoC';

/**
 *  Set DEBUG_UPLOAD = false to suppress debug output.
 */
const DEBUG_UPLOAD = true;

export default function UploadToDB(props) {
    const userFromStore = useSelector(store => store.user)
    const { walletName, walletAddress, actualsByMonth, selectedMonth, leveledMonthsByCategory } = props.props;
    const [itemsToOverride, setItemsToOverride] = useState([])
    const [itemsToUpload, setItemsToUpload] = useState([])
    const [uploadStatus, setUploadStatus] = useState({ updatingDb: false, noChange: false, overriding: false, uploading: false })


    const [lineItems, setLineItems] = useState([])
    const [coreUnit, setCoreUnit] = useState();
    const [apiBudgetStatements, setApiBudgetStatements] = useState();
    const [walletIds, setWalletIds] = useState()

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
        fetchPolicy: 'no-cache',
        context: {
            headers: {
                authorization: `Bearer ${userFromStore.authToken}`
            }
        }
    });

    const fetchCoreUnit = async () => {
        const rawCoreUnit = await getCoreUnit(userFromStore.cuId)
        setCoreUnit(rawCoreUnit.data.coreUnit[0])
        const rawBudgetStatements = await getBudgetSatementInfo(rawCoreUnit.data.coreUnit[0].id)
        const budgetStatements = rawBudgetStatements.data.budgetStatement;
        setApiBudgetStatements(budgetStatements)
        const idsWallets = await validateMonthsInApi(budgetStatements, getAllMonths(), rawCoreUnit.data.coreUnit[0], walletAddress, walletName, lineItems, userFromStore.authToken);
        setWalletIds(idsWallets);
    }


    function getAllMonths() {
        if (leveledMonthsByCategory !== undefined) {
            let months = {};

            for (let category in leveledMonthsByCategory) {
                for (let group in leveledMonthsByCategory[category]) {
                    for (let month in leveledMonthsByCategory[category][group]) {
                        months[month] = true;
                    }
                }
            }
            return Object.keys(months)
        }
    }

    const parseDataForApi = () => {
        lineItems.splice(0, lineItems.length)
        const months = getAllMonths();
        if (months !== undefined) {
            for (let category in leveledMonthsByCategory) {
                let canonicalObj = getCanonicalCategory(category);
                for (let group in leveledMonthsByCategory[category]) {
                    for (let month of months) {
                        lineItems.push(createRowObject(month, category, canonicalObj, group, leveledMonthsByCategory))
                    }
                }
            }
        }
        if (DEBUG_UPLOAD) console.log('[DEBUG_UPLOAD] lineItems', lineItems);
    }

    const createRowObject = (month, category, canonicalObj, group, lookup) => {
        const rowObject = {
            budgetStatementWalletId: null,
            month: "",
            position: 0,
            group: '',
            budgetCategory: '',
            forecast: 0,
            actual: 0,
            comments: '',
            canonicalBudgetCategory: '',
            headcountExpense: '',
            budgetCap: 0,
            payment: 0
        };
        rowObject.month = month;
        rowObject.position = canonicalObj ? canonicalObj.position : 0;
        rowObject.group = group === 'undefined' ? '' : group;
        rowObject.budgetCategory = category;
        rowObject.forecast = roundNumber(lookup[category][group][month].forecast);
        rowObject.actual = roundNumber(lookup[category][group][month].actual);
        rowObject.comments = '';
        rowObject.canonicalBudgetCategory = canonicalObj ? canonicalObj.canonicalCategory : null;
        rowObject.headcountExpense = canonicalObj ? canonicalObj.headCountExpense : null;
        rowObject.budgetCap = roundNumber(lookup[category][group][month].budget);
        rowObject.payment = roundNumber(lookup[category][group][month].paid);
        return rowObject;
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
        // fetching walletIf of selected month so it can be applied to all lineItems 
        // under selectedMonth
        const walletId = walletIds.filter(wallet => {
            return wallet.month === selectedMonth.concat('-01')
        })
        if (DEBUG_UPLOAD) console.log('[DEBUG_UPLOAD] walletId', walletId)
        const months = getNextThreeMonths(selectedMonth);
        if (months !== undefined) {
            let filtered = [];
            for (let i = 0; i < months.length; i++) {
                let selectedLineItems = lineItems.filter(item => {
                    if (item.month === months[i].concat('-01')) {
                        item.budgetStatementWalletId = walletId[0].walletId
                        return item;
                    }
                })
                filtered.push(...selectedLineItems);
                selectedLineItems = null
            }

            if (DEBUG_UPLOAD) console.log('[DEBUG_UPLOAD] filtered months to upload', filtered)
            return filtered;
        }

    }

    const handleMonthChange = async () => {

        if (DEBUG_UPLOAD) console.log('[DEBUG_UPLOAD] month has changed', selectedMonth)
        setUploadStatus({ ...uploadStatus, updatingDb: false, noChange: false, overriding: false, uploading: false })

    }


    const handleUpload = async () => {
        try {
            setUploadStatus({ ...uploadStatus, updatingDb: true })

            let data = filterFromLineItems(selectedMonth)
            const { lineItemsToDelete, lineItemsToUpload } = await validateLineItems(data);
            if (DEBUG_UPLOAD) console.log('[DEBUG_UPLOAD] data to delete', lineItemsToDelete)
            if (DEBUG_UPLOAD) console.log('[DEBUG_UPLOAD] data to upload:', lineItemsToUpload)

            if (lineItemsToDelete.length > 0 && lineItemsToUpload.length > 0) {
                if (DEBUG_UPLOAD) console.log('[DEBUG_UPLOAD] deleting and updating lineItems')
                await deleteBudgetLineItems(lineItemsToDelete, userFromStore.authToken)
                await budgetLineItemsBatchAdd({ variables: { input: lineItemsToUpload } });
                setUploadStatus({ ...uploadStatus, updatingDb: false, overriding: true })
            }
            if (lineItemsToDelete.length === 0 && lineItemsToUpload.length > 0) {
                if (DEBUG_UPLOAD) console.log('[DEBUG_UPLOAD] adding new lineItems')
                await budgetLineItemsBatchAdd({ variables: { input: lineItemsToUpload } });
                setUploadStatus({ ...uploadStatus, updatingDb: false, uploading: true })
            }
        } catch (error) {
            setUploadStatus({ ...uploadStatus, updatingDb: false })
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
            {error ? <AlertHoC props={error.message} /> : ''}
        </Card>
    )
}