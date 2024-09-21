import { Box } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const AnimatedNumber = ({ value }) => {
    return (
        <Box sx={{
            height: "2rem",
            width: "fit-content",
            overflow: "hidden",
        }}>
            <Box
                as={motion.div}
                initial={{ translateY: 0 }}
                animate={{ translateY: `${-value * 2}rem` }}
                sx={{
                    userSelect: "none",
                    pointerEvents: "none",
                    display: "flex",
                    flexDirection: "column",
                    fontVariantNumeric: "tabular-nums",
                    fontSize: "2rem",
                    lineHeight: 1,
                    overflowY: "visible",
                    overflowX: "hidden",
                    width: "fit-content",
                    // no scrollbar
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                    "&::-webkit-scrollbar": {
                        display: "none",
                    },
                }}>
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
                    <span style={{
                        height: "1lh",
                        lineHeight: 1,
                        flexShrink: 0,
                    }} key={digit}>
                        {digit}
                    </span>
                ))}
            </Box>
        </Box>
    );
}

export const AnimatedNumberString = ({ value }) => {
    return (
        <Box sx={{
            display: "flex",
            gap: 1,
            userSelect: "none",
        }}>
            {value.split("").map((char, index) => (
                // if number
                !isNaN(char) ?
                    <AnimatedNumber key={index} value={parseInt(char)} />
                    :
                    // if not number
                    <Box key={index} sx={{
                        fontSize: "2rem",
                        lineHeight: 1,
                    }}>
                        {char}
                    </Box>
            ))}
        </Box>
    );
}

export default function AnimatedClock() {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const intervalId = setInterval(() => {
            setTime(new Date());
        }, 1000);

        return () => {
            clearInterval(intervalId);
        };
    }, []);

    return (
        <AnimatedNumberString value={`${time.getHours().toString().padStart(2, "0")}:${time.getMinutes().toString().padStart(2, "0")}:${time.getSeconds().toString().padStart(2, "0")}`} />
    );
}