const { Plugin } = require('powercord/entities')
const { getModule, FluxDispatcher, React } = require('powercord/webpack')
const { inject, uninject } = require('powercord/injector')

const Badge = require('./components/Badge')
const Settings = require('./components/Settings')
const UpdateableBadge = require('./components/UpdateableBadge')

const n = getModule(['NumberBadge'], false)
const getNestedProp = (e, t) => t.split('.').reduce((e, p) => e && e[p], e)

module.exports = class MentionCount extends Plugin {
    async startPlugin() {
        this.loadStylesheet('style.css')
        powercord.api.settings.registerSettings(this.entityID, {
            category: this.entityID,
            label: 'Mention Count',
            render: p => React.createElement(Settings, { injectNumberBadge: this.injectNumberBadge, ...p })
        })

        const { getTotalMentionCount: gm } = await getModule(['getGuildUnreadCount'])
        const { listItem } = await getModule(['guildSeparator', 'listItem'])
        const { DefaultHomeButton } = await getModule(['DefaultHomeButton'])

        inject('mention-count', DefaultHomeButton.prototype, 'render', (_, res) => {
            const d = this.settings.get('display', 0)

            if (d == 2) {
                res = [ res, React.createElement(UpdateableBadge, {
                    Badge: ({ count }) => React.createElement('div', { className: listItem + ' mention-count' }, count),
                    count: 0,
                    _this: this,
                    gm
                })]
                res.props = res[0].props
                return res
            }
            const r = getNestedProp(res, 'props.children.props.children.props.children.props.children.1.props')
            if (!r) return res
            if (!d) {
                const { props } = r.children
                props.lowerBadge = React.createElement(UpdateableBadge, {
                    Badge: this.settings.get('customBadge', true) ? Badge : n.NumberBadge,
                    count: props.lowerBadge ? props.lowerBadge.props.count : 0,
                    _this: this,
                    gm
                })
            } else {
                let count = gm()
                this.last = count
                r.text = `${count} Mention${count > 1 ? 's' : ''}`
            }

            return res
        })

        FluxDispatcher.subscribe('MESSAGE_CREATE', this.updateBadge = () => {
            const d = this.settings.get('display', 0)
            if ((!d || d == 2) && this.badgeInstance && this.last != gm()) this.badgeInstance.forceUpdate()
        })

        this.injectNumberBadge(this.settings.get('fixBadges'))
    }

    async pluginWillUnload() {
        powercord.api.settings.unregisterSettings(this.entityID)
        uninject('mention-count')
        this.injectNumberBadge(false)
        if (this.updateBadge) FluxDispatcher.unsubscribe('MESSAGE_CREATE', this.updateBadge)
    }

    injectNumberBadge(bool) {
        if (!bool) return uninject('mention-count-badge')
        inject('mention-count-badge', n, 'NumberBadge', (args, res) => {
            if (args[0] && args[0].count < 1000) return res
            return React.createElement(Badge, args[0])
        })
    }
}
