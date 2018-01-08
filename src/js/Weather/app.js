/**
 * Module for Examination 3
 * Get current Weather based on your position.
 *
 * @author Emil Larsson
 * @version 1.0.0
 */
class Weather {
  /**
  *  Memory
  *  @constructor
  *  @param {Element} - Reference to div to where the app is.
  */
  constructor (div) {
    this.div = div
    this.imgUrl = '/image/OpenWeather/'
  }

  /**
  *  init - Init the app
  *
  */
  init () {
    this.div.querySelector('#openWeatherPic').style.visibility = 'hidden'

    const btn = this.div.querySelector('#btn')

    /**
    *  success - Called when the browser returned gps position, gets weather and print to screen.
    *  @param {Object} - Object containing longitude and latitude
    */
    const success = pos => {
      let latitude = pos.coords.latitude
      let longitude = pos.coords.longitude
      let key = '&appid=ffeb8c5cc86b0b7ce7b7d1fd55976ae6'
      let url = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric`
      window.fetch(`${url}${key}`)
        .then(data => data.json())
        .then(data => {
          console.log(data)
          if (data.name !== undefined) {
            this.div.querySelector('h1')
              .textContent = `${data.name}`
            this.div.querySelector('h2')
              .textContent = `${data.weather[0].main}, ${data.main.temp}°C`
            this.div.querySelector('#openWeatherPic')
              .style.visibility = 'visible'
            this.div.querySelector('#openWeatherPic')
              .setAttribute('src', `${this.imgUrl}${data.weather[0].icon}.png`)
          }
        })
    }

    /**
    *  error - When something goes wrong print message to screen
    *  @param {Object} - Object containing error information
    */
    const error = e => {
      console.log(e)
      this.div.querySelector('h2')
        .textContent = 'Something went wrong, did you not accept the browser to get the position?'
    }

    navigator.geolocation.getCurrentPosition(success, error)

    btn.addEventListener('click', e => {
      navigator.geolocation.getCurrentPosition(success, error)
    })
  }
}

module.exports = Weather
