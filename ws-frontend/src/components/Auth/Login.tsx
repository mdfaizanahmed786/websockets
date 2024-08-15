import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import axios from "axios";
import { Button } from "../ui/button";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Login() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const username = form["username"].value;
    const password = form["password"].value;

    // Perform login
    try {
      setSubmitting(true);
      const response = await axios.post(
        "http://localhost:5001/api/v1/user/login",
        {
          username,
          password,
        },
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        setSubmitting(false);
        toast.success(response.data.message);

        window.location.href = "/";
      }
    } catch (error: any) {
      toast.error(error.response.data.message);
      setSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-3xl font-bold">Login</CardTitle>
          <CardDescription>Welcome Back!</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <CardContent className="space-y-4">
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
              {submitting ? "Diving in..." : "Dive in"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
