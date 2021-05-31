var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        yield figma.loadFontAsync({ family: "Roboto", style: "Regular" });
        let componentsList = [];
        function traverse(node) {
            if ("children" in node) {
                if (node.type === "INSTANCE") {
                    const duplicateCheck = componentsList.filter(element => element.mainComponent === node.mainComponent);
                    !!duplicateCheck.length ? {} : componentsList.push(node);
                }
                if (node.type === "FRAME" || node.type === "PAGE" || node.type === "GROUP") {
                    for (const child of node.children) {
                        traverse(child);
                    }
                }
            }
        }
        traverse(figma.currentPage);
        const newFrame = figma.createFrame();
        newFrame.layoutMode = "VERTICAL";
        newFrame.paddingLeft = 80;
        newFrame.paddingRight = 80;
        newFrame.paddingTop = 80;
        newFrame.paddingBottom = 80;
        newFrame.itemSpacing = 24;
        newFrame.primaryAxisSizingMode = "AUTO";
        newFrame.counterAxisSizingMode = "AUTO";
        componentsList.forEach(element => {
            if (element.mainComponent.remote) {
                const componentFrame = figma.createFrame();
                componentFrame.layoutMode = "HORIZONTAL";
                componentFrame.itemSpacing = 24;
                componentFrame.primaryAxisSizingMode = "AUTO";
                componentFrame.counterAxisSizingMode = "AUTO";
                componentFrame.primaryAxisAlignItems = "CENTER";
                componentFrame.counterAxisAlignItems = "CENTER";
                componentFrame.appendChild(element.clone());
                if (element.mainComponent.documentationLinks.length > 0) {
                    const documentation = element.mainComponent.documentationLinks[0].uri;
                    const annotationText = figma.createText();
                    annotationText.characters = documentation;
                    componentFrame.appendChild(annotationText);
                }
                newFrame.appendChild(componentFrame);
            }
        });
        newFrame.x = figma.viewport.center.x - newFrame.width / 2;
        newFrame.y = figma.viewport.center.y - newFrame.height / 2;
        figma.closePlugin();
    });
}
main();
