import { Image, Container, Box, Heading } from '@chakra-ui/react'
import axios from 'axios'
import { useEffect, useState } from 'react'
import Navbar from '../component/navbar'
import Colour from '../Colour'

export default () =>
{
    let container = {
        width: '100vw',
        paddingLeft: '360px',
        marginTop: '64px',
        bgColor: Colour.AlmostWhite,
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

    return (
        <div>
            <Box sx={container} >
                <Heading>
                    ERROR BRO
                </Heading>
                <Box sx={line}></Box>
            </Box>
        </div>
    )
}



