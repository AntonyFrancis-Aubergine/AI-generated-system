import { useState, useEffect } from 'react'
import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  Stack,
  FormControl,
  FormLabel,
  Input,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Spinner,
  Divider,
  useToast,
  Avatar,
} from '@chakra-ui/react'
import { useAuth } from '../../context/AuthContext'
import { userService } from '../../services/api'
import { User } from '../../types'
import { format } from 'date-fns'

const UserProfile = () => {
  const { user: authUser } = useAuth()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const toast = useToast()

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!authUser?.id) return

      try {
        setIsLoading(true)
        setError(null)
        const response = await userService.getUserProfile(authUser.id)

        if (response.success) {
          setUser(response.data)
        } else {
          setError(response.message)
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to fetch user profile'
        setError(errorMessage)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserProfile()
  }, [authUser?.id])

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not provided'

    try {
      return format(new Date(dateString), 'MMMM dd, yyyy')
    } catch (error) {
      return 'Invalid date'
    }
  }

  if (isLoading) {
    return (
      <Container maxW="container.md" py={10}>
        <Flex justifyContent="center" alignItems="center" height="300px">
          <Spinner size="xl" color="teal.500" />
        </Flex>
      </Container>
    )
  }

  if (error || !user) {
    return (
      <Container maxW="container.md" py={10}>
        <Box textAlign="center" p={10} borderRadius="md" bg="red.50">
          <Heading size="md" color="red.500" mb={4}>
            {error || 'User profile not found'}
          </Heading>
        </Box>
      </Container>
    )
  }

  return (
    <Container maxW="container.md" py={10}>
      <Stack spacing={8}>
        <Box>
          <Heading as="h1" size="xl" mb={2}>
            My Profile
          </Heading>
          <Text color="gray.600">View and manage your account information</Text>
        </Box>

        <Card borderRadius="lg" overflow="hidden" boxShadow="md">
          <CardHeader bg="teal.50" p={6}>
            <Flex alignItems="center">
              <Avatar size="xl" name={user.name} mr={6} />
              <Box>
                <Heading size="lg">{user.name}</Heading>
                <Text color="gray.600" mt={1}>
                  {user.role}
                </Text>
              </Box>
            </Flex>
          </CardHeader>

          <CardBody p={6}>
            <Stack spacing={6}>
              <Stack spacing={4}>
                <Heading size="md">Contact Information</Heading>
                <Divider />
                <FormControl>
                  <FormLabel>Email</FormLabel>
                  <Input value={user.email} isReadOnly />
                </FormControl>
                <FormControl>
                  <FormLabel>Mobile Number</FormLabel>
                  <Input value={user.mobile || 'Not provided'} isReadOnly />
                </FormControl>
              </Stack>

              <Stack spacing={4}>
                <Heading size="md">Personal Information</Heading>
                <Divider />
                <FormControl>
                  <FormLabel>Address</FormLabel>
                  <Input value={user.address || 'Not provided'} isReadOnly />
                </FormControl>
                <FormControl>
                  <FormLabel>Date of Birth</FormLabel>
                  <Input value={formatDate(user.dob)} isReadOnly />
                </FormControl>
                <FormControl>
                  <FormLabel>Member Since</FormLabel>
                  <Input value={formatDate(user.createdAt)} isReadOnly />
                </FormControl>
              </Stack>

              <Button colorScheme="teal" isDisabled>
                Edit Profile (Coming Soon)
              </Button>
            </Stack>
          </CardBody>
        </Card>
      </Stack>
    </Container>
  )
}

export default UserProfile
