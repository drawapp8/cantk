/**
 * @class UIImage
 * @extends UIElement
 * Used to display an image. UIImage can set multiple images, but only one will be the current image. Other images will be optional images (currently 15, but this can be increased). A specific optional image can be set to be the current image with setValue.
 *
 * Notice: getValue return the value setted by calling setValue, if setValue never be called, getValue returns -1.
 *
 * Sets the first optional image to be the current image(You can config optional image in property sheet):
 *
 *     @example small frame
 *     this.setImage(0);
 *
 * or:
 *     
 *     @example small frame
 *     this.setValue(0);
 */

