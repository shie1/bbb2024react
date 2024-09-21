export default function CurrencyRender({ amount }) {
    return (
        <span>
            {new Intl.NumberFormat('hu-HU', {
                style: 'currency',
                currency: 'HUF',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            }).format(amount)}
        </span>
    );
}