import { Box } from "@chakra-ui/react";
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
    'battery_3'
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
    }

    draw(ctx, tiles, {

    }) {
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
    }

    draw() {
        // do nothing
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
    }

    checkConnection(element) {
        // return the direction of the connection, or null if there is no connection
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
        showRequirements = false
    }) {
        ctx.drawImage(tiles["city_plate"], this.x * TILE_SIZE, this.y * TILE_SIZE, TILE_SIZE * City.TILE_WIDTH,
            TILE_SIZE * City.TILE_HEIGHT
        );
        ctx.drawImage(tiles['city'], this.x * TILE_SIZE + TILE_SIZE, this.y * TILE_SIZE + TILE_SIZE, TILE_SIZE, TILE_SIZE);
        if (showRequirements) {
            // use the special tile sizes for the battery and service center
            let { w, h } = SPECIAL_TILE_SIZES.battery
            w = w / 3;
            h = h / 3;
            const boxSpacing = 4
            const boxPaddingX = 8
            const boxPaddingY = boxPaddingX / 2
            const boxWidth = w * (this.requirements.length) + (boxSpacing * (this.requirements.length - 1)) + (boxPaddingX * 2)
            const boxHeight = h + (boxPaddingY * 2)
            // put a small grey box above the center of the city
            ctx.fillStyle = 'rgba(0, 0, 0, .5)';
            ctx.fillRect(
                this.x * TILE_SIZE + (TILE_SIZE * 1.5) - (boxWidth / 2),
                this.y * TILE_SIZE - boxHeight / 2,
                boxWidth,
                boxHeight
            )

            this.requirements.forEach((req, i) => {
                // put batteries in the box, get width and height of the battery from w and h
                ctx.drawImage(tiles[req], this.x * TILE_SIZE + (TILE_SIZE * 1.5) - (boxWidth / 2) + boxPaddingX + (w + boxSpacing) * i, this.y * TILE_SIZE - boxHeight / 2 + boxPaddingY, w, h);
            });
        }
    }
}

class ServiceCenter {
    static TILE_HEIGHT = 2;
    static TILE_WIDTH = 1;

    constructor(x, y, battery = 1) {
        this.x = x;
        this.y = y;
        this.TILE_HEIGHT = ServiceCenter.TILE_HEIGHT
        this.TILE_WIDTH = ServiceCenter.TILE_WIDTH
        this.battery = battery;
    }

