// ==UserScript==
// @name           Castle Age Autoplayer
// @namespace      caap
// @description    Auto player for Castle Age
// @version        140.24.1
// @dev            41
// @include        http*://apps.*facebook.com/castle_age/*
// @include        http*://*.facebook.com/common/error.html*
// @include        http*://apps.facebook.com/sorry.php*
// @include        http*://apps.facebook.com/reqs.php#confirm_46755028429_0
// @license        GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @compatability  Firefox 3.0+, Google Chrome 4+, Chromium 4+, Flock 2.0+, Opera 11+, Safari 5+
// ==/UserScript==

/*jslint white: true, browser: true, devel: true, undef: true, nomen: true, bitwise: true, plusplus: true, immed: true, regexp: true, eqeqeq: true, maxlen: 512 */
/*global window,jQuery,console,GM_xmlhttpRequest,GM_openInTab,GM_registerMenuCommand,rison,utility,$u */
/*jslint maxlen: 250 */

//////////////////////////////////
//       Globals
//////////////////////////////////

var caapVersion   = "140.24.1",
    devVersion    = "41",
    hiddenVar     = true,
    caap_timeout  = 0,
    image64       = {},
    config        = {},
    state         = {},
    css           = {},
    gm            = null,
    ss            = null,
    sort          = {},
    schedule      = {},
    general       = {},
    monster       = {},
    guild_monster = {},
    arena         = {},
    battle        = {},
    town          = {},
    spreadsheet   = {},
    gifting       = {},
    army          = {},
    caap          = {},
    $j            = {};

////////////////////////////////////////////////////////////////////
//                          image64 OBJECT
// this is the object for base64 encoded images
/////////////////////////////////////////////////////////////////////

image64 = {
    header:         "iVBORw0KGgoAAAANSUhEUgAAAK8AAAAuCAYAAABefkkIAAAACXBIWXMAAAsTAAALEwEAmpwYAAA" +
                    "AIGNIUk0AAIcbAACL/wAA/lUAAIJ8AAB9MwAA680AADo7AAAjQeoHuS0AAEBfSURBVHja7L13tC" +
                    "TXdd77O6GqOt84d+5kTMIgDDIBEARIgBQDCGZCIi3KJGXJlCVaVraCn2VRyfaTLNnSkywqS6TE8" +
                    "JgjxASCAJFzGGCAweSZO+Hm7q506oT3RzWGoABJ9Hqyn/2MWutO6HW7uvrUPufs/e3v+0qEEHjh" +
                    "eOH4X/HQP/XrH/q2F5TSPPX0Ezz5zc8QRWtpr19PPlxY50S0xa4uvASqNuBAhOCs0kkybIxvvNO" +
                    "H7IB0Zn7zlktQjYYsbOoFAgQIIVk6eYx0ZRHnAQJaCZARBIPP+8iki9QNvPeAxYdAohLaU+so01" +
                    "X6y8dRcQsdtWivXY/JCqSOyJdOQPD0Np5NcAEkSCmIZcLyqQO4YoXu5CxlllLmOUlnjOHiKaTUB" +
                    "OkRQlBfpIQg8KG+PlFfOgKIo4jxdRsxecry6cNI1SGECik1+ICzBSG4+jRBIAGZ9KjKFYKvCD6i" +
                    "1ekxvmELociZP7YfD0gR8MEjhEQIQQgOJXR9I6Qm+IBUARCEYGm2uzTHJvnqx//k772pb33vr9T" +
                    "3Usq/83csIRrOH/tnrgpruus2/5ci5ClCPO/vtkZjIYXAFDn9uaN47wio0TgFhHBAwAcJQiGwCA" +
                    "UIhRYCIUGqmNktW6BynDq2H+8FSBAoAJyzuODRQuGwSKGRUhG8Q4oAQqHiiOkN2/jAf3ofWil15" +
                    "iK99wihkErRmt4GQV41WDr6g9t2bL3+oosvXrNl44a4lUgajRZBgneBvDDsffpAev99Dx2dO7zv" +
                    "swvzR/+wMT55qCpyQSAIIfC2Iu/3EULVcf/C8d/1SHRMZUsGq0sI+TwBKQS2KM4+a8vmX203WzM" +
                    "PP/7UkWR84oM2XcI/z04cxidRWv3Pt/IeO3qwjnrvmFkzjRAJWX95FmHfe+755/zkP3vn93Q2b1" +
                    "jD3Xfdy2N7n+Dogf3EnQ75MGdqaoILLryA7/+e17d/4Sd+6JxPff6r5/zpn33wxqWFkz+opf6GQ" +
                    "CDwmCLlhezkf9zRaLRIQgNjckxVjnaXbwtHynx4/Q2vuHZm7fo1PPTgg/+UovVJm2YpPM+NGp/4" +
                    "nzNtWFg4AUBlPe1WxOKp49tX5g79wU/+1I++6vve8ir++kMf5dfe90scOzaHjlunlNJ71p618xW" +
                    "D5fmTBw8evPXmm2/b/Gd/9oErvvttb5U/92PvYd++fds/84Wvv7yzbss3CEC2ihUCxwvR+z/q8N" +
                    "4hhKLV7FIWKeFvBa+3dmJivPc91119Od1uwlmbN7z02MnF17TG137SltWzY5ykk6C1xoeA/DvSi" +
                    "v/Pgnd86iyEUFRVyf79B2ZDsfLH//aXfuHlr3vZ5fzcL7yPz3/ub4ibjXRq9qzPJr01/1UIUUXK" +
                    "39Vqdx8yaXh7pyubujnxir/64Ed/9OTpxevLvCAWXIBZFUo2ghMK5z3eBcDjnQcCLgiE9hAczjm" +
                    "wDoTHBw94nAsE+cyACbyzYD1SObwLBBfwMuC8h+AJIdSfIUCEev1wvn79mVwueI/3Hu8soc57QM" +
                    "o6s5UBvCD4b+W89Q4bCFqfyY2dtQThCaH+EcHjnIVg68QwyHqaOo93FcE7gocQQn0OIXCuIgBBh" +
                    "DPXV+e8nlGZcOY99TcRde7837B9heBIkhZJFGOq6szqGwi4yr7k4itfdEkcCTRw9UuubH7045++" +
                    "Ufnq88sn+mY0CARgZtc6hFTIEBAIhJB4Z7HOEfDPynnr++aDAuEROKQHhK/HXwVioZBCEUR9Dyp" +
                    "XlxpylEpa6/Ah1OOLw8uAlA7vPVoEhLAIrRCizuW1jjroOIJiIIvVxX/1zne9/eWvf/mLed+//w" +
                    "3+5ktfpzM2+WSrt+Zfq97E55VIgslWL1WRxg1K1V5zFq1uLz99+OkvJHFyx+3fvOt9rVbrezq93" +
                    "tNx1ERGTVHlp36k3e1eGTwVwWN9iAQBKUUQUnuB8z5ueBk3hdBaBR9kwAUfiHGhX5X5r4dgX9fu" +
                    "Tr5caO2lUMKlSw188DhcI9EWEGZ5rkcQLhCElcJUQrpYBUGzvWRL82sQrmm0Gm8U0tMdn7RCSIL" +
                    "wCCk9gRCEQDxTsIWAEASB8EKJWISQVkX+67jqVZ2xieukalUhOCmk9MIH730Cz0ySAAKJjJrCVS" +
                    "KE4INAIaOkUZXFbwdbremMT74doY3Eaz8KVgQ2hKCU0FaEEILURQgIpUKbgAIfVBQlhPAY8JvfS" +
                    "QALIeh017CyfAI5yn29V3Tbze87b9um+H3/8Xd57z9/N9decSlfuOmrNxQmv7K3qXvbmQkfAsFk" +
                    "FDZ75oxYW753fHr6+7SOSx8EQoRRMVcvNEKq0XvrvTZAXcBGQlSli4p0+Ks435qYnPkZpRMTRAg" +
                    "CiZAC78EHP1qwPEJK8ALvPVIEhFZUxjbLbPW3gI/rl165lc/ffCeuyndu237Wu9/+xu/ic1/4Ij" +
                    "fd9HWSZnKyPb32PZEeuw0Zk6+cIuufFO3O2QSTB6WF2Lj7paG7dhv9U4eWh6unf9xXxe8KHc9v3" +
                    "H1VGCyeUMNT+3/21/7PX98y0Y6x1oEIowRCoJVGIqi8H42NhyBBghKS3/ydP+Khe27//OTM+h/6" +
                    "lV9736WzU12sNQTqlSqJE6JIQgDrHVpI8tLgvAOhSOKY3/q9P+Hur9/y1fHZmXf8yi/929evWzt" +
                    "JEIJEq3pkg0PICCEkITgCYbQKQmkqkqTBf3n/X3Drl79429jUmmt+/Vd/+Z2bZ6fIM4PQ0GjGSK" +
                    "moCkPlLSGAD/VXgYCQ9XX+/p9/iFu/+pWPN9udt/7iL/3iu7dvnCHNC6SUNJMIoVQdLH6EdEiJM" +
                    "RVV5RBK0EgS/ugDH+XB+x644zsN3hACUZyggaoqEYDJzQW7L7noVVma8qWbvsiFl1zCja+6mt3n" +
                    "nTt+z72PvEmPxbdZLASPHQ7xCwMqX+FqmAiPuOZnf/bnX3Ll7rNJiwwCxEmMEhFpPmC1P8A7T9K" +
                    "IGev1SKIGpTPEKuavPvFZvvLFz1wldeLf++M//pIXX3QuWV4gAB9qdAE8CIkcbUFaaQj1xGu1m7" +
                    "z/Lz/EnfffexaAnupITj71AErKK1/7ju+e9abkc1/6GpWp7NjaDT+jW53bgvEIX+FsBiZTwVck3" +
                    "UlXDpfDwqE9JO1xps86l3a2nmNP3L4/ZH18ZbCVQUZxtma8xURbYSo32gUFjTjmvgcewjh4yeUX" +
                    "UZQGKSTgiaKIqqywWVpIJZ1SOp2d7LJ+somxEVJq4jjikcce56Yv3czKcECn1WXj+lled/2rmBy" +
                    "fhBDw3mEGKwS8Fah8ZmKM7Rsm+PLXbuOzN32FRMd1xqDkKFWog7Yyhl3n7ubd3/tWGlpQZX2ESo" +
                    "z3IVs71WPjTI/SGI6fOM1f/OmHWVia5/U3vI5dO7cQKU233SL4gAsBpSRSCGzaxztnfQjlzHiTt" +
                    "eNNiqZgfmmZD330bzh9Ym40pQU+1O9923ffyCUXnIuvKqSSmLSPNWX+35IXCiHoTmwgW14FLQh+" +
                    "4V3nn7Nt+u577kZHSfaN2+5Ur7h8d/KSKy/knnvve6PK3e8mjfhItnQKn/ZRcUyz08WWBbbIsMg" +
                    "SZ/F2SLCGVhKz/+m9/M3XbuHgoSN4qZFSIoInbiRc+5IXc/UVL6LRTOgvncRHshRSBmEtlCnClv" +
                    "QHGf/3pz7HwQNPE0cxSIkPHuscb3nTW/mua67AlAXCBoaL8wgpIgBdmoqiNIx125dt2bROHT5ym" +
                    "H1PHULGzVt0Y+zDrqpQQmCdpzu1jkTrQXAu2LLAIzl9+DGkbEJTE6uYSDVIB6c5cN+XsVifRIla" +
                    "XekTKoWt7JkBTbXmI5/4LHlocP7ZOymrlBDqbVdpTWUMAU+sW15pbVeHfVq6oqwczUaD2++4m9/" +
                    "47d/h8pdez5VXX8H02Bi33HEXTx48zvk7qD8rBCobYLSqrgwHLC5KHth7mBdf8yq2bJhBKsXHPv" +
                    "NFHnnwIX7+F36Glo7IK8PNt93NwWMnWDfZxlpH0uyMa6VMf5CytCTJioJOs8lSanng4f386I9u4" +
                    "9jcSZK4wcxkVeOgPiCVQgqBsxVaxyihWO2nLK0sk+UFrWaLrIQHHjnIT/70j7G0vIJEorQAGbO0" +
                    "OE8IASkVzpoz+d4/FLDPrLwhBHQUYX2Byc22DWvXvEUIy94nnnRTMxv+7dHDhy+55+G979y9YyM" +
                    "bN87uPDK38BqZ+T+u8gwh6zxcKkk81sNWJQpFWeYM+kNsCNx88y188KOfZP3WHdz43e+g0+lA8L" +
                    "RaCfc8+Cgf/OQXQDV52YvOp7IOKSKEhLIs6A9TsqKg1WwwMbWWOx54mJ/+iX+Ocw5jKtqtFr1Ww" +
                    "vLKKs5ZjK2ovKXMcwmgl5YWX9mI4x+ZmJl9UbOZsLy8QpQ0aevmucIVH4mkAhG8xAUBNm53pzvd" +
                    "jnA+vMg68VGtBcJZ603lPYWIpAyt3iQhhD42/FrwsizyDO1rRKPeRmP279vPkaOnsMQ88tRBdm6" +
                    "cJCtLhJBESlOWJUIGVKSkkjIxRcFw6PEBvDN88Su3MHvWbn76h9/B3iefZvuWSc4963WkxrC0vI" +
                    "JWEu8DIVikqtc0U5Qsrw649sWXsnHtNMGWxElCIiqa7TY7Nq4hER4kdBtXEyrLoD/AWYOOoo5Sk" +
                    "SuKjDQVZGVJSCoayjO5ZoqGhmwwgA6kKVhX525SSST1ShrrCB1pjClJ04yiKOsVPxS0x7pcdfFO" +
                    "9u8/QKPZZmaqS5aV9PtDpFQoLfA28J0U/M65rhBivZSyAwQhJa3xLmb51FvOO3vHtkce2cPKSv9" +
                    "Aq21PO+fFrXffz87Na7hk97k8ffBLPxwrtaC0NgSJlFKEgNMquk2qaOgDlFVFVVXcec+9/MWHP8" +
                    "4lL34Z//IHvhdMxqEjx0HGTEQxr3vZZZy1bi3NRpN+f4B1ps7vEVhjyIdDsrIAbymyVaJIs2nNB" +
                    "MP+ErbVZuP0BJkp6Q9W6kLPVrgaSREAup9nNjjjTZZVeZrRlA4B6LjZllJu8t7pQFACMoLPELSt" +
                    "cwQfegouds6vEnDKSR+EFwhs0huTJstOUpbKK6fyokRUFdbV2a5rNfjGnfdwyVUv5cihQ9x8611" +
                    "suPGV5FkOBJSOqEqD9XX1HfChKAyZtFgfaCQRcaNNemqO+x56BBE8CwtLVM4i6tqXSElssPjg6m" +
                    "JFQF7k5ENHKwqcPn0Sj6DViDHG4Aksr/aJQ0HloZtogisYpgHrHECOQBd5yXAIhTH4ymKqiuAFw" +
                    "/6AssgRMiLVDjsKNKUkglAPuhZIIShLQ572SQsL3mJKiwdWVlboD/pYB7iCyroznTIpwQWHUP/w" +
                    "ynv8wAOXNFq9n1mzbvsFzrlG8C4oFVXr153Vunj3LnGgkzA7u2mnbqi/soUhSRJWVlfYsWU9G9d" +
                    "vuLQ/zP5ca2mFlG0hRbCmmi9XV15DYC9C4KqKhcUFbv7m3azZvI13fc8bWDh+GGNKhmmGVCVLqx" +
                    "63aJkdbxKEZ2V1maqyZyafMRVpNiQ3pt4hKwfBk2cZRVZSUbG45LA+nGmsuEjjKoeuVyN0CPaWf" +
                    "DB/y5Kv/tPKSv+nGxMaUxXYSv5x1Bn7OZlEZMNlvLVBxzEmW72sKjv3VaZ6LG71riuLdIgPCCGR" +
                    "QJACISuE83jvBEJERZGBqPABoihi7shRnj54gp/48bdy2zcDX7/1Po5ddQkTLYHxIIWpA2p0Xo+" +
                    "gLAsy7zAuYArN1VdczP7Dc/zpX3yE6667mjXjbbIsJSCRUlDKiOBHaYqMESiKsmSYVhhTQ1UKsC" +
                    "bCuopYJeRZSmlzvAtkok5fpJQE76nKdCmJenFZ5AyGhqqqMKXCVQahJIPhgGE6JEiJCqruVkqJV" +
                    "qqGvpxFSkEURZRlyTCz5EVJcGWdUgjJE3v3MTd3hNXMsmv7JiZ7HUIALTVCBJytvjP8M/CkTYd/" +
                    "cHzvA+ujbtc12mN+dWn+ey++cPf1ex59mLvvvZ/e2DhKKobZEO8tq0sLXHnRuayd6jE/f+ogrcZ" +
                    "/NSupE1I6lSSu2R07FRaXsAisNczNneD0wjJXXH0t/fk5FuYXiJKIfj9DRTHSFgRA65QQAkopnH" +
                    "V12iMkpirJ0oysLCmynLLMEEJz130PkfbnWR4WnLdzBxtnpnEhEEUSo2OsqxBSBAAtvUNHHXyQ1" +
                    "aGjx9gwsY3NGzfx2OP7pq1NQ7M3U29bsaJcXcTZQuvOGBazWg5XhkgJosZBpQBkhJcWWxqsLVVD" +
                    "tMnzgmG+TL9f0Gg2eOixx6hc4Lavf4XDRw9TDPvc+cCjnLt1LaYwdHotYq1HYDvgPVmWI7QhBJi" +
                    "fz8ktvO767+Lu+x7mS1/6OseOHuW8s7fRSBqMdxOkUnhrCWGEaohAZXKGwKnTyxTWIaQk0posq4" +
                    "DAwSNzeJPjQ73arZnq0dDqGRRCCCl9WWZkQpAXhqVhRloYCI79h48xd3KR9rAklgEvYHq8SzPWh" +
                    "BCw1bd2gNLkZMNAf1hyPDdkpaUsMz7xxZuxpmBpcRUZNVk7kZFEERNjLQgBa2s05Ds4ThH8TdZb" +
                    "Ws02caND0hy+fMuGNdx+2zc5dHQua7YGJxu9iW3lYOWzcadTDPfuf9vOrZvYtXUDjz+1fzxudr7" +
                    "h4als8TQNLfEuwmBBaCpTsZj2kVGEc44DR06QZTlaa/pZThQnZJnk1Pwyg+EKOm5yztYthKpGm5" +
                    "CCqqpIs5Q0L0kLQ1YGgnc8uu8psJ7TS4v0pmZqGE5LJrottCjx5pk0EPRgWNKd3kzAfX3Pnn3/6" +
                    "oIds+1zzt7Ck08euDSK21PG5ovKCHZc8iKOH3iChYN7pfOeumnuZLC5D2oCrSqElHWjQAZ8cPiq" +
                    "Dp6yzKmKEpU0MFXFwaOLbDxrKydWCsZmzuIs2+SJpw6wfctG4kTgPORZBtYihUJJQWlyMAUhCJS" +
                    "CbhQzEyvWvvoqvn5Xj0efeAIRN7n6op2URYEfAfs60jSaTXQSUeYlurK0Wwm9SCFQRJEiSRQImB" +
                    "rvImyEH21VripJjSd40DICKSgKg7IVpnKMt2uoTgjJ1HiXbNCn3W7SjCQuBFxlGJo6r60JR/WeW" +
                    "RYlqbVYa5kc66KloNnq8C/e9TZOnDjB6X7GxjUTCFfgnScbZqNmjuU763FJhFb0JtYSN9r0Vxcv" +
                    "3rhu7Q395QVOLy4xsWbDRxrt1leFVO/vdnq/76X4cjZc6e05cPj63VtmmZmaOGsxK9/caLd/48g" +
                    "DDyKJWXf2i4gIBAJlaegkCiUllcmY6M6SKJBagK+I4pjJbkJ/kHL3/QfZtXs3vU4b40pQAgiYqi" +
                    "JNPdZbxjttIuEQWnLj9ddTpKvMDwqmx9uIyuC9JU9TtFIYbwgj7Ezf8cg+9EQHb8pvHD9x9JZ7H" +
                    "93/ugt3rOO8C869aM+eff+60Rv/+RAsSaPJ7he/mrvmj1spZRBgpRABnVB5X+eaPlykVPWrHvHX" +
                    "SaP9UV/kSAlFVhJMTiOBvQf2YQPccO2lHD96hMnJSfZ3Yr745ds5fuIk29d1sFmgrMo631F19Wz" +
                    "yAu8zvBPISCBCShrAVYYLtq1jYqzNHXfex7bZCSbaCQ5fb1Pe0W61XKPVWq2sITcFla+7VkqAij" +
                    "RVniMkpIM+vhzU3TcCUtZ/B+/QkUJLJcsyRxQlxnmqIqfMMqSSDFdXWV1dxjtHpRyhptPVoH3wO" +
                    "FfVW2YIVGVJVpVUtsJXFSYfIoTgxNxRjh45zPjUNPnKPJWtasB/BD15585MgL/vOP+Sy1nq9ylM" +
                    "hXCOSPDmzbPTM/v3PYnUzVPdsfHf8CJsqorct8a7obIFQobfPnj46LWbpjrNzeummd+z/y0h0h9" +
                    "O1p911OQpwRmUSghCkpuCVuKYmprgqX37WTfWpBN5HJLBMEc3DVQKYTOEVkyOT5L1l3GVG42pxJ" +
                    "iSLAdnPcZY8myIUpJTJ4+xtHCKZnuMlAxrHEKOmHpa4aw9QzbSUbUCFQh86Zvhdx9+9OFrE5F3r" +
                    "ti9GWvtj+0/MHcIxB+ayoTZyVkm1521mqd9IwW5wwQdj4OxuqrMq7ds2fDrk9NjFz/8wINNIeQn" +
                    "kMEFAWWZY/McU5bseeowuy64kuVTxzg2N0eWZfR0YKzX5vF9B1nT2470gbwydWdlVICVxmBtgXc" +
                    "BMzTEWpPEDSoXyMuUqaatE3mZUBQ5zjuc81TW4hVBKOHK0uBsVkNyI0gpsgopIWnElNbg8gwf6t" +
                    "VUSEYBA1EUI5USpjR4m2Kdx0pJGKUY1lq8rSEyh8daS+UckY4IwRKcR0oFUmBKQ/BDXACv3KipI" +
                    "vHe4fGUhUFJjw2esqqItSKEgHPuO0IbfuDtb+KvvnwzD+8/RDLMZjvd5pusyThxap5Gu/s5CE/m" +
                    "w+VztUqEs2kpbE4ziW4ZDMovHZ1bfPP0WEy3FV1qXP7iqTW7jq6uFMi2JhQ5QQiq0lD4kp2bNnL" +
                    "Xo09yx0OPc/H29Ux22/WCYT1BB4psQKgMaTok1QrrLEpIEFBZS5lVWO+IbIxzvp7woz9tVWFlPY" +
                    "ZFURBHMVopXGWRYZTzxvG3KIpStb5cLqz+0p13PvC+s3eu7+7etr4ZRxt/Z9/+A9cd2HPvH2Vpe" +
                    "vOgvyyUECWEKARmhZaXtLR+w+ZNm9525aW7pu765h0UZSXiJMKPGLFFWRDKgsMnTpAVgp0bplmY" +
                    "P4KzVb0NJ4H1Mz2e2DfH4XWTzI5pKutrJlpNCqWoDBQpsdLs2XeAkyeX2Tg7SbOZYBwcOXSY9We" +
                    "dx9R4k7njJ0h0ow7G4AkiCBdQVVniqmLE2RVIJShMoMhThOyRrvQRrsSP4ByEILi6zZk0YhojZM" +
                    "IUQ4IHIwJpPsS4Bk/te5qTp+bodHtQlSwsr7LhrO2sm2hTliU2OFD1Z+bW4EwOXuK0ocwznIV9T" +
                    "x/g5NxxOt0VhCs4vbjC2o1b2by2hy2LGnP9DnBe6x3BOHw2oDTFNds3rT1/bu4oxjOY7o5/qFhe" +
                    "wfsCms2AoyqLCBnpSsjsL48vLF0/lkw0Jrut+PDC8js67bFPC2OquNmhrAx4j7UVw3xILCSX797" +
                    "FU0dPcveeg0y3BQ2tSdo99g+WOXZqHtGbYnJinCKbx9kKF0BIjasqSltQOkusCrJsiKssjz7+JK" +
                    "sLJ4lbHWSoWFpcYnbLTravn6AyBc55vJQeQBOpb2sn4vxvS53M7dl37I9OLJzublk/G19x8c63L" +
                    "6fFaxdPPP6VSHniZk9VJrp8TXv6Y2vXzZy7dXZqimrA17/0OQ4cW6bRmJpTUlgbKgVgXcVgeYXj" +
                    "S5ZNZ+8iHS4zHA4QQuNxZFlOuxkxvW6WpdTSjgXCFxAcUtSroKsMviyxlKxdu4725GbyPGMxTbH" +
                    "Bsf3iq7jivG2cOvY0VWEIuv5cQiCSOmgpK+MsmHI0KQSxhYV+RtyepNseZyktacuSOj2VSEE90/" +
                    "HESUwcxxhb4YuSEASDNKPZGmes0+PQyT7WN0hXK6rS0uyuY/3sLIP5o7ggcM6NAq9ePYqiJADpq" +
                    "iFKusz0uhw4tkxwMWm/wFuLbEyzedMmssVjNRHGu1E38B9uU/gsE35xcff0ujU/t36qHX310ZPE" +
                    "rd7tOorucThAGEcIKEKj1QQZUVX2kf4gPbaUNnbMTrVZHhbXl7b8gWa38ZGgZF8mSXB5gbMOYw3" +
                    "OOZQquHj7OnK/kcXVAcPBKqbyqO4Ml559EWetX4tZXWQhrSe8QCBDwAVHYeqxXq4qGp0eO2c3kV" +
                    "YGOTZNkIqysvQ2jHP2ju3ki3ME7wneI1RdsunFJ/Z+ez/cGKa37PwIKjlyaqn4VwtL+97SjHQyO" +
                    "T7Vm52auLHZHkfJGB9UWwR/Tbp8jDv3PcjJ00tUoYFUzSWB+QQyRgQvJCGqihIXKnafs4lWs0l/" +
                    "YY6yLFBSUw4LnK3oNJpcc+EmhFQU+YB0pcBZD3ghQJdFTpUOAIWWgnWtJslkG+QEURSBs+x//L6" +
                    "6OaB0ve3YqmarBQQhdKqywGVDgpegBCWeJFZcvGszcRxhypLBIK9RjlFa4aoK7zxSKHzw0uQF5b" +
                    "A/4uFIzt+2llazQQiToy09EKREAEunjlDmWc1Acw6tJCCkyXN8OsCHenXftX2WdqsJYdTGd6HOc" +
                    "0VgcPowaZ5CCDhvv6OV13hzmfPmx+K48bbpbjfZ9+RjBKJCwu2DhcVcSoH3QXlvtJI9j/RUZpWq" +
                    "KM9Fqw0n5lcI2RKxajaKUvxOFfx7lRl8XzDFY0KJOM8y8uFSjdtLYGEerTXj7R5rZiaIkgiJxBZ" +
                    "L7Lt/H6WzaKkpqxKlEoSQOktTisEiNgSkkqwf75E0FIIONR9HEo3y+5OHn6TIM7SUGFMg4m6d89" +
                    "o8f05rMQRHubJyR3dq6g5k4xVl6d5+YrF/3eHjJ9aAmggugLCEoEFqJ3SyqJKJFS3crSA/UFbmN" +
                    "oUg7kx6F8TTd9z94FlVtkJgH95bpIpHnxNqAoZSNSGjpnQhRjffR+1Goz0WPJy49/49lOkiUkaj" +
                    "XeKZzX3EfxQSpWpZSv2dRzc5apC0xpeFVK377n+UcrjEiPkymq3PfC4IJZBKo5Qc0SgVwluI2zS" +
                    "7nQhkdf9Dj1CuLoHWIOpCIhDq9GJEzaypi3VgSq3AB0TUQre6WuuoePDhPRTDRYQaSX68G3XaxN" +
                    "+Cwmo6v9S6porGLVQSt/6h4J2eGPeJVlWRD/ft3fuUqky+MWq0v45U30R6ZZ3zPshHdPA/7Sq/N" +
                    "8+WKQcLtMZnyfPB3cOB2+CLcqcgJ2p1EhXHTed91er2IMijT+7bj0mX62pEylEjCZw/WjNLfU1j" +
                    "RNQ4NyMJkWy0aI03E62jI/v2H6BYXSRI6vGXo5b+KGmTKIQQ9SKiFUgFvgIVMzW9pm4P/22ZiOA" +
                    "Z7qsbEdq4GSlu1o1kprtm3eRgceliAm0pVelx41JFi77icW+yZaLoSF5ZTFWi0SSttofwfS53b1" +
                    "ATU9ux5SaExAeE8xVSaF/rkwT+TKYpQAYPQsVRZHRn7PHgq5/zqftqMrGjV5nBbiXECDMSQYiaV" +
                    "CpQ7szl13BqEAKllFyMosaTcdL6haGXt3Rnpy6uXNkh4IMInqAQoobOlZL+maaEEKN5IBFCiEqo" +
                    "5J44ad0shNjXmd54YTUctHSkg9RSeBd8qCeDDN4LUznpsFIgpfPWeuu8EsIgwmM6Tu6qQni02Rw" +
                    "7x1qznuCtrEmxoubFinBmBvpQExMFQQihhQhWEG7/h4K33Wo+lMTRD1uTic7slrHpdneLLctl4d" +
                    "zx063EmpDTPrl4WArxx8FX9I8fpzIFjc7El7Wzt3Qn10yURbE7H6yGqNHynV537/LK6lEdNdFR/" +
                    "CvOVp9p9CYuI9gNlcmdqLVy9V4koNFq15RqCd556UIQUgihhRLpYOFjUqnH43bnsUa39yJTmU1K" +
                    "CmetJUkaAilCqEdD2LL0SmrhKhOiRAsZx75Mh6fjZutrAOLic895TvBOb9lOv79Kd2oSoSVFUaG" +
                    "aMetmz+bkkf1UZUbQLbwdkiiFEF2qsk+IG5SmojIlWjfp9GaQAoLJiJodqHKIapGlKQbEjRa2KE" +
                    "Y80+rMDK0XTUXc6qCaLYK3hDwnafbI+qdH/HFxZmWqf198GymlzhUEUdKqK9WoSZYP6Yx1cZUF5" +
                    "0BCGBWEUtTbF0JisgGEgBrNAK0jkBFx0sRWJUmnxfD0HIlOEEpQVQ7daqN0jPeWyjicr1BRA2st" +
                    "/cWTxEmXEEqiRgdrCpRuUJYpOIcaYZ/gz3Sg6ukXzhDrhQwIpZAIPvnB978gFwGkqyq+/cfW+WJ" +
                    "VopttvHffKuYQaBXTXnv22VFj/JUzO69u8J3Ke0INcBPCGZGfH239f997/t7/f2cf/NzreNb2/q" +
                    "1/e4IP/+BnBF9zbp85c3hWsfvt5/3b5/J//3W9cPy3y4C6M+uf8+Km3VeiGk3WbNzKob33cOTJR" +
                    "0gSfWbQIyXeG7eSd5s8fSNw2wvD+HcfebYo8mJJ5XbF9VozL0TsP2bwvuxdP/GclUlpPdIqObZf" +
                    "eA3BC+ZPHgTvCcnYxk2za173smuuGv/DP/vA9/99wXvLZ/7w/xeD9I73/NRzXksz85Jcue8OIeR" +
                    "lkTtjToUo0iRxLKTWZINcW+eORLF4OFGdRxvtiWEI306s+eJH/uiFCPx/E7zPAxHirP029GHXZS" +
                    "9j5vQOlo8dpjL5K158+UU73nj9tXzyU5959UrUPNcOlp74306hG/zWbGX53Y1Wp/PGN9wQn7NzG" +
                    "3OnToev33qnmzt+Qm/YvJ6zz95unXXFI488/tDK0uJ/bvY6n3wh5P4Rc16eyc2e/fOsUK4ZURVj" +
                    "07OsppXotjtvvfrFl9HScMnFF2y0Vf6m/x0Hrttu/PXBuz6169Ajt/3IICuGr7z2xTjrs4duvem" +
                    "JxSOPP3TwqT0H7rz1ln3n7NrR/I+/8rPXXHjpRR88tufen3oh5P4xg/cfaNWcWWmco8yHF55z7q" +
                    "5rDh89zvziCte+5AriSL4p7v1P6krx3/m45sYfX5ject7XDh04sDRIhywtLkUXvOyGC5PxDV/Qn" +
                    "TW3HNv32Bv+5E/+/Pa8MPzMe3+wdel1r/vFR27645e/EHb/SGnDf/jhG7/thXf/zH+uo1oqVpdP" +
                    "+nQwXwPRSCKl33TBrm1Tf/iHf8ab3vwWXnfdlWxYO3v58dOL1zW37fxU7i0NIWlXhqQ/4A3f/6M" +
                    "IpViem/+9S6647AfGOmPeOiuEHBkWeE8QZ8AgpJAiBB9CCCgd88gjj3H6xNwbpmcm33/xpZdtdi" +
                    "N5ghAi4Gtjg1pn9cw8EyIEF6QUZHmlHrj//ptMkX/svAvO+/MNGzd5UxohpRxBAR6oMdUQ/AgsC" +
                    "xB8iHTC/kOH9NEjR//61s/95Xs+9Me/fWZ8rv+eH4KlZbwz4DPaEzPWemfSQU4IgQ/83r/n2te+" +
                    "QygVNy9/7b/cv7x46Pc/d9OXr/ypH/nB5LWvum78gVtv+qFHv/D+rwO85NUn3rF+47r/et7uC3R" +
                    "VGiGkCAIRQvB150OO/B5qpjQhuKCkZmmlrx9+6OE/wLtjF1128b+fmpx2VWWErEnaocapa0168D" +
                    "X6GoIP4NE64Ym9e9Xxw0fe3JsY+7UXXf6i3cETgghCIPzIA+PMuIoRgBmCC0IITOXkfffdf0+Zp" +
                    "r+989ydHz1r67ZQX7sMghDCs4wv/va1RzrhyLHj+skn9v54EqnLLrvyinc1Gk3vvRNCiprMUisQ" +
                    "Rs0aUd+X4MLhg3vve0b6LpP4P3zk93/rs/rvRqk8rdY4vrLU5Jp0bN3M1FvwnoP793P73fdy/bU" +
                    "v4vLLLlCHP/2V1yqlPmWO7yMAzXaHEDfOYK7OFsl73/29zZ2b1lJWBq0VlXO1LATwoZaIR6omtV" +
                    "fWoZXix37+V9n32HFx6WUXd3/1Z97TKnKDlAHnfG3IpiKsNzgXiLRGCUXlKlpJg/se3svdt9/Sz" +
                    "Por6o03XN980ytfTJrmIDxaRzjnGWY5BOh2mgghqawheEG33ebXf/dPOPjU49nfHpcydGqYS7YR" +
                    "KoBdghBEXuQYZ0d4TA2nHT36FL12cs/BQ0dWl5dXZiYnxkJ3YubclUOsQ3Ai7S+q8y94de+Xf/I" +
                    "HRZYWVM4Qx0mtBCkNla2I4qgex9F97bU7fO4rt3LXbTc3pJD6+//JjY0rLtxRfzc8fgQZK6kwlU" +
                    "FqOerc1X4Ssdb861/+TR5/8C65Y9f29r/7yX/RCtYgR04ARWme1cEUSC1JVIRxFZGMePrwMe676" +
                    "/b2YOWkeOXL39N611tfRX+QIgjESc0Os9bivB/RSDUheKz19Lptfu9PP8z9d9wcNdZtavzUj7y7" +
                    "uXasRVYUJElSG6I4jw8OrSIQYK0lAIOBefmzpO+Tz1+wPQu31EmDWHcosgyCePV552y/eM/jj6M" +
                    "azf0HDh7qP/rkwUsu2X02n73pq68LQe4YW7vlabO6UDulfHvjo+wPBux5apXb7nqQQ0dOsHnjLJ" +
                    "dddC69bov55T7tOOauBx5lYbnPNZdfxLbN6yiyLCgpbVU5s7TU5+SpE3z4019mds0kcRxx4tQig" +
                    "zRjy4ZZBIGTCyu89YZr2bh2hlMn5wjWeymkSQcpS4vLrA5WiSPJI3sP8dBjT5NoxVJ/QLPZ4Jor" +
                    "LmLnWevIi4p0kNBfXiQEMXzOuLh8xNON8UESiAjek2bZtwpdjxBSysHyKXwubKexoRqkQ4qsCN6" +
                    "5GGhTU5VNVRi7tNSPllcW2HfwGPc+/ATDQcY5O8+i12uza/sW2o2kdpIJgbw1YPH0SUTASSnM6u" +
                    "qA+VPzDLLhmXJFK8nHPvs1tmzZyBWXnIOz7ownipKSdDBASWmDD+bkqVPcctudPLp3P0kSc8Gur" +
                    "Vyyeycrgwzn4eixOe55+Almpie54RVXsbi4jLfOSSFNlmasrqxy5PgcDz5xgCf3H2NqvEuv02Jx" +
                    "uc94r8vc6SWuveJ8tm9ZRzbss7y4iJTKETDLy6uUg2XufWgPj+w9gBCCdTOTrAxSnHe8/ruuYWa" +
                    "qR2ks7Wbz2dL36nlzXin1yM2x7vvrlsbQV0kk3t7rtnn44YdDkjR/dbC0+P7b7rqfiU6HbVs2rs" +
                    "+y5ddVRU69X9XWSmGEXkipq2GWsmaiTbfb5HOf/wrdVpO1kz2yYUY2LJme7KKkoD8YsHXTWvKio" +
                    "LZCTWzA+6JIOXT4GN5aLr1gF5ect5P7H3qUx/Y+zQXn7uRFF+6C4Nl/8AhFkVOaAq0VUkXG2JIs" +
                    "G2BtxSe+cAsf+Mhnuejcbbzm5Zfz4ssuZOvGtfz2H3yQW+94AO8saZbivSWSz+OMWPSh6OPKVYQ" +
                    "vkMLivQ95ltXk8Tp6ZUCoVqsBcPbU1MSErwxHjh/3g6UTK8AigFCRcd75LBtQFAXbNs0wN3eKO+" +
                    "56gLO3bqDbbpGlOcMsJcsysjwnyzKqyhApHaTUVWFyhtmQNMvI8gxbluw/dIyPffpLPHXgGFVpS" +
                    "NOsfn+WU6TZCKtPrPfBOVdx4XlbOXbsOJ//wlcZ63bQSjEYZEghiGPNY3ue4oJdZ9FpJqRpipIC" +
                    "reLKWstgsEqiBVvWr+Fr37iX1UHKZbu3smX9NBecs5mxTszj+w7VGsQsw7oKpbRXQlRZNoTg2LV" +
                    "9I9+8/V6OHZ/jqsvO56JztnHfA3v4N7/2f/HU/mNURUl/mNIfDp+RvtvnXXmXF46f32i239TqTq" +
                    "7xwemk0fK9iXWNLbMTL03iiKjZrcZajR/03k8uLq3QT4dctHsXTz19+N/oKHqpbDZjpFBSimBN+" +
                    "VeBcB9AkRcMVoc0I02r1aTZ0AzTAelwSFnk9PsD4lgzOdYjz1OyrKDOJmQIzjMcDlESrrvqIhpa" +
                    "oLWgmSTIyhNHkkYiufbKC8nynP5wSF7kCKkQCCpjKMuShx7dy4c/dhM/8M43s2n9FKsrK+TZkAv" +
                    "O2ca+A2fz/g98gv/jx/8Z69ZO4ZxHPtv/9VlQIohahk2g9HVnbphmVCOTOuucjqEpEDu11j978X" +
                    "lnt04sLIU77ry7GJx48p7mmu3LU9suJU+HeFuRpUOyYYrWina7wdhEByU86WCAVpLg5Jl1RnhLW" +
                    "VUIqUGEYIqiDtw0rb3Ymg2+fsf9VJVlzxNPsvySC850NIUQyJEXA6r2vR0OB0RK8n03Xs9/+J2/" +
                    "4Mu33sXG2ddSZClSCe55YA9veu3L2Dg7xWp/laLIa5KMlKGqSrJhRn84QHhLs9UgiRRaBCIJkRR" +
                    "cev5WTs2v0F8dkCQRtrLEcQeEJMtzBsJgraPVadFpt2jHmolOk9e/6qX8wZ98mK/eejdve8N1CG" +
                    "ufLX0Pzxu8w1MHx4tm91KTD7Yh0QREZcy2nVftboViyGuuuypuNBsvzbKMqjQcOXyEdVM9pqbGZ" +
                    "1aHwxcJKU8LaAQQ0oVJCA0hVFzmhmGakudFnUMXOUWWUxQFVWUoi4KqrP8eDlOKoiAEG9AqDgHV" +
                    "7w9pNSJCEKwOhiSxrk3zgifPcqoyEEcSrZr0+6uURTnyjFZJZRxpOuRr37yfZqvB9k1rWVpaxlm" +
                    "LMYZ+v8/5OzbxhS/dyi13PMB33/BSrDXfYik9u/Hyxb/i2hv+6fqk2fwVqVRSmbLnnJ9NhwOiSO" +
                    "nrXv3muUbSqRSl7nYaN19+6aUbms2Yj33mb8Rj93yjOb3jxTs6M1v/wAvxJZHnifNBDIcZw7wWW" +
                    "7qqwvlAmmUYY7DGUCDxIy4rwWKKAlQQoJKyrMiGfbK8QinBqflFTp9a5A03XMdNX7qNJ/YdYsfW" +
                    "9ZRlrZiWUtRaOCEjkDpLc0wxZGaqx2tecRWf+cItnHf2ZjatXcNDjz5FfzjkwrMvZ2FxmSSJ6uA" +
                    "FhFCJqxz9dEia5xhTT9yqMhR5vTusrg6oKsO66R79QZ+WbVA5g0oaSkgdF3lB6gI21Du1s5ZBlp" +
                    "IVGaY0tfOODKTDFKH1s6Xv8nmDV0XRnc7k9y2dOKBmtp1fVUW5MdJ8LR8sb/3rT36m9jrojFHmQ" +
                    "4MUfufZ5zTe/KqrmZ0eZ2l19WtS8LNlf1CKKHbtsZ5TSrlBP5dlOaQ/sOR5DlIwf+o0CY5+VpBb" +
                    "AS7n1OnTlJVlOBhSlmXNo5VK+ODEMB1QpEMGwyFFURIrSWlKKgfH5+ZqupyU9DptOs0mZVbUxm9" +
                    "KSWsLFhYWOXDoOGO9NieOHasFks6zPKjAluRFTiNJOHRsjuXllRGXWDzHCfu6N70ToYStsuGJqN" +
                    "nSWicTPnibphlaCbtm7bqpvDCxjiNm1q7lyLFT3PKNb7ojj91xpDGx8c6JrReteFP2XJ4HKZX03" +
                    "onBcEA2HLKYZ/QHQ5yxHD58lP7QkGYZGofSik6nTbCWoixqx3CENGXGcCgZpDllmnH3o/toNSQb" +
                    "Z7qoSHPr3Q+SSIeII1pJUjP4rEdqKULwIk0HmCJlfj5n67pxZmYm+dQXv8H1L30Rd9zzGC+5dBf" +
                    "Hjh8naTToNJu1ilsKpJKytIbhcEiapiwsLkOA+flFHn18H/OrGQeOz1OVBefumKURN/HWYo3FmY" +
                    "zQjEWRp6gqkBUF3lakwyEHDxxgaTXjK7c9yOR4j3WTXeYXF+i028+WvovnDd7gnBdSl53JjeAVZ" +
                    "Z7uOP/cbbMHD+7HCV022+2/TMbXvFUkjT/UUeOmU8v9j59YXJrduXkdT+w/fE1zbKJpiv7iwuHH" +
                    "YMs5xHECSviiKEmHjiIvEQiMkBip8EJhvcM4cChclZNlKWVRjrwPRPD4kKUpeTqkMA6L+hbzSgS" +
                    "MD6ggCU5Q5gV4V6uNkQglfGUMg8GAIisY77WphCIAVjq8qDDOI3WMijVZVrDa79dCP/Fc9swtn/" +
                    "kg173hnaeL4covGmtod8c3EOJX5Gk6fmp+0Txx3833dyc3TAul9L57vnibGfYLm68+DHw5mdxyp" +
                    "CxqCZAUIJT4J9bVu0KWDqmcqL10BTip8EJinQcl8U5Q1IpFTGlqPrSUvjQjE5SyYiUzzM0v84pr" +
                    "LqWVxGzbup69Tx3h4t27mOxJcp8iAiMtnAoeH9I0xRRD8tKDjnnNdVfw8c/fwie/eBsvuux81s5" +
                    "MMzQOQcnQO4oR/1tI6U1lSIcDsjzHBOqaJTUcPtVnmJecWlxl3ZoJbBUoXEqwhqoyte+CJBRFTh" +
                    "AGYwNCaRZWBnz59kd57ImDnHvONm68/mp8EGRZiZTy2dL35w/e5tgUSdIganQxlSGK1Vsnuknzr" +
                    "seO0Z6Yvqk3NvWbpcmv6/Wmj1vhbs/T1T/au//wv7tw+wamxro7Bmn+Kh/48/7KEdJ0AYB1O19G" +
                    "WZakIicr6gJeBUPiK8pg0K4kDjGRcLUV0nBAaSzWe5RUiEBdcAxTkAEtFHqECYngiXyGFJqAI8s" +
                    "CttJkRQFSoKSitJYiy2g0Y0pjkL6eQMI7pM9QQeMdBOdItMTk2ciN8rnHdd/zozV+IiWOgHMlhJ" +
                    "bMsozgfPzYE09ed/Urb/zjVm/aLB178l/afJVkbD0T570CqRVCt2qvW2/OPG8hzVLSYUocK+RIg" +
                    "Bh5g/I52ocaNgqePA84qylNbYulhcaUhmxQ4YPn6LETeGtZmF/AWUcSKcrKMHf8GJOtTaS5HVmJ" +
                    "1kJIGQR5nlMM03oslWLdRMLWzWs5cPgU29b1wJbE2NG4Ksq6KEcpRXCOdJiSlznCepwPTI83OW/" +
                    "TOCcWVtg6s56icjiTYazHxhprbG1QIxRFXlD5gkCdEk1NdXnJRds5OneauROnsMU2klhhCkcu/L" +
                    "Ol7/55g3fbzl0sLC9TWYO1+a6ZqYnXrC4uMsxM6E1P/pF15aq3RVN1Ok4ricn8B+ZOzL9n68zYu" +
                    "vXTPfnEwbk3xu3eR3u7rsl0JJFKoZ3UxpSkrs7hpJYM+yn9doNhXpCVlv5AMRgOCcHXM7msCN4H" +
                    "qZQKAZlnKdnIdd4DkZZ4V5tQDwcpElkT2oPAJhpT1NaZSkbaVoaykqyZ7HLk+AIrKyvEKqJyjjT" +
                    "NaSeapX5GWVrWTHUpypLKWIQUzy3YtMInbZqdkiipsWznHXmWUTl7pqYTKg7rLn4jZvk0nemzhF" +
                    "NVw4eQByeQUY0VK2N08EHkWUqeZxgjqUpD8I7BYMgwK5DBo5Ss/RKspdduYsoSKYQQUumqNAyFp" +
                    "TKW/Yfn2DQ7QTZMMc4y3m2yZnqMR548zOaZcYIE4cO3ilGBzPOMIqsfu+ChrhsERFrV6Yn3uFD3" +
                    "kWyiyfKihrmljpy1ZFlKUeZUpsZHTVmyOuzTTzOme21aGlZXB4QAzWaEcQYplZRCqrIsEFXtqBO" +
                    "8w1mHwnPVhVv5/C0P89XbH+baK3bhbM1rfpb0PTwvVPbOG2+gOzVBXyoqU1090WltPXb0KFEc3x" +
                    "spdVveX2p4TyNUVemNpZG09hfGfurY6WUmuk2U5GWxjnZ3Qo+WmGC8uQYdRZjSMEyHSBxJFLOwN" +
                    "KAqC/K8xBQlrqxN8JqRpMxzijwjBFd7v0rI8pw8zyiKAlMUtbFI3WWjLErKIscUJaYoKPK81sgp" +
                    "QdLQWOvIhilbN0xinefA4dN4azBFjikN3hiePnyCdjNiy5oxBoM+3lWo5ynYrPUEoWl3eyRxhJK" +
                    "1+fEwTfEjnFegAtL5eGwtU9uvIPgKlw09pvg2Lm+S1HMjyzLyPMcUxci1PVCZelxMWRJcxYn5ZY" +
                    "4eX6h9gE2BjBRJoilsRVXkHDo+j5aCrbMTrJ1oMtNrMt1rcPamNcwvDDh+erE2tytzgndESYSSi" +
                    "jwvyL5tXEvs6HsUuaEs6+uqxzXDmBwtIWnUjZ4sq4twU5Z1k6SqMEVBVZYYU+JdycHjSyyvDjB5" +
                    "jq8qdKSIY01RGLL8meKc0Uo+pB0rdp+9gX2HT7Bn3zGCK+trzLJnpO/PzypzzkKeUy2c7E51u2/" +
                    "TGOaXlmhMbvi0s27oiqIn4ybWGm+sRKoYKD99amH5+7uz462JTnNyYVi+bWpd6x5rAiiBEgmlNZ" +
                    "giRQrBtk2T7D9yislejFa1ifKTR1LyrGTr7BiDNMVWtjYpThK0iiiK+gaPJCf4PGDMqDJPa5gpj" +
                    "Jbl2EmKojZuTpJmvTUPc7oNycXnrOPx/XNEWjDWjjFlweOHhhw9scil52wAbxhkNXwDwj6HnzuQ" +
                    "xNJB259JK1wIoSjyMzcd4YMQWvh8hTwsM2Kvl3/7XI1mEyUhzzPyLKPUimFekBeW00urmKrCeYt" +
                    "Zsjx5eJ7zt86Q50OKqiJSikazQXAVK/mQPfuPs3ntOHk2xHhqLzVracQC7xwPP3WMK8/bhJCByl" +
                    "mSJCGKNWWRf2tcPRgjGBYlprJk2QARGmceJxBbQV6Utb9yozFKZTJKYyiMx3ro54bF5WFtuCcCC" +
                    "33DUr9gqjtOlqWYqiKOIhpJgq0KyizDWiiNJS1K+mlte7ppps1wOMm9jxxC4dl+1uyzpe/PH7yV" +
                    "C7OuMpdq5961a9vG1yydOIonWVTwDVsVSC1sPXMbtNoNqsKQV4nPjfODrGCm1yAz9j2F8QbEJwj" +
                    "uuBo9r8xXjiBg16YJWg3FwWOLNJsx1nq0luzcPFY/48E6rKvbglLVRh3e1XZHMkgq51lazZmd7i" +
                    "GAxdWUyV6ClBCCpHLyjJGHeMZeyNUKkc1ru7QSzYmFVRb7CmdrS/orzltPq5nULjMCfG0r/5y0N" +
                    "1KesWaB+JaSoiFD6BhTEGqrHYRUhTdFKNJTiGCJ22uJogZBwLNng1S1w7uv6u/bH2b0WjGtJGJ+" +
                    "eYAQgkFmKI1lutekldRycG8tSFnnzAEWlob0WjGVc6xmOYnWSCBWkvlBxtlbZwA4tTxguhufgcz" +
                    "kKP99Zly99yz2Db1mTHvDJMurOUpCpOresdESX9UuPkrXwkucpSgrFvoV22ZbKAUnl3N8EORLOX" +
                    "llmZ2IwTuMF89I15Gq5j6UpmJxpWDLunGkEpxc7DPeiVFCct62aZJIs7Casikvni19f36oLIq4m" +
                    "OB+Syt9zqMPP8RwZRnVnLwzHw7npXOIWlN4MDh/umLIcHiaEKKLMq06jz51GlukRK1ez6rGL4hQ" +
                    "taX3n6fVax45dJBi+SRhNGuUFMQ+UKxalJR4ITk0nB89w0BgvcEaLeN2ovLhoPXEE3OU2QAxcqm" +
                    "RIhCPtLvL84Gl099qIigpGAxzlOxqpUR8Ym4Ot3oCP1ISKSGIAJO70cPtJMcOL9Z2/KJ+/FY2sE" +
                    "jZeM74TDRzdE3h2SqkuEqjXtZK5JSpKrRw4lU3fPe9zfa4dyZ/ZOXYntooTh1Gxg2i5jjt9btg9" +
                    "BgDKUTcX13WT5xcpDLlqMAUaAFu+K2HqSgJwQueenoBJQXL/Ryte0rhk6OHD2FWT9JUCtvvc2T1" +
                    "GbOWOj2RQtAYjflgcZWV04Yql0StriryvPXk3qfIh6tnxlWIgEagpWC47BksfWtctRQM0xwlOko" +
                    "pGc2fPs384ATW+1F9UROB8meVuhJYHgqWTgoknn7fEDfHlXeu+fTT+8lXTiO0JEESXGDp5BKLo2" +
                    "VBCEEiaxTp1Lx+RvoeRNxNnzd4Z6amHkli9QuD5YXxzvj0zmRi3ZRAfJo4OZk1QSwNliLEK60xW" +
                    "Zb1CQI6zdZXB/3F749b45cEoouN877VTk6GkHzIe38wafc2HZ8/dXVlovWIILVSSK1CsD44r4Vz" +
                    "TgTvha/ZXsIjgxJaKq2zVrt30jr/xaPLxWsJ0TiSEGkVhJD102OcEyF44dxIEeedkEoFKZKo0Yx" +
                    "WW73JR+aXlx4pM7UjEGKpZIi0JgSCs06MZNrCeyueUZpJoYJWiVBKpc9deR3eS4CX2qr6S6BYWi" +
                    "7S+SWPUjokzc4OF8z4YOmwGx7fMwasPvv965rjxN0p8I7u2jWPDof9m4er7jJQLSGFj6JolFvXT" +
                    "0kK3gvvfV2MeoRUyiuRRI04WWn0Ju48sXh6ryn05kDQSumgI0WwBOut8N4RnBc+uBFlRwYlFEop" +
                    "22x35gPy00cW8tcHH7UQEEUqCCmFr7y33ongkd65WsXoHSgptEhU0owOtnuTjy2uLN9UpGIHyFh" +
                    "IKaJI1w9lsk4670TwPtTX7mpptVBeyUS1k+aJqNH+7LFTJ7dbF80ggnhWTAhb2+MSvA8+OMCr4y" +
                    "sH5Uj6XkxNrzn5dygp1JyCT3sBzfHJKNZxO9gyHxahXGlFdFezEFk3gEC2ME9VlugN4ZFEy0dan" +
                    "c7HqyIb9064ZquVVbnpWx+IdPRn45MzH1dxvKFcnQ9R3HCeELwXQjebUgDGVMI5i5SRNM6Q91ec" +
                    "1o3MWnu01Wq9e3bjtilTDqZFVXkVRcFaJ6ROhE4i4ZzDVJXwzskoaYnB6oLDBemFOEEIy93O+OV" +
                    "Ts+s3ZEun25GOHFJIV4Wgm01Zq38t1lpVC9A1g+XTldYNi+D4cxQUXiKUxOTph5++4xNPB2dm27" +
                    "PbXdIekytH93jvtYzbk7JcOXr6+fLcE/f89Zl/H4Z7r377z76qu2V6U5kudaUPldQaa51XcSOoS" +
                    "Etrragqq7x36LgVBiunrAhKhcBRIB0bn75YJ411+cqpOIoaARFwTgTdbAohkVVppfW126b1PqSr" +
                    "iyHSjbKy9nCn0713ZsNZv+Rs0fZ5FnQcB+9cCDIWuhEL752ojAvOVSKKW2I4WPK+sgIhhyH4vNM" +
                    "ee/3k2vWdfPl0rKQKUkls5dGNlpBaiqqqQmUdhCCkikV/6aRXKgnW2WWtlZ+YWf8JqUXH9JdEFD" +
                    "fwoX78a9RqCEIIprTC+kpolQhPX8g4NmU6rOJmKz+jlHjheOH4X/H4fwYAYkF2Qd5yP1IAAAAAS" +
                    "UVORK5CYII=",

    marker:         "iVBORw0KGgoAAAANSUhEUgAAABEAAAARCAYAAAA7bUf6AAAAK3RFWHRDcmVhdGlvbiBUaW1lAHZ" +
                    "yIDE0IGp1bCAyMDA2IDEzOjMxOjIzICswMTAwHvJDZwAAAAd0SU1FB9YHDgsgJYiZ4bUAAAAJcE" +
                    "hZcwAALiIAAC4iAari3ZIAAAAEZ0FNQQAAsY8L/GEFAAAB5ElEQVR42q2Tz0sqURTH72Qq4mASS" +
                    "AoSIfSDdCEI8qJFLXSjLYSQNoGLINrI8/0ZD9q0KnDlKkIMebmP9xZRCEEiLQLBiMiNJDYq/Zg5" +
                    "73vpCkM6CdGBD3Pn3OvXe77nDGPfENKwJBHx/CxYAtNAAVfgXJKk7khVCCyCP6ALVKAJXkEdbIN" +
                    "xw5tgM4HHPphSFEUql8usXq8zWZZZKBRiPp+PH3sBx2Br4FbiBg+aplGxWKRgMPiMH1+YTKZDq9" +
                    "V64na7G+l0mprNJo7RG/g94IEoQSsUCuRyue6QToIJYAJWMA/Bo2QySZ1Ohws9gZBeZI570Gq1y" +
                    "O/395BKGJg+ZbFYznK5HAmf9vQiKW5iqVQim832Fyn5E+83Y7EYieAdY2Nig7dRqtVqrNfr3YiW" +
                    "GsVltVrtr2f0IrwEZrfbGeqWhQ9GMeFwOPprRS9SAWo4HGZOp/MH1l4DAS6+HolE+u9Xek9kcK+" +
                    "qKqVSKUL/s0hPDhFY83g8j5VKhcQg7nxs80/w0mg0KB6Pa2az+RTpDbDA3sd/lwvk8/l+Z7iS/F" +
                    "HEAor8H9rtNmWzWYpGo+T1eikQCFAmkyFxAy7AJ255aMHYcIID8d1oNBi8hGuwwkYFDq0CPlG3Y" +
                    "sTb4B/4BRwjBb4S/wGzT16tu5THiAAAAABJRU5ErkJggg==",

    mask:           "iVBORw0KGgoAAAANSUhEUgAAAGUAAABlCAYAAABUfC3PAAAAB3RJTUUH1gcOCDMLN+YTsQAAB5h" +
                    "JREFUeNrtXdtS5DoMbKkG/v+Lj/cJCgbb6pbkZDjFVFHLxjepWzc7mQD8fV7uY3/6/ClxUg77vx" +
                    "BqLzTXHePtxfpfDkR33yv7XEbIXQKdaLt63vF0vRVHOwjwrv1K0jrHXLFGu5K7PnZw/QyIY9Juh" +
                    "2SR5rUGYKvCsXNW1u7qc8m1x4FEnwHgJGgnyT2i110C2mHln8MTo+fL6HMn+K8CQtRmTxVXZACz" +
                    "sZJMqgVllbVkfwRzKOCOjUyDnNeKxkeNV0i5QqCr16iMt8CAVkZhC6+zXaJXNkV20e8meE0XAaw" +
                    "cLPnOyvA4sE+worcxfTtCY8YT7AC5ppCCjgUKSnauWQHZDhhfmRQjhGXAVIFXCcq0zWQcmz4qUZ" +
                    "bpk9k8mhC6WoRMzJuZ3xa/o3HNFCmVo/yTwL3C3Cfl/PavNVl8l6KWCD2/+d9p21dPWe1Y0bXYi" +
                    "4zNGMpJmbekMEcNDFFXgxj1NaLYsESkOEbWipTnY4cRKFglS0m6Rs7xdcMWXYvasvqk5ngEhKi7" +
                    "WiYEsJZbUXAmjwfXTnhD6pqyeRwFgLqtSSUm8kqFSCOKEqsYWXT2xZbLqidABHpVJXqShKzx7Pq" +
                    "rxkmREuUJVhglpLEbOYWsCCCfkDrLJx6QXwHeMuHLgqPpAe0GmSq8JUOBJyy5IiMKvy/nYcOXEW" +
                    "dZVmjLtLNk7ios35A6854MWer/w0SffQhBATirSAYYhgQjiah6/nKOzOYxKont4mu2yAV3yQTRs" +
                    "IwlJQt+VBicIIQpCjy4ZqIX0vkho5cavlZAg7TijGKZtsp4Fyz8hEF9klJ9Jjg6H1NJtAZSPADI" +
                    "C+SpZElErY5ZmMoJDcn4CkAypLByZjwjlP8RVE2DKAKYHIIDhPhTxZRNrFVSukIvneh3lqAcXUR" +
                    "KQCAOTR7kB8EvkXziwQlmU4hGq0Qxd1R/vq5jDWtJD04McrPInGupIa0KGLNOBtQjhD8IcFQvQh" +
                    "JwNMzR8eNJ8p8JWhHmk3EpTzHSE6rAYqPAKqH7BBRfKHyalIohfOrw2JTDzD5DCWNV0rCI4UqIY" +
                    "az3FHH0fA/BIwB+lw4hjrN7oGjX3WnJfogQZ/B4TLxk9Rh/dCOJ9azo9iube3wXAhYgzOJ+1SM6" +
                    "vcyjkpgpgS1RVVUSOBO6VuRWwMuQlyb8QZSrI7npO1U9uVCOejI0McQ6kbTVOeXN4whOjpWbXOz" +
                    "9+53wECq0CkGzkOei9btC9CNRGTH33tXi4ORxiCfDkieveSEnUaQwXwg1wlOUe+1OHvHsknZHjG" +
                    "f+j4VXeYXYSCEnYy6rgCfBU6xxpwsa54vkczKETXPKY8NsViArAOUNYcQDME7o2REmP/cpb4sJv" +
                    "lo2kmA5WdmolY4TyTmqeCr5pMtApwXKjpTTCRAiMI78fsKJE2EWUE+W0yzZFCkoWsauxMyUlpkS" +
                    "tusYxQtyA8Ixy5sIrrKYB9WSQz+f6iYSjZEAwpq+I+WdqBTQbBWO2jlRdfzqrKxr71KS6cNTKqe" +
                    "a3cfdK4NwoX/3Ka8367fLZ9PwhSZQO4+7M0fvSBDWCXZW3hF5CqNodFSSBQHE+iiQdtdtZTB3Ht" +
                    "8ueOLjlNIZUnARKVb1lOx9afv7absP9PluGIaUqApTLRPEMXsnEHcQwDwXsH3u622SCLEhpbRgc" +
                    "XwHCVUjU7+Ooeaw8ZxTIFYRaHiwQX3CEIm+uMDLup7SnCb6TgXQDACjZDdRmeeinZQXK1LekyGg" +
                    "42sJp772gBuNCcHt6Mj4Pz0Fm8NICMKh4OJVUpD0mm6PRHHt8XGTqwokkmOZUIKCQWTGYnFQquK" +
                    "ALJarkhgE2CiEEzSFIlSUPxAmO0jZHrNAUCirMIiKqnvtjF5ekAObR3RnL0/4kei7Xpcxq0YYUi" +
                    "DKUCUuY+mefEKU9aLl0T2IMIYmN0bB/SEAXvH+jjZ2vWn4QtKaVCWxKRM71gRRWKjzKg8n+uYZu" +
                    "F3bD09BwZI7x1aB73zTEIr6qbJNS+LsQgD/Tq2Ol6Qp45AIfx2GFnnM0lPeEwIpArAvaasAgaIO" +
                    "yhgmBJaurcKXnVxUaLtCHpYIu0jGoeQUFACsEpBp6zQSRW4g90rdo6TgwFzd8172ivREn5AUFBb" +
                    "qBkYNQezYjAwn9R+zRJ+ZGA0gd1lq57wVg8wawNRTugHtAoPNIR3EP3/PcwgGUcUCz/sUkEp3kY" +
                    "IDxtBNvhoxqrJ9C18ZpRlLi8buXH7VfyQUH2KYVoGPchD9NwS+ekrGarqsr9uKM+2jGBa7xnx6S" +
                    "pdiHe27hJn5ixW76536KDLsjGBKCkRXXQHHgMiu29Hvt/z+I3xdBUTX+JUB7Lxr92eumLf9gQyB" +
                    "I6n/t7OvaCDjitgkWKWNIQWFsWzbHWuMZ1Ii5aMKZtdXGYsCAVWgVePceeLIzD8jpcN6hiD4B2H" +
                    "PIScLWAdpp8Ywfab7FHaynWVnBe5U9oQeFZnZa2OW6NUYPogck1EKLzIHG1LbZF55SkWo3zzmFe" +
                    "Tbekpl4ivaT43dATyuwOXr5rEifFTasvPvwt5oIPnufkzfEZES5Q9mwUGWoSDWYOWoAnfnOCp8X" +
                    "SnQyfmsYey4QN+x2qe84sduMIY7PsMA/Ie/z0t9/gHKOXPlZc81WwAAAABJRU5ErkJggg==",

    wheel:          "iVBORw0KGgoAAAANSUhEUgAAAMMAAADDCAYAAAA/f6WqAAAAB3RJTUUH1gcOCDIojJpTggAALYl" +
                    "JREFUeNrtnXmYHUW58H9V1WdmMtlDQtijSSDKorLovRAWAwqyiBJugoCK6CfqRdSLityLkIsiF9" +
                    "SIyqIsRhZBlu+TK0JEQBBFUEAEZQ9LgkCABBPIJJnMdFd9f5wzM2d6qrqr+/SZmUy6nqef06e6z" +
                    "9Ld76/epd6qgrKUpSxlKUtZylKWspSlLGVxF1HeguKLAQmTp0JlOuitQU+BaHJ105NBj4JoDEQK" +
                    "olYwoxAmQtKBxKBYi6ITxWokK1GsQPI6ilcQLEWxjBfpFGDKu13CMBwEXsA2bTB+BzA7Qbgz6B0" +
                    "hmgl6GugxEAG6tkX0va/fr70XBhQgqb72bLb3kgjFy0ieQ/EUiscQPErAo/yNlaL6pWUpYWia8C" +
                    "v4l21BzwYzG6K9IHo7mBarcPcTfG0BwROGNED67xsUy5E8gOSPBNyD5mH+VGqREoaGhX+/KSD3h" +
                    "+j9EL231uILt+AnaYACYcgCiKADxZ+R3IHgNlp4jFvpKuEoYUgBYL8A2mYB80AfDGZXiCp+gu8C" +
                    "wXY8AYaigHABInkJyW+R3Mga7uBu1pZglDDUAJinIJoOZh5ER0L0LjDSLsjaQ9BThN5VlwZDEUD" +
                    "0hwIkK1DcguQ61vN7cTPrShg2Sef3Q+Nh1GGgPwF6X9CV/K2/zghCThgaAUWmOuXLEPwcxZW8wB" +
                    "JxN2EJw4g3g6btCOLTEM0DPdXd6usMTnAW08hxrB4Gl3AH/YR3YF3Pq+08l3YIYucJulH8HskiW" +
                    "rlJXERHCcOIguC4NmjbB6KTQB8EumWgIOuMwp0Vjoww2IAIKN6UkgM0RP37JUguJeBKfshrI923" +
                    "ECMbghPaITgMzMmg31ONBLkEX3uaP41C4DgnDkMQa8HjMKiCwZBOvwIUKxFcTsAFLOQfI7UfQ4x" +
                    "MCL48GsLDgK+A3qNP2NNMH90kCNLMJgcMPj6ELxg2gQ88YOj/ugrJIgQX0MYL4syRBYUYWRCc1A" +
                    "ptBwFngN7dHQnKA4GPo5xUlwJLEgxZBD5wCH1WcylZW6xCcAkB3xdn8koJw7CCYIGEaCcwZ4I+H" +
                    "LRyh0V9Wn2dQ6C1p4lUAAxJgGQxpdIiTK7XvnOXYvgGa7heLGTtxi5HcuMH4VtTQJ4N8o8gjwCh" +
                    "qozXb5KBdSQcc21g/245NO2K628Iy99JuwwRuwyfWyh4CwGL2IxbzDnsba5HlTAMkUlk+NZc0Pe" +
                    "A+BrIsenSkf50/QBwSdww1Pu+ly499utva/9z9kNwGy/wPfNttihhGDQIEIZzt4dtLgd5Pcgdsk" +
                    "GQZ8Mi/Hm+owmCPRSbDRbJKARfoMI95gfMNwtoK2Form/QBucdD8EfQH4EpHILv3S85tEOvsJdM" +
                    "BhZv6Z5gu7WEvE2SDEDyTVswU/NhWxbwtAUEH6wDUy+FOSlIKfadLW/VpANCn+jrX9B5lWjFl6W" +
                    "WyQTXgfWKeAjVLjL/ITDzAKCEoZCIJinDD/+AAR3gvgoSJluFskM2sH2HUU1szmBSPu478/JDIK" +
                    "fdgvTbqe0tkkzENzAWznHXMTEEoaGQLi4HQ78Ksj/C2p71x3P1pTZzofGfQhvqTZAN9AJrK1tbw" +
                    "JravvrgK5azNX9dUWYSdIRQUozh4SHU913bhuSLzOGX5irmDXc4w3DFISfbgFiIURHV9MojKW/Q" +
                    "JPcsZanL8GzX8C5hRFE6yFcD3otRMsgeh7ClyH8J4SrIHoD9Bro6qyez3qgQkArCoVkDAHjUYwn" +
                    "YBIBUwiYRsAMFJuhaEPRTkCFAJHYv5Clv6K+r0KSrWNOpuz3ZMbC51DcJuZbYC9hsIFwza6gL4N" +
                    "oN7fw+/QupwHQQCdZddMQroNoNURPQPgg6Ceg+3nQS+GZ5YJiH7qZzngqbIdkOhVmongHinejmE" +
                    "rAWAIquTvusiT3JeUyJQPSAfw3a7hQHE9nCYM7WiRh54MgvAz0VunCn0cz5Emr6N0MhJ0QrYDof" +
                    "tB3QfgIrH9M8MjqIbtv+xHQxUwUO6PYE8X+KKahGEeAStQasgEgkjTDQK1QX6cRXIThdHEEq0sY" +
                    "BoDwYAWWfRKib4MZlw5AxEDTqdG0bBcA0TqIXoDoFtC/gbV/EdyzatiamPsRUOHtVJhNhblI3oV" +
                    "iEgHKy4RKy4LtEe7AA4Iks0lwM4bPig/yUglDLwg3tYM+tbZV0k2jpHyjJCiSxigPgKATwuerAE" +
                    "S3QHS/4OaNblikAcFcZqI4AMlcAnZHMYGgFgBNM5V8/Qfbe5noP/TUP4Tgo+JAntjkYTDcNQY6z" +
                    "gZ9YnXscSMQZMlGtYKgQa+E6G4Ir4aOOwU3rWGEFAOSY9iJVo5EMg/FTBQtmf0IHxCUFwg9GmIJ" +
                    "AUeJ9/LXTRYGw+3jofs8MJ/oP/CmZzMeplIaCF7aIaqZQdfChqsEVz3BCC/mWMYxhkNRnIDi3QS" +
                    "0o2qRKVfqt8wAhy8Q9ZEmwTHsx31DNaJODB0It04C9SPQ8/3MoiwOs7dmiEA/B9Fl0HWV4JLlbG" +
                    "LFzKOFrZiD4osE7ItktNOx9knz9neibdtyJB9nL347FECIoQHh9vGgLqmCYAoEwXuEmga9DKJFs" +
                    "P4ywUWvsIkXcwIVJvF+JCfXIlLtmUFQHjCkA/EaAUeKPbhnxMNg+NM46Dof9Mft5lBen8ErgmQg" +
                    "ehX05dB5keB7/6As/Z/PSbQynkNp4atIdkfV9Vv4hliTzKN0cwkEL6GYL3bj3hELg+E3o2H098C" +
                    "cMBAA4wGAacA8CteCvhHEtwVn/L0U+5Rn9TXGM4GPIjkZyVt7e7obgcEHhD4gliGZK97JQyMOhm" +
                    "o/QvhNMKf0OcvGA4asKRgDHGZd7RXWC6Dzl4Izw1LUMzy3bzMDxQICjkTRnjjnUp6+BjsIPftP0" +
                    "8LBYhbPjRgYqj3LH/wcmO+DDuwANAKDE4Q3wFwF684RfP2lUrRzPr+LqbCBuSjOQPE2VK2PwqdH" +
                    "Oq926APiHhRzxQ6s2OhhqE7l+JcPgrgazJhk08jk1AoDHGYN0eNVLfT6bwRnlusVFPEsz2crWvg" +
                    "GAcegGOXVz5A9olSVStUPiJ8zhk+LLZs76cAgwPD4bhAthmiqn5/gA0RSx1vYCdENoE8TnFg6yM" +
                    "3QEq18FMkCJNv19k34RpOy+A19GsIgOJdlnC7mNG8OWNFcEJ6dCht+DXpXf7PIBwhnROk10N+As" +
                    "ZcK5neVotvEZ3s576CFHxKwNxLlBUNWEPqbSxsQfIptuUaI5vRBiOaB8GA7jF0E+qg+4faFISsQ" +
                    "kQH9GIRfEHzirlJUBwmIq5lMC2ehOA5FW2KOUh4QBg4tXYnkELEVDzTjemRzQDASJn4J5Dz7lam" +
                    "MdyHxPA3yTlAfLkEY3CKOZSUv80UkZyB5I5ew26fHt4OkmIzgJ+bV5kxH06Rhny8cAPK06nhlm1" +
                    "clPO6KV1MSgrwO5NGCo58txXMIgPgiG/grCxGchOTV1MemUh6zcoLQE87dBcV3jaFl2JtJhqVbg" +
                    "rwLzCy3aZSlw81pGnXXcopOEczvKMVyGJhNt3EIkh+j2DZRoPOYSf3NpYiAzzCORUXmMMliQTAV" +
                    "qJwLalZygFmQX59KQG4AdR50fbkEYRhpiQNZjORjSJ5FYgqNLPUXJYXgf1jDTsPYTHrtGFBHu+c" +
                    "OSRsB4nVX1oH4FnScLpi/vhTBYQbE/tyN4WgUj6NiQLh6q33Npv7t6RQCLjCG0cPOTDL8cxroe6" +
                    "tjl02CWZQUUTIpppHeANHZIM4WzCnTKoazyXQ/uyK4DslMJKKBHuiBnXD9X79Che8VEW4VxYBgA" +
                    "lh9OZhj7RAYTxCiBP8h6gJzLrx8Vk8fgjGm7FkeIgXgPCBE7zHzAO8h4OcopjtGuKXHVUTKvmAV" +
                    "itlCND5stCAY3vww6BuAYKDwpznNPs6zCUFfDOu+IpjTO72IMaZrOFz/EP32UH7eCwYA8zD7U+F" +
                    "qJFvk6ltwOdK1VyPACBZLmCsEG4ZUGAxvbAbqPjDb24U/i3awwRLpaup15/GCvfuNRzbGrB3Eax" +
                    "cFnCMG+f8U9d+8/3scBgDzGEehuATFuLpVRf1iKo75XI3oe9WgNRzfKrhyyGAwGAFd3wR9mlsT2" +
                    "LSEC4q4mRSZ6voL+kjBbgOyFo0xqxoQNNEEYRVDCEqzrj9TnRUGEDzDSQjO7ddT7asZ7NogLllL" +
                    "u+A940T+7NYGYejcEeR91XmOkkwjHy1h1Q7PAIcKdnza+vvGrMhwTWIQIRGD9Ps+5zb7+0TMTJL" +
                    "2Z0XAUhYScGJvLpMtUzVhlu8ebaCFs4n9zhj4Wl5nWuQHwQTA9aCPSIYgyTxKNJlWgT5G8LZbnf" +
                    "/BmJcyPsyGH3ZOYRMb0ffn+S6RBgOAWck4urgBwfv7RZg8zCPTZxINkKq6/Y4QZk8S/G1QYejGH" +
                    "CzhJoEJql+SVytY07i7QP8nzDgvqYfRGLM06cEU8XBzfGeW80WD/6VZv5P7s0kwAJgXmEkri1Fs" +
                    "7wVB7dvi2iDBAP/VJDhCiOxz3IqcWqHSBXdK2Lsn3bz6ZYb8TrSp9xOuh67jBDskRgeMMUsyCE8" +
                    "RIOQVHFHQ8WYJtiiqLg0GAPMah1LhWiRjXH5CzEFOBaFOokIFcyaJ7LNr5IKhE3OogZskyP5T9Z" +
                    "ve1+waofczS2D9+wQzXki9qcY8nvGBNyqAIid8RQleoYLr8epzLDsMBsEazkVwci21YgAIBn8QL" +
                    "FAsngqHZ9UOIo9WWAt3ippWsK9lUa8pMmmItaCPFWzxS6//YswjOYRBDJJgFfm5Is91fdanEUl6" +
                    "9YYBwKxiAi3cgmLPHv/B5SBnAaFWFxrYf2vBH7LIdua1tt6EA4G96gEwdSBU90Vd0pOqQVF/po6" +
                    "9CqqhYnE5XPirTK5L9pasaIHJKrB5fyuPgMbPNY738f363zEpdfWf92+FJ7LarOVkJL9GMdFYTK" +
                    "KsENTVBxr+0xj+KAS6KZrBYNQquF3AHJ8lhWXMfErWCtHTEOwnGOM9u50x5r6M2iDPa14zwxe0P" +
                    "N8lMv5n399Nq3Mdr3egMy2MbgxnaTjVgGoEBEtdGMLsGYL7m6IZVsBeAvZ1aYX6OtnvmKgBIeu0" +
                    "RD+tsAHU1wXtWad57M7Q0mcRwqyCluXz3oLlccz3901KnU+jaSz31hQQmfyuhkM07OobezR+YAT" +
                    "AfxjDMb79Dt4wLMBIAyebatcIWACoh8JlOonavug7y4BcDC035orwNi6kaQLrC1bS7+eBQWT8ft" +
                    "t7E9tPOm6DxniYTA0VIVjdaTjDwPUaRukcELhMJgMffgpmAU8WaiYtx+xk4CEBLVmWDXavvdnrZ" +
                    "P8T5P4C8UhmZ96YW5uh6nEvKisyAiRShDftu/N+n0i5bt/PCs//Vu9Aq+zPEdUB1xo4Uldbx8Tw" +
                    "qQcEvceBC94mOKlQzRDCcS4Q4k2MTNAUfa8CAVohFuUBIaYZsgp9ViH0FTAfOLK+9xXGrIIsPZz" +
                    "jNIe5kKxfIYjWGM6MYH8NkzxCp17mUm37yNOG03YQvFkIDC9h2rvhWN81to0HJLXXVzfADxq4j9" +
                    "05W/9mtqJ5W9ws/62+Tub8j9oRZRIpPoMrgtQQGGMFj64wXGPgRBPTDnm0Qt02eT0cAVyR9h+8Y" +
                    "sKdVQdnqyyrISettRlVNY0O4ZLRiBcbhCFtCxPeh3Vbt2PftnUn1MUuc0Bd5FnnM0OCsfVaWupM" +
                    "hjrXhuUVhzOdq2j4voaVPstP+ixNWXdxn1xg0mU9lWaDEc/AzQIOyboAfXK4lZcE7DYW8Vrem2e" +
                    "M+VmDtrpPnSiotZc5fzvtPJnhs83aeq8tj8/QzwoxLNTwHz3awaYRyKYZalY+79xN8HhDZtKTsK" +
                    "WAA7LecekwnUxfJ+MVExsAoVa6ChTWLALo+9n649rzvKy32uQUXhP7vUb6pgrzH9bDjyvwSQMTs" +
                    "oRUiYFC/+OBgY8AZzRkJkUwV0OrzzKBOkF9xepWGbikgHvXnWNLM3fClM/4mlKhxUxy1UU5N98p" +
                    "yxOTwVLMpbgJFD9WqKk0U7Akgv8XgklamNhncYLYNv96g8qtGQxGPArzohzOsnBrBiPguimIZQX" +
                    "AEGYMS+Zp/X1b86Tv0I46mxbQHorWdcttXUDxvlBivyFjTrUcaMoPiDzFHehCx5ILuEDDRzSMzu" +
                    "EwD6C49vkdtoJdgQdzwfAIvEXAnjQgMZantl7CTwu6b90Z4+CNCr/M4A+k1aWZTtKjnZEOgdcOv" +
                    "0J71NmAMI4IeVNMpbfAI0/CHzUcaHJA4NgEcFRuGCI4TEDFN/aX9LTqDNS/bE1h63R1eQiqLxTS" +
                    "47hO+WzSucIhpGk2vchwjsvfMAxMLtYJmiEOhImBEBd+U6R2EALzqOEKA3M0VBqBIGbXfcgYTnG" +
                    "lZyTAYISBg4yj6ZUWMGwSEXtaoYFFAqEL1AxZW+8iIi8yQ4svE0wXFxw6BRjpMImwdO2kQU0KEM" +
                    "LiI8TrmjHlzk0hvGxgWh4AtCUWbGDGHbA98HQmGB6EURHs49IEJqWu3siseyKvATcWeMO6M9jwP" +
                    "nUyIxB4tPARfhkrLnPIODSCsfgCBnvOpIx1ssXNJCyaAIcTLYrWBLays6DjL4ZrIjiVujBr1s6Q" +
                    "2DGp4f2ZYeiCvYBxcS3gep8ERt3+r3dAvFHgPQubHGOXnsddLbm27MuYA+0j+PH38dBo/HbLmBY" +
                    "wlscU1xRxhU6d7yoHwzyymOk3aviSgVG+ppAjtFoPyYHAhZlgiOB9OLSASdEIWJ4w0CXgfwu+X1" +
                    "2DJPhJpk7asA6RAIF2QCUTQLAlBUsGZs9Lh2kUb8fiZpELgDgEJmYuFQ7GUnhoK3gW2NnDH3Bpg" +
                    "/j+fosNrYdYZt8LXP5CBPvkyTwz7qZ6JVD0yjrdBdr5WTSCfbRr8nHtcaxeqHVCJ5kruiMtoU8b" +
                    "FDJmHtnqfGWsaZphviD6g+EXGnbq6ZHGw0ewmUx1x8dreBfwZy8YfgPtGnbzScK33X2Hl7p4d8T" +
                    "aYQCDSGjls9S5nF9bK+8KXwrHvq7TDjZzxWYyxf2GtDoXEMbS2rvqbB1yhZYQfmXgq9TGOvjAQL" +
                    "p22NsbBgF7aGhzAeBrMtVHkTTc0YTGo5viHN1GWn7XexcIwmLX21p9bdEA2qEdbEJvYvuqTm6wd" +
                    "NTVD04nBqgLCNFkLfFwBK8Ab9X+plCaQz0bWBj/IVc6xt6+XeEJ3d/1+QbrgN81CQafbFVbmoUt" +
                    "/SIpJSNL+kVaykZStmpIcpqGLRlYk57x6lp02zXs2KfjtynaoL7MEYQh3OFzM9Lq627WXrYs1sC" +
                    "hmt5ta/mT6lL8i0dnI14dIs2Q1fzx0R6S9AF9OsEk0rFzjeO4TQu4Wn1jCY/aepJtDaC0aAzfKG" +
                    "bTp/XX8DsDx9fGNXs50ZCYXLX5DJgGPJ8CgxEadrGZRXFV4vIbLHD8sUn3qSgYpKf5IzPAIRMAS" +
                    "1q+Ly26Y1KO9dQpiwAnJWbGv98XjKZrhxDuN9XIYeDjJJMCRrWTm11SYVgMY7urOUkDhD5tigTH" +
                    "FBKhhD81EYYsznCaRiAmnHgKc2Spiwusy4GWFqfZJuz1Ah73H+LPXaaYwRY3sZ+fEAfL1gs9KCA" +
                    "AHA7P/gKWAzOSWn0PjVD/fhfgpkQYumFHXXcT07SCSIFBQOf6hOSogmDI6+SKlNbbt+X3eXUtyJ" +
                    "TU0tvMJOlwklXsNa01t2mGJCjSvqdpUAiBud5wXxyGJMHXjj9WV79zqs/QBbu4Jh8yDhhSzKkXD" +
                    "od/DLKZJGksWlSE8MsEPyIu7PHlOXQCLEmmT1aNYNMOtkiWtsDBYJpLEdwr4JiehjpN8E1CzLd2" +
                    "MekwGNhe4zcHYhIMddri73X9JUMBQ5L5k0X4XX6AzZySHr6By0ewQSBJnxVFZdQEceWuU4AwGeS" +
                    "t8GLgqbAaYWvJoQUG/LkQZi4wyDPrpp8MLM7KdNdIDiyhA+k4Vvu8MSSPOx0EMylJ+NPMpEY1RB" +
                    "oItgVeXVDUH7OdB96ZzE67P2lGwqwTBBStGZ6Oqs/bG4YUWtu2hq2AF50waJhuPIWfBGh07zX4z" +
                    "WaWs3Q5hNRX+Mkh8FkiQ2mtv80kskWNkjrS6h+FItuQTNss0EkAJGmKppaPwUs/gVVQXQTdVz3p" +
                    "hJsgYXoiDBFMT1oYIGl+QYs5FZpY+KoJmsFX+H3Mn0Yd4qSl+RTJS3271rGJawRXNoJ0+JQueUl" +
                    "acUg6zCWRYno1rwhMZFgCbJOh9U/09HUVht9bYfgpZoKGcSIh3ECC1rDMQBUKeKGJtygkexKdzO" +
                    "EwZzWFbFBoS51J0BhJGkHG4LBFler3SXhUrnTzeJdRnghV0Z1vzxmYYzyFPUkl1gh/i9OB7obNl" +
                    "aNHsSeYnhGGtR9vTs9zWj9DHi2RxfxpxDeIw5CkGWy+gcrQ+vtGkbAIvw8Ag6ohwioM/Xq9jR0a" +
                    "LxvRwBQnDBo2czUhUcpdtMFgmhdSTfIZfNIlmgmDzFCXpBHix5VFOxiHlqjvc3A5uq7Hlzbm2qS" +
                    "Ee5vZ8r0o+oIJia2+cUel6vc3S4Jhiklu6Z130mZKGXi9yTB0F+An5DGRfPyEtDqfTVn6FOJ1Pm" +
                    "aRSdEMPhDYhH9Qi4FV2gMGl3awhNDcmiGEKfEBtFlAIBaSYOhgyGMa5QmRpqxl3/BmUuqUBYI0c" +
                    "8k42jkXCPFxGTLFRGvmw14t6uTcpAh82p/SSTAIGOPzJcLjeA2mfzbfjMzkM8iMmsKnTnn6DMpy" +
                    "XFmO+8IQd55VgqaoN5mIWb1xS9g2e0fS4J9BC7GGsEp6wpCmHWplTJJmaBd+Qu7llQ0CDF0ZQqZ" +
                    "JHWl5o0eupDtf/yAeMq2HQqXAYNMIqgEHuh4KYemDiHcADnrnWxesrtRk3PeHUhr3dicMUW0xEt" +
                    "edynqlBlYPIzMpr/BnjRjZWvk0bRDV7RuH8yxjEOAAIwkSm0kU1WkL11iMLDO0NLO8GTb4OzEbs" +
                    "tUJgwEV75ExBf3wRghDI0BozwhRvIdZxLSFzVwyjqhSHJKefeVW3APg0HVQRHV19Vt8xr1B8xnW" +
                    "gWmluNFEJnZv4tGksUX2kWhYOwxgaDSvKClalOQfiDqhttW5IDEOAJKiS1giTGmCqiymURIIrmG" +
                    "gg1baYW036AK/MtFnKKwIiv3X1t8Q1WkqjTHC0cq6Jgo3jtbYNnAm3hoL0meOiMcZXIm9NoESOb" +
                    "p00pa50ikhU+FpGhEDgsEGImrid8d9ho4Cv1tSS6rayMugjPMti5eZNNrkG6vhKmuSzKRQDAXuZ" +
                    "SmLR+kEERT0XcISfY3D0FWUM1w7f0L5CMtSYBnXXR3Mn1lVO2zPDUkwrDN+Qp56Tm2bVD6/shQY" +
                    "LZkga2aSaACCumPrUn2GRoCIeYQlDGUprIQwUYIUHoIO9lXfY7La4YQhhBW+wWPjAYOwZMGWpSw" +
                    "NRDImRHUwJAFhG3IQ1xgGVjhhMLAi/gU6Iwyx8aglDGUprGiYSCyaJNyC7mM2rUjyGV7Pkh/uMc" +
                    "Ru2/IRlqWo0gXbKA8YpKf/EB9iIGM+w2tR3fq78Vlssy5MHMLoT2Gmlo+xLAVphukhiLwLZlvqV" +
                    "jhh+AFitYY3fRahTlsgvbYFErYrH2NZCnKgp4f5hH7Ae1PdX5qoUSJ4rj4RxWf6b9vc6rX9IIS3" +
                    "lo+xLAV4z6Jngrs0INJAqJua/jmnz0DfCbu6/ACT7DDH/QcFvK18kmVptHwAtg5hou/M8Lb38c4" +
                    "65QNDmmOcYWo/AexYPsqyNFoE7BBCRVqE3DXLQdLMkEDnLHg5EYYIluTQAE5IDOwCRjRxvtWybB" +
                    "JWErM0BMYTBkHyFKkCnqmfZ9XlM/zdZmuZDL5DbNvusDLEWpbGI0l7hSDzLGOlLT5DCI/Gf8M28" +
                    "fDjom4kU5oWSBsIq6EtgD1o7sx6ZRnhznMEe9q0QNos8HFtIfrkcgAMAzTD1bBGw1JfLZAUau2J" +
                    "KEXwr+UTLUvesi/MDGHLyDOSpD00h4G/p2oGEEZj/m5is3H7agTHvIezy0dalrwlgncLaPFYO3C" +
                    "ABnDUmdACg3T8+AO2tVKT1lpN6X/Yef+yJ7os+WF4r65aGF5ZETZZjdW9djss84KhG+7J28XtOK" +
                    "9dwHvLx1qWHP5CEMH7fHqeM6QN3YsYmINqhWEtPKih00VXGomWLdDwvvLJliVr2RXeFcEWEf5aw" +
                    "OXL1smndSlmKwy3w7oIHtIeP5ghxHrIOzCjy8dbliwlhA9G0JY3Mc8GRwj3eMNQdaL5g2/Sk6c3" +
                    "P3k0zCkfb1kymEhKw9zIkqmqM8hkTDu88Qo8nAEGCOGOPFohwZxq0fDh8gmXxbfsALtpmOHrC6T" +
                    "JaO393c+I/hMBpMKwEu4Na+ncOoXKDI7LwbtjxpePuSw+RcMRcRMpTdZ0SuPcDbe5fs8Jw19gvY" +
                    "Y/pNlfaZGlWBRg8xCOKB9zWdLKFMOYCI6JEgbzJDXEDi2hu+D2zDCAMBH8JgsAOj36FETwKTCyf" +
                    "NxlSSqtcHgEW2VxmD3k89m/1RJRM8IAGm7W0K09QlgZPP3dZsFu5eMuS4LjLDQcF0El7xBPW8Mc" +
                    "wi8R7klfEmH4AywN4b5GQqqWPzVKw/HlEy+L00SCd4YwO0tOXJK5VNuMgeuSfjfFXBFGww05+hS" +
                    "SHBsRwVFvwUwrH3tZbCWEz2to90nP9oGkduzpR+GvDcAAG+AXEWxw+QRpuUsOWidqOKF87GWJl7" +
                    "GG7Q0cmda3kLUhDuF6RPKM9qkw/BWWR/Bbn8hRBnNKRnDcVMzm5eMvS393gc9GMD7J1HbJXEJiX" +
                    "mjg2rTf9ojqCKPhp0k/6mO3Weq2BP69fPxl6Y0gGWaE8DENIq1T1wWItoNy7zPwZAEwwKuwOISX" +
                    "fbSDT1Jf7ZjUcMIkzDalGJSl5it8ScPkLAN1fML7ISyyZanmgmE5Yp2Gq3WCNvDJUbJc2FQNXyz" +
                    "FoCwYdtaxTra0ccyefWAr18KNPn9B+v9XroigK01FaT8I6n2HT7Zj3llKwyYNggKxwMDEPONmUh" +
                    "roa/8peLNQGJ6AJzQsTnJefHunLZGlBWCCUio21aIOBnUoKEHNntGe1oUmscOtsxsu9P0XGdIih" +
                    "I5gYQRRXtPIEXUSGg5RZc7SpqoVJkDlG6BG1a8KbGpQRBmgsIDxv6/DU02AAZ6D+wz83icnJCkc" +
                    "ZoGj1cBZYLYopWNTK2O/AuodVQjiW34oNITdcF5S+kVDMICIumGhri547kWo9gREw0wEXy+T+DY" +
                    "lrTD2X0D9OyhVD8DANePFgImw00x0Dbe/CQ9m+TuZBe8luE3DvQlEeneU9E4PLgCFRPEJWvhgKS" +
                    "WbAgjjJ0Dr90BN6A9B0tYfioSGOOyC//EJpzYEA4juLjgnimmHtE4Q2zFDrCFQjEbxHdpMuabDy" +
                    "PYTBIz6L1D/Ul2izaUVlONV9E536rBEbuuEe7P+rVwmyco67ZBmFrmAQFiuu7rNpMK3wbSWUjNS" +
                    "y9aHgPpcn3kkGQiESgGiCoVF3sKoqhWiQYEBRHcEZ2sIPXNDel+NsFxb/2sXKI5gIp+vnV2WEaU" +
                    "VtpkJwXmgxgzUADIHEH1Q1GRscQj35flruZ3VVXB7BL/yBaFXG7iut399CwGnMYWDSukZSSDMHA" +
                    "ejLoRg5sBWUGY0ldQALWGgw8DpebRCQzCACDV8vX4NOBcIA7SBdJpI9dtEAs5nK7NDKUUjwk8II" +
                    "PgmyAP6/ATpEGwfEGzniB9hmUN1EGCADngihPNdDnSvg5x0HQp3IxEwg4DL2MJMKaVpY3eYdzkR" +
                    "1Akglbt1lwnvU02lpWC+k6VfoVAYQJgNcF4ES5wmkXQArxLuRX//YTaj+RGzzNhSqjbWsut8kN8" +
                    "A1ebWCK79JEHq/R4NagGi/1K2gwwDgHhdwyk9znSiNvABYOB9kUg+BJzDNNNWCtbGphXesz+o70" +
                    "MwLtlOTmo1U0Ott0LndQ1LckFXHACXIzi2F2TXqxwQCPAAH5B0ITmXiLN4XHSVUrYxgPCv7wHxc" +
                    "9DTk3NLezbj2K9/b2L7ehVEsxEdTzT6dwtKfRAhcBqSl1Odf5ViMrn8CEULklNo49Qyw3VjAGHf" +
                    "XaHyM1Bvdbf8MqN2sGkJvgUdTxYixYXegIo5DsllCIIBrb5oSCvUb+tQnMMazi01xHAF4YB3g74" +
                    "czNtBC/dQMJOiHVzaovf1blhxKIK1ww8GTIVWfoLiY06hrzebVAoc7kDDBiQ/IOK/+ZNYX0rfcA" +
                    "LhA/uB/gmY6RAJP/PIx1SKgxCtAPZHvPpoUX+9+B7edrMlkruQzLICIHNuAzVlN4pL0XyNu0VHK" +
                    "YXDAYRDDwF+DHpbv6kj8voMOoLoM7B8USOh1Cb5DHVlnViO5CQk65w97Ao/MzKpj0JSQXICLVzC" +
                    "B8p+iKGFAImZ+zGoLAK1rZ8vkGYPi6Rj18Lyq4oEoTmaoXp3JJM4Fck3kUjvaJJKMKHc7zWKu9B" +
                    "8hlvFs6VkDrpZ1ArjvwD6NIjGJw/Vr2/lXT6DTvIRAP13iA5ELHul6EtpYiKcaWdzfoLkI4l+gf" +
                    "BsQJL7JgySxwj4Ar8Qd5USOlggHD0Z1FkQHgemLXlmrSjFUfYymVZCeAji+QeacTnNzQrd3ExF8" +
                    "WsUu2aKIPmAYDefXkPyDeBSbigjTc0F4VPvgOiHoPeGSPkBkAWIATBsAP0peOqaos2jwYEBYEuz" +
                    "GwGLUUzNBYMrf8vdMdmJ4gYqnMbl4h+l1BYNwQkV4KNgFkC0XTV0GnkKvy8QA+oMROfCE6cjCJt" +
                    "1ac0fb7ycvwInIOjI5E8lgZD8mTYkx2JYzPHm4HJMdZEgnLgVVH4E6kKQ06rZp42qea8OqGuhcl" +
                    "YzQRgczdDjUM/gc0i+j6x1yCkPLZElodFuOr1BwFUYzuFi8VIpzY1ogzFzITod9NtBS/c8FT7h1" +
                    "DTtUP8+ugfMXMTDK5p9mYM4ksxUmMU3UZyCROTqgfaBYWDqh0bxBJIFPMIvuVuEpXRneWxfmQFq" +
                    "AegjIWpPXrfJd1pqb4f5adAHIx58bjAudXCHVU41o5nMQhSfyeQ7pCU7puVBVffXIrkRwXf4rvh" +
                    "bKeVpEHxtPLR+FPTJEL21rzc5bUFknxU80mDQgFkGG+Yi/vLQYF3y4I8xnmnGMZrzkXy8KTAkga" +
                    "EwKF5FcgVwId8qHeyBEPygFToOheiroHcHXUmd8N1r33iYT72pFi9CdBTivnsH89KHZsD97mY8c" +
                    "AmS+Q050T6v9jEjmoBlKBbRymWcIl4pIbi4Ah3vh+hkiPasmkQ+k/7oHBoicXsNuo9E/PGewb4F" +
                    "Qzf7xI5mEmP4ESoBCIV/eobKAEPfFqF4DsllGH7G18TLmx4EC1pg8hzQXwS9L0Sjk9dj8lkZPC8" +
                    "I0XKIPga/u7NZfQnDE4YeDdHK91Ac3+tUZ8tPyqYVJBBYz4kI+AeKa5FcyYniiZEPwcXjQR4K0Q" +
                    "mg96g5xyLdJEozl9I63FwdbdEyMMcgbrt3qG7J0M9LtJ8Zg+FsJCfWhnjm8x3ShtbWw+AaVBSgk" +
                    "byO4ncEXI3mTv6PWDOCtICE7XcCcySE80HPgKjFb7W+PP5CUii1X27SEgiPQtz616G8PcNjkq7d" +
                    "TTvjORXJqSgqDadlpDvS/evsgHQS8DyKW2jhFlq5n8PFuo0PAAT8aiZ0HwDhXAh3Bz0BIpm+IJS" +
                    "Pv5AlH8m6PQTRsYibnxzqWzV8Zqzb3VSYxCeRfJuAcdbsVd/UjCwgpG8GxToULxBwCxVuw/Agh4" +
                    "lVwxeAuwII3w7de4M+AqJ3gZ4EofJbB8d3xbQsZpJthFt0M2z4LOKWYdEhOsymbzSSgzkIyWUot" +
                    "vLWCD490kEKIGlb0AtGJ4oVVHgAyV0EPIzgcfYZQjjMXQGMnQnrdwG9J0RzQE+DaFwVgKzLimfR" +
                    "CLk62zToi8B8HXHDG8NF+obnXKaHm10RXIZit960DZXDf0gPsbocahsItjpd0xpvEPAEAQ8geBL" +
                    "Jc7SzlO1ZjhBRsYL/7HhgO+icDnp7CN8B+t0Qbg7hWIgq/QU1xHsxYnyXFvTRDM76DogWwMsXIe" +
                    "7uHE5iN3wn9j3EbMEoFqI4ul+kKW9vdJpjbRN86YAhSAQmQtFJhXW1Xu9lKJ6nhZeR/JOAVSjeo" +
                    "MIaJJ0ERFRYD90VoLWaDt01ttqqMx7CSRBOgXAaRDMg2gx0G4TtNcEX/YU6JB8MWcOoefoVomXQ" +
                    "/Tnovg1xQzTcRG54z3J9mGlnNCchOR3F6NwzEPoAoRJ8i8BTawQJwFToW5kpIKyFc6PauRFSi5p" +
                    "TK6A7AK2qYEQJQu1zLKtfkBY9ytvrHP2u6h9c/dRwFbfhnd58s1iH5rso/g3BEufEAj4Tl9XXxe" +
                    "tdm8859ZuruRH93guggqANwWgEo4FxwFhgNNAOoqWGTsIX2Y75bDLjcdeNTdvvPb8TxELonDucQ" +
                    "Rj+MADcICJ+Jm5Fsz+CnyHQqc8r6bnLjLLhC4DrOwtX2PEfLwqSLDcnDYLeumdBzoOnTkVcs2q4" +
                    "i9rGM/DlavEihk8j+TSCV1PHhAjPBi1N0PPIkI+si0aAiJ+T96JkxgtMaoX6HYuqM1hEcxAX3oy" +
                    "4e6NIm9+4RoFdITq5lJ8C+yC4FkHopamFBxBpWiSTICfIrMj6wSwfEgVtPjfK2co8A+IYWH084k" +
                    "cbVVbwRjgkUhguFktQfALDUcDTTm2Q10zOoiFkgq8hizCZ6h+Va8ur2ijoJklArgfxQzD7IBZej" +
                    "7iic2OTrI13fPD5YgMXiF8QsTdwLoI1drO1yT7C8G44CtYYTrV7N5gD4ZmTEd/daNPhN/7B8ueL" +
                    "FYzmv4DZtZFsUaYGrSi/YVgIfpKN53uhMov2WArmk9BxKOJb9wzHvoOR08+QtZxkWpnAgQScgWS" +
                    "P1MxWnzEPPkl+efKeBnwuS85QWkeZz3FXz7JXZ9oqiC6B6DzEaa+OFPEZmUvLftmMZhKHIvkqkj" +
                    "1S0zTyJPVlzW+SRcGgyZdg10iaRVQHgV4E0fnQ8Q/EmXokic3IXmd5gWlnFIdR4WQk70HV0jp8Y" +
                    "ZAFgWFLEvSGIQ0Cn9Zfe9QlQrASwsthwwUjEYJNA4Y+KNqYyD4oTkJyUG0VIP90jaxp4ElawAmU" +
                    "T1pEoxAknWeFYQmYS2HdlfDF1xDCjGQx2TRg6IMiYHN2pMKngXkETE1cilfGWnJJtoFCSblNMg0" +
                    "G3YAfkPZdtvN684i6Qd9dNYc6foX4/Caz9sWmBUNvMYLzGM84DiPgEyj27R1h55vlakv/lp5aIB" +
                    "WGNBB8tUgmv2AZRD8HcSU8uQRx5iY32domCkNdud4oupmOZB6KI1G8C4nM5UNk9SlkVhiS6vOkY" +
                    "EcrILoFzHVQ+T3i8HWbsiiUMNSXu0zASmZR4d+QHFwbXFTJPAVNnjqpG2z5faZ7jAD9IoR3grkR" +
                    "1t4B89aOdF+ghKFhS8pIbmIKo9gfwfuRzEExDYXIPGCoKTB4j0/ugOjPYG6H7ttg1WMwv3so5iU" +
                    "qYRhJ5tQUtqXCbCSzUeyF5O0oWgoBIhEG7esgG9DLQd8P0b1g7oHoYdizs2z9SxiaqTkES2llFb" +
                    "NQ7ETAzkh2RDKzpkHGZAJEag8N0HssAv0yRM+Bfgq6HwPzKISPwo0rR2o/QAnDxmpiLWMqMJ1Wt" +
                    "gamoJiMYjKSyQSMQjIGhULQhqINpaPqYHltIFoLUSdEq6sdXtEK0K9D9AqYpRAtQ2xXrn9dlrKU" +
                    "pSxlKUtZylKWwSj/HyHl/ePsagXCAAAAAElFTkSuQmCC",

    Ambrosia:       "/9j/4AAQSkZJRgABAgAAZABkAAD/7AARRHVja3kAAQAEAAAAVQAA/+4ADkFkb2JlAGTAAAAAAf/" +
                    "bAIQAAgEBAQEBAgEBAgMCAQIDAwICAgIDAwMDAwMDAwQDBAQEBAMEBAUGBgYFBAcHCAgHBwoKCg" +
                    "oKDAwMDAwMDAwMDAECAgIEAwQHBAQHCggHCAoMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMD" +
                    "AwMDAwMDAwMDAwMDAwMDAwMDAwM/8AAEQgAFgAWAwERAAIRAQMRAf/EAIQAAQADAQAAAAAAAAAA" +
                    "AAAAAAgFBgcJAQEBAQAAAAAAAAAAAAAAAAAGBwUQAAEEAQMCBAQHAAAAAAAAAAIBAwQFBhESBxM" +
                    "IACExCXEjFBZBUYEiMhUYEQABAgMFBwEJAAAAAAAAAAABEQIAAwQxQVESBfAhYYHBEwYikaGx0e" +
                    "EyQiMU/9oADAMBAAIRAxEAPwDmv2BdhuJ8oYbZ9yXcRauVnE8Ga1V1rGiuP2VlKNehEjtuIQKSj" +
                    "8xwzEgbb0XQiJNmxomlirnS5btwcQpwC7zBzyjW36dSTp8oZnsY4taSmZwBIC4G+EbcUPt45C9I" +
                    "4pzfAr3Ha2OZ1p5PW3y2zjDrZK0Ug62fHRhQ3Ju2t7SRPRdfCSt8TdLLmscHISACEsOOPKDekeY" +
                    "f0yJU57cudjXFDYSATyXjBwyP2x52J99uPdu0/IIw8Q5THk30LKjfkDXLSxa1+7KaJISuq0saKZ" +
                    "I2pIe4Sb3aojijnUiTA1LSiXrhDltcDKL1sCrwjY+OLn729uHDX8KLqMYdcynsgYY8ya+uiR47E" +
                    "oxTz2g7GJlS9EX4+FXjE1oel7mhOV22EEvKJLnDfvAJXnt74jcx5Hhcg4+w/OKJCyaPMluN18Jo" +
                    "hOQ3KGMoqKCiqZK4JqpEuqr5J+SOaiszENeircMdr4m+laN/C89vM5pa0KSqZV9gQhAIunPVVe2" +
                    "2e8GdvcRVPmerxe+CVDRfnip0l1YpAX8eoLL4N7PXU9PE+dVSxXib+Jf0ResU+XTzDQOZfl6gp0" +
                    "gn+3pcd5mO5bYTO22n+4cYUpCWsN+TFiQ0aRNX1dcslbY6W3Tf1EUPgvn4OUjpgHpCjayE1e2Uf" +
                    "vKQj7LmHlSwmRoXFnEmOQuYPr4SwZVNb4sMj+wGSKtJFVq1lj+400Xptaaa66J436mZW9v9jX5e" +
                    "NnP6wcp5VD3PQ9q8Afl8IKE+d3l/7Hg29vCe/wBKdZw6qqMz6nU3H1AA0P8Alpv1VXN2v6J4Pud" +
                    "M7gJG+EzWyu0QD6Y//9k=",

    Malekus:        "/9j/4AAQSkZJRgABAgAAZABkAAD/7AARRHVja3kAAQAEAAAAVQAA/+4ADkFkb2JlAGTAAAAAAf/" +
                    "bAIQAAgEBAQEBAgEBAgMCAQIDAwICAgIDAwMDAwMDAwQDBAQEBAMEBAUGBgYFBAcHCAgHBwoKCg" +
                    "oKDAwMDAwMDAwMDAECAgIEAwQHBAQHCggHCAoMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMD" +
                    "AwMDAwMDAwMDAwMDAwMDAwMDAwM/8AAEQgAFgAWAwERAAIRAQMRAf/EAIUAAQADAAAAAAAAAAAA" +
                    "AAAAAAgFBgkBAAIDAQEAAAAAAAAAAAAAAAMEAgUGCAcQAAIBAgUCBAUFAAAAAAAAAAIDAQQFERI" +
                    "TBggAByExQSJRMkIUFVIjZBYXEQACAQIFAgQFBQAAAAAAAAABAhESAwAhMQQFQRNRYYEicbEyFA" +
                    "bwoWIjM//aAAwDAQACEQMRAD8Ax8438d29wjdu3dD2qsYMzE0gmoFYMJ0KEEm1Qte6UHkEigREZ" +
                    "IsfbE0fIcglgVXJW2CAzAaE+PgvQkdT0x6V+Ifh1/lXO32YS5vWtm5btOYqVTogOT3SJZUYgFBP" +
                    "uJACRsvFzsjv3bNSior7tZ6dITjcbgduuNMJeQ6lGqioiwmfDBTRKPSZ6LuxttraN92pUdQT6Rr" +
                    "M9BnOEfx61zXO79OK2lvvXnJHbZFAEfVVkO2FzqaVpjUHBzruIO+rZyIoez00tQR3NTqmKSXMGA" +
                    "Wigi7SzUn3SiaaIdE4Z8mMYZ46gN45slipqC1RAqI+ExVHSdY+GD3PxvajlF263rRtG6bTNW3aW" +
                    "4Mge5TV2SxBDxNAbwqKC4m2zb28OOz3JcoTtLkXOsUbAURU50aLXmGTmMZXU0RjMfFgfrjGQvLa" +
                    "sXKwDBMg9ZMgddQchGemFbexvbzlNt9u7IXS2VdRmlCBS2qwEZDU0ikAnFjud/RtSoXCCL7EDJt" +
                    "MFVEQxjYnT/eGZGBMZjwzeXr7sMcptbBsOl26pNoFqEJ/ygwS2RyHrRoJGeOgOc5teV2252WzvL" +
                    "b37JaG63KIAd8GQsEswwILQCR7fuACzUkBTEdx91VNbyK7f0tO2B3zT2+sQ0dSIYTEWq7VRozep" +
                    "5K9SMPPPiHnGHW1ZgdwCOimfUiPkccyWbbJx1xWBl7qBRGpRXqy8q1Hrgz8Tbh35s28qR3au3Kv" +
                    "NIy6iu3076impZXcp8c9K24RpxMBhq5wJWXDUj5eg7hUa4sEB8tRI8p89YzB1jDvGXdym1cMjNY" +
                    "NU0mGAyrIifZ9NYZSmkw0HCY333B5CtRWJqNg20N1gp8vMLntVZlgM6mmxVVUCRT/AB1Ac/TMT0" +
                    "ZjfIg0geOZ/Yx88JWk49HDI152kQoVVMzlDAuZnSFnwwTKur71/wC00l2u1LR/277QnWu1uJf4/" +
                    "wDH6ZyalHJ6eXT1ImYZnz4+Op0qq2OwVU+3qf10iOkR5Yttxf5D7+3cuW/7M6FkzMmQDNXcqmc+" +
                    "53P5QMf/2Q==",

    Corvintheus:    "/9j/4AAQSkZJRgABAgAAZABkAAD/7AARRHVja3kAAQAEAAAAVQAA/+4ADkFkb2JlAGTAAAAAAf/" +
                    "bAIQAAgEBAQEBAgEBAgMCAQIDAwICAgIDAwMDAwMDAwQDBAQEBAMEBAUGBgYFBAcHCAgHBwoKCg" +
                    "oKDAwMDAwMDAwMDAECAgIEAwQHBAQHCggHCAoMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMD" +
                    "AwMDAwMDAwMDAwMDAwMDAwMDAwM/8AAEQgAFgAWAwERAAIRAQMRAf/EAIIAAQEBAAAAAAAAAAAA" +
                    "AAAAAAgHCQEBAQEBAQAAAAAAAAAAAAAABgUHAAEQAAAGAQQCAQMFAAAAAAAAAAECAwQFBhESFQc" +
                    "IExQAISJCMTJDFwkRAAIBAgQEAgkFAQAAAAAAAAECERIDACExQVFxBAVhIoGRoTJCghMjFLHB0W" +
                    "JyBv/aAAwDAQACEQMRAD8AzJ6k9Y4NoyjbjdEkH3Is4VOWab22NJR9fjnay6UaIRah0038pImbK" +
                    "KoJOR9VFsBVVCqisQqZrunXMtp7izRbgGDBZiQIDfConMjOZAiM7fbeiF66ttjBYEyRIUAEzGUk" +
                    "xkCQNJ1yc/Kf+fPaCj8Zq2nmKaO64y0kK9jJlnVJ2Oik1FCoFM4im0LGlImJjgBhjXRFUw+pDDj" +
                    "PwB03/UIbp+2sf1Zww+ZiQ/JlUHDBux2bgCI7hjAlghUk8VEFB4hnIwIbB0WbxPaev16Cr/u1aW" +
                    "fPYWbpyk46RjYuWaxm8IrbvoO6Ug3LUSvkjYK6MgRdvq86XmNpyNdJbp2YBxBDRqvGNKhmDtMGI" +
                    "MYAmiBdA8u4nQ8J4e3UbTi9cIPYKTbxHJrUFHVfjUqBc1SMkvIopBs61C1V0oQgCAmTZyVeetFM" +
                    "ftNgPzDMbrrVfbr1uCWVmmP91A8oIPLFbtrR1tsggVLAnIe4VieM5DacLLsNz7ykXiezueUeWIu" +
                    "d6vyDCYLxc2iW5d7n3E4r5kkpEchpJEBlMpvp+oasGDHzMbHRWiyhLbfUMBtx8vEvr4csK+nN9b" +
                    "pLMKUk55RB+LgF08ecYIk7aXZX7FBY5k7i+eQ0MxQNgFnMhA123ykggXIhlVu2srFAxQyOtYpMZ" +
                    "yAbTd83VoB8KNPzFY9dJ9WM9TKyxO7CPRM/qMHfo3Y+0FdYxbKp1t3ZeOJCWlkau4hpJpFzca9K" +
                    "1SNLrx6r9JwmaPFHwg/I7bKMjfYBxTVEhw8uJVemy1NwATlII2q0z1jMHmMscphPuCUnLYg7x++" +
                    "UenFxczYtJh+9r8bNS1z1a9pjWdGgTisQfvIwlAnp9IFDH/JrHicTY0AQcYgdvNs9S30BbFwznL" +
                    "EDjQCFHOlvZhF3H8n8Vfr1G2I2UE5eWsgltPdqGDZcrl2B/vqoXq9VGI2ba3i9JpKztbatt8rsj" +
                    "tBB0m99rc/a85jmM4973cfzaC/Ltq0lLojNXUKmjzVZRlGmm1NPhOD7s0hmApjIbR/PpmfHH//Z",

    Aurora:         "/9j/4AAQSkZJRgABAgAAZABkAAD/7AARRHVja3kAAQAEAAAAVQAA/+4ADkFkb2JlAGTAAAAAAf/" +
                    "bAIQAAgEBAQEBAgEBAgMCAQIDAwICAgIDAwMDAwMDAwQDBAQEBAMEBAUGBgYFBAcHCAgHBwoKCg" +
                    "oKDAwMDAwMDAwMDAECAgIEAwQHBAQHCggHCAoMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMD" +
                    "AwMDAwMDAwMDAwMDAwMDAwMDAwM/8AAEQgAFgAWAwERAAIRAQMRAf/EAIUAAQEAAAAAAAAAAAAA" +
                    "AAAAAAgJAQACAgMAAAAAAAAAAAAAAAAEBgEDBQcIEAABBAEEAgECBwAAAAAAAAADAQIEBQYREhM" +
                    "HFAgAMhUxIkJjFhcJEQACAQIEAwUFCQEAAAAAAAABAhESAwAhMQRBYQVRsSJSE/BxwdFCgZGh4f" +
                    "EyYhQVBv/aAAwDAQACEQMRAD8AlB6l+qd/2bJNdtiksLgYfvEhxI6zh1sIpnjitHCK8Y5M6VxuI" +
                    "Nhl4hhTe5pFe1rVjqPVrNpgL9z0rc0z5miSJ+kDidZykRmJf3ABhmhZj3n4YSOG+tNH2/HPhzbW" +
                    "8iSxo8T0vQ01rXhc38qoesZWQVG1FTRfHKN7f0rr8I3O32O2tf2HahfPUeOmcmqeAznsxLJbQVT" +
                    "HOT7HBnsfT3IYHs5XdUQa5TOnzT082mfOmDgxZQQeaOSkvjWS+tKDSSxdqHUbSC15Gciir1pDtj" +
                    "ca4AoAYPTqsxNPmGYIiJgxBjELufASW4TPKezt/XDA/wAsJCZDdBHjUmMMzn1VhOSWJxmkqT4/X" +
                    "0vI1jCCVeCfTHjKuujXqmv1Jqt/9jt7b9FveoGLWnY5EAyWMEyDkQ4J5YD3yg2GnVSe/wCRxQCw" +
                    "h+tcrL+wca6zHHh91QYsCTey5bHFjkcQGg3I1j2aoxdqG2qi7tNV1+aFf/UTabS5uyx2rM1ABg6" +
                    "58Dmc6ZnKYywun1giF/2GY9u7E0Mwz+2me0+NWEcoG9gjdHiOaqKgiz4NfkdocCN13KogXEYKs1" +
                    "3akRn1Jp86du9LtMibMA0LYZT5oakDlJpPKRhsNkGLY0Cn8Y+WDF6c2Ps3VZTXh6XrJ9uSTPmso" +
                    "34/KSHaxZCMGs0kV5RkasZW8SSUOJ8dV2I7a/a5COqpt2W4bjAAJ46hKFP56c4ghveMWbhUJaSB" +
                    "lnOkc/hxwprjK/cYtrbgxnHLB3ao48tbv+ONx+BcFCip5SOlBubZUVXablFDRyr+G1dPgO7ey21" +
                    "tC8thbMrQSaln6KRC/Z4tNcpxU8FBVSFyjiOUCB34Gdzc9x/3DUZDkNRF+6eOYlBQEMfh4+cqGG" +
                    "MrTc/mc/IrlUvk+R+5tT5mbVpaXRGauoVNHiqyjKNNOFNPKcEKgggEzOZ4z935Rj//2Q==",

    Azeron:         "/9j/4AAQSkZJRgABAgAAZABkAAD/7AARRHVja3kAAQAEAAAAVQAA/+4ADkFkb2JlAGTAAAAAAf/" +
                    "bAIQAAgEBAQEBAgEBAgMCAQIDAwICAgIDAwMDAwMDAwQDBAQEBAMEBAUGBgYFBAcHCAgHBwoKCg" +
                    "oKDAwMDAwMDAwMDAECAgIEAwQHBAQHCggHCAoMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMD" +
                    "AwMDAwMDAwMDAwMDAwMDAwMDAwM/8AAEQgAFgAWAwERAAIRAQMRAf/EAGsAAQEAAAAAAAAAAAAA" +
                    "AAAAAAgJAQEBAQAAAAAAAAAAAAAAAAABAgMQAAEDAgUCBAYDAAAAAAAAAAIBAwQFBhESEwcIABQ" +
                    "xIhUJIUEyQmIWM0QXEQEBAQADAAAAAAAAAAAAAAABABEhQQL/2gAMAwEAAhEDEQA/AI58ethnb+" +
                    "kS7muKYUSgQybdmTnm+67dJJuJGjx4zhgD0p9GjNEcXTbbTOSEpCPUgZUtQmkeyg5upxKp3J7ba" +
                    "7JFZ20lNKNZkxKhT6y9bcgSVsm6zRXKZAJsRVMSKM6mAqhCuCoqmkQKkcMNzInKuPxvbZYW5Jb5" +
                    "xXAOe8FLBoI3qQzxl4K6UE4grJT4auQTb/kHFVCRml7Hd+bQ29cb8vda2ot47bNSDC8qBLjsSXD" +
                    "oNaokOjJPjg+ipnhS6caIqYKhYChCpovQmkdyZ5Pcsmvbkvxqwfb8u+3K9wfuejzQl0ZuSFWkTp" +
                    "tRh+nzv2lpQizYzzSGgxQzNoIj5kVVLqPPnGVgPflyy6tyusymwHsLzp1DKmzFzojpyW6XXagUf" +
                    "H5ugxUWW8vjmPL4ph1qwR64hv8AJWDudETjzHkzrncfmDC9MeBh5oEbRZhEUsCY7XTypISQCsYY" +
                    "ZsFyr0DxKSOu+8eXs15+E1alIj30KFqSaa5bLEwzRP67hVWe1qL9uhHQsfowXp2MiJJlbpf6jGq" +
                    "VRjJ+4ec6fTiORn1O4LOAGha3caubFVPV1fzwToWcv//Z"
};

/* This section is added to allow Advanced Optimisation by the Closure Compiler */
/*jslint sub: true */
window['caap'] = image64;
image64['Ambrosia'] = image64.Ambrosia;
image64['Malekus'] = image64.Malekus;
image64['Corvintheus'] = image64.Corvintheus;
image64['Aurora'] = image64.Aurora;
image64['Azeron'] = image64.Azeron;
/*jslint sub: false */

////////////////////////////////////////////////////////////////////
//                          config OBJECT
// this is the main object for dealing with user options
/////////////////////////////////////////////////////////////////////

config = {
    options: {},

    load: function () {
        try {
            config.options = gm.getItem('config.options', 'default');
            if (config.options === 'default' || !$j.isPlainObject(config.options)) {
                config.options = gm.setItem('config.options', {});
            }

            $u.log(5, "config.load", config.options);
            return true;
        } catch (err) {
            $u.error("ERROR in config.load: " + err);
            return false;
        }
    },

    save: function (force) {
        try {
            gm.setItem('config.options', config.options);
            $u.log(5, "config.save", config.options);
            return true;
        } catch (err) {
            $u.error("ERROR in config.save: " + err);
            return false;
        }
    },

    setItem: function (name, value) {
        try {
            if (typeof name !== 'string' || name === '') {
                throw "Invalid identifying name!";
            }

            if (value === undefined || value === null) {
                throw "Value supplied is 'undefined' or 'null'!";
            }

            config.options[name] = value;
            config.save();
            return value;
        } catch (err) {
            $u.error("ERROR in config.setItem: " + err);
            return undefined;
        }
    },

    getItem: function (name, value) {
        try {
            var item;
            if (typeof name !== 'string' || name === '') {
                throw "Invalid identifying name!";
            }

            item = config.options[name];
            if ((item === undefined || item === null) && value !== undefined && value !== null) {
                item = value;
            }

            if (item === undefined || item === null) {
                $u.warn("config.getItem returned 'undefined' or 'null' for", name);
            }

            return item;
        } catch (err) {
            $u.error("ERROR in config.getItem: " + err);
            return undefined;
        }
    },

    getList: function (name, value) {
        try {
            var item = [];
            if (typeof name !== 'string' || name === '') {
                throw "Invalid identifying name!";
            }

            item = config.getItem(name, value).toArray();
            return item;
        } catch (err) {
            $u.error("ERROR in config.getArray: " + err);
            return undefined;
        }
    },

    deleteItem: function (name) {
        try {
            if (typeof name !== 'string' || name === '') {
                throw "Invalid identifying name!";
            }

            if (config.options[name] === undefined || config.options[name] === null) {
                $u.warn("config.deleteItem - Invalid or non-existant flag: ", name);
            }

            delete config.options[name];
            return true;
        } catch (err) {
            $u.error("ERROR in config.deleteItem: " + err);
            return false;
        }
    }
};

////////////////////////////////////////////////////////////////////
//                          state OBJECT
// this is the main object for dealing with state flags
/////////////////////////////////////////////////////////////////////

state = {
    flags: {},

    load: function () {
        try {
            state.flags = gm.getItem('state.flags', 'default');
            if (state.flags === 'default' || !$j.isPlainObject(state.flags)) {
                state.flags = gm.setItem('state.flags', {});
            }

            $u.log(5, "state.load", state.flags);
            return true;
        } catch (err) {
            $u.error("ERROR in state.load: " + err);
            return false;
        }
    },

    save: function (force) {
        try {
            if (!force) {
                if (!schedule.check('StateSave')) {
                    return false;
                }
            }

            gm.setItem('state.flags', state.flags);
            $u.log(5, "state.save", state.flags);
            schedule.setItem('StateSave', 1);
            return true;
        } catch (err) {
            $u.error("ERROR in state.save: " + err);
            return false;
        }
    },

    setItem: function (name, value) {
        try {
            if (typeof name !== 'string' || name === '') {
                throw "Invalid identifying name!";
            }

            if (value === undefined || value === null) {
                throw "Value supplied is 'undefined' or 'null'!";
            }

            state.flags[name] = value;
            state.save();
            return value;
        } catch (err) {
            $u.error("ERROR in state.setItem: " + err);
            return undefined;
        }
    },

    getItem: function (name, value) {
        try {
            var item;
            if (typeof name !== 'string' || name === '') {
                throw "Invalid identifying name!";
            }

            item = state.flags[name];
            if ((item === undefined || item === null) && value !== undefined && value !== null) {
                item = value;
            }

            if (item === undefined || item === null) {
                $u.warn("state.getItem returned 'undefined' or 'null' for", name);
            }

            return item;
        } catch (err) {
            $u.error("ERROR in state.getItem: " + err);
            return undefined;
        }
    },

    deleteItem: function (name) {
        try {
            if (typeof name !== 'string' || name === '') {
                throw "Invalid identifying name!";
            }

            if (state.flags[name] === undefined || state.flags[name] === null) {
                $u.warn("state.deleteItem - Invalid or non-existant flag: ", name);
            }

            delete state.flags[name];
            return true;
        } catch (err) {
            $u.error("ERROR in state.deleteItem: " + err);
            return false;
        }
    }
};

////////////////////////////////////////////////////////////////////
//                          css OBJECT
// this is the object for inline css
/////////////////////////////////////////////////////////////////////

css = {
    AddCSS: function () {
        try {
            var href = window.location.href;
            if (href.indexOf('apps.facebook.com/castle_age') >= 0 || href.indexOf('apps.facebook.com/reqs.php') >= 0) {
                if (!$j('link[href*="jquery-ui.css"').length) {
                    $j("<link>").appendTo("head").attr({
                        rel: "stylesheet",
                        type: "text/css",
                        href: "http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.6/themes/smoothness/jquery-ui.css"
                    });
                }

                $j("<style type='text/css'>" + css.farbtastic + "</style>").appendTo("head");
            }

            return true;
        } catch (err) {
            css.error("ERROR in AddCSS: " + err);
            return false;
        }
    },

    farbtastic: ".farbtastic {" +
                "  position: relative;" +
                "}" +
                ".farbtastic * {" +
                "  position: absolute;" +
                "  cursor: crosshair;" +
                "}" +
                ".farbtastic, .farbtastic .wheel {" +
                "  width: 195px;" +
                "  height: 195px;" +
                "}" +
                ".farbtastic .color, .farbtastic .overlay {" +
                "  top: 47px;" +
                "  left: 47px;" +
                "  width: 101px;" +
                "  height: 101px;" +
                "}" +
                ".farbtastic .wheel {" +
                "  background: url(data:image/png;base64," + image64.wheel + ") no-repeat;" +
                "  width: 195px;" +
                "  height: 195px;" +
                "}" +
                ".farbtastic .overlay {" +
                "  background: url(data:image/png;base64," + image64.mask + ") no-repeat;" +
                "}" +
                ".farbtastic .marker {" +
                "  width: 17px;" +
                "  height: 17px;" +
                "  margin: -8px 0 0 -8px;" +
                "  overflow: hidden;" +
                "  background: url(data:image/png;base64," + image64.marker + ") no-repeat;" +
                "}"
};

////////////////////////////////////////////////////////////////////
//                          sort OBJECT
// this is the main object for dealing with sort routines
/////////////////////////////////////////////////////////////////////

sort = {
    order: function () {
        this.data = {
            'reverse': {
                'a': false,
                'b': false,
                'c': false
            },
            'value': {
                'a': '',
                'b': '',
                'c': ''
            }
        };
    },

    dialog: {},

    form: function (id, list, records) {
        try {
            var html = '',
                it   = 0,
                it1  = 0,
                len1 = 0;

            if (!sort.dialog[id] || !sort.dialog[id].length) {
                list.unshift("");
                html += "<p>Sort by ...</p>";
                for (it = 0; it < 3; it += 1) {
                    html += "<div style='padding-bottom: 30px;'>";
                    html += "<div style='float: left; padding-right: 30px;'>";
                    html += "<form id='form" + it + "'>";
                    html += "<input type='radio' id='asc" + it + "' name='reverse' value='false' checked /> Ascending<br />";
                    html += "<input type='radio' id='des" + it + "' name='reverse' value='true' /> Descending";
                    html += "</form>";
                    html += "</div>";
                    html += "<div>";
                    html += "<select id='select" + it + "'>";
                    for (it1 = 0, len1 = list.length; it1 < len1; it1 += 1) {
                        html += "<option value='" + list[it1] + "'>" + list[it1] + "</option>";
                    }

                    html += "</select>";
                    html += "</div>";
                    html += "</div>";
                    if (it < 2) {
                        html += "<p>Then by ...</p>";
                    }
                }

                sort.dialog[id] = $j('<div id="sort_form_' + id + '" title="Sort ' + id + '">' + html + '</div>').appendTo(window.document.body);
                sort.dialog[id].dialog({
                    buttons: {
                        "Sort": function () {
                            sort.getForm(id, records);
                            $j(this).dialog("close");
                        },
                        "Cancel": function () {
                            $j(this).dialog("close");
                        }
                    }
                });
            } else {
                sort.dialog[id].dialog("open");
            }

            sort.updateForm(id);
            return true;
        } catch (err) {
            $u.error("ERROR in sort.form: " + err);
            return false;
        }
    },

    /* This section is formatted to allow Advanced Optimisation by the Closure Compiler */
    /*jslint sub: true */
    getForm: function (id, records) {
        try {
            var order = new sort.order();
            if (sort.dialog[id] && sort.dialog[id].length) {
                order.data['reverse']['a'] = $j("#form0 input[name='reverse']:checked", sort.dialog[id]).val() === "true" ? true : false;
                order.data['reverse']['b'] = $j("#form1 input[name='reverse']:checked", sort.dialog[id]).val() === "true" ? true : false;
                order.data['reverse']['c'] = $j("#form2 input[name='reverse']:checked", sort.dialog[id]).val() === "true" ? true : false;
                order.data['value']['a'] = $j("#select0 option:selected", sort.dialog[id]).val();
                order.data['value']['b'] = $j("#select1 option:selected", sort.dialog[id]).val();
                order.data['value']['c'] = $j("#select2 option:selected", sort.dialog[id]).val();
                records.sort($u.sortBy(order.data['reverse']['a'], order.data['value']['a'], $u.sortBy(order.data['reverse']['b'], order.data['value']['b'], $u.sortBy(order.data['reverse']['c'], order.data['value']['c']))));
                state.setItem(id + "Sort", order);
                state.setItem(id + "DashUpdate", true);
                caap.UpdateDashboard(true);
            } else {
                $u.warn("Dialog for getForm not found", id);
            }

            return order.data;
        } catch (err) {
            $u.error("ERROR in sort.getForm: " + err);
            return undefined;
        }
    },

    updateForm: function (id) {
        try {
            var order = new sort.order();
            if (sort.dialog[id] && sort.dialog[id].length) {
                $j.extend(true, order.data, state.getItem(id + "Sort", order));
                $j("#form0 input", sort.dialog[id]).val([order.data['reverse']['a']]);
                $j("#form1 input", sort.dialog[id]).val([order.data['reverse']['b']]);
                $j("#form2 input", sort.dialog[id]).val([order.data['reverse']['c']]);
                $j("#select0", sort.dialog[id]).val(order.data['value']['a']);
                $j("#select1", sort.dialog[id]).val(order.data['value']['b']);
                $j("#select2", sort.dialog[id]).val(order.data['value']['c']);
            } else {
                $u.warn("Dialog for updateForm not found", id, sort.dialog[id]);
            }

            return true;
        } catch (err) {
            $u.error("ERROR in sort.updateForm: " + err);
            return false;
        }
    }
    /*jslint sub: false */
};

////////////////////////////////////////////////////////////////////
//                          schedule OBJECT
// this is the main object for dealing with scheduling and timers
/////////////////////////////////////////////////////////////////////

schedule = {
    timers: {},

    load: function () {
        try {
            schedule.timers = gm.getItem('schedule.timers', 'default');
            if (schedule.timers === 'default' || !$j.isPlainObject(schedule.timers)) {
                schedule.timers = gm.setItem('schedule.timers', {});
            }

            $u.log(5, "schedule.load", schedule.timers);
            return true;
        } catch (err) {
            $u.error("ERROR in schedule.load: " + err);
            return false;
        }
    },

    save: function (force) {
        try {
            gm.setItem('schedule.timers', schedule.timers);
            $u.log(5, "schedule.save", schedule.timers);
            return true;
        } catch (err) {
            $u.error("ERROR in schedule.save: " + err);
            return false;
        }
    },

    setItem: function (name, seconds, randomSecs) {
        try {
            var now = 0;
            if (typeof name !== 'string' || name === '') {
                throw "Invalid identifying name! (" + name + ")";
            }

            if (!$u.isNum(seconds) || seconds < 0) {
                throw "Invalid number of seconds supplied for (" + name + ") (" + seconds + ")";
            }

            if (!$u.isNum(randomSecs) || randomSecs < 0) {
                randomSecs = 0;
            }

            now = new Date().getTime();
            schedule.timers[name] = {
                'last': now,
                'next': now + (seconds * 1000) + (Math.floor(Math.random() * randomSecs) * 1000)
            };

            schedule.save();
            return schedule.timers[name];
        } catch (err) {
            $u.error("ERROR in schedule.setItem: " + err);
            return undefined;
        }
    },

    getItem: function (name) {
        try {
            if (typeof name !== 'string' || name === '') {
                throw "Invalid identifying name! (" + name + ")";
            }

            if (!$j.isPlainObject(schedule.timers[name])) {
                $u.warn("Invalid or non-existant timer!", name);
                return 0;
            }

            return schedule.timers[name];
        } catch (err) {
            $u.error("ERROR in schedule.getItem: " + err);
            return undefined;
        }
    },

    deleteItem: function (name) {
        try {
            if (typeof name !== 'string' || name === '') {
                throw "Invalid identifying name! (" + name + ")";
            }

            if (!$j.isPlainObject(schedule.timers[name])) {
                $u.warn("schedule.deleteItem - Invalid or non-existant timer: ", name);
            }

            delete schedule.timers[name];
            return true;
        } catch (err) {
            $u.error("ERROR in schedule.deleteItem: " + err);
            return false;
        }
    },

    /* This section is formatted to allow Advanced Optimisation by the Closure Compiler */
    /*jslint sub: true */
    check: function (name) {
        try {
            var scheduled = false;
            if (typeof name !== 'string' || name === '') {
                throw "Invalid identifying name! (" + name + ")";
            }

            if (!$j.isPlainObject(schedule.timers[name])) {
                if ($u.get_log_level > 2) {
                    $u.warn("Invalid or non-existant timer!", name);
                }

                scheduled = true;
            } else if (schedule.timers[name]['next'] < new Date().getTime()) {
                scheduled = true;
            }

            return scheduled;
        } catch (err) {
            $u.error("ERROR in schedule.check: " + err);
            return false;
        }
    },

    since: function (name_or_number, seconds) {
        try {
            var value = 0;
            if (isNaN(name_or_number)) {
                if (typeof name_or_number !== 'string' || name_or_number === '') {
                    throw "Invalid identifying name! (" + name_or_number + ")";
                }

                if (!$j.isPlainObject(schedule.timers[name_or_number])) {
                    if ($u.get_log_level > 2) {
                        $u.warn("Invalid or non-existant timer!", name_or_number);
                    }
                } else {
                    value = schedule.timers[name_or_number]['last'];
                }
            } else {
                value = name_or_number;
            }

            return (value < (new Date().getTime() - 1000 * seconds));
        } catch (err) {
            $u.error("ERROR in schedule.since: " + err, arguments.callee.caller);
            return false;
        }
    },
    /*jslint sub: false */

    oneMinuteUpdate: function (funcName) {
        try {
            if (!state.getItem('reset' + funcName) && !schedule.check(funcName + 'Timer')) {
                return false;
            }

            schedule.setItem(funcName + 'Timer', 60);
            state.setItem('reset' + funcName, false);
            return true;
        } catch (err) {
            $u.error("ERROR in schedule.oneMinuteUpdate: " + err);
            return undefined;
        }
    },

    FormatTime: function (time) {
        try {
            var d_names = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
                t_day   = time.getDay(),
                t_hour  = time.getHours(),
                t_min   = time.getMinutes(),
                a_p     = "PM";

            if (config.getItem("use24hr", true)) {
                t_hour = t_hour + "";
                if (t_hour && t_hour.length === 1) {
                    t_hour = "0" + t_hour;
                }

                t_min = t_min + "";
                if (t_min && t_min.length === 1) {
                    t_min = "0" + t_min;
                }

                return d_names[t_day] + " " + t_hour + ":" + t_min;
            } else {
                if (t_hour < 12) {
                    a_p = "AM";
                }

                if (t_hour === 0) {
                    t_hour = 12;
                }

                if (t_hour > 12) {
                    t_hour = t_hour - 12;
                }

                t_min = t_min + "";
                if (t_min && t_min.length === 1) {
                    t_min = "0" + t_min;
                }

                return d_names[t_day] + " " + t_hour + ":" + t_min + " " + a_p;
            }
        } catch (err) {
            $u.error("ERROR in FormatTime: " + err);
            return "Time Err";
        }
    },

    /* This section is formatted to allow Advanced Optimisation by the Closure Compiler */
    /*jslint sub: true */
    display: function (name) {
        try {
            var formatted = '';
            if (typeof name !== 'string' || name === '') {
                throw "Invalid identifying name!";
            }

            if (!$j.isPlainObject(schedule.timers[name])) {
                if ($u.get_log_level > 2) {
                    $u.warn("Invalid or non-existant timer!", name);
                }

                formatted = schedule.FormatTime(new Date());
            } else {
                formatted = schedule.FormatTime(new Date(schedule.timers[name]['next']));
            }

            return formatted;
        } catch (err) {
            $u.error("ERROR in schedule.display: " + err);
            return false;
        }
    }
    /*jslint sub: false */
};

////////////////////////////////////////////////////////////////////
//                          general OBJECT
// this is the main object for dealing with Generals
/////////////////////////////////////////////////////////////////////

general = {
    records: [],

    recordsSortable: [],

    /* This section is formatted to allow Advanced Optimisation by the Closure Compiler */
    /*jslint sub: true */
    record: function () {
        this.data = {
            'name'       : '',
            'img'        : '',
            'lvl'        : 0,
            'last'       : new Date().getTime() - (24 * 3600000),
            'special'    : '',
            'atk'        : 0,
            'def'        : 0,
            'api'        : 0,
            'dpi'        : 0,
            'mpi'        : 0,
            'eatk'       : 0,
            'edef'       : 0,
            'eapi'       : 0,
            'edpi'       : 0,
            'empi'       : 0,
            'energyMax'  : 0,
            'staminaMax' : 0,
            'healthMax'  : 0
        };
    },

    copy2sortable: function () {
        try {
            var order = new sort.order();
            $j.extend(true, order.data, state.getItem("GeneralsSort", order.data));
            general.recordsSortable = [];
            $j.merge(general.recordsSortable, general.records);
            general.recordsSortable.sort($u.sortBy(order.data['reverse']['a'], order.data['value']['a'], $u.sortBy(order.data['reverse']['b'], order.data['value']['b'], $u.sortBy(order.data['reverse']['c'], order.data['value']['c']))));
            return true;
        } catch (err) {
            $u.error("ERROR in general.copy2sortable: " + err);
            return false;
        }
    },
    /*jslint sub: false */

    hbest: false,

    load: function () {
        try {
            general.records = gm.getItem('general.records', 'default');
            if (general.records === 'default' || !$j.isArray(general.records)) {
                general.records = gm.setItem('general.records', []);
            }

            general.copy2sortable();
            general.BuildlLists();
            general.hbest = JSON.hbest(general.records);
            $u.log(2, "general.load Hbest", general.hbest);
            state.setItem("GeneralsDashUpdate", true);
            $u.log(5, "general.load", general.records);
            return true;
        } catch (err) {
            $u.error("ERROR in general.load: " + err);
            return false;
        }
    },

    save: function () {
        try {
            var compress = false;
            gm.setItem('general.records', general.records, general.hbest, compress);
            state.setItem("GeneralsDashUpdate", true);
            $u.log(5, "general.save", general.records);
            return true;
        } catch (err) {
            $u.error("ERROR in general.save: " + err);
            return false;
        }
    },

    /* This section is formatted to allow Advanced Optimisation by the Closure Compiler */
    /*jslint sub: true */
    find: function (generalName) {
        try {
            var it    = 0,
                len   = 0,
                found = false;

            for (it = 0, len = general.records.length; it < len; it += 1) {
                if (general.records[it]['name'] === generalName) {
                    found = true;
                    break;
                }
            }

            if (!found) {
                $u.warn("Unable to find 'General' record");
                return false;
            }

            return general.records[it];
        } catch (err) {
            $u.error("ERROR in general.find: " + err);
            return false;
        }
    },

    GetNames: function () {
        try {
            var it    = 0,
                len   = 0,
                names = [];

            for (it = 0, len = general.records.length; it < len; it += 1) {
                names.push(general.records[it]['name']);
            }

            return names.sort();
        } catch (err) {
            $u.error("ERROR in general.GetNames: " + err);
            return false;
        }
    },

    GetImage: function (generalName) {
        try {
            var genImg = general.find(generalName);

            if (genImg === false) {
                $u.warn("Unable to find 'General' image");
                genImg = '';
            } else {
                genImg = genImg['img'];
            }

            return genImg;
        } catch (err) {
            $u.error("ERROR in general.GetImage: " + err);
            return false;
        }
    },

    GetStaminaMax: function (generalName) {
        try {
            var genStamina = general.find(generalName);

            if (genStamina === false) {
                $u.warn("Unable to find 'General' stamina");
                genStamina = 0;
            } else {
                genStamina = genStamina['staminaMax'];
            }

            return genStamina;
        } catch (err) {
            $u.error("ERROR in general.GetStaminaMax: " + err);
            return false;
        }
    },

    GetEnergyMax: function (generalName) {
        try {
            var genEnergy = general.find(generalName);

            if (genEnergy === false) {
                $u.warn("Unable to find 'General' energy");
                genEnergy = 0;
            } else {
                genEnergy = genEnergy['energyMax'];
            }

            return genEnergy;
        } catch (err) {
            $u.error("ERROR in general.GetEnergyMax: " + err);
            return false;
        }
    },

    GetHealthMax: function (generalName) {
        try {
            var genHealth = general.find(generalName);

            if (genHealth === false) {
                $u.warn("Unable to find 'General' health");
                genHealth = 0;
            } else {
                genHealth = genHealth['healthMax'];
            }

            return genHealth;
        } catch (err) {
            $u.error("ERROR in general.GetHealthMax: " + err);
            return false;
        }
    },

    GetLevel: function (generalName) {
        try {
            var genLevel = general.find(generalName);

            if (genLevel === false) {
                $u.warn("Unable to find 'General' level");
                genLevel = 1;
            } else {
                genLevel = genLevel['lvl'];
            }

            return genLevel;
        } catch (err) {
            $u.error("ERROR in general.GetLevel: " + err);
            return false;
        }
    },

    GetLevelUpNames: function () {
        try {
            var it    = 0,
                len   = 0,
                names = [];

            for (it = 0, len = general.records.length; it < len; it += 1) {
                if (general.records[it]['lvl'] < 4) {
                    names.push(general.records[it]['name']);
                }
            }

            return names;
        } catch (err) {
            $u.error("ERROR in general.GetLevelUpNames: " + err);
            return false;
        }
    },
    /*jslint sub: false */

    List: [],

    BuyList: [],

    IncomeList: [],

    BankingList: [],

    CollectList: [],

    StandardList: [
        'Idle',
        'Monster',
        'Fortify',
        'GuildMonster',
        'Invade',
        'Duel',
        'War',
        'SubQuest',
        'Arena'
    ],

    BuildlLists: function () {
        try {
            $u.log(3, 'Building Generals Lists');
            general.List = [
                'Use Current',
                'Under Level 4'
            ].concat(general.GetNames());

            var crossList = function (checkItem) {
                return (general.List.indexOf(checkItem) >= 0);
            };

            general.BuyList = [
                'Use Current',
                'Darius',
                'Lucius',
                'Garlan',
                'Penelope'
            ].filter(crossList);

            general.IncomeList = [
                'Use Current',
                'Scarlett',
                'Mercedes',
                'Cid'
            ].filter(crossList);

            general.BankingList = [
                'Use Current',
                'Aeris'
            ].filter(crossList);

            general.CollectList = [
                'Use Current',
                'Angelica',
                'Morrigan'
            ].filter(crossList);

            return true;
        } catch (err) {
            $u.error("ERROR in general.BuildlLists: " + err);
            return false;
        }
    },

    GetCurrent: function () {
        try {
            var generalName = '',
                tStr        = '',
                nameObj     = $j();

            nameObj = $j("#app46755028429_equippedGeneralContainer .general_name_div3");
            if (nameObj) {
                tStr = nameObj.text();
                generalName = tStr ? tStr.trim().stripTRN().stripStar() : '';
            }

            if (!generalName) {
                $u.warn("Couldn't get current 'General'. Will use current 'General'", generalName);
                return 'Use Current';
            }

            $u.log(4, "Current General", generalName);
            return generalName;
        } catch (err) {
            $u.error("ERROR in general.GetCurrent: " + err);
            return 'Use Current';
        }
    },

    /* This section is formatted to allow Advanced Optimisation by the Closure Compiler */
    /*jslint sub: true */
    GetGenerals: function () {
        try {
            var generalsDiv = $j(".generalSmallContainer2"),
                update      = false,
                save        = false,
                tempObj     = $j();

            if (generalsDiv.length) {
                generalsDiv.each(function (index) {
                    var newGeneral = new general.record(),
                        tStr       = '',
                        name       = '',
                        img        = '',
                        level      = 0,
                        atk        = 0,
                        def        = 0,
                        special    = '',
                        container  = $j(this),
                        it         = 0,
                        len        = 0;

                    tempObj = container.find(".general_name_div3");
                    if (tempObj && tempObj.length) {
                        tStr = tempObj.text();
                        name = tStr ? tStr.stripTRN().stripStar() : '';
                    } else {
                        $u.warn("Unable to find 'name' container", index);
                    }

                    tempObj = container.find(".imgButton");
                    if (tempObj && tempObj.length) {
                        tStr = tempObj.attr("src");
                        img = tStr ? tStr.filepart() : '';
                    } else {
                        $u.warn("Unable to find 'image' container", index);
                    }

                    tempObj = container.children().eq(3);
                    if (tempObj && tempObj.length) {
                        tStr = tempObj.text();
                        level = tStr ? tStr.replace(/Level /gi, '').stripTRN().parseInt() : 0;
                    } else {
                        $u.warn("Unable to find 'level' container", index);
                    }

                    tempObj = container.children().eq(4);
                    if (tempObj && tempObj.length) {
                        tStr = tempObj.html();
                        tStr = tStr ? tStr.replace(/<br>/g, ' ') : '';
                        tStr = $j(tStr).text();
                        special = tStr ? tStr.trim() : '';
                    } else {
                        $u.warn("Unable to find 'special' container", index);
                    }

                    tempObj = container.find(".generals_indv_stats_padding div");
                    if (tempObj && tempObj.length === 2) {
                        tStr = tempObj.eq(0).text();
                        atk = tStr ? tStr.parseInt() : 0;
                        tStr = tempObj.eq(1).text();
                        def = tStr ? tStr.parseInt() : 0;
                    } else {
                        $u.warn("Unable to find 'attack and defence' containers", index);
                    }

                    if (name && img && level && !isNaN(atk) && !isNaN(def) && special) {
                        for (it = 0, len = general.records.length; it < len; it += 1) {
                            if (general.records[it]['name'] === name) {
                                newGeneral.data = general.records[it];
                                break;
                            }
                        }

                        newGeneral.data['name'] = name;
                        newGeneral.data['img'] = img;
                        newGeneral.data['lvl'] = level;
                        newGeneral.data['atk'] = atk;
                        newGeneral.data['def'] = def;
                        newGeneral.data['api'] = (atk + (def * 0.7)).dp(2);
                        newGeneral.data['dpi'] = (def + (atk * 0.7)).dp(2);
                        newGeneral.data['mpi'] = ((newGeneral.data['api'] + newGeneral.data['dpi']) / 2).dp(2);
                        newGeneral.data['special'] = special;
                        if (it < len) {
                            general.records[it] = newGeneral.data;
                        } else {
                            $u.log(1, "Adding new 'General'", newGeneral.data['name']);
                            general.records.push(newGeneral.data);
                            update = true;
                        }

                        save = true;
                    } else {
                        $u.warn("Missing required 'General' attribute", index);
                    }
                });

                if (save) {
                    caap.stats['generals']['total'] = general.records.length;
                    caap.stats['generals']['invade'] = Math.min((caap.stats['army']['actual'] / 5).dp(), general.records.length);
                    general.save();
                    caap.SaveStats();
                    general.copy2sortable();
                    if (update) {
                        general.UpdateDropDowns();
                    }
                }

                $u.log(3, "general.GetGenerals", general.records);
            }

            return true;
        } catch (err) {
            $u.error("ERROR in general.GetGenerals: " + err);
            return false;
        }
    },
    /*jslint sub: false */

    UpdateDropDowns: function () {
        try {
            var it  = 0,
                len = 0;

            general.BuildlLists();
            $u.log(2, "Updating 'General' Drop Down Lists");
            for (it = 0, len = general.StandardList.length; it < len; it += 1) {
                caap.ChangeDropDownList(general.StandardList[it] + 'General', general.List, config.getItem(general.StandardList[it] + 'General', 'Use Current'));
            }

            caap.ChangeDropDownList('BuyGeneral', general.BuyList, config.getItem('BuyGeneral', 'Use Current'));
            caap.ChangeDropDownList('IncomeGeneral', general.IncomeList, config.getItem('IncomeGeneral', 'Use Current'));
            caap.ChangeDropDownList('BankingGeneral', general.BankingList, config.getItem('BankingGeneral', 'Use Current'));
            caap.ChangeDropDownList('CollectGeneral', general.CollectList, config.getItem('CollectGeneral', 'Use Current'));
            caap.ChangeDropDownList('LevelUpGeneral', general.List, config.getItem('LevelUpGeneral', 'Use Current'));
            return true;
        } catch (err) {
            $u.error("ERROR in general.UpdateDropDowns: " + err);
            return false;
        }
    },

    Clear: function (whichGeneral) {
        try {
            $u.log(1, 'Setting ' + whichGeneral + ' to "Use Current"');
            config.setItem(whichGeneral, 'Use Current');
            general.UpdateDropDowns();
            return true;
        } catch (err) {
            $u.error("ERROR in general.Clear: " + err);
            return false;
        }
    },

    /* This section is formatted to allow Advanced Optimisation by the Closure Compiler */
    /*jslint sub: true */
    LevelUpCheck: function (whichGeneral) {
        try {
            var generalType = '',
                use         = false,
                keepGeneral = false;

            generalType = whichGeneral ? whichGeneral.replace(/General/i, '').trim() : '';
            if ((caap.stats['staminaT']['num'] > caap.stats['stamina']['max'] || caap.stats['energyT']['num'] > caap.stats['energy']['max']) && state.getItem('KeepLevelUpGeneral', false)) {
                if (config.getItem(generalType + 'LevelUpGeneral', false)) {
                    $u.log(2, "Keep Level Up General");
                    keepGeneral = true;
                } else {
                    $u.warn("User opted out of keep level up general for", generalType);
                }
            } else if (state.getItem('KeepLevelUpGeneral', false)) {
                $u.log(1, "Clearing Keep Level Up General flag");
                state.setItem('KeepLevelUpGeneral', false);
            }

            if (config.getItem('LevelUpGeneral', 'Use Current') !== 'Use Current' && (general.StandardList.indexOf(generalType) >= 0 || generalType === 'Quest')) {
                if (keepGeneral || (config.getItem(generalType + 'LevelUpGeneral', false) && caap.stats['exp']['dif'] && caap.stats['exp']['dif'] <= config.getItem('LevelUpGeneralExp', 0))) {
                    use = true;
                }
            }

            return use;
        } catch (err) {
            $u.error("ERROR in general.LevelUpCheck: " + err);
            return undefined;
        }
    },
    /*jslint sub: false */

    Select: function (whichGeneral) {
        try {
            var generalName       = '',
                getCurrentGeneral = '',
                currentGeneral    = '',
                generalImage      = '',
                levelUp           = general.LevelUpCheck(whichGeneral);

            if (levelUp) {
                whichGeneral = 'LevelUpGeneral';
                $u.log(2, 'Using level up general');
            }

            generalName = config.getItem(whichGeneral, 'Use Current');
            if (!generalName || /use current/i.test(generalName)) {
                return false;
            }

            if (!levelUp && /under level 4/i.test(generalName)) {
                if (!general.GetLevelUpNames().length) {
                    return general.Clear(whichGeneral);
                }

                if (config.getItem('ReverseLevelUpGenerals')) {
                    generalName = general.GetLevelUpNames().reverse().pop();
                } else {
                    generalName = general.GetLevelUpNames().pop();
                }
            }

            getCurrentGeneral = general.GetCurrent();
            if (!getCurrentGeneral) {
                caap.ReloadCastleAge();
            }

            currentGeneral = getCurrentGeneral;
            if (generalName.indexOf(currentGeneral) >= 0) {
                return false;
            }

            $u.log(1, 'Changing from ' + currentGeneral + ' to ' + generalName);
            if (caap.NavigateTo('mercenary,generals', 'tab_generals_on.gif')) {
                return true;
            }

            generalImage = general.GetImage(generalName);
            if (caap.CheckForImage(generalImage)) {
                return caap.NavigateTo(generalImage);
            }

            caap.SetDivContent('Could not find ' + generalName);
            $u.warn('Could not find', generalName, generalImage);
            if (config.getItem('ignoreGeneralImage', true)) {
                return false;
            } else {
                return general.Clear(whichGeneral);
            }
        } catch (err) {
            $u.error("ERROR in general.Select: " + err);
            return false;
        }
    },

    quickSwitch: false,

    /* This section is formatted to allow Advanced Optimisation by the Closure Compiler */
    /*jslint sub: true */
    GetEquippedStats: function () {
        try {
            var generalName  = general.GetCurrent(),
                tStr         = '',
                it           = 0,
                len          = 0,
                generalDiv   = $j(),
                tempObj      = $j(),
                success      = false;

            if (generalName === 'Use Current') {
                return false;
            }

            $u.log(2, "Equipped 'General'", generalName);
            for (it = 0, len = general.records.length; it < len; it += 1) {
                if (general.records[it]['name'] === generalName) {
                    break;
                }
            }

            if (it >= len) {
                $u.warn("Unable to find 'General' record");
                return false;
            }

            generalDiv = $j("#app46755028429_equippedGeneralContainer .generals_indv_stats div");
            if (generalDiv && generalDiv.length === 2) {
                tempObj = generalDiv.eq(0);
                if (tempObj && tempObj.length) {
                    tStr = tempObj.text();
                    general.records[it]['eatk'] = tStr ? tStr.parseInt() : 0;
                    tempObj = generalDiv.eq(1);
                    if (tempObj && tempObj.length) {
                        tStr = tempObj.text();
                        general.records[it]['edef'] = tStr ? tStr.parseInt() : 0;
                        success = true;
                    } else {
                        $u.warn("Unable to get 'General' defense object");
                    }
                } else {
                    $u.warn("Unable to get 'General' attack object");
                }

                if (success) {
                    general.records[it]['eapi'] = (general.records[it]['eatk'] + (general.records[it]['edef'] * 0.7)).dp(2);
                    general.records[it]['edpi'] = (general.records[it]['edef'] + (general.records[it]['eatk'] * 0.7)).dp(2);
                    general.records[it]['empi'] = ((general.records[it]['eapi'] + general.records[it]['edpi']) / 2).dp(2);
                    general.records[it]['energyMax'] = caap.stats['energyT']['max'];
                    general.records[it]['staminaMax'] = caap.stats['staminaT']['max'];
                    general.records[it]['healthMax'] = caap.stats['healthT']['max'];
                    general.records[it]['last'] = new Date().getTime();
                    general.save();
                    general.copy2sortable();
                    $u.log(3, "Got 'General' stats", general.records[it]);
                } else {
                    $u.warn("Unable to get 'General' stats");
                }
            } else {
                $u.warn("Unable to get equipped 'General' divs", generalDiv);
            }

            return general.records[it];
        } catch (err) {
            $u.error("ERROR in general.GetEquippedStats: " + err);
            return false;
        }
    },

    GetAllStats: function () {
        try {
            if (!schedule.check("allGenerals")) {
                return false;
            }

            var generalImage = '',
                it           = 0,
                len          = 0,
                theGeneral   = '';

            for (it = 0, len = general.records.length; it < len; it += 1) {
                if (schedule.since(general.records[it]['last'], gm.getItem("GeneralLastReviewed", 24, hiddenVar) * 3600)) {
                    break;
                }
            }

            if (it >= len) {
                schedule.setItem("allGenerals", gm.getItem("GetAllGenerals", 168, hiddenVar) * 3600, 300);
                $u.log(2, "Finished visiting all Generals for their stats");
                theGeneral = config.getItem('IdleGeneral', 'Use Current');
                if (theGeneral !== 'Use Current') {
                    $u.log(2, "Changing to idle general");
                    return general.Select('IdleGeneral');
                }

                return false;
            }

            if (caap.NavigateTo('mercenary,generals', 'tab_generals_on.gif')) {
                $u.log(2, "Visiting generals to get 'General' stats");
                return true;
            }

            generalImage = general.GetImage(general.records[it]['name']);
            if (caap.CheckForImage(generalImage)) {
                if (general.GetCurrent() !== general.records[it]['name']) {
                    $u.log(2, "Visiting 'General'", general.records[it]['name']);
                    return caap.NavigateTo(generalImage);
                }
            }

            return true;
        } catch (err) {
            $u.error("ERROR in general.GetAllStats: " + err);
            return false;
        }
    },

    owned: function (name) {
        try {
            var it    = 0,
                owned = false;

            for (it = general.records.length - 1; it >= 0; it -= 1) {
                if (general.records[it]['name'] && general.records[it]['name'] === name) {
                    owned = true;
                    break;
                }
            }

            return owned;
        } catch (err) {
            $u.error("ERROR in general.owned: " + err);
            return undefined;
        }
    }
    /*jslint sub: false */
};

////////////////////////////////////////////////////////////////////
//                          monster OBJECT
// this is the main object for dealing with Monsters
/////////////////////////////////////////////////////////////////////

monster = {
    records: [],

    /* This section is formatted to allow Advanced Optimisation by the Closure Compiler */
    /*jslint sub: true */
    record: function () {
        this.data = {
            'name'       : '',
            'userId'     : 0,
            'attacked'   : -1,
            'defended'   : -1,
            'damage'     : -1,
            'life'       : -1,
            'fortify'    : -1,
            'time'       : [],
            't2k'        : -1,
            'phase'      : '',
            'miss'       : 0,
            'link'       : '',
            'rix'        : -1,
            'mpool'      : '',
            'over'       : '',
            'page'       : '',
            'color'      : '',
            'review'     : -1,
            'type'       : '',
            'conditions' : '',
            'charClass'  : '',
            'strength'   : -1,
            'stun'       : -1,
            'stunTime'   : -1,
            'stunDo'     : false,
            'stunType'   : '',
            'tip'        : ''
        };
    },
    /*jslint sub: false */

    engageButtons: {},

    /* This section is formatted to allow Advanced Optimisation by the Closure Compiler */
    /*jslint sub: true */
    completeButton: {
        'battle_monster': {
            'name'   : undefined,
            'button' : undefined
        },
        'raid': {
            'name'   : undefined,
            'button' : undefined
        }
    },
    /*jslint sub: false */

    // http://castleage.wikidot.com/monster for monster info
    // http://castleage.wikidot.com/skaar
    info: {
        'Deathrune' : {
            duration     : 96,
            defense      : true,
            hp           : 100000000,
            ach          : 1000000,
            siege        : 5,
            siegeClicks  : [30, 60, 90, 120, 200],
            siegeDam     : [6600000, 8250000, 9900000, 13200000, 16500000],
            siege_img    : ['/graphics/death_siege_small'],
            fort         : true,
            staUse       : 5,
            staLvl       : [0, 100, 200, 500],
            staMax       : [5, 10, 20, 50],
            nrgMax       : [10, 20, 40, 100],
            reqAtkButton : 'attack_monster_button.jpg',
            v            : 'attack_monster_button2.jpg',
            defButton    : 'button_dispel.gif',
            defense_img  : 'bar_dispel.gif'
        },
        'Ice Elemental' : {
            duration     : 168,
            defense      : true,
            hp           : 100000000,
            ach          : 1000000,
            siege        : 5,
            siegeClicks  : [30, 60, 90, 120, 200],
            siegeDam     : [7260000, 9075000, 10890000, 14520000, 18150000],
            siege_img    : ['/graphics/water_siege_small'],
            fort         : true,
            staUse       : 5,
            staLvl       : [0, 100, 200, 500],
            staMax       : [5, 10, 20, 50],
            nrgMax       : [10, 20, 40, 100],
            reqAtkButton : 'attack_monster_button.jpg',
            pwrAtkButton : 'attack_monster_button2.jpg',
            defButton    : 'button_dispel.gif',
            defense_img  : 'bar_dispel.gif'
        },
        'Earth Elemental' : {
            duration     : 168,
            defense      : true,
            hp           : 100000000,
            ach          : 1000000,
            siege        : 5,
            siegeClicks  : [30, 60, 90, 120, 200],
            siegeDam     : [6600000, 8250000, 9900000, 13200000, 16500000],
            siege_img    : ['/graphics/earth_siege_small'],
            fort         : true,
            staUse       : 5,
            staLvl       : [0, 100, 200, 500],
            staMax       : [5, 10, 20, 50],
            nrgMax       : [10, 20, 40, 100],
            reqAtkButton : 'attack_monster_button.jpg',
            pwrAtkButton : 'attack_monster_button2.jpg',
            defButton    : 'attack_monster_button3.jpg',
            defense_img  : 'seamonster_ship_health.jpg',
            repair_img   : 'repair_bar_grey.jpg'
        },
        'Hydra' : {
            duration     : 168,
            hp           : 100000000,
            ach          : 500000,
            siege        : 6,
            siegeClicks  : [10, 20, 50, 100, 200, 300],
            siegeDam     : [1340000, 2680000, 5360000, 14700000, 28200000, 37520000],
            siege_img    : ['/graphics/monster_siege_small'],
            staUse       : 5,
            staLvl       : [0, 100, 200, 500],
            staMax       : [5, 10, 20, 50]
        },
        'Legion' : {
            duration     : 168,
            hp           : 100000,
            ach          : 1000,
            siege        : 6,
            siegeClicks  : [10, 20, 40, 80, 150, 300],
            siegeDam     : [3000, 4500, 6000, 9000, 12000, 15000],
            siege_img    : ['/graphics/castle_siege_small'],
            fort         : true,
            staUse       : 5,
            staLvl       : [0, 100, 200, 500],
            staMax       : [5, 10, 20, 50],
            nrgMax       : [10, 20, 40, 100],
            defense_img  : 'seamonster_ship_health.jpg',
            repair_img   : 'repair_bar_grey.jpg'
        },
        'Emerald Dragon' : {
            duration     : 72,
            ach          : 100000,
            siege        : 0
        },
        'Frost Dragon' : {
            duration     : 72,
            ach          : 100000,
            siege        : 0
        },
        'Gold Dragon' : {
            duration     : 72,
            ach          : 100000,
            siege        : 0
        },
        'Red Dragon' : {
            duration     : 72,
            ach          : 100000,
            siege        : 0
        },
        'King'      : {
            duration     : 72,
            ach          : 15000,
            siege        : 0
        },
        'Terra'     : {
            duration     : 72,
            ach          : 20000,
            siege        : 0
        },
        'Queen'     : {
            duration     : 48,
            ach          : 50000,
            siege        : 1,
            siegeClicks  : [11],
            siegeDam     : [500000],
            siege_img    : ['/graphics/boss_sylvanas_drain_icon.gif']
        },
        'Ravenmoore' : {
            duration     : 48,
            ach          : 500000,
            siege        : 0
        },
        'Knight'    : {
            duration     : 48,
            ach          : 30000,
            siege        : 0,
            reqAtkButton : 'event_attack1.gif',
            pwrAtkButton : 'event_attack2.gif',
            defButton    : null
        },
        'Serpent'   : {
            duration     : 72,
            defense      : true,
            ach          : 250000,
            siege        : 0,
            fort         : true,
            //staUse       : 5,
            defense_img  : 'seamonster_ship_health.jpg'
        },
        'Siege'    : {
            duration     : 232,
            raid         : true,
            ach          : 100,
            siege        : 4,
            siegeClicks  : [30, 50, 80, 100],
            siegeDam     : [200, 500, 300, 1500],
            siege_img    : ['/graphics/monster_siege_'],
            staUse       : 1
        },
        'Raid I'    : {
            duration     : 88,
            raid         : true,
            ach          : 50,
            siege        : 2,
            siegeClicks  : [30, 50],
            siegeDam     : [200, 500],
            siege_img    : ['/graphics/monster_siege_'],
            staUse       : 1
        },
        'Raid II'   : {
            duration     : 144,
            raid         : true,
            ach          : 50,
            siege        : 2,
            siegeClicks  : [80, 100],
            siegeDam     : [300, 1500],
            siege_img    : ['/graphics/monster_siege_'],
            staUse       : 1
        },
        'Mephistopheles' : {
            duration     : 48,
            ach          : 200000,
            siege        : 0
        },
        // http://castleage.wikia.com/wiki/War_of_the_Red_Plains
        'Plains' : {
            alpha        : true,
            tactics      : true,
            duration     : 168,
            hp           : 350000000,
            ach          : 10000,
            siege        : 7,
            siegeClicks  : [30, 60, 90, 120, 200, 250, 300],
            siegeDam     : [13750000, 17500000, 20500000, 23375000, 26500000, 29500000, 34250000],
            siege_img    : [
                '/graphics/water_siege_small',
                '/graphics/alpha_bahamut_siege_blizzard_small',
                '/graphics/azriel_siege_inferno_small',
                '/graphics/war_siege_holy_smite_small'
            ],
            fort         : true,
            staUse       : 5,
            staLvl       : [0, 100, 200, 500],
            staMax       : [5, 10, 20, 50],
            nrgMax       : [10, 20, 40, 100],
            defense_img  : 'nm_green.jpg'
        },
        // http://castleage.wikia.com/wiki/Bahamut,_the_Volcanic_Dragon
        'Volcanic Dragon' : {
            alpha        : true,
            duration     : 168,
            hp           : 130000000,
            ach          : 4000000,
            siege        : 5,
            siegeClicks  : [30, 60, 90, 120, 200],
            siegeDam     : [7896000, 9982500, 11979000, 15972000, 19965000],
            siege_img    : ['/graphics/water_siege_small'],
            fort         : true,
            staUse       : 5,
            staLvl       : [0, 100, 200, 500],
            staMax       : [5, 10, 20, 50],
            nrgMax       : [10, 20, 40, 100],
            defense_img  : 'nm_green.jpg'
        },
        // http://castleage.wikidot.com/alpha-bahamut
        // http://castleage.wikia.com/wiki/Alpha_Bahamut,_The_Volcanic_Dragon
        'Alpha Volcanic Dragon' : {
            alpha        : true,
            duration     : 168,
            hp           : 620000000,
            ach          : 8000000,
            siege        : 7,
            siegeClicks  : [30, 60, 90, 120, 200, 250, 300],
            siegeDam     : [22250000, 27500000, 32500000, 37500000, 42500000, 47500000, 55000000],
            siege_img    : [
                '/graphics/water_siege_small',
                '/graphics/alpha_bahamut_siege_blizzard_small',
                '/graphics/azriel_siege_inferno_small'
            ],
            fort         : true,
            staUse       : 5,
            staLvl       : [0, 100, 200, 500],
            staMax       : [5, 10, 20, 50],
            nrgMax       : [10, 20, 40, 100],
            defense_img  : 'nm_green.jpg'
        },
        // http://castleage.wikia.com/wiki/Azriel,_the_Angel_of_Wrath
        'Wrath' : {
            alpha        : true,
            duration     : 168,
            hp           : 600000000,
            ach          : 8000000,
            siege        : 7,
            siegeClicks  : [30, 60, 90, 120, 200, 250, 300],
            siegeDam     : [22250000, 27500000, 32500000, 37500000, 42500000, 47500000, 55000000],
            siege_img    : [
                '/graphics/water_siege_small',
                '/graphics/alpha_bahamut_siege_blizzard_small',
                '/graphics/azriel_siege_inferno_small'
            ],
            fort         : true,
            staUse       : 5,
            staLvl       : [0, 100, 200, 500],
            staMax       : [5, 10, 20, 50],
            nrgMax       : [10, 20, 40, 100],
            defense_img  : 'nm_green.jpg'
        },
        'Alpha Mephistopheles' : {
            alpha        : true,
            duration     : 168,
            hp           : 600000000,
            ach          : 12000000,
            siege        : 10,
            siegeClicks  : [15, 30, 45, 60, 75, 100, 150, 200, 250, 300],
            siegeDam     : [19050000, 22860000, 26670000, 30480000, 34290000, 38100000, 45720000, 49530000, 53340000, 60960000],
            siege_img    : [
                '/graphics/earth_siege_small',
                '/graphics/castle_siege_small',
                '/graphics/death_siege_small',
                '/graphics/skaar_siege_small'
            ],
            fort         : true,
            staUse       : 5,
            staLvl       : [0, 100, 200, 500],
            staMax       : [5, 10, 20, 50],
            nrgMax       : [10, 20, 40, 100],
            defense_img  : 'nm_green.jpg'
        },
        'Fire Elemental' : {
            alpha        : true,
            duration     : 168,
            hp           : 350000000,
            ach          : 1000000,
            siege        : 7,
            siegeClicks  : [30, 60, 90, 120, 200, 250, 300],
            siegeDam     : [14750000, 18500000, 21000000, 24250000, 27000000, 30000000, 35000000],
            siege_img    : [
                '/graphics/water_siege_small',
                '/graphics/alpha_bahamut_siege_blizzard_small',
                '/graphics/azriel_siege_inferno_small',
                '/graphics/war_siege_holy_smite_small'
            ],
            fort         : true,
            staUse       : 5,
            staLvl       : [0, 100, 200, 500],
            staMax       : [5, 10, 20, 50],
            nrgMax       : [10, 20, 40, 100],
            defense_img  : 'nm_green.jpg'
        },
        "Lion's Rebellion" : {
            alpha        : true,
            tactics      : true,
            duration     : 168,
            hp           : 350000000,
            ach          : 1000,
            siege        : 7,
            siegeClicks  : [30, 60, 90, 120, 200, 250, 300],
            siegeDam     : [15250000, 19000000, 21500000, 24750000, 27500000, 30500000, 35500000],
            siege_img    : [
                '/graphics/water_siege_small',
                '/graphics/alpha_bahamut_siege_blizzard_small',
                '/graphics/azriel_siege_inferno_small',
                '/graphics/war_siege_holy_smite_small'
            ],
            fort         : true,
            staUse       : 5,
            staLvl       : [0, 100, 200, 500],
            staMax       : [5, 10, 20, 50],
            nrgMax       : [10, 20, 40, 100],
            defense_img  : 'nm_green.jpg'
        },
        "Corvintheus" : {
            alpha        : true,
            duration     : 168,
            hp           : 640000000,
            ach          : 30000000,
            siege        : 10,
            siegeClicks  : [15, 30, 45, 60, 75, 100, 150, 200, 250, 300],
            siegeDam     : [16000000, 19200000, 22400000, 25600000, 28800000, 32000000, 38400000, 41600000, 44800000, 51200000],
            siege_img    : [
                '/graphics/earth_siege_small',
                '/graphics/castle_siege_small',
                '/graphics/skaar_siege_small',
                '/graphics/death_siege_small'
            ],
            fort         : true,
            staUse       : 5,
            staLvl       : [0, 100, 200, 500],
            staMax       : [5, 10, 20, 50],
            nrgMax       : [10, 20, 40, 100],
            defense_img  : 'nm_green.jpg'
        }
    },

    load: function () {
        try {
            monster.records = gm.getItem('monster.records', 'default');
            if (monster.records === 'default' || !$j.isArray(monster.records)) {
                monster.records = gm.setItem('monster.records', []);
            }

            state.setItem("MonsterDashUpdate", true);
            $u.log(5, "monster.load", monster.records);
            return true;
        } catch (err) {
            $u.error("ERROR in monster.load: " + err);
            return false;
        }
    },

    save: function () {
        try {
            gm.setItem('monster.records', monster.records);
            state.setItem("MonsterDashUpdate", true);
            $u.log(5, "monster.save", monster.records);
            return true;
        } catch (err) {
            $u.error("ERROR in monster.save: " + err);
            return false;
        }
    },

    parseCondition: function (type, conditions) {
        try {
            if (!conditions || conditions.toLowerCase().indexOf(':' + type) < 0) {
                return false;
            }

            var str    = '',
                value  = 0,
                first  = false,
                second = false;

            str = conditions.substring(conditions.indexOf(':' + type) + type.length + 1).replace(new RegExp(":.+"), '');
            value = str ? str.parseFloat() : 0;
            if (/k$/i.test(str) || /m$/i.test(str)) {
                first = /\d+k/i.test(str);
                second = /\d+m/i.test(str);
                value = value * 1000 * (first + second * 1000);
            }

            return value;
        } catch (err) {
            $u.error("ERROR in monster.parseCondition: " + err);
            return false;
        }
    },

    type: function (name) {
        try {
            var words = [],
                count = 0;

            if (typeof name !== 'string') {
                $u.warn("name", name);
                throw "Invalid identifying name!";
            }

            if (name === '') {
                return '';
            }

            words = name.split(" ");
            $u.log(3, "Words", words);
            count = words.length - 1;
            if (count >= 4) {
                if (words[count - 4] === 'Alpha' && words[count - 1] === 'Volcanic' && words[count] === 'Dragon') {
                    return words[count - 4] + ' ' + words[count - 1] + ' ' + words[count];
                }
            }

            if (words[count] === 'Elemental' || words[count] === 'Dragon' ||
                    (words[count - 1] === 'Alpha' && words[count] === 'Mephistopheles') ||
                    (words[count - 1] === "Lion's" && words[count] === 'Rebellion') ||
                    (words[count - 1] === 'Fire' && words[count] === 'Elemental')) {
                return words[count - 1] + ' ' + words[count];
            }

            return words[count];
        } catch (err) {
            $u.error("ERROR in monster.type: " + err, arguments.callee.caller);
            return false;
        }
    },

    /* This section is formatted to allow Advanced Optimisation by the Closure Compiler */
    /*jslint sub: true */
    getItem: function (name) {
        try {
            var it        = 0,
                len       = 0,
                success   = false,
                newRecord = {};

            if (typeof name !== 'string') {
                $u.warn("name", name);
                throw "Invalid identifying name!";
            }

            if (name === '') {
                return '';
            }

            for (it = 0, len = monster.records.length; it < len; it += 1) {
                if (monster.records[it]['name'] === name) {
                    success = true;
                    break;
                }
            }

            if (success) {
                $u.log(3, "Got monster record", name, monster.records[it]);
                return monster.records[it];
            } else {
                newRecord = new monster.record();
                newRecord.data['name'] = name;
                $u.log(3, "New monster record", name, newRecord.data);
                return newRecord.data;
            }
        } catch (err) {
            $u.error("ERROR in monster.getItem: " + err, arguments.callee.caller);
            return false;
        }
    },

    setItem: function (record) {
        try {
            if (!record || !$j.isPlainObject(record)) {
                throw "Not passed a record";
            }

            if (typeof record['name'] !== 'string' || record['name'] === '') {
                $u.warn("name", record['name']);
                throw "Invalid identifying name!";
            }

            var it      = 0,
                len     = 0,
                success = false;

            for (it = 0, len = monster.records.length; it < len; it += 1) {
                if (monster.records[it]['name'] === record['name']) {
                    success = true;
                    break;
                }
            }

            if (success) {
                monster.records[it] = record;
                $u.log(3, "Updated monster record", record, monster.records);
            } else {
                monster.records.push(record);
                $u.log(3, "Added monster record", record, monster.records);
            }

            monster.save();
            return true;
        } catch (err) {
            $u.error("ERROR in monster.setItem: " + err);
            return false;
        }
    },

    deleteItem: function (name) {
        try {
            var it        = 0,
                len       = 0,
                success   = false;

            if (typeof name !== 'string' || name === '') {
                $u.warn("name", name);
                throw "Invalid identifying name!";
            }

            for (it = 0, len = monster.records.length; it < len; it += 1) {
                if (monster.records[it]['name'] === name) {
                    success = true;
                    break;
                }
            }

            if (success) {
                monster.records.splice(it, 1);
                monster.save();
                $u.log(3, "Deleted monster record", name, monster.records);
                return true;
            } else {
                $u.warn("Unable to delete monster record", name, monster.records);
                return false;
            }
        } catch (err) {
            $u.error("ERROR in monster.deleteItem: " + err);
            return false;
        }
    },
    /*jslint sub: false */

    clear: function () {
        try {
            monster.records = gm.setItem("monster.records", []);
            state.setItem("MonsterDashUpdate", true);
            return true;
        } catch (err) {
            $u.error("ERROR in monster.clear: " + err);
            return false;
        }
    },

    /* This section is formatted to allow Advanced Optimisation by the Closure Compiler */
    /*jslint sub: true */
    t2kCalc: function (record) {
        try {
            var timeLeft                       = 0,
                timeUsed                       = 0,
                T2K                            = 0,
                damageDone                     = 0,
                hpLeft                         = 0,
                totalSiegeDamage               = 0,
                totalSiegeClicks               = 0,
                attackDamPerHour               = 0,
                clicksPerHour                  = 0,
                clicksToNextSiege              = 0,
                nextSiegeAttackPlusSiegeDamage = 0,
                s                              = 0,
                len                            = 0,
                siegeImpacts                   = 0,
                boss                           = {},
                siegeStage                     = 0;

            siegeStage = record['phase'] - 1;
            boss = monster.info[record['type']];
            timeLeft = record['time'][0].parseInt() + (record['time'][1].parseInt() * 0.0166);
            timeUsed = boss.duration - timeLeft;
            if (!boss.siege || !boss.hp) {
                return (record['life'] * timeUsed) / (100 - record['life']);
            }

            damageDone = (100 - record['life']) / 100 * boss.hp;
            hpLeft = boss.hp - damageDone;
            for (s = 0, len = boss.siegeClicks.length; s < len; s += 1) {
                $u.log(5, 's ', s, ' T2K ', T2K, ' hpLeft ', hpLeft);
                if (s < siegeStage || record['miss'] === 0) {
                    totalSiegeDamage += boss.siegeDam[s];
                    totalSiegeClicks += boss.siegeClicks[s];
                } else if (s === siegeStage) {
                    attackDamPerHour = (damageDone - totalSiegeDamage) / timeUsed;
                    clicksPerHour = (totalSiegeClicks + boss.siegeClicks[s] - record['miss']) / timeUsed;
                    $u.log(5, 'Attack Damage Per Hour: ', attackDamPerHour);
                    $u.log(5, 'Damage Done: ', damageDone);
                    $u.log(5, 'Total Siege Damage: ', totalSiegeDamage);
                    $u.log(5, 'Time Used: ', timeUsed);
                    $u.log(5, 'Clicks Per Hour: ', clicksPerHour);
                } else if (s >= siegeStage) {
                    clicksToNextSiege = (s === siegeStage) ? record['miss'] : boss.siegeClicks[s];
                    nextSiegeAttackPlusSiegeDamage = boss.siegeDam[s] + clicksToNextSiege / clicksPerHour * attackDamPerHour;
                    if (hpLeft <= nextSiegeAttackPlusSiegeDamage || record['miss'] === 0) {
                        T2K += hpLeft / attackDamPerHour;
                        break;
                    }

                    T2K += clicksToNextSiege / clicksPerHour;
                    hpLeft -= nextSiegeAttackPlusSiegeDamage;
                }
            }

            siegeImpacts = (record['life'] / (100 - record['life']) * timeLeft).dp(2);
            T2K = T2K.dp(2);
            $u.log(3, 'T2K based on siege: ', caap.decHours2HoursMin(T2K));
            $u.log(3, 'T2K estimate without calculating siege impacts: ', caap.decHours2HoursMin(siegeImpacts));
            return T2K;
        } catch (err) {
            $u.error("ERROR in monster.t2kCalc: " + err);
            return 0;
        }
    },

    characterClass: {
        'Warrior' : ['Strengthen', 'Heal'],
        'Rogue'   : ['Cripple'],
        'Mage'    : ['Deflect'],
        'Cleric'  : ['Heal'],
        'Warlock' : ['Heal', 'Deflect'],
        'Ranger'  : ['Strengthen', 'Cripple']
    },
    /*jslint sub: false */

    flagReview: function (force) {
        try {
            schedule.setItem("monsterReview", 0);
            state.setItem('monsterReviewCounter', -3);
            return true;
        } catch (err) {
            $u.error("ERROR in monster.flagReview: " + err);
            return false;
        }
    },

    flagFullReview: function (force) {
        try {
            monster.clear();
            monster.flagReview();
            schedule.setItem('NotargetFrombattle_monster', 0);
            state.setItem('ReleaseControl', true);
            caap.UpdateDashboard(true);
            return true;
        } catch (err) {
            $u.error("ERROR in monster.flagFullReview: " + err);
            return false;
        }
    },

    /* This section is formatted to allow Advanced Optimisation by the Closure Compiler */
    /*jslint sub: true */
    energyTarget: function () {
        this.data = {
            'name' : '',
            'type' : ''
        };
    },

    select: function (force) {
        try {
            if (!(force || schedule.oneMinuteUpdate('selectMonster')) || caap.stats['level'] < 7) {
                return false;
            }

            $u.log(2, 'Selecting monster');
            var monsterList  = {
                    'battle_monster' : [],
                    'raid'           : [],
                    'any'            : []
                },
                it                    = 0,
                len                   = 0,
                len1                  = 0,
                len2                  = 0,
                len3                  = 0,
                s                     = 0,
                selectTypes           = [],
                maxToFortify          = 0,
                nodeNum               = 0,
                firstOverAch          = '',
                firstUnderMax         = '',
                firstFortOverAch      = '',
                firstFortUnderMax     = '',
                firstStunOverAch      = '',
                firstStunUnderMax     = '',
                firstStrengthOverAch  = '',
                firstStrengthUnderMax = '',
                strengthTarget        = '',
                fortifyTarget         = '',
                stunTarget            = '',
                energyTarget          = new monster.energyTarget(),
                monsterName           = '',
                monsterObj            = {},
                monsterConditions     = '',
                monstType             = '',
                p                     = 0,
                m                     = 0,
                attackOrderList       = [];

            // First we forget everything about who we already picked.
            state.setItem('targetFrombattle_monster', '');
            state.setItem('targetFromfortify', energyTarget.data);
            state.setItem('targetFromraid', '');

            // Next we get our monster objects from the reposoitory and break them into separarte lists
            // for monster or raid.  If we are serializing then we make one list only.
            for (it = 0, len = monster.records.length; it < len; it += 1) {
                if (monster.records[it]['type'] === '') {
                    monster.records[it]['type'] = monster.type(monster.records[it]['name']);
                }

                if (monster.info[monster.records[it]['type']] && monster.info[monster.records[it]['type']].alpha) {
                    if (monster.records[it]['damage'] !== -1 && monster.records[it]['color'] !== 'grey' && schedule.since(monster.records[it]['stunTime'], 0)) {
                        $u.log(2, "Review monster due to class timer", monster.records[it]['name']);
                        monster.records[it]['review'] = -1;
                        monster.flagReview();
                    }
                }

                monster.records[it]['conditions'] = 'none';
                if (gm.getItem('SerializeRaidsAndMonsters', false, hiddenVar)) {
                    monsterList['any'].push(monster.records[it]['name']);
                } else if ((monster.records[it]['page'] === 'raid') || (monster.records[it]['page'] === 'battle_monster')) {
                    monsterList[monster.records[it]['page']].push(monster.records[it]['name']);
                }
            }

            monster.save();

            //PLEASE NOTE BEFORE CHANGING
            //The Serialize Raids and Monsters dictates a 'single-pass' because we only need select
            //one "targetFromxxxx" to fill in. The other MUST be left blank. This is what keeps it
            //serialized!!! Trying to make this two pass logic is like trying to fit a square peg in
            //a round hole. Please reconsider before doing so.
            if (gm.getItem('SerializeRaidsAndMonsters', false, hiddenVar)) {
                selectTypes = ['any'];
            } else {
                selectTypes = ['battle_monster', 'raid'];
            }

            $u.log(3, 'records/monsterList/selectTypes', monster.records, monsterList, selectTypes);
            // We loop through for each selection type (only once if serialized between the two)
            // We then read in the users attack order list
            for (s = 0, len1 = selectTypes.length; s < len1; s += 1) {
                if (!monsterList[selectTypes[s]].length) {
                    continue;
                }

                firstOverAch          = '';
                firstUnderMax         = '';
                firstFortOverAch      = '';
                firstFortUnderMax     = '';
                firstStunOverAch      = '';
                firstStunUnderMax     = '';
                firstStrengthOverAch  = '';
                firstStrengthUnderMax = '';
                strengthTarget        = '';
                fortifyTarget         = '';
                stunTarget            = '';
                energyTarget          = new monster.energyTarget();

                // The extra apostrophe at the end of attack order makes it match any "soandos's monster" so it always selects a monster if available
                if (selectTypes[s] === 'any') {
                    attackOrderList = config.getList('orderbattle_monster', '');
                    $j.merge(attackOrderList, config.getList('orderraid', '').concat('your', "'"));
                } else {
                    attackOrderList = config.getList('order' + selectTypes[s], '').concat('your', "'");
                }

                $u.log(5, 'attackOrderList', attackOrderList);
                // Next we step through the users list getting the name and conditions
                for (p = 0, len2 = attackOrderList.length; p < len2; p += 1) {
                    if (!attackOrderList[p].trim()) {
                        continue;
                    }

                    monsterConditions = attackOrderList[p].replace(new RegExp("^[^:]+"), '').toString().trim();
                    // Now we try to match the users name agains our list of monsters
                    for (m = 0, len3 = monsterList[selectTypes[s]].length; m < len3; m += 1) {
                        if (!monsterList[selectTypes[s]][m]) {
                            continue;
                        }

                        monsterObj = monster.getItem(monsterList[selectTypes[s]][m]);
                        // If we set conditions on this monster already then we do not reprocess
                        if (monsterObj['conditions'] !== 'none') {
                            continue;
                        }

                        // If this monster does not match, skip to next one
                        // Or if this monster is dead, skip to next one
                        // Or if this monster is not the correct type, skip to next one
                        if (monsterList[selectTypes[s]][m].toLowerCase().indexOf(attackOrderList[p].match(new RegExp("^[^:]+")).toString().trim().toLowerCase()) < 0 || (selectTypes[s] !== 'any' && monsterObj['page'] !== selectTypes[s])) {
                            continue;
                        }

                        //Monster is a match so we set the conditions
                        monsterObj['conditions'] = monsterConditions;
                        monster.setItem(monsterObj);
                        // If it's complete or collect rewards, no need to process further
                        if (monsterObj['color'] === 'grey') {
                            continue;
                        }

                        $u.log(3, 'Current monster being checked', monsterObj);
                        // checkMonsterDamage would have set our 'color' and 'over' values. We need to check
                        // these to see if this is the monster we should select
                        if (!firstUnderMax && monsterObj['color'] !== 'purple') {
                            if (monsterObj['over'] === 'ach') {
                                if (!firstOverAch) {
                                    firstOverAch = monsterList[selectTypes[s]][m];
                                    $u.log(3, 'firstOverAch', firstOverAch);
                                }
                            } else if (monsterObj['over'] !== 'max') {
                                firstUnderMax = monsterList[selectTypes[s]][m];
                                $u.log(3, 'firstUnderMax', firstUnderMax);
                            }
                        }

                        monstType = monster.type(monsterList[selectTypes[s]][m]);
                        if (monstType && monster.info[monstType]) {
                            if (!monster.info[monstType].alpha || (monster.info[monstType].alpha && monster.characterClass[monsterObj['charClass']] && monster.characterClass[monsterObj['charClass']].indexOf('Heal') >= 0)) {
                                maxToFortify = (monster.parseCondition('f%', monsterConditions) !== false) ? monster.parseCondition('f%', monsterConditions) : config.getItem('MaxToFortify', 0);
                                if (monster.info[monstType].fort && !firstFortUnderMax && monsterObj['fortify'] < maxToFortify) {
                                    if (monsterObj['over'] === 'ach') {
                                        if (!firstFortOverAch) {
                                            firstFortOverAch = monsterList[selectTypes[s]][m];
                                            $u.log(3, 'firstFortOverAch', firstFortOverAch);
                                        }
                                    } else if (monsterObj['over'] !== 'max') {
                                        firstFortUnderMax = monsterList[selectTypes[s]][m];
                                        $u.log(3, 'firstFortUnderMax', firstFortUnderMax);
                                    }
                                }
                            }

                            if (monster.info[monstType].alpha) {
                                if (config.getItem("StrengthenTo100", true) && monster.characterClass[monsterObj['charClass']] && monster.characterClass[monsterObj['charClass']].indexOf('Strengthen') >= 0) {
                                    if (!firstStrengthUnderMax && monsterObj['strength'] < 100) {
                                        if (monsterObj['over'] === 'ach') {
                                            if (!firstStrengthOverAch) {
                                                firstStrengthOverAch = monsterList[selectTypes[s]][m];
                                                $u.log(3, 'firstStrengthOverAch', firstStrengthOverAch);
                                            }
                                        } else if (monsterObj['over'] !== 'max') {
                                            firstStrengthUnderMax = monsterList[selectTypes[s]][m];
                                            $u.log(3, 'firstStrengthUnderMax', firstStrengthUnderMax);
                                        }
                                    }
                                }

                                if (!firstStunUnderMax && monsterObj['stunDo']) {
                                    if (monsterObj['over'] === 'ach') {
                                        if (!firstStunOverAch) {
                                            firstStunOverAch = monsterList[selectTypes[s]][m];
                                            $u.log(3, 'firstStunOverAch', firstStunOverAch);
                                        }
                                    } else if (monsterObj['over'] !== 'max') {
                                        firstStunUnderMax = monsterList[selectTypes[s]][m];
                                        $u.log(3, 'firstStunUnderMax', firstStunUnderMax);
                                    }
                                }
                            }
                        }
                    }
                }

                // Now we use the first under max/under achievement that we found. If we didn't find any under
                // achievement then we use the first over achievement
                if (selectTypes[s] !== 'raid') {
                    strengthTarget = firstStrengthUnderMax;
                    if (!strengthTarget) {
                        strengthTarget = firstStrengthOverAch;
                    }

                    if (strengthTarget) {
                        energyTarget.data['name'] = strengthTarget;
                        energyTarget.data['type'] = 'Strengthen';
                        $u.log(2, 'Strengthen target ', energyTarget.data['name']);
                    }

                    fortifyTarget = firstFortUnderMax;
                    if (!fortifyTarget) {
                        fortifyTarget = firstFortOverAch;
                    }

                    if (fortifyTarget) {
                        energyTarget.data['name'] = fortifyTarget;
                        energyTarget.data['type'] = 'Fortify';
                        $u.log(2, 'Fortify replaces strengthen ', energyTarget.data['name']);
                    }

                    stunTarget = firstStunUnderMax;
                    if (!stunTarget) {
                        stunTarget = firstStunOverAch;
                    }

                    if (stunTarget) {
                        energyTarget.data['name'] = stunTarget;
                        energyTarget.data['type'] = 'Stun';
                        $u.log(2, 'Stun target replaces fortify ', energyTarget.data['name']);
                    }

                    state.setItem('targetFromfortify', energyTarget.data);
                    if (energyTarget.data['name']) {
                        $u.log(1, 'Energy target', energyTarget.data);
                    }
                }

                monsterName = firstUnderMax;
                if (!monsterName) {
                    monsterName = firstOverAch;
                }

                // If we've got a monster for this selection type then we set the GM variables for the name
                // and stamina requirements
                if (monsterName) {
                    monsterObj = monster.getItem(monsterName);
                    state.setItem('targetFrom' + monsterObj['page'], monsterName);
                    if (monsterObj['page'] === 'battle_monster') {
                        nodeNum = 0;
                        if (!caap.InLevelUpMode() && monster.info[monsterObj['type']] && monster.info[monsterObj['type']].staLvl) {
                            for (nodeNum = monster.info[monsterObj['type']].staLvl.length - 1; nodeNum >= 0; nodeNum -= 1) {
                                if (caap.stats['stamina']['max'] >= monster.info[monsterObj['type']].staLvl[nodeNum]) {
                                    break;
                                }
                            }
                        }

                        if (!caap.InLevelUpMode() && monster.info[monsterObj['type']] && monster.info[monsterObj['type']].staMax && config.getItem('PowerAttack', false) && config.getItem('PowerAttackMax', false)) {
                            state.setItem('MonsterStaminaReq', monster.info[monsterObj['type']].staMax[nodeNum]);
                        } else if (monster.info[monsterObj['type']] && monster.info[monsterObj['type']].staUse) {
                            state.setItem('MonsterStaminaReq', monster.info[monsterObj['type']].staUse);
                        } else if ((caap.InLevelUpMode() && caap.stats['stamina']['num'] >= 10) || monsterObj['conditions'].match(/:pa/i)) {
                            state.setItem('MonsterStaminaReq', 5);
                        } else if (monsterObj['conditions'].match(/:sa/i)) {
                            state.setItem('MonsterStaminaReq', 1);
                        } else if ((caap.InLevelUpMode() && caap.stats['stamina']['num'] >= 10) || config.getItem('PowerAttack', true)) {
                            state.setItem('MonsterStaminaReq', 5);
                        } else {
                            state.setItem('MonsterStaminaReq', 1);
                        }

                        switch (config.getItem('MonsterGeneral', 'Use Current')) {
                        case 'Orc King':
                            state.setItem('MonsterStaminaReq', state.getItem('MonsterStaminaReq', 1) * (general.GetLevel('Orc King') + 1));
                            $u.log(2, 'MonsterStaminaReq:Orc King', state.getItem('MonsterStaminaReq', 1));
                            break;
                        case 'Barbarus':
                            state.setItem('MonsterStaminaReq', state.getItem('MonsterStaminaReq', 1) * (general.GetLevel('Barbarus') === 4 ? 3 : 2));
                            $u.log(2, 'MonsterStaminaReq:Barbarus', state.getItem('MonsterStaminaReq', 1));
                            break;
                        default:
                        }
                    } else {
                        // Switch RaidPowerAttack - RaisStaminaReq is not being used - bug?
                        if (gm.getItem('RaidPowerAttack', false, hiddenVar) || monsterObj['conditions'].match(/:pa/i)) {
                            state.setItem('RaidStaminaReq', 5);
                        } else if (monster.info[monsterObj['type']] && monster.info[monsterObj['type']].staUse) {
                            state.setItem('RaidStaminaReq', monster.info[monsterObj['type']].staUse);
                        } else {
                            state.setItem('RaidStaminaReq', 1);
                        }
                    }
                }
            }

            caap.UpdateDashboard(true);
            return true;
        } catch (err) {
            $u.error("ERROR in monster.select: " + err);
            return false;
        }
    },

    ConfirmRightPage: function (monsterName) {
        try {
            // Confirm name and type of monster
            var monsterDiv = $j(),
                tempDiv    = $j(),
                tempText   = '',
                tStr       = '';

            monsterDiv = $j("div[style*='dragon_title_owner']");
            if (monsterDiv && monsterDiv.length) {
                tStr = monsterDiv.children(":eq(2)").text();
                tempText = tStr ? tStr.trim() : '';
            } else {
                monsterDiv = $j("div[style*='nm_top']");
                if (monsterDiv && monsterDiv.length) {
                    tStr = monsterDiv.children(":eq(0)").children(":eq(0)").text();
                    tempText = tStr ? tStr.trim() : '';
                    tempDiv = $j("div[style*='nm_bars']");
                    if (tempDiv && tempDiv.length) {
                        tStr = tempDiv.children(":eq(0)").children(":eq(0)").children(":eq(0)").siblings(":last").children(":eq(0)").text();
                        tempText += ' ' + (tStr ? tStr.trim().replace("'s Life", "") : '');
                    } else {
                        $u.warn("Problem finding nm_bars");
                        return false;
                    }
                } else {
                    $u.warn("Problem finding dragon_title_owner and nm_top");
                    return false;
                }
            }

            if (monsterDiv.find("img[uid='" + caap.stats['FBID'] + "']").length) {
                $u.log(2, "You monster found");
                tempText = tempText.replace(new RegExp(".+?'s "), 'Your ');
            }

            if (monsterName !== tempText) {
                $u.log(2, 'Looking for ' + monsterName + ' but on ' + tempText + '. Going back to select screen');
                return caap.NavigateTo('keep,' + monster.getItem(monsterName).page);
            }

            return false;
        } catch (err) {
            $u.error("ERROR in monster.ConfirmRightPage: " + err);
            return false;
        }
    }
    /*jslint sub: false */
};

////////////////////////////////////////////////////////////////////
//                          guild_monster OBJECT
// this is the main object for dealing with guild monsters
/////////////////////////////////////////////////////////////////////

guild_monster = {
    records: [],

    record: function () {
        this.data = {
            'name'        : '',
            'guildId'     : '',
            'slot'        : 0,
            'ticker'      : '',
            'minions'     : [],
            'attacks'     : 1,
            'damage'      : 0,
            'myStatus'    : '',
            'reviewed'    : 0,
            'state'       : '',
            'enemyHealth' : 0,
            'guildHealth' : 0,
            'conditions'  : '',
            'color'       : 'black'
        };
    },

    minion: function () {
        this.data = {
            'attacking_position' : 0,
            'target_id'          : 0,
            'name'               : '',
            'level'              : 0,
            'mclass'             : '',
            'healthNum'          : 0,
            'healthMax'          : 0,
            'status'             : '',
            'percent'            : 0
        };
    },

    me: function () {
        this.data = {
            'name'               : '',
            'level'              : 0,
            'mclass'             : '',
            'healthNum'          : 0,
            'healthMax'          : 0,
            'status'             : '',
            'percent'            : 0
        };
    },

    info: {
        "Vincent": {
            twt2     : "vincent",
            special1 : [0],
            special2 : [1],
            health   : [100, 200, 400, 800]
        },
        "Alpha Vincent": {
            twt2     : "alpha_vincent",
            special1 : [0],
            special2 : [1],
            health   : [500, 1000, 2000, 4000]
        },
        "Army of the Apocalypse": {
            twt2     : "ca_girls",
            special1 : [0, 25, 50, 75],
            special2 : [1, 2, 3, 4],
            health   : [500, 1000, 2000, 4000]
        }
    },

    load: function () {
        try {
            guild_monster.records = gm.getItem('guild_monster.records', 'default');
            if (guild_monster.records === 'default' || !$j.isArray(guild_monster.records)) {
                guild_monster.records = gm.setItem('guild_monster.records', []);
            }

            state.setItem("GuildMonsterDashUpdate", true);
            $u.log(3, "guild_monster.load", guild_monster.records);
            return true;
        } catch (err) {
            $u.error("ERROR in guild_monster.load: " + err);
            return false;
        }
    },

    save: function () {
        try {
            gm.setItem('guild_monster.records', guild_monster.records);
            state.setItem("GuildMonsterDashUpdate", true);
            $u.log(3, "guild_monster.save", guild_monster.records);
            return true;
        } catch (err) {
            $u.error("ERROR in guild_monster.save: " + err);
            return false;
        }
    },

    /* This section is formatted to allow Advanced Optimisation by the Closure Compiler */
    /*jslint sub: true */
    getItem: function (slot) {
        try {
            var it        = 0,
                len       = 0,
                success   = false,
                newRecord = {};

            if (typeof slot !== 'number') {
                $u.warn("slot", slot);
                throw "Invalid identifying slot!";
            }

            if (slot === '') {
                return '';
            }

            for (it = 0, len = guild_monster.records.length; it < len; it += 1) {
                if (guild_monster.records[it]['slot'] === slot) {
                    success = true;
                    break;
                }
            }

            if (success) {
                $u.log(3, "Got guild_monster record", slot, guild_monster.records[it]);
                return guild_monster.records[it];
            } else {
                newRecord = new guild_monster.record();
                newRecord.data['slot'] = slot;
                $u.log(3, "New guild_monster record", slot, newRecord.data);
                return newRecord.data;
            }
        } catch (err) {
            $u.error("ERROR in guild_monster.getItem: " + err, arguments.callee.caller);
            return false;
        }
    },

    setItem: function (record) {
        try {
            if (!record || !$j.isPlainObject(record)) {
                throw "Not passed a record";
            }

            if (typeof record['slot'] !== 'number' || record['slot'] <= 0) {
                $u.warn("slot", record['slot']);
                throw "Invalid identifying slot!";
            }

            var it      = 0,
                len     = 0,
                success = false;

            for (it = 0, len = guild_monster.records.length; it < len; it += 1) {
                if (guild_monster.records[it]['slot'] === record['slot']) {
                    success = true;
                    break;
                }
            }

            if (success) {
                guild_monster.records[it] = record;
                $u.log(3, "Updated guild_monster record", record, guild_monster.records);
            } else {
                guild_monster.records.push(record);
                $u.log(3, "Added guild_monster record", record, guild_monster.records);
            }

            guild_monster.save();
            return true;
        } catch (err) {
            $u.error("ERROR in guild_monster.setItem: " + err);
            return false;
        }
    },

    deleteItem: function (slot) {
        try {
            var it        = 0,
                len       = 0,
                success   = false;

            if (typeof slot !== 'number' || slot <= 0) {
                $u.warn("slot", slot);
                throw "Invalid identifying slot!";
            }

            for (it = 0, len = guild_monster.records.length; it < len; it += 1) {
                if (guild_monster.records[it]['slot'] === slot) {
                    success = true;
                    break;
                }
            }

            if (success) {
                guild_monster.records.splice(it, 1);
                guild_monster.save();
                $u.log(3, "Deleted guild_monster record", slot, guild_monster.records);
                return true;
            } else {
                $u.warn("Unable to delete guild_monster record", slot, guild_monster.records);
                return false;
            }
        } catch (err) {
            $u.error("ERROR in guild_monster.deleteItem: " + err);
            return false;
        }
    },
    /*jslint sub: false */

    clear: function () {
        try {
            $u.log(1, "guild_monster.clear");
            guild_monster.records = gm.setItem("guild_monster.records", []);
            state.setItem('staminaGuildMonster', 0);
            state.setItem('targetGuildMonster', {});
            state.setItem("GuildMonsterDashUpdate", true);
            return true;
        } catch (err) {
            $u.error("ERROR in guild_monster.clear: " + err);
            return false;
        }
    },

    navigate_to_main: function () {
        return caap.NavigateTo('guild', 'tab_guild_main_on.gif');
    },

    navigate_to_battles_refresh: function () {
        var button = caap.CheckForImage("guild_monster_tab_on.jpg");
        if (button) {
            caap.Click(button);
        }

        state.setItem('guildMonsterBattlesRefresh', false);
        return button ? true : false;
    },

    navigate_to_battles: function () {
        return caap.NavigateTo('guild,guild_current_monster_battles', 'guild_monster_tab_on.jpg');
    },

    /* This section is formatted to allow Advanced Optimisation by the Closure Compiler */
    /*jslint sub: true */
    populate: function () {
        try {
            var buttons = $j("input[src*='dragon_list_btn_']"),
                slotArr = [],
                it      = 0;

            if (buttons && buttons.length) {
                buttons.each(function () {
                    var button        = $j(this),
                        form          = null,
                        currentRecord = {},
                        imageName     = '',
                        slot          = 0,
                        name          = '',
                        guildId       = '',
                        passed        = true;

                    form = button.parents("form").eq(0);
                    if (form && form.length) {
                        slot = form.find("input[name='slot']").eq(0).attr("value");
                        slot = slot ? slot.parseInt() : 0;
                        if (typeof slot === 'number' && slot > 0 && slot <= 5) {
                            $u.log(3, "slot", slot);
                            slotArr.push(slot);
                            currentRecord = guild_monster.getItem(slot);
                            name = button.parents().eq(4).text();
                            name = name ? name.trim() : '';
                            if (name) {
                                if (currentRecord['name'] !== name) {
                                    $u.log(1, "Updated name", currentRecord['name'], name);
                                    currentRecord['name'] = name;
                                }
                            } else {
                                $u.warn("name error", name);
                                passed = false;
                            }

                            guildId = form.find("input[name='guild_id']").eq(0).attr("value");
                            if (caap.stats['guild']['id'] && guildId === caap.stats['guild']['id']) {
                                if (currentRecord['guildId'] !== guildId) {
                                    $u.log(2, "Updated guildId", currentRecord['guildId'], guildId);
                                    currentRecord['guildId'] = guildId;
                                }
                            } else {
                                $u.warn("guildId error", guildId, caap.stats['guild']['id']);
                                passed = false;
                            }

                            imageName = button.attr("src").filepart();
                            if (imageName) {
                                switch (imageName) {
                                case "dragon_list_btn_3.jpg":
                                    currentRecord['color'] = "black";
                                    currentRecord['state'] = "Alive";
                                    break;
                                case "dragon_list_btn_2.jpg":
                                case "dragon_list_btn_4.jpg":
                                    currentRecord['color'] = "grey";
                                    if (currentRecord['state'] !== "Completed") {
                                        $u.log(2, "Updated state", currentRecord['state'], "Collect");
                                        currentRecord['state'] = "Collect";
                                    }

                                    break;
                                default:
                                    currentRecord['state'] = "Error";
                                    $u.warn("state error", imageName);
                                    passed = false;
                                }
                            } else {
                                $u.warn("imageName error", button.attr("src"), imageName);
                                passed = false;
                            }
                        } else {
                            $u.warn("slot error", slot);
                            passed = false;
                        }
                    } else {
                        $u.warn("form error", button);
                        passed = false;
                    }

                    if (passed) {
                        $u.log(2, "currentRecord/button", currentRecord, button);
                        guild_monster.setItem(currentRecord);
                    } else {
                        $u.warn("populate record failed", currentRecord, button);
                    }
                });

                for (it = guild_monster.records.length - 1; it >= 0; it -= 1) {
                    if (slotArr.indexOf(guild_monster.records[it]['slot']) < 0) {
                        guild_monster.deleteItem(guild_monster.records[it]['slot']);
                    }
                }

                guild_monster.select(true);
            } else {
                $u.log(1, "No buttons found");
                guild_monster.clear();
            }

            caap.UpdateDashboard(true);
            return true;
        } catch (err) {
            $u.error("ERROR in guild_monster.populate: " + err);
            return false;
        }
    },

    onMonster: function () {
        try {
            var gates         = $j(),
                health        = $j(),
                healthGuild   = $j(),
                healthEnemy   = $j(),
                allowedDiv    = $j(),
                bannerDiv     = $j(),
                collectDiv    = $j(),
                collect       = false,
                myStatsTxt    = '',
                myStatsArr    = [],
                slot          = 0,
                currentRecord = {},
                minionRegEx   = new RegExp("(.*) Level (\\d+) Class: (.*) Health: (.+)/(.+) Status: (.*)");

            caap.chatLink(caap.appBodyDiv, "#app46755028429_guild_war_chat_log div[style*='border-bottom: 1px'] div[style*='font-size: 15px']");
            slot = $j("input[name='slot']").eq(0).attr("value");
            slot = slot ? slot.parseInt() : 0;
            bannerDiv = $j("#app46755028429_guild_battle_banner_section");
            myStatsTxt = bannerDiv.children().eq(2).children().eq(0).children().eq(1).text();
            myStatsTxt = myStatsTxt ? myStatsTxt.trim().innerTrim() : '';
            if (typeof slot === 'number' && slot > 0 && slot <= 5) {
                $u.log(3, "slot", slot);
                currentRecord = guild_monster.getItem(slot);
                currentRecord['minions'] = [];
                currentRecord['ticker'] = '';
                currentRecord['guildHealth'] = 0;
                currentRecord['enemyHealth'] = 0;
                if (!bannerDiv.attr("style").match(/_dead/)) {
                    currentRecord['ticker'] = $j("#app46755028429_monsterTicker").text();
                    currentRecord['ticker'] = currentRecord['ticker'] ? currentRecord['ticker'].trim() : '';
                    if (myStatsTxt) {
                        $u.log(3, "myStatsTxt", myStatsTxt);
                        myStatsArr = myStatsTxt.match(new RegExp("(.+) Level: (\\d+) Class: (.+) Health: (\\d+)/(\\d+).+Status: (.+) Battle Damage: (\\d+)"));
                        if (myStatsArr && myStatsArr.length === 8) {
                            $u.log(2, "myStatsArr", myStatsArr);
                            currentRecord['damage'] = myStatsArr[7] ? myStatsArr[7].parseInt() : 0;
                            currentRecord['myStatus'] = myStatsArr[6] ? myStatsArr[6].trim() : '';
                        } else {
                            $u.warn("myStatsArr error", myStatsArr, myStatsTxt);
                        }
                    }

                    allowedDiv = $j("#app46755028429_allowedAttacks");
                    if (allowedDiv && allowedDiv.length) {
                        currentRecord['attacks'] = allowedDiv.attr("value") ? allowedDiv.attr("value").parseInt() : 1;
                        if (currentRecord['attacks'] < 1 || currentRecord['attacks'] > 5) {
                            currentRecord['attacks'] = 1;
                            $u.warn("Invalid allowedAttacks");
                        }
                    } else {
                        $u.warn("Could not find allowedAttacks");
                    }

                    health = $j("#app46755028429_guild_battle_health");
                    if (health && health.length) {
                        healthEnemy = health.find("div[style*='guild_battle_bar_enemy.gif']").eq(0);
                        if (healthEnemy && healthEnemy.length) {
                            currentRecord['enemyHealth'] = (100 - healthEnemy.getPercent('width')).dp(2);
                        } else {
                            $u.warn("guild_battle_bar_enemy.gif not found");
                        }

                        healthGuild = health.find("div[style*='guild_battle_bar_you.gif']").eq(0);
                        if (healthGuild && healthGuild.length) {
                            currentRecord['guildHealth'] = (100 - healthGuild.getPercent('width')).dp(2);
                        } else {
                            $u.warn("guild_battle_bar_you.gif not found");
                        }
                    } else {
                        $u.warn("guild_battle_health error");
                    }

                    gates = $j("div[id*='app46755028429_enemy_guild_member_list_']");
                    if (!gates || !gates.length) {
                        $u.warn("No gates found");
                    } else if (gates && gates.length !== 4) {
                        $u.warn("Not enough gates found");
                    } else {
                        gates.each(function (gIndex) {
                            var memberDivs = $j(this).children();
                            if (!memberDivs || !memberDivs.length) {
                                $u.warn("No members found");
                            } else if (memberDivs && memberDivs.length !== 25) {
                                $u.warn("Not enough members found", memberDivs);
                            } else {
                                memberDivs.each(function (mIndex) {
                                    var member       = $j(this),
                                        memberText   = '',
                                        memberArr    = [],
                                        targetIdDiv  = $j(),
                                        memberRecord = new guild_monster.minion().data;

                                    memberRecord['attacking_position'] = (gIndex + 1);
                                    targetIdDiv = member.find("input[name='target_id']").eq(0);
                                    if (targetIdDiv && targetIdDiv.length) {
                                        memberRecord['target_id'] = targetIdDiv.attr("value") ? targetIdDiv.attr("value").parseInt() : 1;
                                    } else {
                                        $u.warn("Unable to find target_id for minion!", member);
                                    }

                                    memberText = member.children().eq(1).text();
                                    memberText = memberText ? memberText.trim().innerTrim() : '';
                                    memberArr = memberText.match(minionRegEx);
                                    if (memberArr && memberArr.length === 7) {
                                        memberRecord['name'] = memberArr[1] ? memberArr[1] : '';
                                        memberRecord['level'] = memberArr[2] ? memberArr[2].parseInt() : 0;
                                        memberRecord['mclass'] = memberArr[3] ? memberArr[3] : '';
                                        memberRecord['healthNum'] = memberArr[4] ? memberArr[4].parseInt() : 0;
                                        memberRecord['healthMax'] = memberArr[5] ? memberArr[5].parseInt() : 1;
                                        memberRecord['status'] = memberArr[6] ? memberArr[6] : '';
                                        memberRecord['percent'] = ((memberRecord['healthNum'] / memberRecord['healthMax']) * 100).dp(2);
                                    }

                                    currentRecord['minions'].push(memberRecord);
                                });
                            }
                        });
                    }
                } else {
                    collectDiv = $j("input[src*='collect_reward_button2.jpg']");
                    if (collectDiv && collectDiv.length) {
                        $u.log(1, "Monster is dead and ready to collect");
                        currentRecord['state'] = 'Collect';
                        if (config.getItem('guildMonsterCollect', false)) {
                            collect = true;
                        }
                    } else {
                        $u.log(1, "Monster is completed");
                        currentRecord['state'] = 'Completed';
                    }

                    currentRecord['color'] = "grey";
                }

                currentRecord['reviewed'] = new Date().getTime();
                $u.log(2, "currentRecord", currentRecord);
                guild_monster.setItem(currentRecord);
                if (collect) {
                    caap.Click(collectDiv.get(0));
                }
            } else {
                if (bannerDiv.children().eq(0).text().indexOf("You do not have an on going guild monster battle. Have your Guild initiate more!") >= 0) {
                    slot = state.getItem('guildMonsterReviewSlot', 0);
                    if (typeof slot === 'number' && slot > 0 && slot <= 5) {
                        $u.log(1, "monster expired", slot);
                        guild_monster.deleteItem(slot);
                    } else {
                        $u.warn("monster expired slot error", slot);
                    }
                } else {
                    $u.log(1, "On another guild's monster", myStatsTxt);
                }
            }

            return true;
        } catch (err) {
            $u.error("ERROR in guild_monster.onMonster: " + err);
            return false;
        }
    },

    getReview: function () {
        try {
            var it     = 0,
                len    = 0,
                record = {};

            for (it = 0, len = guild_monster.records.length; it < len; it += 1) {
                if (guild_monster.records[it]['state'] === 'Completed') {
                    continue;
                }

                if (!schedule.since(guild_monster.records[it]['reviewed'], 30 * 60)) {
                    continue;
                }

                record = guild_monster.records[it];
                break;
            }

            return record;
        } catch (err) {
            $u.error("ERROR in guild_monster.getReview: " + err, arguments.callee.caller);
            return undefined;
        }
    },

    checkPage: function (record) {
        try {
            if (!record || !$j.isPlainObject(record)) {
                throw "Not passed a record";
            }

            var slot = 0;
            slot = $j("input[name='slot']").eq(0).attr("value");
            slot = slot ? slot.parseInt() : 0;
            return (record['slot'] === slot);
        } catch (err) {
            $u.error("ERROR in guild_monster.checkPage: " + err, arguments.callee.caller);
            return undefined;
        }
    },

    getTargetMinion: function (record) {
        try {
            var it              = 0,
                ol              = 0,
                len             = 0,
                alive           = 0,
                minion          = {},
                minHealth       = 0,
                specialTargets  = [],
                firstSpecial    = -1,
                ignoreClerics   = false,
                attackOrderList = [],
                firstAttack     = 0,
                isSpecial       = false,
                isMatch         = false,
                attackNorth     = config.getItem('attackGateNorth', true),
                attackEast      = config.getItem('attackGateEast', true),
                attackSouth     = config.getItem('attackGateSouth', true),
                attackWest      = config.getItem('attackGateWest', true);

            if (!record || !$j.isPlainObject(record)) {
                throw "Not passed a record";
            }

            minHealth = config.getItem('IgnoreMinionsBelow', 0);
            if (typeof minHealth !== 'number') {
                minHealth = 0;
            }

            attackOrderList = config.getList('orderGuildMinion', '');
            if (!attackOrderList || attackOrderList.length === 0) {
                attackOrderList = [String.fromCharCode(0)];
                $u.log(2, "Added null character to getTargetMinion attackOrderList", attackOrderList);
            }

            ignoreClerics = config.getItem('ignoreClerics', false);
            for (ol = 0, len = attackOrderList.length; ol < len; ol += 1) {
                if (minion && $j.isPlainObject(minion) && !$j.isEmptyObject(minion)) {
                    $u.log(2, "Minion matched and set - break", minion);
                    break;
                }

                specialTargets = guild_monster.info[record['name']].special1.slice();
                for (it = record['minions'].length - 1; it >= 0; it -= 1) {
                    if (!attackNorth && record['minions'][it]['attacking_position'] === 1) {
                        $u.log(2, "Skipping North Minion", it, record['minions'][it]);
                        continue;
                    }

                    if (!attackWest && record['minions'][it]['attacking_position'] === 2) {
                        $u.log(2, "Skipping West Minion", it, record['minions'][it]);
                        continue;
                    }

                    if (!attackEast && record['minions'][it]['attacking_position'] === 3) {
                        $u.log(2, "Skipping East Minion", it, record['minions'][it]);
                        continue;
                    }

                    if (!attackSouth && record['minions'][it]['attacking_position'] === 4) {
                        $u.log(2, "Skipping South Minion", it, record['minions'][it]);
                        continue;
                    }

                    isSpecial = specialTargets.indexOf(it);
                    if (attackOrderList[ol] === String.fromCharCode(0)) {
                        isMatch = true;
                    } else {
                        isMatch = ((record['minions'][it]['name'].toLowerCase()).indexOf(attackOrderList[ol].match(new RegExp("^[^:]+")).toString().trim().toLowerCase()) < 0) ? false : true;
                    }

                    if (isMatch) {
                        $u.log(2, "Minion matched", it, record['minions'][it]);
                    }

                    if (record['minions'][it]['status'] === 'Stunned') {
                        if (isSpecial >= 0 && isNaN(record['minions'][it]['healthNum'])) {
                            specialTargets.pop();
                            if (isMatch) {
                                $u.log(2, "Special minion stunned", specialTargets);
                            }
                        } else if (isMatch) {
                            $u.log(2, "Minion stunned");
                        }

                        continue;
                    }

                    if (isSpecial >= 0) {
                        if (!isNaN(record['minions'][it]['healthNum'])) {
                            specialTargets.pop();
                            $u.log(2, "Not special minion", it, specialTargets);
                            if (ignoreClerics && record['minions'][it]['mclass'] === "Cleric") {
                                $u.log(2, "Ignoring Cleric", record['minions'][it]);
                                continue;
                            }
                        } else if (firstSpecial < 0) {
                            firstSpecial = it;
                            $u.log(2, "firstSpecial minion", firstSpecial);
                        } else {
                            $u.log(2, "Special minion", it, specialTargets);
                        }
                    }

                    if (minHealth && isSpecial < 0) {
                        if (record['minions'][it]['healthNum'] < minHealth) {
                            if (!alive) {
                                alive = it;
                                $u.log(2, "First alive", alive);
                            }

                            continue;
                        }
                    }

                    if (!isMatch) {
                        continue;
                    }

                    minion = record['minions'][it];
                    break;
                }
            }

            if ($j.isEmptyObject(minion) && firstSpecial >= 0) {
                minion = record['minions'][firstSpecial];
                $u.log(2, "Target Special", firstSpecial, record['minions'][firstSpecial]);
            }

            if (config.getItem('chooseIgnoredMinions', false) && alive) {
                minion = record['minions'][alive];
                $u.log(2, "Target Alive", alive, record['minions'][alive]);
            }

            $u.log(2, "Target minion", minion);
            return minion;
        } catch (err) {
            $u.error("ERROR in guild_monster.getTargetMinion: " + err, arguments.callee.caller);
            return undefined;
        }
    },

    select: function (force) {
        try {
            var it              = 0,
                ol              = 0,
                len             = 0,
                len1            = 0,
                attackOrderList = [],
                conditions      = '',
                ach             = 999999,
                max             = 999999,
                target          = {},
                firstOverAch    = {},
                firstUnderMax   = {};

            if (!(force || schedule.oneMinuteUpdate('selectGuildMonster'))) {
                return false;
            }

            state.setItem('targetGuildMonster', {});
            attackOrderList = config.getList('orderGuildMonster', '');
            if (!attackOrderList || attackOrderList.length === 0) {
                attackOrderList = [String.fromCharCode(0)];
                $u.log(3, "Added null character to select attackOrderList", attackOrderList);
            }

            for (it = guild_monster.records.length - 1; it >= 0; it -= 1) {
                if (guild_monster.records[it]['state'] !== 'Alive') {
                    guild_monster.records[it]['color'] = "grey";
                    guild_monster.records[it]['conditions'] = '';
                    continue;
                }

                attackOrderList.push(guild_monster.records[it]['slot'].toString());
                guild_monster.records[it]['conditions'] = 'none';
                guild_monster.records[it]['color'] = "black";
            }

            for (ol = 0, len1 = attackOrderList.length; ol < len1; ol += 1) {
                conditions = attackOrderList[ol].replace(new RegExp("^[^:]+"), '').toString().trim();
                for (it = 0, len = guild_monster.records.length ; it < len; it += 1) {
                    if (guild_monster.records[it]['state'] !== 'Alive') {
                        guild_monster.records[it]['color'] = "grey";
                        continue;
                    }

                    if (guild_monster.records[it]['myStatus'] === 'Stunned') {
                        guild_monster.records[it]['color'] = "purple";
                        continue;
                    }

                    if (guild_monster.records[it]['conditions'] !== 'none') {
                        continue;
                    }

                    if (attackOrderList[ol] !== String.fromCharCode(0)) {
                        if ((guild_monster.records[it]['slot'] + " " + guild_monster.records[it]['name'].toLowerCase()).indexOf(attackOrderList[ol].match(new RegExp("^[^:]+")).toString().trim().toLowerCase()) < 0) {
                            continue;
                        }
                    }

                    if (conditions) {
                        guild_monster.records[it]['conditions'] = conditions;
                        if (conditions.indexOf("ach") >= 0) {
                            ach = monster.parseCondition('ach', conditions);
                        }

                        if (conditions.indexOf("max") >= 0) {
                            max = monster.parseCondition('max', conditions);
                        }
                    }

                    if (guild_monster.records[it]['damage'] >= ach) {
                        guild_monster.records[it]['color'] = "darkorange";
                        if (!firstOverAch || !$j.isPlainObject(firstOverAch) || $j.isEmptyObject(firstOverAch)) {
                            if (guild_monster.records[it]['damage'] >= max) {
                                guild_monster.records[it]['color'] = "red";
                                $u.log(2, 'OverMax', guild_monster.records[it]);
                            } else {
                                firstOverAch = guild_monster.records[it];
                                $u.log(2, 'firstOverAch', firstOverAch);
                            }
                        }
                    } else if (guild_monster.records[it]['damage'] < max) {
                        if (!firstUnderMax || !$j.isPlainObject(firstUnderMax) || $j.isEmptyObject(firstUnderMax)) {
                            firstUnderMax = guild_monster.records[it];
                            $u.log(2, 'firstUnderMax', firstUnderMax);
                        }
                    } else {
                        guild_monster.records[it]['color'] = "red";
                        $u.log(2, 'OverMax', guild_monster.records[it]);
                    }
                }
            }

            target = firstUnderMax;
            if (!target || !$j.isPlainObject(target) || $j.isEmptyObject(target)) {
                target = firstOverAch;
            }

            $u.log(2, 'target', target);
            if (target && $j.isPlainObject(target) && !$j.isEmptyObject(target)) {
                target['color'] = 'green';
                guild_monster.setItem(target);
            } else {
                state.setItem('guildMonsterBattlesBurn', false);
                guild_monster.save();
            }

            return state.setItem('targetGuildMonster', target);
        } catch (err) {
            $u.error("ERROR in guild_monster.select: " + err, arguments.callee.caller);
            return undefined;
        }
    },
    /*jslint sub: false */

    attack2stamina: {
        1: 1,
        2: 5,
        3: 10,
        4: 20,
        5: 50
    },

    /* This section is formatted to allow Advanced Optimisation by the Closure Compiler */
    /*jslint sub: true */
    getAttackValue: function (record, minion) {
        try {
            if (!minion || !$j.isPlainObject(minion)) {
                throw "Not passed a minion";
            }

            var attack         = 0,
                recordInfo     = guild_monster.info[record['name']],
                specialTargets = recordInfo.special2.slice();

            if (specialTargets.indexOf(minion['target_id']) >= 0 && isNaN(minion['healthNum'])) {
                if (caap.stats['staminaT']['num'] < 5) {
                    attack = 1;
                } else if (caap.stats['staminaT']['num'] < 10) {
                    attack = 2;
                } else if (caap.stats['staminaT']['num'] < 20) {
                    attack = 3;
                } else if (caap.stats['staminaT']['num'] < 50) {
                    attack = 4;
                } else {
                    attack = 5;
                }
            } else if (minion['healthNum'] < recordInfo.health[0]) {
                attack = 1;
            } else if (minion['healthNum'] < recordInfo.health[1]) {
                if (caap.stats['staminaT']['num'] < 5) {
                    attack = 1;
                } else {
                    attack = 2;
                }
            } else if (minion['healthNum'] < recordInfo.health[2]) {
                if (caap.stats['staminaT']['num'] < 5) {
                    attack = 1;
                } else if (caap.stats['staminaT']['num'] < 10) {
                    attack = 2;
                } else {
                    attack = 3;
                }
            } else if (minion['healthNum'] < recordInfo.health[3]) {
                if (caap.stats['staminaT']['num'] < 5) {
                    attack = 1;
                } else if (caap.stats['staminaT']['num'] < 10) {
                    attack = 2;
                } else if (caap.stats['staminaT']['num'] < 20) {
                    attack = 3;
                } else {
                    attack = 4;
                }
            } else {
                if (caap.stats['staminaT']['num'] < 5) {
                    attack = 1;
                } else if (caap.stats['staminaT']['num'] < 10) {
                    attack = 2;
                } else if (caap.stats['staminaT']['num'] < 20) {
                    attack = 3;
                } else if (caap.stats['staminaT']['num'] < 50) {
                    attack = 4;
                } else {
                    attack = 5;
                }
            }

            if (attack > record['attacks']) {
                attack = record['attacks'];
            }

            $u.log(2, 'getAttackValue', attack);
            return attack;
        } catch (err) {
            $u.error("ERROR in guild_monster.getAttackValue: " + err, arguments.callee.caller);
            return undefined;
        }
    },

    getStaminaValue: function (record, minion) {
        try {
            if (!minion || !$j.isPlainObject(minion)) {
                throw "Not passed a minion";
            }

            var stamina        = 0,
                staminaCap     = 0,
                recordInfo     = guild_monster.info[record['name']],
                specialTargets = recordInfo.special2.slice();

            if (specialTargets.indexOf(minion['target_id']) >= 0 && isNaN(minion['healthNum'])) {
                stamina = 50;
            } else if (minion['healthNum'] < recordInfo.health[0]) {
                stamina = 1;
            } else if (minion['healthNum'] < recordInfo.health[1]) {
                stamina = 5;
            } else if (minion['healthNum'] < recordInfo.health[2]) {
                stamina = 10;
            } else if (minion['healthNum'] < recordInfo.health[3]) {
                stamina = 20;
            } else {
                stamina = 50;
            }

            staminaCap = guild_monster.attack2stamina[record['attacks']];
            if (stamina > staminaCap) {
                stamina = staminaCap;
            }

            $u.log(2, 'getStaminaValue', stamina);
            return stamina;
        } catch (err) {
            $u.error("ERROR in guild_monster.getStaminaValue: " + err, arguments.callee.caller);
            return undefined;
        }
    }
    /*jslint sub: false */
};
////////////////////////////////////////////////////////////////////
//                          arena OBJECT
// this is the main object for dealing with guild monsters
/////////////////////////////////////////////////////////////////////

arena = {
    records: [],

    record: function () {
        this.data = {
            'reviewed'    : 0,
            'days'        : 0,
            'tokens'      : 0,
            'tokenTime'   : '',
            'collect'     : false,
            'startTime'   : 0,
            'ticker'      : '',
            'nextTime'    : '',
            'minions'     : [],
            'teamHealth'  : 0,
            'enemyHealth' : 0,
            'damage'      : 0,
            'myStatus'    : '',
            'myClass'     : '',
            'state'       : '',
            'wins'        : [],
            'losses'      : []
        };
    },

    minion: function () {
        this.data = {
            'index'              : 0,
            'attacking_position' : 0,
            'target_id'          : 0,
            'name'               : '',
            'level'              : 0,
            'mclass'             : '',
            'healthNum'          : 0,
            'healthMax'          : 0,
            'status'             : '',
            'percent'            : 0,
            'points'             : 0,
            'won'                : false,
            'lost'               : false,
            'poly'               : false,
            'shout'              : false,
            'shield'             : false,
            'last_ap'            : 0
        };
    },

    win: function () {
        this.data = {
            'userId' : 0,
            'ap'     : 0
        };
    },

    me: function () {
        this.data = {
            'name'               : '',
            'level'              : 0,
            'mclass'             : '',
            'healthNum'          : 0,
            'healthMax'          : 0,
            'status'             : '',
            'percent'            : 0
        };
    },

    load: function () {
        try {
            arena.records = gm.getItem('arena.records', 'default');
            if (arena.records === 'default' || !$j.isArray(arena.records)) {
                arena.records = gm.setItem('arena.records', []);
            }

            arena.cleanWins();
            state.setItem("ArenaDashUpdate", true);
            $u.log(3, "arena.load", arena.records);
            return true;
        } catch (err) {
            $u.error("ERROR in arena.load: " + err);
            return false;
        }
    },

    save: function () {
        try {
            gm.setItem('arena.records', arena.records);
            state.setItem("ArenaDashUpdate", true);
            $u.log(3, "arena.save", arena.records);
            return true;
        } catch (err) {
            $u.error("ERROR in arena.save: " + err);
            return false;
        }
    },

    /* This section is formatted to allow Advanced Optimisation by the Closure Compiler */
    /*jslint sub: true */
    getItem: function () {
        try {
            return (arena.records.length ? arena.records[0] : new arena.record().data);
        } catch (err) {
            $u.error("ERROR in arena.getItem: " + err, arguments.callee.caller);
            return false;
        }
    },

    setItem: function (record) {
        try {
            if (!record || !$j.isPlainObject(record)) {
                throw "Not passed a record";
            }

            arena.records[0] = record;
            $u.log(2, "Updated arena record", record, arena.records);
            arena.save();
            return true;
        } catch (err) {
            $u.error("ERROR in arena.setItem: " + err);
            return false;
        }
    },

    deleteItem: function (slot) {
        try {
            var it        = 0,
                len       = 0,
                success   = false;

            if (typeof slot !== 'number' || slot <= 0) {
                $u.warn("slot", slot);
                throw "Invalid identifying slot!";
            }

            for (it = 0, len = arena.records.length; it < len; it += 1) {
                if (arena.records[it]['slot'] === slot) {
                    success = true;
                    break;
                }
            }

            if (success) {
                arena.records.splice(it, 1);
                arena.save();
                $u.log(3, "Deleted arena record", slot, arena.records);
                return true;
            } else {
                $u.warn("Unable to delete arena record", slot, arena.records);
                return false;
            }
        } catch (err) {
            $u.error("ERROR in arena.deleteItem: " + err);
            return false;
        }
    },
    /*jslint sub: false */

    clear: function () {
        try {
            $u.log(1, "arena.clear");
            arena.records = gm.setItem("arena.records", []);
            state.setItem('staminaArena', 0);
            state.setItem('targetArena', {});
            state.setItem("ArenaDashUpdate", true);
            return true;
        } catch (err) {
            $u.error("ERROR in arena.clear: " + err);
            return false;
        }
    },

    /* This section is formatted to allow Advanced Optimisation by the Closure Compiler */
    /*jslint sub: true */
    setWin: function (records, won) {
        try {
            if (!records || !$j.isArray(records)) {
                throw "Not passed records";
            }

            if (!won || !$j.isPlainObject(won)) {
                throw "Not passed a win";
            }

            if (won['userId'] === '' || isNaN(won['userId']) || won['userId'] < 1) {
                $u.warn("userId", won['userId']);
                throw "Invalid identifying userId!";
            }

            var it      = 0,
                len     = 0,
                success = false;

            for (it = 0, len = records.length; it < len; it += 1) {
                if (records[it]['userId'] === won['userId']) {
                    success = true;
                    break;
                }
            }

            if (success) {
                records[it] = won;
                $u.log(3, "Updated records", won, records);
            } else {
                records.push(won);
                $u.log(3, "Added records", won, records);
            }

            return records;
        } catch (err) {
            $u.error("ERROR in arena.setWin: " + err, won, records, arguments.callee.caller);
            return false;
        }
    },

    getWin: function (records, userId) {
        try {
            if (!records || !$j.isArray(records)) {
                throw "Not passed records";
            }

            if (userId === '' || isNaN(userId) || userId < 1) {
                $u.warn("userId", userId);
                throw "Invalid identifying userId!";
            }

            var it      = 0,
                len     = 0,
                success = false;

            for (it = 0, len = records.length; it < len; it += 1) {
                if (records[it]['userId'] === userId) {
                    success = true;
                    break;
                }
            }

            if (success) {
                $u.log(3, "Got win record", userId, records[it]);
                return records[it];
            } else {
                $u.log(3, "No win record", userId);
                return false;
            }
        } catch (err) {
            $u.error("ERROR in arena.getWin: " + err, userId, records, arguments.callee.caller);
            return false;
        }
    },

    delWin: function (records, userId) {
        try {
            if (!records || !$j.isArray(records)) {
                throw "Not passed records";
            }

            if (userId === '' || isNaN(userId) || userId < 1) {
                $u.warn("userId", userId);
                throw "Invalid identifying userId!";
            }

            var it      = 0,
                len     = 0,
                success = false;

            for (it = 0, len = records.length; it < len; it += 1) {
                if (records[it]['userId'] === userId) {
                    success = true;
                    break;
                }
            }

            if (success) {
                records.splice(it, 1);
                $u.log(2, "Deleted win record", userId, records);
                return records;
            } else {
                $u.log(3, "Unable to delete win record", userId, records);
                return false;
            }
        } catch (err) {
            $u.error("ERROR in arena.delWin: " + err, userId, records, arguments.callee.caller);
            return false;
        }
    },

    setLoss: function (records, userId) {
        try {
            if (!records || !$j.isArray(records)) {
                throw "Not passed records";
            }

            if (userId === '' || isNaN(userId) || userId < 1) {
                $u.warn("userId", userId);
                throw "Invalid identifying userId!";
            }

            if (records.indexOf(userId) >= 0) {
                $u.log(3, "userId exists", userId, records);
            } else {
                records.push(userId);
                $u.log(3, "Added userId", userId, records);
            }

            return records;
        } catch (err) {
            $u.error("ERROR in arena.setLoss: " + err, userId, records, arguments.callee.caller);
            return false;
        }
    },

    checkLoss: function (records, userId) {
        try {
            if (!records || !$j.isArray(records)) {
                throw "Not passed records";
            }

            if (userId === '' || isNaN(userId) || userId < 1) {
                $u.warn("userId", userId);
                throw "Invalid identifying userId!";
            }

            if (records.indexOf(userId) >= 0) {
                $u.log(3, "userId exists", userId, records);
                return true;
            } else {
                $u.log(3, "userId not exists", userId, records);
                return false;
            }
        } catch (err) {
            $u.error("ERROR in arena.checkLoss: " + err, userId, records, arguments.callee.caller);
            return undefined;
        }
    },

    delLoss: function (records, userId) {
        try {
            if (!records || !$j.isArray(records)) {
                throw "Not passed records";
            }

            if (userId === '' || isNaN(userId) || userId < 1) {
                $u.warn("userId", userId);
                throw "Invalid identifying userId!";
            }

            var it = -1;
            it = records.indexOf(userId);
            if (it >= 0) {
                records.splice(it, 1);
                $u.log(2, "Deleted loss", userId, records);
                return records;
            } else {
                $u.log(3, "Unable to delete loss", userId, records);
                return false;
            }
        } catch (err) {
            $u.error("ERROR in arena.delLoss: " + err, userId, records, arguments.callee.caller);
            return false;
        }
    },

    cleanWins: function () {
        try {
            var arenaInfo = {},
                wins      = [],
                it        = 0,
                len       = 0,
                found     = false;

            arenaInfo = arena.getItem();
            if (!$j.isEmptyObject(arenaInfo)) {
                for (it = 0, len = arenaInfo['wins'].length; it < len; it += 1) {
                    if (arenaInfo['losses'].indexOf(arenaInfo['wins'][it]['userId']) >= 0) {
                        $u.log(1, "Found win in losses: delete", arenaInfo['wins'][it]);
                        arenaInfo['wins'].splice(it, 1);
                        found = true;
                    }
                }
            } else {
                $u.log(1, "No loss records available", arenaInfo);
            }

            if (found) {
                arena.setItem(arenaInfo);
            }

            return true;
        } catch (err) {
            $u.error("ERROR in arena.cleanWins: " + err, arguments.callee.caller);
            return false;
        }
    },

    /*jslint sub: false */

    navigate_to_main: function () {
        return caap.NavigateTo('battle,arena', 'tab_arena_on.gif');
    },

    navigate_to_main_refresh: function () {
        var button = caap.CheckForImage("tab_arena_on.gif");
        if (button) {
            caap.Click(button);
        }

        state.setItem('ArenaRefresh', false);
        return button ? true : false;
    },

    /* This section is formatted to allow Advanced Optimisation by the Closure Compiler */
    /*jslint sub: true */
    checkInfo: function () {
        try {
            var tokenSpan   = $j(),
                timerSpan   = $j(),
                daysDiv     = $j(),
                bottomDiv   = $j(),
                enterButton = null,
                tStr        = '',
                tStr2       = '',
                tNum        = 0,
                arenaInfo   = {};

            arenaInfo = arena.getItem();
            arenaInfo['reviewed'] = new Date().getTime();

            tokenSpan = $j("span[id='app46755028429_guild_token_current_value']");
            tStr = tokenSpan.length ? tokenSpan.text().trim() : '';
            arenaInfo['tokens'] = tStr ? tStr.parseInt() : 0;

            timerSpan = $j("span[id='app46755028429_guild_token_time_value']");
            tStr = timerSpan.length ? timerSpan.text().trim() : '';
            tStr = tStr ? tStr.regex(/(\d+:\d+)/) : '';
            arenaInfo['tokenTime'] = tStr ? tStr : '';

            daysDiv = $j("#app46755028429_arena_banner").children().eq(0).children().eq(0);
            tStr = daysDiv.length ? daysDiv.text().trim() : '';
            arenaInfo['days'] = tStr ? tStr.regex(/(\d+) DAYS/) : 0;

            bottomDiv = $j("div[style *='arena3_home_bottom.jpg']");
            tStr = bottomDiv.length ? bottomDiv.text().trim().innerTrim() : '';
            arenaInfo['collect'] = tStr ? (tStr.regex(/(Battle Over, Collect Your Reward!)/)  ? true : false) : false;
            tStr2 = tStr ? tStr.regex(/^Time Remaining: (\d+:\d+:\d+)/) : '';
            arenaInfo['ticker'] = tStr2 ? tStr2 : '';
            if (arenaInfo['ticker'].parseTimer() && arenaInfo['state'] === 'Completed') {
                arenaInfo['state'] = 'Ready';
                arenaInfo['myStatus'] = '';
                arenaInfo['damage'] = 0;
                arenaInfo['teamHealth'] = 0;
                arenaInfo['enemyHealth'] = 0;
            }

            tStr2 = tStr ? tStr.regex(/ Time Remaining: (\d+:\d+:\d+)/) : '';
            arenaInfo['nextTime'] = tStr2 ? tStr2 : '';
            tStr = tStr ? tStr.regex(new RegExp("Battle Starts In (\\d+ .+?)\\(")) : '';
            tNum = tStr ? tStr.regex(/(\d+)/) : 0;
            tStr = tStr ? tStr.regex(new RegExp("\\d+ (.+)")) : 'sec';
            $u.log(3, "startTime", tNum, tStr);
            if (tStr === 'sec') {
                arenaInfo['startTime'] = tNum;
            } else if (tStr === 'min') {
                arenaInfo['startTime'] = tNum * 60;
            }

            arena.setItem(arenaInfo);
            if (arenaInfo['startTime'] && arenaInfo['state'] === 'Ready') {
                arenaInfo['minions'] = [];
                $u.log(2, "Arena starting in", arenaInfo['startTime']);
                schedule.setItem("ArenaReview", arenaInfo['startTime'], 20);
            } else if (arenaInfo['nextTime'] && arenaInfo['nextTime'].parseTimer() < 3600 && arenaInfo['state'] === 'Ready') {
                $u.log(2, "Waiting Arena start in", arenaInfo['nextTime']);
                schedule.setItem("ArenaReview", arenaInfo['nextTime'].parseTimer(), 20);
            } else {
                if (arenaInfo['tokenTime'] && arenaInfo['tokenTime'].parseTimer() && arenaInfo['state'] === 'Alive') {
                    schedule.setItem("ArenaReview", arenaInfo['tokenTime'].parseTimer(), 20);
                    $u.log(2, "Waiting Arena token in", arenaInfo['tokenTime']);
                } else {
                    schedule.setItem("ArenaReview", gm.getItem('ArenaReviewMins', 5, hiddenVar) * 60, 120);
                    $u.log(2, "Waiting 5 mins for Arena review");
                }
            }

            $u.log(3, "arena.checkInfo", arenaInfo);
            return true;
        } catch (err) {
            $u.error("ERROR in arena.checkInfo: " + err);
            return false;
        }
    },

    onBattle: function () {
        try {
            var gates         = $j(),
                tabs          = $j(),
                health        = $j(),
                healthGuild   = $j(),
                healthEnemy   = $j(),
                allowedDiv    = $j(),
                bannerDiv     = $j(),
                collectDiv    = $j(),
                enterDiv      = $j(),
                tokenSpan     = $j(),
                timerSpan     = $j(),
                resultBody    = $j(),
                imgDiv        = $j(),
                collect       = false,
                myStatsTxt    = '',
                myStatsArr    = [],
                index         = 0,
                currentRecord = {},
                minions       = [],
                tStr          = '',
                checkStr      = '',
                tNum          = 0,
                resultsTxt    = '',
                lastAttacked  = {},
                won           = {},
                losses        = [],
                wins          = [],
                notStarted    = '',
                notArena      = '',
                battleOver    = '',
                minionRegEx   = new RegExp("(.*) Level: (\\d+) Class: (.*) Health: (\\d+)/(\\d+) Status: (.*) Arena Activity Points: (\\d+)");

            currentRecord = arena.getItem();
            if (currentRecord['state'] !== 'Alive') {
                $u.log(2, "Test targeting");
                arena.getTargetMinion(currentRecord);
            }

            if (!currentRecord['wins']) {
                currentRecord['wins'] = [];
            }

            if (!currentRecord['losses']) {
                currentRecord['losses'] = [];
            }

            if (!currentRecord['myClass']) {
                currentRecord['myClass'] = '';
            }

            lastAttacked = state.getItem('ArenaMinionAttacked', {});
            state.setItem('ArenaMinionAttacked', {});
            if (!$j.isEmptyObject(lastAttacked) && lastAttacked['index'] >= 0 && lastAttacked['index'] < 40) {
                resultBody = $j("span[class='result_body']");
                if (resultBody && resultBody.length) {
                    tStr = resultBody.text();
                    tNum = tStr ? tStr.regex(/\+(\d+) Battle Activity Points/) : 0;
                }

                imgDiv = $j("img[src*='battle_defeat.gif']");
                if (imgDiv && imgDiv.length) {
                    if (lastAttacked['poly']) {
                        $u.log(1, "Defeated by polymorphed minion", tNum, currentRecord['minions'][lastAttacked['index']]);
                    } else {
                        if (tNum > 50) {
                            currentRecord['minions'][lastAttacked['index']]['lost'] = true;
                            currentRecord['minions'][lastAttacked['index']]['won'] = false;
                            currentRecord['minions'][lastAttacked['index']]['last_ap'] = 0;
                            wins = arena.delWin(currentRecord['wins'], currentRecord['minions'][lastAttacked['index']]['target_id']);
                            currentRecord['wins'] = wins ? wins : currentRecord['wins'];
                            losses = arena.setLoss(currentRecord['losses'], currentRecord['minions'][lastAttacked['index']]['target_id']);
                            currentRecord['losses'] = losses ? losses : currentRecord['losses'];
                            arena.setItem(currentRecord);
                        } else {
                            $u.log(1, "You were polymorphed");
                        }

                        $u.log(1, "Defeated by minion", tNum, currentRecord['minions'][lastAttacked['index']]);
                    }
                } else {
                    imgDiv = $j("img[src*='battle_victory.gif']");
                    if (imgDiv && imgDiv.length) {
                        if (lastAttacked['poly']) {
                            $u.log(1, "Victory against polymorphed minion", tNum, currentRecord['minions'][lastAttacked['index']]);
                        } else if (imgDiv && imgDiv.length) {
                            currentRecord['minions'][lastAttacked['index']]['lost'] = false;
                            currentRecord['minions'][lastAttacked['index']]['won'] = true;
                            currentRecord['minions'][lastAttacked['index']]['last_ap'] = tNum ? tNum : 160;
                            won = new arena.win();
                            won.data['userId'] = currentRecord['minions'][lastAttacked['index']]['target_id'];
                            won.data['ap'] = currentRecord['minions'][lastAttacked['index']]['last_ap'];
                            wins = arena.setWin(currentRecord['wins'], won.data);
                            currentRecord['wins'] = wins ? wins : currentRecord['wins'];
                            losses = arena.delLoss(currentRecord['losses'], currentRecord['minions'][lastAttacked['index']]['target_id']);
                            currentRecord['losses'] = losses ? losses : currentRecord['losses'];
                            arena.setItem(currentRecord);
                            $u.log(1, "Victory against minion", tNum, currentRecord['minions'][lastAttacked['index']]);
                        }
                    } else {
                        resultsTxt = $j("div[class='results']").text();
                        if (resultsTxt.regex(/(You do not have enough battle tokens for this action)/i)) {
                            $u.log(1, "You didn't have enough battle tokens");
                        } else if (resultsTxt.regex(/(does not have any health left to battle)/i)) {
                            $u.log(1, "Minion had no health left");
                        } else if (resultsTxt.regex(/(you tripped)/i)) {
                            $u.log(1, "oops, you tripped");
                        } else {
                            $u.log(1, "Unknown win or loss or result");
                        }
                    }
                }
            }

            bannerDiv = $j("#app46755028429_arena_battle_banner_section");
            myStatsTxt = bannerDiv.text();
            myStatsTxt = myStatsTxt ? myStatsTxt.trim().innerTrim() : '';
            notStarted = myStatsTxt.regex(/(This Battle Has Not Started Yet)/);
            notArena = myStatsTxt.regex(/(You Are Not A Part Of This Arena Battle)/);
            battleOver = myStatsTxt.regex(/(This Arena Battle Is Over)/);
            if (notArena) {
                return true;
            }

            $u.log(3, "myStatsTxt", myStatsTxt);
            if (bannerDiv && bannerDiv.length) {
                currentRecord['teamHealth'] = 0;
                currentRecord['enemyHealth'] = 0;
                if (!notStarted) {
                    gates = $j("div[id*='app46755028429_enemy_guild_member_list_']");
                    if (!gates || !gates.length) {
                        tabs = $j("div[id*='app46755028429_your_arena_tab']");
                        if (!tabs || !tabs.length) {
                            $u.warn("No gates found");
                        }
                    } else if (gates && gates.length !== 4) {
                        $u.warn("Not enough gates found");
                    } else {
                        gates.each(function (gIndex) {
                            var memberDivs = $j(this).children();
                            if (!memberDivs || !memberDivs.length) {
                                $u.warn("No members found");
                            } else if (memberDivs && memberDivs.length !== 10) {
                                $u.warn("Not enough members found", memberDivs);
                            } else {
                                memberDivs.each(function (mIndex) {
                                    var member       = $j(this),
                                        memberText   = '',
                                        memberArr    = [],
                                        targetIdDiv  = $j(),
                                        polyImg      = $j(),
                                        shoutImg     = $j(),
                                        shieldImg    = $j(),
                                        nameDiv      = $j(),
                                        loss         = false,
                                        memberRecord = new arena.minion().data;

                                    memberRecord['index'] = index;
                                    targetIdDiv = member.find("input[name='target_id']").eq(0);
                                    if (targetIdDiv && targetIdDiv.length) {
                                        memberRecord['target_id'] = targetIdDiv.attr("value") ? targetIdDiv.attr("value").parseInt() : 0;
                                        won = arena.getWin(currentRecord['wins'], memberRecord['target_id']);
                                        if (won) {
                                            memberRecord['won'] = true;
                                            memberRecord['last_ap'] = won['ap'] ? won['ap'] : 0;
                                        }

                                        loss = arena.checkLoss(currentRecord['losses'], memberRecord['target_id']);
                                        if (typeof loss === 'boolean') {
                                            memberRecord['lost'] = loss;
                                        }
                                    } else {
                                        $u.warn("Unable to find target_id for minion!", member);
                                    }

                                    memberRecord['attacking_position'] = (gIndex + 1);
                                    memberText = member.children().eq(1).text();
                                    memberText = memberText ? memberText.trim().innerTrim() : '';
                                    $u.log(3, "memberText", memberText);
                                    memberArr = memberText.match(minionRegEx);
                                    if (memberArr && memberArr.length === 8) {
                                        memberRecord['name'] = memberArr[1] ? memberArr[1] : '';
                                        memberRecord['level'] = memberArr[2] ? memberArr[2].parseInt() : 0;
                                        memberRecord['mclass'] = memberArr[3] ? memberArr[3] : '';
                                        memberRecord['healthNum'] = memberArr[4] ? memberArr[4].parseInt() : 0;
                                        memberRecord['healthMax'] = memberArr[5] ? memberArr[5].parseInt() : 0;
                                        memberRecord['status'] = memberArr[6] ? memberArr[6] : '';
                                        memberRecord['points'] = memberArr[7] ? memberArr[7].parseInt() : 0;
                                        memberRecord['percent'] = ((memberRecord['healthNum'] / (memberRecord['healthMax'] ? memberRecord['healthMax'] : 1)) * 100).dp(2);
                                    } else {
                                        $u.warn("Minion match issue!", memberArr);
                                    }

                                    if (currentRecord['minions'] && currentRecord['minions'].length === 40) {
                                        if (currentRecord['minions'][index]['index'] === index) {
                                            memberRecord['lost'] = currentRecord['minions'][index]['lost'] ? currentRecord['minions'][index]['lost'] : false;
                                            memberRecord['last_ap'] = currentRecord['minions'][index]['last_ap'] ? currentRecord['minions'][index]['last_ap'] : 0;
                                        } else {
                                            $u.warn("Minion index issue!", index, currentRecord['minions'][index], memberRecord);
                                        }
                                    }

                                    nameDiv = member.find("div[style='font-size: 19px; padding-bottom: 3px;']");
                                    if (nameDiv && nameDiv.length === 1) {
                                        if (memberRecord['won']) {
                                            tStr = '<div style="float: left; width: 220px; font-size: 11px;"><span style="float: left;" title="Won - Last Points: ' + memberRecord['last_ap'];
                                            tStr += '" class="ui-icon ui-icon-circle-check">Won</span> Last Points: ' + memberRecord['last_ap'] + '</div>';
                                            nameDiv.after(tStr);
                                        }

                                        if (memberRecord['lost']) {
                                            tStr = '<div style="float: left; width: 220px; font-size: 11px;"><span style="float: left;" title="Lost" class="ui-icon ui-icon-circle-close">Lost</span>Lost</div>';
                                            nameDiv.after(tStr);
                                        }
                                    }

                                    polyImg = member.find("img[src*='polymorph_effect']");
                                    memberRecord['poly'] = (polyImg && polyImg.length) ? true : false;
                                    if (memberRecord['poly']) {
                                        $u.log(3, "poly", memberRecord);
                                    }

                                    shoutImg = member.find("img[src*='warrior_effect_shout']");
                                    memberRecord['shout'] = (shoutImg && shoutImg.length) ? true : false;
                                    if (memberRecord['shout']) {
                                        $u.log(2, "shout", memberRecord);
                                    }

                                    shieldImg = member.find("img[src*='mage_effect_shield']");
                                    memberRecord['shield'] = (shieldImg && shieldImg.length) ? true : false;
                                    if (memberRecord['shield']) {
                                        $u.log(2, "shield", memberRecord);
                                    }

                                    index = minions.push(memberRecord);
                                });
                            }
                        });
                    }
                }

                collectDiv = $j("input[src*='arena3_collectbutton.gif']");
                enterDiv = $j("input[src*='guild_enter_battle_button.gif']");
                if (currentRecord['ticker'] && !notStarted && !battleOver && !collectDiv.length  && !enterDiv.length) {
                    currentRecord['state'] = 'Alive';
                    tStr = $j("span[id='app46755028429_monsterTicker']").text();
                    currentRecord['ticker'] = tStr ? tStr.trim() : '';
                    if (myStatsTxt) {
                        $u.log(3, "myStatsTxt", myStatsTxt);
                        myStatsArr = myStatsTxt.match(new RegExp("(.+) Level: (\\d+) Class: (.+) Health: (\\d+)/(\\d+).+Status: (.+) Arena Activity Points: (\\d+)"));
                        if (myStatsArr && myStatsArr.length === 8) {
                            $u.log(3, "myStatsArr", myStatsArr);
                            currentRecord['damage'] = myStatsArr[7] ? myStatsArr[7].parseInt() : 0;
                            currentRecord['myStatus'] = myStatsArr[6] ? myStatsArr[6].trim() : '';
                            currentRecord['myClass'] = myStatsArr[3] ? myStatsArr[3].trim() : '';
                        } else {
                            $u.warn("myStatsArr error", myStatsArr, myStatsTxt);
                        }
                    }

                    tokenSpan = $j("span[id='app46755028429_guild_token_current_value']");
                    tStr = tokenSpan.length ? tokenSpan.text().trim() : '';
                    currentRecord['tokens'] = tStr ? tStr.parseInt() : 0;

                    timerSpan = $j("span[id='app46755028429_guild_token_time_value']");
                    tStr = timerSpan.length ? timerSpan.text().trim() : '';
                    currentRecord['tokenTime'] = tStr ? tStr.regex(/(\d+:\d+)/) : '0:00';

                    health = $j("#app46755028429_guild_battle_health");
                    if (health && health.length) {
                        healthEnemy = health.find("div[style*='guild_battle_bar_enemy.gif']").eq(0);
                        if (healthEnemy && healthEnemy.length) {
                            currentRecord['enemyHealth'] = (100 - healthEnemy.getPercent('width')).dp(2);
                        } else {
                            $u.warn("guild_battle_bar_enemy.gif not found");
                        }

                        healthGuild = health.find("div[style*='guild_battle_bar_you.gif']").eq(0);
                        if (healthGuild && healthGuild.length) {
                            currentRecord['teamHealth'] = (100 - healthGuild.getPercent('width')).dp(2);
                        } else {
                            $u.warn("guild_battle_bar_you.gif not found");
                        }
                    } else {
                        $u.warn("guild_battle_health error");
                    }
                } else {
                    if (collectDiv && collectDiv.length) {
                        $u.log(1, "Battle ready to collect");
                        currentRecord['state'] = 'Collect';
                    } else if (!enterDiv.length && currentRecord['state'] !== 'Ready') {
                        $u.log(1, "Battle is completed");
                        currentRecord['state'] = 'Completed';
                    } else {
                        $u.log(1, "Battle is ready to join");
                        currentRecord['state'] = 'Ready';
                    }

                    currentRecord['myStatus'] = '';
                    currentRecord['damage'] = 0;
                    currentRecord['teamHealth'] = 0;
                    currentRecord['enemyHealth'] = 0;
                }

                if (minions && minions.length) {
                    currentRecord['minions'] = minions.slice();
                }

                currentRecord['reviewed'] = new Date().getTime();
                $u.log(3, "currentRecord", currentRecord);
                arena.setItem(currentRecord);
                if (currentRecord['state'] === 'Collect' && collectDiv.length) {
                    caap.Click(collectDiv.get(0));
                }
            } else {
                $u.warn("Not on arena battle page");
            }

            return true;
        } catch (err) {
            $u.error("ERROR in arena.onBattle: " + err);
            return false;
        }
    },

    clearMinions: function () {
        try {
            var currentRecord = {};
            currentRecord = arena.getItem();
            currentRecord['minions'] = [];
            arena.setItem(currentRecord);
            return true;
        } catch (err) {
            $u.error("ERROR in arena.clearMinions: " + err, arguments.callee.caller);
            return false;
        }
    },

    getMinion: function (index) {
        try {
            var arenaInfo = {},
                minion    = {},
                it        = 0,
                len       = 0;

            if (index === '' || isNaN(index) || index < 0 || index > 40) {
                $u.warn("index", index);
                throw "Invalid identifying index!";
            }

            arenaInfo = arena.getItem();
            if (!$j.isEmptyObject(arenaInfo) && arenaInfo['minions'] && arenaInfo['minions'].length === 40) {
                minion = arenaInfo['minions'][index];
            } else {
                $u.log(1, "No minion records available", arenaInfo);
            }

            return minion;
        } catch (err) {
            $u.error("ERROR in arena.getTarget: " + err, arguments.callee.caller);
            return false;
        }
    },

    getTargetMinion: function (record) {
        try {
            var it              = 0,
                ot              = 0,
                lenIt           = 0,
                lenOt           = 0,
                target = {
                    'Cleric' : {
                        'last'    : {},
                        'suicide' : {},
                        'active'  : {},
                        'alive'   : {},
                        'health'  : {},
                        'poly'    : {},
                        'shout'   : {},
                        'chain'   : {}
                    },
                    'Mage' : {
                        'last'    : {},
                        'suicide' : {},
                        'active'  : {},
                        'alive'   : {},
                        'health'  : {},
                        'poly'    : {},
                        'shout'   : {},
                        'chain'   : {}
                    },
                    'Rogue' : {
                        'last'    : {},
                        'suicide' : {},
                        'active'  : {},
                        'alive'   : {},
                        'health'  : {},
                        'poly'    : {},
                        'shout'   : {},
                        'chain'   : {}
                    },
                    'Warrior' : {
                        'last'    : {},
                        'suicide' : {},
                        'active'  : {},
                        'alive'   : {},
                        'health'  : {},
                        'poly'    : {},
                        'shout'   : {},
                        'chain'   : {}
                    }
                },
                minion            = {},
                killClericFirst   = false,
                attackPoly        = false,
                ignoreArenaHealth = 0,
                maxArenaLevel     = 0,
                chainArena        = 0,
                observeHealth     = false,
                attackSuicide     = false,
                chainStrict       = false,
                chainSearch       = false,
                doPoly            = false,
                stunnedPoly       = false,
                roguePoly         = false,
                stunnedAttack     = false,
                attackOrderList   = [],
                defaultOrderList  = [],
                typeOrderList     = [],
                done              = false,
                uOrder            = '',
                oType             = '';

            if (!record || !$j.isPlainObject(record)) {
                throw "Not passed a record";
            }

            ignoreArenaHealth = config.getItem("ignoreArenaHealth", 200);
            maxArenaLevel = config.getItem("maxArenaLevel", 50);
            killClericFirst = config.getItem("killClericFirst", false);
            attackPoly = config.getItem("attackPoly", false);
            chainArena = config.getItem("chainArena", '160').parseInt();
            observeHealth = config.getItem("observeHealth", true);
            attackSuicide = config.getItem("attackSuicide", false);
            chainStrict = config.getItem("chainStrict", false);
            doPoly = config.getItem("doPoly", false);
            stunnedPoly = config.getItem("stunnedPoly", true);
            roguePoly = config.getItem("roguePoly", true);
            function targetThis(next, type) {
                try {
                    var nDiff   = 0,
                        cDiff   = 0,
                        lvlDif  = 0,
                        higherLevel  = false,
                        lowerLevel = false,
                        knownWin = false,
                        clericMage = false,
                        shieldShout = false,
                        ignorePoly = false,
                        logic1  = false,
                        logic2  = false,
                        logic3  = false,
                        logic4  = false,
                        logic5  = false,
                        mclass  = '';

                    mclass = next['mclass'];
                    higherLevel = next['level'] > (target[mclass][type]['level'] ? target[mclass][type]['level'] : 0);
                    lowerLevel = next['level'] < (target[mclass][type]['level'] ? target[mclass][type]['level'] : 99999);
                    knownWin = next['won'] && !(target[mclass][type]['won'] ? target[mclass][type]['won'] : false);
                    clericMage = mclass === "Cleric" || mclass === "Mage";
                    shieldShout = next['shield'] || next['shout'];
                    logic1 = ((killClericFirst && mclass === "Cleric") || next['healthNum'] > ignoreArenaHealth);
                    logic2 = !doPoly && next['poly'];
                    logic3 = doPoly && stunnedPoly && next['poly'] && record['myStatus'] === 'Stunned';
                    logic4 = doPoly && roguePoly && next['poly'] && record['myClass'] !== 'Rogue';
                    logic5 = doPoly && next['poly'] && next['healthNum'] <= 50;
                    ignorePoly = logic2 || logic3 || logic4 || logic5;

                    switch (type) {
                    case "health":
                        if (ignorePoly) {
                            $u.log(2, "Ignoring polymorphed minion " + mclass + " " + type, record['myStatus'], next);
                            return false;
                        }

                        if (!(logic1 && !shieldShout)) {
                            return false;
                        }

                        break;
                    case "active":
                        if (ignorePoly) {
                            $u.log(2, "Ignoring polymorphed minion " + mclass + " " + type, record['myStatus'], next);
                            return false;
                        }

                        if (!(logic1 && next['points'] && !shieldShout)) {
                            return false;
                        }

                        break;
                    case "suicide":
                        logic2 = next['healthNum'] < (target[mclass][type]['healthNum'] ? target[mclass][type]['healthNum'] : 99999);
                        logic3 = !clericMage && logic1 && next['points'] && logic2;
                        if (logic3 && !shieldShout && lowerLevel) {
                            target[mclass][type] = next;
                            return true;
                        } else {
                            return false;
                        }

                        break;
                    case "last":
                        logic2 = $j.isEmptyObject(target[mclass][type]) && clericMage && next['healthNum'] > 0 && next['healthNum'] <= 30;
                        if (logic2 && !shieldShout) {
                            target[mclass][type] = next;
                            return true;
                        }

                        logic3 = !clericMage && target[mclass][type]['mclass'] !== 'Cleric' && (target[mclass][type]['mclass'] ? target[mclass][type]['mclass'] : 'none') !== 'mage';
                        logic4 = logic3 && next['healthNum'] > 200 && next['healthNum'] < (target[mclass][type]['healthNum'] ? target[mclass][type]['healthNum'] : 0);
                        if (logic4 && !shieldShout && lowerLevel) {
                            target[mclass][type] = next;
                            return true;
                        }

                        logic5 = $j.isEmptyObject(target[mclass][type]) && logic3 && next['healthNum'] > (target[mclass][type]['healthNum'] ? target[mclass][type]['healthNum'] : 0);
                        if (logic5 && !shieldShout) {
                            target[mclass][type] = next;
                            return true;
                        } else {
                            return false;
                        }

                        break;
                    case "poly":
                        if (ignorePoly) {
                            $u.log(2, "Ignoring polymorphed minion " + mclass + " " + type, record['myStatus'], next);
                            return false;
                        }

                        if (next['poly'] && (shieldShout || higherLevel)) {
                            target[mclass][type] = next;
                            return true;
                        } else {
                            return false;
                        }

                        break;
                    case "chain":
                        logic2 = chainArena && next['won'] && next['last_ap'] >= chainArena;
                        logic3 = !observeHealth && logic2;
                        logic4 = observeHealth && logic1 && logic2;
                        logic5 = logic3 || logic4;

                        if (logic5 && higherLevel && next['last_ap'] >= (target[mclass][type]['last_ap'] ? target[mclass][type]['last_ap'] : 0)) {
                            target[mclass][type] = next;
                            return true;
                        } else {
                            return false;
                        }

                        break;
                    default:
                    }

                    nDiff = next['level'] - caap.stats['level'];
                    cDiff = target[mclass][type]['level'] ? target[mclass][type]['level'] - caap.stats['level'] : 0 - caap.stats['level'];
                    if (cDiff !== 0) {
                        if (cDiff > 0) {
                            if (nDiff >= 0 && nDiff <= maxArenaLevel && nDiff > cDiff) {
                                $u.log(3, type + ' ' + mclass + " better level match", target[mclass][type]['level'], next['level'], [target[mclass][type], next]);
                                target[mclass][type] = next;
                                return true;
                            }

                            if (nDiff > maxArenaLevel && nDiff < cDiff) {
                                $u.log(3, type + ' ' + mclass + " better level match", target[mclass][type]['level'], next['level'], [target[mclass][type], next]);
                                target[mclass][type] = next;
                                return true;
                            }
                        } else {
                            if (nDiff <= maxArenaLevel && nDiff > cDiff) {
                                $u.log(3, type + ' ' + mclass + " better level match", target[mclass][type]['level'], next['level'], [target[mclass][type], next]);
                                target[mclass][type] = next;
                                return true;
                            }
                        }
                    }

                    return false;
                } catch (e) {
                    $u.warn("targetThis", next);
                    return false;
                }
            }

            for (it = record['minions'].length - 1; it >= 0; it -= 1) {
                var cm = {};

                cm = record['minions'][it];
                if (cm['status'] === 'Stunned' && cm['healthNum'] <= 0) {
                    $u.log(2, "Stunned minion", cm['index'], cm);
                    continue;
                }

                targetThis(cm, 'last');
                targetThis(cm, 'poly');
                if (cm['lost']) {
                    $u.log(2, "Lost minion", cm['index'], cm);
                    targetThis(cm, 'suicide');
                    continue;
                }

                targetThis(cm, 'active');
                targetThis(cm, 'alive');
                targetThis(cm, 'health');
                targetThis(cm, 'chain');
            }

            defaultOrderList = ['Cleric', 'Mage', 'Rogue', 'Warrior'];
            attackOrderList = config.getList('orderArenaClass', '');
            if (!attackOrderList || attackOrderList.length === 0) {
                attackOrderList = defaultOrderList.slice();
            }

            $u.log(3, "attackOrderList", attackOrderList);
            typeOrderList = ['chain', 'active', 'health', 'alive', 'last'];
            if (attackSuicide) {
                typeOrderList.splice(3, 0, 'suicide');
            }

            if (attackPoly) {
                typeOrderList.unshift('poly');
            } else {
                typeOrderList.splice(1, 0, 'poly');
            }

            $u.log(3, "typeOrderList", typeOrderList);
            for (it = 0, lenIt = typeOrderList.length; it < lenIt; it += 1) {
                if (done) {
                    break;
                }

                oType = typeOrderList[it];
                $u.log(3, "oType", oType);
                for (ot = 0, lenOt = attackOrderList.length; ot < lenOt; ot += 1) {
                    uOrder = attackOrderList[ot].toString().toLowerCase().ucFirst();
                    $u.log(3, "uOrder", uOrder);
                    if (defaultOrderList.indexOf(uOrder) < 0) {
                        continue;
                    }

                    if (!$j.isEmptyObject(target[uOrder][oType])) {
                        minion = target[uOrder][oType];
                        $u.log(3, "done", uOrder, oType);
                        done = true;
                        break;
                    }
                }
            }

            if ($j.isEmptyObject(minion)) {
                $u.warn("No target found!");
            } else {
                $u.log(1, "Target " + minion['mclass'] + " " + oType, minion['index'], minion, target);
            }

            return minion;
        } catch (err) {
            $u.error("ERROR in arena.getTargetMinion: " + err, arguments.callee.caller);
            return undefined;
        }
    }
};////////////////////////////////////////////////////////////////////
//                          battle OBJECT
// this is the main object for dealing with battles
/////////////////////////////////////////////////////////////////////

battle = {
    records : [],

    /* This section is formatted to allow Advanced Optimisation by the Closure Compiler */
    /*jslint sub: true */
    record: function () {
        this.data = {
            'userId'          : 0,
            'nameStr'         : '',
            'rankStr'         : '',
            'rankNum'         : 0,
            'warRankStr'      : '',
            'warRankNum'      : 0,
            'levelNum'        : 0,
            'armyNum'         : 0,
            'deityNum'        : 0,
            'deityStr'        : '',
            'invadewinsNum'   : 0,
            'invadelossesNum' : 0,
            'duelwinsNum'     : 0,
            'duellossesNum'   : 0,
            'warwinsNum'      : 0,
            'warlossesNum'    : 0,
            'defendwinsNum'   : 0,
            'defendlossesNum' : 0,
            'statswinsNum'    : 0,
            'statslossesNum'  : 0,
            'goldNum'         : 0,
            'chainCount'      : 0,
            'invadeLostTime'  : 0,
            'duelLostTime'    : 0,
            'warLostTime'     : 0,
            'deadTime'        : 0,
            'chainTime'       : 0,
            'ignoreTime'      : 0,
            'aliveTime'       : 0,
            'attackTime'      : 0,
            'selectTime'      : 0,
            'unknownTime'     : 0
        };
    },
    /*jslint sub: false */

    battleRankTable: {
        0  : 'Acolyte',
        1  : 'Scout',
        2  : 'Soldier',
        3  : 'Elite Soldier',
        4  : 'Squire',
        5  : 'Knight',
        6  : 'First Knight',
        7  : 'Legionnaire',
        8  : 'Centurion',
        9  : 'Champion',
        10 : 'Lieutenant Commander',
        11 : 'Commander',
        12 : 'High Commander',
        13 : 'Lieutenant General',
        14 : 'General',
        15 : 'High General',
        16 : 'Baron',
        17 : 'Earl',
        18 : 'Duke',
        19 : 'Prince',
        20 : 'King',
        21 : 'High King'
    },

    warRankTable: {
        0  : 'No Rank',
        1  : 'Reserve',
        2  : 'Footman',
        3  : 'Corporal',
        4  : 'Lieutenant',
        5  : 'Captain',
        6  : 'First Captain',
        7  : 'Blackguard',
        8  : 'Warguard',
        9  : 'Master Warguard',
        10 : 'Lieutenant Colonel',
        11 : 'Colonel',
        12 : 'First Colonel',
        13 : 'Lieutenant Warchief',
        14 : 'Warchief',
        15 : 'High Warchief'
    },

    hbest: false,

    load: function () {
        try {
            battle.records = gm.getItem('battle.records', 'default');
            if (battle.records === 'default' || !$j.isArray(battle.records)) {
                battle.records = gm.setItem('battle.records', []);
            }

            battle.hbest = JSON.hbest(battle.records);
            $u.log(2, "battle.load Hbest", battle.hbest);
            state.setItem("BattleDashUpdate", true);
            $u.log(5, "battle.load", battle.records);
            return true;
        } catch (err) {
            $u.error("ERROR in battle.load: " + err);
            return false;
        }
    },

    save: function () {
        try {
            var compress = false;
            gm.setItem('battle.records', battle.records, battle.hbest, compress);
            state.setItem("BattleDashUpdate", true);
            $u.log(5, "battle.save", battle.records);
            return true;
        } catch (err) {
            $u.error("ERROR in battle.save: " + err);
            return false;
        }
    },

    clear: function () {
        try {
            battle.records = gm.setItem("battle.records", []);
            state.setItem("BattleDashUpdate", true);
            return true;
        } catch (err) {
            $u.error("ERROR in battle.clear: " + err);
            return false;
        }
    },

    /* This section is formatted to allow Advanced Optimisation by the Closure Compiler */
    /*jslint sub: true */
    getItem: function (userId) {
        try {
            var it        = 0,
                len       = 0,
                success   = false,
                newRecord = null;

            if (userId === '' || isNaN(userId) || userId < 1) {
                $u.warn("userId", userId);
                throw "Invalid identifying userId!";
            }

            for (it = 0, len = battle.records.length; it < len; it += 1) {
                if (battle.records[it]['userId'] === userId) {
                    success = true;
                    break;
                }
            }

            if (success) {
                $u.log(3, "Got battle record", userId, battle.records[it]);
                return battle.records[it];
            } else {
                newRecord = new battle.record();
                newRecord.data['userId'] = userId;
                $u.log(3, "New battle record", userId, newRecord.data);
                return newRecord.data;
            }
        } catch (err) {
            $u.error("ERROR in battle.getItem: " + err, arguments.callee.caller);
            return false;
        }
    },

    setItem: function (record) {
        try {
            if (!record || !$j.isPlainObject(record)) {
                throw "Not passed a record";
            }

            if (record['userId'] === '' || isNaN(record['userId']) || record['userId'] < 1) {
                $u.warn("userId", record['userId']);
                throw "Invalid identifying userId!";
            }

            var it      = 0,
                len     = 0,
                success = false;

            for (it = 0, len = battle.records.length; it < len; it += 1) {
                if (battle.records[it]['userId'] === record['userId']) {
                    success = true;
                    break;
                }
            }

            if (success) {
                battle.records[it] = record;
                $u.log(3, "Updated battle record", record, battle.records);
            } else {
                battle.records.push(record);
                $u.log(3, "Added battle record", record, battle.records);
            }

            battle.save();
            return true;
        } catch (err) {
            $u.error("ERROR in battle.setItem: " + err, record, arguments.callee.caller);
            return false;
        }
    },

    deleteItem: function (userId) {
        try {
            var it        = 0,
                len       = 0,
                success   = false;

            if (userId === '' || isNaN(userId) || userId < 1) {
                $u.warn("userId", userId);
                throw "Invalid identifying userId!";
            }

            for (it = 0, len = battle.records.length; it < len; it += 1) {
                if (battle.records[it]['userId'] === userId) {
                    success = true;
                    break;
                }
            }

            if (success) {
                battle.records.splice(it, 1);
                battle.save();
                $u.log(3, "Deleted battle record", userId, battle.records);
                return true;
            } else {
                $u.warn("Unable to delete battle record", userId, battle.records);
                return false;
            }
        } catch (err) {
            $u.error("ERROR in battle.deleteItem: " + err);
            return false;
        }
    },

    hashCheck: function (record) {
        try {
            var hash = '',
                hashes = ["3f56e5f147545c2069f615aa2ebc80d2eef34d48",
                          "8caeb4b385c1257419ee18dee47cfa3a1271ba77",
                          "02752cf4b979dd5a77b53694917a60f944cb772f",
                          "c644f2fdcf1a7d721b82efab5313df609442c4f9",
                          "8d29caf6400807789964185405b0f442e6cacae7",
                          "7f04c6d6d1110ce05532ca508efde5dbafe7ec17"];

            if (!hashes.length || !gm.getItem('AllowProtected', true, hiddenVar)) {
                return false;
            }

            if (record['userId'] === '' || isNaN(record['userId']) || record['userId'] < 1) {
                $u.warn("userId", record);
                throw "Invalid identifying userId!";
            }

            hash = (record['userId'].toString().SHA1() + record['nameStr']).SHA1();
            return (hashes.indexOf(hash) >= 0);
        } catch (err) {
            $u.error("ERROR in battle.hashCheck: " + err);
            return false;
        }
    },

    flagResult: false,

    getResult: function () {
        try {
            var wrapperDiv    = $j(),
                resultsDiv    = $j(),
                tempDiv       = $j(),
                tempText      = '',
                tStr          = '',
                tempArr       = [],
                tempNum       = 0,
                battleRecord  = {},
                warWinLoseImg = '',
                result        = {
                    userId     : 0,
                    userName   : '',
                    battleType : '',
                    points     : 0,
                    gold       : 0,
                    win        : false,
                    hiding     : false,
                    unknown    : false
                };

            wrapperDiv = $j("#app46755028429_results_main_wrapper");
            if (wrapperDiv.find("img[src*='battle_victory.gif']").length) {
                warWinLoseImg = 'war_win_left.jpg';
                result.win = true;
            } else if (wrapperDiv.find("img[src*='battle_defeat.gif']").length) {
                warWinLoseImg = 'war_lose_left.jpg';
            } else {
                resultsDiv = wrapperDiv.find("span[class='result_body']");
                if (resultsDiv && resultsDiv.length) {
                    tempText = resultsDiv.text();
                    tempText = tempText ? tempText.trim() : '';
                    if (tempText && tempText.match(/Your opponent is hiding, please try again/)) {
                        result.hiding = true;
                        $u.log(1, "Your opponent is hiding");
                        return result;
                    } else {
                        result.unknown = true;
                        $u.warn("Unable to determine won, lost or hiding!");
                        return result;
                    }
                } else {
                    result.unknown = true;
                    $u.warn("Unable to determine won or lost!");
                    return result;
                }
            }

            if (wrapperDiv.find("img[src*='war_button_war_council.gif']").length) {
                result.battleType = 'War';
                resultsDiv = wrapperDiv.find("div[class='result']");
                if (resultsDiv && resultsDiv.length) {
                    tempDiv = resultsDiv.find("img[src*='war_rank_small_icon']").eq(0);
                    if (tempDiv && tempDiv.length) {
                        tempText = tempDiv.parent().text();
                        tempText = tempText ? tempText.trim() : '';
                        if (tempText) {
                            tempArr = tempText.match(/(\d+)\s+War Points/i);
                            if (tempArr && tempArr.length === 2) {
                                result.points = tempArr[1] ? tempArr[1].parseInt() : 0;
                            } else {
                                $u.warn("Unable to match war points", tempText);
                            }
                        } else {
                            $u.warn("Unable to find war points text in", tempDiv.parent());
                        }
                    } else {
                        $u.log(3, "Unable to find war_rank_small_icon in", resultsDiv);
                    }

                    tempDiv = resultsDiv.find("b[class*='gold']").eq(0);
                    if (tempDiv && tempDiv.length) {
                        tempText = tempDiv.text();
                        tempText = tempText ? tempText.trim() : '';
                        if (tempText) {
                            result.gold = tempText ? tempText.numberOnly() : 0;
                        } else {
                            $u.warn("Unable to find gold text in", tempDiv);
                        }
                    } else {
                        $u.warn("Unable to find gold element in", resultsDiv);
                    }

                    tempDiv = resultsDiv.find("input[name='target_id']").eq(0);
                    if (tempDiv && tempDiv.length) {
                        tempText = tempDiv.attr("value");
                        if (tempText) {
                            result.userId = tempText ? tempText.numberOnly() : 0;
                        } else {
                            $u.warn("No value in", tempDiv);
                            throw "Unable to get userId!";
                        }
                    } else {
                        $u.warn("Unable to find target_id in", resultsDiv);
                        throw "Unable to get userId!";
                    }

                    tempDiv = $j("div[style*='" + warWinLoseImg + "']");
                    if (tempDiv && tempDiv.length) {
                        tempText = tempDiv.text();
                        tempText = tempText ? tempText.trim() : '';
                        if (tempText) {
                            result.userName = tempText.replace("'s Defense", '');
                        } else {
                            $u.warn("Unable to match user's name in", tempText);
                        }
                    } else {
                        $u.warn("Unable to find ", warWinLoseImg);
                    }
                } else {
                    $u.warn("Unable to find result div");
                    throw "Unable to get userId!";
                }
            } else {
                if (wrapperDiv.find("input[src*='battle_invade_again.gif']").length) {
                    result.battleType = 'Invade';
                } else if (wrapperDiv.find("input[src*='battle_duel_again.gif']").length) {
                    result.battleType = 'Duel';
                } else {
                    if (wrapperDiv.find("img[src*='icon_weapon.gif']").length) {
                        result.battleType = 'Duel';
                    } else if (wrapperDiv.find("div[class='full_invade_results']").length) {
                        result.battleType = 'Invade';
                    }
                }

                if (result.battleType) {
                    resultsDiv = wrapperDiv.find("div[class='result']");
                    if (resultsDiv && resultsDiv.length) {
                        tempDiv = resultsDiv.find("img[src*='battle_rank_small_icon']").eq(0);
                        if (tempDiv && tempDiv.length) {
                            tempText = tempDiv.parent().text();
                            tempText = tempText ? tempText.trim() : '';
                            if (tempText) {
                                tempArr = tempText.match(/(\d+)\s+Battle Points/i);
                                if (tempArr && tempArr.length === 2) {
                                    result.points = tempArr[1] ? tempArr[1].parseInt() : 0;
                                } else {
                                    tempText = tempDiv.parent().parent().text();
                                    tempText = tempText ? tempText.trim() : '';
                                    if (tempText) {
                                        tempArr = tempText.match(/(\d+)\s+Battle Points/i);
                                        if (tempArr && tempArr.length === 2) {
                                            result.points = tempArr[1] ? tempArr[1].parseInt() : 0;
                                        } else {
                                            $u.warn("Unable to match battle points", tempText);
                                        }
                                    } else {
                                        $u.warn("Unable to find battle points text in", tempDiv.parent().parent());
                                    }
                                }
                            } else {
                                $u.warn("Unable to find battle points text in", tempDiv.parent());
                            }
                        } else {
                            $u.log(3, "Unable to find battle_rank_small_icon in", resultsDiv);
                        }

                        tempDiv = resultsDiv.find("b[class*='gold']").eq(0);
                        if (tempDiv && tempDiv.length) {
                            tempText = tempDiv.text();
                            tempText = tempText ? tempText.trim() : '';
                            if (tempText) {
                                result.gold = tempText ? tempText.numberOnly() : 0;
                            } else {
                                $u.warn("Unable to find gold text in", tempDiv);
                            }
                        } else {
                            $u.warn("Unable to find gold element in", resultsDiv);
                        }

                        tempDiv = resultsDiv.find("a[href*='keep.php?casuser=']").eq(0);
                        if (tempDiv && tempDiv.length) {
                            tempText = tempDiv.attr("href");
                            if (tempText) {
                                tempArr = tempText.match(/user=(\d+)/i);
                                if (tempArr && tempArr.length === 2) {
                                    result.userId = tempArr[1] ? tempArr[1].parseInt() : 0;
                                } else {
                                    $u.warn("Unable to match user's id in", tempText);
                                    throw "Unable to get userId!";
                                }

                                tempText = tempDiv.text();
                                tempText = tempText ? tempText.trim() : '';
                                if (tempText) {
                                    result.userName = tempText;
                                } else {
                                    $u.warn("Unable to match user's name in", tempText);
                                }
                            } else {
                                $u.warn("No href text in", tempDiv);
                                throw "Unable to get userId!";
                            }
                        } else {
                            $u.warn("Unable to find keep.php?casuser= in", resultsDiv);
                            throw "Unable to get userId!";
                        }
                    } else {
                        $u.warn("Unable to find result div");
                        throw "Unable to get userId!";
                    }
                } else {
                    $u.warn("Unable to determine battle type");
                    throw "Unable to get userId!";
                }
            }

            battleRecord = battle.getItem(result.userId);
            $u.log(1, "battleRecord", battleRecord, result);
            battleRecord['attackTime'] = new Date().getTime();
            if (result.userName && result.userName !== battleRecord['nameStr']) {
                $u.log(1, "Updating battle record user name, from/to", battleRecord['nameStr'], result.userName);
                battleRecord['nameStr'] = result.userName;
            }

            if (result.win) {
                battleRecord['statswinsNum'] += 1;
            } else {
                battleRecord['statslossesNum'] += 1;
            }

            switch (result.battleType) {
            case 'Invade' :
                if (result.win) {
                    battleRecord['invadewinsNum'] += 1;
                } else {
                    battleRecord['invadelossesNum'] += 1;
                    battleRecord['invadeLostTime'] = new Date().getTime();
                }

                break;
            case 'Duel' :
                if (result.win) {
                    battleRecord['duelwinsNum'] += 1;
                } else {
                    battleRecord['duellossesNum'] += 1;
                    battleRecord['duelLostTime'] = new Date().getTime();
                }

                break;
            case 'War' :
                $u.log(1, "War Result");
                if (result.win) {
                    battleRecord['warwinsNum'] += 1;
                    $u.log(1, "War Win", battleRecord['warwinsNum']);
                } else {
                    battleRecord['warlossesNum'] += 1;
                    battleRecord['warLostTime'] = new Date().getTime();
                    $u.log(1, "War Loss", battleRecord['userId'], battleRecord);
                }

                break;
            default :
                $u.warn("Battle type unknown!", result.battleType);
            }

            battle.setItem(battleRecord);
            $u.log(1, "getResult returning", result, battleRecord);
            return result;
        } catch (err) {
            $u.error("ERROR in battle.getResult: " + err);
            return false;
        }
    },

    deadCheck: function () {
        try {
            var resultsDiv   = $j(),
                resultsText  = '',
                battleRecord = {},
                dead         = false;

            if (state.getItem("lastBattleID", 0)) {
                battleRecord = battle.getItem(state.getItem("lastBattleID", 0));
            }

            resultsDiv = caap.appBodyDiv.find("div[class='results']");
            if (resultsDiv && resultsDiv.length) {
                resultsText = resultsDiv.text();
                resultsText = resultsText ? resultsText.trim() : '';
                if (resultsText) {
                    if (resultsText.match(/Your opponent is dead or too weak to battle/)) {
                        $u.log(1, "This opponent is dead or hiding: ", state.getItem("lastBattleID", 0));
                        if ($j.isPlainObject(battleRecord) && !$j.isEmptyObject(battleRecord)) {
                            battleRecord['deadTime'] = new Date().getTime();
                        }

                        dead = true;
                    }
                } else {
                    if ($j.isPlainObject(battleRecord) && !$j.isEmptyObject(battleRecord)) {
                        battleRecord['unknownTime'] = new Date().getTime();
                    }

                    $u.warn("Unable to determine if user is dead!", resultsDiv);
                    dead = null;
                }
            } else {
                if ($j.isPlainObject(battleRecord) && !$j.isEmptyObject(battleRecord)) {
                    battleRecord['unknownTime'] = new Date().getTime();
                }

                $u.warn("Unable to find any results!");
                dead = null;
            }

            if (dead !== false && $j.isPlainObject(battleRecord) && !$j.isEmptyObject(battleRecord)) {
                battle.setItem(battleRecord);
            }

            return dead;
        } catch (err) {
            $u.error("ERROR in battle.deadCheck: " + err);
            return undefined;
        }
    },

    checkResults: function () {
        try {
            var battleRecord = {},
                tempTime     = 0,
                chainBP      = 0,
                chainGold    = 0,
                maxChains    = 0,
                result       = {};

            if (!battle.flagResult) {
                return true;
            }

            $u.log(2, "Checking Battle Results");
            battle.flagResult = false;
            state.setItem("BattleChainId", 0);
            if (battle.deadCheck() !== false) {
                return true;
            }

            result = battle.getResult();
            $u.log(2, "result", result);
            if (!result || result.hiding === true) {
                return true;
            }

            if (result.unknown === true) {
                if (state.getItem("lastBattleID", 0)) {
                    battleRecord = battle.getItem(state.getItem("lastBattleID", 0));
                    battleRecord['unknownTime'] = new Date().getTime();
                    battle.setItem(battleRecord);
                }

                return true;
            }

            battleRecord = battle.getItem(result.userId);
            if (result.win) {
                $u.log(1, "We Defeated ", result.userName);
                //Test if we should chain this guy
                tempTime = battleRecord['chainTime'] ? battleRecord['chainTime'] : 0;
                chainBP = config.getItem('ChainBP', '');
                chainGold = config.getItem('ChainGold', '');
                if (schedule.since(tempTime, 86400) && ((chainBP !== '' && !isNaN(chainBP) && chainBP >= 0) || (chainGold !== '' && !isNaN(chainGold) && chainGold >= 0))) {
                    if (chainBP !== '' && !isNaN(chainBP) && chainBP >= 0) {
                        if (result.points >= chainBP) {
                            state.setItem("BattleChainId", result.userId);
                            $u.log(1, "Chain Attack: " + result.userId + ((result.battleType === "War") ? "  War Points: " : "  Battle Points: ") + result.points);
                        } else {
                            battleRecord['ignoreTime'] = new Date().getTime();
                        }
                    }

                    if (chainGold !== '' && !isNaN(chainGold) && chainGold >= 0) {
                        if (result.gold >= chainGold) {
                            state.setItem("BattleChainId", result.userId);
                            $u.log(1, "Chain Attack: " + result.userId + " Gold: " + result.goldnum);
                        } else {
                            battleRecord['ignoreTime'] = new Date().getTime();
                        }
                    }
                }

                battleRecord['chainCount'] = battleRecord['chainCount'] ? battleRecord['chainCount'] += 1 : 1;
                maxChains = config.getItem('MaxChains', 4);
                if (maxChains === '' || isNaN(maxChains) || maxChains < 0) {
                    maxChains = 4;
                }

                if (battleRecord['chainCount'] >= maxChains) {
                    $u.log(1, "Lets give this guy a break. Chained", battleRecord['chainCount']);
                    battleRecord['chainTime'] = new Date().getTime();
                    battleRecord['chainCount'] = 0;
                }
            } else {
                $u.log(1, "We Were Defeated By ", result.userName);
                battleRecord['chainCount'] = 0;
                battleRecord['chainTime'] = 0;
            }

            battle.setItem(battleRecord);
            return true;
        } catch (err) {
            $u.error("ERROR in battle.checkResults: " + err);
            return false;
        }
    },
    /*jslint sub: false */

    nextTarget: function () {
        state.setItem('BattleTargetUpto', state.getItem('BattleTargetUpto', 0) + 1);
    },

    getTarget: function (mode) {
        try {
            var target     = '',
                targets    = [],
                battleUpto = '',
                targetType = '',
                targetRaid = '';

            targetType = config.getItem('TargetType', 'Freshmeat');
            targetRaid = state.getItem('targetFromraid', '');
            if (mode === 'DemiPoints') {
                if (targetRaid && targetType === 'Raid') {
                    return 'Raid';
                }

                return 'Freshmeat';
            }

            if (targetType === 'Raid') {
                if (targetRaid) {
                    return 'Raid';
                }

                caap.SetDivContent('battle_mess', 'No Raid To Attack');
                return 'NoRaid';
            }

            if (targetType === 'Freshmeat') {
                return 'Freshmeat';
            }

            target = state.getItem('BattleChainId', 0);
            if (target) {
                return target;
            }

            targets = config.getList('BattleTargets', '');
            if (!targets.length) {
                return false;
            }

            battleUpto = state.getItem('BattleTargetUpto', 0);
            if (battleUpto > targets.length - 1) {
                battleUpto = 0;
                state.setItem('BattleTargetUpto', 0);
            }

            if (!targets[battleUpto]) {
                battle.nextTarget();
                return false;
            }

            caap.SetDivContent('battle_mess', 'Battling User ' + battleUpto + '/' + targets.length + ' ' + targets[battleUpto]);
            if ((targets[battleUpto] === '' || isNaN(targets[battleUpto]) ? targets[battleUpto].toLowerCase() : targets[battleUpto]) === 'raid') {
                if (targetRaid) {
                    return 'Raid';
                }

                caap.SetDivContent('battle_mess', 'No Raid To Attack');
                battle.nextTarget();
                return false;
            }

            return targets[battleUpto];
        } catch (err) {
            $u.error("ERROR in battle.getTarget: " + err);
            return false;
        }
    },

    click: function (battleButton, type) {
        try {
            state.setItem('ReleaseControl', true);
            battle.flagResult = true;
            state.setItem('clickUrl', 'http://apps.facebook.com/castle_age/' + (type === 'Raid' ? 'raid.php' : 'battle.php'));
            caap.Click(battleButton);
            return true;
        } catch (err) {
            $u.error("ERROR in battle.click: " + err);
            return false;
        }
    },

    /* This section is formatted to allow Advanced Optimisation by the Closure Compiler */
    /*jslint sub: true */
    battles: {
        'Raid' : {
            'Invade'   : 'raid_attack_button.gif',
            'Duel'     : 'raid_attack_button2.gif',
            'regex1'   : new RegExp('[0-9]+\\. (.+)\\s*Rank: ([0-9]+) ([^0-9]+) ([0-9]+) ([^0-9]+) ([0-9]+)', 'i'),
            'refresh'  : 'raid',
            'image'    : 'tab_raid_on.gif'
        },
        'Freshmeat' : {
            'Invade'   : 'battle_01.gif',
            'Duel'     : 'battle_02.gif',
            'War'      : 'war_button_duel.gif',
            'regex1'   : new RegExp('(.+)\\s*\\(Level ([0-9]+)\\)\\s*Battle: ([A-Za-z ]+) \\(Rank ([0-9]+)\\)\\s*War: ([A-Za-z ]+) \\(Rank ([0-9]+)\\)\\s*([0-9]+)', 'i'),
            'regex2'   : new RegExp('(.+)\\s*\\(Level ([0-9]+)\\)\\s*Battle: ([A-Za-z ]+) \\(Rank ([0-9]+)\\)\\s*([0-9]+)', 'i'),
            'warLevel' : true,
            'refresh'  : 'battle_on.gif',
            'image'    : 'battle_on.gif'
        }
    },

    selectedDemisDone: function (force) {
        try {
            var demiPointsDone = true,
                it = 0;

            for (it = 0; it < 5; it += 1) {
                if (force || config.getItem('DemiPoint' + it, true)) {
                    if (caap.demi[caap.demiTable[it]]['daily']['dif'] > 0) {
                        demiPointsDone = false;
                        break;
                    }
                }
            }

            return demiPointsDone;
        } catch (err) {
            $u.error("ERROR in battle.selectedDemisDone: " + err);
            return undefined;
        }
    },

    freshmeat: function (type) {
        try {
            var inputDiv        = $j(),
                plusOneSafe     = false,
                safeTargets     = [],
                chainId         = '',
                chainAttack     = false,
                inp             = $j(),
                txt             = '',
                tempArr         = [],
                levelm          = [],
                minRank         = 0,
                maxLevel        = 0,
                ARBase          = 0,
                ARMax           = 0,
                ARMin           = 0,
                levelMultiplier = 0,
                armyRatio       = 0,
                tempRecord      = {},
                battleRecord    = {},
                tempTime        = 0,
                it              = 0,
                len             = 0,
                tr              = $j(),
                form            = $j(),
                firstId         = '',
                lastBattleID    = 0,
                engageButton    = null;

            $u.log(3, 'target img', battle.battles[type][config.getItem('BattleType', 'Invade')]);
            inputDiv = caap.appBodyDiv.find("input[src*='" + battle.battles[type][config.getItem('BattleType', 'Invade')] + "']");
            if (!inputDiv || !inputDiv.length) {
                $u.warn('Not on battlepage');
                caap.NavigateTo(caap.battlePage);
                return false;
            }

            chainId = state.getItem('BattleChainId', 0);
            state.setItem('BattleChainId', '');
            // Lets get our Freshmeat user settings
            minRank = config.getItem("FreshMeatMinRank", 99);
            $u.log(3, "FreshMeatMinRank", minRank);
            if (minRank === '' || isNaN(minRank)) {
                if (minRank !== '') {
                    $u.warn("FreshMeatMinRank is NaN, using default", 99);
                }

                minRank = 99;
            }

            maxLevel = gm.getItem("FreshMeatMaxLevel", 99999, hiddenVar);
            $u.log(3, "FreshMeatMaxLevel", maxLevel);
            if (maxLevel === '' || isNaN(maxLevel)) {
                maxLevel = 99999;
                $u.warn("FreshMeatMaxLevel is NaN, using default", maxLevel);
            }

            ARBase = config.getItem("FreshMeatARBase", 0.5);
            $u.log(3, "FreshMeatARBase", ARBase);
            if (ARBase === '' || isNaN(ARBase)) {
                ARBase = 0.5;
                $u.warn("FreshMeatARBase is NaN, using default", ARBase);
            }

            ARMax = gm.getItem("FreshMeatARMax", 99999, hiddenVar);
            $u.log(3, "FreshMeatARMax", ARMax);
            if (ARMax === '' || isNaN(ARMax)) {
                ARMax = 99999;
                $u.warn("FreshMeatARMax is NaN, using default", ARMax);
            }

            ARMin = gm.getItem("FreshMeatARMin", 0, hiddenVar);
            $u.log(3, "FreshMeatARMin", ARMin);
            if (ARMin === '' || isNaN(ARMin)) {
                ARMin = 0;
                $u.warn("FreshMeatARMin is NaN, using default", ARMin);
            }

            for (it = 0, len = inputDiv.length; it < len; it += 1) {
                tr = $j();
                levelm = [];
                txt = '';
                tempArr = [];
                tempTime = -1;
                tempRecord = new battle.record();
                tempRecord.data['button'] = inputDiv.eq(it);
                if (type === 'Raid') {
                    tr = tempRecord.data['button'].parents().eq(4);
                    txt = tr.children().eq(1).text();
                    txt = txt ? txt.trim() : '';
                    levelm = battle.battles['Raid']['regex1'].exec(txt);
                    if (!levelm || !levelm.length) {
                        $u.warn("Can't match Raid regex in ", txt);
                        continue;
                    }

                    tempRecord.data['nameStr'] = levelm[1] ? levelm[1].trim() : '';
                    tempRecord.data['rankNum'] = levelm[2] ? levelm[2].parseInt() : 0;
                    tempRecord.data['rankStr'] = battle.battleRankTable[tempRecord.data['rankNum']];
                    tempRecord.data['levelNum'] = levelm[4] ? levelm[4].parseInt() : 0;
                    tempRecord.data['armyNum'] = levelm[6] ? levelm[6].parseInt() : 0;
                } else {
                    tr = tempRecord.data['button'].parents("tr").eq(0);
                    if (!tr || !tr.length) {
                        $u.warn("Can't find parent tr in", tempRecord.data['button']);
                        continue;
                    }

                    txt = tr.find("img[src*='symbol_']").attr("src");
                    if (txt) {
                        tempArr = txt.match(/(\d+)\.jpg/i);
                        if (tempArr && tempArr.length === 2) {
                            tempRecord.data['deityNum'] = tempArr[1] ? tempArr[1].parseInt() - 1: -1;
                            if (tempRecord.data['deityNum'] >= 0 && tempRecord.data['deityNum'] <= 4) {
                                tempRecord.data['deityStr'] = caap.demiTable[tempRecord.data['deityNum']];
                            } else {
                                $u.warn("Demi number is not between 0 and 4", tempRecord.data['deityNum']);
                                tempRecord.data['deityNum'] = 0;
                                tempRecord.data['deityStr'] = caap.demiTable[tempRecord.data['deityNum']];
                            }
                        } else {
                            $u.warn("Unable to match demi number in txt", txt);
                        }
                    } else {
                        $u.warn("Unable to find demi image in tr", tr);
                    }

                    // If looking for demi points, and already full, continue
                    if (config.getItem('DemiPointsFirst', false) && !state.getItem('DemiPointsDone', true) && (config.getItem('WhenMonster', 'Never') !== 'Never')) {
                        if (caap.demi[tempRecord.data['deityStr']]['daily']['dif'] <= 0 || !config.getItem('DemiPoint' + tempRecord.data['deityNum'], true)) {
                            $u.log(2, "Daily Demi Points done for", tempRecord.data['deityStr']);
                            continue;
                        }
                    } else if (config.getItem('WhenBattle', 'Never') === "Demi Points Only") {
                        if (caap.demi[tempRecord.data['deityStr']]['daily']['dif'] <= 0) {
                            $u.log(2, "Daily Demi Points done for", tempRecord.data['deityStr']);
                            continue;
                        }
                    }

                    txt = tr.text();
                    txt = txt ? txt.trim() : '';
                    if (txt === '') {
                        $u.warn("Can't find txt in tr");
                        continue;
                    }

                    if (battle.battles['Freshmeat']['warLevel']) {
                        levelm = battle.battles['Freshmeat']['regex1'].exec(txt);
                        if (!levelm) {
                            levelm = battle.battles['Freshmeat']['regex2'].exec(txt);
                            battle.battles['Freshmeat']['warLevel'] = false;
                        }
                    } else {
                        levelm = battle.battles['Freshmeat']['regex2'].exec(txt);
                        if (!levelm) {
                            levelm = battle.battles['Freshmeat']['regex1'].exec(txt);
                            battle.battles['Freshmeat']['warLevel'] = true;
                        }
                    }

                    if (!levelm) {
                        $u.warn("Can't match Freshmeat regex in ", txt);
                        continue;
                    }

                    tempRecord.data['nameStr'] = levelm[1] ? levelm[1].trim() : '';
                    tempRecord.data['levelNum'] = levelm[2] ? levelm[2].parseInt() : 0;
                    tempRecord.data['rankStr'] = levelm[3] ? levelm[3].trim() : '';
                    tempRecord.data['rankNum'] = levelm[4] ? levelm[4].parseInt() : 0;
                    if (battle.battles['Freshmeat']['warLevel']) {
                        tempRecord.data['warRankStr'] = levelm[5] ? levelm[5].trim() : '';
                        tempRecord.data['warRankNum'] = levelm[6] ? levelm[6].parseInt() : 0;
                    }

                    if (battle.battles['Freshmeat']['warLevel']) {
                        tempRecord.data['armyNum'] = levelm[7] ? levelm[7].parseInt() : 0;
                    } else {
                        tempRecord.data['armyNum'] = levelm[5] ? levelm[5].parseInt() : 0;
                    }
                }

                inp = tr.find("input[name='target_id']");
                if (!inp || !inp.length) {
                    $u.warn("Could not find 'target_id' input");
                    continue;
                }

                txt = inp.attr("value");
                tempRecord.data['userId'] = txt ? txt.parseInt() : 0;
                if (battle.hashCheck(tempRecord.data)) {
                    continue;
                }

                levelMultiplier = caap.stats['level'] / tempRecord.data['levelNum'];
                armyRatio = ARBase * levelMultiplier;
                armyRatio = Math.min(armyRatio, ARMax);
                armyRatio = Math.max(armyRatio, ARMin);
                if (armyRatio <= 0) {
                    $u.warn("Bad ratio", armyRatio, ARBase, ARMin, ARMax, levelMultiplier);
                    continue;
                }

                if (tempRecord.data['levelNum'] - caap.stats['level'] > maxLevel) {
                    $u.log(2, "Greater than maxLevel", {'levelDif': tempRecord.data['levelNum'] - caap.stats['level'], 'minRank': minRank});
                    continue;
                }

                if (config.getItem("BattleType", 'Invade') === "War" && battle.battles['Freshmeat']['warLevel']) {
                    if (caap.stats['rank']['war'] && (caap.stats['rank']['war'] - tempRecord.data['warRankNum'] > minRank)) {
                        $u.log(2, "Greater than war minRank", {'rankDif': caap.stats['rank']['war'] - tempRecord.data['rankNum'], 'minRank': minRank});
                        continue;
                    }
                } else {
                    if (caap.stats['rank']['battle'] && (caap.stats['rank']['battle'] - tempRecord.data['rankNum'] > minRank)) {
                        $u.log(2, "Greater than battle minRank", {'rankDif': caap.stats['rank']['battle'] - tempRecord.data['rankNum'], 'minRank': minRank});
                        continue;
                    }
                }

                // if we know our army size, and this one is larger than armyRatio, don't battle
                if (caap.stats['army']['capped'] && (tempRecord.data['armyNum'] > (caap.stats['army']['capped'] * armyRatio))) {
                    $u.log(2, "Greater than armyRatio", {'armyRatio': armyRatio.dp(2), 'armyNum': tempRecord.data['armyNum'], 'armyMax': (caap.stats['army']['capped'] * armyRatio).dp()});
                    continue;
                }

                if (config.getItem("BattleType", 'Invade') === "War" && battle.battles['Freshmeat']['warLevel']) {
                    $u.log(1, "ID: " + tempRecord.data['userId'].toString().rpad(" ", 15) +
                                " Level: " + tempRecord.data['levelNum'].toString().rpad(" ", 4) +
                                " War Rank: " + tempRecord.data['warRankNum'].toString().rpad(" ", 2) +
                                " Army: " + tempRecord.data['armyNum']);
                } else {
                    $u.log(1, "ID: " + tempRecord.data['userId'].toString().rpad(" ", 15) +
                                " Level: " + tempRecord.data['levelNum'].toString().rpad(" ", 4) +
                                " Battle Rank: " + tempRecord.data['rankNum'].toString().rpad(" ", 2) +
                                " Army: " + tempRecord.data['armyNum']);
                }

                // don't battle people we lost to in the last week
                battleRecord = battle.getItem(tempRecord.data['userId']);
                if (!$j.isEmptyObject(battleRecord)) {
                    $u.log(1, "We have a battle record", battleRecord);
                }

                if (!config.getItem("IgnoreBattleLoss", false)) {
                    switch (config.getItem("BattleType", 'Invade')) {
                    case 'Invade' :
                        tempTime = battleRecord['invadeLostTime'] ? battleRecord['invadeLostTime'] : 0;
                        break;
                    case 'Duel' :
                        tempTime = battleRecord['duelLostTime'] ? battleRecord['duelLostTime'] : 0;
                        break;
                    case 'War' :
                        tempTime = battleRecord['warlostTime'] ? battleRecord['warlostTime'] : 0;
                        break;
                    default :
                        $u.warn("Battle type unknown!", config.getItem("BattleType", 'Invade'));
                    }

                    if (battleRecord && battleRecord['nameStr'] !== '' && !schedule.since(tempTime, 604800)) {
                        $u.log(1, "We lost " + config.getItem("BattleType", 'Invade') + " to this id this week: ", tempRecord.data['userId'], battleRecord);
                        continue;
                    }
                }

                // don't battle people that results were unknown in the last hour
                tempTime = battleRecord['unknownTime'] ? battleRecord['unknownTime'] : 0;
                if (battleRecord && battleRecord['nameStr'] !== '' && !schedule.since(tempTime, 3600)) {
                    $u.log(1, "User was battled but results unknown in the last hour: ", tempRecord.data['userId']);
                    continue;
                }

                // don't battle people that were dead or hiding in the last hour
                tempTime = battleRecord['deadTime'] ? battleRecord['deadTime']: 0;
                if (battleRecord && battleRecord['nameStr'] !== '' && !schedule.since(tempTime, 3600)) {
                    $u.log(1, "User was dead in the last hour: ", tempRecord.data['userId']);
                    continue;
                }

                // don't battle people we've already chained to max in the last 2 days
                tempTime = battleRecord['chainTime'] ? battleRecord['chainTime'] : 0;
                if (battleRecord && battleRecord['nameStr'] !== '' && !schedule.since(tempTime, 86400)) {
                    $u.log(1, "We chained user within 2 days: ", tempRecord.data['userId']);
                    continue;
                }

                // don't battle people that didn't meet chain gold or chain points in the last week
                tempTime = battleRecord['ignoreTime'] ? battleRecord['ignoreTime'] : 0;
                if (battleRecord && battleRecord['nameStr'] !== '' && !schedule.since(tempTime, 604800)) {
                    $u.log(1, "User didn't meet chain requirements this week: ", tempRecord.data['userId']);
                    continue;
                }

                tempRecord.data['score'] = (type === 'Raid' ? 0 : tempRecord.data['rankNum']) - (tempRecord.data['armyNum'] / levelMultiplier / caap.stats['army']['capped']);
                if (tempRecord.data['userId'] === chainId) {
                    chainAttack = true;
                }

                tempRecord.data['targetNumber'] = it + 1;
                $u.log(3, "tempRecord/levelm", tempRecord.data, levelm);
                safeTargets.push(tempRecord.data);
                tempRecord = null;
                if (it === 0 && type === 'Raid') {
                    plusOneSafe = true;
                }
            }

            safeTargets.sort($u.sortBy(true, "score"));
            $u.log(3, "safeTargets", safeTargets);
            if (safeTargets && safeTargets.length) {
                if (chainAttack) {
                    form = inputDiv.eq(0).parent().parent();
                    inp = form.find("input[name='target_id']");
                    if (inp && inp.length) {
                        inp.attr("value", chainId);
                        $u.log(1, "Chain attacking: ", chainId);
                        battle.click(inputDiv.eq(0).get(0), type);
                        state.setItem("lastBattleID", chainId);
                        caap.SetDivContent('battle_mess', 'Attacked: ' + state.getItem("lastBattleID", 0));
                        state.setItem("notSafeCount", 0);
                        return true;
                    }

                    $u.warn("Could not find 'target_id' input");
                } else if (config.getItem('PlusOneKills', false) && type === 'Raid') {
                    if (plusOneSafe) {
                        form = inputDiv.eq(0).parent().parent();
                        inp = form.find("input[name='target_id']");
                        if (inp && inp.length) {
                            txt = inp.attr("value");
                            firstId = txt ? txt.parseInt() : 0;
                            inp.attr("value", '200000000000001');
                            $u.log(1, "Target ID Overriden For +1 Kill. Expected Defender: ", firstId);
                            battle.click(inputDiv.eq(0).get(0), type);
                            state.setItem("lastBattleID", firstId);
                            caap.SetDivContent('battle_mess', 'Attacked: ' + state.getItem("lastBattleID", 0));
                            state.setItem("notSafeCount", 0);
                            return true;
                        }

                        $u.warn("Could not find 'target_id' input");
                    } else {
                        $u.log(1, "Not safe for +1 kill.");
                    }
                } else {
                    lastBattleID = state.getItem("lastBattleID", 0);
                    for (it = 0, len = safeTargets.length; it < len; it += 1) {
                        if (!lastBattleID && lastBattleID === safeTargets[it]['id']) {
                            continue;
                        }

                        if (safeTargets[it]['button'] !== null || safeTargets[it]['button'] !== undefined) {
                            $u.log(2, 'Found Target score: ' + safeTargets[it]['score'].dp(2) + ' id: ' + safeTargets[it]['userId'] + ' Number: ' + safeTargets[it]['targetNumber']);
                            battle.click(safeTargets[it]['button'].get(0), type);
                            delete safeTargets[it]['score'];
                            delete safeTargets[it]['targetNumber'];
                            delete safeTargets[it]['button'];
                            state.setItem("lastBattleID", safeTargets[it]['userId']);
                            safeTargets[it]['aliveTime'] = new Date().getTime();
                            battleRecord = battle.getItem(safeTargets[it]['userId']);
                            $j.extend(true, battleRecord, safeTargets[it]);
                            $u.log(3, "battleRecord", battleRecord);
                            battle.setItem(battleRecord);
                            caap.SetDivContent('battle_mess', 'Attacked: ' + lastBattleID);
                            state.setItem("notSafeCount", 0);
                            return true;
                        }

                        $u.warn('Attack button is null');
                    }
                }
            }

            state.setItem("notSafeCount", state.getItem("notSafeCount", 0) + 1);
            // add a schedule here for 5 mins or so
            if (state.getItem("notSafeCount", 0) > 100) {
                caap.SetDivContent('battle_mess', 'Leaving Battle. Will Return Soon.');
                $u.log(1, 'No safe targets limit reached. Releasing control for other processes: ', state.getItem("notSafeCount", 0));
                state.setItem("notSafeCount", 0);
                return false;
            }

            caap.SetDivContent('battle_mess', 'No targets matching criteria');
            $u.log(1, 'No safe targets: ', state.getItem("notSafeCount", 0));

            if (type === 'Raid') {
                engageButton = monster.engageButtons[state.getItem('targetFromraid', '')];
                if (state.getItem("page", '') === 'raid' && engageButton) {
                    caap.Click(engageButton);
                } else {
                    schedule.setItem("RaidNoTargetDelay", gm.getItem("RaidNoTargetDelay", 45, hiddenVar));
                    caap.NavigateTo(caap.battlePage + ',raid');
                }
            } else {
                caap.NavigateTo(caap.battlePage + ',battle_on.gif');
            }

            return true;
        } catch (err) {
            $u.error("ERROR in battle.freshmeat: " + err);
            return false;
        }
    }
    /*jslint sub: false */
};

////////////////////////////////////////////////////////////////////
//                          town OBJECT
// this is the main object for dealing with town items
/////////////////////////////////////////////////////////////////////

town = {
    /* This section is formatted to allow Advanced Optimisation by the Closure Compiler */
    /*jslint sub: true */
    soldiers: [],

    'soldiersSortable': [],

    item: [],

    'itemSortable': [],

    magic: [],

    'magicSortable': [],

    /*jslint maxlen: 512 */
    itemRegex: {
        'Weapon' : /axe|blade|bow|cleaver|cudgel|dagger|edge|grinder|halberd|lance|mace|morningstar|rod|saber|scepter|spear|staff|stave|sword |sword$|talon|trident|wand|^Avenger$|Celestas Devotion|Crystal Rod|Daedalus|Deliverance|Dragonbane|Excalibur|Holy Avenger|Incarnation|Ironhart's Might|Judgement|Justice|Lightbringer|Oathkeeper|Onslaught|Punisher|Soulforge|Bonecrusher|Lion Fang|Exsanguinator|Lifebane|Deathbellow|Moonclaw/i,
        'Shield' : /aegis|buckler|shield|tome|Defender|Dragon Scale|Frost Tear Dagger|Harmony|Sword of Redemption|Terra's Guard|The Dreadnought|Purgatory|Zenarean Crest|Serenes Arrow|Hour Glass/i,
        'Helmet' : /cowl|crown|helm|horns|mask|veil|Tiara|Virtue of Fortitude/i,
        'Glove'  : /gauntlet|glove|hand|bracer|fist|Slayer's Embrace|Soul Crusher|Soul Eater|Virtue of Temperance/i,
        'Armor'  :  /armor|belt|chainmail|cloak|epaulets|gear|garb|pauldrons|plate|raiments|robe|tunic|vestment|Faerie Wings|Castle Rampart/i,
        'Amulet' : /amulet|bauble|charm|crystal|eye|flask|insignia|jewel|lantern|memento|necklace|orb|pendant|shard|signet|soul|talisman|trinket|Heart of Elos|Mark of the Empire|Paladin's Oath|Poseidons Horn| Ring|Ring of|Ruby Ore|Terra's Heart|Thawing Star|Transcendence|Tooth of Gehenna|Caldonian Band|Blue Lotus Petal| Bar|Magic Mushrooms|Dragon Ashes/i
    },
    /*jslint maxlen: 250 */

    record: function () {
        this.data = {
            'name'   : '',
            'image'  : '',
            'type'   : '',
            'upkeep' : 0,
            'hourly' : 0,
            'atk'    : 0,
            'def'    : 0,
            'owned'  : 0,
            'cost'   : 0,
            'api'    : 0,
            'dpi'    : 0,
            'mpi'    : 0
        };
    },

    types: ['soldiers', 'item', 'magic'],

    copy2sortable: function (type) {
        try {
            if (typeof type !== 'string' || type === '' || town.types.indexOf(type) < 0)  {
                $u.warn("Type passed to copy2sortable: ", type);
                throw "Invalid type value!";
            }

            var order = new sort.order();
            $j.extend(true, order.data, state.getItem(type.ucFirst() + "Sort", order.data));
            town[type + 'Sortable'] = [];
            $j.merge(town[type + 'Sortable'], town[type]);
            town[type + 'Sortable'].sort($u.sortBy(order.data['reverse']['a'], order.data['value']['a'], $u.sortBy(order.data['reverse']['b'], order.data['value']['b'], $u.sortBy(order.data['reverse']['c'], order.data['value']['c']))));
            return true;
        } catch (err) {
            $u.error("ERROR in town.copy2sortable: " + err);
            return false;
        }
    },
    /*jslint sub: false */

    soldiershbest: false,

    itemhbest: false,

    magichbest: false,

    load: function (type) {
        try {
            if (typeof type !== 'string' || type === '' || town.types.indexOf(type) < 0)  {
                $u.warn("Type passed to load: ", type);
                throw "Invalid type value!";
            }

            town[type] = gm.getItem(type + '.records', 'default');
            if (town[type] === 'default' || !$j.isArray(town[type])) {
                town[type] = gm.setItem(type + '.records', []);
            }

            town[type + "hbest"] = JSON.hbest(town[type]);
            $u.log(2, "town.load " + type + " Hbest", town[type + "hbest"]);
            town.copy2sortable(type);
            state.setItem(type.ucFirst() + "DashUpdate", true);
            $u.log(type, 5, "town.load", type, town[type]);
            return true;
        } catch (err) {
            $u.error("ERROR in town.load: " + err);
            return false;
        }
    },

    save: function (type) {
        try {
            if (typeof type !== 'string' || type === '' || town.types.indexOf(type) < 0)  {
                $u.warn("Type passed to save: ", type);
                throw "Invalid type value!";
            }

            var compress = false;
            gm.setItem(type + '.records', town[type], town[type + "hbest"], compress);
            state.setItem(type.ucFirst() + "DashUpdate", true);
            $u.log(type, 5, "town.save", type, town[type]);
            return true;
        } catch (err) {
            $u.error("ERROR in town.save: " + err);
            return false;
        }
    },

    getItemType: function (name) {
        try {
            var i       = '',
                j       = 0,
                len     = 0,
                mlen    = 0,
                maxlen  = 0,
                match   = [],
                theType = '';

            for (i in town.itemRegex) {
                if (town.itemRegex.hasOwnProperty(i)) {
                    match = name.match(town.itemRegex[i]);
                    if (match) {
                        for (j = 0, len = match.length; j < len; j += 1) {
                            mlen = match[j].length;
                            if (mlen > maxlen) {
                                theType = i;
                                maxlen = mlen;
                            }
                        }
                    }
                }
            }

            return theType;
        } catch (err) {
            $u.error("ERROR in town.getItemType: " + err);
            return undefined;
        }
    },

    /* This section is formatted to allow Advanced Optimisation by the Closure Compiler */
    /*jslint sub: true */
    GetItems: function (type) {
        try {
            var rowDiv  = $j(),
                tempDiv = $j(),
                tStr    = '',
                current = {},
                passed  = true,
                save    = false;

            if (typeof type !== 'string' || type === '' || town.types.indexOf(type) < 0)  {
                $u.warn("Type passed to load: ", type);
                throw "Invalid type value!";
            }

            town[type] = [];
            rowDiv = caap.appBodyDiv.find("td[class*='eq_buy_row']");
            if (rowDiv && rowDiv.length) {
                rowDiv.each(function (index) {
                    var row = $j(this);
                    current = new town.record();
                    tempDiv = row.find("div[class='eq_buy_txt_int'] strong");
                    if (tempDiv && tempDiv.length === 1) {
                        tStr = tempDiv.text();
                        current.data['name'] = tStr ? tStr.trim() : '';
                        current.data['type'] = town.getItemType(current.data['name']);
                    } else {
                        $u.warn("Unable to get item name in", type);
                        passed = false;
                    }

                    if (passed) {
                        tempDiv = row.find("img");
                        if (tempDiv && tempDiv.length === 1) {
                            tStr = tempDiv.attr("src");
                            current.data['image'] = tStr ? tStr.filepart() : '';
                        } else {
                            $u.log(4, "No image found for", type, current.data['name']);
                        }

                        tempDiv = row.find("div[class='eq_buy_txt_int'] span[class='negative']");
                        if (tempDiv && tempDiv.length === 1) {
                            tStr = tempDiv.text();
                            current.data['upkeep'] = tStr ? tStr.numberOnly() : 0;
                        } else {
                            $u.log(4, "No upkeep found for", type, current.data.name);
                        }

                        tempDiv = row.find("div[class='eq_buy_stats_int'] div");
                        if (tempDiv && tempDiv.length === 2) {
                            tStr = tempDiv.eq(0).text();
                            current.data['atk'] = tStr ? tStr.numberOnly() : 0;
                            tStr = tempDiv.eq(1).text();
                            current.data['def'] = tStr ? tStr.numberOnly() : 0;
                            current.data['api'] = (current.data['atk'] + (current.data['def'] * 0.7)).dp(2);
                            current.data['dpi'] = (current.data['def'] + (current.data['atk'] * 0.7)).dp(2);
                            current.data['mpi'] = ((current.data['api'] + current.data['dpi']) / 2).dp(2);
                        } else {
                            $u.warn("No atk/def found for", type, current.data['name']);
                        }

                        tempDiv = row.find("div[class='eq_buy_costs_int'] strong[class='gold']");
                        if (tempDiv && tempDiv.length === 1) {
                            tStr = tempDiv.text();
                            current.data['cost'] = tStr ? tStr.numberOnly() : 0;
                        } else {
                            $u.log(4, "No cost found for", type, current.data['name']);
                        }

                        tempDiv = row.find("div[class='eq_buy_costs_int'] tr:last td").eq(0);
                        if (tempDiv && tempDiv.length === 1) {
                            tStr = tempDiv.text();
                            current.data['owned'] = tStr ? tStr.numberOnly() : 0;
                            current.data['hourly'] = current.data['owned'] * current.data['upkeep'];
                        } else {
                            $u.warn("No number owned found for", type, current.data['name']);
                        }

                        town[type].push(current.data);
                        save = true;
                    }
                });
            }

            if (save) {
                town.save(type);
                town.copy2sortable(type);
                $u.log(2, "Got town details for", type);
            } else {
                $u.log(1, "Nothing to save for", type);
            }

            return true;
        } catch (err) {
            $u.error("ERROR in town.GetItems: " + err);
            return false;
        }
    },

    haveOrb: function (name) {
        try {
            if (typeof name !== 'string' || name === '') {
                throw "Invalid identifying name!";
            }

            var it     = 0,
                len    = 0,
                haveIt = false;

            for (it = 0, len = town.magic.length; it < len; it += 1) {
                if (town.magic[it]['name'] === name) {
                    $u.log(3, "town.haveOrb", town.magic[it]);
                    if (town.magic[it]['owned']) {
                        haveIt = true;
                    }

                    break;
                }
            }

            return haveIt;
        } catch (err) {
            $u.error("ERROR in town.haveOrb: " + err);
            return undefined;
        }
    },

    getCount: function (name, image) {
        try {
            var it1     = 0,
                it2     = 0,
                tempIt1 = -1,
                tempIt2 = -1,
                owned   = 0,
                found   = false;

            for (it1 = town.types.length - 1; it1 >= 0; it1 -= 1) {
                if (found) {
                    break;
                }

                for (it2 = town[town.types[it1]].length - 1; it2 >= 0; it2 -= 1) {
                    if (town[town.types[it1]][it2]['name'] && town[town.types[it1]][it2]['name'] === name) {
                        tempIt1 = it1;
                        tempIt2 = it2;
                        if (image && town[town.types[it1]][it2]['image'] && town[town.types[it1]][it2]['image'] === image) {
                            found = true;
                            break;
                        }
                    }
                }
            }

            if (tempIt1 > -1 && tempIt2 > -1) {
                owned = town[town.types[tempIt1]][tempIt2]['owned'];
            }

            return owned;
        } catch (err) {
            $u.error("ERROR in town.getCount: " + err);
            return undefined;
        }
    }
    /*jslint sub: false */
};

////////////////////////////////////////////////////////////////////
//                          spreadsheet OBJECT
// this is the main object for dealing with spreadsheet items
/////////////////////////////////////////////////////////////////////

spreadsheet = {
    records: [],

    hbest: 2,

    compress: true,

    load: function () {
        try {
            if (!config.getItem("enableTitles", true) && !config.getItem("goblinHinting", true) && !config.getItem("enableRecipeClean", true)) {
                return true;
            }

            spreadsheet.records = ss.getItem('spreadsheet.records', 'default');
            if (spreadsheet.records === 'default' || !$j.isArray(spreadsheet.records) || !spreadsheet.records.length) {
                spreadsheet.records = [];
                $j.ajax({
                    url: "http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20csv%20where%20url%3D'http%3A%2F%2Fspreadsheets.google.com%2Fpub%3Fkey%3D0At1LY6Vd3Bp9dFFXX2xCc0x3RjJpN1VNbER5dkVvTXc%26hl%3Den%26output%3Dcsv'&format=json",
                    dataType: "json",
                    success: function (msg) {
                        $u.log(2, "msg", msg);
                        var rows       = [],
                            row        = 0,
                            rowsLen    = 0,
                            column     = 0,
                            newRecord  = {},
                            cell       = null,
                            headers    = {},
                            headersLen = 0,
                            headersArr = [],
                            key        = '';

                        /* This section is formatted to allow Advanced Optimisation by the Closure Compiler */
                        /*jslint sub: true */
                        rows = msg['query']['results']['row'];
                        /*jslint sub: false */
                        headers = rows[0];
                        for (key in headers) {
                            if (headers.hasOwnProperty(key)) {
                                headersLen = headersArr.push((headers[key]).toLowerCase());
                            }
                        }

                        for (row = 1, rowsLen = rows.length; row < rowsLen; row += 1) {
                            newRecord = {};
                            for (column = 0; column < headersLen; column += 1) {
                                if (headersArr[column] === null || headersArr[column] === undefined || headersArr[column] === '') {
                                    $u.warn("Spreadsheet column is empty", column);
                                    continue;
                                }

                                cell = rows[row]["col" + column];
                                if (cell === null || cell === undefined || cell === '') {
                                    cell = null;
                                } else if (isNaN(cell)) {
                                    if (headersArr[column] === "attack" || headersArr[column] === "defense") {
                                        $u.warn("Spreadsheet " + headersArr[column] + " cell is NaN", cell);
                                    }

                                    cell = cell.replace(/"/g, "");
                                } else {
                                    cell = cell.parseInt();
                                }

                                newRecord[headersArr[column]] = cell;
                            }

                            spreadsheet.records.push(newRecord);
                        }

                        //spreadsheet.hbest = JSON.hbest(spreadsheet.records);
                        $u.log(2, "spreadsheet.records Hbest", spreadsheet.hbest);
                        ss.setItem('spreadsheet.records', spreadsheet.records, spreadsheet.hbest, spreadsheet.compress);
                        $u.log(2, "spreadsheet.records", spreadsheet.records);
                    }
                });
            } else {
                $u.log(2, "spreadsheet.records", spreadsheet.records);
            }

            return true;
        } catch (err) {
            $u.error("ERROR in spreadsheet.load: " + err);
            return false;
        }
    },

    save: function () {
        try {
            spreadsheet.setItem('spreadsheet.records', spreadsheet.records);
            $u.log(1, "spreadsheet.save", spreadsheet.records);
            return true;
        } catch (err) {
            $u.error("ERROR in spreadsheet.save: " + err);
            return false;
        }
    },

    /* This section is formatted to allow Advanced Optimisation by the Closure Compiler */
    /*jslint sub: true */
    getTitle: function (title, image) {
        try {
            var it       = 0,
                tempIt   = -1,
                owned    = 0,
                titleStr = '',
                hide     = false,
                opacity  = false;

            for (it = spreadsheet.records.length - 1; it >= 0; it -= 1) {
                if (spreadsheet.records[it]['name'] && spreadsheet.records[it]['name'] === title) {
                    tempIt = it;
                    if (spreadsheet.records[it]['image'] && spreadsheet.records[it]['image'] === image) {
                        break;
                    }
                }
            }

            if (tempIt > -1) {
                titleStr = spreadsheet.records[tempIt]['name'] + ": " + spreadsheet.records[tempIt]['type'];
                if (spreadsheet.records[tempIt]['attack'] !== null && spreadsheet.records[tempIt]['attack'] !== undefined && spreadsheet.records[tempIt]['defense'] !== null && spreadsheet.records[tempIt]['defense'] !== undefined) {
                    titleStr += ", " + spreadsheet.records[tempIt]['attack'] + "atk," + spreadsheet.records[tempIt]['defense'] + "def";
                }

                if (spreadsheet.records[tempIt]['hero'] !== null && spreadsheet.records[tempIt]['hero'] !== undefined) {
                    titleStr += ", Hero: " + spreadsheet.records[tempIt]['hero'];
                    owned = general.owned(spreadsheet.records[tempIt]['hero']);
                    titleStr += " (Owned: " + owned + ")";
                    hide = (owned ? false : true);
                }

                if (spreadsheet.records[tempIt]['recipe1'] !== null && spreadsheet.records[tempIt]['recipe1'] !== undefined) {
                    titleStr += ", Recipe1: " + spreadsheet.records[tempIt]['recipe1'];
                    if (spreadsheet.records[tempIt]['recipe1'] === "Map of Atlantis") {
                        owned = caap.stats['other']['atlantis'];
                        titleStr += " (Owned: " + owned + ")";
                        hide = (owned ? false : true);
                    } else {
                        owned = town.getCount(spreadsheet.records[tempIt]['recipe1'], spreadsheet.records[tempIt]['recipe1image']);
                        titleStr += " (Owned: " + owned + ")";
                        hide = (owned ? false : true);
                    }
                }

                if (spreadsheet.records[tempIt]['recipe2'] !== null && spreadsheet.records[tempIt]['recipe2'] !== undefined) {
                    titleStr += ", Recipe2: " + spreadsheet.records[tempIt]['recipe2'];
                    owned = town.getCount(spreadsheet.records[tempIt]['recipe2'], spreadsheet.records[tempIt]['recipe2image']);
                    titleStr += " (Owned: " + owned + ")";
                    hide = (owned ? false : true);
                }

                if (spreadsheet.records[tempIt]['recipe3'] !== null && spreadsheet.records[tempIt]['recipe3'] !== undefined) {
                    titleStr += ", Recipe3: " + spreadsheet.records[tempIt]['recipe3'];
                    owned = town.getCount(spreadsheet.records[tempIt]['recipe3'], spreadsheet.records[tempIt]['recipe3image']);
                    titleStr += " (Owned: " + owned + ")";
                    hide = (owned ? false : true);
                }

                if (spreadsheet.records[tempIt]['recipe4'] !== null && spreadsheet.records[tempIt]['recipe4'] !== undefined) {
                    titleStr += ", Recipe4: " + spreadsheet.records[tempIt]['recipe4'];
                    owned = town.getCount(spreadsheet.records[tempIt]['recipe4'], spreadsheet.records[tempIt]['recipe4image']);
                    titleStr += " (Owned: " + owned + ")";
                    hide = (owned ? false : true);
                }

                if (spreadsheet.records[tempIt]['summon'] !== null && spreadsheet.records[tempIt]['summon'] !== undefined) {
                    titleStr += ", Summon: " + spreadsheet.records[tempIt]['summon'];
                    opacity = true;
                }

                if (spreadsheet.records[tempIt]['comment'] !== null && spreadsheet.records[tempIt]['comment'] !== undefined) {
                    titleStr += ", Comment: " + spreadsheet.records[tempIt]['comment'];
                }
            }

            return {title: titleStr, opacity: opacity, hide: hide};
        } catch (err) {
            $u.error("ERROR in spreadsheet.getTitle: " + err);
            return undefined;
        }
    },
    /*jslint sub: false */

    doTitles: function (goblin) {
        try {
            var images = $j("#app46755028429_globalContainer img");
            if (images && images.length) {
                images.each(function () {
                    var img   = $j(this),
                        div   = $j(),
                        title = '',
                        image = '',
                        style = '',
                        tMes  = {};

                    title = img.attr("title");
                    if (title) {
                        image = img.attr("src").filepart();
                        tMes = spreadsheet.getTitle(title, image);
                        if (tMes && $j.isPlainObject(tMes) && !$j.isEmptyObject(tMes) && tMes.title) {
                            img.attr("title", tMes.title);
                            if (goblin && (tMes.opacity || tMes.hide)) {
                                div = img.parent().parent();
                                style = div.attr("style");
                                if (tMes.opacity) {
                                    style += " opacity: 0.3;";
                                }

                                if (tMes.hide) {
                                    style += " display: none;";
                                }

                                div.attr("style", style);
                            }
                        }
                    }
                });
            }

            return true;
        } catch (err) {
            $u.error("ERROR in spreadsheet.doTitles: " + err);
            return false;
        }
    },

    /* This section is formatted to allow Advanced Optimisation by the Closure Compiler */
    /*jslint sub: true */
    isSummon: function (title, image) {
        try {
            var it     = 0,
                tempIt = -1,
                summon = false;

            for (it = spreadsheet.records.length - 1; it >= 0; it -= 1) {
                if (spreadsheet.records[it]['name'] && spreadsheet.records[it]['name'] === title) {
                    tempIt = it;
                    if (spreadsheet.records[it]['image'] && spreadsheet.records[it]['image'] === image) {
                        break;
                    }
                }
            }

            if (tempIt > -1) {
                if (spreadsheet.records[tempIt]['summon'] !== null && spreadsheet.records[tempIt]['summon'] !== undefined) {
                    summon = true;
                }
            }

            return summon;
        } catch (err) {
            $u.error("ERROR in spreadsheet.isSummon: " + err);
            return undefined;
        }
    }
    /*jslint sub: false */
};

////////////////////////////////////////////////////////////////////
//                          gifting OBJECT
// this is the main object for dealing with gifting
/////////////////////////////////////////////////////////////////////

gifting = {
    cachedGiftEntry: {},

    types: ["gifts", "queue", "history"],

    load: function (type) {
        try {
            if (typeof type !== 'string' || type === '' || gifting.types.indexOf(type) < 0)  {
                $u.warn("Type passed to load: ", type);
                throw "Invalid type value!";
            }

            gifting[type].records = gm.getItem("gifting." + type, 'default');
            if (gifting[type].records === 'default' || !$j.isArray(gifting[type].records)) {
                gifting[type].records = gm.setItem("gifting." + type, []);
            }

            gifting[type].hbest = JSON.hbest(gifting[type].records);
            $u.log(2, "gifting." + type + " Hbest", gifting[type].hbest);
            $u.log(5, "gifting.load", type, gifting[type].records);
            state.setItem("Gift" + type.ucFirst() + "DashUpdate", true);
            return true;
        } catch (err) {
            $u.error("ERROR in gifting.load: " + err);
            return false;
        }
    },

    save: function (type) {
        try {
            if (typeof type !== 'string' || type === '' || gifting.types.indexOf(type) < 0)  {
                $u.warn("Type passed to load: ", type);
                throw "Invalid type value!";
            }

            var compress = false;
            gm.setItem("gifting." + type, gifting[type].records, gifting[type].hbest, compress);
            $u.log(5, "gifting.save", type, gifting[type].records);
            state.setItem("Gift" + type.ucFirst() + "DashUpdate", true);
            return true;
        } catch (err) {
            $u.error("ERROR in gifting.save: " + err);
            return false;
        }
    },

    clear: function (type) {
        try {
            if (typeof type !== 'string' || type === '' || gifting.types.indexOf(type) < 0)  {
                $u.warn("Type passed to clear: ", type);
                throw "Invalid type value!";
            }

            gifting[type].records = gm.setItem("gifting." + type, []);
            gifting.cachedGiftEntry = gm.setItem("GiftEntry", {});
            state.setItem("Gift" + type.ucFirst() + "DashUpdate", true);
            return true;
        } catch (err) {
            $u.error("ERROR in gifting.clear: " + err);
            return false;
        }
    },

    init: function () {
        try {
            var result = true;

            if (!gifting.load("gifts")) {
                result = false;
            }

            if (!gifting.load("queue")) {
                result = false;
            }

            if (!gifting.load("history")) {
                result = false;
            }

            gifting.queue.fix();
            gifting.history.fix();
            return result;
        } catch (err) {
            $u.error("ERROR in gifting.init: " + err);
            return undefined;
        }
    },

    /* This section is formatted to allow Advanced Optimisation by the Closure Compiler */
    /*jslint sub: true */
    accept: function () {
        try {
            var giftDiv   = $j(),
                tempText  = '',
                tStr      = '',
                tempNum   = 0,
                current   = {};

            // Some users reported an issue with the following jQuery search using jQuery 1.4.3
            //giftDiv = $j("div[class='messages']:first img:first");
            // So I have changed the query to try and resolve the issue
            giftDiv = $j("div[class='messages'] a[href*='profile.php?id='] img").eq(0);
            if (giftDiv && giftDiv.length) {
                tStr = giftDiv.attr("uid");
                tempNum = tStr ? tStr.parseInt() : '';
                if (tempNum > 0) {
                    current = new gifting.queue.record();
                    current.data['userId'] = tempNum;
                    tStr = giftDiv.attr("title");
                    tempText = tStr ? tStr.trim() : '';
                    if (tempText) {
                        current.data['name'] = tempText;
                    } else {
                        $u.warn("No name found in", giftDiv);
                        current.data['name'] = "Unknown";
                    }
                } else {
                    $u.warn("No uid found in", giftDiv);
                }
            } else {
                $u.warn("No gift messages found!");
            }

            gifting.setCurrent(gm.setItem("GiftEntry", current.data));
            return !$j.isEmptyObject(gifting.getCurrent());
        } catch (err) {
            $u.error("ERROR in gifting.accept: " + err);
            return undefined;
        }
    },
    /*jslint sub: false */

    loadCurrent: function () {
        try {
            gifting.cachedGiftEntry = gm.getItem('GiftEntry', 'default');
            if (gifting.cachedGiftEntry === 'default' || !$j.isPlainObject(gifting.cachedGiftEntry)) {
                gifting.cachedGiftEntry = gm.setItem('GiftEntry', {});
            }

            return true;
        } catch (err) {
            $u.error("ERROR in gifting.loadCurrent: " + err);
            return false;
        }
    },

    getCurrent: function () {
        try {
            return gifting.cachedGiftEntry;
        } catch (err) {
            $u.error("ERROR in gifting.getCurrent: " + err);
            return undefined;
        }
    },

    /* This section is formatted to allow Advanced Optimisation by the Closure Compiler */
    /*jslint sub: true */
    setCurrent: function (record) {
        try {
            if (!record || !$j.isPlainObject(record)) {
                throw "Not passed a record";
            }

            if (isNaN(record['userId']) || record['userId'] < 1) {
                $u.warn("userId", record, record['userId']);
                throw "Invalid identifying userId!";
            }

            gifting.cachedGiftEntry = gm.setItem("GiftEntry", record);
            return gifting.cachedGiftEntry;
        } catch (err) {
            $u.error("ERROR in gifting.setCurrent: " + err);
            return undefined;
        }
    },
    /*jslint sub: false */

    clearCurrent: function () {
        try {
            gifting.cachedGiftEntry = gm.setItem("GiftEntry", {});
            return gifting.cachedGiftEntry;
        } catch (err) {
            $u.error("ERROR in gifting.clearCurrent: " + err);
            return undefined;
        }
    },

    /* This section is formatted to allow Advanced Optimisation by the Closure Compiler */
    /*jslint sub: true */
    collecting: function () {
        try {
            var giftEntry = gifting.getCurrent();
            if (!$j.isEmptyObject(giftEntry) && giftEntry['checked']) {
                gifting.collected(true);
            }

            if ($j.isEmptyObject(giftEntry) && state.getItem('HaveGift', false)) {
                if (caap.NavigateTo('army', 'invite_on.gif')) {
                    return true;
                }

                if (!gifting.accept()) {
                    state.setItem('HaveGift', false);
                    return false;
                }

                schedule.setItem('ClickedFacebookURL', 30);
                caap.VisitUrl("http://apps.facebook.com/reqs.php#confirm_46755028429_0");
                return true;
            }

            if (!$j.isEmptyObject(giftEntry) && !giftEntry['checked']) {
                $u.log(1, "Clearing incomplete pending gift", giftEntry);
                gifting.cachedGiftEntry = gm.setItem("GiftEntry", {});
            }

            return null;
        } catch (err) {
            $u.error("ERROR in gifting.collecting: " + err);
            return undefined;
        }
    },

    collect: function () {
        try {
            var giftEntry  = false,
                appDiv     = $j(),
                inputDiv   = $j(),
                userArr    = [],
                userId     = 0,
                giftDiv    = $j(),
                giftText   = '',
                giftArr    = [],
                giftType   = '',
                tStr       = '',
                uidRegExp  = new RegExp("uid=(\\d+)", "i"),
                giftRegExp = new RegExp("(.*) has sent you a (.*) in Castle Age!", "i");

            if (window.location.href.indexOf('apps.facebook.com/reqs.php#confirm_46755028429_0') < 0) {
                return false;
            }

            giftEntry = gifting.getCurrent();
            if ($j.isEmptyObject(giftEntry)) {
                return false;
            }

            if (!giftEntry['checked']) {
                $u.log(1, 'On FB page with gift ready to go');
                appDiv = $j("#globalContainer .mbl .uiListItem div[id*='app_46755028429_']");
                if (appDiv && appDiv.length) {
                    appDiv.each(function () {
                        var giftRequest = $j(this);
                        //inputDiv = giftRequest.find("input[value='Accept and play'],input[value='Accept and Play'],input[value='Accept']");
                        inputDiv = giftRequest.find(".uiButtonConfirm input[name*='gift_accept.php']");
                        if (inputDiv && inputDiv.length) {
                            userArr = inputDiv.attr("name").match(uidRegExp);
                            if (!userArr || userArr.length !== 2) {
                                return true;
                            }

                            userId = userArr[1] ? userArr[1].parseInt() : '';
                            if (giftEntry['userId'] !== userId) {
                                return true;
                            }

                            giftDiv = giftRequest.find("span[class='fb_protected_wrapper']");
                            giftText = '';
                            giftArr = [];
                            giftType = '';
                            if (giftDiv && giftDiv.length) {
                                tStr = giftDiv.text();
                                giftText = tStr ? tStr.trim() : '';
                                giftArr = giftText.match(giftRegExp);
                                if (giftArr && giftArr.length === 3) {
                                    giftType = giftArr[2];
                                }
                            } else {
                                $u.warn("No fb_protected_wrapper in ", giftRequest);
                            }

                            if (giftType === '' || gifting.gifts.list().indexOf(giftType) < 0) {
                                $u.log(1, 'Unknown gift type', giftType, gifting.gifts.list());
                                giftType = 'Unknown Gift';
                            } else {
                                $u.log(1, 'gift type', giftType, gifting.gifts.list());
                            }

                            giftEntry['gift'] = giftType;
                            giftEntry['found'] = true;
                            giftEntry['checked'] = true;
                            gifting.setCurrent(giftEntry);
                            schedule.setItem('ClickedFacebookURL', 35);
                            caap.Click(inputDiv.get(0));
                            return false;
                        } else {
                            $u.warn("No input found in ", giftRequest.get(0));
                        }

                        return true;
                    });
                } else {
                    $u.warn("No gifts found for CA");
                }

                giftEntry['checked'] = true;
                gifting.setCurrent(giftEntry);
            }

            if (!schedule.check('ClickedFacebookURL')) {
                return false;
            }

            if (giftEntry['found']) {
                $u.log(1, 'Gift click timed out');
            } else {
                giftEntry['gift'] = 'Unknown Gift';
                gifting.setCurrent(giftEntry);
                $u.log(1, 'Unable to find gift', giftEntry);
            }

            caap.VisitUrl("http://apps.facebook.com/castle_age/gift_accept.php?act=acpt&uid=" + giftEntry['userId']);
            return true;
        } catch (err) {
            $u.error("ERROR in gifting.collect: " + err);
            return false;
        }
    },
    /*jslint sub: false */

    collected: function (force) {
        try {
            var giftEntry = gifting.getCurrent();
            if (!$j.isEmptyObject(giftEntry)) {
                if (force || caap.CheckForImage("gift_yes.gif")) {
                    if (!config.getItem("CollectOnly", false) || (config.getItem("CollectOnly", false) && config.getItem("CollectAndQueue", false))) {
                        gifting.queue.setItem(giftEntry);
                    }

                    gifting.history.received(giftEntry);
                }

                gifting.clearCurrent();
            }

            schedule.setItem("NoGiftDelay", 0);
            return true;
        } catch (err) {
            $u.error("ERROR in gifting.collected: " + err);
            return false;
        }
    },

    popCheck: function (type) {
        try {
            var popDiv     = $j(),
                tempDiv    = $j(),
                tempText   = '',
                tryAgain   = true;

            popDiv = $j("#pop_content");
            if (popDiv && popDiv.length) {
                tempDiv = popDiv.find("input[name='sendit']");
                if (tempDiv && tempDiv.length) {
                    $u.log(1, 'Sending gifts to Facebook');
                    caap.Click(tempDiv.get(0));
                    return true;
                }

                tempDiv = popDiv.find("input[name='skip_ci_btn']");
                if (tempDiv && tempDiv.length) {
                    $u.log(1, 'Denying Email Nag For Gift Send');
                    caap.Click(tempDiv.get(0));
                    return true;
                }

                tempDiv = popDiv.find("input[name='ok']");
                if (tempDiv && tempDiv.length) {
                    tempText = tempDiv.parent().parent().prev().text();
                    if (tempText) {
                        if (/you have run out of requests/.test(tempText)) {
                            $u.log(2, 'Out of requests: ', tempText);
                            schedule.setItem("MaxGiftsExceeded", 10800, 300);
                            tryAgain = false;
                        } else {
                            $u.warn('Popup message: ', tempText);
                        }
                    } else {
                        $u.warn('Popup message but no text found', tempDiv);
                    }

                    caap.Click(tempDiv.get(0));
                    return tryAgain;
                }

                tempText = popDiv.text();
                if (tempText) {
                    if (/Loading/.test(tempText)) {
                        $u.log(2, "Popup is loading ...");
                        return true;
                    } else {
                        $u.warn('Unknown popup!', popDiv.text());
                        return false;
                    }
                } else {
                    $u.warn('Popup message but no text found', popDiv);
                    return false;
                }
            }

            if (gifting.waitingForDomLoad) {
                return true;
            }

            return null;
        } catch (err) {
            $u.error("ERROR in gifting.popCheck: " + err);
            return undefined;
        }
    },

    gifts: {
        options: ['Same Gift As Received', 'Random Gift'],

        hbest: false,

        records: [],

        /* This section is formatted to allow Advanced Optimisation by the Closure Compiler */
        /*jslint sub: true */
        record: function () {
            this.data = {
                'name'  : '',
                'image' : ''
            };
        },

        getItem: function (name) {
            try {
                var it    = 0,
                    len   = 0,
                    gift  = false;

                if (typeof name !== 'string' || name === '') {
                    $u.warn("name", name);
                    throw "Invalid identifying name!";
                }

                for (it = 0, len = gifting.gifts.records.length; it < len; it += 1) {
                    if (gifting.gifts.records[it]['name'] === name) {
                        gift = gifting.gifts.records[it];
                        break;
                    }
                }

                return gift;
            } catch (err) {
                $u.error("ERROR in gifting.gifts.getItem: " + err);
                return undefined;
            }
        },

        getImg: function (name) {
            try {
                var it    = 0,
                    len   = 0,
                    image = '';

                if (typeof name !== 'string' || name === '') {
                    $u.warn("name", name);
                    throw "Invalid identifying name!";
                }


                if (name !== 'Unknown Gift') {
                    for (it = 0, len = gifting.gifts.records.length; it < len; it += 1) {
                        if (gifting.gifts.records[it]['name'] === name) {
                            image = gifting.gifts.records[it]['image'];
                            break;
                        }
                    }

                    if (it >= len) {
                        $u.warn("Gift not in list! ", name);
                    }
                }

                return image;
            } catch (err) {
                $u.error("ERROR in gifting.gifts.getImg: " + err);
                return undefined;
            }
        },

        populate: function () {
            try {
                var giftDiv  = $j(),
                    newGift  = {},
                    tempDiv  = $j(),
                    tempText = '',
                    tStr     = '',
                    tempArr  = [],
                    update   = false;

                giftDiv = $j("#app46755028429_giftContainer div[id*='app46755028429_gift']");
                if (giftDiv && giftDiv.length) {
                    gifting.clear("gifts");
                    giftDiv.each(function () {
                        var theGift = $j(this);
                        newGift = new gifting.gifts.record();
                        tempDiv = theGift.children().eq(0);
                        if (tempDiv && tempDiv.length) {
                            tStr = tempDiv.text();
                            tempText = tStr ? tStr.trim().replace("!", "") : '';
                            if (tempText) {
                                newGift.data['name'] = tempText;
                            } else {
                                $u.warn("Unable to get gift name! No text in ", tempDiv);
                                return true;
                            }
                        } else {
                            $u.warn("Unable to get gift name! No child!");
                            return true;
                        }

                        tempDiv = theGift.find("img[class*='imgButton']");
                        if (tempDiv && tempDiv.length) {
                            tStr = tempDiv.attr("src");
                            tempText = tStr ? tStr.filepart() : '';
                            if (tempText) {
                                newGift.data['image'] = tempText;
                            } else {
                                $u.warn("Unable to get gift image! No src in ", tempDiv);
                                return true;
                            }
                        } else {
                            $u.warn("Unable to get gift image! No img!");
                            return true;
                        }

                        if (gifting.gifts.getItem(newGift.data['name'])) {
                            newGift.data['name'] += " #2";
                            $u.log(2, "Gift exists, no auto return for ", newGift.data['name']);
                        }

                        gifting.gifts.records.push(newGift.data);
                        update = true;
                        return true;
                    });
                }

                if (update) {
                    tempArr = gifting.gifts.list();
                    tempText = config.getItem("GiftChoice", gifting.gifts.options[0]);
                    if (tempArr.indexOf(tempText) < 0)  {
                        $u.log(1, "Gift choice invalid, changing from/to ", tempText, gifting.gifts.options[0]);
                        tempText = config.setItem("GiftChoice", gifting.gifts.options[0]);
                    }

                    caap.ChangeDropDownList("GiftChoice", tempArr, tempText);
                    gifting.save("gifts");
                }

                return update;
            } catch (err) {
                $u.error("ERROR in gifting.gifts.populate: " + err);
                return undefined;
            }
        },

        list: function () {
            try {
                var it       = 0,
                    len      = 0,
                    giftList = [];

                for (it = 0, len = gifting.gifts.records.length; it < len; it += 1) {
                    giftList.push(gifting.gifts.records[it]['name']);
                }

                return $j.merge($j.merge([], gifting.gifts.options), giftList);
            } catch (err) {
                $u.error("ERROR in gifting.gifts.list: " + err);
                return undefined;
            }
        },

        random: function () {
            try {
                return gifting.gifts.records[Math.floor(Math.random() * (gifting.gifts.records.length))]['name'];
            } catch (err) {
                $u.error("ERROR in gifting.gifts.random: " + err);
                return undefined;
            }
        },
        /*jslint sub: false */

        length: function () {
            try {
                return gifting.gifts.records.length;
            } catch (err) {
                $u.error("ERROR in gifting.gifts.length: " + err);
                return undefined;
            }
        }
    },

    queue: {
        records: [],

        /* This section is formatted to allow Advanced Optimisation by the Closure Compiler */
        /*jslint sub: true */
        record: function () {
            this.data = {
                'userId'  : 0,
                'name'    : '',
                'gift'    : '',
                'checked' : false,
                'found'   : false,
                'chosen'  : false,
                'sent'    : false,
                'last'    : 0
            };
        },

        fix: function () {
            try {
                var it = 0,
                    save = false;

                for (it = gifting.queue.records.length - 1; it >= 0; it -= 1) {
                    if (isNaN(gifting.queue.records[it]['userId']) || gifting.queue.records[it]['userId'] < 1 || gifting.queue.records[it]['sent'] === true) {
                        $u.warn("gifting.queue.fix - delete", gifting.queue.records[it]);
                        gifting.queue.records.splice(it, 1);
                        save = true;
                    }
                }

                if (save) {
                    gifting.save("queue");
                }

                return save;
            } catch (err) {
                $u.error("ERROR in gifting.queue.fix: " + err);
                return undefined;
            }
        },

        hbest: false,

        setItem: function (record) {
            try {
                if (!record || !$j.isPlainObject(record)) {
                    throw "Not passed a record";
                }

                if (isNaN(record['userId']) || record['userId'] < 1) {
                    $u.warn("userId", record['userId']);
                    throw "Invalid identifying userId!";
                }

                var it      = 0,
                    len     = 0,
                    found   = false,
                    updated = false;

                if (config.getItem("UniqueGiftQueue", true)) {
                    for (it = 0, len = gifting.queue.records.length; it < len; it += 1) {
                        if (gifting.queue.records[it]['userId'] === record['userId']) {
                            if (gifting.queue.records[it]['name'] !== record['name']) {
                                gifting.queue.records[it]['name'] = record['name'];
                                updated = true;
                                $u.log(2, "Updated users name", record, gifting.queue.records);
                            }

                            found = true;
                            break;
                        }
                    }
                }

                if (!found) {
                    gifting.queue.records.push(record);
                    updated = true;
                    $u.log(2, "Added gift to queue", record, gifting.queue.records);
                }

                if (updated) {
                    gifting.save("queue");
                }

                return true;
            } catch (err) {
                $u.error("ERROR in gifting.queue.setItem: " + err, record);
                return false;
            }
        },
        /*jslint sub: false */

        deleteIndex: function (index) {
            try {
                if (isNaN(index) || index < 0 || index >= gifting.queue.records.length) {
                    throw "Invalid index! (" + index + ")";
                }

                gifting.queue.records.splice(index, 1);
                gifting.save("queue");
                return true;
            } catch (err) {
                $u.error("ERROR in gifting.queue.deleteIndex: " + err, index);
                return false;
            }
        },

        length: function () {
            try {
                return gifting.queue.records.length;
            } catch (err) {
                $u.error("ERROR in gifting.queue.length: " + err);
                return undefined;
            }
        },

        randomImg: '',

        /* This section is formatted to allow Advanced Optimisation by the Closure Compiler */
        /*jslint sub: true */
        chooseGift: function () {
            try {
                var it             = 0,
                    it1            = 0,
                    len            = 0,
                    gift           = '',
                    choice         = '',
                    filterId       = false,
                    filterIdList   = [],
                    filterIdLen    = 0,
                    filterGift     = false,
                    filterGiftList = [],
                    filterGiftLen  = 0,
                    filterGiftCont = false;

                filterId = config.getItem("FilterReturnId", false);
                if (filterId) {
                    filterIdList = config.getList("FilterReturnIdList", '');
                    filterIdLen = filterIdList.length;
                }

                filterGift = config.getItem("FilterReturnGift", false);
                if (filterGift) {
                    filterGiftList = config.getList("FilterReturnGiftList", '');
                    filterGiftLen = filterGiftList.length;
                }

                choice = config.getItem("GiftChoice", gifting.gifts.options[0]);
                for (it = 0, len = gifting.queue.records.length; it < len; it += 1) {
                    if (!schedule.since(gifting.queue.records[it]['last'] || 0, gm.getItem("LastGiftUserDelaySecs", 3600, hiddenVar))) {
                        continue;
                    }

                    if (gifting.queue.records[it]['sent']) {
                        continue;
                    }

                    if (filterId && filterIdLen && filterIdList.indexOf(gifting.queue.records[it]['userId']) >= 0) {
                        $u.log(2, "chooseGift Filter Id", gifting.queue.records[it]['userId']);
                        continue;
                    }

                    if (filterGift && filterGiftLen) {
                        filterGiftCont = false;
                        for (it1 = 0; it1 < filterGiftLen; it1 += 1) {
                            if (gifting.queue.records[it]['gift'].indexOf(filterGiftList[it1]) >= 0) {
                                $u.log(2, "chooseGift Filter Gift", gifting.queue.records[it]['gift']);
                                filterGiftCont = true;
                                break;
                            }
                        }

                        if (filterGiftCont) {
                            continue;
                        }
                    }

                    switch (choice) {
                    case gifting.gifts.options[0]:
                        gift = gifting.queue.records[it]['gift'];
                        break;
                    case gifting.gifts.options[1]:
                        if (gifting.randomImg) {
                            gift = gifting.queue.randomImg;
                        } else {
                            gift = gifting.gifts.random();
                            gifting.queue.randomImg = gift;
                        }

                        break;
                    default:
                        gift = choice;
                    }

                    break;
                }

                if (!gift) {
                    schedule.setItem("NoGiftDelay", gm.getItem("NoGiftDelaySecs", 1800, hiddenVar), 300);
                }

                return gift;
            } catch (err) {
                $u.error("ERROR in gifting.queue.chooseGift: " + err);
                return undefined;
            }
        },

        chooseFriend: function (howmany) {
            try {
                var it             = 0,
                    it1            = 0,
                    len            = 0,
                    tempGift       = '',
                    unselListDiv   = $j(),
                    selListDiv     = $j(),
                    unselDiv       = $j(),
                    selDiv         = $j(),
                    first          = true,
                    same           = true,
                    returnOnlyOne  = false,
                    filterId       = false,
                    filterIdList   = [],
                    filterIdLen    = 0,
                    filterGift     = false,
                    filterGiftList = [],
                    filterGiftLen  = 0,
                    filterGiftCont = false,
                    giftingList    = [],
                    searchStr      = '',
                    clickedList    = [],
                    pendingList    = [],
                    chosenList     = [];

                if (isNaN(howmany) || howmany < 1) {
                    throw "Invalid howmany! (" + howmany + ")";
                }

                returnOnlyOne = config.getItem("ReturnOnlyOne", false);
                filterId = config.getItem("FilterReturnId", false);
                if (filterId) {
                    filterIdList = config.getList("FilterReturnIdList", '');
                    filterIdLen = filterIdList.length;
                }

                filterGift = config.getItem("FilterReturnGift", false);
                if (filterGift) {
                    filterGiftList = config.getList("FilterReturnGiftList", '');
                    filterGiftLen = filterGiftList.length;
                }

                if (config.getItem("GiftChoice", gifting.gifts.options[0]) !== gifting.gifts.options[0]) {
                    same = false;
                }

                unselListDiv = caap.appBodyDiv.find("div[class='unselected_list']");
                selListDiv = caap.appBodyDiv.find("div[class='selected_list']");
                for (it = 0, len = gifting.queue.records.length; it < len; it += 1) {
                    gifting.queue.records[it]['chosen'] = false;

                    if (giftingList.length >= howmany) {
                        continue;
                    }

                    if (!schedule.since(gifting.queue.records[it]['last'] || 0, gm.getItem("LastGiftUserDelaySecs", 3600, hiddenVar))) {
                        continue;
                    }

                    if (gifting.queue.records[it]['sent']) {
                        continue;
                    }

                    if (filterId && filterIdLen && filterIdList.indexOf(gifting.queue.records[it]['userId']) >= 0) {
                        $u.log(2, "chooseFriend Filter Id", gifting.queue.records[it]['userId']);
                        continue;
                    }

                    if (filterGift && filterGiftLen) {
                        filterGiftCont = false;
                        for (it1 = 0; it1 < filterGiftLen; it1 += 1) {
                            if (gifting.queue.records[it]['gift'].indexOf(filterGiftList[it1]) >= 0) {
                                $u.log(2, "chooseFriend Filter Gift", gifting.queue.records[it]['gift']);
                                filterGiftCont = true;
                                break;
                            }
                        }

                        if (filterGiftCont) {
                            continue;
                        }
                    }

                    if (returnOnlyOne) {
                        if (gifting.history.checkSentOnce(gifting.queue.records[it]['userId'])) {
                            $u.log(2, "Sent Today: ", gifting.queue.records[it]['userId']);
                            gifting.queue.records[it]['last'] = new Date().getTime();
                            continue;
                        }
                    }

                    if (first) {
                        tempGift = gifting.queue.records[it]['gift'];
                        first = false;
                    }

                    if (gifting.queue.records[it]['gift'] === tempGift || !same) {
                        giftingList.push(gifting.queue.records[it]['userId']);
                    }
                }

                if (giftingList.length) {
                    for (it = 0, len = giftingList.length; it < len; it += 1) {
                        searchStr += "input[value='" + giftingList[it] + "']";
                        if (it >= 0 && it < len - 1) {
                            searchStr += ",";
                        }
                    }

                    unselDiv = unselListDiv.find(searchStr);
                    if (unselDiv && unselDiv.length) {
                        unselDiv.each(function () {
                            var unsel = $j(this),
                                tStr = '',
                                id    = 0;

                            tStr = unsel.attr("value");
                            id = tStr ? tStr.parseInt() : 0;
                            if (!/none/.test(unsel.parent().attr("style"))) {
                                caap.waitingForDomLoad = false;
                                caap.Click(unsel.get(0));
                                $u.log(2, "Id clicked:", id);
                                clickedList.push(id);
                            } else {
                                $u.log(2, "Id not found, perhaps gift pending:", id);
                                pendingList.push(id);
                            }
                        });
                    } else {
                        $u.log(2, "Ids not found:", giftingList, searchStr);
                        $j.merge(pendingList, giftingList);
                    }

                    if (clickedList && clickedList.length) {
                        for (it = 0, len = clickedList.length; it < len; it += 1) {
                            searchStr += "input[value='" + clickedList[it] + "']";
                            if (it >= 0 && it < len - 1) {
                                searchStr += ",";
                            }
                        }

                        selDiv = selListDiv.find(searchStr);
                        if (selDiv && selDiv.length) {
                            selDiv.each(function () {
                                var sel  = $j(this),
                                    tStr = '',
                                    id   = 0;

                                tStr = sel.attr("value");
                                id = tStr ? tStr.parseInt() : 0;
                                if (!/none/.test(sel.parent().attr("style"))) {
                                    $u.log(2, "User Chosen:", id);
                                    chosenList.push(id);
                                } else {
                                    $u.log(2, "Selected id is none:", id);
                                    pendingList.push(id);
                                }
                            });
                        } else {
                            $u.log(2, "Selected ids not found:", searchStr);
                            $j.merge(pendingList, clickedList);
                        }
                    }

                    $u.log(2, "chosenList/pendingList", chosenList, pendingList);
                    for (it = 0, len = gifting.queue.records.length; it < len; it += 1) {
                        if (chosenList.indexOf(gifting.queue.records[it]['userId']) >= 0) {
                            $u.log(2, "Chosen", gifting.queue.records[it]['userId']);
                            gifting.queue.records[it]['chosen'] = true;
                            gifting.queue.records[it]['last'] = new Date().getTime();
                        } else if (pendingList.indexOf(gifting.queue.records[it]['userId']) >= 0) {
                            $u.log(2, "Pending", gifting.queue.records[it]['userId']);
                            gifting.queue.records[it]['last'] = new Date().getTime();
                        }
                    }

                    caap.waitingForDomLoad = false;
                    gifting.save("queue");
                }

                return chosenList.length;
            } catch (err) {
                $u.error("ERROR in gifting.queue.chooseFriend: " + err);
                return undefined;
            }
        },

        sent: function () {
            try {
                var it         = 0,
                    resultDiv  = $j(),
                    resultText = '',
                    sentok     = false;

                if (window.location.href.indexOf('act=create') >= 0) {
                    resultDiv = $j('#app46755028429_results_main_wrapper');
                    if (resultDiv && resultDiv.length) {
                        resultText = resultDiv.text();
                        if (resultText) {
                            if (/You have sent \d+ gift/.test(resultText)) {
                                for (it = gifting.queue.records.length - 1; it >= 0; it -= 1) {
                                    if (gifting.queue.records[it]['chosen']) {
                                        gifting.queue.records[it]['sent'] = true;
                                        gifting.history.sent(gifting.queue.records[it]);
                                        gifting.queue.records.splice(it, 1);
                                    }
                                }

                                $u.log(1, 'Confirmed gifts sent out.');
                                sentok = true;
                                gifting.save("queue");
                            } else if (/You have exceed the max gift limit for the day/.test(resultText)) {
                                $u.log(1, 'Exceeded daily gift limit.');
                                schedule.setItem("MaxGiftsExceeded", gm.getItem("MaxGiftsExceededDelaySecs", 10800, hiddenVar), 300);
                            } else {
                                $u.log(2, 'Result message', resultText);
                            }
                        } else {
                            $u.log(2, 'No result message');
                        }
                    }
                } else {
                    $u.log(2, 'Not a gift create request');
                }

                return sentok;
            } catch (err) {
                $u.error("ERROR in gifting.queue.sent: " + err);
                return undefined;
            }
        }
        /*jslint sub: false */
    },

    history: {
        records: [],

        /* This section is formatted to allow Advanced Optimisation by the Closure Compiler */
        /*jslint sub: true */
        record: function () {
            this.data = {
                'userId'       : 0,
                'name'         : '',
                'sent'         : 0,
                'lastSent'     : 0,
                'received'     : 0,
                'lastReceived' : 0
            };
        },

        fix: function () {
            try {
                var it = 0,
                    save = false;

                for (it = gifting.history.records.length - 1; it >= 0; it -= 1) {
                    if (isNaN(gifting.history.records[it]['userId']) || gifting.history.records[it]['userId'] < 1) {
                        $u.warn("gifting.history.fix - delete", gifting.history.records[it]);
                        gifting.history.records.splice(it, 1);
                        save = true;
                    }
                }

                if (save) {
                    gifting.save("history");
                }

                return save;
            } catch (err) {
                $u.error("ERROR in gifting.history.fix: " + err);
                return undefined;
            }
        },

        hbest: false,

        received: function (record) {
            try {
                if (!record || !$j.isPlainObject(record)) {
                    throw "Not passed a record";
                }

                if (isNaN(record['userId']) || record['userId'] < 1) {
                    $u.warn("userId", record['userId']);
                    throw "Invalid identifying userId!";
                }

                var it        = 0,
                    len       = 0,
                    success   = false,
                    newRecord = {};

                for (it = 0, len = gifting.history.records.length; it < len; it += 1) {
                    if (gifting.history.records[it]['userId'] === record['userId']) {
                        if (gifting.history.records[it]['name'] !== record['name']) {
                            gifting.history.records[it]['name'] = record['name'];
                        }

                        gifting.history.records[it]['received'] += 1;
                        gifting.history.records[it]['lastReceived'] = new Date().getTime();
                        success = true;
                        break;
                    }
                }

                if (success) {
                    $u.log(2, "Updated gifting.history record", gifting.history.records[it], gifting.history.records);
                } else {
                    newRecord = new gifting.history.record();
                    newRecord.data['userId'] = record['userId'];
                    newRecord.data['name'] = record['name'];
                    newRecord.data['received'] = 1;
                    newRecord.data['lastReceived'] = new Date().getTime();
                    gifting.history.records.push(newRecord.data);
                    $u.log(2, "Added gifting.history record", newRecord.data, gifting.history.records);
                }

                gifting.save("history");
                return true;
            } catch (err) {
                $u.error("ERROR in gifting.history.received: " + err, record);
                return false;
            }
        },

        sent: function (record) {
            try {
                if (!record || !$j.isPlainObject(record)) {
                    throw "Not passed a record";
                }

                if (isNaN(record['userId']) || record['userId'] < 1) {
                    $u.warn("userId", record['userId']);
                    throw "Invalid identifying userId!";
                }

                var it        = 0,
                    len       = 0,
                    success   = false,
                    newRecord = {};

                for (it = 0, len = gifting.history.records.length; it < len; it += 1) {
                    if (gifting.history.records[it]['userId'] === record['userId']) {
                        if (gifting.history.records[it]['name'] !== record['name']) {
                            gifting.history.records[it]['name'] = record['name'];
                        }

                        gifting.history.records[it]['sent'] += 1;
                        gifting.history.records[it]['lastSent'] = new Date().getTime();
                        success = true;
                        break;
                    }
                }

                if (success) {
                    $u.log(2, "Updated gifting.history record", gifting.history.records[it], gifting.history.records);
                } else {
                    newRecord = new gifting.history.record();
                    newRecord.data['userId'] = record['userId'];
                    newRecord.data['name'] = record['name'];
                    newRecord.data['sent'] = 1;
                    newRecord.data['lastSent'] = new Date().getTime();
                    gifting.history.records.push(newRecord.data);
                    $u.log(2, "Added gifting.history record", newRecord.data, gifting.history.records);
                }

                gifting.save("history");
                return true;
            } catch (err) {
                $u.error("ERROR in gifting.history.sent: " + err, record);
                return false;
            }
        },

        checkSentOnce: function (userId) {
            try {
                if (isNaN(userId) || userId < 1) {
                    $u.warn("userId", userId);
                    throw "Invalid identifying userId!";
                }

                var it       = 0,
                    len      = 0,
                    sentOnce = false;

                for (it = 0, len = gifting.history.records.length; it < len; it += 1) {
                    if (gifting.history.records[it]['userId'] !== userId) {
                        continue;
                    }

                    sentOnce = !schedule.since(gifting.history.records[it]['lastSent'] || 0, gm.getItem("OneGiftPerPersonDelaySecs", 86400, hiddenVar));
                    break;
                }

                return sentOnce;
            } catch (err) {
                $u.error("ERROR in gifting.history.checkSentOnce: " + err, userId);
                return undefined;
            }
        },
        /*jslint sub: false */

        length: function () {
            try {
                return gifting.history.records.length;
            } catch (err) {
                $u.error("ERROR in gifting.history.length: " + err);
                return undefined;
            }
        }
    }
};

/* This section is added to allow Advanced Optimisation by the Closure Compiler */
/*jslint sub: true */
window['gifting'] = gifting;
gifting['gifts'] = gifting.gifts;
gifting['queue'] = gifting.queue;
gifting['history'] = gifting.history;
/*jslint sub: false */

////////////////////////////////////////////////////////////////////
//                          army OBJECT
// this is the main object for dealing with Army
/////////////////////////////////////////////////////////////////////

army = {
    records: [],

    recordsSortable: [],

    recordsTemp: [],

    perPage: 25,

    pageDone: true,

    /* This section is formatted to allow Advanced Optimisation by the Closure Compiler */
    /*jslint sub: true */
    record: function () {
        this.data = {
            'user'       : '',
            'name'       : '',
            'userId'     : '',
            'lvl'        : 0,
            'last'       : 0,
            'change'     : 0,
            'color'      : 'black'
        };
    },

    copy2sortable: function () {
        try {
            var order = new sort.order();
            $j.extend(true, order.data, state.getItem("ArmySort", order.data));
            army.recordsSortable = [];
            $j.merge(army.recordsSortable, army.records);
            army.recordsSortable.sort($u.sortBy(order.data['reverse']['a'], order.data['value']['a'], $u.sortBy(order.data['reverse']['b'], order.data['value']['b'], $u.sortBy(order.data['reverse']['c'], order.data['value']['c']))));
            return true;
        } catch (err) {
            $u.error("ERROR in army.copy2sortable: " + err);
            return false;
        }
    },
    /*jslint sub: false */

    hbest: 3,

    load: function () {
        try {
            army.records = gm.getItem('army.records', 'default');
            if (army.records === 'default' || !$j.isArray(army.records)) {
                army.records = gm.setItem('army.records', []);
            }

            army.copy2sortable();
            //army.hbest = JSON.hbest(army.records);
            $u.log(2, "army.load Hbest", army.hbest);
            state.setItem("ArmyDashUpdate", true);
            $u.log(5, "army.load", army.records);
            return true;
        } catch (err) {
            $u.error("ERROR in army.load: " + err);
            return false;
        }
    },

    save: function () {
        try {
            var compress = true;
            gm.setItem('army.records', army.records, army.hbest, compress);
            state.setItem("ArmyDashUpdate", true);
            $u.log(5, "army.save", army.records);
            return true;
        } catch (err) {
            $u.error("ERROR in army.save: " + err);
            return false;
        }
    },

    loadTemp: function () {
        try {
            army.recordsTemp = ss.getItem('army.recordsTemp', 'default');
            if (army.recordsTemp === 'default' || !$j.isArray(army.recordsTemp)) {
                army.recordsTemp = ss.setItem('army.recordsTemp', []);
            }

            $u.log(5, "army.loadTemp", army.recordsTemp);
            return true;
        } catch (err) {
            $u.error("ERROR in army.loadTemp: " + err);
            return false;
        }
    },

    saveTemp: function () {
        try {
            ss.setItem('army.recordsTemp', army.recordsTemp);
            $u.log(5, "army.saveTemp", army.recordsTemp);
            return true;
        } catch (err) {
            $u.error("ERROR in army.saveTemp: " + err);
            return false;
        }
    },

    init: function () {
        army.loadTemp();
        army.load();
    },

    onError: function () {
        var currentPage = 0;

        currentPage = ss.getItem("army.currentPage", 1);
        if (currentPage > 1) {
            ss.setItem("army.currentPage", currentPage - 1);
        }

        army.pageDone = true;
    },

    /* This section is formatted to allow Advanced Optimisation by the Closure Compiler */
    /*jslint sub: true */
    page: function (number) {
        try {
            $u.log(1, "army.page number", number);
            $j.ajax({
                url: "http://apps.facebook.com/castle_age/army_member.php?page=" + number,
                error:
                    function (XMLHttpRequest, textStatus, errorThrown) {
                        $u.error("army.page ajax", textStatus);
                        army.onError();
                    },
                success:
                    function (data, textStatus, XMLHttpRequest) {
                        try {
                            var jData   = $j(),
                                pages   = $j(),
                                search  = $j(),
                                tStr    = '',
                                tTxt    = '',
                                tNum    = 0,
                                pCount  = 0,
                                it      = 0,
                                record  = {};

                            jData = $j(data);
                            if (number === 1) {
                                pages = jData.find("a[href*='army_member.php?page=']");
                                tStr = pages.last().attr("href");
                                pCount = tStr.regex(/page=(\d+)/);
                                pCount = pCount ? pCount : 1;
                                state.setItem("ArmyPageCount", pCount);
                            } else {
                                pCount = state.getItem("ArmyPageCount", 1);
                            }

                            search = jData.find("a[href*='comments.php?casuser=']");
                            search.each(function () {
                                var el    = $j(this),
                                    tStr1 = '';

                                record = new army.record();
                                tStr1 = el.attr("href");
                                tNum = tStr1.regex(/casuser=(\d+)/);
                                record.data['userId'] = tNum ? tNum : 0;
                                tStr1 = el.parents("tr").eq(0).text().trim().innerTrim();
                                tTxt = tStr1.regex('(.+) "');
                                record.data['user'] = (tTxt !== undefined && tTxt !== null) ? tTxt.toString() : '';
                                tTxt = tStr1.regex(new RegExp('"(.+)"'));
                                record.data['name'] = (tTxt !== undefined && tTxt !== null) ? tTxt.toString() : '';
                                tNum = tStr1.regex(/Level (\d+)/);
                                record.data['lvl'] = tNum ? tNum : 0;
                                record.data['last'] = new Date().getTime();
                                if (record.data['userId']) {
                                    army.recordsTemp.push(record.data);
                                } else {
                                    $u.log(1, "army.page skipping record", record.data);
                                }
                            });

                            if (number === pCount) {
                                search = jData.find("img[src*='bonus_member.jpg']");
                                if (search && search.length) {
                                    search = search.parent().parent().find("a[href*='oracle.php']");
                                    if (search && search.length) {
                                        tTxt = search.text();
                                        tTxt = tTxt ? tTxt : '';
                                        tNum = tTxt.regex(/Extra members x(\d+)/);
                                        for (it = 1; it <= tNum; it += 1) {
                                            record = new army.record();
                                            record.data['userId'] = 900000000000000 + it;
                                            record.data['name'] = "Extra member " + it;
                                            record.data['lvl'] = 0;
                                            record.data['last'] = new Date().getTime();
                                            army.recordsTemp.push(record.data);
                                        }
                                    }
                                }
                            }

                            $u.log(1, "army.page ajax", pCount, army.recordsTemp);
                            army.pageDone = true;
                        } catch (err) {
                            $u.error("ERROR in army.page ajax: " + err);
                            army.onError();
                        }
                    }
            });

            return true;
        } catch (err) {
            $u.error("ERROR in AjaxGiftCheck: " + err);
            army.onError();
            return false;
        }
    },

    run: function () {
        try {
            if (!schedule.check("army_member")) {
                return false;
            }

            var expectedPageCount = 0,
                currentPage       = 0;

            currentPage = ss.getItem("army.currentPage", 1);
            expectedPageCount = state.getItem("ArmyPageCount", 0);
            if (!expectedPageCount) {
                expectedPageCount = Math.ceil((caap.stats['army']['actual'] - 1) / army.perPage);
                expectedPageCount = expectedPageCount ? expectedPageCount : 0;
            }

            if (currentPage > expectedPageCount) {
                army.saveTemp();
                army.pageDone = false;
                army.merge();
                ss.setItem("army.currentPage", 1);
                $u.log(1, "army.run", expectedPageCount, caap.stats['army']['actual'] - 1, army.recordsTemp);
                schedule.setItem("army_member", 604800, 300);
                return false;
            } else if (currentPage === 1) {
                army.recordsTemp = [];
                army.saveTemp();
                army.pageDone = false;
                army.page(currentPage);
                ss.setItem("army.currentPage", 2);
            } else if (army.pageDone) {
                army.saveTemp();
                army.pageDone = false;
                army.page(currentPage);
                ss.setItem("army.currentPage", currentPage + 1);
            }

            return true;
        } catch (err) {
            $u.error("ERROR in army.run: " + err);
            return false;
        }
    },

    find: function (userId) {
        try {
            var it    = 0,
                len   = 0,
                found = false;

            for (it = 0, len = army.records.length; it < len; it += 1) {
                if (army.records[it]['userId'] === userId) {
                    found = true;
                    break;
                }
            }

            if (!found) {
                $u.log(1, "Unable to find 'userId'", userId);
                return false;
            }

            return army.records[it];
        } catch (err) {
            $u.error("ERROR in army.find: " + err);
            return false;
        }
    },

    merge: function () {
        try {
            var it     = 0,
                len    = 0,
                record = {};

            for (it = 0, len = army.recordsTemp.length; it < len; it += 1) {
                record = army.find(army.recordsTemp[it]['userId']);
                if (record) {
                    if (army.recordsTemp[it]['lvl'] > record['lvl']) {
                        army.recordsTemp[it]['change'] = army.recordsTemp[it]['last'];
                        $u.log(1, "Changed level", army.recordsTemp[it]);
                    }
                }
            }

            army.records = army.recordsTemp.slice();
            army.save();
            army.copy2sortable();
            return true;
        } catch (err) {
            $u.error("ERROR in army.merge: " + err);
            return false;
        }
    }
    /*jslint sub: false */
};

////////////////////////////////////////////////////////////////////
//                          caap OBJECT
// this is the main object for the game, containing all methods, globals, etc.
/////////////////////////////////////////////////////////////////////

caap = {
    lastReload          : new Date().getTime(),
    pageLoadCounter     : 0,
    flagReload          : false,
    waitingForDomLoad   : false,
    pageLoadOK          : false,
    caapDivObject       : {},
    caapTopObject       : {},
    documentTitle       : document.title,
    newVersionAvailable : false,
    appBodyDiv          : {},

    start: function () {
        $u.log(1, 'Full page load completed');
        window.clearTimeout(caap_timeout);

        var FBID      = 0,
            idOk      = false,
            tempText  = '',
            tempArr   = [],
            accountEl = $j();

        function mainCaapLoop() {
            caap.waitMilliSecs = 8000;
            caap.WaitMainLoop();
            caap.ReloadOccasionally();
        }

        gm.clear('0');
        if (caap.ErrorCheck()) {
            mainCaapLoop();
            return;
        }

        /* This section is formatted to allow Advanced Optimisation by the Closure Compiler */
        /*jslint sub: true */
        accountEl = $j('#navAccountName');
        if (accountEl && accountEl.length) {
            tempText = accountEl.attr('href');
            if (tempText) {
                FBID = tempText.regex(/id=(\d+)/i);
                if ($u.isNum(FBID) && FBID > 0) {
                    caap.stats['FBID'] = FBID;
                    idOk = true;
                }
            }
        }

        if (!idOk) {
            tempText = $j('script').text();
            tempArr = tempText ? tempText.match(new RegExp('user:(\\d+),', 'i')) : [];
            if (tempArr && tempArr.length === 2) {
                FBID = tempArr[1].parseInt();
                if ($u.isNum(FBID) && FBID > 0) {
                    caap.stats['FBID'] = FBID;
                    idOk = true;
                }
            }

            if (!idOk) {
                tempArr = tempText ? tempText.match(new RegExp('."user.":(\\d+),', 'i')) : [];
                if (tempArr && tempArr.length === 2) {
                    FBID = tempArr[1].parseInt();
                    if ($u.isNum(FBID) && FBID > 0) {
                        caap.stats['FBID'] = FBID;
                        idOk = true;
                    }
                }

                if (!idOk) {
                    FBID = window.presence.user ? window.presence.user.parseInt() : 0;
                    if ($u.isNum(FBID) && FBID > 0) {
                        $u.log(1, "FBID", FBID);
                        caap.stats['FBID'] = FBID;
                        idOk = true;
                    }
                }
            }
        }
        /*jslint sub: false */

        if (!idOk) {
            // Force reload without retrying
            $u.error('No Facebook UserID!!! Reloading ...', FBID, window.location.href);
            if (typeof window.location.reload === 'function') {
                window.location.reload();
            } else if (typeof history.go === 'function') {
                history.go(0);
            } else {
                window.location.href = window.location.href;
            }

            return;
        }

        gm.set_storage_id(FBID.toString());
        ss.set_storage_id(FBID.toString());
        config.load();
        $u.set_log_level(config.getItem('DebugLevel', $u.get_log_level()));
        $u.testsRun($u.get_log_level() >= 2 ? true : false);
        css.AddCSS();
        caap.lsUsed();
        schedule.load();
        state.load();
        caap.LoadStats();
        /* This section is formatted to allow Advanced Optimisation by the Closure Compiler */
        /*jslint sub: true */
        caap.stats['FBID'] = FBID;
        tempText = accountEl.text();
        caap.stats['account'] = tempText ? tempText : '';
        /*jslint sub: false */
        gifting.init();
        gifting.loadCurrent();
        state.setItem('clickUrl', window.location.href);
        schedule.setItem('clickedOnSomething', 0);

        /////////////////////////////////////////////////////////////////////
        //                          http://code.google.com/ updater
        // Used by browsers other than Chrome (namely Firefox and Flock)
        // to get updates from http://code.google.com/
        /////////////////////////////////////////////////////////////////////

        if ($u.is_firefox) {
            if (!devVersion) {
                caap.releaseUpdate();
            } else {
                caap.devUpdate();
            }
        }

        /////////////////////////////////////////////////////////////////////
        // Put code to be run once to upgrade an old version's variables to
        // new format or such here.
        /////////////////////////////////////////////////////////////////////

        if (devVersion) {
            if (state.getItem('LastVersion', 0) !== caapVersion || state.getItem('LastDevVersion', 0) !== devVersion) {
                state.setItem('LastVersion', caapVersion);
                state.setItem('LastDevVersion', devVersion);
            }
        } else {
            if (state.getItem('LastVersion', 0) !== caapVersion) {
                state.setItem('LastVersion', caapVersion);
                state.setItem('LastDevVersion', 0);
            }
        }

        if (window.location.href.indexOf('facebook.com/castle_age/') >= 0) {
            state.setItem('caapPause', 'none');
            state.setItem('ReleaseControl', true);
            window.setTimeout(caap.init, 200);
        }

        mainCaapLoop();
    },

    /* This section is formatted to allow Advanced Optimisation by the Closure Compiler */
    /*jslint sub: true */
    lsUsed: function () {
        try {
            var count = {
                    'match' : 0,
                    'total' : 0
                },
                perc = {
                    caap  : 0,
                    total : 0
                },
                message = '';

            count = gm.used();
            perc.caap = ((count['match'] * 2.048 / 5242880) * 100).dp();
            $u.log(1, "CAAP localStorage used: " + perc.caap + "%");
            perc.total = ((count['total'] * 2.048 / 5242880) * 100).dp();
            if (perc.total >= 90) {
                $u.warn("Total localStorage used: " + perc.total + "%");
                message = "<div style='text-align: center;'>";
                message += "<span style='color: red; font-size: 14px; font-weight: bold;'>WARNING!</span><br />";
                message += "localStorage usage for domain: " + perc.total + "%<br />";
                message += "CAAP is using: " + perc.total + "%";
                message += "</div>";
                window.setTimeout(function () {
                    $u.alert(message);
                }, 5000);
            } else {
                $u.log(1, "Total localStorage used: " + perc.total + "%");
            }

            return true;
        } catch (err) {
            $u.error("ERROR in release lsUsed: " + err);
            return false;
        }
    },
    /*jslint sub: false */

    IncrementPageLoadCounter: function () {
        try {
            caap.pageLoadCounter += 1;
            $u.log(3, "pageLoadCounter", caap.pageLoadCounter);
            return caap.pageLoadCounter;
        } catch (err) {
            $u.error("ERROR in IncrementPageLoadCounter: " + err);
            return undefined;
        }
    },

    releaseUpdate: function () {
        try {
            if (state.getItem('SUC_remote_version', 0) > caapVersion) {
                caap.newVersionAvailable = true;
            }

            // update script from: http://castle-age-auto-player.googlecode.com/files/Castle-Age-Autoplayer.user.js
            function updateCheck(forced) {
                if (forced || schedule.check('SUC_last_update')) {
                    try {
                        GM_xmlhttpRequest({
                            method: 'GET',
                            url: 'http://castle-age-auto-player.googlecode.com/files/Castle-Age-Autoplayer.user.js',
                            headers: {'Cache-Control': 'no-cache'},
                            onload: function (resp) {
                                var remote_version = resp.responseText.match(new RegExp("@version\\s*(.*?)\\s*$", "m"))[1],
                                    script_name    = resp.responseText.match(new RegExp("@name\\s*(.*?)\\s*$", "m"))[1];

                                schedule.setItem('SUC_last_update', 86400000);
                                state.setItem('SUC_target_script_name', script_name);
                                state.setItem('SUC_remote_version', remote_version);
                                $u.log(1, 'Remote version ', remote_version);
                                if (remote_version > caapVersion) {
                                    caap.newVersionAvailable = true;
                                    if (forced) {
                                        if (confirm('There is an update available for the Greasemonkey script "' + script_name + '."\nWould you like to go to the install page now?')) {
                                            GM_openInTab('http://senses.ws/caap/index.php?topic=771.msg3582#msg3582');
                                        }
                                    }
                                } else if (forced) {
                                    alert('No update is available for "' + script_name + '."');
                                }
                            }
                        });
                    } catch (err) {
                        if (forced) {
                            alert('An error occurred while checking for updates:\n' + err);
                        }
                    }
                }
            }

            GM_registerMenuCommand(state.getItem('SUC_target_script_name', '???') + ' - Manual Update Check', function () {
                updateCheck(true);
            });

            updateCheck(false);
        } catch (err) {
            $u.error("ERROR in release updater: " + err);
        }
    },

    devUpdate: function () {
        try {
            if (state.getItem('SUC_remote_version', 0) > caapVersion || (state.getItem('SUC_remote_version', 0) >= caapVersion && state.getItem('DEV_remote_version', 0) > devVersion)) {
                caap.newVersionAvailable = true;
            }

            // update script from: http://castle-age-auto-player.googlecode.com/svn/trunk/Castle-Age-Autoplayer.user.js
            function updateCheck(forced) {
                if (forced || schedule.check('SUC_last_update')) {
                    try {
                        GM_xmlhttpRequest({
                            method: 'GET',
                            url: 'http://castle-age-auto-player.googlecode.com/svn/trunk/Castle-Age-Autoplayer.user.js',
                            headers: {'Cache-Control': 'no-cache'},
                            onload: function (resp) {
                                var remote_version = resp.responseText.match(new RegExp("@version\\s*(.*?)\\s*$", "m"))[1],
                                    dev_version    = resp.responseText.match(new RegExp("@dev\\s*(.*?)\\s*$", "m"))[1],
                                    script_name    = resp.responseText.match(new RegExp("@name\\s*(.*?)\\s*$", "m"))[1];

                                schedule.setItem('SUC_last_update', 86400000);
                                state.setItem('SUC_target_script_name', script_name);
                                state.setItem('SUC_remote_version', remote_version);
                                state.setItem('DEV_remote_version', dev_version);
                                $u.log(1, 'Remote version ', remote_version, dev_version);
                                if (remote_version > caapVersion || (remote_version >= caapVersion && dev_version > devVersion)) {
                                    caap.newVersionAvailable = true;
                                    if (forced) {
                                        if (confirm('There is an update available for the Greasemonkey script "' + script_name + '."\nWould you like to go to the install page now?')) {
                                            GM_openInTab('http://code.google.com/p/castle-age-auto-player/updates/list');
                                        }
                                    }
                                } else if (forced) {
                                    alert('No update is available for "' + script_name + '."');
                                }
                            }
                        });
                    } catch (err) {
                        if (forced) {
                            alert('An error occurred while checking for updates:\n' + err);
                        }
                    }
                }
            }

            GM_registerMenuCommand(state.getItem('SUC_target_script_name', '???') + ' - Manual Update Check', function () {
                updateCheck(true);
            });

            updateCheck(false);
        } catch (err) {
            $u.error("ERROR in development updater: " + err);
        }
    },

    init: function () {
        try {
            state.setItem(caap.friendListType.gifta.name + 'Requested', false);
            state.setItem(caap.friendListType.giftc.name + 'Requested', false);
            state.setItem(caap.friendListType.facebook.name + 'Requested', false);
            // Get rid of those ads now! :P
            if (config.getItem('HideAds', false)) {
                $j('.UIStandardFrame_SidebarAds').css('display', 'none');
            }

            if (config.getItem('HideAdsIframe', false)) {
                $j("iframe[name*='fb_iframe']").eq(0).parent().css('display', 'none');
                //$j("img[src*='apple_banner_']").parent().parent().css('display', 'none');
                $j("div[style*='tool_top.jpg']").css('display', 'none');
            }

            if (config.getItem('HideFBChat', false)) {
                window.setTimeout(function () {
                    $j("div[class*='fbDockWrapper fbDockWrapperBottom fbDockWrapperRight']").css('display', 'none');
                }, 100);
            }

            // Can create a blank space above the game to host the dashboard if wanted.
            // Dashboard currently uses '185px'
            var shiftDown = gm.getItem('ShiftDown', '', hiddenVar);
            if (shiftDown) {
                $j(caap.controlXY.selector).css('padding-top', shiftDown);
            }

            general.load();
            monster.load();
            guild_monster.load();
            arena.load();
            battle.load();
            caap.LoadDemi();
            caap.LoadRecon();
            town.load('soldiers');
            town.load('item');
            town.load('magic');
            spreadsheet.load();
            caap.AddControl();
            caap.AddColorWheels();
            caap.AddDashboard();
            caap.AddListeners();
            caap.AddDBListener();
            caap.CheckResults();
            caap.AutoStatCheck();
            army.init();
            caap.bestLand = new caap.landRecord().data;
            caap.sellLand = {};
            //schedule.deleteItem("army_member");
            //schedule.deleteItem("ArenaReview")

            return true;
        } catch (err) {
            $u.error("ERROR in init: " + err);
            return false;
        }
    },

    /////////////////////////////////////////////////////////////////////
    //                          NAVIGATION FUNCTIONS
    /////////////////////////////////////////////////////////////////////

    waitTime: 5000,

    VisitUrl: function (url, loadWaitTime) {
        try {
            if (!url) {
                throw 'No url passed to VisitUrl';
            }

            caap.waitMilliSecs = loadWaitTime ? loadWaitTime : caap.waitTime;
            if (state.getItem('clickUrl', '').indexOf(url) < 0) {
                state.setItem('clickUrl', url);
            }

            if (caap.waitingForDomLoad === false) {
                schedule.setItem('clickedOnSomething', 0);
                caap.waitingForDomLoad = true;
            }

            window.location.href = url;
            return true;
        } catch (err) {
            $u.error("ERROR in caap.VisitUrl: " + err);
            return false;
        }
    },

    Click: function (obj, loadWaitTime) {
        try {
            if (!obj) {
                throw 'Null object passed to Click';
            }

            if (caap.waitingForDomLoad === false) {
                schedule.setItem('clickedOnSomething', 0);
                caap.waitingForDomLoad = true;
            }

            caap.waitMilliSecs = loadWaitTime ? loadWaitTime : caap.waitTime;
            var evt = document.createEvent("MouseEvents");
            evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
            /*
            Return Value: boolean
            The return value of dispatchEvent indicates whether any of the listeners
            which handled the event called preventDefault. If preventDefault was called
            the value is false, else the value is true.
            */
            return !obj.dispatchEvent(evt);
        } catch (err) {
            $u.error("ERROR in caap.Click: " + err);
            return undefined;
        }
    },

    ClickAjaxLinkSend: function (link, loadWaitTime) {
        try {
            if (!link) {
                throw 'No link passed to ClickAjaxLinkSend';
            }

            caap.waitMilliSecs = loadWaitTime ? loadWaitTime : caap.waitTime;
            if (state.getItem('clickUrl', '').indexOf(link) < 0) {
                state.setItem('clickUrl', 'http://apps.facebook.com/castle_age/' + link);
            }

            if (caap.waitingForDomLoad === false) {
                schedule.setItem('clickedOnSomething', 0);
                caap.waitingForDomLoad = true;
            }

            var jss = "javascript";
            window.location.href = jss + ":void(a46755028429_ajaxLinkSend('globalContainer', '" + link + "'))";
            return true;
        } catch (err) {
            $u.error("ERROR in caap.ClickAjaxLinkSend: " + err);
            return false;
        }
    },

    ClickGetCachedAjax: function (link, loadWaitTime) {
        try {
            if (!link) {
                throw 'No link passed to ClickGetCachedAjax';
            }

            caap.waitMilliSecs = loadWaitTime ? loadWaitTime : caap.waitTime;
            if (state.getItem('clickUrl', '').indexOf(link) < 0) {
                state.setItem('clickUrl', 'http://apps.facebook.com/castle_age/' + link);
            }

            if (caap.waitingForDomLoad === false) {
                schedule.setItem('clickedOnSomething', 0);
                caap.waitingForDomLoad = true;
            }

            var jss = "javascript";
            window.location.href = jss + ":void(a46755028429_get_cached_ajax('" + link + "', 'get_body'))";
            return true;
        } catch (err) {
            $u.error("ERROR in caap.ClickGetCachedAjax: " + err);
            return false;
        }
    },

    NavigateTo: function (pathToPage, imageOnPage) {
        try {
            var content   = $j(),
                pathList  = [],
                s         = 0,
                a         = $j(),
                imageTest = '',
                img       = null;

            content = $j("#content");
            if (!content || !content.length) {
                $u.warn('No content to Navigate to', imageOnPage, pathToPage);
                return false;
            }

            if (imageOnPage) {
                if (caap.CheckForImage(imageOnPage)) {
                    return false;
                }
            }

            pathList = pathToPage.split(",");
            for (s = pathList.length - 1; s >= 0; s -= 1) {
                a = content.find("a[href*='/" + pathList[s] + ".php']").not("a[href*='" + pathList[s] + ".php?']");
                if (a && a.length) {
                    $u.log(2, 'Go to', pathList[s]);
                    caap.Click(a.get(0));
                    return true;
                }

                imageTest = pathList[s];
                if (imageTest.indexOf(".") === -1) {
                    imageTest = imageTest + '.';
                }

                img = caap.CheckForImage(imageTest);
                if (img) {
                    $u.log(3, 'Click on image', img.src.match(/[\w.]+$/));
                    caap.Click(img);
                    return true;
                }
            }

            $u.warn('Unable to Navigate to', imageOnPage, pathToPage);
            return false;
        } catch (err) {
            $u.error("ERROR in caap.NavigateTo: " + err, imageOnPage, pathToPage);
            return undefined;
        }
    },

    CheckForImage: function (image, webSlice, subDocument, nodeNum) {
        try {
            var imageSlice = $j(),
                jSlice     = $j();

            if (!webSlice) {
                webSlice = subDocument ? subDocument.body : window.document.body;
            }

            if (!nodeNum || typeof nodeNum !== 'number') {
                nodeNum = 0;
            }

            jSlice = webSlice.jquery ? webSlice : $j(webSlice);
            imageSlice = jSlice.find("input[src*='" + image + "'],img[src*='" + image + "'],div[style*='" + image + "']").eq(nodeNum);
            return (imageSlice.length ? imageSlice.get(0) : null);
        } catch (err) {
            $u.error("ERROR in caap.CheckForImage: " + err);
            return undefined;
        }
    },

    /////////////////////////////////////////////////////////////////////
    //                          DISPLAY FUNCTIONS
    // these functions set up the control applet and allow it to be changed
    /////////////////////////////////////////////////////////////////////

    chatLink: function (slice, query) {
        try {
            var hr = new RegExp('.*(http:.*)'),
                qr = /"/g,
                c  = $j();

            c = slice.find(query);
            if (c && c.length) {
                c.each(function () {
                    var e = $j(this),
                        h = '',
                        a = [];

                    h = e.html();
                    h = h ? h.trim() : '';
                    if (h) {
                        a = h.split("<br>");
                        if (a && a.length === 2) {
                            a = a[1].replace(qr, '').match(hr);
                            if (a && a.length === 2 && a[1]) {
                                a = a[1].split(" ");
                                if (a && a.length) {
                                    e.html(h.replace(a[0], "<a href='" + a[0] + "'>" + a[0] + "</a>"));
                                }
                            }
                        }
                    }
                });
            }

            return true;
        } catch (err) {
            $u.error("ERROR in caap.chatLink: " + err);
            return false;
        }
    },

    MakeDropDown: function (idName, dropDownList, instructions, formatParms, defaultValue) {
        try {
            var selectedItem = config.getItem(idName, 'defaultValue'),
                htmlCode     = '',
                item         = 0,
                len          = 0;

            if (selectedItem === 'defaultValue') {
                if (defaultValue) {
                    selectedItem = config.setItem(idName, defaultValue);
                } else {
                    selectedItem = config.setItem(idName, dropDownList[0]);
                }
            }

            len = dropDownList.length;
            for (item = 0; item < len; item += 1) {
                if (selectedItem === dropDownList[item]) {
                    break;
                }
            }

            htmlCode = "<select id='caap_" + idName + "' " + (instructions[item] ? " title='" + instructions[item] + "' " : '') + formatParms + ">";
            htmlCode += "<option disabled='disabled' value='not selected'>Choose one</option>";
            for (item = 0; item < len; item += 1) {
                if (instructions) {
                    htmlCode += "<option value='" + dropDownList[item] +
                        "'" + ((selectedItem === dropDownList[item]) ? " selected='selected'" : '') +
                        ((instructions[item]) ? " title='" + instructions[item] + "'" : '') + ">" +
                        dropDownList[item] + "</option>";
                } else {
                    htmlCode += "<option value='" + dropDownList[item] +
                        "'" + ((selectedItem === dropDownList[item]) ? " selected='selected'" : '') + ">" +
                        dropDownList[item] + "</option>";
                }
            }

            htmlCode += '</select>';
            return htmlCode;
        } catch (err) {
            $u.error("ERROR in MakeDropDown: " + err);
            return '';
        }
    },

    MakeCheckBox: function (idName, defaultValue, varClass, instructions, tableTF) {
        try {
            var checkItem = config.getItem(idName, 'defaultValue'),
                htmlCode  = '';

            if (checkItem === 'defaultValue') {
                config.setItem(idName, defaultValue);
            }

            htmlCode = "<input type='checkbox' id='caap_" + idName + "' title=" + '"' + instructions + '"' + ((varClass) ? " class='" + varClass + "'" : '') + (config.getItem(idName) ? 'checked' : '') + ' />';
            if (varClass) {
                if (tableTF) {
                    htmlCode += "</td></tr></table>";
                } else {
                    htmlCode += '<br />';
                }

                htmlCode += "<div id='caap_" + varClass + "' style='display: " + (config.getItem(idName, false) ? 'block' : 'none') + "'>";
            }

            return htmlCode;
        } catch (err) {
            $u.error("ERROR in MakeCheckBox: " + err);
            return '';
        }
    },

    MakeNumberForm: function (idName, instructions, initDefault, formatParms, subtype) {
        try {
            if (!subtype) {
                subtype = 'number';
            }

            if (subtype === 'number' && isNaN(initDefault) && initDefault !== '') {
                $u.warn("MakeNumberForm - default value is not a number!", idName, initDefault);
            }

            if (!initDefault) {
                initDefault = '';
            }

            if (config.getItem(idName, 'defaultValue') === 'defaultValue') {
                config.setItem(idName, initDefault);
            }

            if (!formatParms) {
                formatParms = "size='4'";
            }

            return ("<input type='text' data-subtype='" + subtype + "' id='caap_" + idName + "' " + formatParms + " title=" + '"' + instructions + '" ' + "value='" + config.getItem(idName) + "' />");
        } catch (err) {
            $u.error("ERROR in MakeNumberForm: " + err);
            return '';
        }
    },

    MakeCheckTR: function (text, idName, defaultValue, varClass, instructions, tableTF) {
        try {
            var htmlCode = "<tr><td style='width: 90%'>" + text +
                "</td><td style='width: 10%; text-align: right'>" +
                caap.MakeCheckBox(idName, defaultValue, varClass, instructions, tableTF);

            if (!tableTF) {
                htmlCode += "</td></tr>";
            }

            return htmlCode;
        } catch (err) {
            $u.error("ERROR in MakeCheckTR: " + err);
            return '';
        }
    },

    ToggleControl: function (controlId, staticText) {
        try {
            var currentDisplay = state.getItem('Control_' + controlId, "none"),
                displayChar    = "-",
                toggleCode     = '';

            if (currentDisplay === "none") {
                displayChar = "+";
            }

            toggleCode = '<a style="font-weight: bold;" id="caap_Switch_' + controlId +
                '" href="javascript:;" style="text-decoration: none;"> ' +
                displayChar + ' ' + staticText + '</a><br />' +
                "<div id='caap_" + controlId + "' style='display: " + currentDisplay + "'>";

            return toggleCode;
        } catch (err) {
            $u.error("ERROR in ToggleControl: " + err);
            return '';
        }
    },

    MakeTextBox: function (idName, instructions, initDefault, formatParms) {
        try {
            if (!initDefault) {
                initDefault = '';
            }

            if (config.getItem(idName, 'defaultValue') === 'defaultValue') {
                config.setItem(idName, initDefault);
            }

            if (formatParms === '') {
                if ($u.is_chrome) {
                    formatParms = " rows='3' cols='25'";
                } else {
                    formatParms = " rows='3' cols='21'";
                }
            }

            return ("<textarea title=" + '"' + instructions + '"' + " type='text' id='caap_" + idName + "' " + formatParms + ">" + config.getItem(idName) + "</textarea>");
        } catch (err) {
            $u.error("ERROR in MakeTextBox: " + err);
            return '';
        }
    },

    /* This section is formatted to allow Advanced Optimisation by the Closure Compiler */
    /*jslint sub: true */
    SetDivContent: function (idName, mess) {
        try {
            if (config.getItem('SetTitle', false) && config.getItem('SetTitleAction', false) && idName === "activity_mess") {
                var DocumentTitle = mess.replace("Activity: ", '') + " - ";

                if (config.getItem('SetTitleName', false)) {
                    DocumentTitle += caap.stats['PlayerName'] + " - ";
                }

                document.title = DocumentTitle + caap.documentTitle;
            }

            caap.caapDivObject.find('#caap_' + idName).html(mess);
        } catch (err) {
            $u.error("ERROR in SetDivContent: " + err);
        }
    },
    /*jslint sub: false */

    landQuestList: [
        'Land of Fire',
        'Land of Earth',
        'Land of Mist',
        'Land of Water',
        'Demon Realm',
        'Undead Realm',
        'Underworld',
        'Kingdom of Heaven',
        'Ivory City',
        'Earth II',
        'Water II'
    ],

    demiQuestList: [
        'Ambrosia',
        'Malekus',
        'Corvintheus',
        'Aurora',
        'Azeron'
    ],

    atlantisQuestList: [
        'Atlantis'
    ],

    SelectDropOption: function (idName, value) {
        try {
            caap.caapDivObject.find("#caap_" + idName + " option").removeAttr('selected');
            caap.caapDivObject.find("#caap_" + idName + " option[value='" + value + "']").attr('selected', 'selected');
            return true;
        } catch (err) {
            $u.error("ERROR in SelectDropOption: " + err);
            return false;
        }
    },

    autoQuest: function () {
        this.data = {
            'name'     : '',
            'energy'   : 0,
            'general'  : 'none',
            'expRatio' : 0
        };
    },

    newAutoQuest: function () {
        return (new caap.autoQuest()).data;
    },

    updateAutoQuest: function (id, value) {
        try {
            var temp = state.getItem('AutoQuest', caap.newAutoQuest());

            if (typeof id !== 'string' || id === '') {
                throw "No valid id supplied!";
            }

            if (value === undefined || value === null) {
                throw "No value supplied!";
            }

            temp[id] = value;
            state.setItem('AutoQuest', temp);
            return true;
        } catch (err) {
            $u.error("ERROR in updateAutoQuest: " + err);
            return false;
        }
    },

    /* This section is formatted to allow Advanced Optimisation by the Closure Compiler */
    /*jslint sub: true */
    ShowAutoQuest: function () {
        try {
            caap.caapDivObject.find("#stopAutoQuest").text("Stop auto quest: " + state.getItem('AutoQuest', caap.newAutoQuest())['name'] + " (energy: " + state.getItem('AutoQuest', caap.newAutoQuest())['energy'] + ")");
            caap.caapDivObject.find("#stopAutoQuest").css('display', 'block');
            return true;
        } catch (err) {
            $u.error("ERROR in ShowAutoQuest: " + err);
            return false;
        }
    },
    /*jslint sub: false */

    ClearAutoQuest: function () {
        try {
            caap.caapDivObject.find("#stopAutoQuest").text("");
            caap.caapDivObject.find("#stopAutoQuest").css('display', 'none');
            return true;
        } catch (err) {
            $u.error("ERROR in ClearAutoQuest: " + err);
            return false;
        }
    },

    ManualAutoQuest: function (AutoQuest) {
        try {
            if (!AutoQuest) {
                AutoQuest = caap.newAutoQuest();
            }

            state.setItem('AutoQuest', AutoQuest);
            config.setItem('WhyQuest', 'Manual');
            caap.SelectDropOption('WhyQuest', 'Manual');
            caap.ClearAutoQuest();
            $u.log(5, "ManualAutoQuest", state.getItem('AutoQuest'));
            return true;
        } catch (err) {
            $u.error("ERROR in ManualAutoQuest: " + err);
            return false;
        }
    },

    ChangeDropDownList: function (idName, dropList, option) {
        try {
            caap.caapDivObject.find("#caap_" + idName + " option").remove();
            caap.caapDivObject.find("#caap_" + idName).append("<option disabled='disabled' value='not selected'>Choose one</option>");
            for (var item = 0; item < dropList.length; item += 1) {
                if (item === 0 && !option) {
                    config.setItem(idName, dropList[item]);
                    $u.log(1, "Saved: " + idName + "  Value: " + dropList[item]);
                }

                caap.caapDivObject.find("#caap_" + idName).append("<option value='" + dropList[item] + "'>" + dropList[item] + "</option>");
            }

            if (option) {
                caap.caapDivObject.find("#caap_" + idName + " option[value='" + option + "']").attr('selected', 'selected');
            } else {
                caap.caapDivObject.find("#caap_" + idName + " option:eq(1)").attr('selected', 'selected');
            }

            return true;
        } catch (err) {
            $u.error("ERROR in ChangeDropDownList: " + err);
            return false;
        }
    },

    controlXY: {
        selector : '.UIStandardFrame_Content',
        x        : 0,
        y        : 0
    },

    GetControlXY: function (reset) {
        try {
            var newTop  = 0,
                newLeft = 0;

            if (reset) {
                newTop = $j(caap.controlXY.selector).offset().top;
            } else {
                newTop = caap.controlXY.y;
            }

            if (caap.controlXY.x === '' || reset) {
                newLeft = $j(caap.controlXY.selector).offset().left + $j(caap.controlXY.selector).width() + 10;
            } else {
                newLeft = $j(caap.controlXY.selector).offset().left + caap.controlXY.x;
            }

            return {x: newLeft, y: newTop};
        } catch (err) {
            $u.error("ERROR in GetControlXY: " + err);
            return {x: 0, y: 0};
        }
    },

    SaveControlXY: function () {
        try {
            var refOffset = $j(caap.controlXY.selector).offset();
            state.setItem('caap_div_menuTop', caap.caapDivObject.offset().top);
            state.setItem('caap_div_menuLeft', caap.caapDivObject.offset().left - refOffset.left);
            state.setItem('caap_top_zIndex', '1');
            state.setItem('caap_div_zIndex', '2');
        } catch (err) {
            $u.error("ERROR in SaveControlXY: " + err);
        }
    },

    dashboardXY: {
        selector : '#app46755028429_app_body_container',
        x        : 0,
        y        : 0
    },

    GetDashboardXY: function (reset) {
        try {
            var newTop  = 0,
                newLeft = 0;

            if (reset) {
                newTop = $j(caap.dashboardXY.selector).offset().top - 10;
            } else {
                newTop = caap.dashboardXY.y;
            }

            if (caap.dashboardXY.x === '' || reset) {
                newLeft = $j(caap.dashboardXY.selector).offset().left;
            } else {
                newLeft = $j(caap.dashboardXY.selector).offset().left + caap.dashboardXY.x;
            }

            return {x: newLeft, y: newTop};
        } catch (err) {
            $u.error("ERROR in GetDashboardXY: " + err);
            return {x: 0, y: 0};
        }
    },

    SaveDashboardXY: function () {
        try {
            var refOffset = $j(caap.dashboardXY.selector).offset();
            state.setItem('caap_top_menuTop', caap.caapTopObject.offset().top);
            state.setItem('caap_top_menuLeft', caap.caapTopObject.offset().left - refOffset.left);
            state.setItem('caap_div_zIndex', '1');
            state.setItem('caap_top_zIndex', '2');
        } catch (err) {
            $u.error("ERROR in SaveDashboardXY: " + err);
        }
    },

    AddControl: function () {
        try {
            var caapDiv = "<div id='caap_div'>",
                divID = 0,
                styleXY = {
                    x: 0,
                    y: 0
                },
                htmlCode = '',
                banner = '',
                divList = [
                    'banner',
                    'activity_mess',
                    'idle_mess',
                    'quest_mess',
                    'battle_mess',
                    'monster_mess',
                    'guild_monster_mess',
                    'arena_mess',
                    'fortify_mess',
                    'heal_mess',
                    'demipoint_mess',
                    'demibless_mess',
                    'level_mess',
                    'exp_mess',
                    'debug1_mess',
                    'debug2_mess',
                    'control'
                ];

            for (divID = 0; divID < divList.length; divID += 1) {
                caapDiv += "<div id='caap_" + divList[divID] + "'></div>";
            }

            //caapDiv += '<applet code="http://castle-age-auto-player.googlecode.com/files/localfile.class" archive="http://castle-age-auto-player.googlecode.com/files/localfile.jar" width="10" height="10"></applet>';

            caapDiv += "</div>";
            caap.controlXY.x = state.getItem('caap_div_menuLeft', '');
            caap.controlXY.y = state.getItem('caap_div_menuTop', $j(caap.controlXY.selector).offset().top);
            styleXY = caap.GetControlXY();
            $j(caapDiv).css({
                width                   : '180px',
                background              : config.getItem('StyleBackgroundLight', '#E0C691'),
                opacity                 : config.getItem('StyleOpacityLight', 1),
                color                   : '#000',
                padding                 : "4px",
                border                  : "2px solid #444",
                top                     : styleXY.y + 'px',
                left                    : styleXY.x + 'px',
                zIndex                  : state.getItem('caap_div_zIndex', '2'),
                position                : 'absolute',
                'border-radius'         : '5px'
            }).appendTo(document.body);

            caap.caapDivObject = $j("#caap_div");

            banner += "<div id='caap_BannerHide' style='display: " + (config.getItem('BannerDisplay', true) ? 'block' : 'none') + "'>";
            banner += "<img src='data:image/png;base64," + image64.header + "' alt='Castle Age Auto Player' /><br /><hr /></div>";
            caap.SetDivContent('banner', banner);

            htmlCode += caap.AddPauseMenu();
            htmlCode += caap.AddDisableMenu();
            htmlCode += caap.AddCashHealthMenu();
            htmlCode += caap.AddQuestMenu();
            htmlCode += caap.AddBattleMenu();
            htmlCode += caap.AddMonsterMenu();
            htmlCode += caap.AddGuildMonstersMenu();
            htmlCode += caap.AddArenaMenu();
            htmlCode += caap.AddReconMenu();
            htmlCode += caap.AddGeneralsMenu();
            htmlCode += caap.AddSkillPointsMenu();
            htmlCode += caap.AddEliteGuardOptionsMenu();
            htmlCode += caap.AddGiftingOptionsMenu();
            htmlCode += caap.AddAutoOptionsMenu();
            htmlCode += caap.AddOtherOptionsMenu();
            htmlCode += caap.AddFooterMenu();
            caap.SetDivContent('control', htmlCode);

            caap.CheckLastAction(state.getItem('LastAction', 'Idle'));
            $j("#caap_resetElite").button();
            $j("#caap_StartedColourSelect").button();
            $j("#caap_StopedColourSelect").button();
            $j("#caap_FillArmy").button();
            $j("#caap_ResetMenuLocation").button();
            return true;
        } catch (err) {
            $u.error("ERROR in AddControl: " + err);
            return false;
        }
    },

    AddPauseMenu: function () {
        try {
            return ("<div id='caapPaused' style='font-weight: bold; display: " + state.getItem('caapPause', 'block') + "'>Paused on mouse click.<br /><a href='javascript:;' id='caapRestart' >Click here to restart</a></div><hr />");
        } catch (err) {
            $u.error("ERROR in AddPauseMenu: " + err);
            return ("<div id='caapPaused' style='font-weight: bold; display: block'>Paused on mouse click.<br /><a href='javascript:;' id='caapRestart' >Click here to restart</a></div><hr />");
        }
    },

    AddDisableMenu: function () {
        try {
            var autoRunInstructions = "Disable auto running of CAAP. Stays persistent even on page reload and the autoplayer will not autoplay.",
                htmlCode = '';

            htmlCode += "<table width='180px' cellpadding='0px' cellspacing='0px'>";
            htmlCode += caap.MakeCheckTR("Disable Autoplayer", 'Disabled', false, '', autoRunInstructions) + '</table><hr />';
            return htmlCode;
        } catch (err) {
            $u.error("ERROR in AddDisableMenu: " + err);
            return '';
        }
    },

    AddCashHealthMenu: function () {
        try {
            var bankInstructions0 = "Minimum cash to keep in the bank. Press tab to save",
                bankInstructions1 = "Minimum cash to have on hand, press tab to save",
                bankInstructions2 = "Maximum cash to have on hand, bank anything above this, press tab to save (leave blank to disable).",
                healthInstructions = "Minimum health to have before healing, press tab to save (leave blank to disable).",
                healthStamInstructions = "Minimum Stamina to have before healing, press tab to save (leave blank to disable).",
                bankImmedInstructions = "Bank as soon as possible. May interrupt player and monster battles.",
                autobuyInstructions = "Automatically buy lands in groups of 10 based on best Return On Investment value.",
                autosellInstructions = "Automatically sell off any excess lands above your level allowance.",
                htmlCode = '';

            htmlCode += caap.ToggleControl('CashandHealth', 'CASH and HEALTH');
            htmlCode += "<table width='180px' cellpadding='0px' cellspacing='0px'>";
            htmlCode += caap.MakeCheckTR("Bank Immediately", 'BankImmed', false, '', bankImmedInstructions);
            htmlCode += caap.MakeCheckTR("Auto Buy Lands", 'autoBuyLand', false, '', autobuyInstructions);
            htmlCode += caap.MakeCheckTR("Auto Sell Excess Lands", 'SellLands', false, '', autosellInstructions) + '</table>';
            htmlCode += "<table width='180px' cellpadding='0px' cellspacing='0px'>";
            htmlCode += "<tr><td>Keep In Bank</td><td style='text-align: right'>$" + caap.MakeNumberForm('minInStore', bankInstructions0, 100000, "size='12' style='font-size: 10px; text-align: right'") + "</td></tr></table>";
            htmlCode += "<table width='180px' cellpadding='0px' cellspacing='0px'>";
            htmlCode += "<tr><td>Bank Above</td><td style='text-align: right'>$" + caap.MakeNumberForm('MaxInCash', bankInstructions2, '', "size='7' style='font-size: 10px; text-align: right'") + "</td></tr>";
            htmlCode += "<tr><td style='padding-left: 10px'>But Keep On Hand</td><td style='text-align: right'>$" +
                caap.MakeNumberForm('MinInCash', bankInstructions1, '', "size='7' style='font-size: 10px; text-align: right'") + "</td></tr></table>";
            htmlCode += "<table width='180px' cellpadding='0px' cellspacing='0px'>";
            htmlCode += "<tr><td>Heal If Health Below</td><td style='text-align: right'>" + caap.MakeNumberForm('MinToHeal', healthInstructions, '', "size='2' style='font-size: 10px; text-align: right'") + "</td></tr>";
            htmlCode += "<tr><td style='padding-left: 10px'>But Not If Stamina Below</td><td style='text-align: right'>" +
                caap.MakeNumberForm('MinStamToHeal', healthStamInstructions, '', "size='2' style='font-size: 10px; text-align: right'") + '</td></tr></table>';
            htmlCode += "<hr/></div>";
            return htmlCode;
        } catch (err) {
            $u.error("ERROR in AddCashHealthMenu: " + err);
            return '';
        }
    },

    /* This section is formatted to allow Advanced Optimisation by the Closure Compiler */
    /*jslint sub: true */
    AddQuestMenu: function () {
        try {
            var forceSubGen = "Always do a quest with the Subquest General you selected under the Generals section. NOTE: This will keep the script from automatically switching to the required general for experience of primary quests.",
                XQuestInstructions = "Start questing when energy is at or above this value.",
                XMinQuestInstructions = "Stop quest when energy is at or below this value.",
                questForList = [
                    'Advancement',
                    'Max Influence',
                    'Max Gold',
                    'Max Experience',
                    'Manual'
                ],
                questForListInstructions = [
                    'Advancement performs all the main quests in a sub quest area but not the secondary quests.',
                    'Max Influence performs all the main and secondary quests in a sub quest area.',
                    'Max Gold performs the quest in the specific area that yields the highest gold.',
                    'Max Experience performs the quest in the specific area that yields the highest experience.',
                    'Manual performs the specific quest that you have chosen.'
                ],
                questAreaList = [
                    'Quest',
                    'Demi Quests',
                    'Atlantis'
                ],
                questWhenList = [
                    'Energy Available',
                    'At Max Energy',
                    'At X Energy',
                    'Not Fortifying',
                    'Never'
                ],
                questWhenInst = [
                    'Energy Available - will quest whenever you have enough energy.',
                    'At Max Energy - will quest when energy is at max and will burn down all energy when able to level up.',
                    'At X Energy - allows you to set maximum and minimum energy values to start and stop questing. Will burn down all energy when able to level up.',
                    'Not Fortifying - will quest only when your fortify settings are matched.',
                    'Never - disables questing.'
                ],
                stopInstructions = "This will stop and remove the chosen quest and set questing to manual.",
                autoQuestName = state.getItem('AutoQuest', caap.newAutoQuest())['name'],
                htmlCode = '';

            htmlCode += caap.ToggleControl('Quests', 'QUEST');
            htmlCode += "<table width='180px' cellpadding='0px' cellspacing='0px'>";
            htmlCode += "<tr><td width=80>Quest When</td><td style='text-align: right; width: 60%'>" + caap.MakeDropDown('WhenQuest', questWhenList, questWhenInst, "style='font-size: 10px; width: 100%'", 'Never') + '</td></tr></table>';
            htmlCode += "<div id='caap_WhenQuestHide' style='display: " + (config.getItem('WhenQuest', 'Never') !== 'Never' ? 'block' : 'none') + "'>";
            htmlCode += "<div id='caap_WhenQuestXEnergy' style='display: " + (config.getItem('WhenQuest', 'Never') !== 'At X Energy' ? 'none' : 'block') + "'>";
            htmlCode += "<table width='180px' cellpadding='0px' cellspacing='0px'>";
            htmlCode += "<tr><td>Start At Or Above Energy</td><td style='text-align: right'>" + caap.MakeNumberForm('XQuestEnergy', XQuestInstructions, 1, "size='3' style='font-size: 10px; text-align: right'") + '</td></tr>';
            htmlCode += "<tr><td style='padding-left: 10px'>Stop At Or Below Energy</td><td style='text-align: right'>" +
                caap.MakeNumberForm('XMinQuestEnergy', XMinQuestInstructions, 0, "size='3' style='font-size: 10px; text-align: right'") + '</td></tr></table>';
            htmlCode += "</div>";
            htmlCode += "<table width='180px' cellpadding='0px' cellspacing='0px'>";
            htmlCode += "<tr><td>Quest Area</td><td style='text-align: right; width: 60%'>" + caap.MakeDropDown('QuestArea', questAreaList, '', "style='font-size: 10px; width: 100%'") + '</td></tr>';
            htmlCode += "<tr id='trQuestSubArea' style='display: table-row'><td>&nbsp;&nbsp;&nbsp;Sub Area</td><td style='text-align: right; width: 60%'>";
            switch (config.getItem('QuestArea', questAreaList[0])) {
            case 'Quest' :
                htmlCode += caap.MakeDropDown('QuestSubArea', caap.landQuestList, '', "style='font-size: 10px; width: 100%'");
                break;
            case 'Demi Quests' :
                htmlCode += caap.MakeDropDown('QuestSubArea', caap.demiQuestList, '', "style='font-size: 10px; width: 100%'");
                break;
            default :
                htmlCode += caap.MakeDropDown('QuestSubArea', caap.atlantisQuestList, '', "style='font-size: 10px; width: 100%'");
                break;
            }

            htmlCode += '</td></tr>';
            htmlCode += "<tr><td>Quest For</td><td style='text-align: right; width: 60%'>" + caap.MakeDropDown('WhyQuest', questForList, questForListInstructions, "style='font-size: 10px; width: 100%'") + '</td></tr></table>';
            htmlCode += "<table width='180px' cellpadding='0px' cellspacing='0px'>";
            htmlCode += caap.MakeCheckTR("Switch Quest Area", 'switchQuestArea', true, '', 'Allows switching quest area after Advancement or Max Influence');
            htmlCode += caap.MakeCheckTR("Use Only Subquest General", 'ForceSubGeneral', false, '', forceSubGen);
            htmlCode += caap.MakeCheckTR("Quest For Orbs", 'GetOrbs', false, '', 'Perform the Boss quest in the selected land for orbs you do not have.') + "</table>";
            htmlCode += "</div>";
            if (autoQuestName) {
                htmlCode += "<a id='stopAutoQuest' style='display: block' href='javascript:;' title='" + stopInstructions + "'>Stop auto quest: " + autoQuestName +
                            " (energy: " + state.getItem('AutoQuest', caap.newAutoQuest())['energy'] + ")" + "</a>";
            } else {
                htmlCode += "<a id='stopAutoQuest' style='display: none' href='javascript:;' title='" + stopInstructions + "'></a>";
            }

            htmlCode += "<hr/></div>";
            return htmlCode;
        } catch (err) {
            $u.error("ERROR in AddQuestMenu: " + err);
            return '';
        }
    },
    /*jslint sub: false */

    AddBattleMenu: function () {
        try {
            var XBattleInstructions = "Start battling if stamina is above this points",
                XMinBattleInstructions = "Don't battle if stamina is below this points",
                safeHealthInstructions = "Wait until health is 13 instead of 10, prevents you killing yourself but leaves you unhidden for upto 15 minutes",
                userIdInstructions = "User IDs(not user name).  Click with the " +
                    "right mouse button on the link to the users profile & copy link." +
                    "  Then paste it here and remove everything but the last numbers." +
                    " (ie. 123456789)",
                chainBPInstructions = "Number of battle points won to initiate a chain attack. Specify 0 to always chain attack.",
                chainGoldInstructions = "Amount of gold won to initiate a chain attack. Specify 0 to always chain attack.",
                maxChainsInstructions = "Maximum number of chain hits after the initial attack.",
                FMRankInstructions = "The lowest relative rank below yours that " +
                    "you are willing to spend your stamina on. Leave blank to attack " +
                    "any rank.",
                FMARBaseInstructions = "This value sets the base for your army " +
                    "ratio calculation. It is basically a multiplier for the army " +
                    "size of a player at your equal level. A value of 1 means you " +
                    "will battle an opponent the same level as you with an army the " +
                    "same size as you or less. Default .5",
                plusonekillsInstructions = "Force +1 kill scenario if 80% or more" +
                    " of targets are withn freshmeat settings. Note: Since Castle Age" +
                    " choses the target, selecting this option could result in a " +
                    "greater chance of loss.",
                raidOrderInstructions = "List of search words that decide which " +
                    "raids to participate in first.  Use words in player name or in " +
                    "raid name. To specify max damage follow keyword with :max token " +
                    "and specifiy max damage values. Use 'k' and 'm' suffixes for " +
                    "thousand and million.",
                ignorebattlelossInstructions = "Ignore battle losses and attack " +
                    "regardless.  This will also delete all battle loss records.",
                battleList = [
                    'Stamina Available',
                    'At Max Stamina',
                    'At X Stamina',
                    'No Monster',
                    'Stay Hidden',
                    'Demi Points Only',
                    'Never'
                ],
                battleInst = [
                    'Stamina Available will battle whenever you have enough stamina',
                    'At Max Stamina will battle when stamina is at max and will burn down all stamina when able to level up',
                    'At X Stamina you can set maximum and minimum stamina to battle',
                    'No Monster will battle only when there are no active monster battles or if Get Demi Points First has been selected.',
                    'Stay Hidden uses stamina to try to keep you under 10 health so you cannot be attacked, while also attempting to maximize your stamina use for Monster attacks. YOU MUST SET MONSTER TO "STAY HIDDEN" TO USE THIS FEATURE.',
                    'Demi Points Only will battle only when Daily Demi Points are required, can use in conjunction with Get Demi Points First.',
                    'Never - disables player battles'
                ],
                typeList = [
                    'Invade',
                    'Duel',
                    'War'
                ],
                typeInst = [
                    'Battle using Invade button',
                    'Battle using Duel button - no guarentee you will win though',
                    'War using Duel button - no guarentee you will win though'
                ],
                targetList = [
                    'Freshmeat',
                    'Userid List',
                    'Raid'
                ],
                targetInst = [
                    'Use settings to select a target from the Battle Page',
                    'Select target from the supplied list of userids',
                    'Raid Battles'
                ],
                dosiegeInstructions = "(EXPERIMENTAL) Turns on or off automatic siege assist for all raids only.",
                collectRewardInstructions = "(EXPERIMENTAL) Automatically collect raid rewards.",
                observeDemiFirstInstructions = "If you are setting Get demi Points First and No Attack If % Under in Monster then enabling this option " +
                    "will cause Demi Points Only to observe the Demi Points requested in the case where No Attack If % Under is triggered.",
                htmlCode = '';

            htmlCode += caap.ToggleControl('Battling', 'BATTLE');
            htmlCode += "<table width='180px' cellpadding='0px' cellspacing='0px'>";
            htmlCode += "<tr><td>Battle When</td><td style='text-align: right; width: 65%'>" + caap.MakeDropDown('WhenBattle', battleList, battleInst, "style='font-size: 10px; width: 100%'", 'Never') + '</td></tr></table>';
            htmlCode += "<div id='caap_WhenBattleStayHidden1' style='color: red; font-weight: bold; display: " +
                (config.getItem('WhenBattle', 'Never') === 'Stay Hidden' && config.getItem('WhenMonster', 'Never') !== 'Stay Hidden' ? 'block' : 'none') + "'>Warning: Monster Not Set To 'Stay Hidden'";
            htmlCode += "</div>";
            htmlCode += "<div id='caap_WhenBattleXStamina' style='display: " + (config.getItem('WhenBattle', 'Never') !== 'At X Stamina' ? 'none' : 'block') + "'>";
            htmlCode += "<table width='180px' cellpadding='0px' cellspacing='0px'>";
            htmlCode += "<tr><td>Start Battles When Stamina</td><td style='text-align: right'>" + caap.MakeNumberForm('XBattleStamina', XBattleInstructions, 1, "size='2' style='font-size: 10px; text-align: right'") + '</td></tr>';
            htmlCode += "<tr><td style='padding-left: 10px'>Keep This Stamina</td><td style='text-align: right'>" +
                caap.MakeNumberForm('XMinBattleStamina', XMinBattleInstructions, 0, "size='2' style='font-size: 10px; text-align: right'") + '</td></tr></table>';
            htmlCode += "</div>";
            htmlCode += "<div id='caap_WhenBattleDemiOnly' style='display: " + (config.getItem('WhenBattle', 'Never') !== 'Demi Points Only' ? 'none' : 'block') + "'>";
            htmlCode += "<table width='180px' cellpadding='0px' cellspacing='0px'>";
            htmlCode += caap.MakeCheckTR("Observe Get Demi Points First", 'observeDemiFirst', false, '', observeDemiFirstInstructions) + '</table>';
            htmlCode += "</div>";
            htmlCode += "<div id='caap_WhenBattleHide' style='display: " + (config.getItem('WhenBattle', 'Never') !== 'Never' ? 'block' : 'none') + "'>";
            htmlCode += "<table width='180px' cellpadding='0px' cellspacing='0px'>";
            htmlCode += "<tr><td>Battle Type</td><td style='text-align: right; width: 40%'>" + caap.MakeDropDown('BattleType', typeList, typeInst, "style='font-size: 10px; width: 100%'") + '</td></tr></table>';
            htmlCode += "<table width='180px' cellpadding='0px' cellspacing='0px'>";
            htmlCode += caap.MakeCheckTR("Wait For Safe Health", 'waitSafeHealth', false, '', safeHealthInstructions);
            htmlCode += caap.MakeCheckTR("Siege Weapon Assist Raids", 'raidDoSiege', true, '', dosiegeInstructions);
            htmlCode += caap.MakeCheckTR("Collect Raid Rewards", 'raidCollectReward', false, '', collectRewardInstructions);
            htmlCode += caap.MakeCheckTR("Clear Complete Raids", 'clearCompleteRaids', false, '', '');
            htmlCode += caap.MakeCheckTR("Ignore Battle Losses", 'IgnoreBattleLoss', false, '', ignorebattlelossInstructions);
            htmlCode += "<tr><td>Chain:Battle Points Won</td><td style='text-align: right'>" + caap.MakeNumberForm('ChainBP', chainBPInstructions, '', "size='2' style='font-size: 10px; text-align: right'") + '</td></tr>';
            htmlCode += "<tr><td>Chain:Gold Won</td><td style='text-align: right'>" + caap.MakeNumberForm('ChainGold', chainGoldInstructions, '', "size='5' style='font-size: 10px; text-align: right'") + '</td></tr>';
            htmlCode += "<tr><td>Max Chains</td><td style='text-align: right'>" + caap.MakeNumberForm('MaxChains', maxChainsInstructions, 4, "size='2' style='font-size: 10px; text-align: right'") + '</td></tr></table>';
            htmlCode += "<table width='180px' cellpadding='0px' cellspacing='0px'>";
            htmlCode += "<tr><td>Target Type</td><td style='text-align: right; width: 50%'>" + caap.MakeDropDown('TargetType', targetList, targetInst, "style='font-size: 10px; width: 100%'") + '</td></tr></table>';
            htmlCode += "<div id='caap_FreshmeatSub' style='display: " + (config.getItem('TargetType', 'Never') !== 'Userid List' ? 'block' : 'none') + "'>";
            htmlCode += "Attack targets that are:";
            htmlCode += "<table width='180px' cellpadding='0px' cellspacing='0px'>";
            htmlCode += "<tr><td style='padding-left: 10px'>Not Lower Than Rank Minus</td><td style='text-align: right'>" +
                caap.MakeNumberForm('FreshMeatMinRank', FMRankInstructions, '', "size='2' style='font-size: 10px; text-align: right'") + '</td></tr>';
            htmlCode += "<tr><td style='padding-left: 10px'>Not Higher Than X*Army</td><td style='text-align: right'>" +
                caap.MakeNumberForm('FreshMeatARBase', FMARBaseInstructions, 0.5, "size='2' style='font-size: 10px; text-align: right'") + '</td></tr></table>';
            htmlCode += "</div>";
            htmlCode += "<div id='caap_RaidSub' style='display: " + (config.getItem('TargetType', 'Invade') === 'Raid' ? 'block' : 'none') + "'>";
            htmlCode += "<table width='180px' cellpadding='0px' cellspacing='0px'>";
            htmlCode += caap.MakeCheckTR("Attempt +1 Kills", 'PlusOneKills', false, '', plusonekillsInstructions) + '</table>';
            htmlCode += "Join Raids in this order <a href='http://senses.ws/caap/index.php?topic=1502.0' target='_blank' style='color: blue'>(INFO)</a><br />";
            htmlCode += caap.MakeTextBox('orderraid', raidOrderInstructions, '', '');
            htmlCode += "</div>";
            htmlCode += "<div align=right id='caap_UserIdsSub' style='display: " + (config.getItem('TargetType', 'Invade') === 'Userid List' ? 'block' : 'none') + "'>";
            htmlCode += caap.MakeTextBox('BattleTargets', userIdInstructions, '', '');
            htmlCode += "</div>";
            htmlCode += "</div>";
            htmlCode += "<hr/></div>";
            return htmlCode;
        } catch (err) {
            $u.error("ERROR in AddBattleMenu: " + err);
            return '';
        }
    },

    AddMonsterMenu: function () {
        try {
            var XMonsterInstructions = "Start attacking if stamina is above this points",
                XMinMonsterInstructions = "Don't attack if stamina is below this points",
                attackOrderInstructions = "List of search words that decide which monster to attack first. " +
                    "Use words in player name or in monster name. To specify max damage follow keyword with " +
                    ":max token and specifiy max damage values. Use 'k' and 'm' suffixes for thousand and million. " +
                    "To override achievement use the ach: token and specify damage values.",
                fortifyInstructions = "Fortify if ship health is below this % (leave blank to disable)",
                questFortifyInstructions = "Do Quests if ship health is above this % and quest mode is set to Not Fortify (leave blank to disable)",
                stopAttackInstructions = "Don't attack if ship health is below this % (leave blank to disable)",
                monsterachieveInstructions = "Check if monsters have reached achievement damage level first. Switch when achievement met.",
                demiPointsFirstInstructions = "Don't attack monsters until you've gotten all your demi points from battling. Set 'Battle When' to 'No Monster'",
                powerattackInstructions = "Use power attacks. Only do normal attacks if power attack not possible",
                powerattackMaxInstructions = "Use maximum power attacks globally on Skaar, Genesis, Ragnarok, and Bahamut types. Only do normal power attacks if maximum power attack not possible",
                powerfortifyMaxInstructions = "Use maximum power fortify globally. Only do normal fortify attacks if maximum power fortify not possible. " +
                    "Also includes other energy attacks, Strengthen, Deflect and Cripple. NOTE: Setting a high forty% can waste energy and no safety on other types.",
                dosiegeInstructions = "Turns on or off automatic siege assist for all monsters only.",
                useTacticsInstructions = "Use the Tactics attack method, on monsters that support it, instead of the normal attack. You must be level 50 or above.",
                useTacticsThresholdInstructions = "If monster health falls below this percentage then use the regular attack buttons instead of tactics.",
                collectRewardInstructions = "Automatically collect monster rewards.",
                strengthenTo100Instructions = "Don't wait until the character class gets a bonus for strengthening but perform strengthening as soon as the energy is available.",
                mbattleList = [
                    'Stamina Available',
                    'At Max Stamina',
                    'At X Stamina',
                    'Stay Hidden',
                    'Never'
                ],
                mbattleInst = [
                    'Stamina Available will attack whenever you have enough stamina',
                    'At Max Stamina will attack when stamina is at max and will burn down all stamina when able to level up',
                    'At X Stamina you can set maximum and minimum stamina to battle',
                    'Stay Hidden uses stamina to try to keep you under 10 health so you cannot be attacked, while also attempting to maximize your stamina use for Monster attacks. YOU MUST SET BATTLE WHEN TO "STAY HIDDEN" TO USE THIS FEATURE.',
                    'Never - disables attacking monsters'
                ],
                monsterDelayInstructions = "Max random delay (in seconds) to battle monsters",
                demiPoint = [
                    'Ambrosia',
                    'Malekus',
                    'Corvintheus',
                    'Aurora',
                    'Azeron'
                ],
                demiPtItem = 0,
                htmlCode = '';

            htmlCode += caap.ToggleControl('Monster', 'MONSTER');
            htmlCode += "<table width='180px' cellpadding='0px' cellspacing='0px'>";
            htmlCode += "<tr><td style='width: 35%'>Attack When</td><td style='text-align: right'>" + caap.MakeDropDown('WhenMonster', mbattleList, mbattleInst, "style='font-size: 10px; width: 100%;'", 'Never') + '</td></tr></table>';
            htmlCode += "<div id='caap_WhenMonsterStayHidden1' style='color: red; font-weight: bold; display: " +
                (config.getItem('WhenMonster', 'Never') === 'Stay Hidden' && config.getItem('WhenBattle', 'Never') !== 'Stay Hidden' ? 'block' : 'none') + "'>Warning: Battle Not Set To 'Stay Hidden'";
            htmlCode += "</div>";
            htmlCode += "<div id='caap_WhenMonsterXStamina' style='display: " + (config.getItem('WhenMonster', 'Never') !== 'At X Stamina' ? 'none' : 'block') + "'>";
            htmlCode += "<table width='180px' cellpadding='0px' cellspacing='0px'>";
            htmlCode += "<tr><td>Battle When Stamina</td><td style='text-align: right'>" + caap.MakeNumberForm('XMonsterStamina', XMonsterInstructions, 1, "size='3' style='font-size: 10px; text-align: right'") + '</td></tr>';
            htmlCode += "<tr><td style='padding-left: 10px'>Keep This Stamina</td><td style='text-align: right'>" +
                caap.MakeNumberForm('XMinMonsterStamina', XMinMonsterInstructions, 0, "size='3' style='font-size: 10px; text-align: right'") + '</td></tr></table>';
            htmlCode += "</div>";
            htmlCode += "<div id='caap_WhenMonsterHide' style='display: " + (config.getItem('WhenMonster', 'Never') !== 'Never' ? 'block' : 'none') + "'>";
            htmlCode += "<table width='180px' cellpadding='0px' cellspacing='0px'>";
            htmlCode += "<tr><td>Monster delay secs</td><td style='text-align: right'>" + caap.MakeNumberForm('seedTime', monsterDelayInstructions, 300, "size='3' style='font-size: 10px; text-align: right'") + "</td></tr>";
            htmlCode += caap.MakeCheckTR("Use Tactics", 'UseTactics', false, 'UseTactics_Adv', useTacticsInstructions, true);
            htmlCode += "<table width='180px' cellpadding='0px' cellspacing='0px'>";
            htmlCode += "<tr><td>&nbsp;&nbsp;&nbsp;Health threshold</td><td style='text-align: right'>" +
                caap.MakeNumberForm('TacticsThreshold', useTacticsThresholdInstructions, 75, "size='2' style='font-size: 10px; text-align: right'") + '</td></tr></table>';
            htmlCode += "</div>";

            htmlCode += "<table width='180px' cellpadding='0px' cellspacing='0px'>";
            htmlCode += caap.MakeCheckTR("Power Attack Only", 'PowerAttack', true, 'PowerAttack_Adv', powerattackInstructions, true);
            htmlCode += "<table width='180px' cellpadding='0px' cellspacing='0px'>";
            htmlCode += caap.MakeCheckTR("&nbsp;&nbsp;&nbsp;Power Attack Max", 'PowerAttackMax', false, '', powerattackMaxInstructions) + "</table>";
            htmlCode += "</div>";
            htmlCode += "<table width='180px' cellpadding='0px' cellspacing='0px'>";
            htmlCode += caap.MakeCheckTR("Power Fortify Max", 'PowerFortifyMax', false, '', powerfortifyMaxInstructions);
            htmlCode += caap.MakeCheckTR("Siege Weapon Assist Monsters", 'monsterDoSiege', true, '', dosiegeInstructions);
            htmlCode += caap.MakeCheckTR("Collect Monster Rewards", 'monsterCollectReward', false, '', collectRewardInstructions);
            htmlCode += caap.MakeCheckTR("Clear Complete Monsters", 'clearCompleteMonsters', false, '', '');
            htmlCode += caap.MakeCheckTR("Achievement Mode", 'AchievementMode', true, '', monsterachieveInstructions);
            htmlCode += caap.MakeCheckTR("Get Demi Points First", 'DemiPointsFirst', false, 'DemiList', demiPointsFirstInstructions, true);
            htmlCode += "<table width='180px' cellpadding='0px' cellspacing='0px'>";
            htmlCode += "<span style='white-space: nowrap;'>";
            for (demiPtItem = 0; demiPtItem < demiPoint.length; demiPtItem += 1) {
                htmlCode += "<span title='" + demiPoint[demiPtItem] + "'><img alt='" + demiPoint[demiPtItem] + "' src='data:image/jpg;base64," + image64[demiPoint[demiPtItem]] + "' height='15px' width='15px'/>" +
                    caap.MakeCheckBox('DemiPoint' + demiPtItem, true, '', '') + "</span>";
            }

            htmlCode += "</span>";
            htmlCode += "</table>";
            htmlCode += "</div>";
            htmlCode += "<table width='180px' cellpadding='0px' cellspacing='0px'>";
            htmlCode += "<tr><td>Fortify If % Under</td><td style='text-align: right'>" +
                caap.MakeNumberForm('MaxToFortify', fortifyInstructions, 50, "size='2' style='font-size: 10px; text-align: right'") + '</td></tr>';
            htmlCode += "<tr><td style='padding-left: 10px'>Quest If % Over</td><td style='text-align: right'>" +
                caap.MakeNumberForm('MaxHealthtoQuest', questFortifyInstructions, 60, "size='2' style='font-size: 10px; text-align: right'") + '</td></tr>';
            htmlCode += "<tr><td>No Attack If % Under</td><td style='text-align: right'>" + caap.MakeNumberForm('MinFortToAttack', stopAttackInstructions, 10, "size='2' style='font-size: 10px; text-align: right'") + '</td></tr></table>';
            htmlCode += "<table width='180px' cellpadding='0px' cellspacing='0px'>";
            htmlCode += caap.MakeCheckTR("Don't Wait Until Strengthen", 'StrengthenTo100', true, '', strengthenTo100Instructions) + '</table>';
            htmlCode += "Attack Monsters in this order <a href='http://senses.ws/caap/index.php?topic=1502.0' target='_blank' style='color: blue'>(INFO)</a><br />";
            htmlCode += caap.MakeTextBox('orderbattle_monster', attackOrderInstructions, '', '');
            htmlCode += "</div>";
            htmlCode += "<hr/></div>";
            return htmlCode;
        } catch (err) {
            $u.error("ERROR in AddMonsterMenu: " + err);
            return '';
        }
    },

    AddGuildMonstersMenu: function () {
        try {
            // Guild Monster controls
            var mbattleList = [
                    'Stamina Available',
                    'At Max Stamina',
                    'At X Stamina',
                    'Never'
                ],
                mbattleInst = [
                    'Stamina Available will attack whenever you have enough stamina',
                    'At Max Stamina will attack when stamina is at max and will burn down all stamina when able to level up',
                    'At X Stamina you can set maximum and minimum stamina to battle',
                    'Never - disables attacking monsters'
                ],
                htmlCode = '';

            htmlCode += caap.ToggleControl('GuildMonsters', 'GUILD MONSTERS');
            htmlCode += "<table width='180px' cellpadding='0px' cellspacing='0px'>";
            htmlCode += "<tr><td style='width: 35%'>Attack When</td><td style='text-align: right'>" + caap.MakeDropDown('WhenGuildMonster', mbattleList, mbattleInst, "style='font-size: 10px; width: 100%;'", 'Never') + '</td></tr></table>';
            htmlCode += "<div id='caap_WhenGuildMonsterHide' style='display: " + (config.getItem('WhenGuildMonster', 'Never') !== 'Never' ? 'block' : 'none') + "'>";
            htmlCode += "<div id='caap_WhenGuildMonsterXStamina' style='display: " + (config.getItem('WhenGuildMonster', 'Never') !== 'At X Stamina' ? 'none' : 'block') + "'>";
            htmlCode += "<table width='180px' cellpadding='0px' cellspacing='0px'>";
            htmlCode += "<tr><td style='padding-left: 0px'>Max Stamina To Fight</td><td style='text-align: right'>" +
                caap.MakeNumberForm('MaxStaminaToGMonster', '', 20, "size='2' style='font-size: 10px; text-align: right'") + '</td></tr>';
            htmlCode += "<tr><td style='padding-left: 10px'>Keep Stamina</td><td style='text-align: right'>" +
                caap.MakeNumberForm('MinStaminaToGMonster', '', 0, "size='2' style='font-size: 10px; text-align: right'") + '</td></tr></table>';
            htmlCode += "</div>";
            htmlCode += "<table width='180px' cellpadding='0px' cellspacing='0px'>";
            htmlCode += caap.MakeCheckTR('Classic Monsters First', 'doClassicMonstersFirst', false, '', 'Prioritise the classic monsters and raids before Guild Monsters.');
            htmlCode += caap.MakeCheckTR('Siege Monster', 'doGuildMonsterSiege', true, '', 'Perform siege assists when visiting your Guild Monster.');
            htmlCode += caap.MakeCheckTR('Collect Rewards', 'guildMonsterCollect', false, '', 'Collect the rewards of your completed Guild Monsters.');
            htmlCode += caap.MakeCheckTR("Don't Attack Clerics", 'ignoreClerics', false, '', "Do not attack Guild Monster's Clerics. Does not include the Gate minions e.g. Azriel") + '</table>';
            htmlCode += "Attack Gates<br />";
            htmlCode += "<table width='180px' cellpadding='0px' cellspacing='0px'><tr>";
            htmlCode += "<td style='text-align: right;'>N" + caap.MakeCheckBox('attackGateNorth', true, '', '') + "</td>";
            htmlCode += "<td style='text-align: right;'>W" + caap.MakeCheckBox('attackGateWest', true, '', '') + "</td>";
            htmlCode += "<td style='text-align: right;'>E" + caap.MakeCheckBox('attackGateEast', true, '', '') + "</td>";
            htmlCode += "<td style='text-align: right;'>S" + caap.MakeCheckBox('attackGateSouth', true, '', '') + "</td></tr></table>";
            htmlCode += "<table width='180px' cellpadding='0px' cellspacing='0px'>";
            htmlCode += "<tr><td style='padding-left: 0px'>Ignore Minions Below Health</td><td style='text-align: right'>" +
                caap.MakeNumberForm('IgnoreMinionsBelow', "Don't attack monster minions that have a health below this value.", 0, "size='2' style='font-size: 10px; text-align: right'") + '</td></tr></table>';
            htmlCode += "<table width='180px' cellpadding='0px' cellspacing='0px'>";
            htmlCode += caap.MakeCheckTR('&nbsp;&nbsp;&nbsp;Choose First Alive', 'chooseIgnoredMinions', false, '', 'When the only selection left is the monster general then go back and attack any previously ignored monster minions.') + '</table>';
            htmlCode += "Attack Monsters in this order<br />";
            htmlCode += caap.MakeTextBox('orderGuildMonster', 'Attack your guild monsters in this order, can use Slot Number and Name. Control is provided by using :ach and :max', '', '');
            htmlCode += "Attack Minions in this order<br />";
            htmlCode += caap.MakeTextBox('orderGuildMinion', 'Attack your guild minions in this order. Uses the minion name.', '', '');
            htmlCode += "</div>";
            htmlCode += "<hr/></div>";
            return htmlCode;
        } catch (err) {
            $u.error("ERROR in AddGuildMonstersMenu: " + err);
            return '';
        }
    },

    AddArenaMenu: function () {
        try {
            var mbattleList = [
                    'Tokens Available',
                    'Never'
                ],
                mbattleInst = [
                    'Tokens Available will attack whenever you have enough tokens',
                    'Never - disables attacking in Arena'
                ],
                chainList = [
                    '0',
                    '160',
                    '200',
                    '240'
                ],
                chainListInst = [
                    'Disabled',
                    'Chain 160 and above',
                    'Chain 200 and above',
                    'Chain 240 and above'
                ],
                htmlCode = '';

            htmlCode += caap.ToggleControl('Arena', 'ARENA');
            htmlCode += "<table width='180px' cellpadding='0px' cellspacing='0px'>";
            htmlCode += "<tr><td style='width: 35%'>Attack When</td><td style='text-align: right'>" + caap.MakeDropDown('WhenArena', mbattleList, mbattleInst, "style='font-size: 10px; width: 100%;'", 'Never') + '</td></tr></table>';
            htmlCode += "<div id='caap_WhenArenaHide' style='display: " + (config.getItem('WhenArena', 'Never') !== 'Never' ? 'block' : 'none') + "'>";
            htmlCode += "Attack Classes in this order<br />";
            htmlCode += caap.MakeTextBox('orderArenaClass', 'Attack Arena class in this order. Uses the class name.', 'Cleric,Mage,Rogue,Warrior', '');
            htmlCode += "<table width='180px' cellpadding='0px' cellspacing='0px'>";
            htmlCode += "<tr><td style='padding-left: 0px'>Ignore Health &lt;=</td><td style='text-align: right'>" +
                caap.MakeNumberForm('ignoreArenaHealth', "Ignore enemies with health equal to or below this level.", 200, "size='2' style='font-size: 10px; text-align: right'") + '</td></tr>';
            htmlCode += "<tr><td style='padding-left: 0px'>Ignore Your Level Plus &gt;=</td><td style='text-align: right'>" +
                caap.MakeNumberForm('maxArenaLevel', "This value is added the the value of your current level and enemies with a level above this value are ignored", 50, "size='2' style='font-size: 10px; text-align: right'") + '</td></tr></table>';
            htmlCode += "<table width='180px' cellpadding='0px' cellspacing='0px'>";
            htmlCode += caap.MakeCheckTR("Stun All Clerics", 'killClericFirst', false, '', "Attack Clerics that are not stunned.");
            htmlCode += "<table width='180px' cellpadding='0px' cellspacing='0px'>";
            htmlCode += caap.MakeCheckTR("Do Polymorphed", 'doPoly', true, 'ChangePolyControl', "Attack polymorphed players.", true) + '</table>';
            htmlCode += "<table width='180px' cellpadding='0px' cellspacing='0px'>";
            htmlCode += caap.MakeCheckTR("&nbsp;&nbsp;&nbsp;Priority Polymorphed", 'attackPoly', false, '', "Attack polymorphed players first.");
            htmlCode += caap.MakeCheckTR("&nbsp;&nbsp;&nbsp;Attack Polymorphed If Rogue", 'roguePoly', true, '', "Only attack polymorphed players if you are class Rogue.");
            htmlCode += caap.MakeCheckTR("&nbsp;&nbsp;&nbsp;Stunned Ignore Polymorphed", 'stunnedPoly', true, '', "If you are stunned then don't attack polymorphed minions, leave them for someone who can do more damage.") + '</table>';
            htmlCode += '</div>';
            htmlCode += "<table width='180px' cellpadding='0px' cellspacing='0px'>";
            htmlCode += caap.MakeCheckTR("Suicide", 'attackSuicide', false, '', "When out of targets, attack active Rogues or Warriors to which you lost previously, before any class that's not stunned.") + '</table>';
            htmlCode += "<table width='180px' cellpadding='0px' cellspacing='0px'>";
            htmlCode += "<tr><td style='width: 35%'>Chain</td><td style='text-align: right'>" + caap.MakeDropDown('chainArena', chainList, chainListInst, "style='font-size: 10px; width: 50%;'", '160') + '</td></tr></table>';
            htmlCode += "<table width='180px' cellpadding='0px' cellspacing='0px'>";
            htmlCode += caap.MakeCheckTR("Chain Observe Health", 'observeHealth', true, '', "When chaining, observe the 'Ignore Health' and 'Stun All Clerics' options.") + '</table>';
            //htmlCode += caap.MakeCheckTR("Chain Strict", 'chainStrict', false, '', "When chaining, if current target did not match the chain value then ignore and move to next target.") + '</table>';
            htmlCode += "</div>";
            htmlCode += "<hr/></div>";
            return htmlCode;
        } catch (err) {
            $u.error("ERROR in AddArenaMenu: " + err);
            return '';
        }
    },

    AddReconMenu: function () {
        try {
            // Recon Controls
            var PReconInstructions = "Enable player battle reconnaissance to run " +
                    "as an idle background task. Battle targets will be collected and" +
                    " can be displayed using the 'Target List' selection on the " +
                    "dashboard.",
                PRRankInstructions = "Provide the number of ranks below you which" +
                    " recon will use to filter targets. This value will be subtracted" +
                    " from your rank to establish the minimum rank that recon will " +
                    "consider as a viable target. Default 3.",
                PRLevelInstructions = "Provide the number of levels above you " +
                    "which recon will use to filter targets. This value will be added" +
                    " to your level to establish the maximum level that recon will " +
                    "consider as a viable target. Default 10.",
                PRARBaseInstructions = "This value sets the base for your army " +
                    "ratio calculation. It is basically a multiplier for the army " +
                    "size of a player at your equal level. For example, a value of " +
                    ".5 means you will battle an opponent the same level as you with " +
                    "an army half the size of your army or less. Default 1.",
                htmlCode = '';

            htmlCode += caap.ToggleControl('Recon', 'RECON');
            htmlCode += "<table width='180px' cellpadding='0px' cellspacing='0px'>";
            htmlCode += caap.MakeCheckTR("Enable Player Recon", 'DoPlayerRecon', false, 'PlayerReconControl', PReconInstructions, true);
            htmlCode += "<table width='180px' cellpadding='0px' cellspacing='0px'>";
            htmlCode += "<tr><td style='padding-left: 0px'>Limit Target Records</td><td style='text-align: right'>" +
                caap.MakeNumberForm('LimitTargets', 'Maximum number of records to hold.', 100, "size='2' style='font-size: 10px; text-align: right'") + '</td></tr></table>';
            htmlCode += 'Find battle targets that are:';
            htmlCode += "<table width='180px' cellpadding='0px' cellspacing='0px'>";
            htmlCode += "<tr><td style='padding-left: 10px'>Not Lower Than Rank Minus</td><td style='text-align: right'>" +
                caap.MakeNumberForm('ReconPlayerRank', PRRankInstructions, 3, "size='2' style='font-size: 10px; text-align: right'") + '</td></tr>';
            htmlCode += "<tr><td style='padding-left: 10px'>Not Higher Than Level Plus</td><td style='text-align: right'>" +
                caap.MakeNumberForm('ReconPlayerLevel', PRLevelInstructions, 10, "size='2' style='font-size: 10px; text-align: right'") + '</td></tr>';
            htmlCode += "<tr><td style='padding-left: 10px'>Not Higher Than X*Army</td><td style='text-align: right'>" +
                caap.MakeNumberForm('ReconPlayerARBase', PRARBaseInstructions, 1, "size='2' style='font-size: 10px; text-align: right'") + '</td></tr></table>';
            htmlCode += "</div>";
            htmlCode += "<hr/></div>";
            return htmlCode;
        } catch (err) {
            $u.error("ERROR in AddReconMenu: " + err);
            return '';
        }
    },

    AddGeneralsMenu: function () {
        try {
            // Add General Comboboxes
            var reverseGenInstructions = "This will make the script level Generals under level 4 from Top-down instead of Bottom-up",
                ignoreGeneralImage = "This will prevent the script " +
                    "from changing your selected General to 'Use Current' if the script " +
                    "is unable to find the General's image when changing activities. " +
                    "Instead it will use the current General for the activity and try " +
                    "to select the correct General again next time.",
                LevelUpGenExpInstructions = "Specify the number of experience " +
                    "points below the next level up to begin using the level up general.",
                LevelUpGenInstructions1 = "Use the Level Up General for Idle mode.",
                LevelUpGenInstructions2 = "Use the Level Up General for Monster mode.",
                LevelUpGenInstructions3 = "Use the Level Up General for Fortify mode.",
                LevelUpGenInstructions4 = "Use the Level Up General for Invade mode.",
                LevelUpGenInstructions5 = "Use the Level Up General for Duel mode.",
                LevelUpGenInstructions6 = "Use the Level Up General for War mode.",
                LevelUpGenInstructions7 = "Use the Level Up General for doing sub-quests.",
                LevelUpGenInstructions8 = "Use the Level Up General for doing primary quests " +
                    "(Warning: May cause you not to gain influence if wrong general is equipped.)",
                LevelUpGenInstructions9 = "Ignore Banking until level up energy and stamina gains have been used.",
                LevelUpGenInstructions10 = "Ignore Income until level up energy and stamina gains have been used.",
                LevelUpGenInstructions11 = "EXPERIMENTAL: Enables the Quest 'Not Fortifying' mode after level up.",
                LevelUpGenInstructions12 = "Use the Level Up General for Guild Monster mode.",
                LevelUpGenInstructions13 = "Use the Level Up General for Arena mode.",
                dropDownItem = 0,
                htmlCode = '';

            htmlCode += caap.ToggleControl('Generals', 'GENERALS');
            htmlCode += "<table width='180px' cellpadding='0px' cellspacing='0px'>";
            htmlCode += caap.MakeCheckTR("Do not reset General", 'ignoreGeneralImage', true, '', ignoreGeneralImage) + "</table>";
            htmlCode += "<table width='180px' cellpadding='0px' cellspacing='0px'>";
            for (dropDownItem = 0; dropDownItem < general.StandardList.length; dropDownItem += 1) {
                htmlCode += '<tr><td>' + general.StandardList[dropDownItem] + "</td><td style='text-align: right'>" +
                    caap.MakeDropDown(general.StandardList[dropDownItem] + 'General', general.List, '', "style='font-size: 10px; min-width: 110px; max-width: 110px; width: 110px;'") + '</td></tr>';
            }

            htmlCode += "<tr><td>Buy</td><td style='text-align: right'>" + caap.MakeDropDown('BuyGeneral', general.BuyList, '', "style='font-size: 10px; min-width: 110px; max-width: 110px; width: 110px;'") + '</td></tr>';
            htmlCode += "<tr><td>Collect</td><td style='text-align: right'>" + caap.MakeDropDown('CollectGeneral', general.CollectList, '', "style='font-size: 10px; min-width: 110px; max-width: 110px; width: 110px;'") + '</td></tr>';
            htmlCode += "<tr><td>Income</td><td style='text-align: right'>" + caap.MakeDropDown('IncomeGeneral', general.IncomeList, '', "style='font-size: 10px; min-width: 110px; max-width: 110px; width: 110px;'") + '</td></tr>';
            htmlCode += "<tr><td>Banking</td><td style='text-align: right'>" + caap.MakeDropDown('BankingGeneral', general.BankingList, '', "style='font-size: 10px; min-width: 110px; max-width: 110px; width: 110px;'") + '</td></tr>';
            htmlCode += "<tr><td>Level Up</td><td style='text-align: right'>" + caap.MakeDropDown('LevelUpGeneral', general.List, '', "style='font-size: 10px; min-width: 110px; max-width: 110px; width: 110px;'") + '</td></tr></table>';
            htmlCode += "<div id='caap_LevelUpGeneralHide' style='display: " + (config.getItem('LevelUpGeneral', 'Use Current') !== 'Use Current' ? 'block' : 'none') + "'>";
            htmlCode += "<table width='180px' cellpadding='0px' cellspacing='0px'>";
            htmlCode += "<tr><td>&nbsp;&nbsp;&nbsp;Exp To Use Gen </td><td style='text-align: right'>" + caap.MakeNumberForm('LevelUpGeneralExp', LevelUpGenExpInstructions, 20, "size='2' style='font-size: 10px; text-align: right'") + '</td></tr>';
            htmlCode += caap.MakeCheckTR("&nbsp;&nbsp;&nbsp;Gen For Idle", 'IdleLevelUpGeneral', true, '', LevelUpGenInstructions1);
            htmlCode += caap.MakeCheckTR("&nbsp;&nbsp;&nbsp;Gen For Monsters", 'MonsterLevelUpGeneral', true, '', LevelUpGenInstructions2);
            htmlCode += caap.MakeCheckTR("&nbsp;&nbsp;&nbsp;Gen For Guild Monsters", 'GuildMonsterLevelUpGeneral', true, '', LevelUpGenInstructions12);
            htmlCode += caap.MakeCheckTR("&nbsp;&nbsp;&nbsp;Gen For Fortify", 'FortifyLevelUpGeneral', true, '', LevelUpGenInstructions3);
            htmlCode += caap.MakeCheckTR("&nbsp;&nbsp;&nbsp;Gen For Invades", 'InvadeLevelUpGeneral', true, '', LevelUpGenInstructions4);
            htmlCode += caap.MakeCheckTR("&nbsp;&nbsp;&nbsp;Gen For Duels", 'DuelLevelUpGeneral', true, '', LevelUpGenInstructions5);
            htmlCode += caap.MakeCheckTR("&nbsp;&nbsp;&nbsp;Gen For Wars", 'WarLevelUpGeneral', true, '', LevelUpGenInstructions6);
            htmlCode += caap.MakeCheckTR("&nbsp;&nbsp;&nbsp;Gen For Arena", 'ArenaLevelUpGeneral', true, '', LevelUpGenInstructions13);
            htmlCode += caap.MakeCheckTR("&nbsp;&nbsp;&nbsp;Gen For SubQuests", 'SubQuestLevelUpGeneral', true, '', LevelUpGenInstructions7);
            htmlCode += caap.MakeCheckTR("&nbsp;&nbsp;&nbsp;Gen For MainQuests", 'QuestLevelUpGeneral', false, '', LevelUpGenInstructions8);
            htmlCode += caap.MakeCheckTR("&nbsp;&nbsp;&nbsp;Don't Bank After", 'NoBankAfterLvl', true, '', LevelUpGenInstructions9);
            htmlCode += caap.MakeCheckTR("&nbsp;&nbsp;&nbsp;Don't Income After", 'NoIncomeAfterLvl', true, '', LevelUpGenInstructions10);
            htmlCode += caap.MakeCheckTR("&nbsp;&nbsp;&nbsp;Prioritise Monster After", 'PrioritiseMonsterAfterLvl', false, '', LevelUpGenInstructions11);
            htmlCode += "</table></div>";
            htmlCode += "<table width='180px' cellpadding='0px' cellspacing='0px'>";
            htmlCode += caap.MakeCheckTR("Reverse Under Level 4 Order", 'ReverseLevelUpGenerals', false, '', reverseGenInstructions) + "</table>";
            htmlCode += "<hr/></div>";
            return htmlCode;
        } catch (err) {
            $u.error("ERROR in AddGeneralsMenu: " + err);
            return '';
        }
    },

    AddSkillPointsMenu: function () {
        try {
            var statusInstructions = "Automatically increase attributes when " +
                    "upgrade skill points are available.",
                statusAdvInstructions = "USE WITH CAUTION: You can use numbers or " +
                    "formulas(ie. level * 2 + 10). Variable keywords include energy, " +
                    "health, stamina, attack, defense, and level. JS functions can be " +
                    "used (Math.min, Math['max'], etc) !!!Remember your math class: " +
                    "'level + 20' not equals 'level * 2 + 10'!!!",
                statImmedInstructions = "Update Stats Immediately",
                statSpendAllInstructions = "If selected then spend all possible points and don't save for stamina upgrade.",
                attrList = [
                    '',
                    'Energy',
                    'Attack',
                    'Defense',
                    'Stamina',
                    'Health'
                ],
                htmlCode = '';

            htmlCode += caap.ToggleControl('Status', 'UPGRADE SKILL POINTS');
            htmlCode += "<table width='180px' cellpadding='0px' cellspacing='0px'>";
            htmlCode += caap.MakeCheckTR("Auto Add Upgrade Points", 'AutoStat', false, 'AutoStat_Adv', statusInstructions, true);
            htmlCode += "<table width='180px' cellpadding='0px' cellspacing='0px'>";
            htmlCode += caap.MakeCheckTR("Spend All Possible", 'StatSpendAll', false, '', statSpendAllInstructions);
            htmlCode += caap.MakeCheckTR("Upgrade Immediately", 'StatImmed', false, '', statImmedInstructions);
            htmlCode += caap.MakeCheckTR("Advanced Settings <a href='http://userscripts.org/posts/207279' target='_blank' style='color: blue'>(INFO)</a>", 'AutoStatAdv', false, '', statusAdvInstructions) + "</table>";
            htmlCode += "<div id='caap_Status_Normal' style='display: " + (config.getItem('AutoStatAdv', false) ? 'none' : 'block') + "'>";
            htmlCode += "<table width='180px' cellpadding='0px' cellspacing='0px'>";
            htmlCode += "<tr><td style='width: 25%; text-align: right'>Increase</td><td style='width: 50%; text-align: center'>" +
                caap.MakeDropDown('Attribute0', attrList, '', "style='font-size: 10px'") + "</td><td style='width: 5%; text-align: center'>to</td><td style='width: 20%; text-align: right'>" +
                caap.MakeNumberForm('AttrValue0', statusInstructions, 0, "size='3' style='font-size: 10px; text-align: right'", 'text') + " </td></tr>";
            htmlCode += "<tr><td style='width: 25%; text-align: right'>Then</td><td style='width: 50%; text-align: center'>" +
                caap.MakeDropDown('Attribute1', attrList, '', "style='font-size: 10px'") + "</td><td style='width: 5%; text-align: center'>to</td><td style='width: 20%; text-align: right'>" +
                caap.MakeNumberForm('AttrValue1', statusInstructions, 0, "size='3' style='font-size: 10px; text-align: right'", 'text') + " </td></tr>";
            htmlCode += "<tr><td style='width: 25%; text-align: right'>Then</td><td style='width: 50%; text-align: center'>" +
                caap.MakeDropDown('Attribute2', attrList, '', "style='font-size: 10px'") + "</td><td style='width: 5%; text-align: center'>to</td><td style='width: 20%; text-align: right'>" +
                caap.MakeNumberForm('AttrValue2', statusInstructions, 0, "size='3' style='font-size: 10px; text-align: right'", 'text') + " </td></tr>";
            htmlCode += "<tr><td style='width: 25%; text-align: right'>Then</td><td style='width: 50%; text-align: center'>" +
                caap.MakeDropDown('Attribute3', attrList, '', "style='font-size: 10px'") + "</td><td style='width: 5%; text-align: center'>to</td><td style='width: 20%; text-align: right'>" +
                caap.MakeNumberForm('AttrValue3', statusInstructions, 0, "size='3' style='font-size: 10px; text-align: right'", 'text') + " </td></tr>";
            htmlCode += "<tr><td style='width: 25%; text-align: right'>Then</td><td style='width: 50%; text-align: center'>" +
                caap.MakeDropDown('Attribute4', attrList, '', "style='font-size: 10px'") + "</td><td style='width: 5%; text-align: center'>to</td><td style='width: 20%; text-align: right'>" +
                caap.MakeNumberForm('AttrValue4', statusInstructions, 0, "size='3' style='font-size: 10px; text-align: right'", 'text') + " </td></tr></table>";
            htmlCode += "</div>";
            htmlCode += "<div id='caap_Status_Adv' style='display: " + (config.getItem('AutoStatAdv', false) ? 'block' : 'none') + "'>";
            htmlCode += "<table width='180px' cellpadding='0px' cellspacing='0px'>";
            htmlCode += "<tr><td style='width: 25%; text-align: right'>Increase</td><td style='width: 50%; text-align: center'>" +
                caap.MakeDropDown('Attribute5', attrList, '', "style='font-size: 10px'") + "</td><td style='width: 25%; text-align: left'>using</td></tr>";
            htmlCode += "<tr><td colspan='3'>" + caap.MakeNumberForm('AttrValue5', statusInstructions, 0, "size='7' style='font-size: 10px; width : 98%'", 'text') + " </td></tr>";
            htmlCode += "<tr><td style='width: 25%; text-align: right'>Then</td><td style='width: 50%; text-align: center'>" +
                caap.MakeDropDown('Attribute6', attrList, '', "style='font-size: 10px'") + "</td><td style='width: 25%'>using</td></tr>";
            htmlCode += "<tr><td colspan='3'>" + caap.MakeNumberForm('AttrValue6', statusInstructions, 0, "size='7' style='font-size: 10px; width : 98%'", 'text') + " </td></tr>";
            htmlCode += "<tr><td style='width: 25%; text-align: right'>Then</td><td style='width: 50%; text-align: center'>" +
                caap.MakeDropDown('Attribute7', attrList, '', "style='font-size: 10px'") + "</td><td style='width: 25%'>using</td></tr>";
            htmlCode += "<tr><td colspan='3'>" + caap.MakeNumberForm('AttrValue7', statusInstructions, 0, "size='7' style='font-size: 10px; width : 98%'", 'text') + " </td></tr>";
            htmlCode += "<tr><td style='width: 25%; text-align: right'>Then</td><td style='width: 50%; text-align: center'>" +
                caap.MakeDropDown('Attribute8', attrList, '', "style='font-size: 10px'") + "</td><td style='width: 25%'>using</td></tr>";
            htmlCode += "<tr><td colspan='3'>" + caap.MakeNumberForm('AttrValue8', statusInstructions, 0, "size='7' style='font-size: 10px; width : 98%'", 'text') + " </td></tr>";
            htmlCode += "<tr><td style='width: 25%; text-align: right'>Then</td><td style='width: 50%; text-align: center'>" +
                caap.MakeDropDown('Attribute9', attrList, '', "style='font-size: 10px'") + "</td><td style='width: 25%'>using</td></tr>";
            htmlCode += "<tr><td colspan='3'>" + caap.MakeNumberForm('AttrValue9', statusInstructions, 0, "size='7' style='font-size: 10px; width : 98%'", 'text') + " </td></tr></table>";
            htmlCode += "</div>";
            htmlCode += "</table></div>";
            htmlCode += "<hr/></div>";
            return htmlCode;
        } catch (err) {
            $u.error("ERROR in AddSkillPointsMenu: " + err);
            return '';
        }
    },

    AddGiftingOptionsMenu: function () {
        try {
            // Other controls
            var giftInstructions = "Automatically receive and send return gifts.",
                giftQueueUniqueInstructions = "When enabled only unique user's gifts will be queued, otherwise all received gifts will be queued.",
                giftCollectOnlyInstructions = "Only collect gifts, do not queue and do not return.",
                giftCollectAndQueueInstructions = "When used with Collect Only it will collect and queue gifts but not return.",
                giftReturnOnlyOneInstructions = "Only return 1 gift to a person in 24 hours even if you received many from that person.",
                htmlCode = '';

            htmlCode += caap.ToggleControl('Gifting', 'GIFTING OPTIONS');
            htmlCode += "<table width='180px' cellpadding='0px' cellspacing='0px'>";
            htmlCode += caap.MakeCheckTR('Auto Gifting', 'AutoGift', false, 'GiftControl', giftInstructions, true);
            htmlCode += "<table width='180px' cellpadding='0px' cellspacing='0px'>";
            htmlCode += caap.MakeCheckTR('Queue unique users only', 'UniqueGiftQueue', true, '', giftQueueUniqueInstructions);
            htmlCode += caap.MakeCheckTR('Collect Only', 'CollectOnly', false, 'CollectOnly_Adv', giftCollectOnlyInstructions, true);
            htmlCode += "<table width='180px' cellpadding='0px' cellspacing='0px'>";
            htmlCode += caap.MakeCheckTR('&nbsp;&nbsp;&nbsp;And Queue', 'CollectAndQueue', false, '', giftCollectAndQueueInstructions) + '</table>';
            htmlCode += '</div>';
            htmlCode += "<table width='180px' cellpadding='0px' cellspacing='0px'>";
            htmlCode += "<tr><td style='width: 25%'>Give</td><td style='text-align: right'>" +
                caap.MakeDropDown('GiftChoice', gifting.gifts.list(), '', "style='font-size: 10px; width: 100%'") + '</td></tr></table>';
            htmlCode += "<table width='180px' cellpadding='0px' cellspacing='0px'>";
            htmlCode += caap.MakeCheckTR('1 Gift Per Person Per 24hrs', 'ReturnOnlyOne', false, '', giftReturnOnlyOneInstructions);
            htmlCode += caap.MakeCheckTR('Filter Return By UserId', 'FilterReturnId', false, 'FilterReturnIdControl', "Don't return gifts to a list of UserIDs", true) + '</table>';
            htmlCode += "<table width='180px' cellpadding='0px' cellspacing='0px'>";
            htmlCode += '<tr><td>' + caap.MakeTextBox('FilterReturnIdList', "Don't return gifts to these UserIDs. Use ',' between each UserID", '', '') + '</td></tr></table>';
            htmlCode += '</div>';
            htmlCode += "<table width='180px' cellpadding='0px' cellspacing='0px'>";
            htmlCode += caap.MakeCheckTR('Filter Return By Gift', 'FilterReturnGift', false, 'FilterReturnGiftControl', "Don't return gifts for a list of certain gifts recieved", true) + '</table>';
            htmlCode += "<table width='180px' cellpadding='0px' cellspacing='0px'>";
            htmlCode += '<tr><td>' + caap.MakeTextBox('FilterReturnGiftList', "Don't return gifts to these received gifts. Use ',' between each gift", '', '') + '</td></tr></table>';
            htmlCode += '</div>';
            htmlCode += '</div>';
            htmlCode += "<hr/></div>";
            return htmlCode;
        } catch (err) {
            $u.error("ERROR in AddGiftingOptionsMenu: " + err);
            return '';
        }
    },

    AddEliteGuardOptionsMenu: function () {
        try {
            // Other controls
            var autoEliteInstructions = "Enable or disable Auto Elite function",
                autoEliteIgnoreInstructions = "Use this option if you have a small " +
                    "army and are unable to fill all 10 Elite positions. This prevents " +
                    "the script from checking for any empty places and will cause " +
                    "Auto Elite to run on its timer only.",
                htmlCode = '';

            htmlCode += caap.ToggleControl('Elite', 'ELITE GUARD OPTIONS');
            htmlCode += "<table width='180px' cellpadding='0px' cellspacing='0px'>";
            htmlCode += caap.MakeCheckTR('Auto Elite Army', 'AutoElite', false, 'AutoEliteControl', autoEliteInstructions, true);
            htmlCode += "<table width='180px' cellpadding='0px' cellspacing='0px'>";
            htmlCode += caap.MakeCheckTR('Timed Only', 'AutoEliteIgnore', false, '', autoEliteIgnoreInstructions) + '</table>';
            htmlCode += "<table width='180px' cellpadding='0px' cellspacing='0px'>";
            htmlCode += "<tr><td><input type='button' id='caap_resetElite' value='Do Now' style='padding: 0; font-size: 10px; height: 18px' /></tr></td>";
            htmlCode += '<tr><td>' + caap.MakeTextBox('EliteArmyList', "Try these UserIDs first. Use ',' between each UserID", '', '') + '</td></tr></table>';
            htmlCode += '</div>';
            htmlCode += "<hr/></div>";
            return htmlCode;
        } catch (err) {
            $u.error("ERROR in AddEliteGuardOptionsMenu: " + err);
            return '';
        }
    },

    AddAutoOptionsMenu: function () {
        try {
            // Other controls
            var autoAlchemyInstructions1 = "AutoAlchemy will combine all recipes " +
                    "that do not have missing ingredients. By default, it will not " +
                    "combine Battle Hearts recipes.",
                autoAlchemyInstructions2 = "If for some reason you do not want " +
                    "to skip Battle Hearts",
                autoPotionsInstructions0 = "Enable or disable the auto consumption " +
                    "of energy and stamina potions.",
                autoPotionsInstructions1 = "Number of stamina potions at which to " +
                    "begin consuming.",
                autoPotionsInstructions2 = "Number of stamina potions to keep.",
                autoPotionsInstructions3 = "Number of energy potions at which to " +
                    "begin consuming.",
                autoPotionsInstructions4 = "Number of energy potions to keep.",
                autoPotionsInstructions5 = "Do not consume potions if the " +
                    "experience points to the next level are within this value.",
                autoBlessList = [
                    'None',
                    'Energy',
                    'Attack',
                    'Defense',
                    'Health',
                    'Stamina'
                ],
                autoBlessListInstructions = [
                    'None disables the auto bless feature.',
                    'Energy performs an automatic daily blessing with Ambrosia.',
                    'Attack performs an automatic daily blessing with Malekus.',
                    'Defense performs an automatic daily blessing with Corvintheus.',
                    'Health performs an automatic daily blessing with Aurora.',
                    'Stamina performs an automatic daily blessing with Azeron.'
                ],
                htmlCode = '';

            htmlCode += caap.ToggleControl('Auto', 'AUTO OPTIONS');
            htmlCode += "<table width='180px' cellpadding='0px' cellspacing='0px'>";
            htmlCode += caap.MakeCheckTR('Auto Alchemy', 'AutoAlchemy', false, 'AutoAlchemy_Adv', autoAlchemyInstructions1, true);
            htmlCode += "<table width='180px' cellpadding='0px' cellspacing='0px'>";
            htmlCode += caap.MakeCheckTR('&nbsp;&nbsp;&nbsp;Do Battle Hearts', 'AutoAlchemyHearts', false, '', autoAlchemyInstructions2) + '</td></tr></table>';
            htmlCode += '</div>';
            htmlCode += "<table width='180px' cellpadding='0px' cellspacing='0px'>";
            htmlCode += caap.MakeCheckTR('Auto Potions', 'AutoPotions', false, 'AutoPotions_Adv', autoPotionsInstructions0, true);
            htmlCode += "<table width='180px' cellpadding='0px' cellspacing='0px'>";
            htmlCode += "<tr><td style='padding-left: 10px'>Spend Stamina Potions At</td><td style='text-align: right'>" +
                caap.MakeNumberForm('staminaPotionsSpendOver', autoPotionsInstructions1, 39, "size='2' style='font-size: 10px; text-align: right'") + '</td></tr>';
            htmlCode += "<tr><td style='padding-left: 10px'>Keep Stamina Potions</td><td style='text-align: right'>" +
                caap.MakeNumberForm('staminaPotionsKeepUnder', autoPotionsInstructions2, 35, "size='2' style='font-size: 10px; text-align: right'") + '</td></tr>';
            htmlCode += "<tr><td style='padding-left: 10px'>Spend Energy Potions At</td><td style='text-align: right'>" +
                caap.MakeNumberForm('energyPotionsSpendOver', autoPotionsInstructions3, 39, "size='2' style='font-size: 10px; text-align: right'") + '</td></tr>';
            htmlCode += "<tr><td style='padding-left: 10px'>Keep Energy Potions</td><td style='text-align: right'>" +
                caap.MakeNumberForm('energyPotionsKeepUnder', autoPotionsInstructions4, 35, "size='2' style='font-size: 10px; text-align: right'") + '</td></tr>';
            htmlCode += "<tr><td style='padding-left: 10px'>Wait If Exp. To Level</td><td style='text-align: right'>" +
                caap.MakeNumberForm('potionsExperience', autoPotionsInstructions5, 20, "size='2' style='font-size: 10px; text-align: right'") + '</td></tr></table>';
            htmlCode += '</div>';
            htmlCode += "<table width='180px' cellpadding='0px' cellspacing='0px' style='margin-top: 3px'>";
            htmlCode += "<tr><td style='width: 50%'>Auto bless</td><td style='text-align: right'>" +
                caap.MakeDropDown('AutoBless', autoBlessList, autoBlessListInstructions, "style='font-size: 10px; width: 100%'") + '</td></tr></table>';
            htmlCode += "<hr/></div>";
            return htmlCode;
        } catch (err) {
            $u.error("ERROR in AddAutoOptionsMenu: " + err);
            return '';
        }
    },

    AddOtherOptionsMenu: function () {
        try {
            // Other controls
            var timeInstructions = "Use 24 hour format for displayed times.",
                titleInstructions0 = "Set the title bar.",
                titleInstructions1 = "Add the current action.",
                titleInstructions2 = "Add the player name.",
                hideAdsInstructions = "Hides the sidebar adverts.",
                hideAdsIframeInstructions = "Hide the FaceBook Iframe adverts",
                hideFBChatInstructions = "Hide the FaceBook Chat",
                newsSummaryInstructions = "Enable or disable the news summary on the index page.",
                bannerInstructions = "Uncheck if you wish to hide the CAAP banner.",
                itemTitlesInstructions = "Replaces the CA item titles with more useful tooltips.",
                goblinHintingInstructions = "When in the Goblin Emporium, CAAP will try to hide items that you require and fade those that may be required.",
                ingredientsHideInstructions = "Hide the ingredients list on the Alchemy pages.",
                alchemyShrinkInstructions = "Reduces the size of the item images and shrinks the recipe layout on the Alchemy pages.",
                recipeCleanInstructions = "CAAP will try to hide recipes that are no longer required on the Alchemy page and therefore shrink the list further.",
                recipeCleanCountInstructions = "The number of items to be owned before cleaning the recipe item from the Alchemy page.",
                styleList = [
                    'CA Skin',
                    'Original',
                    'Custom',
                    'None'
                ],
                htmlCode = '';

            htmlCode += caap.ToggleControl('Other', 'OTHER OPTIONS');
            htmlCode += "<table width='180px' cellpadding='0px' cellspacing='0px'>";
            htmlCode += caap.MakeCheckTR('Display Item Titles', 'enableTitles', true, '', itemTitlesInstructions);
            htmlCode += caap.MakeCheckTR('Do Goblin Hinting', 'goblinHinting', true, '', goblinHintingInstructions);
            htmlCode += caap.MakeCheckTR('Hide Recipe Ingredients', 'enableIngredientsHide', false, '', ingredientsHideInstructions);
            htmlCode += caap.MakeCheckTR('Alchemy Shrink', 'enableAlchemyShrink', true, '', alchemyShrinkInstructions);
            htmlCode += caap.MakeCheckTR('Recipe Clean-Up', 'enableRecipeClean', 1, 'enableRecipeClean_Adv', recipeCleanInstructions, true);
            htmlCode += "<table width='180px' cellpadding='0px' cellspacing='0px'>";
            htmlCode += "<tr><td style='padding-left: 10px'>Recipe Count</td><td style='text-align: right'>" +
                caap.MakeNumberForm('recipeCleanCount', recipeCleanCountInstructions, 1, "size='2' style='font-size: 10px; text-align: right'") + '</td></tr></table>';
            htmlCode += '</div>';
            htmlCode += "<table width='180px' cellpadding='0px' cellspacing='0px'>";
            htmlCode += caap.MakeCheckTR('Display CAAP Banner', 'BannerDisplay', true, '', bannerInstructions);
            htmlCode += caap.MakeCheckTR('Use 24 Hour Format', 'use24hr', true, '', timeInstructions);
            htmlCode += caap.MakeCheckTR('Set Title', 'SetTitle', false, 'SetTitle_Adv', titleInstructions0, true);
            htmlCode += "<table width='180px' cellpadding='0px' cellspacing='0px'>";
            htmlCode += caap.MakeCheckTR('&nbsp;&nbsp;&nbsp;Display Action', 'SetTitleAction', false, '', titleInstructions1);
            htmlCode += caap.MakeCheckTR('&nbsp;&nbsp;&nbsp;Display Name', 'SetTitleName', false, '', titleInstructions2) + '</td></tr></table>';
            htmlCode += '</div>';
            htmlCode += "<table width='180px' cellpadding='0px' cellspacing='0px'>";
            htmlCode += caap.MakeCheckTR('Hide Sidebar Adverts', 'HideAds', false, '', hideAdsInstructions);
            htmlCode += caap.MakeCheckTR('Hide FB Iframe Adverts', 'HideAdsIframe', false, '', hideAdsIframeInstructions);
            htmlCode += caap.MakeCheckTR('Hide FB Chat', 'HideFBChat', false, '', hideFBChatInstructions);
            htmlCode += caap.MakeCheckTR('Enable News Summary', 'NewsSummary', true, '', newsSummaryInstructions);
            htmlCode += "<table width='180px' cellpadding='0px' cellspacing='0px' style='margin-top: 3px'>";
            htmlCode += "<tr><td style='width: 50%'>Style</td><td style='text-align: right'>" +
                caap.MakeDropDown('DisplayStyle', styleList, '', "style='font-size: 10px; width: 100%'") + '</td></tr></table>';
            htmlCode += "<div id='caap_DisplayStyleHide' style='display: " + (config.getItem('DisplayStyle', 'CA Skin') === 'Custom' ? 'block' : 'none') + "'>";
            htmlCode += "<table width='180px' cellpadding='0px' cellspacing='0px'>";
            htmlCode += "<tr><td style='padding-left: 10px; font-weight: bold;'>Started</td><td style='text-align: right'>" +
                "<input type='button' id='caap_StartedColorSelect' value='Select' style='padding: 0; font-size: 10px; height: 18px' /></td></tr>";
            htmlCode += "<tr><td style='padding-left: 20px'>RGB Color</td><td style='text-align: right'>" +
                caap.MakeNumberForm('StyleBackgroundLight', '#FFF or #FFFFFF', '#E0C691', "size='5' style='font-size: 10px; text-align: right'", 'text') + '</td></tr>';
            htmlCode += "<tr><td style='padding-left: 20px'>Transparency</td><td style='text-align: right'>" +
                caap.MakeNumberForm('StyleOpacityLight', '0 ~ 1', 1, "size='5' style='vertical-align: middle; font-size: 10px; text-align: right'") + '</td></tr>';
            htmlCode += "<tr><td style='padding-left: 10px; font-weight: bold;'>Stoped</td><td style='text-align: right'>" +
                "<input type='button' id='caap_StopedColorSelect' value='Select' style='padding: 0; font-size: 10px; height: 18px' /></td></tr>";
            htmlCode += "<tr><td style='padding-left: 20px'>RGB Color</td><td style='text-align: right'>" +
                caap.MakeNumberForm('StyleBackgroundDark', '#FFF or #FFFFFF', '#B09060', "size='5' style='font-size: 10px; text-align: right'", 'text') + '</td></tr>';
            htmlCode += "<tr><td style='padding-left: 20px'>Transparency</td><td style='text-align: right'>" +
                caap.MakeNumberForm('StyleOpacityDark', '0 ~ 1', 1, "size='5' style='font-size: 10px; text-align: right'") + '</td></tr></table>';
            htmlCode += "</div>";

            htmlCode += "<table width='180px' cellpadding='0px' cellspacing='0px'>";
            htmlCode += caap.MakeCheckTR('Change Log Level', 'ChangeLogLevel', false, 'ChangeLogLevelControl', '', true) + '</table>';
            htmlCode += "<table width='180px' cellpadding='0px' cellspacing='0px'>";
            htmlCode += "<tr><td style='padding-left: 10px'>Log Level</td><td style='text-align: right'>" +
                caap.MakeNumberForm('DebugLevel', '', 1, "size='2' style='font-size: 10px; text-align: right'") + '</td></tr></table>';
            htmlCode += '</div>';

            htmlCode += "<table width='180px' cellpadding='0px' cellspacing='0px' style='margin-top: 3px'>";
            htmlCode += "<tr><td><input type='button' id='caap_FillArmy' value='Fill Army' style='padding: 0; font-size: 10px; height: 18px' /></td></tr></table>";
            htmlCode += '</div>';
            htmlCode += "<hr/></div>";
            return htmlCode;
        } catch (err) {
            $u.error("ERROR in AddOtherOptionsMenu: " + err);
            return '';
        }
    },

    AddFooterMenu: function () {
        try {
            var htmlCode = '';
            htmlCode += "<table width='180px' cellpadding='0px' cellspacing='0px'>";
            htmlCode += "<tr><td style='width: 90%'>Unlock Menu <input type='button' id='caap_ResetMenuLocation' value='Reset' style='padding: 0; font-size: 10px; height: 18px' /></td>" +
                "<td style='width: 10%; text-align: right'><input type='checkbox' id='unlockMenu' /></td></tr></table>";

            if (!devVersion) {
                htmlCode += "Version: " + caapVersion + " - <a href='http://senses.ws/caap/index.php' target='_blank'>CAAP Forum</a><br />";
                if (caap.newVersionAvailable) {
                    htmlCode += "<a href='http://castle-age-auto-player.googlecode.com/files/Castle-Age-Autoplayer.user.js'>Install new CAAP version: " + state.getItem('SUC_remote_version') + "!</a>";
                }
            } else {
                htmlCode += "Version: " + caapVersion + " d" + devVersion + " - <a href='http://senses.ws/caap/index.php' target='_blank'>CAAP Forum</a><br />";
                if (caap.newVersionAvailable) {
                    htmlCode += "<a href='http://castle-age-auto-player.googlecode.com/svn/trunk/Castle-Age-Autoplayer.user.js'>Install new CAAP version: " + state.getItem('SUC_remote_version') + " d" + state.getItem('DEV_remote_version')  + "!</a>";
                }
            }

            return htmlCode;
        } catch (err) {
            $u.error("ERROR in AddFooterMenu: " + err);
            return '';
        }
    },

    AddColorWheels: function () {
        try {
            var fb1call = null,
                fb2call = null;

            fb1call = function (color) {
                $j('#caap_ColorSelectorDiv1').css({'background-color': color});
                $j('#caap_StyleBackgroundLight').val(color);
                config.setItem("StyleBackgroundLight", color);
                state.setItem("CustStyleBackgroundLight", color);
            };

            $j.farbtastic($j("<div id='caap_ColorSelectorDiv1'></div>").css({
                background : config.getItem("StyleBackgroundLight", "#E0C691"),
                padding    : "5px",
                border     : "2px solid #000",
                top        : (window.innerHeight / 2) - 100 + 'px',
                left       : (window.innerWidth / 2) - 290 + 'px',
                zIndex     : '1337',
                position   : 'fixed',
                display    : 'none'
            }).appendTo(document.body), fb1call).setColor(config.getItem("StyleBackgroundLight", "#E0C691"));

            fb2call = function (color) {
                $j('#caap_ColorSelectorDiv2').css({'background-color': color});
                $j('#caap_StyleBackgroundDark').val(color);
                config.setItem("StyleBackgroundDark", color);
                state.setItem("CustStyleBackgroundDark", color);
            };

            $j.farbtastic($j("<div id='caap_ColorSelectorDiv2'></div>").css({
                background : config.getItem("StyleBackgroundDark", "#B09060"),
                padding    : "5px",
                border     : "2px solid #000",
                top        : (window.innerHeight / 2) - 100 + 'px',
                left       : (window.innerWidth / 2) + 'px',
                zIndex     : '1337',
                position   : 'fixed',
                display    : 'none'
            }).appendTo(document.body), fb2call).setColor(config.getItem("StyleBackgroundDark", "#B09060"));

            return true;
        } catch (err) {
            $u.error("ERROR in AddColorWheels: " + err);
            return false;
        }
    },

    AddDashboard: function () {
        try {
            /*-------------------------------------------------------------------------------------\
             Here is where we construct the HTML for our dashboard. We start by building the outer
             container and position it within the main container.
            \-------------------------------------------------------------------------------------*/
            var layout      = "<div id='caap_top'>",
                displayList = ['Monster', 'Guild Monster', 'Target List', 'Battle Stats', 'User Stats', 'Generals Stats', 'Soldier Stats', 'Item Stats', 'Magic Stats', 'Gifting Stats', 'Gift Queue', 'Arena'],
                styleXY = {
                    x: 0,
                    y: 0
                };

            /*-------------------------------------------------------------------------------------\
            DBDropDown is used to make our drop down boxes for dash board controls.  These require
            slightly different HTML from the side controls.
            \-------------------------------------------------------------------------------------*/
            function DBDropDown(idName, dropDownList, instructions, formatParms) {
                try {
                    var selectedItem = config.getItem(idName, 'defaultValue'),
                        htmlCode     = '',
                        item         = 0,
                        len          = 0;

                    if (selectedItem === 'defaultValue') {
                        selectedItem = config.setItem(idName, dropDownList[0]);
                    }

                    htmlCode = " <select id='caap_" + idName + "' " + formatParms + "'><option>" + selectedItem;
                    for (item = 0, len = dropDownList.length; item < len; item += 1) {
                        if (selectedItem !== dropDownList[item]) {
                            if (instructions) {
                                htmlCode += "<option value='" + dropDownList[item] + "' " + ((instructions[item]) ? " title='" + instructions[item] + "'" : '') + ">"  + dropDownList[item];
                            } else {
                                htmlCode += "<option value='" + dropDownList[item] + "'>" + dropDownList[item];
                            }
                        }
                    }

                    htmlCode += '</select>';
                    return htmlCode;
                } catch (err) {
                    $u.error("ERROR in DBDropDown: " + err);
                    return '';
                }
            }

            /*-------------------------------------------------------------------------------------\
             Next we put in our Refresh Monster List button which will only show when we have
             selected the Monster display.
            \-------------------------------------------------------------------------------------*/
            layout += "<div id='caap_buttonMonster' style='position:absolute;top:0px;left:250px;display:" +
                (config.getItem('DBDisplay', 'Monster') === 'Monster' ? 'block' : 'none') + "'><input type='button' id='caap_refreshMonsters' value='Refresh Monster List' style='padding: 0; font-size: 9px; height: 18px' /></div>";
            /*-------------------------------------------------------------------------------------\
             Next we put in our Refresh Guild Monster List button which will only show when we have
             selected the Guild Monster display.
            \-------------------------------------------------------------------------------------*/
            layout += "<div id='caap_buttonGuildMonster' style='position:absolute;top:0px;left:250px;display:" +
                (config.getItem('DBDisplay', 'Monster') === 'Guild Monster' ? 'block' : 'none') + "'><input type='button' id='caap_refreshGuildMonsters' value='Refresh Guild Monster List' style='padding: 0; font-size: 9px; height: 18px' /></div>";
            /*-------------------------------------------------------------------------------------\
             Next we put in the Clear Target List button which will only show when we have
             selected the Target List display
            \-------------------------------------------------------------------------------------*/
            layout += "<div id='caap_buttonTargets' style='position:absolute;top:0px;left:250px;display:" +
                (config.getItem('DBDisplay', 'Monster') === 'Target List' ? 'block' : 'none') + "'><input type='button' id='caap_clearTargets' value='Clear Targets List' style='padding: 0; font-size: 9px; height: 18px' /></div>";
            /*-------------------------------------------------------------------------------------\
             Next we put in the Clear Battle Stats button which will only show when we have
             selected the Target List display
            \-------------------------------------------------------------------------------------*/
            layout += "<div id='caap_buttonBattle' style='position:absolute;top:0px;left:250px;display:" +
                (config.getItem('DBDisplay', 'Monster') === 'Battle Stats' ? 'block' : 'none') + "'><input type='button' id='caap_clearBattle' value='Clear Battle Stats' style='padding: 0; font-size: 9px; height: 18px' /></div>";
            /*-------------------------------------------------------------------------------------\
             Next we put in the Clear Gifting Stats button which will only show when we have
             selected the Target List display
            \-------------------------------------------------------------------------------------*/
            layout += "<div id='caap_buttonGifting' style='position:absolute;top:0px;left:250px;display:" +
                (config.getItem('DBDisplay', 'Monster') === 'Gifting Stats' ? 'block' : 'none') + "'><input type='button' id='caap_clearGifting' value='Clear Gifting Stats' style='padding: 0; font-size: 9px; height: 18px' /></div>";
            /*-------------------------------------------------------------------------------------\
             Next we put in the Clear Gift Queue button which will only show when we have
             selected the Target List display
            \-------------------------------------------------------------------------------------*/
            layout += "<div id='caap_buttonGiftQueue' style='position:absolute;top:0px;left:250px;display:" +
                (config.getItem('DBDisplay', 'Monster') === 'Gift Queue' ? 'block' : 'none') + "'><input type='button' id='caap_clearGiftQueue' value='Clear Gift Queue' style='padding: 0; font-size: 9px; height: 18px' /></div>";
            /*-------------------------------------------------------------------------------------\
             Next we put in the Advanced Sort Buttons which will only show when we have
             selected the appropriate display
            \-------------------------------------------------------------------------------------*/
            layout += "<div id='caap_buttonSortGenerals' style='position:absolute;top:0px;left:250px;display:" +
                (config.getItem('DBDisplay', 'Monster') === 'Generals Stats' ? 'block' : 'none') + "'><input type='button' id='caap_sortGenerals' value='Advanced Sort' style='padding: 0; font-size: 9px; height: 18px' /></div>";
            layout += "<div id='caap_buttonSortSoldiers' style='position:absolute;top:0px;left:250px;display:" +
                (config.getItem('DBDisplay', 'Monster') === 'Soldiers Stats' ? 'block' : 'none') + "'><input type='button' id='caap_sortSoldiers' value='Advanced Sort' style='padding: 0; font-size: 9px; height: 18px' /></div>";
            layout += "<div id='caap_buttonSortItem' style='position:absolute;top:0px;left:250px;display:" +
                (config.getItem('DBDisplay', 'Monster') === 'Item Stats' ? 'block' : 'none') + "'><input type='button' id='caap_sortItem' value='Advanced Sort' style='padding: 0; font-size: 9px; height: 18px' /></div>";
            layout += "<div id='caap_buttonSortMagic' style='position:absolute;top:0px;left:250px;display:" +
                (config.getItem('DBDisplay', 'Monster') === 'Magic Stats' ? 'block' : 'none') + "'><input type='button' id='caap_sortMagic' value='Advanced Sort' style='padding: 0; font-size: 9px; height: 18px' /></div>";
            /*-------------------------------------------------------------------------------------\
             Then we put in the Live Feed link since we overlay the Castle Age link.
            \-------------------------------------------------------------------------------------*/
            layout += "<div id='caap_buttonFeed' style='position:absolute;top:0px;left:0px;'><input id='caap_liveFeed' type='button' value='LIVE FEED! Your friends are calling.' style='padding: 0; font-size: 9px; height: 18px' /></div>";
            /*-------------------------------------------------------------------------------------\
             We install the display selection box that allows the user to toggle through the
             available displays.
            \-------------------------------------------------------------------------------------*/
            layout += "<div id='caap_DBDisplay' style='font-size: 9px;position:absolute;top:0px;right:5px;'>Display: " +
                DBDropDown('DBDisplay', displayList, '', "style='font-size: 9px; min-width: 120px; max-width: 120px; width : 120px;'") + "</div>";
            /*-------------------------------------------------------------------------------------\
            And here we build our empty content divs.  We display the appropriate div
            depending on which display was selected using the control above
            \-------------------------------------------------------------------------------------*/
            layout += "<div id='caap_infoMonster' style='position:relative;top:15px;width:610px;height:165px;overflow:auto;display:" + (config.getItem('DBDisplay', 'Monster') === 'Monster' ? 'block' : 'none') + "'></div>";
            layout += "<div id='caap_guildMonster' style='position:relative;top:15px;width:610px;height:165px;overflow:auto;display:" + (config.getItem('DBDisplay', 'Monster') === 'Guild Monster' ? 'block' : 'none') + "'></div>";
            layout += "<div id='caap_infoTargets1' style='position:relative;top:15px;width:610px;height:165px;overflow:auto;display:" + (config.getItem('DBDisplay', 'Monster') === 'Target List' ? 'block' : 'none') + "'></div>";
            layout += "<div id='caap_infoBattle' style='position:relative;top:15px;width:610px;height:165px;overflow:auto;display:" + (config.getItem('DBDisplay', 'Monster') === 'Battle Stats' ? 'block' : 'none') + "'></div>";
            layout += "<div id='caap_userStats' style='position:relative;top:15px;width:610px;height:165px;overflow:auto;display:" + (config.getItem('DBDisplay', 'Monster') === 'User Stats' ? 'block' : 'none') + "'></div>";
            layout += "<div id='caap_generalsStats' style='position:relative;top:15px;width:610px;height:165px;overflow:auto;display:" + (config.getItem('DBDisplay', 'Monster') === 'Generals Stats' ? 'block' : 'none') + "'></div>";
            layout += "<div id='caap_soldiersStats' style='position:relative;top:15px;width:610px;height:165px;overflow:auto;display:" + (config.getItem('DBDisplay', 'Monster') === 'Soldier Stats' ? 'block' : 'none') + "'></div>";
            layout += "<div id='caap_itemStats' style='position:relative;top:15px;width:610px;height:165px;overflow:auto;display:" + (config.getItem('DBDisplay', 'Monster') === 'Item Stats' ? 'block' : 'none') + "'></div>";
            layout += "<div id='caap_magicStats' style='position:relative;top:15px;width:610px;height:165px;overflow:auto;display:" + (config.getItem('DBDisplay', 'Monster') === 'Magic Stats' ? 'block' : 'none') + "'></div>";
            layout += "<div id='caap_giftStats' style='position:relative;top:15px;width:610px;height:165px;overflow:auto;display:" + (config.getItem('DBDisplay', 'Monster') === 'Gifting Stats' ? 'block' : 'none') + "'></div>";
            layout += "<div id='caap_giftQueue' style='position:relative;top:15px;width:610px;height:165px;overflow:auto;display:" + (config.getItem('DBDisplay', 'Monster') === 'Gift Queue' ? 'block' : 'none') + "'></div>";
            layout += "<div id='caap_arena' style='position:relative;top:15px;width:610px;height:165px;overflow:auto;display:" + (config.getItem('DBDisplay', 'Monster') === 'Arena' ? 'block' : 'none') + "'></div>";
            layout += "</div>";
            /*-------------------------------------------------------------------------------------\
             No we apply our CSS to our container
            \-------------------------------------------------------------------------------------*/
            caap.dashboardXY.x = state.getItem('caap_top_menuLeft', '');
            caap.dashboardXY.y = state.getItem('caap_top_menuTop', $j(caap.dashboardXY.selector).offset().top - 10);
            styleXY = caap.GetDashboardXY();
            $j(layout).css({
                background              : config.getItem("StyleBackgroundLight", "white"),
                padding                 : "5px",
                height                  : "185px",
                width                   : "610px",
                margin                  : "0 auto",
                opacity                 : config.getItem('StyleOpacityLight', 1),
                top                     : styleXY.y + 'px',
                left                    : styleXY.x + 'px',
                zIndex                  : state.getItem('caap_top_zIndex', 1),
                position                : 'absolute',
                'border-radius'         : '5px'
            }).appendTo(document.body);

            caap.caapTopObject = $j('#caap_top');
            caap.caapTopObject.find("#caap_refreshMonsters").button();
            caap.caapTopObject.find("#caap_refreshGuildMonsters").button();
            caap.caapTopObject.find("#caap_clearTargets").button();
            caap.caapTopObject.find("#caap_clearBattle").button();
            caap.caapTopObject.find("#caap_clearGifting").button();
            caap.caapTopObject.find("#caap_clearGiftQueue").button();
            caap.caapTopObject.find("#caap_liveFeed").button();
            caap.caapTopObject.find("#caap_sortGenerals").button();
            caap.caapTopObject.find("#caap_sortSoldiers").button();
            caap.caapTopObject.find("#caap_sortItem").button();
            caap.caapTopObject.find("#caap_sortMagic").button();
            return true;
        } catch (err) {
            $u.error("ERROR in AddDashboard: " + err);
            return false;
        }
    },

    /////////////////////////////////////////////////////////////////////
    //                      MONSTERS DASHBOARD
    // Display the current monsters and stats
    /////////////////////////////////////////////////////////////////////
    decHours2HoursMin : function (decHours) {
        $u.log(9, "decHours2HoursMin", decHours);
        var hours   = 0,
            minutes = 0;

        hours = Math.floor(decHours);
        minutes = Math.floor((decHours - hours) * 60);
        if (minutes < 10) {
            minutes = '0' + minutes;
        }

        return (hours + ':' + minutes);
    },

    makeCommaValue: function (nStr) {
        nStr += '';
        var x   = nStr.split('.'),
            x1  = x[0],
            rgx = /(\d+)(\d{3})/;

        while (rgx.test(x1)) {
            x1 = x1.replace(rgx, '$1' + ',' + '$2');
        }

        return x1;
    },

    makeTh: function (obj) {
        var header = {text: '', color: '', id: '', title: '', width: ''},
        html       = '<th';

        header = obj;
        if (!header.color) {
            header.color = 'black';
        }

        if (header.id) {
            html += " id='" + header.id + "'";
        }

        if (header.title) {
            html += " title='" + header.title + "'";
        }

        if (header.width) {
            html += " width='" + header.width + "'";
        }

        html += " style='color:" + header.color + ";font-size:10px;font-weight:bold;text-align:left'>" + header.text + "</th>";
        return html;
    },

    makeTd: function (obj) {
        var data = {text: '', color: '', id: '',  title: ''},
            html = '<td';

        data = obj;
        if (!data.color) {
            data.color = 'black';
        }

        if (data.id) {
            html += " id='" + data.id + "'";
        }

        if (data.title) {
            html += " title='" + data.title + "'";
        }

        html += " style='color:" + data.color + ";font-size:10px;text-align:left'>" + data.text + "</td>";
        return html;
    },

    UpdateDashboardWaitLog: true,

    /* This section is formatted to allow Advanced Optimisation by the Closure Compiler */
    /*jslint sub: true */
    UpdateDashboard: function (force) {
        try {
            if (caap.caapTopObject.length === 0) {
                throw "We are missing the Dashboard div!";
            }

            if (!force && !schedule.oneMinuteUpdate('dashboard') && $j('#caap_infoMonster').html()) {
                if (caap.UpdateDashboardWaitLog) {
                    $u.log(3, "Dashboard update is waiting on oneMinuteUpdate");
                    caap.UpdateDashboardWaitLog = false;
                }

                return false;
            }

            $u.log(3, "Updating Dashboard");
            var html                     = '',
                monsterList              = [],
                color                    = '',
                value                    = 0,
                headers                  = [],
                values                   = [],
                generalValues            = [],
                townValues               = [],
                pp                       = 0,
                i                        = 0,
                newTime                  = new Date(),
                count                    = 0,
                monsterObjLink           = '',
                visitMonsterLink         = '',
                visitMonsterInstructions = '',
                removeLink               = '',
                removeLinkInstructions   = '',
                shortMonths              = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                userIdLink               = '',
                userIdLinkInstructions   = '',
                id                       = '',
                title                    = '',
                monsterConditions        = '',
                achLevel                 = 0,
                maxDamage                = 0,
                titleCol                 = 'black',
                valueCol                 = 'red',
                it                       = 0,
                len                      = 0,
                len1                     = 0,
                len2                     = 0,
                str                      = '',
                header                   = {text: '', color: '', id: '', title: '', width: ''},
                data                     = {text: '', color: '', id: '', title: ''},
                width                    = '',
                linkRegExp               = new RegExp("'(http:.+)'"),
                statsRegExp              = new RegExp("caap_.*Stats_"),
                handler                  = function (e) {};

            caap.UpdateDashboardWaitLog = true;
            if (state.getItem("MonsterDashUpdate", true)) {
                html = "<table width='100%' cellpadding='0px' cellspacing='0px'><tr>";
                headers = ['Name', 'Damage', 'Damage%', 'Fort%', 'Stre%', 'TimeLeft', 'T2K', 'Phase', 'Link', '&nbsp;', '&nbsp;'];
                values  = ['name', 'damage', 'life', 'fortify', 'strength', 'time', 't2k', 'phase', 'link'];
                for (pp = 0, len = headers.length; pp < len; pp += 1) {
                    width = '';
                    if (headers[pp] === 'Name') {
                        width = '30%';
                    }

                    html += caap.makeTh({text: headers[pp], color: '', id: '', title: '', width: width});
                }

                html += '</tr>';
                values.shift();
                monster.records.forEach(function (monsterObj) {
                    color = '';
                    html += "<tr>";
                    if (monsterObj['name'] === state.getItem('targetFromfortify', new monster.energyTarget().data)['name']) {
                        color = 'blue';
                    } else if (monsterObj['name'] === state.getItem('targetFromraid', '') || monsterObj['name'] === state.getItem('targetFrombattle_monster', '')) {
                        color = 'green';
                    } else {
                        color = monsterObj['color'];
                    }

                    achLevel = 0;
                    maxDamage = 0;
                    monsterConditions = monsterObj['conditions'];
                    if (monsterConditions) {
                        achLevel = monster.parseCondition('ach', monsterConditions);
                        maxDamage = monster.parseCondition('max', monsterConditions);
                    }

                    monsterObjLink = monsterObj['link'];
                    if (monsterObjLink) {
                        visitMonsterLink = monsterObjLink.replace("&action=doObjective", "").match(linkRegExp);
                        visitMonsterInstructions = "Clicking this link will take you to " + monsterObj['name'];
                        data = {
                            text  : '<span id="caap_monster_' + count + '" title="' + visitMonsterInstructions + '" mname="' + monsterObj['name'] + '" rlink="' + visitMonsterLink[1] +
                                    '" onmouseover="this.style.cursor=\'pointer\';" onmouseout="this.style.cursor=\'default\';">' + monsterObj['name'] + '</span>',
                            color : color,
                            id    : '',
                            title : ''
                        };

                        html += caap.makeTd(data);
                    } else {
                        html += caap.makeTd({text: monsterObj['name'], color: color, id: '', title: ''});
                    }

                    values.forEach(function (displayItem) {
                        id = "caap_" + displayItem + "_" + count;
                        title = '';
                        if (displayItem === 'phase' && color === 'grey') {
                            html += caap.makeTd({text: monsterObj['status'], color: color, id: '', title: ''});
                        } else {
                            value = monsterObj[displayItem];
                            if (value !== '' && (value >= 0 || value.length)) {
                                if (!isNaN(value) && value > 999) {
                                    value = caap.makeCommaValue(value);
                                }

                                switch (displayItem) {
                                case 'damage' :
                                    if (achLevel) {
                                        title = "User Set Monster Achievement: " + caap.makeCommaValue(achLevel);
                                    } else if (config.getItem('AchievementMode', false)) {
                                        if (monster.info[monsterObj['type']]) {
                                            title = "Default Monster Achievement: " + caap.makeCommaValue(monster.info[monsterObj['type']].ach);
                                        }
                                    } else {
                                        title = "Achievement Mode Disabled";
                                    }

                                    if (maxDamage) {
                                        title += " - User Set Max Damage: " + caap.makeCommaValue(maxDamage);
                                    }

                                    break;
                                case 'time' :
                                    if (value && value.length === 3) {
                                        value = value[0] + ":" + value[1];
                                        if (monster.info[monsterObj['type']]) {
                                            title = "Total Monster Duration: " + monster.info[monsterObj['type']].duration + " hours";
                                        }
                                    } else {
                                        value = '';
                                    }

                                    break;
                                case 't2k' :
                                    value = caap.decHours2HoursMin(value);
                                    title = "Estimated Time To Kill: " + value + " hours:mins";
                                    break;
                                case 'life' :
                                    title = "Percentage of monster life remaining: " + value + "%";
                                    break;
                                case 'phase' :
                                    value = value + "/" + monster.info[monsterObj['type']].siege + " need " + monsterObj['miss'];
                                    title = "Siege Phase: " + value + " more clicks";
                                    break;
                                case 'fortify' :
                                    title = "Percentage of party health/monster defense: " + value + "%";
                                    break;
                                case 'strength' :
                                    title = "Percentage of party strength: " + value + "%";
                                    break;
                                default :
                                }

                                html += caap.makeTd({text: value, color: color, id: id, title: title});
                            } else {
                                html += caap.makeTd({text: '', color: color, id: '', title: ''});
                            }
                        }
                    });

                    if (monsterConditions && monsterConditions !== 'none') {
                        data = {
                            text  : '<span title="User Set Conditions: ' + monsterConditions + '" class="ui-icon ui-icon-info">i</span>',
                            color : 'blue',
                            id    : '',
                            title : ''
                        };

                        html += caap.makeTd(data);
                    } else {
                        html += caap.makeTd({text: '', color: color, id: '', title: ''});
                    }

                    if (monsterObjLink) {
                        removeLink = monsterObjLink.replace("casuser", "remove_list").replace("&action=doObjective", "").match(linkRegExp);
                        removeLinkInstructions = "Clicking this link will remove " + monsterObj['name'] + " from both CA and CAAP!";
                        data = {
                            text  : '<span id="caap_remove_' + count + '" title="' + removeLinkInstructions + '" mname="' + monsterObj['name'] + '" rlink="' + removeLink[1] +
                                    '" onmouseover="this.style.cursor=\'pointer\';" onmouseout="this.style.cursor=\'default\';" class="ui-icon ui-icon-circle-close">X</span>',
                            color : 'blue',
                            id    : '',
                            title : ''
                        };

                        html += caap.makeTd(data);
                    } else {
                        html += caap.makeTd({text: '', color: color, id: '', title: ''});
                    }

                    html += '</tr>';
                    count += 1;
                });

                html += '</table>';
                caap.caapTopObject.find("#caap_infoMonster").html(html);

                handler = function (e) {
                    var visitMonsterLink = {
                            mname     : '',
                            rlink     : '',
                            arlink    : ''
                        },
                        i   = 0,
                        len = 0;

                    for (i = 0, len = e.target.attributes.length; i < len; i += 1) {
                        if (e.target.attributes[i].nodeName === 'mname') {
                            visitMonsterLink.mname = e.target.attributes[i].nodeValue;
                        } else if (e.target.attributes[i].nodeName === 'rlink') {
                            visitMonsterLink.rlink = e.target.attributes[i].nodeValue;
                            visitMonsterLink.arlink = visitMonsterLink.rlink.replace("http://apps.facebook.com/castle_age/", "");
                        }
                    }

                    caap.ClickAjaxLinkSend(visitMonsterLink.arlink);
                };

                caap.caapTopObject.find("span[id*='caap_monster_']").unbind('click', handler).click(handler);

                handler = function (e) {
                    var monsterRemove = {
                            mname     : '',
                            rlink     : '',
                            arlink    : ''
                        },
                        i    = 0,
                        len  = 0,
                        resp = false;

                    for (i = 0, len = e.target.attributes.length; i < len; i += 1) {
                        if (e.target.attributes[i].nodeName === 'mname') {
                            monsterRemove.mname = e.target.attributes[i].nodeValue;
                        } else if (e.target.attributes[i].nodeName === 'rlink') {
                            monsterRemove.rlink = e.target.attributes[i].nodeValue;
                            monsterRemove.arlink = monsterRemove.rlink.replace("http://apps.facebook.com/castle_age/", "");
                        }
                    }

                    resp = confirm("Are you sure you want to remove " + monsterRemove.mname + "?");
                    if (resp === true) {
                        monster.deleteItem(monsterRemove.mname);
                        caap.UpdateDashboard(true);
                        caap.ClickGetCachedAjax(monsterRemove.arlink);
                    }
                };

                caap.caapTopObject.find("span[id*='caap_remove_']").unbind('click', handler).click(handler);
                state.setItem("MonsterDashUpdate", false);
            }

            /*-------------------------------------------------------------------------------------\
            Next we build the HTML to be included into the 'caap_guildMonster' div. We set our
            table and then build the header row.
            \-------------------------------------------------------------------------------------*/
            if (state.getItem("GuildMonsterDashUpdate", true)) {
                html = "<table width='100%' cellpadding='0px' cellspacing='0px'><tr>";
                headers = ['Slot', 'Name', 'Damage', 'Damage%',     'My Status', 'TimeLeft', 'Status', 'Link', '&nbsp;'];
                values  = ['slot', 'name', 'damage', 'enemyHealth', 'myStatus',  'ticker',   'state'];
                for (pp = 0; pp < headers.length; pp += 1) {
                    html += caap.makeTh({text: headers[pp], color: '', id: '', title: '', width: ''});
                }

                html += '</tr>';
                for (i = 0, len = guild_monster.records.length; i < len; i += 1) {
                    html += "<tr>";
                    for (pp = 0; pp < values.length; pp += 1) {
                        switch (values[pp]) {
                        case 'name' :
                            data = {
                                text  : '<span id="caap_guildmonster_' + pp + '" title="Clicking this link will take you to (' + guild_monster.records[i]['slot'] + ') ' + guild_monster.records[i]['name'] +
                                        '" mname="' + guild_monster.records[i]['slot'] + '" rlink="guild_battle_monster.php?twt2=' + guild_monster.info[guild_monster.records[i]['name']].twt2 + '&guild_id=' + guild_monster.records[i]['guildId'] +
                                        '&slot=' + guild_monster.records[i]['slot'] + '" onmouseover="this.style.cursor=\'pointer\';" onmouseout="this.style.cursor=\'default\';">' + guild_monster.records[i]['name'] + '</span>',
                                color : guild_monster.records[i]['color'],
                                id    : '',
                                title : ''
                            };

                            html += caap.makeTd(data);
                            break;
                        case 'damage' :
                            if (guild_monster.records[i][values[pp]]) {
                                html += caap.makeTd({text: guild_monster.records[i][values[pp]], color: guild_monster.records[i]['color'], id: '', title: ''});
                            } else {
                                html += caap.makeTd({text: '', color: guild_monster.records[i]['color'], id: '', title: ''});
                            }

                            break;
                        case 'enemyHealth' :
                            if (guild_monster.records[i][values[pp]]) {
                                data = {
                                    text  : guild_monster.records[i][values[pp]],
                                    color : guild_monster.records[i]['color'],
                                    id    : '',
                                    title : ''
                                };

                                html += caap.makeTd(data);
                            } else {
                                html += caap.makeTd({text: '', color: guild_monster.records[i]['color'], id: '', title: ''});
                            }

                            break;
                        case 'ticker' :
                            if (guild_monster.records[i][values[pp]]) {
                                data = {
                                    text  : guild_monster.records[i][values[pp]].match(/(\d+:\d+):\d+/)[1],
                                    color : guild_monster.records[i]['color'],
                                    id    : '',
                                    title : ''
                                };

                                html += caap.makeTd(data);
                            } else {
                                html += caap.makeTd({text: '', color: guild_monster.records[i]['color'], id: '', title: ''});
                            }

                            break;
                        default :
                            html += caap.makeTd({text: guild_monster.records[i][values[pp]], color: guild_monster.records[i]['color'], id: '', title: ''});
                        }
                    }

                    data = {
                        text  : '<a href="http://apps.facebook.com/castle_age/guild_battle_monster.php?twt2=' + guild_monster.info[guild_monster.records[i]['name']].twt2 +
                                '&guild_id=' + guild_monster.records[i]['guildId'] + '&action=doObjective&slot=' + guild_monster.records[i]['slot'] + '&ref=nf">Link</a>',
                        color : 'blue',
                        id    : '',
                        title : 'This is a siege link.'
                    };

                    html += caap.makeTd(data);

                    if (guild_monster.records[i]['conditions'] && guild_monster.records[i]['conditions'] !== 'none') {
                        data = {
                            text  : '<span title="User Set Conditions: ' + guild_monster.records[i]['conditions'] + '" class="ui-icon ui-icon-info">i</span>',
                            color : guild_monster.records[i]['color'],
                            id    : '',
                            title : ''
                        };

                        html += caap.makeTd(data);
                    } else {
                        html += caap.makeTd({text: '', color: color, id: '', title: ''});
                    }

                    html += '</tr>';
                }

                html += '</table>';
                caap.caapTopObject.find("#caap_guildMonster").html(html);

                handler = function (e) {
                    var visitMonsterLink = {
                            mname     : '',
                            arlink    : ''
                        },
                        i   = 0,
                        len = 0;

                    for (i = 0, len = e.target.attributes.length; i < len; i += 1) {
                        if (e.target.attributes[i].nodeName === 'mname') {
                            visitMonsterLink.mname = e.target.attributes[i].nodeValue;
                        } else if (e.target.attributes[i].nodeName === 'rlink') {
                            visitMonsterLink.arlink = e.target.attributes[i].nodeValue;
                        }
                    }

                    caap.ClickAjaxLinkSend(visitMonsterLink.arlink);
                };

                caap.caapTopObject.find("span[id*='caap_guildmonster_']").unbind('click', handler).click(handler);

                state.setItem("GuildMonsterDashUpdate", false);
            }

            /*-------------------------------------------------------------------------------------\
            Next we build the HTML to be included into the 'caap_arena' div. We set our
            table and then build the header row.
            \-------------------------------------------------------------------------------------*/
            if (state.getItem("ArenaDashUpdate", true)) {
                html = "<table width='100%' cellpadding='0px' cellspacing='0px'><tr>";
                headers = ['Arena', 'Damage', 'Team%',      'Enemy%',      'My Status', 'TimeLeft', 'Status'];
                values  = ['damage', 'teamHealth', 'enemyHealth', 'myStatus',  'ticker',   'state'];
                for (pp = 0; pp < headers.length; pp += 1) {
                    html += caap.makeTh({text: headers[pp], color: '', id: '', title: '', width: ''});
                }

                html += '</tr>';
                for (i = 0, len = arena.records.length; i < len; i += 1) {
                    html += "<tr>";
                    data = {
                        text  : '<span id="caap_arena_1" title="Clicking this link will take you to the Arena" rlink="arena.php" onmouseover="this.style.cursor=\'pointer\';" onmouseout="this.style.cursor=\'default\';">Arena</span>',
                        color : 'blue',
                        id    : '',
                        title : ''
                    };

                    html += caap.makeTd(data);
                    for (pp = 0; pp < values.length; pp += 1) {
                        switch (values[pp]) {
                        case 'damage' :
                            if (arena.records[i][values[pp]]) {
                                html += caap.makeTd({text: arena.records[i][values[pp]], color: '', id: '', title: ''});
                            } else {
                                html += caap.makeTd({text: '', color: '', id: '', title: ''});
                            }

                            break;
                        case 'enemyHealth' :
                            if (arena.records[i][values[pp]]) {
                                data = {
                                    text  : arena.records[i][values[pp]],
                                    color : '',
                                    id    : '',
                                    title : ''
                                };

                                html += caap.makeTd(data);
                            } else {
                                html += caap.makeTd({text: '', color: arena.records[i]['color'], id: '', title: ''});
                            }

                            break;
                        case 'teamHealth' :
                            if (arena.records[i][values[pp]]) {
                                data = {
                                    text  : arena.records[i][values[pp]],
                                    color : '',
                                    id    : '',
                                    title : ''
                                };

                                html += caap.makeTd(data);
                            } else {
                                html += caap.makeTd({text: '', color: arena.records[i]['color'], id: '', title: ''});
                            }

                            break;
                        case 'ticker' :
                            if (arena.records[i][values[pp]]) {
                                data = {
                                    text  : arena.records[i][values[pp]].match(/(\d+:\d+):\d+/)[1],
                                    color : '',
                                    id    : '',
                                    title : ''
                                };

                                html += caap.makeTd(data);
                            } else {
                                html += caap.makeTd({text: '', color: '', id: '', title: ''});
                            }

                            break;
                        default :
                            html += caap.makeTd({text: arena.records[i][values[pp]], color: '', id: '', title: ''});
                        }
                    }

                    html += '</tr>';
                }

                html += '</table>';
                caap.caapTopObject.find("#caap_arena").html(html);

                handler = function (e) {
                    var visitMonsterLink = {
                            mname     : '',
                            arlink    : ''
                        },
                        i   = 0,
                        len = 0;

                    for (i = 0, len = e.target.attributes.length; i < len; i += 1) {
                        if (e.target.attributes[i].nodeName === 'mname') {
                            visitMonsterLink.mname = e.target.attributes[i].nodeValue;
                        } else if (e.target.attributes[i].nodeName === 'rlink') {
                            visitMonsterLink.arlink = e.target.attributes[i].nodeValue;
                        }
                    }

                    caap.ClickAjaxLinkSend(visitMonsterLink.arlink);
                };

                caap.caapTopObject.find("span[id='caap_arena_1']").unbind('click', handler).click(handler);

                state.setItem("ArenaDashUpdate", false);
            }

            /*-------------------------------------------------------------------------------------\
            Next we build the HTML to be included into the 'caap_infoTargets1' div. We set our
            table and then build the header row.
            \-------------------------------------------------------------------------------------*/
            if (state.getItem("ReconDashUpdate", true)) {
                html = "<table width='100%' cellpadding='0px' cellspacing='0px'><tr>";
                headers = ['UserId', 'Name',    'Deity#',   'Rank',    'Rank#',   'Level',    'Army',    'Last Alive'];
                values  = ['userID', 'nameStr', 'deityNum', 'rankStr', 'rankNum', 'levelNum', 'armyNum', 'aliveTime'];
                for (pp = 0; pp < headers.length; pp += 1) {
                    html += caap.makeTh({text: headers[pp], color: '', id: '', title: '', width: ''});
                }

                html += '</tr>';
                for (i = 0, len = caap.ReconRecordArray.length; i < len; i += 1) {
                    html += "<tr>";
                    for (pp = 0; pp < values.length; pp += 1) {
                        if (/userID/.test(values[pp])) {
                            userIdLinkInstructions = "Clicking this link will take you to the user keep of " + caap.ReconRecordArray[i][values[pp]];
                            userIdLink = "http://apps.facebook.com/castle_age/keep.php?casuser=" + caap.ReconRecordArray[i][values[pp]];
                            data = {
                                text  : '<span id="caap_targetrecon_' + i + '" title="' + userIdLinkInstructions + '" rlink="' + userIdLink +
                                        '" onmouseover="this.style.cursor=\'pointer\';" onmouseout="this.style.cursor=\'default\';">' + caap.ReconRecordArray[i][values[pp]] + '</span>',
                                color : 'blue',
                                id    : '',
                                title : ''
                            };

                            html += caap.makeTd(data);
                        } else if (/\S+Num/.test(values[pp])) {
                            html += caap.makeTd({text: caap.ReconRecordArray[i][values[pp]], color: 'black', id: '', title: ''});
                        } else if (/\S+Time/.test(values[pp])) {
                            newTime = new Date(caap.ReconRecordArray[i][values[pp]]);
                            data = {
                                text  : newTime.getDate() + '-' + shortMonths[newTime.getMonth()] + ' ' + newTime.getHours() + ':' + (newTime.getMinutes() < 10 ? '0' : '') + newTime.getMinutes(),
                                color : 'black',
                                id    : '',
                                title : ''
                            };

                            html += caap.makeTd(data);
                        } else {
                            html += caap.makeTd({text: caap.ReconRecordArray[i][values[pp]], color: 'black', id: '', title: ''});
                        }
                    }

                    html += '</tr>';
                }

                html += '</table>';
                caap.caapTopObject.find("#caap_infoTargets1").html(html);

                handler = function (e) {
                    var visitUserIdLink = {
                            rlink     : '',
                            arlink    : ''
                        },
                        i   = 0,
                        len = 0;

                    for (i = 0, len = e.target.attributes.length; i < len; i += 1) {
                        if (e.target.attributes[i].nodeName === 'rlink') {
                            visitUserIdLink.rlink = e.target.attributes[i].nodeValue;
                            visitUserIdLink.arlink = visitUserIdLink.rlink.replace("http://apps.facebook.com/castle_age/", "");
                        }
                    }

                    caap.ClickAjaxLinkSend(visitUserIdLink.arlink);
                };

                caap.caapTopObject.find("span[id*='caap_targetrecon_']").unbind('click', handler).click(handler);
                state.setItem("ReconDashUpdate", false);
            }

            /*-------------------------------------------------------------------------------------\
            Next we build the HTML to be included into the 'caap_infoBattle' div. We set our
            table and then build the header row.
            \-------------------------------------------------------------------------------------*/
            if (state.getItem("BattleDashUpdate", true)) {
                html = "<table width='100%' cellpadding='0px' cellspacing='0px'><tr>";
                headers = ['UserId', 'Name',    'BR#',     'WR#',        'Level',    'Army',    'I Win',         'I Lose',          'D Win',       'D Lose',        'W Win',      'W Lose'];
                values  = ['userId', 'nameStr', 'rankNum', 'warRankNum', 'levelNum', 'armyNum', 'invadewinsNum', 'invadelossesNum', 'duelwinsNum', 'duellossesNum', 'warwinsNum', 'warlossesNum'];
                for (pp = 0; pp < headers.length; pp += 1) {
                    html += caap.makeTh({text: headers[pp], color: '', id: '', title: '', width: ''});
                }

                html += '</tr>';
                for (i = 0, len = battle.records.length; i < len; i += 1) {
                    html += "<tr>";
                    for (pp = 0, len1 = values.length; pp < len1; pp += 1) {
                        if (/userId/.test(values[pp])) {
                            userIdLinkInstructions = "Clicking this link will take you to the user keep of " + battle.records[i][values[pp]];
                            userIdLink = "http://apps.facebook.com/castle_age/keep.php?casuser=" + battle.records[i][values[pp]];
                            data = {
                                text  : '<span id="caap_battle_' + i + '" title="' + userIdLinkInstructions + '" rlink="' + userIdLink +
                                        '" onmouseover="this.style.cursor=\'pointer\';" onmouseout="this.style.cursor=\'default\';">' + battle.records[i][values[pp]] + '</span>',
                                color : 'blue',
                                id    : '',
                                title : ''
                            };

                            html += caap.makeTd(data);
                        } else if (/rankNum/.test(values[pp])) {
                            html += caap.makeTd({text: battle.records[i][values[pp]], color: 'black', id: '', title: battle.records[i]['rankStr']});
                        } else if (/warRankNum/.test(values[pp])) {
                            html += caap.makeTd({text: battle.records[i][values[pp]], color: 'black', id: '', title: battle.records[i]['warRankStr']});
                        } else {
                            html += caap.makeTd({text: battle.records[i][values[pp]], color: 'black', id: '', title: ''});
                        }
                    }

                    html += '</tr>';
                }

                html += '</table>';
                caap.caapTopObject.find("#caap_infoBattle").html(html);

                caap.caapTopObject.find("span[id*='caap_battle_']").click(function (e) {
                    var visitUserIdLink = {
                            rlink     : '',
                            arlink    : ''
                        },
                        i   = 0,
                        len = 0;

                    for (i = 0, len = e.target.attributes.length; i < len; i += 1) {
                        if (e.target.attributes[i].nodeName === 'rlink') {
                            visitUserIdLink.rlink = e.target.attributes[i].nodeValue;
                            visitUserIdLink.arlink = visitUserIdLink.rlink.replace("http://apps.facebook.com/castle_age/", "");
                        }
                    }

                    caap.ClickAjaxLinkSend(visitUserIdLink.arlink);
                });

                state.setItem("BattleDashUpdate", false);
            }

            /*-------------------------------------------------------------------------------------\
            Next we build the HTML to be included into the 'caap_userStats' div. We set our
            table and then build the header row.
            \-------------------------------------------------------------------------------------*/
            if (state.getItem("UserDashUpdate", true)) {
                html = "<table width='100%' cellpadding='0px' cellspacing='0px'><tr>";
                headers = ['Name', 'Value', 'Name', 'Value'];
                for (pp = 0, len = headers.length; pp < len; pp += 1) {
                    html += caap.makeTh({text: headers[pp], color: '', id: '', title: '', width: ''});
                }

                html += '</tr>';

                html += "<tr>";
                html += caap.makeTd({text: 'Facebook ID', color: titleCol, id: '', title: ''});
                html += caap.makeTd({text: caap.stats['FBID'], color: valueCol, id: '', title: ''});
                html += caap.makeTd({text: 'Account Name', color: titleCol, id: '', title: ''});
                html += caap.makeTd({text: caap.stats['account'], color: valueCol, id: '', title: ''});
                html += '</tr>';

                html += "<tr>";
                html += caap.makeTd({text: '&nbsp;', color: titleCol, id: '', title: ''});
                html += caap.makeTd({text: '&nbsp;', color: valueCol, id: '', title: ''});
                html += caap.makeTd({text: '&nbsp;', color: titleCol, id: '', title: ''});
                html += caap.makeTd({text: '&nbsp;', color: valueCol, id: '', title: ''});
                html += '</tr>';

                html += "<tr>";
                html += caap.makeTd({text: 'Character Name', color: titleCol, id: '', title: ''});
                html += caap.makeTd({text: caap.stats['PlayerName'], color: valueCol, id: '', title: ''});
                html += caap.makeTd({text: 'Energy', color: titleCol, id: '', title: 'Current/Max'});
                html += caap.makeTd({text: caap.stats['energy']['num'] + '/' + caap.stats['energy']['max'], color: valueCol, id: '', title: ''});
                html += '</tr>';

                html += "<tr>";
                html += caap.makeTd({text: 'Level', color: titleCol, id: '', title: ''});
                html += caap.makeTd({text: caap.stats['level'], color: valueCol, id: '', title: ''});
                html += caap.makeTd({text: 'Stamina', color: titleCol, id: '', title: 'Current/Max'});
                html += caap.makeTd({text: caap.stats['stamina']['num'] + '/' + caap.stats['stamina']['max'], color: valueCol, id: '', title: ''});
                html += '</tr>';

                html += "<tr>";
                html += caap.makeTd({text: 'Battle Rank', color: titleCol, id: '', title: ''});
                html += caap.makeTd({text: battle.battleRankTable[caap.stats['rank']['battle']] + ' (' + caap.stats['rank']['battle'] + ')', color: valueCol, id: '', title: ''});
                html += caap.makeTd({text: 'Attack', color: titleCol, id: '', title: 'Current/Max'});
                html += caap.makeTd({text: caap.makeCommaValue(caap.stats['attack']), color: valueCol, id: '', title: ''});
                html += '</tr>';

                html += "<tr>";
                html += caap.makeTd({text: 'Battle Rank Points', color: titleCol, id: '', title: ''});
                html += caap.makeTd({text: caap.makeCommaValue(caap.stats['rank']['battlePoints']), color: valueCol, id: '', title: ''});
                html += caap.makeTd({text: 'Defense', color: titleCol, id: '', title: ''});
                html += caap.makeTd({text: caap.makeCommaValue(caap.stats['defense']), color: valueCol, id: '', title: ''});
                html += '</tr>';

                html += "<tr>";
                html += caap.makeTd({text: 'War Rank', color: titleCol, id: '', title: ''});
                html += caap.makeTd({text: battle.warRankTable[caap.stats['rank']['war']] + ' (' + caap.stats['rank']['war'] + ')', color: valueCol, id: '', title: ''});
                html += caap.makeTd({text: 'Health', color: titleCol, id: '', title: 'Current/Max'});
                html += caap.makeTd({text: caap.stats['health']['num'] + '/' + caap.stats['health']['max'], color: valueCol, id: '', title: ''});
                html += '</tr>';

                html += "<tr>";
                html += caap.makeTd({text: 'War Rank Points', color: titleCol, id: '', title: ''});
                html += caap.makeTd({text: caap.makeCommaValue(caap.stats['rank']['warPoints']), color: valueCol, id: '', title: ''});
                html += caap.makeTd({text: 'Army', color: titleCol, id: '', title: ''});
                html += caap.makeTd({text: caap.makeCommaValue(caap.stats['army']['actual']), color: valueCol, id: '', title: ''});
                html += '</tr>';

                html += "<tr>";
                html += caap.makeTd({text: '&nbsp;', color: titleCol, id: '', title: ''});
                html += caap.makeTd({text: '&nbsp;', color: valueCol, id: '', title: ''});
                html += caap.makeTd({text: 'Generals', color: titleCol, id: '', title: ''});
                html += caap.makeTd({text: caap.stats['generals']['total'], color: valueCol, id: '', title: ''});
                html += '</tr>';

                html += "<tr>";
                html += caap.makeTd({text: '&nbsp;', color: titleCol, id: '', title: ''});
                html += caap.makeTd({text: '&nbsp;', color: valueCol, id: '', title: ''});
                html += caap.makeTd({text: 'Generals When Invade', color: titleCol, id: '', title: 'For every 5 army members you have, one of your generals will also join the fight.'});
                html += caap.makeTd({text: caap.stats['generals']['invade'], color: valueCol, id: '', title: ''});
                html += '</tr>';

                html += "<tr>";
                html += caap.makeTd({text: '&nbsp;', color: titleCol, id: '', title: ''});
                html += caap.makeTd({text: '&nbsp;', color: valueCol, id: '', title: ''});
                html += caap.makeTd({text: '&nbsp;', color: titleCol, id: '', title: ''});
                html += caap.makeTd({text: '&nbsp;', color: valueCol, id: '', title: ''});
                html += '</tr>';

                html += "<tr>";
                html += caap.makeTd({text: 'Gold In Bank', color: titleCol, id: '', title: ''});
                html += caap.makeTd({text: '$' + caap.makeCommaValue(caap.stats['gold']['bank']), color: valueCol, id: '', title: ''});
                html += caap.makeTd({text: 'Total Income Per Hour', color: titleCol, id: '', title: ''});
                html += caap.makeTd({text: '$' + caap.makeCommaValue(caap.stats['gold']['income']), color: valueCol, id: '', title: ''});
                html += '</tr>';

                html += "<tr>";
                html += caap.makeTd({text: 'Gold In Cash', color: titleCol, id: '', title: ''});
                html += caap.makeTd({text: '$' + caap.makeCommaValue(caap.stats['gold']['cash']), color: valueCol, id: '', title: ''});
                html += caap.makeTd({text: 'Upkeep', color: titleCol, id: '', title: ''});
                html += caap.makeTd({text: '$' + caap.makeCommaValue(caap.stats['gold']['upkeep']), color: valueCol, id: '', title: ''});
                html += '</tr>';

                html += "<tr>";
                html += caap.makeTd({text: 'Total Gold', color: titleCol, id: '', title: ''});
                html += caap.makeTd({text: '$' + caap.makeCommaValue(caap.stats['gold']['total']), color: valueCol, id: '', title: ''});
                html += caap.makeTd({text: 'Cash Flow Per Hour', color: titleCol, id: '', title: ''});
                html += caap.makeTd({text: '$' + caap.makeCommaValue(caap.stats['gold']['flow']), color: valueCol, id: '', title: ''});
                html += '</tr>';

                html += "<tr>";
                html += caap.makeTd({text: '&nbsp;', color: titleCol, id: '', title: ''});
                html += caap.makeTd({text: '&nbsp;', color: valueCol, id: '', title: ''});
                html += caap.makeTd({text: '&nbsp;', color: titleCol, id: '', title: ''});
                html += caap.makeTd({text: '&nbsp;', color: valueCol, id: '', title: ''});
                html += '</tr>';

                html += "<tr>";
                html += caap.makeTd({text: 'Skill Points', color: titleCol, id: '', title: ''});
                html += caap.makeTd({text: caap.stats['points']['skill'], color: valueCol, id: '', title: ''});
                html += caap.makeTd({text: 'Energy Potions', color: titleCol, id: '', title: ''});
                html += caap.makeTd({text: caap.stats['potions']['energy'], color: valueCol, id: '', title: ''});
                html += '</tr>';

                html += "<tr>";
                html += caap.makeTd({text: 'Favor Points', color: titleCol, id: '', title: ''});
                html += caap.makeTd({text: caap.stats['points']['favor'], color: valueCol, id: '', title: ''});
                html += caap.makeTd({text: 'Stamina Potions', color: titleCol, id: '', title: ''});
                html += caap.makeTd({text: caap.stats['potions']['stamina'], color: valueCol, id: '', title: ''});
                html += '</tr>';

                html += "<tr>";
                html += caap.makeTd({text: '&nbsp;', color: titleCol, id: '', title: ''});
                html += caap.makeTd({text: '&nbsp;', color: valueCol, id: '', title: ''});
                html += caap.makeTd({text: '&nbsp;', color: titleCol, id: '', title: ''});
                html += caap.makeTd({text: '&nbsp;', color: valueCol, id: '', title: ''});
                html += '</tr>';

                html += "<tr>";
                html += caap.makeTd({text: 'Experience To Next Level (ETNL)', color: titleCol, id: '', title: ''});
                html += caap.makeTd({text: caap.makeCommaValue(caap.stats['exp']['dif']), color: valueCol, id: '', title: ''});
                html += caap.makeTd({text: 'Battle Strength Index (BSI)', color: titleCol, id: '', title: ''});
                html += caap.makeTd({text: caap.stats['indicators']['bsi'], color: valueCol, id: '', title: ''});
                html += '</tr>';

                html += "<tr>";
                html += caap.makeTd({text: 'Hours To Level (HTL)', color: titleCol, id: '', title: ''});
                html += caap.makeTd({text: caap.decHours2HoursMin(caap.stats['indicators']['htl']), color: valueCol, id: '', title: ''});
                html += caap.makeTd({text: 'Levelling Speed Index (LSI)', color: titleCol, id: '', title: ''});
                html += caap.makeTd({text: caap.stats['indicators']['lsi'], color: valueCol, id: '', title: ''});
                html += '</tr>';

                html += "<tr>";
                html += caap.makeTd({text: 'Hours Remaining To Level (HRTL)', color: titleCol, id: '', title: ''});
                html += caap.makeTd({text: caap.decHours2HoursMin(caap.stats['indicators']['hrtl']), color: valueCol, id: '', title: ''});
                html += caap.makeTd({text: 'Skill Points Per Level (SPPL)', color: titleCol, id: '', title: ''});
                html += caap.makeTd({text: caap.stats['indicators']['sppl'], color: valueCol, id: '', title: ''});
                html += '</tr>';

                html += "<tr>";
                html += caap.makeTd({text: 'Expected Next Level (ENL)', color: titleCol, id: '', title: ''});
                html += caap.makeTd({text: schedule.FormatTime(new Date(caap.stats['indicators']['enl'])), color: valueCol, id: '', title: ''});
                html += caap.makeTd({text: 'Attack Power Index (API)', color: titleCol, id: '', title: ''});
                html += caap.makeTd({text: caap.stats['indicators']['api'], color: valueCol, id: '', title: ''});
                html += '</tr>';

                html += "<tr>";
                html += caap.makeTd({text: '&nbsp;', color: titleCol, id: '', title: ''});
                html += caap.makeTd({text: '&nbsp;', color: valueCol, id: '', title: ''});
                html += caap.makeTd({text: 'Defense Power Index (DPI)', color: titleCol, id: '', title: ''});
                html += caap.makeTd({text: caap.stats['indicators']['dpi'], color: valueCol, id: '', title: ''});
                html += '</tr>';

                html += "<tr>";
                html += caap.makeTd({text: '&nbsp;', color: titleCol, id: '', title: ''});
                html += caap.makeTd({text: '&nbsp;', color: valueCol, id: '', title: ''});
                html += caap.makeTd({text: 'Mean Power Index (MPI)', color: titleCol, id: '', title: ''});
                html += caap.makeTd({text: caap.stats['indicators']['mpi'], color: valueCol, id: '', title: ''});
                html += '</tr>';

                html += "<tr>";
                html += caap.makeTd({text: '&nbsp;', color: titleCol, id: '', title: ''});
                html += caap.makeTd({text: '&nbsp;', color: valueCol, id: '', title: ''});
                html += caap.makeTd({text: '&nbsp;', color: titleCol, id: '', title: ''});
                html += caap.makeTd({text: '&nbsp;', color: valueCol, id: '', title: ''});
                html += '</tr>';

                html += "<tr>";
                html += caap.makeTd({text: 'Battles/Wars Won', color: titleCol, id: '', title: ''});
                html += caap.makeTd({text: caap.makeCommaValue(caap.stats['other']['bww']), color: valueCol, id: '', title: ''});
                html += caap.makeTd({text: 'Times eliminated', color: titleCol, id: '', title: ''});
                html += caap.makeTd({text: caap.makeCommaValue(caap.stats['other']['te']), color: valueCol, id: '', title: ''});
                html += '</tr>';

                html += "<tr>";
                html += caap.makeTd({text: 'Battles/Wars Lost', color: titleCol, id: '', title: ''});
                html += caap.makeTd({text: caap.makeCommaValue(caap.stats['other']['bwl']), color: valueCol, id: '', title: ''});
                html += caap.makeTd({text: 'Times you eliminated an enemy', color: titleCol, id: '', title: ''});
                html += caap.makeTd({text: caap.makeCommaValue(caap.stats['other']['tee']), color: valueCol, id: '', title: ''});
                html += '</tr>';

                html += "<tr>";
                html += caap.makeTd({text: 'Battles/Wars Win/Loss Ratio (WLR)', color: titleCol, id: '', title: ''});
                html += caap.makeTd({text: caap.stats['other']['wlr'], color: valueCol, id: '', title: ''});
                html += caap.makeTd({text: 'Enemy Eliminated/Eliminated Ratio (EER)', color: titleCol, id: '', title: ''});
                html += caap.makeTd({text: caap.stats['other']['eer'], color: valueCol, id: '', title: ''});
                html += '</tr>';

                html += "<tr>";
                html += caap.makeTd({text: '&nbsp;', color: titleCol, id: '', title: ''});
                html += caap.makeTd({text: '&nbsp;', color: valueCol, id: '', title: ''});
                html += caap.makeTd({text: '&nbsp;', color: titleCol, id: '', title: ''});
                html += caap.makeTd({text: '&nbsp;', color: valueCol, id: '', title: ''});
                html += '</tr>';

                html += "<tr>";
                html += caap.makeTd({text: 'Invasions Won', color: titleCol, id: '', title: ''});
                html += caap.makeTd({text: caap.makeCommaValue(caap.stats['achievements']['battle']['invasions']['won']), color: valueCol, id: '', title: ''});
                html += caap.makeTd({text: 'Duels Won', color: titleCol, id: '', title: ''});
                html += caap.makeTd({text: caap.makeCommaValue(caap.stats['achievements']['battle']['duels']['won']), color: valueCol, id: '', title: ''});
                html += '</tr>';

                html += "<tr>";
                html += caap.makeTd({text: 'Invasions Lost', color: titleCol, id: '', title: ''});
                html += caap.makeTd({text: caap.makeCommaValue(caap.stats['achievements']['battle']['invasions']['lost']), color: valueCol, id: '', title: ''});
                html += caap.makeTd({text: 'Duels Lost', color: titleCol, id: '', title: ''});
                html += caap.makeTd({text: caap.makeCommaValue(caap.stats['achievements']['battle']['duels']['lost']), color: valueCol, id: '', title: ''});
                html += '</tr>';

                html += "<tr>";
                html += caap.makeTd({text: 'Invasions Streak', color: titleCol, id: '', title: ''});
                html += caap.makeTd({text: caap.makeCommaValue(caap.stats['achievements']['battle']['invasions']['streak']), color: valueCol, id: '', title: ''});
                html += caap.makeTd({text: 'Duels Streak', color: titleCol, id: '', title: ''});
                html += caap.makeTd({text: caap.makeCommaValue(caap.stats['achievements']['battle']['duels']['streak']), color: valueCol, id: '', title: ''});
                html += '</tr>';

                html += "<tr>";
                html += caap.makeTd({text: 'Invasions Win/loss Ratio (IWLR)', color: titleCol, id: '', title: ''});
                if (caap.stats['achievements']['battle']['invasions']['ratio']) {
                    html += caap.makeTd({text: caap.stats['achievements']['battle']['invasions']['ratio'], color: valueCol, id: '', title: ''});
                } else {
                    html += caap.makeTd({text: caap.stats['achievements']['battle']['invasions']['ratio'], color: valueCol, id: '', title: ''});
                }

                html += caap.makeTd({text: 'Duels Win/loss Ratio (DWLR)', color: titleCol, id: '', title: ''});
                if (caap.stats['achievements']['battle']['duels']['ratio']) {
                    html += caap.makeTd({text: caap.stats['achievements']['battle']['duels']['ratio'], color: valueCol, id: '', title: ''});
                } else {
                    html += caap.makeTd({text: caap.stats['achievements']['battle']['duels']['ratio'], color: valueCol, id: '', title: ''});
                }

                html += '</tr>';

                html += "<tr>";
                html += caap.makeTd({text: '&nbsp;', color: titleCol, id: '', title: ''});
                html += caap.makeTd({text: '&nbsp;', color: valueCol, id: '', title: ''});
                html += caap.makeTd({text: '&nbsp;', color: titleCol, id: '', title: ''});
                html += caap.makeTd({text: '&nbsp;', color: valueCol, id: '', title: ''});
                html += '</tr>';

                html += "<tr>";
                html += caap.makeTd({text: 'Quests Completed', color: titleCol, id: '', title: ''});
                html += caap.makeTd({text: caap.makeCommaValue(caap.stats['other']['qc']), color: valueCol, id: '', title: ''});
                html += caap.makeTd({text: 'Alchemy Performed', color: titleCol, id: '', title: ''});
                html += caap.makeTd({text: caap.makeCommaValue(caap.stats['achievements']['other']['alchemy']), color: valueCol, id: '', title: ''});
                html += '</tr>';

                html += "<tr>";
                html += caap.makeTd({text: '&nbsp;', color: titleCol, id: '', title: ''});
                html += caap.makeTd({text: '&nbsp;', color: valueCol, id: '', title: ''});
                html += caap.makeTd({text: '&nbsp;', color: titleCol, id: '', title: ''});
                html += caap.makeTd({text: '&nbsp;', color: valueCol, id: '', title: ''});
                html += '</tr>';

                html += "<tr>";
                html += caap.makeTd({text: 'Gildamesh, The Orc King Slain', color: titleCol, id: '', title: ''});
                html += caap.makeTd({text: caap.makeCommaValue(caap.stats['achievements']['monster']['gildamesh']), color: valueCol, id: '', title: ''});
                html += caap.makeTd({text: 'Lotus Ravenmoore Slain', color: titleCol, id: '', title: ''});
                html += caap.makeTd({text: caap.makeCommaValue(caap.stats['achievements']['monster']['lotus']), color: valueCol, id: '', title: ''});
                html += '</tr>';

                html += "<tr>";
                html += caap.makeTd({text: 'The Colossus of Terra Slain', color: titleCol, id: '', title: ''});
                html += caap.makeTd({text: caap.makeCommaValue(caap.stats['achievements']['monster']['colossus']), color: valueCol, id: '', title: ''});
                html += caap.makeTd({text: 'Dragons Slain', color: titleCol, id: '', title: ''});
                html += caap.makeTd({text: caap.makeCommaValue(caap.stats['achievements']['monster']['dragons']), color: valueCol, id: '', title: ''});
                html += '</tr>';

                html += "<tr>";
                html += caap.makeTd({text: 'Sylvanas the Sorceress Queen Slain', color: titleCol, id: '', title: ''});
                html += caap.makeTd({text: caap.makeCommaValue(caap.stats['achievements']['monster']['sylvanas']), color: valueCol, id: '', title: ''});
                html += caap.makeTd({text: 'Cronus, The World Hydra Slain', color: titleCol, id: '', title: ''});
                html += caap.makeTd({text: caap.makeCommaValue(caap.stats['achievements']['monster']['cronus']), color: valueCol, id: '', title: ''});
                html += '</tr>';

                html += "<tr>";
                html += caap.makeTd({text: 'Keira the Dread Knight Slain', color: titleCol, id: '', title: ''});
                html += caap.makeTd({text: caap.makeCommaValue(caap.stats['achievements']['monster']['keira']), color: valueCol, id: '', title: ''});
                html += caap.makeTd({text: 'The Battle of the Dark Legion Slain', color: titleCol, id: '', title: ''});
                html += caap.makeTd({text: caap.makeCommaValue(caap.stats['achievements']['monster']['legion']), color: valueCol, id: '', title: ''});
                html += '</tr>';

                html += "<tr>";
                html += caap.makeTd({text: 'Genesis, The Earth Elemental Slain', color: titleCol, id: '', title: ''});
                html += caap.makeTd({text: caap.makeCommaValue(caap.stats['achievements']['monster']['genesis']), color: valueCol, id: '', title: ''});
                html += caap.makeTd({text: 'Skaar Deathrune Slain', color: titleCol, id: '', title: ''});
                html += caap.makeTd({text: caap.makeCommaValue(caap.stats['achievements']['monster']['skaar']), color: valueCol, id: '', title: ''});
                html += '</tr>';

                html += "<tr>";
                html += caap.makeTd({text: 'Gehenna, The Fire Elemental Slain', color: titleCol, id: '', title: ''});
                html += caap.makeTd({text: caap.makeCommaValue(caap.stats['achievements']['monster']['gehenna']), color: valueCol, id: '', title: ''});
                html += caap.makeTd({text: 'Sieges Assisted With', color: titleCol, id: '', title: ''});
                html += caap.makeTd({text: caap.makeCommaValue(caap.stats['achievements']['monster']['sieges']), color: valueCol, id: '', title: ''});
                html += '</tr>';

                html += "<tr>";
                html += caap.makeTd({text: "Aurelius, Lion's Rebellion", color: titleCol, id: '', title: ''});
                html += caap.makeTd({text: caap.makeCommaValue(caap.stats['achievements']['monster']['aurelius']), color: valueCol, id: '', title: ''});
                html += caap.makeTd({text: 'Corvintheus Slain', color: titleCol, id: '', title: ''});
                html += caap.makeTd({text: caap.makeCommaValue(caap.stats['achievements']['monster']['corvintheus']), color: valueCol, id: '', title: ''});
                html += '</tr>';

                html += "<tr>";
                html += caap.makeTd({text: '&nbsp;', color: titleCol, id: '', title: ''});
                html += caap.makeTd({text: '&nbsp;', color: valueCol, id: '', title: ''});
                html += caap.makeTd({text: '&nbsp;', color: titleCol, id: '', title: ''});
                html += caap.makeTd({text: '&nbsp;', color: valueCol, id: '', title: ''});
                html += '</tr>';

                html += "<tr>";
                html += caap.makeTd({text: 'Ambrosia Daily Points', color: titleCol, id: '', title: ''});
                html += caap.makeTd({text: caap.demi['ambrosia']['daily']['num'] + '/' + caap.demi['ambrosia']['daily']['max'], color: valueCol, id: '', title: ''});
                html += caap.makeTd({text: 'Malekus Daily Points', color: titleCol, id: '', title: ''});
                html += caap.makeTd({text: caap.demi['malekus']['daily']['num'] + '/' + caap.demi['malekus']['daily']['max'], color: valueCol, id: '', title: ''});
                html += '</tr>';

                html += "<tr>";
                html += caap.makeTd({text: 'Ambrosia Total Points', color: titleCol, id: '', title: ''});
                html += caap.makeTd({text: caap.demi['ambrosia']['power']['total'], color: valueCol, id: '', title: ''});
                html += caap.makeTd({text: 'Malekus Total Points', color: titleCol, id: '', title: ''});
                html += caap.makeTd({text: caap.demi['malekus']['power']['total'], color: valueCol, id: '', title: ''});
                html += '</tr>';

                html += "<tr>";
                html += caap.makeTd({text: '&nbsp;', color: titleCol, id: '', title: ''});
                html += caap.makeTd({text: '&nbsp;', color: valueCol, id: '', title: ''});
                html += caap.makeTd({text: '&nbsp;', color: titleCol, id: '', title: ''});
                html += caap.makeTd({text: '&nbsp;', color: valueCol, id: '', title: ''});
                html += '</tr>';

                html += "<tr>";
                html += caap.makeTd({text: 'Corvintheus Daily Points', color: titleCol, id: '', title: ''});
                html += caap.makeTd({text: caap.demi['corvintheus']['daily']['num'] + '/' + caap.demi['corvintheus']['daily']['max'], color: valueCol, id: '', title: ''});
                html += caap.makeTd({text: 'Aurora Daily Points', color: titleCol, id: '', title: ''});
                html += caap.makeTd({text: caap.demi['aurora']['daily']['num'] + '/' + caap.demi['aurora']['daily']['max'], color: valueCol, id: '', title: ''});
                html += '</tr>';

                html += "<tr>";
                html += caap.makeTd({text: 'Corvintheus Total Points', color: titleCol, id: '', title: ''});
                html += caap.makeTd({text: caap.demi['corvintheus']['power']['total'], color: valueCol, id: '', title: ''});
                html += caap.makeTd({text: 'Aurora Total Points', color: titleCol, id: '', title: ''});
                html += caap.makeTd({text: caap.demi['aurora']['power']['total'], color: valueCol, id: '', title: ''});
                html += '</tr>';

                html += "<tr>";
                html += caap.makeTd({text: '&nbsp;', color: titleCol, id: '', title: ''});
                html += caap.makeTd({text: '&nbsp;', color: valueCol, id: '', title: ''});
                html += caap.makeTd({text: '&nbsp;', color: titleCol, id: '', title: ''});
                html += caap.makeTd({text: '&nbsp;', color: valueCol, id: '', title: ''});
                html += '</tr>';

                html += "<tr>";
                html += caap.makeTd({text: 'Azeron Daily Points', color: titleCol, id: '', title: ''});
                html += caap.makeTd({text: caap.demi['azeron']['daily']['num'] + '/' + caap.demi['azeron']['daily']['max'], color: valueCol, id: '', title: ''});
                html += caap.makeTd({text: '&nbsp;', color: titleCol, id: '', title: ''});
                html += caap.makeTd({text: '&nbsp;', color: valueCol, id: '', title: ''});
                html += '</tr>';

                html += "<tr>";
                html += caap.makeTd({text: 'Azeron Total Points', color: titleCol, id: '', title: ''});
                html += caap.makeTd({text: caap.demi['azeron']['power']['total'], color: valueCol, id: '', title: ''});
                html += caap.makeTd({text: '&nbsp;', color: titleCol, id: '', title: ''});
                html += caap.makeTd({text: '&nbsp;', color: valueCol, id: '', title: ''});
                html += '</tr>';

                html += "<tr>";
                html += caap.makeTd({text: '&nbsp;', color: titleCol, id: '', title: ''});
                html += caap.makeTd({text: '&nbsp;', color: valueCol, id: '', title: ''});
                html += caap.makeTd({text: '&nbsp;', color: titleCol, id: '', title: ''});
                html += caap.makeTd({text: '&nbsp;', color: valueCol, id: '', title: ''});
                html += '</tr>';

                count = 0;
                for (pp in caap.stats['character']) {
                    if (caap.stats['character'].hasOwnProperty(pp)) {
                        if (count % 2  === 0) {
                            html += "<tr>";
                        }

                        html += caap.makeTd({text: [pp], color: titleCol, id: '', title: ''});
                        html += caap.makeTd({text: "Level " + caap.stats['character'][pp]['level'] + " (" + caap.stats['character'][pp]['percent'] + "%)", color: valueCol, id: '', title: ''});
                        if (count % 2 === 1) {
                            html += '</tr>';
                        }

                        count += 1;
                    }
                }

                html += '</table>';
                caap.caapTopObject.find("#caap_userStats").html(html);
                state.setItem("UserDashUpdate", false);
            }

            /*-------------------------------------------------------------------------------------\
            Next we build the HTML to be included into the 'caap_generalsStats' div. We set our
            table and then build the header row.
            \-------------------------------------------------------------------------------------*/
            if (state.getItem("GeneralsDashUpdate", true)) {
                html = "<table width='100%' cellpadding='0px' cellspacing='0px'><tr>";
                headers = ['General', 'Lvl', 'Atk', 'Def', 'API', 'DPI', 'MPI', 'EAtk', 'EDef', 'EAPI', 'EDPI', 'EMPI', 'Special'];
                values  = ['name', 'lvl', 'atk', 'def', 'api', 'dpi', 'mpi', 'eatk', 'edef', 'eapi', 'edpi', 'empi', 'special'];
                $j.merge(generalValues, values);
                for (pp = 0, len = headers.length; pp < len; pp += 1) {
                    header = {
                        text  : '<span id="caap_generalsStats_' + values[pp] + '" title="Click to sort" onmouseover="this.style.cursor=\'pointer\';" onmouseout="this.style.cursor=\'default\';">' + headers[pp] + '</span>',
                        color : 'blue',
                        id    : '',
                        title : '',
                        width : ''
                    };

                    if (headers[pp] === 'Special') {
                        header = {
                            text  : headers[pp],
                            color : 'black',
                            id    : '',
                            title : '',
                            width : '25%'
                        };
                    }

                    html += caap.makeTh(header);
                }

                html += '</tr>';
                for (it = 0, len = general.recordsSortable.length; it < len; it += 1) {
                    html += "<tr>";
                    for (pp = 0, len1 = values.length; pp < len; pp += 1) {
                        str = '';
                        if (isNaN(general.recordsSortable[it][values[pp]])) {
                            if (general.recordsSortable[it][values[pp]]) {
                                str = general.recordsSortable[it][values[pp]];
                            }
                        } else {
                            if (/pi/.test(values[pp])) {
                                str = general.recordsSortable[it][values[pp]];
                            } else {
                                str = general.recordsSortable[it][values[pp]].toString();
                            }
                        }

                        if (pp === 0) {
                            color = titleCol;
                        } else {
                            color = valueCol;
                        }

                        html += caap.makeTd({text: str, color: color, id: '', title: ''});
                    }

                    html += '</tr>';
                }

                html += '</table>';
                caap.caapTopObject.find("#caap_generalsStats").html(html);

                handler = function (e) {
                    var clicked = '',
                        order = new sort.order();

                    if (e.target.id) {
                        clicked = e.target.id.replace(statsRegExp, '');
                    }

                    if (generalValues.indexOf(clicked) !== -1) {
                        order.data['value']['a'] = clicked;
                        if (clicked !== 'name') {
                            order.data['reverse']['a'] = true;
                            order.data['value']['b'] = "name";
                        }

                        general.recordsSortable.sort($u.sortBy(order.data['reverse']['a'], order.data['value']['a'], $u.sortBy(order.data['reverse']['b'], order.data['value']['b'])));
                        state.setItem("GeneralsSort", order.data);
                        state.setItem("GeneralsDashUpdate", true);
                        sort.updateForm("Generals");
                        caap.UpdateDashboard(true);
                    }
                };

                caap.caapTopObject.find("span[id*='caap_generalsStats_']").unbind('click', handler).click(handler);
                state.setItem("GeneralsDashUpdate", false);
            }


            /*-------------------------------------------------------------------------------------\
            Next we build the HTML to be included into the 'soldiers', 'item' and 'magic' div.
            We set our table and then build the header row.
            \-------------------------------------------------------------------------------------*/
            if (state.getItem("SoldiersDashUpdate", true) || state.getItem("ItemDashUpdate", true) || state.getItem("MagicDashUpdate", true)) {
                headers = ['Name', 'Type', 'Owned', 'Atk', 'Def', 'API', 'DPI', 'MPI', 'Cost', 'Upkeep', 'Hourly'];
                values  = ['name', 'type', 'owned', 'atk', 'def', 'api', 'dpi', 'mpi', 'cost', 'upkeep', 'hourly'];
                $j.merge(townValues, values);
                for (i = 0, len = town.types.length; i < len; i += 1) {
                    if (!state.getItem(town.types[i].ucFirst() + "DashUpdate", true)) {
                        continue;
                    }

                    html = "<table width='100%' cellpadding='0px' cellspacing='0px'><tr>";
                    for (pp = 0, len1 = headers.length; pp < len1; pp += 1) {
                        if (town.types[i] !== 'item' && headers[pp] === 'Type') {
                            continue;
                        }

                        header = {
                            text  : '<span id="caap_' + town.types[i] + 'Stats_' + values[pp] + '" title="Click to sort" onmouseover="this.style.cursor=\'pointer\';" onmouseout="this.style.cursor=\'default\';">' + headers[pp] + '</span>',
                            color : 'blue',
                            id    : '',
                            title : '',
                            width : ''
                        };

                        html += caap.makeTh(header);
                    }

                    html += '</tr>';
                    for (it = 0, len1 = town[town.types[i] + "Sortable"].length; it < len1; it += 1) {
                        html += "<tr>";
                        for (pp = 0, len2 = values.length; pp < len2; pp += 1) {
                            if (town.types[i] !== 'item' && values[pp] === 'type') {
                                continue;
                            }

                            str = '';
                            if (isNaN(town[town.types[i] + "Sortable"][it][values[pp]])) {
                                if (town[town.types[i] + "Sortable"][it][values[pp]]) {
                                    str = town[town.types[i] + "Sortable"][it][values[pp]];
                                }
                            } else {
                                if (/pi/.test(values[pp])) {
                                    str = town[town.types[i] + "Sortable"][it][values[pp]];
                                } else {
                                    str = caap.makeCommaValue(town[town.types[i] + "Sortable"][it][values[pp]]);
                                    if (values[pp] === 'cost' || values[pp] === 'upkeep' || values[pp] === 'hourly') {
                                        str = "$" + str;
                                    }
                                }
                            }

                            if (pp === 0) {
                                color = titleCol;
                            } else {
                                color = valueCol;
                            }

                            html += caap.makeTd({text: str, color: color, id: '', title: ''});
                        }

                        html += '</tr>';
                    }

                    html += '</table>';
                    caap.caapTopObject.find("#caap_" + town.types[i] + "Stats").html(html);
                }

                handler = function (e) {
                    var clicked = '',
                        order = new sort.order();

                    if (e.target.id) {
                        clicked = e.target.id.replace(statsRegExp, '');
                    }

                    if (townValues.indexOf(clicked) !== -1) {
                        order.data['value']['a'] = clicked;
                        if (clicked !== 'name') {
                            order.data['reverse']['a'] = true;
                            order.data['value']['b'] = "name";
                        }

                        town['soldiersSortable'].sort($u.sortBy(order.data['reverse']['a'], order.data['value']['a'], $u.sortBy(order.data['reverse']['b'], order.data['value']['b'])));
                        state.setItem("SoldiersSort", order.data);
                        state.setItem("SoldiersDashUpdate", true);
                        caap.UpdateDashboard(true);
                        sort.updateForm("Soldiers");
                    }
                };

                caap.caapTopObject.find("span[id*='caap_soldiersStats_']").unbind('click', handler).click(handler);
                state.setItem("SoldiersDashUpdate", false);

                handler = function (e) {
                    var clicked = '',
                        order = new sort.order();

                    if (e.target.id) {
                        clicked = e.target.id.replace(statsRegExp, '');
                    }

                    if (townValues.indexOf(clicked) !== -1) {
                        order.data['value']['a'] = clicked;
                        if (clicked !== 'name') {
                            order.data['reverse']['a'] = true;
                            order.data['value']['b'] = "name";
                        }

                        town['itemSortable'].sort($u.sortBy(order.data['reverse']['a'], order.data['value']['a'], $u.sortBy(order.data['reverse']['b'], order.data['value']['b'])));
                        state.setItem("ItemSort", order.data);
                        state.setItem("ItemDashUpdate", true);
                        caap.UpdateDashboard(true);
                        sort.updateForm("Item");
                    }
                };

                caap.caapTopObject.find("span[id*='caap_itemStats_']").unbind('click', handler).click(handler);
                state.setItem("ItemDashUpdate", false);

                handler = function (e) {
                    var clicked = '',
                        order = new sort.order();

                    if (e.target.id) {
                        clicked = e.target.id.replace(statsRegExp, '');
                    }

                    if (townValues.indexOf(clicked) !== -1) {
                        order.data['value']['a'] = clicked;
                        if (clicked !== 'name') {
                            order.data['reverse']['a'] = true;
                            order.data['value']['b'] = "name";
                        }

                        town['magicSortable'].sort($u.sortBy(order.data['reverse']['a'], order.data['value']['a'], $u.sortBy(order.data['reverse']['b'], order.data['value']['b'])));
                        state.setItem("MagicSort", order.data);
                        state.setItem("MagicDashUpdate", true);
                        caap.UpdateDashboard(true);
                        sort.updateForm("Magic");
                    }
                };

                caap.caapTopObject.find("span[id*='caap_magicStats_']").unbind('click', handler).click(handler);
                state.setItem("MagicDashUpdate", false);
            }

            /*-------------------------------------------------------------------------------------\
            Next we build the HTML to be included into the 'caap_giftStats' div. We set our
            table and then build the header row.
            \-------------------------------------------------------------------------------------*/
            if (state.getItem("GiftHistoryDashUpdate", true)) {
                html = "<table width='100%' cellpadding='0px' cellspacing='0px'><tr>";
                headers = ['UserId', 'Name', 'Received', 'Sent'];
                values  = ['userId', 'name', 'received', 'sent'];
                for (pp = 0, len = headers.length; pp < len; pp += 1) {
                    html += caap.makeTh({text: headers[pp], color: '', id: '', title: '', width: ''});
                }

                html += '</tr>';
                for (i = 0, len = gifting.history.records.length; i < len; i += 1) {
                    html += "<tr>";
                    for (pp = 0, len1 = values.length; pp < len1; pp += 1) {
                        if (/userId/.test(values[pp])) {
                            userIdLinkInstructions = "Clicking this link will take you to the user keep of " + gifting.history.records[i][values[pp]];
                            userIdLink = "http://apps.facebook.com/castle_age/keep.php?casuser=" + gifting.history.records[i][values[pp]];
                            data = {
                                text  : '<span id="caap_targetgift_' + i + '" title="' + userIdLinkInstructions + '" rlink="' + userIdLink +
                                        '" onmouseover="this.style.cursor=\'pointer\';" onmouseout="this.style.cursor=\'default\';">' + gifting.history.records[i][values[pp]] + '</span>',
                                color : 'blue',
                                id    : '',
                                title : ''
                            };

                            html += caap.makeTd(data);
                        } else {
                            html += caap.makeTd({text: gifting.history.records[i][values[pp]], color: 'black', id: '', title: ''});
                        }
                    }

                    html += '</tr>';
                }

                html += '</table>';
                caap.caapTopObject.find("#caap_giftStats").html(html);

                handler = function (e) {
                    var visitUserIdLink = {
                            rlink     : '',
                            arlink    : ''
                        },
                        i   = 0,
                        len = 0;

                    for (i = 0, len = e.target.attributes.length; i < len; i += 1) {
                        if (e.target.attributes[i].nodeName === 'rlink') {
                            visitUserIdLink.rlink = e.target.attributes[i].nodeValue;
                            visitUserIdLink.arlink = visitUserIdLink.rlink.replace("http://apps.facebook.com/castle_age/", "");
                        }
                    }

                    caap.ClickAjaxLinkSend(visitUserIdLink.arlink);
                };

                caap.caapTopObject.find("span[id*='caap_targetgift_']").unbind('click', handler).click(handler);
                state.setItem("GiftHistoryDashUpdate", false);
            }

            /*-------------------------------------------------------------------------------------\
            Next we build the HTML to be included into the 'caap_giftQueue' div. We set our
            table and then build the header row.
            \-------------------------------------------------------------------------------------*/
            if (state.getItem("GiftQueueDashUpdate", true)) {
                html = "<table width='100%' cellpadding='0px' cellspacing='0px'><tr>";
                headers = ['UserId', 'Name', 'Gift', 'FB Cleared', 'Delete'];
                values  = ['userId', 'name', 'gift', 'found'];
                for (pp = 0, len = headers.length; pp < len; pp += 1) {
                    html += caap.makeTh({text: headers[pp], color: '', id: '', title: '', width: ''});
                }

                html += '</tr>';
                for (i = 0, len = gifting.queue.records.length; i < len; i += 1) {
                    html += "<tr>";
                    for (pp = 0, len1 = values.length; pp < len1; pp += 1) {
                        if (/userId/.test(values[pp])) {
                            userIdLinkInstructions = "Clicking this link will take you to the user keep of " + gifting.queue.records[i][values[pp]];
                            userIdLink = "http://apps.facebook.com/castle_age/keep.php?casuser=" + gifting.queue.records[i][values[pp]];
                            data = {
                                text  : '<span id="caap_targetgiftq_' + i + '" title="' + userIdLinkInstructions + '" rlink="' + userIdLink +
                                        '" onmouseover="this.style.cursor=\'pointer\';" onmouseout="this.style.cursor=\'default\';">' + gifting.queue.records[i][values[pp]] + '</span>',
                                color : 'blue',
                                id    : '',
                                title : ''
                            };

                            html += caap.makeTd(data);
                        } else {
                            html += caap.makeTd({text: gifting.queue.records[i][values[pp]], color: 'black', id: '', title: ''});
                        }
                    }

                    removeLinkInstructions = "Clicking this link will remove " + gifting.queue.records[i]['name'] + "'s entry from the gift queue!";
                    data = {
                        text  : '<span id="caap_removeq_' + i + '" title="' + removeLinkInstructions + '" mname="' +
                                '" onmouseover="this.style.cursor=\'pointer\';" onmouseout="this.style.cursor=\'default\';" class="ui-icon ui-icon-circle-close">X</span>',
                        color : 'blue',
                        id    : '',
                        title : ''
                    };

                    html += caap.makeTd(data);

                    html += '</tr>';
                }

                html += '</table>';
                caap.caapTopObject.find("#caap_giftQueue").html(html);

                handler = function (e) {
                    var visitUserIdLink = {
                            rlink     : '',
                            arlink    : ''
                        },
                        i   = 0,
                        len = 0;

                    for (i = 0, len = e.target.attributes.length; i < len; i += 1) {
                        if (e.target.attributes[i].nodeName === 'rlink') {
                            visitUserIdLink.rlink = e.target.attributes[i].nodeValue;
                            visitUserIdLink.arlink = visitUserIdLink.rlink.replace("http://apps.facebook.com/castle_age/", "");
                        }
                    }

                    caap.ClickAjaxLinkSend(visitUserIdLink.arlink);
                };

                caap.caapTopObject.find("span[id*='caap_targetgiftq_']").unbind('click', handler).click(handler);

                handler = function (e) {
                    var index = -1,
                        i     = 0,
                        len   = 0,
                        resp  = false;

                    for (i = 0, len = e.target.attributes.length; i < len; i += 1) {
                        if (e.target.attributes[i].nodeName === 'id') {
                            index = e.target.attributes[i].nodeValue.replace("caap_removeq_", "").parseInt();
                        }
                    }

                    resp = confirm("Are you sure you want to remove this queue entry?");
                    if (resp === true) {
                        gifting.queue.deleteIndex(index);
                        caap.UpdateDashboard(true);
                    }
                };

                caap.caapTopObject.find("span[id*='caap_removeq_']").unbind('click', handler).click(handler);
                state.setItem("GiftQueueDashUpdate", false);
            }

            return true;
        } catch (err) {
            $u.error("ERROR in UpdateDashboard: " + err);
            return false;
        }
    },
    /*jslint sub: false */

    /*-------------------------------------------------------------------------------------\
    AddDBListener creates the listener for our dashboard controls.
    \-------------------------------------------------------------------------------------*/
    dbDisplayListener: function (e) {
        var value = e.target.options[e.target.selectedIndex].value;
        config.setItem('DBDisplay', value);
        caap.SetDisplay("caapTopObject", 'infoMonster', false);
        caap.SetDisplay("caapTopObject", 'guildMonster', false);
        caap.SetDisplay("caapTopObject", 'arena', false);
        caap.SetDisplay("caapTopObject", 'infoTargets1', false);
        caap.SetDisplay("caapTopObject", 'infoBattle', false);
        caap.SetDisplay("caapTopObject", 'userStats', false);
        caap.SetDisplay("caapTopObject", 'generalsStats', false);
        caap.SetDisplay("caapTopObject", 'soldiersStats', false);
        caap.SetDisplay("caapTopObject", 'itemStats', false);
        caap.SetDisplay("caapTopObject", 'magicStats', false);
        caap.SetDisplay("caapTopObject", 'giftStats', false);
        caap.SetDisplay("caapTopObject", 'giftQueue', false);
        caap.SetDisplay("caapTopObject", 'buttonMonster', false);
        caap.SetDisplay("caapTopObject", 'buttonGuildMonster', false);
        caap.SetDisplay("caapTopObject", 'buttonTargets', false);
        caap.SetDisplay("caapTopObject", 'buttonBattle', false);
        caap.SetDisplay("caapTopObject", 'buttonGifting', false);
        caap.SetDisplay("caapTopObject", 'buttonGiftQueue', false);
        caap.SetDisplay("caapTopObject", 'buttonSortGenerals', false);
        caap.SetDisplay("caapTopObject", 'buttonSortSoldiers', false);
        caap.SetDisplay("caapTopObject", 'buttonSortItem', false);
        caap.SetDisplay("caapTopObject", 'buttonSortMagic', false);
        switch (value) {
        case "Target List" :
            caap.SetDisplay("caapTopObject", 'infoTargets1', true);
            caap.SetDisplay("caapTopObject", 'buttonTargets', true);
            break;
        case "Battle Stats" :
            caap.SetDisplay("caapTopObject", 'infoBattle', true);
            caap.SetDisplay("caapTopObject", 'buttonBattle', true);
            break;
        case "User Stats" :
            caap.SetDisplay("caapTopObject", 'userStats', true);
            break;
        case "Generals Stats" :
            caap.SetDisplay("caapTopObject", 'generalsStats', true);
            caap.SetDisplay("caapTopObject", 'buttonSortGenerals', true);
            break;
        case "Soldier Stats" :
            caap.SetDisplay("caapTopObject", 'soldiersStats', true);
            caap.SetDisplay("caapTopObject", 'buttonSortSoldiers', true);
            break;
        case "Item Stats" :
            caap.SetDisplay("caapTopObject", 'itemStats', true);
            caap.SetDisplay("caapTopObject", 'buttonSortItem', true);
            break;
        case "Magic Stats" :
            caap.SetDisplay("caapTopObject", 'magicStats', true);
            caap.SetDisplay("caapTopObject", 'buttonSortMagic', true);
            break;
        case "Gifting Stats" :
            caap.SetDisplay("caapTopObject", 'giftStats', true);
            caap.SetDisplay("caapTopObject", 'buttonGifting', true);
            break;
        case "Gift Queue" :
            caap.SetDisplay("caapTopObject", 'giftQueue', true);
            caap.SetDisplay("caapTopObject", 'buttonGiftQueue', true);
            break;
        case "Guild Monster" :
            caap.SetDisplay("caapTopObject", 'guildMonster', true);
            caap.SetDisplay("caapTopObject", 'buttonGuildMonster', true);
            break;
        case "Monster" :
            caap.SetDisplay("caapTopObject", 'infoMonster', true);
            caap.SetDisplay("caapTopObject", 'buttonMonster', true);
            break;
        case "Arena" :
            caap.SetDisplay("caapTopObject", 'arena', true);
            break;
        default :
        }
    },

    refreshMonstersListener: function (e) {
        monster.flagFullReview();
    },

    refreshGuildMonstersListener: function (e) {
        $u.log(1, "refreshGuildMonstersListener");
        state.setItem('ReleaseControl', true);
        guild_monster.clear();
        caap.UpdateDashboard(true);
        schedule.setItem("guildMonsterReview", 0);
    },

    liveFeedButtonListener: function (e) {
        caap.ClickAjaxLinkSend('army_news_feed.php');
    },

    clearTargetsButtonListener: function (e) {
        caap.ReconRecordArray = [];
        caap.SaveRecon();
        caap.UpdateDashboard(true);
    },

    clearBattleButtonListener: function (e) {
        battle.clear();
        caap.UpdateDashboard(true);
    },

    clearGiftingButtonListener: function (e) {
        gifting.clear("history");
        caap.UpdateDashboard(true);
    },

    clearGiftQueueButtonListener: function (e) {
        gifting.clear("queue");
        caap.UpdateDashboard(true);
    },

    sortGeneralsButtonListener: function (e) {
        var values = ['name', 'lvl', 'atk', 'def', 'api', 'dpi', 'mpi', 'eatk', 'edef', 'eapi', 'edpi', 'empi', 'special'];
        sort.form("Generals", values, general.recordsSortable);
    },

    sortSoldiersButtonListener: function (e) {
        var values  = ['name', 'owned', 'atk', 'def', 'api', 'dpi', 'mpi', 'cost', 'upkeep', 'hourly'];
        /* This section is formatted to allow Advanced Optimisation by the Closure Compiler */
        /*jslint sub: true */
        sort.form("Soldiers", values, town['soldiersSortable']);
        /*jslint sub: false */
    },

    sortItemButtonListener: function (e) {
        var values  = ['name', 'type', 'owned', 'atk', 'def', 'api', 'dpi', 'mpi', 'cost', 'upkeep', 'hourly'];
        /* This section is formatted to allow Advanced Optimisation by the Closure Compiler */
        /*jslint sub: true */
        sort.form("Item", values, town['itemSortable']);
        /*jslint sub: false */
    },

    sortMagicButtonListener: function (e) {
        var values  = ['name', 'owned', 'atk', 'def', 'api', 'dpi', 'mpi', 'cost', 'upkeep', 'hourly'];
        /* This section is formatted to allow Advanced Optimisation by the Closure Compiler */
        /*jslint sub: true */
        sort.form("Magic", values, town['magicSortable']);
        /*jslint sub: false */
    },

    AddDBListener: function () {
        try {
            $u.log(3, "Adding listeners for caap_top");
            if (!caap.caapTopObject.find('#caap_DBDisplay').length) {
                caap.ReloadCastleAge();
            }

            caap.caapTopObject.find('#caap_DBDisplay').change(caap.dbDisplayListener);
            caap.caapTopObject.find('#caap_refreshMonsters').click(caap.refreshMonstersListener);
            caap.caapTopObject.find('#caap_refreshGuildMonsters').click(caap.refreshGuildMonstersListener);
            caap.caapTopObject.find('#caap_liveFeed').click(caap.liveFeedButtonListener);
            caap.caapTopObject.find('#caap_clearTargets').click(caap.clearTargetsButtonListener);
            caap.caapTopObject.find('#caap_clearBattle').click(caap.clearBattleButtonListener);
            caap.caapTopObject.find('#caap_clearGifting').click(caap.clearGiftingButtonListener);
            caap.caapTopObject.find('#caap_clearGiftQueue').click(caap.clearGiftQueueButtonListener);
            caap.caapTopObject.find('#caap_sortGenerals').click(caap.sortGeneralsButtonListener);
            caap.caapTopObject.find('#caap_sortSoldiers').click(caap.sortSoldiersButtonListener);
            caap.caapTopObject.find('#caap_sortItem').click(caap.sortItemButtonListener);
            caap.caapTopObject.find('#caap_sortMagic').click(caap.sortMagicButtonListener);
            $u.log(8, "Listeners added for caap_top");
            return true;
        } catch (err) {
            $u.error("ERROR in AddDBListener: " + err);
            return false;
        }
    },

    /////////////////////////////////////////////////////////////////////
    //                          EVENT LISTENERS
    // Watch for changes and update the controls
    /////////////////////////////////////////////////////////////////////

    SetDisplay: function (area, idName, display) {
        try {
            if (idName === null || idName === undefined) {
                $u.warn("idName", idName);
                throw "Bad idName!";
            }

            var areaDiv = $j();
            switch (area) {
            case "caapDivObject":
                areaDiv = caap.caapDivObject.find('#caap_' + idName);
                break;
            case "caapTopObject":
                areaDiv = caap.caapTopObject.find('#caap_' + idName);
                break;
            default:
                $u.warn("area", area);
                throw "Unknown area!";
            }

            if (!areaDiv || areaDiv.length === 0) {
                $u.warn("idName/area", idName, area);
                throw "Unable to find idName in area!";
            }

            display = (display === true) ? true : false;
            if (display) {
                areaDiv.css('display', 'block');
            } else {
                areaDiv.css('display', 'none');
            }

            return true;
        } catch (err) {
            $u.error("ERROR in SetDisplay: " + err);
            return false;
        }
    },

    /* This section is formatted to allow Advanced Optimisation by the Closure Compiler */
    /*jslint sub: true */
    CheckBoxListener: function (e) {
        try {
            var idName        = e.target.id.stripCaap(),
                DocumentTitle = '',
                d             = '',
                styleXY       = {};

            $u.log(1, "Change: setting '" + idName + "' to ", e.target.checked);
            config.setItem(idName, e.target.checked);
            if (e.target.className) {
                caap.SetDisplay("caapDivObject", e.target.className, e.target.checked);
            }

            switch (idName) {
            case "AutoStatAdv" :
                $u.log(9, "AutoStatAdv");
                if (e.target.checked) {
                    caap.SetDisplay("caapDivObject", 'Status_Normal', false);
                    caap.SetDisplay("caapDivObject", 'Status_Adv', true);
                } else {
                    caap.SetDisplay("caapDivObject", 'Status_Normal', true);
                    caap.SetDisplay("caapDivObject", 'Status_Adv', false);
                }

                state.setItem("statsMatch", true);
                break;
            case "HideAds" :
                $u.log(9, "HideAds");
                if (e.target.checked) {
                    $j('.UIStandardFrame_SidebarAds').css('display', 'none');
                } else {
                    $j('.UIStandardFrame_SidebarAds').css('display', 'block');
                }

                break;
            case "HideAdsIframe" :
                $u.log(9, "HideAdsIframe");
                if (e.target.checked) {
                    $j("iframe[name*='fb_iframe']").eq(0).parent().css('display', 'none');
                } else {
                    $j("iframe[name*='fb_iframe']").eq(0).parent().css('display', 'block');
                }

                caap.dashboardXY.x = state.getItem('caap_top_menuLeft', '');
                caap.dashboardXY.y = state.getItem('caap_top_menuTop', $j(caap.dashboardXY.selector).offset().top - 10);
                styleXY = caap.GetDashboardXY();
                caap.caapTopObject.css({
                    top                     : styleXY.y + 'px',
                    left                    : styleXY.x + 'px'
                });

                break;
            case "HideFBChat" :
                $u.log(9, "HideFBChat");
                if (e.target.checked) {
                    $j("div[class*='fbDockWrapper fbDockWrapperBottom fbDockWrapperRight']").css('display', 'none');
                } else {
                    $j("div[class*='fbDockWrapper fbDockWrapperBottom fbDockWrapperRight']").css('display', 'block');
                }

                break;
            case "BannerDisplay" :
                $u.log(9, "BannerDisplay");
                if (e.target.checked) {
                    caap.caapDivObject.find('#caap_BannerHide').css('display', 'block');
                } else {
                    caap.caapDivObject.find('#caap_BannerHide').css('display', 'none');
                }

                break;
            case "IgnoreBattleLoss" :
                $u.log(9, "IgnoreBattleLoss");
                if (e.target.checked) {
                    $u.log(1, "Ignore Battle Losses has been enabled.");
                }

                break;
            case "SetTitle" :
            case "SetTitleAction" :
            case "SetTitleName" :
                $u.log(9, idName);
                if (e.target.checked) {
                    if (config.getItem('SetTitleAction', false)) {
                        d = caap.caapDivObject.find('#caap_activity_mess').html();
                        if (d) {
                            DocumentTitle += d.replace("Activity: ", '') + " - ";
                        }
                    }

                    if (config.getItem('SetTitleName', false)) {
                        DocumentTitle += caap.stats['PlayerName'] + " - ";
                    }

                    document.title = DocumentTitle + caap.documentTitle;
                } else {
                    document.title = caap.documentTitle;
                }

                break;
            case "unlockMenu" :
                $u.log(9, "unlockMenu");
                if (e.target.checked) {
                    caap.caapDivObject.find(":input[id^='caap_']").attr({disabled: true});
                    caap.caapTopObject.find(":input[id^='caap_']").attr({disabled: true});
                    caap.caapDivObject.css('cursor', 'move').draggable({
                        stop: function () {
                            caap.SaveControlXY();
                        }
                    });

                    caap.caapTopObject.css('cursor', 'move').draggable({
                        stop: function () {
                            caap.SaveDashboardXY();
                        }
                    });
                } else {
                    caap.caapDivObject.css('cursor', '').draggable("destroy");
                    caap.caapTopObject.css('cursor', '').draggable("destroy");
                    caap.caapDivObject.find(":input[id^='caap_']").attr({disabled: false});
                    caap.caapTopObject.find(":input[id^='caap_']").attr({disabled: false});
                }

                break;
            case "AutoElite" :
                $u.log(9, "AutoElite");
                schedule.setItem('AutoEliteGetList', 0);
                schedule.setItem('AutoEliteReqNext', 0);
                state.setItem('AutoEliteEnd', '');
                state.setItem("MyEliteTodo", []);
                if (!state.getItem('FillArmy', false)) {
                    state.setItem(caap.friendListType.giftc.name + 'Requested', false);
                    state.setItem(caap.friendListType.giftc.name + 'Responded', []);
                }

                break;
            case "AchievementMode" :
                $u.log(9, "AchievementMode");
                monster.flagReview();
                break;
            case "StatSpendAll" :
                $u.log(9, "StatSpendAll");
                state.setItem("statsMatch", true);
                state.setItem("autoStatRuleLog", true);
                break;
            case "enableTitles" :
            case "goblinHinting" :
                if (e.target.checked) {
                    spreadsheet.load();
                }

                break;
            case "ignoreClerics" :
            case "chooseIgnoredMinions" :
                state.setItem('targetGuildMonster', {});
                state.setItem('staminaGuildMonster', 0);
                schedule.setItem("guildMonsterReview", 0);
                break;
            default :
            }

            return true;
        } catch (err) {
            $u.error("ERROR in CheckBoxListener: " + err);
            return false;
        }
    },
    /*jslint sub: false */

    TextBoxListener: function (e) {
        try {
            var idName = e.target.id.stripCaap();

            $u.log(1, 'Change: setting "' + idName + '" to ', String(e.target.value));
            if (/Style+/.test(idName)) {
                switch (idName) {
                case "StyleBackgroundLight" :
                    if (e.target.value.substr(0, 1) !== '#') {
                        e.target.value = '#' + e.target.value;
                    }

                    state.setItem("CustStyleBackgroundLight", e.target.value);
                    break;
                case "StyleBackgroundDark" :
                    if (e.target.value.substr(0, 1) !== '#') {
                        e.target.value = '#' + e.target.value;
                    }

                    state.setItem("CustStyleBackgroundDark", e.target.value);
                    break;
                default :
                }
            } else if (/AttrValue+/.test(idName)) {
                state.setItem("statsMatch", true);
            }

            config.setItem(idName, String(e.target.value));
            return true;
        } catch (err) {
            $u.error("ERROR in TextBoxListener: " + err);
            return false;
        }
    },

    NumberBoxListener: function (e) {
        try {
            var idName  = e.target.id.stripCaap(),
                number  = null,
                message = '';

            if (isNaN(e.target.value) && e.target.value !== '') {
                message = "<div style='text-align: center;'>";
                message += "You entered:<br /><br />";
                message += "'" + e.target.value + "'<br /><br />";
                message += "Please enter a number or leave blank.";
                message += "</div>";
                $u.alert(message);
                number = '';
            } else {
                number = e.target.value.parseFloat();
                if (isNaN(number)) {
                    number = '';
                }
            }

            $u.log(1, 'Change: setting "' + idName + '" to ', number);
            if (/Style+/.test(idName)) {
                switch (idName) {
                case "StyleOpacityLight" :
                    state.setItem("CustStyleOpacityLight", e.target.value);
                    break;
                case "StyleOpacityDark" :
                    state.setItem("CustStyleOpacityDark", e.target.value);
                    break;
                default :
                }
            } else if (/AttrValue+/.test(idName)) {
                state.setItem("statsMatch", true);
            } else if (/MaxToFortify/.test(idName)) {
                monster.flagFullReview();
            } else if (/Chain/.test(idName)) {
                state.getItem('BattleChainId', 0);
            } else if (idName === 'DebugLevel') {
                $u.set_log_level(e.target.value.parseInt());
            } else if (idName === "IgnoreMinionsBelow") {
                state.setItem('targetGuildMonster', {});
                state.setItem('staminaGuildMonster', 0);
                schedule.setItem("guildMonsterReview", 0);
            }

            e.target.value = config.setItem(idName, number);
            return true;
        } catch (err) {
            $u.error("ERROR in NumberBoxListener: " + err);
            return false;
        }
    },

    DropBoxListener: function (e) {
        try {
            if (e.target.selectedIndex > 0) {
                var idName = e.target.id.stripCaap(),
                    value  = e.target.options[e.target.selectedIndex].value,
                    title  = e.target.options[e.target.selectedIndex].title;

                $u.log(1, 'Change: setting "' + idName + '" to "' + value + '" with title "' + title + '"');
                config.setItem(idName, value);
                e.target.title = title;
                if (idName.indexOf('When') >= 0) {
                    caap.SetDisplay("caapDivObject", idName + 'Hide', (value !== 'Never'));
                    if (idName.indexOf('Quest') < 0) {
                        if (idName.indexOf('Arena') < 0) {
                            caap.SetDisplay("caapDivObject", idName + 'XStamina', (value === 'At X Stamina'));
                        }

                        caap.SetDisplay("caapDivObject", 'WhenBattleStayHidden1', ((config.getItem('WhenBattle', 'Never') === 'Stay Hidden' && config.getItem('WhenMonster', 'Never') !== 'Stay Hidden')));
                        caap.SetDisplay("caapDivObject", 'WhenMonsterStayHidden1', ((config.getItem('WhenMonster', 'Never') === 'Stay Hidden' && config.getItem('WhenBattle', 'Never') !== 'Stay Hidden')));
                        caap.SetDisplay("caapDivObject", 'WhenBattleDemiOnly', (config.getItem('WhenBattle', 'Never') === 'Demi Points Only'));
                        switch (idName) {
                        case 'WhenBattle':
                            if (value === 'Never') {
                                caap.SetDivContent('battle_mess', 'Battle off');
                            } else {
                                caap.SetDivContent('battle_mess', '');
                            }

                            break;
                        case 'WhenMonster':
                            if (value === 'Never') {
                                caap.SetDivContent('monster_mess', 'Monster off');
                            } else {
                                caap.SetDivContent('monster_mess', '');
                            }

                            break;
                        case 'WhenGuildMonster':
                            if (value === 'Never') {
                                caap.SetDivContent('guild_monster_mess', 'Guild Monster off');
                            } else {
                                caap.SetDivContent('guild_monster_mess', '');
                            }

                            break;
                        case 'WhenArena':
                            if (value === 'Never') {
                                caap.SetDivContent('arena_mess', 'Arena off');
                            } else {
                                caap.SetDivContent('arena_mess', '');
                            }

                            break;
                        default:
                        }
                    }

                    if (idName === 'WhenQuest') {
                        caap.SetDisplay("caapDivObject", idName + 'XEnergy', (value === 'At X Energy'));
                    }
                } else if (idName === 'QuestArea' || idName === 'QuestSubArea' || idName === 'WhyQuest') {
                    state.setItem('AutoQuest', caap.newAutoQuest());
                    caap.ClearAutoQuest();
                    if (idName === 'QuestArea') {
                        switch (value) {
                        case "Quest" :
                            caap.caapDivObject.find("#trQuestSubArea").css('display', 'table-row');
                            caap.ChangeDropDownList('QuestSubArea', caap.landQuestList);
                            break;
                        case "Demi Quests" :
                            caap.caapDivObject.find("#trQuestSubArea").css('display', 'table-row');
                            caap.ChangeDropDownList('QuestSubArea', caap.demiQuestList);
                            break;
                        case "Atlantis" :
                            caap.caapDivObject.find("#trQuestSubArea").css('display', 'table-row');
                            caap.ChangeDropDownList('QuestSubArea', caap.atlantisQuestList);
                            break;
                        default :
                        }
                    }
                } else if (idName === 'BattleType') {
                    state.getItem('BattleChainId', 0);
                } else if (idName === 'AutoBless') {
                    schedule.setItem('BlessingTimer', 0);
                } else if (idName === 'TargetType') {
                    state.getItem('BattleChainId', 0);
                    switch (value) {
                    case "Freshmeat" :
                        caap.SetDisplay("caapDivObject", 'FreshmeatSub', true);
                        caap.SetDisplay("caapDivObject", 'UserIdsSub', false);
                        caap.SetDisplay("caapDivObject", 'RaidSub', false);
                        break;
                    case "Userid List" :
                        caap.SetDisplay("caapDivObject", 'FreshmeatSub', false);
                        caap.SetDisplay("caapDivObject", 'UserIdsSub', true);
                        caap.SetDisplay("caapDivObject", 'RaidSub', false);
                        break;
                    case "Raid" :
                        caap.SetDisplay("caapDivObject", 'FreshmeatSub', true);
                        caap.SetDisplay("caapDivObject", 'UserIdsSub', false);
                        caap.SetDisplay("caapDivObject", 'RaidSub', true);
                        break;
                    default :
                        caap.SetDisplay("caapDivObject", 'FreshmeatSub', true);
                        caap.SetDisplay("caapDivObject", 'UserIdsSub', false);
                        caap.SetDisplay("caapDivObject", 'RaidSub', false);
                    }
                } else if (idName === 'LevelUpGeneral') {
                    caap.SetDisplay("caapDivObject", idName + 'Hide', (value !== 'Use Current'));
                } else if (/Attribute?/.test(idName)) {
                    state.setItem("statsMatch", true);
                } else if (idName === 'DisplayStyle') {
                    caap.SetDisplay("caapDivObject", idName + 'Hide', (value === 'Custom'));
                    switch (value) {
                    case "CA Skin" :
                        config.setItem("StyleBackgroundLight", "#E0C691");
                        config.setItem("StyleBackgroundDark", "#B09060");
                        config.setItem("StyleOpacityLight", 1);
                        config.setItem("StyleOpacityDark", 1);
                        break;
                    case "None" :
                        config.setItem("StyleBackgroundLight", "white");
                        config.setItem("StyleBackgroundDark", "white");
                        config.setItem("StyleOpacityLight", 1);
                        config.setItem("StyleOpacityDark", 1);
                        break;
                    case "Custom" :
                        config.setItem("StyleBackgroundLight", state.getItem("CustStyleBackgroundLight", "#E0C691"));
                        config.setItem("StyleBackgroundDark", state.getItem("CustStyleBackgroundDark", "#B09060"));
                        config.setItem("StyleOpacityLight", state.getItem("CustStyleOpacityLight", 1));
                        config.setItem("StyleOpacityDark", state.getItem("CustStyleOpacityDark", 1));
                        break;
                    default :
                        config.setItem("StyleBackgroundLight", "#efe");
                        config.setItem("StyleBackgroundDark", "#fee");
                        config.setItem("StyleOpacityLight", 1);
                        config.setItem("StyleOpacityDark", 1);
                    }

                    caap.caapDivObject.css({
                        background: config.getItem('StyleBackgroundDark', '#fee'),
                        opacity: config.getItem('StyleOpacityDark', 1)
                    });

                    caap.caapTopObject.css({
                        background: config.getItem('StyleBackgroundDark', '#fee'),
                        opacity: config.getItem('StyleOpacityDark', 1)
                    });
                }
            }

            return true;
        } catch (err) {
            $u.error("ERROR in DropBoxListener: " + err);
            return false;
        }
    },

    TextAreaListener: function (e) {
        try {
            var idName = e.target.id.stripCaap(),
                value = e.target.value;

            function commas() {
                // Change the boolean from false to true to enable BoJangles patch or
                // set the hidden variable in localStorage
                if (gm.getItem("TextAreaCommas", false, hiddenVar)) {
                    // This first removes leading and trailing white space and/or commas before
                    // both removing and inserting commas where appropriate.
                    // Handles adding a single user id as well as replacing the entire list.
                    e.target.value = value.replace(/(^[,\s]+)|([,\s]+$)/g, "").replace(/[,\s]+/g, ",");
                }
            }

            $u.log(1, 'Change: setting "' + idName + '" to ', e.target.value);
            config.setItem(idName, e.target.value);
            switch (idName) {
            case "orderGuildMinion":
            case "orderGuildMonster":
                state.setItem('targetGuildMonster', {});
                state.setItem('staminaGuildMonster', 0);
                schedule.setItem("guildMonsterReview", 0);
                break;
            case "orderbattle_monster":
            case "orderraid":
                monster.flagFullReview();
                break;
            case "BattleTargets":
                state.setItem('BattleChainId', 0);
                commas();
                break;
            case "EliteArmyList":
                commas();
                break;
            default:
            }

            return true;
        } catch (err) {
            $u.error("ERROR in TextAreaListener: " + err);
            return false;
        }
    },

    PauseListener: function (e) {
        caap.caapDivObject.css({
            'background' : config.getItem('StyleBackgroundDark', '#fee'),
            'opacity'    : '1',
            'z-index'    : '3'
        });

        caap.caapTopObject.css({
            'background' : config.getItem('StyleBackgroundDark', '#fee'),
            'opacity'    : '1'
        });

        caap.caapDivObject.find('#caapPaused').css('display', 'block');
        state.setItem('caapPause', 'block');
    },

    RestartListener: function (e) {
        caap.caapDivObject.find('#caapPaused').css('display', 'none');
        caap.caapDivObject.css({
            'background' : config.getItem('StyleBackgroundLight', '#efe'),
            'opacity'    : config.getItem('StyleOpacityLight', 1),
            'z-index'    : state.getItem('caap_div_zIndex', '2'),
            'cursor'     : ''
        });

        caap.caapTopObject.css({
            'background' : config.getItem('StyleBackgroundLight', '#efe'),
            'opacity'    : config.getItem('StyleOpacityLight', 1),
            'z-index'    : state.getItem('caap_top_zIndex', '1'),
            'cursor'     : ''
        });

        caap.caapDivObject.find(":input[id*='caap_']").attr({disabled: false});
        caap.caapDivObject.find('#unlockMenu').attr('checked', false);
        state.setItem('caapPause', 'none');
        state.setItem('ReleaseControl', true);
        state.setItem('resetselectMonster', true);
        caap.waitingForDomLoad = false;
    },

    ResetMenuLocationListener: function (e) {
        var caap_divXY = {},
            caap_topXY = {};

        state.deleteItem('caap_div_menuLeft');
        state.deleteItem('caap_div_menuTop');
        state.deleteItem('caap_div_zIndex');
        caap.controlXY.x = '';
        caap.controlXY.y = $j(caap.controlXY.selector).offset().top;
        caap_divXY = caap.GetControlXY(true);
        caap.caapDivObject.css({
            'cursor'  : '',
            'z-index' : '2',
            'top'     : caap_divXY.y + 'px',
            'left'    : caap_divXY.x + 'px'
        });

        state.deleteItem('caap_top_menuLeft');
        state.deleteItem('caap_top_menuTop');
        state.deleteItem('caap_top_zIndex');
        caap.dashboardXY.x = '';
        caap.dashboardXY.y = $j(caap.dashboardXY.selector).offset().top - 10;
        caap_topXY = caap.GetDashboardXY(true);
        caap.caapTopObject.css({
            'cursor' : '',
            'z-index' : '1',
            'top' : caap_topXY.y + 'px',
            'left' : caap_topXY.x + 'px'
        });

        caap.caapDivObject.find(":input[id^='caap_']").attr({disabled: false});
        caap.caapTopObject.find(":input[id^='caap_']").attr({disabled: false});
    },

    FoldingBlockListener: function (e) {
        try {
            var subId = e.target.id.replace(/_Switch/i, ''),
                subDiv = document.getElementById(subId);

            if (subDiv.style.display === "block") {
                $u.log(2, 'Folding: ', subId);
                subDiv.style.display = "none";
                e.target.innerHTML = e.target.innerHTML.replace(/-/, '+');
                state.setItem('Control_' + subId.stripCaap(), "none");
            } else {
                $u.log(2, 'Unfolding: ', subId);
                subDiv.style.display = "block";
                e.target.innerHTML = e.target.innerHTML.replace(/\+/, '-');
                state.setItem('Control_' + subId.stripCaap(), "block");
            }

            return true;
        } catch (err) {
            $u.error("ERROR in FoldingBlockListener: " + err);
            return false;
        }
    },

    whatClickedURLListener: function (event) {
        try {
            var obj = event.target;
            while (obj && !obj.href) {
                obj = obj.parentNode;
            }

            if (obj && obj.href) {
                state.setItem('clickUrl', obj.href);
                schedule.setItem('clickedOnSomething', 0);
                caap.waitingForDomLoad = true;
                //$u.log(9, 'globalContainer', obj.href);
            } else {
                if (obj && !obj.href) {
                    $u.warn('whatClickedURLListener globalContainer no href', obj);
                }
            }
        } catch (err) {
            $u.error("ERROR in whatClickedURLListener: " + err, event);
        }
    },

    whatFriendBox: function (event) {
        try {
            var obj    = event.target,
                userID = [],
                txt    = '';

            while (obj && !obj.id) {
                obj = obj.parentNode;
            }

            if (obj && obj.id && obj.onclick) {
                userID = obj.onclick.toString().match(/friendKeepBrowse\('(\d+)'/);
                if (userID && userID.length === 2) {
                    txt = "?casuser=" + userID[1];
                }

                state.setItem('clickUrl', 'http://apps.facebook.com/castle_age/keep.php' + txt);
                schedule.setItem('clickedOnSomething', 0);
                caap.waitingForDomLoad = true;
            }
        } catch (err) {
            $u.error("ERROR in whatFriendBox: " + err, event);
        }
    },

    arenaEngageListener: function (event) {
        $u.log(3, "engage arena_battle.php");
        state.setItem('clickUrl', 'http://apps.facebook.com/castle_age/arena_battle.php');
        schedule.setItem('clickedOnSomething', 0);
        caap.waitingForDomLoad = true;
    },

    arenaDualListener: function (event) {
        var index  = -1,
            minion = {};

        $u.log(3, "engage arena_battle.php", event.target.id);
        index = event.target.id ? event.target.id.parseInt() : -1;
        minion = arena.getMinion(index);
        minion = !$j.isEmptyObject(minion) ? minion : {};
        state.setItem('ArenaMinionAttacked', minion);
        state.setItem('clickUrl', 'http://apps.facebook.com/castle_age/arena_battle.php');
        schedule.setItem('clickedOnSomething', 0);
        caap.waitingForDomLoad = true;
    },

    guildMonsterEngageListener: function (event) {
        $u.log(3, "engage guild_battle_monster.php");
        state.setItem('clickUrl', 'http://apps.facebook.com/castle_age/guild_battle_monster.php');
        schedule.setItem('clickedOnSomething', 0);
        caap.waitingForDomLoad = true;
    },

    windowResizeListener: function (e) {
        if (window.location.href.indexOf('castle_age')) {
            var caap_divXY = caap.GetControlXY(),
                caap_topXY = caap.GetDashboardXY();

            caap.caapDivObject.css('left', caap_divXY.x + 'px');
            caap.caapTopObject.css('left', caap_topXY.x + 'px');
        }
    },

    targetList: [
        "app_body",
        "index",
        "keep",
        "generals",
        "battle_monster",
        "battle",
        "battlerank",
        "battle_train",
        "arena",
        "quests",
        "raid",
        "symbolquests",
        "alchemy",
        "goblin_emp",
        "soldiers",
        "item",
        "land",
        "magic",
        "oracle",
        "symbols",
        "treasure_chest",
        "gift",
        "apprentice",
        "news",
        "friend_page",
        "party",
        "comments",
        "army",
        "army_news_feed",
        "army_reqs",
        "guild",
        "guild_panel",
        "guild_current_battles",
        "guild_current_monster_battles",
        "guild_battle_monster",
        "guild_monster_summon_list",
        "arena",
        "arena_battle"
    ],

    /* This section is formatted to allow Advanced Optimisation by the Closure Compiler */
    /*jslint sub: true */
    AddListeners: function () {
        try {
            var globalContainer = $j(),
                tDiv = $j(),
                tStr = '',
                tNum = 0;

            $u.log(4, "Adding listeners for caap_div");
            if (caap.caapDivObject.length === 0) {
                throw "Unable to find div for caap_div";
            }

            caap.caapDivObject.find('input:checkbox[id^="caap_"]').change(caap.CheckBoxListener);
            caap.caapDivObject.find('input[data-subtype="text"]').change(caap.TextBoxListener);
            caap.caapDivObject.find('input[data-subtype="number"]').change(caap.NumberBoxListener);
            caap.caapDivObject.find('#unlockMenu').change(caap.CheckBoxListener);
            caap.caapDivObject.find('select[id^="caap_"]').change(caap.DropBoxListener);
            caap.caapDivObject.find('textarea[id^="caap_"]').change(caap.TextAreaListener);
            caap.caapDivObject.find('a[id^="caap_Switch"]').click(caap.FoldingBlockListener);
            caap.caapDivObject.find('#caap_FillArmy').click(function (e) {
                state.setItem("FillArmy", true);
                state.setItem("ArmyCount", 0);
                state.setItem('FillArmyList', []);
                state.setItem(caap.friendListType.giftc.name + 'Responded', []);
                state.setItem(caap.friendListType.facebook.name + 'Responded', false);

            });

            caap.caapDivObject.find('#caap_StartedColorSelect').click(function (e) {
                var display = 'none';
                if ($j('#caap_ColorSelectorDiv1').css('display') === 'none') {
                    display = 'block';
                }

                $j('#caap_ColorSelectorDiv1').css('display', display);
            });

            caap.caapDivObject.find('#caap_StopedColorSelect').click(function (e) {
                var display = 'none';
                if ($j('#caap_ColorSelectorDiv2').css('display') === 'none') {
                    display = 'block';
                }

                $j('#caap_ColorSelectorDiv2').css('display', display);
            });

            caap.caapDivObject.find('#caap_ResetMenuLocation').click(caap.ResetMenuLocationListener);
            caap.caapDivObject.find('#caap_resetElite').click(function (e) {
                schedule.setItem('AutoEliteGetList', 0);
                schedule.setItem('AutoEliteReqNext', 0);
                state.setItem('AutoEliteEnd', '');
                if (!state.getItem('FillArmy', false)) {
                    state.setItem(caap.friendListType.giftc.name + 'Requested', false);
                    state.setItem(caap.friendListType.giftc.name + 'Responded', []);
                }
            });

            caap.caapDivObject.find('#caapRestart').click(caap.RestartListener);
            caap.caapDivObject.find('#caap_control').mousedown(caap.PauseListener);
            caap.caapDivObject.find('#stopAutoQuest').click(function (e) {
                $u.log(1, 'Change: setting stopAutoQuest and go to Manual');
                caap.ManualAutoQuest();
            });

            globalContainer = $j('#app46755028429_globalContainer');
            if (globalContainer.length === 0) {
                throw 'Global Container not found';
            }

            // Fires when CAAP navigates to new location
            globalContainer.find('a').unbind('click', caap.whatClickedURLListener).bind('click', caap.whatClickedURLListener);
            globalContainer.find("div[id*='app46755028429_friend_box_']").unbind('click', caap.whatFriendBox).bind('click', caap.whatFriendBox);
            if (globalContainer.find("img[src*='guild_monster_list_button_on.jpg']").length) {
                globalContainer.find("input[src*='dragon_list_btn_']").unbind('click', caap.guildMonsterEngageListener).bind('click', caap.guildMonsterEngageListener);
            }

            if (globalContainer.find("img[src*='tab_arena_on.gif']").length) {
                $u.log(3, "battle_enter_battle");
                globalContainer.find("input[src*='battle_enter_battle']").unbind('click', caap.arenaEngageListener).bind('click', caap.arenaEngageListener);
            }

            if (globalContainer.find("div[style*='arena3_newsfeed']").length) {
                $u.log(3, "battle_enter_battle");
                globalContainer.find("div[style*='arena3_newsfeed']").unbind('click', caap.arenaEngageListener).bind('click', caap.arenaEngageListener);
            }

            function setArenaDualButtons() {
                tDiv = globalContainer.find("input[src*='monster_duel_button']");
                tDiv.each(function (index) {
                    $j(this).attr("id", index).unbind('click', caap.arenaDualListener).bind('click', caap.arenaDualListener);
                });
            }

            if (globalContainer.find("#app46755028429_arena_battle_banner_section").length) {
                setArenaDualButtons();
            }

            if (globalContainer.find("#app46755028429_guild_battle_banner_section").length) {
                globalContainer.find("input[src*='guild_duel_button']").unbind('click', caap.guildMonsterEngageListener).bind('click', caap.guildMonsterEngageListener);
            }

            globalContainer.bind('DOMNodeInserted', function (event) {
                var targetStr = event.target.id.replace('app46755028429_', ''),
                    tTxt      = $j(event.target).text(),
                    payTimer  = null,
                    energy    = 0,
                    tempE     = null,
                    tempET    = null,
                    health    = 0,
                    tempH     = null,
                    tempHT    = null,
                    stamina   = 0,
                    tempS     = null,
                    tempST    = null,
                    tStr      = '';

                // Uncomment this to see the id of domNodes that are inserted
                /*
                if (event.target.id && !event.target.id.match(/globalContainer/) && !event.target.id.match(/time/i) && !event.target.id.match(/ticker/i) && !event.target.id.match(/caap/i)) {
                    caap.SetDivContent('debug2_mess', targetStr);
                    alert(event.target.id);
                }
                */

                if (config.getItem('HideAdsIframe', false)) {
                    $j("iframe[name*='fb_iframe']").eq(0).parent().css('display', 'none');
                }

                if ($j.inArray(targetStr, caap.targetList) !== -1) {
                    $u.log(5, "Refreshing DOM Listeners", event.target.id);
                    caap.waitingForDomLoad = false;
                    globalContainer.find('a').unbind('click', caap.whatClickedURLListener).bind('click', caap.whatClickedURLListener);
                    globalContainer.find("div[id*='app46755028429_friend_box_']").unbind('click', caap.whatFriendBox).bind('click', caap.whatFriendBox);
                    caap.IncrementPageLoadCounter();
                    window.setTimeout(function () {
                        caap.CheckResults();
                    }, 100);
                }

                switch (targetStr) {
                case "app_body":
                    if (globalContainer.find("img[src*='guild_monster_list_button_on.jpg']").length) {
                        $u.log(3, "Checking Guild Current Monster Battles");
                        globalContainer.find("input[src*='dragon_list_btn_']").unbind('click', caap.guildMonsterEngageListener).bind('click', caap.guildMonsterEngageListener);
                    }

                    if (globalContainer.find("img[src*='tab_arena_on.gif']").length) {
                        $u.log(3, "battle_enter_battle");
                        globalContainer.find("input[src*='battle_enter_battle']").unbind('click', caap.arenaEngageListener).bind('click', caap.arenaEngageListener);
                    }

                    if (globalContainer.find("div[style*='arena3_newsfeed']").length) {
                        $u.log(3, "battle_enter_battle");
                        globalContainer.find("div[style*='arena3_newsfeed']").unbind('click', caap.arenaEngageListener).bind('click', caap.arenaEngageListener);
                    }

                    break;
                case "arena":
                    $u.log(3, "battle_enter_battle");
                    globalContainer.find("input[src*='battle_enter_battle']").unbind('click', caap.arenaEngageListener).bind('click', caap.arenaEngageListener);

                    break;
                case "arena_battle":
                    $u.log(3, "monster_duel_button");
                    setArenaDualButtons();

                    break;
                case "guild_battle_monster":
                    $u.log(3, "Checking Guild Battles Monster");
                    globalContainer.find("input[src*='guild_duel_button']").unbind('click', caap.guildMonsterEngageListener).bind('click', caap.guildMonsterEngageListener);

                    break;
                case "gold_time_value":
                    payTimer = tTxt ? tTxt.match(/(\d+):(\d+)/) : [];
                    if (payTimer && payTimer.length === 3) {
                        caap.stats['gold']['payTime']['ticker'] = payTimer[0];
                        caap.stats['gold']['payTime']['minutes'] = payTimer[1] ? payTimer[1].parseInt() : 0;
                        caap.stats['gold']['payTime']['seconds'] = payTimer[2] ? payTimer[2].parseInt() : 0;
                    }

                    break;
                case "energy_current_value":
                    energy = tTxt ? tTxt.parseInt() : 0;
                    if ($u.isNum(energy)) {
                        tempE = caap.GetStatusNumbers(energy + "/" + caap.stats['energy']['max']);
                        tempET = caap.GetStatusNumbers(energy + "/" + caap.stats['energyT']['max']);
                        if (tempE && tempET) {
                            caap.stats['energy'] = tempE;
                            caap.stats['energyT'] = tempET;
                        } else {
                            $u.warn("Unable to get energy levels");
                        }
                    }

                    break;
                case "health_current_value":
                    health = tTxt ? tTxt.parseInt() : 0;
                    if ($u.isNum(health)) {
                        tempH = caap.GetStatusNumbers(health + "/" + caap.stats['health']['max']);
                        tempHT = caap.GetStatusNumbers(health + "/" + caap.stats['healthT']['max']);
                        if (tempH && tempHT) {
                            caap.stats['health'] = tempH;
                            caap.stats['healthT'] = tempHT;
                        } else {
                            $u.warn("Unable to get health levels");
                        }
                    }

                    break;
                case "stamina_current_value":
                    stamina = tTxt ? tTxt.parseInt() : 0;
                    if ($u.isNum(stamina)) {
                        tempS = caap.GetStatusNumbers(stamina + "/" + caap.stats['stamina']['max']);
                        tempST = caap.GetStatusNumbers(stamina + "/" + caap.stats['staminaT']['max']);
                        if (tempS) {
                            caap.stats['stamina'] = tempS;
                            caap.stats['staminaT'] = tempST;
                        } else {
                            $u.warn("Unable to get stamina levels");
                        }
                    }

                    break;
                default:
                }

                // Reposition the dashboard
                if (event.target.id === caap.dashboardXY.selector) {
                    caap.caapTopObject.css('left', caap.GetDashboardXY().x + 'px');
                }
            });

            $j(window).unbind('resize', caap.windowResizeListener).bind('resize', caap.windowResizeListener);
            $u.log(4, "Listeners added for caap_div");
            return true;
        } catch (err) {
            $u.error("ERROR in AddListeners: " + err);
            return false;
        }
    },

    /////////////////////////////////////////////////////////////////////
    //                          CHECK RESULTS
    // Called each iteration of main loop, this does passive checks for
    // results to update other functions.
    /////////////////////////////////////////////////////////////////////

    pageList: {
        'index': {
            signaturePic: 'gif',
            CheckResultsFunction: 'CheckResults_index'
        },
        'battle_monster': {
            signaturePic: 'tab_monster_list_on.gif',
            CheckResultsFunction: 'CheckResults_fightList',
            subpages: ['onMonster']
        },
        'onMonster': {
            signaturePic: 'tab_monster_active.gif',
            CheckResultsFunction: 'CheckResults_viewFight'
        },
        'raid': {
            signaturePic: 'tab_raid_on.gif',
            CheckResultsFunction: 'CheckResults_fightList',
            subpages: ['onRaid']
        },
        'onRaid': {
            signaturePic: 'raid_map',
            CheckResultsFunction : 'CheckResults_viewFight'
        },
        'land': {
            signaturePic: 'tab_land_on.gif',
            CheckResultsFunction: 'CheckResults_land'
        },
        'generals': {
            signaturePic: 'tab_generals_on.gif',
            CheckResultsFunction: 'CheckResults_generals'
        },
        'quests': {
            signaturePic: 'tab_quest_on.gif',
            CheckResultsFunction: 'CheckResults_quests'
        },
        'symbolquests': {
            signaturePic: 'demi_quest_on.gif',
            CheckResultsFunction: 'CheckResults_quests'
        },
        'monster_quests': {
            signaturePic: 'tab_atlantis_on.gif',
            CheckResultsFunction: 'CheckResults_quests'
        },
        'gift_accept': {
            signaturePic: 'gif',
            CheckResultsFunction: 'CheckResults_gift_accept'
        },
        'army': {
            signaturePic: 'invite_on.gif',
            CheckResultsFunction: 'CheckResults_army'
        },
        'keep': {
            signaturePic: 'tab_stats_on.gif',
            CheckResultsFunction: 'CheckResults_keep'
        },
        'oracle': {
            signaturePic: 'oracle_on.gif',
            CheckResultsFunction: 'CheckResults_oracle'
        },
        'alchemy': {
            signaturePic: 'tab_alchemy_on.gif',
            CheckResultsFunction: 'CheckResults_alchemy'
        },
        'battlerank': {
            signaturePic: 'tab_battle_rank_on.gif',
            CheckResultsFunction: 'CheckResults_battlerank'
        },
        'war_rank': {
            signaturePic: 'tab_war_on.gif',
            CheckResultsFunction: 'CheckResults_war_rank'
        },
        'achievements': {
            signaturePic: 'tab_achievements_on.gif',
            CheckResultsFunction: 'CheckResults_achievements'
        },
        'battle': {
            signaturePic: 'battle_on.gif',
            CheckResultsFunction: 'CheckResults_battle'
        },
        'soldiers': {
            signaturePic: 'tab_soldiers_on.gif',
            CheckResultsFunction: 'CheckResults_soldiers'
        },
        'item': {
            signaturePic: 'tab_black_smith_on.gif',
            CheckResultsFunction: 'CheckResults_item'
        },
        'magic': {
            signaturePic: 'tab_magic_on.gif',
            CheckResultsFunction: 'CheckResults_magic'
        },
        'gift': {
            signaturePic: 'tab_gifts_on.gif',
            CheckResultsFunction: 'CheckResults_gift'
        },
        'goblin_emp': {
            signaturePic: 'emporium_cancel.gif',
            CheckResultsFunction: 'CheckResults_goblin_emp'
        },
        'view_class_progress': {
            signaturePic: 'nm_class_whole_progress_bar.jpg',
            CheckResultsFunction: 'CheckResults_view_class_progress'
        },
        'guild': {
            signaturePic: 'tab_guild_main_on.gif',
            CheckResultsFunction: 'CheckResults_guild'
        },
        'guild_current_battles': {
            signaturePic: 'tab_guild_current_battles_on.gif',
            CheckResultsFunction: 'CheckResults_guild_current_battles'
        },
        'guild_current_monster_battles': {
            signaturePic: 'guild_monster_tab_on.jpg',
            CheckResultsFunction: 'CheckResults_guild_current_monster_battles'
        },
        'guild_battle_monster': {
            signatureId: 'app46755028429_guild_battle_banner_section',
            CheckResultsFunction: 'CheckResults_guild_battle_monster'
        },
        'arena': {
            signaturePic: 'tab_arena_on.gif',
            CheckResultsFunction: 'CheckResults_arena'
        },
        'arena_battle': {
            signatureId: 'app46755028429_arena_battle_banner_section',
            CheckResultsFunction: 'CheckResults_arena_battle'
        }
    },

    AddExpDisplay: function () {
        try {
            var expDiv = $j(),
                enlDiv = $j();

            expDiv = $j("#app46755028429_st_2_5 strong");
            if (!expDiv.length) {
                $u.warn("Unable to get experience array");
                return false;
            }

            enlDiv = expDiv.find("#caap_enl");
            if (enlDiv.length) {
                $u.log(5, "Experience to Next Level already displayed. Updating.");
                enlDiv.html(caap.stats['exp']['dif']);
            } else {
                $u.log(5, "Prepending Experience to Next Level to display");
                expDiv.prepend("(<span id='caap_enl' style='color:red'>" + (caap.stats['exp']['dif']) + "</span>) ");
            }

            caap.SetDivContent('exp_mess', "Experience to next level: " + caap.stats['exp']['dif']);
            return true;
        } catch (err) {
            $u.error("ERROR in AddExpDisplay: " + err);
            return false;
        }
    },

    CheckResults: function () {
        try {
            // Check page to see if we should go to a page specific check function
            // todo find a way to verify if a function exists, and replace the array with a check_functionName exists check
            if (!schedule.check('CheckResultsTimer')) {
                return false;
            }

            var pageUrl         = '',
                pageUserCheck   = [],
                page            = 'None',
                sigImage        = '',
                pageArr         = [],
                resultsDiv      = $j(),
                resultsText     = '',
                resultsFunction = '',
                demiPointsFirst = false,
                whenMonster     = '',
                blessingTimer   = '';

            caap.pageLoadOK = caap.GetStats();
            caap.AddExpDisplay();
            caap.SetDivContent('level_mess', 'Expected next level: ' + schedule.FormatTime(new Date(caap.stats['indicators']['enl'])));
            demiPointsFirst = config.getItem('DemiPointsFirst', false);
            whenMonster = config.getItem('WhenMonster', 'Never');
            if ((demiPointsFirst && whenMonster !== 'Never') || config.getItem('WhenBattle', 'Never') === 'Demi Points Only') {
                if (state.getItem('DemiPointsDone', true)) {
                    caap.SetDivContent('demipoint_mess', 'Daily Demi Points: Done');
                } else {
                    if (demiPointsFirst && whenMonster !== 'Never') {
                        caap.SetDivContent('demipoint_mess', 'Daily Demi Points: First');
                    } else {
                        caap.SetDivContent('demipoint_mess', 'Daily Demi Points: Only');
                    }
                }
            } else {
                caap.SetDivContent('demipoint_mess', '');
            }

            blessingTimer = schedule.display('BlessingTimer');
            if (blessingTimer) {
                if (schedule.check('BlessingTimer')) {
                    caap.SetDivContent('demibless_mess', 'Demi Blessing = none');
                } else {
                    caap.SetDivContent('demibless_mess', 'Next Demi Blessing: ' + blessingTimer);
                }
            }

            schedule.setItem('CheckResultsTimer', 1);
            state.getItem('page', '');
            state.setItem('pageUserCheck', '');
            pageUrl = state.getItem('clickUrl', '');
            pageUserCheck = pageUrl ? pageUrl.matchUser() : [];
            if (pageUserCheck && pageUserCheck.length === 2) {
                state.setItem('pageUserCheck', pageUserCheck[1] ? pageUserCheck[1].parseInt() : 0);
            }

            pageArr = pageUrl ? pageUrl.filepart().split('.php') : [];
            if (pageArr && pageArr.length) {
                page = pageArr[0] ? pageArr[0] : 'none';
            }

            caap.appBodyDiv = $j("#app46755028429_app_body");
            if (caap.pageList[page]) {
                if (page === "quests" && caap.stats['level'] < 8) {
                    sigImage = "quest_back_1.jpg";
                } else {
                    sigImage = caap.pageList[page].signaturePic;
                }

                if (caap.appBodyDiv.find("img[src*='" + sigImage + "']").length) {
                    state.setItem('page', page);
                }

                if (caap.pageList[page].subpages) {
                    caap.pageList[page].subpages.forEach(function (subpage) {
                        if (caap.appBodyDiv.find("img[src*='" + caap.pageList[subpage].signaturePic + "']").length) {
                            page = state.setItem('page', subpage);
                        }
                    });
                } else if (caap.pageList[page].subsection) {
                    caap.pageList[page].subsection.forEach(function (subsection) {
                        if (caap.appBodyDiv.find("#" + caap.pageList[subsection].signatureId).length) {
                            page = state.setItem('page', subsection);
                        }
                    });
                }
            }

            resultsDiv = caap.appBodyDiv.find("#app46755028429_results_main_wrapper span[class*='result_body']");
            if (resultsDiv && resultsDiv.length) {
                resultsText = resultsDiv.text();
                resultsText = resultsText ? resultsText.trim() : '';
            }

            if (page && caap.pageList[page]) {
                $u.log(2, 'Checking results for', page);
                if (typeof caap[caap.pageList[page].CheckResultsFunction] === 'function') {
                    caap[caap.pageList[page].CheckResultsFunction](resultsText);
                } else {
                    $u.warn('Check Results function not found', caap.pageList[page]);
                }
            } else {
                $u.log(2, 'No results check defined for', page);
            }

            monster.select();
            caap.UpdateDashboard();
            if (general.List.length <= 2) {
                schedule.setItem("generals", 0);
                schedule.setItem("allGenerals", 0);
                caap.CheckGenerals();
            }

            if (caap.stats['level'] < 10) {
                caap.battlePage = 'battle_train,battle_off';
            } else {
                caap.battlePage = 'battle';
            }

            // Check for Elite Guard Add image
            if (!config.getItem('AutoEliteIgnore', false)) {
                if (state.getItem('AutoEliteEnd', 'NoArmy') !== 'NoArmy' && caap.CheckForImage('elite_guard_add')) {
                    schedule.setItem('AutoEliteGetList', 0);
                }
            }

            // If set and still recent, go to the function specified in 'ResultsFunction'
            resultsFunction = state.getItem('ResultsFunction', '');
            if (resultsFunction && !schedule.check('SetResultsFunctionTimer')) {
                caap[resultsFunction](resultsText);
            }

            return true;
        } catch (err) {
            $u.error("ERROR in CheckResults: " + err);
            return false;
        }
    },

    CheckResults_generals: function () {
        try {
            var currentGeneral = '',
                html           = '';

            general.GetGenerals();
            currentGeneral = general.GetEquippedStats();
            if (currentGeneral) {
                html = "<span title='Equipped Attack Power Index' style='font-size: 12px; font-weight: normal;'>EAPI:" + currentGeneral['eapi'] +
                       "</span> <span title='Equipped Defense Power Index' style='font-size: 12px; font-weight: normal;'>EDPI:" + currentGeneral['edpi'] +
                       "</span> <span title='Equipped Mean Power Index' style='font-size: 12px; font-weight: normal;'>EMPI:" + currentGeneral['empi'] + "</span>";
                caap.appBodyDiv.find("#app46755028429_general_name_div_int").append(html);
            }

            schedule.setItem("generals", gm.getItem("CheckGenerals", 24, hiddenVar) * 3600, 300);
            return true;
        } catch (err) {
            $u.error("ERROR in CheckResults_generals: " + err);
            return false;
        }
    },

    /////////////////////////////////////////////////////////////////////
    //                          GET STATS
    // Functions that records all of base game stats, energy, stamina, etc.
    /////////////////////////////////////////////////////////////////////

    // text in the format '123/234'
    GetStatusNumbers: function (text) {
        try {
            var txtArr = [];
            if (text === '' || typeof text !== 'string') {
                throw "No text supplied for status numbers:" + text;
            }

            txtArr = text.match(/(\d+)\/(\d+)/);
            if (txtArr.length !== 3) {
                throw "Unable to match status numbers" + text;
            }

            return {
                'num': txtArr[1].parseInt(),
                'max': txtArr[2].parseInt(),
                'dif': txtArr[2].parseInt() - txtArr[1].parseInt()
            };
        } catch (err) {
            $u.error("ERROR in GetStatusNumbers: " + err);
            return false;
        }
    },

    stats: {
        'FBID'       : 0,
        'account'    : '',
        'PlayerName' : '',
        'level'      : 0,
        'army'       : {
            'actual' : 0,
            'capped' : 0
        },
        'generals'   : {
            'total'  : 0,
            'invade' : 0
        },
        'attack'     : 0,
        'defense'    : 0,
        'points'     : {
            'skill' : 0,
            'favor' : 0
        },
        'indicators' : {
            'bsi'  : 0,
            'lsi'  : 0,
            'sppl' : 0,
            'api'  : 0,
            'dpi'  : 0,
            'mpi'  : 0,
            'htl'  : 0,
            'hrtl' : 0,
            'enl'  : 0
        },
        'gold' : {
            'cash'    : 0,
            'bank'    : 0,
            'total'   : 0,
            'income'  : 0,
            'upkeep'  : 0,
            'flow'    : 0,
            'payTime' : {
                'ticker'  : '0:00',
                'minutes' : 0,
                'seconds' : 0
            }
        },
        'rank' : {
            'battle'       : 0,
            'battlePoints' : 0,
            'war'          : 0,
            'warPoints'    : 0
        },
        'potions' : {
            'energy'  : 0,
            'stamina' : 0
        },
        'energy' : {
            'num' : 0,
            'max' : 0,
            'dif' : 0
        },
        'energyT' : {
            'num' : 0,
            'max' : 0,
            'dif' : 0
        },
        'health' : {
            'num' : 0,
            'max' : 0,
            'dif' : 0
        },
        'healthT' : {
            'num' : 0,
            'max' : 0,
            'dif' : 0
        },
        'stamina' : {
            'num' : 0,
            'max' : 0,
            'dif' : 0
        },
        'staminaT' : {
            'num' : 0,
            'max' : 0,
            'dif' : 0
        },
        'exp' : {
            'num' : 0,
            'max' : 0,
            'dif' : 0
        },
        'other' : {
            'qc'       : 0,
            'bww'      : 0,
            'bwl'      : 0,
            'te'       : 0,
            'tee'      : 0,
            'wlr'      : 0,
            'eer'      : 0,
            'atlantis' : false
        },
        'achievements' : {
            'battle' : {
                'invasions' : {
                    'won'    : 0,
                    'lost'   : 0,
                    'streak' : 0,
                    'ratio'  : 0
                },
                'duels' : {
                    'won'    : 0,
                    'lost'   : 0,
                    'streak' : 0,
                    'ratio'  : 0
                }
            },
            'monster' : {
                'gildamesh'   : 0,
                'colossus'    : 0,
                'sylvanas'    : 0,
                'keira'       : 0,
                'legion'      : 0,
                'skaar'       : 0,
                'lotus'       : 0,
                'dragons'     : 0,
                'cronus'      : 0,
                'sieges'      : 0,
                'genesis'     : 0,
                'gehenna'     : 0,
                'aurelius'    : 0,
                'corvintheus' : 0
            },
            'other' : {
                'alchemy' : 0
            }
        },

        'character' : {
            'warrior' : {
                'name'    : 'Warrior',
                'level'   : 0,
                'percent' : 0
            },
            'rogue' : {
                'name'    : 'Rogue',
                'level'   : 0,
                'percent' : 0
            },
            'mage' : {
                'name'    : 'Mage',
                'level'   : 0,
                'percent' : 0
            },
            'cleric' : {
                'name'    : 'Cleric',
                'level'   : 0,
                'percent' : 0
            },
            'warlock' : {
                'name'    : 'Warlock',
                'level'   : 0,
                'percent' : 0
            },
            'ranger' : {
                'name'    : 'Ranger',
                'level'   : 0,
                'percent' : 0
            }

        },
        'guild' : {
            'name'    : '',
            'id'      : '',
            'mPoints' : 0,
            'bPoints' : 0,
            'members' : 0
        }
    },
    /*jslint sub: false */

    LoadStats: function () {
        var Stats = gm.getItem('stats.record', 'default');
        if (Stats === 'default' || !$j.isPlainObject(Stats)) {
            Stats = gm.setItem('stats.record', caap.stats);
        }

        $j.extend(true, caap.stats, Stats);
        $u.log(4, "Stats", caap.stats);
        state.setItem("UserDashUpdate", true);
    },

    SaveStats: function () {
        gm.setItem('stats.record', caap.stats);
        $u.log(4, "Stats", caap.stats);
        state.setItem("UserDashUpdate", true);
    },

    /* This section is formatted to allow Advanced Optimisation by the Closure Compiler */
    /*jslint sub: true */
    GetStats: function () {
        try {
            var cashDiv     = $j(),
                energyDiv   = $j(),
                healthDiv   = $j(),
                staminaDiv  = $j(),
                expDiv      = $j(),
                levelDiv    = $j(),
                armyDiv     = $j(),
                pointsDiv   = $j(),
                passed      = true,
                temp        = null,
                tempT       = null,
                tStr        = '',
                levelArray  = [],
                newLevel    = 0,
                newPoints   = 0,
                armyArray   = [],
                pointsArray = [],
                xS          = 0,
                xE          = 0,
                ststbDiv    = $j(),
                bntpDiv     = $j();

            ststbDiv = $j("#app46755028429_main_ststb");
            bntpDiv = $j("#app46755028429_main_bntp");
            // gold
            cashDiv = ststbDiv.find("#app46755028429_gold_current_value");
            if (cashDiv.length) {
                tStr = cashDiv.text();
                temp = tStr ? tStr.numberOnly() : tStr;
                if (!isNaN(temp)) {
                    caap.stats['gold']['cash'] = temp;
                    caap.stats['gold']['total'] = caap.stats['gold']['bank'] + caap.stats['gold']['cash'];
                } else {
                    $u.warn("Cash value is not a number", temp);
                    passed = false;
                }
            } else {
                $u.warn("Unable to get cashDiv");
                passed = false;
            }

            // energy
            energyDiv = ststbDiv.find("#app46755028429_st_2_2");
            if (energyDiv.length) {
                tempT = caap.GetStatusNumbers(energyDiv.text());
                temp = caap.GetStatusNumbers(tempT['num'] + "/" + caap.stats['energy']['max']);
                if (temp && tempT) {
                    caap.stats['energy'] = temp;
                    caap.stats['energyT'] = tempT;
                } else {
                    $u.warn("Unable to get energy levels");
                    passed = false;
                }
            } else {
                $u.warn("Unable to get energyDiv");
                passed = false;
            }

            // health
            healthDiv = ststbDiv.find("#app46755028429_st_2_3");
            if (healthDiv.length) {
                tempT = caap.GetStatusNumbers(healthDiv.text());
                temp = caap.GetStatusNumbers(tempT['num'] + "/" + caap.stats['health']['max']);
                if (temp && tempT) {
                    caap.stats['health'] = temp;
                    caap.stats['healthT'] = tempT;
                } else {
                    $u.warn("Unable to get health levels");
                    passed = false;
                }
            } else {
                $u.warn("Unable to get healthDiv");
                passed = false;
            }

            // stamina
            staminaDiv = ststbDiv.find("#app46755028429_st_2_4");
            if (staminaDiv.length) {
                tempT = caap.GetStatusNumbers(staminaDiv.text());
                temp = caap.GetStatusNumbers(tempT['num'] + "/" + caap.stats['stamina']['max']);
                if (temp && tempT) {
                    caap.stats['stamina'] = temp;
                    caap.stats['staminaT'] = tempT;
                } else {
                    $u.warn("Unable to get stamina values");
                    passed = false;
                }
            } else {
                $u.warn("Unable to get staminaDiv");
                passed = false;
            }

            // experience
            expDiv = ststbDiv.find("#app46755028429_st_2_5");
            if (expDiv.length) {
                temp = caap.GetStatusNumbers(expDiv.text());
                if (temp) {
                    caap.stats['exp'] = temp;
                } else {
                    $u.warn("Unable to get experience values");
                    passed = false;
                }
            } else {
                $u.warn("Unable to get expDiv");
                passed = false;
            }

            // level
            levelDiv = ststbDiv.find("#app46755028429_st_5");
            if (levelDiv.length) {
                tStr = levelDiv.text();
                levelArray = tStr ? tStr.matchNum() : [];
                if (levelArray && levelArray.length === 2) {
                    newLevel = levelArray[1].parseInt();
                    if (newLevel > caap.stats['level']) {
                        $u.log(2, 'New level. Resetting Best Land Cost.');
                        caap.bestLand = state.setItem('BestLandCost', new caap.landRecord().data);
                        state.setItem('KeepLevelUpGeneral', true);
                        caap.stats['level'] = newLevel;
                    }
                } else {
                    $u.warn('levelArray incorrect');
                    passed = false;
                }
            } else {
                $u.warn("Unable to get levelDiv");
                passed = false;
            }

            // army
            armyDiv = bntpDiv.find("a[href*='army.php']");
            if (armyDiv.length) {
                tStr = armyDiv.text();
                armyArray = tStr ? tStr.matchNum() : [];
                if (armyArray && armyArray.length === 2) {
                    caap.stats['army']['actual'] = armyArray[1].parseInt();
                    temp = Math.min(caap.stats['army']['actual'], 501);
                    if (temp >= 0 && temp <= 501) {
                        caap.stats['army']['capped'] = temp;
                    } else {
                        $u.warn("Army count not in limits");
                        passed = false;
                    }
                } else {
                    $u.warn('armyArray incorrect');
                    passed = false;
                }
            } else {
                $u.warn("Unable to get armyDiv");
                passed = false;
            }

            // upgrade points
            pointsDiv = bntpDiv.find("a[href*='keep.php']");
            if (pointsDiv.length) {
                tStr = pointsDiv.text();
                pointsArray = tStr ? tStr.matchNum() : [];
                if (pointsArray && pointsArray.length === 2) {
                    newPoints = pointsArray[1].parseInt();
                    if (newPoints > caap.stats['points']['skill']) {
                        $u.log(2, 'New points. Resetting AutoStat.');
                        state.setItem("statsMatch", true);
                    }

                    caap.stats['points']['skill'] = newPoints;
                } else {
                    caap.stats['points']['skill'] = 0;
                }
            } else {
                $u.warn("Unable to get pointsDiv");
                passed = false;
            }

            // Indicators: Hours To Level, Time Remaining To Level and Expected Next Level
            if (caap.stats['exp']) {
                xS = gm.getItem("expStaminaRatio", 2.4, hiddenVar);
                xE = state.getItem('AutoQuest', caap.newAutoQuest())['expRatio'] || gm.getItem("expEnergyRatio", 1.4, hiddenVar);
                caap.stats['indicators']['htl'] = ((caap.stats['level'] * 12.5) - (caap.stats['stamina']['max'] * xS) - (caap.stats['energy']['max'] * xE)) / (12 * (xS + xE));
                caap.stats['indicators']['hrtl'] = (caap.stats['exp']['dif'] - (caap.stats['stamina']['num'] * xS) - (caap.stats['energy']['num'] * xE)) / (12 * (xS + xE));
                caap.stats['indicators']['enl'] = new Date().getTime() + Math.ceil(caap.stats['indicators']['hrtl'] * 3600000);
            } else {
                $u.warn('Could not calculate time to next level. Missing experience stats!');
                passed = false;
            }

            if (!passed)  {
                caap.SaveStats();
            }

            if (!passed && caap.stats['energy']['max'] === 0 && caap.stats['health']['max'] === 0 && caap.stats['stamina']['max'] === 0) {
                $u.alert("<div style='text-align: center;'>Paused as this account may have been disabled!</div>");
                $u.warn("Paused as this account may have been disabled!", caap.stats);
                caap.PauseListener();
            }

            return passed;
        } catch (err) {
            $u.error("ERROR GetStats: " + err);
            return false;
        }
    },

    CheckResults_keep: function () {
        try {
            var rankImg        = null,
                warRankImg     = null,
                atlantisImg    = null,
                playerName     = null,
                moneyStored    = null,
                income         = null,
                upkeep         = null,
                energyPotions  = null,
                staminaPotions = null,
                otherStats     = null,
                energy         = null,
                stamina        = null,
                attack         = null,
                defense        = null,
                health         = null,
                statCont       = null,
                anotherEl      = null,
                tStr           = '',
                tArr           = [];

            if ($j(".keep_attribute_section").length) {
                $u.log(8, "Getting new values from player keep");
                // rank
                rankImg = $j("img[src*='gif/rank']");
                if (rankImg.length) {
                    tStr = rankImg.attr("src");
                    tStr = tStr ? tStr.filepart() : '';
                    tArr = tStr ? tStr.matchNum() : [];
                    caap.stats['rank']['battle'] = tArr.length === 2 ? tArr[1].parseInt() : 0;
                } else {
                    $u.warn('Using stored rank.');
                }

                // PlayerName
                playerName = $j(".keep_stat_title_inc");
                if (playerName.length) {
                    tStr = playerName.text();
                    tArr = tStr ? tStr.match(new RegExp("\"(.+)\",")) : [];
                    caap.stats['PlayerName'] = tArr.length === 2 ? tArr[1] : '';
                    state.setItem("PlayerName", caap.stats['PlayerName']);
                } else {
                    $u.warn('Using stored PlayerName.');
                }

                if (caap.stats['level'] >= 100) {
                    // war rank
                    warRankImg = $j("img[src*='war_rank_']");
                    if (warRankImg.length) {
                        tStr = warRankImg.attr("src");
                        tStr = tStr ? tStr.filepart() : '';
                        tArr = tStr ? tStr.matchNum() : [];
                        caap.stats['rank']['war'] = tArr.length === 2 ? tArr[1].parseInt() : 0;
                    } else {
                        $u.warn('Using stored warRank.');
                    }
                }

                statCont = $j(".attribute_stat_container");
                if (statCont.length === 6) {
                    // Energy
                    energy = statCont.eq(0);
                    if (energy.length) {
                        tStr = energy.text();
                        tArr = tStr ? tStr.matchNum() : [];
                        caap.stats['energy'] = caap.GetStatusNumbers(caap.stats['energyT']['num'] + '/' + (tArr.length === 2 ? tArr[1] : '0'));
                    } else {
                        $u.warn('Using stored energy value.');
                    }

                    // Stamina
                    stamina = statCont.eq(1);
                    if (stamina.length) {
                        tStr = stamina.text();
                        tArr = tStr ? tStr.matchNum() : [];
                        caap.stats['stamina'] = caap.GetStatusNumbers(caap.stats['staminaT']['num'] + '/' + (tArr.length === 2 ? tArr[1] : '0'));
                    } else {
                        $u.warn('Using stored stamina value.');
                    }

                    if (caap.stats['level'] >= 10) {
                        // Attack
                        attack = statCont.eq(2);
                        if (attack.length) {
                            tStr = attack.text();
                            tArr = tStr ? tStr.matchNum() : [];
                            caap.stats['attack'] = tArr.length === 2 ? tArr[1].parseInt() : 0;
                        } else {
                            $u.warn('Using stored attack value.');
                        }

                        // Defense
                        defense = statCont.eq(3);
                        if (defense.length) {
                            tStr = defense.text();
                            tArr = tStr ? tStr.matchNum() : [];
                            caap.stats['defense'] = tArr.length === 2 ? tArr[1].parseInt() : 0;
                        } else {
                            $u.warn('Using stored defense value.');
                        }
                    }

                    // Health
                    health = statCont.eq(4);
                    if (health.length) {
                        tStr = health.text();
                        tArr = tStr ? tStr.matchNum() : [];
                        caap.stats['health'] = caap.GetStatusNumbers(caap.stats['healthT']['num'] + '/' + (tArr.length === 2 ? tArr[1] : '0'));
                    } else {
                        $u.warn('Using stored health value.');
                    }
                } else {
                    $u.warn("Can't find stats containers! Using stored stats values.");
                }

                // Check for Gold Stored
                moneyStored = $j(".statsTB .money");
                if (moneyStored.length) {
                    tStr = moneyStored.text();
                    caap.stats['gold']['bank'] = tStr ? tStr.numberOnly() : 0;
                    caap.stats['gold']['total'] = caap.stats['gold']['bank'] + caap.stats['gold']['cash'];
                    moneyStored.attr({
                        title : "Click to copy value to retrieve",
                        style : "color: blue;"
                    }).hover(
                        function () {
                            caap.style.cursor = 'pointer';
                        },
                        function () {
                            caap.style.cursor = 'default';
                        }
                    ).click(function () {
                        $j("input[name='get_gold']").val(caap.stats['gold']['bank']);
                    });
                } else {
                    $u.warn('Using stored inStore.');
                }

                // Check for income
                income = $j(".statsTB .positive").eq(0);
                if (income.length) {
                    tStr = income.text();
                    caap.stats['gold']['income'] = tStr ? tStr.numberOnly() : 0;
                } else {
                    $u.warn('Using stored income.');
                }

                // Check for upkeep
                upkeep = $j(".statsTB .negative");
                if (upkeep.length) {
                    tStr = upkeep.text();
                    caap.stats['gold']['upkeep'] = tStr ? tStr.numberOnly() : 0;
                } else {
                    $u.warn('Using stored upkeep.');
                }

                // Cash Flow
                caap.stats['gold']['flow'] = caap.stats['gold']['income'] - caap.stats['gold']['upkeep'];

                // Energy potions
                energyPotions = $j("img[title='Energy Potion']");
                if (energyPotions.length) {
                    tStr = energyPotions.parent().next().text();
                    caap.stats['potions']['energy'] = tStr ? tStr.numberOnly() : 0;
                } else {
                    caap.stats['potions']['energy'] = 0;
                }

                // Stamina potions
                staminaPotions = $j("img[title='Stamina Potion']");
                if (staminaPotions.length) {
                    tStr = staminaPotions.parent().next().text();
                    caap.stats['potions']['stamina'] = tStr ? tStr.numberOnly() : 0;
                } else {
                    caap.stats['potions']['stamina'] = 0;
                }

                // Other stats
                // Atlantis Open
                atlantisImg = caap.CheckForImage("seamonster_map_finished.jpg");
                if (atlantisImg) {
                    caap.stats['other'].atlantis = true;
                } else {
                    caap.stats['other'].atlantis = false;
                }

                // Quests Completed
                otherStats = $j(".statsTB .keepTable1 tr:eq(0) td:last");
                if (otherStats.length) {
                    tStr = otherStats.text();
                    caap.stats['other']['qc'] = tStr ? tStr.parseInt() : 0;
                } else {
                    $u.warn('Using stored other.');
                }

                // Battles/Wars Won
                otherStats = $j(".statsTB .keepTable1 tr:eq(1) td:last");
                if (otherStats.length) {
                    tStr = otherStats.text();
                    caap.stats['other']['bww'] = tStr ? tStr.parseInt() : 0;
                } else {
                    $u.warn('Using stored other.');
                }

                // Battles/Wars Lost
                otherStats = $j(".statsTB .keepTable1 tr:eq(2) td:last");
                if (otherStats.length) {
                    tStr = otherStats.text();
                    caap.stats['other']['bwl'] = tStr ? tStr.parseInt() : 0;
                } else {
                    $u.warn('Using stored other.');
                }

                // Times eliminated
                otherStats = $j(".statsTB .keepTable1 tr:eq(3) td:last");
                if (otherStats.length) {
                    tStr = otherStats.text();
                    caap.stats['other']['te'] = tStr ? tStr.parseInt() : 0;
                } else {
                    $u.warn('Using stored other.');
                }

                // Times you eliminated an enemy
                otherStats = $j(".statsTB .keepTable1 tr:eq(4) td:last");
                if (otherStats.length) {
                    tStr = otherStats.text();
                    caap.stats['other']['tee'] = tStr ? tStr.parseInt() : 0;
                } else {
                    $u.warn('Using stored other.');
                }

                // Win/Loss Ratio (WLR)
                if (caap.stats['other']['bwl'] !== 0) {
                    caap.stats['other']['wlr'] = (caap.stats['other']['bww'] / caap.stats['other']['bwl']).dp(2);
                } else {
                    caap.stats['other']['wlr'] = Infinity;
                }

                // Enemy Eliminated Ratio/Eliminated (EER)
                if (caap.stats['other']['tee'] !== 0) {
                    caap.stats['other']['eer'] = (caap.stats['other']['tee'] / caap.stats['other']['te']).dp(2);
                } else {
                    caap.stats['other']['eer'] = Infinity;
                }

                // Indicators
                if (caap.stats['level'] >= 10) {
                    caap.stats['indicators']['bsi'] = ((caap.stats['attack'] + caap.stats['defense']) / caap.stats['level']).dp(2);
                    caap.stats['indicators']['lsi'] = ((caap.stats['energy']['max'] + (2 * caap.stats['stamina']['max'])) / caap.stats['level']).dp(2);
                    caap.stats['indicators']['sppl'] = ((caap.stats['energy']['max'] + (2 * caap.stats['stamina']['max']) + caap.stats['attack'] + caap.stats['defense'] + caap.stats['health']['max'] - 122) / caap.stats['level']).dp(2);
                    caap.stats['indicators']['api'] = ((caap.stats['attack'] + (caap.stats['defense'] * 0.7))).dp(2);
                    caap.stats['indicators']['dpi'] = ((caap.stats['defense'] + (caap.stats['attack'] * 0.7))).dp(2);
                    caap.stats['indicators']['mpi'] = (((caap.stats['indicators']['api'] + caap.stats['indicators']['dpi']) / 2)).dp(2);
                }

                schedule.setItem("keep", gm.getItem("CheckKeep", 1, hiddenVar) * 3600, 300);
                caap.SaveStats();
            } else {
                anotherEl = $j("a[href*='keep.php?user=']");
                if (anotherEl && anotherEl.length) {
                    tStr = anotherEl.attr("href");
                    tArr = tStr.matchUser();
                    $u.log(2, "On another player's keep", tArr.length === 2 ? tArr[1].parseInt() : 0);
                } else {
                    $u.warn("Attribute section not found and not identified as another player's keep!");
                }
            }

            if (config.getItem("enableTitles", true)) {
                spreadsheet.doTitles();
            }

            return true;
        } catch (err) {
            $u.error("ERROR in CheckResults_keep: " + err);
            return false;
        }
    },

    CheckResults_oracle: function () {
        try {
            var favorDiv = $j(),
                text     = '',
                temp     = [],
                save     = false;

            favorDiv = $j(".title_action");
            if (favorDiv.length) {
                text = favorDiv.text();
                temp = text.match(new RegExp("\\s*You have zero favor points!\\s*"));
                if (temp && temp.length === 1) {
                    $u.log(2, 'Got number of Favor Points.');
                    caap.stats['points']['favor'] = 0;
                    save = true;
                } else {
                    temp = text.match(new RegExp("\\s*You have a favor point!\\s*"));
                    if (temp && temp.length === 1) {
                        $u.log(2, 'Got number of Favor Points.');
                        caap.stats['points']['favor'] = 1;
                        save = true;
                    } else {
                        temp = text.match(new RegExp("\\s*You have (\\d+) favor points!\\s*"));
                        if (temp && temp.length === 2) {
                            $u.log(2, 'Got number of Favor Points.');
                            caap.stats['points']['favor'] = temp[1].parseInt();
                            save = true;
                        } else {
                            $u.warn('Favor Points RegExp not matched.');
                        }
                    }
                }
            } else {
                $u.warn('Favor Points div not found.');
            }

            if (save) {
                caap.SaveStats();
            }

            schedule.setItem("oracle", gm.getItem("CheckOracle", 24, hiddenVar) * 3600, 300);
            return true;
        } catch (err) {
            $u.error("ERROR in CheckResults_oracle: " + err);
            return false;
        }
    },
    /*jslint sub: false */

    CheckResults_alchemy: function () {
        try {
            if (config.getItem("enableTitles", true)) {
                spreadsheet.doTitles();
            }

            if (config.getItem("enableRecipeClean", true)) {
                var recipeDiv   = $j(),
                    titleTxt    = '',
                    titleRegExp = new RegExp("RECIPES: Create (.+)", "i"),
                    titleArr    = [],
                    tempDiv     = $j(),
                    image       = '',
                    hideCount   = config.getItem("recipeCleanCount", 1),
                    special     = [
                        "Volcanic Knight",
                        "Holy Plate",
                        "Atlantean Forcefield",
                        "Spartan Phalanx",
                        "Cronus, The World Hydra",
                        "Helm of Dragon Power",
                        "Avenger",
                        "Judgement",
                        "Tempered Steel",
                        "Bahamut, the Volcanic Dragon",
                        "Blood Zealot",
                        "Transcendence",
                        "Soul Crusher",
                        "Soulforge",
                        "Crown of Flames"
                    ];

                if (hideCount < 1) {
                    hideCount = 1;
                }

                recipeDiv = $j(".alchemyRecipeBack .recipeTitle");
                if (recipeDiv && recipeDiv.length) {
                    recipeDiv.each(function () {
                        var row = $j(this);
                        titleTxt = row.text();
                        titleArr = titleTxt ? titleTxt.trim().match(titleRegExp) : [];
                        if (titleArr && titleArr.length === 2) {
                            if (special.indexOf(titleArr[1]) >= 0) {
                                return true;
                            }

                            if (titleArr[1] === "Elven Crown") {
                                image = "gift_aeris_complete.jpg";
                            }

                            if (town.getCount(titleArr[1], image) >= hideCount && !spreadsheet.isSummon(titleArr[1], image)) {
                                tempDiv = row.parent().parent();
                                tempDiv.css("display", "none");
                                tempDiv.next().css("display", "none");
                            }
                        }

                        return true;
                    });
                }
            }

            if (config.getItem("enableIngredientsHide", false)) {
                $j("div[class='statsTTitle'],div[class='statsTMain']").css("display", "none");
            }

            if (config.getItem("enableAlchemyShrink", true)) {
                $j("div[class*='alchemyRecipeBack'],div[class*='alchemyQuestBack']").css("height", "100px");
                $j("div[class*='alchemySpace']").css("height", "4px");
                $j(".statsT2 img").not("img[src*='emporium_go.gif']").attr("style", "height: 45px; width: 45px;").parent().attr("style", "height: 45px; width: 45px;").parent().css("width", "50px");
                $j("input[name='Alchemy Submit']").css("width", "80px");
                $j(".recipeTitle").css("margin", "0px");
            }

            return true;
        } catch (err) {
            $u.error("ERROR in CheckResults_alchemy: " + err);
            return false;
        }
    },

    CheckResults_soldiers: function () {
        try {
            $j("div[class='eq_buy_costs_int']").find("select[name='amount']:first option[value='5']").attr('selected', 'selected');
            if (config.getItem("enableTitles", true)) {
                spreadsheet.doTitles();
            }

            town.GetItems("soldiers");
            schedule.setItem("soldiers", gm.getItem("CheckSoldiers", 72, hiddenVar) * 3600, 300);
            return true;
        } catch (err) {
            $u.error("ERROR in CheckResults_soldiers: " + err);
            return false;
        }
    },

    CheckResults_item: function () {
        try {
            $j("div[class='eq_buy_costs_int']").find("select[name='amount']:first option[value='5']").attr('selected', 'selected');
            if (config.getItem("enableTitles", true)) {
                spreadsheet.doTitles();
            }

            town.GetItems("item");
            schedule.setItem("item", gm.getItem("CheckItem", 72, hiddenVar) * 3600, 300);
            return true;
        } catch (err) {
            $u.error("ERROR in CheckResults_item: " + err);
            return false;
        }
    },

    CheckResults_magic: function () {
        try {
            $j("div[class='eq_buy_costs_int']").find("select[name='amount']:first option[value='5']").attr('selected', 'selected');
            if (config.getItem("enableTitles", true)) {
                spreadsheet.doTitles();
            }

            town.GetItems("magic");
            schedule.setItem("magic", gm.getItem("CheckMagic", 72, hiddenVar) * 3600, 300);
            return true;
        } catch (err) {
            $u.error("ERROR in CheckResults_magic: " + err);
            return false;
        }
    },

    CheckResults_goblin_emp: function () {
        try {
            if (config.getItem("goblinHinting", true)) {
                spreadsheet.doTitles(true);
            }

            return true;
        } catch (err) {
            $u.error("ERROR in CheckResults_goblin_emp: " + err);
            return false;
        }
    },

    CheckResults_gift: function () {
        try {
            gifting.gifts.populate();
            schedule.setItem("gift", gm.getItem("CheckGift", 72, hiddenVar) * 3600, 300);
            return true;
        } catch (err) {
            $u.error("ERROR in CheckResults_gift: " + err);
            return false;
        }
    },

    /* This section is formatted to allow Advanced Optimisation by the Closure Compiler */
    /*jslint sub: true */
    CheckResults_battlerank: function () {
        try {
            var rankDiv  = $j(),
                text     = '',
                temp     = [];

            rankDiv = $j("div[style*='battle_rank_banner.jpg']");
            if (rankDiv.length) {
                text = rankDiv.text();
                temp = text.match(new RegExp(".*with (.*) Battle Points.*"));
                if (temp && temp.length === 2) {
                    $u.log(2, 'Got Battle Rank Points.');
                    caap.stats['rank']['battlePoints'] = temp[1] ? temp[1].numberOnly() : 0;
                    caap.SaveStats();
                } else {
                    $u.warn('Battle Rank Points RegExp not matched.');
                }
            } else {
                $u.warn('Battle Rank Points div not found.');
            }

            schedule.setItem("battlerank", gm.getItem("CheckBattleRank", 48, hiddenVar) * 3600, 300);
            return true;
        } catch (err) {
            $u.error("ERROR in CheckResults_battlerank: " + err);
            return false;
        }
    },

    CheckResults_war_rank: function () {
        try {
            var rankDiv  = $j(),
                text     = '',
                temp     = [];

            rankDiv = $j("div[style*='war_rank_banner.jpg']");
            if (rankDiv.length) {
                text = rankDiv.text();
                temp = text.match(new RegExp(".*with (.*) War Points.*"));
                if (temp && temp.length === 2) {
                    $u.log(2, 'Got War Rank Points.');
                    caap.stats['rank']['warPoints'] = temp[1] ? temp[1].numberOnly() : 0;
                    caap.SaveStats();
                } else {
                    $u.warn('War Rank Points RegExp not matched.');
                }
            } else {
                $u.warn('War Rank Points div not found.');
            }

            schedule.setItem("warrank", gm.getItem("CheckWarRank", 48, hiddenVar) * 3600, 300);
            return true;
        } catch (err) {
            $u.error("ERROR in CheckResults_war_rank: " + err);
            return false;
        }
    },

    CheckResults_achievements: function () {
        try {
            var achDiv = $j(),
                tdDiv  = $j(),
                tStr   = '';

            achDiv = $j("#app46755028429_achievements_2");
            if (achDiv && achDiv.length) {
                tdDiv = achDiv.find("td div");
                if (tdDiv && tdDiv.length === 6) {
                    tStr = tdDiv.eq(0).text();
                    caap.stats['achievements']['battle']['invasions']['won'] = tStr ? tStr.numberOnly() : 0;
                    tStr = tdDiv.eq(1).text();
                    caap.stats['achievements']['battle']['duels']['won'] = tStr ? tStr.numberOnly() : 0;
                    tStr = tdDiv.eq(2).text();
                    caap.stats['achievements']['battle']['invasions']['lost'] = tStr ? tStr.numberOnly() : 0;
                    tStr = tdDiv.eq(3).text();
                    caap.stats['achievements']['battle']['duels']['lost'] = tStr ? tStr.numberOnly() : 0;
                    tStr = tdDiv.eq(4).text();
                    caap.stats['achievements']['battle']['invasions']['streak'] = tStr ? tStr.numberOnly() : 0;
                    tStr = tdDiv.eq(5).text();
                    caap.stats['achievements']['battle']['duels']['streak'] = tStr ? tStr.numberOnly() : 0;
                    if (caap.stats['achievements']['battle']['invasions']['lost']) {
                        caap.stats['achievements']['battle']['invasions']['ratio'] = (caap.stats['achievements']['battle']['invasions']['won'] / caap.stats['achievements']['battle']['invasions']['lost']).dp(2);
                    } else {
                        caap.stats['achievements']['battle']['invasions']['ratio'] = Infinity;
                    }

                    if (caap.stats['achievements']['battle']['invasions']['lost']) {
                        caap.stats['achievements']['battle']['duels']['ratio'] = (caap.stats['achievements']['battle']['duels']['won'] / caap.stats['achievements']['battle']['duels']['lost']).dp(2);
                    } else {
                        caap.stats['achievements']['battle']['duels']['ratio'] = Infinity;
                    }
                } else {
                    $u.warn('Battle Achievements problem.');
                }
            } else {
                $u.warn('Battle Achievements not found.');
            }

            achDiv = $j("#app46755028429_achievements_3");
            if (achDiv && achDiv.length) {
                tdDiv = achDiv.find("td div");
                if (tdDiv && tdDiv.length === 14) {
                    tStr = tdDiv.eq(0).text();
                    caap.stats['achievements']['monster']['gildamesh'] = tStr ? tStr.numberOnly() : 0;
                    tStr = tdDiv.eq(1).text();
                    caap.stats['achievements']['monster']['lotus'] = tStr ? tStr.numberOnly() : 0;
                    tStr = tdDiv.eq(2).text();
                    caap.stats['achievements']['monster']['colossus'] = tStr ? tStr.numberOnly() : 0;
                    tStr = tdDiv.eq(3).text();
                    caap.stats['achievements']['monster']['dragons'] = tStr ? tStr.numberOnly() : 0;
                    tStr = tdDiv.eq(4).text();
                    caap.stats['achievements']['monster']['sylvanas'] = tStr ? tStr.numberOnly() : 0;
                    tStr = tdDiv.eq(5).text();
                    caap.stats['achievements']['monster']['cronus'] = tStr ? tStr.numberOnly() : 0;
                    tStr = tdDiv.eq(6).text();
                    caap.stats['achievements']['monster']['keira'] = tStr ? tStr.numberOnly() : 0;
                    tStr = tdDiv.eq(7).text();
                    caap.stats['achievements']['monster']['sieges'] = tStr ? tStr.numberOnly() : 0;
                    tStr = tdDiv.eq(8).text();
                    caap.stats['achievements']['monster']['legion'] = tStr ? tStr.numberOnly() : 0;
                    tStr = tdDiv.eq(9).text();
                    caap.stats['achievements']['monster']['genesis'] = tStr ? tStr.numberOnly() : 0;
                    tStr = tdDiv.eq(10).text();
                    caap.stats['achievements']['monster']['skaar'] = tStr ? tStr.numberOnly() : 0;
                    tStr = tdDiv.eq(11).text();
                    caap.stats['achievements']['monster']['gehenna'] = tStr ? tStr.numberOnly() : 0;
                    tStr = tdDiv.eq(12).text();
                    caap.stats['achievements']['monster']['aurelius'] = tStr ? tStr.numberOnly() : 0;
                    tStr = tdDiv.eq(13).text();
                    caap.stats['achievements']['monster']['corvintheus'] = tStr ? tStr.numberOnly() : 0;
                } else {
                    $u.warn('Monster Achievements problem.');
                }
            } else {
                $u.warn('Monster Achievements not found.');
            }

            achDiv = $j("#app46755028429_achievements_4");
            if (achDiv && achDiv.length) {
                tdDiv = achDiv.find("td div");
                if (tdDiv && tdDiv.length === 1) {
                    tStr = tdDiv.eq(0).text();
                    caap.stats['achievements']['other']['alchemy'] = tStr ? tStr.numberOnly() : 0;
                } else {
                    $u.warn('Other Achievements problem.');
                }

                caap.SaveStats();
            } else {
                $u.warn('Other Achievements not found.');
            }

            schedule.setItem("achievements", gm.getItem("CheckAchievements", 72, hiddenVar) * 3600, 300);
            return true;
        } catch (err) {
            $u.error("ERROR in CheckResults_achievements: " + err);
            return false;
        }
    },

    CheckResults_view_class_progress: function () {
        try {
            var classDiv = $j("#app46755028429_choose_class_screen div[class*='banner_']");
            if (classDiv && classDiv.length === 6) {
                classDiv.each(function (index) {
                    var monsterClass = $j(this),
                        name         = '',
                        tStr         = '';

                    tStr = monsterClass.attr("class");
                    name = tStr ? tStr.replace("banner_", '') : '';
                    if (name && $j.isPlainObject(caap.stats['character'][name])) {
                        caap.stats['character'][name]['percent'] = monsterClass.find("img[src*='progress']").eq(0).getPercent('width').dp(2);
                        tStr = monsterClass.children().eq(2).text();
                        caap.stats['character'][name]['level'] = tStr ? tStr.numberOnly() : 0;
                        $u.log(2, "Got character class record", name, caap.stats['character'][name]);
                    } else {
                        $u.warn("Problem character class name", name);
                    }
                });

                caap.SaveStats();
            } else {
                $u.warn("Problem with character class records", classDiv);
            }

            schedule.setItem("view_class_progress", gm.getItem("CheckClassProgress", 48, hiddenVar) * 3600, 300);
            return true;
        } catch (err) {
            $u.error("ERROR in CheckResults_view_class_progress: " + err);
            return false;
        }
    },

    /////////////////////////////////////////////////////////////////////
    //                          QUESTING
    // Quest function does action, DrawQuest sets up the page and gathers info
    /////////////////////////////////////////////////////////////////////

    MaxEnergyQuest: function () {
        var maxIdleEnergy = caap.stats['energy']['max'],
            theGeneral = config.getItem('IdleGeneral', 'Use Current');

        if (theGeneral !== 'Use Current') {
            maxIdleEnergy = general.GetEnergyMax(theGeneral);
            if (!maxIdleEnergy) {
                $u.log(2, "Changing to idle general to get Max energy");
                if (general.Select('IdleGeneral')) {
                    return true;
                }
            }
        }

        if (caap.stats['energy']['num'] >= maxIdleEnergy) {
            return caap.Quests();
        }

        return false;
    },
    /*jslint sub: false */

    QuestAreaInfo: {
        'Land of Fire' : {
            clas : 'quests_stage_1',
            base : 'land_fire',
            next : 'Land of Earth',
            area : '',
            list : '',
            boss : 'Heart of Fire',
            orb  : 'Orb of Gildamesh'
        },
        'Land of Earth' : {
            clas : 'quests_stage_2',
            base : 'land_earth',
            next : 'Land of Mist',
            area : '',
            list : '',
            boss : 'Gift of Earth',
            orb  : 'Colossal Orb'
        },
        'Land of Mist' : {
            clas : 'quests_stage_3',
            base : 'land_mist',
            next : 'Land of Water',
            area : '',
            list : '',
            boss : 'Eye of the Storm',
            orb  : 'Sylvanas Orb'
        },
        'Land of Water' : {
            clas : 'quests_stage_4',
            base : 'land_water',
            next : 'Demon Realm',
            area : '',
            list : '',
            boss : 'A Look into the Darkness',
            orb  : 'Orb of Mephistopheles'
        },
        'Demon Realm' : {
            clas : 'quests_stage_5',
            base : 'land_demon_realm',
            next : 'Undead Realm',
            area : '',
            list : '',
            boss : 'The Rift',
            orb  : 'Orb of Keira'
        },
        'Undead Realm' : {
            clas : 'quests_stage_6',
            base : 'land_undead_realm',
            next : 'Underworld',
            area : '',
            list : '',
            boss : 'Undead Embrace',
            orb  : 'Lotus Orb'
        },
        'Underworld' : {
            clas : 'quests_stage_7',
            base : 'tab_underworld',
            next : 'Kingdom of Heaven',
            area : '',
            list : '',
            boss : 'Confrontation',
            orb  : 'Orb of Skaar Deathrune'
        },
        'Kingdom of Heaven' : {
            clas : 'quests_stage_8',
            base : 'tab_heaven',
            next : 'Ivory City',
            area : '',
            list : '',
            boss : 'Archangels Wrath',
            orb  : 'Orb of Azriel'
        },
        'Ivory City' : {
            clas : 'quests_stage_9',
            base : 'tab_ivory',
            next : 'Earth II',
            area : '',
            list : '',
            boss : 'Entrance to the Throne',
            orb  : 'Orb of Alpha Mephistopheles'
        },
        'Earth II' : {
            clas : 'quests_stage_10',
            base : 'tab_earth2',
            next : 'Water II',
            area : '',
            list : '',
            boss : "Lion's Rebellion",
            orb  : 'Orb of Aurelius'
        },
        'Water II' : {
            clas : 'quests_stage_11',
            base : 'tab_water2',
            next : 'Ambrosia',
            area : 'Demi Quests',
            list : 'demiQuestList',
            boss : "Corvintheus",
            orb  : 'Orb of Corvintheus'
        },
        'Ambrosia' : {
            clas : 'symbolquests_stage_1',
            next : 'Malekus',
            area : '',
            list : ''
        },
        'Malekus' : {
            clas : 'symbolquests_stage_2',
            next : 'Corvintheus',
            area : '',
            list : ''
        },
        'Corvintheus' : {
            clas : 'symbolquests_stage_3',
            next : 'Aurora',
            area : '',
            list : ''
        },
        'Aurora' : {
            clas : 'symbolquests_stage_4',
            next : 'Azeron',
            area : '',
            list : ''
        },
        'Azeron' : {
            clas : 'symbolquests_stage_5',
            next : 'Atlantis',
            area : 'Atlantis',
            list : 'atlantisQuestList'
        },
        'Atlantis' : {
            clas : 'monster_quests_stage_1',
            next : '',
            area : '',
            list : ''
        }
    },

    demiQuestTable : {
        'Ambrosia'    : 'energy',
        'Malekus'     : 'attack',
        'Corvintheus' : 'defense',
        'Aurora'      : 'health',
        'Azeron'      : 'stamina'
    },

    /* This section is formatted to allow Advanced Optimisation by the Closure Compiler */
    /*jslint sub: true */
    Quests: function () {
        try {
            var storeRetrieve = state.getItem('storeRetrieve', '');
            if (storeRetrieve) {
                if (storeRetrieve === 'general') {
                    $u.log(1, "storeRetrieve", storeRetrieve);
                    if (general.Select('BuyGeneral')) {
                        return true;
                    }

                    state.setItem('storeRetrieve', '');
                    return true;
                } else {
                    return caap.RetrieveFromBank(storeRetrieve);
                }
            }

            caap.SetDivContent('quest_mess', '');
            var whenQuest = config.getItem('WhenQuest', 'Never');
            if (whenQuest === 'Never') {
                caap.SetDivContent('quest_mess', 'Questing off');
                return false;
            }

            if (whenQuest === 'Not Fortifying' || (config.getItem('PrioritiseMonsterAfterLvl', false) && state.getItem('KeepLevelUpGeneral', false))) {
                var fortMon = state.getItem('targetFromfortify', new monster.energyTarget().data);
                if ($j.isPlainObject(fortMon) && fortMon['name'] && fortMon['type']) {
                    switch (fortMon['type']) {
                    case "Fortify":
                        var maxHealthtoQuest = config.getItem('MaxHealthtoQuest', 0);
                        if (!maxHealthtoQuest) {
                            caap.SetDivContent('quest_mess', '<span style="font-weight: bold;">No valid over fortify %</span>');
                            return false;
                        }

                        caap.SetDivContent('quest_mess', 'No questing until attack target ' + fortMon['name'] + " health exceeds " + config.getItem('MaxToFortify', 0) + '%');
                        var targetFrombattle_monster = state.getItem('targetFrombattle_monster', '');
                        if (!targetFrombattle_monster) {
                            var currentMonster = monster.getItem(targetFrombattle_monster);
                            if (!currentMonster['fortify']) {
                                if (currentMonster['fortify'] < maxHealthtoQuest) {
                                    caap.SetDivContent('quest_mess', 'No questing until fortify target ' + targetFrombattle_monster + ' health exceeds ' + maxHealthtoQuest + '%');
                                    return false;
                                }
                            }
                        }

                        break;
                    case "Strengthen":
                        caap.SetDivContent('quest_mess', 'No questing until attack target ' + fortMon['name'] + " at full strength.");
                        break;
                    case "Stun":
                        caap.SetDivContent('quest_mess', 'No questing until attack target ' + fortMon['name'] + " stunned.");
                        break;
                    default:
                    }

                    return false;
                }
            }

            var autoQuestName = state.getItem('AutoQuest', caap.newAutoQuest())['name'];
            if (!autoQuestName) {
                if (config.getItem('WhyQuest', 'Manual') === 'Manual') {
                    caap.SetDivContent('quest_mess', 'Pick quest manually.');
                    return false;
                }

                caap.SetDivContent('quest_mess', 'Searching for quest.');
                $u.log(1, "Searching for quest");
            } else {
                var energyCheck = caap.CheckEnergy(state.getItem('AutoQuest', caap.newAutoQuest())['energy'], whenQuest, 'quest_mess');
                if (!energyCheck) {
                    return false;
                }
            }

            if (state.getItem('AutoQuest', caap.newAutoQuest())['general'] === 'none' || config.getItem('ForceSubGeneral', false)) {
                if (general.Select('SubQuestGeneral')) {
                    return true;
                }
            } else if (general.LevelUpCheck('QuestGeneral')) {
                if (general.Select('LevelUpGeneral')) {
                    return true;
                }

                $u.log(2, 'Using level up general');
            }

            switch (config.getItem('QuestArea', 'Quest')) {
            case 'Quest' :
                var imgExist = false;
                if (caap.stats['level'] > 7) {
                    var subQArea = config.getItem('QuestSubArea', 'Land of Fire');
                    var landPic = caap.QuestAreaInfo[subQArea].base;
                    if (landPic === 'tab_heaven' || config.getItem('GetOrbs', false) && config.getItem('WhyQuest', 'Manual') !== 'Manual') {
                        if (caap.CheckMagic()) {
                            return true;
                        }
                    }

                    if (landPic === 'tab_underworld' || landPic === 'tab_ivory' || landPic === 'tab_earth2' || landPic === 'tab_water2') {
                        imgExist = caap.NavigateTo('quests,jobs_tab_more.gif,' + landPic + '_small.gif', landPic + '_big');
                    } else if (landPic === 'tab_heaven') {
                        imgExist = caap.NavigateTo('quests,jobs_tab_more.gif,' + landPic + '_small2.gif', landPic + '_big2.gif');
                    } else if ((landPic === 'land_demon_realm') || (landPic === 'land_undead_realm')) {
                        imgExist = caap.NavigateTo('quests,jobs_tab_more.gif,' + landPic + '.gif', landPic + '_sel');
                    } else {
                        imgExist = caap.NavigateTo('quests,jobs_tab_back.gif,' + landPic + '.gif', landPic + '_sel');
                    }
                } else {
                    imgExist = caap.NavigateTo('quests', 'quest_back_1.jpg');
                }

                if (imgExist) {
                    return true;
                }

                break;
            case 'Demi Quests' :
                if (caap.NavigateTo('quests,symbolquests', 'demi_quest_on.gif')) {
                    return true;
                }

                var subDQArea = config.getItem('QuestSubArea', 'Ambrosia');
                var picSlice = $j("img[src*='deity_" + caap.demiQuestTable[subDQArea] + "']");
                if (picSlice.css("height") !== '160px') {
                    if (caap.NavigateTo('deity_' + caap.demiQuestTable[subDQArea])) {
                        return true;
                    }
                }

                break;
            case 'Atlantis' :
                if (!caap.CheckForImage('tab_atlantis_on.gif')) {
                    return caap.NavigateTo('quests,monster_quests');
                }

                break;
            default :
            }

            var button = caap.CheckForImage('quick_switch_button.gif');
            if (button && !config.getItem('ForceSubGeneral', false)) {
                $u.log(2, 'Clicking on quick switch general button.');
                caap.Click(button);
                general.quickSwitch = true;
                return true;
            }

            if (general.quickSwitch) {
                general.GetEquippedStats();
            }

            var costToBuy = 0;
            //Buy quest requires popup
            var itemBuyPopUp = $j("form[id*='itemBuy']");
            if (itemBuyPopUp && itemBuyPopUp.length) {
                $u.log(1, 'itemBuy');
                state.setItem('storeRetrieve', 'general');
                if (general.Select('BuyGeneral')) {
                    return true;
                }

                state.setItem('storeRetrieve', '');
                costToBuy = itemBuyPopUp.text().replace(new RegExp(".*\\$"), '').replace(new RegExp("[^\\d]{3,}.*"), '').parseInt();
                $u.log(2, "costToBuy", costToBuy);
                if (caap.stats['gold']['cash'] < costToBuy) {
                    //Retrieving from Bank
                    if (caap.stats['gold']['cash'] + (caap.stats['gold']['bank'] - config.getItem('minInStore', 0)) >= costToBuy) {
                        $u.log(1, "Trying to retrieve", costToBuy - caap.stats['gold']['cash']);
                        state.setItem("storeRetrieve", costToBuy - caap.stats['gold']['cash']);
                        return caap.RetrieveFromBank(costToBuy - caap.stats['gold']['cash']);
                    } else {
                        $u.log(1, "Cant buy requires, stopping quest");
                        caap.ManualAutoQuest();
                        return false;
                    }
                }

                button = caap.CheckForImage('quick_buy_button.jpg');
                if (button) {
                    $u.log(1, 'Clicking on quick buy button.');
                    caap.Click(button);
                    return true;
                }

                $u.warn("Cant find buy button");
                return false;
            }

            button = caap.CheckForImage('quick_buy_button.jpg');
            if (button) {
                $u.log(1, 'quick_buy_button');
                state.setItem('storeRetrieve', 'general');
                if (general.Select('BuyGeneral')) {
                    return true;
                }

                state.setItem('storeRetrieve', '');
                costToBuy = button.previousElementSibling.previousElementSibling.previousElementSibling
                    .previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling
                    .firstChild.data.replace(new RegExp("[^0-9]", "g"), '');
                $u.log(2, "costToBuy", costToBuy);
                if (caap.stats['gold']['cash'] < costToBuy) {
                    //Retrieving from Bank
                    if (caap.stats['gold']['cash'] + (caap.stats['gold']['bank'] - config.getItem('minInStore', 0)) >= costToBuy) {
                        $u.log(1, "Trying to retrieve: ", costToBuy - caap.stats['gold']['cash']);
                        state.setItem("storeRetrieve", costToBuy - caap.stats['gold']['cash']);
                        return caap.RetrieveFromBank(costToBuy - caap.stats['gold']['cash']);
                    } else {
                        $u.log(1, "Cant buy General, stopping quest");
                        caap.ManualAutoQuest();
                        return false;
                    }
                }

                $u.log(2, 'Clicking on quick buy general button.');
                caap.Click(button);
                return true;
            }

            var autoQuestDivs = {
                    name     : '',
                    click    : $j(),
                    tr       : $j(),
                    genDiv   : $j(),
                    orbCheck : false
                };

            autoQuestDivs = caap.CheckResults_quests(true);
            //$u.log(1, 'autoQuestDivs/autoQuestName', autoQuestDivs, autoQuestName);
            if (!autoQuestDivs.name) {
                $u.log(1, 'Could not find AutoQuest.');
                caap.SetDivContent('quest_mess', 'Could not find AutoQuest.');
                return false;
            }

            if (autoQuestDivs.name !== autoQuestName) {
                $u.log(1, 'New AutoQuest found.');
                caap.SetDivContent('quest_mess', 'New AutoQuest found.');
                return true;
            }

            // if found missing requires, click to buy
            if (autoQuestDivs.tr && autoQuestDivs.tr.length) {
                var background = autoQuestDivs.tr.find("div[style*='background-color']");
                if (background && background.length && background.css("background-color") === 'rgb(158, 11, 15)') {
                    $u.log(1, "Missing item", autoQuestDivs.tr);
                    if (config.getItem('QuestSubArea', 'Atlantis') === 'Atlantis') {
                        $u.log(1, "Cant buy Atlantis items, stopping quest");
                        caap.ManualAutoQuest();
                        return false;
                    }

                    $u.log(2, "background.style.backgroundColor", background.css("background-color"));
                    state.setItem('storeRetrieve', 'general');
                    if (general.Select('BuyGeneral')) {
                        return true;
                    }

                    state.setItem('storeRetrieve', '');
                    $u.log(2, "background.children().eq(0).children().eq(0).attr('title')", background.children().eq(0).children().eq(0).attr("title"));
                    if (background.children().eq(0).children().eq(0).attr("title")) {
                        $u.log(2, "Clicking to buy", background.children().eq(0).children().eq(0).attr("title"));
                        caap.Click(background.children().eq(0).children().eq(0).get(0));
                        return true;
                    }
                }
            } else {
                $u.warn('Can not buy quest item');
                return false;
            }

            var questGeneral = state.getItem('AutoQuest', caap.newAutoQuest())['general'];
            if (questGeneral === 'none' || config.getItem('ForceSubGeneral', false)) {
                if (general.Select('SubQuestGeneral')) {
                    return true;
                }
            } else if (questGeneral && questGeneral !== general.GetCurrent()) {
                if (general.LevelUpCheck("QuestGeneral")) {
                    if (general.Select('LevelUpGeneral')) {
                        return true;
                    }

                    $u.log(2, 'Using level up general');
                } else {
                    if (autoQuestDivs.genDiv && autoQuestDivs.genDiv.length) {
                        $u.log(2, 'Clicking on general', questGeneral);
                        caap.Click(autoQuestDivs.genDiv.get(0));
                        return true;
                    } else {
                        $u.warn('Can not click on general', questGeneral);
                        return false;
                    }
                }
            }

            if (autoQuestDivs.click && autoQuestDivs.click) {
                $u.log(2, 'Clicking auto quest', autoQuestName);
                state.setItem('ReleaseControl', true);
                caap.Click(autoQuestDivs.click.get(0));
                caap.ShowAutoQuest();
                if (autoQuestDivs.orbCheck) {
                    schedule.setItem("magic", 0);
                }

                return true;
            } else {
                $u.warn('Can not click auto quest', autoQuestName);
                return false;
            }
        } catch (err) {
            $u.error("ERROR in Quests: " + err);
            return false;
        }
    },

    questName: null,

    CheckResults_symbolquests: function (resultsText) {
        try {
            var demiDiv = $j(),
                points  = [],
                success = true;

            if (resultsText && typeof resultsText === 'string') {
                caap.BlessingResults(resultsText);
            }

            demiDiv = $j("div[id*='app46755028429_symbol_desc_symbolquests']");
            if (demiDiv && demiDiv.length === 5) {
                demiDiv.each(function (index) {
                    var temp = '';
                    temp = $j(this).children().next().eq(1).children().children().next().text();
                    temp = temp ? temp.numberOnly() : '';
                    if ($u.isNum(temp)) {
                        points.push(temp);
                    } else {
                        success = false;
                        $u.warn('Demi-Power temp text problem', temp);
                    }
                });

                $u.log(3, 'Points', points);
                if (success) {
                    caap.demi['ambrosia']['power']['total'] = points[0] ? points[0] : 0;
                    caap.demi['malekus']['power']['total'] = points[1] ? points[1] : 0;
                    caap.demi['corvintheus']['power']['total'] = points[2] ? points[2] : 0;
                    caap.demi['aurora']['power']['total'] = points[3] ? points[3] : 0;
                    caap.demi['azeron']['power']['total'] = points[4] ? points[4] : 0;
                    schedule.setItem("symbolquests", gm.getItem("CheckSymbolQuests", 24, hiddenVar) * 3600, 300);
                    caap.SaveDemi();
                }
            } else {
                $u.warn("Demi demiDiv problem", demiDiv);
            }

            return true;
        } catch (err) {
            $u.error("ERROR in CheckResults_symbolquests: " + err);
            return false;
        }
    },
    /*jslint sub: false */

    isBossQuest: function (name) {
        try {
            var qn    = '',
                found = false;

            for (qn in caap.QuestAreaInfo) {
                if (caap.QuestAreaInfo.hasOwnProperty(qn)) {
                    if (caap.QuestAreaInfo[qn].boss && caap.QuestAreaInfo[qn].boss === name) {
                        found = true;
                        break;
                    }
                }
            }

            return found;
        } catch (err) {
            $u.error("ERROR in isBossQuest: " + err);
            return false;
        }
    },

    symbolquestsListener: function (event) {
        $u.log(3, "symbolquests");
        state.setItem('clickUrl', 'http://apps.facebook.com/castle_age/symbolquests.php');
        caap.CheckResults();
    },

    /* This section is formatted to allow Advanced Optimisation by the Closure Compiler */
    /*jslint sub: true */
    CheckResults_quests: function (pickQuestTF) {
        try {
            //$u.log(1, "CheckResults_quests pickQuestTF", pickQuestTF);
            pickQuestTF = pickQuestTF ? pickQuestTF : false;
            if ($j("#app46755028429_quest_map_container").length) {
                $j("div[id*='app46755028429_meta_quest_']").each(function (index) {
                    var row = $j(this);
                    if (!(row.find("img[src*='_completed']").length || row.find("img[src*='_locked']").length)) {
                        $j("div[id='app46755028429_quest_wrapper_" + row.attr("id").replace("app46755028429_meta_quest_", '') + "']").css("display", "block");
                    }
                });
            }

            if (config.getItem("enableTitles", true)) {
                spreadsheet.doTitles();
            }

            var whyQuest = config.getItem('WhyQuest', 'Manual');
            if (pickQuestTF === true && whyQuest !== 'Manual') {
                state.setItem('AutoQuest', caap.newAutoQuest());
            }

            var bestReward  = 0,
                rewardRatio = 0,
                div         = $j(),
                ss          = $j(),
                s           = 0,
                len         = 0;

            if (caap.CheckForImage('demi_quest_on.gif')) {
                caap.CheckResults_symbolquests(pickQuestTF);
                $j("div[id*='app46755028429_symbol_tab_symbolquests']").unbind('click', caap.symbolquestsListener).bind('click', caap.symbolquestsListener);
                ss = $j("div[id*='symbol_displaysymbolquest']");
                if (!ss || !ss.length) {
                    $u.warn("Failed to find symbol_displaysymbolquest");
                }

                ss.each(function () {
                    div = $j(this);
                    if (div.css("display") !== 'none') {
                        return false;
                    }

                    return true;
                });
            } else {
                div = $j(document.body);
            }

            ss = div.find("div[class*='quests_background']");
            if (!ss || !ss.length) {
                $u.warn("Failed to find quests_background");
                return false;
            }

            var haveOrb      = false,
                isTheArea    = false,
                questSubArea = '';

            questSubArea = config.getItem('QuestSubArea', 'Land of Fire');
            isTheArea = caap.CheckCurrentQuestArea(questSubArea);
            $u.log(2, "Is quest area", questSubArea, isTheArea);
            if (isTheArea && whyQuest !== 'Manual' && config.getItem('GetOrbs', false)) {
                if ($j("input[alt='Perform Alchemy']").length) {
                    haveOrb = true;
                } else {
                    if (questSubArea && caap.QuestAreaInfo[questSubArea].orb) {
                        haveOrb = town.haveOrb(caap.QuestAreaInfo[questSubArea].orb);
                    }
                }

                $u.log(2, "Have Orb for", questSubArea, haveOrb);
                if (haveOrb && caap.isBossQuest(state.getItem('AutoQuest', caap.newAutoQuest())['name'])) {
                    state.setItem('AutoQuest', caap.newAutoQuest());
                }
            }

            var autoQuestDivs = {
                name     : '',
                click    : $j(),
                tr       : $j(),
                genDiv   : $j(),
                orbCheck : false
            };

            $j("div[class='autoquest']").remove();
            var expRegExp       = new RegExp("\\+(\\d+)"),
                energyRegExp    = new RegExp("(\\d+)\\s+energy", "i"),
                moneyRegExp     = new RegExp("\\$([0-9,]+)\\s*-\\s*\\$([0-9,]+)", "i"),
                money2RegExp    = new RegExp("\\$([0-9,]+)mil\\s*-\\s*\\$([0-9,]+)mil", "i"),
                influenceRegExp = new RegExp("(\\d+)%");

            ss.each(function () {
                div = $j(this);
                caap.questName = caap.GetQuestName(div);
                if (!caap.questName) {
                    return true;
                }

                var reward     = null,
                    energy     = null,
                    experience = null,
                    divTxt     = '',
                    expM       = [],
                    tStr       = '';

                divTxt = div.text();
                expM = divTxt ? divTxt.match(expRegExp) : [];
                if (expM && expM.length === 2) {
                    experience = expM[1] ? expM[1].numberOnly() : 0;
                } else {
                    var expObj = $j("div[class='quest_experience']");
                    if (expObj && expObj.length) {
                        tStr = expObj.text();
                        experience = tStr ? tStr.numberOnly() : 0;
                    } else {
                        $u.warn("Can't find experience for", caap.questName);
                    }
                }

                var idx = caap.questName.indexOf('<br>');
                if (idx >= 0) {
                    caap.questName = caap.questName.substring(0, idx);
                }

                var energyM = divTxt.match(energyRegExp);
                if (energyM && energyM.length === 2) {
                    energy = energyM[1] ? energyM[1].numberOnly() : 0;
                } else {
                    var eObj = div.find("div[class*='quest_req']");
                    if (eObj && eObj.length) {
                        energy = eObj.find('b').eq(0).text().numberOnly();
                    }
                }

                if (!energy) {
                    $u.warn("Can't find energy for", caap.questName);
                    return true;
                }

                var moneyM     = [],
                    rewardLow  = 0,
                    rewardHigh = 0;

                moneyM = divTxt ? divTxt.removeHtmlJunk().match(moneyRegExp) : [];
                if (moneyM && moneyM.length === 3) {
                    rewardLow  = moneyM[1] ? moneyM[1].numberOnly() : 0;
                    rewardHigh = moneyM[2] ? moneyM[2].numberOnly() : 0;
                    reward = (rewardLow + rewardHigh) / 2;
                } else {
                    moneyM = divTxt ? divTxt.removeHtmlJunk().match(money2RegExp) : [];
                    if (moneyM && moneyM.length === 3) {
                        rewardLow  = moneyM[1] ? moneyM[1].numberOnly() * 1000000 : 0;
                        rewardHigh = moneyM[2] ? moneyM[2].numberOnly() * 1000000 : 0;
                        reward = (rewardLow + rewardHigh) / 2;
                    } else {
                        $u.warn('No money found for', caap.questName, divTxt);
                    }
                }

                var click = div.find("input[name*='Do Quest']");
                if (!click || !click.length) {
                    $u.warn('No button found for', caap.questName);
                    return true;
                }

                var influence = -1;
                if (caap.isBossQuest(caap.questName)) {
                    if ($j("div[class='quests_background_sub']").length) {
                        //if boss and found sub quests
                        influence = 100;
                    } else {
                        influence = 0;
                    }
                } else {
                    var influenceList = divTxt.match(influenceRegExp);
                    if (influenceList && influenceList.length === 2) {
                        influence = influenceList[1] ? influenceList[1].parseInt() : 0;
                    } else {
                        $u.warn("Influence div not found.", influenceList);
                    }
                }

                if (influence < 0) {
                    $u.warn('No influence found for', caap.questName, divTxt);
                }

                var general = 'none',
                    genDiv  = $j();

                if (influence >= 0 && influence < 100) {
                    genDiv = div.find("div[class*='quest_act_gen']");
                    if (genDiv && genDiv.length) {
                        genDiv = genDiv.find("img[src*='jpg']");
                        if (genDiv && genDiv.length) {
                            general = genDiv.attr("title");
                        }
                    }
                }

                var questType = 'subquest';
                if (div.attr("class") === 'quests_background') {
                    questType = 'primary';
                } else if (div.attr("class") === 'quests_background_special') {
                    questType = 'boss';
                }

                caap.LabelQuests(div, energy, reward, experience, click);
                $u.log(9, "QuestSubArea", questSubArea);
                if (isTheArea) {
                    if (config.getItem('GetOrbs', false) && questType === 'boss' && whyQuest !== 'Manual' && !haveOrb) {
                        caap.updateAutoQuest('name', caap.questName);
                        pickQuestTF = true;
                        autoQuestDivs.orbCheck = true;
                    }

                    switch (whyQuest) {
                    case 'Advancement' :
                        if (influence >= 0) {
                            if (!state.getItem('AutoQuest', caap.newAutoQuest())['name'] && questType === 'primary' && influence < 100) {
                                caap.updateAutoQuest('name', caap.questName);
                                pickQuestTF = true;
                            }
                        } else {
                            $u.warn("Can't find influence for", caap.questName, influence);
                        }

                        break;
                    case 'Max Influence' :
                        if (influence >= 0) {
                            if (!state.getItem('AutoQuest', caap.newAutoQuest())['name'] && influence < 100) {
                                caap.updateAutoQuest('name', caap.questName);
                                pickQuestTF = true;
                            }
                        } else {
                            $u.warn("Can't find influence for", caap.questName, influence);
                        }

                        break;
                    case 'Max Experience' :
                        rewardRatio = (Math.floor(experience / energy * 100) / 100);
                        if (bestReward < rewardRatio) {
                            caap.updateAutoQuest('name', caap.questName);
                            pickQuestTF = true;
                        }

                        break;
                    case 'Max Gold' :
                        rewardRatio = (Math.floor(reward / energy * 10) / 10);
                        if (bestReward < rewardRatio) {
                            caap.updateAutoQuest('name', caap.questName);
                            pickQuestTF = true;
                        }

                        break;
                    default :
                    }

                    if (isTheArea && state.getItem('AutoQuest', caap.newAutoQuest())['name'] === caap.questName) {
                        bestReward = rewardRatio;
                        var expRatio = experience / (energy ? energy : 1);
                        $u.log(2, "Setting AutoQuest", caap.questName);
                        var tempAutoQuest = caap.newAutoQuest();
                        tempAutoQuest['name'] = caap.questName;
                        tempAutoQuest['energy'] = energy;
                        tempAutoQuest['general'] = general;
                        tempAutoQuest['expRatio'] = expRatio;
                        state.setItem('AutoQuest', tempAutoQuest);
                        $u.log(3, "CheckResults_quests", state.getItem('AutoQuest', caap.newAutoQuest()));
                        caap.ShowAutoQuest();
                        autoQuestDivs.name = caap.questName;
                        autoQuestDivs.click = click;
                        autoQuestDivs.tr = div;
                        autoQuestDivs.genDiv = genDiv;
                    }
                }

                //$u.log(1, "End of run");
                return true;
            });

            //$u.log(1, "pickQuestTF", pickQuestTF);
            if (pickQuestTF) {
                if (state.getItem('AutoQuest', caap.newAutoQuest())['name']) {
                    //$u.log(2, "return autoQuestDivs", autoQuestDivs);
                    caap.ShowAutoQuest();
                    return autoQuestDivs;
                }

                //if not find quest, probably you already maxed the subarea, try another area
                if ((whyQuest === 'Max Influence' || whyQuest === 'Advancement') && config.getItem('switchQuestArea', true)) {
                    $u.log(9, "QuestSubArea", questSubArea);
                    if (questSubArea && caap.QuestAreaInfo[questSubArea] && caap.QuestAreaInfo[questSubArea].next) {
                        questSubArea = config.setItem('QuestSubArea', caap.QuestAreaInfo[questSubArea].next);
                        if (caap.QuestAreaInfo[questSubArea].area && caap.QuestAreaInfo[questSubArea].list) {
                            config.setItem('QuestArea', caap.QuestAreaInfo[questSubArea].area);
                            caap.ChangeDropDownList('QuestSubArea', caap[caap.QuestAreaInfo[questSubArea].list]);
                        }
                    } else {
                        $u.log(1, "Setting questing to manual");
                        caap.ManualAutoQuest();
                    }

                    $u.log(2, "UpdateQuestGUI: Setting drop down menus");
                    caap.SelectDropOption('QuestArea', config.getItem('QuestArea', 'Quest'));
                    caap.SelectDropOption('QuestSubArea', questSubArea);
                    return false;
                }

                $u.log(1, "Finished QuestArea.");
                caap.ManualAutoQuest();
            }

            return false;
        } catch (err) {
            $u.error("ERROR in CheckResults_quests: " + err);
            caap.ManualAutoQuest();
            return false;
        }
    },

    ClassToQuestArea: {
        'quests_stage_1'         : 'Land of Fire',
        'quests_stage_2'         : 'Land of Earth',
        'quests_stage_3'         : 'Land of Mist',
        'quests_stage_4'         : 'Land of Water',
        'quests_stage_5'         : 'Demon Realm',
        'quests_stage_6'         : 'Undead Realm',
        'quests_stage_7'         : 'Underworld',
        'quests_stage_8'         : 'Kingdom of Heaven',
        'quests_stage_9'         : 'Ivory City',
        'quests_stage_10'        : 'Earth II',
        'quests_stage_11'        : 'Water II',
        'symbolquests_stage_1'   : 'Ambrosia',
        'symbolquests_stage_2'   : 'Malekus',
        'symbolquests_stage_3'   : 'Corvintheus',
        'symbolquests_stage_4'   : 'Aurora',
        'symbolquests_stage_5'   : 'Azeron',
        'monster_quests_stage_1' : 'Atlantis'
    },

    CheckCurrentQuestArea: function (QuestSubArea) {
        try {
            var found = false;

            if (caap.stats['level'] < 8) {
                if (caap.CheckForImage('quest_back_1.jpg')) {
                    found = true;
                }
            } else if (QuestSubArea && caap.QuestAreaInfo[QuestSubArea]) {
                if ($j("div[class='" + caap.QuestAreaInfo[QuestSubArea].clas + "']").length) {
                    found = true;
                }
            }

            return found;
        } catch (err) {
            $u.error("ERROR in CheckCurrentQuestArea: " + err);
            return false;
        }
    },
    /*jslint sub: false */

    GetQuestName: function (questDiv) {
        try {
            var item_title = $j(),
                firstb     = $j();

            item_title = questDiv.find("div[class*='quest_desc'],div[class*='quest_sub_title']");
            if (!item_title || !item_title.length) {
                $u.log(2, "Can't find quest description or sub-title");
                return false;
            }

            if (item_title.html().match(/LOCK/)) {
                $u.log(2, "Quest locked", item_title);
                return false;
            }

            firstb = item_title.find("b").eq(0);
            if (!firstb || !firstb.length) {
                $u.warn("Can't get bolded member out of", item_title.html());
                return false;
            }

            caap.questName = firstb.text().trim();
            if (!caap.questName) {
                $u.warn('No quest name for this row');
                return false;
            }

            return caap.questName;
        } catch (err) {
            $u.error("ERROR in GetQuestName: " + err);
            return false;
        }
    },

    /*------------------------------------------------------------------------------------\
    CheckEnergy gets passed the default energy requirement plus the condition text from
    the 'Whenxxxxx' setting and the message div name.
    \------------------------------------------------------------------------------------*/
    /* This section is formatted to allow Advanced Optimisation by the Closure Compiler */
    /*jslint sub: true */
    CheckEnergy: function (energy, condition, msgdiv) {
        try {
            if (!caap.stats['energy'] || !energy) {
                return false;
            }

            if (condition === 'Energy Available' || condition === 'Not Fortifying') {
                if (caap.stats['energy']['num'] >= energy) {
                    return true;
                }

                if (msgdiv) {
                    caap.SetDivContent(msgdiv, 'Waiting for more energy: ' + caap.stats['energy']['num'] + "/" + (energy ? energy : ""));
                }
            } else if (condition === 'At X Energy') {
                if (caap.InLevelUpMode() && caap.stats['energy']['num'] >= energy) {
                    if (msgdiv) {
                        caap.SetDivContent(msgdiv, 'Burning all energy to level up');
                    }

                    return true;
                }

                var whichEnergy = config.getItem('XQuestEnergy', 1);
                if (caap.stats['energy']['num'] >= whichEnergy) {
                    state.setItem('AtXQuestEnergy', true);
                }

                if (caap.stats['energy']['num'] >= energy) {
                    if (state.getItem('AtXQuestEnergy', false) && caap.stats['energy']['num'] >= config.getItem('XMinQuestEnergy', 0)) {
                        caap.SetDivContent(msgdiv, 'At X energy. Burning to ' + config.getItem('XMinQuestEnergy', 0));
                        return true;
                    } else {
                        state.setItem('AtXQuestEnergy', false);
                    }
                }

                if (energy > whichEnergy) {
                    whichEnergy = energy;
                }

                if (msgdiv) {
                    caap.SetDivContent(msgdiv, 'Waiting for X energy: ' + caap.stats['energy']['num'] + "/" + whichEnergy);
                }
            } else if (condition === 'At Max Energy') {
                var maxIdleEnergy = caap.stats['energy']['max'],
                    theGeneral = config.getItem('IdleGeneral', 'Use Current');

                if (theGeneral !== 'Use Current') {
                    maxIdleEnergy = general.GetEnergyMax(theGeneral);
                }

                if (theGeneral !== 'Use Current' && !maxIdleEnergy) {
                    $u.log(2, "Changing to idle general to get Max energy");
                    if (general.Select('IdleGeneral')) {
                        return true;
                    }
                }

                if (caap.stats['energy']['num'] >= maxIdleEnergy) {
                    return true;
                }

                if (caap.InLevelUpMode() && caap.stats['energy']['num'] >= energy) {
                    if (msgdiv) {
                        $u.log(1, "Burning all energy to level up");
                        caap.SetDivContent(msgdiv, 'Burning all energy to level up');
                    }

                    return true;
                }

                if (msgdiv) {
                    caap.SetDivContent(msgdiv, 'Waiting for max energy: ' + caap.stats['energy']['num'] + "/" + maxIdleEnergy);
                }
            }

            return false;
        } catch (err) {
            $u.error("ERROR in CheckEnergy: " + err);
            return false;
        }
    },

    LabelListener: function (e) {
        try {
            var sps           = e.target.getElementsByTagName('span'),
                mainDiv       = $j(),
                className     = '',
                tempAutoQuest = {};

            if (sps.length <= 0) {
                throw 'what did we click on?';
            }

            tempAutoQuest = caap.newAutoQuest();
            tempAutoQuest['name'] = sps[0].innerHTML;
            tempAutoQuest['energy'] = sps[1].innerHTML.parseInt();
            //tempAutoQuest['general'] = general;
            //tempAutoQuest['expRatio'] = expRatio;

            caap.ManualAutoQuest(tempAutoQuest);
            $u.log(5, 'LabelListener', sps, state.getItem('AutoQuest'));
            if (caap.stats['level'] < 10 && caap.CheckForImage('quest_back_1.jpg')) {
                config.setItem('QuestArea', 'Quest');
                config.setItem('QuestSubArea', 'Land of Fire');
            } else {
                if (caap.CheckForImage('tab_quest_on.gif')) {
                    config.setItem('QuestArea', 'Quest');
                    caap.SelectDropOption('QuestArea', 'Quest');
                    caap.ChangeDropDownList('QuestSubArea', caap.landQuestList);
                } else if (caap.CheckForImage('demi_quest_on.gif')) {
                    config.setItem('QuestArea', 'Demi Quests');
                    caap.SelectDropOption('QuestArea', 'Demi Quests');
                    caap.ChangeDropDownList('QuestSubArea', caap.demiQuestList);
                } else if (caap.CheckForImage('tab_atlantis_on.gif')) {
                    config.setItem('QuestArea', 'Atlantis');
                    caap.SelectDropOption('QuestArea', 'Atlantis');
                    caap.ChangeDropDownList('QuestSubArea', caap.atlantisQuestList);
                }

                mainDiv = $j("#app46755028429_main_bn");
                if (mainDiv && mainDiv.length) {
                    className = mainDiv.attr("class");
                    if (className && caap.ClassToQuestArea[className]) {
                        config.setItem('QuestSubArea', caap.ClassToQuestArea[className]);
                    }
                }
            }

            $u.log(1, 'Setting QuestSubArea to', config.getItem('QuestSubArea', 'Land Of Fire'));
            caap.SelectDropOption('QuestSubArea', config.getItem('QuestSubArea', 'Land Of Fire'));
            caap.ShowAutoQuest();
            caap.CheckResults_quests();
            return true;
        } catch (err) {
            $u.error("ERROR in LabelListener: " + err);
            return false;
        }
    },

    LabelQuests: function (div, energy, reward, experience, click) {
        try {
            if (div.find("div[class='autoquest'").length) {
                return;
            }

            var newdiv = {};
            newdiv = document.createElement('div');
            newdiv.className = 'autoquest';
            newdiv.style.fontSize = '10px';
            newdiv.innerHTML = "$ per energy: " + (Math.floor(reward / energy * 10) / 10) +
                "<br />Exp per energy: " + (Math.floor(experience / energy * 100) / 100) + "<br />";

            if (state.getItem('AutoQuest', caap.newAutoQuest())['name'] === caap.questName) {
                var b = document.createElement('b');
                b.innerHTML = "Current auto quest";
                newdiv.appendChild(b);
            } else {
                var setAutoQuest = document.createElement('a');
                setAutoQuest.innerHTML = 'Auto run this quest.';
                setAutoQuest.quest_name = caap.questName;

                var quest_nameObj = document.createElement('span');
                quest_nameObj.innerHTML = caap.questName;
                quest_nameObj.style.display = 'none';
                setAutoQuest.appendChild(quest_nameObj);

                var quest_energyObj = document.createElement('span');
                quest_energyObj.innerHTML = energy;
                quest_energyObj.style.display = 'none';
                setAutoQuest.appendChild(quest_energyObj);
                setAutoQuest.addEventListener("click", caap.LabelListener, false);

                newdiv.appendChild(setAutoQuest);
            }

            newdiv.style.position = 'absolute';
            newdiv.style.background = '#B09060';
            newdiv.style.right = "144px";
            click.parent().before(newdiv);
        } catch (err) {
            $u.error("ERROR in LabelQuests: " + err);
        }
    },

    /////////////////////////////////////////////////////////////////////
    //                          AUTO BLESSING
    /////////////////////////////////////////////////////////////////////

    deityTable: {
        'energy'  : 1,
        'attack'  : 2,
        'defense' : 3,
        'health'  : 4,
        'stamina' : 5
    },
    /*jslint sub: false */

    BlessingResults: function (resultsText) {
        // Check time until next Oracle Blessing
        if (resultsText.match(/Please come back in: /)) {
            var hours   = 0,
                minutes = 0;

            hours = resultsText.regex(/(\d+) hour/);
            minutes = resultsText.regex(/(\d+) minute/);
            schedule.setItem('BlessingTimer', (hours * 60 + minutes) * 60, 300);
            $u.log(2, 'Recorded Blessing Time. Scheduling next click!');
        }

        // Recieved Demi Blessing.  Wait 24 hours to try again.
        if (resultsText.match(/You have paid tribute to/)) {
            schedule.setItem('BlessingTimer', 86400, 300);
            $u.log(2, 'Received blessing. Scheduling next click!');
        }
    },

    AutoBless: function () {
        var picSlice  = $j(),
            autoBless = '';

        autoBless = config.getItem('AutoBless', 'none').toLowerCase();
        if (autoBless === 'none') {
            return false;
        }

        if (!schedule.check('BlessingTimer')) {
            return false;
        }

        if (caap.NavigateTo('quests,demi_quest_off', 'demi_quest_bless')) {
            return true;
        }

        picSlice = $j("img[src*='deity_" + autoBless + "']");
        if (!picSlice || !picSlice.length) {
            $u.warn('No diety pics for deity', autoBless);
            return false;
        }

        if (picSlice.css('height') !== '160px') {
            return caap.NavigateTo('deity_' + autoBless);
        }

        picSlice = $j("form[id*='_symbols_form_" + caap.deityTable[autoBless] + "']");
        if (!picSlice || !picSlice.length) {
            $u.warn('No form for deity blessing.');
            return false;
        }

        picSlice = caap.CheckForImage('demi_quest_bless', picSlice);
        if (!picSlice) {
            $u.warn('No image for deity blessing.');
            return false;
        }

        $u.log(1, 'Click deity blessing for ', autoBless);
        schedule.setItem('BlessingTimer', 3600, 300);
        caap.Click(picSlice);
        return true;
    },

    /////////////////////////////////////////////////////////////////////
    //                          LAND
    // Displays return on lands and perfom auto purchasing
    /////////////////////////////////////////////////////////////////////

    /* This section is formatted to allow Advanced Optimisation by the Closure Compiler */
    /*jslint sub: true */
    landRecord: function () {
        this.data = {
            'row'         : $j(),
            'name'        : '',
            'income'      : 0,
            'cost'        : 0,
            'totalCost'   : 0,
            'owned'       : 0,
            'maxAllowed'  : 0,
            'buy'         : 0,
            'roi'         : 0,
            'set'         : 0
        };
    },
    /*jslint sub: false */

    bestLand: {},

    sellLand: {},

    /* This section is formatted to allow Advanced Optimisation by the Closure Compiler */
    /*jslint sub: true */
    CheckResults_land: function () {
        try {
            var bestLandCost = {},
                ss           = $j(),
                landByName   = {},
                landNames    = [],
                row          = $j(),
                name         = '',
                moneyss      = $j(),
                incomeEl     = $j(),
                income       = 0,
                nums         = [],
                tStr         = '',
                cost         = 0,
                land         = {},
                p            = 0,
                s            = 0,
                len          = 0,
                div          = $j(),
                infoDiv      = $j(),
                strongs      = $j(),
                maxAllowed   = 0,
                owned        = 0,
                roi          = 0,
                selection    = [1, 5, 10];

            function SelectLands(div, val, type) {
                try {
                    type = type ? type : 'Buy';
                    var selects = $j();
                    selects = div.find("select");
                    if (!selects || !selects.length) {
                        $u.warn(type + " select not found!");
                        return false;
                    }

                    if (type === "Buy") {
                        if (selects.length === 2) {
                            selects.eq(0).val(val);
                        }
                    } else {
                        selects.eq(0).val(val);
                    }

                    return true;
                } catch (err) {
                    $u.error("ERROR in SelectLands: " + err);
                    return false;
                }
            }

            caap.bestLand = state.setItem('BestLandCost', new caap.landRecord().data);
            caap.sellLand = {};
            ss = $j("#content tr[class*='land_buy_row']");
            if (!ss || !ss.length) {
                $u.warn("Can't find land_buy_row");
                return false;
            }

            ss.each(function () {
                row = $j(this);
                if (!row || !row.length) {
                    return true;
                }

                SelectLands(row, 10);
                infoDiv = row.find("div[class*='land_buy_info']");
                if (!infoDiv || !infoDiv.length) {
                    $u.warn("Can't find land_buy_info");
                    return true;
                }

                strongs = infoDiv.find("strong");
                if (strongs && strongs.length < 1) {
                    $u.warn("Can't find strong");
                    return true;
                }

                name = strongs.eq(0).text().trim();
                if (!name) {
                    $u.warn("Can't find land name");
                    return true;
                }

                moneyss = row.find("strong[class*='gold']");
                if (!moneyss || moneyss.length < 2) {
                    $u.warn("Can't find 2 gold instances");
                    return true;
                }

                nums = [];
                moneyss.each(function () {
                    incomeEl = $j(this);
                    if (incomeEl.attr("class").indexOf('label') >= 0) {
                        incomeEl = income.parent();
                        tStr = incomeEl.text();
                        tStr = tStr ? tStr.regex(/([\d,]+)/) : '';
                        if (!tStr) {
                            $u.warn('Cannot find income for ', name, tStr);
                            return true;
                        }
                    } else {
                        tStr = incomeEl.text();
                    }

                    income = tStr ? tStr.numberOnly() : 0;
                    nums.push(income);
                    return true;
                });

                income = nums[0] ? nums[0] : 0;
                cost = nums[1] ? nums[1] : 0;
                if (!income || !cost) {
                    $u.warn("Can't find income or cost for", name);
                    return true;
                }

                if (income > cost) {
                    // income is always less than the cost of land.
                    income = nums[1] ? nums[1] : 0;
                    cost = nums[0] ? nums[0] : 0;
                }

                // Lets get our max allowed from the land_buy_info div
                tStr = infoDiv.text();
                tStr = tStr ? tStr.match(/:\s+\d+/i).toString().trim().replace(/:\s+/, '') : '';
                maxAllowed = tStr ? tStr.parseInt() : 0;
                // Lets get our owned total from the land_buy_costs div
                div = row.find("div[class*='land_buy_costs']");
                tStr = div.text();
                tStr = tStr ? tStr.match(/:\s+\d+/i).toString().trim().replace(/:\s+/, '') : '';
                owned = tStr ? tStr.parseInt() : 0;
                land = new caap.landRecord();
                land.data['row'] = row;
                land.data['name'] = name;
                land.data['income'] = income;
                land.data['cost'] = cost;
                land.data['maxAllowed'] = maxAllowed;
                land.data['owned'] = owned;
                land.data['buy'] = (maxAllowed - owned) > 10 ? 10 : maxAllowed - owned;
                land.data['totalCost'] = land.data['buy'] * cost;
                roi = (((income / cost) * 240000) / 100).dp(2);
                if (!row.find("input[name='Buy']").length) {
                    roi = 0;
                    // If we own more than allowed we will set land and selection
                    for (s = 2; s >= 0; s -= 1) {
                        if (land.data['owned'] - land.data['maxAllowed'] >= selection[s]) {
                            caap.sellLand = land.data;
                            SelectLands(row, selection[s], 'Sell');
                            break;
                        }
                    }
                }

                land.data['roi'] = roi ? roi : 0;
                div = infoDiv.find("strong");
                tStr = div.eq(0).text();
                div.eq(0).text(tStr + " | " + land.data['roi'] + "% per day.");
                $u.log(3, "Land:", land.data['name']);
                if (land.data['roi'] > 0 && land.data['roi'] > caap.bestLand['roi']) {
                    $u.log(3, "Set Land:", land.data['name'], land.data);
                    caap.bestLand = $j.extend(true, {}, land.data);
                }

                return true;
            });

            $j.extend(true, bestLandCost, caap.bestLand);
            delete bestLandCost['row'];
            bestLandCost['set'] = true;
            state.setItem('BestLandCost', bestLandCost);
            $u.log(2, "Best Land Cost: ", bestLandCost['name'], bestLandCost['cost'], bestLandCost);
            return true;
        } catch (err) {
            $u.error("ERROR in CheckResults_land: " + err);
            return false;
        }
    },

    Lands: function () {
        try {
            if (!config.getItem('autoBuyLand', false)) {
                return false;
            }

            var bestLandCost = {},
                cashTotAvail = 0,
                cashNeed     = 0,
                theGeneral   = '';

            function BuySellLand(land, type) {
                try {
                    type = type ? type : 'Buy';
                    var button = $j();
                    button = land['row'].find("input[name='" + type + "']");
                    if (button && button.length) {
                        if (type === 'Buy') {
                            caap.bestLand = state.setItem('BestLandCost', new caap.landRecord().data);
                        } else {
                            caap.sellLand = {};
                        }

                        caap.Click(button.get(0), 15000);
                        return true;
                    } else {
                        $u.warn(type + " button not found!");
                        return false;
                    }
                } catch (err) {
                    $u.error("ERROR in BuySellLand: " + err);
                    return false;
                }
            }

            // Do we have lands above our max to sell?
            if (!$j.isEmptyObject(caap.sellLand) && config.getItem('SellLands', false)) {
                $u.log(2, "Selling land", caap.sellLand['name']);
                BuySellLand(caap.sellLand, 'Sell');
                return true;
            }

            bestLandCost = state.getItem('BestLandCost', new caap.landRecord().data);
            if (!bestLandCost['set']) {
                $u.log(2, "Going to land to get Best Land Cost");
                if (caap.NavigateTo('soldiers,land', caap.CheckForImage('tab_land_on.gif') ? '' : 'tab_land_on.gif')) {
                    return true;
                }
            }

            if (bestLandCost['cost'] === 0) {
                $u.log(2, "No lands to purchase");
                return false;
            }

            if (!caap.stats['gold']['bank'] && caap.stats['gold']['bank'] !== 0) {
                $u.log(2, "Going to keep to get Stored Value");
                if (caap.NavigateTo('keep')) {
                    return true;
                }
            }

            // Retrieving from Bank
            cashTotAvail = caap.stats['gold']['cash'] + (caap.stats['gold']['bank'] - config.getItem('minInStore', 0));
            cashNeed = bestLandCost['buy'] * bestLandCost['cost'];
            theGeneral = config.getItem('IdleGeneral', 'Use Current');
            if ((cashTotAvail >= cashNeed) && (caap.stats['gold']['cash'] < cashNeed)) {
                if (theGeneral !== 'Use Current') {
                    $u.log(2, "Changing to idle general");
                    if (general.Select('IdleGeneral')) {
                        return true;
                    }
                }

                $u.log(2, "Trying to retrieve", cashNeed - caap.stats['gold']['cash']);
                return caap.RetrieveFromBank(cashNeed - caap.stats['gold']['cash']);
            }

            // Need to check for enough moneys + do we have enough of the builton type that we already own.
            if (bestLandCost['cost'] && caap.stats['gold']['cash'] >= cashNeed) {
                if (theGeneral !== 'Use Current') {
                    $u.log(2, "Changing to idle general");
                    if (general.Select('IdleGeneral')) {
                        return true;
                    }
                }

                caap.NavigateTo('soldiers,land');
                if (caap.CheckForImage('tab_land_on.gif')) {
                    if (bestLandCost['buy']) {
                        $u.log(2, "Buying land", caap.bestLand['name']);
                        if (BuySellLand(caap.bestLand)) {
                            return true;
                        }
                    }
                } else {
                    return caap.NavigateTo('soldiers,land');
                }
            }

            return false;
        } catch (err) {
            $u.error("ERROR in Lands: " + err);
            return false;
        }
    },
    /*jslint sub: false */

    /////////////////////////////////////////////////////////////////////
    //                          CHECKS
    /////////////////////////////////////////////////////////////////////

    CheckKeep: function () {
        try {
            if (!schedule.check("keep")) {
                return false;
            }

            $u.log(2, 'Visiting keep to get stats');
            return caap.NavigateTo('keep', 'tab_stats_on.gif');
        } catch (err) {
            $u.error("ERROR in CheckKeep: " + err);
            return false;
        }
    },

    CheckOracle: function () {
        try {
            if (!schedule.check("oracle")) {
                return false;
            }

            $u.log(2, "Checking Oracle for Favor Points");
            return caap.NavigateTo('oracle', 'oracle_on.gif');
        } catch (err) {
            $u.error("ERROR in CheckOracle: " + err);
            return false;
        }
    },

    /* This section is formatted to allow Advanced Optimisation by the Closure Compiler */
    /*jslint sub: true */
    CheckBattleRank: function () {
        try {
            if (!schedule.check("battlerank") || caap.stats['level'] < 8) {
                return false;
            }

            $u.log(2, 'Visiting Battle Rank to get stats');
            return caap.NavigateTo('battle,battlerank', 'tab_battle_rank_on.gif');
        } catch (err) {
            $u.error("ERROR in CheckBattleRank: " + err);
            return false;
        }
    },

    CheckWarRank: function () {
        try {
            if (!schedule.check("warrank") || caap.stats['level'] < 100) {
                return false;
            }

            $u.log(2, 'Visiting War Rank to get stats');
            return caap.NavigateTo('battle,war_rank', 'tab_war_on.gif');
        } catch (err) {
            $u.error("ERROR in CheckWar: " + err);
            return false;
        }
    },
    /*jslint sub: false */

    CheckGenerals: function () {
        try {
            if (!schedule.check("generals")) {
                return false;
            }

            $u.log(2, "Visiting generals to get 'General' list");
            return caap.NavigateTo('mercenary,generals', 'tab_generals_on.gif');
        } catch (err) {
            $u.error("ERROR in CheckGenerals: " + err);
            return false;
        }
    },

    CheckSoldiers: function () {
        try {
            if (!schedule.check("soldiers")) {
                return false;
            }

            $u.log(2, "Checking Soldiers");
            return caap.NavigateTo('soldiers', 'tab_soldiers_on.gif');
        } catch (err) {
            $u.error("ERROR in CheckSoldiers: " + err);
            return false;
        }
    },


    CheckItem: function () {
        try {
            if (!schedule.check("item")) {
                return false;
            }

            $u.log(2, "Checking Item");
            return caap.NavigateTo('soldiers,item', 'tab_black_smith_on.gif');
        } catch (err) {
            $u.error("ERROR in CheckItem: " + err);
            return false;
        }
    },

    CheckMagic: function () {
        try {
            if (!schedule.check("magic")) {
                return false;
            }

            $u.log(2, "Checking Magic");
            return caap.NavigateTo('soldiers,magic', 'tab_magic_on.gif');
        } catch (err) {
            $u.error("ERROR in CheckMagic: " + err);
            return false;
        }
    },

    CheckAchievements: function () {
        try {
            if (!schedule.check("achievements")) {
                return false;
            }

            $u.log(2, 'Visiting achievements to get stats');
            return caap.NavigateTo('keep,achievements', 'tab_achievements_on.gif');
        } catch (err) {
            $u.error("ERROR in CheckAchievements: " + err);
            return false;
        }
    },

    /* This section is formatted to allow Advanced Optimisation by the Closure Compiler */
    /*jslint sub: true */
    CheckSymbolQuests: function () {
        try {
            if (!schedule.check("symbolquests") || caap.stats['level'] < 8) {
                return false;
            }

            $u.log(2, "Visiting symbolquests to get 'Demi-Power' points");
            return caap.NavigateTo('quests,symbolquests', 'demi_quest_on.gif');
        } catch (err) {
            $u.error("ERROR in CheckSymbolQuests: " + err);
            return false;
        }
    },

    CheckCharacterClasses: function () {
        try {
            if (!schedule.check("view_class_progress") || caap.stats['level'] < 100) {
                return false;
            }

            $u.log(2, "Checking Monster Class to get Character Class Stats");
            return caap.NavigateTo('battle_monster,view_class_progress', 'nm_class_whole_progress_bar.jpg');
        } catch (err) {
            $u.error("ERROR in CheckCharacterClasses: " + err);
            return false;
        }
    },
    /*jslint sub: false */

    CheckGift: function () {
        try {
            if (!schedule.check("gift")) {
                return false;
            }

            $u.log(2, "Checking Gift");
            return caap.NavigateTo('army,gift', 'tab_gifts_on.gif');
        } catch (err) {
            $u.error("ERROR in CheckGift: " + err);
            return false;
        }
    },

    /////////////////////////////////////////////////////////////////////
    //                          BATTLING PLAYERS
    /////////////////////////////////////////////////////////////////////

    /* This section is formatted to allow Advanced Optimisation by the Closure Compiler */
    /*jslint sub: true */
    BattleUserId: function (userid) {
        try {
            if (battle.hashCheck(userid)) {
                return true;
            }

            var battleButton = null,
                form         = $j(),
                inp          = $j();

            battleButton = caap.CheckForImage(battle.battles['Freshmeat'][config.getItem('BattleType', 'Invade')]);
            if (battleButton) {
                form = $j(battleButton).parent().parent();
                if (form && form.length) {
                    inp = form.find("input[name='target_id']");
                    if (inp && inp.length) {
                        inp.attr("value", userid);
                        state.setItem("lastBattleID", userid);
                        battle.click(battleButton);
                        state.setItem("notSafeCount", 0);
                        return true;
                    } else {
                        $u.warn("target_id not found in battleForm");
                    }
                } else {
                    $u.warn("form not found in battleButton");
                }
            } else {
                $u.warn("battleButton not found");
            }

            return false;
        } catch (err) {
            $u.error("ERROR in BattleUserId: " + err);
            return false;
        }
    },

    battleWarnLevel: true,

    Battle: function (mode) {
        try {
            var whenBattle    = '',
                target        = '',
                battletype    = '',
                useGeneral    = '',
                staminaReq    = 0,
                chainImg      = '',
                button        = null,
                raidName      = '',
                battleChainId = 0,
                targetMonster = '',
                whenMonster   = '',
                targetType    = '',
                rejoinSecs    = '',
                battleRecord  = {},
                tempTime      = new Date(2009, 0, 1).getTime();

            if (caap.stats['level'] < 8) {
                if (caap.battleWarnLevel) {
                    $u.log(1, "Battle: Unlock at level 8");
                    caap.battleWarnLevel = false;
                }

                return false;
            }

            whenBattle = config.getItem('WhenBattle', 'Never');
            whenMonster = config.getItem('WhenMonster', 'Never');
            targetMonster = state.getItem('targetFrombattle_monster', '');
            switch (whenBattle) {
            case 'Never' :
                caap.SetDivContent('battle_mess', 'Battle off');
                return false;
            case 'Stay Hidden' :
                if (!caap.NeedToHide()) {
                    caap.SetDivContent('battle_mess', 'We Dont Need To Hide Yet');
                    $u.log(1, 'We Dont Need To Hide Yet');
                    return false;
                }

                break;
            case 'No Monster' :
                if (mode !== 'DemiPoints') {
                    if (whenMonster !== 'Never' && targetMonster && !targetMonster.match(/the deathrune siege/i)) {
                        return false;
                    }
                }

                break;
            case 'Demi Points Only' :
                if (mode === 'DemiPoints' && whenMonster === 'Never') {
                    return false;
                }

                if (mode !== 'DemiPoints' && whenMonster !== 'Never' && targetMonster && !targetMonster.match(/the deathrune siege/i)) {
                    return false;
                }

                if (battle.selectedDemisDone(true) || (config.getItem("DemiPointsFirst", false) && whenMonster !== 'Never' && config.getItem("observeDemiFirst", false) && state.getItem('DemiPointsDone', false))) {
                    return false;
                }

                break;
            default :
            }

            if (caap.CheckKeep()) {
                return true;
            }

            if (caap.stats['health']['num'] < 10) {
                $u.log(5, 'Health is less than 10: ', caap.stats['health']['num']);
                return false;
            }

            if (config.getItem("waitSafeHealth", false) && caap.stats['health']['num'] < 13) {
                $u.log(5, 'Unsafe. Health is less than 13: ', caap.stats['health']['num']);
                return false;
            }

            target = battle.getTarget(mode);
            $u.log(5, 'Mode/Target', mode, target);
            if (!target) {
                $u.log(1, 'No valid battle target');
                return false;
            } else if (!$u.isNum(target)) {
                target = target.toLowerCase();
            }

            if (target === 'noraid') {
                $u.log(5, 'No Raid To Attack');
                return false;
            }

            battletype = config.getItem('BattleType', 'Invade');
            switch (battletype) {
            case 'Invade' :
                useGeneral = 'InvadeGeneral';
                staminaReq = 1;
                chainImg = 'battle_invade_again.gif';
                if (general.LevelUpCheck(useGeneral)) {
                    useGeneral = 'LevelUpGeneral';
                    $u.log(2, 'Using level up general');
                }

                break;
            case 'Duel' :
                useGeneral = 'DuelGeneral';
                staminaReq = 1;
                chainImg = 'battle_duel_again.gif';
                if (general.LevelUpCheck(useGeneral)) {
                    useGeneral = 'LevelUpGeneral';
                    $u.log(2, 'Using level up general');
                }

                break;
            case 'War' :
                useGeneral = 'WarGeneral';
                staminaReq = 10;
                chainImg = 'battle_duel_again.gif';
                if (general.LevelUpCheck(useGeneral)) {
                    useGeneral = 'LevelUpGeneral';
                    $u.log(2, 'Using level up general');
                }

                break;
            default :
                $u.warn('Unknown battle type ', battletype);
                return false;
            }

            if (!caap.CheckStamina('Battle', staminaReq)) {
                $u.log(9, 'Not enough stamina for ', battletype);
                return false;
            } else if (general.Select(useGeneral)) {
                return true;
            }

            // Check if we should chain attack
            if ($j("#app46755028429_results_main_wrapper img[src*='battle_victory.gif']").length) {
                button = caap.CheckForImage(chainImg);
                battleChainId = state.getItem("BattleChainId", 0);
                if (button && battleChainId) {
                    caap.SetDivContent('battle_mess', 'Chain Attack In Progress');
                    $u.log(2, 'Chaining Target', battleChainId);
                    battle.click(button);
                    state.setItem("BattleChainId", 0);
                    return true;
                }
            }

            if (!state.getItem("notSafeCount", 0)) {
                state.setItem("notSafeCount", 0);
            }

            $u.log(2, 'Battle Target', target);
            targetType = config.getItem('TargetType', 'Invade');
            switch (target) {
            case 'raid' :
                if (!schedule.check("RaidNoTargetDelay")) {
                    rejoinSecs = ((schedule.getItem("RaidNoTargetDelay").next - new Date().getTime()) / 1000).dp() + ' secs';
                    $u.log(2, 'Rejoining the raid in', rejoinSecs);
                    caap.SetDivContent('battle_mess', 'Joining the Raid in ' + rejoinSecs);
                    return true;
                }

                caap.SetDivContent('battle_mess', 'Joining the Raid');
                if (caap.NavigateTo(caap.battlePage + ',raid', 'tab_raid_on.gif')) {
                    return true;
                }

                if (config.getItem('clearCompleteRaids', false) && monster.completeButton['raid']['button'] && monster.completeButton['raid']['name']) {
                    caap.Click(monster.completeButton['raid']['button']);
                    monster.deleteItem(monster.completeButton['raid']['name']);
                    monster.completeButton['raid'] = {'name': undefined, 'button': undefined};
                    caap.UpdateDashboard(true);
                    $u.log(1, 'Cleared a completed raid');
                    return true;
                }

                raidName = state.getItem('targetFromraid', '');
                if (!$j("div[style*='dragon_title_owner']").length) {
                    button = monster.engageButtons[raidName];
                    if (button) {
                        caap.Click(button);
                        return true;
                    }

                    $u.warn('Unable to engage raid', raidName);
                    return false;
                }

                if (monster.ConfirmRightPage(raidName)) {
                    return true;
                }

                // The user can specify 'raid' in their Userid List to get us here. In that case we need to adjust NextBattleTarget when we are done
                if (targetType === "Userid List") {
                    if (battle.freshmeat('Raid')) {
                        if ($j("span[class*='result_body']").length) {
                            battle.nextTarget();
                        }

                        if (state.getItem("notSafeCount", 0) > 10) {
                            state.setItem("notSafeCount", 0);
                            battle.nextTarget();
                        }

                        return true;
                    }

                    $u.warn('Doing Raid UserID list, but no target');
                    return false;
                }

                return battle.freshmeat('Raid');
            case 'freshmeat' :
                if (caap.NavigateTo(caap.battlePage, 'battle_on.gif')) {
                    return true;
                }

                caap.SetDivContent('battle_mess', 'Battling ' + target);
                // The user can specify 'freshmeat' in their Userid List to get us here. In that case we need to adjust NextBattleTarget when we are done
                if (targetType === "Userid List") {
                    if (battle.freshmeat('Freshmeat')) {
                        if ($j("span[class*='result_body']").length) {
                            battle.nextTarget();
                        }

                        if (state.getItem("notSafeCount", 0) > 10) {
                            state.setItem("notSafeCount", 0);
                            battle.nextTarget();
                        }

                        return true;
                    }

                    $u.warn('Doing Freshmeat UserID list, but no target');
                    return false;
                }

                return battle.freshmeat('Freshmeat');
            default:
                if (!config.getItem("IgnoreBattleLoss", false)) {
                    battleRecord = battle.getItem(target);
                    switch (config.getItem("BattleType", 'Invade')) {
                    case 'Invade' :
                        tempTime = battleRecord.invadeLostTime ? battleRecord.invadeLostTime : tempTime;
                        break;
                    case 'Duel' :
                        tempTime = battleRecord.duelLostTime ? battleRecord.duelLostTime : tempTime;
                        break;
                    case 'War' :
                        tempTime = battleRecord.warlostTime ? battleRecord.warlostTime : tempTime;
                        break;
                    default :
                        $u.warn("Battle type unknown!", config.getItem("BattleType", 'Invade'));
                    }

                    if (battleRecord && battleRecord.nameStr !== '' && !schedule.since(tempTime, 604800)) {
                        $u.log(1, 'Avoiding Losing Target', target);
                        battle.nextTarget();
                        return true;
                    }
                }

                if (caap.NavigateTo(caap.battlePage, 'battle_on.gif')) {
                    return true;
                }

                state.setItem('BattleChainId', 0);
                if (caap.BattleUserId(target)) {
                    battle.nextTarget();
                    return true;
                }

                $u.warn('Doing default UserID list, but no target');
                return false;
            }
        } catch (err) {
            $u.error("ERROR in Battle: " + err);
            return false;
        }
    },

    /////////////////////////////////////////////////////////////////////
    //                          GUILD
    /////////////////////////////////////////////////////////////////////

    /* This section is formatted to allow Advanced Optimisation by the Closure Compiler */
    /*jslint sub: true */
    CheckResults_guild: function () {
        try {
            // Guild
            var guildIdDiv  = $j(),
                guildMemDiv = $j(),
                guildTxt    = '',
                save        = false;

            guildIdDiv = $j("#app46755028429_guild_blast input[name='guild_id']");
            if (guildIdDiv && guildIdDiv.length) {
                caap.stats['guild']['id'] = guildIdDiv.attr("value");
                save = true;
            } else {
                $u.warn('Using stored guild_id.');
            }

            guildTxt = $j("#app46755028429_guild_banner_section").text();
            if (guildTxt) {
                caap.stats['guild']['name'] = guildTxt.trim();
                save = true;
            } else {
                $u.warn('Using stored guild name.');
            }

            guildMemDiv = $j("#app46755028429_cta_log div[style='padding-bottom: 5px;']");
            if (guildMemDiv && guildMemDiv.length) {
                caap.stats['guild']['members'] = guildMemDiv.length;
                save = true;
            } else {
                $u.warn('Using stored guild member count.');
            }

            $u.log(3, "CheckResults_guild", caap.stats['guild']);
            if (save) {
                caap.SaveStats();
            }
            return true;
        } catch (err) {
            $u.error("ERROR in CheckResults_guild: " + err);
            return false;
        }
    },
    /*jslint sub: false */

    /////////////////////////////////////////////////////////////////////
    //                          GUILD BATTLES
    /////////////////////////////////////////////////////////////////////

    CheckResults_guild_current_battles: function () {
        try {
            var tempDiv = $j();
            tempDiv = $j("img[src*='guild_symbol']");
            if (tempDiv && tempDiv.length) {
                tempDiv.each(function () {
                    $u.log(5, "name", $j(this).parent().parent().next().text().trim());
                    $u.log(5, "button", $j(this).parent().parent().parent().next().find("input[src*='dragon_list_btn_']"));
                });
            } else {
                return false;
            }

            return true;
        } catch (err) {
            $u.error("ERROR in CheckResults_guild_current_battles: " + err);
            return false;
        }
    },

    /////////////////////////////////////////////////////////////////////
    //                          GUILD MONSTERS
    /////////////////////////////////////////////////////////////////////

    /* This section is formatted to allow Advanced Optimisation by the Closure Compiler */
    /*jslint sub: true */
    /*-------------------------------------------------------------------------------------\
    GuildMonsterReview is a primary action subroutine to mange the guild monster on the dashboard
    \-------------------------------------------------------------------------------------*/
    GuildMonsterReview: function () {
        try {
            /*-------------------------------------------------------------------------------------\
            We do guild monster review once an hour.  Some routines may reset this timer to drive
            GuildMonsterReview immediately.
            \-------------------------------------------------------------------------------------*/
            if (!schedule.check("guildMonsterReview") || config.getItem('WhenGuildMonster', 'Never') === 'Never') {
                return false;
            }

            if (!caap.stats['guild']['id']) {
                $u.log(2, "Going to guild to get Guild Id");
                if (caap.NavigateTo('guild')) {
                    return true;
                }
            }

            var record = {},
                url    = '',
                objective = '';

            if (state.getItem('guildMonsterBattlesRefresh', true)) {
                if (guild_monster.navigate_to_battles_refresh()) {
                    return true;
                }
            }

            if (!state.getItem('guildMonsterBattlesReview', false)) {
                if (guild_monster.navigate_to_battles()) {
                    return true;
                }

                state.setItem('guildMonsterBattlesReview', true);
            }

            record = guild_monster.getReview();
            if (record && $j.isPlainObject(record) && !$j.isEmptyObject(record)) {
                $u.log(1, "Reviewing Slot (" + record['slot'] + ") Name: " + record['name']);
                if (caap.stats['staminaT']['num'] > 0 && config.getItem("doGuildMonsterSiege", true)) {
                    objective = "&action=doObjective";
                }

                url = "guild_battle_monster.php?twt2=" + guild_monster.info[record['name']].twt2 + "&guild_id=" + record['guildId'] + objective + "&slot=" + record['slot'] + "&ref=nf";
                state.setItem('guildMonsterReviewSlot', record['slot']);
                caap.ClickAjaxLinkSend(url);
                return true;
            }

            schedule.setItem("guildMonsterReview", gm.getItem('guildMonsterReviewMins', 60, hiddenVar) * 60, 300);
            state.setItem('guildMonsterBattlesRefresh', true);
            state.setItem('guildMonsterBattlesReview', false);
            state.setItem('guildMonsterReviewSlot', 0);
            guild_monster.select(true);
            $u.log(1, 'Done with guild monster review.');
            return false;
        } catch (err) {
            $u.error("ERROR in GuildMonsterReview: " + err);
            return false;
        }
    },
    /*jslint sub: false */

    CheckResults_guild_current_monster_battles: function () {
        try {
            guild_monster.populate();

            return true;
        } catch (err) {
            $u.error("ERROR in CheckResults_guild_current_monster_battles: " + err);
            return false;
        }
    },

    CheckResults_guild_battle_monster: function () {
        try {
            guild_monster.onMonster();
            if (config.getItem("enableTitles", true)) {
                spreadsheet.doTitles();
            }

            return true;
        } catch (err) {
            $u.error("ERROR in CheckResults_guild_battle_monster: " + err);
            return false;
        }
    },

    /* This section is formatted to allow Advanced Optimisation by the Closure Compiler */
    /*jslint sub: true */
    GuildMonster: function () {
        try {
            var when    = '',
                record  = {},
                minion  = {},
                form    = $j(),
                key     = $j(),
                url     = '',
                attack  = 0,
                stamina = 0;

            when = config.getItem("WhenGuildMonster", 'Never');
            if (when === 'Never') {
                return false;
            }

            if (!caap.stats['guild']['id']) {
                $u.log(2, "Going to guild to get Guild Id");
                if (caap.NavigateTo('guild')) {
                    return true;
                }
            }

            /*
            if (!caap.stats['guild']['id']) {
                $u.log(2, "Going to keep to get Guild Id");
                if (caap.NavigateTo('keep')) {
                    return true;
                }
            }
            */

            if (config.getItem('doClassicMonstersFirst', false) && config.getItem("WhenMonster", 'Never') !== 'Never') {
                if (config.getItem("DemiPointsFirst", false) && !battle.selectedDemisDone()) {
                    return false;
                }

                if ((state.getItem('targetFrombattle_monster', '') || state.getItem('targetFromraid', ''))) {
                    return false;
                }
            }

            if (caap.InLevelUpMode()) {
                if (caap.stats['staminaT']['num'] < 5) {
                    caap.SetDivContent('guild_monster_mess', 'Guild Monster stamina ' + caap.stats['staminaT']['num'] + '/' + 5);
                    return false;
                }
            } else if (when === 'Stamina Available') {
                stamina = state.getItem('staminaGuildMonster', 0);
                if (caap.stats['staminaT']['num'] < stamina) {
                    caap.SetDivContent('guild_monster_mess', 'Guild Monster stamina ' + caap.stats['staminaT']['num'] + '/' + stamina);
                    return false;
                }

                state.setItem('staminaGuildMonster', 0);
                record = state.getItem('targetGuildMonster', {});
                if (record && $j.isPlainObject(record) && !$j.isEmptyObject(record)) {
                    minion = guild_monster.getTargetMinion(record);
                    if (minion && $j.isPlainObject(minion) && !$j.isEmptyObject(minion)) {
                        stamina = guild_monster.getStaminaValue(record, minion);
                        state.setItem('staminaGuildMonster', stamina);
                        if (caap.stats['staminaT']['num'] < stamina) {
                            caap.SetDivContent('guild_monster_mess', 'Guild Monster stamina ' + caap.stats['staminaT']['num'] + '/' + stamina);
                            return false;
                        }
                    } else {
                        return false;
                    }
                } else {
                    return false;
                }
            } else if (when === 'At X Stamina') {
                if (caap.stats['staminaT']['num'] >= config.getItem("MaxStaminaToGMonster", 20)) {
                    state.setItem('guildMonsterBattlesBurn', true);
                }

                if (caap.stats['staminaT']['num'] <= config.getItem("MinStaminaToGMonster", 0) || caap.stats['staminaT']['num'] < 1) {
                    state.setItem('guildMonsterBattlesBurn', false);
                }

                if (!state.getItem('guildMonsterBattlesBurn', false)) {
                    caap.SetDivContent('guild_monster_mess', 'Guild Monster stamina ' + caap.stats['staminaT']['num'] + '/' + config.getItem("MaxStaminaToGMonster", 20));
                    return false;
                }
            } else if (when === 'At Max Stamina') {
                if (caap.stats['staminaT']['num'] < caap.stats['stamina']['max'] || caap.stats['staminaT']['num'] < 1) {
                    caap.SetDivContent('guild_monster_mess', 'Guild Monster stamina ' + caap.stats['staminaT']['num'] + '/' + caap.stats['stamina']['max']);
                    return false;
                }
            }

            caap.SetDivContent('guild_monster_mess', '');
            record = guild_monster.select(true);
            if (record && $j.isPlainObject(record) && !$j.isEmptyObject(record)) {
                if (general.Select('GuildMonsterGeneral')) {
                    return true;
                }

                if (!guild_monster.checkPage(record)) {
                    $u.log(2, "Fighting Slot (" + record['slot'] + ") Name: " + record['name']);
                    caap.SetDivContent('guild_monster_mess', "Fighting ("  + record['slot'] + ") " + record['name']);
                    url = "guild_battle_monster.php?twt2=" + guild_monster.info[record['name']].twt2 + "&guild_id=" + record['guildId'] + "&slot=" + record['slot'];
                    caap.ClickAjaxLinkSend(url);
                    return true;
                }

                minion = guild_monster.getTargetMinion(record);
                if (minion && $j.isPlainObject(minion) && !$j.isEmptyObject(minion)) {
                    $u.log(2, "Fighting target_id (" + minion['target_id'] + ") Name: " + minion['name']);
                    caap.SetDivContent('guild_monster_mess', "Fighting (" + minion['target_id'] + ") " + minion['name']);
                    key = $j("#app46755028429_attack_key_" + minion['target_id']);
                    if (key && key.length) {
                        attack = guild_monster.getAttackValue(record, minion);
                        if (!attack) {
                            return false;
                        }

                        key.attr("value", attack);
                        form = key.parents("form").eq(0);
                        if (form && form.length) {
                            caap.Click(form.find("input[src*='guild_duel_button2.gif'],input[src*='monster_duel_button.gif']").get(0));
                            return true;
                        }
                    }
                }
            }

            return false;
        } catch (err) {
            $u.error("ERROR in GuildMonster: " + err);
            return false;
        }
    },
    /*jslint sub: false */

    /////////////////////////////////////////////////////////////////////
    //                          ARENA
    /////////////////////////////////////////////////////////////////////

    /*-------------------------------------------------------------------------------------\
    ArenaReview is a primary action subroutine to mange the Arena on the dashboard
    \-------------------------------------------------------------------------------------*/
    ArenaReview: function () {
        try {
            /*-------------------------------------------------------------------------------------\
            We do Arena review once an hour.  Some routines may reset this timer to drive
            ArenaReview immediately.
            \-------------------------------------------------------------------------------------*/
            if (!schedule.check("ArenaReview") || config.getItem('WhenArena', 'Never') === 'Never') {
                return false;
            }

            if (state.getItem('ArenaRefresh', true)) {
                if (arena.navigate_to_main_refresh()) {
                    return true;
                }
            }

            if (!state.getItem('ArenaReview', false)) {
                if (arena.navigate_to_main()) {
                    return true;
                }

                state.setItem('ArenaReview', true);
            }

            state.setItem('ArenaRefresh', true);
            state.setItem('ArenaReview', false);
            $u.log(1, 'Done with Arena review.');
            return false;
        } catch (err) {
            $u.error("ERROR in ArenaReview: " + err);
            return false;
        }
    },

    /* This section is formatted to allow Advanced Optimisation by the Closure Compiler */
    /*jslint sub: true */
    CheckResults_arena: function () {
        try {
            arena.checkInfo();
            return true;
        } catch (err) {
            $u.error("ERROR in CheckResults_arena: " + err);
            return false;
        }
    },

    CheckResults_arena_battle: function () {
        try {
            arena.onBattle();
            return true;
        } catch (err) {
            $u.error("ERROR in CheckResults_arena_battle: " + err);
            return false;
        }
    },

    /* This section is formatted to allow Advanced Optimisation by the Closure Compiler */
    /*jslint sub: true */
    Arena: function () {
        try {
            var when    = '',
                record  = {},
                minion  = {},
                form    = $j(),
                key     = $j(),
                url     = '',
                attack  = 0,
                stamina = 0,
                enterButton = $j(),
                nextTime = '',
                tokenTimer = 0;

            when = config.getItem("WhenArena", 'Never');
            if (when === 'Never') {
                return false;
            }

            record = arena.getItem();
            nextTime = (record['reviewed'] && record['nextTime']) ? "Next Arena: " + schedule.FormatTime(new Date((record['reviewed'] + (record['nextTime'].parseTimer() * 1000)))) : '';
            nextTime = record['startTime'] ? "Next Arena: " + record['startTime'] + " seconds" : nextTime;
            tokenTimer = (record['reviewed'] && record['tokenTime'] && record['state'] === 'Alive') ? ((record['reviewed'] + (record['tokenTime'].parseTimer() * 1000)) - new Date().getTime()) / 1000 : -1;
            tokenTimer = tokenTimer >= 0 ? tokenTimer.dp() : 0;
            nextTime = (tokenTimer >= 0 && record['state'] === 'Alive') ? "Next Token in: " + tokenTimer + ' seconds': nextTime;
            caap.SetDivContent('arena_mess', nextTime);
            if (!record || !$j.isPlainObject(record) || $j.isEmptyObject(record) || state.getItem('ArenaJoined', false)) {
                if (state.getItem('ArenaRefresh', true)) {
                    if (arena.navigate_to_main_refresh()) {
                        return true;
                    }
                }

                if (!state.getItem('ArenaReview', false)) {
                    if (arena.navigate_to_main()) {
                        return true;
                    }

                    state.setItem('ArenaReview', true);
                }

                state.setItem('ArenaRefresh', true);
                state.setItem('ArenaReview', false);
                state.setItem('ArenaJoined', false);
                return false;
            }

            if (/*!record['days'] || */record['tokens'] <= 0 || (record['ticker'].parseTimer() <= 0 && record['state'] === "Ready") || (caap.stats['stamina']['num'] < 20 && record['state'] === "Ready")) {
                return false;
            }

            caap.SetDivContent('arena_mess', "Entering Arena");
            if (general.Select('ArenaGeneral')) {
                return true;
            }

            if (!$j("#app46755028429_arena_battle_banner_section").length) {
                if (state.getItem('ArenaRefresh', true)) {
                    if (arena.navigate_to_main_refresh()) {
                        return true;
                    }
                }

                if (!state.getItem('ArenaReview', false)) {
                    if (arena.navigate_to_main()) {
                        return true;
                    }

                    state.setItem('ArenaReview', true);
                }

                state.setItem('ArenaRefresh', true);
                state.setItem('ArenaReview', false);
                enterButton = $j("input[src*='battle_enter_battle.gif']");
                $u.log(1, "Enter battle", record, enterButton);
                if (record['tokens'] > 0 && enterButton && enterButton.length) {
                    arena.clearMinions();
                    caap.Click(enterButton.get(0));
                    return true;
                }
            }

            enterButton = $j("input[src*='guild_enter_battle_button.gif']");
            if (enterButton && enterButton.length) {
                $u.log(1, "Joining battle", caap.stats['stamina']['num'], record, enterButton);
                if (caap.stats['stamina']['num'] >= 20 && record['tokens'] > 0) {
                    state.setItem('ArenaJoined', true);
                    caap.Click(enterButton.get(0));
                    return true;
                }

                return false;
            }

            if (record['state'] !== "Alive") {
                return false;
            }

            minion = arena.getTargetMinion(record);
            if (minion && $j.isPlainObject(minion) && !$j.isEmptyObject(minion)) {
                $u.log(2, "Fighting target_id (" + minion['target_id'] + ") Name: " + minion['name']);
                caap.SetDivContent('arena_mess', "Fighting (" + minion['target_id'] + ") " + minion['name']);
                key = $j("#app46755028429_attack_key_" + minion['target_id']);
                if (key && key.length) {
                    form = key.parents("form").eq(0);
                    if (form && form.length) {
                        state.setItem('ArenaMinionAttacked', minion);
                        caap.Click(form.find("input[src*='guild_duel_button2.gif'],input[src*='monster_duel_button.gif']").get(0));
                        return true;
                    }
                }
            }

            return false;
        } catch (err) {
            $u.error("ERROR in Arena: " + err);
            return false;
        }
    },

    /////////////////////////////////////////////////////////////////////
    //                          MONSTERS AND BATTLES
    /////////////////////////////////////////////////////////////////////

    CheckResults_fightList: function () {
        try {
            var buttonsDiv            = $j(),
                page                  = '',
                monsterReviewed       = {},
                it                    = 0,
                len                   = 0,
                url                   = '',
                delList               = [],
                siege                 = '',
                engageButtonName      = '',
                monsterName           = '',
                monsterRow            = $j(),
                monsterFull           = '',
                summonDiv             = $j(),
                tempText              = '',
                tStr                  = '';

            // get all buttons to check monsterObjectList
            summonDiv = $j("img[src*='mp_button_summon_']");
            buttonsDiv = $j("img[src*='dragon_list_btn_']");
            if ((!summonDiv || !summonDiv.length) && (!buttonsDiv || !buttonsDiv.length)) {
                $u.log(2, "No buttons found");
                return false;
            }

            page = state.getItem('page', 'battle_monster');
            if (page === 'battle_monster' && (!buttonsDiv || !buttonsDiv.length)) {
                $u.log(2, "No monsters to review");
                state.setItem('reviewDone', true);
                return true;
            }

            tempText = buttonsDiv.eq(0).parent().attr("href");
            if (state.getItem('pageUserCheck', '') && tempText && !(tempText.match('user=' + caap.stats['FBID']) || tempText.match(/alchemy\.php/))) {
                $u.log(2, "On another player's keep.", state.getItem('pageUserCheck', ''));
                return false;
            }

            // Review monsters and find attack and fortify button
            for (it = 0, len = buttonsDiv.length; it < len; it += 1) {
                // Make links for easy clickin'
                url = buttonsDiv.eq(it).parent().attr("href");
                if (!(url && url.match(/user=/) && (url.match(/mpool=/) || url.match(/raid\.php/)))) {
                    continue;
                }

                monsterRow = buttonsDiv.eq(it).parents().eq(3);
                tStr = monsterRow.text();
                monsterFull = tStr ? tStr.trim() : '';
                monsterName = monsterFull ? monsterFull.replace(/Completed!/i, '').replace(/Fled!/i, '').trim() : '';
                monsterReviewed = monster.getItem(monsterName);
                if (monsterReviewed['type'] === '') {
                    monsterReviewed['type'] = monster.type(monsterName);
                }

                monsterReviewed['page'] = page;
                engageButtonName = buttonsDiv.eq(it).attr("src").match(/dragon_list_btn_\d/i)[0];
                switch (engageButtonName) {
                case 'dragon_list_btn_2' :
                    monsterReviewed['status'] = 'Collect Reward';
                    monsterReviewed['color'] = 'grey';
                    break;
                case 'dragon_list_btn_3' :
                    monster.engageButtons[monsterName] = buttonsDiv.eq(it).get(0);
                    break;
                case 'dragon_list_btn_4' :
                    if (page === 'raid' && !(/!/.test(monsterFull))) {
                        monster.engageButtons[monsterName] = buttonsDiv.eq(it).get(0);
                        break;
                    }

                    if (!monster.completeButton[page]['button'] && !monster.completeButton[page]['name']) {
                        monster.completeButton[page]['name'] = monsterName;
                        monster.completeButton[page]['button'] = caap.CheckForImage('cancelButton.gif', monsterRow);
                    }

                    monsterReviewed['status'] = 'Complete';
                    monsterReviewed['color'] = 'grey';
                    break;
                default :
                }

                monsterReviewed['userId'] = url.match(/user=\d+/i)[0].split('=')[1].parseInt();
                monsterReviewed['mpool'] = ((url.match(/mpool=\d+/i)) ? '&mpool=' + url.match(/mpool=\d+/i)[0].split('=')[1] : '');
                if (monster.info[monsterReviewed['type']] && monster.info[monsterReviewed['type']].siege) {
                    siege = "&action=doObjective";
                }

                monsterReviewed['link'] = "<a href='http://apps.facebook.com/castle_age/" + page + ".php?casuser=" + monsterReviewed['userId'] + monsterReviewed['mpool'] + siege + "'>Link</a>";
                monster.setItem(monsterReviewed);
            }

            for (it = 0; it < monster.records.length; it += 1) {
                if (monster.records[it]['page'] === '') {
                    delList.push(monster.records[it]['name']);
                }
            }

            for (it = 0; it < delList.length; it += 1) {
                monster.deleteItem(delList[it]);
            }

            state.setItem('reviewDone', true);
            caap.UpdateDashboard(true);
            return true;
        } catch (err) {
            $u.error("ERROR in CheckResults_fightList: " + err);
            return false;
        }
    },

    CheckResults_viewFight: function () {
        try {
            var currentMonster    = {},
                time              = [],
                tempDiv           = $j(),
                tempText          = '',
                tempArr           = [],
                counter           = 0,
                monstHealthImg    = '',
                totalCount        = 0,
                ind               = 0,
                len               = 0,
                searchStr         = '',
                searchRes         = $j(),
                achLevel          = 0,
                maxDamage         = 0,
                maxToFortify      = 0,
                isTarget          = false,
                KOBenable         = false,
                KOBbiasHours      = 0,
                KOBach            = false,
                KOBmax            = false,
                KOBminFort        = false,
                KOBtmp            = 0,
                KOBtimeLeft       = 0,
                KOBbiasedTF       = 0,
                KOBPercentTimeRemaining = 0,
                KOBtotalMonsterTime = 0,
                monsterDiv        = $j(),
                actionDiv         = $j(),
                damageDiv         = $j(),
                monsterInfo       = {},
                targetFromfortify = {},
                tStr              = '';

            battle.checkResults();
            if (config.getItem("enableTitles", true)) {
                spreadsheet.doTitles();
            }

            caap.chatLink(caap.appBodyDiv, "#app46755028429_chat_log div[style*='hidden'] div[style*='320px']");
            monsterDiv = caap.appBodyDiv.find("div[style*='dragon_title_owner']");
            if (monsterDiv && monsterDiv.length) {
                tStr = monsterDiv.children(":eq(2)").text();
                tempText = tStr ? tStr.trim() : '';
            } else {
                monsterDiv = caap.appBodyDiv.find("div[style*='nm_top']");
                if (monsterDiv && monsterDiv.length) {
                    tStr = monsterDiv.children(":eq(0)").children(":eq(0)").text();
                    tempText = tStr ? tStr.trim() : '';
                    tempDiv = caap.appBodyDiv.find("div[style*='nm_bars']");
                    if (tempDiv && tempDiv.length) {
                        tStr = tempDiv.children(":eq(0)").children(":eq(0)").children(":eq(0)").siblings(":last").children(":eq(0)").text();
                        tempText += tStr ? (' ' + tStr.trim().replace("'s Life", "")) : '';
                    } else {
                        $u.warn("Problem finding nm_bars");
                        return;
                    }
                } else {
                    $u.warn("Problem finding dragon_title_owner and nm_top");
                    return;
                }
            }

            if (monsterDiv && monsterDiv.length && monsterDiv.find("img[uid='" + caap.stats['FBID'] + "']").length) {
                $u.log(2, "Your monster found", tempText);
                tempText = tempText.replace(new RegExp(".+?'s "), 'Your ');
            }

            $u.log(2, "Monster name", tempText);
            currentMonster = monster.getItem(tempText);
            if (currentMonster['type'] === '') {
                currentMonster['type'] = monster.type(currentMonster['name']);
            }

            if (currentMonster['type'] === 'Siege' || currentMonster['type'].indexOf('Raid') >= 0) {
                tempDiv = caap.appBodyDiv.find("div[style*='raid_back']");
                if (tempDiv && tempDiv.length) {
                    if (tempDiv.find("img[src*='raid_1_large.jpg']").length) {
                        currentMonster['type'] = 'Raid I';
                    } else if (tempDiv.find("img[src*='raid_b1_large.jpg']").length) {
                        currentMonster['type'] = 'Raid II';
                    } else if (tempDiv.find("img[src*='raid_1_large_victory.jpg']").length) {
                        $u.log(2, "Siege Victory!");
                    } else {
                        $u.log(2, "Problem finding raid image! Probably finished.");
                    }
                } else {
                    $u.warn("Problem finding raid_back");
                    return;
                }
            }

            monsterInfo = monster.info[currentMonster['type']];
            currentMonster['review'] = new Date().getTime();
            state.setItem('monsterRepeatCount', 0);
            // Extract info
            tempDiv = caap.appBodyDiv.find("#app46755028429_monsterTicker");
            if (tempDiv && tempDiv.length) {
                $u.log(4, "Monster ticker found");
                time = tempDiv.text().split(":");
            } else {
                if (!caap.CheckForImage("dead.jpg")) {
                    $u.warn("Could not locate Monster ticker.");
                }
            }

            if (time && time.length === 3 && monsterInfo && monsterInfo.fort) {
                if (currentMonster['type'] === "Deathrune" || currentMonster['type'] === 'Ice Elemental') {
                    currentMonster['fortify'] = 100;
                } else {
                    currentMonster['fortify'] = 0;
                }

                switch (monsterInfo.defense_img) {
                case 'bar_dispel.gif' :
                    tempDiv = caap.appBodyDiv.find("img[src*='" + monsterInfo.defense_img + "']");
                    if (tempDiv && tempDiv.length) {
                        currentMonster['fortify'] = (100 - tempDiv.parent().getPercent('width')).dp(2);
                    } else {
                        $u.warn("Unable to find defense bar", monsterInfo.defense_img);
                    }

                    break;
                case 'seamonster_ship_health.jpg' :
                    tempDiv = caap.appBodyDiv.find("img[src*='" + monsterInfo.defense_img + "']");
                    if (tempDiv && tempDiv.length) {
                        currentMonster['fortify'] = tempDiv.parent().getPercent('width').dp(2);
                        if (monsterInfo.repair_img) {
                            tempDiv = caap.appBodyDiv.find("img[src*='" + monsterInfo.repair_img + "']");
                            if (tempDiv && tempDiv.length) {
                                currentMonster['fortify'] = (currentMonster['fortify'] * (100 / (100 - tempDiv.parent().getPercent('width')))).dp(2);
                            } else {
                                $u.warn("Unable to find repair bar", monsterInfo.repair_img);
                            }
                        }
                    } else {
                        $u.warn("Unable to find defense bar", monsterInfo.defense_img);
                    }

                    break;
                case 'nm_green.jpg' :
                    tempDiv = caap.appBodyDiv.find("img[src*='" + monsterInfo.defense_img + "']");
                    if (tempDiv && tempDiv.length) {
                        currentMonster['fortify'] = tempDiv.parent().getPercent('width').dp(2);
                        currentMonster['strength'] = tempDiv.parent().parent().getPercent('width').dp(2);
                    } else {
                        $u.warn("Unable to find defense bar", monsterInfo.defense_img);
                    }

                    break;
                default:
                    $u.warn("No match for defense_img", monsterInfo.defense_img);
                }
            }

            // Get damage done to monster
            actionDiv = caap.appBodyDiv.find("#app46755028429_action_logs");
            damageDiv = actionDiv.find("td[class='dragonContainer']:first td[valign='top']:first a[href*='user=" + caap.stats['FBID'] + "']:first");
            if (damageDiv && damageDiv.length) {
                if (monsterInfo && monsterInfo.defense) {
                    tStr = damageDiv.parent().parent().siblings(":last").text();
                    tempArr = tStr ? tStr.match(new RegExp("([0-9,]+) dmg / ([0-9,]+) def")) : [];
                    if (tempArr && tempArr.length === 3) {
                        currentMonster['attacked'] = tempArr[1] ? tempArr[1].numberOnly() : 0;
                        currentMonster['defended'] = tempArr[2] ? tempArr[2].numberOnly() : 0;
                        currentMonster['damage'] = currentMonster['attacked'] + currentMonster['defended'];
                    } else {
                        $u.warn("Unable to get attacked and defended damage");
                    }
                } else if (currentMonster['type'] === 'Siege' || (monsterInfo && monsterInfo.raid)) {
                    tStr = damageDiv.parent().siblings(":last").text();
                    currentMonster['attacked'] = tStr ? tStr.numberOnly() : 0;
                    currentMonster['damage'] = currentMonster['attacked'];
                } else {
                    tStr = damageDiv.parent().parent().siblings(":last").text();
                    currentMonster['attacked'] = tStr ? tStr.trim().numberOnly() : 0;
                    currentMonster['damage'] = currentMonster['attacked'];
                }

                damageDiv.parents("tr").eq(0).css('background-color', gm.getItem("HighlightColor", '#C6A56F', hiddenVar));
            } else {
                $u.log(2, "Player hasn't done damage yet");
            }

            if (/:ac\b/.test(currentMonster['conditions']) ||
                    (currentMonster['type'].match(/Raid/) && config.getItem('raidCollectReward', false)) ||
                    (!currentMonster['type'].match(/Raid/) && config.getItem('monsterCollectReward', false))) {

                counter = state.getItem('monsterReviewCounter', -3);
                if (counter >= 0 && monster.records[counter] && monster.records[counter]['name'] === currentMonster['name'] && ($j("a[href*='&action=collectReward']").length || $j("input[alt*='Collect Reward']").length)) {
                    $u.log(2, 'Collecting Reward');
                    currentMonster['review'] = -1;
                    state.setItem('monsterReviewCounter', counter -= 1);
                    currentMonster['status'] = 'Collect Reward';
                    if (currentMonster['name'].indexOf('Siege') >= 0) {
                        if ($j("a[href*='&rix=1']").length) {
                            currentMonster['rix'] = 1;
                        } else {
                            currentMonster['rix'] = 2;
                        }
                    }
                }
            }

            if (monsterInfo && monsterInfo.alpha) {
                monstHealthImg = 'nm_red.jpg';
            } else {
                monstHealthImg = 'monster_health_background.jpg';
            }

            monsterDiv = caap.appBodyDiv.find("img[src*='" + monstHealthImg + "']");
            if (time && time.length === 3 && monsterDiv && monsterDiv.length) {
                currentMonster['time'] = time;
                if (monsterDiv && monsterDiv.length) {
                    $u.log(4, "Found monster health div");
                    currentMonster['life'] = monsterDiv.parent().getPercent('width').dp(2);
                } else {
                    $u.warn("Could not find monster health div.");
                }

                if (currentMonster['life']) {
                    if (!monsterInfo) {
                        monster.setItem(currentMonster);
                        $u.warn('Unknown monster');
                        return;
                    }
                }

                if (damageDiv && damageDiv.length && monsterInfo && monsterInfo.alpha) {
                    // Character type stuff
                    monsterDiv = caap.appBodyDiv.find("div[style*='nm_bottom']");
                    if (monsterDiv && monsterDiv.length) {
                        tStr = monsterDiv.children().eq(0).children().text();
                        tempText = tStr ? tStr.trim().innerTrim() : '';
                        if (tempText) {
                            $u.log(4, "Character class text", tempText);
                            tempArr = tempText.match(/Class: (\w+) /);
                            if (tempArr && tempArr.length === 2) {
                                currentMonster['charClass'] = tempArr[1];
                                $u.log(3, "character", currentMonster['charClass']);
                            } else {
                                $u.warn("Can't get character", tempArr);
                            }

                            tempArr = tempText.match(/Tip: ([\w ]+) Status/);
                            if (tempArr && tempArr.length === 2) {
                                currentMonster['tip'] = tempArr[1];
                                $u.log(3, "tip", currentMonster['tip']);
                            } else {
                                $u.warn("Can't get tip", tempArr);
                            }

                            tempArr = tempText.match(/Status Time Remaining: (\d+):(\d+):(\d+)\s*/);
                            if (tempArr && tempArr.length === 4) {
                                currentMonster['stunTime'] = new Date().getTime() + (tempArr[1] * 60 * 60 * 1000) + (tempArr[2] * 60 * 1000) + (tempArr[3] * 1000);
                                $u.log(3, "statusTime", currentMonster['stunTime']);
                            } else {
                                $u.warn("Can't get statusTime", tempArr);
                            }

                            tempDiv = monsterDiv.find("img[src*='nm_stun_bar']");
                            if (tempDiv && tempDiv.length) {
                                tempText = tempDiv.getPercent('width').dp(2);
                                $u.log(4, "Stun bar percent text", tempText);
                                if (tempText >= 0) {
                                    currentMonster['stun'] = tempText;
                                    $u.log(3, "stun", currentMonster['stun']);
                                } else {
                                    $u.warn("Can't get stun bar width");
                                }
                            } else {
                                tempArr = currentMonster['tip'].split(" ");
                                if (tempArr && tempArr.length) {
                                    tempText = tempArr[tempArr.length - 1].toLowerCase();
                                    tempArr = ["strengthen", "heal"];
                                    if (tempText && tempArr.indexOf(tempText) >= 0) {
                                        if (tempText === tempArr[0]) {
                                            currentMonster['stun'] = currentMonster['strength'];
                                        } else if (tempText === tempArr[1]) {
                                            currentMonster['stun'] = currentMonster['health'];
                                        } else {
                                            $u.warn("Expected strengthen or heal to match!", tempText);
                                        }
                                    } else {
                                        $u.warn("Expected strengthen or heal from tip!", tempText);
                                    }
                                } else {
                                    $u.warn("Can't get stun bar and unexpected tip!", currentMonster['tip']);
                                }
                            }

                            if (currentMonster['charClass'] && currentMonster['tip'] && currentMonster['stun'] !== -1) {
                                currentMonster['stunDo'] = new RegExp(currentMonster['charClass']).test(currentMonster['tip']) && currentMonster['stun'] < 100;
                                currentMonster['stunType'] = '';
                                if (currentMonster['stunDo']) {
                                    $u.log(2, "Do character specific attack", currentMonster['stunDo']);
                                    tempArr = currentMonster['tip'].split(" ");
                                    if (tempArr && tempArr.length) {
                                        tempText = tempArr[tempArr.length - 1].toLowerCase();
                                        tempArr = ["strengthen", "cripple", "heal", "deflection"];
                                        if (tempText && tempArr.indexOf(tempText) >= 0) {
                                            currentMonster['stunType'] = tempText.replace("ion", '');
                                            $u.log(2, "Character specific attack type", currentMonster['stunType']);
                                        } else {
                                            $u.warn("Type does match list!", tempText);
                                        }
                                    } else {
                                        $u.warn("Unable to get type from tip!", currentMonster);
                                    }
                                } else {
                                    $u.log(2, "Tip does not match class or stun maxed", currentMonster);
                                }
                            } else {
                                $u.warn("Missing 'class', 'tip' or 'stun'", currentMonster);
                            }
                        } else {
                            $u.warn("Missing tempText");
                        }
                    } else {
                        $u.warn("Missing nm_bottom");
                    }
                }

                if (monsterInfo) {
                    if (monsterInfo.siege) {
                        tStr = $j("div[style*='monster_layout'],div[style*='nm_bottom'],div[style*='raid_back']").text();
                        currentMonster['miss'] = tStr ? tStr.trim().innerTrim().replace(new RegExp(".*Need (\\d+) more.*", "gi"), "$1").parseInt() : 0;
                        if (isNaN(currentMonster['miss'])) {
                            currentMonster['miss'] = 0;
                        }

                        for (ind = 0, len = monsterInfo.siege_img.length; ind < len; ind += 1) {
                            searchStr += "img[src*='" + monsterInfo.siege_img[ind] + "']";
                            if (ind < len - 1) {
                                searchStr += ",";
                            }
                        }

                        searchRes = caap.appBodyDiv.find(searchStr);
                        if (searchRes && searchRes.length) {
                            if (currentMonster['type'].indexOf('Raid') >= 0) {
                                totalCount = searchRes.attr("src").filepart().replace(new RegExp(".*(\\d+).*", "gi"), "$1").parseInt();
                            } else {
                                totalCount = searchRes.size() + 1;
                            }
                        }

                        currentMonster['phase'] = Math.min(totalCount, monsterInfo.siege);
                        if (isNaN(currentMonster['phase']) || currentMonster['phase'] < 1) {
                            currentMonster['phase'] = 1;
                        }
                    }

                    currentMonster['t2k'] = monster.t2kCalc(currentMonster);
                }
            } else {
                $u.log(2, 'Monster is dead or fled');
                currentMonster['color'] = 'grey';
                if (currentMonster['status'] !== 'Complete' && currentMonster['status'] !== 'Collect Reward') {
                    currentMonster['status'] = "Dead or Fled";
                }

                state.setItem('resetselectMonster', true);
                monster.setItem(currentMonster);
                return;
            }

            if (damageDiv && damageDiv.length) {
                achLevel = monster.parseCondition('ach', currentMonster['conditions']);
                if (monsterInfo && achLevel === false) {
                    achLevel = monsterInfo.ach;
                }

                maxDamage = monster.parseCondition('max', currentMonster['conditions']);
                maxToFortify = (monster.parseCondition('f%', currentMonster['conditions']) !== false) ? monster.parseCondition('f%', currentMonster['conditions']) : config.getItem('MaxToFortify', 0);
                targetFromfortify = state.getItem('targetFromfortify', new monster.energyTarget().data);
                if (currentMonster['name'] === targetFromfortify['name']) {
                    if (targetFromfortify['type'] === 'Fortify' && currentMonster['fortify'] > maxToFortify) {
                        state.setItem('resetselectMonster', true);
                    }

                    if (targetFromfortify['type'] === 'Strengthen' && currentMonster['strength'] >= 100) {
                        state.setItem('resetselectMonster', true);
                    }

                    if (targetFromfortify['type'] === 'Stun' && !currentMonster['stunDo']) {
                        state.setItem('resetselectMonster', true);
                    }
                }

                // Start of Keep On Budget (KOB) code Part 1 -- required variables
                $u.log(2, 'Start of Keep On Budget (KOB) Code');

                //default is disabled for everything
                KOBenable = false;

                //default is zero bias hours for everything
                KOBbiasHours = 0;

                //KOB needs to follow achievment mode for this monster so that KOB can be skipped.
                KOBach = false;

                //KOB needs to follow max mode for this monster so that KOB can be skipped.
                KOBmax = false;

                //KOB needs to follow minimum fortification state for this monster so that KOB can be skipped.
                KOBminFort = false;

                //create a temp variable so we don't need to call parseCondition more than once for each if statement
                KOBtmp = monster.parseCondition('kob', currentMonster['conditions']);
                if (isNaN(KOBtmp)) {
                    $u.log(2, 'KOB NaN branch');
                    KOBenable = true;
                    KOBbiasHours = 0;
                } else if (!KOBtmp) {
                    $u.log(2, 'KOB false branch');
                    KOBenable = false;
                    KOBbiasHours = 0;
                } else {
                    $u.log(2, 'KOB passed value branch');
                    KOBenable = true;
                    KOBbiasHours = KOBtmp;
                }

                //test if user wants kob active globally
                if (!KOBenable && gm.getItem('KOBAllMonters', false, hiddenVar)) {
                    KOBenable = true;
                }

                //disable kob if in level up mode or if we are within 5 stamina of max potential stamina
                if (caap.InLevelUpMode() || caap.stats['stamina']['num'] >= caap.stats['stamina']['max'] - 5) {
                    KOBenable = false;
                }

                if (KOBenable) {
                    $u.log(2, 'Level Up Mode: ', caap.InLevelUpMode());
                    $u.log(2, 'Stamina Avail: ', caap.stats['stamina']['num']);
                    $u.log(2, 'Stamina Max: ', caap.stats['stamina']['max']);

                    //log results of previous two tests
                    $u.log(2, 'KOBenable: ', KOBenable);
                    $u.log(2, 'KOB Bias Hours: ', KOBbiasHours);
                }

                //Total Time alotted for monster
                KOBtotalMonsterTime = monsterInfo.duration;
                if (KOBenable) {
                    $u.log(2, 'Total Time for Monster: ', KOBtotalMonsterTime);

                    //Total Damage remaining
                    $u.log(2, 'HP left: ', currentMonster['life']);
                }

                //Time Left Remaining
                KOBtimeLeft = time[0].parseInt() + (time[1].parseInt() * 0.0166);
                if (KOBenable) {
                    $u.log(2, 'TimeLeft: ', KOBtimeLeft);
                }

                //calculate the bias offset for time remaining
                KOBbiasedTF = KOBtimeLeft - KOBbiasHours;

                //for 7 day monsters we want kob to not permit attacks (beyond achievement level) for the first 24 to 48 hours
                // -- i.e. reach achievement and then wait for more players and siege assist clicks to catch up
                if (KOBtotalMonsterTime >= 168) {
                    KOBtotalMonsterTime = KOBtotalMonsterTime - gm.getItem('KOBDelayStart', 48, hiddenVar);
                }

                //Percentage of time remaining for the currently selected monster
                KOBPercentTimeRemaining = Math.round(KOBbiasedTF / KOBtotalMonsterTime * 1000) / 10;
                if (KOBenable) {
                    $u.log(2, 'Percent Time Remaining: ', KOBPercentTimeRemaining);
                }

                // End of Keep On Budget (KOB) code Part 1 -- required variables

                isTarget = (currentMonster['name'] === state.getItem('targetFromraid', '') ||
                            currentMonster['name'] === state.getItem('targetFrombattle_monster', '') ||
                            currentMonster['name'] === targetFromfortify['name']);

                if (maxDamage && currentMonster['damage'] >= maxDamage) {
                    currentMonster['color'] = 'red';
                    currentMonster['over'] = 'max';
                    //used with KOB code
                    KOBmax = true;
                    //used with kob debugging
                    if (KOBenable) {
                        $u.log(2, 'KOB - max activated');
                    }

                    if (isTarget) {
                        state.setItem('resetselectMonster', true);
                    }
                } else if (currentMonster['fortify'] !== -1 && currentMonster['fortify'] < config.getItem('MinFortToAttack', 1)) {
                    currentMonster['color'] = 'purple';
                    //used with KOB code
                    KOBminFort = true;
                    //used with kob debugging
                    if (KOBenable) {
                        $u.log(2, 'KOB - MinFort activated');
                    }

                    if (isTarget) {
                        state.setItem('resetselectMonster', true);
                    }
                } else if (currentMonster['damage'] >= achLevel && (config.getItem('AchievementMode', false) || monster.parseCondition('ach', currentMonster['conditions']))) {
                    currentMonster['color'] = 'darkorange';
                    currentMonster['over'] = 'ach';
                    //used with KOB code
                    KOBach = true;
                    //used with kob debugging
                    if (KOBenable) {
                        $u.log(2, 'KOB - achievement reached');
                    }

                    if (isTarget && currentMonster['damage'] < achLevel) {
                        state.setItem('resetselectMonster', true);
                    }
                }

                //Start of KOB code Part 2 begins here
                if (KOBenable && !KOBmax && !KOBminFort && KOBach && currentMonster['life'] < KOBPercentTimeRemaining) {
                    //kob color
                    currentMonster['color'] = 'magenta';
                    // this line is required or we attack anyway.
                    currentMonster['over'] = 'max';
                    //used with kob debugging
                    if (KOBenable) {
                        $u.log(2, 'KOB - budget reached');
                    }

                    if (isTarget) {
                        state.setItem('resetselectMonster', true);
                        $u.log(1, 'This monster no longer a target due to kob');
                    }
                } else {
                    if (!KOBmax && !KOBminFort && !KOBach) {
                        //the way that the if statements got stacked, if it wasn't kob it was painted black anyway
                        //had to jump out the black paint if max, ach or fort needed to paint the entry.
                        currentMonster['color'] = 'black';
                    }
                }
                //End of KOB code Part 2 stops here.
            } else {
                currentMonster['color'] = 'black';
            }

            monster.setItem(currentMonster);
            caap.UpdateDashboard(true);
            if (schedule.check('battleTimer')) {
                window.setTimeout(function () {
                    caap.SetDivContent('monster_mess', '');
                }, 2000);
            }
        } catch (err) {
            $u.error("ERROR in CheckResults_viewFight: " + err);
        }
    },

    /*-------------------------------------------------------------------------------------\
    MonsterReview is a primary action subroutine to mange the monster and raid list
    on the dashboard
    \-------------------------------------------------------------------------------------*/
    MonsterReview: function () {
        try {
            /*-------------------------------------------------------------------------------------\
            We do monster review once an hour.  Some routines may reset this timer to drive
            MonsterReview immediately.
            \-------------------------------------------------------------------------------------*/
            if (!schedule.check("monsterReview") || (config.getItem('WhenMonster', 'Never') === 'Never' && config.getItem('WhenBattle', 'Never') === 'Never')) {
                return false;
            }

            /*-------------------------------------------------------------------------------------\
            We get the monsterReviewCounter.  This will be set to -3 if we are supposed to refresh
            the monsterOl completely. Otherwise it will be our index into how far we are into
            reviewing monsterOl.
            \-------------------------------------------------------------------------------------*/
            var counter  = state.getItem('monsterReviewCounter', -3),
                link     = '',
                tempTime = 0,
                isSiege  = false;

            if (counter === -3) {
                state.setItem('monsterReviewCounter', counter += 1);
                return true;
            }

            if (counter === -2) {
                if (caap.stats['level'] > 6) {
                    if (caap.NavigateTo('keep,battle_monster', 'tab_monster_list_on.gif')) {
                        state.setItem('reviewDone', false);
                        return true;
                    }
                } else {
                    $u.log(1, "Monsters: Unlock at level 7");
                    state.setItem('reviewDone', true);
                }

                if (state.getItem('reviewDone', true)) {
                    state.setItem('monsterReviewCounter', counter += 1);
                } else {
                    return true;
                }
            }

            if (counter === -1) {
                if (caap.stats['level'] > 7) {
                    if (caap.NavigateTo(caap.battlePage + ',raid', 'tab_raid_on.gif')) {
                        state.setItem('reviewDone', false);
                        return true;
                    }
                } else {
                    $u.log(1, "Raids: Unlock at level 8");
                    state.setItem('reviewDone', true);
                }

                if (state.getItem('reviewDone', true)) {
                    state.setItem('monsterReviewCounter', counter += 1);
                } else {
                    return true;
                }
            }

            if (monster.records && monster.records.length === 0) {
                return false;
            }

            /*-------------------------------------------------------------------------------------\
            Now we step through the monsterOl objects. We set monsterReviewCounter to the next
            index for the next reiteration since we will be doing a click and return in here.
            \-------------------------------------------------------------------------------------*/
            while (counter < monster.records.length) {
                if (!monster.records[counter]) {
                    state.setItem('monsterReviewCounter', counter += 1);
                    continue;
                }
                /*-------------------------------------------------------------------------------------\
                If we looked at this monster more recently than an hour ago, skip it
                \-------------------------------------------------------------------------------------*/
                if (monster.records[counter]['color'] === 'grey' && monster.records[counter]['life'] !== -1) {
                    monster.records[counter]['life'] = -1;
                    monster.records[counter]['fortify'] = -1;
                    monster.records[counter]['strength'] = -1;
                    monster.records[counter]['time'] = [];
                    monster.records[counter]['t2k'] = -1;
                    monster.records[counter]['phase'] = '';
                    monster.save();
                }

                tempTime = monster.records[counter]['review'] ? monster.records[counter]['review'] : -1;
                $u.log(3, "Review", monster.records[counter], !schedule.since(tempTime, gm.getItem("MonsterLastReviewed", 15, hiddenVar) * 60));
                if (monster.records[counter]['status'] === 'Complete' || !schedule.since(tempTime, gm.getItem("MonsterLastReviewed", 15, hiddenVar) * 60) || state.getItem('monsterRepeatCount', 0) > 2) {
                    state.setItem('monsterReviewCounter', counter += 1);
                    state.setItem('monsterRepeatCount', 0);
                    continue;
                }
                /*-------------------------------------------------------------------------------------\
                We get our monster link
                \-------------------------------------------------------------------------------------*/
                caap.SetDivContent('monster_mess', 'Reviewing/sieging ' + (counter + 1) + '/' + monster.records.length + ' ' + monster.records[counter]['name']);
                link = monster.records[counter]['link'];
                /*-------------------------------------------------------------------------------------\
                If the link is good then we get the url and any conditions for monster
                \-------------------------------------------------------------------------------------*/
                if (/href/.test(link)) {
                    link = link.split("'")[1];
                    /*-------------------------------------------------------------------------------------\
                    If the autocollect token was specified then we set the link to do auto collect. If
                    the conditions indicate we should not do sieges then we fix the link.
                    \-------------------------------------------------------------------------------------*/
                    isSiege = monster.records[counter]['type'].match(/Raid/) || monster.records[counter]['type'] === 'Siege';
                    $u.log(3, "monster.records[counter]", monster.records[counter]);
                    if (((monster.records[counter]['conditions'] && /:ac\b/.test(monster.records[counter]['conditions'])) ||
                            (isSiege && config.getItem('raidCollectReward', false)) ||
                            (!isSiege && config.getItem('monsterCollectReward', false))) && monster.records[counter]['status'] === 'Collect Reward') {

                        if (general.Select('CollectGeneral')) {
                            return true;
                        }

                        link += '&action=collectReward';
                        if (monster.records[counter]['name'].indexOf('Siege') >= 0) {
                            if (monster.records[counter]['rix'] !== -1)  {
                                link += '&rix=' + monster.records[counter]['rix'];
                            } else {
                                link += '&rix=2';
                            }
                        }

                        link = link.replace('&action=doObjective', '');
                        state.setItem('CollectedRewards', true);
                    } else if ((monster.records[counter]['conditions'] && monster.records[counter]['conditions'].match(':!s')) ||
                               (!config.getItem('raidDoSiege', true) && isSiege) ||
                               (!config.getItem('monsterDoSiege', true) && !isSiege && monster.info[monster.records[counter]['type']].siege) ||
                               caap.stats['stamina']['num'] === 0) {
                        $u.log(2, "Do not siege");
                        link = link.replace('&action=doObjective', '');
                    }
                    /*-------------------------------------------------------------------------------------\
                    Now we use ajaxSendLink to display the monsters page.
                    \-------------------------------------------------------------------------------------*/
                    $u.log(1, 'Reviewing ' + (counter + 1) + '/' + monster.records.length + ' ' + monster.records[counter]['name']);
                    state.setItem('ReleaseControl', true);
                    link = link.replace('http://apps.facebook.com/castle_age/', '').replace('?', '?twt2&');
                    $u.log(5, "Link", link);
                    caap.ClickAjaxLinkSend(link);
                    state.setItem('monsterRepeatCount', state.getItem('monsterRepeatCount', 0) + 1);
                    state.setItem('resetselectMonster', true);
                    return true;
                }
            }
            /*-------------------------------------------------------------------------------------\
            All done.  Set timer and tell monster.select and dashboard they need to do thier thing.
            We set the monsterReviewCounter to do a full refresh next time through.
            \-------------------------------------------------------------------------------------*/
            schedule.setItem("monsterReview", gm.getItem('monsterReviewMins', 60, hiddenVar) * 60, 300);
            state.setItem('resetselectMonster', true);
            state.setItem('monsterReviewCounter', -3);
            $u.log(1, 'Done with monster/raid review.');
            caap.SetDivContent('monster_mess', '');
            caap.UpdateDashboard(true);
            if (state.getItem('CollectedRewards', false)) {
                state.setItem('CollectedRewards', false);
                monster.flagReview();
            }

            return true;
        } catch (err) {
            $u.error("ERROR in MonsterReview: " + err);
            return false;
        }
    },

    Monsters: function () {
        try {
            if (config.getItem('WhenMonster', 'Never') === 'Never') {
                caap.SetDivContent('monster_mess', 'Monster off');
                return false;
            }

            ///////////////// Reivew/Siege all monsters/raids \\\\\\\\\\\\\\\\\\\\\\

            if (config.getItem('WhenMonster', 'Never') === 'Stay Hidden' && caap.NeedToHide() && caap.CheckStamina('Monster', 1)) {
                $u.log(1, "Stay Hidden Mode: We're not safe. Go battle.");
                caap.SetDivContent('monster_mess', 'Not Safe For Monster. Battle!');
                return false;
            }

            if (!schedule.check('NotargetFrombattle_monster')) {
                return false;
            }

            ///////////////// Individual Monster Page \\\\\\\\\\\\\\\\\\\\\\

            // Establish a delay timer when we are 1 stamina below attack level.
            // Timer includes 5 min for stamina tick plus user defined random interval
            if (!caap.InLevelUpMode() && caap.stats['stamina']['num'] === (state.getItem('MonsterStaminaReq', 1) - 1) && schedule.check('battleTimer') && config.getItem('seedTime', 0) > 0) {
                schedule.setItem('battleTimer', 300, config.getItem('seedTime', 0));
                caap.SetDivContent('monster_mess', 'Monster Delay Until ' + schedule.display('battleTimer'));
                return false;
            }

            if (!schedule.check('battleTimer')) {
                if (caap.stats['stamina']['num'] < general.GetStaminaMax(config.getItem('IdleGeneral', 'Use Current'))) {
                    caap.SetDivContent('monster_mess', 'Monster Delay Until ' + schedule.display('battleTimer'));
                    return false;
                }
            }

            var fightMode        = '',
                monsterName      = state.getItem('targetFromfortify', new monster.energyTarget().data)['name'],
                monstType        = monster.type(monsterName),
                nodeNum          = 0,
                energyRequire    = 10,
                currentMonster   = monster.getItem(monsterName),
                imageTest        = '',
                attackButton     = null,
                singleButtonList = [],
                buttonList       = [],
                tacticsValue     = 0,
                useTactics       = false,
                attackMess       = '',
                it               = 0,
                len              = 0,
                buttonHref       = '';

            if (monstType) {
                if (!caap.InLevelUpMode() && config.getItem('PowerFortifyMax', false) && monster.info[monstType].staLvl) {
                    for (nodeNum = monster.info[monstType].staLvl.length - 1; nodeNum >= 0; nodeNum -= 1) {
                        if (caap.stats['stamina']['max'] >= monster.info[monstType].staLvl[nodeNum]) {
                            break;
                        }
                    }
                }

                if (nodeNum >= 0 && nodeNum !== null && nodeNum !== undefined && config.getItem('PowerAttackMax', false) && monster.info[monstType].nrgMax) {
                    energyRequire = monster.info[monstType].nrgMax[nodeNum];
                }
            }

            $u.log(3, "Energy Required/Node", energyRequire, nodeNum);
            switch (config.getItem('FortifyGeneral', 'Use Current')) {
            case 'Orc King':
                energyRequire = energyRequire * (general.GetLevel('Orc King') + 1);
                $u.log(2, 'Monsters Fortify:Orc King', energyRequire);
                break;
            case 'Barbarus':
                energyRequire = energyRequire * (general.GetLevel('Barbarus') === 4 ? 3 : 2);
                $u.log(2, 'Monsters Fortify:Barbarus', energyRequire);
                break;
            default:
            }

            // Check to see if we should fortify or attack monster
            if (monsterName && caap.CheckEnergy(energyRequire, gm.getItem('WhenFortify', 'Energy Available', hiddenVar), 'fortify_mess')) {
                fightMode = 'Fortify';
            } else {
                monsterName = state.getItem('targetFrombattle_monster', '');
                monstType = monster.type(monsterName);
                currentMonster = monster.getItem(monsterName);
                if (monsterName && caap.CheckStamina('Monster', state.getItem('MonsterStaminaReq', 1)) && currentMonster['page'] === 'battle_monster') {
                    fightMode = 'Monster';
                } else {
                    schedule.setItem('NotargetFrombattle_monster', 60);
                    return false;
                }
            }

            // Set right general
            if (general.Select(fightMode + 'General')) {
                return true;
            }

            // Check if on engage monster page
            imageTest = 'dragon_title_owner';
            if (monstType && monster.info[monstType].alpha) {
                imageTest = 'nm_top';
            }

            if ($j("div[style*='" + imageTest + "']").length) {
                if (monster.ConfirmRightPage(monsterName)) {
                    return true;
                }

                singleButtonList = [
                    'button_nm_p_attack.gif',
                    'attack_monster_button.jpg',
                    'event_attack1.gif',
                    'seamonster_attack.gif',
                    'event_attack2.gif',
                    'attack_monster_button2.jpg'
                ];

                // Find the attack or fortify button
                if (fightMode === 'Fortify') {
                    buttonList = [
                        'seamonster_fortify.gif',
                        'button_dispel.gif',
                        'attack_monster_button3.jpg'
                    ];

                    if (currentMonster && currentMonster['stunDo'] && currentMonster['stunType'] !== '') {
                        buttonList.unshift("button_nm_s_" + currentMonster['stunType']);
                    } else {
                        buttonList.unshift("button_nm_s_");
                    }

                    $u.log(3, "monster/button list", currentMonster, buttonList);
                } else if (state.getItem('MonsterStaminaReq', 1) === 1) {
                    // not power attack only normal attacks
                    buttonList = singleButtonList;
                } else {
                    if (currentMonster['conditions'] && currentMonster['conditions'].match(/:tac/i) && caap.stats['level'] >= 50) {
                        useTactics = true;
                        tacticsValue = monster.parseCondition("tac%", currentMonster['conditions']);
                    } else if (config.getItem('UseTactics', false) && caap.stats['level'] >= 50) {
                        useTactics = true;
                        tacticsValue = config.getItem('TacticsThreshold', false);
                    }

                    if (tacticsValue !== false && currentMonster['fortify'] && currentMonster['fortify'] < tacticsValue) {
                        $u.log(2, "Party health is below threshold value", currentMonster['fortify'], tacticsValue);
                        useTactics = false;
                    }

                    if (useTactics && caap.CheckForImage('nm_button_tactics.gif')) {
                        $u.log(2, "Attacking monster using tactics buttons");
                        buttonList = ['nm_button_tactics.gif'].concat(singleButtonList);
                    } else {
                        $u.log(2, "Attacking monster using regular buttons");
                        useTactics = false;
                        // power attack or if not seamonster power attack or if not regular attack -
                        // need case for seamonster regular attack?
                        buttonList = [
                            'button_nm_p_power',
                            'button_nm_p_',
                            'power_button_',
                            'attack_monster_button2.jpg',
                            'event_attack2.gif',
                            'seamonster_power.gif',
                            'event_attack1.gif',
                            'attack_monster_button.jpg'
                        ].concat(singleButtonList);
                    }
                }

                nodeNum = 0;
                if (!caap.InLevelUpMode()) {
                    if (((fightMode === 'Fortify' && config.getItem('PowerFortifyMax', false)) || (fightMode !== 'Fortify' && config.getItem('PowerAttack', false) && config.getItem('PowerAttackMax', false))) && monster.info[monstType].staLvl) {
                        for (nodeNum = monster.info[monstType].staLvl.length - 1; nodeNum >= 0; nodeNum -= 1) {
                            if (caap.stats['stamina']['max'] >= monster.info[monstType].staLvl[nodeNum]) {
                                break;
                            }
                        }
                    }
                }

                for (it = 0, len = buttonList.length; it < len; it += 1) {
                    attackButton = caap.CheckForImage(buttonList[it], null, null, nodeNum);
                    if (attackButton) {
                        break;
                    }
                }

                if (attackButton) {
                    if (fightMode === 'Fortify') {
                        attackMess = 'Fortifying ' + monsterName;
                    } else if (useTactics) {
                        attackMess = 'Tactic Attacking ' + monsterName;
                    } else {
                        attackMess = (state.getItem('MonsterStaminaReq', 1) >= 5 ? 'Power' : 'Single') + ' Attacking ' + monsterName;
                    }

                    $u.log(1, attackMess);
                    caap.SetDivContent('monster_mess', attackMess);
                    state.setItem('ReleaseControl', true);
                    caap.Click(attackButton);
                    return true;
                } else {
                    $u.warn('No button to attack/fortify with.');
                    schedule.setItem('NotargetFrombattle_monster', 60);
                    return false;
                }
            }

            ///////////////// Check For Monster Page \\\\\\\\\\\\\\\\\\\\\\
            if (caap.NavigateTo('keep,battle_monster', 'tab_monster_list_on.gif')) {
                return true;
            }

            buttonHref = $j("img[src*='dragon_list_btn_']").eq(0).parent().attr("href");
            if (state.getItem('pageUserCheck', '') && (!buttonHref || !buttonHref.match('user=' + caap.stats['FBID']) || !buttonHref.match(/alchemy\.php/))) {
                $u.log(2, "On another player's keep.", state.getItem('pageUserCheck', ''));
                return caap.NavigateTo('keep,battle_monster', 'tab_monster_list_on.gif');
            }

            if (config.getItem('clearCompleteMonsters', false) && monster.completeButton['battle_monster']['button'] && monster.completeButton['battle_monster']['name']) {
                caap.Click(monster.completeButton['battle_monster']['button']);
                monster.deleteItem(monster.completeButton['battle_monster']['name']);
                monster.completeButton['battle_monster'] = {'name': undefined, 'button': undefined};
                caap.UpdateDashboard(true);
                $u.log(1, 'Cleared a completed monster');
                return true;
            }

            if (monster.engageButtons[monsterName]) {
                caap.SetDivContent('monster_mess', 'Opening ' + monsterName);
                caap.Click(monster.engageButtons[monsterName]);
                return true;
            } else {
                schedule.setItem('NotargetFrombattle_monster', 60);
                $u.warn('No "Engage" button for ', monsterName);
                return false;
            }
        } catch (err) {
            $u.error("ERROR in Monsters: " + err);
            return false;
        }
    },

    demi: {
        'ambrosia' : {
            'power' : {
                'total' : 0,
                'max'   : 0,
                'next'  : 0
            },
            'daily' : {
                'num' : 0,
                'max' : 0,
                'dif' : 0
            }
        },
        'malekus' : {
            'power' : {
                'total' : 0,
                'max'   : 0,
                'next'  : 0
            },
            'daily' : {
                'num' : 0,
                'max' : 0,
                'dif' : 0
            }
        },
        'corvintheus' : {
            'power' : {
                'total' : 0,
                'max'   : 0,
                'next'  : 0
            },
            'daily' : {
                'num' : 0,
                'max' : 0,
                'dif' : 0
            }
        },
        'aurora' : {
            'power' : {
                'total' : 0,
                'max'   : 0,
                'next'  : 0
            },
            'daily' : {
                'num' : 0,
                'max' : 0,
                'dif' : 0
            }
        },
        'azeron' : {
            'power' : {
                'total' : 0,
                'max'   : 0,
                'next'  : 0
            },
            'daily' : {
                'num' : 0,
                'max' : 0,
                'dif' : 0
            }
        }
    },
    /*jslint sub: false */

    LoadDemi: function () {
        var demis = gm.getItem('demipoint.records', 'default');
        if (demis === 'default' || !$j.isPlainObject(demis)) {
            demis = gm.setItem('demipoint.records', caap.demi);
        }

        $j.extend(true, caap.demi, demis);
        $u.log(4, 'Demi', caap.demi);
        state.setItem("UserDashUpdate", true);
    },

    SaveDemi: function () {
        gm.setItem('demipoint.records', caap.demi);
        $u.log(4, 'Demi', caap.demi);
        state.setItem("UserDashUpdate", true);
    },

    demiTable: {
        0 : 'ambrosia',
        1 : 'malekus',
        2 : 'corvintheus',
        3 : 'aurora',
        4 : 'azeron'
    },

    /* This section is formatted to allow Advanced Optimisation by the Closure Compiler */
    /*jslint sub: true */
    CheckResults_battle: function () {
        try {
            var symDiv  = $j(),
                points  = [],
                success = true;

            battle.checkResults();
            symDiv = caap.appBodyDiv.find("img[src*='symbol_tiny_']").not("img[src*='rewards.jpg']");
            if (symDiv && symDiv.length === 5) {
                symDiv.each(function (index) {
                    var txt = '';
                    txt = $j(this).parent().parent().next().text();
                    txt = txt ? txt.replace(/\s/g, '') : '';
                    if (txt) {
                        points.push(txt);
                    } else {
                        success = false;
                        $u.warn('Demi temp text problem', txt);
                    }
                });

                if (success) {
                    caap.demi['ambrosia']['daily'] = caap.GetStatusNumbers(points[0]);
                    caap.demi['malekus']['daily'] = caap.GetStatusNumbers(points[1]);
                    caap.demi['corvintheus']['daily'] = caap.GetStatusNumbers(points[2]);
                    caap.demi['aurora']['daily'] = caap.GetStatusNumbers(points[3]);
                    caap.demi['azeron']['daily'] = caap.GetStatusNumbers(points[4]);
                    schedule.setItem("battle", gm.getItem('CheckDemi', 6, hiddenVar) * 3600, 300);
                    caap.SaveDemi();
                }
            } else {
                $u.warn('Demi symDiv problem', symDiv);
            }

            return true;
        } catch (err) {
            $u.error("ERROR in CheckResults_battle: " + err);
            return false;
        }
    },

    DemiPoints: function () {
        try {
            if (caap.stats['level'] < 9) {
                return false;
            }

            if (!config.getItem('DemiPointsFirst', false) || config.getItem('WhenMonster', 'Never') === 'Never') {
                return false;
            }

            if (schedule.check("battle")) {
                if (caap.NavigateTo(caap.battlePage, 'battle_on.gif')) {
                    return true;
                }
            }

            var demiPointsDone = false;
            demiPointsDone = battle.selectedDemisDone();
            state.setItem("DemiPointsDone", demiPointsDone);
            if (!demiPointsDone) {
                return caap.Battle('DemiPoints');
            } else {
                return false;
            }
        } catch (err) {
            $u.error("ERROR in DemiPoints: " + err);
            return false;
        }
    },

    InLevelUpMode: function () {
        try {
            if (!gm.getItem('EnableLevelUpMode', true, hiddenVar)) {
                //if levelup mode is false then new level up mode is also false (kob)
                state.setItem("newLevelUpMode", false);
                return false;
            }

            if (!(caap.stats['indicators']['enl']) || (caap.stats['indicators']['enl']).toString().match(new Date(2009, 1, 1).getTime())) {
                //if levelup mode is false then new level up mode is also false (kob)
                state.setItem("newLevelUpMode", false);
                return false;
            }

            // minutesBeforeLevelToUseUpStaEnergy : 5, = 30000
            if (((caap.stats['indicators']['enl'] - new Date().getTime()) < 30000) || (caap.stats['exp']['dif'] <= config.getItem('LevelUpGeneralExp', 0))) {
                //detect if we are entering level up mode for the very first time (kob)
                if (!state.getItem("newLevelUpMode", false)) {
                    //set the current level up mode flag so that we don't call refresh monster routine more than once (kob)
                    state.setItem("newLevelUpMode", true);
                    caap.refreshMonstersListener();
                }

                return true;
            }

            //if levelup mode is false then new level up mode is also false (kob)
            state.setItem("newLevelUpMode", false);
            return false;
        } catch (err) {
            $u.error("ERROR in InLevelUpMode: " + err);
            return false;
        }
    },

    CheckStamina: function (battleOrMonster, attackMinStamina) {
        try {
            $u.log(4, "CheckStamina", battleOrMonster, attackMinStamina);
            if (!attackMinStamina) {
                attackMinStamina = 1;
            }

            var when           = config.getItem('When' + battleOrMonster, 'Never'),
                maxIdleStamina = 0,
                theGeneral     = '',
                staminaMF      = '',
                messDiv        = battleOrMonster.toLowerCase() + "_mess";

            if (when === 'Never') {
                return false;
            }

            if (!caap.stats['stamina'] || !caap.stats['health']) {
                caap.SetDivContent(messDiv, 'Health or stamina not known yet.');
                return false;
            }

            if (caap.stats['health']['num'] < 10) {
                caap.SetDivContent(messDiv, "Need health to fight: " + caap.stats['health']['num'] + "/10");
                return false;
            }

            if (battleOrMonster === "Battle" && config.getItem("waitSafeHealth", false) && caap.stats['health']['num'] < 13) {
                caap.SetDivContent(messDiv, "Unsafe. Need spare health to fight: " + caap.stats['health']['num'] + "/13");
                return false;
            }

            if (when === 'At X Stamina') {
                if (caap.InLevelUpMode() && caap.stats['stamina']['num'] >= attackMinStamina) {
                    caap.SetDivContent(messDiv, 'Burning stamina to level up');
                    return true;
                }

                staminaMF = battleOrMonster + 'Stamina';
                if (state.getItem('BurnMode_' + staminaMF, false) || caap.stats['stamina']['num'] >= config.getItem('X' + staminaMF, 1)) {
                    if (caap.stats['stamina']['num'] < attackMinStamina || caap.stats['stamina']['num'] <= config.getItem('XMin' + staminaMF, 0)) {
                        state.setItem('BurnMode_' + staminaMF, false);
                        return false;
                    }

                    state.setItem('BurnMode_' + staminaMF, true);
                    return true;
                } else {
                    state.setItem('BurnMode_' + staminaMF, false);
                }

                caap.SetDivContent(messDiv, 'Waiting for stamina: ' + caap.stats['stamina']['num'] + "/" + config.getItem('X' + staminaMF, 1));
                return false;
            }

            if (when === 'At Max Stamina') {
                maxIdleStamina = caap.stats['stamina']['max'];
                theGeneral = config.getItem('IdleGeneral', 'Use Current');
                if (theGeneral !== 'Use Current') {
                    maxIdleStamina = general.GetStaminaMax(theGeneral);
                }

                if (theGeneral !== 'Use Current' && !maxIdleStamina) {
                    $u.log(2, "Changing to idle general to get Max Stamina");
                    if (general.Select('IdleGeneral')) {
                        return true;
                    }
                }

                if (caap.stats['stamina']['num'] >= maxIdleStamina) {
                    caap.SetDivContent(messDiv, 'Using max stamina');
                    return true;
                }

                if (caap.InLevelUpMode() && caap.stats['stamina']['num'] >= attackMinStamina) {
                    caap.SetDivContent(messDiv, 'Burning all stamina to level up');
                    return true;
                }

                caap.SetDivContent(messDiv, 'Waiting for max stamina: ' + caap.stats['stamina']['num'] + "/" + maxIdleStamina);
                return false;
            }

            if (caap.stats['stamina']['num'] >= attackMinStamina) {
                return true;
            }

            caap.SetDivContent(messDiv, "Waiting for more stamina: " + caap.stats['stamina']['num'] + "/" + attackMinStamina);
            return false;
        } catch (err) {
            $u.error("ERROR in CheckStamina: " + err);
            return false;
        }
    },

    /*-------------------------------------------------------------------------------------\
    NeedToHide will return true if the current stamina and health indicate we need to bring
    our health down through battles (hiding).  It also returns true if there is no other outlet
    for our stamina (currently this just means Monsters, but will eventually incorporate
    other stamina uses).
    \-------------------------------------------------------------------------------------*/
    NeedToHide: function () {
        try {
            if (config.getItem('WhenMonster', 'Never') === 'Never') {
                $u.log(1, 'Stay Hidden Mode: Monster battle not enabled');
                return true;
            }

            if (!state.getItem('targetFrombattle_monster', '')) {
                $u.log(1, 'Stay Hidden Mode: No monster to battle');
                return true;
            }
        /*-------------------------------------------------------------------------------------\
        The riskConstant helps us determine how much we stay in hiding and how much we are willing
        to risk coming out of hiding.  The lower the riskConstant, the more we spend stamina to
        stay in hiding. The higher the risk constant, the more we attempt to use our stamina for
        non-hiding activities.  The below matrix shows the default riskConstant of 1.7

                    S   T   A   M   I   N   A
                    1   2   3   4   5   6   7   8   9        -  Indicates we use stamina to hide
            H   10  -   -   +   +   +   +   +   +   +        +  Indicates we use stamina as requested
            E   11  -   -   +   +   +   +   +   +   +
            A   12  -   -   +   +   +   +   +   +   +
            L   13  -   -   +   +   +   +   +   +   +
            T   14  -   -   -   +   +   +   +   +   +
            H   15  -   -   -   +   +   +   +   +   +
                16  -   -   -   -   +   +   +   +   +
                17  -   -   -   -   -   +   +   +   +
                18  -   -   -   -   -   +   +   +   +

        Setting our riskConstant down to 1 will result in us spending out stamina to hide much
        more often:

                    S   T   A   M   I   N   A
                    1   2   3   4   5   6   7   8   9        -  Indicates we use stamina to hide
            H   10  -   -   +   +   +   +   +   +   +        +  Indicates we use stamina as requested
            E   11  -   -   +   +   +   +   +   +   +
            A   12  -   -   -   +   +   +   +   +   +
            L   13  -   -   -   -   +   +   +   +   +
            T   14  -   -   -   -   -   +   +   +   +
            H   15  -   -   -   -   -   -   +   +   +
                16  -   -   -   -   -   -   -   +   +
                17  -   -   -   -   -   -   -   -   +
                18  -   -   -   -   -   -   -   -   -

        \-------------------------------------------------------------------------------------*/
            var riskConstant = gm.getItem('HidingRiskConstant', 1.7, hiddenVar);
        /*-------------------------------------------------------------------------------------\
        The formula for determining if we should hide goes something like this:

            If  (health - (estimated dmg from next attacks) puts us below 10)  AND
                (current stamina will be at least 5 using staminatime/healthtime ratio)
            Then stamina can be used/saved for normal process
            Else stamina is used for us to hide

        \-------------------------------------------------------------------------------------*/
            //if ((caap.stats['health']['num'] - ((caap.stats['stamina']['num'] - 1) * riskConstant) < 10) && (caap.stats['stamina']['num'] * (5 / 3) >= 5)) {
            if ((caap.stats['health']['num'] - ((caap.stats['stamina']['num'] - 1) * riskConstant) < 10) && ((caap.stats['stamina']['num'] + gm.getItem('HideStaminaRisk', 1, hiddenVar)) >= state.getItem('MonsterStaminaReq', 1))) {
                return false;
            } else {
                return true;
            }
        } catch (err) {
            $u.error("ERROR in NeedToHide: " + err);
            return undefined;
        }
    },
    /*jslint sub: false */

    /////////////////////////////////////////////////////////////////////
    //                          POTIONS
    /////////////////////////////////////////////////////////////////////

    /* This section is formatted to allow Advanced Optimisation by the Closure Compiler */
    /*jslint sub: true */
    AutoPotions: function () {
        try {
            if (!config.getItem('AutoPotions', true) || !schedule.check('AutoPotionTimerDelay')) {
                return false;
            }

            if (caap.stats['exp']['dif'] <= config.getItem("potionsExperience", 20)) {
                $u.log(2, "AutoPotions, ENL condition. Delaying 10 minutes");
                schedule.setItem('AutoPotionTimerDelay', 600);
                return false;
            }

            function ConsumePotion(potion) {
                try {
                    if (!$j(".statsTTitle").length) {
                        $u.log(2, "Going to keep for potions");
                        if (caap.NavigateTo('keep')) {
                            return true;
                        }
                    }

                    var formId    = "app46755028429_consume_1",
                        potionDiv = $j(),
                        button    = null;

                    if (potion === 'stamina') {
                        formId = "app46755028429_consume_2";
                    }

                    $u.log(1, "Consuming potion", potion);
                    potionDiv = $j("form[id='" + formId + "'] input[src*='potion_consume.gif']");
                    if (potionDiv && potionDiv.length) {
                        button = potionDiv.get(0);
                        if (button) {
                            caap.Click(button);
                        } else {
                            $u.warn("Could not find consume button for", potion);
                            return false;
                        }
                    } else {
                        $u.warn("Could not find consume form for", potion);
                        return false;
                    }

                    return true;
                } catch (err) {
                    $u.error("ERROR in ConsumePotion: " + err, potion);
                    return false;
                }
            }

            if (caap.stats['energy']['num'] < caap.stats['energy']['max'] - 10 &&
                caap.stats['potions']['energy'] >= config.getItem("energyPotionsSpendOver", 39) &&
                caap.stats['potions']['energy'] > config.getItem("energyPotionsKeepUnder", 35)) {
                return ConsumePotion('energy');
            }

            if (caap.stats['stamina']['num'] < caap.stats['stamina']['max'] - 10 &&
                caap.stats['potions']['stamina'] >= config.getItem("staminaPotionsSpendOver", 39) &&
                caap.stats['potions']['stamina'] > config.getItem("staminaPotionsKeepUnder", 35)) {
                return ConsumePotion('stamina');
            }

            return false;
        } catch (err) {
            $u.error("ERROR in AutoPotion: " + err);
            return false;
        }
    },
    /*jslint sub: false */

    /////////////////////////////////////////////////////////////////////
    //                          ALCHEMY
    /////////////////////////////////////////////////////////////////////

    /*-------------------------------------------------------------------------------------\
    AutoAlchemy perform aclchemy combines for all recipes that do not have missing
    ingredients.  By default, it also will not combine Battle Hearts.
    First we make sure the option is set and that we haven't been here for a while.
    \-------------------------------------------------------------------------------------*/
    AutoAlchemy: function () {
        try {
            if (!config.getItem('AutoAlchemy', false)) {
                return false;
            }

            if (!schedule.check('AlchemyTimer')) {
                //return false;
            }
    /*-------------------------------------------------------------------------------------\
    Now we navigate to the Alchemy Recipe page.
    \-------------------------------------------------------------------------------------*/
            if (!caap.NavigateTo('keep,alchemy', 'tab_alchemy_on.gif')) {
                var button    = {},
                    recipeDiv = $j(),
                    ss        = $j(),
                    clicked   = false;

                recipeDiv = $j("#app46755028429_recipe_list");
                if (recipeDiv && recipeDiv.length) {
                    if (recipeDiv.attr("class") !== 'show_items') {
                        button = recipeDiv.find("div[id*='alchemy_item_tab']");
                        if (button && button.length) {
                            caap.Click(button.get(0));
                            return true;
                        } else {
                            $u.warn('Cant find item tab', recipeDiv);
                            return false;
                        }
                    }
                } else {
                    $u.warn('Cant find recipe list');
                    return false;
                }
    /*-------------------------------------------------------------------------------------\
    We close the results of our combines so they don't hog up our screen
    \-------------------------------------------------------------------------------------*/
                button = caap.CheckForImage('help_close_x.gif');
                if (button) {
                    caap.Click(button);
                    return true;
                }
    /*-------------------------------------------------------------------------------------\
    Now we get all of the recipes and step through them one by one
    \-------------------------------------------------------------------------------------*/
                ss = $j("div[class='alchemyRecipeBack']");
                if (!ss || !ss.length) {
                    $u.log(2, 'No recipes found');
                }

                ss.each(function () {
                    recipeDiv = $j(this);
    /*-------------------------------------------------------------------------------------\
    If we are missing an ingredient then skip it
    \-------------------------------------------------------------------------------------*/
                    if (recipeDiv.find("div[class*='missing']").length) {
                        $u.log(2, 'Skipping Recipe');
                        return true;
                    }
    /*-------------------------------------------------------------------------------------\
    If we are skipping battle hearts then skip it
    \-------------------------------------------------------------------------------------*/
                    if (caap.CheckForImage('raid_hearts', recipeDiv) && !config.getItem('AutoAlchemyHearts', false)) {
                        $u.log(2, 'Skipping Hearts');
                        return true;
                    }
    /*-------------------------------------------------------------------------------------\
    Find our button and click it
    \-------------------------------------------------------------------------------------*/
                    button = recipeDiv.find("input[type='image']");
                    if (button && button.length) {
                        clicked = true;
                        caap.Click(button.get(0));
                        $u.log(2, 'Clicked A Recipe', recipeDiv.find("img").attr("title"));
                        return false;
                    } else {
                        $u.warn('Cant Find Item Image Button');
                    }

                    return true;
                });

                if (clicked) {
                    return true;
                }
    /*-------------------------------------------------------------------------------------\
    All done. Set the timer to check back in 3 hours.
    \-------------------------------------------------------------------------------------*/
                schedule.setItem('AlchemyTimer', 10800, 300);
                return false;
            }

            return true;
        } catch (err) {
            $u.error("ERROR in Alchemy: " + err);
            return false;
        }
    },

    /////////////////////////////////////////////////////////////////////
    //                          BANKING
    // Keep it safe!
    /////////////////////////////////////////////////////////////////////

    ImmediateBanking: function () {
        if (!config.getItem("BankImmed", false)) {
            return false;
        }

        return caap.Bank();
    },

    /* This section is formatted to allow Advanced Optimisation by the Closure Compiler */
    /*jslint sub: true */
    Bank: function () {
        try {
            if (config.getItem("NoBankAfterLvl", true) && state.getItem('KeepLevelUpGeneral', false)) {
                return false;
            }

            var maxInCash     = -1,
                minInCash     = 0,
                depositButton = null,
                numberInput   = null,
                deposit       = 0;

            maxInCash = config.getItem('MaxInCash', -1);
            minInCash = config.getItem('MinInCash', 0);
            if (!maxInCash || maxInCash < 0 || caap.stats['gold']['cash'] <= minInCash || caap.stats['gold']['cash'] < maxInCash || caap.stats['gold']['cash'] < 10) {
                return false;
            }

            if (general.Select('BankingGeneral')) {
                return true;
            }

            depositButton = $j("input[src*='btn_stash.gif']");
            if (!depositButton || !depositButton.length) {
                // Cannot find the link
                return caap.NavigateTo('keep');
            }

            numberInput = $j("input[name='stash_gold']");
            if (!numberInput || !numberInput.length) {
                $u.warn('Cannot find box to put in number for bank deposit.');
                return false;
            }

            deposit = numberInput.attr("value").parseInt() - minInCash;
            numberInput.attr("value", deposit);
            $u.log(1, 'Depositing into bank:', deposit);
            caap.Click(depositButton.get(0));
            return true;
        } catch (err) {
            $u.error("ERROR in Bank: " + err);
            return false;
        }
    },

    RetrieveFromBank: function (num) {
        try {
            if (num <= 0) {
                return false;
            }

            var retrieveButton = null,
                numberInput    = null,
                minInStore     = 0;

            retrieveButton = $j("input[src*='btn_retrieve.gif']");
            if (!retrieveButton || !retrieveButton.length) {
                // Cannot find the link
                return caap.NavigateTo('keep');
            }

            minInStore = config.getItem('minInStore', 0);
            if (!(minInStore || minInStore <= caap.stats['gold']['bank'] - num)) {
                return false;
            }

            numberInput = $j("input[name='get_gold']");
            if (!numberInput || !numberInput.length) {
                $u.warn('Cannot find box to put in number for bank retrieve.');
                return false;
            }

            numberInput.attr("value", num);
            $u.log(1, 'Retrieving from bank:', num);
            state.setItem('storeRetrieve', '');
            caap.Click(retrieveButton.get(0));
            return true;
        } catch (err) {
            $u.error("ERROR in RetrieveFromBank: " + err);
            return false;
        }
    },

    /////////////////////////////////////////////////////////////////////
    //                          HEAL
    /////////////////////////////////////////////////////////////////////

    Heal: function () {
        try {
            var minToHeal     = 0,
                minStamToHeal = 0;

            caap.SetDivContent('heal_mess', '');
            minToHeal = config.getItem('MinToHeal', 0);
            if (minToHeal === "" || minToHeal < 0 || !$u.isNum(minToHeal)) {
                return false;
            }

            minStamToHeal = config.getItem('MinStamToHeal', 0);
            if (minStamToHeal === "" || minStamToHeal < 0 || !$u.isNum(minStamToHeal)) {
                minStamToHeal = 0;
            }

            if (!caap.stats['health'] || $j.isEmptyObject(caap.stats['health']) || $j.isEmptyObject(caap.stats['healthT'])) {
                return false;
            }

            if (!caap.stats['stamina'] || $j.isEmptyObject(caap.stats['stamina']) || $j.isEmptyObject(caap.stats['staminaT'])) {
                return false;
            }

            if ((config.getItem('WhenBattle', 'Never') !== 'Never') || (config.getItem('WhenMonster', 'Never') !== 'Never')) {
                if ((caap.InLevelUpMode() || caap.stats['stamina']['num'] >= caap.stats['staminaT']['max']) && caap.stats['health']['num'] < 10) {
                    $u.log(1, 'Heal');
                    return caap.NavigateTo('keep,heal_button.gif');
                }
            }

            if (caap.stats['health']['num'] >= caap.stats['healthT']['max'] || caap.stats['health']['num'] >= minToHeal) {
                return false;
            }

            if (caap.stats['stamina']['num'] < minStamToHeal) {
                caap.SetDivContent('heal_mess', 'Waiting for stamina to heal: ' + caap.stats['stamina']['num'] + '/' + minStamToHeal);
                return false;
            }

            $u.log(1, 'Heal');
            return caap.NavigateTo('keep,heal_button.gif');
        } catch (err) {
            $u.error("ERROR in Heal: " + err);
            return false;
        }
    },

    /////////////////////////////////////////////////////////////////////
    //                          ELITE GUARD
    /////////////////////////////////////////////////////////////////////

    AutoElite: function () {
        try {
            if (!config.getItem('AutoElite', false)) {
                return false;
            }

            if (!schedule.check('AutoEliteGetList')) {
                if (!state.getItem('FillArmy', false) && state.getItem(caap.friendListType.giftc.name + 'Requested', false)) {
                    state.setItem(caap.friendListType.giftc.name + 'Requested', false);
                }

                return false;
            }

            $u.log(2, 'Elite Guard cycle');
            var MergeMyEliteTodo = function (list) {
                $u.log(3, 'Elite Guard MergeMyEliteTodo list');
                var eliteArmyList = [];
                eliteArmyList = config.getList('EliteArmyList', '');
                if (eliteArmyList.length) {
                    $u.log(3, 'Merge and save Elite Guard MyEliteTodo list');
                    var diffList = list.filter(function (todoID) {
                        return (eliteArmyList.indexOf(todoID) < 0);
                    });

                    $j.merge(eliteArmyList, diffList);
                    state.setItem('MyEliteTodo', eliteArmyList);
                } else {
                    $u.log(3, 'Save Elite Guard MyEliteTodo list');
                    state.setItem('MyEliteTodo', list);
                }
            };

            var eliteList = state.getItem('MyEliteTodo', []);
            if (!$j.isArray(eliteList)) {
                $u.warn('MyEliteTodo list is not expected format, deleting', eliteList);
                eliteList = state.setItem('MyEliteTodo', []);
            }

            if (window.location.href.indexOf('party.php')) {
                $u.log(1, 'Checking Elite Guard status');
                var autoEliteFew = state.getItem('AutoEliteFew', false);
                var autoEliteFull = $j('.result_body').text().match(/YOUR Elite Guard is FULL/i);
                if (autoEliteFull || (autoEliteFew && state.getItem('AutoEliteEnd', '') === 'NoArmy')) {
                    if (autoEliteFull) {
                        $u.log(1, 'Elite Guard is FULL');
                        if (eliteList.length) {
                            MergeMyEliteTodo(eliteList);
                        }
                    } else if (autoEliteFew && state.getItem('AutoEliteEnd', '') === 'NoArmy') {
                        $u.log(1, 'Not enough friends to fill Elite Guard');
                        state.setItem('AutoEliteFew', false);
                    }

                    $u.log(3, 'Set Elite Guard AutoEliteGetList timer');
                    schedule.setItem('AutoEliteGetList', 21600, 300);
                    state.setItem('AutoEliteEnd', 'Full');
                    $u.log(1, 'Elite Guard done');
                    return false;
                }
            }

            if (!eliteList.length) {
                $u.log(2, 'Elite Guard no MyEliteTodo cycle');
                var allowPass = false;
                if (state.getItem(caap.friendListType.giftc.name + 'Requested', false) && state.getItem(caap.friendListType.giftc.name + 'Responded', false) === true) {
                    $u.log(2, 'Elite Guard received 0 friend ids');
                    if (config.getList('EliteArmyList', '').length) {
                        $u.log(2, 'Elite Guard has some defined friend ids');
                        allowPass = true;
                    } else {
                        schedule.setItem('AutoEliteGetList', 21600, 300);
                        $u.log(2, 'Elite Guard has 0 defined friend ids');
                        state.setItem('AutoEliteEnd', 'Full');
                        $u.log(1, 'Elite Guard done');
                        return false;
                    }
                }

                caap.GetFriendList(caap.friendListType.giftc);
                var castleageList = [];
                if (state.getItem(caap.friendListType.giftc.name + 'Responded', false) !== true) {
                    castleageList = state.getItem(caap.friendListType.giftc.name + 'Responded', []);
                }

                if (castleageList.length || (caap.stats['army']['capped'] <= 1) || allowPass) {
                    $u.log(2, 'Elite Guard received a new friend list');
                    MergeMyEliteTodo(castleageList);
                    state.setItem(caap.friendListType.giftc.name + 'Responded', []);
                    state.setItem(caap.friendListType.giftc.name + 'Requested', false);
                    eliteList = state.getItem('MyEliteTodo', []);
                    if (eliteList.length === 0) {
                        $u.log(1, 'WARNING! Elite Guard friend list is 0');
                        state.setItem('AutoEliteFew', true);
                        schedule.setItem('AutoEliteGetList', 21600, 300);
                    } else if (eliteList.length < 50) {
                        $u.log(1, 'WARNING! Elite Guard friend list is fewer than 50: ', eliteList.length);
                        state.setItem('AutoEliteFew', true);
                    }
                }
            } else if (schedule.check('AutoEliteReqNext')) {
                $u.log(2, 'Elite Guard has a MyEliteTodo list, shifting User ID');
                var user = eliteList.shift();
                $u.log(1, 'Add Elite Guard ID: ', user);
                caap.ClickAjaxLinkSend('party.php?twt=jneg&jneg=true&user=' + user);
                $u.log(2, 'Elite Guard sent request, saving shifted MyEliteTodo');
                state.setItem('MyEliteTodo', eliteList);
                schedule.setItem('AutoEliteReqNext', 7);
                if (!eliteList.length) {
                    $u.log(2, 'Army list exhausted');
                    state.setItem('AutoEliteEnd', 'NoArmy');
                }
            }

            $u.log(1, 'Release Elite Guard cycle');
            return true;
        } catch (err) {
            $u.error("ERROR in AutoElite: " + err);
            return false;
        }
    },
    /*jslint sub: false */

    /////////////////////////////////////////////////////////////////////
    //                          PASSIVE GENERALS
    /////////////////////////////////////////////////////////////////////

    PassiveGeneral: function () {
        if (config.getItem('IdleGeneral', 'Use Current') !== 'Use Current') {
            if (general.Select('IdleGeneral')) {
                return true;
            }
        }

        return false;
    },

    /////////////////////////////////////////////////////////////////////
    //                          AUTOINCOME
    /////////////////////////////////////////////////////////////////////

    /* This section is formatted to allow Advanced Optimisation by the Closure Compiler */
    /*jslint sub: true */
    AutoIncome: function () {
        if (config.getItem("NoIncomeAfterLvl", true) && state.getItem('KeepLevelUpGeneral', false)) {
            return false;
        }

        if (caap.stats['gold']['payTime']['minutes'] < 1 && caap.stats['gold']['payTime']['ticker'].match(/\d+:\d+/) && config.getItem('IncomeGeneral', 'Use Current') !== 'Use Current') {
            general.Select('IncomeGeneral');
            return true;
        }

        return false;
    },
    /*jslint sub: false */

    /////////////////////////////////////////////////////////////////////
    //                              ARMY
    /////////////////////////////////////////////////////////////////////

    CheckResults_army: function (resultsText) {
        var listHref = $j(),
            link     = $j(),
            autoGift = false;

        autoGift = config.getItem('AutoGift', false);
        listHref = caap.appBodyDiv.find("div[class='messages'] a[href*='army.php?act=ignore']");
        if (listHref && listHref.length) {
            if (autoGift) {
                $u.log(1, 'We have a gift waiting!');
                state.setItem('HaveGift', true);
            }

            listHref.each(function () {
                var row = $j(this);
                link = $j("<br /><a title='This link can be used to collect the " +
                    "gift when it has been lost on Facebook. !!If you accept a gift " +
                    "in this manner then it will leave an orphan request on Facebook!!' " +
                    "href='" + row.attr("href").replace('ignore', 'acpt') + "'>Lost Accept</a>");
                link.insertAfter(row);
            });
        } else {
            if (autoGift) {
                $u.log(2, 'No gifts waiting.');
                state.setItem('HaveGift', false);
            }
        }

        if (autoGift) {
            schedule.setItem("ajaxGiftCheck", gm.getItem('CheckGiftMins', 15, hiddenVar) * 60, 300);
        }
    },

    /////////////////////////////////////////////////////////////////////
    //                              INDEX
    /////////////////////////////////////////////////////////////////////

    /* This section is formatted to allow Advanced Optimisation by the Closure Compiler */
    /*jslint sub: true */
    CheckResults_index: function (resultsText) {
        try {
            function News() {
                try {
                    var xp     = 0,
                        bp     = 0,
                        wp     = 0,
                        win    = 0,
                        lose   = 0,
                        deaths = 0,
                        cash   = 0,
                        i      = '',
                        list   = [],
                        user   = {},
                        tStr   = '',
                        $b     = null,
                        $c     = null;

                    $b = $j('#app46755028429_battleUpdateBox');
                    if ($b && $b.length) {
                        $c = $j('.alertsContainer', $b);
                        $j('.alert_content', $c).each(function (i, el) {
                            var uid     = 0,
                                txt     = '',
                                my_xp   = 0,
                                my_bp   = 0,
                                my_wp   = 0,
                                my_cash = 0,
                                $a      = $j('a', el).eq(0);

                            txt = $j(el).text().replace(/,/g, '');
                            if (txt.regex(/You were killed/i)) {
                                deaths += 1;
                            } else {
                                tStr = $a.attr('href');
                                uid = tStr.regex(/user=(\d+)/);
                                user[uid] = user[uid] || {name: $a.text(), win: 0, lose: 0};
                                my_xp = txt.regex(/(\d+) experience/i);
                                my_bp = txt.regex(/(\d+) Battle Points!/i);
                                my_wp = txt.regex(/(\d+) War Points!/i);
                                my_cash = txt.regex(/\$(\d+)/i);
                                if (txt.regex(/Victory!/i)) {
                                    win += 1;
                                    user[uid].lose += 1;
                                    xp += my_xp;
                                    bp += my_bp;
                                    wp += my_wp;
                                    cash += my_cash;
                                } else {
                                    lose += 1;
                                    user[uid].win += 1;
                                    xp -= my_xp;
                                    bp -= my_bp;
                                    wp -= my_wp;
                                    cash -= my_cash;
                                }
                            }
                        });

                        if (win || lose) {
                            list.push('You were challenged <strong>' + (win + lose) + '</strong> times,<br>winning <strong>' + win + '</strong> and losing <strong>' + lose + '</strong>.');
                            list.push('You ' + (xp >= 0 ? 'gained <span class="positive">' : 'lost <span class="negative">') + caap.makeCommaValue(Math.abs(xp)) + '</span> experience points.');
                            list.push('You ' + (cash >= 0 ? 'gained <span class="positive">' : 'lost <span class="negative">') + '<b class="gold">$' + caap.makeCommaValue(Math.abs(cash)) + '</b></span>.');
                            list.push('You ' + (bp >= 0 ? 'gained <span class="positive">' : 'lost <span class="negative">') + caap.makeCommaValue(Math.abs(bp)) + '</span> Battle Points.');
                            list.push('You ' + (wp >= 0 ? 'gained <span class="positive">' : 'lost <span class="negative">') + caap.makeCommaValue(Math.abs(wp)) + '</span> War Points.');
                            list.push('');
                            user = $u.sortObjectBy(user, function (a, b) {
                                    return (user[b].win + (user[b].lose / 100)) - (user[a].win + (user[a].lose / 100));
                                });

                            for (i in user) {
                                if (user.hasOwnProperty(i)) {
                                    list.push('<strong title="' + i + '">' + user[i].name + '</strong> ' +
                                        (user[i].win ? 'beat you <span class="negative">' + user[i].win +
                                        '</span> time' + (user[i].win > 1 ? 's' : '') : '') +
                                        (user[i].lose ? (user[i].win ? ' and ' : '') +
                                        'was beaten <span class="positive">' + user[i].lose +
                                        '</span> time' + (user[i].lose > 1 ? 's' : '') : '') + '.');
                                }
                            }

                            if (deaths) {
                                list.push('You died ' + (deaths > 1 ? deaths + ' times' : 'once') + '!');
                            }

                            $c.prepend('<div style="padding: 0pt 0pt 10px;"><div class="alert_title">Summary:</div><div class="alert_content">' + list.join('<br>') + '</div></div>');
                        }
                    }

                    return true;
                } catch (err) {
                    $u.error("ERROR in News: " + err);
                    return false;
                }
            }

            if (config.getItem('NewsSummary', true)) {
                News();
            }

            // Check for new gifts
            // A warrior wants to join your Army!
            // Send Gifts to Friends
            if (config.getItem('AutoGift', false)) {
                if (resultsText && /Send Gifts to Friends/.test(resultsText)) {
                    $u.log(1, 'We have a gift waiting!');
                    state.setItem('HaveGift', true);
                } else {
                    $u.log(2, 'No gifts waiting.');
                    state.setItem('HaveGift', false);
                }

                schedule.setItem("ajaxGiftCheck", gm.getItem('CheckGiftMins', 15, hiddenVar) * 60, 300);
            }

            var tokenSpan = $j(),
                tStr      = '',
                arenaInfo = {};

            tokenSpan = $j("span[id='app46755028429_arena_token_current_value']");
            if (tokenSpan && tokenSpan.length) {
                tStr = tokenSpan.length ? tokenSpan.text().trim() : '';
                arenaInfo = arena.getItem();
                arenaInfo['tokens'] = tStr ? tStr.parseInt() : 0;
                if (arenaInfo['tokens'] === 10) {
                    arenaInfo['tokenTime'] = '';
                }

                arena.setItem(arenaInfo);
                $u.log(3, 'arenaInfo', arenaInfo);
            }

            return true;
        } catch (err) {
            $u.error("ERROR in CheckResults_index: " + err);
            return false;
        }
    },
    /*jslint sub: false */

    /////////////////////////////////////////////////////////////////////
    //                              AUTOGIFT
    /////////////////////////////////////////////////////////////////////

    AjaxGiftCheck: function () {
        try {
            if (!config.getItem('AutoGift', false) || !schedule.check("ajaxGiftCheck")) {
                return false;
            }

            $u.log(3, "Performing AjaxGiftCheck");

            $j.ajax({
                url: "http://apps.facebook.com/castle_age/army.php",
                error:
                    function (XMLHttpRequest, textStatus, errorThrown) {
                        $u.error("AjaxGiftCheck.ajax", textStatus);
                    },
                success:
                    function (data, textStatus, XMLHttpRequest) {
                        try {
                            $u.log(3, "AjaxGiftCheck.ajax: Checking data.");
                            if ($j(data).find("a[href*='reqs.php#confirm_46755028429_0']").length) {
                                $u.log(1, 'AjaxGiftCheck.ajax: We have a gift waiting!');
                                state.setItem('HaveGift', true);
                            } else {
                                $u.log(2, 'AjaxGiftCheck.ajax: No gifts waiting.');
                                state.setItem('HaveGift', false);
                            }

                            $u.log(3, "AjaxGiftCheck.ajax: Done.");
                        } catch (err) {
                            $u.error("ERROR in AjaxGiftCheck.ajax: " + err);
                        }
                    }
            });

            schedule.setItem("ajaxGiftCheck", gm.getItem('CheckGiftMins', 15, hiddenVar) * 60, 300);
            $u.log(3, "Completed AjaxGiftCheck");
            return true;
        } catch (err) {
            $u.error("ERROR in AjaxGiftCheck: " + err);
            return false;
        }
    },

    CheckResults_gift_accept: function (resultsText) {
        // Confirm gifts actually sent
        gifting.queue.sent();
        gifting.collected();
    },

    GiftExceedLog: true,

    AutoGift: function () {
        try {
            var tempDiv    = $j(),
                tempText   = '',
                giftImg    = '',
                giftChoice = '',
                popCheck,
                collecting,
                whenArena  = '',
                arenaInfo  = {};

            whenArena = config.getItem("WhenArena", 'Never');
            if (whenArena !== 'Never') {
                arenaInfo = arena.getItem();
            }

            /* This section is formatted to allow Advanced Optimisation by the Closure Compiler */
            /*jslint sub: true */
            if (!config.getItem('AutoGift', false) || (!$j.isEmptyObject(arenaInfo) && arenaInfo['state'] !== 'Ready')) {
                return false;
            }
            /*jslint sub: false */

            popCheck = gifting.popCheck();
            if (typeof popCheck === 'boolean') {
                return popCheck;
            }

            // Go to gifts page if gift list is empty
            if (gifting.gifts.length() <= 2) {
                if (caap.NavigateTo('army,gift', 'tab_gifts_on.gif')) {
                    return true;
                }
            }

            collecting = gifting.collecting();
            if (typeof collecting === 'boolean') {
                return collecting;
            }

            if (config.getItem("CollectOnly", false)) {
                return false;
            }

            if (!schedule.check("NoGiftDelay")) {
                return false;
            }

            if (!schedule.check("MaxGiftsExceeded")) {
                if (caap.GiftExceedLog) {
                    $u.log(1, 'Gifting limit exceeded, will try later');
                    caap.GiftExceedLog = false;
                }

                return false;
            }

            giftChoice = gifting.queue.chooseGift();
            if (gifting.queue.length() && giftChoice) {
                //if (caap.NavigateTo('army,gift,gift_invite_castle_off.gif', 'gift_invite_castle_on.gif')) {
                if (caap.NavigateTo('army,gift', 'tab_gifts_on.gif')) {
                    return true;
                }

                giftImg = gifting.gifts.getImg(giftChoice);
                if (giftImg) {
                    caap.NavigateTo('gift_more_gifts.gif');
                    tempDiv = $j("#app46755028429_giftContainer img[class='imgButton']").eq(0);
                    if (tempDiv && tempDiv.length) {
                        tempText = tempDiv.attr("src").filepart();
                        if (tempText !== giftImg) {
                            $u.log(3, "images", tempText, giftImg);
                            return caap.NavigateTo(giftImg);
                        }

                        $u.log(1, "Gift selected", giftChoice);
                    }
                } else {
                    $u.log(1, "Unknown gift, using first", giftChoice);
                }

                if (gifting.queue.chooseFriend(gm.getItem("NumberOfGifts", 5, hiddenVar))) {
                    tempDiv = $j("form[id*='req_form_'] input[name='send']");
                    if (tempDiv && tempDiv.length) {
                        caap.Click(tempDiv.get(0));
                        return true;
                    } else {
                        $u.warn("Send button not found!");
                        return false;
                    }
                } else {
                    $u.log(1, "No friends chosen");
                    return false;
                }
            }

            if ($j.isEmptyObject(gifting.getCurrent())) {
                return false;
            }

            return true;
        } catch (err) {
            $u.error("ERROR in AutoGift: " + err);
            return false;
        }
    },

    /////////////////////////////////////////////////////////////////////
    //                              IMMEDIATEAUTOSTAT
    /////////////////////////////////////////////////////////////////////

    ImmediateAutoStat: function () {
        if (!config.getItem("StatImmed", false) || !config.getItem('AutoStat', false)) {
            return false;
        }

        return caap.AutoStat();
    },

    ////////////////////////////////////////////////////////////////////
    //                      Auto Stat
    ////////////////////////////////////////////////////////////////////

    /* This section is formatted to allow Advanced Optimisation by the Closure Compiler */
    /*jslint sub: true */
    IncreaseStat: function (attribute, attrAdjust, atributeSlice) {
        try {
            attribute = attribute.toLowerCase();
            var button        = $j(),
                ajaxLoadIcon  = $j(),
                level         = 0,
                attrCurrent   = 0,
                energy        = 0,
                stamina       = 0,
                attack        = 0,
                defense       = 0,
                health        = 0,
                attrAdjustNew = 0,
                energyDiv     = $j(),
                staminaDiv    = $j(),
                attackDiv     = $j(),
                defenseDiv    = $j(),
                healthDiv     = $j(),
                logTxt        = "";

            ajaxLoadIcon = $j('#app46755028429_AjaxLoadIcon');
            if (!ajaxLoadIcon.length || ajaxLoadIcon.css("display") !== 'none') {
                $u.warn("Unable to find AjaxLoadIcon or page not loaded: Fail");
                return "Fail";
            }

            energyDiv = atributeSlice.find("a[href*='energy_max']");
            staminaDiv = atributeSlice.find("a[href*='stamina_max']");
            attackDiv = atributeSlice.find("a[href*='attack']");
            defenseDiv = atributeSlice.find("a[href*='defense']");
            healthDiv = atributeSlice.find("a[href*='health_max']");
            switch (attribute) {
            case "energy" :
                button = energyDiv;
                break;
            case "stamina" :
                button = staminaDiv;
                break;
            case "attack" :
                button = attackDiv;
                break;
            case "defense" :
                button = defenseDiv;
                break;
            case "health" :
                button = healthDiv;
                break;
            default :
                throw "Unable to match attribute: " + attribute;
            }

            if (!button) {
                $u.warn("Unable to locate upgrade button: Fail ", attribute);
                return "Fail";
            }

            attrAdjustNew = attrAdjust;
            logTxt = attrAdjust;
            level = caap.stats['level'];
            function getValue(div) {
                return div.parent().parent().find("div[class='attribute_stat_container']").text().regex(/(\d+)/);
            }

            attrCurrent = getValue(button);
            energy = getValue(energyDiv);
            stamina = getValue(staminaDiv);
            if (level >= 10) {
                attack = getValue(attackDiv);
                defense = getValue(defenseDiv);
                health = getValue(healthDiv);
            }

            if (config.getItem('AutoStatAdv', false)) {
                //Using eval, so user can define formulas on menu, like energy = level + 50
                /*jslint evil: true */
                attrAdjustNew = eval(attrAdjust);
                /*jslint evil: false */
                logTxt = "(" + attrAdjust + ")=" + attrAdjustNew;
            }

            if ((attribute === 'stamina') && (caap.stats['points']['skill'] < 2)) {
                if (attrAdjustNew <= attrCurrent) {
					$u.log(2, "Stamina at requirement: Next");
					return "Next";
                } else if (config.getItem("StatSpendAll", false)) {
                    $u.log(2, "Stamina requires 2 upgrade points: Next");
                    return "Next";
                } else {
                    $u.log(2, "Stamina requires 2 upgrade points: Save");
                    state.setItem("statsMatch", false);
                    return "Save";
                }
            }

            if (attrAdjustNew > attrCurrent) {
                $u.log(2, "Status Before [" + attribute + "=" + attrCurrent + "]  Adjusting To [" + logTxt + "]");
                caap.Click(button.get(0));
                return "Click";
            }

            return "Next";
        } catch (err) {
            $u.error("ERROR in IncreaseStat: " + err);
            return "Error";
        }
    },

    AutoStatCheck: function () {
        try {
            var startAtt   = 0,
                stopAtt    = 4,
                attribute  = '',
                attrValue  = 0,
                n          = 0,
                level      = 0,
                energy     = 0,
                stamina    = 0,
                attack     = 0,
                defense    = 0,
                health     = 0,
                attrAdjust = 0,
                value      = 0,
                passed     = false;

            if (!config.getItem('AutoStat', false) || !caap.stats['points']['skill']) {
                return false;
            }

            if (config.getItem("AutoStatAdv", false)) {
                startAtt = 5;
                stopAtt = 9;
            }

            for (n = startAtt; n <= stopAtt; n += 1) {
                attribute = config.getItem('Attribute' + n, '').toLowerCase();
                if (attribute === '') {
                    continue;
                }

                if (caap.stats['level'] < 10) {
                    if (attribute === 'attack' || attribute === 'defense' || attribute === 'health') {
                        continue;
                    }
                }

                attrValue = config.getItem('AttrValue' + n, 0);
                attrAdjust = attrValue;
                level = caap.stats['level'];
                energy = caap.stats['energy']['num'];
                stamina = caap.stats['stamina']['num'];
                if (level >= 10) {
                    attack = caap.stats['attack'];
                    defense = caap.stats['defense'];
                    health = caap.stats['health']['num'];
                }

                if (config.getItem('AutoStatAdv', false)) {
                    //Using eval, so user can define formulas on menu, like energy = level + 50
                    /*jslint evil: true */
                    attrAdjust = eval(attrValue);
                    /*jslint evil: false */
                }

                if (attribute === "attack" || attribute === "defense") {
                    value = caap.stats[attribute];
                } else {
                    value = caap.stats[attribute]['num'];
                }

                if (attribute === 'stamina' && caap.stats['points']['skill'] < 2) {
                    if (config.getItem("StatSpendAll", false) && attrAdjust > value) {
                        continue;
                    } else {
                        passed = false;
                        break;
                    }
                }

                if (attrAdjust > value) {
                    passed = true;
                    break;
                }
            }

            state.setItem("statsMatch", passed);
            return true;
        } catch (err) {
            $u.error("ERROR in AutoStatCheck: " + err);
            return false;
        }
    },

    AutoStat: function () {
        try {
            if (!config.getItem('AutoStat', false) || !caap.stats['points']['skill']) {
                return false;
            }

            if (!state.getItem("statsMatch", true)) {
                if (state.getItem("autoStatRuleLog", true)) {
                    $u.log(2, "User should possibly change their stats rules");
                    state.setItem("autoStatRuleLog", false);
                }

                return false;
            }

            var atributeSlice      = null,
                startAtt           = 0,
                stopAtt            = 4,
                attrName           = '',
                attribute          = '',
                attrValue          = 0,
                n                  = 0,
                returnIncreaseStat = '';

            atributeSlice = $j("div[class*='keep_attribute_section']");
            if (!atributeSlice || !atributeSlice.length) {
                caap.NavigateTo('keep');
                return true;
            }

            if (config.getItem("AutoStatAdv", false)) {
                startAtt = 5;
                stopAtt = 9;
            }

            for (n = startAtt; n <= stopAtt; n += 1) {
                attrName = 'Attribute' + n;
                attribute = config.getItem(attrName, '');
                if (attribute === '') {
                    $u.log(3, attrName + " is blank: continue");
                    continue;
                }

                if (caap.stats['level'] < 10) {
                    if (attribute === 'Attack' || attribute === 'Defense' || attribute === 'Health') {
                        $u.log(1, "Characters below level 10 can not increase Attack, Defense or Health: continue");
                        continue;
                    }
                }

                attrValue = config.getItem('AttrValue' + n, 0);
                returnIncreaseStat = caap.IncreaseStat(attribute, attrValue, atributeSlice);
                switch (returnIncreaseStat) {
                case "Next" :
                    $u.log(3, attrName + " : next");
                    continue;
                case "Click" :
                    $u.log(3, attrName + " : click");
                    return true;
                default :
                    $u.log(3, attrName + " return value: " + returnIncreaseStat);
                    return false;
                }
            }

            $u.log(1, "No rules match to increase stats");
            state.setItem("statsMatch", false);
            return false;
        } catch (err) {
            $u.error("ERROR in AutoStat: " + err);
            return false;
        }
    },
    /*jslint sub: false */

    /////////////////////////////////////////////////////////////////////
    //                              CTA
    /////////////////////////////////////////////////////////////////////

    waitAjaxCTA: false,

    ajaxCTA: function (theUrl, theCount) {
        try {
            $j.ajax({
                url: theUrl,
                dataType: "html",
                error:
                    function (XMLHttpRequest, textStatus, errorThrown) {
                        $u.warn("error ajaxCTA: ", theUrl, textStatus, errorThrown);
                        var ajaxCTABackOff = state.getItem('ajaxCTABackOff' + theCount, 0) + 1;
                        schedule.setItem('ajaxCTATimer' + theCount, Math.min(Math.pow(2, ajaxCTABackOff - 1) * 3600, 86400), 900);
                        state.setItem('ajaxCTABackOff' + theCount, ajaxCTABackOff);
                        caap.waitAjaxCTA = false;
                    },
                dataFilter:
                    function (data, type) {
                        var fbcRegExp = new RegExp("\"app46755028429_guild_bg_top\" fbcontext=\"(.+)\""),
                            fbcontext = '',
                            tempArr   = [],
                            newData   = '';

                        tempArr = data.match(fbcRegExp);
                        $u.log(3, "ajaxCTA fbcontext", tempArr);
                        if (tempArr && tempArr.length !== 2) {
                            $u.warn("ajaxCTA unable to find fbcontext");
                            return data;
                        }

                        fbcontext = tempArr[1];
                        $u.log(3, "ajaxCTA fbcontext", fbcontext, tempArr);
                        tempArr = data.split('<div style="padding: 10px 30px;">');
                        if (tempArr && tempArr.length !== 2) {
                            $u.warn("ajaxCTA unable to do first split");
                            return data;
                        }

                        newData = tempArr[1];
                        tempArr = newData.split('<div id="app46755028429_guild_bg_bottom" fbcontext="' + fbcontext + '">');
                        if (tempArr && tempArr.length !== 2) {
                            $u.warn("ajaxCTA unable to do second split");
                            return data;
                        }

                        newData = tempArr[0];
                        $u.log(3, "ajaxCTA dataFilter", [newData, type]);
                        return newData;
                    },
                success:
                    function (data, textStatus, XMLHttpRequest) {
                        var tempText = $j('<div></div>').html(data).find("#app46755028429_guild_battle_banner_section").text();
                        if (tempText && tempText.match(/You do not have an on going guild monster battle/i)) {
                            schedule.setItem('ajaxCTATimer' + theCount, 86400, 900);
                            $u.log(3, "ajaxCTA not done", theUrl);
                        } else {
                            schedule.setItem('ajaxCTATimer' + theCount, 3600, 900);
                            $u.log(3, "ajaxCTA done", theUrl);
                        }

                        state.setItem('ajaxCTABackOff' + theCount, 0);
                        caap.waitAjaxCTA = false;
                    }
            });

            return true;
        } catch (err) {
            $u.error("ERROR in ajaxCTA: " + err);
            return false;
        }
    },

    /* This section is formatted to allow Advanced Optimisation by the Closure Compiler */
    /*jslint sub: true */
    doCTAs: function (urls) {
        try {
            urls = [
                "7NT8TFZWVlaxlL0pPD56U52g3UgPX9zN1UbkPQ0oTwv3BwtolRUqB6BfqQeaOVjynGKUpdjWYZ+r4eNwM0AeMj0kRLCCwISHcG1gzTBQebP48ZMenZ5bjo6i6MfksXmxea5MjQotR0h/lmeR7q79dEuvRqiam1yyS69W5WN1kQJouU8=",
                "AtX8TOrq6uq4AL3jqwwa55YYFfPZCDZ2h3SOotp+GcLqgyMWcn6liJuUIln27/dx5F7ZwMbAddDhhouTQQIJnpLNm+skAyKUzw7m5iPGyKdsx4Z/tSTWM0u8WvKDdQH7URjuTTQjipQ6iKEvpImx/nWmByRGCeGe/FGCAGR3UwN9Fww=",
                "GNX8TFJSUlI0FKy9rtqANgSt784rIacRvkBTTIAJXt6vaoyZ7exU3G8oBl00pY6cbFLKMbjTCM7NGANTZj0kmCIUzXUGXGo4atLKafgPw37R06RtxxKnzmwDbIHuB4hT9ZvxVuEBzsOklQfXzpLNDLhqsYaLm4FdCg7EyA+fbE6hkzs=",
                "LtX8TCIiIiJvZRsmu8UE/4M3Vki3AmsZ7maWaBx1yt6cQ8o3IeIbuTYmd5rwabuEISyFDZKaLLzG39m3UOGjVluSzWZkdhP6AXPe2akPBDgNM6/A8DJ7s66us+9216FCCNFMv5gmNxD8MRv1SQifcVOuQpIzHmbzyUIRaquumD4uMDk=",
                "QNX8TFJSUlIOxfBqJJME6gqstkzl+WcNgyc/266fZMgWSPobhyfU3/JBswxOl5XpIdTWIS8QvrZRFaWU54qsJIllhslLkn96vG4wwtIwwIbomH9Ajn9nPg9JeO86b2HqYD5TtrujcdpLPFHU/Hm9SYrIQg8sBdVR/cENyxiqNNeRGCI="
            ];

            if (gm.getItem("ajaxCTA", false, hiddenVar) || caap.waitAjaxCTA || caap.stats['stamina']['num'] < 1 || !schedule.check('ajaxCTATimer')) {
                return false;
            }

            var count = state.getItem('ajaxCTACount', 0),
                aes = new $u.Aes(gm.get_namespace());

            $u.log(3, "doCTAs", count, urls.length);
            if (count < urls.length) {
                $u.log(3, 'ajaxCTATimer' + count, schedule.getItem('ajaxCTATimer' + count));
                if (schedule.check('ajaxCTATimer' + count)) {
                    caap.waitAjaxCTA = true;
                    caap.ajaxCTA(aes.decrypt(urls[count]), count);
                }

                state.setItem('ajaxCTACount', count + 1);
            } else {
                state.setItem('ajaxCTACount', 0);
                schedule.setItem('ajaxCTATimer', 1800, 300);
            }

            return true;
        } catch (err) {
            $u.error("ERROR in doCTAs: " + err);
            return false;
        }
    },
    /*jslint sub: false */

    /////////////////////////////////////////////////////////////////////
    //                              FRIEND LISTS
    /////////////////////////////////////////////////////////////////////

    friendListType: {
        facebook: {
            name: "facebook",
            url: 'http://apps.facebook.com/castle_age/army.php?app_friends=false&giftSelection=1'
        },
        gifta: {
            name: "gifta",
            url: 'http://apps.facebook.com/castle_age/gift.php?app_friends=a&giftSelection=1'
        },
        giftb: {
            name: "giftb",
            url: 'http://apps.facebook.com/castle_age/gift.php?app_friends=b&giftSelection=1'
        },
        giftc: {
            name: "giftc",
            url: 'http://apps.facebook.com/castle_age/gift.php?app_friends=c&giftSelection=1'
        }
    },

    GetFriendList: function (listType, force) {
        try {
            $u.log(3, "Entered GetFriendList and request is for: ", listType.name);
            if (force) {
                state.setItem(listType.name + 'Requested', false);
                state.setItem(listType.name + 'Responded', []);
            }

            if (!state.getItem(listType.name + 'Requested', false)) {
                $u.log(3, "Getting Friend List: ", listType.name);
                state.setItem(listType.name + 'Requested', true);

                $j.ajax({
                    url: listType.url,
                    error:
                        function (XMLHttpRequest, textStatus, errorThrown) {
                            state.setItem(listType.name + 'Requested', false);
                            $u.log(3, "GetFriendList(" + listType.name + "): ", textStatus);
                        },
                    success:
                        function (data, textStatus, XMLHttpRequest) {
                            try {
                                $u.log(3, "GetFriendList.ajax splitting data");
                                data = data.split('<div class="unselected_list">');
                                if (data.length < 2) {
                                    throw "Could not locate 'unselected_list'";
                                }

                                data = data[1].split('</div><div class="selected_list">');
                                if (data.length < 2) {
                                    throw "Could not locate 'selected_list'";
                                }

                                $u.log(3, "GetFriendList.ajax data split ok");
                                var friendList = [];
                                $j('<div></div>').html(data[0]).find('input').each(function (index) {
                                    friendList.push($j(this).val().parseInt());
                                });

                                $u.log(3, "GetFriendList.ajax saving friend list of: ", friendList.length);
                                if (friendList.length) {
                                    state.setItem(listType.name + 'Responded', friendList);
                                } else {
                                    state.setItem(listType.name + 'Responded', true);
                                }

                                $u.log(3, "GetFriendList(" + listType.name + "): ", textStatus);
                            } catch (err) {
                                state.setItem(listType.name + 'Requested', false);
                                $u.error("ERROR in GetFriendList.ajax: " + err);
                            }
                        }
                });
            } else {
                $u.log(3, "Already requested GetFriendList for: ", listType.name);
            }

            return true;
        } catch (err) {
            $u.error("ERROR in GetFriendList(" + listType.name + "): " + err);
            return false;
        }
    },

    /////////////////////////////////////////////////////////////////////
    //                              FILL ARMY
    /////////////////////////////////////////////////////////////////////

    addFriendSpamCheck: 0,

    AutoFillArmy: function (caListType, fbListType) {
        try {
            if (!state.getItem('FillArmy', false)) {
                return false;
            }

            function AddFriend(id) {
                try {
                    var responseCallback = function (XMLHttpRequest, textStatus, errorThrown) {
                        if (caap.addFriendSpamCheck > 0) {
                            caap.addFriendSpamCheck -= 1;
                        }

                        $u.log(1, "AddFriend(" + id + "): ", textStatus);
                    };

                    $j.ajax({
                        url: 'http://apps.facebook.com/castle_age/party.php?twt=jneg&jneg=true&user=' + id + '&lka=' + id + '&etw=9&ref=nf',
                        error: responseCallback,
                        success: responseCallback
                    });

                    return true;
                } catch (err) {
                    $u.error("ERROR in AddFriend(" + id + "): " + err);
                    return false;
                }
            }

            var armyCount = state.getItem("ArmyCount", 0);
            if (armyCount === 0) {
                caap.SetDivContent('idle_mess', 'Filling Army');
                $u.log(1, "Filling army");
            }

            if (state.getItem(caListType.name + 'Responded', false) === true || state.getItem(fbListType.name + 'Responded', false) === true) {
                caap.SetDivContent('idle_mess', '<span style="font-weight: bold;">Fill Army Completed</span>');
                $u.log(1, "Fill Army Completed: no friends found");
                window.setTimeout(function () {
                    caap.SetDivContent('idle_mess', '');
                }, 5000);

                state.setItem('FillArmy', false);
                state.setItem("ArmyCount", 0);
                state.setItem('FillArmyList', []);
                state.setItem(caListType.name + 'Responded', false);
                state.setItem(fbListType.name + 'Responded', false);
                state.setItem(caListType.name + 'Requested', []);
                state.setItem(fbListType.name + 'Requested', []);
                return true;
            }

            var fillArmyList = state.getItem('FillArmyList', []);
            if (!fillArmyList.length) {
                caap.GetFriendList(caListType);
                caap.GetFriendList(fbListType);
            }

            var castleageList = state.getItem(caListType.name + 'Responded', []);
            $u.log(3, "gifList: ", castleageList);
            var facebookList = state.getItem(fbListType.name + 'Responded', []);
            $u.log(3, "facebookList: ", facebookList);
            if ((castleageList.length && facebookList.length) || fillArmyList.length) {
                if (!fillArmyList.length) {
                    var diffList = facebookList.filter(function (facebookID) {
                        return (castleageList.indexOf(facebookID) >= 0);
                    });

                    $u.log(3, "diffList: ", diffList);
                    fillArmyList = state.setItem('FillArmyList', diffList);
                    state.setItem(caListType.name + 'Responded', false);
                    state.setItem(fbListType.name + 'Responded', false);
                    state.setItem(caListType.name + 'Requested', []);
                    state.setItem(fbListType.name + 'Requested', []);
                }

                // Add army members //
                var batchCount = 5;
                if (fillArmyList.length < 5) {
                    batchCount = fillArmyList.length;
                } else if (fillArmyList.length - armyCount < 5) {
                    batchCount = fillArmyList.length - armyCount;
                }

                batchCount = batchCount - caap.addFriendSpamCheck;
                for (var i = 0; i < batchCount; i += 1) {
                    AddFriend(fillArmyList[armyCount]);
                    armyCount += 1;
                    caap.addFriendSpamCheck += 1;
                }

                caap.SetDivContent('idle_mess', 'Filling Army, Please wait...' + armyCount + "/" + fillArmyList.length);
                $u.log(1, 'Filling Army, Please wait...' + armyCount + "/" + fillArmyList.length);
                state.setItem("ArmyCount", armyCount);
                if (armyCount >= fillArmyList.length) {
                    caap.SetDivContent('idle_mess', '<span style="font-weight: bold;">Fill Army Completed</span>');
                    window.setTimeout(function () {
                        caap.SetDivContent('idle_mess', '');
                    }, 5000);

                    $u.log(1, "Fill Army Completed");
                    state.setItem('FillArmy', false);
                    state.setItem("ArmyCount", 0);
                    state.setItem('FillArmyList', []);
                }
            }

            return true;
        } catch (err) {
            $u.error("ERROR in AutoFillArmy: " + err);
            caap.SetDivContent('idle_mess', '<span style="font-weight: bold;">Fill Army Failed</span>');
            window.setTimeout(function () {
                caap.SetDivContent('idle_mess', '');
            }, 5000);

            state.setItem('FillArmy', false);
            state.setItem("ArmyCount", 0);
            state.setItem('FillArmyList', []);
            state.setItem(caListType.name + 'Responded', false);
            state.setItem(fbListType.name + 'Responded', false);
            state.setItem(caListType.name + 'Requested', []);
            state.setItem(fbListType.name + 'Requested', []);
            return false;
        }
    },

    /////////////////////////////////////////////////////////////////////
    //                              IDLE
    /////////////////////////////////////////////////////////////////////

    Idle: function () {
        if (state.getItem('resetselectMonster', false)) {
            $u.log(3, "resetselectMonster");
            monster.select(true);
            state.setItem('resetselectMonster', false);
        }

        if (caap.CheckGenerals()) {
            return true;
        }

        if (general.GetAllStats()) {
            return true;
        }

        if (caap.CheckKeep()) {
            return true;
        }

        if (caap.CheckAchievements()) {
            return true;
        }

        if (caap.AjaxGiftCheck()) {
            return true;
        }

        if (caap.ReconPlayers()) {
            return true;
        }

        if (caap.CheckOracle()) {
            return true;
        }

        if (caap.CheckBattleRank()) {
            return true;
        }

        if (caap.CheckWarRank()) {
            return true;
        }

        if (caap.CheckSymbolQuests()) {
            return true;
        }

        if (caap.CheckSoldiers()) {
            return true;
        }

        if (caap.CheckItem()) {
            return true;
        }

        if (caap.CheckMagic()) {
            return true;
        }

        if (caap.CheckCharacterClasses()) {
            return true;
        }

        /*
        if (army.run()) {
            return true;
        }
        */

        if (caap.doCTAs()) {
            return true;
        }

        caap.AutoFillArmy(caap.friendListType.giftc, caap.friendListType.facebook);
        caap.UpdateDashboard();
        state.setItem('ReleaseControl', true);
        return true;
    },

    /////////////////////////////////////////////////////////////////////
    //                              PLAYER RECON
    /////////////////////////////////////////////////////////////////////

    /*-------------------------------------------------------------------------------------\
                                      RECON PLAYERS
    ReconPlayers is an idle background process that scans the battle page for viable
    targets that can later be attacked.
    \-------------------------------------------------------------------------------------*/

    ReconRecordArray : [],

    /* This section is formatted to allow Advanced Optimisation by the Closure Compiler */
    /*jslint sub: true */
    ReconRecord: function () {
        this.data = {
            'userID'          : 0,
            'nameStr'         : '',
            'rankStr'         : '',
            'rankNum'         : 0,
            'warRankStr'      : '',
            'warRankNum'      : 0,
            'levelNum'        : 0,
            'armyNum'         : 0,
            'deityNum'        : 0,
            'invadewinsNum'   : 0,
            'invadelossesNum' : 0,
            'duelwinsNum'     : 0,
            'duellossesNum'   : 0,
            'defendwinsNum'   : 0,
            'defendlossesNum' : 0,
            'statswinsNum'    : 0,
            'statslossesNum'  : 0,
            'goldNum'         : 0,
            'aliveTime'       : 0,
            'attackTime'      : 0,
            'selectTime'      : 0
        };
    },
    /*jslint sub: false */

    reconhbest: false,

    LoadRecon: function () {
        caap.ReconRecordArray = gm.getItem('recon.records', 'default');
        if (caap.ReconRecordArray === 'default' || !$j.isArray(caap.ReconRecordArray)) {
            caap.ReconRecordArray = gm.setItem('recon.records', []);
        }

        caap.reconhbest = JSON.hbest(caap.ReconRecordArray);
        $u.log(2, "recon.records Hbest", caap.reconhbest);
        state.setItem("ReconDashUpdate", true);
        $u.log(4, "recon.records", caap.ReconRecordArray);
    },

    SaveRecon: function () {
        var compress = false;
        gm.setItem('recon.records', caap.ReconRecordArray, caap.reconhbest, compress);
        state.setItem("ReconDashUpdate", true);
        $u.log(4, "recon.records", caap.ReconRecordArray);
    },

    /* This section is formatted to allow Advanced Optimisation by the Closure Compiler */
    /*jslint sub: true */
    ReconPlayers: function () {
        try {
            if (!config.getItem('DoPlayerRecon', false)) {
                return false;
            }

            if (caap.stats['stamina']['num'] <= 0) {
                return false;
            }

            if (!schedule.check('PlayerReconTimer')) {
                return false;
            }

            caap.SetDivContent('idle_mess', 'Player Recon: In Progress');
            $u.log(1, "Player Recon: In Progress");

            $j.ajax({
                url: "http://apps.facebook.com/castle_age/battle.php",
                error:
                    function (XMLHttpRequest, textStatus, errorThrown) {
                        $u.error("ReconPlayers2.ajax", textStatus);
                    },
                success:
                    function (data, textStatus, XMLHttpRequest) {
                        try {
                            var found       = 0,
                                regex       = new RegExp('(.+)\\s*\\(Level (\\d+)\\)\\s*Battle: ([A-Za-z ]+) \\(Rank (\\d+)\\)\\s*War: ([A-Za-z ]+) \\(Rank (\\d+)\\)\\s*(\\d+)', 'i'),
                                regex2      = new RegExp('(.+)\\s*\\(Level (\\d+)\\)\\s*Battle: ([A-Za-z ]+) \\(Rank (\\d+)\\)\\s*(\\d+)', 'i'),
                                entryLimit  = config.getItem('LimitTargets', 100),
                                reconRank   = config.getItem('ReconPlayerRank', 99),
                                reconLevel  = config.getItem('ReconPlayerLevel', 999),
                                reconARBase = config.getItem('ReconPlayerARBase', 999);

                            $u.log(3, "ReconPlayers.ajax: Checking data.");

                            $j(data).find("img[src*='symbol_']").not("[src*='symbol_tiny_']").each(function (index) {
                                var UserRecord      = new caap.ReconRecord(),
                                    row             = $j(this),
                                    $tempObj        = row.parent().parent().parent().parent().parent(),
                                    tempArray       = [],
                                    txt             = '',
                                    i               = 0,
                                    OldRecord       = {},
                                    levelMultiplier = 0,
                                    armyRatio       = 0,
                                    goodTarget      = true,
                                    len             = 0,
                                    tStr            = '';

                                if ($tempObj.length) {
                                    tStr = $tempObj.find("a").eq(0).attr("href");
                                    tempArray = tStr ? tStr.matchUser() : [];
                                    if (tempArray && tempArray.length === 2) {
                                        UserRecord.data['userID'] = tempArray[1].parseInt();
                                    }

                                    for (i = 0, len = caap.ReconRecordArray.length; i < len; i += 1) {
                                        if (caap.ReconRecordArray[i]['userID'] === UserRecord.data['userID']) {
                                            UserRecord.data = caap.ReconRecordArray[i];
                                            caap.ReconRecordArray.splice(i, 1);
                                            $u.log(3, "UserRecord exists. Loaded and removed.", UserRecord);
                                            break;
                                        }
                                    }

                                    tempArray = row.attr("src").match(/symbol_(\d)\.jpg/);
                                    if (tempArray && tempArray.length === 2) {
                                        UserRecord.data['deityNum'] = tempArray[1] ? tempArray[1].parseInt() : 0;
                                    }

                                    txt = $tempObj.text();
                                    txt = txt ? txt.trim() : '';
                                    if (txt.length) {
                                        if (battle.battles['Freshmeat']['warLevel']) {
                                            tempArray = regex.exec(txt);
                                            if (!tempArray) {
                                                tempArray = regex2.exec(txt);
                                                battle.battles['Freshmeat']['warLevel'] = false;
                                            }
                                        } else {
                                            tempArray = regex2.exec(txt);
                                            if (!tempArray) {
                                                tempArray = regex.exec(txt);
                                                battle.battles['Freshmeat']['warLevel'] = true;
                                            }
                                        }

                                        if (tempArray) {
                                            UserRecord.data['aliveTime']      = new Date().getTime();
                                            UserRecord.data['nameStr']        = tempArray[1] ? tempArray[1].trim() : '';
                                            UserRecord.data['levelNum']       = tempArray[2] ? tempArray[2].parseInt() : 0;
                                            UserRecord.data['rankStr']        = tempArray[3] ? tempArray[3].trim() : '';
                                            UserRecord.data['rankNum']        = tempArray[4] ? tempArray[4].parseInt() : 0;
                                            if (battle.battles['Freshmeat']['warLevel']) {
                                                UserRecord.data['warRankStr'] = tempArray[5] ? tempArray[5].trim() : '';
                                                UserRecord.data['warRankNum'] = tempArray[6] ? tempArray[6].parseInt() : 0;
                                                UserRecord.data['armyNum']    = tempArray[7] ? tempArray[7].parseInt() : 0;
                                            } else {
                                                UserRecord.data['armyNum']    = tempArray[5] ? tempArray[5].parseInt() : 0;
                                            }

                                            if (UserRecord.data['levelNum'] - caap.stats['level'] > reconLevel) {
                                                $u.log(3, 'Level above reconLevel max', reconLevel, UserRecord);
                                                goodTarget = false;
                                            } else if (caap.stats['rank']['battle'] - UserRecord.data['rankNum'] > reconRank) {
                                                $u.log(3, 'Rank below reconRank min', reconRank, UserRecord);
                                                goodTarget = false;
                                            } else {
                                                levelMultiplier = caap.stats['level'] / UserRecord.data['levelNum'];
                                                armyRatio = reconARBase * levelMultiplier;
                                                if (armyRatio <= 0) {
                                                    $u.log(3, 'Recon unable to calculate army ratio', reconARBase, levelMultiplier);
                                                    goodTarget = false;
                                                } else if (UserRecord.data['armyNum']  > (caap.stats['army']['capped'] * armyRatio)) {
                                                    $u.log(3, 'Army above armyRatio adjustment', armyRatio, UserRecord);
                                                    goodTarget = false;
                                                }
                                            }

                                            if (goodTarget) {
                                                while (caap.ReconRecordArray.length >= entryLimit) {
                                                    OldRecord = caap.ReconRecordArray.shift();
                                                    $u.log(3, "Entry limit matched. Deleted an old record", OldRecord);
                                                }

                                                $u.log(3, "UserRecord", UserRecord);
                                                caap.ReconRecordArray.push(UserRecord.data);
                                                found += 1;
                                            }
                                        } else {
                                            $u.warn('Recon can not parse target text string', txt);
                                        }
                                    } else {
                                        $u.warn("Can't find txt in $tempObj", $tempObj);
                                    }
                                } else {
                                    $u.warn("$tempObj is empty");
                                }
                            });

                            caap.SaveRecon();
                            caap.SetDivContent('idle_mess', 'Player Recon: Found:' + found + ' Total:' + caap.ReconRecordArray.length);
                            $u.log(1, 'Player Recon: Found:' + found + ' Total:' + caap.ReconRecordArray.length);
                            window.setTimeout(function () {
                                caap.SetDivContent('idle_mess', '');
                            }, 5 * 1000);

                            $u.log(3, "ReconPlayers.ajax: Done.", caap.ReconRecordArray);
                        } catch (err) {
                            $u.error("ERROR in ReconPlayers.ajax: " + err);
                        }
                    }
            });

            schedule.setItem('PlayerReconTimer', gm.getItem('PlayerReconRetry', 60, hiddenVar), 60);
            return true;
        } catch (err) {
            $u.error("ERROR in ReconPlayers:" + err);
            return false;
        }
    },

    /////////////////////////////////////////////////////////////////////
    //                          MAIN LOOP
    // This function repeats continously.  In principle, functions should only make one
    // click before returning back here.
    /////////////////////////////////////////////////////////////////////

    actionDescTable: {
        'AutoIncome'         : 'Awaiting Income',
        'AutoStat'           : 'Upgrade Skill Points',
        'MaxEnergyQuest'     : 'At Max Energy Quest',
        'PassiveGeneral'     : 'Setting Idle General',
        'Idle'               : 'Idle Tasks',
        'ImmediateBanking'   : 'Immediate Banking',
        'Battle'             : 'Battling Players',
        'MonsterReview'      : 'Review Monsters/Raids',
        'GuildMonsterReview' : 'Review Guild Monsters',
        'ImmediateAutoStat'  : 'Immediate Auto Stats',
        'AutoElite'          : 'Fill Elite Guard',
        'AutoPotions'        : 'Auto Potions',
        'AutoAlchemy'        : 'Auto Alchemy',
        'AutoBless'          : 'Auto Bless',
        'AutoGift'           : 'Auto Gifting',
        'DemiPoints'         : 'Demi Points First',
        'Monsters'           : 'Fighting Monsters',
        'GuildMonster'       : 'Fight Guild Monster',
        'Heal'               : 'Auto Healing',
        'Bank'               : 'Auto Banking',
        'Lands'              : 'Land Operations'
    },
    /*jslint sub: false */

    CheckLastAction: function (thisAction) {
        var lastAction = state.getItem('LastAction', 'Idle');
        if (caap.actionDescTable[thisAction]) {
            caap.SetDivContent('activity_mess', 'Activity: ' + caap.actionDescTable[thisAction]);
        } else {
            caap.SetDivContent('activity_mess', 'Activity: ' + thisAction);
        }

        if (lastAction !== thisAction) {
            $u.log(1, 'Changed from doing ' + lastAction + ' to ' + thisAction);
            state.setItem('LastAction', thisAction);
        }
    },

    /*
    // The Master Action List
    masterActionList: {
        0x00: 'AutoElite',
        0x01: 'Heal',
        0x02: 'ImmediateBanking',
        0x03: 'ImmediateAutoStat',
        0x04: 'MaxEnergyQuest',
        0x05: 'GuildMonsterReview',
        0x06: 'MonsterReview',
        0x07: 'GuildMonster',
        0x08: 'DemiPoints',
        0x09: 'Monsters',
        0x0A: 'Battle',
        0x0B: 'Quests',
        0x0C: 'Bank',
        0x0D: 'PassiveGeneral',
        0x0E: 'Lands',
        0x0F: 'AutoBless',
        0x10: 'AutoStat',
        0x11: 'AutoGift',
        0x12: 'AutoPotions',
        0x13: 'AutoAlchemy',
        0x14: 'Idle'
    },
    */

    masterActionList: {
        0x00: 'AutoElite',
        0x01: 'Heal',
        0x02: 'ImmediateBanking',
        0x03: 'ImmediateAutoStat',
        0x04: 'MaxEnergyQuest',
        0x05: 'ArenaReview',
        0x06: 'GuildMonsterReview',
        0x07: 'MonsterReview',
        0x08: 'GuildMonster',
        0x09: 'Arena',
        0x0A: 'DemiPoints',
        0x0B: 'Monsters',
        0x0C: 'Battle',
        0x0D: 'Quests',
        0x0E: 'Bank',
        0x0F: 'PassiveGeneral',
        0x10: 'Lands',
        0x11: 'AutoBless',
        0x12: 'AutoStat',
        0x13: 'AutoGift',
        0x14: 'AutoPotions',
        0x15: 'AutoAlchemy',
        0x16: 'Idle'
    },

    actionsList: [],

    MakeActionsList: function () {
        try {
            if (caap.actionsList && caap.actionsList.length === 0) {
                $u.log(2, "Loading a fresh Action List");
                // actionOrder is a comma seperated string of action numbers as
                // hex pairs and can be referenced in the Master Action List
                // Example: "00,01,02,03,04,05,06,07,08,09,0A,0B,0C,0D,0E,0F,10,11,12"
                var action = '';
                var actionOrderArray = [];
                var masterActionListCount = 0;
                var actionOrderUser = gm.getItem("actionOrder", '', hiddenVar);
                if (actionOrderUser !== '') {
                    // We are using the user defined actionOrder set in the
                    // Advanced Hidden Options
                    $u.log(2, "Trying user defined Action Order");
                    // We take the User Action Order and convert it from a comma
                    // separated list into an array
                    actionOrderArray = actionOrderUser.split(",");
                    // We count the number of actions contained in the
                    // Master Action list
                    for (action in caap.masterActionList) {
                        if (caap.masterActionList.hasOwnProperty(action)) {
                            masterActionListCount += 1;
                            $u.log(5, "Counting Action List", masterActionListCount);
                        } else {
                            $u.warn("Error Getting Master Action List length!");
                            $u.warn("Skipping 'action' from masterActionList: ", action);
                        }
                    }
                } else {
                    // We are building the Action Order Array from the
                    // Master Action List
                    $u.log(2, "Building the default Action Order");
                    for (action in caap.masterActionList) {
                        if (caap.masterActionList.hasOwnProperty(action)) {
                            masterActionListCount = actionOrderArray.push(action);
                            $u.log(5, "Action Added", action);
                        } else {
                            $u.warn("Error Building Default Action Order!");
                            $u.warn("Skipping 'action' from masterActionList: ", action);
                        }
                    }
                }

                // We notify if the number of actions are not sensible or the
                // same as in the Master Action List
                var actionOrderArrayCount = actionOrderArray.length;
                if (actionOrderArrayCount === 0) {
                    var throwError = "Action Order Array is empty! " + (actionOrderUser === "" ? "(Default)" : "(User)");
                    throw throwError;
                }

                if (actionOrderArrayCount < masterActionListCount) {
                    $u.warn("Warning! Action Order Array has fewer orders than default!");
                }

                if (actionOrderArrayCount > masterActionListCount) {
                    $u.warn("Warning! Action Order Array has more orders than default!");
                }

                // We build the Action List
                $u.log(8, "Building Action List ...");
                for (var itemCount = 0; itemCount !== actionOrderArrayCount; itemCount += 1) {
                    var actionItem = '';
                    if (actionOrderUser !== '') {
                        // We are using the user defined comma separated list of hex pairs
                        actionItem = caap.masterActionList[actionOrderArray[itemCount].parseInt(16)];
                        $u.log(3, "(" + itemCount + ") Converted user defined hex pair to action", actionItem);
                    } else {
                        // We are using the Master Action List
                        actionItem = caap.masterActionList[actionOrderArray[itemCount]];
                        $u.log(5, "(" + itemCount + ") Converted Master Action List entry to an action", actionItem);
                    }

                    // Check the Action Item
                    if (actionItem.length > 0 && typeof(actionItem) === "string") {
                        // We add the Action Item to the Action List
                        caap.actionsList.push(actionItem);
                        $u.log(5, "Added action to the list", actionItem);
                    } else {
                        $u.warn("Error! Skipping actionItem");
                        $u.warn("Action Item(" + itemCount + "): ", actionItem);
                    }
                }

                if (actionOrderUser !== '') {
                    $u.log(1, "Get Action List: ", caap.actionsList);
                }
            }
            return true;
        } catch (err) {
            // Something went wrong, log it and use the emergency Action List.
            $u.error("ERROR in MakeActionsList: " + err);
            /*
            caap.actionsList = [
                "AutoElite",
                "Heal",
                "ImmediateBanking",
                "ImmediateAutoStat",
                "MaxEnergyQuest",
                'GuildMonsterReview',
                "MonsterReview",
                'GuildMonster',
                "DemiPoints",
                "Monsters",
                "Battle",
                "Quests",
                "Bank",
                'PassiveGeneral',
                "Lands",
                "AutoBless",
                "AutoStat",
                "AutoGift",
                'AutoPotions',
                "AutoAlchemy",
                "Idle"
            ];
            */
            caap.actionsList = [
                "AutoElite",
                "Heal",
                "ImmediateBanking",
                "ImmediateAutoStat",
                "MaxEnergyQuest",
                'GuildMonsterReview',
                "ArenaReview",
                "MonsterReview",
                'GuildMonster',
                'Arena',
                "DemiPoints",
                "Monsters",
                "Battle",
                "Quests",
                "Bank",
                'PassiveGeneral',
                "Lands",
                "AutoBless",
                "AutoStat",
                "AutoGift",
                'AutoPotions',
                "AutoAlchemy",
                "Idle"
            ];

            return false;
        }
    },

    ErrorCheck: function () {
        // assorted errors...
        if (window.location.href.indexOf('/common/error.html') >= 0 || window.location.href.indexOf('/sorry.php') >= 0) {
            $u.log(1, 'detected error page, waiting to go back to previous page.');
            window.setTimeout(function () {
                window.history.go(-1);
            }, 30 * 1000);

            return true;
        }

        if ($j('#try_again_button').length) {
            $u.log(1, 'detected Try Again message, waiting to reload');
            // error
            window.setTimeout(function () {
                if (typeof window.location.reload === 'function') {
                    window.location.reload();
                } else if (typeof history.go === 'function') {
                    history.go(0);
                } else {
                    window.location.href = window.location.href;
                }
            }, 30 * 1000);

            return true;
        }

        return false;
    },

    MainLoop: function () {
        try {
            var button          = null,
                caapDisabled    = false,
                noWindowLoad    = 0,
                actionsListCopy = [],
                action          = 0,
                len             = 0,
                ajaxLoadIcon    = null;

            // assorted errors...
            if (caap.ErrorCheck()) {
                return true;
            }

            if (window.location.href.indexOf('apps.facebook.com/reqs.php#confirm_46755028429_0') >= 0) {
                gifting.collect();
                caap.WaitMainLoop();
                return true;
            }

            //We don't need to send out any notifications
            button = $j("a[class*='undo_link']");
            if (button && button.length) {
                caap.Click(button.get(0));
                $u.log(1, 'Undoing notification');
            }

            caapDisabled = config.getItem('Disabled', false);
            if (caapDisabled) {
                caap.WaitMainLoop();
                return true;
            }

            if (!caap.pageLoadOK) {
                noWindowLoad = state.getItem('NoWindowLoad', 0);
                if (noWindowLoad === 0) {
                    schedule.setItem('NoWindowLoadTimer', Math.min(Math.pow(2, noWindowLoad - 1) * 15, 3600));
                    state.setItem('NoWindowLoad', 1);
                } else if (schedule.check('NoWindowLoadTimer')) {
                    schedule.setItem('NoWindowLoadTimer', Math.min(Math.pow(2, noWindowLoad - 1) * 15, 3600));
                    state.setItem('NoWindowLoad', noWindowLoad + 1);
                    caap.ReloadCastleAge();
                }

                $u.log(1, 'Page no-load count: ', noWindowLoad);
                caap.pageLoadOK = caap.GetStats();
                caap.WaitMainLoop();
                return true;
            } else {
                state.setItem('NoWindowLoad', 0);
            }

            if (state.getItem('caapPause', 'none') !== 'none') {
                caap.caapDivObject.css({
                    background : config.getItem('StyleBackgroundDark', '#fee'),
                    opacity    : config.getItem('StyleOpacityDark', 1)
                });

                caap.caapTopObject.css({
                    background : config.getItem('StyleBackgroundDark', '#fee'),
                    opacity    : config.getItem('StyleOpacityDark', 1)
                });

                caap.WaitMainLoop();
                return true;
            }

            if (caap.waitingForDomLoad) {
                if (schedule.since('clickedOnSomething', 45)) {
                    $u.log(1, 'Clicked on something, but nothing new loaded.  Reloading page.');
                    caap.ReloadCastleAge();
                }

                ajaxLoadIcon = $j('#app46755028429_AjaxLoadIcon');
                if (ajaxLoadIcon && ajaxLoadIcon.length && ajaxLoadIcon.css("display") !== "none") {
                    $u.log(1, 'Waiting for page load ...');
                    caap.WaitMainLoop();
                    return true;
                }
            }

            if (caap.AutoIncome()) {
                caap.CheckLastAction('AutoIncome');
                caap.WaitMainLoop();
                return true;
            }

            caap.MakeActionsList();
            actionsListCopy = caap.actionsList.slice();
            if (state.getItem('ReleaseControl', false)) {
                state.setItem('ReleaseControl', false);
            } else {
                $u.log(3, "ReleaseControl to unshift LastAction");
                actionsListCopy.unshift(state.getItem('LastAction', 'Idle'));
            }

            for (action = 0, len = actionsListCopy.length; action < len; action += 1) {
                if (caap[actionsListCopy[action]]()) {
                    caap.CheckLastAction(actionsListCopy[action]);
                    break;
                }
            }

            caap.WaitMainLoop();
            return true;
        } catch (err) {
            $u.error("ERROR in MainLoop: " + err);
            return false;
        }
    },

    waitMilliSecs: 5000,

    WaitMainLoop: function () {
        try {
            $u.log(5, 'waitMilliSecs', caap.waitMilliSecs);
            function timeout() {
                caap.waitMilliSecs = 5000;
                if (caap.flagReload) {
                    caap.ReloadCastleAge();
                }

                caap.MainLoop();
            }

            window.setTimeout(timeout, caap.waitMilliSecs * (1 + Math.random() * 0.2));
            return true;
        } catch (err) {
            $u.error("ERROR in WaitMainLoop: " + err);
            return false;
        }
    },

    ReloadCastleAge: function () {
        try {
            // better than reload... no prompt on forms!
            if (!config.getItem('Disabled') && (state.getItem('caapPause') === 'none')) {
                caap.VisitUrl("http://apps.facebook.com/castle_age/index.php?bm=1&ref=bookmarks&count=0");
            }

            return true;
        } catch (err) {
            $u.error("ERROR in ReloadCastleAge: " + err);
            return false;
        }
    },

    ReloadOccasionally: function () {
        try {
            var reloadMin = gm.getItem('ReloadFrequency', 8, hiddenVar);
            if (!reloadMin || reloadMin < 8) {
                reloadMin = 8;
            }

            function timeout() {
                if (schedule.since('clickedOnSomething', 5 * 60) || caap.pageLoadCounter > 40) {
                    $u.log(1, 'Reloading if not paused after inactivity');
                    caap.flagReload = true;
                }

                caap.ReloadOccasionally();
            }

            window.setTimeout(timeout, 60000 * reloadMin + (reloadMin * 60000 * Math.random()));
            return true;
        } catch (err) {
            $u.error("ERROR in ReloadOccasionally: " + err);
            return false;
        }
    }
};

/* This section is added to allow Advanced Optimisation by the Closure Compiler */
/*jslint sub: true */
window['caap'] = caap;
caap['CheckResults_index'] = caap.CheckResults_index;
caap['CheckResults_fightList'] = caap.CheckResults_fightList;
caap['CheckResults_viewFight'] = caap.CheckResults_viewFight;
caap['CheckResults_fightList'] = caap.CheckResults_fightList;
caap['CheckResults_viewFight'] = caap.CheckResults_viewFight;
caap['CheckResults_land'] = caap.CheckResults_land;
caap['CheckResults_generals'] = caap.CheckResults_generals;
caap['CheckResults_quests'] = caap.CheckResults_quests;
caap['CheckResults_gift_accept'] = caap.CheckResults_gift_accept;
caap['CheckResults_army'] = caap.CheckResults_army;
caap['CheckResults_keep'] = caap.CheckResults_keep;
caap['CheckResults_oracle'] = caap.CheckResults_oracle;
caap['CheckResults_alchemy'] = caap.CheckResults_alchemy;
caap['CheckResults_battlerank'] = caap.CheckResults_battlerank;
caap['CheckResults_war_rank'] = caap.CheckResults_war_rank;
caap['CheckResults_achievements'] = caap.CheckResults_achievements;
caap['CheckResults_battle'] = caap.CheckResults_battle;
caap['CheckResults_soldiers'] = caap.CheckResults_soldiers;
caap['CheckResults_item'] = caap.CheckResults_item;
caap['CheckResults_magic'] = caap.CheckResults_magic;
caap['CheckResults_gift'] = caap.CheckResults_gift;
caap['CheckResults_goblin_emp'] = caap.CheckResults_goblin_emp;
caap['CheckResults_view_class_progress'] = caap.CheckResults_view_class_progress;
caap['CheckResults_guild'] = caap.CheckResults_guild;
caap['CheckResults_guild_current_battles'] = caap.CheckResults_guild_current_battles;
caap['CheckResults_guild_current_monster_battles'] = caap.CheckResults_guild_current_monster_battles;
caap['CheckResults_guild_battle_monster'] = caap.CheckResults_guild_battle_monster;
caap['AutoElite'] = caap.AutoElite;
caap['Heal'] = caap.Heal;
caap['ImmediateBanking'] = caap.ImmediateBanking;
caap['ImmediateAutoStat'] = caap.ImmediateAutoStat;
caap['MaxEnergyQuest'] = caap.MaxEnergyQuest;
caap['MonsterReview'] = caap.MonsterReview;
caap['GuildMonsterReview'] = caap.GuildMonsterReview;
caap['GuildMonster'] = caap.GuildMonster;
caap['DemiPoints'] = caap.DemiPoints;
caap['Monsters'] = caap.Monsters;
caap['Battle'] = caap.Battle;
caap['Quests'] = caap.Quests;
caap['Bank'] = caap.Bank;
caap['PassiveGeneral'] = caap.PassiveGeneral;
caap['Lands'] = caap.Lands;
caap['AutoBless'] = caap.AutoBless;
caap['AutoStat'] = caap.AutoStat;
caap['AutoGift'] = caap.AutoGift;
caap['AutoPotions'] = caap.AutoPotions;
caap['AutoAlchemy'] = caap.AutoAlchemy;
caap['Idle'] = caap.Idle;
caap['AutoIncome'] = caap.AutoIncome;
/*jslint sub: false */

//////////////////////////////////
//       Functions
//////////////////////////////////

function caap_log(msg) {
    if (typeof console.log !== undefined) {
        console.log(caapVersion + (devVersion ? 'd' + devVersion : '') + ' |' + (new Date()).toLocaleTimeString() + '| ' + msg);
    }
}

function injectScript(url) {
    var inject = document.createElement('script');
    inject.setAttribute('type', 'text/javascript');
    inject.setAttribute('src', url);
    document.head.appendChild(inject);
}

function caap_DomTimeOut() {
    caap_log("DOM onload timeout!!! Reloading ...");
    if (typeof window.location.reload === 'function') {
        window.location.reload();
    } else if (typeof history.go === 'function') {
        history.go(0);
    } else {
        window.location.href = window.location.href;
    }
}

function caap_WaitForutility() {
    if (typeof utility !== 'undefined') {
        caap_log("utility ready ...");
        caap_log(typeof utility);
        $u.set_log_version(caapVersion + (devVersion ? 'd' + devVersion : ''));
        $u.jQueryExtend();
        gm = new $u.storage({'namespace': 'caap'});
        ss = new $u.storage({'namespace': 'caap', 'storage_type': 'sessionStorage'});
        jQuery(caap.start());
    } else {
        caap_log("Waiting for utility ...");
        caap_log(typeof utility);
        window.setTimeout(caap_WaitForutility, 100);
    }
}

function caap_WaitForrison() {
    if (typeof rison !== 'undefined') {
        caap_log("rison ready ...");
        if (typeof utility === 'undefined') {
            caap_log("Inject utility.");
            injectScript('http://castle-age-auto-player.googlecode.com/files/$u.min.js?' + new Date().getTime());
        }

        caap_WaitForutility();
    } else {
        caap_log("Waiting for rison ...");
        window.setTimeout(caap_WaitForrison, 100);
    }
}

function caap_WaitForjsonhpack() {
    if (typeof JSON.hpack === 'function') {
        caap_log("json.hpack ready ...");
        if (typeof rison === 'undefined') {
            caap_log("Inject rison.");
            injectScript('http://castle-age-auto-player.googlecode.com/files/rison.js');
        }

        caap_WaitForrison();
    } else {
        caap_log("Waiting for json.hpack ...");
        window.setTimeout(caap_WaitForjsonhpack, 100);
    }
}

function caap_WaitForjson2() {
    if (typeof JSON.stringify === 'function') {
        caap_log("json2 ready ...");
        if (typeof JSON.hpack !== 'function') {
            caap_log("Inject json.hpack.");
            injectScript('http://castle-age-auto-player.googlecode.com/files/json.hpack.min.js');
        }

        caap_WaitForjsonhpack();
    } else {
        caap_log("Waiting for json2 ...");
        window.setTimeout(caap_WaitForjson2, 100);
    }
}

function caap_WaitForFarbtastic() {
    if (typeof jQuery.farbtastic === 'function') {
        caap_log("farbtastic ready ...");
        if (typeof JSON.stringify !== 'function') {
            caap_log("Inject json2.");
            injectScript('http://castle-age-auto-player.googlecode.com/files/json2.js');
        }

        caap_WaitForjson2();
    } else {
        caap_log("Waiting for farbtastic ...");
        window.setTimeout(caap_WaitForFarbtastic, 100);
    }
}

function caap_WaitForjQueryUI() {
    if (typeof jQuery.ui === 'object') {
        caap_log("jQueryUI ready ...");
        if (typeof jQuery.farbtastic !== 'function') {
            caap_log("Inject farbtastic.");
            injectScript('http://castle-age-auto-player.googlecode.com/files/farbtastic.min.js');
        }

        caap_WaitForFarbtastic();
    } else {
        caap_log("Waiting for jQueryUI ...");
        window.setTimeout(caap_WaitForjQueryUI, 100);
    }
}

function caap_WaitForjQuery() {
    if (typeof window.jQuery === 'function') {
        caap_log("jQuery ready ...");
        $j = jQuery.noConflict();
        if (typeof $j.ui !== 'object') {
            caap_log("Inject jQueryUI.");
            injectScript('http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.6/jquery-ui.min.js');
        }

        caap_WaitForjQueryUI();
    } else {
        caap_log("Waiting for jQuery ...");
        window.setTimeout(caap_WaitForjQuery, 100);
    }
}

/////////////////////////////////////////////////////////////////////
//                         Begin
/////////////////////////////////////////////////////////////////////

caap_log("Starting ... waiting page load");
caap_timeout = window.setTimeout(caap_DomTimeOut, 180000);
if (typeof window.jQuery !== 'function') {
    caap_log("Inject jQuery");
    injectScript('http://ajax.googleapis.com/ajax/libs/jquery/1.4.4/jquery.min.js');
}

caap_WaitForjQuery();

// ENDOFSCRIPT
