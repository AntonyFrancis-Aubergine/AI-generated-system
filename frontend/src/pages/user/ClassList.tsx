import { useState, useEffect } from 'react'
import {
  Box,
  Button,
  Container,
  Flex,
  Grid,
  Heading,
  Text,
  Input,
  Select,
  Stack,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Badge,
  Divider,
  useToast,
  FormControl,
  FormLabel,
  InputGroup,
  InputLeftElement,
  Spinner,
  useColorModeValue,
  Icon,
  SimpleGrid,
  Tag,
  HStack,
} from '@chakra-ui/react'
import { SearchIcon } from '@chakra-ui/icons'
import { format } from 'date-fns'
import { motion } from 'framer-motion'
import {
  fitnessClassService,
  categoryService,
  userService,
} from '../../services/api'
import { FitnessClass, FitnessClassFilters, Category, User } from '../../types'
import { useNavigate } from 'react-router-dom'
import { FaCalendarAlt, FaClock, FaUser } from 'react-icons/fa'

// Create motion components
const MotionBox = motion(Box)
const MotionCard = motion(Card)
const MotionContainer = motion(Container)

const ClassList = () => {
  const [classes, setClasses] = useState<FitnessClass[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [instructors, setInstructors] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true)
  const [isInstructorsLoading, setIsInstructorsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<FitnessClassFilters>({
    page: 1,
    limit: 10,
    name: '',
  })
  const [totalPages, setTotalPages] = useState(1)
  const [bookingInProgress, setBookingInProgress] = useState<string | null>(
    null
  )
  const toast = useToast()
  const navigate = useNavigate()

  // Color mode values
  const cardBg = useColorModeValue('white', 'gray.800')
  const textColor = useColorModeValue('neutral.800', 'white')
  const secondaryTextColor = useColorModeValue('neutral.600', 'neutral.300')
  const headerBg = useColorModeValue('brand.50', 'brand.900')
  const errorBg = useColorModeValue('red.50', 'rgba(200, 50, 50, 0.2)')
  const emptyBg = useColorModeValue('neutral.50', 'gray.700')
  const borderColor = useColorModeValue('neutral.100', 'gray.700')

  const fetchCategories = async () => {
    try {
      setIsCategoriesLoading(true)
      const response = await categoryService.getCategories()
      if (response.success) {
        setCategories(response.data.data)
      }
    } catch (err) {
      console.error('Failed to fetch categories:', err)
    } finally {
      setIsCategoriesLoading(false)
    }
  }

  const fetchInstructors = async () => {
    try {
      setIsInstructorsLoading(true)
      const response = await userService.getInstructors()
      if (response.success) {
        setInstructors(response.data.data)
      }
    } catch (err) {
      console.error('Failed to fetch instructors:', err)
    } finally {
      setIsInstructorsLoading(false)
    }
  }

  const fetchClasses = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await fitnessClassService.getClasses(filters)

      if (response.success) {
        setClasses(response.data.data)
        setTotalPages(response.data.meta.totalPages)
      } else {
        setError(response.message)
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to fetch classes'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
    fetchInstructors()
  }, [])

  useEffect(() => {
    fetchClasses()
  }, [filters])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Reset to first page when searching
    setFilters((prev) => ({ ...prev, page: 1 }))
  }

  const handleBookClass = async (classId: string) => {
    try {
      setBookingInProgress(classId)
      const response = await fitnessClassService.bookClass(classId)

      if (response.success) {
        toast({
          title: 'Class booked!',
          description: 'You have successfully booked this class.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        })
        // Refresh the class list
        fetchClasses()
      } else {
        toast({
          title: 'Booking failed',
          description: response.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
        })
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to book class'
      toast({
        title: 'Error',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setBookingInProgress(null)
    }
  }

  const handleViewDetails = (classId: string) => {
    navigate(`/classes/${classId}`)
  }

  const formatDateTime = (dateString: string) => {
    return format(new Date(dateString), 'MMM dd, yyyy h:mm a')
  }

  const handleChangePage = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setFilters((prev) => ({ ...prev, page: newPage }))
    }
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: 'easeOut',
      },
    }),
  }

  return (
    <MotionContainer
      maxW="container.xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Stack spacing={8}>
        <MotionBox
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Heading
            as="h1"
            size="xl"
            mb={2}
            bgGradient="linear(to-r, brand.500, accent.500)"
            bgClip="text"
          >
            Available Fitness Classes
          </Heading>
          <Text color={secondaryTextColor}>
            Browse and book available fitness classes to start your fitness
            journey
          </Text>
        </MotionBox>

        <Box
          as="form"
          onSubmit={handleSearch}
          p={5}
          borderRadius="xl"
          bg={useColorModeValue('white', 'gray.800')}
          boxShadow="sm"
          borderWidth="1px"
          borderColor={borderColor}
        >
          <Stack spacing={4} direction={{ base: 'column', md: 'row' }}>
            <FormControl>
              <FormLabel fontWeight="medium">Search Classes</FormLabel>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <SearchIcon color="brand.500" />
                </InputLeftElement>
                <Input
                  placeholder="Search by class name"
                  value={filters.name || ''}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, name: e.target.value }))
                  }
                  borderColor={borderColor}
                  _focus={{
                    borderColor: 'brand.500',
                    boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)',
                  }}
                />
              </InputGroup>
            </FormControl>

            <FormControl maxW={{ md: '200px' }}>
              <FormLabel fontWeight="medium">Category</FormLabel>
              <Select
                placeholder="All Categories"
                value={filters.categoryId || ''}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    categoryId: e.target.value || undefined,
                  }))
                }
                isDisabled={isCategoriesLoading}
                borderColor={borderColor}
                _focus={{
                  borderColor: 'brand.500',
                  boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)',
                }}
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </Select>
            </FormControl>

            <FormControl maxW={{ md: '200px' }}>
              <FormLabel fontWeight="medium">Instructor</FormLabel>
              <Select
                placeholder="All Instructors"
                value={filters.instructorId || ''}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    instructorId: e.target.value || undefined,
                  }))
                }
                isDisabled={isInstructorsLoading}
                borderColor={borderColor}
                _focus={{
                  borderColor: 'brand.500',
                  boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)',
                }}
              >
                {instructors.map((instructor) => (
                  <option key={instructor.id} value={instructor.id}>
                    {instructor.name}
                  </option>
                ))}
              </Select>
            </FormControl>

            <FormControl alignSelf="flex-end">
              <Button
                colorScheme="brand"
                type="submit"
                _hover={{ transform: 'translateY(-2px)', boxShadow: 'md' }}
                transition="all 0.2s"
              >
                Filter Classes
              </Button>
            </FormControl>
          </Stack>
        </Box>

        {isLoading ? (
          <Flex justifyContent="center" py={10}>
            <Spinner size="xl" color="brand.500" thickness="4px" />
          </Flex>
        ) : error ? (
          <Box
            textAlign="center"
            p={5}
            borderRadius="lg"
            bg={errorBg}
            color="red.500"
          >
            {error}
          </Box>
        ) : classes.length === 0 ? (
          <Box
            textAlign="center"
            p={10}
            borderRadius="lg"
            bg={emptyBg}
            borderWidth="1px"
            borderColor={borderColor}
          >
            <Text fontSize="lg" color={secondaryTextColor}>
              No classes found. Try adjusting your filters.
            </Text>
          </Box>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
            {classes.map((fitnessClass, index) => (
              <MotionCard
                key={fitnessClass.id}
                custom={index}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                boxShadow="md"
                borderRadius="lg"
                overflow="hidden"
                borderWidth="1px"
                borderColor={borderColor}
                bg={cardBg}
                transition="all 0.3s"
                _hover={{
                  transform: 'translateY(-5px)',
                  boxShadow: 'lg',
                }}
              >
                <CardHeader bg={headerBg} pb={2}>
                  <Heading size="md" color="brand.700">
                    {fitnessClass.name}
                  </Heading>
                  <HStack mt={2} spacing={2}>
                    {fitnessClass.category && (
                      <Badge
                        colorScheme="brand"
                        px={2}
                        py={1}
                        borderRadius="full"
                      >
                        {fitnessClass.category.name}
                      </Badge>
                    )}
                    <Tag
                      size="sm"
                      colorScheme="accent"
                      borderRadius="full"
                      px={2}
                    >
                      Limited spots
                    </Tag>
                  </HStack>
                </CardHeader>

                <CardBody pt={3}>
                  <Stack spacing={3}>
                    <HStack>
                      <Icon as={FaUser} color="accent.500" />
                      <Text color={textColor}>
                        <Text as="span" fontWeight="medium">
                          Instructor:
                        </Text>{' '}
                        {fitnessClass.instructor?.name || 'Not specified'}
                      </Text>
                    </HStack>
                    <HStack>
                      <Icon as={FaCalendarAlt} color="brand.500" />
                      <Text color={textColor}>
                        <Text as="span" fontWeight="medium">
                          Starts at:
                        </Text>{' '}
                        {formatDateTime(fitnessClass.startsAt)}
                      </Text>
                    </HStack>
                    <HStack>
                      <Icon as={FaClock} color="brand.500" />
                      <Text color={textColor}>
                        <Text as="span" fontWeight="medium">
                          Ends at:
                        </Text>{' '}
                        {formatDateTime(fitnessClass.endsAt)}
                      </Text>
                    </HStack>
                  </Stack>
                </CardBody>

                <Divider borderColor={borderColor} />

                <CardFooter>
                  <Stack spacing={2} width="100%">
                    <Button
                      colorScheme="brand"
                      onClick={() => handleBookClass(fitnessClass.id)}
                      isLoading={bookingInProgress === fitnessClass.id}
                      _hover={{ transform: 'translateY(-2px)' }}
                      transition="all 0.2s"
                    >
                      Book Now
                    </Button>
                    <Button
                      variant="outline"
                      colorScheme="brand"
                      onClick={() => handleViewDetails(fitnessClass.id)}
                      _hover={{
                        bg: 'brand.50',
                      }}
                    >
                      View Details
                    </Button>
                  </Stack>
                </CardFooter>
              </MotionCard>
            ))}
          </SimpleGrid>
        )}

        {/* Pagination */}
        {!isLoading && !error && classes.length > 0 && (
          <Flex justifyContent="center" mt={8}>
            <Stack direction="row" spacing={2} align="center">
              <Button
                onClick={() => handleChangePage(filters.page! - 1)}
                isDisabled={filters.page === 1}
                variant="outline"
                colorScheme="brand"
                size="md"
                borderRadius="full"
              >
                Previous
              </Button>
              <Text color={secondaryTextColor} fontWeight="medium" mx={2}>
                Page {filters.page} of {totalPages}
              </Text>
              <Button
                onClick={() => handleChangePage(filters.page! + 1)}
                isDisabled={filters.page === totalPages}
                variant="outline"
                colorScheme="brand"
                size="md"
                borderRadius="full"
              >
                Next
              </Button>
            </Stack>
          </Flex>
        )}
      </Stack>
    </MotionContainer>
  )
}

export default ClassList
