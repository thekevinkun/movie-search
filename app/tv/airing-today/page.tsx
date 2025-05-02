import { Metadata } from "next";

import { ContentMoviesClient } from "@components/Clients";

import { getCategory } from "@lib/api";
import { getCachedGenres } from "@lib/cache";

export const metadata: Metadata = {
  title: "TV Shows Airing Today — PacoMovies",
  description: "TV Show airing today collection's page"
};

const TvAiringToday = async ({mediaType="tv", category="airing_today"}) => {
  const tvData = await getCategory(mediaType, category);
  const genreData = await getCachedGenres(mediaType);
  
  return (
    <ContentMoviesClient 
      data={tvData}
      genre={genreData}
      mediaType={mediaType}
      category={category}
    />
  )
}

export default TvAiringToday;
