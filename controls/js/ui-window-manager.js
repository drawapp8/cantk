/*
 * File:   ui-window-manager.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Window Manager
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * 
 */

var gLogoImageSrc = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAACXCAYAAADqD16ZAAAABGdBTUEAALGPC/xhBQAACjtpQ0NQUGhvdG9zaG9wIElDQyBwcm9maWxlAABIiZ2Wd1RT2RaHz703vVCSEIqU0GtoUgJIDb1IkS4qMQkQSsCQACI2RFRwRFGRpggyKOCAo0ORsSKKhQFRsesEGUTUcXAUG5ZJZK0Z37x5782b3x/3fmufvc/dZ+991roAkPyDBcJMWAmADKFYFOHnxYiNi2dgBwEM8AADbADgcLOzQhb4RgKZAnzYjGyZE/gXvboOIPn7KtM/jMEA/5+UuVkiMQBQmIzn8vjZXBkXyTg9V5wlt0/JmLY0Tc4wSs4iWYIyVpNz8ixbfPaZZQ858zKEPBnLc87iZfDk3CfjjTkSvoyRYBkX5wj4uTK+JmODdEmGQMZv5LEZfE42ACiS3C7mc1NkbC1jkigygi3jeQDgSMlf8NIvWMzPE8sPxc7MWi4SJKeIGSZcU4aNkxOL4c/PTeeLxcwwDjeNI+Ix2JkZWRzhcgBmz/xZFHltGbIiO9g4OTgwbS1tvijUf138m5L3dpZehH/uGUQf+MP2V36ZDQCwpmW12fqHbWkVAF3rAVC7/YfNYC8AirK+dQ59cR66fF5SxOIsZyur3NxcSwGfaykv6O/6nw5/Q198z1K+3e/lYXjzkziSdDFDXjduZnqmRMTIzuJw+Qzmn4f4Hwf+dR4WEfwkvogvlEVEy6ZMIEyWtVvIE4gFmUKGQPifmvgPw/6k2bmWidr4EdCWWAKlIRpAfh4AKCoRIAl7ZCvQ730LxkcD+c2L0ZmYnfvPgv59V7hM/sgWJH+OY0dEMrgSUc7smvxaAjQgAEVAA+pAG+gDE8AEtsARuAAP4AMCQSiIBHFgMeCCFJABRCAXFIC1oBiUgq1gJ6gGdaARNIM2cBh0gWPgNDgHLoHLYATcAVIwDp6AKfAKzEAQhIXIEBVSh3QgQ8gcsoVYkBvkAwVDEVAclAglQ0JIAhVA66BS'+
'qByqhuqhZuhb6Ch0GroADUO3oFFoEvoVegcjMAmmwVqwEWwFs2BPOAiOhBfByfAyOB8ugrfAlXADfBDuhE/Dl+ARWAo/gacRgBAROqKLMBEWwkZCkXgkCREhq5ASpAJpQNqQHqQfuYpIkafIWxQGRUUxUEyUC8ofFYXiopahVqE2o6pRB1CdqD7UVdQoagr1EU1Ga6LN0c7oAHQsOhmdiy5GV6Cb0B3os+gR9Dj6FQaDoWOMMY4Yf0wcJhWzArMZsxvTjjmFGcaMYaaxWKw61hzrig3FcrBibDG2CnsQexJ7BTuOfYMj4nRwtjhfXDxOiCvEVeBacCdwV3ATuBm8Et4Q74wPxfPwy/Fl+EZ8D34IP46fISgTjAmuhEhCKmEtoZLQRjhLuEt4QSQS9YhOxHCigLiGWEk8RDxPHCW+JVFIZiQ2KYEkIW0h7SedIt0ivSCTyUZkD3I8WUzeQm4mnyHfJ79RoCpYKgQo8BRWK9QodCpcUXimiFc0VPRUXKyYr1iheERxSPGpEl7JSImtxFFapVSjdFTphtK0MlXZRjlUOUN5s3KL8gXlRxQsxYjiQ+FRiij7KGcoY1SEqk9lU7nUddRG6lnqOA1DM6YF0FJppbRvaIO0KRWKip1KtEqeSo3KcRUpHaEb0QPo6fQy+mH6dfo7VS1VT1W+6ibVNtUrqq/V5qh5qPHVStTa1UbU3qkz1H3U09S3qXep39NAaZhphGvkauzROKvxdA5tjssc7pySOYfn3NaENc00IzRXaO7THNCc1tLW8tPK0qrSOqP1VJuu7aGdqr1D+4T2pA5Vx01HoLND56TOY4YKw5ORzqhk9DGmdDV1/XUluvW6g7ozesZ6UXqFeu169/QJ+iz9JP0d+r36UwY6BiEGBQatBrcN8YYswxTDXYb9hq+NjI1ijDYYdRk9MlYzDjDON241vmtCNnE3WWbSYHLNFGPKMk0z3W162Qw2szdLMasxGzKHzR3MBea7zYct0BZOFkKLBosbTBLTk5nDbGWOWtIt'+
'gy0LLbssn1kZWMVbbbPqt/pobW+dbt1ofceGYhNoU2jTY/OrrZkt17bG9tpc8lzfuavnds99bmdux7fbY3fTnmofYr/Bvtf+g4Ojg8ihzWHS0cAx0bHW8QaLxgpjbWadd0I7eTmtdjrm9NbZwVnsfNj5FxemS5pLi8ujecbz+PMa54256rlyXOtdpW4Mt0S3vW5Sd113jnuD+wMPfQ+eR5PHhKepZ6rnQc9nXtZeIq8Or9dsZ/ZK9ilvxNvPu8R70IfiE+VT7XPfV8832bfVd8rP3m+F3yl/tH+Q/zb/GwFaAdyA5oCpQMfAlYF9QaSgBUHVQQ+CzYJFwT0hcEhgyPaQu/MN5wvnd4WC0IDQ7aH3wozDloV9H44JDwuvCX8YYRNRENG/gLpgyYKWBa8ivSLLIu9EmURJonqjFaMTopujX8d4x5THSGOtYlfGXorTiBPEdcdj46Pjm+KnF/os3LlwPME+oTjh+iLjRXmLLizWWJy++PgSxSWcJUcS0YkxiS2J7zmhnAbO9NKApbVLp7hs7i7uE54Hbwdvku/KL+dPJLkmlSc9SnZN3p48meKeUpHyVMAWVAuep/qn1qW+TgtN25/2KT0mvT0Dl5GYcVRIEaYJ+zK1M/Myh7PMs4qzpMucl+1cNiUKEjVlQ9mLsrvFNNnP1IDERLJeMprjllOT8yY3OvdInnKeMG9gudnyTcsn8n3zv16BWsFd0VugW7C2YHSl58r6VdCqpat6V+uvLlo9vsZvzYG1hLVpa38otC4sL3y5LmZdT5FW0ZqisfV+61uLFYpFxTc2uGyo24jaKNg4uGnupqpNH0t4JRdLrUsrSt9v5m6++JXNV5VffdqStGWwzKFsz1bMVuHW69vctx0oVy7PLx/bHrK9cwdjR8mOlzuX7LxQYVdRt4uwS7JLWhlc2V1lULW16n11SvVIjVdNe61m7aba17t5u6/s8djTVqdVV1r3bq9g7816v/rOBqOGin2YfTn7HjZGN/Z/zfq6uUmjqbTpw37hfumB'+
'iAN9zY7NzS2aLWWtcKukdfJgwsHL33h/093GbKtvp7eXHgKHJIcef5v47fXDQYd7j7COtH1n+F1tB7WjpBPqXN451ZXSJe2O6x4+Gni0t8elp+N7y+/3H9M9VnNc5XjZCcKJohOfTuafnD6Vderp6eTTY71Leu+ciT1zrS+8b/Bs0Nnz53zPnen37D953vX8sQvOF45eZF3suuRwqXPAfqDjB/sfOgYdBjuHHIe6Lztd7hmeN3ziivuV01e9r567FnDt0sj8keHrUddv3ki4Ib3Ju/noVvqt57dzbs/cWXMXfbfkntK9ivua9xt+NP2xXeogPT7qPTrwYMGDO2PcsSc/Zf/0frzoIflhxYTORPMj20fHJn0nLz9e+Hj8SdaTmafFPyv/XPvM5Nl3v3j8MjAVOzX+XPT806+bX6i/2P/S7mXvdNj0/VcZr2Zel7xRf3PgLett/7uYdxMzue+x7ys/mH7o+Rj08e6njE+ffgP3hPP74FSqLwAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAB3RJTUUH3wMbAh83mWfR6wAAFhxJREFUeNrtnXuMHVd9xz+/mbsPx7t+JE6c2F4nsWMHgsJLhfAohdBCiOMkJCoFSlFVUbVCILXiTyhqVP7gUZCgFVJR1QZREaWIV5K1eRYSoTSlpNAUaMImcZOs14/1c+31Pu69c779Y87dnb07c2fu9d2HnflJ48edmTPn/L6/95xzxiTtAy4D6oABNWKq+P8HwDngXWZ2igRJuhz4R2A78D4ze1ISZkYzSfoE8ArgI2b2jCQAzAxJBuwB/ha4x8y+1nTvTuCvgd2JfgLI968OPAR8wcyqiftC4OvAFYl7GmT+vmHgi2Y22fTMRt9uBP4OmAY+bGYH0sYoaRPwBeAq4BYzqyWvS7T3LuDjwD3ANwNgPeD8QAS82R9rfScF'+
'bPKAzDXm6UPAncCr/EBSme/pNcDtwA8k7TGzRoca54eAlwK7Uu79EvB+oNf30xLCYcANwGeAW1KYvAd4gx/HrD9m/PEK4FPAW5of6Pu2Bvh7f/5W4JOSejPGuBZ4JXAz8Iik/sb4Esy/CfgacCNwTYOZ6yVdKmmjpEFJhySdlPRq/9ul/hprQvwqxfSgpAf8vz/WBFDy+vs0T1OS7kmcM0kf8Of+IuXeX/h7Xun7tFHShsSxV9I9knY13RdKOujHc40f36CkAUlrJX3aP/PdaRyVdJc//1FJ3/L/fmPG+LZI+q/EGD+X5JmkqyU9nTj/obR2kDQuaULSdRmdavz9P5KmJd0t6Trf6K8lXZFx3/2SnpP0N4lOfNYzyST9WQsA/kPSrKQdCcAGJa3zfwcp2tkAYEzSCUkbU9r9rH/me5rHKKlf0uP+/HoPviQ9kiZkHoBfStov6fv+2lt9WxVJX/K/fcX//eG2AUgw/48kOUnfSZz7sm/4E55BaQCc8B29TdJZf/19npF3FQBgp///9iZpatD7MzRAkn4l6b99W49K+s/EfbekjPGd/twHfTuDXtsl6W0pYDcAeFhSn9fYqqQrvYZK0tv82OcAqNAGeTu2AfiIt68VSZ8Eerx9xp/7JzN7LqWJPmCjme2T9LvAl4H3eif5vYTdzqMT3ilv9rb97d5GK+N6B4wAkfcTg8Bx4HPAMeDfG3baj7EP+BegCvwWcL1vu9+3d7+kLWY2m/Kc7WY2K+lPga8CDwA7fZDwA9/vbCpggt6tfLovRULul3RG0g3JKErSY/6eyRYa8DMvUZsz+vSBFhow5n3AVm9W3pmQzj0ZGn5/gTHe23TPFklPSPpNor2v+mvHJV3tf7snqQFByniSUUbzQNf58KnuvfgGYGPieANwGnivpBuaooUFbfqOHzOz1wPf8lFE4/nNFAJrgG9I+oGkHyaO7wN/5a+bzRhPjw+vZ8zs28C7vDbsk/R5D0xD+n8beAdw1kdm6xPjWwu8x2vDrZJuSoyx'+
'Mb4wYTHeB4wBf2lmz6dEaKmDPQ0cylDnD3pz8SEze97MJszsdOJ4DPi0V/dvNN17zndGDXPWyAHM7G7gk/78TMpzPwM87WPsHcC1iWOnF4hHE2as2VwdAdQIC81snw9Pnwb+EPgHoFdSL/DHwBngY2Z20MzOJMY3ZWb/Cnzfm6c/8Pc0cpJRDxyJPGebmd2XiIiqvj9nyZDyrR6Yw2ZWbzq3w/9z1MxqGYlLnwepH3jWzJw/f5mXoMPN9yba2A6cMrOzKe1u8venCYYBB80sak5+gMZ4xhJ9abR5hfcHg8CvfFtbgTAr4fL39wHbvFaN+eeG3ic5MzvS9Jxkn9b5vOpYAwTSQrisCKjVtVm/5d1bpO1uU5FntDPGIm2n/W6je3dfksxyS1pWqlWAe32oVS/5sazUC+yreOnfUfJjZSjwkUBJK0PPBD4kKmll6GgAHC35sGI0XmpAqQEXKRVLZcYrPlW/YMmCtga8TJ2K/5Br2akJIKr4dPqULzZdOAKmmPmDV8W1L7lVBoCMs4dbplYnGgA44OSFBsAiibfVxX/nRFYtydPJBgARcQX0wra1q8gEycBFiv+RLRinABd4DThWes0uW6B8k3gciAKvASdLtnUXAUW5V51MAnCq5FqXzVC+BiwwQaUGdFMBGj6gIADRhZ4LrMa4oIAGHB4aHlEwNDwCMF6yrbtOIAeAKjAJ8y/lz5I+o6CkpfEB08STFOYAOEf6bISSOrRBOWWImWYNKAHoqvQLqWV2PtOsAZNeLUrqQgQUe+FcEzR5YQNgrKr6T3MSJrXs3pwPaExHmercBMX1Dp2dAFfHLFjysowRZy8KwQ1Y0dS/qz2wwY2xuKfM9XFSnF2FmQ3MNgNwruMoSA5kBNt3QaUHojq2HJLp4nJ0uLUfk3BaHoUQ8bRKd3wMXD3xQsJDExQqQ5wbGh6ZngNgaHhkenTv7nMd9Siqo8nT9H/phwSbN+d5/27ynwAYtHnGLJ+dD5j485eh2gzWP7A4B4iUZ4ION/6RnBHX'+
'2avJSgWqs7j/exLbOoSOHWM5VEDOQRDApk3zZmm5opwTh9HUBKwZTBcOl6tEpwBG9+4mGN27u3HieEeCZAHUqujUClS0bWW8sDt9FM1MYWH6jE5FLcMg4cv/Q8MjNEoR+B/VERPqETrx4nm3704dgdosBCle1hQHBEYuAMkwFOKCXGemNDQ49eJ5p+NOj3sHnDZ1vRGRWSsATqQBcKQjAASEPbgGAGYXPQA6dTg92LA4OnBRLhuOpgHwv51pgKC3H06O+3Xr4cWvASePYD29i7hl5qPy1jGxvL9dBMCxjk1QTy+aOAEzVQhfBACcPgqV3nTuKjU3a6bFAAwNj5wkfjnTPvX2obOn0PRZrNJz8ZugiePQu2aRvJrFEZBcSxN0cmh4ZDxNAxp+oM3eKFbHs6dh8jQENi8G3TpWHQDHsN6+1BKFXK4deaaRA8wlYqN7d+PD0SPEKw/bjIIq6MxpENiafujv71qYr5pDJ8bjhG+1mKAzJ6DSt1g4LHbAOQCMN3KAZCmicw1oJGO9vdQffoBgxw0wPd2d1HTqLAztIth9I8y0XyusP/dLdPygLxd0QZMsjHOAqI6tWZudhFnLlwGHFhQSmk6OdlqQs81D1L74cZiegjDowmBBBxyVD76fvk99BU1Ptx3iztz7UWYeGCbc3gPdqlFVegiu3OnDHS0KcApUZQ+2AqDztQK1KnbldrpWGgsCsBHssis6b2LTVsKr+wiu2tW9erXwdib9VFwJbSkoLTVg7DwrZF30dPIj0nm2YcvnzBVPys1R1MMLhKSVepTUnsmkUYZoDcBYKwDK5Urnw39fhqBgGaIEoMsIyMU+oIUJqg8Nj5zIBMBnw7WSmx26gCjXZ40nk7A0DZi7qKROfL7yfP3RprwrFYByscb5BIGt7f8i3gZ5YVJJbZQo2swBsgAoHXHHPkB5FZgjRQAofcB55H05CIwXAeBQycrziIKs1IAVdcI5Jmi8BGDJzI8VyYILaUDphDtCIDcJmwJmkknYIgD8ybnFAyW1'+
'54FzkrAJoJZMwtJKERBv3nem5GgHEVBrAM6QUuZJM0E1j1ZJRckSy5Ky6XQ7AJwuudoW/4u8izpdasBSakD+jKqJUgOWiv/m9wfqIgClBnSgATlJ2BlSdifOAqCMgtpEoIAPODo0PKJcABIz5EpqIwnLAaBOxo40QQt7VW7m3Q4GTq3ygGqWVckC4CTl5h1tJGG5y5JqNH+sIQeAMV+7KKlQEgByLV1wrV0NOF1qQPEQVM6vjs/GYLZdH3CWcnpKYXIOrPW7gMYHjAoDcKYEoI0cwDU+DZV51czQ8EhxHzA0PDJJuX9QQRM0vzVBC8p8yRV0clNJi01QTh3iGCycEZcJQOKiclv7omFoRB4CC5YlFcmE51ArqQAA9dy1B0c6MUGlBhTLwojq5C2fGi8BWKocwO+QaNZ9DSjniBZRAOedcBvLksooqMs5APkTso6VACyRDSqwRygk9oYofUB3FcCviml52cmh4ZGZtgEYGh6pUW5rX8gH5KTBR7OSsEwAEheXb8Zasx/niuUAaUlYJgCJi1d+qrrO5ys9WmL2N6akt3QALdde523qsLKhaN1ha9fH/q23P94Kp539IvoHIFraom6BELSlEOftAbNyGuAEV24l+slDVAcGCF/xemzbtdi6KwCH1WpQXezb3MkjuGMvUH/yMWq/+gm2advSbVOgQsuSDp8PAKMraHuwSwbRxHFq//wpamFIsPEKgpe/jvB1b4WXvIbgmp0x048fpP7rR6k98WPqv/kpOnU03sHlkkFszUDuTqod5wANJxx0zsPVqwEQLzvs6cPWx5sjqTpN/eEHqT94LwxsIHrTHs5dKmqPfxdNTmDrNsVMH1g/bxfc0uzq3ZgPWmBVzHlpwOrJBSzer97WbYD1l6Jajdq/fZ3atgp22RZsw5UxYMu8xVmBLSrHL1wNyIqKFEEQEFy5neDyEORQtPzTmOb2h7PONSAvClq9eYC8eXFuxb4jWSAJOwXMZiVhLQHwN9UpZ0q3UEYVqgFlJWF5pYiGnJVF'+
'uSwAIuIdubIp961ikd31SgCywlCXx3+O5qXjeU54wU7fJcURj1X8dBTn8kLQXN4V2Q31SMl0sDA2N1FN1CdFbcYRVdX8CZkl0YBjLzZmLxBrQX1W1KagXo1wtcZaABGE1vbmHJ1owEVvgizwB4aLhKtBfUbxUW3ajNUgqEDBrYFPlhqQZ8vxZmVK1GZFfdrFUo6w0OLrOt8I+FCrEDQ3CvI3P3cxmRYLIAjjjTVmTonJIxFnD0VMjjtmJqK4tFCBoGLn+zGQOgW2fChigs74jG7jhRYmWmAYmvuuS1T1pmU2tuWNOZ0WQtBT2KwUpUITnIsA8BvgZn+8HXgLsGY1liYs9ObCz1iOZuOjNi2iquLM1X960ViSr62cBX4MfBd4BP+tgPMFoDo0PPIE8ATw+dG9u/s9CHcBe4EtKy7sYWwyopqoTUN9xlGfdvHLMPloJYhj9yWg54B9wDeAR4eGR6pN5Zw8RS1OiQ89JH+7xWvGzcDl/uhbcoF3sa0e3FwhmnFUp+OoJaqDSdj52/A0mvFByVEv6fuHhkcezuNR1wDIAacCvBTYDdzkj1cDA8sBhuRDye4zfQJ43B8/9Sb5ybRF1x26qq4wfwHqo3t3h57x64HXALcDdwIblsL2L8GHJI8D3wYeBH7hA5HJoeER16mkL7kGFDRXdwK/703WOqCHVl/dXR6q++ME8D3ga0PDI987H7OyKgAoANBrgd/xx7XA1cDgMj1+AngeOOCjlUeGhkd+sULR8rIzvtlcAWz3ALzcO/O3LkHecRT4kWf4L4EXhoZHDi6XpK86DcgAw4Be4BLg94C7vf9Y2+EjTns7/k3P+CnijfO0kkxfNQC0AdQbgHcC7wCu8g6++WNl0z77HPNx+beHhkcevwAS9lXN+EXSefD263fLeC3iJqRXAQ6znwseC8x+tu3Bpw6stFm5KGn09usXx4p7dm86duvuyxZde8f1F1LJanXSgduuY8e+haWUsVt2WK0nsJAgtMCCKIirOaFzkaTIybmrh59Z'+
'NBXuwN6d7Bh+tgQgSc/fdh1X73sm5fedKAgtDIJ4DxhnoRmBTKERhCYFLi6jB6a5crrDcAZOmBOKLP4yrJPJQeCcHOYibd/3bOG+XFQAvLBnF9v3P73o96fevoW1fYOBAswUM1XxR9KDOElTgMxAgd+TKgDU2KcndVBmQkgmZ5gkIg9QJMPJcEGEpqem3a4fvVC4rxeFBhy6bZfVKhYYFgSxBIeKGR9iMmSBDDMpnvKhBcUGtTGu+D7/L18Jjd8MyCQjMsOBRQ45mVxPTW7L/qd1QWjAc3uu45r9C9X2uVt3YJWQgABD4BQzMwgaUh0iAkSAEcSzamyex9nT/NTE2IWMnmd1c4UotVJkFj/TNPdSXQinwGsJOCDCyZmTCOPdgOpyEEVc850Dyw/A2J5dbG1Sy5E3bWPNuj4UBGZBYDgMFJgsIPDMhkCxGcGQealuV6JzR5DcPNvaF634loYsYJIJw5z3LxEO57yfIUARTkHNafv+xT5l7NZdbP3O093XgMM3baF6+RoLrccUEuBkJsKYoQow88xe0LalSDIp0toOScLCHqN/wJAhV8dcXfGshmhu/a5wC3XD0kfe3IfFfbbGJDhziHharnlwAkSEq6uu/kNndNXPjyUE9zq27n+mMwCeffMlhJV+qwxcGUA0J9E4NSrvQbxSRPOKvEwkQdhnDGwIsJ55DWh8z9FF8fKhqC5cXSjyE6mbNaUTbWkYPrP4283xgipZMKcxTrKoMjUZXfXD0c414ODdN0LkKorqfWaE8QjNZAv2yFyRyeENANauTwBgKYz1ywliUGJAVCf+O/Lfee6C+YqfZbH1wpAssjCcJaC+7Vu/zry55TthuTrIBXEI6BdFxYqd5SAL8y/l+qx2irevVImQhRBWsFBGj8x/9zeOh1wkXF3m6gnNaWw/oPmettAWzf8pL6MACqTIrPV2ljkv5esufrYhKXftT7uaoC79XgyQpNjMzYSDEIudrgC/5svVRTRnwhKguCZQLFs9fdBreWzLhGf0jt0N'+
'KPtAFbS6yhapJqgLEZU1BbuNT9RGdXB1h4sS5qvVjumGkNWBWTOx7aGR9n3A6B27DUcvRmWllgEtKwBZgDRplXOx2509J6pTrSTT6maqbnso+wV+axMUlwBaJUJp2ScZSZAKZK7ZyVb2/ynYbvvPUZNbsdgcByFYaFR6oTYjiOLf09rJMxyVIkKQcLsqaNPb3eBBLYDK+387fub8nqOENHofYHOud/F9PlptKTBBIRlabdT4aFrk5icFrUAXfFbUImrQeWuASavA+kvzM2nlDzMU9MYDdBFysR2Ym521RLO0Fkiv5c++y5PwVAAO3vkStj3w1IJgYMWYX6/Hi7CDAHr7sYF12KWbCa7YSu+WbfQO9mITh4jGR4lOHkbnJqA6HQNW6cHCyhIi0HLtgMem9TK+1N5te+Apxu56qbmas5TKYpHajTJqKs33Z7U1Vx61jZss2HotNnQdwebtBJu3YpdvQQMb1Ltug/UNrCWMqmjiuKLjY6bx54mOHCA6NEI09gyaPNWJHc0foxqKZvh6RPO4VID/2SYoqjsC5tIIdcG5Zt2f3lYUiZ4egpe/Tr13/Als3QFhBSxAclCvoUpFVHqhpxfrH6Cy+RrxsjfSA3DkAFMPfpHaz/b7rQ3Cjsx8S/tssWJicRKXiIQK+9CgpfOde52RCUAzI9VmhNPc1sJnWQCXDErrNqKeHqk6K82cEzNToladT1MX3hsf6y5TsGYQWcq57GdmjSn9MGQBssXtkShMMHr79da2BlhCzaSWzC8SJuaB4FJzBimuCdSqolZtMLuYlFanUVRrZQDUZh/TY3RvgrTQ2CiZEbRy1JVWrcfNLpsD7vJzlid+DnywJetsRNkmyDkzVlsBYvWRmeWuolRHeYBZYzcQlTC0AKARimbETXnhVCUnAyuZXwiAnPJUi0w9aKE2sgtj7u4KI9B6N824SmftAzA/36OkltmaxZXRrBqtcrxApaXjKO1/G6Fopi1vmQ0HSxwYauVldGn7pcZeEpbN/5p6M5/3/0AEyIegdW3GAAAAAElFTkSuQmCC';
var gProgressBarBgSrc = 'data:image/png;base64,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';

