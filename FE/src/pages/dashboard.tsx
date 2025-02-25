import React, { Suspense, useEffect, useState } from "react";
import { ProductsResponse, Product } from "../types";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  convertToRupee,
  formatPercentage,
  formatPrice,
  sortProductsByPrice,
} from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import Reviews from "@/components/ui/reviews";
import { ShoppingCart } from "lucide-react";
import Filters from "@/components/ui/filters";
import { addToCart } from "@/features/cartSlice";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useDispatch } from "react-redux";
import { Skeleton } from "@/components/ui/skeleton";

// DashboardLoader: Suspense fallback component for data fetching
export function DashboardLoader() {
  const [products, setProducts] = useState<ProductsResponse | null>(null);
  const [total, setTotal] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        `https://dashboard.render.com/products?limit=15`
      );
      const data = await response.json();
      setProducts(data);
      setTotal(data.total);
    };

    fetchData();
  }, []);

  return products ? (
    <Dashboard products={products} total={total} />
  ) : (
    <DashboardSkeleton />
  );
}

// Process the fetched product data
function processResponse(data: ProductsResponse) {
  return {
    ...data,
    products: data.products.map((product) => ({
      ...product,
      price: convertToRupee(product.price),
    })),
  };
}

const defaultLimit = 15;

// Dashboard component to display the product list
export default function Dashboard({
  products,
  total,
}: {
  products: ProductsResponse;
  total: number;
}) {
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [sortBy, setSortBy] = useState<string>("");
  const [skip, setSkip] = useState<number>(0);

  const dispatch = useDispatch();
  const numberOfPages = Math.ceil(total / defaultLimit); // Total number of pages
  const pageNumber = Math.ceil(skip / defaultLimit) + 1; // Current page number

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Fetch products data based on searchParams or category
  useEffect(() => {
    const fetchData = async () => {
      const url = new URL(window.location.href);
      const category = url.searchParams.get("category");
      const search = url.searchParams.get("search");
      const page = url.searchParams.get("page");
      const skip = page ? defaultLimit * (parseInt(page) - 1) : 0;

      let response;

      // Make API call based on category or search query
      if (search) {
        response = await fetch(
          `https://e-commerce-ecuo.onrender.com/search?q=${search}`
        );
      } else if (category && category !== "all") {
        response = await fetch(
          `https://e-commerce-ecuo.onrender.com/products/category/${category}?limit=${defaultLimit}&skip=${skip}`
        );
      } else {
        response = await fetch(
          `https://e-commerce-ecuo.onrender.com/products?limit=${defaultLimit}&skip=${skip}`
        );
      }

      const data = await response.json();
      const processedData = processResponse(data);
      setFilteredProducts(processedData.products);
      // setTotal(data.total);
      setSkip(skip); // Update the skip value for pagination
    };

    fetchData();
  }, [searchParams]);

  const sortedProducts = sortProductsByPrice(filteredProducts);

  // Sorting handler
  function onSortingChanged(value: string) {
    if (value === "low") {
      setSortBy("asc");
      setFilteredProducts(sortProductsByPrice(filteredProducts));
    } else if (value === "high") {
      setFilteredProducts(sortProductsByPrice(filteredProducts, "desc"));
      setSortBy("desc");
    } else {
      setSortBy("");
      setFilteredProducts(products?.products || []);
    }
  }

  // Price filter handler
  function onPriceChange([minPrice, maxPrice]: number[]) {
    const filteredItems =
      products?.products.filter(
        (product) => product.price >= minPrice && product.price <= maxPrice
      ) || [];

    if (sortBy) {
      setFilteredProducts(
        sortProductsByPrice(filteredItems, sortBy as "asc" | "desc")
      );
    } else {
      setFilteredProducts(filteredItems);
    }
  }

  // Handle page change
  function onPageChange(pageNumber: number, event: React.MouseEvent) {
    event.preventDefault();
    const urlSearchParams = new URLSearchParams(searchParams);
    urlSearchParams.set("page", pageNumber.toString());
    setSearchParams(urlSearchParams);
  }

  // Add product to the cart
  function addProductToCart(product: Product) {
    dispatch(addToCart({ product, quantity: 1 }));
  }

  // Build pagination buttons
  function buildPagination() {
    const pages: JSX.Element[] = [];
    for (
      let index = pageNumber > 4 ? pageNumber - 2 : 1;
      index <= pageNumber + 2 && index <= numberOfPages;
      index++
    ) {
      pages.push(
        <PaginationItem key={index}>
          <PaginationLink
            onClick={(event) => onPageChange(index, event)}
            isActive={pageNumber === index}
            href="#"
          >
            {index}
          </PaginationLink>
        </PaginationItem>
      );
    }
    return pages;
  }

  // Show product details
  function showProduct(productId: number) {
    navigate(`/product/${productId}`);
  }

  // Loading skeleton when products are being fetched
  if (!products) {
    return <DashboardSkeleton />;
  }

  return (
    <Suspense fallback={<div className="text-3xl">Loading...</div>}>
      <section className="px-4 flex flex-col gap-4">
        <header className="flex items-center justify-end">
          <Filters
            minPrice={sortedProducts.at(0)?.price}
            maxPrice={sortedProducts.at(-1)?.price}
            onPriceChange={onPriceChange}
            onSortingChanged={onSortingChanged}
          />
        </header>

        <section className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4">
          {filteredProducts.map(
            ({
              title,
              description,
              id,
              price,
              discountPercentage,
              tags,
              reviews,
              images,
            }) => {
              return (
                <Card key={id} className="flex flex-col cursor-pointer">
                  <CardHeader>
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                  </CardHeader>
                  <CardContent
                    className="flex flex-col gap-2 mt-4"
                    onClick={() => showProduct(id)}
                  >
                    <article className="flex items-center gap-2">
                      <p className="relative">
                        <span className="absolute text-xs font-semibold left-0 top-1/2 -translate-y-1/2">
                          ₹
                        </span>
                        <span className="ml-2 text-xl">
                          {formatPrice(price)}
                        </span>
                      </p>
                      {discountPercentage > 1 ? (
                        <Badge className="text-green-400" variant={"outline"}>
                          {formatPercentage(discountPercentage)}% off
                        </Badge>
                      ) : null}
                    </article>
                    <CardTitle className="line-clamp-1">{title}</CardTitle>
                    <CardDescription className="line-clamp-1">
                      {description}
                    </CardDescription>
                    <HoverCard>
                      <HoverCardTrigger className="underline">
                        View More
                      </HoverCardTrigger>
                      <HoverCardContent>
                        <article className="flex flex-col gap-2">
                          <h1 className="font-semibold">{title}</h1>
                          <p className="text-sm">{description}</p>
                          <section className="flex gap-2 items-center">
                            {tags.map((tag, idx) => (
                              <Badge key={idx}>{tag}</Badge>
                            ))}
                          </section>
                          <Reviews reviews={reviews} />
                        </article>
                      </HoverCardContent>
                    </HoverCard>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="w-full"
                      onClick={() =>
                        addProductToCart({
                          title,
                          description,
                          id,
                          price,
                          discountPercentage,
                          tags,
                          reviews,
                          images,
                          rating: 0,
                          stock: 0,
                          sku: "",
                          weight: 0,
                          category: "",
                        })
                      }
                    >
                      <ShoppingCart className="mr-2 h-4 w-4" /> Add to cart
                    </Button>
                  </CardFooter>
                </Card>
              );
            }
          )}
        </section>

        <Pagination>
          <PaginationContent>
            {pageNumber > 1 ? (
              <PaginationItem>
                <PaginationPrevious
                  onClick={(event) => onPageChange(pageNumber - 1, event)}
                  href="#"
                />
              </PaginationItem>
            ) : null}

            {buildPagination()}
            {pageNumber < numberOfPages ? (
              <PaginationItem>
                <PaginationNext
                  onClick={(event) => onPageChange(pageNumber + 1, event)}
                  href="#"
                />
              </PaginationItem>
            ) : null}
          </PaginationContent>
        </Pagination>
      </section>
    </Suspense>
  );
}

// DashboardSkeleton: Placeholder UI when the data is being fetched
export function DashboardSkeleton() {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4">
      {[...Array(10)].map((_, idx) => (
        <div key={idx} className="flex flex-col">
          <Skeleton className="h-60 w-full rounded-t-xl" />
          <div className="flex flex-col gap-4 mt-4">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-4 w-1/4" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
