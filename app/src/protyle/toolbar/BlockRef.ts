import {ToolbarItem} from "./ToolbarItem";
import {hintRef} from "../hint/extend";
import {fixTableRange} from "../util/selection";

export class BlockRef extends ToolbarItem {
    public element: HTMLElement;

    constructor(protyle: IProtyle, menuItem: IMenuItem) {
        super(protyle, menuItem);
        // 不能用 getEventName，否则会导致光标位置变动到点击的文档中
        this.element.addEventListener("click", (event: MouseEvent & { changedTouches: MouseEvent[] }) => {
            fixTableRange(protyle.toolbar.range);
            hintRef(protyle.toolbar.range.toString(), protyle, true);
            protyle.toolbar.element.classList.add("fn__none");
            event.stopPropagation();
        });
    }
}
