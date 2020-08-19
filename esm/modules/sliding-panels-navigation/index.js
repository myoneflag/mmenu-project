import { r, $ } from '../helpers';
import * as support from '../support';
/**
 * Class for navigating in a mobile menu.
 */
var MmSlidingPanelsNavigation = /** @class */ (function () {
    /**
     * Class for navigating in a mobile menu.
     *
     * @param {HTMLElement} node            HTMLElement for the menu.
     * @param {string}      title           The title for the menu.
     * @param {string}      selectedClass   The class for selected listitems.
     * @param {boolean}     slidingSubmenus Whether or not to use sliding submenus.
     * @param {string}      theme           The color scheme for the menu.
     */
    function MmSlidingPanelsNavigation(node, title, selectedClass, slidingSubmenus) {
        this.node = node;
        this.title = title;
        this.slidingSubmenus = slidingSubmenus;
        this.selectedClass = selectedClass;
        //  Sliding submenus not supported in IE11.
        if (support.IE11) {
            this.slidingSubmenus = false;
        }
        this.node.classList.add("mm-spn--" + (this.slidingSubmenus ? 'navbar' : 'vertical'));
        this.mmSpnTitle = this.node.querySelector("#mm-header__title");
        this._setSelectedl();
        this._initAnchors();
    }
    /**
     * Open the given panel.
     *
     * @param {HTMLElement} panel Panel to open.
     */
    MmSlidingPanelsNavigation.prototype.openPanel = function (panel) {
        /** Parent LI for the panel.  */
        var listitem = panel.parentElement;
        //  Sliding submenus
        if (this.slidingSubmenus) {
            /** Title above the panel to open. */
            var title_1 = panel.dataset.mmSpnTitle;
            //  Opening the main level UL.
            if (listitem === this.node) {
                this.node.classList.add("mm-spn--main");
            }
            //  Opening a sub level UL.
            else {
                this.node.classList.remove("mm-spn--main");
                //  Find title from parent LI.
                if (!title_1) {
                    r(listitem.children).forEach(function (child) {
                        if (child.matches('a, span')) {
                            title_1 = child.textContent;
                        }
                    });
                }
            }
            //  Use the default title.
            if (!title_1) {
                title_1 = this.title;
            }
            //  Set the title.
            this.mmSpnTitle.innerHTML = title_1;
            //  Unset all panels from being opened and parent.
            $(".mm-spn--open", this.node).forEach(function (open) {
                open.classList.remove("mm-spn--open");
                open.classList.remove("mm-spn--parent");
            });
            //  Set the current panel as being opened.
            panel.classList.add("mm-spn--open");
            panel.classList.remove("mm-spn--parent");
            //  Set all parent panels as being parent.
            var parent_1 = panel.parentElement.closest('.mm-panel');
            while (parent_1) {
                parent_1.classList.add("mm-spn--open");
                parent_1.classList.add("mm-spn--parent");
                parent_1 = parent_1.parentElement.closest('.mm-panel');
            }
            document.dispatchEvent(new Event('openPanel:finish'));
        }
        //  Vertical submenus
        else {
            /** Whether or not the panel is currently opened. */
            var isOpened = panel.matches(".mm-spn--open");
            //  Unset all panels from being opened and parent.
            $(".mm-spn--open", this.node).forEach(function (open) {
                open.classList.remove("mm-spn--open");
            });
            //  Toggle the current panel.
            panel.classList[isOpened ? 'remove' : 'add']("mm-spn--open");
            //  Set all parent panels as being opened.
            var parent_2 = panel.parentElement.closest('.mm-panel');
            while (parent_2) {
                parent_2.classList.add("mm-spn--open");
                parent_2 = parent_2.parentElement.closest('.mm-panel');
            }
        }
    };
    /**
     * Initiate the selected listitem / open the current panel.
     */
    MmSlidingPanelsNavigation.prototype._setSelectedl = function () {
        /** All selected LIs. */
        var listitems = $('.' + this.selectedClass, this.node);
        /** The last selected LI. */
        var listitem = listitems[listitems.length - 1];
        /** The opened UL. */
        var panel = null;
        if (listitem) {
            panel = listitem.closest('.mm-panel');
        }
        if (!panel) {
            panel = this.node.querySelector('.mm-panel');
        }
    };
    /**
     * Initialize the click event handlers.
     */
    MmSlidingPanelsNavigation.prototype._initAnchors = function () {
        var _this = this;
        /**
         * Clicking an A in the menu: prevent bubbling up to the LI.
         *
         * @param   {HTMLElement}    target The clicked element.
         * @return  {boolean}       handled Whether or not the event was handled.
         */
        var clickAnchor = function (target) {
            if (target.matches('a')) {
                return true;
            }
            return false;
        };
        /**
         * Click a LI or SPAN in the menu: open its submenu (if present).
         *
         * @param   {HTMLElement}    target The clicked element.
         * @return  {boolean}               Whether or not the event was handled.
         */
        var openSubmenu = function (target) {
            /** Parent listitem for the submenu.  */
            var listitem;
            //  Find the parent listitem.
            if (target.closest('span')) {
                listitem = target.parentElement;
            }
            else if (target.closest('.mm-listitem')) {
                listitem = target;
            }
            else {
                listitem = false;
            }
            if (listitem) {
                r(listitem.children).forEach(function (panel) {
                    if (panel.matches('.mm-panel')) {
                        _this.openPanel(panel);
                    }
                });
                return true;
            }
            return false;
        };
        this.node.addEventListener('click', function (evnt) {
            var target = evnt.target;
            var handled = false;
            handled = handled || clickAnchor(target);
            handled = handled || openSubmenu(target);
            if (handled) {
                evnt.stopImmediatePropagation();
            }
        });
    };
    return MmSlidingPanelsNavigation;
}());
export default MmSlidingPanelsNavigation;
