import { Box, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { routes } from "..";

export default function Header() {
    return (<Box as="header" sx={{
        p: 4,
        bg: 'teal.600',
        borderRadius: '1.2rem',
        color: 'white',
        display: 'flex',
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: 'space-between',
    }}>
        <Text sx={{
            fontSize: '2xl',
            fontWeight: 500,
        }}>Balynokok</Text>
        <Box sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 2,
        }}>
            {routes.map(route => (
                <Link key={route.href} to={route.href} sx={{
                    mx: 2,
                    cursor: 'pointer',
                    _hover: {
                        color: 'gray.300'
                    }
                }}>{route.name}</Link>
            ))}
        </Box>
    </Box>)
}