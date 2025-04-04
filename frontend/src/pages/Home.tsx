import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Image,
  SimpleGrid,
  Stack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { UserRole } from '../types'

const Home = () => {
  const { user } = useAuth()
  const bgGradient = useColorModeValue(
    'linear(to-r, teal.400, blue.500)',
    'linear(to-r, teal.600, blue.700)'
  )
  const cardBg = useColorModeValue('white', 'gray.800')
  const cardBorder = useColorModeValue('gray.200', 'gray.700')

  const getActions = () => {
    if (!user) return []

    const actions = []

    switch (user.role) {
      case UserRole.ADMIN:
        actions.push({
          title: 'Manage Classes',
          description: 'Create, edit, and delete fitness classes.',
          link: '/admin/classes',
          linkText: 'Manage Classes',
        })
        break
      case UserRole.INSTRUCTOR:
        actions.push({
          title: 'My Classes',
          description: 'View and manage your assigned classes.',
          link: '/instructor/classes',
          linkText: 'View My Classes',
        })
        break
      case UserRole.USER:
        actions.push({
          title: 'Browse Classes',
          description: 'Explore and book available fitness classes.',
          link: '/classes',
          linkText: 'Browse Classes',
        })
        actions.push({
          title: 'My Bookings',
          description: 'View your booked classes and schedule.',
          link: '/my-bookings',
          linkText: 'View Bookings',
        })
        break
    }

    return actions
  }

  const actions = getActions()

  return (
    <Container maxW="container.xl" pt={{ base: 8, md: 12 }}>
      <Stack spacing={12}>
        {/* Hero Section */}
        <Box
          borderRadius="xl"
          overflow="hidden"
          position="relative"
          height={{ base: '300px', md: '400px' }}
          mb={8}
        >
          <Box
            position="absolute"
            top={0}
            left={0}
            right={0}
            bottom={0}
            bgGradient={bgGradient}
            zIndex={1}
          />
          {/* Background image could be added here */}
          <Flex
            position="relative"
            zIndex={2}
            height="100%"
            align="center"
            px={{ base: 6, md: 10 }}
          >
            <Stack maxW="600px" spacing={4} color="white">
              <Heading size="2xl">Welcome to FitBook</Heading>
              <Text fontSize="xl">
                Your one-stop platform for booking and managing fitness classes
              </Text>
              {user && (
                <Text fontSize="lg">
                  Hello, {user.name}! Logged in as {user.role.toLowerCase()}.
                </Text>
              )}
            </Stack>
          </Flex>
        </Box>

        {/* Actions Grid */}
        {actions.length > 0 && (
          <Box>
            <Heading as="h2" size="lg" mb={6}>
              Quick Actions
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
              {actions.map((action, index) => (
                <Box
                  key={index}
                  p={6}
                  borderRadius="lg"
                  bg={cardBg}
                  borderWidth="1px"
                  borderColor={cardBorder}
                  boxShadow="md"
                  transition="transform 0.2s, box-shadow 0.2s"
                  _hover={{ transform: 'translateY(-4px)', boxShadow: 'lg' }}
                >
                  <Heading as="h3" size="md" mb={3}>
                    {action.title}
                  </Heading>
                  <Text mb={4}>{action.description}</Text>
                  <Button
                    as={RouterLink}
                    to={action.link}
                    colorScheme="teal"
                    size="md"
                  >
                    {action.linkText}
                  </Button>
                </Box>
              ))}
            </SimpleGrid>
          </Box>
        )}

        {/* Features Section */}
        <Box>
          <Heading as="h2" size="lg" mb={6}>
            Our Features
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
            <Feature
              title="Browse Classes"
              text="Explore a variety of fitness classes and find what suits your schedule."
              iconUrl="https://img.icons8.com/fluency/96/null/search.png"
            />
            <Feature
              title="Easy Booking"
              text="Book your favorite classes with just a few clicks, no hassle."
              iconUrl="https://img.icons8.com/fluency/96/null/calendar.png"
            />
            <Feature
              title="Track Progress"
              text="Keep track of your fitness journey and class attendance."
              iconUrl="https://img.icons8.com/fluency/96/null/combo-chart.png"
            />
          </SimpleGrid>
        </Box>
      </Stack>
    </Container>
  )
}

const Feature = ({
  title,
  text,
  iconUrl,
}: {
  title: string
  text: string
  iconUrl: string
}) => {
  return (
    <Stack align="center" textAlign="center">
      <Image src={iconUrl} alt={title} boxSize="60px" mb={2} />
      <Text fontWeight="bold" fontSize="lg">
        {title}
      </Text>
      <Text color="gray.600">{text}</Text>
    </Stack>
  )
}

export default Home
