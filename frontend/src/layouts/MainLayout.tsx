import { Outlet, Link, useNavigate } from 'react-router-dom'
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
} from '@chakra-ui/react'
import { HamburgerIcon, CloseIcon, SunIcon, MoonIcon } from '@chakra-ui/icons'
import { useAuth } from '../context/AuthContext'
import { UserRole } from '../types'

// Navigation items based on user role
const getNavItems = (role: UserRole | undefined) => {
  const commonItems = [{ label: 'Home', to: '/' }]

  if (!role) return commonItems

  switch (role) {
    case UserRole.ADMIN:
      return [
        ...commonItems,
        { label: 'Manage Classes', to: '/admin/classes' },
        { label: 'Manage Instructors', to: '/admin/instructors' },
      ]
    case UserRole.INSTRUCTOR:
      return [
        ...commonItems,
        { label: 'My Classes', to: '/instructor/classes' },
      ]
    case UserRole.USER:
      return [
        ...commonItems,
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

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const navItems = getNavItems(user?.role)
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  return (
    <Box minH="100vh">
      <Box
        as="header"
        position="fixed"
        w="100%"
        bg={bgColor}
        borderBottom={1}
        borderStyle="solid"
        borderColor={borderColor}
        px={4}
        zIndex={10}
      >
        <Flex h={16} alignItems="center" justifyContent="space-between">
          <IconButton
            size="md"
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label="Open Menu"
            display={{ md: 'none' }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={8} alignItems="center">
            <Box fontWeight="bold" fontSize="xl">
              <Link to="/">FitBook</Link>
            </Box>
            <HStack as="nav" spacing={4} display={{ base: 'none', md: 'flex' }}>
              {navItems.map((item) => (
                <Link key={item.to} to={item.to}>
                  <Button variant="ghost">{item.label}</Button>
                </Link>
              ))}
            </HStack>
          </HStack>
          <Flex alignItems="center">
            <IconButton
              mr={4}
              icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
              onClick={toggleColorMode}
              aria-label={`Toggle ${
                colorMode === 'light' ? 'Dark' : 'Light'
              } Mode`}
              variant="ghost"
            />
            <Menu>
              <MenuButton
                as={Button}
                rounded="full"
                variant="link"
                cursor="pointer"
                minW={0}
              >
                <Text>{user?.name || 'User'}</Text>
              </MenuButton>
              <MenuList>
                <MenuItem as={Link} to="/profile">
                  Profile
                </MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        </Flex>

        {/* Mobile menu */}
        {isOpen && (
          <Box pb={4} display={{ md: 'none' }}>
            <Stack as="nav" spacing={4}>
              {navItems.map((item) => (
                <Link key={item.to} to={item.to} onClick={onClose}>
                  <Button w="full" variant="ghost">
                    {item.label}
                  </Button>
                </Link>
              ))}
            </Stack>
          </Box>
        )}
      </Box>

      <Container as="main" maxW="container.xl" pt={20} pb={10}>
        <Outlet />
      </Container>

      <Box
        as="footer"
        mt="auto"
        py={6}
        borderTop={1}
        borderStyle="solid"
        borderColor={borderColor}
      >
        <Container maxW="container.xl">
          <Flex
            direction={{ base: 'column', md: 'row' }}
            justifyContent="space-between"
            alignItems="center"
          >
            <Text>
              &copy; {new Date().getFullYear()} FitBook. All rights reserved.
            </Text>
            <HStack spacing={4} mt={{ base: 4, md: 0 }}>
              <Link to="/terms">Terms</Link>
              <Link to="/privacy">Privacy</Link>
            </HStack>
          </Flex>
        </Container>
      </Box>
    </Box>
  )
}

export default MainLayout
