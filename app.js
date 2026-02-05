// XCS Reader Application
// Lecteur de fichiers xTool Creative Space (.xcs)

let currentXCSData = null;
// Expose currentXCSData globally for i18n
window.currentXCSData = null;

document.addEventListener('DOMContentLoaded', () => {
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const tabsSection = document.getElementById('tabsSection');

    // Initialize language
    initLanguage();

    // Gestion du drag & drop
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('drag-over');
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('drag-over');
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('drag-over');
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFile(files[0]);
        }
    });

    // Click sur la zone pour ouvrir le sélecteur de fichiers
    // On évite de déclencher si on clique sur le label/bouton (qui gère déjà l'input)
    dropZone.addEventListener('click', (e) => {
        // Ne pas déclencher si on clique sur le label ou l'input
        if (e.target.closest('.file-input-label') || e.target.tagName === 'INPUT') {
            return;
        }
        fileInput.click();
    });

    // Gestion de la sélection de fichier
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleFile(e.target.files[0]);
        }
    });

    // Gestion des onglets
    initTabs();
});

/**
 * Initialise le système d'onglets
 */
function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');
            switchTab(tabId);
        });
    });
}

/**
 * Change d'onglet
 */
function switchTab(tabId) {
    // Désactive tous les boutons et panneaux
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelectorAll('.tab-pane').forEach(pane => {
        pane.classList.remove('active');
    });

    // Active l'onglet sélectionné
    const selectedBtn = document.querySelector(`.tab-btn[data-tab="${tabId}"]`);
    const selectedPane = document.getElementById(`tab-${tabId}`);
    
    if (selectedBtn) selectedBtn.classList.add('active');
    if (selectedPane) selectedPane.classList.add('active');
}

/**
 * Gère le fichier XCS sélectionné
 */
function handleFile(file) {
    if (!file.name.toLowerCase().endsWith('.xcs')) {
        alert(t('invalidFile'));
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const xcsData = JSON.parse(e.target.result);
            currentXCSData = xcsData;
            window.currentXCSData = xcsData;
            displayXCSData(xcsData);
        } catch (error) {
            alert(t('readError') + error.message);
            console.error(error);
        }
    };
    reader.readAsText(file);
}

/**
 * Affiche les données XCS
 */
function displayXCSData(data) {
    const tabsSection = document.getElementById('tabsSection');
    tabsSection.style.display = 'block';

    // Informations générales
    displayGeneralInfo(data);

    // Informations sur l'appareil
    displayDeviceInfo(data);

    // Image de couverture
    displayCover(data);

    // Canvas
    displayCanvas(data);

    // Layers
    displayLayers(data);

    // Paramètres de traitement
    displayProcessSettings(data);

    // Displays/Éléments
    displayElements(data);

    // Distances entre éléments
    displayDistances(data);

    // JSON brut
    displayRawJson(data);

    // Active le premier onglet et scroll
    switchTab('general');
    tabsSection.scrollIntoView({ behavior: 'smooth' });
}

/**
 * Navigue vers l'élément correspondant dans l'onglet Éléments
 */
function gotoElement(displayId) {
    // Basculer vers l'onglet Éléments
    switchTab('elements');
    
    // Trouver et highlight l'élément
    setTimeout(() => {
        const elementCard = document.querySelector(`.display-item[data-display-id="${displayId}"]`);
        if (elementCard) {
            elementCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
            elementCard.classList.add('highlight');
            setTimeout(() => {
                elementCard.classList.remove('highlight');
            }, 2000);
        }
    }, 100);
}

/**
 * Navigue vers le traitement correspondant dans l'onglet Traitement
 */
function gotoProcess(displayId) {
    // Basculer vers l'onglet Traitement
    switchTab('process');
    
    // Trouver et highlight la carte de traitement
    setTimeout(() => {
        const processCard = document.querySelector(`.display-param-card[data-display-id="${displayId}"]`);
        if (processCard) {
            processCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
            processCard.classList.add('highlight');
            setTimeout(() => {
                processCard.classList.remove('highlight');
            }, 2000);
        }
    }, 100);
}

/**
 * Copie le JSON dans le presse-papier
 */
function copyJSON() {
    if (currentXCSData) {
        const jsonText = JSON.stringify(currentXCSData, null, 2);
        navigator.clipboard.writeText(jsonText).then(() => {
            alert(t('jsonCopied'));
        }).catch(err => {
            console.error('Erreur lors de la copie:', err);
        });
    }
}

/**
 * Télécharge le JSON
 */