var gProgressBarFgSrc = 'data:image/png;base64,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';

function UIWindowManager() {
}

UIWindowManager.prototype = new UIFrames();
UIWindowManager.prototype.isUIWindowManager = true;

UIWindowManager.prototype.initUIWindowManager = function(type) {
	this.initUIFrames(type);
	this.history = new Array();

	this.showLoadingProgress = true;
	this.setImage("force-landscape-tips", null);
	this.setImage("force-portrait-tips", null);
	this.setImage("loading-bg", null);
	this.events = {};

	this.logoImage = new Image();
	this.logoImage.src = gLogoImageSrc;

	this.progressBarBgImage = new Image();
	this.progressBarBgImage.src = gProgressBarBgSrc;

	this.progressBarFgImage = new Image();
	this.progressBarFgImage.src = gProgressBarFgSrc;

	return this;
}

UIWindowManager.prototype.onFromJsonDone = function() {
	this.designWidth = this.w;
	this.designHeight = this.h;
	this.forcePortrait = false;
	this.forceLandscape = false;

	var initWinName = cantkGetQueryParam("initwin");
	if(initWinName) {	
		var initWin = this.findBestFitWindowByName(initWinName);
		if(initWin) {
			this.setCurrent(initWin.getZIndex());
		}
	}

	return;
}

