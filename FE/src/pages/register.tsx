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

// Validation schema for the form using Zod
const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .min(1, { message: "Password is required" }),
  role: z.string().min(1, { message: "Role is required" }),
});

export default function Register() {
  // Initialize form with validation using react-hook-form and Zod
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "CUSTOMER", // Default role as CUSTOMER
    },
  });

  const navigate = useNavigate(); // For navigation after successful registration

  // Registration function to handle form submission
  const registerUser = async ({
    name,
    email,
    password,
    role,
  }: z.infer<typeof formSchema>) => {
    try {
      // Send user data to the backend for registration
      const response = await axios.post(
        "https://e-commerce-ecuo.onrender.com/api/auth/register",
        {
          name,
          email,
          password,
          role,
        }
      );

      // Show success toast and navigate to the login page
      toast.success(response.data.message);
      navigate("/login"); // Redirect after successful registration
    } catch (error: any) {
      // Handle errors, show an error toast if registration fails
      toast.error(error.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <article id="register" className="max-w-[400px] mx-auto mt-24">
      <Toaster position="top-center" /> {/* Toast notifications */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Register</CardTitle>
          <CardDescription>Create a new account</CardDescription>
        </CardHeader>

        {/* Form to register */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(registerUser)}>
            <CardContent>
              {/* Name input */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email input */}
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

              {/* Password input */}
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

              {/* Role selection */}
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <FormControl>
                      <select {...field} className="input">
                        <option value="SELLER">Seller</option>
                        <option value="CUSTOMER">Customer</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>

            {/* Submit button */}
            <CardFooter>
              <Button className="w-full">Register</Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
      {/* Login redirect */}
      <div className="mt-4 text-center">
        <p>
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-blue-500 underline"
          >
            Login here
          </button>
        </p>
      </div>
    </article>
  );
}
