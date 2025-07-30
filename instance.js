

const apiKey='6376a57f40c7b6f586085f09223d41a5'

const instance = axios.create({
    baseURL:'https://api.openweathermap.org/data/2.5',
    params : {
        appid: apiKey,
        units : "metric"
    }
})


export{
    instance
}