UIWindowManager.prototype.beforeAddShapeIntoChildren = function(shape) {
	return !shape.isUIWindow;
}

UIWindowManager.prototype.initDefaultNameForChild = function(shape) {
	shape.name = "newwin";

	return;
}

UIWindowManager.prototype.getSplashWindow = function() {
	for(var i = 0; i < this.children.length; i++) {
		var win = this.children[i];
		if(win.isUINormalWindow && win.windowType === "splash") {
			return win;
		}
	}

	return null;
}

UIWindowManager.prototype.getMainWindow = function() {
	for(var i = 0; i < this.children.length; i++) {
		var win = this.children[i];
		if(win.isUINormalWindow && win.windowType === "main") {
			return win;
		}
	}
	
	for(var i = 0; i < this.children.length; i++) {
		var win = this.children[i];
		if(win.isUINormalWindow) {
			return win;
		}
	}

	return null;
}

UIWindowManager.prototype.getWindowNames = function() {
	var names = [];
	
	for(var i = 0; i < this.children.length; i++) {
		var win = this.children[i];
		names.push(win.name);
	}

	return names;
}

UIWindowManager.prototype.setInitWindow = function(initWindowIndex) {
	this.initWindowIndex = Math.max(0, Math.min(initWindowIndex, this.children.length-1));

	return this;
}

