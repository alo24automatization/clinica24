export const Money = ({value}) => {

    const formatted = new Intl.NumberFormat('uz-UZ', {
        style: 'currency',
        currency: 'UZS',
        maximumFractionDigits: 0,
        notation: 'standard'
    })
        .formatToParts(value)
        .map((x) => {
            if (x.type === 'group') return ' ';
            else if (x.type === 'currency') return '';
            else return x.value;
        })
        .join('') + ' UZS';

    return <>
        <div className="text-nowrap">{formatted}</div>
    </>
}

export default Money;