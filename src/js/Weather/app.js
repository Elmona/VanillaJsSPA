class Weather {
  constructor (div) {
    this.div = div
    this.imgUrl = '/image/OpenWeather/'
  }
  init () {
    this.div.querySelector('#openWeatherPic').style.visibility = 'hidden'

    const btn = this.div.querySelector('#btn')

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

    const error = () => {
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
