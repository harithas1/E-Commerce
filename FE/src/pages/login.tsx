import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import axios from "axios";

// Validation schema for the form
const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});

export default function Login() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const navigate = useNavigate();

  const loginUser = async ({ email, password }: z.infer<typeof formSchema>) => {
    try {
      // Call the API to login the user
      const response = await axios.post(
        "https://e-commerce-ecuo.onrender.com/api/auth/login",
        {
          email,
          password,
        }
      );

      // Assuming the response contains a token or user object
      const { user, token } = response.data;

      // Store user data (e.g., token) in localStorage
      localStorage.setItem("user", JSON.stringify(user)); // Store user info in localStorage
      localStorage.setItem("token", token); // Store auth token in localStorage

      toast.success("Login successful!");
      navigate("/dashboard"); // Redirect to dashboard after successful login
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <article id="login" className="max-w-[400px] mx-auto mt-24">
      <Toaster position="top-center" />
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Log into your account</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(loginUser)}>
            <CardContent>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button className="w-full">Login</Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      <div className="mt-4 text-center">
        <p>
          Don't have an account?{" "}
          <button
            onClick={() => navigate("/register")}
            className="text-blue-500 underline"
          >
            Register here
          </button>
        </p>
      </div>
    </article>
  );
}
