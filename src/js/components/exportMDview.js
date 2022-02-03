import React, {useEffect} from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getLinkData } from '../actions/tableData';

export default function MDView() {
    const { spreadSheetId } = useParams();
    console.log('data in mdView', spreadSheetId)

    const dispatch = useDispatch();
    const tableData = useSelector((tableData) => tableData.tableData.links);
    console.log('linkData in MDView', tableData)
    dispatch(getLinkData(spreadSheetId));

    // useEffect(async () => {
    // })
    return (
        <h1>MD View</h1>
    )
}