/**
 * Class for off-canvas behavior.
 */
var MmOffCanvasDrawer = /** @class */ (function () {
    /**
     * Class for off-canvas drawer.
     *
     * @param {HTMLElement} [node]          The element to put in the drawer.
     */
    function MmOffCanvasDrawer(node) {
        var _this = this;
        if (node === void 0) { node = null; }
        //Set Is Menu open to false
        this.isMenuOpen = false;
        //  Create the wrapper.
        this.wrapper = document.createElement('div');
        this.wrapper.classList.add("mm-ocd");
        this.wrapper.classList.add("mm-ocd--left");
        //  Create the drawer.
        this.content = document.createElement('div');
        this.content.classList.add("mm-ocd__content");
        this.wrapper.append(this.content);
        //  Create the backdrop.
        this.backdrop = document.createElement('div');
        this.backdrop.classList.add("mm-ocd__backdrop");
        this.wrapper.append(this.backdrop);
        //  Add the nodes to the <body>.
        document.body.append(this.wrapper);
        if (node) {
            this.content.append(node);
        }
        //  Click the backdrop.
        var close = function (evnt) {
            _this.close();
            evnt.stopImmediatePropagation();
        };
        this.backdrop.addEventListener('touchstart', close, { passive: true });
        this.backdrop.addEventListener('mousedown', close, { passive: true });
    }
    /**
     * Open the drawer.
     */
    MmOffCanvasDrawer.prototype.open = function () {
        this.wrapper.classList.add("mm-ocd--open");
        document.documentElement.classList.add("mm-ocd-opened");
        this.isMenuOpen = true;
        document.dispatchEvent(new Event('open:finish'));
    };
    /**
     * Close the drawer.
     */
    MmOffCanvasDrawer.prototype.close = function (dispatchEvent) {
        if (dispatchEvent === void 0) { dispatchEvent = true; }
        this.wrapper.classList.remove("mm-ocd--open");
        document.documentElement.classList.remove("mm-ocd-opened");
        this.isMenuOpen = false;
        if (dispatchEvent) {
            document.dispatchEvent(new Event('close:finish'));
        }
    };
    return MmOffCanvasDrawer;
}());
export default MmOffCanvasDrawer;
