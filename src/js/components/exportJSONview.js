import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getLinkData } from '../actions/tableData';

export default function JSONView() {
    const { spreadSheetId } = useParams();
    console.log('data in jsonview', spreadSheetId)

    const dispatch = useDispatch();
    dispatch(getLinkData(spreadSheetId));
    const tableData = useSelector((tableData) => tableData.tableData.links);
    console.log('linkData in JSONView', tableData)
    // useEffect(async () => {
    //     dispatch(getLinkData(spreadSheetId));
    // })

    return (
        <h1>JSON View</h1>
    )
}