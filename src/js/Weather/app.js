class Weather {
  constructor (div) {
    this.div = div
    this.imgUrl = '/image/OpenWeather/'
  }
  init () {
    console.log('Hello world!')
    const btn = this.div.querySelector('#btn')
    btn.addEventListener('click', e => {
      let key = '&appid=ffeb8c5cc86b0b7ce7b7d1fd55976ae6'
      let town = document.querySelector('.Weather #txtTown').value
      let url = `http://api.openweathermap.org/data/2.5/weather?q=${town}&units=metric`
      console.log(town)
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
              .setAttribute('src', `${this.imgUrl}${data.weather[0].icon}.png`)
          }
        })
    })
  }
}

module.exports = Weather
