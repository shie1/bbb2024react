import {
    Box,
    IconButton,
    Popover,
    PopoverArrow,
    PopoverBody,
    PopoverContent,
    PopoverTrigger,
    Table,
    TableCaption,
    TableContainer,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
} from "@chakra-ui/react";
import { IconBubble, IconChevronLeft, IconChevronRight, IconSchool, IconUser } from "@tabler/icons-react";
import { createElement, useCallback, useEffect, useRef, useState } from "react";

const tagok = [
    {
        name: "Hettich Rebeka Viktória",
        avatar: '/r_avatar.jpg',
    },
    {
        name: "Tóth Tamás Bence",
        avatar: 'https://avatars.githubusercontent.com/u/134372668?v=4',
        about: '3 éve foglalkozom weboldalak fejlesztésével. Általában ReactJS segítségével szoktam "Frontend" weboldalakat készíteni. A backend részhez NodeJS-t használok. FullStack alkalmazásokhoz NextJs-t használok.'
    },
    {
        name: 'Sonkoly Bence',
        avatar: 'https://avatars.githubusercontent.com/u/58268847?v=4',
        about: `4 éve foglalkozom weboldalak fejlesztésével. Általában NextJS segítségével szoktam "Full Stack" weboldalakat készíteni. 
        A backend részhez NodeJS-t, a frontend-hez pedig Reactot használok.`
    },
    {
        name: "Szabó-Horváth Eszter",
        role: "Felkészítő tanár",
        icon: IconSchool,
    }
]

