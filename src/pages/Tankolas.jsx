import {
    Alert,
    AlertDescription,
    AlertIcon,
    Box,
    Button,
    Input,
    InputGroup,
    InputLeftElement,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Tab,
    Table,
    TableCaption,
    TableContainer,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
} from "@chakra-ui/react";
import { IconArrowBarRight, IconArrowBarToRight, IconCalendar, IconCar, IconCash, IconGasStation, IconPlus, IconTrash } from "@tabler/icons-react";
import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useRef, useState } from "react";
import CurrencyRender from "../components/CurrencyRender";

const mockData = [
    {
        date: new Date("2024-08-01"),
        liters: 50,
        price: 20000,
        mileage: 100000,
    },
    {
        date: new Date("2024-08-02"),
        liters: 40,
        price: 16000,
        mileage: 100200
    },
    {
        date: new Date("2024-08-03"),
        liters: 45,
        price: 18000,
        mileage: 100400
    }
]

const numberFormatter = new Intl.NumberFormat('hu-HU', {
    style: "decimal",
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
})

export default function Tankolas() {
    const [data, setData] = useState(mockData);

    const [filterStart, setFilterStart] = useState(null);
    const [filterEnd, setFilterEnd] = useState(null);

    const dataDisplay = useMemo(() => {
        if (filterStart && filterEnd) {
            return data.filter((entry) => {
                return entry.date >= new Date(filterStart) && entry.date <= new Date(filterEnd);
            })
        }
        return data;
    }, [data, filterStart, filterEnd])

    const months = useMemo(() => {
        const _months = [];
        data.forEach((entry) => {
            const key = `${entry.date.getFullYear()} - ${entry.date.getMonth() + 1}`;
            if (!_months[key]) {
                _months[key] = {
                    liters: 0,
                    price: 0,
                    mileage: 0,
                }
            }
            _months[key].liters += entry.liters;
            _months[key].price += entry.price;
            _months[key].mileage = (() => {
                const sorted = data.filter((e) => {
                    return `${e.date.getFullYear()} - ${e.date.getMonth() + 1}` === key;
                }).sort((a, b) => {
                    return b.date - a.date;
                })

                return sorted[0].mileage - sorted[sorted.length - 1].mileage;
            })();
        });
        return _months;
    }, [data])

    const monthsDisplay = useMemo(() => {
        if (filterStart && filterEnd) {
            return Object.entries(months).filter(([key, entry]) => {
                return new Date(filterStart).getFullYear() === parseInt(key.split(" - ")[0]) && new Date(filterStart).getMonth() + 1 === parseInt(key.split(" - ")[1]);
            })
        }
        return Object.entries(months);
    }, [months, filterStart, filterEnd])

    const trips = useMemo(() => {
        const _data = data.sort((a, b) => {
            return a.date - b.date;
        })
        const _trips = [];
        for (let i = 0; i < data.length - 1; i++) {
            _trips.push({
                start: _data[i].date.toLocaleDateString(),
                end: _data[i + 1].date.toLocaleDateString(),
                liters: _data[i].liters,
                price: _data[i + 1].price,
                mileage: _data[i + 1].mileage - _data[i].mileage,
                consumption: _data[i].liters / ((_data[i + 1].mileage - _data[i].mileage) / 100)
            })
        }
        return _trips.sort((a, b) => {
            return a.consumption - b.consumption;
        });
    }, [data])

    const tripsDisplay = useMemo(() => {
        if (filterStart && filterEnd) {
            return trips.filter((entry) => {
                return new Date(entry.start) >= new Date(filterStart) && new Date(entry.end) <= new Date(filterEnd);
            })
        }
        return trips;
    }, [trips, filterStart, filterEnd])

    const [modalOpen, setModalOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const modalForm = useRef(null);

    return (<>
        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Tankolás rögzítése</ModalHeader>
                <ModalCloseButton />
                <ModalBody sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 4,
                }}>
                    <form ref={modalForm} onSubmit={(e) => {
                        e.preventDefault();
                    }}>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 4,
                        }}>
                            <InputGroup>
                                <InputLeftElement pointerEvents='none'>
                                    <IconCalendar />
                                </InputLeftElement>
                                <Input name="date" type='date' placeholder='Dátum' />
                            </InputGroup>
                            <InputGroup>
                                <InputLeftElement pointerEvents='none'>
                                    <IconGasStation />
                                </InputLeftElement>
                                <Input min={0} name="liters" type='number' placeholder='Liter' />
                            </InputGroup>
                            <InputGroup>
                                <InputLeftElement pointerEvents='none'>
                                    <IconCash />
                                </InputLeftElement>
                                <Input min={0} name="price" type='number' placeholder='Ár' />
                            </InputGroup>
                            <InputGroup>
                                <InputLeftElement pointerEvents='none'>
                                    <IconCar />
                                </InputLeftElement>
                                <Input min={0} name="mileage" type='number' placeholder='Kilométeróra állás' />
                            </InputGroup>
                        </Box>
                    </form>

                    <AnimatePresence>
                        {errorMessage && <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }}>
                            <Alert status="error">
                                <AlertIcon />
                                <AlertDescription>{errorMessage}</AlertDescription>
                            </Alert>
                        </motion.div>}
                    </AnimatePresence>
                </ModalBody>

                <ModalFooter>
                    <Button variant="ghost" colorScheme='red' mr={3} onClick={() => {
                        setModalOpen(false);
                        setErrorMessage('');
                    }}>
                        Mégse
                    </Button>
                    <Button onClick={() => {
                        const formData = new FormData(modalForm.current);
                        const date = formData.get('date');
                        const liters = formData.get('liters');
                        const price = formData.get('price');
                        const mileage = formData.get('mileage');

                        if (!date || !liters || !price || !mileage) {
                            setErrorMessage('Minden mező kitöltése kötelező!');
                            return
                        }

                        if (parseInt(liters) <= 0 || parseInt(price) <= 0 || parseInt(mileage) <= 0) {
                            setErrorMessage('Az értékeknek pozitívnak kell lenniük!');
                            return
                        }

                        if (data.find((entry) => {
                            return entry.date.toLocaleDateString() === new Date(date).toLocaleDateString();
                        })) {
                            setErrorMessage('Ezen a napon már rögzítettél tankolást!');
                            return
                        }

                        setData([...data, {
                            date: new Date(date),
                            liters: parseInt(liters),
                            price: parseInt(price),
                            mileage: parseInt(mileage),
                        }]);
                        setModalOpen(false);
                        setErrorMessage('');
                    }} colorScheme="purple" leftIcon={<IconPlus />}>Rögzítés</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>

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
                Tankolási napló
            </Text>
            <Button onClick={() => setModalOpen(true)} colorScheme="purple" leftIcon={<IconPlus />}>
                Új tankolás
            </Button>
            <Box sx={{
                display: 'flex',
                flexDirection: 'row',
                gap: 4,
                width: '100%',
                alignItems: 'center',
                '@media (max-width: 48em)': {
                    flexDirection: 'column',
                    '& .btn': {
                        width: '100%',
                    }
                }
            }}>
                <InputGroup>
                    <InputLeftElement pointerEvents='none'>
                        <IconArrowBarRight />
                    </InputLeftElement>
                    <Input placeholder='Select Date and Time' size='md' type='date' onChange={(e) => (setFilterStart(e.target.value))} value={filterStart} />
                </InputGroup>
                <InputGroup>
                    <InputLeftElement pointerEvents='none'>
                        <IconArrowBarToRight />
                    </InputLeftElement>
                    <Input placeholder='Select Date and Time' size='md' type='date' onChange={(e) => (setFilterEnd(e.target.value))} value={filterEnd} />
                </InputGroup>
                <Button className="btn" sx={{
                    flexShrink: 0,
                }} colorScheme="red" onClick={() => { setFilterEnd(null); setFilterStart(null) }} leftIcon={<IconTrash />}>
                    Szűrők törlése
                </Button>
            </Box>
            <Tabs colorScheme="purple" sx={{
                width: "100%",
            }}>
                <TabList>
                    <Tab>Összes adat</Tab>
                    <Tab>Havi összesítés</Tab>
                    <Tab>Utak</Tab>
                </TabList>

                <TabPanels>
                    <TabPanel>
                        <TableContainer sx={{
                            border: "1px solid var(--chakra-colors-gray-300)",
                            borderRadius: "1.2rem",
                            width: "100%",
                        }}>
                            <Table variant="simple">
                                <TableCaption>
                                    Az alábbi táblázat tartalmazza az összes rögzített tankolást.
                                </TableCaption>
                                <Thead>
                                    <Tr>
                                        <Th>
                                            Dátum
                                        </Th>
                                        <Th>
                                            Liter
                                        </Th>
                                        <Th>
                                            Ár
                                        </Th>
                                        <Th>
                                            Kilométeróra állás
                                        </Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {dataDisplay.sort((a, b) => {
                                        return b.date - a.date
                                    }).map((entry, index) => (
                                        <Tr key={index}>
                                            <Td>{entry.date.toLocaleDateString()}</Td>
                                            <Td>{numberFormatter.format(entry.liters)} liter</Td>
                                            <Td><CurrencyRender amount={entry.price} /></Td>
                                            <Td>{numberFormatter.format(entry.mileage)} km</Td>
                                        </Tr>
                                    ))}
                                </Tbody>
                            </Table>
                        </TableContainer>
                    </TabPanel>
                    <TabPanel>
                        <TableContainer sx={{
                            border: "1px solid var(--chakra-colors-gray-300)",
                            borderRadius: "1.2rem",
                            width: "100%",
                        }}>
                            <Table variant="simple">
                                <TableCaption>
                                    Hónapok szerinti összesítés
                                </TableCaption>
                                <Thead>
                                    <Tr>
                                        <Th>
                                            Év - Hónap
                                        </Th>
                                        <Th>
                                            Liter
                                        </Th>
                                        <Th>
                                            Ár
                                        </Th>
                                        <Th>
                                            Megtett kilométerek
                                        </Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {monthsDisplay.map(([key, entry], index) => (
                                        <Tr key={index}>
                                            <Td>{key}</Td>
                                            <Td>{numberFormatter.format(entry.liters)} liter</Td>
                                            <Td><CurrencyRender amount={entry.price} /></Td>
                                            <Td>{entry.mileage ? `${numberFormatter.format(entry.mileage)} km` : "?"}</Td>
                                        </Tr>
                                    ))}
                                </Tbody>
                            </Table>
                        </TableContainer>
                    </TabPanel>
                    <TabPanel>
                        <TableContainer sx={{
                            border: "1px solid var(--chakra-colors-gray-300)",
                            borderRadius: "1.2rem",
                            width: "100%",
                        }}>
                            <Table variant="simple">
                                <TableCaption>
                                    Az egyes tankolások közötti különbségek, legalacsonyabb fogyasztástól a legnagyobbig.
                                </TableCaption>
                                <Thead>
                                    <Tr>
                                        <Th>
                                            Kezdeti dátum
                                        </Th>
                                        <Th>
                                            Végső dátum
                                        </Th>
                                        <Th>
                                            Tankolt liter
                                        </Th>
                                        <Th>
                                            Fizetett ár
                                        </Th>
                                        <Th>
                                            Megtett kilométerek
                                        </Th>
                                        <Th>
                                            Fogyasztás
                                        </Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {tripsDisplay.map((entry, index) => (
                                        <Tr key={index}>
                                            <Td>{entry.start}</Td>
                                            <Td>{entry.end}</Td>
                                            <Td>{numberFormatter.format(entry.liters)} liter</Td>
                                            <Td><CurrencyRender amount={entry.price} /></Td>
                                            <Td>{numberFormatter.format(entry.mileage)} km</Td>
                                            <Td>{numberFormatter.format(entry.consumption)} liter/100 km</Td>
                                        </Tr>
                                    ))}
                                </Tbody>
                            </Table>
                        </TableContainer>
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </Box>
    </>)
}