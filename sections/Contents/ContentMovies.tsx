"use client"

import { useEffect, useState } from "react";
import { useMenu } from "@contexts/MenuContext";

import { CardMovieTop, CardMovie, LoadMore } from "@components";

import { dedupeResults } from "@helpers/helpers";

const ContentMovies = ({ data, genre, mediaType, category }: 
    {data: any, genre?: any, mediaType: string, category: string}) => {

  const { handleChangeMediaType, handleChangeCategory } = useMenu();
  const [useData, setUseData] = useState<any>(data);

  const handleNextPage = (newData: any) => {
    const oldResults = useData.results;
    
    data = newData;
    data.results = [...oldResults, ...newData.results];

    const uniqueResults = dedupeResults(data.results);
    data.results = uniqueResults;

    setUseData(data);
  }

  useEffect(() => {
    handleChangeMediaType(mediaType, genre);
    handleChangeCategory(category);
  }, [])
  
  return (
    <section className="relative z-20 mt-20 max-md:mt-10 px-6 max-lg:px-5 max-md:px-3.5">
      <CardMovieTop 
        id={useData?.results[0].id}
        poster={useData?.results[0].poster_path}
        backDrop={useData?.results[0].backdrop_path}
        title={useData?.results[0].title || useData?.results[0].name}
        overview={useData?.results[0].overview}
        mediaType={useData?.results[0].media_type || mediaType}
        releaseDate={useData?.results[0].release_date || useData?.results[0].first_air_date}
        rating={useData?.results[0].vote_average}
      />
      
      <div className="grid grid-rows-1 grid-cols-4 max-xl:grid-cols-3 max-md:grid-cols-2 
            gap-x-3 gap-y-5 max-md:gap-x-1.5 max-md:gap-y-3.5 pt-8 pb-12">
          {useData?.results.slice(1).map((item: any, index: number) => (
            <CardMovie
              key={item.id}
              index={index}
              id={item.id}
              poster={item.poster_path}
              title={item.title || item.name}
              mediaType={item.media_type || mediaType}
              releaseDate={item.release_date || item.first_air_date}
              rating={item.vote_average}
            />
          ))}
      </div>
      
      {useData?.page < useData?.total_pages &&
        <LoadMore 
          page={useData.page}
          mediaType={mediaType}
          category={category}
          onNextPage={handleNextPage}
        />
      }
    </section>
  )
}

export default ContentMovies;