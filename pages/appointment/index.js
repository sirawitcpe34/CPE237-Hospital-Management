import
{
    Avatar, Box, ButtonGroup, Button, Center, Flex, Image, Input, InputRightElement, InputGroup,
    HStack, Text, Container, Heading, Lorem, Stack, useDisclosure,
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton,
    Table, Thead, Tbody, Tfoot, Tr, Th, Td, TableCaption, TableContainer, CloseButton, useRadio,
    AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader, AlertDialogContent, AlertDialogOverlay,
    AlertDialogCloseButton,
} from '@chakra-ui/react'
import { ArrowBackIcon, ArrowForwardIcon, DeleteIcon, EditIcon, PlusSquareIcon, SearchIcon } from '@chakra-ui/icons'

import url from '../../url'
import { encode, decode } from 'js-base64'

import phoneFormatter from 'phone-formatter'
import axios from 'axios'
import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/router'
import Colour from '../../Colour'
import Loading from '../../component/loading'
import AppointmentEdit from '../../component/appointmentEdit'
import AppointmentAdd from '../../component/appointmentAdd'
import { roundToNearestMinutes } from 'date-fns'

export default () =>
{
    const router = useRouter()

    const [page, setPage] = useState(1)
    const [pageAmount, setPageAmount] = useState(1)
    const [isLoading, setIsLoading] = useState(false)
    const [search, setSearch] = useState('')
    const [data, setData] = useState([])
    const [appointmentID, setAppointmentID] = useState('-')
    const [selected, setSelected] = useState(false)

    // const { isOpen, onOpen, onClose } = useDisclosure()
    // const finalRef = useRef()
    const cancelRef = useRef()
    const [positionID, setPositionID] = useState(null)

    useEffect(() =>
    {
        const kickOut = () =>
        {
            sessionStorage.clear()
            router.push('/')
            alert('please login again')
        }
        setPositionID(sessionStorage.getItem('positionID'))
        if (sessionStorage.getItem('positionID') == 2)
        {
            kickOut()
        }
    }, [])

    let container = {
        width: '100vw',
        paddingLeft: '360px',
        marginTop: '64px',
        bgColor: Colour.AlmostWhite,
    }

    let container2 = {
        flexDirection: 'column',
        maxWidth: 'container.lg',
        gap: '4',
        width: '100%',
        marginLeft: '360px',
        marginTop: '32px',
        bgColor: Colour.AlmostWhite,
    }

    let line = {
        width: '78vw',
        paddingLeft: '360px',
        bgColor: '#000',
        marginTop: ' 12px',
        height: '2px',
        bgColor: Colour.LightGrey
    }

    let infoButton = {
        _hover: { filter: 'brightness(0.9)' },
        transition: 'all 0.2s cubic-bezier(.08,.52,.52,1)',
    }

    let pageButton = {
        bg: Colour.Grey,
        _hover: { filter: 'brightness(0.9)' },
        transition: 'all 0.2s cubic-bezier(.08,.52,.52,1)'
    }

    useEffect(() =>
    {
        const fetchData = async () =>
        {
            setIsLoading(true)
            let result = await axios.get(`${url}/api/getAppointment`, {
                headers: {
                    page: page,
                    search: encode(search),
                    positionid: sessionStorage.getItem('positionID')
                }
            })
            console.log(result.data)
            setData(result.data)
            setIsLoading(false)
            //if result.data[0].page_amount is not null, set pageAmount to result.data[0].page_amount else set to 1
            if (result.data.length !== 0)
            {
                setPageAmount(result.data[0].page_amount)
            }
            // console.log(result.data)
            // console.log(search)
        }
        fetchData()
    }, [search, page])

    const buttonStyle = (bgColor, textColor = '#000000') =>
    {
        return {
            bg: bgColor,
            color: textColor,
            _hover: { filter: 'brightness(0.9)' },
            transition: 'all 0.2s cubic-bezier(.08,.52,.52,1)',
        }
    }

    const editButton = (id, index) =>
    {
        // console.log(sessionStorage.getItem('positionID'))
        if (sessionStorage.getItem('positionID') === '1')
            router.push(`/appointment/${id}`)
        else if (sessionStorage.getItem('positionID') === '3')
            setSelected(index)
    }

    const onDelete = async () =>
    {
        const result = await axios.delete(`${url}/api/deleteAppointment`, {
            headers: {
                appointmentid: data[selected].appointmentID
            },
        })
        console.log(result)
        if (result)
        {
            alert('Delete Successfully')
            setPage(1)
            setSearch('')
            window.location.reload()

        }
        else
        {
            alert('Delete Failed')
        }
    }

    const deleteDialog = (onClose, isOpen, id = '') =>
    {
        return (
            <>
                <AlertDialog
                    motionPreset='slideInBottom'
                    leastDestructiveRef={cancelRef}
                    onClose={onClose}
                    isOpen={isOpen}
                    isCentered
                >
                    <AlertDialogOverlay />

                    <AlertDialogContent>
                        <AlertDialogHeader>Delete Appointment</AlertDialogHeader>
                        <AlertDialogBody>
                            Are you sure? You can't undo this action afterwards.
                        </AlertDialogBody>
                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={onClose}>
                                No
                            </Button>
                            <Button colorScheme='red' ml={3} onClick={() => onDelete()}>
                                Yes
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </>
        )
    }


    return (
        <div style={{ backgroundColor: Colour.AlmostWhite, marginBottom: '80px' }}>
            <Loading isLoading={isLoading} />
            <Box sx={container} >
                <Heading>
                    Appointment
                </Heading>
                <Box sx={line}></Box>
            </Box>

            <Flex sx={container2}>
                <HStack justify='space-between'>
                    <Heading as='h4' size='md'>Upcoming appointments</Heading>
                    <InputGroup maxWidth='400px' bgColor={Colour.White}>
                        <InputRightElement
                            pointerEvents='none'
                            children={<SearchIcon />}
                        />
                        <Input type='text' placeholder='Search'
                            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
                        />
                    </InputGroup>
                </HStack>

                <TableContainer border={'1px solid' + Colour.LightGrey} borderRadius='12px' bg={Colour.White}>
                    <Table variant='simple'>
                        <Thead>
                            <Tr>
                                <Th>Patient ID</Th>
                                <Th>Patient's name</Th>
                                <Th>Doctor</Th>
                                <Th>Room</Th>
                                <Th>Date time</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {
                                data.map((item, index) => 
                                {
                                    return (
                                        <Tr key={index}>
                                            <Td>{item.patientID}</Td>
                                            <Td>
                                                <Flex align='center' gap='8px'>
                                                    <Avatar
                                                        display='inline-block'
                                                        float='left'
                                                        borderRadius='full'
                                                        boxSize='40px'
                                                        src={item.patient_profile_img}
                                                        alt={item.patient_lastname}
                                                    />
                                                    <Flex h='40px' align='center'>
                                                        {item.patient_firstname + ' ' + item.patient_lastname}
                                                    </Flex>
                                                </Flex>
                                            </Td>
                                            <Td>
                                                <Flex align='center' gap='8px'>
                                                    <Flex h='40px' align='center'>
                                                        {item.staff_firstname + ' ' + item.staff_lastname}
                                                    </Flex>
                                                </Flex>
                                            </Td>
                                            <Td>
                                                {item.roomName ? item.roomName : '-'}
                                            </Td>
                                            <Td>
                                                {item.start_time ? new Date(item.start_time).toLocaleString() : '-'}
                                            </Td>
                                            <Td>
                                                {sessionStorage.getItem('positionID') === '3' ?
                                                    <Button size='sm' leftIcon={<DeleteIcon />} sx={buttonStyle(Colour.Red)}
                                                        onClick={() => setSelected(index)}
                                                    // onClick={() => router.push(`/appointment/${item.appointmentID}`)}
                                                    // onClick={() => editButton(item.appointmentID, index)}
                                                    >
                                                        Delete
                                                    </Button> :
                                                    <Button size='sm' leftIcon={<EditIcon />} sx={buttonStyle(Colour.Yellow)}
                                                        // onClick={() => setSelected(index)}
                                                        onClick={() => router.push(`/appointment/${item.appointmentID}`)}
                                                    // onClick={() => editButton(item.appointmentID, index)}
                                                    >
                                                        Edit
                                                    </Button>
                                                }
                                                {/* {   selected === index ?
                                                        <AppointmentEdit item={item} isOpen={selected === index ? true : false} onClose={()=>setSelected(null)} />
                                                        : null
                                                    } */}
                                                {deleteDialog(() => setSelected(null), selected === index ? true : false)}
                                            </Td>
                                        </Tr>
                                    )
                                })
                            }


                        </Tbody>

                    </Table>
                </TableContainer>

                <HStack variant='solid' justify='end'>
                    <Button leftIcon={<ArrowBackIcon />} sx={pageButton} variant='solid'
                        onClick={() =>
                        {
                            if (page > 1)
                                setPage(page - 1)
                        }}
                        isDisabled={page === 1}
                    >
                        Previous
                    </Button>
                    <Center>{page}</Center>
                    <Button rightIcon={<ArrowForwardIcon />} sx={pageButton} variant='solid'
                        onClick={() =>
                        {
                            if (page < pageAmount)
                                setPage(page + 1)
                        }}
                        isDisabled={page === parseInt(pageAmount)}
                    >
                        Next
                    </Button>
                </HStack>

            </Flex>
            {/* <AppointmentEdit id={appointmentID} isOpen={isOpen} onClose={onClose} /> */}
        </div>

    )
}



