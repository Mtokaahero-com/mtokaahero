"use client";

import React from "react";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { schemaForms } from "@/app/schemas/schema";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

export default function Component() {
  const formOptions = { resolver: yupResolver(schemaForms) };
  const { register, handleSubmit, formState } = useForm(formOptions);
  const { errors } = formState;

  const handleChange = () => {
    console.log("Form submitted");
  };
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-foreground">
            Create Your Account With Us
          </h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Or{" "}
            <Link
              href="/customers/signin"
              className="font-medium text-primary hover:text-primary/90"
              prefetch={true}
            >
              sign in to your account
            </Link>
          </p>
        </div>
        <form
          className="space-y-6"
          action="#"
          method="POST"
          onSubmit={handleSubmit(handleChange)}
        >
          <div>
            <Label
              htmlFor="firstName"
              className="block text-sm font-medium text-muted-foreground"
            >
              First Name
            </Label>
            <div className="mt-1">
              <Input
                {...register("firstName")}
                id="firstName"
                name="firstName"
                type="text"
                autoComplete="off"
                required
                className="block w-full appearance-none rounded-md border border-input bg-background px-3 py-2 placeholder-muted-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm focus-visible:ring-primary focus-visible:ring-1 focus-visible:ring-offset-0"
              />
              <span>
                {errors.firstName && (
                  <p className="text-red-500 text-xs italic">
                    {errors.firstName.message}
                  </p>
                )}
              </span>
            </div>
          </div>
          <div>
            <Label
              htmlFor="lastName"
              className="block text-sm font-medium text-muted-foreground"
            >
              Last Name
            </Label>
            <div className="mt-1">
              <Input
                {...register("lastName")}
                id="lastName"
                name="lastName"
                type="text"
                autoComplete="off"
                outline-none
                required
                className="block w-full appearance-none rounded-md border border-input bg-background px-3 py-2 placeholder-muted-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm focus-visible:ring-primary focus-visible:ring-1 focus-visible:ring-offset-primary/20 focus-visible:ring-offset-0"
              />
            </div>
          </div>

          <div>
            <Label
              htmlFor="phone"
              className="block text-sm font-medium text-muted-foreground"
            >
              Phone Number
            </Label>
            <div className="mt-1">
              <Input
                {...register("phone")}
                id="phone"
                name="phone"
                type="number"
                autoComplete="off"
                required
                className="block w-full appearance-none rounded-md border border-input bg-background px-3 py-2 placeholder-muted-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm focus-visible:ring-primary focus-visible:ring-1 focus-visible:ring-offset-primary/20 focus-visible:ring-offset-0"
              />
            </div>
          </div>

          <div>
            <Label
              htmlFor="address"
              className="block text-sm font-medium text-muted-foreground"
            >
              Address
            </Label>
            <div className="mt-1">
              <Input
                {...register("address")}
                id="address"
                name="address"
                type="text"
                autoComplete="off"
                required
                className="block w-full appearance-none rounded-md border border-input bg-background px-3 py-2 placeholder-muted-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm focus-visible:ring-primary focus-visible:ring-1 focus-visible:ring-offset-primary/20 focus-visible:ring-offset-0"
              />
            </div>
          </div>
          <div>
            <Label
              htmlFor="email"
              className="block text-sm font-medium text-muted-foreground"
            >
              Email address
            </Label>
            <div className="mt-1">
              <Input
                {...register("email")}
                id="email"
                name="email"
                type="email"
                autoComplete="off"
                required
                className="block w-full appearance-none rounded-md border border-input bg-background px-3 py-2 placeholder-muted-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm focus-visible:ring-primary focus-visible:ring-1 focus-visible:ring-offset-primary/20 focus-visible:ring-offset-0"
              />
            </div>
          </div>
          <div>
            <Label
              htmlFor="password"
              className="block text-sm font-medium text-muted-foreground"
            >
              Password
            </Label>
            <div className="mt-1">
              <Input
                {...register("password")}
                id="password"
                name="password"
                type="password"
                autoComplete="off"
                required
                className="block w-full appearance-none rounded-md border border-input bg-background px-3 py-2 placeholder-muted-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm focus-visible:ring-primary focus-visible:ring-1 focus-visible:ring-offset-primary/20 focus-visible:ring-offset-0"
              />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Checkbox
                id="remember-me"
                name="remember-me"
                className="h-4 w-4 rounded text-primary focus:ring-primary"
              />
              <Label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-muted-foreground"
              >
                Remember me
              </Label>
            </div>
            <div className="text-sm">
              <Link
                href="#"
                className="font-medium text-primary hover:text-primary/90"
                prefetch={false}
              >
                Forgot your password?
              </Link>
            </div>
          </div>
          <div>
            <Button
              type="submit"
              className="flex w-full justify-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              Sign in
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
