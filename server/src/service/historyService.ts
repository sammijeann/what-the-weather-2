import { promises as fs } from 'fs';

// TODO: Define a City class with name and id properties
class City {
  name: string;
  id: number;

  constructor() {
    this.name = '';
    this.id = 0;
  }
}

const filePath = "././db/db.json"; 

// TODO: Complete the HistoryService class
class HistoryService {
  // TODO: Define a read method that reads from the searchHistory.json file (db.json file in db folder)
  private async read() {
    try {
      const data = await fs.readFile(filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading file:', error);
      return []; 
    }
  }

  // // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
  private async write(cities: City[]) {
    try {
      await fs.writeFile(filePath, JSON.stringify(cities, null, 2));
    } catch (error) {
      console.error('Error writing file:', error);
    }
  }

  // // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  async getCities() {
    return await this.read();
  }

  // // TODO Define an addCity method that adds a city to the searchHistory.json file
  async addCity(city: string) {
    const cities = await this.read(); 
    const newCity = {
      id: cities.length + 1, 
      name: city 
    };
    cities.push(newCity); 
    await this.write(cities); 
  }
  }
  
  // // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
//   async removeCity(id: string) {}
 //}

export default new HistoryService();
