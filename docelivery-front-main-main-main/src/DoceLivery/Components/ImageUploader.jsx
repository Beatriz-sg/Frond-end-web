import React, { useState, useEffect } from 'react';
import { IoCloudUpload, IoClose } from 'react-icons/io5';
import Styles from './ImageUploader.module.css';
import { API_UPLOADS_URL } from '../config/api.config';

const resolveImageUrl = (img) => {
    if (!img) return null;
    if (typeof img === 'object') return null; // File object — sem URL ainda
    if (String(img).startsWith('http') || String(img).startsWith('data:') || String(img).startsWith('/src')) return img;
    return `${API_UPLOADS_URL}/${img}`;
};

const ImageUploader = ({ onImageSelect, currentImage }) => {
    const [dragOver, setDragOver] = useState(false);
    const [preview, setPreview] = useState(() => resolveImageUrl(currentImage));

    // Sincroniza o preview quando currentImage mudar (ex: API retorna a foto salva no banco)
    useEffect(() => {
        if (currentImage && typeof currentImage === 'string') {
            setPreview(resolveImageUrl(currentImage));
        }
    }, [currentImage]);

    const handleDragOver = (e) => {
        e.preventDefault();
        setDragOver(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setDragOver(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFileSelect(files[0]);
        }
    };

    const handleFileSelect = (file) => {
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setPreview(e.target.result);
            };
            reader.readAsDataURL(file);
            onImageSelect(file); // Passa o File real, não base64
        } else {
            alert('Por favor, selecione apenas arquivos de imagem');
        }
    };

    const handleFileInput = (e) => {
        const file = e.target.files[0];
        if (file) {
            handleFileSelect(file);
        }
    };

    const clearImage = () => {
        setPreview(null);
        onImageSelect(null);
    };

    return (
        <div className={Styles.imageUploader}>
            {preview ? (
                <div className={Styles.imagePreview}>
                    <img src={preview} alt="Preview" />
                    <button 
                        className={Styles.removeBtn}
                        onClick={clearImage}
                        type="button"
                    >
                        <IoClose size={20} />
                    </button>
                </div>
            ) : (
                <div 
                    className={`${Styles.dropZone} ${dragOver ? Styles.dragOver : ''}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    <IoCloudUpload size={48} />
                    <p>Arraste uma imagem aqui ou clique para selecionar</p>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileInput}
                        className={Styles.fileInput}
                    />
                </div>
            )}
        </div>
    );
};

export default ImageUploader;