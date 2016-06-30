/**
 * @class UIProgressBar
 * @extends UIElement
 * Progress bar. setValue/getValue can be used to set/get progress. Progress ranges from 0 - 100.
 *
 * Placing an image on the progress bar can turn it into a slider element.
 *
 * The progress bar can appear three ways:
 * 
 * 1. A horizontal progress bar is when its width > height.

 * 2. A vertical progress bar is when width < height.
 * 
 * 3. A circular progress bar is when width roughly equals height.
 *
 *     @example small frame
 *     this.win.find("progressbar").setValue(50, true, true);
 *
 */

/**
 * @event onChanged
 * This event fires when progress changes.
 * @param {Number} value Current progress.
 */

/**
 * @event onChanging
 * This event fires as progress is changing. This event will only fire when the slider block in a slider element is dragged.
 * @param {Number} value Current progress.
 */

/**
 * @method setStepSize
 * Set the step size of Slider.
 * @param {Number} stepSize value(0-50)，0:Smooth movement.
 * @return {UIElement} Returns element.
 *
 * Example：
 *
 *     @example small frame
 *     var win = this.win;
 *     var slider = win.find("slider");
 *     slider.setStepSize(20);
 */

/**
 * @method getStepSize
 * Get step size of Slider.
 * @return {Number} step size of Slider.
 */

