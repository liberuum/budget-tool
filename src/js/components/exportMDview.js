import React from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm';
import { Card, Divider, Label, Container, Textarea } from "theme-ui"


export default function MDView() {
    const { spreadsheetId } = useParams();
    const tableData = useSelector((tableData) => tableData.tableData.links);
    const filtered = tableData.filter(item => {
        if (item.spreadsheetId == spreadsheetId)
            return item
    })

    let md;
    if(filtered.length !== 0) {
        md = filtered[0].mdText;
    } else {
        md = ''
    }
    
    return (
        <Container >
            <Card sx={{ mx: 'auto', mb: 4, my: 2 }}>
                <Label>MarkDown View</Label>
                <Divider />
                <ReactMarkdown children={md} remarkPlugins={[remarkGfm]} />
            </Card>
            <Card sx={{ mx: 'auto' }}>
                <Label>MarkDown Raw Text</Label>
                <Divider />
                <Textarea rows={16} defaultValue={md} />
            </Card>
        </Container>
    )
}