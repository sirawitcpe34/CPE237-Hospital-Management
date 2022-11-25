import
{
    Box, ButtonGroup, Button, Center, Flex, Image, Input, InputRightElement, InputGroup,
    HStack, Text, Container, Heading, Select,
    Table, Thead, Tbody, Tfoot, Tr, Th, Td, TableCaption, TableContainer, Avatar
} from '@chakra-ui/react'
import { ArrowBackIcon, ArrowForwardIcon, PlusSquareIcon, ChevronDownIcon, SearchIcon } from '@chakra-ui/icons'
import axios from 'axios'
import Navbar from '../../component/navbar'
import Colour from '../../Colour'
import { useRouter } from 'next/router'
import url from '../../url'
import { useState, useEffect } from 'react'
import { encode, decode } from 'js-base64'
import Loading from '../../component/loading'

export default (props) =>
{

    const router = useRouter()
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
        if (sessionStorage.getItem('positionID') !=3)
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
        marginTop: '50px',
    }

    let line = {
        width: '78vw',
        paddingLeft: '360px',
        bgColor: '#000',
        marginTop: ' 12px',
        height: '2px',
        bgColor: Colour.LightGrey
    }

    let addButton = {
        bg: Colour.DarkGreen,
        color: Colour.White,
        _hover: { filter: 'brightness(0.9)' },
        transition: 'all 0.2s cubic-bezier(.08,.52,.52,1)'

    }

    let pageButton = {
        bg: Colour.Grey,
        _hover: { filter: 'brightness(0.9)' },
        transition: 'all 0.2s cubic-bezier(.08,.52,.52,1)'
    }

    const [department, setDepartment] = useState(null)
    const [search, setSearch] = useState('')
    const [doctor, setDoctor] = useState([])
    const [page, setPage] = useState(1)
    const [pageAmount, setPageAmount] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() =>
    {
        const fetchDoctorData = async () =>
        {
            setIsLoading(true)
            let result = await axios.get(`${url}/api/getDoctor`, {
                headers: {
                    page: page,
                    search: encode(search),
                    department: department,
                }
            })
            setDoctor(result.data)
            setIsLoading(false)
            //if result.data[0].page_amount is not null, set pageAmount to result.data[0].page_amount else set to 1
            if (result.data.length !== 0)
            {
                setPageAmount(result.data[0].page_amount)
            }
            else
            {
                setPageAmount(1)
            }
            console.log(result.data)
        }
        fetchDoctorData()

    }, [department, search, page])

    const onClickStaff = (staffID) =>{
        router.push(`/doctor/${staffID}`)
    }

    const onAddDoctor = () =>{
        router.push('/doctor/addDoctor')
    }

    const onDepartmentChange = (e) =>
    {
        setDepartment(e.target.value)
        setPage(1)
    }

    const onSearchChange = (e) =>
    {
        setSearch(e.target.value)
        setPage(1)
    }

    return (
        <Box bgColor={Colour.AlmostWhite} marginBottom='80px'>
            <Loading isLoading={isLoading} />
            <Navbar />
            <Box sx={container}>
                <Heading>
                    Doctor
                </Heading>
                <Box sx={line}></Box>
            </Box>
            <Flex sx={container2}>
                <HStack spacing='24px' justify='space-between'>
                    <HStack gap='24px'>

                        <Select
                            icon={<ChevronDownIcon />}
                            placeholder='All Department'
                            bgColor={Colour.White}
                            onChange={(e) => onDepartmentChange(e)}
                        >
                            {props.department.map((department, index) => (
                                <option key={department.departmentID} value={department.department_id}>{department.department_name}</option>
                            ))}

                        </Select>

                        <InputGroup maxWidth='250px' >
                            <InputRightElement
                                pointerEvents='none'
                                children={<SearchIcon />}
                            />
                            <Input
                                type='text'
                                placeholder='Search Doctor'
                                bgColor={Colour.White}
                                onChange={(e) => onSearchChange(e)} />
                        </InputGroup>

                    </HStack>
                    <Button leftIcon={<PlusSquareIcon />} sx={addButton} variant='solid' onClick={()=>onAddDoctor()}>
                        Add Doctor
                    </Button>
                </HStack>

                <TableContainer border={'1px solid' + Colour.LightGrey} borderRadius='12px' bgColor={Colour.White}>
                    <Table variant='simple'>
                        <Thead>
                            <Tr>
                                <Th>ID</Th>
                                <Th>Doctor's name</Th>
                                <Th>Department</Th>
                                <Th>Position</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {doctor.map((d, index) => (
                                <Tr key={index} cursor='pointer' _hover={{ bgColor: Colour.AlmostWhite }} onClick={() => onClickStaff(d.staffID)}>
                                    <Td>{d.staffID}</Td>
                                    <Td>
                                        <Flex align='center' gap='8px'>
                                            <Avatar
                                                display='inline-block'
                                                float='left'
                                                borderRadius='full'
                                                boxSize='40px'
                                                src={d.profile_img}
                                            />
                                            <Flex h='40px' align='center'>{`${d.firstname} ${d.lastname}`}</Flex>
                                        </Flex>
                                    </Td>
                                    <Td>{d.department_name}</Td>
                                    <Td>{d.position_name}</Td>
                                </Tr>
                            ))}
                        </Tbody>

                    </Table>
                </TableContainer>

                <HStack variant='solid' justify='end'>
                    {page != 1 ?
                        <Button
                            leftIcon={<ArrowBackIcon />}
                            sx={pageButton}
                            variant='solid'
                            onClick={() =>
                            {
                                setPage(page => page - 1)
                            }}
                        >
                            Previous
                        </Button> :
                        <Button
                            rightIcon={<ArrowBackIcon />}
                            sx={pageButton}
                            variant='solid'
                            isDisabled
                        >
                            Previous
                        </Button>}

                    <Center>{page}</Center>
                    {page != pageAmount ? <Button
                        rightIcon={<ArrowForwardIcon />}
                        sx={pageButton}
                        variant='solid'
                        onClick={() =>
                        {
                            setPage(page => page + 1)
                        }}
                    >
                        Next
                    </Button> :
                        <Button
                            rightIcon={<ArrowForwardIcon />}
                            sx={pageButton}
                            variant='solid'
                            isDisabled
                        >
                            Next
                        </Button>}

                </HStack>
            </Flex>
        </Box>
    )
}


export const getStaticProps = async () =>
{
    const result = await axios.get(`${url}/api/getDepartment`)
    return {
        props: {
            department: result.data
        },
        revalidate: 60
    }
}
