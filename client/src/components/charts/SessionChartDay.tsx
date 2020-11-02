import React,{useState,useEffect} from 'react';
import{ httpClient } from '../../utils/asyncUtils'
// import { Event } from '../../models'
import {ResponsiveContainer ,LineChart,CartesianGrid ,XAxis ,YAxis ,Tooltip ,Legend ,Line } from 'recharts'
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
}));
   
  const SessionDays: React.FC<any>= () => {
   const [data,setData] = useState<any[]>([])

   const classes = useStyles();

   const fetchData =  async (offset:number)=> {
    const { data } = await httpClient.get(`http://localhost:3001/events/by-days/${offset}`)
    setData(data)
   }

    useEffect(() => {fetchData(0)},[])
  
    return (<div>
       <TextField
        id="date"
        label="Birthday"
        type="date"
        defaultValue="2017-05-24"
        className={classes.textField}
        InputLabelProps={{
          shrink: true,
        }}
      />
   <ResponsiveContainer width={600} height={200}>
       <LineChart data={data} 
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="count" stroke="#82ca9d" />
            </LineChart>
    </ResponsiveContainer>
    </div>
    )
  }

export default SessionDays
