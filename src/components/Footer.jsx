import { Box, Text } from "@chakra-ui/react";
import AnimatedClock from "./AnimatedClock";
import { IconBrandGithub } from "@tabler/icons-react";

export default function Footer() {
    return (<>
        <Box as="footer" sx={{
            p: 4,
            borderRadius: '1.2rem',
            color: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            bg: 'purple.700',
            flexDirection: 'row',
            // under md
            '@media (max-width: 48em)': {
                flexDirection: 'column',
                gap: 4,
            }
        }}>
            <Box sx={{
                display: 'flex',
                flexDirection: 'row',
                gap: 2,
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                '&:hover': {
                    color: 'gray.300'
                }
            }}
                onClick={() => {
                    window.open("https://github.com/shie1/bbb2024react", "_blank")
                }}
            >
                <IconBrandGithub size={24} />
                <Text sx={{
                    fontWeight: 500,
                    width: 'fit-content',
                }}>
                    Forráskód megtekintése
                </Text>
            </Box>
            <AnimatedClock />
        </Box>
    </>)
}