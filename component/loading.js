import {Container,Image} from '@chakra-ui/react'

export default ({isLoading})=>{
    if(isLoading){
        return(
            <Container
                width='100vw'
                height='100vh'
                backgroundColor='#00000050'
                padding='0'
                margin='0'
                zIndex='10000'
                position='fixed'
                maxWidth='100vw'
                top='0'
                left='0'
            >
                <Image 
                    src='/assets/loading.gif'
                    position='fixed'
                    top='50%'
                    left='50%'
                    transform='translate(-50%,-50%)'
                    width='72px'
                />
            </Container>
        )
    }
}