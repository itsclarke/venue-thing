import React, { Component } from 'react'
import axios from 'axios'

const SpotList = spots => {
  const listItems = Object.values(spots.spots).map((spot, index) => {
    return (
      <li key={index}>{spot.name}</li>
    )
  })

  return (
    <ul>
      {listItems}
    </ul>
  )
}

class App extends Component {
  
  constructor(props) {
    super(props)
    this.state = {
      location: {
        latitude: 41.8333925,
        longitude: -88.0121478
      },
      spots: [],
      mapping: false
    }
    this.getLocation = this.getLocation.bind(this)
  }

  getLocation = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(this.showPosition)
    }
  }

  mapSpots = objects => {
    this.setState({ mapping: true })
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
        this.setState({ spots, mapping: false })
      })
  }

  showPosition = position => {
    let newLocation = this.setState({
      location: {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      }
    })
    Promise.all([newLocation])
      .then(() => {
        this.fetchVenues()
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
        {(this.state.spots != null) ? <SpotList spots={this.state.spots} /> : <h3>Nothing here</h3>}
      </div>
    )
  }
}

export default App
