import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm';
import { Card, Divider, Label, Container, Textarea, Select } from "theme-ui"


export default function MDView() {
    const { spreadsheetId } = useParams();
    const tableData = useSelector((tableData) => tableData.tableData.links);
    const filtered = tableData.filter(item => {
        if (item.spreadsheetId == spreadsheetId)
            return item
    })
    const [monthsArr, setMonthsArr] = useState(filtered[0]);
    const [md, setMd] = useState('')

    useEffect(() => {


    }, [md])

    let keys = []
    if (monthsArr !== undefined) {
        let months = monthsArr.mdTextByMonth;
        for (const month of months) {
            let key = Object.keys(month)
            keys = [...keys, ...key]
        }
    }



    const [selectedMonth, setSelectedMonth] = useState(keys[0]);

    const handleSelect = (value) => {
        setSelectedMonth(value)
        getMonth(value)

    }


    const getMonth = (selectedMonth) => {
        let mdFormat = ' '
        let md = monthsArr.mdTextByMonth.filter(month => {
            return Object.entries(month)[0][0] === selectedMonth
        })
        mdFormat = md[0][selectedMonth];
        setMd(mdFormat);
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
            <Card sx={{ mx: 'auto', mb: 4, my: 2 }}>
                <Label>MarkDown View for {selectedMonth}</Label>
                <Divider />
                <ReactMarkdown children={md} remarkPlugins={[remarkGfm]} />
            </Card>
            <Card sx={{ mx: 'auto' }}>
                <Label>MarkDown Raw Text for {selectedMonth}</Label>
                <Divider />
                <Textarea rows={16} defaultValue={md} />
            </Card>
        </Container>
    )
}