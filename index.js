const { Plugin } = require('powercord/entities')
const { forceUpdateElement, findInReactTree } = require('powercord/util')
const { getModule, React } = require('powercord/webpack')
const { inject, uninject } = require('powercord/injector')

const FluxUtils = getModule(['useStateFromStores'], false)

const Settings = require('./components/Settings')

module.exports = class MentionCount extends Plugin {
    async startPlugin() {
        this.loadStylesheet('style.css')
        powercord.api.settings.registerSettings(this.entityID, {
            category: this.entityID,
            label: 'Mention Count',
            render: Settings
        })

        const UnreadsStore = await getModule(['getTotalMentionCount'])
        const { listItem } = await getModule(['guildSeparator', 'listItem'])

        const HomeButton = await getModule(m =>
            typeof m.default === 'function' &&
            (m.__powercordOriginal_default || m.default).toString().indexOf('showDMsOnly') !== -1
        )
        inject('mention-count', HomeButton, 'default', (_, res) => {
            const { type } = res
            res.type = props => {
                const mentionCount = FluxUtils.useStateFromStores([ UnreadsStore ], UnreadsStore.getTotalMentionCount)
                const d = this.settings.get('display', 0)
                if (!d) return type({ ...props, badge: props.badge + mentionCount })
                const ret = type(props)
                if (d === 2) return [ ret, React.createElement('div', { className: listItem + ' mention-count' }, mentionCount) ] 
                else {
                    const tooltipProps = findInReactTree(ret, e => e && e.text)
                    if (tooltipProps) tooltipProps.text = `${mentionCount} Mention${mentionCount > 1 ? 's' : ''}`
                }
                return ret
            }
            return res
        })
        HomeButton.default.toString = () => HomeButton.__powercordOriginal_default.toString()

        forceUpdateElement(`.${getModule(['homeIcon', 'downloadProgress']).tutorialContainer}`)
    }

    async pluginWillUnload() {
        powercord.api.settings.unregisterSettings(this.entityID)
        uninject('mention-count')
    }
}