UIWindowManager.prototype.showInitWindow = function() {
	var initWin = null;
	if(this.children.length === 0) {
		return false;
	}

	this.history.clear();

	if(this.initWindowIndex || this.initWindowIndex === 0) {
		initWin = this.children[this.initWindowIndex];	
	}

	var initWinName = cantkGetQueryParam("initwin");
	if(initWinName) {	
		initWin = this.findBestFitWindowByName(initWinName);
	}
	
	if(!initWin) {
		initWin = this.getSplashWindow();
		if(!initWin) {
			initWin = this.getMainWindow();
		}
	}

	if(initWin) {
		this.targetShape = initWin;
		console.log("showInitWindow: set targetShape:" + this.targetShape.name);

		initWin.relayout();
		index = this.getFrameIndex(initWin);
		this.showFrame(index);
		initWin.callOnBeforeOpen();
		initWin.callOnOpen();
		this.history.push(index);
		this.postRedraw();
	}

	return true;
}

UIWindowManager.prototype.callOnLoad = function() {
	for(var i = 0; i < this.children.length; i++) {
		var win = this.children[i];

		win.callOnLoadHandler();
	}

	return true;
}

UIWindowManager.prototype.callOnUnload = function() {
	for(var i = 0; i < this.children.length; i++) {
		var win = this.children[i];

		win.callOnUnloadHandler();
	}

	return true;
}

UIWindowManager.prototype.onResLoadDone = function() {
	this.callOnLoad();
	this.resLoadDone = true;
	this.showInitWindow();

	return;
}

UIWindowManager.prototype.systemInit = function() {
	this.loadSoundEffects();
	this.loadSoundMusic();
	this.resLoadDone = false;
	UIElement.animTimerID = null;
	
	for(var i = 0; i < this.children.length; i++) {
		var win = this.children[i];
		win.callOnSystemInitHandler();
	}

	return;
}

