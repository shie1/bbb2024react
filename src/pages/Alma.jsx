import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useToast } from "@chakra-ui/react";
import { IconApple, IconArrowBounce, IconCheck } from "@tabler/icons-react";

const seededRandom = (seed, turn) => {
    const x = Math.sin(seed + turn) * 10000
    return x - Math.floor(x)
}

export default function Alma() {
    const navigate = useNavigate()
    const toast = useToast()

    const { search } = useLocation()
    const { width, height, seed, maxSteps } = useMemo(() => {
        const params = new URLSearchParams(search)
        return {
            width: params.get('w') || 10,
            height: params.get('h') || 10,
            seed: params.get('s') || Math.floor(Math.random() * 1000),
            maxSteps: params.get('ms') || 8,
        }
    }, [search])

    const [remainingSteps, setRemainingSteps] = useState(maxSteps)
    const [harvestedApples, setHarvestedApples] = useState(0)

    const generateFieldData = useCallback((_seed) => {
        const matrix = []
        for (let y = 0; y < height; y++) {
            const row = []
            for (let x = 0; x < width; x++) {
                row.push(Math.floor(seededRandom(_seed, x + y) * 9) + 1)
            }
            matrix.push(row)
        }
        return matrix
    }, [width, height])

    const [fields, setFields] = useState([])

    const [playerPosition, setPlayerPosition] = useState({ x: undefined, y: undefined })

    useEffect(() => {
        if (playerPosition.x !== undefined && playerPosition.y !== undefined) {
            const apple = fields[playerPosition.y][playerPosition.x]
            if (apple !== 0) {
                setHarvestedApples(prev => prev + apple)
                setFields(prev => {
                    const newFields = [...prev]
                    newFields[playerPosition.y][playerPosition.x] = 0
                    return newFields
                })
            }
        }
    }, [playerPosition, fields])

    const checkIfStepPossible = useCallback((x, y) => {
        if (playerPosition.x === undefined && playerPosition.y === undefined) {
            return true
        }
        if (x < 0 || x >= width || y < 0 || y >= height) {
            return false
        }
        if (Math.abs(playerPosition.x - x) + Math.abs(playerPosition.y - y) === 1) {
            return true
        }
        return false
    }, [playerPosition, width, height])

    const playerMove = useCallback((x, y) => {
        if (remainingSteps === 0) {
            return
        }
        if (playerPosition.x === undefined && playerPosition.y === undefined) {
            setPlayerPosition({ x, y })
            return
        }
        if (checkIfStepPossible(x, y)) {
            setPlayerPosition({ x, y })
            setRemainingSteps(prev => prev - 1)
        }
    }, [playerPosition, remainingSteps, checkIfStepPossible])

    useEffect(() => {
        setFields(generateFieldData(seed))
        setRemainingSteps(maxSteps)
        setHarvestedApples(0)
        setPlayerPosition({ x: undefined, y: undefined })
    }, [seed, maxSteps, generateFieldData])

    useEffect(() => {
        // handle arrow keys for movement, if the player is not set, send toast
        const handleKeyDown = (e) => {
            if (playerPosition.x === undefined && playerPosition.y === undefined) {
                if (
                    ["w", "a", "s", "d", "ArrowUp", "ArrowLeft", "ArrowDown", "ArrowRight"].includes(e.key)
                    && !toast.isActive('no-player-position')
                ) {
                    toast({
                        id: 'no-player-position',
                        title: 'Nincs játékos pozíció',
                        description: 'Kattints egy mezőre a játék kezdéséhez!',
                        status: 'warning',
                        duration: 5000,
                        isClosable: true,
                    })
                }
                return
            }
            switch (e.key) {
                case 'w':
                case 'ArrowUp':
                    playerMove(playerPosition.x, playerPosition.y - 1)
                    break
                case 's':
                case 'ArrowDown':
                    playerMove(playerPosition.x, playerPosition.y + 1)
                    break
                case 'a':
                case 'ArrowLeft':
                    playerMove(playerPosition.x - 1, playerPosition.y)
                    break
                case 'd':
                case 'ArrowRight':
                    playerMove(playerPosition.x + 1, playerPosition.y)
                    break
                default:
                    break
            }
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => {
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [playerPosition, playerMove, toast])

    return (
        <>
            <Modal
                isOpen={remainingSteps === 0}
                onClose={() => { }}
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Elfogytak a lépéseid!</ModalHeader>
                    <ModalBody>
                        <Text>Összeszedett almák száma: {harvestedApples}</Text>
                        <Text>Megtett lépések száma: {maxSteps}</Text>
                    </ModalBody>
                    <ModalFooter>
                        <Box sx={{
                            display: 'flex',
                            gap: 4,
                        }}>
                            <Button
                                onClick={() => {
                                    setFields(generateFieldData(seed))
                                    setRemainingSteps(maxSteps)
                                    setHarvestedApples(0)
                                    setPlayerPosition({ x: undefined, y: undefined })
                                }}
                                colorScheme="yellow"
                            >
                                Újrakezdés
                            </Button>
                            <Button
                                onClick={() => {
                                    navigate(`/alma?s=${Math.floor(Math.random() * 1000)}`)
                                }}
                                colorScheme="blue"
                            >
                                Új játék
                            </Button>
                        </Box>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                gap: 4,
            }}>
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '1.5rem',
                    alignItems: 'center',
                    gap: 6,
                }}>
                    <Box sx={{
                        display: 'flex',
                        gap: 2,
                        alignItems: 'center',
                    }}>
                        <IconArrowBounce />
                        <Text>{remainingSteps}</Text>
                    </Box>
                    <Box sx={{
                        display: 'flex',
                        gap: 2,
                        alignItems: 'center',
                    }}>
                        <IconApple />
                        <Text>{harvestedApples}</Text>
                    </Box>
                </Box>
                <Box as="table" sx={{
                    borderCollapse: 'collapse',
                    margin: '0 auto',
                    '& td': {
                        '& > div': {
                            width: '4rem',
                            aspectRatio: '1/1',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            '@media (max-width: 768px)': {
                                width: '2rem',
                            },
                            '@media (max-width: 420px)': {
                                width: '1.5rem',
                            }
                        },
                        border: '1px solid #000',
                        textAlign: 'center',
                        verticalAlign: 'middle',
                        fontSize: '1.5rem',
                        fontVariantNumeric: 'tabular-nums',
                        '&.empty': {
                            backgroundColor: 'var(--chakra-colors-gray-600)',
                            color: 'white',
                        },
                        '&.player': {
                            backgroundColor: 'var(--chakra-colors-blue-500)',
                            color: 'white',
                        },
                        '&.possible:hover:not(.empty)': {
                            backgroundColor: 'var(--chakra-colors-blue-200)',
                        }
                    },
                }}>
                    <tbody>
                        {fields.map((row, y) => (
                            <tr
                                key={`${y}-${row.join('-')}`}
                            >
                                {row.map((value, x) => (
                                    <td
                                        onClick={() => {
                                            playerMove(x, y)
                                        }}
                                        key={`${x}-${y}-${value}`}
                                        id={`${x}-${y}`}
                                        className={
                                            (playerPosition.x === x && playerPosition.y === y ? 'player' : '') +
                                            (value === 0 ? ' empty' : '') +
                                            (checkIfStepPossible(x, y) ? ' possible' : '')
                                        }
                                    >
                                        <div>
                                            {value !== 0 ? value : <IconCheck style={{
                                                margin: 'auto',
                                            }} />}
                                        </div>
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </Box>
            </Box>
        </>
    );
}