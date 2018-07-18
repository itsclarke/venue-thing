import React, { Component } from 'react'
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from 'react-google-maps'
import axios from 'axios'

const _CLIENTID = 'ZBROKXLXL5T5ZPA420JYZOSBWVAJ1MN3TU20MABZRRJL452Z'
const _CLIENTSECRET = 'OPKNNENJICEGOQ4AZYBDXNHVCKMKF1XSJTBJZA1HHQEQHUI1'

const MyMapComponent = withScriptjs(withGoogleMap((props) =>
  <GoogleMap
    defaultZoom={14}
    defaultCenter={{ lat: 40.0242303, lng: -105.2835281 }}
  >
    <Marker position={{ lat: 40.0242303, lng: -105.2835281 }} />
  </GoogleMap>
))

class App extends Component {
  
  constructor(props) {
    super(props)
    this.state = {
      location: {
        latitude: 41.8333925,
        longitude: -88.0121478
      },
      spots: []
    }
    this.getLocation = this.getLocation.bind(this)
  }

  getLocation = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(this.showPosition)
    }
  }

  mapSpots = objects => {
    let spots = objects.map(spot => {
      let s = {
        latitude: spot.location.lat,
        longitude: spot.location.lng,
        name: spot.name,
        phone: spot.contact.phone
      }
      return s
    })

    Promise.all([spots])
      .then(() => {
        this.setState({ spots })
      })
  }

  showPosition = (position) => {
    this.setState({
      location: {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      }
    })
  }

  fetchVenues = () => {
    axios.get(`https://api.foursquare.com/v2/venues/search?ll=${this.state.location.latitude},${this.state.location.longitude}&oauth_token=F2524MEQ2FPET2YBPPQORESOVJCHORZHSC1FWGY34V12Z4JH&v=20180711`)
    .then(response => {
      let spots = response.data.response.venues
      return spots
    })
    .then(spots => {
      return this.mapSpots(spots)
    })
  }

  componentDidMount() {
    this.getLocation()
    this.fetchVenues()
  }
  
  render() {
    return (
      <div>
        <h1><pre>{this.state.location.latitude}, {this.state.location.longitude}</pre></h1>
        <MyMapComponent
          isMarkerShown
          googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyC4R6AN7SmujjPUIGKdyao2Kqitzr1kiRg&v=3.exp&libraries=geometry,drawing,places"
          loadingElement={<div style={{ height: `100%` }} />}
          containerElement={<div style={{ height: `100%` }} />}
          mapElement={<div style={{ minHeight: `100vh` }} />}
        />
      </div>
    )
  }
}

export default App
