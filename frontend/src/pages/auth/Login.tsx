import { useState } from 'react'
import { useNavigate, Link as RouterLink, useLocation } from 'react-router-dom'
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Link,
  Text,
  FormErrorMessage,
  Alert,
  AlertIcon,
  InputGroup,
  InputRightElement,
  IconButton,
} from '@chakra-ui/react'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuth } from '../../context/AuthContext'
import { LoginRequest, UserRole } from '../../types'

// Login form validation schema
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

type LoginFormData = z.infer<typeof loginSchema>

const Login = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true)
      setError(null)
      await login(data as LoginRequest)

      // Get the user from localStorage after login
      const userString = localStorage.getItem('user')
      if (userString) {
        const user = JSON.parse(userString)

        // Redirect based on user role
        const from = location.state?.from?.pathname

        if (from && from !== '/') {
          // If coming from a specific page, go back there
          navigate(from)
        } else {
          // Otherwise redirect to role-specific dashboard
          switch (user.role) {
            case UserRole.ADMIN:
              navigate('/admin/dashboard')
              break
            case UserRole.INSTRUCTOR:
              navigate('/instructor/dashboard')
              break
            case UserRole.USER:
              navigate('/user/dashboard')
              break
            default:
              navigate('/dashboard')
          }
        }
      } else {
        navigate('/dashboard')
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        (err instanceof Error ? err.message : 'Failed to login')
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={6}>
        <Text fontSize="2xl" fontWeight="bold" textAlign="center">
          Login to Your Account
        </Text>

        {error && (
          <Alert status="error" borderRadius="md">
            <AlertIcon />
            {error}
          </Alert>
        )}

        <FormControl isInvalid={!!errors.email}>
          <FormLabel>Email address</FormLabel>
          <Input
            type="email"
            placeholder="your.email@example.com"
            {...register('email')}
          />
          {errors.email && (
            <FormErrorMessage>{errors.email.message}</FormErrorMessage>
          )}
        </FormControl>

        <FormControl isInvalid={!!errors.password}>
          <FormLabel>Password</FormLabel>
          <InputGroup>
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              {...register('password')}
            />
            <InputRightElement>
              <IconButton
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                onClick={() => setShowPassword(!showPassword)}
                variant="ghost"
                size="sm"
              />
            </InputRightElement>
          </InputGroup>
          {errors.password && (
            <FormErrorMessage>{errors.password.message}</FormErrorMessage>
          )}
        </FormControl>

        <Button
          type="submit"
          colorScheme="teal"
          size="lg"
          isLoading={isLoading}
        >
          Sign In
        </Button>

        <Text textAlign="center">
          Don't have an account?{' '}
          <Link as={RouterLink} to="/register" color="teal.500">
            Register Here
          </Link>
        </Text>
      </Stack>
    </form>
  )
}

export default Login
