import React from 'react';
import WindowEventNotifier from './WindowEventNotifier';

interface UnImageProps {
    url: string;
    zoom: number;
}
interface UnImageState {
    loaded: boolean;
}

export default class UnImage extends React.Component<UnImageProps, UnImageState>
{
    private imgRef: React.RefObject<HTMLImageElement>;

    constructor(props: UnImageProps) {
        super(props);
        this.imgRef = React.createRef();
        this.state = { loaded: false };
    }

    render() {
        return (
            <div style={{ padding: 10, margin: 'auto' }}>
                <WindowEventNotifier event='resize' onEvent={this.updateImageSize} />
                <img ref={this.imgRef} src={this.props.url} onLoad={this.handleOnLoad} alt=""
                    style={{ display: 'block', opacity: this.state.loaded ? 1 : 0, imageRendering: this.props.zoom === 1 ? 'auto' : 'pixelated' }} />
            </div>
        );
    }

    componentDidUpdate(prevProps: UnImageProps) {
        if (prevProps.url != this.props.url)
            this.setState({ loaded: false });
        this.updateImageSize();
    }

    updateImageSize = () => {
        const el = this.imgRef.current;
        if (el == null)
            return;
        var imageWidth = el.naturalWidth / window.devicePixelRatio * this.props.zoom;
        var imageHeight = el.naturalHeight / window.devicePixelRatio * this.props.zoom;
        el.style.width = imageWidth + 'px';
        el.style.height = imageHeight + 'px';
    }

    handleOnLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        this.updateImageSize();
        this.setState({ loaded: true });
    }
}