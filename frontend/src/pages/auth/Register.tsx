import { useState } from 'react'
import { useNavigate, Link as RouterLink } from 'react-router-dom'
import {
  Box,
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
  Radio,
  RadioGroup,
  InputGroup,
  InputRightElement,
  IconButton,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from '@chakra-ui/react'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuth } from '../../context/AuthContext'
import { RegisterRequest } from '../../types'

// Register form validation schema
const registerSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(
      /[^a-zA-Z0-9]/,
      'Password must contain at least one special character'
    ),
  role: z.enum(['USER', 'INSTRUCTOR']),
  mobile: z.string().optional(),
  address: z.string().optional(),
  dob: z.string().optional(),
})

type RegisterFormData = z.infer<typeof registerSchema>

const Register = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { register: registerUser } = useAuth()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'USER',
    },
  })

  const selectedRole = watch('role')

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setIsLoading(true)
      setError(null)
      await registerUser(data as RegisterRequest)
      navigate('/')
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        (err instanceof Error ? err.message : 'Failed to register')
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={6}>
        <Tabs
          isFitted
          colorScheme="teal"
          onChange={(index) => {
            setValue('role', index === 0 ? 'USER' : 'INSTRUCTOR')
          }}
        >
          <TabList mb={4}>
            <Tab>Register as User</Tab>
            <Tab>Register as Instructor</Tab>
          </TabList>
          <TabPanels>
            <TabPanel p={0}>
              <Text fontSize="md" mb={4} color="gray.600">
                Sign up as a user to book and attend fitness classes.
              </Text>
            </TabPanel>
            <TabPanel p={0}>
              <Text fontSize="md" mb={4} color="gray.600">
                Sign up as an instructor to manage and teach fitness classes.
              </Text>
            </TabPanel>
          </TabPanels>
        </Tabs>

        {error && (
          <Alert status="error" borderRadius="md">
            <AlertIcon />
            {error}
          </Alert>
        )}

        <FormControl isInvalid={!!errors.name}>
          <FormLabel>Full Name</FormLabel>
          <Input placeholder="John Doe" {...register('name')} />
          {errors.name && (
            <FormErrorMessage>{errors.name.message}</FormErrorMessage>
          )}
        </FormControl>

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

        <Box display="none">
          <RadioGroup value={selectedRole}>
            <Radio value="USER" {...register('role')}>
              User
            </Radio>
            <Radio value="INSTRUCTOR" {...register('role')}>
              Instructor
            </Radio>
          </RadioGroup>
        </Box>

        <FormControl isInvalid={!!errors.mobile}>
          <FormLabel>Mobile Number (optional)</FormLabel>
          <Input placeholder="Your mobile number" {...register('mobile')} />
          {errors.mobile && (
            <FormErrorMessage>{errors.mobile.message}</FormErrorMessage>
          )}
        </FormControl>

        <FormControl isInvalid={!!errors.address}>
          <FormLabel>Address (optional)</FormLabel>
          <Input placeholder="Your address" {...register('address')} />
          {errors.address && (
            <FormErrorMessage>{errors.address.message}</FormErrorMessage>
          )}
        </FormControl>

        <FormControl isInvalid={!!errors.dob}>
          <FormLabel>Date of Birth (optional)</FormLabel>
          <Input type="date" {...register('dob')} />
          {errors.dob && (
            <FormErrorMessage>{errors.dob.message}</FormErrorMessage>
          )}
        </FormControl>

        <Button
          type="submit"
          colorScheme="teal"
          size="lg"
          isLoading={isLoading}
        >
          Sign Up
        </Button>

        <Text textAlign="center">
          Already have an account?{' '}
          <Link as={RouterLink} to="/login" color="teal.500">
            Login Here
          </Link>
        </Text>
      </Stack>
    </form>
  )
}

export default Register
