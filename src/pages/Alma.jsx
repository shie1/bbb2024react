import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Box, Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text } from "@chakra-ui/react";
import { IconApple, IconArrowBounce, IconCheck } from "@tabler/icons-react";

export default function Alma() {
    // get route params
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
        const random = (__seed) => {
            const x = Math.sin(__seed++) * 10000;
            return Math.floor((x - Math.floor(x)) * 9) + 1;
        }
        return [...Array(height)].map((_, y) => [...Array(width)].map((_, x) => random(_seed + x + y * width)))
    }, [width, height])

    const fieldData = useMemo(() => generateFieldData(seed), [generateFieldData, seed])

    const [fields, setFields] = useState(fieldData)

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
        if (Math.abs(playerPosition.x - x) + Math.abs(playerPosition.y - y) === 1) {
            return true
        }
        return false
    }, [playerPosition])

    const playerMove = useCallback((x, y) => {
        if (remainingSteps === 0) {
            return
        }
        // if field is empty, dont move
        if (fields[y][x] === 0) {
            return
        }
        // if no player position set, set it
        if (playerPosition.x === undefined && playerPosition.y === undefined) {
            setPlayerPosition({ x, y })
            return
        }
        if (checkIfStepPossible(x, y)) {
            setPlayerPosition({ x, y })
            setRemainingSteps(prev => prev - 1)
        }
    }, [playerPosition, remainingSteps, fields, checkIfStepPossible])

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
                        <Text>Elfogyott a lépéseid száma: {maxSteps}</Text>
                    </ModalBody>
                    <ModalFooter>
                        <Box sx={{
                            display: 'flex',
                            gap: 4,
                        }}>
                            <Button
                                onClick={() => {
                                    window.history.pushState({}, '', `/#/alma?s=${seed}`)
                                    window.location.reload()
                                }}
                                colorScheme="yellow"
                            >
                                Újrakezdés
                            </Button>
                            <Button
                                onClick={() => {
                                    window.history.pushState({}, '', `/#/alma`)
                                    window.location.reload()
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
                        '&.possible:hover': {
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