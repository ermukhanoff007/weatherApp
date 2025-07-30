import { instance } from "../instance.js"


const cityInput = document.querySelector('.city-input')
const searchBtn = document.querySelector('.search-btn')
const notFoundSection = document.querySelector('.not-found')
const searchCitySection = document.querySelector('.search-city')
const weatherInfoSection  = document.querySelector('.weather-info')


const countryTxt = document.querySelector('.country-txt')
const tempTxt =document.querySelector('.temp-txt')
const conditionTxt = document.querySelector('.condition-txt')
const humidityValueTxt = document.querySelector('.humidity-value-txt')
const windValueTxt = document.querySelector('.wind-value-txt')
const weatherSummaryImg = document.querySelector('.weather-summary-img')
const currentDateTxt = document.querySelector('.current-date-txt')

const forecastItemContainer = document.querySelector('.forecast-items-container')


searchBtn.addEventListener('click', ()=>{

    const city = cityInput.value.trim()
    if(city!==''){
        updateWeatherInfo(city)
        saveCity(city)
        cityInput.value= ''
        cityInput.blur()
    }
})



cityInput.addEventListener('keydown',(event)=>{
    const city = cityInput.value.trim()
    if (event.key==="Enter" && city!==''){
        updateWeatherInfo(city)
        saveCity(city)
        cityInput.value= ''
        cityInput.blur()
}
})





function saveCity(city){
    localStorage.setItem("city",JSON.stringify(city))
}
window.addEventListener('DOMContentLoaded', () => {
    const savedCity = JSON.parse(localStorage.getItem('city'));
    if (savedCity) {
        updateWeatherInfo(savedCity);
    } else {
        showDisplaySection(searchCitySection);
    }
});


async function getFetchData(endPoint,city){
    try{
    const response =  await instance.get(`/${endPoint}`,{
    params : {q :city}})
    return response.data

}
    catch (err){
        console.log('Error',err)
        showDisplaySection(notFoundSection)
        return null
    }
    

}
async function updateWeatherInfo(city){
    const weatherData =  await getFetchData('weather',city)
    
    if(weatherData.cod!==200){
        
        showDisplaySection(notFoundSection)
        return
    }
    console.log(weatherData)

    const {
        name:   cityName,
        main:{temp,humidity},
        weather :[{id,main}],
        wind :{speed}
    } = weatherData

    countryTxt.textContent=cityName;
    tempTxt.textContent=Math.round(temp) + '°C'
    conditionTxt.textContent=main
    humidityValueTxt.textContent = humidity + '%'
    windValueTxt.textContent = speed + 'M/s'
    currentDateTxt.textContent = getCurrentDate()
    weatherSummaryImg.src = `./weather/${getWeatherIcon(id)}`



    await updateForecastsInfo(city)

    showDisplaySection(weatherInfoSection)
}

async function updateForecastsInfo(city){
    const forecastsData = await getFetchData('forecast',city)
    
    const timeTaken = '12:00:00'
    const todayDate = new Date().toISOString().split('T')[0]
    console.log(todayDate)

    forecastItemContainer.innerHTML = ''
    forecastsData.list.forEach(forecastWeather=>{
        if (forecastWeather.dt_txt.includes(timeTaken) && !forecastWeather.dt_txt.includes(todayDate)){
            updateForecastsItems(forecastWeather)
        }
    })

}


function updateForecastsItems(weatherData){
    const {
        dt_txt:date,
        weather:[{id}],
        main :{temp}
    } = weatherData


    const dateTaken = new Date(date)
    const dateOption = {
        day : '2-digit',
        month : 'short'
    }

    const dateResult = dateTaken.toLocaleDateString('en-US',dateOption)


    const forecastItem = `
    <div class="forecast-item">
        <h5 class="forecast-item-date regular-txt">${dateResult}</h5>
        <img src="./weather/${getWeatherIcon(id)}" alt="" class="forecast-item-img">
        <h5 class="forecast-item-temp">${Math.round(temp)}</h5>
    </div>
    `

    forecastItemContainer.insertAdjacentHTML('beforeend',forecastItem)
}

function getWeatherIcon(id){
    if (id<=232) return 'thunderstorm.svg'
    if (id <=321) return 'drizzle.svg'
    if (id<=531) return 'rain.svg'
    if (id <=622) return 'snow.svg'
    if (id<=781) return 'atmosphere.svg'
    if (id <=800) return 'clear.svg'
    else return 'clouds.svg'
}

function getCurrentDate(){
    const currentDate = new Date()
    const options  = {
        weekday : 'short',
        day : '2-digit',
        month : 'short'
    }
    return currentDate.toLocaleDateString('en-GB',options)
}

function showDisplaySection(section){
[weatherInfoSection,searchCitySection,notFoundSection].
    forEach(section=>section.style.display='none')

    section.style.display = 'flex'

}