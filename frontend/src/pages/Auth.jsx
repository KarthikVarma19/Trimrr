import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Login from "@/components/Login";
import Signup from "@/components/Signup";
import { UrlState } from "@/Context/context";

const Auth = () => {
  const [searchParams] = useSearchParams();
  const longLink = searchParams.get("createNew");
  const navigate = useNavigate();

  const { loading, isAuthenticated } = UrlState();

  useEffect(() => {
    if (isAuthenticated && !loading) {
      navigate(`/dashboard?${longLink ? `createNew=${longLink}` : ""}`);
    }
  }, [loading, isAuthenticated]);

  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-8 py-16 sm:py-24">
      <div className="text-center">
        <h1 className="font-serif text-4xl tracking-tight sm:text-5xl">
          {longLink ? "Let's log you in first" : "Welcome to Trimrr"}
        </h1>
        <p className="mt-3 text-muted-foreground">
          {longLink
            ? "Your link is ready — sign in and we'll finish shortening it."
            : "Log in or create an account to manage and track your links."}
        </p>
      </div>

      <Tabs defaultValue="login" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Log in</TabsTrigger>
          <TabsTrigger value="signup">Sign up</TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <Login />
        </TabsContent>
        <TabsContent value="signup">
          <Signup />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Auth;
