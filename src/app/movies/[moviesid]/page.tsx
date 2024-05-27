const MoviesDetailsPage = ({ params }: { params: { moviesid: string } }) => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1> {params.moviesid}</h1>
    </main>
  );
};

export default MoviesDetailsPage;
