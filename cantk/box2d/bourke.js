/**
 * Functions to determine whether or not a polygon (2D) has its vertices ordered
 * clockwise or counterclockwise and also for testing whether a polygon is convex 
 * or concave
 * 
 * This code is a very quick port of the C functions written by Paul Bourke 
 * found here - http://debian.fmi.uni-sofia.bg/~sergei/cgsr/docs/clockwise.htm
 * 
 * ported to actionscript by @yadurajiv
 * http://chronosign.com/rant
 */

var CLOCKWISE = 1,
    COUNTERCLOCKWISE = -1,
    CONCAVE = -1,
    CONVEX = 1;

/*
  Return the clockwise status of a curve, clockwise or counterclockwise
  n vertices making up curve p
  return 0 for incomputables eg: colinear points
    CLOCKWISE == 1
    COUNTERCLOCKWISE == -1
  It is assumed that
  - the polygon is closed
  - the last point is not repeated.
  - the polygon is simple (does not intersect itself or have holes)
*/

function ClockWise(p) {
  var i, j, k, z,
      count = 0,
      n = p.length;

  if (n < 3) {
    return (0);
  }

  for (i = 0; i < n; i++) {
    j = (i + 1) % n;
    k = (i + 2) % n;
    z  = (p[j].x - p[i].x) * (p[k].y - p[j].y);
    z -= (p[j].y - p[i].y) * (p[k].x - p[j].x);

    if (z < 0) {
      count--;
    } else if (z > 0) {
      count++;
    }
  }

  if (count > 0) {
    return (COUNTERCLOCKWISE);
  } else if (count < 0) {
    return (CLOCKWISE);
  } else {
    return (0);
  }
}

function Convex(p) {
  var i, j, k, z,
      flag = 0,
      n = p.length;

  if (n < 3) {
    return (0);
  }

  for(var step = 1 + Math.floor(n / 3); step >=1; step--) {
      for (i = 0; i < n; i += step) {
          j = (i + 1 * step) % n;
          k = (i + 2 * step) % n;
          z  = (p[j].x - p[i].x) * (p[k].y - p[j].y);
          z -= (p[j].y - p[i].y) * (p[k].x - p[j].x);

          if (z < 0) {
              flag |= 1;
          } else if (z > 0) {
              flag |= 2;
          }

          if (flag === 3) {
              return (CONCAVE);
          }
      }
  }

  if (flag !== 0) {
    return (CONVEX);
  } else {
    return (0);
  }
}
