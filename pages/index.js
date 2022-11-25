import { Alert, AlertIcon, Image, InputRightAddon, InputGroup, InputLeftAddon, Box, Button, FormControl, Heading, Container, Input } from '@chakra-ui/react'
import { useState,useEffect } from 'react'
import axios from 'axios'
import  {useRouter}  from 'next/router'
import checkToken from '../functions/checkToken'
import Loading from '../component/loading'
export default () =>
{
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [wrong, setWrong] = useState(false)
  const [wrongWord, setWrongWord] = useState('')
  const [countWrong, setCountWrong] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(()=>{
    sessionStorage.removeItem('token')
  },[])

  const onLogin = async () =>
  {
    if (username == 'Starboy98' && password == '12345678')
    {
        router.push('https://youtu.be/dQw4w9WgXcQ?t=43')
    }
    else
    {
      setIsLoading(true)
      let result = await axios.post(`/api/login`, {
        username: username,
        password: password
      })
      setIsLoading(false)
      if(result.data.username!=null)
      {
        sessionStorage.setItem('token', result.data.token)
        sessionStorage.setItem('positionID',result.data.positionID)
        sessionStorage.setItem('name',result.data.firstname+' '+result.data.lastname)
        sessionStorage.setItem('profileimg',result.data.profile_img)
        sessionStorage.setItem('staffID', result.data.staffID)
        console.table(result.data)
        router.push('/dashboard')
      }
      else if (result.data.username == null && countWrong < 2) 
      {
          setWrong(true)
          setWrongWord('Wrong username or password')
          setCountWrong(countWrong + 1)
      }
      else if (result.data.username == null && countWrong >= 2 && countWrong < 5)
      {
          setWrong(true)
          setWrongWord('You have entered wrong ' + (countWrong + 1) + ' times. Try "Starboy98" and "12345678"')
          setCountWrong(countWrong + 1)
      }
      else if (result.data.username == null && countWrong >= 5)
      {
          alert('เห็นแก่ความพยายาม ให้เข้าก้ได้')
          router.push('https://youtu.be/dQw4w9WgXcQ?t=43')
      }
    }
  }


  return (
    <div>
      <Loading isLoading={isLoading}/>
    <Container
      margin='0'
      maxWidth='480px'
      width='480px'
      height='400px'
      bgColor='#305F72'
      overflow='hidden'
      position='absolute'
      left='50%'
      top='50%'
      transform='translate(-50%,50%)'
      paddingBottom='16px'
      borderRadius='16px'
    >
      <FormControl
        textAlign='center'
        maxWidth='320px'
        position='absolute'
        left='50%'
        top='50%'
        transform={`translate(-50%, -50%)`}
      >

        <Heading as='h1' marginBottom='32px'  color='#fff'>USER LOGIN</Heading>

        <InputGroup>
          <InputLeftAddon>
            <Image src='/assets/image/user.png' />
          </InputLeftAddon>
          <Input 
            placeholder='Username' 
            marginBottom='24px' 
            color='#fff' 
            focusBorderColor='#fff' 
            onChange={(e) => {setUsername(e.target.value); setWrong(false)}} 
            textAlign='center'

          />
        </InputGroup>


        <InputGroup>
          <Input 
            placeholder='Password' 
            type='password' 
            marginBottom='48px' 
            color='#fff' 
            focusBorderColor='#fff' 
            onChange={(e) => {setPassword(e.target.value); setWrong(false)}} 
            textAlign='center'
          />
          <InputRightAddon>
            <Image src='/assets/image/password.png' />
          </InputRightAddon>
        </InputGroup>

        <Button type="submit" width='320px' onClick={() => { onLogin() }}>
          Login
        </Button>

        {
          (wrong) ? 
            <Alert status='error'
                bg='none'
                color='red'
                position='absolute'
                // padding='0 12px'
            >
              <AlertIcon />
              {wrongWord}
            </Alert>
          : null
        }

      </FormControl>
    </Container>
    </div>
  )
}


