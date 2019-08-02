figma.showUI(__html__);
function findAllTextNodes(pageNode) {
    return pageNode.findAll((node) => {
        return node.type === 'TEXT';
    });
}
function getFontFamily(textNode) {
    const fontName = textNode.fontName;
    if (typeof fontName === 'symbol') {
        return fontName.toString();
    }
    return fontName.family;
}
function createEntries(textNodes) {
    const fontFamilies = textNodes.map(getFontFamily);
    const fontNameToTrueMap = {};
    fontFamilies.forEach((fontName) => {
        fontNameToTrueMap[fontName] = true;
    });
    const uniqueFontFamilies = Object.keys(fontNameToTrueMap);
    const entries = uniqueFontFamilies.map((fontFamily) => {
        return {
            displayText: fontFamily,
            fontFamily: fontFamily,
        };
    });
    return [{
            displayText: 'Font Family',
            fontFamily: '',
        }].concat(entries);
}
function updateFontFamilies() {
    const textNodes = findAllTextNodes(figma.currentPage);
    figma.ui.postMessage({
        payload: {
            entries: createEntries(textNodes),
        },
        type: 'update-font-families',
    });
}
function selectNodesByFontFamily(fontFamily) {
    const textNodes = findAllTextNodes(figma.currentPage);
    const targetTextNodes = textNodes.filter((textNode) => {
        return getFontFamily(textNode) === fontFamily;
    });
    figma.currentPage.selection = targetTextNodes;
    figma.viewport.scrollAndZoomIntoView(targetTextNodes);
}
figma.ui.onmessage = (msg) => {
    if (msg.type === 'load') {
        updateFontFamilies();
    }
    if (msg.type === 'select-nodes-by-font-family') {
        selectNodesByFontFamily(msg.payload.fontFamily);
    }
};
