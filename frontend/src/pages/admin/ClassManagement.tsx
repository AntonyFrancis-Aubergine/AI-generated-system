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
  IconButton,
  Spinner,
  useToast,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Select,
  FormErrorMessage,
} from '@chakra-ui/react'
import { AddIcon, EditIcon, DeleteIcon } from '@chakra-ui/icons'
import { format } from 'date-fns'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { adminService, categoryService, userService } from '../../services/api'
import {
  Category,
  CreateFitnessClassRequest,
  FitnessClass,
  FitnessClassFilters,
  UpdateFitnessClassRequest,
  User,
  UserRole,
} from '../../types'

// Form validation schema
const fitnessClassSchema = z
  .object({
    name: z.string().min(3, 'Name must be at least 3 characters'),
    categoryId: z.string().min(1, 'Category is required'),
    instructorId: z.string().min(1, 'Instructor is required'),
    startsAt: z.string().min(1, 'Start time is required'),
    endsAt: z.string().min(1, 'End time is required'),
  })
  .refine(
    (data) => {
      return new Date(data.startsAt) < new Date(data.endsAt)
    },
    {
      message: 'End time must be after start time',
      path: ['endsAt'],
    }
  )

type FitnessClassFormData = z.infer<typeof fitnessClassSchema>

const ClassManagement = () => {
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
  })
  const [totalPages, setTotalPages] = useState(1)
  const [currentClass, setCurrentClass] = useState<FitnessClass | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const toast = useToast()

  const {
    isOpen: isFormOpen,
    onOpen: openForm,
    onClose: closeForm,
  } = useDisclosure()
  const {
    isOpen: isDeleteOpen,
    onOpen: openDelete,
    onClose: closeDelete,
  } = useDisclosure()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<FitnessClassFormData>({
    resolver: zodResolver(fitnessClassSchema),
  })

  const fetchCategories = async () => {
    try {
      setIsCategoriesLoading(true)
      const response = await categoryService.getCategories()
      if (response.success) {
        setCategories(response.data.data)
      } else {
        toast({
          title: 'Error',
          description: 'Failed to fetch categories',
          status: 'error',
          duration: 5000,
          isClosable: true,
        })
      }
    } catch (err) {
      console.error('Failed to fetch categories:', err)
      toast({
        title: 'Error',
        description: 'Failed to fetch categories',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setIsCategoriesLoading(false)
    }
  }

  const fetchInstructors = async () => {
    try {
      setIsInstructorsLoading(true)
      const response = await userService.getInstructors()
      if (response.success) {
        setInstructors(response.data)
      } else {
        toast({
          title: 'Error',
          description: 'Failed to fetch instructors',
          status: 'error',
          duration: 5000,
          isClosable: true,
        })
      }
    } catch (err) {
      console.error('Failed to fetch instructors:', err)
      toast({
        title: 'Error',
        description: 'Failed to fetch instructors',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setIsInstructorsLoading(false)
    }
  }

  const fetchClasses = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await adminService.getAllClasses(filters)

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

  const handleAddClass = () => {
    setCurrentClass(null)
    reset({
      name: '',
      categoryId: '',
      instructorId: '',
      startsAt: '',
      endsAt: '',
    })
    openForm()
  }

  const handleEditClass = (fitnessClass: FitnessClass) => {
    setCurrentClass(fitnessClass)
    setValue('name', fitnessClass.name)
    setValue('categoryId', fitnessClass.categoryId)
    setValue('instructorId', fitnessClass.instructorId)
    setValue(
      'startsAt',
      new Date(fitnessClass.startsAt).toISOString().slice(0, 16)
    )
    setValue('endsAt', new Date(fitnessClass.endsAt).toISOString().slice(0, 16))
    openForm()
  }

  const handleDeleteClass = (fitnessClass: FitnessClass) => {
    setCurrentClass(fitnessClass)
    openDelete()
  }

  const confirmDelete = async () => {
    if (!currentClass) return

    try {
      setIsSubmitting(true)
      const response = await adminService.deleteClass(currentClass.id)

      if (response.success) {
        toast({
          title: 'Class deleted',
          description: 'The fitness class has been deleted successfully.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        })
        fetchClasses()
        closeDelete()
      } else {
        toast({
          title: 'Error',
          description: response.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
        })
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to delete class'
      toast({
        title: 'Error',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const onSubmit = async (data: FitnessClassFormData) => {
    try {
      setIsSubmitting(true)

      if (currentClass) {
        // Update existing class
        const response = await adminService.updateClass(
          currentClass.id,
          data as UpdateFitnessClassRequest
        )

        if (response.success) {
          toast({
            title: 'Class updated',
            description: 'The fitness class has been updated successfully.',
            status: 'success',
            duration: 5000,
            isClosable: true,
          })
          fetchClasses()
          closeForm()
        } else {
          toast({
            title: 'Update failed',
            description: response.message,
            status: 'error',
            duration: 5000,
            isClosable: true,
          })
        }
      } else {
        // Create new class
        const response = await adminService.createClass(
          data as CreateFitnessClassRequest
        )

        if (response.success) {
          toast({
            title: 'Class created',
            description: 'The fitness class has been created successfully.',
            status: 'success',
            duration: 5000,
            isClosable: true,
          })
          fetchClasses()
          closeForm()
        } else {
          toast({
            title: 'Creation failed',
            description: response.message,
            status: 'error',
            duration: 5000,
            isClosable: true,
          })
        }
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to save class'
      toast({
        title: 'Error',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChangePage = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setFilters((prev) => ({ ...prev, page: newPage }))
    }
  }

  const formatDateTime = (dateString: string) => {
    return format(new Date(dateString), 'MMM dd, yyyy h:mm a')
  }

  return (
    <Container maxW="container.xl">
      <Stack spacing={8}>
        <Flex justify="space-between" align="center">
          <Box>
            <Heading as="h1" size="xl" mb={2}>
              Manage Fitness Classes
            </Heading>
            <Text color="gray.600">
              Create, edit, and delete fitness classes
            </Text>
          </Box>
          <Button
            leftIcon={<AddIcon />}
            colorScheme="teal"
            onClick={handleAddClass}
          >
            Add New Class
          </Button>
        </Flex>

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
            <Text fontSize="lg">No classes found.</Text>
            <Button colorScheme="teal" mt={4} onClick={handleAddClass}>
              Create First Class
            </Button>
          </Box>
        ) : (
          <Box overflowX="auto">
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Name</Th>
                  <Th>Category</Th>
                  <Th>Instructor</Th>
                  <Th>Start Time</Th>
                  <Th>End Time</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {classes.map((fitnessClass) => (
                  <Tr key={fitnessClass.id}>
                    <Td fontWeight="medium">{fitnessClass.name}</Td>
                    <Td>{fitnessClass.category?.name}</Td>
                    <Td>{fitnessClass.instructor?.name}</Td>
                    <Td>{formatDateTime(fitnessClass.startsAt)}</Td>
                    <Td>{formatDateTime(fitnessClass.endsAt)}</Td>
                    <Td>
                      <Flex>
                        <IconButton
                          icon={<EditIcon />}
                          aria-label="Edit class"
                          mr={2}
                          size="sm"
                          onClick={() => handleEditClass(fitnessClass)}
                        />
                        <IconButton
                          icon={<DeleteIcon />}
                          aria-label="Delete class"
                          colorScheme="red"
                          size="sm"
                          onClick={() => handleDeleteClass(fitnessClass)}
                        />
                      </Flex>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
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

        {/* Add/Edit Class Modal */}
        <Modal isOpen={isFormOpen} onClose={closeForm} size="xl">
          <ModalOverlay />
          <ModalContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <ModalHeader>
                {currentClass ? 'Edit Fitness Class' : 'Add New Fitness Class'}
              </ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Stack spacing={4}>
                  <FormControl isInvalid={!!errors.name}>
                    <FormLabel>Class Name</FormLabel>
                    <Input {...register('name')} />
                    {errors.name && (
                      <FormErrorMessage>{errors.name.message}</FormErrorMessage>
                    )}
                  </FormControl>

                  <FormControl isInvalid={!!errors.categoryId}>
                    <FormLabel>Category</FormLabel>
                    <Select
                      placeholder="Select category"
                      {...register('categoryId')}
                      isDisabled={isCategoriesLoading}
                    >
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </Select>
                    {errors.categoryId && (
                      <FormErrorMessage>
                        {errors.categoryId.message}
                      </FormErrorMessage>
                    )}
                    {isCategoriesLoading && (
                      <Text fontSize="sm" color="gray.500" mt={1}>
                        Loading categories...
                      </Text>
                    )}
                  </FormControl>

                  <FormControl isInvalid={!!errors.instructorId}>
                    <FormLabel>Instructor</FormLabel>
                    <Select
                      placeholder="Select instructor"
                      {...register('instructorId')}
                      isDisabled={isInstructorsLoading}
                    >
                      {instructors.map((instructor) => (
                        <option key={instructor.id} value={instructor.id}>
                          {instructor.name}
                        </option>
                      ))}
                    </Select>
                    {errors.instructorId && (
                      <FormErrorMessage>
                        {errors.instructorId.message}
                      </FormErrorMessage>
                    )}
                    {isInstructorsLoading && (
                      <Text fontSize="sm" color="gray.500" mt={1}>
                        Loading instructors...
                      </Text>
                    )}
                  </FormControl>

                  <FormControl isInvalid={!!errors.startsAt}>
                    <FormLabel>Start Time</FormLabel>
                    <Input type="datetime-local" {...register('startsAt')} />
                    {errors.startsAt && (
                      <FormErrorMessage>
                        {errors.startsAt.message}
                      </FormErrorMessage>
                    )}
                  </FormControl>

                  <FormControl isInvalid={!!errors.endsAt}>
                    <FormLabel>End Time</FormLabel>
                    <Input type="datetime-local" {...register('endsAt')} />
                    {errors.endsAt && (
                      <FormErrorMessage>
                        {errors.endsAt.message}
                      </FormErrorMessage>
                    )}
                  </FormControl>
                </Stack>
              </ModalBody>
              <ModalFooter>
                <Button variant="ghost" mr={3} onClick={closeForm}>
                  Cancel
                </Button>
                <Button
                  colorScheme="teal"
                  type="submit"
                  isLoading={isSubmitting}
                >
                  {currentClass ? 'Update' : 'Create'}
                </Button>
              </ModalFooter>
            </form>
          </ModalContent>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal isOpen={isDeleteOpen} onClose={closeDelete}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Confirm Delete</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Text>
                Are you sure you want to delete the class "{currentClass?.name}
                "? This action cannot be undone.
              </Text>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={closeDelete}>
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={confirmDelete}
                isLoading={isSubmitting}
              >
                Delete
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Stack>
    </Container>
  )
}

export default ClassManagement
