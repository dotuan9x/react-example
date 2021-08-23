// Libraries
import React, {useState} from 'react';
import './styles.scss';

interface ICoordinates {
    width: number;
    height: number;
    top: number;
    left: number;
}

const Resizeable = () => {
    const [coordinates, setCoordinates] = useState<ICoordinates>({
        width: 200,
        height: 200,
        top: 0,
        left: 0
    });

    const onMouseDown = (e: React.MouseEvent<HTMLElement>) => {
        const resizableTarget = e.target as HTMLInputElement,
            originalWidth = coordinates.width,
            originalHeight = coordinates.height,
            originalX = coordinates.left,
            originalY = coordinates.top,
            originalMouseX = e.clientX,
            originalMouseY = e.clientY;

        const onMouseMove = (e: React.MouseEvent) => {
            // Top left
            if (resizableTarget.classList.contains('resizable-nw')) {
                const resizeWidth = originalWidth - (e.pageX - originalMouseX);
                const resizeHeight = originalHeight - (e.pageY - originalMouseY);

                setCoordinates({
                    width: Math.round(resizeWidth),
                    height: Math.round(resizeHeight),
                    left: coordinates.left - Math.round(resizeWidth) + coordinates.width,
                    top: coordinates.top - Math.round(resizeHeight) + coordinates.height
                });
            }

            // Top
            if (resizableTarget.classList.contains('resizable-n')) {
                const height = originalHeight - (e.pageY - originalMouseY);

                setCoordinates({
                    ...coordinates,
                    height: Math.round(height),
                    top: coordinates.top - Math.round(height) + coordinates.height
                });
            }

            // Top Right
            if (resizableTarget.classList.contains('resizable-ne')) {
                const width = originalWidth + (e.pageX - originalMouseX);
                const height = originalHeight - (e.pageY - originalMouseY);

                setCoordinates({
                    ...coordinates,
                    width: Math.round(width),
                    height: Math.round(height),
                    top: coordinates.top - Math.round(height) + coordinates.height
                });
            }

            // Right
            if (resizableTarget.classList.contains('resizable-e')) {
                const width = originalWidth + (e.pageX - originalMouseX);

                setCoordinates({
                    ...coordinates,
                    width: Math.round(width)
                });
            }

            // Bottom Right
            if (resizableTarget.classList.contains('resizable-se')) {
                const width = originalWidth + (e.pageX - originalMouseX);
                const height = originalHeight + (e.pageY - originalMouseY);

                setCoordinates({
                    ...coordinates,
                    width: Math.round(Math.abs(width)),
                    height: Math.round(Math.abs(height))
                });
            }

            // Bottom
            if (resizableTarget.classList.contains('resizable-s')) {
                const height = originalHeight + (e.pageY - originalMouseY);

                setCoordinates({
                    ...coordinates,
                    height: Math.round(height)
                });
            }

            // Bottom Left
            if (resizableTarget.classList.contains('resizable-sw')) {
                const height = originalHeight + (e.pageY - originalMouseY);
                const width = originalWidth - (e.pageX - originalMouseX);

                setCoordinates({
                    ...coordinates,
                    width: Math.round(width),
                    height: Math.round(height),
                    left: coordinates.left - Math.round(width) + coordinates.width
                });
            }

            // Left
            if (resizableTarget.classList.contains('resizable-w')) {
                const width = originalWidth - (e.pageX - originalMouseX);

                setCoordinates({
                    ...coordinates,
                    width: Math.round(width),
                    left: coordinates.left - Math.round(width) + coordinates.width
                });
            }
        };

        const onMouseUp = () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
        };

        window.addEventListener('mousemove', onMouseMove);

        window.addEventListener('mouseup', onMouseUp);
    };

    return (
        <div style={{top: coordinates.top, left: coordinates.left, width: coordinates.width, height: coordinates.height}} className="resizable m-10">
            <div onMouseDown={onMouseDown}  className="resizable-handle resizable-nw" />
            <div onMouseDown={onMouseDown}  className="resizable-handle resizable-ne" />
            <div onMouseDown={onMouseDown}  className="resizable-handle resizable-sw" />
            <div onMouseDown={onMouseDown}  className="resizable-handle resizable-se" />
            <div onMouseDown={onMouseDown}  className="resizable-handle resizable-n" />
            <div onMouseDown={onMouseDown}  className="resizable-handle resizable-s" />
            <div onMouseDown={onMouseDown}  className="resizable-handle resizable-e" />
            <div onMouseDown={onMouseDown}  className="resizable-handle resizable-w" />
        </div>
    );
};

export default Resizeable;
