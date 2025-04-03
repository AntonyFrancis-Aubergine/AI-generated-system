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
  InputGroup,
  InputLeftElement,
  Input,
  Spinner,
  Badge,
} from '@chakra-ui/react'
import { SearchIcon } from '@chakra-ui/icons'
import { adminService } from '../../services/api'
import { User } from '../../types'
import { format } from 'date-fns'

const InstructorManagement = () => {
  const [instructors, setInstructors] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchName, setSearchName] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const fetchInstructors = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await adminService.getAllInstructors(
        page,
        10,
        searchName || undefined
      )

      if (response.success) {
        setInstructors(response.data.data)
        setTotalPages(response.data.meta.totalPages)
      } else {
        setError(response.message)
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to fetch instructors'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchInstructors()
  }, [page])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1) // Reset to first page on search
    fetchInstructors()
  }

  const handleChangePage = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage)
    }
  }

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM dd, yyyy')
  }

  return (
    <Container maxW="container.xl">
      <Stack spacing={8}>
        <Box>
          <Heading as="h1" size="xl" mb={2}>
            Instructors
          </Heading>
          <Text color="gray.600">View and manage all instructors</Text>
        </Box>

        <Box as="form" onSubmit={handleSearch}>
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <SearchIcon color="gray.400" />
            </InputLeftElement>
            <Input
              placeholder="Search by instructor name"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
            />
            <Button type="submit" ml={2} colorScheme="teal">
              Search
            </Button>
          </InputGroup>
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
        ) : instructors.length === 0 ? (
          <Box textAlign="center" p={10} borderRadius="md" bg="gray.50">
            <Text fontSize="lg">No instructors found.</Text>
          </Box>
        ) : (
          <Box overflowX="auto">
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Name</Th>
                  <Th>Email</Th>
                  <Th>Mobile</Th>
                  <Th>Joined</Th>
                  <Th>Classes</Th>
                </Tr>
              </Thead>
              <Tbody>
                {instructors.map((instructor) => (
                  <Tr key={instructor.id}>
                    <Td fontWeight="medium">{instructor.name}</Td>
                    <Td>{instructor.email}</Td>
                    <Td>{instructor.mobile || 'Not provided'}</Td>
                    <Td>{formatDate(instructor.createdAt)}</Td>
                    <Td>
                      <Badge colorScheme="teal">
                        {/* This would show number of classes if available in the API response */}
                        {instructor.classCount || 0} classes
                      </Badge>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        )}

        {/* Pagination */}
        {!isLoading && !error && instructors.length > 0 && (
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

export default InstructorManagement
