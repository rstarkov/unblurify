import React from "react";

interface WindowEventNotifierProps<K extends keyof WindowEventMap> {
    event: K;
    onEvent: (ev: WindowEventMap[K]) => any;
}

export default class WindowEventNotifier<K extends keyof WindowEventMap> extends React.Component<WindowEventNotifierProps<K>, {}> {
    constructor(props: WindowEventNotifierProps<K>) {
        super(props);
        window.addEventListener(props.event, this.handleClick);
    }

    componentWillUnmount() {
        window.removeEventListener('click', this.handleClick);
    }

    render() { return null; }

    handleClick = (e: any) => {
        e.stopImmediatePropagation();
        if (!!this.props.onEvent)
            this.props.onEvent(e);
    }
}
