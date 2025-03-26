"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import Swal from 'sweetalert2'
import { auth } from "@/lib/firebase"
import axios from "axios"
import { 
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  setPersistence,
  browserLocalPersistence 
} from "firebase/auth"

export default function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const router = useRouter()
  const [onBoardStatus, setOnBoardStatus] = useState(false)

  useEffect(()=>{
    if(window!=null){
      setOnBoardStatus(localStorage.getItem("onboard") === "true")
    }
  }, [])

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      // Set persistence based on remember me checkbox
      await setPersistence(auth, browserLocalPersistence)
      
      // Sign in with email and password
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const user = userCredential.user
      
      // Update user's login time
      await updateLoginTime(user.uid)

      if(onBoardStatus){
        router.push("/dashboard")
      } else {
        router.push("/onboarding")
      }
      
    } catch (error: any) {
      console.error(error)
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: error.message || 'Invalid email or password',
      })
    }
  }
  
  async function signInWithGoogle() {
    const provider = new GoogleAuthProvider()
    
    try {
      await setPersistence(auth, browserLocalPersistence)
      const userCredential = await signInWithPopup(auth, provider)
      const user = userCredential.user
      
      // Update user's login time
      await updateLoginTime(user.uid)
      
      if(onBoardStatus){
        router.push("/dashboard")
      } else {
        router.push("/onboarding")
      }
    } catch (error: any) {
      console.error(error)
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: error.message || 'Failed to sign in with Google',
      })
    }
  }
  
async function updateLoginTime(uid: string) {
  try {
    const response = await axios.get(`/api/login-user?uid=${uid}`);

    if (response.status !== 200) {
      console.log('Failed to update login time:', response);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to update login time'
      });
      return false;
    }
    
    //return true;
    let checkIfUserOnboarded = await axios.get("/api/user/freelance-data/retrieve?uid="+uid)
    if(checkIfUserOnboarded.status!==200){
      throw new Error("Failed to check if user onboarded", checkIfUserOnboarded.data.error)
    }
    if(checkIfUserOnboarded.data!==null && checkIfUserOnboarded.data!==undefined){
      localStorage.setItem("onboard", "true")
    }
    return true;
  } catch (error) {
    console.error('Error: ', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Failed to update login time'
    });
    return false;
  }
}

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-sm">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Login To Your Account</h1>
          <p className="mt-2 text-gray-600">Welcome Back</p>
        </div>

        <Button
          variant="outline"
          className="w-full flex items-center justify-center gap-2 border-2"
          onClick={() => signInWithGoogle()}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Continue with Google
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">OR</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>

          <div className="flex items-start">
            <Checkbox
              id="remember"
              checked={rememberMe}
              onCheckedChange={(checked) => setRememberMe(checked as boolean)}
              className="mt-1"
            />
            <label htmlFor="remember" className="ml-2 text-sm text-gray-600">
              Remember me
            </label>
          </div>

          <Button type="submit" className="w-full bg-[#6C5CE7] hover:bg-[#6C5CE7]/90">
            Login
          </Button>
        </form>

        <p className="text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link href="/signup" className="text-[#6C5CE7] hover:underline">
            Sign Up Here
          </Link>
        </p>
      </div>
    </div>
  )
}