export default function Home() {
    const [tagIndex, setTagIndex] = useState(0);
    const scrollerRef = useRef(null);

    const scrollToIndex = useCallback((index) => {
        if (scrollerRef.current) {
            const scroller = scrollerRef.current;
            scroller.scrollTo({
                left: scroller.clientWidth * index,
                behavior: 'smooth',
            });
        }
    }, [scrollerRef]);

    useEffect(() => {
        if (scrollerRef.current) {
            const scroller = scrollerRef.current;
            const listener = (event) => {
                const index = Math.round(event.target.scrollLeft / scroller.clientWidth);
                setTagIndex(index);
            }
            scroller.addEventListener('scroll', listener);
            return () => {
                scroller.removeEventListener('scroll', listener);
            }
        }
    }, [tagIndex, scrollerRef]);

    return (
        <>
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 4,
            }}>
                <Text sx={{
                    textAlign: 'center',
                    fontSize: '4xl',
                    fontWeight: 'bold',
                    color: 'purple.700',
                    lineHeight: 1,
                }}>
                    Büszke csapatunk
                </Text>
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

                        animation: 'grid-bg-animation 40s linear infinite',

                        display: 'flex',
                        flexDirection: 'row',
                        overflowX: 'auto',
                        '&::-webkit-scrollbar': {
                            display: 'none',
                        },

                        scrollSnapType: 'x mandatory',

                        '@media (hover: hover)': {
                            pointerEvents: 'none',
                        }
                    }}
                >
                    {tagok.map((tag, index) => (
                        <Box
                            key={index}
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
                            {tag.avatar && <Box
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
                            />}
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
                                {tag.role && <Text sx={{
                                    backgroundColor: 'purple.700',
                                    color: 'white',
                                    borderRadius: '.4rem',
                                    fontSize: 'md',
                                    fontWeight: 'bold',
                                    fontStyle: 'italic',
                                    width: 'fit-content',
                                    margin: tag.avatar ? 'unset' : 'auto',
                                    p: 2,
                                    px: 4,
                                    textAlign: 'center',
                                    display: 'flex',
                                    alignItems: 'center',
                                    flexDirection: 'row',
                                    gap: 2,
                                }}>
                                    {tag.icon && createElement(tag.icon)}
                                    {tag.role}
                                </Text>}
                                {tag.about && <Popover>
                                    <PopoverTrigger>
                                        <Box as="button" sx={{
                                            backgroundColor: 'purple.700',
                                            color: 'white',
                                            borderRadius: '.4rem',
                                            fontSize: 'md',
                                            fontWeight: 'bold',
                                            display: 'flex',
                                            alignItems: 'center',
                                            flexDirection: 'row',
                                            gap: 2,
                                            width: 'fit-content',
                                            cursor: 'pointer',
                                            p: 2,
                                            px: 4,
                                            pointerEvents: 'all',
                                            '&:hover': {
                                                backgroundColor: 'purple.800',
                                            }
                                        }}>
                                            <IconBubble size={20} /><span>Rólam</span>
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
                                </Popover>}
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
                        scrollToIndex(tagIndex === 0 ? tagok.length - 1 : tagIndex - 1);
                    }}>
                        <IconChevronLeft />
                    </IconButton>
                    {tagok.map((tag, index) => (
                        <IconButton
                            key={index}
                            colorScheme="purple"
                            onClick={() => {
                                scrollToIndex(index);
                            }}
                            sx={{
                                backgroundColor: index === tagIndex ? 'purple.500' : 'transparent',
                                color: index === tagIndex ? 'white' : 'purple.500',
                                borderRadius: 'full',
                                _hover: {
                                    backgroundColor: 'purple.600',
                                    color: 'white',
                                },
                            }}
                        >
                            {createElement(tag.icon || IconUser)}
                        </IconButton>
                    ))}
                    <IconButton sx={{
                        borderRadius: 'full',
                    }} colorScheme="purple" onClick={() => {
                        scrollToIndex(tagIndex === tagok.length - 1 ? 0 : tagIndex + 1);
                    }}>
                        <IconChevronRight />
                    </IconButton>
                </Box>
            </Box>
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 4,
            }}>
                <Text sx={{
                    textAlign: 'center',
                    fontSize: '4xl',
                    fontWeight: 'bold',
                    color: 'purple.700',
                    lineHeight: 1,
                }}>
                    A "<span style={{
                        fontStyle: 'italic',
                    }}>balynokokról</span>" bővebben
                </Text>
                <Box sx={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    '& > *': {
                        textAlign: "justify",
                    }
                }}>
                    <Text>
                        A Székesfehérvári SzC Széchenyi István Műszaki Technikum 12.E osztályának tanulói vagyunk. Informatika és távközlés szakon indultunk a 2021/2022-es tanévben és a sikeres ágazati alapvizsgánk után szoftverfejlesztő ágazaton folytattuk tovább a tanulmányainkat.
                    </Text>
                    <Text>
                        Csapatunkból mindhárman a webfejlesztésben találtuk meg a számunkra legérdekesebb területet és a legtöbb tapasztalatunkat is ezen a területen szereztük. Már korábban is számos tanulmányi versenyen mérettettük meg tudásunkat egyénileg és az idei évben szerveződtünk össze a Bakonyi Bitfaragó Bajnokságra Szabó-Horváth Eszter felkészítő tanárunk támogatásával.
                    </Text>
                </Box>
                <TableContainer sx={{
                    width: '100%',
                    border: '1px solid var(--chakra-colors-gray-200)',
                    borderRadius: '1.2rem',
                }}>
                    <Table variant="simple">
                        <TableCaption>
                            A projektben használt technológiák
                        </TableCaption>
                        <Thead>
                            <Tr>
                                <Th>Technológia</Th>
                                <Th>Felhasználás</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            <Tr>
                                <Td>React</Td>
                                <Td>JavaScript könyvtár felhasználói felületek készítésére.</Td>
                            </Tr>
                            <Tr>
                                <Td>Framer Motion</Td>
                                <Td>A CSS keyframek mellett a bonyolultabb animációk készítésére.</Td>
                            </Tr>
                            <Tr>
                                <Td>Chakra UI</Td>
                                <Td>Alap komponensek és stílusok.</Td>
                            </Tr>
                            <Tr>
                                <Td>Git</Td>
                                <Td>Kollaboráció és verziókezelés.</Td>
                            </Tr>
                            <Tr>
                                <Td>Figma</Td>
                                <Td>Vázlatok készítése.</Td>
                            </Tr>
                            <Tr>
                                <Td>Visual Studio Code</Td>
                                <Td>Fejlesztői környezet.</Td>
                            </Tr>
                            <Tr>
                                <Td>Tabler Icons</Td>
                                <Td>Ikonszett.</Td>
                            </Tr>
                            <Tr>
                                <Td>GitHub</Td>
                                <Td>Git tárhely.</Td>
                            </Tr>
                        </Tbody>
                    </Table>
                </TableContainer>
            </Box>

        </>
    );
}