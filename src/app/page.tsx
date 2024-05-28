 
 'use client';

 import { useUser } from '@auth0/nextjs-auth0/client';
 import { Button } from "@/components/ui/button"
export default function Home() {

  const { user, error, isLoading } = useUser();
 
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

 // Redirect to '/movies' if user is authenticated
 if (user) {
  window.location.href = '/movies';
  return null; // Render nothing while redirecting
}

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
    

    <Button  > <a href="/api/auth/login">Login</a></Button>

   
 
  {  user && (
      <div>
        <img src={user.picture} alt={user.name} />
        <h2>{user.name}</h2>
        <p>{user.email}</p>
      </div>
    )
   }
    </main>
  );
}
