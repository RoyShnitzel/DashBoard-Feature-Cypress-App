import React,{useState,useEffect} from 'react';
import{ httpClient } from '../../utils/asyncUtils'
// import { Event } from '../../models'
import {ResponsiveContainer ,LineChart,CartesianGrid ,XAxis ,YAxis ,Tooltip ,Line } from 'recharts'
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';


const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'wrap',
    alignItems: "center",
    width: '60%'
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

   const changeOffset = (e: React.ChangeEvent<HTMLInputElement| HTMLTextAreaElement>) => {
    console.log(e.currentTarget.value)
    const pickedDate = new Date(e.currentTarget.value).valueOf()
    const today =  Date.now().valueOf()
    const numDays = Math.round((today - pickedDate)/(24*60*60*1000))
    if(numDays < 0) {
        e.currentTarget.value= ''
        return alert('Date Not Valid!')
    }
    fetchData(numDays)
   }

    useEffect(() => {fetchData(0)},[])
  
    return (
    <div className={classes.container}>
       <TextField
        id="date"
        label="Pick Offset Day"
        type="date"
        defaultValue=''
        className={classes.textField}
        InputLabelProps={{
          shrink: true,
        }}
        onChange={(e)=>changeOffset(e)}
      />
   <ResponsiveContainer width={'100%'} height={200}>
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
