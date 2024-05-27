"use client";
import Image from 'next/image';
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"


type Movie = {
  id: number;
  name: string;
  poster_image: string;
  score: number;
  userid: number;
};

const Movies = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    fetch("http://localhost:4001/movie")
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setMovies(data);
      })
      .catch(error => {
        console.error("Error fetching movies:", error);
      });
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
    
  
        <h1>Movies</h1>
        <Carousel className="w-1/2">
  <CarouselContent>
  {movies.map((movie) => (
     <CarouselItem key={movie.id}> 
      <div className="flex gap-3">
    
             <div className="relative w-[10rem] h-[15rem]">
             <Image
               alt="The guitarist in the concert."
               src={movie.poster_image}
               fill
             />
           </div>
           <Link href={`/movies/${movie.id}`} className="pt-14 text-2xl">{movie.name}</Link>
     </div>
     </CarouselItem>
            
          ))}
   
    
  </CarouselContent>
  <CarouselPrevious />
  <CarouselNext />
</Carousel>
   

    
    </main>
  );
};

export default Movies;
