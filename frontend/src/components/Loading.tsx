import { Flex, Spinner, Text, Stack } from '@chakra-ui/react'

const Loading = () => {
  return (
    <Flex justify="center" align="center" height="100vh">
      <Stack direction="column" align="center" spacing={4}>
        <Spinner
          size="xl"
          color="teal.500"
          emptyColor="gray.200"
          thickness="4px"
          speed="0.65s"
        />
        <Text color="gray.500">Loading...</Text>
      </Stack>
    </Flex>
  )
}

export default Loading
