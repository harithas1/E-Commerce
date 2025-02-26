import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import Rating from "@/components/ui/rating";
import Reviews from "@/components/ui/reviews";
import { Separator } from "@/components/ui/separator";
import { addToCart } from "@/features/cartSlice";
import { convertToRupee, formatPercentage, formatPrice } from "@/lib/utils";
import { ChevronDown, ShoppingCart } from "lucide-react";
import { useDispatch } from "react-redux";
import { useLoaderData } from "react-router-dom";

// Loader function to fetch product data
export function loader({ params }) {
  const { productId } = params;

  return fetch(`https://e-commerce-ecuo.onrender.com/products/${productId}`)
    .then((res) => res.json())
    .then((product) => ({
      ...product,
      price: convertToRupee(product.price),
    }))
    .catch((error) => {
      console.error("Error fetching product data:", error);
      return null; // Return null or some default product if fetch fails
    });
}

// Get initials for avatar
function getInitials(name) {
  const [firstName, lastName] = name.split(" ");
  return firstName.charAt(0) + (lastName ? lastName.charAt(0) : "");
}

// Main ProductInfo Component
export default function ProductInfo() {
  const product = useLoaderData();

  if (!product) {
    return <p>Product not found or error fetching data</p>; // Handle error if product not found
  }

  const {
    images,
    title,
    description,
    price,
    brand,
    warrantyInformation,
    reviews,
    dimensions,
    shippingInformation,
    discountPercentage,
    returnPolicy,
    rating,
  } = product;

  const dispatch = useDispatch();

  function addProductToCart() {
    dispatch(addToCart({ product, quantity: 1 }));
  }

  return (
    <article className="p-4">
      <Card>
        <CardContent className="mt-6 grid grid-cols-[1fr_2fr] gap-4">
          {/* Product Image */}
          <Card>
            <CardContent>
              <img
                className="aspect-square"
                src={images[0] || "/placeholder-image.jpg"} // Fallback if no image
                alt={title}
              />
            </CardContent>
          </Card>

          {/* Product Details */}
          <Card>
            <CardHeader>
              <CardTitle>{title}</CardTitle>
              <CardDescription>{description}</CardDescription>

              <HoverCard>
                <HoverCardTrigger asChild>
                  <section className="flex items-center gap-2 cursor-pointer">
                    <span>{rating}</span>
                    <Rating rating={rating} />
                    <ChevronDown />
                    <Separator
                      className="h-6 w-[.125rem]"
                      orientation="vertical"
                    />
                    {reviews.length} reviews
                  </section>
                </HoverCardTrigger>
                <HoverCardContent align="start">
                  <Reviews reviews={reviews} />
                </HoverCardContent>
              </HoverCard>
            </CardHeader>
            <Separator className="my-4" />
            <CardContent className="space-y-10">
              <article className="flex items-center gap-2">
                <p className="relative">
                  <span className="absolute text-xs font-semibold left-0 top-1/2 -translate-y-1/2">
                    ₹
                  </span>
                  <span className="ml-2 text-xl">{formatPrice(price)}</span>
                </p>
                {discountPercentage > 1 && (
                  <Badge className="text-green-400" variant="outline">
                    {formatPercentage(discountPercentage)}% off
                  </Badge>
                )}
              </article>

              {/* Product Information */}
              <section className="grid grid-cols-2 gap-4">
                <article className="flex flex-col gap-2">
                  <h1 className="text-lg">Brand - {brand}</h1>
                  <h2 className="text-lg font-semibold">Dimensions</h2>
                  <p className="text-sm font-medium">
                    {dimensions.height} x {dimensions.width} x{" "}
                    {dimensions.depth}
                  </p>
                </article>
                <article className="flex flex-col gap-2 font-semibold">
                  <h1>{warrantyInformation}</h1>
                  <h2>{shippingInformation}</h2>
                  <h2>{returnPolicy}</h2>
                </article>

                {/* Add to Cart Button */}
                <Button
                  onClick={addProductToCart}
                  className="col-span-2 w-full flex items-center gap-2"
                >
                  <ShoppingCart className="size-6" />
                  Add to cart
                </Button>
              </section>
            </CardContent>
          </Card>
        </CardContent>
      </Card>

      {/* Reviews Section */}
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          {reviews.length > 0 ? (
            <article className="flex flex-col gap-4">
              {reviews.map(
                (
                  { reviewerName, reviewerEmail, comment, date, rating },
                  index
                ) => (
                  <div key={reviewerEmail}>
                    <article className="flex flex-col gap-4">
                      <header className="flex items-center gap-2">
                        <Avatar>
                          <AvatarFallback>
                            {getInitials(reviewerName)}
                          </AvatarFallback>
                        </Avatar>
                        <h1>{reviewerName}</h1>
                        <Separator
                          className="h-6 w-[.125rem]"
                          orientation="vertical"
                        />
                        <p>{reviewerEmail}</p>
                        <Separator
                          className="h-6 w-[.125rem]"
                          orientation="vertical"
                        />
                        <p>{new Date(date).toDateString()}</p>
                      </header>
                      <section className="flex gap-2 items-center">
                        <Rating rating={rating} />
                        <p>{comment}</p>
                      </section>
                    </article>
                    {index !== reviews.length - 1 && <Separator />}
                  </div>
                )
              )}
            </article>
          ) : (
            <h2>No reviews available</h2>
          )}
        </CardContent>
      </Card>
    </article>
  );
}
