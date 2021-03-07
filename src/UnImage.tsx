import React from 'react';
import WindowEventNotifier from './WindowEventNotifier';

interface UnImageProps {
    url: string;
    zoom: number;
}
interface UnImageState {
    loadState: 'loading' | 'failed' | 'knownSize' | 'done';
}

export default class UnImage extends React.Component<UnImageProps, UnImageState>
{
    private imgRef: React.RefObject<HTMLImageElement>;
    private loadTimerId: any;

    constructor(props: UnImageProps) {
        super(props);
        this.imgRef = React.createRef();
        this.state = { loadState: 'loading' };
        this.loadTimerId = setInterval(this.handleLoadTimer, 10);
    }

    render() {

        return (
            <div style={{ padding: 10, margin: 'auto' }}>
                <WindowEventNotifier event='resize' onEvent={this.updateImageSize} />
                <img ref={this.imgRef} src={this.props.url} onLoad={this.handleImageLoaded} onError={this.handleImageError} alt=""
                    style={{
                        display: 'block',
                        imageRendering: this.props.zoom === 1 ? 'auto' : 'pixelated',
                        opacity: this.state.loadState === 'loading' ? 0 : 1,
                        maxWidth: this.state.loadState === 'loading' ? '1px' : 'none',
                        maxHeight: this.state.loadState === 'loading' ? '1px' : 'none',
                    }} />
            </div>
        );
    }

    componentDidUpdate(prevProps: UnImageProps) {
        if (prevProps.url !== this.props.url) {
            this.setState({ loadState: 'loading' });
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
        this.setState({ loadState: 'done' });
    }

    handleImageError = () => {
        this.setState({ loadState: 'failed' });
    }

    handleLoadTimer = () => {
        const el = this.imgRef.current;
        if (el === null || !el.naturalWidth)
            return;
        clearInterval(this.loadTimerId);
        this.updateImageSize();
        this.setState({ loadState: el.complete ? 'done' : 'knownSize' });
    }
}