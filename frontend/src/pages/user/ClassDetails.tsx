import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Box,
  Container,
  Heading,
  Text,
  Stack,
  Button,
  Flex,
  Badge,
  Divider,
  Card,
  CardBody,
  Spinner,
  useToast,
  Grid,
  GridItem,
  Icon,
  HStack,
} from '@chakra-ui/react'
import {
  ChevronLeftIcon,
  CalendarIcon,
  TimeIcon,
  InfoIcon,
} from '@chakra-ui/icons'
import { format } from 'date-fns'
import { fitnessClassService } from '../../services/api'
import { FitnessClass } from '../../types'

const ClassDetails = () => {
  const { classId } = useParams<{ classId: string }>()
  const navigate = useNavigate()
  const toast = useToast()
  const [fitnessClass, setFitnessClass] = useState<FitnessClass | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isBooking, setIsBooking] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchClassDetails = async () => {
      if (!classId) return

      try {
        setIsLoading(true)
        setError(null)
        const response = await fitnessClassService.getClassById(classId)

        if (response.success) {
          setFitnessClass(response.data)
        } else {
          setError(response.message)
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to fetch class details'
        setError(errorMessage)
      } finally {
        setIsLoading(false)
      }
    }

    fetchClassDetails()
  }, [classId])

  const handleBookClass = async () => {
    if (!classId) return

    try {
      setIsBooking(true)
      const response = await fitnessClassService.bookClass(classId)

      if (response.success) {
        toast({
          title: 'Class booked!',
          description: 'You have successfully booked this class.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        })
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
      setIsBooking(false)
    }
  }

  const formatDateTime = (dateString: string) => {
    return format(new Date(dateString), 'MMM dd, yyyy h:mm a')
  }

  if (isLoading) {
    return (
      <Container maxW="container.md" py={10}>
        <Flex justifyContent="center" alignItems="center" height="300px">
          <Spinner size="xl" color="teal.500" />
        </Flex>
      </Container>
    )
  }

  if (error || !fitnessClass) {
    return (
      <Container maxW="container.md" py={10}>
        <Box textAlign="center" p={10} borderRadius="md" bg="red.50">
          <Heading size="md" color="red.500" mb={4}>
            {error || 'Class not found'}
          </Heading>
          <Button
            leftIcon={<ChevronLeftIcon />}
            colorScheme="teal"
            onClick={() => navigate('/classes')}
          >
            Back to Classes
          </Button>
        </Box>
      </Container>
    )
  }

  return (
    <Container maxW="container.md" py={10}>
      <Button
        leftIcon={<ChevronLeftIcon />}
        variant="ghost"
        mb={4}
        onClick={() => navigate('/classes')}
      >
        Back to Classes
      </Button>

      <Card borderRadius="lg" overflow="hidden" boxShadow="lg">
        <Box bg="teal.50" p={6}>
          <Heading as="h1" size="xl" mb={2}>
            {fitnessClass.name}
          </Heading>

          <HStack spacing={2} mb={2}>
            {fitnessClass.category && (
              <Badge colorScheme="teal" fontSize="sm">
                {fitnessClass.category.name}
              </Badge>
            )}
          </HStack>
        </Box>

        <Divider />

        <CardBody>
          <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={6}>
            <GridItem>
              <Stack spacing={4}>
                <Flex align="center">
                  <Icon as={CalendarIcon} color="teal.500" mr={2} />
                  <Box>
                    <Text fontWeight="bold">Date</Text>
                    <Text>
                      {format(
                        new Date(fitnessClass.startsAt),
                        'EEEE, MMMM dd, yyyy'
                      )}
                    </Text>
                  </Box>
                </Flex>

                <Flex align="center">
                  <Icon as={TimeIcon} color="teal.500" mr={2} />
                  <Box>
                    <Text fontWeight="bold">Time</Text>
                    <Text>
                      {format(new Date(fitnessClass.startsAt), 'h:mm a')} -{' '}
                      {format(new Date(fitnessClass.endsAt), 'h:mm a')}
                    </Text>
                  </Box>
                </Flex>
              </Stack>
            </GridItem>

            <GridItem>
              <Stack spacing={4}>
                <Flex align="center">
                  <Icon as={InfoIcon} color="teal.500" mr={2} />
                  <Box>
                    <Text fontWeight="bold">Instructor</Text>
                    <Text>
                      {fitnessClass.instructor?.name || 'Not specified'}
                    </Text>
                  </Box>
                </Flex>
              </Stack>
            </GridItem>
          </Grid>
        </CardBody>

        <Divider />

        <Box p={6}>
          <Button
            colorScheme="teal"
            size="lg"
            width="100%"
            onClick={handleBookClass}
            isLoading={isBooking}
          >
            Book Now
          </Button>
        </Box>
      </Card>
    </Container>
  )
}

export default ClassDetails
