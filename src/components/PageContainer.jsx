import Header from "./Header";
import ResponsiveContainer from "./ResponsiveContainer";

export default function PageContainer({ children }) {
    return (<ResponsiveContainer sx={{
        py: 4,
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
    }}>
        <Header />
        {children}
    </ResponsiveContainer>)
}