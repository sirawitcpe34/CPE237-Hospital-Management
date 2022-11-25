import
{
    Avatar, Box, Button, Flex, FormControl, FormErrorMessage, FormLabel, Input, InputGroup, InputLeftElement,
    InputRightElement, Heading, HStack, Radio, Select, SimpleGrid, Text, Textarea, Stack, RadioGroup, ButtonGroup, useToast
} from '@chakra-ui/react'
import { ArrowBackIcon, ArrowForwardIcon, PlusSquareIcon, SearchIcon } from '@chakra-ui/icons'

import axios from 'axios'
import Colour from '../../../Colour'
import Loading from '../../../component/loading'
import { encode, decode } from 'js-base64'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import url from '../../../url'

import AppointmentAdd from '../../../component/appointmentAdd'

export default (props) =>
{

    const router = useRouter()
    const toast = useToast()

    const patientID = router.query.patientID
    console.log(patientID)

    const [selected, setSelected] = useState(false)
    const [isEdit, setIsEdit] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [infoActive, setInfoActive] = useState(true)
    const [file, setFile] = useState(['Profile name', null])
    const [allergyForm, setAllergyForm] = useState(true)
    const [error, setError] = useState(false)
    const [form, setForm] = useState({
        firstname: props.data.firstname, lastname: props.data.lastname,
        gender: props.data.gender, dob: props.data.birthDate.split('T')[0],
        citizenID: props.data.citizenID, phone: props.data.phone_number,
        address: props.data.address, insurance: props.data.insurance,
        EC_name: props.data.EC_name, EC_relationship: props.data.EC_Relationship,
        EC_phone: props.data.EC_phone, blood: props.data.bloodGroup,
        allergy: props.data.allergy, med_history: props.data.med_history,
        profile_img: props.data.profile_img
    })
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
        if (sessionStorage.getItem('positionID') ==2)
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
        gap: '4',
        maxWidth: 'container.lg',
        width: '100%',
        marginLeft: '360px',
        marginTop: '32px',
    }

    let container3 = {
        border: '1px solid',
        borderColor: Colour.LightGrey,
        borderRadius: '12px',
        flexDirection: 'column',
        gap: '4',
        width: '100%',
        padding: '16px',
        bgColor: Colour.White,
    }

    let line = {
        width: '90%',
        marginRight: '4000px',
        paddingLeft: '360px',
        bgColor: '#000',
        marginTop: ' 12px',
        height: '2px',
        bgColor: Colour.LightGrey
    }

    let fileButton = {
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        borderRadius: 'md',
        bg: Colour.LightGrey,
        // color: 'white',
        px: 4,
        h: 8,
        _hover: { filter: 'brightness(0.9)' },
        transition: 'all 0.2s cubic-bezier(.08,.52,.52,1)',
    }

    let infoButton = {
        _hover: { filter: 'brightness(0.9)' },
        transition: 'all 0.2s cubic-bezier(.08,.52,.52,1)',
    }

    const buttonStyle = (bgColor, textColor) =>
    {
        return {
            bg: bgColor,
            color: textColor,
            _hover: { filter: 'brightness(0.9)' },
            transition: 'all 0.2s cubic-bezier(.08,.52,.52,1)',
        }
    }

    const checkCitizen = (e) =>
    {
        let regExp = /[0-9]/g
        let result = regExp.test(e.target.value)
        let id = e.target.value
        if (result && id.length === 13)
        {
            let check = parseInt(id[0]) * 13 + parseInt(id[1]) * 12 + parseInt(id[2]) * 11 +
                parseInt(id[3]) * 10 + parseInt(id[4]) * 9 + parseInt(id[5]) * 8 +
                parseInt(id[6]) * 7 + parseInt(id[7]) * 6 + parseInt(id[8]) * 5 +
                parseInt(id[9]) * 4 + parseInt(id[10]) * 3 + parseInt(id[11]) * 2
            let checkDigit = check % 11
            if (11 - checkDigit === parseInt(id[12]))
            {
                setForm({ ...form, citizenID: id })
            }
            else
            {
                setForm({ ...form, citizenID: "" })
            }
        }
        else
        {
            setForm({ ...form, citizenID: "" })
        }
    }

    const checkECPhone = (e) =>
    {
        let regExp = /[0-9]/g
        let result = regExp.test(e.target.value)
        let phone = e.target.value
        if (result)
        {
            setForm({ ...form, EC_phone: phone })
        }
        else
        {
            setForm({ ...form, EC_phone: "" })
        }
    }

    const checkPhone = (e) =>
    {
        let regExp = /[0-9]/g
        let result = regExp.test(e.target.value)
        let phone = e.target.value
        if (result)
        {
            setForm({ ...form, phone: phone })
        }
        else
        {
            setForm({ ...form, phone: "" })
        }
    }

    const handleAllergyForm = (e) =>
    {
        console.log(e)
        if (e === 'y')
            setAllergyForm(false)
        else
        {
            setForm({ ...form, allergy: "" })
            setAllergyForm(true)
        }
    }

    const handleFile = (e) =>
    {
        if (e.target.files[0])
        {
            setFile([e.target.files[0].name, e.target.files[0]])
        }
    }

    // const onSummitClick = () =>
    // {
    //    axios.post(`${url}/api/updatePatient`,form)
    // }
    const onSummitClick = () => {
        console.log('summit clicked!')
        console.log("check form", form)
        if (form.firstname && form.lastname && form.gender && form.dob &&
            form.citizenID && form.phone && form.address && form.EC_name &&
            form.EC_relationship && form.EC_phone && form.blood)
        {
            axios.post(`${url}/api/updatePatient`, {...form, patientID:patientID}, {headers: {
                staffid: sessionStorage.getItem("staffID")
            }})
                .then(res => {
                    console.log(res)
                    // setRefresh(!refresh)
                })
                .catch(err => {
                    console.log(err)
                })
            setError(false)
            toast({
                title: 'Success submit.',
                description: "The information has been updated.",
                status: 'success',
                duration: 3000,
                isClosable: false,
                
              })
            setTimeout(() => {
                router.push('/patient')
            }, 3000)
            console.log('form is valid')
        }
        else
        {
            setError(true)
            toast({
                title: 'Error submit.',
                description: 'Some fields are error.',
                status: 'error',
                duration: 3000,
                isClosable: false,
                containerStyle: {
                    maxWidth: '700px',
                  },
              })
            console.log('form is not valid')
        }
    }


    console.log("form", form)
    console.log('path: ' + router.asPath)
    console.log(form.birthDate)
    return (
        <div style={{ backgroundColor: Colour.AlmostWhite, marginBottom: '80px' }}>
            <Loading isLoading={isLoading} />
            <Box sx={container} >
                <Heading>
                    Patient's Profile
                </Heading>
                <Box sx={line}></Box>
            </Box>

            <Flex sx={container2}>
                <HStack justify='space-between'>
                    <ButtonGroup>
                        <Button sx={infoButton}
                            variant={infoActive ? 'solid' : 'outline'}
                            bg={infoActive ? Colour.SkyBlue : Colour.White}
                            borderColor={infoActive ? 'none' : Colour.SkyBlue}
                            onClick={() => router.push(`/patient/${patientID}`)}
                        >
                            Personal information
                        </Button>
                        <Button sx={infoButton}
                            variant={!infoActive ? 'solid' : 'outline'}
                            bg={!infoActive ? Colour.SkyBlue : Colour.White}
                            borderColor={!infoActive ? 'none' : Colour.SkyBlue}
                            onClick={() => router.push(`/patient/${patientID}/history`)}

                        >
                            Appointment history
                        </Button>
                    </ButtonGroup>
                    {positionID == 3 ?
                        <Button leftIcon={<PlusSquareIcon />} sx={buttonStyle(Colour.DarkGreen, Colour.White)} variant='solid'
                            onClick={() => setSelected(true)}
                        >
                            Add appointment
                        </Button>

                        : null}
                    <AppointmentAdd isOpen={selected} onClose={() => setSelected(false)} patientID={patientID} />

                </HStack>

                <Flex sx={container3}>
                    <Avatar size='2xl' src={form.profile_img} />

                    {isEdit &&
                        <HStack>
                            <FormControl isRequired isInvalid={error && !form.profile_img}>
                                <FormLabel htmlFor='profile_img'>Profile Image URL</FormLabel>
                                <Input id='profile_img' value={form.profile_img} isDisabled={!isEdit} _disabled={{ opacity: 0.8 }}
                                    onChange={(e) => { setForm({ ...form, profile_img: e.target.value }) }}
                                />
                                {/* <FormErrorMessage>First name is required.</FormErrorMessage> */}
                            </FormControl>
                        </HStack>
                    }

                    <Box>
                        <SimpleGrid columns={2} spacing={4}>
                            <FormControl isRequired isInvalid={error && !form.firstname}>
                                <FormLabel htmlFor='first-name'>First name</FormLabel>
                                <Input id='first-name' value={form.firstname} isDisabled={!isEdit} _disabled={{ opacity: 0.8 }}
                                    onChange={(e) => { setForm({ ...form, firstname: e.target.value }) }}
                                />
                                {/* <FormErrorMessage>First name is required.</FormErrorMessage> */}
                            </FormControl>
                            <FormControl isRequired isInvalid={error && !form.lastname}>
                                <FormLabel htmlFor='last-name'>Last name</FormLabel>
                                <Input id='last-name' value={form.lastname} isDisabled={!isEdit} _disabled={{ opacity: 0.8 }}
                                    onChange={(e) => { setForm({ ...form, lastname: e.target.value }) }}
                                />
                            </FormControl>
                            <FormControl isRequired isInvalid={error && !form.gender}>
                                <FormLabel htmlFor='gender'>Gender</FormLabel>
                                <Select id='gender' placeholder='Select gender' defaultValue={form.gender}
                                    isDisabled={!isEdit} _disabled={{ opacity: 0.8 }}
                                    onChange={(e) => { setForm({ ...form, gender: e.target.value }) }}
                                >
                                    <option value='Male'>Male</option>
                                    <option value='Female'>Female</option>
                                    <option value='Other'>Other</option>
                                </Select>
                            </FormControl>
                            <FormControl isRequired isInvalid={error && !form.dob}>
                                <FormLabel htmlFor='birth-date'>Birth date</FormLabel>
                                <Input id='birth-date' type='date' isDisabled={!isEdit} _disabled={{ opacity: 0.8 }}
                                    defaultValue={form.dob}
                                    onChange={(e) => { setForm({ ...form, dob: e.target.value.replace('T', ' ') }) }}
                                />
                            </FormControl>
                            <FormControl isRequired isInvalid={error && !form.citizenID}>
                                <FormLabel htmlFor='citizen-id'>Citizen ID</FormLabel>
                                <Input id='citizen-id' maxLength={13}
                                    defaultValue={form.citizenID}
                                    isDisabled={!isEdit} _disabled={{ opacity: 0.8 }}
                                    onChange={(e) => checkCitizen(e)}
                                />
                            </FormControl>
                            <FormControl isRequired isInvalid={error && !form.phone}>
                                <FormLabel htmlFor='phone'>Phone number</FormLabel>
                                <Input id='phone' isDisabled={!isEdit} _disabled={{ opacity: 0.8 }}
                                    defaultValue={form.phone}
                                    onChange={(e) => checkPhone(e)}
                                />
                            </FormControl>
                            <FormControl isRequired isInvalid={error && !form.address}>
                                <FormLabel htmlFor='address'>Address</FormLabel>
                                <Input id='address' value={form.address}
                                    isDisabled={!isEdit} _disabled={{ opacity: 0.8 }}
                                    onChange={(e) => { setForm({ ...form, address: e.target.value }) }}
                                />
                            </FormControl>
                            <FormControl>
                                <FormLabel htmlFor='insurance'>Insurance</FormLabel>
                                <Input id='insurance' value={form.insurance}
                                    isDisabled={!isEdit} _disabled={{ opacity: 0.8 }}
                                    onChange={(e) => { setForm({ ...form, insurance: e.target.value }) }}
                                />
                            </FormControl>
                        </SimpleGrid>
                    </Box>
                </Flex>

                <Flex sx={container3}>
                    <Heading as='h4' size='md'>Emergency contact</Heading>
                    <Box>
                        <HStack spacing={4}>
                            <FormControl isRequired isInvalid={error && !form.EC_name} w='50%'>
                                <FormLabel htmlFor='ec-name'>Name</FormLabel>
                                <Input id='ec-name' value={form.EC_name}
                                    isDisabled={!isEdit} _disabled={{ opacity: 0.8 }}
                                    onChange={(e) => { setForm({ ...form, EC_name: e.target.value }) }}
                                />
                            </FormControl>
                            <FormControl isRequired isInvalid={error && !form.EC_Relationship} w='20%'>
                                <FormLabel htmlFor='ec-relationship'>Relationship</FormLabel>
                                <Input id='ec-relationship' defaultValue={form.EC_relationship}
                                    isDisabled={!isEdit} _disabled={{ opacity: 0.8 }}
                                    onChange={(e) => { setForm({ ...form, EC_relationship: e.target.value }) }}
                                />
                            </FormControl>
                            <FormControl isRequired isInvalid={error && !form.EC_phone} w='30%'>
                                <FormLabel htmlFor='ec-phone'>Phone number</FormLabel>
                                <Input id='ec-phone'
                                    isDisabled={!isEdit} _disabled={{ opacity: 0.8 }}
                                    defaultValue={form.EC_phone}
                                    onChange={(e) => checkECPhone(e)}
                                />
                            </FormControl>
                        </HStack>
                    </Box>
                </Flex>

                <Flex sx={container3}>
                    <Heading as='h4' size='md'>Medical information</Heading>
                    <HStack spacing={8}>
                        <FormControl w='296px' isRequired isInvalid={error && !form.bloodGroup}>
                            <FormLabel htmlFor='blood'>Blood</FormLabel>
                            <Select id='blood' placeholder='Select blood type' defaultValue={form.blood}
                                isDisabled={!isEdit} _disabled={{ opacity: 0.8 }}
                                onChange={(e) => { setForm({ ...form, blood: e.target.value }) }}
                            >
                                <option>O</option>
                                <option>A</option>
                                <option>B</option>
                                <option>AB</option>
                            </Select>
                        </FormControl>
                        <FormControl>
                            <FormLabel htmlFor='allergy'>Allergy</FormLabel>
                            <RadioGroup defaultValue={form.allergy ? 'y' : 'n'}
                                isDisabled={!isEdit} _disabled={{ opacity: 0.8 }}
                                onChange={(e) => handleAllergyForm(e)}
                            >
                                <HStack id='allergy'>
                                    <Radio value='n'>No</Radio>
                                    <Radio value='y'>Yes</Radio>
                                    <Input id='allergy' value={form.allergy} isDisabled={allergyForm || !isEdit} _disabled={{ opacity: 0.8 }}
                                        onChange={(e) => { setForm({ ...form, allergy: e.target.value }) }}
                                    />
                                </HStack>
                            </RadioGroup>
                        </FormControl>
                    </HStack>
                    <Box>
                        <FormLabel htmlFor='medical-history'>Medical history</FormLabel>
                        <Textarea
                            isDisabled={!isEdit} _disabled={{ opacity: 0.8 }}
                            size='sm'
                            resize='none'
                            value={form.med_history}
                            onChange={(e) => { setForm({ ...form, med_history: e.target.value }) }}
                        />
                    </Box>
                </Flex>
                {positionID == 3 ?
                    <HStack justify='end'>
                        {
                            !isEdit ?
                                <Button sx={buttonStyle(Colour.Yellow, Colour.Black)} onClick={() => setIsEdit(true)}>
                                    Edit
                                </Button>
                                :
                                <ButtonGroup>
                                    <Button sx={buttonStyle(Colour.Green, Colour.White)} onClick={() => onSummitClick()}>
                                        Submit
                                    </Button>
                                    <Button sx={buttonStyle(Colour.Red, Colour.White)} onClick={() => setIsEdit(false)}>
                                        Cancel
                                    </Button>
                                </ButtonGroup>
                        }
                    </HStack>
                    : null}
            </Flex>
        </div>
    )
}

export const getServerSideProps = async (context) =>
{
    let patientID = context.params.patientID
    const data = await axios.get(`${url}/api/getPatient/${patientID}`)
    return {
        props: {
            data: data.data,
        }
    }
}