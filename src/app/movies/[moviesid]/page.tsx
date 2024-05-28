"use client";
import { useEffect, useState } from "react";
import { getMovieById, createMovie, updateMovie, deleteMovie } from "../../../services/movies";
import { getGenresByMovieId, getAllGenres } from "../../../services/genres";
import Image from 'next/image';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Toaster } from "@/components/ui/toaster";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRouter } from 'next/navigation'; // Import the useRouter hook
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { addGenreToMovies } from '../../../services/genres';  


import { IoMdArrowRoundBack } from "react-icons/io";
type Movie = {
  id: number;
  name: string;
  poster_image: string;
  score: number;
  userid: number;
};

const formSchema = z.object({
  name: z.string().min(2).max(50),
  poster_image: z.string().min(2).max(300),
  score: z.preprocess((val) => Number(val), z.number().min(1).max(10)), // Convert string to number
});

const MoviesDetailsPage = ({ params }: { params: { moviesid: string } }) => {
  const [movie, setMovie] = useState<Movie>();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // For error handling
  const userId = 4;
  const router = useRouter(); // Initialize the useRouter hook
  const [genres, setGenres] = useState<{ id: number; name: string }[]>([]);
  const [allGenres, setAllGenres] = useState<{ id: number; name: string }[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "", // Provide default values to avoid undefined state
      poster_image: "",
      score: 1,
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      const data = await getMovieById(params.moviesid);
      if (data) {
        setMovie(data);
        form.reset({
          name: data.name,
          poster_image: data.poster_image,
          score: data.score,
        });
      }
    };

    fetchData();
  }, [params.moviesid]);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const movieId = params.moviesid;
        const genresData = await getGenresByMovieId(movieId);
        setGenres(genresData.genres); // Update genres state with fetched data
      } catch (error) {
        console.error("Error fetching genres:", error);
      }
    };
  
    fetchGenres();
  }, [params.moviesid]); 

  useEffect(() => {
    const fetchAllGenres = async () => {
      try {
        const genresData = await getAllGenres();
        setAllGenres(genresData);
      } catch (error) {
        console.error("Error fetching all genres:", error);
      }
    };

    fetchAllGenres();
  }, []); // Empty dependency array to run once on component mount

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      if (movie) {
        const updatedMovie = await updateMovie({
          id: movie.id,
          ...values,
        });
        if (updatedMovie) {
          setMovie(updatedMovie);
          setOpen(false); // Close the dialog
          form.reset(); // Reset the form
          window.location.reload(); // Reload the page to fetch updated movies
        } else {
          setErrorMessage("Failed to update movie");
        }
      } else {
        const newMovie = await createMovie({
          ...values,
          userId,
        });
        if (newMovie) {
          setOpen(false); // Close the dialog
          form.reset(); // Reset the form
          window.location.reload(); // Reload the page to fetch updated movies
        } else {
          setErrorMessage("Failed to create movie");
        }
      }
    } catch (error) {
      setErrorMessage("An error occurred while submitting the movie");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onCancel = () => {
    form.reset();
    form.clearErrors();
    setOpen(false);
  };

  const openModal = () => {
    setOpen(true);
  };

  const handleDeleteMovie = async () => {
    try {
      await deleteMovie(params.moviesid); // Call deleteMovie function with the movie ID
      router.push("/movies");
    } catch (error) {
      console.error("An error occurred while deleting the movie:", error);
      // Optionally, provide feedback to the user
    }
  };

  const handleAddGenreToMovie = async (genreId: number) => {
    try {
      console.log("todata"+params.moviesid+ genreId);
      await addGenreToMovies(params.moviesid, genreId);
      window.location.reload(); 
    } catch (error) {
      console.error("An error occurred while adding genre to movie:", error);
      // Optionally, provide feedback to the user
    }
  };
  
 

  return (
 
    <main className="flex min-h-screen flex-col items-center p-24">
   <Link href="/movies">
    <Button className="rounded-full mb-12 absolute left-12"> <IoMdArrowRoundBack /></Button>
   
</Link>
      <div className="mb-12">
        {movie ? (
          <div className="">
            <Image
              src={movie.poster_image}
              alt={movie.name}
              width={200}
              height={300}
            />
            <h2>Title: {movie.name}</h2>
            <p>Score: {movie.score}</p>
          </div>
        ) : (
          <p>Loading...</p>
        )}
        <div className="mb-6">
          <h2>Genres:</h2>
          {genres.map((genre) => (
            <Badge className="ml-1" key={genre.id}>{genre.name}</Badge>
          ))}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="rounded-full ml-5">+</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Genres:</DropdownMenuLabel>
              <DropdownMenuSeparator />
            {allGenres.map((genre) => (
  <DropdownMenuItem key={genre.id} onClick={() => handleAddGenreToMovie(genre.id)}>
    {genre.name}
  </DropdownMenuItem>
))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <Button onClick={openModal}>Edit movie</Button>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Introduce here the data of your movie:</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[30rem] w-[29rem] rounded-md border">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8 mr-4 pb-4 pt-4 ml-2"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Movie name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>
                        This is the name of your movie.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="poster_image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>
                        This is the image of your movie.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="score"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Score</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormDescription>
                        This is the score of your movie.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {errorMessage && <p className="text-red-500">{errorMessage}</p>}
                <DialogFooter>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Submit"}
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={onCancel}
                  >
                    Cancel
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <Button onClick={handleDeleteMovie} className="mt-6">Delete movie</Button>
    </main>
  );
};

export default MoviesDetailsPage;
