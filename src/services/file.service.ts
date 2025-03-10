import fs from 'fs';
import path from 'path';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';

export class FileService {
  /**
   * Saves a file to the `uploads` directory with a unique name.
   * @param {Express.Multer.File} file - File received via Multer.
   * @returns {Promise<string>} A promise that resolves to the name of the saved file.
   */
  public save(file: Express.Multer.File): Promise<string> {
    return new Promise((resolve, reject) => {
      const newFileName = this.generateUniqueFileName('.txt');
      const newFilePath = path.join(process.cwd(), 'uploads', newFileName);
      fs.writeFile(newFilePath, file.buffer, (err) => {
        if (err) {
          return reject('Error saving file');
        }
        resolve(newFileName);
      });
    });
  }

  /**
   * Reads and parses a movie data file.
   * @param {string} fileName - The name of the file to read.
   * @returns {Promise<any[]>} A promise that resolves with an array of movie objects.
   */
  public getMovieData(fileName: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
      fs.readFile(path.join(process.cwd(), 'uploads', fileName), 'utf8', (err, data) => {
        if (err) {
          return reject('Error reading file');
        }

        const movieList = this.parseMovies(data, fileName);
        resolve(movieList);
      });
    });
  }

  /**
   * Parses movie data from a text file.
   * @param {string} data - The content of the movie data file.
   * @param {string} fileName - The name of the file.
   * @returns {any[]} An array of parsed movie objects.
   */
  private parseMovies(data: string, fileName: string): any[] {
    const movieList: any[] = [];

    const normalizedData = data.replace(/\r\n|\r/g, '\n');
    const movieData = normalizedData.split('\n\n');

    movieData.forEach((movie) => {
      if (!movie.trim()) return;

      const lines = movie.split('\n');
      const movieInfo: any = { source: fileName };

      lines.forEach((line) => {
        const [key, value] = line.split(':').map((el) => el.trim());

        if (key && value) {
          movieInfo[key] = value;
        }
      });

      if (Object.keys(movieInfo).length > 1) {
        movieList.push(movieInfo);
      }
    });

    return movieList;
  }

  /**
   * Generates a unique filename with the specified extension.
   * @param {string} fileExtension - The file extension (e.g., ".txt").
   * @returns {string} A unique filename.
   */
  private generateUniqueFileName = (fileExtension: string): string => {
    const timestamp = moment().format('YYYYMMDDHHmmss');
    let newFileName = `${timestamp}${fileExtension}`;
    const newFilePath = path.join(__dirname, 'uploads', newFileName);

    while (fs.existsSync(newFilePath)) {
      const uuid = uuidv4();
      newFileName = `${timestamp}_${uuid}${fileExtension}`;
    }

    return newFileName;
  };
}
