"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = findElementsWithClassName;
// Function to recursively return elements with the index `className`
function findElementsWithClassName(element) {
    let classNameList = [];
    if (element.class && element.name) {
        classNameList.push(element);
    }
    if (element.elements) {
        for (const childElement of element.elements) {
            const elements = findElementsWithClassName(childElement);
            for (const elem of elements) {
                classNameList.push(elem);
            }
        }
    }
    return classNameList;
}
//# sourceMappingURL=listClasses.js.map