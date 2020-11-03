///<reference path="types.ts" />

import express from "express";
import { Request, Response } from "express";
import {OneHour, OneDay, OneWeek} from './timeFrames'
import moment from "moment";
// some useful database functions in here:
import {
} from "./database";
import { Event, weeklyRetentionObject } from "../../client/src/models/event";
import { ensureAuthenticated, validateMiddleware } from "./helpers";
import { createNewEvent,getAllEvents} from "./database"
import axios from "axios";

import {
  shortIdValidation,
  searchValidation,
  userFieldsValidator,
  isUserValidator,
} from "./validators";

const router = express.Router();

// Routes

interface Filter {
  sorting: string;
  type: string;
  browser: string;
  search: string;
  offset: number;
}

router.get('/all', (req: Request, res: Response) => {
  const events: Event[] = getAllEvents()
  res.status(200).send(events)
    
});

router.get('/all-filtered', (req: Request, res: Response) => {
  const filters: Filter = req.query;
  const events: Event[] = getAllEvents()
  let filteredEvents = filters.type ? events.filter(x=> x.name === filters.type) : events
  filteredEvents = filters.browser ? filteredEvents.filter(x=> x.browser === filters.browser) : filteredEvents
  filteredEvents = filters.search ? filteredEvents.filter(x=> Object.values(x).some(y=>y.toString().includes(filters.search))) : filteredEvents
  filteredEvents = filters.sorting ? filteredEvents.sort((x,y)=>{
    if(filters.sorting === '-date'){
      return y.date - x.date
    }else {
      return x.date - y.date
    }}) : filteredEvents
  const endArr = filters.offset ? filters.offset < filteredEvents.length ?
   {events: [...filteredEvents.slice(0,filters.offset)],more: true}
  :{events: [...filteredEvents.slice(0,filters.offset)],more: false}
  :{events: [...filteredEvents],more: false}
  res.send(endArr)
});

router.get('/by-days/:offset', (req: Request, res: Response) => {
  const {offset} = req.params
  console.log(offset)
  const events: Event[] = getAllEvents()
  const today = new Date (new Date().toDateString()).valueOf()-(+offset-1)*OneDay;
  const day: number = new Date(today).getDate();
  const month: number = new Date(today).getMonth() + 1;
  const newYear: number = new Date(today).getFullYear();
  const formattedDate = new Date(`${newYear}/${month}/${day}`).valueOf();
  const wantedWeek = formattedDate-7*OneDay
  let year: number = 0
  let filteredEvents = events.filter(x=>{
    return moment(new Date(x.date)).isBefore(new Date(today))&&moment(new Date(x.date)).isAfter(new Date(wantedWeek))
  }).sort((a,b)=> +moment(a.date).format('YYYYMMDD') - +moment(b.date).format('YYYYMMDD'))
  let newFilteredEvents = filteredEvents.map((x)=>{
    const day = moment(new Date(x.date)).date()
    const month = moment(new Date(x.date)).month()
    year = moment(new Date(x.date)).year()
    return [x, day, month, year]
  })
  let newDays: any[] =[];
  let newMonths: any[] =[];
  newFilteredEvents.forEach(x=>{
    if(newDays.includes(x[1])){
      return
    }else {
      newDays.push(x[1])
      newMonths.push(x[2])
    }
  })
  const endFilter = newDays.map((x,i)=>{
    const day = x>9? x:`0${x}`
    const month = newMonths[i]+1>9? newMonths[i]+1:`0${newMonths[i]+1}`
    const newObj ={date: `${day}/${month}/${year}`, count:0}
    newFilteredEvents.map(y=>{
      if(y[1] === x) {
        newObj.count++
      }
    })
    return newObj
  })
  res.send(endFilter)
});

router.get('/by-hours/:offset', (req: Request, res: Response) => {
  const {offset} = req.params
  const events: Event[] = getAllEvents();
  const today = new Date (new Date().toDateString()).getTime()+6*OneHour;
  const wantedDay = today - (+offset * OneDay)
  let filteredEvents = events.filter(x=>{
    return moment(new Date(x.date)).isSame(new Date(wantedDay),'day')
  })
  let newFilteredEvents = filteredEvents.map((x)=>{
    const hour = moment(new Date(x.date)).hour()
    return [x, hour]
  })
  let newFormat: any[] =[];
  newFilteredEvents.forEach(x=>{
    if(newFormat.includes(x[1])){
      return
    }else {
      newFormat.push(x[1])
    }
  })
  newFormat.sort((x,y)=> x-y)
  const hourArr: any[] = []
  for (let i = 0; i < 24; i++) {
    hourArr.push({hour:`${i>9? i:`0${i}`}:00`, count:0})
  }
  const endFilter = newFormat.map(x=>{
    const newObj ={hour: `${x>9? x:`0${x}`}:00`, count:0}
    newFilteredEvents.forEach(y=>{
      if(y[1] === x) {
        newObj.count++
      }
    })
    return newObj
  })
  endFilter.forEach(z=>{
    hourArr.forEach(w=>{
      if(w.hour === z.hour){
        w.count = z.count
      }
    })
  })
  res.send(hourArr)
});

