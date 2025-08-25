"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import axios from 'axios';
interface User {
  id: string
  email: string
  name: string
  role: "patient" | "doctor" | "ngo" | "hospital" | "admin" | "government"
}

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, role: string, name: string) => Promise<void>
  signOut: () => void
  resetPassword: (email: string) => Promise<void>
  //switchRole: (role: string) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const checkSession = async () => {
        const token = localStorage.getItem("x-auth-token");
        if (token) {
            try {
                // Make a GET request to your backend's endpoint to validate the token
                const userResponse = await axios.get('http://localhost:5000/api/auth/me', {
                    headers: { 'x-auth-token': token },
                });
                
                const user = userResponse.data;
                setUser(user);
                localStorage.setItem("healthscope_user", JSON.stringify(user));

            } catch (error) {
                // If the token is invalid or expired, remove it and log the user out
                console.error("Session expired or invalid token.");
                localStorage.removeItem("x-auth-token");
                localStorage.removeItem("healthscope_user");
                setUser(null);
            }
        }
        setLoading(false);
    };
    
    checkSession();
}, []);

  const signIn = async (email: string, password: string) => {
  try {
    const response = await axios.post('http://localhost:5000/api/auth/login', {
      email,
      password,
    });

    const { token } = response.data;
    localStorage.setItem('x-auth-token', token); // Store the token
    
    // You'll need to fetch user data with the token
    const userResponse = await axios.get('http://localhost:5000/api/auth/me', {
      headers: { 'x-auth-token': token },
    });
    
    const user = userResponse.data;
    setUser(user);
    localStorage.setItem('healthscope_user', JSON.stringify(user));

    toast({
      title: "Welcome back!",
      description: "You have successfully signed in.",
    });

    router.push(`/dashboard/${user.role}`);
  } catch (error: any) {
    // Handle specific errors from the backend
    toast({
      title: "Sign-in failed.",
      description: error.response?.data?.msg || "An unexpected error occurred.",
      variant: "destructive",
    });
    throw error;
  }
};

  const signUp = async (email: string, password: string, role: string, name: string) => {
  try {
    const response = await axios.post('http://localhost:5000/api/auth/register', {
      email,
      password,
      role,
      name,
    });

    const { token } = response.data;
    localStorage.setItem('x-auth-token', token);

    // Fetch user data after successful registration
    const userResponse = await axios.get('http://localhost:5000/api/auth/me', {
      headers: { 'x-auth-token': token },
    });
    
    const user = userResponse.data;
    setUser(user);
    localStorage.setItem('healthscope_user', JSON.stringify(user));

    toast({
      title: "Account created!",
      description: "Welcome to HealthScope AI.",
    });

    router.push(`/dashboard/${user.role}`);
  } catch (error: any) {
    toast({
      title: "Sign-up failed.",
      description: error.response?.data?.msg || "An unexpected error occurred.",
      variant: "destructive",
    });
    throw error;
  }
};

  const signOut = () => {
    setUser(null);
    localStorage.removeItem("healthscope_user");
    localStorage.removeItem("x-auth-token"); // Add this line
    router.push("/");
    
    toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
    });
};

  const resetPassword = async (email: string) => {
    // Mock API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    toast({
      title: "Reset link sent",
      description: "Check your email for password reset instructions.",
    })
  }

 /* const switchRole = (role: string) => {
    if (user) {
      const updatedUser = { ...user, role: role as User["role"] }
      setUser(updatedUser)
      localStorage.setItem("healthscope_user", JSON.stringify(updatedUser))
      router.push(`/dashboard/${role}`)

      toast({
        title: "Role switched",
        description: `Now viewing as ${role}`,
      })
    }
  }*/

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signOut,
        resetPassword,
        //switchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
