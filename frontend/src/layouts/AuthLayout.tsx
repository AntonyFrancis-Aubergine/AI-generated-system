import { Outlet, Link as RouterLink } from 'react-router-dom'
import {
  Box,
  Flex,
  Container,
  Heading,
  useColorModeValue,
  IconButton,
  useColorMode,
  Button,
  Text,
  HStack,
  Icon,
} from '@chakra-ui/react'
import { SunIcon, MoonIcon, ArrowBackIcon } from '@chakra-ui/icons'
import { FaDumbbell } from 'react-icons/fa'

const AuthLayout = () => {
  const { colorMode, toggleColorMode } = useColorMode()
  const brandColor = useColorModeValue('brand.500', 'brand.300')

  return (
    <Box minH="100vh" bg={useColorModeValue('gray.50', 'gray.900')}>
      <Flex position="absolute" top={4} left={4} align="center">
        <Button
          as={RouterLink}
          to="/"
          leftIcon={<ArrowBackIcon />}
          variant="ghost"
          size="sm"
        >
          Back to Home
        </Button>
      </Flex>

      <Flex position="absolute" top={4} right={4}>
        <IconButton
          icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
          onClick={toggleColorMode}
          aria-label={`Toggle ${colorMode === 'light' ? 'Dark' : 'Light'} Mode`}
          variant="ghost"
        />
      </Flex>
      <Container maxW="lg" py={{ base: 12, md: 20 }}>
        <Flex direction="column" align="center" mb={8}>
          <RouterLink to="/">
            <HStack spacing={2} mb={2}>
              <Box bg={brandColor} color="white" p={1} borderRadius="md">
                <Icon as={FaDumbbell} boxSize={6} />
              </Box>
              <Heading
                size="xl"
                color={brandColor}
                bgGradient={`linear(to-r, brand.500, accent.500)`}
                bgClip="text"
              >
                FitBook
              </Heading>
            </HStack>
          </RouterLink>
          <Heading
            size="md"
            textAlign="center"
            fontWeight="normal"
            color={useColorModeValue('gray.600', 'gray.400')}
          >
            Your Fitness Journey Starts Here
          </Heading>
        </Flex>

        <Box
          p={8}
          bg={useColorModeValue('white', 'gray.800')}
          boxShadow="lg"
          borderRadius="xl"
        >
          <Outlet />
        </Box>

        <Flex justify="center" mt={6}>
          <Box
            as="footer"
            textAlign="center"
            fontSize="sm"
            color={useColorModeValue('gray.600', 'gray.400')}
          >
            &copy; {new Date().getFullYear()} FitBook. All rights reserved.
          </Box>
        </Flex>
      </Container>
    </Box>
  )
}

export default AuthLayout
