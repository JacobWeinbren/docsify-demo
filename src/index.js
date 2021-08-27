import $ from "jquery/dist/jquery.slim.js";
import "./style.scss";
import * as clipboard from "clipboard-polyfill/text";

function copy(text) {
    clipboard.writeText(text);
}

//Adding in icons
import { library, dom } from "@fortawesome/fontawesome-svg-core";
import {
    faGripLinesVertical,
    faAngleDown,
    faAngleUp,
} from "@fortawesome/free-solid-svg-icons";
library.add(faGripLinesVertical, faAngleDown, faAngleUp);
dom.watch();

export function docsifyDemo(hook, vm) {
    var count = 0;

    hook.afterEach(function (html, next) {
        var doc = $("<div/>").html(html);

        //Scans page and adds demo tags
        $(doc)
            .find("pre")
            .each(function () {
                var codeId = "demo_code_" + count;
                var copy_button = `<button type="button" class="demo-copy-code-button" aria-controls="${codeId}">Copy</button>`;

                //Adds in demo preview
                if ($(this).attr("data-lang") == "html preview") {
                    var data = $(this).text();

                    var content = $(this)[0].outerHTML;
                    var toggleId = "demo_toggle_" + count;
                    var previewId = "demo_preview_" + count;
                    var lang = $(this)
                        .attr("data-lang")
                        .replace(" preview", "");

                    var content = $(this)
                        .attr("data-lang", lang)
                        .attr("aria-labelledby", toggleId)
                        .append(copy_button)[0].outerHTML;

                    var demo = `
                        <div class="demo">
                            <div class="demo_preview">
                                <div class="demo_preview_content" id="${previewId}">
                                    ${data}
                                </div>
                                <div class="demo_resize" aria-controls="${previewId}" role="slider" tabindex="0">
                                    <i class="fas fa-grip-lines-vertical"></i>
                                </div>
                            </div>
                            
                            <div 
                                class="demo_code" 
                                id="${codeId}" 
                                style="display: none;">
                                ${content}
                            </div>
                            
                            <div class="demo_button">
                            <button type="button" class="demo_button demo_toggle" id="${toggleId}" aria-expanded="false" aria-controls="${codeId}">
                                View Source
                                <i class="fas fa-angle-down"></i>
                            </button>
                            </div>
                        </div>
                    `;

                    $(this).replaceWith(demo);
                } else {
                    $(this).attr("id", codeId).append(copy_button);
                }

                //Updates id count
                count++;
            });

        next($(doc).html());
    });

    hook.doneEach(function () {
        //Allows for dragging on component preview
        var dragging;
        var dragging_pos;
        var controls;

        $(document)
            .mousedown(function (e) {
                if ($(e.target).closest(".demo_resize").length != 0) {
                    dragging = true;
                }

                dragging_pos = e.pageX;
                controls = $(e.target).attr("aria-controls");
                e.preventDefault();
            })
            .mousemove(function (ex) {
                if (dragging) {
                    if (ex.pageX != dragging_pos) {
                        var sized_element = $("#" + controls).parent();
                        var change = ex.pageX - dragging_pos;
                        var new_width =
                            parseInt($(sized_element).css("width"), 10) +
                            change;
                        $(sized_element).css("width", new_width);
                        dragging_pos = ex.pageX;
                    }
                }
            })
            .mouseup(function () {
                dragging = false;
            })
            .mouseleave(function () {
                dragging = false;
            });

        //When you click on the button, it retracts or reveals the code source
        $(".demo_toggle").click(function () {
            if ($(this).attr("aria-expanded") == "false") {
                $(this).attr("aria-expanded", "true");
                $(this).html('Hide Source<i class="fas fa-angle-up"></i>');
            } else {
                $(this).attr("aria-expanded", "false");
                $(this).html('View Source<i class="fas fa-angle-down"></i>');
            }
            $("#" + $(this).attr("aria-controls")).toggle();
        });

        //When you click the copy button, it plays an animation and copies the code
        $(".demo-copy-code-button").click(function () {
            copy($(this).parent().find("code").text());

            $(this)
                .addClass("copied")
                .one(
                    "animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd",
                    function () {
                        $(this).removeClass("copied");
                    }
                );
        });
    });
}

//Adds plugin
if (!window.$docsify) {
    throw new Error("Docsify is not loaded");
} else {
    window.$docsify.plugins = [].concat(
        docsifyDemo,
        window.$docsify.plugins || []
    );
}
