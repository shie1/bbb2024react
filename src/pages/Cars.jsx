import { Box, ListItem, Text, UnorderedList } from "@chakra-ui/react";
import { useEffect, useMemo, useRef, useState } from "react";

const TILE_SIZE = 30;
const TILE_PER_ROW = 18;
const TILE_PER_COL = TILE_PER_ROW;

const TILE_NAMES = [
    'city_plate',
    'nature_plate',
    'city',
    'house',
    'road_horizontal',
    'road_bottom_left',
    'road_bottom_right',
    'road_top_left',
    'road_top_right',
    'road_vertical',
    'road_vertical_open_left',
    'road_vertical_open_right',
    'road_horizontal_open_top',
    'road_horizontal_open_bottom',
    'road_intersection',
    'turbo_road_bottom_left',
    'turbo_road_bottom_right',
    'turbo_road_top_left',
    'turbo_road_top_right',
    'turbo_road_vertical',
    'turbo_road_vertical_open_left',
    'turbo_road_vertical_open_right',
    'turbo_road_horizontal',
    'turbo_road_horizontal_open_top',
    'turbo_road_horizontal_open_bottom',
    'turbo_road_intersection',
    'service_center_1',
    'service_center_2',
    'service_center_3',
    'battery_1',
    'battery_2',
    'battery_3',
    'fullfillment'
];

const SPECIAL_TILE_SIZES = {
    battery: {
        w: 100,
        h: 60
    },
}

class Grass {
    static TILE_HEIGHT = 3;
    static TILE_WIDTH = 3;

    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.TILE_HEIGHT = Grass.TILE_HEIGHT
        this.TILE_WIDTH = Grass.TILE_WIDTH
        this.id = new Date().getTime();
    }

    draw(ctx, tiles) {
        ctx.drawImage(tiles["nature_plate"], this.x * TILE_SIZE, this.y * TILE_SIZE, TILE_SIZE * Grass.TILE_WIDTH,
            TILE_SIZE * Grass.TILE_HEIGHT
        );
    }
}

class FakeElement {
    static TILE_HEIGHT = 1;
    static TILE_WIDTH = 1;

    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.TILE_HEIGHT = FakeElement.TILE_HEIGHT
        this.TILE_WIDTH = FakeElement.TILE_WIDTH
        this.id = new Date().getTime();
    }

    draw() {
    }
}

class City {
    static TILE_HEIGHT = 3;
    static TILE_WIDTH = 3;

    constructor(x, y, requirements = [
        "battery_1",
    ]) {
        this.x = x;
        this.y = y;
        this.TILE_HEIGHT = City.TILE_HEIGHT
        this.TILE_WIDTH = City.TILE_WIDTH
        this.requirements = requirements;
        this.id = new Date().getTime();
    }

    checkConnection(element) {
        const ex = element.x;
        const ey = element.y;
        const ew = element.TILE_WIDTH;
        const eh = element.TILE_HEIGHT;

        const tx = this.x;
        const ty = this.y;
        const tw = this.TILE_WIDTH;
        const th = this.TILE_HEIGHT;

        let dir = null;

        if (ex + ew === tx && ey === ty + Math.floor(th / 2)) {
            if (!dir) {
                dir = 'right';
            } else {
                throw new Error('Multiple connections');
            }
        }
        if (ex === tx + tw && ey === ty + Math.floor(th / 2)) {
            if (!dir) {
                dir = 'left';
            } else {
                throw new Error('Multiple connections');
            }
        }
        if (ex === tx + Math.floor(tw / 2) && ey + eh === ty) {
            if (!dir) {
                dir = 'bottom';
            } else {
                throw new Error('Multiple connections');
            }
        }
        if (ex === tx + Math.floor(tw / 2) && ey === ty + th) {
            if (!dir) {
                dir = 'top';
            } else {
                throw new Error('Multiple connections');
            }
        }

        return dir;
    }

    getFulfillingServiceCenters(gameElements) {
        return gameElements.filter(element => element instanceof ServiceCenter).filter(sc => sc.getFulfilledCities(gameElements).some(city => city.id === this.id));
    }

    checkFullfillment(gameElements) {
        const fulfillingServiceCenters = this.getFulfillingServiceCenters(gameElements);
        let fullfilled = {}
        this.requirements.forEach(req => {
            fullfilled[req] = fulfillingServiceCenters.some(sc => sc.battery === parseInt(req.split('_')[1]));
        })
        return fullfilled;
    }

