import { Button, Box, Flex, Stack, HStack, Input, Text, FormControl, FormLabel,
    Modal,ModalOverlay,ModalContent,ModalHeader,ModalFooter,ModalBody,ModalCloseButton, Textarea,
  } from '@chakra-ui/react'
import Colour from '../Colour'

export default (props) => {
    const { item, isOpen, onClose } = props
    const date = new Date(item.end_time).toLocaleDateString()

    let line = {
        width: '100%',
        bgColor: '#000',
        marginTop: ' 12px',
        marginRight: '12px',
        height: '2px',
        bgColor: Colour.LightGrey
    }

    const infoBlock = (title, info, h='36px') => {
        return (
            <HStack>
                <Text w='35%'>{title}</Text>
                <Flex w='60%' minH={h} border={'2px solid ' + Colour.LightGrey} padding='4px'>
                    <Text w='100%'>{info}</Text>
                </Flex>
            </HStack>
        );
    }

    return(
        <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>
                    Appointment ID: {item.appointmentID}
                    <Box sx={line}></Box>
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody mb='16px'>
                    <Stack>
                        {infoBlock("Date", date)}
                        {infoBlock("Doctor", (item.staff_firstname + ' ' + item.staff_lastname))}
                        {infoBlock("Symptom", item.symptoms)}
                        {infoBlock("Summary", item.summary, '56px')}
                        {infoBlock("Note", item.note)}
                    </Stack>
                </ModalBody>

            </ModalContent>
        </Modal>
    )
}
