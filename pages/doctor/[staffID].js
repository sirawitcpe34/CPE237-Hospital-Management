import { useRouter } from "next/router";
import {
  Image,
  Box,
  Button,
  ButtonGroup,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Heading,
  HStack,
  Radio,
  Select,
  SimpleGrid,
  Text,
  Textarea,
  Stack,
  RadioGroup,
  VStack,
  useToast,
  Avatar,
} from "@chakra-ui/react";

import { ChevronDownIcon } from "@chakra-ui/icons";
import axios from "axios";
import Colour from "../../Colour";
import { useState } from "react";
import emailValidate from "email-validator";
import phoneFormatter from "phone-formatter";
import url from "../../url";

export default (props) => {
  let container = {
    width: "100vw",
    paddingLeft: "360px",
    marginTop: "64px",
    bgColor: Colour.AlmostWhite,
  };

  let container2 = {
    flexDirection: "column",
    gap: "4",
    maxWidth: "container.lg",
    width: "100%",
    marginLeft: "360px",
    marginTop: "32px",
  };

  let container3 = {
    border: "1px solid",
    borderColor: Colour.LightGrey,
    borderRadius: "12px",
    flexDirection: "column",
    gap: "4",
    width: "100%",
    padding: "16px",
    bgColor: "white",
  };

  let line = {
    width: "90%",
    marginRight: "4000px",
    paddingLeft: "360px",
    bgColor: "#000",
    marginTop: " 12px",
    height: "2px",
    bgColor: Colour.LightGrey,
  };

  let fileButton = {
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    borderRadius: "md",
    bg: Colour.Orange,
    // color: 'white',
    px: 4,
    h: 8,
    _hover: { filter: "brightness(0.9)" },
    transition: "all 0.2s cubic-bezier(.08,.52,.52,1)",
  };

  let summitButton = {
    bg: Colour.Orange,
    _hover: { filter: "brightness(0.9)" },
    transition: "all 0.2s cubic-bezier(.08,.52,.52,1)",
    width: "100px",
  };

  const buttonStyle = (bgColor, textColor) => {
    return {
      bg: bgColor,
      color: textColor,
      _hover: { filter: "brightness(0.9)" },
      transition: "all 0.2s cubic-bezier(.08,.52,.52,1)",
    };
  };

  const router = useRouter();
  const toast = useToast();

  const patientID = router.query.patientID;
  console.log(patientID);

  const [selected, setSelected] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [infoActive, setInfoActive] = useState(true);
  const [error, setError] = useState(false);
  const [form, setForm] = useState({
    // staffID: props.data.firstname,
    firstname: props.staffData.firstname,
    lastname: props.staffData.lastname,
    dob: props.staffData.birthDate.split("T")[0],
    citizenID: props.staffData.citizenID,
    license_number: props.staffData.licensed_number,
    phone_number: props.staffData.phone_number,
    salary: props.staffData.salary,
    username: props.staffData.username,
    password: props.staffData.password,
    email: props.staffData.email,
    profile_img: props.staffData.profile_img,
    positionID: props.staffData.positionID,
    departmentID: props.staffData.departmentID,
  });
  // const [staffID, setStaffID] = useState(null);
  let staffID = router.query.staffID;
  console.log("props", props);

  const checkCitizen = (e) => {
    let regExp = /[0-9]/g;
    let result = regExp.test(e.target.value);
    let id = e.target.value;
    if (result && id.length === 13) {
      let check =
        parseInt(id[0]) * 13 +
        parseInt(id[1]) * 12 +
        parseInt(id[2]) * 11 +
        parseInt(id[3]) * 10 +
        parseInt(id[4]) * 9 +
        parseInt(id[5]) * 8 +
        parseInt(id[6]) * 7 +
        parseInt(id[7]) * 6 +
        parseInt(id[8]) * 5 +
        parseInt(id[9]) * 4 +
        parseInt(id[10]) * 3 +
        parseInt(id[11]) * 2;
      let checkDigit = check % 11;
      if (11 - checkDigit === parseInt(id[12])) {
        setForm({ ...form, citizenID: id });
      } else {
        setForm({ ...form, citizenID: "" });
      }
    } else {
      setForm({ ...form, citizenID: "" });
    }
  };

  const checkECPhone = (e) => {
    let regExp = /[0-9]/g;
    let result = regExp.test(e.target.value);
    let phone = e.target.value;
    if (result) {
      setForm({ ...form, EC_phone: phone });
    } else {
      setForm({ ...form, EC_phone: "" });
    }
  };

  const checkPhone = (e) => {
    let regExp = /[0-9]/g;
    let result = regExp.test(e.target.value);
    let phone = e.target.value;
    if (result) {
      setForm({ ...form, phone_number: phone });
    } else {
      setForm({ ...form, phone_number: "" });
    }
  };

  const checkEmail = (e) => {
    if (emailValidate.validate(e.target.value)) {
      setForm({ ...form, email: e.target.value });
    } else {
      setForm({ ...form, email: "" });
    }
  };

  const handleAllergyForm = (e) => {
    console.log(e);
    if (e === "y") setAllergyForm(false);
    else {
      setForm({ ...form, allergy: "" });
      setAllergyForm(true);
    }
  };

  const handleFile = (e) => {
    if (e.target.files[0]) {
      setFile([e.target.files[0].name, e.target.files[0]]);
    }
  };


  const onSummitClick = () => {
    console.log('summit clicked!')
    console.log("check form", form)
    if (form.firstname && form.lastname && form.citizenID && form.dob &&
        form.citizenID && form.phone_number && form.email && form.departmentID &&
        form.positionID && form.license_number && form.username && form.password)
    {
      console.log({...form, staffID})
        axios.post(`${url}/api/updateStaff`, {...form, staffID:staffID}, {headers: {
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
            router.push('/doctor')
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
  console.log(form);
  return (
    <div style={{ backgroundColor: Colour.AlmostWhite, marginBottom: "80px" }}>
      <Box sx={container}>
        <Heading>Doctor's Profile</Heading>
        <Box sx={line}></Box>
      </Box>

      <Flex sx={container2}>
        <Flex sx={container3}>
          <Heading as="h4" size="md">
            Personal information
          </Heading>

          <Avatar size="2xl" src={form.profile_img} />

          {isEdit && (
            <HStack>
              <FormControl isRequired isInvalid={error && !form.profile_img}>
                <FormLabel htmlFor="profile_img">Profile Image URL</FormLabel>
                <Input
                  id="profile_img"
                  value={form.profile_img}
                  isDisabled={!isEdit}
                  _disabled={{ opacity: 0.8 }}
                  onChange={(e) => {
                    setForm({ ...form, profile_img: e.target.value });
                  }}
                />
                {/* <FormErrorMessage>First name is required.</FormErrorMessage> */}
              </FormControl>
            </HStack>
          )}

          <Box>
            <SimpleGrid columns={2} spacing={3}>
              <FormControl isRequired isInvalid={error && !form.firstname}>
                <FormLabel htmlFor="first-name">First name</FormLabel>
                <Input
                  id="first-name"
                  value={form.firstname}
                  isDisabled={!isEdit}
                  _disabled={{ opacity: 0.8 }}
                  onChange={(e) => {
                    setForm({ ...form, firstname: e.target.value });
                  }}
                />
                {/* <FormErrorMessage>First name is required.</FormErrorMessage> */}
              </FormControl>
              <FormControl isRequired isInvalid={error && !form.lastname}>
                <FormLabel htmlFor="last-name">Last name</FormLabel>
                <Input
                  id="last-name"
                  value={form.lastname}
                  isDisabled={!isEdit}
                  _disabled={{ opacity: 0.8 }}
                  onChange={(e) => {
                    setForm({ ...form, lastname: e.target.value });
                  }}
                />
                {/* <FormErrorMessage>First name is required.</FormErrorMessage> */}
              </FormControl>
              <FormControl isRequired isInvalid={error && !form.citizenID}>
                <FormLabel htmlFor="first-name">Citizen id</FormLabel>
                <Input
                  id="citizenID"
                  value={form.citizenID}
                  isDisabled={!isEdit}
                  _disabled={{ opacity: 0.8 }}
                  onChange={(e) => {
                    setForm({ ...form, citizenID: e.target.value });
                  }}
                />
                {/* <FormErrorMessage>First name is required.</FormErrorMessage> */}
              </FormControl>
              <FormControl isRequired isInvalid={error && !form.dob}>
                <FormLabel htmlFor="dob">Dat of birth</FormLabel>
                <Input
                  id="dob"
                  value={form.dob}
                  isDisabled={!isEdit}
                  _disabled={{ opacity: 0.8 }}
                  onChange={(e) => {
                    setForm({ ...form, dob: e.target.value });
                  }}
                />
                {/* <FormErrorMessage>First name is required.</FormErrorMessage> */}
              </FormControl>
              <FormControl isRequired isInvalid={error && !form.phone_number}>
                <FormLabel htmlFor="phone_number">Phone number</FormLabel>
                <Input
                  id="phone_number"
                  value={form.phone_number}
                  isDisabled={!isEdit}
                  _disabled={{ opacity: 0.8 }}
                  onChange={(e) => {
                    setForm({ ...form, phone_number: e.target.value });
                  }}
                />
                {/* <FormErrorMessage>First name is required.</FormErrorMessage> */}
              </FormControl>
              <FormControl isRequired isInvalid={error && !form.email}>
                <FormLabel htmlFor="email">Email address</FormLabel>
                <Input
                  id="email"
                  value={form.email}
                  isDisabled={!isEdit}
                  _disabled={{ opacity: 0.8 }}
                  onChange={(e) => {
                    setForm({ ...form, email: e.target.value });
                  }}
                />
                {/* <FormErrorMessage>First name is required.</FormErrorMessage> */}
              </FormControl>
            </SimpleGrid>
          </Box>
        </Flex>

        <Flex sx={container3}>
          <Heading as="h4" size="md">
            Doctor Information
          </Heading>
          <Box>
            <VStack spacing={4}>
              <HStack spacing={4} w="100%">
                {/* <FormControl isInvalid={error && !form.EC_name} w="50%">
                  <FormLabel htmlFor="ec-name">Department</FormLabel>
                  <Input value={props.staffData.department_name} isReadOnly />
                </FormControl> */}
                <FormControl
                  isRequired
                  // isInvalid={error && !form.department}
                  w="50%"
                >
                  <FormLabel htmlFor="department">Department</FormLabel>
                  <Select
                    isDisabled={!isEdit}
                    _disabled={{ opacity: 0.8 }}
                    value={form.departmentID}
                    onChange={(e) => {
                      setForm({ ...form, departmentID: e.target.value });
                    }}
                  >
                    {props.department.map((item, i) => (
                      <option key={item.id} value={item.departmentID}>
                        {item.department_name}
                      </option>
                    ))}
                  </Select>
                  {/* <FormErrorMessage>First name is required.</FormErrorMessage> */}
                </FormControl>
                {/* <FormControl isInvalid={error && !form.EC_Relationship} w="50%">
                  <FormLabel htmlFor="ec-relationship">Position</FormLabel>

                  <Input value={props.staffData.position_name} isReadOnly />
                </FormControl>  */}
                <FormControl
                  isRequired
                  // isInvalid={error && !form.position}
                  w="50%"
                >
                  <FormLabel htmlFor="position">Position</FormLabel>
                  <Select
                    isDisabled={!isEdit}
                    _disabled={{ opacity: 0.8 }}
                    value={form.positionID}
                    onChange={(e) => {
                      setForm({ ...form, positionID: e.target.value });
                    }}
                  >
                    {props.position.map((item, i) => (
                      <option key={item.id} value={item.positionID}>
                        {item.position_name}
                      </option>
                    ))}
                  </Select>
                  {/* <FormErrorMessage>First name is required.</FormErrorMessage> */}
                </FormControl>
              </HStack>
              {/* <FormControl
                isReadOnly
                isInvalid={error && !form.licensed_number}
                w="100%"
              >
                <FormLabel htmlFor="licensed_number">Licensed Number</FormLabel>
                <Input
                  type="number"
                  id="licensed_number"
                  value={props.staffData.licensed_number}
                  onChange={(e) => {
                    setForm({ ...form, licensed_number: e.target.value });
                  }}
                />
              </FormControl> */}
              <FormControl isRequired isInvalid={error && !form.license_number}>
                <FormLabel htmlFor="license_number">Licensed number</FormLabel>
                <Input
                  id="first-name"
                  value={form.license_number}
                  isDisabled={!isEdit}
                  _disabled={{ opacity: 0.8 }}
                  onChange={(e) => {
                    setForm({ ...form, license_number: e.target.value });
                  }}
                />
                {/* <FormErrorMessage>First name is required.</FormErrorMessage> */}
              </FormControl>
            </VStack>
          </Box>
        </Flex>

        <Flex sx={container3}>
          <Heading as="h4" size="md">
            Authentication information
          </Heading>
          <HStack spacing={4}>
            <FormControl isRequired isInvalid={error && !form.username}>
              <FormLabel htmlFor="first-name">Username</FormLabel>
              <Input
                id="first-name"
                value={form.username}
                isDisabled={!isEdit}
                _disabled={{ opacity: 0.8 }}
                onChange={(e) => {
                  setForm({ ...form, username: e.target.value });
                }}
              />
              {/* <FormErrorMessage>First name is required.</FormErrorMessage> */}
            </FormControl>
            <FormControl isRequired isInvalid={error && !form.password}>
              <FormLabel htmlFor="first-name">Password</FormLabel>
              <Input
                id="first-name"
                value={form.password}
                isDisabled={!isEdit}
                _disabled={{ opacity: 0.8 }}
                onChange={(e) => {
                  setForm({ ...form, password: e.target.value });
                }}
              />
              {/* <FormErrorMessage>First name is required.</FormErrorMessage> */}
            </FormControl>
          </HStack>
        </Flex>
        <HStack justify="end">
          {!isEdit ? (
            <Button
              sx={buttonStyle(Colour.Yellow, Colour.Black)}
              onClick={() => setIsEdit(true)}
            >
              Edit
            </Button>
          ) : (
            <ButtonGroup>
              <Button
                sx={buttonStyle(Colour.Green, Colour.White)}
                onClick={() => onSummitClick()}
              >
                Submit
              </Button>
              <Button
                sx={buttonStyle(Colour.Red, Colour.White)}
                onClick={() => setIsEdit(false)}
              >
                Cancel
              </Button>
            </ButtonGroup>
          )}
        </HStack>
      </Flex>
    </div>
  );
};

export const getServerSideProps = async (context) => {
  let staffID = context.params.staffID;
  const staffData = await axios.get(`${url}/api/getDoctor/${staffID}`);
  const department = await axios.get(`${url}/api/getDepartment`);
  const position = await axios.get(`${url}/api/getPosition`);
  return {
    props: {
      staffData: staffData.data,
      department: department.data,
      position: position.data,
    },
  };
};