    checkOverlap(element) {
        const ex = element.x;
        const ey = element.y;
        const ew = element.TILE_WIDTH;
        const eh = element.TILE_HEIGHT;

        const tx = this.x;
        const ty = this.y;
        const tw = this.TILE_WIDTH;
        const th = this.TILE_HEIGHT;

        return ex < tx + tw && ex + ew > tx && ey < ty + th && ey + eh > ty;
    }

    draw(ctx, tiles, {
        showRequirements = false,
        gameElements,
    }) {
        ctx.drawImage(tiles["city_plate"], this.x * TILE_SIZE, this.y * TILE_SIZE, TILE_SIZE * City.TILE_WIDTH,
            TILE_SIZE * City.TILE_HEIGHT
        );
        ctx.drawImage(tiles['city'], this.x * TILE_SIZE + TILE_SIZE, this.y * TILE_SIZE + TILE_SIZE, TILE_SIZE, TILE_SIZE);
        if (showRequirements) {
            let { w, h } = SPECIAL_TILE_SIZES.battery
            w = w / 3;
            h = h / 3;
            const boxSpacing = 4
            const boxPaddingX = 8
            const boxPaddingY = boxPaddingX / 2
            const boxWidth = w * (this.requirements.length) + (boxSpacing * (this.requirements.length - 1)) + (boxPaddingX * 2)
            const boxHeight = h + (boxPaddingY * 2)
            ctx.fillStyle = 'rgba(0, 0, 0, .5)';
            ctx.fillRect(
                this.x * TILE_SIZE + (TILE_SIZE * 1.5) - (boxWidth / 2),
                this.y * TILE_SIZE - boxHeight / 2,
                boxWidth,
                boxHeight
            )

            const fullfillment = this.checkFullfillment(gameElements);
            Object.keys(fullfillment).forEach((req, i) => {
                const batX = this.x * TILE_SIZE + (TILE_SIZE * 1.5) - (boxWidth / 2) + boxPaddingX + (w + boxSpacing) * i
                const batY = this.y * TILE_SIZE - boxHeight / 2 + boxPaddingY
                ctx.drawImage(tiles[req],
                    batX,
                    batY,
                    w,
                    h);
                const isFullfilled = fullfillment[req];
                if (isFullfilled) {
                    const size = 20
                    ctx.drawImage(tiles["fullfillment"],
                        batX + w - size,
                        batY + h - size,
                        size, size
                    )
                }
            })
        }
    }
}

class ServiceCenter {
    static TILE_HEIGHT = 2;
    static TILE_WIDTH = 1;

    static RANGE = 4;

    constructor(x, y, battery = 1) {
        this.x = x;
        this.y = y;
        this.battery = battery;
        this.id = new Date().getTime();
        this.RANGE = ServiceCenter.RANGE;
        this.TILE_HEIGHT = ServiceCenter.TILE_HEIGHT
        this.TILE_WIDTH = ServiceCenter.TILE_WIDTH
    }

    draw(ctx, tiles, {
        gameElements
    }) {
        ctx.drawImage(tiles[`service_center_${this.battery}`], this.x * TILE_SIZE, this.y * TILE_SIZE, TILE_SIZE * ServiceCenter.TILE_WIDTH,
            TILE_SIZE * ServiceCenter.TILE_HEIGHT
        );
    }

    getStarterRoads(gameElements) {
        const starterRoads = gameElements.filter(element => element instanceof Road && (
            (element.x === this.x && element.y === this.y + this.TILE_HEIGHT) || // bottom
            (element.x === this.x && element.y === this.y - (this.TILE_HEIGHT - 1)) || // top
            (element.x === this.x - Road.TILE_WIDTH && element.y === this.y + (this.TILE_HEIGHT - 1)) || // left
            (element.x === this.x + Road.TILE_WIDTH && element.y === this.y + (this.TILE_HEIGHT - 1)) // right
        ));
        return starterRoads
    }

    getAffectedRoads(gameElements) {
        const starterRoads = this.getStarterRoads(gameElements);

        const affectedRoads = [...starterRoads];

        const alreadyAdded = new Set(starterRoads.map(road => road.id));

        let remainingSteps = this.RANGE;
        while (remainingSteps > 0) {
            const newAffectedRoads = []
            for (const road of affectedRoads) {
                const roads = road.getNearbyRoads(gameElements);
                roads.forEach((r) => {
                    if (r && !alreadyAdded.has(r.id)) {
                        newAffectedRoads.push(r);
                        alreadyAdded.add(r.id);
                    }
                });
            }
            affectedRoads.push(...newAffectedRoads);
            remainingSteps -= 1;
        }

        return affectedRoads;
    }

