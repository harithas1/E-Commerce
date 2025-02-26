import { StrictMode, Suspense, lazy, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import {
  createBrowserRouter,
  LoaderFunctionArgs,
  redirect,
  RouterProvider,
} from "react-router-dom";
import Login from "./pages/login.jsx";
import Register from "./pages/register.jsx"; // Import Register page
import Layout from "./components/ui/layout.tsx";
import { DashboardSkeleton } from "./pages/dashboard.tsx";
import { Provider } from "react-redux";
import store from "./store.ts";
import { getStoredValue } from "./lib/utils.ts";
import { ProductsResponse } from "./types"; // or wherever ProductsResponse is defined


// Lazy-loaded components
const Payment = lazy(() => import("./pages/payment.tsx"));
const Dashboard = lazy(() =>
  import("./pages/dashboard").then((module) => ({ default: module.default }))
);
const Cart = lazy(() => import("./pages/cart.tsx"));
const ProductInfo = lazy(() => import("./pages/product.jsx"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      // Main (home) page
      {
        index: true,
        element: (
          <Suspense fallback={<DashboardSkeleton />}>
            <DashboardWithData />
          </Suspense>
        ),
        loader: () => {
          const user = getStoredValue("user");
          if (!user) {
            return redirect("/login"); // Protect dashboard route
          }
          return null;
        },
      },
      {
        path: "/dashboard",
        element: (
          <Suspense fallback={<DashboardSkeleton />}>
            <DashboardWithData />
          </Suspense>
        ),
        loader: () => {
          const user = getStoredValue("user"); // Consistent check with getStoredValue
          if (!user) {
            return redirect("/login"); // Redirect to login if user is not logged in
          }
          return null;
        },
      },
      {
        path: "/cart",
        element: (
          <Suspense fallback={<h1>Loading..</h1>}>
            <Cart />
          </Suspense>
        ),
        loader: () => {
          const user = getStoredValue("user");
          if (!user) {
            return redirect("/login"); // Protect cart route
          }
          return null;
        },
      },
      {
        path: "/product/:productId",
        element: (
          <Suspense fallback={<h1>Loading..</h1>}>
            <ProductInfo />
          </Suspense>
        ),
        async loader({ request, params }: LoaderFunctionArgs) {
          const { loader } = await import("./pages/product.jsx");
          return loader({ request, params }); // Pass the request and params
        },
      },
      {
        path: "/payment",
        element: (
          <Suspense fallback={<h1>Loading..</h1>}>
            <Payment />
          </Suspense>
        ),
        loader: () => {
          const user = getStoredValue("user");
          if (!user) {
            return redirect("/login"); // Protect payment route
          }
          return null;
        },
      },
    ],
  },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> }, // Register route
]);

function DashboardWithData() {
  const [products, setProducts] = useState<ProductsResponse | null>(null);
  const [total, setTotal] = useState<number>(0);

  useEffect(() => {
    // Fetch the data for products and total here
    const fetchData = async () => {
      // Example API call to fetch products and total
      const response = await fetch("/api/products"); // Replace with your actual endpoint
      const data = await response.json();
      setProducts(data.products);
      setTotal(data.total);
    };

    fetchData();
  }, []);

  // Loading state while data is being fetched
  if (!products || total === 0) {
    return <DashboardSkeleton />;
  }

  return <Dashboard products={products} total={total} />;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
);
