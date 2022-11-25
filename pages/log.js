import {
  Avatar,
  Box,
  ButtonGroup,
  Button,
  Center,
  Flex,
  Image,
  Input,
  InputRightElement,
  InputGroup,
  HStack,
  Text,
  Container,
  Heading,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  CloseButton,
} from "@chakra-ui/react";
import {
  ArrowBackIcon,
  ArrowForwardIcon,
  PlusSquareIcon,
  SearchIcon,
} from "@chakra-ui/icons";

import axios from "axios";
import Colour from "../Colour";
import Loading from "../component/loading";
import { encode, decode } from "js-base64";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import url from "../url";
import { getDate } from "date-fns";

export default (props) => {
  const router = useRouter();

  const [department, setDepartment] = useState(null);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [pageAmount, setPageAmount] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
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
    if (sessionStorage.getItem('positionID') != 3)
    {
      kickOut()
    }
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      let result = await axios.get(`${url}/api/getLog`, {
        headers: {
          page: page,
        },
      });
      // console.log(result.data)
      setData(result.data);
      setIsLoading(false);
      //if result.data[0].page_amount is not null, set pageAmount to result.data[0].page_amount else set to 1
      if (result.data.length !== 0) {
        setPageAmount(Math.ceil(result.data[0].page_amount/10));
      }
      // console.log(result.data)
      // console.log(search)
    };
    fetchData();
  }, [page]);

  let container = {
    width: "100vw",
    paddingLeft: "360px",
    marginTop: "64px",
    bgColor: Colour.AlmostWhite,
  };

  let container2 = {
    flexDirection: "column",
    maxWidth: "container.lg",
    gap: "4",
    width: "100%",
    marginLeft: "360px",
    marginTop: "50px",
    bgColor: Colour.AlmostWhite,
  };

  let line = {
    width: "78vw",
    paddingLeft: "360px",
    bgColor: "#000",
    marginTop: " 12px",
    height: "2px",
    bgColor: Colour.LightGrey,
  };

  let addButton = {
    bg: Colour.DarkGreen,
    color: Colour.White,
    _hover: { filter: "brightness(0.9)" },
    transition: "all 0.2s cubic-bezier(.08,.52,.52,1)",
  };

  let pageButton = {
    bg: Colour.Grey,
    _hover: { filter: "brightness(0.9)" },
    transition: "all 0.2s cubic-bezier(.08,.52,.52,1)",
  };

  // const onClickData = (id) => {
  //     router.push(`/patient/${id}`)
  // }

  return (
    <div style={{ backgroundColor: Colour.AlmostWhite, marginBottom: '80px' }}>
      <Loading isLoading={isLoading} />
      <Box sx={container}>
        <Heading>Log</Heading>
        <Box sx={line}></Box>
      </Box>
      <Flex sx={container2}>
        <TableContainer
          border={"1px solid" + Colour.LightGrey}
          borderRadius="12px"
          bgColor={Colour.White}
        >
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Date</Th>
                <Th>Staff</Th>
                <Th>Description</Th>
              </Tr>
            </Thead>
            <Tbody>
              {data.map((item) => {
                return (
                  <Tr>
                    <Td>{new Date(item.date).toLocaleString()}</Td>
                    {/* {console.log(new Date(item.date).toLocaleString())} */}
                    <Td>
                      {/* {item.staffID} */}
                      <Flex align="center" gap="8px">
                        <Flex h="40px" align="center">
                          {item.staff_firstname + " " + item.staff_lastname}
                        </Flex>
                      </Flex>
                    </Td>
                    <Td whiteSpace="normal">{item.description}</Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </TableContainer>
        <HStack variant="solid" justify="end">
          <Button
            leftIcon={<ArrowBackIcon />}
            sx={pageButton}
            variant="solid"
            onClick={() => {
              if (page > 1) setPage(page - 1);
            }}
            isDisabled={page === 1}
          >
            Previous
          </Button>
          <Center>{page}</Center>
          <Button
            rightIcon={<ArrowForwardIcon />}
            sx={pageButton}
            variant="solid"
            onClick={() => {
              if (page < pageAmount) setPage(page + 1);
            }}
            isDisabled={page === parseInt(pageAmount)}
          >
            Next
          </Button>
        </HStack>
      </Flex>
    </div>
  );
};
