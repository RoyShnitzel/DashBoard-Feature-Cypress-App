import React,{useState,useEffect} from 'react';
import {ResponsiveContainer ,BarChart,CartesianGrid ,XAxis ,YAxis ,Tooltip ,Bar } from 'recharts'
import{ httpClient } from '../../utils/asyncUtils'


const ViewsPerPage: React.FC = () => {
    const [data,setData] = useState<any[]>([])

    const fetchData =  async ()=> {
     const { data } = await httpClient.get(`http://localhost:3001/events/chart/pageview`)
     console.log(data)
     setData(data)
    }
 
    useEffect(() => {fetchData()},[])

  return (
      <div style={{border: '1px solid black',width: '40%'}}>
    <ResponsiveContainer width={'100%'} height={250}>
        <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="views" fill="#8884d8" />
        </BarChart>
    </ResponsiveContainer>
    </div>
  );
};

export default ViewsPerPage;
