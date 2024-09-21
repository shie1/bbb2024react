import {
    Box,
    IconButton,
    Popover,
    PopoverArrow,
    PopoverBody,
    PopoverContent,
    PopoverTrigger,
    Text,
} from "@chakra-ui/react";
import { IconBubble, IconChevronLeft, IconChevronRight, IconUser } from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";

const tagok = [
    {
        name: "Hettich Rebeka Viktória",
        avatar: 'https://place-hold.it/800/800',
        about: ""
    },
    {
        name: "Tóth Tamás Bence",
        avatar: 'https://place-hold.it/800/800',
        about: ""
    },
    {
        name: 'Sonkoly Bence',
        avatar: 'https://avatars.githubusercontent.com/u/58268847?v=4',
        about: `4 éve foglalkozom weboldalak fejlesztésével. Általában NextJS segítségével szoktam "Full Stack" weboldalakat készíteni. 
        A backend részhez NodeJS-t, a frontend-hez pedig Reactot használok.`
    },
]

export default function Home() {
    const [tagIndex, setTagIndex] = useState(0);
    const scrollerRef = useRef(null);

    useEffect(() => {
        if (scrollerRef.current) {
            scrollerRef.current.scrollTo({
                left: tagIndex * scrollerRef.current.clientWidth,
                behavior: 'smooth',
            });
        }
    }, [tagIndex]);

    return (
        <>
            <Box
                ref={scrollerRef}
                sx={{
                    width: '100%',

                    backgroundColor: "white",
                    borderRadius: '1.2rem',
                    backgroundImage: 'linear-gradient(var(--chakra-colors-purple-700) 1px, transparent 1px), linear-gradient(to right, var(--chakra-colors-purple-700) 1px, transparent 1px)',
                    backgroundSize: '40px 40px',
                    backgroundPosition: '10px 10px, 20px 20px',
                    shadow: 'lg',

                    display: 'flex',
                    flexDirection: 'row',
                    overflowX: 'auto',
                    '&::-webkit-scrollbar': {
                        display: 'none',
                    },

                    scrollSnapType: 'x mandatory',
                }}
            >
                {tagok.map((tag, index) => (
                    <Box
                        index={index}
                        sx={{
                            p: 6,
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 6,
                            width: '100%',
                            flexShrink: 0,
                            scrollSnapAlign: 'start',
                            '@media (max-width: 48em)': {
                                flexDirection: 'column',
                            },
                        }}>
                        <Box
                            sx={{
                                width: "12rem",
                                aspectRatio: '1/1',
                                height: 'auto',
                                backgroundColor: 'purple.700',
                                borderRadius: '1.2rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                animation: 'avatar-floating 6s ease-in-out infinite',
                                backgroundImage: `url(${tag.avatar})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                border: '4px solid var(--chakra-colors-purple-700)',
                            }}
                        />
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2,
                            alignItems: 'flex-end',
                            justifyContent: 'center',
                            minWidth: '12rem',
                            '@media (max-width: 48em)': {
                                alignItems: 'center',
                                minWidth: 'unset',
                            },
                        }}>
                            <Text sx={{
                                backgroundColor: 'purple.700',
                                color: 'white',
                                borderRadius: '.4rem',
                                fontSize: 'xl',
                                fontWeight: 'bold',
                                width: '100%',
                                p: 2,
                                px: 4,
                                textAlign: 'right',
                                '@media (max-width: 48em)': {
                                    textAlign: 'center',
                                },
                            }}>
                                {tag.name}
                            </Text>
                            <Popover>
                                <PopoverTrigger>
                                    <Box as="button" sx={{
                                        backgroundColor: 'purple.700',
                                        color: 'white',
                                        borderRadius: '.4rem',
                                        fontSize: 'xl',
                                        fontWeight: 'bold',
                                        display: 'flex',
                                        flexDirection: 'row',
                                        gap: 2,
                                        width: 'fit-content',
                                        cursor: 'pointer',
                                        p: 2,
                                        px: 4,
                                        '&:hover': {
                                            backgroundColor: 'purple.800',
                                        }
                                    }}>
                                        <IconBubble /><span>Rólam</span>
                                    </Box>
                                </PopoverTrigger>
                                <PopoverContent sx={{
                                    maxWidth: '100vw',
                                }}>
                                    <PopoverArrow />
                                    <PopoverBody>
                                        {tag.about}
                                    </PopoverBody>
                                </PopoverContent>
                            </Popover>
                        </Box>
                    </Box>
                ))}
            </Box>
            <Box sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 2,
            }}>
                <IconButton sx={{
                    borderRadius: 'full',
                }} rounded colorScheme="purple" onClick={() => {
                    setTagIndex(tagIndex === 0 ? tagok.length - 1 : tagIndex - 1);
                }}>
                    <IconChevronLeft />
                </IconButton>
                {tagok.map((tag, index) => (
                    <IconButton
                        key={index}
                        colorScheme="purple"
                        onClick={() => setTagIndex(index)}
                        sx={{
                            backgroundColor: index === tagIndex ? 'purple.700' : 'transparent',
                            color: index === tagIndex ? 'white' : 'purple.700',
                            borderRadius: 'full',
                            _hover: {
                                backgroundColor: 'purple.800',
                                color: 'white',
                            }
                        }}
                    >
                        <IconUser />
                    </IconButton>
                ))}
                <IconButton sx={{
                    borderRadius: 'full',
                }} colorScheme="purple" onClick={() => {
                    setTagIndex(tagIndex === tagok.length - 1 ? 0 : tagIndex + 1);
                }}>
                    <IconChevronRight />
                </IconButton>
            </Box>
        </>
    );
}