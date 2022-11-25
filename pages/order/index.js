import { Image, Container,Center, Box, Heading, Button, ButtonGroup, Input, InputRightElement, InputGroup} from '@chakra-ui/react'
import { Tabs, TabList, TabPanels, Tab, TabPanel, HStack, } from '@chakra-ui/react'
import {SearchIcon,PlusSquareIcon, ArrowBackIcon, ArrowForwardIcon} from '@chakra-ui/icons'
import axios from 'axios'
import { encode, decode } from 'js-base64'
import { useEffect, useState } from 'react'
import  {useRouter}  from 'next/router'
import Navbar from '../../component/navbar'
import Colour from '../../Colour'
import Loading from '../../component/loading'
import {Table, Thead, Tbody, Tfoot, Tr, Th, Td, TableCaption, TableContainer} from '@chakra-ui/react'
import url from '../../url'

export default () =>
{
    const router = useRouter()
    const [search, setSearch] = useState('')
    const [order, setOrder] = useState([])
    const [page, setPage] = useState(1)
    const [pageAmount, setPageAmount] = useState(1)
    const [isLoading, setIsLoading] = useState(false)

    const fetchOrderData = async () =>
    {
        setIsLoading(true)
        let result = await axios.get(`${url}/api/getOrder`, {
            headers: {
                page: page,
                search: encode(search),
            }
        })
        setOrder(result.data)
        setIsLoading(false)
        //if result.data[0].page_amount is not null, set pageAmount to result.data[0].page_amount else set to 1
        if (result.data.length !== 0)
        {
            setPageAmount(result.data[0].page_amount)
        }      
    }

    useEffect(() =>
    {
        fetchOrderData()
    }, [search,page])

    const onAddOrder = () =>{
        router.push('/order/addOrder')
    }

    let container = {
        width: '100vw',
        paddingLeft: '360px',
        marginTop: '64px',
        bgColor: Colour.AlmostWhite,
    }
    let container1 = {
        width: '80%',
        marginTop: '24px',
        bgColor: Colour.AlmostWhite,

    }
    let searchbox = {
        width: '80%',
        marginTop: '48px',
        bgColor: Colour.AlmostWhite,
    }
    let pagebox = {
        width: '80%',
        marginTop: '24px',
        bgColor: Colour.AlmostWhite,
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
    let addButton = {
        bg: Colour.DarkGreen,
        color: Colour.White,
        _hover: { filter: 'brightness(0.9)' },
        transition: 'all 0.2s cubic-bezier(.08,.52,.52,1)'
    }
    let pageButton = {
        bg: Colour.Grey,
        _hover: {filter: 'brightness(0.9)'},
        transition:'all 0.2s cubic-bezier(.08,.52,.52,1)'
    }

    const onClickOrder = (id) => {
        router.push(`/order/${id}`)
    }

    return (
        <div style={{backgroundColor: Colour.AlmostWhite, marginBottom: '80px'}}>
            <Loading isLoading={isLoading}/>
            <Navbar />
            <Box sx={container} >
                <Heading>
                    Order
                </Heading>
                <Box sx={line}></Box>
                <Box sx={searchbox}>
                <HStack spacing='24px' justify='space-between'>
                    <HStack gap='24px'>
                        <InputGroup maxWidth='250px' >
                            <InputRightElement
                                pointerEvents='none'
                                children={<SearchIcon />}
                            />
                            <Input
                                type='text'
                                placeholder='Search Organization'
                                bgColor={Colour.White}
                                onChange={(e) => {setSearch(e.target.value); setPage(1)}}>
                            </Input>
                        </InputGroup>
                    </HStack>
                        <Button leftIcon={<PlusSquareIcon/>} sx={addButton} variant='solid' onClick={()=>onAddOrder()}>
                            Add Order
                        </Button>
                    </HStack>
                    </Box>
                        <Box sx={container1}>
                        <TableContainer border={'1px solid' + Colour.LightGrey} borderRadius='12px' bgColor={Colour.White}>
                            <Table variant='simple'>
                                <Thead>
                                <Tr>
                                    <Th>OrderID</Th>
                                    <Th>Date Order</Th>
                                    <Th>Organization</Th>
                                    <Th>Date in stock</Th>
                                </Tr>
                                </Thead>
                                <Tbody>
                                {
                                order.map((item, index) => 
                                {
                                    return (
                                        <Tr key={index} cursor='pointer' 
                                        _hover={{ bgColor: Colour.AlmostWhite }} 
                                        onClick={() => onClickOrder(item.orderID)}>
                                            <Td>{item.orderID}</Td>
                                            <Td>{new Date(item.dateOrder).toLocaleDateString()}</Td>
                                            <Td>{item.organization_name}</Td>
                                            <Td>{new Date(item.dateInStock).toLocaleDateString()}</Td>
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
            </Box>
        </div>
    )
}



