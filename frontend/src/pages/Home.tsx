import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Heading, Text, Container, Flex, Spinner } from '@chakra-ui/react'
import { useAuth } from '../context/AuthContext'
import { UserRole } from '../types'

const Home = () => {
  const { user, isLoading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    // If user is logged in, redirect to their role-specific dashboard
    if (user && !isLoading) {
      let redirectPath = '/dashboard'

      switch (user.role) {
        case UserRole.ADMIN:
          redirectPath = '/admin/dashboard'
          break
        case UserRole.INSTRUCTOR:
          redirectPath = '/instructor/dashboard'
          break
        case UserRole.USER:
          redirectPath = '/user/dashboard'
          break
      }

      navigate(redirectPath, { replace: true })
    }
  }, [user, isLoading, navigate])

  if (isLoading) {
    return (
      <Flex justify="center" align="center" minH="60vh">
        <Spinner size="xl" thickness="4px" speed="0.65s" color="brand.500" />
      </Flex>
    )
  }

  return (
    <Container maxW="container.xl" py={10}>
      <Box textAlign="center" py={10}>
        <Heading as="h1" size="xl" mb={6}>
          Welcome to FitBook
        </Heading>
        <Text fontSize="lg">
          Redirecting you to your personalized dashboard...
        </Text>
      </Box>
    </Container>
  )
}

export default Home
