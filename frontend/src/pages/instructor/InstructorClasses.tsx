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
  useToast,
} from '@chakra-ui/react'
import { format } from 'date-fns'
import { instructorService } from '../../services/api'
import { FitnessClass } from '../../types'

const InstructorClasses = () => {
  const [classes, setClasses] = useState<FitnessClass[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const toast = useToast()

  const fetchInstructorClasses = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await instructorService.getInstructorClasses(page, 10)

      if (response.success) {
        setClasses(response.data.data)
        setTotalPages(response.data.meta.totalPages)
      } else {
        setError(response.message)
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to fetch your classes'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchInstructorClasses()
  }, [page])

  const formatDateTime = (dateString: string) => {
    return format(new Date(dateString), 'MMM dd, yyyy h:mm a')
  }

  const handleChangePage = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage)
    }
  }

  // Check if a class is in the past, present, or future
  const getClassStatus = (startsAt: string, endsAt: string) => {
    const now = new Date()
    const startDate = new Date(startsAt)
    const endDate = new Date(endsAt)

    if (endDate < now) {
      return { label: 'Completed', color: 'gray' }
    } else if (startDate <= now && endDate >= now) {
      return { label: 'In Progress', color: 'green' }
    } else {
      return { label: 'Upcoming', color: 'blue' }
    }
  }

  return (
    <Container maxW="container.xl">
      <Stack spacing={8}>
        <Box>
          <Heading as="h1" size="xl" mb={2}>
            My Classes
          </Heading>
          <Text color="gray.600">
            View all the fitness classes you're teaching
          </Text>
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
            <Text fontSize="lg">You don't have any assigned classes yet.</Text>
          </Box>
        ) : (
          <Box overflowX="auto">
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Class Name</Th>
                  <Th>Category</Th>
                  <Th>Date & Time</Th>
                  <Th>Status</Th>
                  <Th>Bookings</Th>
                </Tr>
              </Thead>
              <Tbody>
                {classes.map((fitnessClass) => {
                  const status = getClassStatus(
                    fitnessClass.startsAt,
                    fitnessClass.endsAt
                  )
                  return (
                    <Tr key={fitnessClass.id}>
                      <Td fontWeight="medium">{fitnessClass.name}</Td>
                      <Td>{fitnessClass.category?.name}</Td>
                      <Td>
                        <Stack spacing={0}>
                          <Text>{formatDateTime(fitnessClass.startsAt)}</Text>
                          <Text color="gray.500" fontSize="sm">
                            to {formatDateTime(fitnessClass.endsAt)}
                          </Text>
                        </Stack>
                      </Td>
                      <Td>
                        <Badge colorScheme={status.color}>{status.label}</Badge>
                      </Td>
                      <Td>
                        {/* This would show number of bookings if available in the API response */}
                        {fitnessClass.bookings?.length || 0} students
                      </Td>
                    </Tr>
                  )
                })}
              </Tbody>
            </Table>
          </Box>
        )}

        {/* Pagination */}
        {!isLoading && !error && classes.length > 0 && (
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

export default InstructorClasses
