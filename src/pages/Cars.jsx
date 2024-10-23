import { Box } from "@chakra-ui/react";
import { useEffect, useMemo, useRef, useState } from "react";

const TILE_SIZE = 30;
const TILE_PER_ROW = 15;
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
    'service_center_1',
    'service_center_2',
    'service_center_3',
    'battery_1',
    'battery_2',
    'battery_3'
];

class Grass {
    static TILE_HEIGHT = 3;
    static TILE_WIDTH = 3;

    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    draw(ctx, tiles) {
        ctx.drawImage(tiles["nature_plate"], this.x * TILE_SIZE, this.y * TILE_SIZE, TILE_SIZE * Grass.TILE_WIDTH,
            TILE_SIZE * Grass.TILE_HEIGHT
        );
    }
}

class City {
    static TILE_HEIGHT = 3;
    static TILE_WIDTH = 3;

    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    draw(ctx, tiles, _) {
        ctx.drawImage(tiles["city_plate"], this.x * TILE_SIZE, this.y * TILE_SIZE, TILE_SIZE * City.TILE_WIDTH,
            TILE_SIZE * City.TILE_HEIGHT
        );
        ctx.drawImage(tiles['city'], this.x * TILE_SIZE + TILE_SIZE, this.y * TILE_SIZE + TILE_SIZE, TILE_SIZE, TILE_SIZE);
    }
}

class Road {
    static TILE_HEIGHT = 1;
    static TILE_WIDTH = 1;

    constructor(x, y, isTurbo = false) {
        this.x = x;
        this.y = y;
        this.isTurbo = isTurbo;
    }

    getTile(gameElements) {
        const left = gameElements.roads.find(element => element.x === this.x - Road.TILE_WIDTH && element.y === this.y);
        const right = gameElements.roads.find(element => element.x === this.x + Road.TILE_WIDTH && element.y === this.y);
        const top = gameElements.roads.find(element => element.x === this.x && element.y === this.y - Road.TILE_HEIGHT);
        const bottom = gameElements.roads.find(element => element.x === this.x && element.y === this.y + Road.TILE_HEIGHT);

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

    draw(ctx, tiles, gameElements) {
        ctx.drawImage(tiles[this.getTile(gameElements)], this.x * TILE_SIZE, this.y * TILE_SIZE, TILE_SIZE * Road.TILE_WIDTH,
            TILE_SIZE * Road.TILE_HEIGHT
        );
    }
}

export default function Cars() {
    const canvasRef = useRef(null);

    const [gameElements, setGameElements] = useState({
        bg: [],
        cities: [],
        roads: [],
    });

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
        let interval = null;
        if (canvas !== null) {
            canvas.width = TILE_SIZE * TILE_PER_ROW;
            canvas.height = TILE_SIZE * TILE_PER_COL;
            const ctx = canvas.getContext('2d');
            ctx.imageSmoothingEnabled = false;

            ctx.globalCompositeOperation = 'source-over';

            TILES.then(tiles => {
                interval = setInterval(() => {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    gameElements.bg.forEach(element => element.draw(ctx, tiles));
                    gameElements.roads.forEach(element => element.draw(ctx, tiles, gameElements));
                    gameElements.cities.forEach(element => element.draw(ctx, tiles, gameElements));
                }, 1000 / 60);
            });
        }
        return () => {
            clearInterval(interval);
        };
    }, [TILES, canvasRef, gameElements]);

    useEffect(() => {
        for (let i = 0; i < TILE_PER_ROW; i += Grass.TILE_WIDTH) {
            for (let j = 0; j < TILE_PER_COL; j += Grass.TILE_HEIGHT) {
                setGameElements(ge => {
                    ge.bg.push(new Grass(i, j));
                    return ge;
                });
            }
        }

        setGameElements(ge => {
            ge.cities.push(new City(0, 0));
            return ge;
        });
    }, []);

    useEffect(() => {
        // onclick place road
        const canvas = canvasRef.current;
        const onClick = (e) => {
            // determine x and y based on the click position and the width and height of the canvas and the tile size
            const actualTileSizeX = canvas.clientWidth / TILE_PER_ROW
            const actualTileSizeY = canvas.clientHeight / TILE_PER_COL
            const x = Math.floor(e.offsetX / actualTileSizeX);
            const y = Math.floor(e.offsetY / actualTileSizeY);

            setGameElements(ge => {
                ge.roads.push(new Road(x, y));
                return ge;
            });
        };
        canvas.addEventListener('click', onClick);
        return () => {
            canvas.removeEventListener('click', onClick);
        };
    }, [canvasRef]);

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
            }} ref={canvasRef} as="canvas" />
        </Box>
    </>);
}