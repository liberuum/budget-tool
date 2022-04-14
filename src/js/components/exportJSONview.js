import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Card, Label, Container, Textarea, Select, Button } from "theme-ui"

export default function JSONView() {
    const { spreadsheetId } = useParams();

    const tableData = useSelector((tableData) => tableData.tableData.links);
    const filtered = tableData.filter(item => {
        if (item.spreadsheetId == spreadsheetId)
            return item
    })

    const [monthsArr, setMonthsArr] = useState(filtered[0]);
    const [jsonData, setJsonData] = useState('')


    useEffect(() => {
        getMonth(selectedMonth)

    }, [getMonth, jsonData])

    let keys = []
    if (monthsArr !== undefined) {
        let months = monthsArr.mdTextByMonth;
        for (const month of months) {
            let key = Object.keys(month)
            keys = [...keys, ...key]
        }
    }

    console.log('keys', keys)


    const [selectedMonth, setSelectedMonth] = useState(keys[0]);

    const handleSelect = (value) => {
        setSelectedMonth(value)
        getMonth(value)

    }

    const getMonth = (selectedMonth) => {
        if (selectedMonth !== undefined) {
            let json = monthsArr.actualsByMonth[selectedMonth]
            setJsonData(json)
        }
    }

    const inputData = {
        month: "",
        position: "",
        group: "", // permanent team, grouping by teams. 
        budgetCategory: "",
        forecast: "",
        actual: "",
        comments: ""
    }

    const handleUpload = () => {
        console.log('keys', keys)
        const data = [];

        for (let key of keys) {
            let rowObj = {}
            for (let category of monthsArr.actualsByMonth[key]) {
                // console.log('category', category)
                let rawCategories = Object.keys(category);
                let budgetCategories = rawCategories.filter(category => {
                    if (category !== "type" && category !== 'total' && category !== 'payment topup') {
                        return category
                    }
                })

                if (category.type === 'forecast' || category.type === 'actual') {
                    for (let expenseTag of budgetCategories) {
                        if (category.type === 'forecast') {
                            rowObj.month = key;
                            rowObj.budgetCategory = expenseTag;
                            rowObj.forecast = category[expenseTag]
                        } else if (category.type === 'actual') {
                            rowObj.actual = category[expenseTag]
                        }
                    }


                }

                // data.push(rowObj)
                // rowObj = {}
            }
        }
        // console.log('data', data)
    }


    const prepJson = () => {
        let json = ""
        if (jsonData !== '') {
            let arr = jsonData
            let newArr = [];
            for (const obj of arr) {
                let newObj = {}
                for (const key in obj) {
                    if (typeof obj[key] === 'number') {
                        newObj[key] = obj[key].toString()
                    } else {
                        newObj[key] = obj[key];
                    }
                }
                newArr.push(newObj);
                newObj = {};
            }

            let outputObj = { actuals: newArr };
            json = JSON.stringify(outputObj, null, 2);
        } else {
            json = ''
        }
        return json
    }

    let result = prepJson()

    return (
        <Container >
            <Card sx={{ mx: 'auto', mb: 4, my: 2 }}>
                <Label>Choose Month</Label>
                <Select onChange={e => handleSelect(e.target.value)} defaultValue={`${keys[0]}`}>
                    {keys.map(month => {
                        return <option key={month}>{`${month}`}</option>
                    })}
                </Select>
            </Card>
            <Card>
                <Label>Upload budget forecast and actuals to ecosystem dashboard</Label>
                <Button onClick={handleUpload} variant="smallOutline" >Upload</Button>
            </Card>
            <Card sx={{ mx: 'auto', mb: 4, my: 2 }}>
                <Label>JSON View</Label>
                <Textarea rows={20} defaultValue={result} />
            </Card>
        </Container>
    )
}