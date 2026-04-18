import React, { useEffect, useRef, useState } from 'react'
import 'react-image-crop/dist/ReactCrop.css'
import { ReactCrop, convertToPixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import { imagePreview } from '../imagePreview'

const minWidth = 200;

export default function Cropper({ closeModal, image }) {
    const [crop, setCrop] = useState(null);
    let canvasRef = useRef();
    const imageRef = useRef();

    function handleCropButton() {
        imagePreview(imageRef.current, canvasRef.current, convertToPixelCrop(crop, imageRef.current.width, imageRef.current.height));
        // Using 0.2 quality as per your previous optimization requirement
        closeModal(canvasRef.current.toDataURL('image/jpeg', 0.2));
    }

    const onImageLoad = (e) => {
        const { width, height } = e.currentTarget;
        const crop = centerCrop(
            makeAspectCrop({ unit: "%", width: (minWidth / width) * 100 }, 1, width, height),
            width, height
        );
        setCrop(crop);
    };

    return (
        <div className='flex flex-col items-center gap-6'>
            <div className="text-center">
                <h3 className="text-xl font-bold text-white">Adjust Profile Picture</h3>
                <p className="text-slate-400 text-sm">Drag to move, pinch to resize</p>
            </div>

            <div className="rounded-2xl overflow-hidden border-2 border-slate-700 bg-black">
                <ReactCrop
                    className='max-h-[60vh]'
                    minWidth={minWidth}
                    circularCrop={true}
                    crop={crop}
                    aspect={1}
                    onChange={(p) => setCrop(p)}>
                    <img onLoad={onImageLoad} className='max-h-full mx-auto' ref={imageRef} src={image} alt="To crop" />
                </ReactCrop >
            </div>

            <canvas style={{ display: "none" }} ref={canvasRef} ></canvas>

            <div className="flex gap-3 w-full">
                <button onClick={() => closeModal(null)} className="btn btn-ghost flex-1 text-white">Cancel</button>
                <button onClick={handleCropButton} className='btn bg-blue hover:bg-blue-600 border-0 text-white flex-1 btn-glow font-bold'>
                    Apply Crop
                </button>
            </div>
        </div>
    )
}