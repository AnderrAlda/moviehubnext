import axios from "axios";

const baseUrl = "http://localhost:4001/genre";

 
export const getGenresByMovieId = async (movieId) => {
  try {
    const response = await axios.get(`${baseUrl}/${movieId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching genres by movie ID:", error);
    throw new Error("Failed to fetch genres by movie ID");
  }
};

export const getAllGenres = async () => {
  try {
    const response = await axios.get(baseUrl);
    return response.data;
  } catch (error) {
    console.error("Error fetching all genres:", error);
    throw new Error("Failed to fetch all genres");
  }
};

 
export const addGenreToMovies = async (movieId,genreId) => {
  try {
    const response = await axios.post(`${baseUrl}/genremovie/${movieId}/${genreId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching genres by movie ID:", error);
    throw new Error("Failed to fetch genres by movie ID");
  }
};
