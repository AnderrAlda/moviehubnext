import axios from "axios";

const baseUrl = "http://localhost:4001/movie";

 
export const getMovies = async () => {
  try {
    const response = await axios.get(baseUrl);
    return response.data;
  } catch (err) {
    console.error("Error fetching movies:", err);
    throw new Error("Failed to fetch movies");
  }
};
export const getMovieById = async (id: number) => {
  try {
    const response = await axios.get(`${baseUrl}/${id}`);
    return response.data;
  } catch (error) {
    return null;
  }
};

export const createMovie = async ({
  name,
  poster_image,
  score,
  userId
 
}) => {
  try {
    const response = await axios.post(`${baseUrl}/${userId}`, {
      name,
      poster_image,
      score,
    });
    return response.data;
  } catch (err) {
    return null;
  }
};



export const updateMovie = async ({
  id,
  name,
  poster_image,
  score,
}: Playlist) => {
  try {
    const response = await axios.patch(`${baseUrl}/${id}`, {
      name,
      poster_image,
      score,
    });
    return response.data;
  } catch (err) {
    return null;
  }
};



export const deleteMovie = async (id: number) => {
  try {
    const response = await axios.delete(`${baseUrl}/${id}`);
    return response.data;
  } catch (err) {
    return null;
  }
};


export const getGenresByMovieId = async (movieId) => {
  try {
    const response = await axios.get(`${baseUrl}/${movieId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching genres by movie ID:", error);
    throw new Error("Failed to fetch genres by movie ID");
  }
};