    getFulfilledCities(gameElements) {
        const affectedRoads = this.getAffectedRoads(gameElements);
        const connectedCities = []
        const alreadyAdded = new Set();
        for (const road of affectedRoads) {
            const cityDir = road.getConnectedCity(gameElements);
            const city = gameElements.find(element => element instanceof City && element.checkConnection(road) === cityDir);
            if (city && !alreadyAdded.has(city.id)) {
                connectedCities.push(city);
                alreadyAdded.add(city.id);
            }
        }
        const fulfilledCities = connectedCities.filter(city => {
            return city.requirements.includes(`battery_${this.battery}`);
        });
        return fulfilledCities;
    }

    checkOverlap(element) {
        const ex = element.x;
        const ey = element.y;
        const ew = element.TILE_WIDTH;
        const eh = element.TILE_HEIGHT;

        const tx = this.x;
        const ty = this.y;
        const tw = this.TILE_WIDTH;
        const th = this.TILE_HEIGHT;

        return ex < tx + tw && ex + ew > tx && ey < ty + th && ey + eh > ty;
    }
}

class Road {
    static TILE_HEIGHT = 1;
    static TILE_WIDTH = 1;

    constructor(x, y, isTurbo = false) {
        this.x = x;
        this.y = y;
        this.isTurbo = isTurbo;
        this.TILE_HEIGHT = Road.TILE_HEIGHT
        this.TILE_WIDTH = Road.TILE_WIDTH
        this.id = new Date().getTime();
    }

    getNearbyRoads(gameElements) {
        return [
            gameElements.find(element => element instanceof Road && element.x === this.x - Road.TILE_WIDTH && element.y === this.y),
            gameElements.find(element => element instanceof Road && element.x === this.x + Road.TILE_WIDTH && element.y === this.y),
            gameElements.find(element => element instanceof Road && element.x === this.x && element.y === this.y - Road.TILE_HEIGHT),
            gameElements.find(element => element instanceof Road && element.x === this.x && element.y === this.y + Road.TILE_HEIGHT),
        ];
    }

    checkOverlap(element) {
        const ex = element.x;
        const ey = element.y;
        const ew = element.TILE_WIDTH;
        const eh = element.TILE_HEIGHT;

        const tx = this.x;
        const ty = this.y;
        const tw = this.TILE_WIDTH;
        const th = this.TILE_HEIGHT;

        return ex < tx + tw && ex + ew > tx && ey < ty + th && ey + eh > ty;
    }

    getConnectedCity(gameElements) {
        return gameElements.filter((elem) => elem instanceof City).map(city => city.checkConnection(this)).find(dir => dir);
    }

    getTile(gameElements) {
        const roads = this.getNearbyRoads(gameElements);
        const cityDir = this.getConnectedCity(gameElements);
        const left = roads[0] || cityDir === 'left';
        const right = roads[1] || cityDir === 'right';
        const top = roads[2] || cityDir === 'top';
        const bottom = roads[3] || cityDir === 'bottom';

        let tileName = 'road_intersection';

        if (left && right && !top && !bottom) {
            tileName = 'road_horizontal';
        }
        if (left && !right && !top && !bottom) {
            tileName = 'road_horizontal';
        }
        if (!left && right && !top && !bottom) {
            tileName = 'road_horizontal';
        }

        if (top && bottom && !left && !right) {
            tileName = 'road_vertical';
        }
        if (!top && bottom && !left && !right) {
            tileName = 'road_vertical';
        }
        if (top && !bottom && !left && !right) {
            tileName = 'road_vertical';
        }

        if (left && bottom && !right && !top) {
            tileName = 'road_top_right';
        }
        if (right && bottom && !left && !top) {
            tileName = 'road_top_left';
        }
        if (left && top && !right && !bottom) {
            tileName = 'road_bottom_right';
        }
        if (right && top && !left && !bottom) {
            tileName = 'road_bottom_left';
        }

        if (left && !right && top && bottom) {
            tileName = 'road_vertical_open_left';
        }
        if (!left && right && top && bottom) {
            tileName = 'road_vertical_open_right';
        }
        if (left && right && top && !bottom) {
            tileName = 'road_horizontal_open_top';
        }
        if (left && right && !top && bottom) {
            tileName = 'road_horizontal_open_bottom';
        }

        if (this.isTurbo) {
            return `turbo_${tileName}`;
        }
        return tileName;
    }

    draw(ctx, tiles, {
        gameElements
    }) {
        ctx.drawImage(tiles[this.getTile(gameElements)], this.x * TILE_SIZE, this.y * TILE_SIZE, TILE_SIZE * Road.TILE_WIDTH,
            TILE_SIZE * Road.TILE_HEIGHT
        );
    }
}

