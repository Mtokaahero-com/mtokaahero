"use client";

import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  expectedProfileProps,
  ValidationAuthProps,
} from "@/types/foreignTypes";
import Loading from "@/components/ui/loading";

export default function Component() {
  const [authToken, setAuthToken] = useState<string | undefined>(
    Cookies.get("customerToken"),
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const response = await fetch(
      "https://goose-merry-mollusk.ngrok-free.app/api/customer",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      },
    );
    const data: expectedProfileProps = await response.json();
    console.log(data);
    if (data.httpStatus === 201) {
      Cookies.set("customerToken", data.token);
      setAuthToken(data.token);
    } else {
      console.log(data);
    }
  };

  const ValidateAuthToken = async (): Promise<ValidationAuthProps> => {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await fetch(
          "https://goose-merry-mollusk.ngrok-free.app/api/auth/validate",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken}`,
            },
          },
        );
        const data: ValidationAuthProps = await response.json();
        console.log(data);
        if (data.statusCode === 200) {
          resolve(data);
        } else if (data.statusCode === 401) {
          Cookies.remove("customerToken");
        }
      } catch (error) {
        reject("An error occurred while validating the token");
        console.log(error);
      }
    });
  };

  useEffect(() => {
    if (authToken) {
      setLoading(true);
      ValidateAuthToken()
        .then((data) => {
          console.log(data);
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authToken]);

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
              href="/auth/customers/signin"
              className="font-medium text-primary hover:text-primary/90"
              prefetch={true}
            >
              sign in to your account
            </Link>
          </p>
        </div>
        <form className="space-y-6" action="#" method="POST">
          <div>
            <Label
              htmlFor="firstName"
              className="block text-sm font-medium text-muted-foreground"
            >
              First Name
            </Label>
            <div className="mt-1">
              <Input
                id="firstName"
                name="firstName"
                type="text"
                autoComplete="off"
                required
                className="block w-full appearance-none rounded-md border border-input bg-background px-3 py-2 placeholder-muted-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm focus-visible:ring-primary focus-visible:ring-1 focus-visible:ring-offset-0"
              />
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
