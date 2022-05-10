import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Card, Label, Container, Textarea, Select, Button } from "theme-ui"
import UploadToDB from './uploadToDB.js';

export default function ApiView() {
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
    
    //Getting available actual months
    let keys = []
    let leveledMonthsByCategory;
    if (monthsArr !== undefined) {
        let months = monthsArr.mdTextByMonth;
        leveledMonthsByCategory = monthsArr.leveledMonthsByCategory;
        for (const month of months) {
            let key = Object.keys(month)
            keys = [...keys, ...key]
        }
    }
    
    // console.log('leveledMonthsByCategory', leveledMonthsByCategory)

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
            <UploadToDB props={{selectedMonth, keys, leveledMonthsByCategory }} />
        </Container>
    )
}