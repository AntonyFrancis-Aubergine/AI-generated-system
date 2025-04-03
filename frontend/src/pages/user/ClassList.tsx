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
} from '@chakra-ui/react'
import { SearchIcon } from '@chakra-ui/icons'
import { format } from 'date-fns'
import { fitnessClassService, categoryService } from '../../services/api'
import { FitnessClass, FitnessClassFilters, Category } from '../../types'
import { useNavigate } from 'react-router-dom'

const ClassList = () => {
  const [classes, setClasses] = useState<FitnessClass[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true)
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

  return (
    <Container maxW="container.xl">
      <Stack spacing={8}>
        <Box>
          <Heading as="h1" size="xl" mb={2}>
            Available Fitness Classes
          </Heading>
          <Text color="gray.600">
            Browse and book available fitness classes
          </Text>
        </Box>

        <Box as="form" onSubmit={handleSearch}>
          <Stack spacing={4} direction={{ base: 'column', md: 'row' }}>
            <FormControl>
              <FormLabel>Search</FormLabel>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <SearchIcon color="gray.400" />
                </InputLeftElement>
                <Input
                  placeholder="Search by class name"
                  value={filters.name || ''}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, name: e.target.value }))
                  }
                />
              </InputGroup>
            </FormControl>

            <FormControl maxW={{ md: '200px' }}>
              <FormLabel>Category</FormLabel>
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
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </Select>
            </FormControl>

            <FormControl maxW={{ md: '200px' }}>
              <FormLabel>Instructor</FormLabel>
              <Select
                placeholder="All Instructors"
                value={filters.instructorId || ''}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    instructorId: e.target.value || undefined,
                  }))
                }
              >
                {/* Instructors would be populated dynamically */}
                <option value="instructor1">John Doe</option>
                <option value="instructor2">Jane Smith</option>
              </Select>
            </FormControl>

            <FormControl alignSelf="flex-end">
              <Button colorScheme="teal" type="submit">
                Filter
              </Button>
            </FormControl>
          </Stack>
        </Box>

        {isLoading ? (
          <Flex justifyContent="center" py={10}>
            <Spinner size="xl" color="teal.500" />
          </Flex>
        ) : error ? (
          <Box
            textAlign="center"
            p={5}
            borderRadius="md"
            bg="red.50"
            color="red.500"
          >
            {error}
          </Box>
        ) : classes.length === 0 ? (
          <Box textAlign="center" p={10} borderRadius="md" bg="gray.50">
            <Text fontSize="lg">
              No classes found. Try adjusting your filters.
            </Text>
          </Box>
        ) : (
          <Grid
            templateColumns={{
              base: '1fr',
              md: 'repeat(2, 1fr)',
              lg: 'repeat(3, 1fr)',
            }}
            gap={6}
          >
            {classes.map((fitnessClass) => (
              <Card
                key={fitnessClass.id}
                boxShadow="md"
                borderRadius="lg"
                overflow="hidden"
              >
                <CardHeader bg="teal.50" pb={2}>
                  <Heading size="md">{fitnessClass.name}</Heading>
                  {fitnessClass.category && (
                    <Badge colorScheme="teal" mt={1}>
                      {fitnessClass.category.name}
                    </Badge>
                  )}
                </CardHeader>

                <CardBody pt={3}>
                  <Stack spacing={2}>
                    <Text>
                      <strong>Instructor:</strong>{' '}
                      {fitnessClass.instructor?.name || 'Not specified'}
                    </Text>
                    <Text>
                      <strong>Starts at:</strong>{' '}
                      {formatDateTime(fitnessClass.startsAt)}
                    </Text>
                    <Text>
                      <strong>Ends at:</strong>{' '}
                      {formatDateTime(fitnessClass.endsAt)}
                    </Text>
                  </Stack>
                </CardBody>

                <Divider />

                <CardFooter>
                  <Stack spacing={2} width="100%">
                    <Button
                      colorScheme="teal"
                      onClick={() => handleBookClass(fitnessClass.id)}
                      isLoading={bookingInProgress === fitnessClass.id}
                    >
                      Book Now
                    </Button>
                    <Button
                      variant="outline"
                      colorScheme="teal"
                      onClick={() => handleViewDetails(fitnessClass.id)}
                    >
                      View Details
                    </Button>
                  </Stack>
                </CardFooter>
              </Card>
            ))}
          </Grid>
        )}

        {/* Pagination */}
        {!isLoading && !error && classes.length > 0 && (
          <Flex justifyContent="center" mt={8}>
            <Stack direction="row" spacing={2}>
              <Button
                onClick={() => handleChangePage(filters.page! - 1)}
                isDisabled={filters.page === 1}
                variant="outline"
              >
                Previous
              </Button>
              <Text alignSelf="center">
                Page {filters.page} of {totalPages}
              </Text>
              <Button
                onClick={() => handleChangePage(filters.page! + 1)}
                isDisabled={filters.page === totalPages}
                variant="outline"
              >
                Next
              </Button>
            </Stack>
          </Flex>
        )}
      </Stack>
    </Container>
  )
}

export default ClassList
