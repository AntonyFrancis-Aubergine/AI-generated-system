import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Text,
  Stack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Spinner,
  Link,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Collapse,
  useDisclosure,
  HStack,
  IconButton,
  Divider,
} from '@chakra-ui/react'
import {
  SearchIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  CloseIcon,
} from '@chakra-ui/icons'
import { format } from 'date-fns'
import { bookingService } from '../../services/api'
import { Booking } from '../../types'

const BookingList = () => {
  const navigate = useNavigate()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')
  const [statusFilter, setStatusFilter] = useState<string>('')
  const { isOpen: isFilterOpen, onToggle: toggleFilter } = useDisclosure({
    defaultIsOpen: false,
  })
  const [isFiltersApplied, setIsFiltersApplied] = useState(false)

  const fetchBookings = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await bookingService.getBookings(
        page,
        10,
        startDate,
        endDate
      )

      if (response.success) {
        let filteredBookings = response.data.data

        // Client-side filtering by class name (until backend supports it)
        if (searchTerm) {
          filteredBookings = filteredBookings.filter((booking) =>
            booking.fitnessClass?.name
              .toLowerCase()
              .includes(searchTerm.toLowerCase())
          )
        }

        // Client-side filtering by status
        if (statusFilter) {
          const now = new Date()
          filteredBookings = filteredBookings.filter((booking) => {
            if (!booking.fitnessClass) return false
            const isCompleted = new Date(booking.fitnessClass.endsAt) < now
            return statusFilter === 'completed' ? isCompleted : !isCompleted
          })
        }

        setBookings(filteredBookings)
        setTotalPages(response.data.meta.totalPages)
      } else {
        setError(response.message)
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        (err instanceof Error ? err.message : 'Failed to fetch bookings')
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchBookings()
  }, [page])

  useEffect(() => {
    // Check if any filters are applied
    setIsFiltersApplied(
      !!searchTerm || !!startDate || !!endDate || !!statusFilter
    )
  }, [searchTerm, startDate, endDate, statusFilter])

  const formatDateTime = (dateString: string) => {
    return format(new Date(dateString), 'MMM dd, yyyy h:mm a')
  }

  const handleChangePage = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage)
    }
  }

  // Determine if a class is in the past
  const isClassPast = (endsAt: string) => {
    return new Date(endsAt) < new Date()
  }

  const handleViewDetails = (classId: string) => {
    navigate(`/classes/${classId}`)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1) // Reset to first page when search criteria change
    fetchBookings()
  }

  const clearFilters = () => {
    setSearchTerm('')
    setStartDate('')
    setEndDate('')
    setStatusFilter('')
    setPage(1)
    fetchBookings()
  }

  return (
    <Container maxW="container.xl">
      <Stack spacing={8}>
        <Box>
          <Heading as="h1" size="xl" mb={2}>
            My Bookings
          </Heading>
          <Text color="gray.600">View all your booked fitness classes</Text>
        </Box>

        {/* Search Bar and Filter Toggle */}
        <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
          <InputGroup maxW={{ base: '100%', md: '400px' }}>
            <InputLeftElement pointerEvents="none">
              <SearchIcon color="gray.400" />
            </InputLeftElement>
            <Input
              placeholder="Search by class name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch(e)}
            />
            {searchTerm && (
              <IconButton
                icon={<CloseIcon />}
                size="sm"
                aria-label="Clear search"
                position="absolute"
                right="2"
                top="50%"
                transform="translateY(-50%)"
                zIndex="1"
                variant="ghost"
                onClick={() => {
                  setSearchTerm('')
                  setPage(1)
                  fetchBookings()
                }}
              />
            )}
          </InputGroup>

          <HStack>
            {isFiltersApplied && (
              <Button
                colorScheme="red"
                variant="outline"
                size="sm"
                leftIcon={<CloseIcon />}
                onClick={clearFilters}
              >
                Clear Filters
              </Button>
            )}
            <Button
              rightIcon={isFilterOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
              onClick={toggleFilter}
              colorScheme="teal"
              variant="outline"
              size="sm"
            >
              Filters
            </Button>
          </HStack>
        </Flex>

        {/* Collapsible Filter Section */}
        <Collapse in={isFilterOpen} animateOpacity>
          <Box
            p={4}
            bg="gray.50"
            borderRadius="md"
            borderWidth="1px"
            borderColor="gray.200"
            mb={4}
          >
            <form onSubmit={handleSearch}>
              <Stack spacing={4}>
                <Flex direction={{ base: 'column', md: 'row' }} gap={4}>
                  <FormControl>
                    <FormLabel>Status</FormLabel>
                    <Select
                      placeholder="All Bookings"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option value="upcoming">Upcoming</option>
                      <option value="completed">Completed</option>
                    </Select>
                  </FormControl>

                  <FormControl>
                    <FormLabel>Start Date</FormLabel>
                    <Input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>End Date</FormLabel>
                    <Input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </FormControl>
                </Flex>

                <Flex justify="flex-end">
                  <Button colorScheme="teal" type="submit">
                    Apply Filters
                  </Button>
                </Flex>
              </Stack>
            </form>
          </Box>
        </Collapse>

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
        ) : bookings.length === 0 ? (
          <Box textAlign="center" p={10} borderRadius="md" bg="gray.50">
            <Text fontSize="lg">You haven't booked any classes yet.</Text>
            <Button
              colorScheme="teal"
              mt={4}
              onClick={() => navigate('/classes')}
            >
              Browse Classes
            </Button>
          </Box>
        ) : (
          <Box overflowX="auto">
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Class Name</Th>
                  <Th>Category</Th>
                  <Th>Instructor</Th>
                  <Th>Date & Time</Th>
                  <Th>Status</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {bookings.map((booking) => (
                  <Tr key={booking.id}>
                    <Td fontWeight="medium">{booking.fitnessClass?.name}</Td>
                    <Td>{booking.fitnessClass?.category?.name}</Td>
                    <Td>{booking.fitnessClass?.instructor?.name}</Td>
                    <Td>
                      {booking.fitnessClass && (
                        <Stack spacing={0}>
                          <Text>
                            {formatDateTime(booking.fitnessClass.startsAt)}
                          </Text>
                          <Text color="gray.500" fontSize="sm">
                            to {formatDateTime(booking.fitnessClass.endsAt)}
                          </Text>
                        </Stack>
                      )}
                    </Td>
                    <Td>
                      {booking.fitnessClass && (
                        <Badge
                          colorScheme={
                            isClassPast(booking.fitnessClass.endsAt)
                              ? 'gray'
                              : 'green'
                          }
                        >
                          {isClassPast(booking.fitnessClass.endsAt)
                            ? 'Completed'
                            : 'Upcoming'}
                        </Badge>
                      )}
                    </Td>
                    <Td>
                      {booking.fitnessClass && (
                        <Button
                          size="sm"
                          colorScheme="teal"
                          variant="outline"
                          onClick={() =>
                            handleViewDetails(booking.fitnessClass!.id)
                          }
                        >
                          View Details
                        </Button>
                      )}
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        )}

        {/* Pagination */}
        {!isLoading && !error && bookings.length > 0 && (
          <Flex justifyContent="center" mt={8}>
            <Stack direction="row" spacing={2}>
              <Button
                onClick={() => handleChangePage(page - 1)}
                isDisabled={page === 1}
                variant="outline"
              >
                Previous
              </Button>
              <Text alignSelf="center">
                Page {page} of {totalPages}
              </Text>
              <Button
                onClick={() => handleChangePage(page + 1)}
                isDisabled={page === totalPages}
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

export default BookingList
