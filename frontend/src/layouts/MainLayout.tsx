import {
  Outlet,
  Link as RouterLink,
  useNavigate,
  useLocation,
} from 'react-router-dom'
import {
  Box,
  Flex,
  HStack,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useDisclosure,
  Stack,
  Text,
  Container,
  useColorModeValue,
  useColorMode,
  Avatar,
  Icon,
  Divider,
  Tooltip,
  Badge,
  Image,
} from '@chakra-ui/react'
import {
  HamburgerIcon,
  CloseIcon,
  SunIcon,
  MoonIcon,
  ChevronDownIcon,
} from '@chakra-ui/icons'
import {
  FaHome,
  FaDumbbell,
  FaCalendarCheck,
  FaClipboardList,
  FaUserFriends,
  FaUserCircle,
  FaSignOutAlt,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaYoutube,
} from 'react-icons/fa'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { UserRole } from '../types'

// Create motion components
const MotionBox = motion(Box)
const MotionFlex = motion(Flex)

// Get icons for navigation items
const getNavIcon = (to: string) => {
  switch (to) {
    case '/':
      return FaHome
    case '/classes':
      return FaDumbbell
    case '/my-bookings':
      return FaCalendarCheck
    case '/admin/classes':
      return FaClipboardList
    case '/admin/instructors':
      return FaUserFriends
    case '/instructor/classes':
      return FaCalendarCheck
    default:
      return FaHome
  }
}

// Navigation items based on user role
const getNavItems = (role: UserRole | undefined) => {
  const commonItems = [{ label: 'Home', to: '/dashboard' }]

  if (!role) return commonItems

  switch (role) {
    case UserRole.ADMIN:
      return [
        { label: 'Dashboard', to: '/admin/dashboard' },
        { label: 'Manage Classes', to: '/admin/classes' },
        { label: 'Manage Instructors', to: '/admin/instructors' },
      ]
    case UserRole.INSTRUCTOR:
      return [
        { label: 'Dashboard', to: '/instructor/dashboard' },
        { label: 'My Classes', to: '/instructor/classes' },
      ]
    case UserRole.USER:
      return [
        { label: 'Dashboard', to: '/user/dashboard' },
        { label: 'Browse Classes', to: '/classes' },
        { label: 'My Bookings', to: '/my-bookings' },
      ]
    default:
      return commonItems
  }
}