UIWindowManager.prototype.systemExit = function() {
	console.log("systemExit: ");
	var n = this.history.length;
	
	for(var i = 0; i < n; i++) {
		this.closeCurrentWindow(0, true);
	}

	this.history.length = 0;

	this.stopSoundMusic();
	this.callOnUnload();

	return;
}

UIWindowManager.prototype.findBestFitWindowByName = function(name) {
	var win = null;
	var bestWin1 = null;
	var bestWin2 = null;
	var bestWin3 = null;
	var bestWin4 = null;
	var deviceConfig = this.getDeviceConfig();
	var bestWinName1 = name;
	var bestWinName2 = name + "-" + deviceConfig.platform;
	var bestWinName3 = bestWinName2 + "-" + deviceConfig.lcdDensity;
	var bestWinName4 = bestWinName3 + "-" + deviceConfig.screenW + "x" + deviceConfig.screenH;

	for(var i = 0; i < this.children.length; i++) {
		win = this.children[i];

		switch(win.name) {
			case bestWinName1: {
				if(deviceConfig.lcdDensity === win.lcddensity) {
					bestWin3 = win;
				}
				else if(!win.lcddensity || win.lcddensity === "all") {
					bestWin1 = win;
				}
				else {
					if(!bestWin1) {
						bestWin1 = win;
					}
				}

				break;
			}
			case bestWinName2: {
				bestWin2 = win;
				break;
			}
			case bestWinName3: {
				bestWin3 = win;
				break;
			}
			case bestWinName4: {
				bestWin4 = win;
				break;
			}
			default:break;
		}
	}

	if(bestWin4) {
		console.log("Find " + bestWin4.name);
		return bestWin4;
	}
	
	if(bestWin3) {
		console.log("Find " + bestWin3.name);
		return bestWin3;
	}
	
	if(bestWin2) {
		console.log("Find " + bestWin2.name);
		return bestWin2;
	}
	
	if(bestWin1) {
		console.log("Find " + bestWin1.name);
		return bestWin1;
	}

	return null;
}

UIWindowManager.prototype.openWindow = function(name, onClose, closeCurrent, initData, options) {
	var newWin = null;
	options = options ? options : {};

	if(name) {
		newWin = this.findBestFitWindowByName(name);
	}
	else {
		newWin = this.getMainWindow();
	}

	if(!newWin) {
		alert("Can not find window: " + name);
		return;
	}

	if(newWin.pendingLoadChildren) {
		newWin.loadChildren();
	}

	if(this.isWindowOpen(newWin)) {
		if(options.closeOldIfOpened) {
			this.history.remove(newWin.getZIndex());
		}
		else if(options.openNewIfOpened) {
			var newWin = this.dupChild(newWin.name);
			newWin.destroyWhenClose = true;
		}
		else {
			console.log(newWin.name + " is open already.");
			return false;
		}
	}

	if(!newWin.jsonData) {
		newWin.relayout();	
		UIElement.disableGetRelativePathOfURL = true;
		newWin.jsonData = newWin.toJson();
		UIElement.disableGetRelativePathOfURL = false;
	}

	if(options.reCreate && newWin.jsonData) {
		newWin.fromJson(newWin.jsonData);
	}

	if(!newWin) {
		console.log("Not findBestFitWindowByName window " + name);
		return false;
	}
	
	if(newWin.openPending) {
		newWin.openPending = false;
		console.log("This window is already open:" + name);
		return false;
	}

	if(!newWin.isUIWindow) {
		console.log("It is not a window: " + name);
		return false;
	}
	
	newWin.relayout();	
	newWin.openPending = true;
	newWin.initData = initData;
	newWin.onClose = onClose;
	newWin.callOnBeforeOpen(initData);

	this.targetShape = newWin;
	console.log("openWindow: set targetShape:" + this.targetShape.name);

	if(newWin.isUINormalWindow) {
		return this.openNormalWindow(newWin, closeCurrent);
	}
	else {
		return this.openPopupWindow(newWin, closeCurrent);
	}
}

UIWindowManager.prototype.openPopupWindow = function(newWin, closeCurrent) {
	if(closeCurrent) {
		this.closeCurrentWindow(0, true);
	}

	var wm = this;
	var curWin = this.getCurrentFrame();

	newWin.relayout();
	function openPopupWindow() {
		if(!newWin.app)  {
			console.log("may be exited preview mode");
			return;
		}
		newWin.show();
		curWin.setPopupWindow(newWin);
		wm.postRedraw();
		newWin.callOnOpen(newWin.initData);
	}

	if(curWin) {
		curWin.callOnSwitchToBack(true);
		if(newWin.isAnimationEnabled()) {
			var p = this.getPositionInScreen();
			var animation = AnimationFactory.create(newWin.getAnimationName(true), newWin.getAnimationDuration(true)); 
			var backendCanvas = UIFrames.preparseBackendCanvas(curWin, newWin);
			animation.setScale(this.getRealScale());
			animation.prepare(p.x, p.y, this.w, this.h, backendCanvas, openPopupWindow);
			animation.setRectOfFront(newWin.x, newWin.y, newWin.w, newWin.h);
			animation.run();
		}
		else {
			openPopupWindow();
		}
	}

	return true;
}

UIWindowManager.prototype.openNormalWindow = function(newWin, closeCurrent) {
	if(closeCurrent) {
		this.closeCurrentWindow(0, true);
	}

	var wm = this;
	var index = 0;

	newWin.relayout();	
	var curWin = this.getCurrentFrame();
	function closeAndOpenWindow() {
		if(!newWin.app)  {
			console.log("may be exited preview mode");
			return;
		}

		index = wm.getFrameIndex(newWin);
		wm.showFrame(index);
		wm.history.push(index);
		curWin = wm.getCurrentFrame();
		wm.postRedraw();
		newWin.callOnOpen(newWin.initData);

		return;
	}

	if(curWin) {
		curWin.callOnSwitchToBack();
		if(newWin.isAnimationEnabled()) {
			var p = this.getPositionInScreen();
			var animation = AnimationFactory.create(newWin.getAnimationName(true), newWin.getAnimationDuration(true)); 
			var backendCanvas = UIFrames.preparseBackendCanvas(curWin, newWin);
			animation.setScale(this.getRealScale());
			animation.prepare(p.x, p.y, this.w, this.h, backendCanvas, closeAndOpenWindow);
			animation.run();
		}
		else {
			setTimeout(closeAndOpenWindow, 10);
		}
	}
	else {
		closeAndOpenWindow();
	}
	
	return true;
}

UIWindowManager.prototype.getCurrentWindow = function() {
	var curWin = this.getCurrentFrame();
	if(!curWin) {
		return null;
	}

	var childWin = curWin.getPopupWindow();

	return childWin ? childWin : curWin; 
}

UIWindowManager.prototype.backToHomeWin = function() {
	var history = this.history;
	var n = history.length - 1;
	var curWin = this.getCurrentWindow();

	if(!n) {
		if(curWin.isUIPopupWindow) {
			this.closeCurrentWindow(0);
		}

		return;
	}

	if(n === 1) {
		if(curWin.isUIPopupWindow) {
			this.closeCurrentWindow(0, true);
			this.closeCurrentWindow(0);
		}
		else {
			this.closeCurrentWindow(0);
		}

		return;
	}
	
	var mainWinIndex = history[0];
	var lastWin = this.getFrame(mainWinIndex);
	
	if(curWin.isAnimationEnabled()) {
		var p = this.getPositionInScreen();
		var animation = AnimationFactory.create(curWin.getAnimationName(false), curWin.getAnimationDuration(false)); 
		var backendCanvas = UIFrames.preparseBackendCanvas(lastWin, curWin);
		animation.setScale(this.getRealScale());
		animation.prepare(p.x, p.y, this.w, this.h, backendCanvas, function() {});
		animation.run();
	}

	for(var i = 0; i < n; i++) {
		this.closeCurrentWindow(0, true);
	}

	return;
}

