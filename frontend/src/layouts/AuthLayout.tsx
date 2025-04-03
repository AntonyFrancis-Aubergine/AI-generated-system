import { Outlet, Link } from 'react-router-dom'
import {
  Box,
  Flex,
  Container,
  Heading,
  useColorModeValue,
  IconButton,
  useColorMode,
} from '@chakra-ui/react'
import { SunIcon, MoonIcon } from '@chakra-ui/icons'

const AuthLayout = () => {
  const { colorMode, toggleColorMode } = useColorMode()

  return (
    <Box minH="100vh" bg={useColorModeValue('gray.50', 'gray.900')}>
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
          <Link to="/">
            <Heading
              size="xl"
              mb={2}
              color={useColorModeValue('teal.600', 'teal.300')}
            >
              FitBook
            </Heading>
          </Link>
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
