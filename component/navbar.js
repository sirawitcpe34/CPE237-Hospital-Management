import
{
    Text, Box, Stack, Image, VStack, Flex, Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
} from '@chakra-ui/react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import checkToken from '../functions/checkToken'
export default () =>
{
    const router = useRouter()
    const linknow = router.asPath
    const [positionID, setPositionID] = useState(null)
    useEffect(() =>
    {
        console.log('bro',sessionStorage.getItem('token'))   
        if (sessionStorage.getItem('token') === null)
        {
            router.push('/')
        }
        setPositionID(sessionStorage.getItem('positionID'))
    }, [])
    const createMenu = (text) =>
    {
        let cut = linknow.substring(1)
        const firstLetter = text.charAt(0).toUpperCase()
        const restOfText = text.slice(1)
        if (text == cut)
        {
            return (
                <Link href={`/${text}`}>
                    <Box position='relative'
                        zIndex='2'
                        width='inherit'
                        padding='16px 54px'
                        bgColor='rgb(131,159,171)'
                        cursor='pointer'
                    >
                        <Flex gap='36px' alignItems='center'>
                            <Image src={`assets/image/${text}.png`} width='32px' />
                            <Text color='#fff' paddingTop='6px'>
                                {`${firstLetter}${restOfText}`}
                            </Text>
                        </Flex>
                    </Box>
                </Link>
            )
        }
        else
        {
            return (
                <Link href={`/${text}`}>
                    <Box position='relative'
                        zIndex='2'
                        width='inherit'
                        padding='16px 54px'
                        transition='all 0.2s ease-in-out'
                        _hover={{ bgColor: 'rgb(131,159,171)' }}
                        cursor='pointer'
                    >
                        <Flex gap='36px' alignItems='center'>
                            <Image src={`assets/image/${text}.png`} width='32px' />
                            <Text color='#fff' paddingTop='6px'>
                                {`${firstLetter}${restOfText}`}
                            </Text>
                        </Flex>
                    </Box>
                </Link>
            )
        }
    }
    if (positionID == 1)
        return (
            <nav >
                <VStack overflow='scroll' position='fixed' top='0' left='0' width='320px' height='100vh' bgColor='#305F72'>
                    <Image src='/assets/image/logo.png' position='absolute' marginTop='-64px' />
                    <Stack paddingTop='180px' width='100%' flexDirection='column'>
                        {createMenu("dashboard")}
                        {/* {createMenu("doctor",)} */}
                        {createMenu("patient")}
                        {createMenu("appointment")}
                        {/* {createMenu("prescription")} */}
                        {/* <Accordion allowToggle border='none'  >
                            <AccordionItem border='none' >
                                <AccordionButton height='64px' border='none' _focus={{ border: 'none' }} _hover={{ bgColor: 'rgb(131, 159, 171)' }} >
                                    <Box position='relative'
                                        zIndex='2'
                                        width='inherit'
                                        padding='16px 24px 16px 40px'
                                        cursor='pointer'
                                    >
                                        <Flex gap='36px' alignItems='center'>
                                            <Image src={`assets/image/medicine.png`} width='32px' />
                                            <Text color='#fff' paddingTop='6px'>
                                                Medicine
                                            </Text>
                                        </Flex>
                                    </Box>
                                    <AccordionIcon color='#fff' />
                                </AccordionButton>
                                <AccordionPanel>
                                    {createMenu("stock")}
                                    {createMenu("order")}
                                </AccordionPanel>
                            </AccordionItem>

                        </Accordion>
                        {createMenu("log")} */}
                    </Stack>
                </VStack>
            </nav>
        )
    else if(positionID == 2)
        return (
            <nav >
                <VStack overflow='scroll' position='fixed' top='0' left='0' width='320px' height='100vh' bgColor='#305F72'>
                    <Image src='/assets/image/logo.png' position='absolute' marginTop='-64px' />
                    <Stack paddingTop='180px' width='100%' flexDirection='column'>
                        {createMenu("dashboard")}
                        {/* {createMenu("doctor")} */}
                        {/* {createMenu("patient")} */}
                        {/* {createMenu("appointment")} */}
                        {createMenu("prescription")}
                        <Accordion allowToggle border='none'  >
                            <AccordionItem border='none' >
                                <AccordionButton height='64px' border='none' _focus={{ border: 'none' }} _hover={{ bgColor: 'rgb(131, 159, 171)' }} >
                                    <Box position='relative'
                                        zIndex='2'
                                        width='inherit'
                                        padding='16px 24px 16px 40px'
                                        cursor='pointer'
                                    >
                                        <Flex gap='36px' alignItems='center'>
                                            <Image src={`assets/image/medicine.png`} width='32px' />
                                            <Text color='#fff' paddingTop='6px'>
                                                Medicine
                                            </Text>
                                        </Flex>
                                    </Box>
                                    <AccordionIcon color='#fff' />
                                </AccordionButton>
                                <AccordionPanel>
                                    {createMenu("stock")}
                                    {createMenu("order")}
                                </AccordionPanel>
                            </AccordionItem>

                        </Accordion>
                        {/* {createMenu("log")} */}
                    </Stack>
                </VStack>
            </nav>
        )
    else if(positionID == 3)
        return (
            <nav >
                <VStack overflow='scroll' position='fixed' top='0' left='0' width='320px' height='100vh' bgColor='#305F72'>
                    <Image src='/assets/image/logo.png' position='absolute' marginTop='-64px' />
                    <Stack paddingTop='180px' width='100%' flexDirection='column'>
                        {createMenu("dashboard")}
                        {createMenu("doctor",)}
                        {createMenu("patient")}
                        {createMenu("appointment")}
                        {createMenu("prescription")}
                        <Accordion allowToggle border='none'  >
                            <AccordionItem border='none' >
                                <AccordionButton height='64px' border='none' _focus={{ border: 'none' }} _hover={{ bgColor: 'rgb(131, 159, 171)' }} >
                                    <Box position='relative'
                                        zIndex='2'
                                        width='inherit'
                                        padding='16px 24px 16px 40px'
                                        cursor='pointer'
                                    >
                                        <Flex gap='36px' alignItems='center'>
                                            <Image src={`assets/image/medicine.png`} width='32px' />
                                            <Text color='#fff' paddingTop='6px'>
                                                Medicine
                                            </Text>
                                        </Flex>
                                    </Box>
                                    <AccordionIcon color='#fff' />
                                </AccordionButton>
                                <AccordionPanel>
                                    {createMenu("stock")}
                                    {createMenu("order")}
                                </AccordionPanel>
                            </AccordionItem>

                        </Accordion>
                        {createMenu("log")}
                    </Stack>
                </VStack>
            </nav>
        )
}