const MainLayout = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { colorMode, toggleColorMode } = useColorMode()
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const navItems = getNavItems(user?.role)
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('neutral.100', 'gray.700')
  const highlightColor = useColorModeValue('brand.500', 'brand.400')
  const secondaryTextColor = useColorModeValue('neutral.600', 'neutral.300')
  const footerBgColor = useColorModeValue('neutral.50', 'gray.900')

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
          <IconButton
            size="md"
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label="Open Menu"
            display={{ md: 'none' }}
            onClick={isOpen ? onClose : onOpen}
            variant="ghost"
          />

          <HStack spacing={4} alignItems="center">
            <MotionBox
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
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
            </MotionBox>

            <HStack
              as="nav"
              spacing={1}
              display={{ base: 'none', md: 'flex' }}
              ml={6}
            >
              {navItems.map((item) => {
                const isActive = location.pathname === item.to
                const NavIcon = getNavIcon(item.to)

                return (
                  <Tooltip
                    key={item.to}
                    label={item.label}
                    placement="bottom"
                    hasArrow
                  >
                    <Button
                      as={RouterLink}
                      to={item.to}
                      variant="ghost"
                      px={4}
                      py={2}
                      fontWeight={isActive ? '600' : 'normal'}
                      color={isActive ? highlightColor : secondaryTextColor}
                      position="relative"
                      _hover={{
                        bg: 'transparent',
                        color: highlightColor,
                        _after: {
                          transform: 'scaleX(1)',
                          bg: highlightColor,
                        },
                      }}
                      _after={{
                        content: '""',
                        position: 'absolute',
                        bottom: '0',
                        left: '0',
                        right: '0',
                        height: '2px',
                        bg: isActive ? highlightColor : 'transparent',
                        transform: isActive ? 'scaleX(1)' : 'scaleX(0)',
                        transformOrigin: 'left',
                        transition: 'transform 0.3s ease',
                      }}
                    >
                      <HStack spacing={2}>
                        <Icon as={NavIcon} boxSize={4} />
                        <Text>{item.label}</Text>
                      </HStack>
                    </Button>
                  </Tooltip>
                )
              })}
            </HStack>
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

            <Menu>
              <MenuButton
                as={Button}
                variant="ghost"
                borderRadius="full"
                px={2}
                _hover={{ bg: useColorModeValue('neutral.100', 'gray.700') }}
              >
                <HStack spacing={2}>
                  <Avatar
                    size="sm"
                    name={user?.name || 'User'}
                    bg="brand.500"
                    color="white"
                  />
                  <Text display={{ base: 'none', md: 'block' }}>
                    {user?.name || 'User'}
                  </Text>
                  <ChevronDownIcon />
                </HStack>
              </MenuButton>

              <MenuList
                shadow="lg"
                borderColor={borderColor}
                borderRadius="xl"
                overflow="hidden"
                py={2}
              >
                <Box
                  px={4}
                  pt={1}
                  pb={3}
                  mb={2}
                  borderBottom="1px solid"
                  borderColor={borderColor}
                >
                  <Text fontWeight="medium">{user?.name}</Text>
                  <Text fontSize="sm" color="neutral.500">
                    {user?.email}
                  </Text>
                  <Badge mt={1} colorScheme="brand">
                    {user?.role}
                  </Badge>
                </Box>

                <MenuItem
                  as={RouterLink}
                  to="/profile"
                  icon={<Icon as={FaUserCircle} color="neutral.500" />}
                  _hover={{ bg: 'brand.50', color: 'brand.500' }}
                >
                  Profile
                </MenuItem>

                <MenuItem
                  onClick={handleLogout}
                  icon={<Icon as={FaSignOutAlt} color="accent.500" />}
                  _hover={{ bg: 'accent.50', color: 'accent.500' }}
                >
                  Logout
                </MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        </Flex>

        {/* Mobile menu */}
        {isOpen && (
          <MotionBox
            display={{ md: 'none' }}
            pb={4}
            bg={bgColor}
            borderTop="1px solid"
            borderColor={borderColor}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
          >
            <Stack as="nav" spacing={1} px={2} py={3}>
              {navItems.map((item) => {
                const isActive = location.pathname === item.to
                const NavIcon = getNavIcon(item.to)

                return (
                  <Button
                    key={item.to}
                    as={RouterLink}
                    to={item.to}
                    variant="ghost"
                    justifyContent="flex-start"
                    w="full"
                    py={5}
                    fontWeight={isActive ? 'semibold' : 'normal'}
                    color={isActive ? highlightColor : secondaryTextColor}
                    bg={isActive ? `brand.50` : 'transparent'}
                    onClick={onClose}
                    leftIcon={<Icon as={NavIcon} boxSize={5} />}
                    borderRadius="md"
                    _hover={{
                      bg: `brand.50`,
                      color: highlightColor,
                    }}
                  >
                    {item.label}
                  </Button>
                )
              })}

              <Divider my={2} />

              <Button
                as={RouterLink}
                to="/profile"
                variant="ghost"
                justifyContent="flex-start"
                w="full"
                py={5}
                leftIcon={
                  <Icon as={FaUserCircle} boxSize={5} color="neutral.500" />
                }
                onClick={onClose}
                borderRadius="md"
                _hover={{
                  bg: 'brand.50',
                  color: 'brand.500',
                }}
              >
                Profile
              </Button>

              <Button
                variant="ghost"
                justifyContent="flex-start"
                w="full"
                py={5}
                leftIcon={
                  <Icon as={FaSignOutAlt} boxSize={5} color="accent.500" />
                }
                onClick={handleLogout}
                borderRadius="md"
                color="neutral.700"
                _hover={{ bg: 'accent.50', color: 'accent.500' }}
              >
                Logout
              </Button>
            </Stack>
          </MotionBox>
        )}
      </Box>

      <Container
        as="main"
        maxW="container.xl"
        pt={{ base: 24, md: 24 }}
        pb={12}
        px={{ base: 4, md: 8 }}
        flex="1"
      >
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
              <HStack spacing={4}>
                <IconButton
                  aria-label="Facebook"
                  icon={<FaFacebook />}
                  size="sm"
                  colorScheme="facebook"
                  borderRadius="full"
                />
                <IconButton
                  aria-label="Twitter"
                  icon={<FaTwitter />}
                  size="sm"
                  colorScheme="twitter"
                  borderRadius="full"
                />
                <IconButton
                  aria-label="Instagram"
                  icon={<FaInstagram />}
                  size="sm"
                  colorScheme="pink"
                  borderRadius="full"
                />
                <IconButton
                  aria-label="YouTube"
                  icon={<FaYoutube />}
                  size="sm"
                  colorScheme="red"
                  borderRadius="full"
                />
              </HStack>
            </Box>

            <Stack
              direction={{ base: 'column', md: 'row' }}
              spacing={{ base: 8, md: 16 }}
              align={{ base: 'flex-start', md: 'flex-start' }}
            >
              <Box>
                <Text fontWeight="bold" fontSize="lg" mb={4}>
                  Quick Links
                </Text>
                <Stack spacing={2}>
                  <RouterLink to="/">
                    <Text
                      color={secondaryTextColor}
                      _hover={{ color: highlightColor }}
                      transition="color 0.2s"
                    >
                      Home
                    </Text>
                  </RouterLink>
                  <RouterLink to="/classes">
                    <Text
                      color={secondaryTextColor}
                      _hover={{ color: highlightColor }}
                      transition="color 0.2s"
                    >
                      Classes
                    </Text>
                  </RouterLink>
                  <RouterLink to="/profile">
                    <Text
                      color={secondaryTextColor}
                      _hover={{ color: highlightColor }}
                      transition="color 0.2s"
                    >
                      Profile
                    </Text>
                  </RouterLink>
                </Stack>
              </Box>

              <Box>
                <Text fontWeight="bold" fontSize="lg" mb={4}>
                  Support
                </Text>
                <Stack spacing={2}>
                  <RouterLink to="/terms">
                    <Text
                      color={secondaryTextColor}
                      _hover={{ color: highlightColor }}
                      transition="color 0.2s"
                    >
                      Terms & Conditions
                    </Text>
                  </RouterLink>
                  <RouterLink to="/privacy">
                    <Text
                      color={secondaryTextColor}
                      _hover={{ color: highlightColor }}
                      transition="color 0.2s"
                    >
                      Privacy Policy
                    </Text>
                  </RouterLink>
                  <Text
                    color={secondaryTextColor}
                    _hover={{ color: highlightColor }}
                    transition="color 0.2s"
                    cursor="pointer"
                  >
                    Contact Us
                  </Text>
                </Stack>
              </Box>
            </Stack>
          </Flex>

          <Divider my={6} />

          <Flex
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

export default MainLayout
