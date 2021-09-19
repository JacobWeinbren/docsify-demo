import "./style.scss";
import * as clipboard from "clipboard-polyfill/text";

function copy(text) {
    clipboard.writeText(text);
}

//https://icons.getbootstrap.com/icons/caret-down-fill/
const CaretDown = `
    <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-down-fill" viewBox="0 0 16 16">
        <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>
    </svg>
`;

//https://icons.getbootstrap.com/icons/caret-up-fill/
const CaretUp = `
    <svg aria-hidden="true"xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-up-fill" viewBox="0 0 16 16">
        <path d="m7.247 4.86-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z"/>
    </svg>
`;

//https://icons.getbootstrap.com/icons/grip-vertical/
const GripVertical = `
    <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-grip-vertical" viewBox="0 0 16 16">
        <path d="M7 2a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 5a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
    </svg>
`;

export function docsifyDemo(hook, vm) {
    var count = 0;

    hook.afterEach(function (html, next) {
        var parser = new DOMParser();
        var doc = parser.parseFromString(html, "text/html");

        //Scans page and adds demo tags
        var pre_list = doc.querySelectorAll("pre");
        var pre_array = [...pre_list];

        pre_array.forEach((element) => {
            //Handles Copy Button
            var codeId = "demo_code_" + count;
            var copy_button = document.createElement("div");
            copy_button.innerHTML =
                `<button type="button" class="demo-copy-code-button" aria-controls="${codeId}">Copy</button>`.trim();
            copy_button = copy_button.firstChild;

            //Adds in demo preview
            if (element.getAttribute("data-lang") == "html preview") {
                var data = element.innerText;

                var content = element.outerHTML;
                var toggleId = "demo_toggle_" + count;
                var previewId = "demo_preview_" + count;

                //Replaces language
                var lang = element
                    .getAttribute("data-lang")
                    .replace(" preview", "");

                var content = element.cloneNode(true);
                content.setAttribute("data-lang", lang);
                content.setAttribute("aria-labelledby", toggleId);
                content.append(copy_button);

                //Creates demo
                var demo = document.createElement("div");
                demo.innerHTML = `
                        <div class="demo">
                            <div class="demo_preview">
                                <div class="demo_preview_content" id="${previewId}">
                                    ${data}
                                </div>
                                <div class="demo_resize" aria-controls="${previewId}" role="slider" tabindex="0">
                                    ${GripVertical}
                                </div>
                            </div>
                            
                            <div 
                                class="demo_code" 
                                id="${codeId}" 
                                style="display: none;">
                                ${content.outerHTML}
                            </div>
                            
                            <div class="demo_button">
                            <button type="button" class="demo_button demo_toggle" id="${toggleId}" aria-expanded="false" aria-controls="${codeId}">
                                View Source
                                ${CaretDown}
                            </button>
                            </div>
                        </div>
                    `.trim();
                demo = demo.firstChild;

                element.replaceWith(demo);
            } else {
                //If outside demo
                element.id = codeId;
                element.append(copy_button);
            }

            //Updates id count
            count++;
        });

        next(doc.body.innerHTML);
    });

    hook.doneEach(function () {
        //Allows for dragging on component preview
        var dragging;
        var dragging_pos;
        var controls;

        document.addEventListener("mousedown", (e) => {
            var element = e.target;
            if (element.className == "demo_resize") {
                dragging = true;
            }
            if (element.className.baseVal == "bi bi-grip-vertical") {
                element = element.parentElement;
                dragging = true;
            }
            dragging_pos = e.pageX;
            controls = element.getAttribute("aria-controls");
        });

        document.addEventListener("mousemove", (e) => {
            if (dragging) {
                if (e.pageX != dragging_pos) {
                    var element =
                        document.getElementById(controls).parentElement;
                    var change = e.pageX - dragging_pos;
                    var new_width = element.offsetWidth + change;
                    element.style.width = new_width + "px";
                    dragging_pos = e.pageX;
                }
            }
        });

        document.addEventListener("mouseup", (e) => {
            dragging = false;
        });

        document.addEventListener("mouseleave", (e) => {
            dragging = false;
        });

        //When you click on the button, it retracts or reveals the code source
        const demo_toggle_list = document.querySelectorAll(".demo_toggle");
        const demo_toggle_array = [...demo_toggle_list];

        demo_toggle_array.forEach((element) => {
            element.addEventListener("click", (e) => {
                if (element.getAttribute("aria-expanded") == "false") {
                    element.setAttribute("aria-expanded", "true");
                    element.innerHTML = `Hide Source${CaretUp}`;
                } else {
                    element.setAttribute("aria-expanded", "false");
                    element.innerHTML = `View Source${CaretDown}`;
                }

                var code_id = element.getAttribute("aria-controls");
                var code_element = document.getElementById(code_id);
                code_element.style.display =
                    code_element.style.display == "none" ? "block" : "none";
            });
        });

        //When you click the copy button, it plays an animation and copies the code
        const copy_button_list = document.querySelectorAll(
            ".demo-copy-code-button"
        );
        var copy_button_array = [...copy_button_list];

        copy_button_array.forEach((element) => {
            element.addEventListener("click", (e) => {
                copy(element.parentElement.querySelector("code").innerText);

                element.className += " copied";

                //Browser support
                function removeClass() {
                    element.className = "demo-copy-code-button";
                    element.removeEventListener(
                        "webkitAnimationEnd",
                        removeClass
                    );
                    element.removeEventListener("oAnimationEnd", removeClass);
                    element.removeEventListener("MSAnimationEnd", removeClass);
                    element.removeEventListener("animationend", removeClass);
                }

                element.addEventListener(
                    "webkitAnimationEnd",
                    removeClass,
                    false
                );
                element.addEventListener("oAnimationEnd", removeClass, false);
                element.addEventListener("MSAnimationEnd", removeClass, false);
                element.addEventListener("animationend", removeClass, false);
            });
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
