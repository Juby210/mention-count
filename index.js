const { Plugin } = require('powercord/entities')
const { getModule, React } = require('powercord/webpack')
const { inject, uninject } = require('powercord/injector')

module.exports = class MentionCount extends Plugin {
    async startPlugin() {
        const { getTotalMentionCount: gm } = await getModule(['getGuildUnreadCount'])
        const dispatcher = await getModule(['dispatch'])
        const { DefaultHomeButton } = await getModule(['DefaultHomeButton'])
        const { NumberBadge } = await getModule(['NumberBadge'])

        let homebtn, last = 0
        this.updateBadge = () => {
            if (homebtn && last != gm()) homebtn.forceUpdate()
        }

        inject('mentioncount', DefaultHomeButton.prototype, 'render', function (_, res) {
            if (!homebtn) homebtn = this
            try {
                const badge = res.props.children.props.children.props.children[1].props.children.props.lowerBadge
                let count = gm()
                last = count
                count += badge ? badge.props.count : 0
                if (count == 0) return res
                res.props.children.props.children.props.children[1].props.children.props.lowerBadge =
                    React.createElement(NumberBadge, { count })
            } catch (e) {
                console.error(e)
            }

            return res
        })

        dispatcher.subscribe('MESSAGE_CREATE', this.updateBadge)
    }

    async pluginWillUnload() {
        uninject('mentioncount')
        const dispatcher = await getModule(['dispatch'])
        dispatcher.unsubscribe('MESSAGE_CREATE', this.updateBadge)
    }
}
