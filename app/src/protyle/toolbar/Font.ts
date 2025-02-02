import {getEventName, updateHotkeyTip} from "../util/compatibility";
import {ToolbarItem} from "./ToolbarItem";
import {setPosition} from "../../util/setPosition";
import {getSelectionPosition} from "../util/selection";
import {Constants} from "../../constants";

export class Font extends ToolbarItem {
    public element: HTMLElement;

    constructor(protyle: IProtyle, menuItem: IMenuItem) {
        super(protyle, menuItem);
        this.element.addEventListener(getEventName(), () => {
            protyle.toolbar.element.classList.add("fn__none");
            protyle.toolbar.subElement.innerHTML = "";
            protyle.toolbar.subElement.style.width = "";
            protyle.toolbar.subElement.style.padding = "";
            protyle.toolbar.subElement.append(fontMenu(protyle));
            protyle.toolbar.subElement.classList.remove("fn__none");
            protyle.toolbar.subElementCloseCB = undefined;
            const position = getSelectionPosition(protyle.wysiwyg.element, protyle.toolbar.range);
            setPosition(protyle.toolbar.subElement, position.left, position.top + 18, 26);
        });
    }
}

export const fontMenu = (protyle: IProtyle) => {
    let colorHTML = "";
    ["var(--b3-font-color1)", "var(--b3-font-color2)", "var(--b3-font-color3)", "var(--b3-font-color4)",
        "var(--b3-font-color5)", "var(--b3-font-color6)", "var(--b3-font-color7)", "var(--b3-font-color8)",
        "var(--b3-font-color9)", "var(--b3-font-color10)", "var(--b3-font-color11)", "var(--b3-font-color12)",
        "var(--b3-font-color13)"].forEach((item) => {
        colorHTML += `<button class="b3-color__square" data-type="color" style="background-color:${item}"></button>`;
    });
    let bgHTML = "";
    ["var(--b3-font-background1)", "var(--b3-font-background2)", "var(--b3-font-background3)", "var(--b3-font-background4)",
        "var(--b3-font-background5)", "var(--b3-font-background6)", "var(--b3-font-background7)", "var(--b3-font-background8)",
        "var(--b3-font-background9)", "var(--b3-font-background10)", "var(--b3-font-background11)", "var(--b3-font-background12)",
        "var(--b3-font-background13)"].forEach((item) => {
        bgHTML += `<button class="b3-color__square" data-type="backgroundColor" style="background-color:${item}"></button>`;
    });

    const element = document.createElement("div");
    element.classList.add("protyle-font");
    let lastColorHTML = "";
    const lastFonts = JSON.parse(localStorage.getItem(Constants.LOCAL_FONTSTYLES) || "[]");
    if (lastFonts.length > 0) {
        lastColorHTML = `<div style="margin-bottom: 2px" class="fn__flex">
    ${window.siyuan.languages.lastUsed}<span class="fn__space"></span>
    <small class="ft__on-surface fn__flex-center">${updateHotkeyTip(window.siyuan.config.keymap.editor.insert.lastUsed.custom)}</small>
</div><div class="fn__flex" style="align-items: center">`;
        lastFonts.forEach((item: string) => {
            const lastFontStatus = item.split(Constants.ZWSP);
            switch (lastFontStatus[0]) {
                case "color":
                    lastColorHTML += `<button class="b3-color__square" data-type="color" style="background-color:${lastFontStatus[1]}"></button>`;
                    break;
                case "backgroundColor":
                    lastColorHTML += `<button class="b3-color__square" data-type="backgroundColor" style="background-color:${lastFontStatus[1]}"></button>`;
                    break;
                case "style2":
                    lastColorHTML += `<button data-type="style2" class="protyle-font__style" style="-webkit-text-stroke: 0.2px var(--b3-theme-on-background);-webkit-text-fill-color : transparent;">${window.siyuan.languages.hollow}</button>`;
                    break;
                case "style4":
                    lastColorHTML += `<button data-type="style4" class="protyle-font__style" style="text-shadow: 1px 1px var(--b3-border-color), 2px 2px var(--b3-border-color), 3px 3px var(--b3-border-color), 4px 4px var(--b3-border-color)">${window.siyuan.languages.shadow}</button>`;
                    break;
            }
        });
        lastColorHTML += "</div>";
    }
    element.innerHTML = `${lastColorHTML}<div style="margin: 4px 0 2px">${window.siyuan.languages.colorFont}</div>
<div class="fn__flex">
    ${colorHTML}
</div>
<div style="margin: 4px 0 2px">${window.siyuan.languages["--b3-theme-background"]}</div>
<div class="fn__flex">
    ${bgHTML}
</div>
<div style="margin: 4px 0 2px">${window.siyuan.languages.fontStyle}</div>
<div class="fn__flex">
    <button data-type="style2" class="protyle-font__style" style="-webkit-text-stroke: 0.2px var(--b3-theme-on-background);-webkit-text-fill-color : transparent;">${window.siyuan.languages.hollow}</button>
    <button data-type="style4" class="protyle-font__style" style="text-shadow: 1px 1px var(--b3-border-color), 2px 2px var(--b3-border-color), 3px 3px var(--b3-border-color), 4px 4px var(--b3-border-color)">${window.siyuan.languages.shadow}</button>
</div>
<div style="margin: 4px 0 2px">${window.siyuan.languages.fontSize}</div>
<div class="fn__flex">
    <select class="b3-select">
        <option value="12px">12px</option>
        <option value="13px">13px</option>
        <option value="14px">14px</option>
        <option value="15px">15px</option>
        <option selected value="16px">16px</option>
        <option value="19px">19px</option>
        <option value="22px">22px</option>
        <option value="24px">24px</option>
        <option value="29px">29px</option>
        <option value="32px">32px</option>
        <option value="40px">40px</option>
        <option value="48px">48px</option>
    </select>
</div>`;
    element.addEventListener(getEventName(), function (event: Event) {
        let target = event.target as HTMLElement;
        while (target && !target.isEqualNode(element)) {
            if (target.tagName === "BUTTON") {
                fontEvent(protyle, target.getAttribute("data-type"), target.style.backgroundColor);
                break;
            }
            target = target.parentElement;
        }
    });
    element.querySelector("select").addEventListener("change", function (event: Event) {
        fontEvent(protyle, "fontSize", (event.target as HTMLSelectElement).value);
    })
    return element;
};

