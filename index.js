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
    
        const PatchedHomeButton = props => {
            if (!props) return null
            try {
                const mentionCount = FluxUtils.useStateFromStores([ UnreadsStore ], UnreadsStore.getTotalMentionCount)
                const d = this.settings.get('display', 0)
                if (!d) return props.__mc_type({ ...props, badge: props.badge + mentionCount })
                const ret = props.__mc_type(props)
                if (d === 2) return [ ret, React.createElement('div', { className: listItem + ' mention-count' }, mentionCount) ] 
                else {
                    const tooltipProps = findInReactTree(ret, e => e && e.text)
                    if (tooltipProps) tooltipProps.text = `${mentionCount} Mention${mentionCount > 1 ? 's' : ''}`
                }
                return ret
            } catch (e) {
                this.error(e)
                return props.__mc_type(props)
            }
        }

        const HomeButton = await getModule(['HomeButton'])
        inject('mention-count', HomeButton, 'HomeButton', (_, res) => {
            res.props.__mc_type = res.type
            res.type = PatchedHomeButton
            return res
        })

        forceUpdateElement(`.${getModule(['homeIcon', 'downloadProgress'], false).tutorialContainer}`)
    }

    async pluginWillUnload() {
        powercord.api.settings.unregisterSettings(this.entityID)
        uninject('mention-count')
    }
}
