import React,{useState,useEffect} from 'react';
import { GoogleMap , LoadScript,Marker,MarkerClusterer  } from '@react-google-maps/api';
import{ httpClient } from '../../utils/asyncUtils'
import { Event } from '../../models'

const containerStyle = {
    width: '200px',
    height: '200px'
  };
   
  const center = {
    lat: 0,
    lng: 0
  };
   
  const MyGoogleMap: React.FC<any>= () => {
   const [data,setData] = useState<Event[]>()

   const fetchMarkers =  async ()=> {
    const { data } = await httpClient.get('http://localhost:3001/events/all')
    setData(data)
   }

    useEffect(() => {fetchMarkers()},[])
  
    return (
      <LoadScript
        googleMapsApiKey={'AIzaSyBOOqt0AlPNqAxNg88Xy3v9_fYvKg-ejiQ'}
      >
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={1}
        >
          <MarkerClusterer>
              {(clusterer)=> 
              data? data!.map((marker)=>{
             return <Marker key={marker._id} position={marker.geolocation.location} clusterer={clusterer}/> 
          }):null}
          </MarkerClusterer>
        </GoogleMap>
      </LoadScript>
    )
  }

export default MyGoogleMap
