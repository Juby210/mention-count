const { React } = require('powercord/webpack')
const { RadioGroup, SwitchItem } = require('powercord/components/settings')

module.exports = class Settings extends React.PureComponent {
    render() {
        return <>
            <SwitchItem
                value={ this.props.getSetting('customBadge', true) }
                onChange={ () => {
                    this.props.toggleSetting('customBadge', true)
                    if (this.props.getSetting('fixBadges')) this.toggleFixBadges()
                }}
                note='Custom badge can show max 99k+ mentions instead of 1k+ by default.'
            >Use custom badge component</SwitchItem>
            <SwitchItem
                value={ this.props.getSetting('fixBadges') }
                onChange={ () => this.toggleFixBadges() }
                disabled={ !this.props.getSetting('customBadge', true) }
            >Replace also other NumberBadges with custom badge</SwitchItem>
            <RadioGroup
                options={[
                    { name: 'Home badge', value: 0 },
                    { name: 'Home tooltip', value: 1 },
                    { name: 'Text like online friends count', value: 2 }
                ]}
                value={ this.props.getSetting('display', 0) }
                onChange={ e => this.props.updateSetting('display', e.value) }
            >Display method</RadioGroup>
        </>
    }

    toggleFixBadges() {
        this.props.toggleSetting('fixBadges')
        this.props.injectNumberBadge(this.props.getSetting('fixBadges'))
    }
}