UIWindowManager.prototype.closeCurrentWindow = function(retInfo, syncClose) {
	var curWin = this.getCurrentWindow();

	if(!curWin || curWin.mode === Shape.MODE_EDITING) {
		return  false;
	}
	
	if(curWin.isUINormalWindow) {
		return this.closeCurrentNormalWindow(curWin, retInfo, syncClose);
	} 
	else {
		return this.closeCurrentPopupWindow(curWin, retInfo, syncClose);
	}
}

UIWindowManager.prototype.closeCurrentPopupWindow = function(popupWin, retInfo, syncClose) {
	var wm = this;
	var curWin = this.getCurrentFrame();

	if(curWin) {
		function closePopupWindow() {
			if(!popupWin.app)  {
				console.log("may be exited preview mode");
				return;
			}
			curWin.removePopupWindow(popupWin);
			curWin.callOnSwitchToFront(true);
			wm.postRedraw();

			popupWin.callOnClose(retInfo);
		}

		if(popupWin.isAnimationEnabled() && !syncClose) {
			var p = this.getPositionInScreen();
			var animation = AnimationFactory.create(popupWin.getAnimationName(false), popupWin.getAnimationDuration(false)); 

			curWin.removePopupWindow(popupWin);
			var backendCanvas = UIFrames.preparseBackendCanvas(curWin, popupWin);
			curWin.setPopupWindow(popupWin);
		
			animation.setScale(this.getRealScale());
			animation.prepare(p.x, p.y, this.w, this.h, backendCanvas, closePopupWindow);
			animation.setRectOfFront(popupWin.x, popupWin.y, popupWin.w, popupWin.h);
			animation.run();
		}
		else {
			closePopupWindow();
		}
	}

	return true;
}

UIWindowManager.prototype.closeCurrentNormalWindow = function(curWin, retInfo, syncClose) {
	var wm = this;
	var lastWin = null;

	if(this.history.length < 2) {
		if(syncClose && this.history.length) {
			wm.history.remove(wm.current);
			curWin.callOnClose(retInfo);
		}

		return false;
	}

	lastWinIndex = this.history[this.history.length-2];
	lastWin = this.getFrame(lastWinIndex);

	function showLastWindow() {
		if(!lastWin.app)  {
			console.log("may be exited preview mode");
			return;
		}
		wm.showFrame(lastWinIndex);
		lastWin.callOnSwitchToFront();
		
		wm.postRedraw();
		curWin.callOnClose(retInfo);

		return;
	}
	
	wm.history.remove(wm.current);
	if(syncClose) {
		showLastWindow();
	}
	else if(curWin.isAnimationEnabled()) {
		var p = this.getPositionInScreen();
		var animation = AnimationFactory.create(curWin.getAnimationName(false), curWin.getAnimationDuration(false)); 
		var backendCanvas = UIFrames.preparseBackendCanvas(lastWin, curWin);
		animation.setScale(this.getRealScale());
		animation.prepare(p.x, p.y, this.w, this.h, backendCanvas, showLastWindow);
		animation.run();
	}
	else {
		setTimeout(showLastWindow, 10);
	}

	return;
}

UIWindowManager.prototype.isWindowOpen = function(win) {
	for(var i = 0; i < this.history.length; i++) {
		var index = this.history[i];
		var iter = this.children[index];
		for(var w = iter; w != null; w = w.popupWindow) {
			if(w === win) return true;
		}
	}

	return false;
}

UIWindowManager.prototype.shapeCanBeChild = function(shape) {
	if(shape.isUIWindow) {
		if(this.mode == Shape.MODE_EDITING) {
			var win = this.findChildByName(shape.name);
			if(win) {
				shape.name = shape.name + this.children.length;
			}
		}

		return true;
	}

	return false;
}

UIWindowManager.prototype.onChildrenChanged = function() {
}

UIWindowManager.prototype.afterChildAppended = function(shape) {
	if(this.mode !== Shape.MODE_RUNNING && !this.isUnpacking) {
		var index = this.getFrameIndex(shape);
		this.showFrame(index);
	}

	this.onChildrenChanged();

	return;
}

UIWindowManager.prototype.onChildRemoved = function(shape) {
	this.onChildrenChanged();

	return;
}

UIWindowManager.prototype.scaleForDensity = function(sizeScale, lcdDensity, recuresive) {
	if(!sizeScale || sizeScale === 1) {
		return;
	}

	for(var i = 0; i < this.children.length; i++) {
		var iter = this.children[i];

		if(!iter.lcddensity || iter.lcddensity === "all") {
			if(iter.pendingLoadChildren) {
				iter.scaleInfo = {};
				iter.scaleInfo.sizeScale = sizeScale;
				iter.scaleInfo.lcdDensity = lcdDensity;
			}
			else {
				iter.scaleForDensity(sizeScale, lcdDensity, recuresive);
			}
		}
	}

	return;
}

UIWindowManager.prototype.resize = function(w, h) {
	var x = 0;
	var y = 0;
	var fixWidth = this.screenScaleMode === "fix-width";
	var fixHeight = this.screenScaleMode === "fix-height";
	var fixResolution = this.screenScaleMode === "fix-resolution";
	var isInDevice = this.parentShape != null;

	if(this.mode === Shape.MODE_RUNNING && (fixWidth || fixHeight || fixResolution) && !isInDevice) {
		var canvas = this.view.getCanvas();

		var screenWidth = canvas.width;
		var screenHeight = canvas.height;
		var designWidth = this.designWidth;
		var designHeight = this.designHeight;
		var canvasStyleSizeSupported = true;//!(isWeiBo() || isPhoneGap());
		var sizeIsRight = (screenWidth > screenHeight && designWidth > designHeight) 
			|| (screenWidth < screenHeight && designWidth < designHeight);

		canvas.style.width = screenWidth + "px";
		canvas.style.height = screenHeight + "px";
		if(canvasStyleSizeSupported && sizeIsRight) {

			if(fixWidth) {
				var scale = designWidth/screenWidth;
				canvas.width = designWidth;
				canvas.height = screenHeight * scale;
				w = canvas.width;
				h = canvas.height;
			}
			else if(fixHeight) {
				var scale = designHeight/screenHeight;
				canvas.height = designHeight;
				canvas.width = screenWidth * scale;
				w = canvas.width;
				h = canvas.height;
			}
			else {
				var scaleW = designWidth/screenWidth;
				var scaleH = designHeight/screenHeight;
				var scale = Math.max(scaleW, scaleH);
				if(Math.abs(scaleW - scaleH) < 0.10) {
					canvas.width = designWidth;
					canvas.height = designHeight;
					
					x = 0;
					y = 0;
					w = canvas.width;
					h = canvas.height;
				}
				else {
					canvas.width = screenWidth * scale;
					canvas.height = screenHeight * scale;
					
					x = (canvas.width - designWidth)>>1; 
					y = (canvas.height - designHeight)>>1;
					w = designWidth;
					h = designHeight;
				}
			}
			var xInputScale = canvas.width/screenWidth;
			var yInputScale = canvas.height/screenHeight;
			WWindowManager.setInputScale(xInputScale, yInputScale);
		}
		else {
			canvas.width = screenWidth;
			canvas.height = screenHeight;
			WWindowManager.setInputScale(1, 1);
			w = canvas.width;
			h = canvas.height;
		}

		var vp = cantkGetViewPort();	
		this.app.onCanvasSized(canvas.width, canvas.height);

		console.log("Canvas Size: w =" + canvas.width + " h=" + canvas.height);
		console.log("ViewPort Size: w =" + vp.width + " h=" + vp.height);
		console.log("Canvas Style Size: w =" + canvas.style.width + " h=" + canvas.style.height);
	}

	this.lastWin = null;
	this.setPosition(x, y);
	this.setSizeLimit(w, h, w, h);
	UIElement.prototype.resize.call(this, w, h);

	return;
}

