import { Box } from "@chakra-ui/react";
import Footer from "./Footer";
import Header from "./Header";
import ResponsiveContainer from "./ResponsiveContainer";

export default function PageContainer({ children }) {
    return (<ResponsiveContainer sx={{
        py: 4,
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        minHeight: '100vh',
    }}>
        <Header />
        <Box as="main" sx={{
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
        }}>
            {children}
        </Box>
        <Footer />
    </ResponsiveContainer>)
}