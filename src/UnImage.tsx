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
    private loadTimerId: any;

    constructor(props: UnImageProps) {
        super(props);
        this.imgRef = React.createRef();
        this.state = { loaded: false };
        this.loadTimerId = setInterval(this.handleLoadTimer, 10);
    }

    render() {
        return (
            <div style={{ padding: 10, margin: 'auto' }}>
                <WindowEventNotifier event='resize' onEvent={this.updateImageSize} />
                <img ref={this.imgRef} src={this.props.url} onLoad={this.handleImageLoaded} alt=""
                    style={{ display: 'block', opacity: this.state.loaded ? 1 : 0.6, imageRendering: this.props.zoom === 1 ? 'auto' : 'pixelated' }} />
            </div>
        );
    }

    componentDidUpdate(prevProps: UnImageProps) {
        if (prevProps.url !== this.props.url) {
            this.setState({ loaded: false });
            clearInterval(this.loadTimerId);
            this.loadTimerId = setInterval(this.handleLoadTimer, 10);
        }
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

    handleImageLoaded = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        this.setState({ loaded: true });
    }

    handleLoadTimer = () => {
        const el = this.imgRef.current;
        if (el === null || !el.naturalWidth)
            return;
        clearInterval(this.loadTimerId);
        this.updateImageSize();
    }
}