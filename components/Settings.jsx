const { React } = require('powercord/webpack')
const { RadioGroup, SwitchItem } = require('powercord/components/settings')

module.exports = class Settings extends React.Component {
    render() {
        return <>
            <SwitchItem
                value={ this.props.getSetting('customBadge', true) }
                onChange={ () => this.props.toggleSetting('customBadge', true) }
                note='Custom badge can show max 99k+ mentions instead of 1k+ by default.'
            >Use custom badge component</SwitchItem>
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
}
