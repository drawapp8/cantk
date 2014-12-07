window.animateWindowBg = function(win) {
    win.bgOffsetX = 0;
    win.bgOffsetY = 0;
    win.bgInc = true;

    win.drawBgImage = function(canvas) {
        var image = win.getBgImage();
        var imageRect = image.getImageRect();
        var htmlImage = image.getImage();

        if (win.bgInc) {
            win.bgOffsetX++;
            if ((win.bgOffsetX + win.w) >= imageRect.w) {
                win.bgInc = false;
            }
        } else {
            win.bgOffsetX--;
            if (win.bgOffsetX < 1) {
                win.bgInc = true;
            }
        }
        win.bgOffsetY++;
        win.bgOffsetY = win.bgOffsetY % imageRect.h;

        var oy = imageRect.h - win.bgOffsetY;
        var rect = {
            x: win.bgOffsetX,
            y: win.bgOffsetY,
            w: win.w,
            h: win.h
        };

        rect.h = Math.min(win.h, oy);
        win.drawImageAt(canvas, htmlImage, CanTK.UIElement.IMAGE_DISPLAY_SCALE, 0, 0, win.w, rect.h, rect);

        if (oy < win.h) {
            rect.y = 0;
            rect.h = win.h - oy;
            win.drawImageAt(canvas, htmlImage, CanTK.UIElement.IMAGE_DISPLAY_SCALE, 0, oy, win.w, rect.h, rect);
        }

        return;
    }
}
