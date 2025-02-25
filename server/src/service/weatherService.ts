import dotenv from 'dotenv';
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
}

// TODO: Define a class for the Weather object
class Weather {
  tempF: number;
  humidity: number;
  windSpeed: number;
  icon: string;
  date?: string;
  city?: string;
  iconDescription?: string;

  constructor() {
    this.tempF = 0;
    this.humidity = 0;
    this.windSpeed = 0;
    this.icon = '';
    this.date = '';
    this.city = '';
    this.iconDescription = '';
  }
}

// TODO: Complete the WeatherService class
class WeatherService {

  // TODO: Define the baseURL, API key, and city name properties
  baseURL: string; 
  weatherApi: string; 
  cityName: string; 

  constructor() {
    this.baseURL = process.env.API_BASE_URL || '';
    this.weatherApi = process.env.API_KEY || '';
    this.cityName = ''; 
}

  // TODO: Create fetchLocationData method
  private async fetchLocationData(query: string) {
    const response = await fetch(`${this.baseURL}/geo/1.0/direct?q=${query}&limit=1&appid=${this.weatherApi}`);
    const data = await response.json();
    console.log(data);
    return data[0];
  }

  // TODO: Create destructureLocationData method
  private destructureLocationData(locationData: Coordinates): Coordinates {
    console.log(locationData);
    return {
      lat: locationData.lat,
      lon: locationData.lon
    };
  }

  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    return `${this.baseURL}/data/2.5/weather?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.weatherApi}&units=imperial`;
  }

  // TODO: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData(city: string) {
    const locationData = await this.fetchLocationData(city);
    return this.destructureLocationData(locationData);
  }

  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates) {
    const response = await fetch(this.buildWeatherQuery(coordinates));
    return await response.json();
  }

  private async fetchForecastData(coordinates: Coordinates): Promise<any[]> {
    const response = await fetch(`${this.baseURL}/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.weatherApi}&units=imperial`);
    const data = await response.json();
    return data.list; // Assuming the forecast data is in the 'list' property
  }

  // TODO: Build parseCurrentWeather method
  private parseCurrentWeather(response: any) {
    const weather = new Weather();
    weather.tempF = response.main.temp;
    weather.humidity = response.main.humidity;
    weather.windSpeed = response.wind.speed;
    weather.icon = response.weather[0].icon;
    weather.iconDescription = response.weather[0].description;
    weather.city = response.name;
    return weather;
  }

  // TODO: Complete buildForecastArray method
  private buildForecastArray(currentWeather: Weather, weatherData: any[]) {
    const forecastArray: Weather[] = [currentWeather];
    const addedDays = new Set<string>();

    weatherData.forEach((data: any) => {
      const weather = new Weather();
      weather.tempF = data.main.temp;
      weather.humidity = data.main.humidity;
      weather.windSpeed = data.wind.speed;
      weather.icon = data.weather[0].icon;
      weather.iconDescription = data.weather[0].description;
      const date = new Date(data.dt_txt);
      const formattedDate = `${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}-${date.getFullYear()}`;

      if (!addedDays.has(formattedDate)) {
        weather.date = formattedDate; // Set the date only if it's a new day
        forecastArray.push(weather);
        addedDays.add(formattedDate); // Mark this date as added
      }
    });
    console.log(forecastArray);
    return forecastArray;
  }

  // TODO: Complete getWeatherForCity method
  async getWeatherForCity(city: string) {
    const coordinates = await this.fetchAndDestructureLocationData(city);
    const currentWeatherData = await this.fetchWeatherData(coordinates);
    const currentWeather = this.parseCurrentWeather(currentWeatherData);

    const forecastData = await this.fetchForecastData(coordinates);

    return this.buildForecastArray(currentWeather, forecastData);
  }
}

export default new WeatherService();
