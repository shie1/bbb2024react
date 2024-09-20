import { Container } from "@chakra-ui/react";

export default function ResponsiveContainer(props) {
    return (<Container {...props} sx={{
        maxWidth: "60ch",
        paddingBottom: "2rem",
        '@media (min-width: 48em)': {
            maxWidth: "container.md",
        },
        '@media (min-width: 62em)': {
            maxWidth: "container.lg",
        },
        '@media (min-width: 80em)': {
            maxWidth: "container.xl",
        },
        ...props.sx
    }} />)
}