import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "../ui/button";
export default function Signup() {
 const [submitting, setSubmitting] = useState(false); 

  const handleSubmit =async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const username = form["username"].value;
    const password = form["password"].value;
    const name = form["Name"].value;
   
  
      try {
        setSubmitting(true);
        const response=await axios.post("http://localhost:5001/api/v1/user/signup", {
           username,
           password,
           name
        }, {
          withCredentials: true,
        })

        if(response.data.success){
          toast.success(response.data.message);
          setSubmitting(false);
          window.location.href = "/";
          
        }
        
        
      } 
     
      catch (error) {
        console.log(error)
        // toast.error(error.response.data.message);
        setSubmitting(false);
      }


  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-3xl font-bold">Sign Up</CardTitle>
          <CardDescription>Create your account to get started.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="Name">Name</Label>
            <Input id="Name" placeholder="Enter your name" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="username">Username</Label>
            <Input id="username" placeholder="Enter a username" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter a password"
              required
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button disabled={submitting} type="submit" className="w-full">
            {submitting ? "Signing up..." : "Sign up"}
          </Button>
        </CardFooter>
        </form>
      </Card>
    </div>
  );
}
