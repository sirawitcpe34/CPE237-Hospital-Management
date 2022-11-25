import { Image, Container, Text, Center, Box, Heading, Button, ButtonGroup, 
        Input, InputRightElement, InputGroup, Grid, Stat, StatLabel,
        StatNumber, StatHelpText, StatArrow, StatGroup,} from '@chakra-ui/react'
import { Tabs, TabList, TabPanels, Tab, TabPanel, HStack, Flex } from '@chakra-ui/react'
import {SearchIcon, ArrowBackIcon, ArrowForwardIcon, PlusSquareIcon, addButton} from '@chakra-ui/icons'
import axios from 'axios'
import { encode, decode } from 'js-base64'
import  {useRouter}  from 'next/router'
import { useEffect, useState } from 'react'
import Navbar from '../../component/navbar'
import Colour from '../../Colour'
import {Table, Thead, Tbody, Tfoot, Tr, Th, Td, TableCaption, TableContainer} from '@chakra-ui/react'
import url from '../../url'

export default (props) =>
{
    console.log(props)
    const router = useRouter()
    const [search, setSearch] = useState('')
    const [medicine, setMedicine] = useState([])
    const [device, setDevice] = useState([])
    const [page, setPage] = useState(1)
    const [pageAmount, setPageAmount] = useState(1)
    const [isLoading, setIsLoading] = useState(false)
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
        if (sessionStorage.getItem('positionID') == 1)
        {
            kickOut()
        }
    }, [])

    const fetchMedicineData = async () =>
    {
        setIsLoading(true)
        let result = await axios.get(`${url}/api/getMedicine`, {
            headers: {
                page: page,
                search: encode(search),
            }
        })
        setMedicine(result.data)
        setIsLoading(false)
        //if result.data[0].page_amount is not null, set pageAmount to result.data[0].page_amount else set to 1
        if (result.data.length !== 0)
        {
            setPageAmount(result.data[0].page_amount)
        }      
    }

    const fetchDeviceData = async () =>
    {
        setIsLoading(true)
        let result = await axios.get(`${url}/api/getDevice`, {
            headers: {
                page: page,
                search: encode(search),
            }
        })
        setDevice(result.data)
        setIsLoading(false)
        //if result.data[0].page_amount is not null, set pageAmount to result.data[0].page_amount else set to 1
        if (result.data.length !== 0)
        {
            setPageAmount(result.data[0].page_amount)
        }      
    }

    useEffect(() =>
    {
        fetchMedicineData()
    }, [search,page])

    useEffect(() =>
    {
        fetchDeviceData()
    }, [search,page])

    const onAddMedicine = () =>{
        router.push('/stock/addMedicine')
    }
    const onAddDevice = () =>{
        router.push('/stock/addDevice')
    }

    let container = {
        width: '100vw',
        paddingLeft: '360px',
        marginTop: '64px',
        bgColor: Colour.AlmostWhite,
        marginBottom: '32px'
    }
    let container1 = {
        marginTop: '12px',
        bgColor: Colour.AlmostWhite,
    }
    let container2 = {
        width: '80%',
        marginTop: '48px',
        bgColor: "white",
        border: "1px solid #d3d3d3",
        borderRadius: "8px",
        padding: "24px",
    }
    let searchbox = {
        bgColor: "white",
        marginRight: '16px',
        marginTop: '6px',
        marginLeft: '28px',
    }
    let statStyle = {
        border: "1px solid #d3d3d3",
        borderRadius: "8px",
        bgColor: "white",
        padding: "20px 10px 10px 10px",
    }
    let tab = {
        width: '80%',
        marginTop: '24px',
        bgColor: "white",
        border: "1px solid #d3d3d3",
        borderRadius: "8px",
        padding: "24px",
    }
    let pagebox = {
        marginTop: '24px',
        bgColor: "white",
    }
    let menubox = {
        marginTop: '12px',
        marginRight: '20px',
        bgColor: "white",
    }
    let line = {
        width: '78vw',
        marginRight: '4000px',
        paddingLeft: '360px',
        bgColor: '#000',
        marginTop: ' 12px',
        height: '2px',
        bgColor: Colour.LightGrey
    }
    let pageButton = {
        bg: Colour.Grey,
        _hover: {filter: 'brightness(0.9)'},
        transition:'all 0.2s cubic-bezier(.08,.52,.52,1)'
    }
    let addButton = {
        bg: Colour.DarkGreen,
        color: Colour.White,
        _hover: { filter: 'brightness(0.9)' },
        transition: 'all 0.2s cubic-bezier(.08,.52,.52,1)'
    }

    return (
        <div>
            <Navbar />
            <Box sx={container} >
                <Heading>
                    Stock
                </Heading>
                <Box sx={line}></Box>

                <Box sx={container2}>
                    <Text fontSize="20px" fontWeight="bold" marginBottom="8px">
                     Medicine-Device Status from last 30 days
                    </Text>
                    <Grid
                        templateColumns="repeat(2, 1fr)"
                        templateRows="repeat(2, 1fr)"
                        gap="20px"
                        margin="0px"
                    >
                        <Stat sx={statStyle}>
                            <Flex alignItems="center" columnGap="12px">
                            <Box>
                            <Image
                                src="/assets/image/import.png"
                                filter="opacity(0.5) drop-shadow(0 0 0 white)"
                                boxSize="78px"/>
                            </Box>
                            <Box>
                                <StatLabel>Total ordered medicines and devices</StatLabel>
                                <StatNumber>{props.statmedData.totalimportC}</StatNumber>
                                <StatHelpText> <StatArrow type =
                                    {(props.statmedData.totalimportC - (props.statmedData.totalimportL - props.statmedData.totalimportC))>=0?"increase":"decrease"}/>
                                    {props.statmedData.totalimportC - (props.statmedData.totalimportL - props.statmedData.totalimportC)} from last 60 days
                                </StatHelpText>
                            </Box>
                            </Flex>
                        </Stat>
                        <Stat sx={statStyle}>
                            <Flex alignItems="center" columnGap="12px">
                            <Box>
                            <Image
                                src="/assets/image/upload.png"
                                filter="opacity(0.5) drop-shadow(0 0 0 white)"
                                boxSize="78px"/>
                            </Box>
                            <Box>
                                <StatLabel>Total dispensed medicines and devices </StatLabel>
                                <StatNumber>{props.statmedData.totalexportMC + props.statmedData.totalexportDC}</StatNumber>
                                <StatHelpText> <StatArrow type =
                                    {((props.statmedData.totalexportMC + props.statmedData.totalexportDC) -
                                    ((props.statmedData.totalexportML + props.statmedData.totalexportDL) - 
                                    (props.statmedData.totalexportMC + props.statmedData.totalexportDC)))>=0?"increase":"decrease"}/>
                                    {((props.statmedData.totalexportMC + props.statmedData.totalexportDC) -
                                    ((props.statmedData.totalexportML + props.statmedData.totalexportDL) - 
                                    (props.statmedData.totalexportMC + props.statmedData.totalexportDC)))} from last 60 days
                                </StatHelpText>   
                            </Box>
                            </Flex>
                        </Stat>
                        <Stat sx={statStyle}>
                            <Flex alignItems="center" columnGap="12px">
                            <Box>
                            <Image
                                src="/assets/image/office.png"
                                filter="opacity(0.5) drop-shadow(0 0 0 white)"
                                boxSize="78px"/>
                            </Box>
                            <Box>
                                <StatLabel>The company with the most orders</StatLabel>
                                <StatNumber> {props.statmedData.toporganName} </StatNumber> 
                                <StatHelpText>{props.statmedData.toporgan} Orders</StatHelpText>  
                            </Box>
                            </Flex>
                        </Stat>
                        <Stat sx={statStyle}>
                            <Flex alignItems="center" columnGap="12px">
                            <Box>
                            <Image
                                src="/assets/image/pills.png"
                                filter="opacity(0.5) drop-shadow(0 0 0 white)"
                                boxSize="78px"/>
                            </Box>
                            <Box>
                                <StatLabel>The most commonly used drugs</StatLabel>
                                <StatNumber> {props.statmedData.topmedicineName} </StatNumber> 
                                <StatHelpText>{props.statmedData.topmedicine} Pills</StatHelpText> 
                            </Box>
                            </Flex>
                        </Stat>   
                    </Grid>
                </Box>

                <Box sx={tab}>
                <Tabs variant='soft-rounded' colorScheme='telegram'>
                        
                        <TabList>
                        <Box sx={menubox}>
                        <Text fontSize="20px" fontWeight="bold" marginBottom="8px">
                            Stock
                        </Text>
                        </Box>
                            <Tab>Medicine</Tab>
                            <Tab>Device</Tab>
                            <Box sx={searchbox}>
                            <HStack variant='solid' justify='end'>
                            <InputGroup maxWidth='250px' >
                                <InputRightElement
                                    pointerEvents='none'
                                    children={<SearchIcon />}
                                />
                                <Input
                                    type='text'
                                    placeholder='Search Name'
                                    bgColor={Colour.White}
                                    onChange={(e) => {setSearch(e.target.value); setPage(1)}}></Input>
                            </InputGroup>
                            </HStack>
                            </Box>
                        </TabList>
                <TabPanels>
                    <TabPanel>
                    <HStack variant='solid' justify='space-between'>
                        <Text fontSize="16px" fontWeight="bold" marginBottom="8px">
                                Medicine
                        </Text>
                        <Button leftIcon={<PlusSquareIcon />} sx={addButton} variant='solid' onClick={()=>onAddMedicine()}>
                            Add Medicine
                        </Button>
                    </HStack>
                        <Box sx={container1}>
                        <TableContainer border={'1px solid' + Colour.LightGrey} borderRadius='12px' bgColor={Colour.White}>
                            <Table variant='simple'>
                                <Thead>
                                <Tr>
                                    <Th>ID</Th>
                                    <Th>Name</Th>
                                    <Th>Description</Th>
                                    <Th>Price</Th>
                                    <Th>Amount</Th>
                                </Tr>
                                </Thead>
                                <Tbody>
                                {
                                medicine.map((item, index) => 
                                {
                                    return (
                                        <Tr key={index}>
                                            <Td>{item.medicineID}</Td>
                                            <Td>{item.medicine_name}</Td>
                                            <Td>{item.description}</Td>
                                            <Td>{item.m_priceperunit}</Td>
                                            <Td>{item.m_amount}</Td>
                                        </Tr>
                                    )
                                })
                            }   
                                </Tbody>
                            </Table>
                            </TableContainer>
                            </Box>
                            <Box sx = {pagebox}>
                            <HStack variant='solid' justify='end'>
                                <Button leftIcon={<ArrowBackIcon />} sx={pageButton} variant='solid'
                                    onClick={()=>{
                                        if (page > 1)
                                            setPage(page - 1)
                                    }}
                                    isDisabled={page === 1}
                                >
                                    Previous
                                </Button>
                                <Center>{page}</Center>
                                <Button rightIcon={<ArrowForwardIcon />} sx={pageButton} variant='solid'
                                    onClick={()=>{
                                        if (page < pageAmount)
                                            setPage(page + 1)
                                    }}
                                    isDisabled={page === parseInt(pageAmount)}
                                >
                                    Next
                                </Button>
                            </HStack>
                            </Box>
                    </TabPanel>
                    

                    <TabPanel>
                    <HStack variant='solid' justify='space-between'>
                        <Text fontSize="16px" fontWeight="bold" marginBottom="8px">
                                Device
                        </Text>
                        <Button leftIcon={<PlusSquareIcon />} sx={addButton} variant='solid' onClick={()=>onAddDevice()}>
                            Add Device
                        </Button>
                    </HStack>
                    <Box sx={container1}>
                        <TableContainer border={'1px solid' + Colour.LightGrey} borderRadius='12px' bgColor={Colour.White} >
                            <Table variant='simple'>
                                <Thead>
                                <Tr>
                                    <Th>ID</Th>
                                    <Th>Name</Th>
                                    <Th>Description</Th>
                                    <Th>Price</Th>
                                    <Th>Amount</Th>
                                </Tr>
                                </Thead>
                                <Tbody>
                                {
                                device.map((item, index) => 
                                {
                                    return (
                                        <Tr key={index}>
                                            <Td>{item.deviceID}</Td>
                                            <Td>{item.device_name}</Td>
                                            <Td>{item.description}</Td>
                                            <Td>{item.d_priceperunit}</Td>
                                            <Td>{item.d_amount}</Td>
                                        </Tr>
                                    )
                                })
                            }   
                                </Tbody>
                            </Table>
                            </TableContainer>
                        </Box>
                        <Box sx = {pagebox}>
                            <HStack variant='solid' justify='end'>
                                <Button leftIcon={<ArrowBackIcon />} sx={pageButton} variant='solid'
                                    onClick={()=>{
                                        if (page > 1)
                                            setPage(page - 1)
                                    }}
                                    isDisabled={page === 1}
                                >
                                    Previous
                                </Button>
                                <Center>{page}</Center>
                                <Button rightIcon={<ArrowForwardIcon />} sx={pageButton} variant='solid'
                                    onClick={()=>{
                                        if (page < pageAmount)
                                            setPage(page + 1)
                                    }}
                                    isDisabled={page === parseInt(pageAmount)}
                                >
                                    Next
                                </Button>
                            </HStack>
                        </Box>
                    </TabPanel>
                </TabPanels>
                </Tabs>
                </Box>
            </Box>
        </div>
    )
}

export const getServerSideProps = async ()=>{
    const statmedData = await axios.get(`${url}/api/getStatMed`)
    return {
        props: {
            statmedData: statmedData.data,
        }
    }
}
  

