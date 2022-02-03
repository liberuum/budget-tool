import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Card, Label, Container, Textarea } from "theme-ui"

export default function JSONView() {
    const { spreadsheetId } = useParams();
    
    const tableData = useSelector((tableData) => tableData.tableData.links);
    const filtered = tableData.filter(item => {
        if (item.spreadsheetId == spreadsheetId)
        return item
    })
    

    const prepJson = () => {
        let json = ""
        if (filtered.length !== 0) {
            let arr = filtered[0].actuals;
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
            json = JSON.stringify(outputObj);
        } else {
            json = ''
        }
        return json;
    }

    let result = prepJson()

    return (
        <Container >
            <Card sx={{ mx: 'auto', mb: 4, my: 2 }}>
                <Label>JSON View</Label>
                <Textarea rows={20} defaultValue={result}/>
            </Card>
        </Container>
    )
}