const batteryColors = {
    1: '0, 80, 141',
    2: '205, 76, 29',
    3: '149, 45, 198',
}

export default function Cars() {
    const canvasRef = useRef(null);

    const [gameElements, setGameElements] = useState([]);
    const [selectedBattery, setSelectedBattery] = useState(1);
    const [selectedTile, setSelectedTile] = useState("road");
    const [mousePosition, setMousePosition] = useState({ x: null, y: null });

    useEffect(() => {
        const listener = (e) => {
            switch (e.key) {
                case 'r':
                    e.preventDefault();
                    setSelectedTile('road');
                    break;
                case 'c':
                    e.preventDefault();
                    setSelectedTile('city');
                    break;
                case 's':
                    e.preventDefault();
                    setSelectedTile('service_center');
                    break;
                case '1':
                    e.preventDefault();
                    setSelectedBattery(1);
                    break;
                case '2':
                    e.preventDefault();
                    setSelectedBattery(2);
                    break;
                case '3':
                    e.preventDefault();
                    setSelectedBattery(3);
                    break;
                default:
                    break;
            }
        }
        window.addEventListener('keydown', listener);
        return () => {
            window.removeEventListener('keydown', listener);
        }
    }, [gameElements]);

    const TILES = useMemo(() => {
        const tiles = {};
        const promises = TILE_NAMES.map(name => {
            const img = new Image();
            img.src = `./assets/electric_cars/${name}.png`;
            tiles[name] = img;
            return new Promise((resolve) => {
                img.onload = resolve;
            });
        });
        return Promise.all(promises).then(() => tiles);
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas !== null) {
            canvas.width = TILE_SIZE * TILE_PER_ROW;
            canvas.height = TILE_SIZE * TILE_PER_COL;
            const ctx = canvas.getContext('2d');
            ctx.imageSmoothingEnabled = false;

            ctx.globalCompositeOperation = 'source-over';

            const drawCanvas = (tiles) => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                const mousePosElem = new FakeElement(mousePosition.x, mousePosition.y);
                gameElements.forEach(element => {
                    if (element instanceof City) {
                        if (element.checkOverlap(mousePosElem)) {
                            element.draw(ctx, tiles, { gameElements, showRequirements: true })
                        } else {
                            element.draw(ctx, tiles, { gameElements })
                        }
                    } else {
                        element.draw(ctx, tiles, { gameElements })
                        if (element instanceof Road && selectedTile.startsWith('service_center')) {
                            const affectedRoads = new ServiceCenter(mousePosition.x, mousePosition.y, parseInt(selectedTile.split('_')[2])).getAffectedRoads(gameElements);
                            if (affectedRoads.some(road => road.id === element.id)) {
                                // put overlay on the road
                                ctx.fillStyle = `rgba(${batteryColors[selectedBattery]}, .2)`;
                                ctx.fillRect(element.x * TILE_SIZE, element.y * TILE_SIZE, TILE_SIZE * Road.TILE_WIDTH, TILE_SIZE * Road.TILE_HEIGHT);
                            }
                        }
                    }
                });
                if (mousePosition.x !== null && mousePosition.y !== null) {
                    const selTile = (() => {
                        switch (selectedTile) {
                            case 'road':
                                return new Road(mousePosition.x, mousePosition.y);
                            case 'city':
                                return new City(mousePosition.x, mousePosition.y, [`battery_${selectedBattery}`]);
                            case 'service_center':
                                return new ServiceCenter(mousePosition.x, mousePosition.y, selectedBattery);
                            default:
                                return new FakeElement(mousePosition.x, mousePosition.y);
                        }
                    })();

                    if (gameElements.filter((elem) => elem instanceof Grass === false).some(element => element.checkOverlap(selTile))) {
                        ctx.fillStyle = 'rgba(255, 0, 0, .1)';
                        ctx.fillRect(selTile.x * TILE_SIZE, selTile.y * TILE_SIZE, TILE_SIZE * selTile.TILE_WIDTH, TILE_SIZE * selTile.TILE_HEIGHT);
                        return;
                    }

                    if (selectedTile === 'road') {
                        ctx.strokeStyle = 'rgba(0, 0, 0, 1)';
                    } else {
                        ctx.strokeStyle = `rgba(${batteryColors[selectedBattery]}, 1)`;
                    }
                    ctx.lineWidth = 2;
                    ctx.strokeRect(selTile.x * TILE_SIZE, selTile.y * TILE_SIZE, TILE_SIZE * selTile.TILE_WIDTH, TILE_SIZE * selTile.TILE_HEIGHT);

                    selTile.draw(ctx, tiles, { gameElements });
                }
            }

            if (TILES instanceof Promise) {
                TILES.then(tiles => {
                    drawCanvas(tiles);
                })
            } else {
                drawCanvas(TILES);
            }

        }
    }, [TILES, canvasRef, gameElements, mousePosition, selectedBattery, selectedTile]);

    useEffect(() => {
        if (gameElements.length === 0) {
            for (let i = 0; i < TILE_PER_ROW; i += Grass.TILE_WIDTH) {
                for (let j = 0; j < TILE_PER_COL; j += Grass.TILE_HEIGHT) {
                    setGameElements(ge => [...ge, new Grass(i, j)]);
                }
            }
            setGameElements(ge => [...ge]);
        }
    }, [gameElements]);

    useEffect(() => {
        const canvas = canvasRef.current;
        const onMouseMove = (e) => {
            const actualTileSizeX = canvas.clientWidth / TILE_PER_ROW
            const actualTileSizeY = canvas.clientHeight / TILE_PER_COL
            const x = Math.floor(e.offsetX / actualTileSizeX);
            const y = Math.floor(e.offsetY / actualTileSizeY);
            setMousePosition({ x, y });
        };//
        canvas.addEventListener('mousemove', onMouseMove);
        return () => {
            canvas.removeEventListener('mousemove', onMouseMove);
        };
    }, [])

    useEffect(() => {
        const canvas = canvasRef.current;
        const onClick = (e) => {
            const actualTileSizeX = canvas.clientWidth / TILE_PER_ROW
            const actualTileSizeY = canvas.clientHeight / TILE_PER_COL
            const x = Math.floor(e.offsetX / actualTileSizeX);
            const y = Math.floor(e.offsetY / actualTileSizeY);

            if (!selectedTile) return
            let newElem = null;
            switch (selectedTile) {
                case 'road':
                    newElem = new Road(x, y);
                    break;
                case 'city':
                    newElem = new City(x, y, [`battery_${selectedBattery}`]);
                    break;
                case 'service_center':
                    newElem = new ServiceCenter(x, y, selectedBattery);
                    break;
                default:
                    break;
            }
            if (newElem) {
                setGameElements(ge => {
                    if (ge.filter((elem) => elem instanceof Grass === false).some(element => element.checkOverlap(newElem))) {
                        return ge;
                    }
                    return [...ge, newElem].sort((a, b) => {
                        if (a instanceof City && b instanceof Road) {
                            return 1
                        }
                        if (b instanceof City && a instanceof Road) {
                            return -1
                        }
                        return 0
                    });
                });
            }
        };
        canvas.addEventListener('click', onClick);
        return () => {
            canvas.removeEventListener('click', onClick);
        };
    }, [canvasRef, selectedBattery, selectedTile]);

    return (<>
        <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            gap: 4,
        }}>
            <Box sx={{
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                gap: 4,
            }}>
                <Text sx={{
                    fontSize: '2xl',
                    fontWeight: 'bold',
                }}>Instrukciók</Text>
                <Text sx={{
                    fontSize: 'lg',
                }}>Az 1-3 billentyűk segítségével ki tudod választani az akkumulátor típust.</Text>
                <Text sx={{
                    fontSize: 'lg',
                }}>
                    Az "R", "C" és "S" billentyűk segítségével tudsz váltani a különböző elemek között.
                </Text>
                <UnorderedList>
                    <ListItem>
                        R - Út
                    </ListItem>
                    <ListItem>
                        C - Város
                    </ListItem>
                    <ListItem>
                        S - Szervizközpont
                    </ListItem>
                </UnorderedList>
                <Text sx={{
                    fontSize: 'lg',
                }}>
                    A bal egérgomb segítségével tudod elhelyezni az elemeket.
                </Text>
            </Box>
            <Box sx={{
                border: "1px solid black",
                aspectRatio: '1 / 1',
                overflow: 'hidden',
                display: 'flex',
                maxWidth: '100%',
                minHeight: '52rem',
                cursor: 'url("./assets/electric_cars/cursor.svg") 0 12, crosshair',
            }} ref={canvasRef} as="canvas" />
            <img src="./assets/electric_cars/tileset.png" alt="" />
            <Text sx={{
                fontSize: 'lg',
            }}>
                A játék minden eleme a képen látható grafikákból épül fel, amik külön a játékhoz készültek.
            </Text>
        </Box>
    </>);
}