function downloadJSON() {
    if (currentXCSData) {
        const jsonText = JSON.stringify(currentXCSData, null, 2);
        const blob = new Blob([jsonText], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'xcs_data.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}

/**
 * Affiche les informations générales
 */
function displayGeneralInfo(data) {
    const container = document.getElementById('generalInfo');
    container.innerHTML = '';

    const info = [
        { label: t('version'), value: data.version || 'N/A' },
        { label: 'Canvas ID', value: data.canvasId || 'N/A' },
        { label: 'Extension ID', value: data.extId || 'N/A' },
        { label: 'Extension', value: data.extName || 'N/A' },
        { label: t('createdAt'), value: formatDate(data.created) },
        { label: t('modifiedAt'), value: formatDate(data.modify) },
        { label: currentLang === 'fr' ? 'Version minimum requise' : 'Min required version', value: data.minRequiredVersion || 'N/A' },
        { label: currentLang === 'fr' ? 'Version app minimum' : 'Min app version', value: data.appMinRequiredVersion || 'N/A' },
        { label: currentLang === 'fr' ? 'Version web minimum' : 'Min web version', value: data.webMinRequiredVersion || 'N/A' },
        { label: 'Project Trace ID', value: data.projectTraceID || 'N/A' },
        { label: 'User Agent', value: data.ua || 'N/A' }
    ];

    info.forEach(item => {
        if (item.value && item.value !== 'N/A') {
            container.appendChild(createInfoItem(item.label, item.value));
        }
    });
}

/**
 * Affiche les informations sur l'appareil
 */
function displayDeviceInfo(data) {
    const container = document.getElementById('deviceInfo');
    container.innerHTML = '';

    if (!data.device) {
        container.innerHTML = `<p class="no-preview">${t('noData')}</p>`;
        return;
    }

    const device = data.device;
    const info = [
        { label: currentLang === 'fr' ? 'Modèle' : 'Model', value: device.id || 'N/A' }
    ];

    info.forEach(item => {
        container.appendChild(createInfoItem(item.label, item.value));
    });

    // Paramètres de puissance
    if (device.power && device.power.length > 0) {
        const powerDiv = document.createElement('div');
        powerDiv.className = 'info-item';
        powerDiv.style.gridColumn = '1 / -1';
        
        let powerHtml = `<div class="info-label">${t('laserPower')}</div>`;
        powerHtml += '<div class="power-grid">';
        
        device.power.forEach(p => {
            powerHtml += `
                <div class="power-item">
                    <div class="power-label">${p.name || 'Mode'}</div>
                    <div><strong>${t('power')}:</strong> ${p.power || 'N/A'}%</div>
                    <div><strong>${t('speed')}:</strong> ${p.speed || 'N/A'} mm/s</div>
                    ${p.passes ? `<div><strong>${t('passes')}:</strong> ${p.passes}</div>` : ''}
                </div>
            `;
        });
        
        powerHtml += '</div>';
        powerDiv.innerHTML = powerHtml;
        container.appendChild(powerDiv);
    }

    // Liste des matériaux
    if (device.materialList && device.materialList.length > 0) {
        const matDiv = document.createElement('div');
        matDiv.className = 'info-item';
        matDiv.style.gridColumn = '1 / -1';
        
        let matHtml = '<div class="info-label">Matériaux</div><div>';
        device.materialList.forEach(mat => {
            matHtml += `<span class="material-badge">${mat.name || mat}</span>`;
        });
        matHtml += '</div>';
        matDiv.innerHTML = matHtml;
        container.appendChild(matDiv);
    }
}

/**
 * Affiche l'image de couverture
 */
function displayCover(data) {
    const coverContainer = document.getElementById('coverContainer');

    if (data.cover && data.cover.startsWith('data:image')) {
        coverContainer.innerHTML = `<img src="${data.cover}" alt="Aperçu du projet" class="cover-image">`;
    } else {
        coverContainer.innerHTML = '<p class="no-data">Aucun aperçu disponible</p>';
    }
}

/**
 * Affiche les informations sur le canvas
 */
function displayCanvas(data) {
    const container = document.getElementById('canvasContainer');
    container.innerHTML = '';

    if (!data.canvas || data.canvas.length === 0) {
        container.innerHTML = '<p class="no-preview">Aucun canvas disponible</p>';
        return;
    }

    // Tabs si plusieurs canvas
    if (data.canvas.length > 1) {
        const tabs = document.createElement('div');
        tabs.className = 'tabs';
        data.canvas.forEach((c, index) => {
            const tab = document.createElement('button');
            tab.className = 'tab' + (index === 0 ? ' active' : '');
            tab.textContent = c.title || `Canvas ${index + 1}`;
            tab.onclick = () => showCanvasTab(index, data.canvas);
            tabs.appendChild(tab);
        });
        container.appendChild(tabs);
    }

    const canvasContent = document.createElement('div');
    canvasContent.id = 'canvasContent';
    container.appendChild(canvasContent);

    showCanvasTab(0, data.canvas);
}

/**
 * Affiche un onglet de canvas
 */
function showCanvasTab(index, canvasArray) {
    const canvas = canvasArray[index];
    const container = document.getElementById('canvasContent');
    
    // Update active tab
    document.querySelectorAll('.tab').forEach((tab, i) => {
        tab.classList.toggle('active', i === index);
    });

    let html = `
        <div class="canvas-info">
            <div class="canvas-title">${canvas.title || 'Canvas sans titre'}</div>
            <div class="info-grid">
    `;

    const canvasInfo = [
        { label: 'ID', value: canvas.id },
        { label: 'Nombre d\'éléments', value: canvas.displays ? canvas.displays.length : 0 },
        { label: 'Nombre de groupes', value: canvas.groupData ? Object.keys(canvas.groupData).length : 0 }
    ];

    canvasInfo.forEach(item => {
        html += `
            <div class="info-item">
                <div class="info-label">${item.label}</div>
                <div class="info-value">${item.value}</div>
            </div>
        `;
    });

    html += '</div></div>';
    container.innerHTML = html;
}

/**
 * Affiche les calques
 */
function displayLayers(data) {
    const container = document.getElementById('layersContainer');
    container.innerHTML = '';

    if (!data.canvas || data.canvas.length === 0) {
        container.innerHTML = '<p class="no-preview">Aucun calque disponible</p>';
        return;
    }

    // Récupérer les layers du premier canvas (ou tous)
    const canvas = data.canvas[0];
    const layerData = canvas.layerData;

    if (!layerData || Object.keys(layerData).length === 0) {
        container.innerHTML = '<p class="no-preview">Aucun calque défini</p>';
        return;
    }

    // Compter les éléments par calque
    const elementsByLayer = {};
    if (canvas.displays) {
        canvas.displays.forEach(d => {
            const color = d.layerColor || 'unknown';
            elementsByLayer[color] = (elementsByLayer[color] || 0) + 1;
        });
    }

    // Trier par ordre
    const sortedLayers = Object.entries(layerData)
        .sort((a, b) => (a[1].order || 0) - (b[1].order || 0));

    sortedLayers.forEach(([color, layer]) => {
        const layerDiv = document.createElement('div');
        layerDiv.className = 'layer-item';
        layerDiv.innerHTML = `
            <div class="layer-color" style="background-color: ${color}"></div>
            <div class="layer-info">
                <div class="layer-name">${formatLayerName(layer.name)}</div>
                <div class="layer-hex">${color} • Ordre: ${layer.order || 'N/A'} • ${elementsByLayer[color] || 0} élément(s)</div>
            </div>
            <span class="layer-visibility ${layer.visible ? 'visible' : 'hidden'}">
                ${layer.visible ? '👁️ Visible' : '🚫 Masqué'}
            </span>
        `;
        container.appendChild(layerDiv);
    });
}

/**
 * Affiche les paramètres de traitement par mode et par calque
 */
function displayProcessSettings(data) {
    const container = document.getElementById('processSettingsContainer');
    container.innerHTML = '';

    if (!data.device || !data.device.data) {
        container.innerHTML = '<p class="no-preview">Aucun paramètre de traitement disponible</p>';
        return;
    }

    const deviceData = data.device.data;
    
    // Créer un index des displays par ID pour référence rapide
    const displaysIndex = {};
    if (data.canvas) {
        data.canvas.forEach(canvas => {
            if (canvas.displays) {
                canvas.displays.forEach(d => {
                    displaysIndex[d.id] = d;
                });
            }
        });
    }

    // Vérifier si c'est un Map avec des valeurs
    if (deviceData.dataType === 'Map' && deviceData.value) {
        const settingsHtml = parseDeviceSettingsV2(deviceData.value, displaysIndex);
        if (settingsHtml) {
            container.innerHTML = settingsHtml;
        } else {
            container.innerHTML = '<p class="no-preview">Pas de paramètres de traitement détaillés</p>';
        }
    } else {
        container.innerHTML = '<p class="no-preview">Format de données non reconnu</p>';
    }
}

/**
 * Parse les paramètres du device (version 2 - structure correcte)
 */
function parseDeviceSettingsV2(value, displaysIndex) {
    if (!Array.isArray(value) || value.length === 0) {
        return null;
    }

    let html = '';

    value.forEach((item) => {
        // Chaque item est [canvasId, canvasSettings]
        if (Array.isArray(item) && item.length >= 2) {
            const [canvasId, canvasSettings] = item;
            
            html += `<div class="process-canvas">`;
            html += `<div class="process-canvas-header">`;
            html += `<span class="canvas-id">📋 Canvas: ${canvasId.substring(0, 8)}...</span>`;
            
            if (canvasSettings.mode) {
                html += `<span class="process-mode-badge">${formatModeName(canvasSettings.mode)}</span>`;
            }
            html += `</div>`;

            // Paramètres globaux du mode
            if (canvasSettings.data) {
                Object.entries(canvasSettings.data).forEach(([modeName, modeParams]) => {
                    if (typeof modeParams === 'object' && modeParams !== null) {
                        html += `<div class="global-mode-params">`;
                        html += `<div class="global-params-title">Paramètres globaux</div>`;
                        html += `<div class="params-grid">`;
                        
                        const importantParams = ['material', 'lightSourceMode', 'thickness', 'fanGear', 'purifierGear', 'pathPlanning', 'fillPlanning'];
                        importantParams.forEach(key => {
                            if (modeParams[key] !== null && modeParams[key] !== undefined) {
                                html += `<div class="param-chip"><span class="param-label">${formatParamKey(key)}</span><span class="param-value">${modeParams[key]}</span></div>`;
                            }
                        });
                        
                        html += `</div></div>`;
                    }
                });
            }

            // Paramètres par élément (displays)
            if (canvasSettings.displays && canvasSettings.displays.dataType === 'Map' && canvasSettings.displays.value) {
                html += `<div class="displays-params">`;
                html += `<div class="displays-params-title">Paramètres par élément</div>`;
                
                canvasSettings.displays.value.forEach((displayItem) => {
                    if (Array.isArray(displayItem) && displayItem.length >= 2) {
                        const [displayId, displaySettings] = displayItem;
                        const displayInfo = displaysIndex[displayId];
                        
                        html += `<div class="display-param-card" data-display-id="${displayId}">`;
                        
                        // En-tête avec info de l'élément
                        html += `<div class="display-param-header">`;
                        if (displayInfo) {
                            html += `<span class="layer-dot" style="background-color: ${displayInfo.layerColor || '#666'}"></span>`;
                            html += `<span class="display-name">${displayInfo.name || 'Élément'}</span>`;
                            html += `<span class="display-type-small">${displayInfo.type}</span>`;
                        } else {
                            html += `<span class="display-id">${displayId.substring(0, 12)}...</span>`;
                        }
                        
                        if (displaySettings.processingType) {
                            html += `<span class="processing-type-badge">${formatProcessingType(displaySettings.processingType)}</span>`;
                        }
                        
                        if (displaySettings.processIgnore) {
                            html += `<span class="ignore-badge">⏸️ Ignoré</span>`;
                        }
                        
                        // Bouton pour voir l'élément
                        html += `<button class="goto-element-btn" onclick="gotoElement('${displayId}')" title="Voir l'élément">🔲 Voir élément</button>`;
                        
                        html += `</div>`;
                        
                        // Paramètres de traitement
                        if (displaySettings.data) {
                            const activeType = displaySettings.processingType;
                            
                            Object.entries(displaySettings.data).forEach(([procType, procData]) => {
                                const isActive = procType === activeType;
                                
                                html += `<div class="proc-type-section ${isActive ? 'active' : 'inactive'}">`;
                                html += `<div class="proc-type-header">${formatProcessingType(procType)} ${isActive ? '✓' : ''}</div>`;
                                
                                if (procData && procData.parameter) {
                                    const params = parseParameterObject(procData.parameter);
                                    if (params) {
                                        html += `<div class="laser-params">`;
                                        
                                        // Power
                                        if (params.power !== undefined) {
                                            html += `<div class="laser-param power"><span class="laser-param-icon">⚡</span><span class="laser-param-label">Power</span><span class="laser-param-value">${params.power}%</span></div>`;
                                        }
                                        // Speed
                                        if (params.speed !== undefined) {
                                            html += `<div class="laser-param speed"><span class="laser-param-icon">🚀</span><span class="laser-param-label">Speed</span><span class="laser-param-value">${params.speed} mm/s</span></div>`;
                                        }
                                        // Repeat/Passes
                                        if (params.repeat !== undefined) {
                                            html += `<div class="laser-param passes"><span class="laser-param-icon">🔄</span><span class="laser-param-label">Passes</span><span class="laser-param-value">${params.repeat}</span></div>`;
                                        }
                                        // DPI
                                        if (params.dpi !== undefined) {
                                            html += `<div class="laser-param dpi"><span class="laser-param-icon">📐</span><span class="laser-param-label">DPI</span><span class="laser-param-value">${params.dpi}</span></div>`;
                                        }
                                        // Density
                                        if (params.density !== undefined) {
                                            html += `<div class="laser-param density"><span class="laser-param-icon">📊</span><span class="laser-param-label">Density</span><span class="laser-param-value">${params.density}</span></div>`;
                                        }
                                        // Frequency
                                        if (params.frequency !== undefined) {
                                            html += `<div class="laser-param freq"><span class="laser-param-icon">〰️</span><span class="laser-param-label">Freq</span><span class="laser-param-value">${params.frequency} kHz</span></div>`;
                                        }
                                        // Light source
                                        if (params.processingLightSource) {
                                            html += `<div class="laser-param light"><span class="laser-param-icon">💡</span><span class="laser-param-label">Laser</span><span class="laser-param-value laser-${params.processingLightSource}">${params.processingLightSource}</span></div>`;
                                        }
                                        // Slice Number (for relief)
                                        if (params.sliceNumber !== undefined) {
                                            html += `<div class="laser-param slice"><span class="laser-param-icon">🔪</span><span class="laser-param-label">Slices</span><span class="laser-param-value">${params.sliceNumber}</span></div>`;
                                        }
                                        // Process Angle
                                        if (params.processAngle !== undefined) {
                                            html += `<div class="laser-param angle"><span class="laser-param-icon">📐</span><span class="laser-param-label">Angle</span><span class="laser-param-value">${params.processAngle}°</span></div>`;
                                        }
                                        
                                        html += `</div>`;
                                    }
                                }
                                
                                html += `</div>`;
                            });
                        }
                        
                        html += `</div>`;
                    }
                });
                
                html += `</div>`;
            }

            html += `</div>`;
        }
    });

    return html || null;
}

/**
 * Parse un objet parameter (peut être un objet ou une chaîne PowerShell)
 */
function parseParameterObject(parameter) {
    if (!parameter) return null;
    
    const result = {};
    
    // Chercher dans les clés connues (customize, wood, metal, etc.)
    const materialTypes = ['customize', 'wood', 'metal', 'acrylic', 'leather', 'paper', 'fabric', 'other'];
    
    for (const matType of materialTypes) {
        if (parameter[matType]) {
            const params = parameter[matType];
            
            // Si c'est une chaîne PowerShell @{key=value; ...}
            if (typeof params === 'string') {
                const matches = params.match(/(\w+)=([^;}\]]+)/g);
                if (matches) {
                    matches.forEach(match => {
                        const [key, value] = match.split('=');
                        if (key && value !== undefined) {
                            let cleanValue = value.trim();
                            // Convertir les booléens
                            if (cleanValue === 'True') cleanValue = true;
                            else if (cleanValue === 'False') cleanValue = false;
                            // Convertir les nombres
                            else if (!isNaN(cleanValue) && cleanValue !== '') cleanValue = parseFloat(cleanValue);
                            
                            result[key.trim()] = cleanValue;
                        }
                    });
                }
            }
            // Si c'est déjà un objet
            else if (typeof params === 'object') {
                Object.assign(result, params);
            }
            
            break; // On a trouvé les paramètres
        }
    }
    
    return Object.keys(result).length > 0 ? result : null;
}

/**
 * Formate le type de processing
 */
function formatProcessingType(type) {
    const types = {
        'RELIEF': '🏔️ Relief 3D',
        'BITMAP_ENGRAVING': '🖼️ Gravure Bitmap',
        'VECTOR_ENGRAVING': '✏️ Gravure Vecteur',
        'VECTOR_CUTTING': '✂️ Découpe',
        'SCORE': '📏 Score'
    };
    return types[type] || type;
}

/**
 * Formate le nom d'un mode
 */
function formatModeName(mode) {
    const modeNames = {
        'LASER_PLANE': '🔲 Gravure Plane',
        'RELIEF_PROCESS': '🏔️ Relief 3D',
        'LASER_ENGRAVE': '✏️ Gravure',
        'LASER_CUT': '✂️ Découpe',
        'LASER_SCORE': '📏 Score'
    };
    return modeNames[mode] || mode;
}

/**
 * Formate une clé de paramètre
 */
function formatParamKey(key) {
    const keyNames = {
        'power': 'Puissance',
        'speed': 'Vitesse',
        'passes': 'Passes',
        'interval': 'Intervalle',
        'material': 'Matériau',
        'thickness': 'Épaisseur',
        'lightSourceMode': 'Source lumière',
        'fanGear': 'Ventilateur',
        'purifierGear': 'Purificateur',
        'fillPlanning': 'Plan remplissage',
        'pathPlanning': 'Plan chemin',
        'scanDirection': 'Direction scan',
        'dpi': 'DPI',
        'grayMode': 'Mode gris',
        'isProcessByLayer': 'Par calque'
    };
    return keyNames[key] || key;
}

/**
 * Affiche les éléments graphiques
 */
function displayElements(data) {
    const container = document.getElementById('displaysContainer');
    container.innerHTML = '';

    if (!data.canvas || data.canvas.length === 0) {
        container.innerHTML = '<p class="no-preview">Aucun élément disponible</p>';
        return;
    }

    const canvas = data.canvas[0];
    const displays = canvas.displays;

    if (!displays || displays.length === 0) {
        container.innerHTML = '<p class="no-preview">Aucun élément graphique</p>';
        return;
    }

    // Récupérer les paramètres de traitement par displayId
    const processParamsMap = buildProcessParamsMap(data);

    const grid = document.createElement('div');
    grid.className = 'display-grid';

    displays.forEach((display, index) => {
        const item = document.createElement('div');
        item.className = 'display-item';
        item.setAttribute('data-display-id', display.id);

        let previewHtml = '';
        
        // Gestion des images bitmap
        if (display.base64 && display.base64.startsWith('data:image')) {
            previewHtml = `<img src="${display.base64}" alt="Élément ${index + 1}" loading="lazy">`;
        } 
        // Gestion des éléments PATH/SVG avec dPath
        else if (display.type === 'PATH' && display.dPath) {
            const svgPreview = generateSVGPreview(display);
            previewHtml = svgPreview;
        } else {
            previewHtml = '<div class="no-preview">Pas d\'aperçu</div>';
        }

        // Détails supplémentaires pour les éléments PATH
        let pathDetails = '';
        if (display.type === 'PATH') {
            pathDetails = `
                ${display.dPath ? `<span class="path-indicator">✏️ Chemin SVG (dPath)</span>` : ''}
                ${display.isClosePath ? '<span>🔒 Chemin fermé</span>' : '<span>🔓 Chemin ouvert</span>'}
                ${display.isFill ? '<span>🎨 Rempli</span>' : '<span>⬜ Non rempli</span>'}
                ${display.stroke && display.stroke.visible ? `<span>📏 Trait: ${display.stroke.width?.toFixed(2) || '?'} mm</span>` : ''}
            `;
        }

        // Paramètres de traitement pour cet élément
        const processParams = processParamsMap[display.id];
        let processHtml = '';
        
        if (processParams) {
            processHtml = `
                <div class="element-process-link">
                    <div class="element-process-header">
                        <span class="process-link-icon">⚙️</span>
                        <span class="process-link-title">Paramètres de traitement</span>
                        ${processParams.processingType ? `<span class="processing-type-badge-small">${formatProcessingType(processParams.processingType)}</span>` : ''}
                        ${processParams.processIgnore ? `<span class="ignore-badge-small">⏸️ Ignoré</span>` : ''}
                        <button class="goto-process-btn" onclick="gotoProcess('${display.id}')" title="Voir les détails du traitement">⚙️ Détails</button>
                    </div>
                    ${!processParams.processIgnore ? generateLaserParamsCompact(processParams) : ''}
                </div>
            `;
        } else {
            processHtml = `
                <div class="element-process-link no-process">
                    <span class="process-link-icon">⚠️</span>
                    <span class="no-process-text">Aucun traitement associé</span>
                </div>
            `;
        }

        item.innerHTML = `
            <div class="display-preview">
                ${previewHtml}
            </div>
            <div class="display-info">
                <div class="display-header-row">
                    <span class="display-type ${display.type === 'PATH' ? 'type-path' : 'type-bitmap'}">${display.type || 'Inconnu'}</span>
                    ${display.layerColor ? `<span class="layer-color-square" style="background-color:${display.layerColor}" title="Couleur du calque: ${display.layerColor}"></span>` : ''}
                    ${display.visible !== undefined ? `<span class="visibility-badge ${display.visible ? 'visible' : 'hidden'}">${display.visible ? '👁️' : '🚫'}</span>` : ''}
                </div>
                <div class="display-name">${display.name || `Élément ${index + 1}`}</div>
                <div class="display-details">
                    <span>📐 Taille: ${(display.width || 0).toFixed(2)} × ${(display.height || 0).toFixed(2)} mm</span>
                    <span>📍 Position: (${(display.x || 0).toFixed(2)}, ${(display.y || 0).toFixed(2)})</span>
                    ${display.angle ? `<span>🔄 Rotation: ${display.angle.toFixed(1)}°</span>` : ''}
                    ${pathDetails}
                </div>
                ${processHtml}
            </div>
        `;

        grid.appendChild(item);
    });

    container.appendChild(grid);
}

/**
 * Construit une map des paramètres de traitement par displayId
 */
function buildProcessParamsMap(data) {
    const map = {};
    
    if (!data.device || !data.device.data) {
        return map;
    }

    const deviceData = data.device.data;
    
    if (deviceData.dataType === 'Map' && deviceData.value) {
        deviceData.value.forEach((item) => {
            if (Array.isArray(item) && item.length >= 2) {
                const [canvasId, canvasSettings] = item;
                
                if (canvasSettings.displays && canvasSettings.displays.dataType === 'Map' && canvasSettings.displays.value) {
                    canvasSettings.displays.value.forEach((displayItem) => {
                        if (Array.isArray(displayItem) && displayItem.length >= 2) {
                            const [displayId, displaySettings] = displayItem;
                            
                            // Extraire les paramètres actifs
                            const processInfo = {
                                processingType: displaySettings.processingType,
                                processIgnore: displaySettings.processIgnore,
                                params: null
                            };
                            
                            // Trouver les paramètres du type de traitement actif
                            if (displaySettings.data && displaySettings.processingType) {
                                const activeTypeData = displaySettings.data[displaySettings.processingType];
                                if (activeTypeData && activeTypeData.parameter) {
                                    processInfo.params = parseParameterObject(activeTypeData.parameter);
                                }
                            }
                            
                            map[displayId] = processInfo;
                        }
                    });
                }
            }
        });
    }
    
    return map;
}

/**
 * Génère un affichage compact des paramètres laser
 */
function generateLaserParamsCompact(processInfo) {
    if (!processInfo.params) {
        return '<div class="no-params-text">Paramètres par défaut</div>';
    }
    
    const params = processInfo.params;
    let html = '<div class="laser-params-compact">';
    
    // Power
    if (params.power !== undefined) {
        html += `<span class="param-pill power" title="Puissance">⚡ ${params.power}%</span>`;
    }
    // Speed
    if (params.speed !== undefined) {
        html += `<span class="param-pill speed" title="Vitesse">🚀 ${params.speed} mm/s</span>`;
    }
    // Repeat/Passes
    if (params.repeat !== undefined) {
        html += `<span class="param-pill passes" title="Passes">🔄 ${params.repeat}x</span>`;
    }
    // DPI
    if (params.dpi !== undefined) {
        html += `<span class="param-pill dpi" title="DPI">📐 ${params.dpi} dpi</span>`;
    }
    // Density
    if (params.density !== undefined) {
        html += `<span class="param-pill density" title="Densité">📊 ${params.density}</span>`;
    }
    // Frequency
    if (params.frequency !== undefined) {
        html += `<span class="param-pill freq" title="Fréquence">〰️ ${params.frequency} kHz</span>`;
    }
    // Light source
    if (params.processingLightSource) {
        html += `<span class="param-pill light laser-${params.processingLightSource}" title="Source laser">💡 ${params.processingLightSource}</span>`;
    }
    // Slice Number
    if (params.sliceNumber !== undefined) {
        html += `<span class="param-pill slice" title="Slices">🔪 ${params.sliceNumber}</span>`;
    }
    // Process Angle
    if (params.processAngle !== undefined) {
        html += `<span class="param-pill angle" title="Angle">📐 ${params.processAngle}°</span>`;
    }
    
    html += '</div>';
    return html;
}

/**
 * Génère un aperçu SVG pour un élément PATH
 */
function generateSVGPreview(display) {
    if (!display.dPath) {
        return '<div class="no-preview">Pas de dPath</div>';
    }

    const strokeColor = display.layerColor || '#ffffff';
    const fillColor = display.isFill && display.fill && display.fill.visible 
        ? intColorToHex(display.fill.color) 
        : 'none';
    const strokeWidth = display.stroke && display.stroke.width ? display.stroke.width : 1;

    // Extraire les bornes du path pour calculer le viewBox
    const bounds = getPathBounds(display.dPath);
    
    // Ajouter une marge pour le stroke
    const margin = strokeWidth * 2;
    const viewBoxX = bounds.minX - margin;
    const viewBoxY = bounds.minY - margin;
    const viewBoxWidth = (bounds.maxX - bounds.minX) + margin * 2;
    const viewBoxHeight = (bounds.maxY - bounds.minY) + margin * 2;

    // Créer un SVG avec le viewBox calculé à partir du path
    const svg = `
        <svg viewBox="${viewBoxX} ${viewBoxY} ${Math.max(viewBoxWidth, 1)} ${Math.max(viewBoxHeight, 1)}" 
             class="svg-preview" 
             xmlns="http://www.w3.org/2000/svg"
             preserveAspectRatio="xMidYMid meet">
            <path d="${display.dPath}" 
                  stroke="${strokeColor}" 
                  stroke-width="${strokeWidth}"
                  fill="${fillColor}"
                  stroke-linecap="round"
                  stroke-linejoin="round"/>
        </svg>
    `;
    
    return svg;
}

/**
 * Calcule les bornes (bounding box) d'un chemin SVG
 */
function getPathBounds(dPath) {
    const bounds = {
        minX: Infinity,
        minY: Infinity,
        maxX: -Infinity,
        maxY: -Infinity
    };
    
    // Extraire tous les nombres du path
    // Pattern pour capturer les commandes et leurs coordonnées
    const numberPattern = /-?[\d.]+/g;
    const numbers = dPath.match(numberPattern);
    
    if (!numbers || numbers.length < 2) {
        return { minX: 0, minY: 0, maxX: 100, maxY: 100 };
    }
    
    // Parser le path pour extraire les coordonnées
    let currentX = 0;
    let currentY = 0;
    
    // Utiliser une regex plus sophistiquée pour parser le path
    const cmdPattern = /([MmLlHhVvCcSsQqTtAaZz])([^MmLlHhVvCcSsQqTtAaZz]*)/g;
    let match;
    
    while ((match = cmdPattern.exec(dPath)) !== null) {
        const cmd = match[1];
        const args = match[2].trim().match(/-?[\d.]+/g) || [];
        const nums = args.map(Number);
        
        const isRelative = cmd === cmd.toLowerCase();
        
        switch (cmd.toUpperCase()) {
            case 'M': // MoveTo
            case 'L': // LineTo
                for (let i = 0; i < nums.length; i += 2) {
                    if (isRelative) {
                        currentX += nums[i];
                        currentY += nums[i + 1];
                    } else {
                        currentX = nums[i];
                        currentY = nums[i + 1];
                    }
                    updateBounds(bounds, currentX, currentY);
                }
                break;
            case 'H': // Horizontal line
                for (let i = 0; i < nums.length; i++) {
                    currentX = isRelative ? currentX + nums[i] : nums[i];
                    updateBounds(bounds, currentX, currentY);
                }
                break;
            case 'V': // Vertical line
                for (let i = 0; i < nums.length; i++) {
                    currentY = isRelative ? currentY + nums[i] : nums[i];
                    updateBounds(bounds, currentX, currentY);
                }
                break;
            case 'C': // Cubic Bezier
                for (let i = 0; i < nums.length; i += 6) {
                    let x1, y1, x2, y2, x, y;
                    if (isRelative) {
                        x1 = currentX + nums[i];
                        y1 = currentY + nums[i + 1];
                        x2 = currentX + nums[i + 2];
                        y2 = currentY + nums[i + 3];
                        x = currentX + nums[i + 4];
                        y = currentY + nums[i + 5];
                    } else {
                        x1 = nums[i];
                        y1 = nums[i + 1];
                        x2 = nums[i + 2];
                        y2 = nums[i + 3];
                        x = nums[i + 4];
                        y = nums[i + 5];
                    }
                    updateBounds(bounds, x1, y1);
                    updateBounds(bounds, x2, y2);
                    updateBounds(bounds, x, y);
                    currentX = x;
                    currentY = y;
                }
                break;
            case 'S': // Smooth cubic Bezier
                for (let i = 0; i < nums.length; i += 4) {
                    let x2, y2, x, y;
                    if (isRelative) {
                        x2 = currentX + nums[i];
                        y2 = currentY + nums[i + 1];
                        x = currentX + nums[i + 2];
                        y = currentY + nums[i + 3];
                    } else {
                        x2 = nums[i];
                        y2 = nums[i + 1];
                        x = nums[i + 2];
                        y = nums[i + 3];
                    }
                    updateBounds(bounds, x2, y2);
                    updateBounds(bounds, x, y);
                    currentX = x;
                    currentY = y;
                }
                break;
            case 'Q': // Quadratic Bezier
                for (let i = 0; i < nums.length; i += 4) {
                    let x1, y1, x, y;
                    if (isRelative) {
                        x1 = currentX + nums[i];
                        y1 = currentY + nums[i + 1];
                        x = currentX + nums[i + 2];
                        y = currentY + nums[i + 3];
                    } else {
                        x1 = nums[i];
                        y1 = nums[i + 1];
                        x = nums[i + 2];
                        y = nums[i + 3];
                    }
                    updateBounds(bounds, x1, y1);
                    updateBounds(bounds, x, y);
                    currentX = x;
                    currentY = y;
                }
                break;
            case 'T': // Smooth quadratic Bezier
                for (let i = 0; i < nums.length; i += 2) {
                    if (isRelative) {
                        currentX += nums[i];
                        currentY += nums[i + 1];
                    } else {
                        currentX = nums[i];
                        currentY = nums[i + 1];
                    }
                    updateBounds(bounds, currentX, currentY);
                }
                break;
            case 'A': // Arc
                for (let i = 0; i < nums.length; i += 7) {
                    let x, y;
                    if (isRelative) {
                        x = currentX + nums[i + 5];
                        y = currentY + nums[i + 6];
                    } else {
                        x = nums[i + 5];
                        y = nums[i + 6];
                    }
                    updateBounds(bounds, x, y);
                    currentX = x;
                    currentY = y;
                }
                break;
            case 'Z': // ClosePath
                break;
        }
    }
    
    // Fallback si aucune coordonnée valide
    if (bounds.minX === Infinity) {
        return { minX: 0, minY: 0, maxX: 100, maxY: 100 };
    }
    
    return bounds;
}

/**
 * Met à jour les bornes avec un nouveau point
 */
function updateBounds(bounds, x, y) {
    if (isFinite(x) && isFinite(y)) {
        bounds.minX = Math.min(bounds.minX, x);
        bounds.minY = Math.min(bounds.minY, y);
        bounds.maxX = Math.max(bounds.maxX, x);
        bounds.maxY = Math.max(bounds.maxY, y);
    }
}

/**
 * Convertit une couleur entière en hexadécimal
 */
function intColorToHex(intColor) {
    if (intColor === undefined || intColor === null) return '#000000';
    const hex = intColor.toString(16).padStart(6, '0');
    return `#${hex}`;
}

/**
 * Affiche les distances entre les éléments
 */
function displayDistances(data) {
    const container = document.getElementById('distancesContainer');
    if (!container) return;
    
    container.innerHTML = '';

    if (!data.canvas || data.canvas.length === 0) {
        container.innerHTML = `<p class="no-preview">${t('noElementAvailable')}</p>`;
        return;
    }

    const canvas = data.canvas[0];
    const displays = canvas.displays;

    if (!displays || displays.length < 2) {
        container.innerHTML = `<p class="no-preview">${t('needTwoElements')}</p>`;
        return;
    }

    // Stocker les données pour la mise à jour
    window.distanceData = displays;
    
    updateDistances();
}

/**
 * Met à jour l'affichage des distances avec les filtres
 */
function updateDistances() {
    const container = document.getElementById('distancesContainer');
    if (!container || !window.distanceData) return;
    
    const displays = window.distanceData;
    const filterSameLayer = document.getElementById('filterSameLayer')?.checked || false;
    const sortBy = document.getElementById('distanceSort')?.value || 'distance';

    // Calculer toutes les paires de distances
    const pairs = [];
    
    const elementLabel = currentLang === 'fr' ? 'Élément' : 'Element';
    
    for (let i = 0; i < displays.length; i++) {
        for (let j = i + 1; j < displays.length; j++) {
            const elem1 = displays[i];
            const elem2 = displays[j];
            
            // Filtrer par calque si demandé
            if (filterSameLayer && elem1.layerColor !== elem2.layerColor) {
                continue;
            }
            
            // Calculer les centres des éléments
            const center1 = {
                x: (elem1.x || 0) + (elem1.width || 0) / 2,
                y: (elem1.y || 0) + (elem1.height || 0) / 2
            };
            const center2 = {
                x: (elem2.x || 0) + (elem2.width || 0) / 2,
                y: (elem2.y || 0) + (elem2.height || 0) / 2
            };
            
            // Distance euclidienne
            const distance = Math.sqrt(
                Math.pow(center2.x - center1.x, 2) + 
                Math.pow(center2.y - center1.y, 2)
            );
            
            // Distance X et Y séparées
            const distanceX = Math.abs(center2.x - center1.x);
            const distanceY = Math.abs(center2.y - center1.y);
            
            pairs.push({
                elem1,
                elem2,
                center1,
                center2,
                distance,
                distanceX,
                distanceY,
                name1: elem1.name || `${elementLabel} ${i + 1}`,
                name2: elem2.name || `${elementLabel} ${j + 1}`
            });
        }
    }
    
    // Trier
    switch (sortBy) {
        case 'distance':
            pairs.sort((a, b) => a.distance - b.distance);
            break;
        case 'distance-desc':
            pairs.sort((a, b) => b.distance - a.distance);
            break;
        case 'name':
            pairs.sort((a, b) => a.name1.localeCompare(b.name1));
            break;
    }
    
    // Générer le tableau
    let html = `
        <div class="distances-table">
            <table>
                <thead>
                    <tr>
                        <th>${t('element1')}</th>
                        <th></th>
                        <th>${t('element2')}</th>
                        <th>${t('distance')}</th>
                        <th>ΔX</th>
                        <th>ΔY</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    if (pairs.length === 0) {
        html += `<tr><td colspan="6" style="text-align: center; color: var(--text-muted);">${t('noPairFound')}</td></tr>`;
    } else {
        pairs.forEach(pair => {
            const distClass = getDistanceClass(pair.distance);
            
            html += `
                <tr>
                    <td>
                        <div class="distance-element">
                            <span class="layer-square" style="background-color: ${pair.elem1.layerColor || '#666'}"></span>
                            <span class="element-name">${pair.name1}</span>
                            <span class="element-type">${pair.elem1.type}</span>
                        </div>
                        <div class="distance-coords">
                            (${pair.center1.x.toFixed(2)}, ${pair.center1.y.toFixed(2)})
                        </div>
                    </td>
                    <td class="distance-arrow">↔</td>
                    <td>
                        <div class="distance-element">
                            <span class="layer-square" style="background-color: ${pair.elem2.layerColor || '#666'}"></span>
                            <span class="element-name">${pair.name2}</span>
                            <span class="element-type">${pair.elem2.type}</span>
                        </div>
                        <div class="distance-coords">
                            (${pair.center2.x.toFixed(2)}, ${pair.center2.y.toFixed(2)})
                        </div>
                    </td>
                    <td class="distance-value ${distClass}">${pair.distance.toFixed(2)} mm</td>
                    <td class="distance-value">${pair.distanceX.toFixed(2)} mm</td>
                    <td class="distance-value">${pair.distanceY.toFixed(2)} mm</td>
                </tr>
            `;
        });
    }
    
    html += `
                </tbody>
            </table>
        </div>
        <p class="distances-info" style="margin-top: 1rem;">
            ${t('totalPairs')} <strong>${pairs.length}</strong> ${t('pairs')}
        </p>
    `;
    
    container.innerHTML = html;
}

/**
 * Détermine la classe de couleur selon la distance
 */
function getDistanceClass(distance) {
    if (distance < 10) return 'close';
    if (distance < 50) return 'medium';
    return 'far';
}

/**
 * Affiche le JSON brut
 */
function displayRawJson(data) {
    const container = document.getElementById('rawJson');
    
    // Créer une copie sans les images base64 pour réduire la taille
    const cleanData = JSON.parse(JSON.stringify(data));
    
    // Remplacer les base64 par des placeholders
    if (cleanData.cover) {
        cleanData.cover = '[IMAGE BASE64 - ' + cleanData.cover.length + ' caractères]';
    }
    if (cleanData.canvas) {
        cleanData.canvas.forEach(c => {
            if (c.displays) {
                c.displays.forEach(d => {
                    if (d.base64) {
                        d.base64 = '[IMAGE BASE64 - ' + d.base64.length + ' caractères]';
                    }
                });
            }
        });
    }
    
    container.textContent = JSON.stringify(cleanData, null, 2);
}

/**
 * Crée un élément d'information
 */
function createInfoItem(label, value) {
    const div = document.createElement('div');
    div.className = 'info-item';
    div.innerHTML = `
        <div class="info-label">${label}</div>
        <div class="info-value">${value}</div>
    `;
    return div;
}

/**
 * Formate une date timestamp
 */
function formatDate(timestamp) {
    if (!timestamp) return 'N/A';
    
    try {
        const date = new Date(timestamp);
        if (isNaN(date.getTime())) return 'N/A';
        
        return date.toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch {
        return 'N/A';
    }
}

/**
 * Formate le nom d'un calque (retire les accolades de traduction)
 */
function formatLayerName(name) {
    if (!name) return 'Sans nom';
    return name.replace(/\{(\w+)\}/g, '$1');
}

/**
 * Toggle une section collapsible
 */
function toggleCollapsible(header) {
    const card = header.closest('.collapsible');
    card.classList.toggle('collapsed');
}
