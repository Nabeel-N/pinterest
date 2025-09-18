"use client"
type AuthPageProps = {
  isSignin: boolean;
};

export default function AuthPage({ isSignin }: AuthPageProps) {
  function handleSubmit(){
    
  }
  if (isSignin == true) {
    return <div className="h-screen bg-red-300">signin</div>;
  } else {
    return <div className="bg-green-500">signup</div>;
  }
}