export const fontEvent = (protyle: IProtyle, type?: string, color?: string) => {
    let localFontStyles = JSON.parse(localStorage.getItem(Constants.LOCAL_FONTSTYLES) || "[]");
    if (type) {
        localFontStyles.splice(0, 0, `${type}${Constants.ZWSP}${color}`);
        localFontStyles = [...new Set(localFontStyles)];
        if (localFontStyles.length > 8) {
            localFontStyles.splice(7, 1);
        }
        localStorage.setItem(Constants.LOCAL_FONTSTYLES, JSON.stringify(localFontStyles));
    } else {
        if (localFontStyles.length === 0) {
            type = "color";
            color = "var(--b3-font-color1)";
        } else {
            const fontStyles = localFontStyles[0].split(Constants.ZWSP);
            type = fontStyles[0];
            color = fontStyles[1];
        }
    }
    protyle.toolbar.setInlineMark(protyle, "text", "range", {type, color});
};

export const setFontStyle = (textElement: HTMLElement, textOption: ITextOption) => {
    if (textOption) {
        switch (textOption.type) {
            case "color":
                textElement.style.color = textOption.color;
                break;
            case "fontSize":
                textElement.style.fontSize = textOption.color;
                break;
            case "backgroundColor":
                textElement.style.backgroundColor = textOption.color;
                break;
            case "style2":
                textElement.style.webkitTextStroke = "0.2px var(--b3-theme-on-background)";
                textElement.style.webkitTextFillColor = "transparent";
                break;
            case "style4":
                textElement.style.textShadow = "1px 1px var(--b3-border-color), 2px 2px var(--b3-border-color), 3px 3px var(--b3-border-color), 4px 4px var(--b3-border-color)";
                break;
        }
    }
};

export const hasSameTextStyle = (currentElement: HTMLElement, sideElement: HTMLElement, textObj: ITextOption) => {
    if (!textObj) {
        return true;
    }
    let color = "";
    let webkitTextFillColor = "";
    let webkitTextStroke = "";
    let textShadow = "";
    let backgroundColor = "";
    let fontSize = "";
    if (currentElement.nodeType !== 3) {
        color = currentElement.style.color;
        webkitTextFillColor = currentElement.style.webkitTextFillColor;
        webkitTextStroke = currentElement.style.webkitTextStroke;
        textShadow = currentElement.style.textShadow;
        backgroundColor = currentElement.style.backgroundColor;
        fontSize = currentElement.style.fontSize;
    }
    if (textObj.type === "color") {
        return textObj.color === sideElement.style.color &&
            webkitTextFillColor === sideElement.style.webkitTextFillColor &&
            webkitTextStroke === sideElement.style.webkitTextStroke &&
            textShadow === sideElement.style.textShadow &&
            fontSize === sideElement.style.fontSize &&
            backgroundColor === sideElement.style.backgroundColor;
    }
    if (textObj.type === "backgroundColor") {
        return color === sideElement.style.color &&
            webkitTextFillColor === sideElement.style.webkitTextFillColor &&
            webkitTextStroke === sideElement.style.webkitTextStroke &&
            textShadow === sideElement.style.textShadow &&
            fontSize === sideElement.style.fontSize &&
            textObj.color === sideElement.style.backgroundColor;
    }
    if (textObj.type === "style2") {
        return color === sideElement.style.color &&
            "transparent" === sideElement.style.webkitTextFillColor &&
            "0.2px var(--b3-theme-on-background)" === sideElement.style.webkitTextStroke &&
            textShadow === sideElement.style.textShadow &&
            fontSize === sideElement.style.fontSize &&
            backgroundColor === sideElement.style.backgroundColor;
    }
    if (textObj.type === "style4") {
        return color === sideElement.style.color &&
            webkitTextFillColor === sideElement.style.webkitTextFillColor &&
            webkitTextStroke === sideElement.style.webkitTextStroke &&
            fontSize === sideElement.style.fontSize &&
            "1px 1px var(--b3-border-color), 2px 2px var(--b3-border-color), 3px 3px var(--b3-border-color), 4px 4px var(--b3-border-color)" === sideElement.style.textShadow &&
            backgroundColor === sideElement.style.backgroundColor;
    }
    if (textObj.type === "fontSize") {
        return color === sideElement.style.color &&
            webkitTextFillColor === sideElement.style.webkitTextFillColor &&
            webkitTextStroke === sideElement.style.webkitTextStroke &&
            textShadow === sideElement.style.textShadow &&
            textObj.color === sideElement.style.fontSize &&
            backgroundColor === sideElement.style.backgroundColor;
    }
};
