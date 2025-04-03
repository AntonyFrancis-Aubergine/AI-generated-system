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
} from '@chakra-ui/react'
import { SearchIcon } from '@chakra-ui/icons'
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
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to fetch bookings'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchBookings()
  }, [page, startDate, endDate, searchTerm, statusFilter])

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

        {/* Search and Filters */}
        <Box as="form" onSubmit={handleSearch}>
          <Stack spacing={4} direction={{ base: 'column', md: 'row' }} mb={6}>
            <FormControl>
              <FormLabel>Search</FormLabel>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <SearchIcon color="gray.400" />
                </InputLeftElement>
                <Input
                  placeholder="Search by class name"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </FormControl>

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
          </Stack>

          <Stack spacing={4} direction={{ base: 'column', md: 'row' }}>
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
