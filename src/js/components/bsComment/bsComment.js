import React, { useState, useEffect } from 'react';
import { Card, Textarea, Label, Input, Grid, Text, Button, Spinner, Box } from "theme-ui";
import { useSnackbar } from 'notistack';
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm';

export default function BudgetStatementComment({ budgetStatementId }) {

    const [inputText, setInputText] = useState('');
    const [comments, setComments] = useState([])
    const [preview, setPreview] = useState(false)

    const { enqueueSnackbar } = useSnackbar()
    useEffect(() => {
        if (budgetStatementId !== undefined) {
            console.log(budgetStatementId)
        }
    })


    const handleSubmit = () => {
        setComments(prev => [...prev, inputText])
        setInputText('')
        setPreview(false)
    }

    const handlePreview = () => {
        setPreview(!preview)
    }

    return (
        <>{comments.length < 1 ?
            <Card sx={{ mt: '10px', textAlign: 'center' }}>
                <Text>No comments added yet, be the first below!</Text>
            </Card>
            :
            <Card sx={{ height: '150px', mt: '10px', overflowY: 'scroll', scrollBehaviour: "smooth" }} >
                {comments.map((comment, key) => {
                    return (
                        <Box key={key} sx={{ borderBottom: '1px solid grey', fontSize: '15px' }}>
                            <Text sx={{ fontWeight: 'bold' }}>Author name wrote on date</Text>
                            <ReactMarkdown children={comment} remarkPlugins={[remarkGfm]} />
                        </Box>
                    )
                })
                }
            </Card>
        }
            <Card sx={{ mt: '5px' }}>
                {preview ?
                    <div style={{ fontSize: '15px', border: '1px solid #DCDCDC', paddingLeft: '4px' }}>
                        <ReactMarkdown children={inputText} remarkPlugins={[remarkGfm]} />
                    </div>
                    :
                    <Textarea rows={4}
                        value={inputText}
                        onChange={e => setInputText(e.target.value)}
                    />
                }
                <Grid
                    columns={2}
                    sx={{ mt: '5px' }}
                >
                    {inputText !== '' ?
                        <Button
                            sx={{ width: '100px' }}
                            variant="smallOutline"
                            onClick={handlePreview}
                        >Preview</Button>
                        : <div></div>
                    }
                    <Button
                        variant="smallOutline"
                        onClick={handleSubmit}
                    >Submit</Button>
                </Grid>
            </Card>
        </>
    )
}