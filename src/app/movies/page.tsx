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
} from "@/components/ui/carousel";
import {
  getMovies, createMovie
} from "../../services/movies";
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
import { useUser } from '@auth0/nextjs-auth0/client';
 
const formSchema = z.object({
  name: z.string().min(2).max(50),
  poster_image: z.string().min(2).max(300),
  score: z.preprocess((val) => Number(val), z.number().min(1).max(10)), // Convert string to number
});

type Movie = {
  id: number;
  name: string;
  poster_image: string;
  score: number;
  userid: number;
};

const Movies = () => {

  const { user, error, isLoading } = useUser();
 
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  const [movies, setMovies] = useState<Movie[]>([]);
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // For error handling

  const userId = 4;

  useEffect(() => {
    const fetchData = async () => {
      const data = await getMovies();
      if (data) {
        setMovies(data);
      }
    };

    fetchData();
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "", // Provide default values to avoid undefined state
      poster_image: "",
      score: 1,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const newMovie = await createMovie({
        ...values,
        userId,
      });
      if (newMovie) {
        setMovies((prevMovies) => [...prevMovies, newMovie]);
        setOpen(false); // Close the dialog
        form.reset(); // Reset the form
        window.location.reload(); // Reload the page to fetch updated movies
      } else {
        setErrorMessage("Failed to create movie");
      }
    } catch (error) {
      setErrorMessage("An error occurred while creating the movie");
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



  return (
    <main className="flex min-h-screen flex-col items-center p-24 gap-12">
        {  user && (
      <div className="flex gap-4">
        <img src={user.picture} alt={user.name} className="rounded-full" />
       <div className=" mt-4  "> <h1>Welcome to your movies, {user.name}</h1>
        

       <Button className=" mt-4  " > <a href="/api/auth/logout">Logout</a></Button>

       </div>
      </div>
    )
   }
    
 

    <Carousel className="w-1/2">
        <CarouselContent>
          {movies.map((movie) => (
            <CarouselItem key={movie.id}>
              <div className="flex gap-24">
                <div className="relative w-[10rem] h-[15rem] ">
                  <Image
                    alt="The guitarist in the concert."
                    src={movie.poster_image}
                    fill
                  />
                </div>
                <Link href={`/movies/${movie.id}`} className="pt-14 text-2xl">
                  {movie.name}
                </Link>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>

      <Dialog open={open} onOpenChange={setOpen}>
        <Button onClick={openModal}>Add new</Button>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Introduce here the data of your new movie:</DialogTitle>
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
                        <Input placeholder="resplandor" {...field} />
                      </FormControl>
                      <FormDescription>
                        This is the name of your new movie.
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
                        <Input placeholder="https://..." {...field} />
                      </FormControl>
                      <FormDescription>
                        This is the image of your new movie.
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
                        <Input type="number" placeholder="1-10" {...field} />
                      </FormControl>
                      <FormDescription>
                        This is the score of your new movie.
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
 

      <Toaster />
    </main>
  );
};

export default Movies;
