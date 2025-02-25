import { formatPrice } from "@/lib/utils";
import { useState } from "react";
import { Slider } from "./slider";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "./button";
import { SlidersHorizontal } from "lucide-react";
import { Label } from "./label";

export default function Filters({
  minPrice,
  maxPrice,
  onPriceChange,
  onSortingChanged,
}: {
  minPrice: number;
  maxPrice: number;
  onPriceChange: (value: number[]) => void;
  onSortingChanged: (value: string) => void;
}) {
  const [value, setValue] = useState([minPrice, maxPrice]);

  function onValueChange(value: number[]) {
    setValue(value);
    onPriceChange(value);
  }

  function onSortChange(value: string) {
    console.log(value);
    onSortingChanged(value);
  }

  function clearFilters() {
    setValue([minPrice, maxPrice]);
    onPriceChange([minPrice, maxPrice]);
    onSortChange("");
  }

  const maxValue = Math.round(maxPrice);
  return (
    <Popover>
      <PopoverTrigger>
        <Button variant={"ghost"}>
          <SlidersHorizontal />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full -translate-x-4">
        <section className="flex flex-col gap-4">
          <section>
            <Select onValueChange={onSortChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sort Products By" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup className="w-full">
                  <SelectLabel>Sort Prooducts By</SelectLabel>
                  <SelectItem value="low">Price: Low to High</SelectItem>
                  <SelectItem value="high">Price: High to Low</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </section>
          <section className="flex flex-col gap-2"  >
            <Label>Price Range</Label>
            <section className="grid gap-2 grid-cols-[auto_1fr_auto]">
              <span>{formatPrice(value[0])}</span>
              <Slider
                // className="w-1/4"
                className="min-w-[250px]"
                max={maxValue}
                step={1}
                value={value}
                onValueChange={onValueChange}
              />
              <span>{formatPrice(value[1])}</span>
            </section>
          </section>

          <Button onClick={clearFilters}>Clear FIlters</Button>
        </section>
      </PopoverContent>
    </Popover>
  );
}
