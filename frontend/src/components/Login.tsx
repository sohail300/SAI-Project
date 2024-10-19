import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Link } from "react-router-dom"
import axios from "axios"
import { useNavigate } from 'react-router-dom';

export default function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault()
    const response = await axios.post("http://localhost:3000/api/user/login", {
      email,
      password
    })
    console.log(response.data)
    localStorage.setItem("token", response.data.token)
    navigate('/');
  }
  return (
    <Card className="w-full max-w-md mx-auto shadow-2xl ">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
        <CardDescription className="text-center">
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
            Log In
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2 text-center">
        <p className="text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link className="text-blue-600 hover:underline" to={'/register'}>
            Sign up
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}