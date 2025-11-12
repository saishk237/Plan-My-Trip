import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import type { SignupRequest, LoginRequest } from "@shared/schema";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: any, token: string) => void;
}

export function AuthModal({ isOpen, onClose, onAuthSuccess }: AuthModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [signupErrors, setSignupErrors] = useState<Record<string, string>>({});

  const [signupData, setSignupData] = useState<SignupRequest>({
    email: "",
    name: "",
    username: "",
    password: "",
  });

  const [loginData, setLoginData] = useState<LoginRequest>({
    email: "",
    password: "",
  });

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSignupErrors({});

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signupData),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle Zod validation errors
        if (data.details && Array.isArray(data.details)) {
          const errors: Record<string, string> = {};
          data.details.forEach((err: any) => {
            const field = err.path[0];
            errors[field] = err.message;
          });
          setSignupErrors(errors);
          
          toast({
            title: "Validation Error",
            description: "Please check the form fields and try again.",
            variant: "destructive",
          });
        } else {
          throw new Error(data.error || "Signup failed");
        }
        return;
      }

      toast({
        title: "Account created!",
        description: "Please log in with your new account.",
      });

      // Reset form
      setSignupData({ email: "", name: "", username: "", password: "" });
      setSignupErrors({});
    } catch (error) {
      toast({
        title: "Signup failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      // Store token in localStorage
      localStorage.setItem("auth-token", data.token);
      
      toast({
        title: "Welcome back!",
        description: `Logged in as ${data.user.username}`,
      });

      onAuthSuccess(data.user, data.token);
      onClose();
      
      // Dispatch custom event to notify App component
      window.dispatchEvent(new Event('auth-change'));
    } catch (error) {
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Welcome to TripCraft</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="space-y-4">
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="login-email">Email</Label>
                <Input
                  id="login-email"
                  type="email"
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="login-password">Password</Label>
                <Input
                  id="login-password"
                  type="password"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Log In"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup" className="space-y-4">
            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <Label htmlFor="signup-name">
                  Full Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="signup-name"
                  type="text"
                  placeholder="Enter your full name"
                  value={signupData.name}
                  onChange={(e) => {
                    setSignupData({ ...signupData, name: e.target.value });
                    if (signupErrors.name) {
                      setSignupErrors({ ...signupErrors, name: "" });
                    }
                  }}
                  required
                  minLength={2}
                  className={signupErrors.name ? "border-red-500" : ""}
                />
                {signupErrors.name ? (
                  <p className="text-xs text-red-500 mt-1">{signupErrors.name}</p>
                ) : (
                  <p className="text-xs text-muted-foreground mt-1">At least 2 characters</p>
                )}
              </div>
              <div>
                <Label htmlFor="signup-email">
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={signupData.email}
                  onChange={(e) => {
                    setSignupData({ ...signupData, email: e.target.value });
                    if (signupErrors.email) {
                      setSignupErrors({ ...signupErrors, email: "" });
                    }
                  }}
                  required
                  className={signupErrors.email ? "border-red-500" : ""}
                />
                {signupErrors.email && (
                  <p className="text-xs text-red-500 mt-1">{signupErrors.email}</p>
                )}
              </div>
              <div>
                <Label htmlFor="signup-username">
                  Username <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="signup-username"
                  type="text"
                  placeholder="Choose a username"
                  value={signupData.username}
                  onChange={(e) => {
                    setSignupData({ ...signupData, username: e.target.value });
                    if (signupErrors.username) {
                      setSignupErrors({ ...signupErrors, username: "" });
                    }
                  }}
                  required
                  minLength={3}
                  className={signupErrors.username ? "border-red-500" : ""}
                />
                {signupErrors.username ? (
                  <p className="text-xs text-red-500 mt-1">{signupErrors.username}</p>
                ) : (
                  <p className="text-xs text-muted-foreground mt-1">At least 3 characters</p>
                )}
              </div>
              <div>
                <Label htmlFor="signup-password">
                  Password <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="signup-password"
                  type="password"
                  placeholder="Create a strong password"
                  value={signupData.password}
                  onChange={(e) => {
                    setSignupData({ ...signupData, password: e.target.value });
                    if (signupErrors.password) {
                      setSignupErrors({ ...signupErrors, password: "" });
                    }
                  }}
                  required
                  minLength={6}
                  className={signupErrors.password ? "border-red-500" : ""}
                />
                {signupErrors.password ? (
                  <p className="text-xs text-red-500 mt-1">{signupErrors.password}</p>
                ) : (
                  <p className="text-xs text-muted-foreground mt-1">At least 6 characters</p>
                )}
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating account..." : "Sign Up"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}


