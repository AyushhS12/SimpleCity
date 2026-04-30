import { useCallback, useEffect, useState, type ChangeEvent, type FormEvent, type JSX } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import {
  Mail,
  Lock,
  User,
  ArrowRight,
  ArrowLeft,
  Globe,
  CircleCheck,
  CircleX,
  Text,
} from "lucide-react"
import axios from "axios"
import { toast } from "react-hot-toast"
import { usePlayerContext } from "../context/usePlayerContext"
import type { Player } from "../utils/models"

interface AuthForm {
  name: string
  username: string
  email: string
  password: string
}

const Auth = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { setPlayer } = usePlayerContext()

  const [isSignup, setIsSignup] = useState<boolean>(
    location.state?.signup ?? false
  )

  const [form, setForm] = useState<AuthForm>({
    name: "",
    username: "",
    email: "",
    password: "",
  })

  const [focused, setFocused] = useState<string | null>(null)

  const [particles, setParticles] = useState<
    Array<{ left: string; top: string; delay: string; opacity: number }>
  >([])

  /* -------------------- handlers -------------------- */

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    if (!["name","username", "email", "password"].includes(name)) {
      return
    }

    setForm(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const toastId = toast.loading("Please wait...")

    try {
      if (isSignup) {
        await signup(toastId)
      } else {
        await login(toastId)
      }
    } catch {
      toast.error("Something went wrong", {
        id: toastId,
        icon: <CircleX className="text-red-500" />,
      })
    }
  }

  /* -------------------- API calls -------------------- */

  const login = useCallback(async (toastId: string) => {
    const { email, password } = form

    if (!email || !password) {
      toast.error("Email and password required", { id: toastId })
      return
    }

    try {
      const res = await axios.post<{ success: boolean, player: Player }>(
        "http://localhost:7878/auth/login",
        { email, password },
        { withCredentials: true }
      )

      if (res.data.success) {
        toast.success("Login successful", {
          id: toastId,
          icon: <CircleCheck className="text-green-500" />,
        })
        if (!setPlayer) {
          toast.error("An error occurred", { id: toastId, icon: <CircleX className="text-red-500" />, })
          return
        }
        setPlayer(res.data.player)
        navigate("/world")
      } else {
        toast.error("Invalid credentials", {
          id: toastId,
          icon: <CircleX className="text-red-500" />,
        })
      }
    } catch (e) {
      toast.success("Invalid Credentials", {
          id: toastId,
          icon: <CircleX className="text-red-500" />,
      })
      console.log(e)
    }
  }, [form, navigate, setPlayer])

  const signup = useCallback(async (toastId: string) => {
    const { name, username, email, password } = form

    if (!name || !username || !email || !password) {
      toast.error("All fields are required", { id: toastId })
      return
    }

    const res = await axios.post<{ success: boolean }>(
      "http://localhost:7878/auth/signup",
      { name,username, email, password },
      { withCredentials: true }
    )

    if (res.data.success) {
      toast.success("Account created", {
        id: toastId,
        icon: <CircleCheck className="text-green-500" />,
      })
      setIsSignup(false)
    } else {
      toast.error("Signup failed", {
        id: toastId,
        icon: <CircleX className="text-red-500" />,
      })
    }
  }, [form])

  /* -------------------- effects -------------------- */

  useEffect(() => {
    const p = [...Array(30)].map(() => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      delay: `${Math.random() * 5}s`,
      opacity: Math.random() * 0.5 + 0.2,
    }))
    const f = () => {
      setParticles(p)
    }
    f()
  }, [])

  /* -------------------- UI -------------------- */

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center relative overflow-hidden p-4">
      {/* particles */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map((p, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              left: p.left,
              top: p.top,
              animationDelay: p.delay,
              opacity: p.opacity,
            }}
          />
        ))}
      </div>

      {/* back */}
      <Link
        to="/"
        className="absolute top-8 left-8 text-white/70 hover:text-cyan-400 flex items-center gap-2"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Universe
      </Link>

      {/* card */}
      <div className="w-full max-w-md z-10">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
          {/* header */}
          <div className="text-center mb-8">
            <div className="inline-flex bg-linear-to-br from-cyan-500 to-blue-600 p-3 rounded-xl mb-4">
              <Globe className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white">
              {isSignup ? "Join the Metaverse" : "Welcome Back"}
            </h1>
            <p className="text-white/60">
              {isSignup
                ? "Create your virtual identity"
                : "Enter your credentials"}
            </p>
          </div>

          {/* toggle */}
          <div className="flex bg-black/20 rounded-xl p-1 mb-6 relative">
            <div
              className={`absolute top-1 bottom-1 w-1/2 bg-white/10 rounded-lg transition-transform ${isSignup ? "translate-x-full" : ""
                }`}
            />
            <button
              type="button"
              onClick={() => setIsSignup(false)}
              className="flex-1 z-10 py-2 text-white"
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setIsSignup(true)}
              className="flex-1 z-10 py-2 text-white"
            >
              Sign Up
            </button>
          </div>

          {/* form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignup && (
              <Input
                icon={<User />}
                name="username"
                placeholder="Username"
                value={form.username}
                onChange={handleChange}
                focused={focused}
                setFocused={setFocused}
              />
            )}

            {isSignup && <Input
              icon={<Text />}
              name="name"
              type="text"
              placeholder="Enter Your Name"
              value={form.name}
              onChange={handleChange}
              focused={focused}
              setFocused={setFocused}
            />}

            <Input
              icon={<Mail />}
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              focused={focused}
              setFocused={setFocused}
            />

            <Input
              icon={<Lock />}
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              focused={focused}
              setFocused={setFocused}
            />

            <button className="w-full py-4 bg-linear-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-bold flex items-center justify-center gap-2">
              {isSignup ? "Create Account" : "Sign In"}
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          {/* footer */}
          <p className="text-center text-white/40 mt-6">
            {isSignup ? "Already have an account?" : "No account yet?"}{" "}
            <button
              onClick={() => setIsSignup(!isSignup)}
              className="text-cyan-400 font-semibold"
            >
              {isSignup ? "Sign In" : "Sign Up"}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Auth

/* -------------------- reusable input -------------------- */

interface InputProps {
  icon: JSX.Element
  name: string
  type?: string
  placeholder: string
  value: string
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  focused: string | null
  setFocused: (v: string | null) => void
}

const Input = ({
  icon,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  focused,
  setFocused,
}: InputProps) => (
  <div
    className={`relative bg-black/20 rounded-xl border transition-colors ${focused === name ? "border-cyan-400/50" : "border-white/10"
      }`}
  >
    <div className="absolute left-4 top-3.5 text-white/40">{icon}</div>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      onFocus={() => setFocused(name)}
      onBlur={() => setFocused(null)}
      className="w-full bg-transparent text-white px-12 py-3.5 outline-none"
    />
  </div>
)
