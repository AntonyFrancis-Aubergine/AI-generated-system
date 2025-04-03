import { useState, useEffect } from 'react'
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
} from '@chakra-ui/react'
import { format } from 'date-fns'
import { bookingService } from '../../services/api'
import { Booking } from '../../types'

const BookingList = () => {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const fetchBookings = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await bookingService.getBookings(page, 10)

      if (response.success) {
        setBookings(response.data.data)
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
  }, [page])

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

  return (
    <Container maxW="container.xl">
      <Stack spacing={8}>
        <Box>
          <Heading as="h1" size="xl" mb={2}>
            My Bookings
          </Heading>
          <Text color="gray.600">View all your booked fitness classes</Text>
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
              onClick={() => (window.location.href = '/classes')}
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