    draw(ctx, tiles, {
        gameElements
    }) {
        ctx.drawImage(tiles[`service_center_${this.battery}`], this.x * TILE_SIZE, this.y * TILE_SIZE, TILE_SIZE * ServiceCenter.TILE_WIDTH,
            TILE_SIZE * ServiceCenter.TILE_HEIGHT
        );
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

        // if there is a road to the left and to the right, it's a horizontal road
        if (left && right && !top && !bottom) {
            tileName = 'road_horizontal';
        }
        if (left && !right && !top && !bottom) {
            tileName = 'road_horizontal';
        }
        if (!left && right && !top && !bottom) {
            tileName = 'road_horizontal';
        }

        // if there is a road to the top and to the bottom, it's a vertical road
        if (top && bottom && !left && !right) {
            tileName = 'road_vertical';
        }
        if (!top && bottom && !left && !right) {
            tileName = 'road_vertical';
        }
        if (top && !bottom && !left && !right) {
            tileName = 'road_vertical';
        }

        // if there is a road to the left and to the bottom it's a road_bottom_left
        if (left && bottom && !right && !top) {
            tileName = 'road_top_right';
        }
        // if there is a road to the right and to the bottom it's a road_bottom_right
        if (right && bottom && !left && !top) {
            tileName = 'road_top_left';
        }
        // if there is a road to the left and to the top it's a road_top_left
        if (left && top && !right && !bottom) {
            tileName = 'road_bottom_right';
        }
        // if there is a road to the right and to the top it's a road_top_right
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

export default function Cars() {
    const canvasRef = useRef(null);

    const [gameElements, setGameElements] = useState([]);
    const [selectedTile, setSelectedTile] = useState(null);
    const [mousePosition, setMousePosition] = useState({ x: null, y: null });

    useEffect(() => {
        const listener = (e) => {
            if (e.altKey) {
                switch (e.key) {
                    case 't':
                        e.preventDefault();
                        setSelectedTile('turbo_road');
                        break;
                    case 'r':
                        e.preventDefault();
                        setSelectedTile('road');
                        break;
                    case 'c':
                        e.preventDefault();
                        setSelectedTile('city');
                        break;
                    case 'Enter':
                        e.preventDefault();
                        setSelectedTile(null);
                        console.log(gameElements)
                        break;
                    default:
                        break;
                }
            } else {
                switch (e.key) {
                    case '1':
                        e.preventDefault();
                        setSelectedTile('service_center_1');
                        break;
                    case '2':
                        e.preventDefault();
                        setSelectedTile('service_center_2');
                        break;
                    case '3':
                        e.preventDefault();
                        setSelectedTile('service_center_3');
                        break;
                    case 'Enter':
                        e.preventDefault();
                        setSelectedTile(null);
                        break;
                }
            }
        }
        window.addEventListener('keydown', listener);
        return () => {
            window.removeEventListener('keydown', listener);
        }
    }, [gameElements]);

    const TILES = useMemo(() => {
        // preload all the tiles and wait for them to load
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
                    }
                });
                // draw the mouse position
                if (mousePosition.x !== null && mousePosition.y !== null) {
                    // outline the tile, .5 blue color
                    if (!selectedTile) {
                        ctx.fillStyle = 'rgba(0, 0, 0, .2)';
                        ctx.fillRect(mousePosition.x * TILE_SIZE, mousePosition.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                    } else {
                        ctx.strokeStyle = 'rgba(0, 0, 0, .5)';
                        ctx.lineWidth = 2;
                        let seltile = null
                        switch (selectedTile) {
                            case 'road':
                                seltile = new Road(mousePosition.x, mousePosition.y);
                                break;
                            case 'turbo_road':
                                seltile = new Road(mousePosition.x, mousePosition.y, true);
                                break;
                            case 'city':
                                seltile = new City(mousePosition.x, mousePosition.y);
                                break;
                            default:
                                if (selectedTile.startsWith('service_center')) {
                                    seltile = new ServiceCenter(mousePosition.x, mousePosition.y, parseInt(selectedTile.split('_')[2]));
                                }
                                break;
                        }
                        if (seltile instanceof ServiceCenter === false) {
                            ctx.strokeStyle = 'rgba(0, 0, 255, .5)';
                        } else {
                            switch (seltile.battery) {
                                case 1:
                                    ctx.strokeStyle = 'rgba(0, 154, 141, 1)';
                                    break;
                                case 2:
                                    ctx.strokeStyle = 'rgba(205, 76, 29, .8)';
                                    break;
                                case 3:
                                    ctx.strokeStyle = 'rgba(149, 45, 198, .8)';
                                    break;
                                default:
                                    break;
                            }
                        }
                        ctx.lineWidth = 2;
                        ctx.strokeRect(mousePosition.x * TILE_SIZE, mousePosition.y * TILE_SIZE, TILE_SIZE * seltile.TILE_WIDTH, TILE_SIZE * seltile.TILE_HEIGHT);
                    }
                }
            }

            // if tiles is a promise, return
            if (TILES instanceof Promise) {
                TILES.then(tiles => {
                    drawCanvas(tiles);
                })
            } else {
                drawCanvas(TILES);
            }

        }
    }, [TILES, canvasRef, gameElements, mousePosition, selectedTile]);

    useEffect(() => {
        if (gameElements.length === 0) {
            for (let i = 0; i < TILE_PER_ROW; i += Grass.TILE_WIDTH) {
                for (let j = 0; j < TILE_PER_COL; j += Grass.TILE_HEIGHT) {
                    setGameElements(ge => [...ge, new Grass(i, j)]);
                }
            }
        }
    }, [gameElements]);

    useEffect(() => {
        // onmousemove set mouse pos
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
        // onclick place road
        const canvas = canvasRef.current;
        const onClick = (e) => {
            // determine x and y based on the click position and the width and height of the canvas and the tile size
            const actualTileSizeX = canvas.clientWidth / TILE_PER_ROW
            const actualTileSizeY = canvas.clientHeight / TILE_PER_COL
            const x = Math.floor(e.offsetX / actualTileSizeX);
            const y = Math.floor(e.offsetY / actualTileSizeY);

            let newElem = null;
            switch (selectedTile) {
                case 'road':
                    newElem = new Road(x, y);
                    break;
                case 'turbo_road':
                    newElem = new Road(x, y, true);
                    break;
                case 'city':
                    newElem = new City(x, y);
                    break;
                default:
                    if (selectedTile.startsWith('service_center')) {
                        newElem = new ServiceCenter(x, y, parseInt(selectedTile.split('_')[2]));
                    }
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
    }, [canvasRef, selectedTile]);

    return (<>
        <Box sx={{
            display: 'flex',
            flexGrow: 1,
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            gap: 4,
        }}>
            <Box sx={{
                flexGrow: 1,
                border: "1px solid black",
                //enforce 1:1 aspect ratio
                aspectRatio: '1 / 1',
                overflow: 'hidden',
                display: 'flex',
                maxWidth: '100%',
                // custom cursor (crosshair, centered)
                cursor: 'url("./assets/electric_cars/cursor.svg") 0 12, crosshair',
            }} ref={canvasRef} as="canvas" />
        </Box>
    </>);
}