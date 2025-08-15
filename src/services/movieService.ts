import axios from "axios";
import type { Movie } from "../types/movie";

interface MovieSearchResponse {
  page: number;
  results: Movie[];
  total_pages: number;
}

const token = import.meta.env.VITE_TMDB_TOKEN;
const baseUrl = "https://api.themoviedb.org/3/search/movie";

export async function fetchMovies(query: string, page: number): Promise<MovieSearchResponse> {
  const config = {
    params: {
      query,
      page,
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get<MovieSearchResponse>(baseUrl, config);
  return response.data;
}
