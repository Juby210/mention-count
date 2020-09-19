const { React } = require('powercord/webpack')

module.exports = class HomeBadge extends React.PureComponent {
    constructor(props) {
        super(props)

        props._this.badgeInstance = this
    }

    componentWillUnmount() {
        delete this.props._this.badgeInstance
    }

    render() {
        this.props._this.last = this.props.gm()
        return <this.props.Badge count={this.props._this.last + this.props.count} />
    }
}