router.get('/today', (req: Request, res: Response) => {
  res.send('/today')
});

router.get('/week', (req: Request, res: Response) => {
  res.send('/week')
});

router.get('/retention', async (req: Request, res: Response) => {
  const {dayZero} = req.query
  const formatDayZero = new Date (new Date(+dayZero).toDateString()).getTime()
  const today = new Date (new Date().toDateString()).getTime()
  const weekNum = (today-dayZero)/OneWeek
  const events: Event[] = getAllEvents()
  const endArr: object[] = []
  for(let i = 0;i< weekNum+1;i++) {
    let y=(i+1)
    const filterByDate = events.filter(x=>{
      return moment(new Date(x.date)).isBefore(new Date(+formatDayZero+(y*OneWeek)))&&moment(new Date(x.date)).isAfter(new Date(+formatDayZero+(i*OneWeek)))
    })
    const signUpByTime = filterByDate.filter(x=> x.name === 'signup')
    const endDate = moment(new Date(+formatDayZero+(y*OneWeek))).toObject()
    const startDay = moment(new Date(+formatDayZero+(i*OneWeek))).toObject()
    const weeklyRetention: number[] = []
    const users: string[] = signUpByTime.map(x=>x.distinct_user_id).filter((id, i, arr)=> {
      return arr.indexOf(id) == i;
  })
    const startEvents = users.length
    for (let z = 0+i; z < weekNum+1; z++) {
      let w=(z+1)
      const newFilterByDate = events.filter(x=>{
        return moment(new Date(x.date)).isBefore(new Date(+formatDayZero+(w*OneWeek)))&&moment(new Date(x.date)).isAfter(new Date(+formatDayZero+(z*OneWeek)))
      })
      const loginByTime = newFilterByDate.filter(x=> x.name === 'login')
      const newUsers: string[] = loginByTime.filter(x=>users.includes(x.distinct_user_id)).map(x=>x.distinct_user_id).filter((id, i, arr)=> {
        return arr.indexOf(id) == i;
    })
      const percentage: number = Math.round((newUsers.length/startEvents)*100)
      if(z === 0+i){
        weeklyRetention.push(100)
      } else{
      weeklyRetention.push(percentage)
      }
    }
    endArr.push(
      {
        registrationWeek: i,
        newUsers:signUpByTime.length,
        weeklyRetention:weeklyRetention,
        start:`${startDay.date>9?startDay.date:`0${startDay.date}`}/${startDay.months>9?startDay.months:`0${startDay.months}`}/${startDay.years}`,
        end:`${endDate.date>9?endDate.date:`0${endDate.date}`}/${endDate.months>9?endDate.months:`0${endDate.months}`}/${endDate.years}`
      })
  }
  res.send(endArr)
});

router.get('/:eventId',(req : Request, res : Response) => {
  res.send('/:eventId')
});

router.post('/', (req: Request, res: Response) => {
  const newEvent: Event = req.body
  const event = createNewEvent(newEvent)
  res.send(event)
});

router.get('/chart/os/:time',(req: Request, res: Response) => {
  res.send('/chart/os/:time')
})

  
router.get('/chart/pageview',(req: Request, res: Response) => {
  const events: Event[] = getAllEvents()
  const pages: string[] = events.map(x=>x.url).filter((id, i, arr)=> {
    return arr.indexOf(id) == i;
})
const pageViews = pages.map(page=>{
  let views = 0
  events.forEach(event=>{
    if(event.url === page){
      views++
    }
  })
  return{name: page.replace('http://localhost3000/',''),views:views}
})
  res.send(pageViews)
})

router.get('/chart/timeonurl/:time',(req: Request, res: Response) => {
  res.send('/chart/timeonurl/:time')
})

router.get('/chart/geolocation/:time',(req: Request, res: Response) => {
  res.send('/chart/geolocation/:time')
})


export default router;
