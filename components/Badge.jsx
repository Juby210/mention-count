const { getModule, React } = require('powercord/webpack')
const { NumberBadge } = getModule(['NumberBadge'], false)

let classes
setImmediate(async () => {
    classes = await getModule(['numberBadge'])
})

module.exports = props => props && props.count ?
    props.count < 1000 ? <NumberBadge { ...props } /> :
    <div
        className={ `${classes.base} ${classes.numberBadge}${props.className ? ' ' + props.className : ''}` }
        style={{ backgroundColor: 'rgb(240, 71, 71)', width: getWidth(props) }}
    >{getCount(props.count)}</div> : null

function getWidth(props) {
    const w = 10 + 6 * props.count.toString().length
    return w > 32 ? 32 : w
}

function getCount(count) {
    if (count < 10000) return count
    if (count > 99000) return '99k+'
    return count.toString().substring(0, 2) + 'k+'
}
