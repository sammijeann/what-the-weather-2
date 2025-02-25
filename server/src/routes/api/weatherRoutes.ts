import { Router } from 'express';
const router = Router();

//import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

// TODO: POST Request with city name to retrieve weather data
router.post('/', async (req, res) => {
  //res.json({ message: 'POST request to the homepage' });
  try {
    const city = req.body.city;
    if (!city) {
      return res.status(400).json({ error: 'City name is required' });
    }
    const weatherData = await WeatherService.getWeatherForCity(city);

    // Save city to search history (assuming you have a method in HistoryService)

    // Send the weather data as a response
    res.json(weatherData);
    console.log(weatherData);
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve weather data' });
    return;
  }
});

// TODO: GET search history
//router.get('/history', async (req, res) => {});

// * BONUS TODO: DELETE city from search history
//router.delete('/history/:id', async (req, res) => {});

export default router;