UIWindowManager.prototype.setDeviceConfig = function(deviceConfig) {
	var screenScaleMode = this.screenScaleMode;
	if(screenScaleMode === "fix-resolution" || screenScaleMode === "fix-width" || screenScaleMode === "fix-height") {
		this.oldConfig = this.deviceConfig;

		return;
	}

	var oldConfig = this.deviceConfig;
	
	this.oldConfig = this.deviceConfig;
	this.deviceConfig = deviceConfig;

	if(oldConfig && deviceConfig) {
		if(oldConfig.lcdDensity != deviceConfig.lcdDensity) {
			var sizeScale = this.getSizeScale(oldConfig.lcdDensity, deviceConfig.lcdDensity);
			this.scaleForDensity(sizeScale, deviceConfig.lcdDensity, true);
		}
		this.notifyDeviceConfigChanged(oldConfig, deviceConfig);
		console.log("call this.notifyDeviceConfigChanged: " + this.type);
	}

	console.log("setDeviceConfig platform:" + deviceConfig.platform);
	return;
}

UIWindowManager.prototype.getDeviceConfig = function() {
	if(this.deviceConfig) {
		return this.deviceConfig;
	}
	else {
		var device = this.getDevice();
		if(device) {
			return device.config;
		}
	}

	return null;
}

UIWindowManager.prototype.paintLoadingStatus = function(canvas, percent, text) {
	var ctx = canvas;
	var x = 0;
	var y = 0;
	var dw = 0;
	var w = this.w;
	var h = this.h;
	var barW = Math.round(this.w * 0.8);

	ctx.fillStyle = "White";
	ctx.fillRect(0, 0, w, h);

	var image = this.logoImage;
	var iw = image.width;
	var ih = image.height;
	x = (w - iw) >> 1;
	y = Math.round(h * 0.6 - ih);
	ctx.drawImage(image, x, y);

	dw = barW;
	image = this.progressBarBgImage;
	iw = image.width;
	ih = image.height;
	x = (w - barW) >> 1;
	y = h * 0.6;
	ctx.drawImage(image, 0, 0, iw, ih, x, y, dw, ih);
	
	image = this.progressBarFgImage;
	dw = Math.round(barW * percent/100);
	iw = image.width;
	ih = image.height;
	x = (w - barW) >> 1;
	ctx.drawImage(image, 0, 0, iw, ih, x, y, dw, ih);

	return;
}

UIWindowManager.prototype.paintChildren = function(canvas) {
	if(this.mode != Shape.MODE_EDITING) {
		if(this.forcePortrait && this.w > this.h) {
			var image = this.getHtmlImageByType("force-portrait-tips");	

			canvas.fillStyle = this.style.fillColor;
			canvas.fillRect(0, 0, this.w, this.h);	
			this.drawImageAt(canvas, image, UIElement.IMAGE_DISPLAY_CENTER, 0, 0, this.w, this.h);

			return;
		}
		else if(this.forceLandscape && this.w < this.h) {
			var image = this.getHtmlImageByType("force-landscape-tips");	
			
			canvas.fillStyle = this.style.fillColor;
			canvas.fillRect(0, 0, this.w, this.h);	
			this.drawImageAt(canvas, image, UIElement.IMAGE_DISPLAY_CENTER, 0, 0, this.w, this.h);

			return;
		}

		if(!this.resLoadDone) {
			var me = this;
			var percent = ResLoader.getPercent();

			if(percent < 100) {
				if(this.showLoadingProgress) {
					setTimeout(function() { me.postRedraw();}, 100);
					var loadingText = this.loadingText ? this.loadingText : webappGetText("Loading...");
					this.paintLoadingStatus(canvas, percent, loadingText);
				}
			}
			else {
				this.onResLoadDone();
			}

			return;
		}
	}

	var child = this.getCurrentFrame();
	if(child) {
		canvas.save();
		canvas.beginPath();
		child.paintSelf(canvas);
		canvas.restore();
	}

	return;
}
UIWindowManager.prototype.afterPaintChildren = function(canvas) {
	var creatingShape = this.getCreatingShape();

	if(creatingShape && creatingShape.isUIElement && this.showHignlight) {

		if(!creatingShape.isUIDevice) {
			canvas.beginPath();
			canvas.rect(0, 0, this.w, this.h);
			canvas.lineWidth = 5;
			canvas.strokeStyle = "Orange";
			canvas.stroke();
		}

		if(creatingShape.isUIWindow) {
			canvas.textBaseline = "middle";
			canvas.textAlign = "center";
			canvas.fillStyle = "Gray";
			canvas.font = "24pt Sans";
			canvas.fillText(dappGetText("Please Drag Window To Here."), this.w/2, this.h*0.2);
		}
	}

	this.showHignlight = !this.showHignlight;

	return;
}

UIWindowManager.prototype.paintSelf = function(canvas) {
	var child = this.getCurrentFrame();
	if(child) {
		if(!this.lastWin || this.lastWin !== child) {
			if(!this.parentShape && this.view) {
				this.view.clearBg(canvas, child.style.lineColor);
			}
			this.lastWin = child;
		}
	}

	UIElement.prototype.paintSelf.call(this, canvas);
}

UIWindowManager.prototype.paintSelfOnly =function(canvas) {
	this.setThisAsCurrentWindowManager();

	if(this.mode === Shape.MODE_EDITING) {
		canvas.fillStyle = "white";
		canvas.fillRect(0, 0, this.w, this.h);

		UIWindowManager.updateWindowThumbView(this.current);
	}

	return;
}

UIWindowManager.prototype.isDeviceDirectionOK = function() {
	if(this.mode === Shape.MODE_EDITING) {
		return true;
	}

	if((this.forcePortrait && this.w > this.h)
		|| (this.forceLandscape && this.w < this.h)) {
		console.log("Device Direction Incorrect.");
		return false;
	}

	return true;
}

UIWindowManager.prototype.relayout = function() {
	if(this.isDeviceDirectionOK()) {
		UIElement.prototype.relayout.call(this);
	}
	else {
		console.log("isDeviceDirectionNotOK ignore relayout");
	}

	return this;
}

UIWindowManager.prototype.relayoutChildren = function() {
	if(!this.isDeviceDirectionOK()) {
		console.log("isDeviceDirectionNotOK ignore relayout");

		return;
	}

	var curWin = this.getCurrentFrame();

	if(this.mode === Shape.MODE_EDITING) {
		for(var i = 0; i < this.children.length; i++) {
			var iter = this.children[i];
			iter.relayout();
		}
	}
	else {
		if(curWin) {
			curWin.relayout();
			
			var childWin = curWin.getPopupWindow();
			if(childWin) {
				childWin.relayout();
			}
		}
	}

	return;
}

UIWindowManager.prototype.onKeyDown= function(code) {
	var win = this.getCurrentWindow();

	return win && win.onKeyDown(code);
}

UIWindowManager.prototype.onKeyUp= function(code) {
	var win = this.getCurrentWindow();

	return win && win.onKeyUp(code);
}

UIWindowManager.prototype.setSoundEffectURLs = function(soundEffectURLs) {
	this.soundEffectURLs = soundEffectURLs;

	return this;
}

UIWindowManager.prototype.getSoundEffectURLs = function() {
	return this.soundEffectURLs;
}

UIWindowManager.prototype.getSoundEffectNames = function() {
	if(!this.soundEffectURLs) {
		return [];
	}

	var names = this.soundEffectURLs.split("\n");
	for(var i = 0; i < names.length; i++) {
		names[i] = decodeURI(basename(names[i]));
	}

	return names;
}

