const { React } = require('powercord/webpack')
const { RadioGroup } = require('powercord/components/settings')

module.exports = ({ getSetting, updateSetting }) => <RadioGroup
    options={[
        { name: 'Home badge', value: 0 },
        { name: 'Home tooltip', value: 1 },
        { name: 'Text like online friends count', value: 2 }
    ]}
    value={ getSetting('display', 0) }
    onChange={ e => updateSetting('display', e.value) }
>Display method</RadioGroup>
