///<reference path="types.ts" />

import express from "express";
import { Request, Response } from "express";
import {OneHour, OneDay, OneWeek} from './timeFrames'

// some useful database functions in here:
import {
} from "./database";
import { Event, weeklyRetentionObject } from "../../client/src/models/event";
import { ensureAuthenticated, validateMiddleware } from "./helpers";
import { createNewEvent,getAllEvents} from "./database"

import {
  shortIdValidation,
  searchValidation,
  userFieldsValidator,
  isUserValidator,
} from "./validators";
import console from "console";
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
  interface Filter {
    sorting: string; // '+date'/'-date'
    type: string; 
    browser: string;
    search: string;
    offset: number;
  }
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
  const events: Event[] = getAllEvents()
  res.status(200).send('')
});

router.get('/by-hours/:offset', (req: Request, res: Response) => {
  const {offset} = req.params
  const events: Event[] = getAllEvents()

  res.send('')
});

router.get('/today', (req: Request, res: Response) => {
  res.send('/today')
});

router.get('/week', (req: Request, res: Response) => {
  res.send('/week')
});

router.get('/retention', (req: Request, res: Response) => {
  const {dayZero} = req.query
  res.send('/retention')
});
router.get('/:eventId',(req : Request, res : Response) => {
  res.send('/:eventId')
});

router.post('/', (req: Request, res: Response) => {
  const newEvent: Event = req.body
  console.log(newEvent)
  const event = createNewEvent(newEvent)
  res.send(event)
});

router.get('/chart/os/:time',(req: Request, res: Response) => {
  res.send('/chart/os/:time')
})

  
router.get('/chart/pageview/:time',(req: Request, res: Response) => {
  res.send('/chart/pageview/:time')
})

router.get('/chart/timeonurl/:time',(req: Request, res: Response) => {
  res.send('/chart/timeonurl/:time')
})

router.get('/chart/geolocation/:time',(req: Request, res: Response) => {
  res.send('/chart/geolocation/:time')
})


export default router;
