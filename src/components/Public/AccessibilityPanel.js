// AccessibilityPanel.js

import React, { useState } from 'react';
import '../styles/stylesPanel.css';
import { MdAccessibilityNew, MdZoomIn, MdHearing, MdHd } from 'react-icons/md';

const AccessibilityPanel = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [zoomLevel, setZoomLevel] = useState(1);

    const togglePanel = () => {
        setIsExpanded(!isExpanded);
    };

    const handleZoomLevelChange = (newZoomLevel) => {
        setZoomLevel(newZoomLevel);
    };

    const panelStyle = {
        width: isExpanded ? '150px' : '40px',
    };

    return (
        <div className={`accessibility-panel ${isExpanded ? 'expanded' : ''}`} style={panelStyle}>
            {isExpanded ? (
                <>
                    <button onClick={togglePanel}>Accesibilidad</button>
                    <label htmlFor="zoomLevel">Nivel de Zoom:</label>
                    <input
                        type="number"
                        id="zoomLevel"
                        value={zoomLevel}
                        onChange={(e) => handleZoomLevelChange(parseFloat(e.target.value))}
                    />
                    {/* Otros botones y funciones de accesibilidad aquí */}
                </>
            ) : (
                <>
                <button className="expand-button">
                    <MdAccessibilityNew size={25} />
                </button>

                <button onClick={togglePanel} className="expand-button">
                    <MdZoomIn size={25} />
                </button>
                <button onClick={togglePanel} className="expand-button">
                    <MdHearing size={25} />
                </button>
                <button onClick={togglePanel} className="expand-button">
                    <MdHd size={25} />
                </button>
               
                </>
                
            )}
        </div>
    );
};

export default AccessibilityPanel;
