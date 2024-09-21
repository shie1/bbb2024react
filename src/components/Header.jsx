import { Box, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { routes } from "..";
import { IconChevronDown } from "@tabler/icons-react";
import { useState } from "react";
import { motion } from 'framer-motion';

export default function Header() {
    const [open, setOpen] = useState(false);

    return (<Box as="header" sx={{
        p: 4,
        bg: 'purple.700',
        borderRadius: '1.2rem',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
    }}>
        <Box sx={{
            display: 'flex',
            flexDirection: "row",
            alignItems: 'center',
            justifyContent: 'space-between',
        }}>
            <Text as={Link} to="/" sx={{
                fontSize: '2xl',
                fontWeight: 500,
            }}>Balynokok</Text>
            <Box sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 2,
                '@media (max-width: 62em)': {
                    display: 'none',
                },
                '& > *:hover': {
                    color: 'gray.300'
                }
            }}>
                {routes.map(route => (
                    <Link key={route.href} to={route.href} sx={{
                        mx: 2,
                        cursor: 'pointer',
                    }}>{route.name}</Link>
                ))}
            </Box>
            <Box sx={{
                '@media (min-width: 62em)': {
                    display: 'none',
                },
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <motion.div
                    animate={{
                        rotateX: open ? 180 : 0,
                    }}
                    onClick={() => setOpen(!open)}
                >
                    <IconChevronDown size={24} />
                </motion.div>
            </Box>
        </Box>
        <Box as={motion.div} sx={{
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            flexShrink: 0,
            '& *': {
                flexShrink: 0,
            },
            '@media (min-width: 62em)': {
                display: 'none',
            }
        }} animate={{
            height: open ? 'auto' : 0,
        }}>
            <Box sx={{
                height: 2,
            }} />
            {routes.map(route => (
                <Link key={route.href} to={route.href} sx={{
                    display: 'block',
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