UIWindowManager.soundEffectEnalbe = true;
UIWindowManager.prototype.setSoundEffectsEnable = function(enable) {
	UIWindowManager.soundEffectEnalbe = enable;

	return this;
}

UIWindowManager.prototype.loadSoundEffects = function() {
	if(!this.soundEffectURLs) {
		return;
	}
	UIWindowManager.soundEffects = {};

	if(CantkRT.isNative()) {
		console.log("Native Audio supported: load native Audio")
		this.loadSoundEffectsNative();
	}
	else if(isWebAudioSupported()) {
		console.log("WebAudio supported: load Web Audio")
		this.loadSoundEffectsWebAudio();
	}
	else {
		console.log("WebAudio not supported: load HTML5 Audio")
		this.loadSoundEffectsHtml5Audio();
	}

	return this;
}

UIWindowManager.prototype.loadSoundEffectsHtml5Audio = function() {
	var urlArr = this.soundEffectURLs.split("\n");
	for(var i = 0; i < urlArr.length; i++) {
		var iter = urlArr[i];

		ResLoader.loadAudio(iter, function(audio) {
			var info = {audio:audio};
			var name = decodeURI(basename(audio.src));
			UIWindowManager.soundEffects[name] = info;
        });
	}

	return this;
}

UIWindowManager.prototype.loadSoundEffectsNative = function() {
	var urlArr = this.soundEffectURLs.split("\n");
	for(var i = 0; i < urlArr.length; i++) {
		var iter = urlArr[i];

		CantkRT.createSoundEffect(iter, function(audio) {
			var info = {audio:audio};
			var name = decodeURI(basename(audio.src));
			UIWindowManager.soundEffects[name] = info;
			console.log("loadSoundEffectsNative success.");
		}, function() {
			console.log("loadSoundEffectsNative fail.");
		});
	}

	return this;
}

UIWindowManager.prototype.loadSoundEffectsWebAudio = function() {
	var urlArr = this.soundEffectURLs.split("\n");
	for(var i = 0; i < urlArr.length; i++) {
		var iter = urlArr[i];
		var config = {src: [iter], autoplay: false, loop: false, volume: 0.8};
		var name = decodeURI(basename(iter));
		var info = {audio:new Howl(config), playing: false};

		UIWindowManager.soundEffects[name] = info;
	}

	return this;
}

UIWindowManager.prototype.stopSoundEffect = function(name) {
	for(var key in UIWindowManager.soundEffects) {
		if(name === key || !name) {
			var info = UIWindowManager.soundEffects[key];
			if(info && info.audio) {
				if(info.audio.stop) {
					info.audio.stop();
				}
				else {
					info.audio.pause();
				}
				info.playing = false;
			}
		}
	}

	return this;
}

UIWindowManager.prototype.stopAllSound = function() {
	return this.stopSoundMusic().stopSoundEffect();
}

UIWindowManager.prototype.playSoundEffect = function(name, onDone) {
	if(!UIWindowManager.soundEffectEnalbe) {
		console.log("UIWindowManager.soundEffectEnalbe disable ");
		return this;
	}

	var info = UIWindowManager.soundEffects[name];
	if(!info || !info.audio) {
		console.log("not found: " + name);
		return this;
	}

	if(onDone) {
		if(info.audio.once) {
			info.audio.once("end", onDone);
		}
		else {
			info.audio.addEventListener('ended', function (e) {
				onDone();
			});
		}
	}
	info.audio.play();

	return this;
}

//////////////////////////////////////////////////////////////////////

UIWindowManager.prototype.onPointerDownRunning = function(point, beforeChild) {
	if(this.autoPlayPending) {
		this.playSoundMusic();
		this.autoPlayPending = false;
	}

	if(!beforeChild || this.popupWindow || !this.pointerDown) {
		return;
	}

	return this.callOnPointerDownHandler(point);
}

UIWindowManager.prototype.setSoundMusicURLs = function(soundMusicURLs) {
	this.soundMusicURLs = soundMusicURLs;

	return this;
}

UIWindowManager.prototype.getSoundMusicURLs = function() {
	return this.soundMusicURLs;
}

UIWindowManager.prototype.loadSoundMusicHTML5 = function() {
	var me = this;
	var loop = this.soundMusicLoop;
	var autoPlay = this.soundMusicAutoPlay;
	var urlArr = this.soundMusicURLs.split("\n");
	
	for(var i = 0; i < urlArr.length; i++) {
		var iter = urlArr[i];
		ResLoader.loadAudio(iter, function(audio) {
			var info = {audio:audio};
			var name = decodeURI(basename(audio.src));
			
			if(loop) {	
				audio.loop = "loop";
			}
			if(autoPlay) {
				audio.play();
				autoPlay = false;
			}
			me.autoPlayPending = true;
			UIWindowManager.soundMusic[name] = info;
        });
	}

	return;
}

UIWindowManager.prototype.loadSoundMusicNative = function() {
	var me = this;
	var loop = this.soundMusicLoop;
	var autoPlay = this.soundMusicAutoPlay;
	var urlArr = this.soundMusicURLs.split("\n");
	
	for(var i = 0; i < urlArr.length; i++) {
		var iter = urlArr[i];
		CantkRT.createSoundMusic(iter, function(audio) {
			var info = {audio:audio};
			var name = decodeURI(basename(audio.src));
			if(loop) {	
				audio.loop = "loop";
			}
			if(autoPlay) {
				audio.play();
				autoPlay = false;
			}
			UIWindowManager.soundMusic[name] = info;
        });
	}

	return;
}

UIWindowManager.prototype.loadSoundMusic = function() {
	if(!this.soundMusicURLs) {
		return;
	}

	UIWindowManager.soundMusic = {};

	if(CantkRT.isNative()) {
		console.log("Native Audio supported: load native Audio")
		this.loadSoundMusicNative();
	}
	else {
		this.loadSoundMusicHTML5();
	}

	return this;
}

UIWindowManager.prototype.isSoundMusicPlaying = function(name) {
	var playing = false;
	for(var key in UIWindowManager.soundMusic) {
		if(name === key || !name) {
			var info = UIWindowManager.soundMusic[key];
			if(info && info.audio) {
				if(info.playing) {
					playing = true;
					break;
				}
			}
		}
	}

	return playing;
}

UIWindowManager.prototype.stopSoundMusic = function(name) {
	for(var key in UIWindowManager.soundMusic) {
		if(name === key || !name) {
			var info = UIWindowManager.soundMusic[key];
			if(info && info.audio) {
				info.audio.pause();
				info.playing = false;
			}
		}
	}

	return this;
}

UIWindowManager.prototype.playSoundMusic = function(name, onDone) {
	for(var key in UIWindowManager.soundMusic) {
		if(name === key || !name) {
			var info = UIWindowManager.soundMusic[key];
			if(info && info.audio) {
				if(onDone) {
					info.audio.once("end", onDone);
				}
				info.audio.play();
				info.playing = true;
				console.log("UIWindowManager.prototype.playSoundMusic");
				break;
			}
		}
	}

	return this;
}

UIWindowManager.prototype.getSoundMusicNames = function() {
	if(!this.soundMusicURLs) {
		return [];
	}

	var names = this.soundMusicURLs.split("\n");
	for(var i = 0; i < names.length; i++) {
		names[i] = basename(names[i]);
	}

	return names;
}

function UIWindowManagerCreator() {
	var args = ["ui-window-manager", "ui-window-manager", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIWindowManager();

		return g.initUIWindowManager(this.type);
	}
	
	return;
}
	
ShapeFactoryGet().addShapeCreator(new UIWindowManagerCreator());

