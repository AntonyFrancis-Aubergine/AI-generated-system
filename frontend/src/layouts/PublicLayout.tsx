import { Outlet, Link as RouterLink } from 'react-router-dom'
import {
  Box,
  Flex,
  HStack,
  IconButton,
  Button,
  Container,
  useColorModeValue,
  useColorMode,
  Icon,
  Text,
} from '@chakra-ui/react'
import { SunIcon, MoonIcon } from '@chakra-ui/icons'
import { FaDumbbell } from 'react-icons/fa'

const PublicLayout = () => {
  const { colorMode, toggleColorMode } = useColorMode()

  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('neutral.100', 'gray.700')
  const footerBgColor = useColorModeValue('neutral.50', 'gray.900')
  const secondaryTextColor = useColorModeValue('neutral.600', 'neutral.300')

  return (
    <Box minH="100vh" display="flex" flexDirection="column">
      <Box
        as="header"
        position="fixed"
        w="100%"
        bg={bgColor}
        boxShadow="md"
        borderBottom="1px"
        borderStyle="solid"
        borderColor={borderColor}
        px={4}
        zIndex={100}
      >
        <Flex
          h={16}
          alignItems="center"
          justifyContent="space-between"
          maxW="container.xl"
          mx="auto"
        >
          <HStack spacing={4} alignItems="center">
            <RouterLink to="/">
              <Flex align="center">
                <Box
                  bg="brand.500"
                  color="white"
                  fontSize="xl"
                  fontWeight="bold"
                  p={1}
                  borderRadius="md"
                  mr={2}
                >
                  <Icon as={FaDumbbell} boxSize={6} />
                </Box>
                <Text
                  fontWeight="bold"
                  fontSize="xl"
                  bgGradient="linear(to-r, brand.500, accent.500)"
                  bgClip="text"
                >
                  FitBook
                </Text>
              </Flex>
            </RouterLink>
          </HStack>

          <Flex alignItems="center" gap={3}>
            <IconButton
              aria-label={`Toggle ${
                colorMode === 'light' ? 'Dark' : 'Light'
              } Mode`}
              icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
              onClick={toggleColorMode}
              variant="ghost"
              borderRadius="full"
              _hover={{ bg: useColorModeValue('neutral.100', 'gray.700') }}
            />

            <HStack spacing={3}>
              <Button
                as={RouterLink}
                to="/login"
                variant="ghost"
                fontWeight="medium"
                _hover={{ bg: 'transparent', color: 'brand.500' }}
              >
                Login
              </Button>
              <Button
                as={RouterLink}
                to="/register"
                colorScheme="brand"
                fontWeight="medium"
              >
                Sign Up
              </Button>
            </HStack>
          </Flex>
        </Flex>
      </Box>

      <Container as="main" maxW="full" p={0} pb={12} flex="1">
        <Outlet />
      </Container>

      <Box
        as="footer"
        py={8}
        borderTop="1px"
        borderStyle="solid"
        borderColor={borderColor}
        bg={footerBgColor}
      >
        <Container maxW="container.xl" px={{ base: 4, md: 8 }}>
          <Flex
            direction={{ base: 'column', md: 'row' }}
            justify="space-between"
            gap={8}
          >
            <Box maxW={{ md: '300px' }}>
              <Flex align="center" mb={4}>
                <Box
                  bg="brand.500"
                  color="white"
                  fontSize="xl"
                  fontWeight="bold"
                  p={1}
                  borderRadius="md"
                  mr={2}
                >
                  <Icon as={FaDumbbell} boxSize={5} />
                </Box>
                <Text
                  fontWeight="bold"
                  fontSize="xl"
                  bgGradient="linear(to-r, brand.500, accent.500)"
                  bgClip="text"
                >
                  FitBook
                </Text>
              </Flex>
              <Text color={secondaryTextColor} mb={4}>
                Your complete fitness platform for booking classes, tracking
                progress, and achieving your health goals.
              </Text>
            </Box>

            <HStack spacing={8} align="flex-start">
              <Box>
                <Text fontWeight="bold" fontSize="lg" mb={4}>
                  Quick Links
                </Text>
                <Flex direction="column" gap={2}>
                  <RouterLink to="/login">
                    <Text
                      color={secondaryTextColor}
                      _hover={{ color: 'brand.500' }}
                      transition="color 0.2s"
                    >
                      Login
                    </Text>
                  </RouterLink>
                  <RouterLink to="/register">
                    <Text
                      color={secondaryTextColor}
                      _hover={{ color: 'brand.500' }}
                      transition="color 0.2s"
                    >
                      Sign Up
                    </Text>
                  </RouterLink>
                </Flex>
              </Box>

              <Box>
                <Text fontWeight="bold" fontSize="lg" mb={4}>
                  Legal
                </Text>
                <Flex direction="column" gap={2}>
                  <RouterLink to="/terms">
                    <Text
                      color={secondaryTextColor}
                      _hover={{ color: 'brand.500' }}
                      transition="color 0.2s"
                    >
                      Terms & Conditions
                    </Text>
                  </RouterLink>
                  <RouterLink to="/privacy">
                    <Text
                      color={secondaryTextColor}
                      _hover={{ color: 'brand.500' }}
                      transition="color 0.2s"
                    >
                      Privacy Policy
                    </Text>
                  </RouterLink>
                </Flex>
              </Box>
            </HStack>
          </Flex>

          <Flex
            borderTop="1px solid"
            borderColor={borderColor}
            mt={6}
            pt={6}
            direction={{ base: 'column', md: 'row' }}
            justifyContent="space-between"
            alignItems="center"
          >
            <Text fontSize="sm" color="neutral.500">
              &copy; {new Date().getFullYear()} FitBook. All rights reserved.
            </Text>
            <Text fontSize="sm" color="neutral.500" mt={{ base: 2, md: 0 }}>
              Designed for fitness enthusiasts
            </Text>
          </Flex>
        </Container>
      </Box>
    </Box>
  )
}

export default PublicLayout
