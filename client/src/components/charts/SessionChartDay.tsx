import React, { useState, useEffect } from "react";
import { httpClient } from '../../utils/asyncUtils';
import { ResponsiveContainer,Tooltip, LineChart, Line, CartesianGrid, XAxis, YAxis, } from "recharts";
import { makeStyles } from "@material-ui/core/styles";
import TextField from '@material-ui/core/TextField';

export const OneHour: number = 1000 * 60 * 60;
export const OneDay: number = OneHour * 24
export const OneWeek: number = OneDay * 7

const useStyles = makeStyles((theme) => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: "center",
        border: '1px solid black',
        width: '60%'
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 200,
    },
}));


const SessionsDays: React.FC<any> = () => {
    const classes = useStyles();
    const [chartsData, setChartsData] = useState<{ hour: number, count: number }[]>([]);
    const [chartsData1, setChartsData1] = useState<{ hour: number, count: number }[]>([]);
    const [selected, setSelected] = useState<number>(0);
    const [selected1, setSelected1] = useState<number>(1);

    const fetchChartsData = async () => {
        const { data: events } = await httpClient.get(`http://localhost:3001/events/by-hours/${selected}`)
        setChartsData(events)
        console.log(events);
        const { data: events1 } = await httpClient.get(`http://localhost:3001/events/by-hours/${selected1}`)
        setChartsData1(events1)
        console.log(events1);
    }

    useEffect(() => { fetchChartsData() }, [selected, selected1])

    const changeDate = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const picked = Math.round((Date.now().valueOf() - new Date(e.target.value).valueOf()) / OneDay)
        if (picked < 1) {
            alert('Invalid Date')
            setSelected(0)
            e.target.value = new Date(Date.now()).toDateString()
        } else {
            setSelected(picked)
        }
    }
    const changeDate1 = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const picked = Math.round((Date.now().valueOf() - new Date(e.target.value).valueOf()) / OneDay)
        if (picked < 1) {
            alert('Invalid Date')
            setSelected1(0)
            e.target.value = new Date(Date.now()).toDateString()
        } else {
            setSelected1(picked)
        }
    }

    const dataForChart = chartsData1.length > 2 ? chartsData.map((day: { hour: number, count: number }, i: number) => {
        return {
            hour: day.hour,
            count: day.count,
            count1: chartsData1[i].count
        }
    }) : []


    return (<>
        <div className={classes.container} >
            <TextField
                id="date"
                label="Main"
                type="date"
                defaultValue=''
                className={classes.textField}
                InputLabelProps={{
                    shrink: true,
                }}
                onChange={changeDate}
            />
            <TextField
                id="date"
                label="Secondary"
                type="date"
                defaultValue=''
                className={classes.textField}
                InputLabelProps={{
                    shrink: true,
                }}
                onChange={changeDate1}
            />
            <ResponsiveContainer height={250}>
            <LineChart
                data={dataForChart}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey='count1' stroke="#000000" />
                <Line type="monotone" dataKey='count' stroke="#82ca9d" />
            </LineChart>
            </ResponsiveContainer>
        </div>
    </>
    );
};

export default SessionsDays;